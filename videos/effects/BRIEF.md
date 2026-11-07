---
workflow: general-video
flow: companion
storyboard: yes
message: "Deja de pelear con effect + untracked — signalMethod (NgRx Signals) es la forma limpia, tipada e inyectable."
destination: tiktok
aspect: 1080x1920
language: es
length: 63s
angle: full-screen-cutaway-cards
---

## Intent

Package `assets/effects.mp4` (talking-head, 9:16, ~63s) with **full-screen concept cards**
(no face overlays) synced to `captions.srt`, teaching NgRx `signalMethod` with before/after
code from `example.md` and the NgRx logo.

## Assets

- Footage: `assets/effects.mp4`
- Captions: `captions.srt`
- Code source: `example.md` (aligned to https://ngrx.io/guide/signals/signal-method)
- Logo: `assets/ngrx-logo.svg`
- Design: `frame.md` (nicobytes)

## Customizations

- Ratio: 9:16 (1080×1920)
- Layout: **cutaway cards** — opaque full-bleed graphics alternating with talking-head; audio continuous
- Code cards: “después” on Flexible inputs; Antes↔Después on Implicit untracked
- On-screen ASR fixes: signalMethod · untracked · NgRx Signals

## Notes

- Project root: `videos/effects/`
- Plan: `STORYBOARD.md` (7 frames) — **assembled** in `index.html` (cutaway cards + captions)
- Rebuild: `node scripts/build-captions.mjs && node scripts/assemble.mjs`
- Preview: `pnpm run effects:dev` / `pnpm exec hyperframes preview --background`
