"""Paper textures for the paper-cut look, generated once with a fixed seed.

uv run python videos/context-compaction/scripts/make-textures.py

Writes assets/textures/cardboard.png (1080x1920, purple card stock with fibres)
and assets/textures/paper.png (1024x1024 tile, off-white paper with tooth).
"""

import pathlib
import subprocess

import numpy as np
from scipy.ndimage import gaussian_filter, zoom

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "textures"
OUT.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(20261022)


def value_noise(h, w, cell):
    grid = rng.standard_normal((h // cell + 3, w // cell + 3))
    up = zoom(grid, cell, order=3)
    return up[:h, :w]


def fibres(h, w, count, length, width):
    canvas = np.zeros((h, w), np.float32)
    for _ in range(count):
        x, y = rng.uniform(0, w), rng.uniform(0, h)
        ang = rng.uniform(0, np.pi)
        ln = rng.uniform(length * 0.4, length)
        sign = 1 if rng.random() < 0.55 else -1
        n = int(ln)
        xs = (x + np.cos(ang) * np.arange(n)).astype(int)
        ys = (y + np.sin(ang) * np.arange(n) + np.sin(np.arange(n) / 6) * 1.5).astype(int)
        ok = (xs >= 0) & (xs < w) & (ys >= 0) & (ys < h)
        canvas[ys[ok], xs[ok]] += sign * rng.uniform(0.4, 1.0)
    return gaussian_filter(canvas, width)


def write_png(rgb, path):
    h, w, _ = rgb.shape
    data = np.clip(rgb, 0, 255).astype(np.uint8).tobytes()
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24",
         "-s", f"{w}x{h}", "-i", "-", "-frames:v", "1", str(path)],
        input=data, check=True,
    )


# Purple card stock: flat colour, soft mottling, grain and fibres. No gradient.
H, W = 1920, 1080
base = np.array([73, 58, 128], np.float32)  # #493A80, sampled from the reference
mottle = value_noise(H, W, 160) * 0.035 + value_noise(H, W, 40) * 0.02
grain = gaussian_filter(rng.standard_normal((H, W)), 0.6) * 0.045
fib = fibres(H, W, 2600, 70, 0.7) * 0.16
lum = 1 + mottle + grain + fib
card = base[None, None, :] * lum[..., None]
write_png(card, OUT / "cardboard.png")

# Off-white paper tile: tooth and faint fibres, tileable enough at 1024.
T = 1024
paper_base = np.array([246, 242, 232], np.float32)  # #F6F2E8
tooth = gaussian_filter(rng.standard_normal((T, T)), 0.8) * 0.018
pfib = fibres(T, T, 900, 50, 0.6) * 0.05
plum = 1 + tooth + pfib + value_noise(T, T, 128) * 0.008
write_png(paper_base[None, None, :] * plum[..., None], OUT / "paper.png")

print("wrote", OUT / "cardboard.png", OUT / "paper.png")
