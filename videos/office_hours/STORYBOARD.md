---
format: 1080x1920
duration: 35s
message: "Tu agente de WhatsApp atiende cuando nadie más lo hace — madrugada y picos fuera de horario."
arc: Hook → Stat reveal → Horario hábil → Noche / madrugada → Cierre de venta
audience: founders / ops / ventas que atienden clientes por WhatsApp
mode: collaborative
workflow: talking-head-recut
language: es
footage: officehours.mp4
captions: captions.srt
destination: tiktok
---

# Storyboard — Office Hours (talking-head + overlays)

> **This video tells** equipos que venden por WhatsApp **that** un agente con la base de conocimiento de la compañía cubre madrugada y picos fuera de horario — y deja la conversación lista para que ventas cierre en horario hábil.

Base: talking-head `officehours.mp4` (clip sin recortar, 1080×1920, ~35.2s). Overlay cards + captions cinéticos sincronizados al SRT. El VO manda el pacing; el chart HTML es la prueba visual central.

## Direction (todas las frames)

- **Ground / brand:** `frame.md` nicobytes — ink `#18181b` · paper `#fafafa` · cyan `#06b6d4` · emerald `#10b981`
- **Chart palette (datos):** horario hábil = emerald `#10b981` · fuera de horario = cyan `#06b6d4` (alineado a marca; no los verdes/azules genéricos del PNG)
- **Énfasis:** una sola cifra ancla por beat (p. ej. **208 @ 18h**); no saturar labels en 9:16
- **Captions:** rail inferior / embed cinético; VO-paced
- **Holds:** estáticos (sin drift / breathing)
- **Footage:** full-bleed atenuado detrás de cards opacas; PIP pequeño solo si el chart necesita espacio
- **Chart:** **HTML vivo vertical** (`C-chart`) — no pegar el PNG landscape. Barras **horizontales** (hora en el eje Y) o reveal segmentado 0–23h con pan; tipografía legible en TikTok
- **Breather:** Frame 2 (chart entra) — hold corto antes de explicar
- **Callback:** el pico **18h / 208** se planta en Frame 2–3 y vuelve en Frame 4–5 como “cuando ya nadie atiende”
- **Negativos:** no purple AI gradients, no screenshot landscape sin adaptar, no drop-shadow cards, no `Math.random()`, no loops infinitos

## Asset ledger

| ID | Archivo | Uso |
| ---- | -------- | --- |
| `A-footage` | `officehours.mp4` | Talking-head base, todo el runtime |
| `A-srt` | `captions.srt` | Timing + texto de captions (fuente: `cpations.srt`) |
| `A-chart-ref` | `assets/storyboard/chart-mensajes-por-hora-ref.png` | Referencia visual del chart (landscape); **no** usar full-bleed en 9:16 |
| `C-chart` | HTML vivo (no imagen) | “Mensajes por hora del día” — 24 barras, legend hábil / fuera; layout vertical TikTok |
| `C-stat-208` | tipografía / callout | Pico **208** mensajes @ **18h** |
| `C-kb` | icono / chip tipográfico | “base de conocimiento” (Frame 4) |

### Datos del chart (`C-chart`)

Horario hábil (9h–17h) = emerald · fuera = cyan. Valores:

`0:24, 1:35, 2:14, 3:16, 4:11, 5:16, 6:70, 7:92, 8:149, 9:136, 10:136, 11:92, 12:75, 13:65, 14:98, 15:65, 16:119, 17:91, 18:208, 19:141, 20:83, 21:109, 22:115, 23:49`

**Tratamiento 9:16:** barras horizontales (0h arriba → 23h abajo) o dos columnas (madrugada / día); stagger de entrada; highlight glow en **18h** y franja nocturna 0–5h cuando el VO lo diga.

---

## Frame overview

| Frame | Beat | On screen | Why |
| ----- | ---- | --------- | --- |
| 01 — Agentes en WhatsApp | hook · 0.0–6.4s | Título + “WhatsApp agents” | Planta el contexto antes del dato |
| 02 — Esta estadística | proof-in · 6.4–9.5s | Chart HTML entra (breather) | El VO apunta al gráfico; “esto es lo vital” |
| 03 — Horas hábiles… y picos | insight · 9.5–19.0s | Chart + highlight hábil / pico | Contraste: sí atiende de día *y* cuando nadie más |
| 04 — Madrugada / KB | mechanism · 19.0–30.0s | Noche + “base de conocimiento” | Cómo el agente cubre fuera de horario |
| 05 — Ventas cierra | landing · 30.0–35.2s | Handoff → cierre de venta | Payoff: el equipo humano cierra en horario laboral |

---

## Frame 1 — Agentes en WhatsApp

- scene: Hook cinético — agentes que viven en WhatsApp
- duration: 6.4s
- poster: 2s
- transition_in: cut
- status: outline
- voiceover: "Últimamente he estado desarrollando agentes que corren y viven en WhatsApp para diferentes empresas y hace poco sacamos este estadística"
- src: compositions/frames/01-whatsapp-agents.html
- footage_range: 0.00–6.40
- srt_cues: 1–4

**Inserts**

| t (abs) | Pieza | Tipo | Notas de animación |
| ------- | ----- | ---- | ------------------ |
| 0.08 | Caption cue 1–2 | caption | “agentes… WhatsApp” |
| 2.0 | Chip / wordmark “WhatsApp agents” | animación | Scale-pop; cyan accent |
| 4.96 | Tease “esta estadística” | caption | Cue 4 — prepara handoff al chart |
| 6.2 | Hold 0.2s | hold | Wipe / match al chart |

**Transición out → Frame 2:** `whip` vertical (arriba→abajo, como unfold del chart) · 0.3s

**Layout:** talking-head full-bleed; overlays tercio superior / centro.

---

## Frame 2 — Esta estadística (chart reveal)

- scene: Chart HTML vertical entra — “esto es lo vital”
- duration: 3.1s
- poster: 1.2s
- transition_in: whip
- status: outline
- voiceover: "en donde miramos cómo está atendiendo y esto es lo vital."
- src: compositions/frames/02-chart-reveal.html
- footage_range: 6.40–9.52
- srt_cues: 5–6

**Inserts**

| t (abs) | Pieza | Tipo | Notas de animación |
| ------- | ----- | ---- | ------------------ |
| 6.40 | **`C-chart`** título “Mensajes por hora del día” | animación | Card glass / paper; barras stagger 0→23 (rápido) |
| 6.40 | Legend hábil / fuera | animación | Emerald + cyan dots |
| 8.40 | Caption “esto es lo vital” | caption | Cue 6 — hold del chart |
| 9.3 | Micro-highlight barra **18h** | animación | Pulse suave (callback plantado) |

**Transición out → Frame 3:** `cut` limpio · 0s (mismo chart permanece; cambia el énfasis)

**Roles:** foreground = chart; background = talking-head ~35% brightness / blur leve.

---

## Frame 3 — Horas hábiles… y picos

- scene: Chart con énfasis horario hábil + “cuando nadie te atiende”
- duration: 9.5s
- poster: 3s
- transition_in: cut
- status: outline
- voiceover: "Fíjate que en las horas básicamente hábiles, en las horas de trabajo, pues nuestro agent obviamente sigue funcionando, pero también responde en picos en donde normalmente ya nadie te atiende."
- src: compositions/frames/03-business-vs-peaks.html
- footage_range: 9.52–19.00
- srt_cues: 7–11

**Inserts**

| t (abs) | Pieza | Tipo | Notas de animación |
| ------- | ----- | ---- | ------------------ |
| 9.52 | Franja **9h–17h** emerald glow | animación | Dim del resto; label “horario hábil” |
| 11.68 | Caption “horas hábiles / de trabajo” | caption | Cue 7–8 |
| 13.32 | Caption “el agent sigue funcionando” | caption | Cue 9 |
| 15.68 | Barras pico **8h / 18h** cyan punch | animación | 18h = **208** callout `C-stat-208` |
| 17.48 | Caption “nadie te atiende” | caption | Cue 11 — tesis del video |
| 18.7 | Hold | hold | Preparar noche |

**Transición out → Frame 4:** `match-cut` dim de franja hábil → highlight madrugada · 0.35s

**Layout:** chart dominante (centro); callout 208 grande; talking-head PIP esquina inferior o atenuado full.

---

## Frame 4 — Madrugada / base de conocimiento

- scene: Noche — el agente responde con el KB de la compañía
- duration: 11.0s
- poster: 4s
- transition_in: match-cut
- status: outline
- voiceover: "En la madrugada, en la altas horas de la noche, el agente literalmente toma toda la base de conocimiento de tu compañía, responde, haz atención y deja listo precisamente para que alguien ya"
- src: compositions/frames/04-night-kb.html
- footage_range: 19.00–30.00
- srt_cues: 12–16

**Inserts**

| t (abs) | Pieza | Tipo | Notas de animación |
| ------- | ----- | ---- | ------------------ |
| 19.40 | Franja **0h–5h** + **21h–23h** cyan | animación | Resto del chart dim; “madrugada / noche” |
| 22.08 | Chip **`C-kb`** “base de conocimiento” | animación | Scale-pop; lista corta: responde → atiende → deja listo |
| 24.52 | Caption “responde / haz atención” | caption | Cue 14–15 (corregir on-screen: “hace atención”) |
| 28.96 | Caption “deja listo…” | caption | Cue 15–16 — puente a Frame 5 |
| 29.7 | Hold | hold | Handoff a ventas |

**Transición out → Frame 5:** `whip` · 0.3s

**Roles:** chart (noche) + tipografía KB; footage atenuado.

---

## Frame 5 — Ventas cierra

- scene: Landing — el equipo toma la conversación y cierra la venta
- duration: 5.2s
- poster: 2s
- transition_in: whip
- status: outline
- voiceover: "pues del equipo de ventas tome esa conversación cuando ya esté en horas de trabajo y cierre la venta."
- src: compositions/frames/05-sales-close.html
- footage_range: 30.00–35.23
- srt_cues: 17–19

**Inserts**

| t (abs) | Pieza | Tipo | Notas de animación |
| ------- | ----- | ---- | ------------------ |
| 30.56 | Secuencia tipográfica “agente → ventas → cierre” | animación | Tres pasos stagger; emerald en “cierre” |
| 32.12 | Caption “horas de trabajo” | caption | Cue 18 — callback al horario hábil |
| 33.92 | Caption / lockup “cierre la venta” | caption | Cue 19 — beat final |
| 34.8 | Callback micro: barra **18h** o chip “24/7” | animación | Cierra el motivo del chart |

**Transición out:** hold a negro / end · 0.2s

**Layout:** talking-head más presente (cara); overlays centrados; chart opcional como watermark pequeño o solo el lockup tipográfico.

---

## Notas de producción

1. **ASR:** en captions on-screen corregir “este estadística” → “esta estadística”; “haz atención” → “hace atención”; “la altas horas” → “las altas horas”.
2. **Chart:** implementar como sub-comp HTML seek-safe (GSAP `fromTo` en anchos de barra); no animar con CSS infinite; datos fijos del ledger.
3. **Canvas:** 1080×1920 @ 30fps — coincide con el footage.
4. **Siguiente paso (tras aprobación):** sketches wireframe → build cards → assembly `index.html` → captions cinéticos → `pnpm run check`.
