"""White sticker border around a cutout, from its alpha matte.

uv run python videos/context-compaction/scripts/make-sticker.py <in.png> <out.png> [border_px]
"""
import subprocess, sys
import numpy as np
from scipy.ndimage import binary_dilation, gaussian_filter

src, dst = sys.argv[1], sys.argv[2]
border = int(sys.argv[3]) if len(sys.argv) > 3 else 16
probe = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", src], capture_output=True, text=True, check=True)
w, h = map(int, probe.stdout.strip().split(","))
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-f", "rawvideo", "-pix_fmt", "rgba", "-"], capture_output=True, check=True).stdout
img = np.frombuffer(raw, np.uint8).reshape(h, w, 4).astype(np.float32)
alpha = img[..., 3] / 255.0
solid = alpha > 0.5
yy, xx = np.ogrid[-border:border + 1, -border:border + 1]
disk = xx * xx + yy * yy <= border * border
outline = binary_dilation(solid, structure=disk)
# Soften the outer edge by a pixel so the die-cut does not alias.
outline_a = np.clip(gaussian_filter(outline.astype(np.float32), 0.8) * 1.4, 0, 1)
out = np.zeros_like(img)
out[..., :3] = 255.0
out[..., 3] = outline_a * 255.0
# Composite the subject over the white sticker.
a = alpha[..., None]
out[..., :3] = img[..., :3] * a + out[..., :3] * (1 - a)
out[..., 3] = np.maximum(out[..., 3], alpha * 255.0)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgba", "-s", f"{w}x{h}", "-i", "-", "-frames:v", "1", dst], input=np.clip(out, 0, 255).astype(np.uint8).tobytes(), check=True)
print("wrote", dst)
