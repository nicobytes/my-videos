---
workflow: talking-head-recut
flow: companion
storyboard: yes
message: "Tu agente de WhatsApp atiende cuando nadie más lo hace — madrugada y picos fuera de horario."
destination: tiktok
aspect: 1080x1920
language: es
length: 35s
angle: talking-head-overlays
---

## Intent

Package `officehours.mp4` (talking-head, untouched) with transcript-synced
graphic overlay cards — nicobytes `frame.md` tokens — featuring a **vertical HTML
bar chart** (“Mensajes por hora del día”) rebuilt for TikTok (not the landscape PNG).

## Assets

- Footage: `officehours.mp4`
- Captions: `captions.srt` (from `cpations.srt`)
- Chart ref: `assets/storyboard/chart-mensajes-por-hora-ref.png` → rebuild as live HTML `C-chart`
- Design: `frame.md` (nicobytes)

## Customizations

- Ratio: 9:16 (1080×1920)
- Layout: overlay / chart-dominant mid frames
- Chart: horizontal bars or segmented vertical reveal; emerald = hábil, cyan = fuera
- Peak callout: 208 @ 18h

## Notes

- Project root: `videos/office_hours/`
- Plan: `STORYBOARD.md` (5 frames) — awaiting board approval before build
