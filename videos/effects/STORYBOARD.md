---
format: 1080x1920
duration: 63s
message: "Deja de pelear con effect + untracked — signalMethod (NgRx Signals) es la forma limpia, tipada e inyectable."
arc: Hook (evitar effects) → Cuándo sí → signalMethod → 3 ventajas → Flexible inputs + código → Implicit untracked (antes/después) → CTA NgRx
audience: Angular / frontend eng que usan signals y aún escriben effects a mano
mode: collaborative
workflow: general-video
language: es
footage: assets/effects.mp4
captions: captions.srt
destination: tiktok
layout: cutaway-cards
angle: full-screen concept cards interleaved with talking-head (NO overlays on face)
---

# Storyboard — NgRx `signalMethod` (talking-head + full-screen cards)

> **This video tells** Angular engineers **that** cuando un side effect es inevitable, `signalMethod` de `@ngrx/signals` reemplaza el patrón `effect` + `untracked` con un método tipado, flexible e inyectable.

Base: talking-head `assets/effects.mp4` (1080×1920 @ 30fps, **63.03s**). El VO manda el pacing vía `captions.srt`.

**Layout hard rule (diferente a office_hours):** **cards a pantalla completa** — opacas, sin talking-head detrás, sin lower-thirds ni PiP sobre la cara. Se **alterna** `screen: footage` ↔ `screen: card` con transiciones (whip / cut / match). El audio del MP4 sigue en ambos modos; en `card` el vídeo se oculta (muted picture, audio on).

Código fuente de verdad: `example.md` + [NgRx · signalMethod](https://ngrx.io/guide/signals/signal-method). Logo: `assets/ngrx-logo.svg`.

## Direction (todas las frames)

- **Ground / brand:** `frame.md` nicobytes — ink `#18181b` · paper `#fafafa` · slate `#27272a` · cyan `#06b6d4` · emerald `#10b981`
- **Code surface:** slate `#27272a` body · paper/zinc-100 chrome · cyan en keywords / acentos · mono `ui-monospace` (o JetBrains Mono si el renderer lo inyecta)
- **Logo NgRx:** `A-logo` solo en frames de marca / CTA — no como watermark permanente sobre la cara
- **Captions:** solo en frames `footage` (rail inferior cinético). En frames `card` el texto vive **dentro** de la card (legible 9:16); no duplicar SRT encima
- **Holds:** estáticos (sin drift / breathing)
- **Breather:** Frame 3 — logo + `signalMethod` hold corto antes de listar ventajas
- **Callback:** el trío **flexible · untracked · inyectable** se planta en Frame 4 y se paga en 5–7
- **Negativos:** no overlay sobre la cara · no purple AI gradients · no screenshot landscape sin adaptar · no `Math.random()` · no loops infinitos · no inventar APIs fuera de `example.md` / docs

## Asset ledger

| ID | Archivo | Uso |
| ---- | -------- | --- |
| `A-footage` | `assets/effects.mp4` | Talking-head base (todo el runtime de audio) |
| `A-srt` | `captions.srt` | Timing + guía de VO |
| `A-logo` | `assets/ngrx-logo.svg` | Marca NgRx (intro método + CTA) |
| `A-example` | `example.md` | Before/after canónico |
| `C-title-effects` | HTML tipográfico | “Effects en Angular” / “evitarlos” |
| `C-usecases` | chips tipográficos | analytics · logging · debugging · DOM |
| `C-signal-method` | logo + wordmark | `signalMethod` / `@ngrx/signals` |
| `C-three` | lista 1–2–3 | Flexible inputs · Implicit untracked · Injectable |
| `C-code-after` | bloque código | `signalMethod` “después” (`example.md`) |
| `C-code-before` | bloque código | `effect` + `untracked` “antes” (`example.md`) |
| `C-compare` | split / morph | Antes ↔ Después (Frame 6) |

### Snippets canónicos (`A-example`)

**Antes** (`C-code-before`) — acortar en 9:16 a lo esencial (imports + `effect`/`untracked` body):

```ts
effect(() => {
  const value = this.mySignal();
  untracked(() => {
    const double = value * 2;
    console.log(double);
  });
});
```

**Después** (`C-code-after`):

```ts
logDoubledNumber = signalMethod<number>((num) => {
  const double = num * 2;
  console.log(double);
});
// constructor: this.logDoubledNumber(this.mySignal);
```

---

## Frame overview

| Frame | Beat | Screen | On screen | Why |
| ----- | ---- | ------ | --------- | --- |
| 01 — Evita effects | hook · 0.0–6.6s | footage | Cara + captions | Planta la tesis “evitar effects” |
| 02 — Cuándo sí | exception · 6.6–13.8s | **card** | Chips use-cases | VO lista analytics/logging/DOM |
| 03 — signalMethod | name · 13.8–22.2s | **card** | Logo + `signalMethod` | Alternativa NgRx; breather |
| 04 — 3 ventajas | map · 22.2–24.6s | **card** | Lista 1–2–3 | Roadmap del resto del video |
| 05 — Flexible inputs | proof · 24.6–39.7s | **card** | Código después + “signal \| value” | Código entra con la 1ª ventaja + testability |
| 06 — Implicit untracked | contrast · 39.7–53.9s | **card** | Antes ↔ Después | Paga el “no pelear con untracked” |
| 07 — Usa NgRx Signals | landing · 53.9–63.0s | footage→card | Cara → logo CTA | Recomendación final |

---

## Frame 1 — Evita effects

- scene: Talking-head — “Hablemos de effects… evitarlos a toda costa”
- duration: 6.6s
- poster: 2s
- transition_in: cut
- status: animated
- screen: footage
- voiceover: "Hablemos sobre los effects en Angular. Básicamente deberíamos tratar de evitarlos a toda costa y Angular ha hecho mucho buen trabajo para"
- src: compositions/frames/01-avoid-effects.html
- footage_range: 0.00–6.64
- srt_cues: 1–4

**Inserts**

| t (abs) | Pieza | Tipo | Notas de animación |
| ------- | ----- | ---- | ------------------ |
| 0.08 | Caption cues 1–2 | caption | “effects en Angular” / “evitarlos” |
| 3.60 | Caption cues 3–4 | caption | “a toda costa” — hold de tesis |
| 6.4 | Hold 0.2s | hold | Whip a card use-cases |

**Transición out → Frame 2:** `whip` (cara → card opaca) · 0.3s

**Layout:** footage full-bleed; **sin** overlays gráficos (solo captions).

---

## Frame 2 — Cuándo sí (use-cases)

- scene: Card full-screen — cuándo un effect todavía tiene sentido
- duration: 7.2s
- poster: 2.5s
- transition_in: whip
- status: animated
- screen: card
- voiceover: "mecanismos para poder evitarlos. Sin embargo, pues a veces hay que utilizarlos para analytics, logging, debugging, manipulación del DOM, etcétera."
- src: compositions/frames/02-when-needed.html
- footage_range: 6.64–13.84
- srt_cues: 5–9

**Inserts**

| t (abs) | Pieza | Tipo | Notas de animación |
| ------- | ----- | ---- | ------------------ |
| 6.64 | Título card “A veces hay que usarlos” | animación | Paper/slate; ink type |
| 8.64 | Cue “Sin embargo” | beat | Soft emphasis |
| 10.64 | **`C-usecases`** chips stagger | animación | analytics → logging → debugging → DOM · cyan accent en el chip activo al ritmo del VO |
| 13.5 | Hold | hold | Match a naming card |

**Transición out → Frame 3:** `match-cut` / soft wipe · 0.25s

**Layout:** **100% card** — footage hidden; audio continues.

---

## Frame 3 — `signalMethod` (nombre + logo)

- scene: Card — la alternativa limpia de `@ngrx/signals`
- duration: 8.4s
- poster: 3s
- transition_in: wipe
- status: animated
- screen: card
- voiceover: "Hay una forma mucho más limpia de escribir estos effects a mi parecer y es con esta alternativa que tiene en su paquete que se llama signal method."
- src: compositions/frames/03-signal-method.html
- footage_range: 13.84–22.24
- srt_cues: 10–13

**Inserts**

| t (abs) | Pieza | Tipo | Notas de animación |
| ------- | ----- | ---- | ------------------ |
| 13.84 | Wordmark “forma más limpia” | animación | Fade-up |
| 17.40 | **`A-logo`** + **`C-signal-method`** | animación | Logo scale-pop · título `signalMethod` (camelCase on-screen; ASR dice “signal method”) |
| 19.68 | Chip `@ngrx/signals` | animación | Mono label; cyan underline |
| 21.8 | Hold (breather) | hold | Preparar “3 ventajas” |

**Transición out → Frame 4:** `cut` · 0s

**On-screen copy fix:** “signal method” → **`signalMethod`** · “NRS” (más adelante) → **NgRx**.

---

## Frame 4 — 3 ventajas (mapa)

- scene: Card — tres bullets que el VO va a expandir
- duration: 2.3s
- poster: 1.0s
- transition_in: cut
- status: animated
- screen: card
- voiceover: "Tiene 3 ventajas sobre el efecto normal de Angular."
- src: compositions/frames/04-three-advantages.html
- footage_range: 22.24–24.56
- srt_cues: 14–15

**Inserts**

| t (abs) | Pieza | Tipo | Notas de animación |
| ------- | ----- | ---- | ------------------ |
| 22.24 | **`C-three`** lista 01–02–03 | animación | Stagger rápido: Flexible inputs · Implicit untracked · Injectable |
| 24.3 | Highlight “01 Flexible” | animación | Emerald pulse — handoff a Frame 5 |

**Transición out → Frame 5:** `whip` · 0.25s

**Nota:** card corta a propósito — mapa, no explicación.

---

## Frame 5 — Flexible inputs (+ código después)

- scene: Card código — signal **o** valor; método tipado; unit-test friendly
- duration: 15.1s
- poster: 5s
- transition_in: whip
- status: animated
- screen: card
- voiceover: "La primera es flexible inputs. Yo puedo enviarle un signal o simplemente un valor y él va a suscribirse y ejecutar esa lógica de negocio aparte como si fuera programación en la entrada objetos, lo cual lo hace grande para el unit test y tengo que pelear con el constructor, inyectables y demás."
- src: compositions/frames/05-flexible-inputs.html
- footage_range: 24.56–39.68
- srt_cues: 16–24

**Inserts**

| t (abs) | Pieza | Tipo | Notas de animación |
| ------- | ----- | ---- | ------------------ |
| 24.56 | Label “01 · Flexible inputs” | animación | Callback del mapa |
| 26.00 | Toggle tipográfico **signal \| value** | animación | Split cyan/emerald; sync con cues 17–18 |
| 28.56 | **`C-code-after`** entra | animación | Type-on / line reveal del `signalMethod` (`example.md`); énfasis en `(this.mySignal)` |
| 32.40 | Callout “unit test / sin pelear el constructor” | animación | Cue 21–24 — chip Injectable + checklist corta |
| 39.4 | Hold | hold | Wipe al contraste before/after |

**Código on-screen (prioridad 9:16):** cuerpo de `logDoubledNumber = signalMethod<number>(…)` + línea del constructor; omitir imports si no caben.

**Transición out → Frame 6:** `match-cut` código “después” se queda como ancla · 0.3s

**ASR fix on-card:** “entrada objetos” → tipografía clara **“entrada de objetos”** / API tipada; “grande para el unit test” → **“ideal para unit test”**.

---

## Frame 6 — Implicit untracked (antes ↔ después)

- scene: Card contraste — ya no recordás cuándo poner `untracked`
- duration: 14.2s
- poster: 6s
- transition_in: match-cut
- status: animated
- screen: card
- voiceover: "Tiene automáticamente el implicit untracked. Entonces yo no me tengo que recordar cuándo poner un untracked o no para evitar memory leaks. Eso ya lo hace. De por sí, eso ya me ahorra un montón de pensamiento cognitivo de cuándo usar un track o no. Simplemente uso signalMethod y ya y se ve mucho más limpio, declarativo y es inyectable."
- src: compositions/frames/06-implicit-untracked.html
- footage_range: 39.68–53.92
- srt_cues: 25–37

**Inserts**

| t (abs) | Pieza | Tipo | Notas de animación |
| ------- | ----- | ---- | ------------------ |
| 39.68 | Label “02 · Implicit untracked” | animación | |
| 42.08 | **`C-code-before`** panel “Antes” | animación | `effect` + `untracked` dim/rojo-suave en `untracked` |
| 46.40 | Caption beat “memory leaks / ya lo hace” | animación | Cue 29–31 — checkmark emerald |
| 48.44 | Morph → **`C-compare`**: Antes se pliega, **Después** (`C-code-after`) full | animación | Cue 32–36 — “pensamiento cognitivo” → UI limpia |
| 53.5 | Chip “declarativo · inyectable” | animación | Cierra el trío de ventajas |

**Transición out → Frame 7:** `whip` card → cara · 0.3s

**On-screen copy fix:** ASR “tracket” / “track” → siempre **`untracked`**.

---

## Frame 7 — CTA · NgRx Signals

- scene: Vuelve la cara → lockup logo + recomendación
- duration: 9.1s
- poster: 4s
- transition_in: whip
- status: animated
- screen: footage→card
- voiceover: "Así que te recomiendo usarlo si utilizas el paquete de NgRx Signals."
- src: compositions/frames/07-cta-ngrx.html
- footage_range: 53.92–63.03
- srt_cues: 37–39

**Inserts**

| t (abs) | Pieza | Tipo | Notas de animación |
| ------- | ----- | ---- | ------------------ |
| 53.92 | Footage full + captions cues 37–38 | caption | “te recomiendo usarlo” |
| 59.28 | Crossfade / whip a **card CTA** | transición | Cara → brand lockup |
| 59.50 | **`A-logo`** + “`@ngrx/signals` · `signalMethod`” | animación | Scale-pop; gradient cyan→emerald hairline |
| 62.5 | Hold end | hold | Freeze frame |

**Transición out:** hold / fade negro · 0.3s

**ASR fix:** “NRS signal” → **NgRx Signals** on-screen.

---

## Notas de producción

1. **Canvas:** 1080×1920 @ 30fps — coincide con `effects.mp4` (63.03s).
2. **Cutaways:** en `screen: card`, el `<video>` no se ve (opacity 0 / off-canvas); `<audio>` del mismo source o video unmuted con picture hidden — un solo clock seek-safe.
3. **Código:** solo snippets de `example.md`; seek-safe (GSAP `fromTo`, sin infinite CSS). En 9:16 preferir 6–10 líneas visibles + scroll/highlight, no pegar el archivo entero.
4. **Captions:** cinéticos en footage; en cards, tipografía de la card manda. Corregir on-screen: signalMethod, untracked, NgRx Signals.
5. **Docs web:** `ngrx.io/guide/signals/signal-method` es SPA (HTML shell sin ejemplos en fetch); los ejemplos del storyboard salen de `example.md` alineados a esa guía.
6. **Siguiente paso (tras aprobación del board):** wireframe sketches → build `compositions/frames/0N-*.html` → assembly `index.html` → captions → `pnpm run effects:check`.
