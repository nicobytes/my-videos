---
workflow: general-video
flow: companion
storyboard: yes
message: "El contexto que crece en cada conversación es lo que dispara la factura de tus agentes; compactarlo (resumir con un modelo ligero) la baja sin que el bot pierda memoria."
destination: reels-tiktok
aspect: 1080x1920
language: es
audience: "Desarrolladores que tienen agentes o bots de IA en producción (WhatsApp, chat) y pagan la API por tokens"
length: 93s
angle: narrative
---

## Intent

Logline: el espectador siente el dolor de una factura de API que sube sola y sale entendiendo por qué (el historial y las tool calls inflan el contexto) y cómo se corta: Context Compaction, configurado en Google ADK con `EventsCompactionConfig` y `LlmEventSummarizer`.

Tono: confesión de desarrollador ("me pasó a mí"), directo, técnico sin ser árido. El hook es visceral: "Cómo evitar que tus agentes de IA te dejen en quiebra 💸".

Estructura del usuario:

- Hook: el intro a cámara con el texto del hook en pantalla.
- Conflicto: la consola de Google Cloud con los costos altos.
- Contexto: el chat crece, las tool calls/skills inflan el contexto, más tokens = más factura.
- Mensaje: ingeniería de contexto → compactar → límite de tokens → un modelo ligero resume → la curva cae sin perder memoria → el código de ADK.
- Resultado: la facturación baja y las conversaciones mantienen calidad.
- Sin CTA: el video termina en "ya no está en alta" (pedido del usuario, 2026-10-22).

Estilo: **paper cut** (papel recortado), a partir de la imagen de referencia del sticker.

## Assets

- assets/footage/intro.mp4 (7,44 s, 1080×1920, con audio) — talking head; abre el video a pantalla completa con su propio audio. Subtítulos: assets/footage/intro.srt (palabras: assets/footage/intro.words.json).
- assets/vo/voiceover.mp3 (85,66 s) — voz en off; empieza después del intro y manda sobre todos los tiempos. Subtítulos: assets/vo/voiceover.srt (palabras: assets/vo/voiceover.words.json).
- assets/footage/working.mp4 (28,9 s, muted) — de espaldas frente a la consola de facturación de Google Cloud; el gráfico de barras se ve en el monitor desde ~8 s.
- assets/footage/keywork.mp4 (24,4 s, muted) — manos en el teclado, Google y documentación en los monitores: buscar la solución.
- assets/footage/watching-results.mp4 (42 s, muted) — de frente, mirando la pantalla, cara iluminada por el monitor: revisar resultados.
- assets/refs/paper-cut-sticker-ref.webp — referencia de estilo (solo estudio, no aparece).
- assets/refs/context-management-chart-ref.webp — referencia del gráfico de tokens (solo estudio, no aparece; se reconstruye).

## Customizations

- **Referencia paper cut (sticker):** se toma la gramática: cartulina morada con fibra, recortes con borde blanco grueso tipo sticker, cintas negras con mayúsculas condensadas blancas, sombra de papel levantado. No se toma su contenido (la persona, BEFORE/AFTER).
- **Referencia del gráfico de tokens:** se toma la idea (escalones por mensaje, picos por tool calls, umbral del 85 %, caída por summarization). No se toma el logo, la leyenda ni los números: el gráfico se reconstruye en papel y sus valores son ilustrativos.
- **Motion graphics (/motion-graphics, categoría charts):** la curva crece al ritmo de los mensajes de un mockup de chat tipo WhatsApp (sin logo), con picos en las tool calls, llega al límite, un modelo ligero resume y la curva cae.
- **Código en pantalla:** el snippet del usuario, verificado contra adk.dev/context/compaction, más la línea que define `my_summarizer` con `LlmEventSummarizer` (de la misma documentación). Zoom en `EventsCompactionConfig` y en `LlmEventSummarizer` cuando la voz los nombra.
- **Layouts:** pantalla completa del talking head (intro), split (motion arriba / footage abajo), broll al 100 % con voz, y motion al 100 %.
- **Subtítulos:** según shared/CAPTIONS.md (zona segura y techo de contenido en y≈1460), con piel paper cut en vez del pill oscuro por defecto. Se corrigen los nombres técnicos que el SRT transcribió mal (Google ADK, EventsCompactionConfig, LlmEventSummarizer).
- **Valores por defecto de CLAUDE.md anulados:** ninguno. Las fuentes propias del teléfono (Roboto) y del código (IBM Plex Mono) son parte de esos objetos, no fuentes de interfaz extra.

## Notes

- Audio: voz del intro (audio del clip) y voz en off (desde 7,3 s).
- Música (el usuario pidió opciones que sigan lo que se dice, 2026-10-22): MusicGen local, `facebook/musicgen-stereo-large`, 94 s, semillas 1, 2 y 3 → assets/music/track-s{1,2,3}.wav (prompts y parámetros en cada .json). Seis secciones ancladas a la voz: 0 s tensión incómoda · 18 s sube la tensión (tools, "explotar") · 33 s se aligera (búsqueda) · 50 s construye hacia el límite · 66 s apertura en "drásticamente" · 82 s resolución cálida. En el video va la semilla 1 a volumen 0,14 bajo la voz, hasta que el usuario elija de oído. **Licencia CC-BY-NC 4.0 (pesos del modelo): solo borrador; para publicar algo comercial, reemplazarla.**
- SFX de papel CC0 (Freesound vía Openverse) y de la biblioteca de media-use: assets/sfx/CREDITS.md. Un solo riser en todo el film, con su pico en la caída (66,0 s).
- Duración: la marca la voz (7,3 s de intro + 85,4 s de voz ≈ 93,2 s). Sin CTA.
- Beats: un cambio visible cada 2-4 s.
- Entregables: renders/context-compaction.mp4, portada (frame 0), hoja de contacto, prueba de teléfono a 360 px.
