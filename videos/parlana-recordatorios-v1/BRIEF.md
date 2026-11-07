---
workflow: general-video
flow: companion
storyboard: yes
message: "Por unos 14 centavos, un recordatorio por WhatsApp evita sillas vacías, y Parlana lo envía solo."
destination: reels-tiktok
aspect: 1080x1920
language: es
audience: "Dueños de consultorios y negocios con citas en Bolivia que atienden por WhatsApp"
length: 54s
angle: narrative
---

## Intent

Reel de Instagram para parlana.bo que ilustra el artículo
[¿Cuánto cuestan los recordatorios de citas por WhatsApp en Bolivia en 2026?](https://parlana.bo/blog/precio-recordatorios-citas-whatsapp-bolivia-2026/).
En palabras del usuario: "cuánto cuesta un recordatorio en BOB en WhatsApp y que los recordatorios reducen la inasistencia de citas".

La historia abre el reel ("el storytelling debe empezar contando la historia"): Ana, odontóloga, espera a su paciente Juan, que no llega. Ambos son ficticios.

Estructura del framework del usuario:
- Conflicto (0–3 s): hook sin saludo.
- Contexto (3–15 s): empatía y tensión.
- Mensaje (15–40 s): la solución y su valor.
- CTA (últimos 5 s): una sola llamada a la acción.

Ruta de origen: `/product-launch-video` en modo vender, ejecutada en companion.

## Assets

- assets/brand/parlana-logo.svg — marca oficial vigente de Parlana: burbuja verde #155B3F con un rayo (de la captura de parlana.bo, adoptada como icon_001). Va en la agenda, el cierre y el CTA.
- assets/fonts/fraunces-600.woff2, fraunces-700.woff2 — Fraunces (OFL): titulares y cifras de parlana.bo.
- assets/fonts/figtree-400/500/600/700.woff2 — Figtree (OFL): texto y UI de parlana.bo.
- assets/vo/voice.wav — PENDIENTE: voz en off grabada por el usuario a partir de SCRIPT.md. Manda sobre los tiempos.
- assets/music/track.wav — **elegida por el usuario (2026-10-16):** borrador b-tension-a-calido, semilla 2, de scripts/musicgen.py (facebook/musicgen-stereo-large, fp16). Prompt tenso hasta los 15,6 s y cálido desde "La solución es simple"; 100 BPM; detalles en assets/music/track.json y beats en assets/music/beats.json. Va como cama bajo la voz, con voiceover carve (strength 0.8) contra el grupo "voiceover". Licencia de los pesos CC-BY-NC 4.0: para publicar, evaluar reemplazarla por una pista con licencia comercial.
- refs/twoclipping-ui-morph.mp4 — referencia visual de @twoclipping. Solo para estudio; no aparece en el video.
- capture/, capture-blog/ — capturas de parlana.bo (calculadora y artículo). Sirven solo para verificar la marca y para reconstruir el mock de chat y el gráfico del blog. La calculadora NO aparece en el video.

## Customizations

- **Referencia (UI morph de @twoclipping).**
  - Se toma la gramática: una sola forma que nunca corta, un elemento compartido que sobrevive de un estado al siguiente, contenido que cambia detrás de un blur, un cursor que provoca cada cambio, springs con overshoot mínimo y un solo acento.
  - No se toma su contenido (Generate, reproductor, paleta de comandos).
- **Subtítulos karaoke** según shared/CAPTIONS.md, con el estilo de frame.md.
- **SFX de UI** sintetizados con scripts/sfx.mjs (click, tick, pop, thump, chime, whoosh).
- **Música:** la pista elegida se midió con scripts/beats.py: 5 morphs ya caían a ±60 ms de un beat y los morphs 7–9 se movieron al beat (±0,13 s, solo la forma; el contenido sigue a la voz). Los morphs se ajustan al beat solo si queda a ±150 ms de su palabra. La música se baja bajo la voz con voiceover carve (/hyperframes-audio).
- **Componentes candidatos del registry** (se instalan en la etapa 3 y se reestilan con frame.md): text-state-swap, chat-message, number-wheel, count-up, animated-bar-chart, toggle-flip.

## Notes

- **CTA único:** "Comenta CITAS" → por DM le muestras cómo funciona Parlana. Línea: "¿Quieres que no te pase lo de Ana? Comenta CITAS y te muestro cómo." Alguien (o el agente) tiene que responder esos DMs.
- **Sin calculadora** (pedido del usuario, 2026-10-16): la calculadora de parlana.bo no es el CTA ni aparece en ningún frame.
- **Datos solo del blog:**
  - US$0,0113 ≈ Bs 0,14 por mensaje de utilidad.
  - 500 recordatorios ≈ Bs 71,42.
  - Un aviso baja las inasistencias 5–10 puntos; BMJ Open 2016: 21 % → 15 %.
  - Una oferta convierte el aviso en marketing.
  - El "Bs 0,94" de marketing lo muestra el propio blog bajo su mock del mensaje de marketing ("Bs 0,94 por mensaje"). **Confirmado por el usuario** (2026-10-16): "es clave para mostrar la diferencia entre mensaje de marketing y de utilidad". Va en el frame 10 (Bs 0,14 → Bs 0,94) y en la voz de la línea 9.
- **Marca verificada con la captura (2026-10-16):** parlana.bo usa hoy Fraunces y Figtree, el verde #155B3F y el fondo #F6F4EF. Reemplaza lo que decía videos/parlana-spa/frame.md (Plus Jakarta Sans, #00BD4C), que quedó desactualizado.
- **Mensajes de ejemplo del blog**, que se usan tal cual: "Recordatorio: tu cita es mañana a las 10:00." y "Aprovecha 20% de descuento en tu próxima visita." Encabezado del chat: "Tu consultorio · en línea".
- **Evidencia mixta** (el propio blog lo dice): no afirmar que WhatsApp en particular causa el efecto.
- **Uso de HyperFrames:** desconocido al 2026-10-16 (`usage --json` → `unsupported_auth`).
- **Voz grabada (2026-10-16):** `assets/audio.mp3` (original), procesada a `assets/vo/voice.wav` (mono 48 kHz, −16 LUFS) y transcrita con whisper large-v3. Decisiones del usuario sobre la toma:
  - El "Puff" del inicio es intencional y va en los subtítulos.
  - Dice "con nuestros agentes" en vez de "Con Parlana": se queda así (el logo de Parlana está en pantalla en ese momento).
  - No hizo la pausa después de "el día antes": se abrió 1 s de silencio en la edición (a los 18,70 s), así el clic en Confirmar ocurre sin voz encima. La toma sin la pausa queda en `assets/vo/voice-nopause.wav`.
  - Duración final: 53,75 s.
- **Guion v2 (2026-10-16, del usuario):** reemplaza a la v1 (que queda en SCRIPT-v1.md y renders/parlana-recordatorios-v1.mp4).
  - Cambios de fondo: habla a "tu cliente" y a cualquier negocio con citas (ya no a Ana y su paciente); dos recordatorios (el día anterior y unas horas antes); "con Bs 1, hasta 7 recordatorios"; Parlana también responde consultas y agenda.
  - Salen del guion: "1 de cada 5", los dos estudios (5–10 puntos), 500 recordatorios = Bs 71 y la comparación utilidad/marketing (Bs 0,14 → Bs 0,94).
  - Duración estimada con el ritmo del usuario: ~87 s (el guion dice ~70 s). La voz manda.
  - "Bs 1 = 7 recordatorios" lleva una nota en pantalla, según la nota de producción del usuario: costo de Meta por mensaje de utilidad (≈ Bs 0,14); no incluye el servicio de Parlana.
