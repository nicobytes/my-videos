"""Build the edit decision list (EDL) for the three synced recordings.

Speech is found on the mic track itself (10 ms RMS), not on the transcript
timestamps, which drift. Pauses longer than MAX_GAP shrink to KEEP_PAD on
each side; FORCE_CUT removes stretches by hand (dead navigation, a lost
train of thought). Every boundary snaps to the 30 fps frame grid so the
video and audio cuts stay the same length.

Usage (from the video folder):
  uv run --project ../.. python scripts/build-edl.py > edl.json
"""

import json
import subprocess
import sys

import numpy as np

FPS = 30
SRC = "assets/mic.m4a"
VOICE_DB = -27.0  # frame counts as voiced above this
BRIDGE = 0.2  # dips shorter than this inside speech are part of it
MIN_ISLAND = 0.2  # isolated bursts shorter than this are clicks, not speech
DILATE = 0.12  # padding around each voiced stretch
MAX_GAP = 0.35  # pauses longer than this get shortened
KEEP_PAD = 0.12  # pause kept on each side of a cut

# Source seconds removed by hand, with the reason.
FORCE_CUT = [
    (106.9, 145.6, "silencio: navega a Organización"),
    (587.5, 620.0, "silencio: abre la app móvil en DevTools"),
    (1014.4, 1028.0, "busca el ítem pendiente en voz alta"),
    # Repeticiones (tiempos de palabra re-transcritos en ventanas cortas).
    (41.98, 44.2, "repite «ya no debería pasar»"),
    (348.1, 352.75, "espera hablada a que cargue el evento"),
    (422.62, 449.3, "segunda vuelta sobre crear citas desde Google Calendar"),
    (741.9, 760.55, "adelanta los templates; lo vuelve a decir en el ejemplo"),
    (942.9, 957.5, "repite cómo ampliar el límite de días"),
]
SNAP_WINDOW = 0.12  # each hand cut moves to the quietest 10 ms within this

pcm = subprocess.run(
    ["ffmpeg", "-v", "error", "-i", SRC, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"],
    check=True, capture_output=True,
).stdout
a = np.frombuffer(pcm, dtype=np.int16).astype(np.float32) / 32768
hop = 160
n = len(a) // hop
db = 20 * np.log10(np.sqrt((a[: n * hop].reshape(n, hop) ** 2).mean(1)) + 1e-9)
total = len(a) / 16000

voiced = db > VOICE_DB


def runs(mask):
    edges = np.diff(np.concatenate([[0], mask.astype(np.int8), [0]]))
    return list(zip(np.where(edges == 1)[0], np.where(edges == -1)[0]))


# Speech arrives as syllable bursts: bridge the dips between them first, so
# only truly isolated bursts (clicks) fall under MIN_ISLAND.
bridged = voiced.copy()
prev_end = None
for s, e in runs(voiced):
    if prev_end is not None and (s - prev_end) / 100 <= BRIDGE:
        bridged[prev_end:s] = True
    prev_end = e
islands = [(s / 100, e / 100) for s, e in runs(bridged) if (e - s) / 100 >= MIN_ISLAND]
segs = []
for s, e in islands:
    s, e = max(0.0, s - DILATE), min(total, e + DILATE)
    if segs and s - segs[-1][1] <= MAX_GAP:
        segs[-1][1] = e
    else:
        segs.append([s, e])

# Shorten every remaining pause to KEEP_PAD per side.
keep = []
for s, e in segs:
    s, e = max(0.0, s - KEEP_PAD), min(total, e + KEEP_PAD)
    if keep and s <= keep[-1][1]:
        keep[-1][1] = e
    else:
        keep.append([s, e])

def quietest(t):
    lo, hi = int((t - SNAP_WINDOW) * 100), int((t + SNAP_WINDOW) * 100)
    return (lo + int(np.argmin(db[lo:hi]))) / 100


# Apply the hand cuts.
for cs, ce, _ in FORCE_CUT:
    cs, ce = quietest(cs), quietest(ce)
    out = []
    for s, e in keep:
        if e <= cs or s >= ce:
            out.append([s, e])
            continue
        if s < cs:
            out.append([s, cs])
        if e > ce:
            out.append([ce, e])
    keep = out


def snap(t):
    return round(t * FPS) / FPS


edl, t_out = [], 0.0
for s, e in keep:
    s, e = snap(s), snap(e)
    if e - s < 2 / FPS:
        continue
    edl.append({"src": [round(s, 4), round(e, 4)], "out": [round(t_out, 4), round(t_out + e - s, 4)]})
    t_out += e - s

json.dump(
    {"fps": FPS, "source_duration": round(total, 3), "duration": round(t_out, 4),
     "force_cut": FORCE_CUT, "segments": edl},
    sys.stdout, ensure_ascii=False, indent=1,
)
print(f"{len(edl)} segments, {t_out:.1f}s from {total:.1f}s", file=sys.stderr)
