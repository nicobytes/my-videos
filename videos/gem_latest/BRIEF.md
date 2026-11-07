---
workflow: talking-head-recut
flow: companion
storyboard: yes
message: "gemini-flash-latest: un placeholder que trae el Flash de frontera sin redeploy."
destination: tiktok
aspect: 1080x1920
language: es
length: 47s
angle: talking-head-fullscreen-cards
---

## Intent

Package `latest.mp4` (talking-head, untouched audio) with transcript-synced
**full-screen opaque graphic cards** — nicobytes `frame.md` tokens — featuring a
**before/after code reveal** of the `gemini-flash-latest` alias, ADK logo lockup,
and kinetic captions. Cards occupy 100% of the canvas (not glass overlays);
footage fades back between beats as the transition.

## Assets

- Footage: `latest.mp4` → `input-video.mp4` (1080×1920, 47.0s @ 30fps)
- Captions: `captions.srt` (from `assets/cpations.srt`, ASR cleaned)
- Code: `assets/code.md` → live HTML `C-code-before` / `C-code-after`
- Logo: `assets/logos/adk-logo.png` (ADK — Agent Development Kit)
- Design: `frame.md` (nicobytes)

## Customizations

- Ratio: 9:16 (1080×1920) — matches source
- Layout: fullscreen cards (opaque 100% canvas) + video breaths between beats
- Style: clinical / terminal code-cell (nicobytes `code-cell` + voltage once)
- Peak beat: `model="gemini-flash-latest"` after the pinned ID
- CTA: WhatsApp agents / plataforma

## Notes

- Project root: `videos/gem_latest/`
- Plan: `STORYBOARD.md` (6 frames) — approved; building with fullscreen cards
