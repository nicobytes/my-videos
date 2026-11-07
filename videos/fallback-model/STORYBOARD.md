# STORYBOARD — fallback-model

Video vertical (1080×1920 de salida) sobre el talking head `fallback.mp4` (90 s, 2160×3840, con audio).
El video original no se modifica: los gráficos van encima, sincronizados con la transcripción.

**Ruta propuesta:** `/talking-head-recut` (overlays sobre footage existente).
Alternativa: `/motion-graphics` para piezas cortas aparte (los bloques de código de `concept.md` como clips de 5–8 s).

**Insumos**
- `fallback.mp4`: talking head, 90.2 s.
- `captions.srt` (= `20.LosmodelosdeGoog.srt`): transcripción completa según el autor. Tiene 51 bloques y el último termina en 0:30,16. Del 0:30 al 1:30 no hay texto hablado en el SRT.
- `concept.md`: explicación de `FallbackModel` (fuente: docs de `google/adk-python`).
- `hero_tools_make_an_agent.max-2500x2500.png`: ilustración de agente con herramientas, base de datos, servidor y código.
- `503_error.jpeg`: captura del error `503 UNAVAILABLE` en la UI de ADK.

---

## Parte A — Transcrito (0:00 – 0:30)

Fuente: `captions.srt`. Los tiempos son los del SRT.

| # | Tiempo | Texto del talking head | Overlay | Notas |
|---|--------|------------------------|---------|-------|
| 1 | 0:00 – 0:05 | "Los modelos de Google se han estado cayendo… agentes que tengo corriendo en producción." | Título kinético: **"Google se está cayendo"** | Entrada rápida, sin esperar a la frase completa. |
| 2 | 0:05 – 0:12 | "Miren, este es el error… un 503… alta demanda, no responde directamente." | Tarjeta con `503_error.jpeg` + resaltado de "503 UNAVAILABLE" y "high demand" | Pantalla en tercio superior; el rostro queda libre. |
| 3 | 0:12 – 0:19 | "Esto me pasa frecuentemente… mis agentes se quedan mudos, nadie responde." | Etiqueta **"AGENTE MUDO"** + contador de reintentos subiendo | Reintentos que saturan: las barras crecen con el texto. |
| 4 | 0:19 – 0:24 | "Haciendo un fallback del modelo. Hay varias formas de hacerlo." | Título: **"FallbackModel"** + `hero_tools_make_an_agent` en esquina | El hero aparece como marca del concepto. |
| 5 | 0:24 – 0:30 | "Si el primario no responde, va a otro modelo… más bajito, que no esté saturado." | Diagrama 2 tarjetas: **Primario → Respaldo** con flecha de 503 y ruta alterna | Anima el flujo de `concept.md` §3. |

---

## Parte B — Sin transcripción (0:30 – 1:30)

El SRT no tiene voz después de 0:30. El audio del archivo sigue con sonido continuo en ese tramo (sin silencios de más de 1,5 s), pero no sé si es voz, música o ambiente. Los overlays de esta parte se basan en `concept.md`, no en la transcripción, y su tiempo es tentativo hasta confirmar qué se escucha ahí.

| # | Tiempo (tentativo) | Tema | Overlay propuesto | Bloque de `concept.md` |
|---|--------------------|------|-------------------|------------------------|
| 6 | 0:30 – 0:40 | Google ADK ya trae el fallback, experimental | Insignia **"Experimental"** + logo/nombre ADK | §11 (limitaciones) |
| 7 | 0:40 – 0:50 | Código mínimo de `FallbackModel` | Bloque de código con `models=[...]` (resalta línea por línea) | §2 |
| 8 | 0:50 – 1:00 | Qué códigos cambian de modelo | Lista `{429, 500, 502, 503, 504}` que se ilumina | §4.1 |
| 9 | 1:00 – 1:10 | Personalizar la lista | Código `retriable_status_codes` | §4.3 |
| 10 | 1:10 – 1:20 | Respaldo con configuración propia | Código con instancia `Gemini(...)` | §5 |
| 11 | 1:20 – 1:30 | Streaming: punto sin retorno | Línea de tiempo con "primer chunk" | §7 |

---

## Parte C — Cierre (1:30 – 1:30)

El video dura 90 s, así que el cierre queda en el último segundo. Ajustar cuando se tenga la transcripción.

| # | Tiempo | Overlay | Notas |
|---|--------|---------|-------|
| 12 | 1:25 – 1:30 | Callback de plan B: **"Every model is unavailable; try again."** | §9. Cierra con la idea clave: el agente no se queda mudo. |

---

## Estilo

- Fondo de overlays: blanco y pastel del hero (azul `#D2E3FC`, verde `#CEEAD6`, rojo `#FAD2CF`, amarillo `#FEF0C3`). Texto azul oscuro.
- Tipografía: sans-serif redondeada. Títulos grandes, texto de código en monoespaciada.
- El talking head ocupa el encuadre completo; los overlays se mantienen en el tercio superior o inferior, sin tapar el rostro.
- Entradas con movimiento que se ve natural (sin rebotes). Cada overlay vive lo que dura su frase.
- Opcional, para la parte de animación: trazos de p5.brush para subrayar "503" y "mudo", con la capa de `src/brush-layer.js`.

---

## Decisiones pendientes

1. **Ruta:** ¿`/talking-head-recut` (overlays sobre el video) o piezas `/motion-graphics` aparte?
2. **0:30 – 1:30:** ¿qué se escucha ahí (voz, música, silencio o ambiente)? Si hay voz, la transcribo; si no, esa parte va solo con visuales.
3. **Idioma de los textos en pantalla:** ¿se queda en español, o hay una versión en inglés?
