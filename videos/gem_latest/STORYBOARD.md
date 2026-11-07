---
format: 1080x1920
duration: 47s
message: "gemini-flash-latest: un placeholder que trae el Flash de frontera sin redeploy."
arc: Hook → Código pinneado → Alias reveal → Auto frontier → Sin deploy → CTA WhatsApp
audience: builders / agentes / WhatsApp + Gemini
mode: collaborative
workflow: talking-head-recut
language: es
footage: latest.mp4
captions: captions.srt
destination: tiktok
---

# Storyboard — Gemini Flash Latest (talking-head + fullscreen cards)

> **This video tells** builders de agentes **that** el tag `gemini-flash-latest` es un placeholder de Google que siempre apunta al Flash de frontera — así el upgrade llega sin release ni deploy.

Base: talking-head `latest.mp4` (clip sin recortar, 1080×1920, 47.0s @ 30fps). Cards opacas a **100% de pantalla** + captions cinéticos sincronizados al SRT. El VO manda el pacing; el **antes/después de código** es la prueba visual central. El footage vuelve entre beats (breath) como transición.

## Direction (todas las frames)

- **Ground / brand:** `frame.md` nicobytes — ink `#18181b` · paper `#fafafa` · cyan `#06b6d4` · emerald `#10b981`
- **Code palette:** keywords cyan · strings emerald · identifiers paper (regla `code-cell`)
- **Énfasis:** un solo hot moment por beat — el string `gemini-flash-latest` o el contraste pin vs alias
- **Captions:** rail inferior / embed cinético; VO-paced
- **Holds:** estáticos (sin drift / breathing)
- **Footage:** full-bleed atenuado detrás de cards opacas; PIP solo si el code-cell necesita espacio
- **Code:** **HTML vivo** (`C-code-before` → `C-code-after`) desde `assets/code.md` — no screenshot estático
- **Logo:** `A-adk` chip / lockup en hook y CTA (ADK)
- **Breather:** Frame 3 (alias entra) — hold corto antes de explicar el auto-upgrade
- **Callback:** el string `gemini-flash-latest` se planta en Frame 3 y vuelve en Frame 5–6 como “sin deploy”
- **Negativos:** no purple AI gradients, no drop-shadow cards, no `Math.random()`, no loops infinitos, no inventar cifras

## Asset ledger

| ID | Archivo | Uso |
| ---- | -------- | --- |
| `A-footage` | `latest.mp4` → `input-video.mp4` | Talking-head base, todo el runtime |
| `A-srt` | `captions.srt` | Timing + texto de captions (fuente: `assets/cpations.srt`) |
| `A-code` | `assets/code.md` | Fuente del before/after Python (ADK) |
| `A-adk` | `assets/logos/adk-logo.png` | Logo Agent Development Kit (hook + CTA) |
| `C-code-before` | HTML vivo (no imagen) | `model="gemini-2.5-flash"` pinneado |
| `C-code-after` | HTML vivo (no imagen) | `model="gemini-flash-latest"` alias |
| `C-tag` | tipografía / chip | Wordmark `gemini-flash-latest` |
| `C-diff` | tipografía | Diff visual `- 2.5-flash` → `+ flash-latest` |

### Snippet canónico (`C-code-*`)

Antes (pin):

```python
model="gemini-2.5-flash",
```

Después (alias):

```python
model="gemini-flash-latest",
```

**Tratamiento 9:16:** `code-cell` centrado ≤ 88cqw; highlight de una línea; morph/stagger de la string del modelo; tipografía legible en TikTok.

---

## Frame overview

| Frame | Beat | On screen | Why |
| ----- | ---- | --------- | --- |
| 01 — Modelo de frontera | hook · 0.0–6.0s | Pregunta + ADK chip | Planta el problema antes del código |
| 02 — ID pinneado | proof · 6.0–14.4s | `C-code-before` | “Normalmente pones 3.x…” |
| 03 — gemini-flash-latest | reveal · 14.4–20.8s | `C-tag` + alias | El placeholder entra |
| 04 — Flash más reciente | insight · 20.8–26.6s | `C-code-after` | Familia Flash → frontera auto |
| 05 — Sin deploy | payoff · 26.6–41.7s | Diff + “0 deploy” | 3.4 / 3.5 sin release |
| 06 — CTA WhatsApp | landing · 41.7–47.0s | ADK + CTA | Plataforma / escríbeme |

---

## Frame 1 — Modelo de frontera

- scene: Hook cinético — ¿cómo usar el Flash de frontera en agentes?
- duration: 6.0s
- poster: 2s
- transition_in: cut
- status: built
- voiceover: "¿Cómo se utiliza el más reciente modelo de frontera de la familia de Google en nuestros agentes? Fíjate en este código,"
- src: compositions/frames/01-frontier-hook.html
- footage_range: 0.00–6.00
- srt_cues: 1–3

**Inserts**

| t (abs) | Pieza | Tipo | Notas de animación |
| ------- | ----- | ---- | ------------------ |
| 0.08 | Caption cue 1–2 | caption | “modelo de frontera… Google” |
| 1.2 | Chip **`A-adk`** + “agentes” | animación | Scale-pop; logo ADK pequeño |
| 3.96 | Caption “nuestros agentes?” | caption | Cue 3 |
| 5.6 | Tease “Fíjate en este código” | caption | Prepara handoff al code-cell |
| 5.85 | Hold 0.15s | hold | Wipe / match al código |

**Transición out → Frame 2:** `whip` vertical (arriba→abajo, unfold del code-cell) · 0.3s

**Layout:** card fullscreen opaca 100%; video breath entre beats.

---

## Frame 2 — ID pinneado (antes)

- scene: Code-cell “antes” — model ID fijo
- duration: 8.4s
- poster: 3s
- transition_in: whip
- status: built
- voiceover: "normalmente en nuestros agentes tenemos una ID del modelo, normalmente aquí le pones 3.8, 3 puntos, lo que sea, sus metaparámetros, etcétera."
- src: compositions/frames/02-pinned-id.html
- footage_range: 6.00–14.36
- srt_cues: 4–7

**Inserts**

| t (abs) | Pieza | Tipo | Notas de animación |
| ------- | ----- | ---- | ------------------ |
| 6.16 | **`C-code-before`** entra | animación | Card slate; líneas stagger |
| 9.04 | Highlight línea `model="gemini-2.5-flash"` | animación | Cyan underline / pulse |
| 10.72 | Caption “3.8, 3 puntos…” | caption | Cue 6 — versiones pinneadas |
| 12.88 | Chip “release en cada upgrade” | animación | Soft ink pill (dolor) |
| 14.1 | Hold | hold | Preparar “Pero…” |

**Transición out → Frame 3:** `match-cut` mismo code-cell, swap de string · 0.35s

**Roles:** foreground = code-cell; background = talking-head ~35% brightness.

---

## Frame 3 — Alias reveal

- scene: Placeholder `gemini-flash-latest` entra
- duration: 6.4s
- poster: 2.4s
- transition_in: match-cut
- status: built
- voiceover: "Pero Google tiene un placeholder muy interesante que se llama gemini-flash-latest y así por modelo."
- src: compositions/frames/03-alias-reveal.html
- footage_range: 14.36–20.76
- srt_cues: 8–11

**Inserts**

| t (abs) | Pieza | Tipo | Notas de animación |
| ------- | ----- | ---- | ------------------ |
| 14.56 | Caption “Pero” | caption | Cue 8 — breather |
| 15.28 | Kicker “PLACEHOLDER” | animación | Cyan accent |
| 17.04 | **`C-tag`** `gemini-flash-latest` | animación | Display-mid / tech-tag-voltage **una vez** |
| 18.88 | Caption “latest y así por modelo” | caption | Cue 11 |
| 20.5 | Hold | hold | Puente a familia Flash |

**Transición out → Frame 4:** `cut` limpio · 0s

**Layout:** tag dominante centro; footage atenuado; voltage **solo** en el tag.

---

## Frame 4 — Flash más reciente (después)

- scene: Code-cell “después” — el alias resuelve al frontier
- duration: 5.8s
- poster: 2s
- transition_in: cut
- status: built
- voiceover: "Entonces en la familia de flash, pues te va a traer el modelo más reciente, el de frontera que tenga en automático."
- src: compositions/frames/04-flash-auto.html
- footage_range: 20.76–26.64
- srt_cues: 12–14

**Inserts**

| t (abs) | Pieza | Tipo | Notas de animación |
| ------- | ----- | ---- | ------------------ |
| 20.76 | **`C-code-after`** | animación | Misma card; string swap + emerald check |
| 22.44 | Caption “modelo más reciente” | caption | Cue 13 |
| 24.36 | Caption “frontera… en automático” | caption | Cue 14 — tesis |
| 26.3 | Micro-callback `C-tag` | animación | Chip pequeño “auto” |

**Transición out → Frame 5:** `whip` · 0.3s

**Roles:** code-cell + check; talking-head PIP o atenuado.

---

## Frame 5 — Sin deploy

- scene: Payoff — 3.4 / 3.5 llegan sin release
- duration: 15.0s
- poster: 5s
- transition_in: whip
- status: built
- voiceover: "¿Qué significa eso? Que si Google hoy llega a lanzar el 3.4, el 3.5… No tienes que hacer ningún deploy a tus agentes o a tu sistema, simplemente ya los agentes empiezan a operar con el modelo de frontera de Google en automático sin hacer ningún deploy."
- src: compositions/frames/05-zero-deploy.html
- footage_range: 26.64–41.68
- srt_cues: 15–22

**Inserts**

| t (abs) | Pieza | Tipo | Notas de animación |
| ------- | ----- | ---- | ------------------ |
| 26.64 | Secuencia “3.4 → 3.5 → …” | animación | Stagger tipográfico |
| 28.40 | Caption “lanzar el 3.4 / 3.5” | caption | Cue 16–17 (ASR cleaned) |
| 31.68 | **`C-diff`** `- pin` / `+ latest` | animación | Diff lines; cyan → emerald |
| 33.52 | Stat tipográfico **“0 deploy”** | animación | Display-mid; hold largo |
| 36.48 | Caption “empiezan a operar… automático” | caption | Cue 20–21 |
| 40.32 | Caption “sin hacer ningún deploy” | caption | Cue 22 — lock |
| 41.4 | Hold | hold | Handoff CTA |

**Transición out → Frame 6:** `whip` · 0.3s

**Layout:** tipografía + diff; footage más presente en cara hacia el final del beat.

---

## Frame 6 — CTA WhatsApp

- scene: Landing — agentes WhatsApp + plataforma
- duration: 5.3s
- poster: 2s
- transition_in: whip
- status: built
- voiceover: "Así que si quieres montar este tipo de agentes usando WhatsApp, escríbeme, yo tengo una plataforma para esto."
- src: compositions/frames/06-whatsapp-cta.html
- footage_range: 41.68–47.00
- srt_cues: 23–25

**Inserts**

| t (abs) | Pieza | Tipo | Notas de animación |
| ------- | ----- | ---- | ------------------ |
| 41.68 | **`A-adk`** + “WhatsApp agents” | animación | Lockup; face más visible |
| 44.12 | Caption “agentes usando WhatsApp” | caption | Cue 24 |
| 45.72 | CTA pill “escríbeme · plataforma” | animación | `button-primary-giant` cyan glow |
| 46.7 | Callback micro: `gemini-flash-latest` | animación | Chip watermark |

**Transición out:** hold a negro / end · 0.2s

**Layout:** talking-head presente; CTA centrado; logo ADK; colophon nicobytes opcional.

---

## Notas de producción

1. **ASR → on-screen:** `captions.srt` ya corrige “Google flash latest” → `gemini-flash-latest`; “3. ¿? / Cuatro el 5” → “3.4 / 3.5”; “apoderar” → “operar”; “este Código” → “este código”. Fuente cruda: `assets/cpations.srt`.
2. **Code:** implementar como sub-comp HTML seek-safe (GSAP `fromTo` en highlight de línea); datos fijos de `assets/code.md`; no CSS infinite.
3. **Canvas:** 1080×1920 @ 30fps — coincide con el footage (47.0s).
4. **Logo:** `assets/logos/adk-logo.png` — no estirar; chip / lockup con safe margin.
5. **Siguiente paso (tras aprobación):** sketches wireframe → build cards → assembly `index.html` → captions cinéticos → `npm run check`.
