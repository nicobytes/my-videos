"""Cut the three recordings with edl.json into assets/cut/.

display.mp4  60 fps H.264 -> 30 fps, keyframe every second (seek-safe)
webcam.mp4   HEVC (headless Chrome can't decode it) -> H.264, same grid, capped at 8 Mbps
mic.m4a      each segment gets 8 ms fades so the joins don't click;
             loudness to -16 LUFS, true peak under -2.5 dBTP (room for the music)

Usage (from the video folder):
  uv run --project ../.. python scripts/cut-media.py [display|webcam|mic|music ...]

music.m4a    the MusicGen bed trimmed to the film, at -30 LUFS (only when asked:
             `cut-media.py music`)
"""

import json
import os
import subprocess
import sys
import tempfile

edl = json.load(open("edl.json"))
segs = [s["src"] for s in edl["segments"]]
fps = edl["fps"]
os.makedirs("assets/cut", exist_ok=True)
which = sys.argv[1:] or ["mic", "webcam", "display"]
MUSIC_SRC = "assets/music/bed-full.wav"  # MusicGen bed, see BRIEF.md


def run_graph(graph, args):
    with tempfile.NamedTemporaryFile("w", suffix=".txt", delete=False) as f:
        f.write(graph)
    try:
        subprocess.run(["ffmpeg", "-v", "error", "-y", *args[:2], "-filter_complex_script", f.name, *args[2:]], check=True)
    finally:
        os.unlink(f.name)


def video(src, dst, prefilter, rate=()):
    # One select over the whole file: frames inside any kept range, re-timed.
    # The half-frame offset keeps each range exactly [start, end) on the grid.
    half = 0.5 / fps
    expr = "+".join(f"between(t,{s - half:.4f},{e - half:.4f})" for s, e in segs)
    graph = f"[0:v]{prefilter}fps={fps},select='{expr}',setpts=N/({fps}*TB)[v]"
    run_graph(graph, ["-i", src, "-map", "[v]", "-an", "-c:v", "libx264", "-preset", "medium",
                      "-crf", "20", *rate, "-pix_fmt", "yuv420p", "-g", str(fps), "-movflags", "+faststart", dst])


def mic(src, dst):
    parts, labels = [], []
    for i, (s, e) in enumerate(segs):
        d = e - s
        parts.append(f"[0:a]atrim={s:.4f}:{e:.4f},asetpts=PTS-STARTPTS,"
                     f"afade=t=in:d=0.008,afade=t=out:st={max(0, d - 0.008):.4f}:d=0.008[a{i}]")
        labels.append(f"[a{i}]")
    graph = ";\n".join(parts) + ";\n" + "".join(labels) + f"concat=n={len(segs)}:v=0:a=1,loudnorm=I=-16:TP=-2.5:LRA=11,aresample=48000[a]"
    run_graph(graph, ["-i", src, "-map", "[a]", "-c:a", "aac", "-b:a", "192k", dst])


def music(src, dst):
    # The bed sits ~14 dB under the voice (-16 LUFS), trimmed to the film.
    graph = (f"[0:a]atrim=0:{edl['duration']:.4f},asetpts=PTS-STARTPTS,"
             "loudnorm=I=-30:TP=-9:LRA=11,aresample=48000[a]")
    run_graph(graph, ["-i", src, "-map", "[a]", "-c:a", "aac", "-b:a", "160k", dst])


if "music" in which:
    music(MUSIC_SRC, "assets/cut/music.m4a")
if "mic" in which:
    mic("assets/mic.m4a", "assets/cut/mic.m4a")
if "webcam" in which:
    # Webcam noise blows crf 20 up to ~37 Mbps, too much for real-time preview
    # playback (the camera drops out): cap it.
    video("assets/webcam.mp4", "assets/cut/webcam.mp4", "", ("-maxrate", "8M", "-bufsize", "16M"))
if "display" in which:
    video("assets/display.mp4", "assets/cut/display.mp4", "")
