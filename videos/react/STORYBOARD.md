---
format: 1080x1920
duration: 96.5s
message: "ReAct (Reasoning + Acting) es un loop: razona, usa tools, observa, repite hasta resolver — con límites y salida al humano."
arc: Hook (ReAct ≠ React) → Es un loop → Tools al mundo → Reasoning + Acting (diagrama) → Límites de iteración → Cuándo sale → Ejemplo cita ambigua → Cierre
audience: builders / devs que empiezan con agentes
mode: collaborative
workflow: general-video
language: es
footage: assets/tiktok.mp4
captions: captions.srt
destination: tiktok
layout: cutaway-cards
angle: full-screen concept cards interleaved with talking-head (NO overlays on face)
---

# Storyboard — ReAct agents (talking-head + full-screen cards)

> **This video tells** builders **that** ReAct no es “React el framework”: es **Reasoning + Acting** — un loop donde el agente piensa, llama tools, observa el resultado y repite hasta resolver (o sale a pedirte más info), con un tope de iteraciones.

Base: talking-head `assets/tiktok.mp4` (1080×1920 @ 30fps, **96.53s**). El VO manda el pacing vía `captions.srt`.

**Layout hard rule (igual que `effects/`):** **cards a pantalla completa** — opacas, sin talking-head detrás, sin lower-thirds ni PiP sobre la cara. Se **alterna** `screen: footage` ↔ `screen: card` con whip / cut / match. El audio del MP4 sigue en ambos modos; en `card` el vídeo se oculta (muted picture, audio on).

Refs de animación: `assets/storyboard/react-architecture-pastel.jpg` (diagrama principal) + `assets/storyboard/react-graph-llm-tools.jpg` (vista “grafo”). El doc `storyboard_animaci_n_de_arquitectura_react.md` define el **orden de reveal** de nodos; aquí se **ancla a cues SRT reales**.

## Direction (todas las frames)

- **Ground / brand:** `frame.md` nicobytes — ink `#18181b` · paper `#fafafa` · slate `#27272a` · cyan `#06b6d4` · emerald `#10b981`
- **Chart pastel (diagrama ReAct):** Query pink · Thinking mint + brain · Tool grey + wrench · Answer yellow · flechas ink; tipografía legible 9:16 (no manuscrita ilegible)
- **Chart graph (opcional Frame 2):** nodes lavanda `#c4b5fd` / `#a78bfa` · labels continue/end grey — solo si ayuda el beat “es un loop”; no mezclar ambos estilos en la misma card
- **Captions:** solo en frames `footage`. En `card` labels viven **dentro** del diagrama
- **Holds:** estáticos (sin drift / breathing)
- **Breather:** Frame 2 — Thinking hub entra antes de saturar el loop
- **Callback:** el loop Thinking ⇄ Tool se planta en Frame 2–4 y se paga en 5–7 (límites + salida humana + ejemplo)
- **Negativos:** no overlay sobre la cara · no purple AI glow genérico sobre paper · no JPG landscape full-bleed · no `Math.random()` · no loop infinito en GSAP · no inventar VO

## Asset ledger

| ID | Archivo | Uso |
| ---- | -------- | --- |
| `A-footage` | `assets/tiktok.mp4` | Talking-head base (todo el runtime de audio) |
| `A-srt` | `captions.srt` | Timing + guía de VO |
| `A-ref-pastel` | `assets/storyboard/react-architecture-pastel.jpg` | Topología + colores Query/Thinking/Tool/Answer |
| `A-ref-graph` | `assets/storyboard/react-graph-llm-tools.jpg` | Topología `__start__` / `llm` / `tools` / `__end__` |
| `C-title-react` | HTML tipográfico | “ReAct” ≠ React · Reasoning and Acting |
| `C-loop-hub` | HTML diagrama parcial | Thinking + arco de loop (sin Answer aún) |
| `C-tools` | chips + nodo Tool | archivos · DB · calendar · cita |
| `C-diagram-build` | HTML diagrama vivo | Query → Thinking → Action → Tool → Observation |
| `C-max-n` | badge / counter | max 100 / 50 / 10 iteraciones |
| `C-exit` | ramas Finish + Human | terminó tarea **o** necesita más info de ti |
| `C-query-cita` | Query chip concreto | “agéndame una cita” + slots faltantes |
| `C-answer` | nodo Answer | payoff final del walkthrough |

### Diagrama canónico (`C-diagram-*`) — nodos a construir en HTML

Misma topología que `A-ref-pastel`, adaptada a 9:16 (apilar vertical, márgenes generosos):

```
        [Q] Query
            ↓
      ◆ Thinking (brain)
     ↙ Action          Finish ↘
  [Tool]                      [Answer] [A]
     ↖ Observation ───────────◆
```

**Tratamiento 9:16:** un nodo activo a la vez (glow / stroke cyan o emerald); flechas se dibujan (stroke-dashoffset) al ritmo del VO; el loop Action→Observation puede dar **1–2 vueltas** visuales, nunca un cycle infinito.

---

## Frame overview

| Frame | Beat | Screen | On screen | Why |
| ----- | ---- | ------ | --------- | --- |
| 01 — ReAct ≠ React | hook · 0.0–8.1s | footage | Cara + captions | Planta nombre y “no es React” |
| 02 — Es un loop | thesis · 8.1–18.8s | **card** | Thinking + loop pulse | “objetivo → se queda en el loop” |
| 03 — Tools al mundo | mechanism · 18.8–33.1s | **card** | Tool + chips | Archivos / DB / calendar |
| 04 — Reasoning + Acting | diagram · 33.1–48.1s | **card** | Build Query→…→Observation | Explica el nombre + 1 ciclo |
| 05 — No infinito | guardrail · 48.1–63.0s | **card** | Loop + max N | Tokens / 100·50·10 |
| 06 — Cuándo sale | branch · 63.0–75.4s | **card** | Finish **o** Human | Exit conditions |
| 07 — Ejemplo cita | walkthrough · 75.4–94.5s | **card** | Query cita → ask → loop → Answer | Caso concreto del VO |
| 08 — Cierre | landing · 94.5–96.5s | footage | Cara + caption final | “este es el patrón ReAct” |

---

## Frame 1 — ReAct ≠ React (hook)

- scene: Talking-head — patrones de agentes; se llama ReAct, no es React; Reasoning and Acting
- duration: 8.12s
- poster: 2.5s
- transition_in: cut
- status: outline
- screen: footage
- voiceover: "Te voy a enseñar los patrones más sencillos pero poderosos de los agentes y este se llama React y no es de React y es de Reasoning and Active."
- src: compositions/frames/01-hook.html
- footage_range: 0.00–8.12
- srt_cues: 1–4

**Inserts**

| t (abs) | Pieza | Tipo | Notas de animación |
| ------- | ----- | ---- | ------------------ |
| 0.08 | Caption cues 1–2 | caption | “patrones… agentes” |
| 4.08 | Caption “se llama React” | caption | Cue 3 — hold breve |
| 5.5 | Kinetic emphasize **≠ React** (solo caption/rail, sin card) | caption | Aclaración del chiste del nombre |
| 7.04 | “Reasoning and Acting” | caption | Cue 4 (VO dice “Active” → on-screen **Acting**) |
| 7.9 | Hold | hold | Whip a card del loop |

**Transición out → Frame 2:** `whip` (cara → card opaca) · 0.3s

**Layout:** footage full-bleed; **sin** overlays gráficos (solo captions).

**ASR fix on-screen:** Acting (no “Active”).

---

## Frame 2 — Es un loop (thesis)

- scene: Card full-screen — el poder del patrón es el loop hasta lograr el goal
- duration: 10.68s
- poster: 3s
- transition_in: whip
- status: outline
- screen: card
- voiceover: "Lo que hace poderoso a este patrón es que básicamente es un loop… tú le das un objetivo y él se queda en ese loop hasta que lo logre, hasta que resuelva esa tarea."
- src: compositions/frames/02-loop.html
- footage_range: 8.12–18.80
- srt_cues: 5–10

**Inserts**

| t (abs) | Pieza | Tipo | Notas de animación |
| ------- | ----- | ---- | ------------------ |
| 8.12 | Título card “Es un loop” / `C-loop-hub` | animación | Paper bg; ◆ Thinking + brain pop |
| 9.88 | Caption beat “es un loop” | beat | Cue 6 — stroke del arco circular (1 vuelta suave) |
| 12.80 | Chip **Goal** entra arriba del hub | animación | “objetivo” (cue 8–9) |
| 16.56 | Pulse “hasta que lo logre / resuelva” | animación | Cue 9–10 — hub glow emerald |
| 18.5 | Hold | hold | Match a tools |

**Opción visual A (recomendada):** diagrama pastel parcial (solo Thinking + arco).  
**Opción B:** `A-ref-graph` simplificado (`llm` ⇄ `tools`) si el pastel aún se siente vacío — **elegir una**, no ambas.

**Transición out → Frame 3:** `match-cut` · 0.25s (mismo hub; aparece Tool)

**Layout:** **100% card** — footage hidden; audio continues.

---

## Frame 3 — Tools al mundo exterior

- scene: Card — sin tools no hay mundo real; archivos, DB, calendar, cita
- duration: 14.32s
- poster: 4s
- transition_in: match-cut
- status: outline
- screen: card
- voiceover: "…tienen que tener unas tools para poder salir al mundo exterior… archivos, bases de datos, a tu calendar… agendar una cita… con esas herramientas resuelve."
- src: compositions/frames/03-tools.html
- footage_range: 18.80–33.12
- srt_cues: 11–18

**Inserts**

| t (abs) | Pieza | Tipo | Notas de animación |
| ------- | ----- | ---- | ------------------ |
| 18.92 | Flecha **Action** dashed → nodo **Tool** + wrench | animación | Dibujo de línea; Tool pop |
| 20.64 | Label “mundo exterior” | label | Cue 12 |
| 23.12 | Chip **archivos** | chip stagger | Cue 13 |
| 25.36 | Chip **bases de datos** | chip | Cue 14 |
| 26.40 | Chip **calendar** | chip | Cue 15 |
| 28.60 | Chip **agendar cita** | chip | Cue 15–16 — cyan accent en activo |
| 30.00 | Micro “herramientas → resuelve” | beat | Cue 17–18 |
| 32.8 | Hold | hold | Preparar reveal del nombre |

**Transición out → Frame 4:** `whip` corto · 0.25s (reset composición → build completo)

**Layout:** 100% card. Tool dominante; Thinking queda pequeño arriba como ancla.

---

## Frame 4 — Reasoning + Acting (build del diagrama)

- scene: Card — el nombre es Reasoning luego Acting; Query → Thinking → Action/Tool → Observation; ejemplo “escribir un correo”
- duration: 15.00s
- poster: 4s
- transition_in: whip
- status: outline
- screen: card
- voiceover: "Ese nombre React literalmente es Reasoning… razona las tools y el goal… y luego actúa… le propones un objetivo… escribir un correo… se queda en ese loop."
- src: compositions/frames/04-reasoning-acting.html
- footage_range: 33.12–48.12
- srt_cues: 19–26

**Inserts**

| t (abs) | Pieza | Tipo | Notas de animación |
| ------- | ----- | ---- | ------------------ |
| 33.12 | Wordmark **Reasoning** sobre Thinking | animación | Cue 19 — brain pulse |
| 35.64 | “tools + goal” labels | animación | Cue 20–21 |
| 39.52 | Wordmark **Acting** + flecha Action | animación | Cue 22 |
| 41.28 | **Query** “escribir un correo” (o genérico Goal) | animación | Cue 23–25 — Query pink entra arriba |
| 43.16–47.5 | **1 ciclo** Action → Tool → Observation → Thinking | animación | Cue 26 — “se queda en ese loop”; 1–2 vueltas max |
| 47.8 | Hold con diagrama casi completo (sin Answer aún) | hold | |

**Transición out → Frame 5:** `cut` · 0s (mismo diagrama; cambia énfasis a límites)

**Layout:** 100% card. Diagrama `C-diagram-build` centrado vertical.

---

## Frame 5 — No se puede quedar infinito

- scene: Card — restricciones fijas: tokens; max ~100 / 50 / 10 iteraciones
- duration: 14.92s
- poster: 3.5s
- transition_in: cut
- status: outline
- screen: card
- voiceover: "Obviamente con restricciones… no se puede quedar infinito porque consume muchos tokens… límite… 100 veces… 50… 10 veces máximo."
- src: compositions/frames/05-max-iterations.html
- footage_range: 48.12–63.04
- srt_cues: 27–35

**Inserts**

| t (abs) | Pieza | Tipo | Notas de animación |
| ------- | ----- | ---- | ------------------ |
| 48.12 | Badge **restricciones** | animación | Cue 27–28 |
| 51.84 | Icon / label **tokens** | animación | Cue 29–30 — dim del loop |
| 54.60 | Counter UI `max N` | animación | Cue 31 |
| 56.88 | Step **100** | count | Cue 32 |
| 60.20 | Step **50** | count | Cue 33 |
| 61.28 | Step **10** highlight | count | Cue 33–34 — emerald punch |
| 62.7 | Hold “no infinito” | hold | Cue 35 |

**Transición out → Frame 6:** `match-cut` · 0.3s (aparece rama Finish / Human)

**Layout:** 100% card. Loop sigue visible; counter es el foco.

---

## Frame 6 — Cuándo sale del ciclo

- scene: Card — sale porque terminó **o** porque necesita más información de ti (tarea ambigua)
- duration: 12.32s
- poster: 3s
- transition_in: match-cut
- status: outline
- screen: card
- voiceover: "…la gente también decide cuándo debe salir… porque ya terminó la tarea o porque necesita más información de ti… tarea muy ambigua."
- src: compositions/frames/06-exit.html
- footage_range: 63.04–75.36
- srt_cues: 36–41

**Inserts**

| t (abs) | Pieza | Tipo | Notas de animación |
| ------- | ----- | ---- | ------------------ |
| 63.04 | Bifurcación desde Thinking | animación | Dos dashed paths |
| 66.48 | Rama **Finish → Answer** (preview tenue) | animación | Cue 38 “ya terminó” |
| 69.60 | Rama **Human / Ask user** | animación | Cue 38–40 — chip “más información de ti” |
| 73.44 | Label **tarea ambigua** | label | Cue 41 |
| 75.0 | Hold | hold | Preparar ejemplo |

**Transición out → Frame 7:** `whip` · 0.25s (Query concreto reemplaza genérico)

**Layout:** 100% card. Answer aún no “entregado”; Human path es el énfasis.

---

## Frame 7 — Ejemplo: agéndame una cita

- scene: Card walkthrough — calendar + goal pero faltan detalles → sale a ti → vuelve al loop → resuelve
- duration: 19.12s
- poster: 5s
- transition_in: whip
- status: outline
- screen: card
- voiceover: "Por ejemplo, agéndame una cita… tiene calendar y el goal, pero no se sabe de qué, ni a qué horas… puedes salir a ti… más especificaciones y luego volver… loop hasta que resuelva."
- src: compositions/frames/07-appointment.html
- footage_range: 75.36–94.48
- srt_cues: 42–51

**Inserts**

| t (abs) | Pieza | Tipo | Notas de animación |
| ------- | ----- | ---- | ------------------ |
| 75.36 | **Query** `C-query-cita`: “agéndame una cita” | animación | Cue 42 — pop Query |
| 77.68 | Tool **calendar** activo + Goal check | animación | Cue 43–44 |
| 79.64 | Slots faltantes ❌ qué / ❌ hora / ❌ detalle | animación | Cue 44–46 — stagger |
| 84.96 | Path **Ask user** highlight | animación | Cue 47–49 |
| 89.52 | Return arrow → Thinking; **1 ciclo** corto | animación | Cue 49–50 |
| 91.80 | Flecha **Finish** + **Answer** `C-answer` | animación | Cue 50–51 — payoff |
| 94.1 | Hold diagrama completo | hold | |

**Transición out → Frame 8:** `whip` (card → cara) · 0.3s

**Layout:** 100% card. Este frame **completa** el diagrama del storyboard de animación (Escenas 2–7 del md de referencia), sincronizado al ejemplo real del VO.

---

## Frame 8 — Cierre

- scene: Talking-head — “Y este es el patrón React en los agentes.”
- duration: 2.05s
- poster: 1s
- transition_in: whip
- status: outline
- screen: footage
- voiceover: "Y este es el patrón React en los agentes."
- src: compositions/frames/08-close.html
- footage_range: 94.48–96.53
- srt_cues: 52

**Inserts**

| t (abs) | Pieza | Tipo | Notas de animación |
| ------- | ----- | ---- | ------------------ |
| 94.48 | Caption final | caption | “patrón ReAct en los agentes” |
| 96.2 | End hold | hold | Fade / hard out |

**Layout:** footage full-bleed; solo captions. (Opcional post-go: sting 0.4s del diagrama completo — solo si no roba el cierre.)

---

## Timing map (SRT → screen)

| t | Screen | Idea en pantalla |
| - | ------ | ---------------- |
| 0.0–8.1 | footage | Hook + ReAct ≠ React |
| 8.1–18.8 | card | Loop / Thinking hub |
| 18.8–33.1 | card | Tools + chips mundo real |
| 33.1–48.1 | card | Reasoning → Acting + 1 ciclo |
| 48.1–63.0 | card | Max iterations |
| 63.0–75.4 | card | Finish vs Ask user |
| 75.4–94.5 | card | Walkthrough “agéndame una cita” |
| 94.5–96.5 | footage | Cierre |

## Open decisions (confírmalos con el go)

1. **Frame 2 look:** ¿pastel Thinking-hub (A) o grafo `llm`/`tools` (B)?
2. **ASR on-screen:** ¿forzamos “ReAct” / “Acting” aunque el audio diga “React” / “Active”?
3. **Frame 8:** ¿solo cara, o cara + flash 0.4s del diagrama completo?

---

## Next (después de tu go)

1. Scaffold `compositions/frames/01–08.html` + `index.html` cutaway (patrón `videos/effects`)
2. HTML vivo del diagrama (no JPG full-bleed)
3. Captions solo en footage frames
4. `npm run check` → preview Studio → render solo con aprobación
