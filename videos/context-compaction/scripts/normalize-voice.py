"""Two-pass loudness normalisation of the voice tracks (ffmpeg loudnorm, linear).

uv run python videos/context-compaction/scripts/normalize-voice.py

The raw voices measure about -23.5 LUFS; social wants the mix near -15. Each
voice is brought to -15 LUFS with its true peak held at -1.5 dBTP, so the
composition can play them at volume 1 without clipping.
"""

import json
import pathlib
import re
import subprocess
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
TARGET = "I=-15:TP=-1.5:LRA=11"


def measure(src):
    out = subprocess.run(
        ["ffmpeg", "-hide_banner", "-i", str(src), "-af", f"loudnorm={TARGET}:print_format=json", "-f", "null", "-"],
        capture_output=True, text=True, check=True,
    ).stderr
    return json.loads(re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", out, re.S).group(0))


def normalize(src, dst):
    m = measure(src)
    flt = (
        f"loudnorm={TARGET}:measured_I={m['input_i']}:measured_TP={m['input_tp']}"
        f":measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}"
        f":offset={m['target_offset']}:linear=true"
    )
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-vn", "-af", flt, "-ar", "48000", str(dst)], check=True)
    after = measure(dst)
    print(f"{dst.relative_to(ROOT)}: {m['input_i']} → {after['input_i']} LUFS, TP {after['input_tp']} dBTP")


normalize(ROOT / "assets/vo/voiceover.mp3", ROOT / "assets/vo/voiceover-norm.wav")
with tempfile.TemporaryDirectory() as tmp:
    raw = pathlib.Path(tmp) / "intro.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(ROOT / "assets/footage/intro.mp4"), "-vn", "-ac", "2", "-ar", "48000", str(raw)], check=True)
    normalize(raw, ROOT / "assets/footage/intro-voice.wav")
