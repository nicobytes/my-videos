---
workflow: general-video
flow: companion
storyboard: yes
message: "ReAct (Reasoning + Acting) es un loop: el agente razona, usa tools, observa, y repite hasta resolver — con límites y salida al humano si hace falta."
destination: tiktok
aspect: 1080x1920
language: es
length: 97s
angle: full-screen-cutaway-cards
audience: builders / devs que empiezan con agentes
---

## Intent

Empaquetar `assets/tiktok.mp4` (talking-head 9:16, ~96.5s) con **cards a pantalla completa**
(sin overlays sobre la cara) sincronizadas a `captions.srt`, enseñando el patrón **ReAct**
(Reasoning and Acting) con diagramas animados derivados de:

1. Arquitectura pastel Query → Thinking ⇄ Tool → Answer (`assets/storyboard/react-architecture-pastel.jpg`)
2. Grafo tipo agent `__start__` → `llm` ⇄ `tools` → `__end__` (`assets/storyboard/react-graph-llm-tools.jpg`)

La animación de referencia conceptual vive en `storyboard_animaci_n_de_arquitectura_react.md`;
este brief la **re-tima al VO real** (no al VO inventado de ese doc).

## Assets

- Footage: `assets/tiktok.mp4` (también en raíz como `tiktok.mp4`)
- Captions / timing: `captions.srt`
- Chart refs: `assets/storyboard/react-architecture-pastel.jpg`, `assets/storyboard/react-graph-llm-tools.jpg`
- Design: `frame.md` ← copy of `shared/brand/FRAME.md` (foam / mango / lagoon / butter · Rubik + JetBrains Mono)
- Animation notes (pre-VO): `storyboard_animaci_n_de_arquitectura_react.md`

## Customizations

- Ratio: 9:16 (1080×1920)
- Layout: **cutaway punches** — cards cortas intercaladas con talking-head (NO muro de cards 8→94s)
- Captions: rail en footage; se ocultan solo durante cada punch de card
- Charts: HTML vivo; card-02 = ciclo Thinking ⇄ Tool con token + labels Action/Observation
- Look: FRAME.md foam/mango/lagoon · Rubik + JetBrains Mono · sticker shadow

## Notes

- Project root: `videos/react/`
- Plan: `STORYBOARD.md` — approved (Frame2=A pastel, ASR ReAct/Acting, close=cara)
- Layout: talking-head-recut cutaways + embedded-captions rail (IG Reels safe `bottom:380`)
- Rebuild: `npm run build` → `npm run check` → `npx hyperframes preview --background`
- No inventar VO; el pacing lo manda el SRT
