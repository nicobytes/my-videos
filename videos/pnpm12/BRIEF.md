---
workflow: talking-head-recut
flow: automation
storyboard: yes
message: "Con pnpm 12 reemplazás nvm y npm: una sola herramienta para Node y dependencias."
destination: tiktok
aspect: 1080x1920
language: es
length: 58s
angle: talking-head-overlays
---

## Intent

Package `pnpm12.mp4` (talking-head, untouched) with transcript-synced
graphic overlay cards — terminal/clinical glass overlays on full-bleed
video (9:16). Captions corrected on-screen (pnpm / Rust / Node).

## Assets

- Footage: `pnpm12.mp4` (also staged as `input-video.mp4` for the composition)
- Captions: `captions.srt` (ASR substitute — whisper unavailable)
- Logos / screens: `assets/storyboard/*` (copied into `assets/` for the composition)

## Customizations

- Ratio: 9:16 (1080×1920) — matches source
- Layout: overlay (video full-bleed, glass cards)
- Style: terminal (clinical group)
- Frame: clean
- Card count: auto ≈ 8
- Theme: noir / terminal tokens

## Notes

- This folder (`videos/pnpm12/`) is the HyperFrames project root — run `pnpm run check` / `preview` / `render` here.
- `STORYBOARD.md` is the narrative plan; `storyboard.json` is the v3 card outline.