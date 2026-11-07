# Review: new-features (respuesta a los 9 pedidos de Be Unique)

Duración: 812,6 s (13:33) a partir de 17:34 de grabación. 1920×1080, 30 fps, voz + música de fondo (MusicGen).

## Cómo está armado

- `scripts/build-edl.py`: detecta la voz sobre el micro (10 ms RMS) y quita pausas, más 8 cortes a mano (silencios de navegación y repeticiones), cada uno con su motivo. Escribe `edl.json`.
- `scripts/cut-media.py`: corta pantalla, cámara y micro con la misma EDL a `assets/cut/` (H.264, keyframe cada 1 s; la cámara venía en HEVC, que Chrome headless no decodifica). Micro normalizado a −16 LUFS / −1,5 dBTP.
- `scripts/film.py`: textos y tiempos (en segundos de la grabación original). `scripts/build-film.py` los mapea por la EDL y genera `index.html` y `compositions/`. **Volver a correrlo sobrescribe esos archivos**: los cambios de texto y tiempo van en `film.py`.

## Decisiones creativas

- El PDF del cliente es el hilo: cada pedido abre con su lista (el «ledger»), la fila resaltada da paso a la tarjeta del pedido y el veredicto se sella cuando Nicolás lo dice. El cierre es la misma lista con todos los sellos y los 3 pendientes resaltados cuando él los nombra.
- Look tomado del PDF: terracota #A4583A, Cormorant Garamond Light + Jost. La terracota se usa solo para lo que necesita respuesta del cliente (pedidos 2, 3 y 6) y para «Nuevo».
- Layouts: hablando → cámara grande con la tarjeta; demo → pantalla completa (sin la barra del navegador) con la cámara en círculo abajo a la izquierda; app móvil → recorte del viewport de DevTools dentro de un celular. La pantalla crece desde el lugar de la tarjeta.
- Acercamientos en las demos anclados a los cambios de escena reales de la grabación (ffmpeg scene > 0.06), no estimados a ojo.
- Sin zoom en Integraciones ni en el panel «Ver detalles» (pedido del usuario): tienen que verse el menú lateral y la barra del panel con la X.
- En los cortes de salto durante las partes habladas, la cámara alterna entre encuadre 1.0 y 1.12 (como mucho cada 2,5 s).
- Títulos de pedido con la ortografía corregida («Interpretación», no «Interpertacion»); descripciones resumidas a partir del texto del cliente.

## Qué se midió y qué solo se miró

- `hyperframes check`: 0 errores y 0 warnings (lint, runtime, layout, contraste).
- Duraciones: las tres fuentes cortadas miden 812,600 s; el corte de video coincide fotograma a fotograma con la fuente (verificado en 271,5 s).
- Voz conservada: en lo descartado quedan 8 ráfagas de ~0,1 s por encima de −27 dB (clics), 0,93 s en total.
- Audio: voz a −15,8 LUFS (picos −2,3 dBTP, con margen para la música); música a −30,7 LUFS. Mezcla voz + música medida offline como la arma la composición: −15,7 LUFS, −1,1 dBTP. **Medido, no escuchado** (la música la eligió Nicolás de oído entre 3 semillas). Las uniones de voz llevan fundidos de 8 ms; conviene escuchar un par de cortes.
- La música queda en silencio desde 801,3 s (MusicGen cerró antes y dejó una cola): termina en 801,2 s con fade-out de 4 s, y los últimos ~11 s son solo voz. La licencia de MusicGen es CC-BY-NC: revisar antes de publicar.
- Fotogramas revisados: cada escena, cada acercamiento ya asentado, tres transiciones cuadro a cuadro y una prueba de teléfono a 360 px.

## Render final

- `renders/new-features.mp4`: 302 MB, 812,6 s, 1920×1080 H.264 30 fps + AAC estéreo 48 kHz. Calidad `delivery`, frames de video extraídos en PNG; 27 min de render.
- Medido sobre el MP4: −15,7 LUFS integrados, −1,2 dBTP, sin clipping ni silencios. Hoja de contacto (1 cuadro cada 20 s) revisada: todas las escenas y la cámara presentes.
- `/tmp` es un tmpfs de 24 GB: la extracción en PNG lo llena. Renderizar con `HYPERFRAMES_EXTRACT_CACHE_DIR` y `TMPDIR` en el disco principal.

## Puntos débiles y qué haría con más tiempo

- La demo de Google Calendar dura ~4 min y alterna seguido entre la agenda y Google Calendar (sobre todo entre 449 s y 470 s de la fuente): ahí se queda sin zoom.
- A 360 px los textos de descripción (30 px) quedan al límite; los títulos, sellos y la lista se leen bien. Está pensado para verse en escritorio.
- La UI de la app móvil, a la escala del celular, se lee en escritorio pero no en un teléfono.
- No se escuchó el resultado: revisar que ningún corte se coma el final de una palabra (la detección conserva 0,12 s de margen por lado).

## Storylines que no se construyeron

Se siguió directo la estructura del documento del cliente (un capítulo por pedido); no se propusieron alternativas porque la respuesta punto por punto es el pedido.
