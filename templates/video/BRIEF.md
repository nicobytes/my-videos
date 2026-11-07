---
# Brief canónico de HyperFrames. Úsalo solo si quieres saltarte la entrevista de
# /hyperframes: cópialo a videos/<slug>/BRIEF.md y llena TODAS las claves.
# Un BRIEF.md a medias es peor que ninguno: el router lo toma como confirmado y
# deja de preguntar. Si no lo vas a llenar completo, no lo copies.
workflow: general-video     # el que ejecuta: general-video (siempre si flow es companion), product-launch-video, faceless-explainer, motion-graphics, talking-head-recut, embedded-captions, music-to-video, pr-to-video, slideshow
flow: companion             # companion (lo construimos juntos) | automation (el pipeline lo hace todo)
storyboard: yes             # yes (plan y bocetos revisados antes de construir) | no
message: "La única idea que el video debe dejar"
destination: reels-tiktok   # reels-tiktok | x-feed | youtube
aspect: 1080x1920           # reels-tiktok → 1080x1920 · feed → 1080x1080 · youtube → 1920x1080
language: es
audience: "Quién lo ve"
length: 45s
angle: narrative            # según el workflow: narrative, concept, how-to, listicle…
---

## Intent

Logline: qué debe sentir o entender el espectador al final. Tono, en tus palabras.

## Assets

- assets/ruta/archivo — qué es y dónde va en el video.

## Customizations

- Referencias: qué tomar (ritmo, tipo, transiciones, cámara) y qué NO tomar (contenido, logos, personajes).
- Formatos extra: cada uno se reencuadra; no se recorta un 16:9 a vertical.
- Si hay pista musical: medirla con scripts/beats.py y anclar los cambios a los beats.
- Valores por defecto de CLAUDE.md que este video anula (o ninguno).

## Notes

- Beats: un cambio visible cada 2-4 s.
- Entregables: renders/<slug>.mp4, portada, hoja de contacto.
