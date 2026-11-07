---
workflow: general-video
flow: companion
storyboard: no
message: "De los 9 pedidos de Be Unique, 6 ya están atendidos y 3 necesitan su respuesta"
destination: youtube
aspect: 1920x1080
language: es
audience: "Jose y el equipo de Be Unique Estética (cliente de Sofi / Parlana)"
length: 13min33s
angle: how-to
---

## Intent

Logline: el cliente envió una lista de 9 pedidos de cambio para Sofi; este video le responde uno por uno, en el orden de su propio documento. Al final debe sentir que su lista se atendió en serio: ve cada pedido marcado como resuelto, como nuevo o como pendiente de su respuesta, y sabe qué tiene que contestar. Tono cercano y directo: Nicolás hablando a cámara y mostrando la plataforma.

## Assets

- assets/display.mp4: grabación de pantalla (1920×1080, 60 fps, 17:34). Fuente original; no se usa directo.
- assets/webcam.mp4: cámara de Nicolás (HEVC 1920×1080, 30 fps). Fuente original.
- assets/mic.m4a: micrófono (48 kHz). Es la única pista de audio del video.
- assets/cut/{display,webcam}.mp4 y assets/cut/mic.m4a: las tres fuentes cortadas con `edl.json` (H.264, 30 fps, keyframe cada 1 s). Son las que usa la composición. Se regeneran con `scripts/build-edl.py` y `scripts/cut-media.py`.
- pedidos sofi.pdf: el documento del cliente (Be Unique, 19/10/2026, 9 pedidos). Da el orden de los capítulos, los títulos textuales y el look.
- assets/music/: candidatas bed-s1/2/3.wav (40 s) y la pista completa bed-full.wav, cada una con su .json (modelo, prompt, semilla).
- assets/fonts/: Cormorant Garamond (300/400/500) y Jost (400/500/600), las fuentes del PDF.
- transcript.json: transcript de la grabación original (Whisper large-v3-turbo, tiempos de fuente).

## Customizations

- Referencia de look: el PDF del cliente. Se toma su paleta (terracota #A4583A, café #5B4334, tinta #312A23, líneas beige), su tipografía (Cormorant Garamond Light + Jost) y su forma de tabla. No se toma ningún logo: el wordmark «BE UNIQUE» aparece solo como texto, igual que en su documento.
- Layout dinámico, con la cámara siempre presente: cuando Nicolás habla, la cámara es grande y al lado va la tarjeta del pedido; cuando hace algo en pantalla, la pantalla ocupa el cuadro y la cámara queda chica.
- La app móvil se grabó con DevTools (viewport en x 0–456, y 88–1068 de la pantalla): se recorta y va dentro de un mockup de celular.
- Corte: se quitan silencios, la navegación muerta y repeticiones claras; la voz va a velocidad natural. Cada corte de contenido está anotado en `scripts/build-edl.py` (FORCE_CUT).
- Sin zoom en pantallas o paneles que se estrenan (Integraciones, el panel «Ver detalles»): tienen que verse el menú lateral y la barra del panel con su X, para que el cliente sepa de dónde sale y cómo se cierra.
- Música de fondo (elegida de oído entre 3 semillas: opción 1): MusicGen `facebook/musicgen-stereo-large`, semilla 1, prompt «calm warm background music for a friendly software walkthrough, soft felt piano and gentle acoustic guitar, light airy pads, no drums, no vocals, steady and unobtrusive, 90 BPM». Generada de corrido a 816 s (`assets/music/bed-full.wav` + `.json`), normalizada a −30 LUFS (~14 dB bajo la voz) en `assets/cut/music.m4a`, con fade-in de 2 s y fade-out de 4 s. **Licencia: los pesos de MusicGen son CC-BY-NC 4.0 (no comercial). Este video va a un cliente: revisar antes de publicarlo.**
- Sin subtítulos.
- Valores por defecto de CLAUDE.md que este video anula: «algo nuevo cada 2-4 s» se relaja en las demos, donde la propia interfaz es el movimiento; los acercamientos marcan el ritmo.

## Notes

- Capítulos = los 9 pedidos del PDF, más intro y cierre con la lista marcada.
- Estados (según lo que dice Nicolás): 1 resuelto · 2 pregunta abierta · 3 por confirmar + nuevo: sincronización con Google Calendar · 4 revisado, falso positivo · 5 resuelto + nuevo: crear citas desde la app móvil · 6 necesitamos los mensajes (templates de Meta) · 7 resuelto · 8 resuelto (90 días, configurable) · 9 resuelto.
- Entregables: renders/new-features.mp4.
