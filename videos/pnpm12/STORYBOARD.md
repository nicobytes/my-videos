---
format: 1920x1080
duration: 58s
message: "Con pnpm 12 reemplazás nvm y npm: una sola herramienta para Node y dependencias."
arc: Hook → Problem (nvm) → Solution (runtime) → Problem (npm) → Proof (perf) → Landing
audience: desarrolladores Node que ya usan o evalúan pnpm
mode: collaborative
workflow: talking-head-recut
language: es
footage: pnpm12.mp4
captions: captions.srt
---

# Storyboard — pnpm 12 (talking-head + overlays)

> **This video tells** desarrolladores Node **that** pnpm 12 reemplaza nvm y npm en una sola herramienta — runtime + deps — más rápida y más segura.

Base: talking-head `pnpm12.mp4` (clip sin recortar). Overlay cards + captions cinéticos sincronizados al SRT. El VO manda el pacing; los inserts llegan en la palabra clave.

## Direction (todas las frames)

- **Ground:** `#0d1117` (terminal / GitHub dark)
- **Ink:** `#f0f6fc`
- **Accent (solo marca):** pnpm yellow `#F69220` · npm red `#CB3837` · nvm yellow-check `#F7DF1E`
- **Énfasis:** escala, inversión, densidad — no un cuarto color “de highlight”
- **Captions:** rail inferior o embed cinético; VO-paced (aparece lo que se está diciendo)
- **Holds:** estáticos (sin drift / breathing)
- **Footage:** PIP o full-bleed atenuado detrás del card cuando hay insert visual
- **Breather:** Frame 4 (devEngines code hold) — la única escena deliberadamente calma
- **Callback / motivo:** dos logos (nvm + npm) entran como “dolor” en Frames 2–3 / 5; en Frame 7 se tachan / se desvanecen y queda solo el wordmark **pnpm** — mismo par, ahora resuelto
- **Negativos:** no purple AI gradients, no bokeh, no browser chrome falso, no drop-shadow cards, no `Math.random()`, no loops infinitos

## Asset ledger

| ID | Archivo | Uso |
| ---- | -------- | --- |
| `A-footage` | `pnpm12.mp4` | Talking-head base, todo el runtime |
| `A-srt` | `captions.srt` | Timing + texto de captions |
| `A-nvm` | `assets/storyboard/logo-nvm.png` | Logo nvm (preferir PNG; alt JPG disponible) |
| `A-npm` | `assets/storyboard/logo-npm.png` | Logo npm |
| `A-devengines` | `assets/storyboard/devengines-package-json.png` | Screenshot `devEngines` / Project-aware |
| `A-perf` | `assets/storyboard/perf-clean-install.png` | Chart “clean” install times |
| `C-runtime` | código vivo (no imagen) | `pnpm runtime set node lts -g` |
| `C-devengines` | código vivo (opcional mirror del PNG) | bloque `devEngines` tipado |

---

## Frame overview

| Frame | Beat | On screen | Why |
| ----- | ---- | --------- | --- |
| 01 — Una sola herramienta | hook · 0.0–9.4s | Título + “nvm + npm → pnpm” | Planta la tesis en el primer aliento |
| 02 — El dolor de nvm | problem · 9.4–18.6s | Logo nvm + “versiones por proyecto” | Hace tangible el primer reemplazo |
| 03 — Runtime global | solution · 18.6–28.0s | Terminal tipando el comando | Muestra *cómo* instalar Node con pnpm |
| 04 — Project-aware bins | mechanism · 28.0–32.4s | `devEngines` JSON / screenshot | Prueba el tag en `package.json` (breather) |
| 05 — El dolor de npm | problem · 32.4–42.0s | Logo npm + “lento / inseguro” | Monta el segundo reemplazo |
| 06 — Proof: clean install | proof · 42.0–50.7s | Chart performance | Evidencia numérica (14× vs npm) |
| 07 — Solo pnpm | landing · 50.7–57.9s | Logos tachados → pnpm solo | Callback: dos herramientas fuera, una queda |

---

## Frame 1 — Una sola herramienta

- scene: Hook cinético — “pnpm 12 = nvm + npm”
- duration: 9.4s
- poster: 2s
- transition_in: cut
- status: animated
- voiceover: "Con la nueva versión de PNP en la versión 12 puedo reemplazar dos herramientas… manejo solo una y confío en PNP."
- src: videos/pnpm12/public/cards/card-01.html
- footage_range: 0.00–9.44
- srt_cues: 1–4

**Inserts**

| t (abs) | Pieza | Tipo | Notas de animación |
| ------- | ----- | ---- | ------------------ |
| 0.08 | Caption cue 1–2 | caption | Slam inferior: “pnpm 12” |
| 2.96 | Caption cue 3–4 | caption | “reemplazo dos herramientas” |
| 4.0 | Motivo: dos siluetas / chips `nvm` + `npm` | animación | Entran desde laterales, baja opacidad; **no** logos full-res aún (plantados para callback) |
| 6.8 | Flecha / morph → chip `pnpm` | animación | Los dos chips colapsan hacia un solo chip naranja |
| 9.0 | Hold 0.4s | hold | Preparar wipe a Frame 2 |

**Transición out → Frame 2:** `whip` horizontal (derecha) · 0.35s

**Layout:** talking-head full o leve vignette; overlays centrados tercio superior.

---

## Frame 2 — El dolor de nvm

- scene: Logo nvm + problema de versiones por proyecto
- duration: 9.2s
- poster: 3s
- transition_in: whip
- status: outline
- voiceover: "La primera es Node Version Manager… diferentes versiones de Node… es un dolor de cabeza…"
- src: compositions/frames/02-nvm-pain.html
- footage_range: 9.44–18.64
- srt_cues: 5–11

**Inserts**

| t (abs) | Pieza | Tipo | Notas de animación |
| ------- | ----- | ---- | ------------------ |
| 9.44 | **`A-nvm`** `assets/storyboard/logo-nvm.png` | imagen | Entra scale 0.85→1 + fade; ancla izquierda o center-left |
| 11.2 | Caption “Node Version Manager” | caption | Sync cue 5–6 |
| 13.9 | Lista / stack “proyecto A / B / C → Node distinto” | animación | Tres filas stagger; refuerza el dolor |
| 15.8 | Label “dolor de cabeza” | caption | Cue 11 |
| 18.2 | Logo nvm pulsa una vez | animación | Prepara handoff a la solución |

**Transición out → Frame 3:** `match-cut` del logo nvm → prompt de terminal (mismo centro de frame) · 0.25s

**Roles:** foreground = logo nvm; supporting = lista de proyectos; background = talking-head atenuado (~40% brightness).

---

## Frame 3 — Runtime global (`pnpm runtime set`)

- scene: Terminal tipando instalación de Node LTS global
- duration: 9.4s
- poster: 4s
- transition_in: match-cut
- status: outline
- voiceover: "lo solucionamos con Node Version Manager pero ahora… bien integrado en la versión 12 de PNP simplemente colocas…"
- src: compositions/frames/03-runtime-set.html
- footage_range: 18.64–28.08
- srt_cues: 11–15

**Inserts**

| t (abs) | Pieza | Tipo | Notas de animación |
| ------- | ----- | ---- | ------------------ |
| 18.64 | Chrome terminal macOS / dark | animación | Block `code-typing` o composición dedicada |
| 20.0 | **`C-runtime`** comando tipado | código | Texto exacto: `pnpm runtime set node lts -g` — typewriter ~2.5s, cursor blink hold |
| 23.0 | Badge “global · Node LTS” | animación | Chip debajo del comando |
| 24.5 | Caption “integrado en pnpm 12” | caption | Cue 13–14 |
| 26.9 | Hint “Project-aware global bins →” | animación | Flecha / caret hacia Frame 4 |

**Transición out → Frame 4:** `crossfade` suave · 0.4s (entra al breather)

**Notas de build:** no usar screenshot del comando — tiparlo en HTML para seek-safe. El talking-head puede pasar a PIP esquina inferior derecha.

---

## Frame 4 — Project-aware global bins *(breather)*

- scene: `devEngines` en package.json — hold calmado
- duration: 4.4s
- poster: 2s
- transition_in: crossfade
- status: outline
- voiceover: "como un nuevo tag en tu package.json y listo"
- src: compositions/frames/04-devengines.html
- footage_range: 28.08–32.36
- srt_cues: 15–16

**Inserts**

| t (abs) | Pieza | Tipo | Notas de animación |
| ------- | ----- | ---- | ------------------ |
| 28.08 | Título overlay “Project-aware global bins” | caption / title | Entra una vez; **sin motion idle** (breather) |
| 28.5 | **`A-devengines`** `assets/storyboard/devengines-package-json.png` | imagen | Full-card o 70% frame; Ken Burns **prohibido** aquí — hold estático |
| 28.5 *(alt)* | **`C-devengines`** tipado | código | Mirror del JSON si el PNG no lee bien a 1080p; preferir PNG si es legible |

Código canónico a tipar / highlight:

```json
{
  "devEngines": {
    "runtime": {
      "name": "node",
      "version": "^22.0.0",
      "onFail": "download"
    }
  }
}
```

| 30.5 | Highlight línea `"onFail": "download"` | animación | Una sola sweep de underline / glow ink (no tercer color) |
| 31.8 | Caption “y listo” | caption | Cue 16 |

**Transición out → Frame 5:** `wipe` vertical · 0.3s

**Por qué es el breather:** el VO dice “y listo” — dejar leer el JSON sin clutter.

---

## Frame 5 — El dolor de npm

- scene: Logo npm + lento / seguridad
- duration: 9.6s
- poster: 3s
- transition_in: wipe
- status: outline
- voiceover: "lo segundo es la gestión de dependencias… NPM es un poquito lento y además tiene muchos issues de seguridad…"
- src: compositions/frames/05-npm-pain.html
- footage_range: 32.36–42.00
- srt_cues: 16–20

**Inserts**

| t (abs) | Pieza | Tipo | Notas de animación |
| ------- | ----- | ---- | ------------------ |
| 32.36 | **`A-npm`** `assets/storyboard/logo-npm.png` | imagen | Slam center o left; scale punch |
| 34.4 | Caption “gestión de dependencias” | caption | Cue 16–17 |
| 37.4 | Callouts “lento” + “issues de seguridad” | animación | Dos badges stagger debajo del logo |
| 39.4 | Logo npm se desatura / se agrieta levemente | animación | Prepara el contraste con pnpm (sin VFX excesivo) |
| 41.5 | Hold | hold | Anticipar chart |

**Transición out → Frame 6:** `push` upward (el chart empuja al logo fuera) · 0.4s

---

## Frame 6 — Proof: clean install

- scene: Chart “clean” — npm 45.5s vs pnpm 12 + pnpr 3.31s
- duration: 8.7s
- poster: 3s
- transition_in: push
- status: outline
- voiceover: "entonces PNP es mucho más seguro, se reescribió en ROS, entonces es rapidísimo…"
- src: compositions/frames/06-perf-proof.html
- footage_range: 42.00–50.72
- srt_cues: 21–23

**Inserts**

| t (abs) | Pieza | Tipo | Notas de animación |
| ------- | ----- | ---- | ------------------ |
| 42.0 | Título “clean · A fresh clone. Nothing cached.” | caption | Echo del chart |
| 42.3 | **`A-perf`** `assets/storyboard/perf-clean-install.png` | imagen | Reveal bars L→R o fade+scale; talking-head a PIP |
| 44.0 | Callout “14× slower” sobre barra npm | animación | Sync “reescribió en Rust / rapidísimo” (SRT dice “ROS” → corregir caption on-screen a **Rust**) |
| 46.5 | Highlight barra `pnpm 12 + pnpr` 3.31s | animación | Pulse ink una vez — winner |
| 48.0 | Caption “más seguro · Rust · rapidísimo” | caption | Cue 21–23 |
| 50.0 | Hold corto | hold | |

**Transición out → Frame 7:** `crossfade` + scale-down del chart · 0.45s

**Nota captions:** en overlay corregir “ROS” → “Rust” (el audio puede quedar; el texto on-screen debe ser correcto).

---

## Frame 7 — Solo pnpm (landing / callback)

- scene: nvm + npm tachados; queda pnpm
- duration: 7.2s
- poster: 3s
- transition_in: crossfade
- status: outline
- voiceover: "Entonces con esto yo literalmente desinstalé npm… y ahora solo tengo una herramienta…"
- src: compositions/frames/07-landing.html
- footage_range: 50.72–57.84
- srt_cues: 24–28

**Inserts**

| t (abs) | Pieza | Tipo | Notas de animación |
| ------- | ----- | ---- | ------------------ |
| 50.72 | **`A-npm`** + **`A-nvm`** lado a lado | imagen | Callback: mismos logos de Frames 2 y 5 |
| 52.0 | Tachado / X / fade-out de ambos | animación | Sync “desinstalé npm” + “versión manager” |
| 54.5 | Wordmark / chip **pnpm** grande | animación | Motivo completo — el chip del Frame 1 ahora es el único survivor |
| 55.3 | Caption “una herramienta para Node” | caption | Cue 27–28 |
| 56.5 | Hold final | hold | End card limpio |

**Transición out:** fade to black · 0.5s (o hold freeze en último frame)

---

## Captions plan (global)

Fuente: `captions.srt` — no re-timar el VO; overlays se anclan a los cues.

| Estilo | Dónde |
| ------ | ----- |
| Kinetic slam (hook + landing) | Frames 1, 7 |
| Lower-third / rail | Frames 2, 3, 5 |
| Minimal line under code | Frames 3, 4 |
| Data callout | Frame 6 |

Correcciones on-screen (audio puede quedar):

| SRT dice | Overlay muestra |
| -------- | --------------- |
| PNP | **pnpm** |
| Node Persue Manager | **Node Version Manager** |
| ROS | **Rust** |
| note | **Node** |

---

## Transition map

```text
F1 cut ──whip──► F2 ──match-cut──► F3 ──crossfade──► F4(breather)
                                              │
F7 ◄──crossfade── F6 ◄──push── F5 ◄──wipe─────┘
```

| Boundary | Tipo | Duración | Motivo |
| -------- | ---- | -------- | ------ |
| cold open → F1 | cut | 0 | Arranque en VO |
| F1 → F2 | whip | 0.35s | Entrar al primer dolor |
| F2 → F3 | match-cut | 0.25s | Logo nvm → terminal |
| F3 → F4 | crossfade | 0.40s | Bajar energía al breather |
| F4 → F5 | wipe | 0.30s | Segundo acto |
| F5 → F6 | push | 0.40s | Evidencia empuja al problema |
| F6 → F7 | crossfade | 0.45s | Del proof al resolve |
| F7 → end | fade | 0.50s | Cierre |

---

## Build checklist (siguiente paso)

1. Actualizar `BRIEF.md` → `workflow: talking-head-recut`, `storyboard: yes`, length ~58s, language `es`
2. Instalar workflow: `npx hyperframes skills update talking-head-recut`
3. Frames HTML en `compositions/frames/0N-*.html` + wire en `index.html` con `data-composition-src`
4. Media: `pnpm12.mp4` muted + `<audio>` del mismo source; captions desde SRT
5. Insertar assets por path del ledger; tipar `C-runtime` y opcionalmente `C-devengines`
6. `npm run check` → preview background → review en Storyboard view

---

## Open questions (solo si hace falta ajustar)

- ¿Aspecto final 16:9 (1920×1080) o vertical/recorte para Shorts?
- ¿Talking-head siempre full-bleed con cards encima, o PIP cuando hay chart/código?
- ¿Corregimos “PNP/ROS” solo en captions on-screen, o también re-generamos SRT limpio?
