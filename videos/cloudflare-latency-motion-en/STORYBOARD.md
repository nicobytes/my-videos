---
format: 1080x1920
duration: 164s
message: "El presentador explica edge computing a cámara; el video corta a pantalla completa a la simulación 3D real del round-trip exacto del que está hablando, y vuelve."
arc: Hook (talking head) → Problema (talking head) → Simulación GCP (animación) → Giro (talking head) → Simulación Cloudflare + payoff (animación) → Twist JS runtimes (talking head) → Ejemplo Hono (talking head) → CTA (talking head)
audience: devs que ya conocen cloud pero no edge computing
mode: collaborative
---

## Global notes (no son frames, son reglas de montaje)

- **Fuente única:** todo el picture viene de `edge.mp4` (1080x1920, 29.97fps, 163.70s) — ya está en el aspect ratio del canvas, sin crop.
- **Audio continuo:** un solo `<audio>` de `edge.mp4` de `data-start=0` a `data-duration≈163.7`, `data-media-start=0`, sin cortes — la voz off no se interrumpe nunca, ni siquiera durante las ventanas de animación.
- **Picture alterna, audio no.** Durante los frames "talking head" se muestra `<video>` (muted) de `edge.mp4` recortado a esa ventana (`data-media-start` = mismo timestamp que la ventana, porque no hay reordenamiento). Durante los frames "animación" el `<video>` simplemente no tiene clip en ese rango — se ve la sub-composición del mapa en su lugar — y el audio de `edge.mp4` sigue sonando por debajo como voz en off.
- **Transición por defecto: corte duro (cut), fotograma completo, sin overlay**, tal como lo pediste. No hay crossfade ni picture-in-picture entre persona y animación. Si después de ver el ensamblado sientes que el corte es muy seco, la alternativa de bajo costo es un "cut-the-curve" (zoom-through de ~0.15s) en los 2 cortes hacia animación — lo dejo anotado pero no lo aplico a menos que lo pidas.
- **La animación existente (`index.html`, 27s) se reparte en dos sub-composiciones nuevas**, cada una retimeada para llenar su ventana de narración exacta (ver `retime_factor` en cada frame). No se rediseña el mapa, la cámara, los arcos ni las stat cards — se extrae el código existente y se reescalan sus tiempos internos.
- **Logos (AWS/Azure/GCP, Hono, runtimes).** Las 3 cards (`card-clouds` Frame 2b, `card-runtimes` Frame 6b, `card-hono` Frame 7b) ya están construidas, mismo lenguaje visual que `scene-gcp`/`scene-cf`.
- **Sub-composiciones sin WebGL sí funcionan bien.** A diferencia de `scene-gcp`/`scene-cf` (que tuvieron que inlinearse en `index.html` por el bug de canvases WebGL en sub-composiciones), las 3 cards son HTML/CSS/imagen puro y sí se montan correctamente vía `data-composition-src`. Eso sí, ninguna sub-composición se oculta automáticamente fuera de su ventana (mismo hallazgo que con los globos) — cada card se autoapaga (`opacity`) escuchando `hf-seek` y comparando contra su propio `data-start`/`data-duration`, en vez de depender del host.

## Frame 1 — Hook

- status: outline
- layer: talking-head
- media: edge.mp4
- media_start: 0.08s
- duration: 5.6s
- narration_range: 0:00.08–0:05.68
- transition_in: cut (abre el video)
- scene: Presentador a cámara, hook directo
- voiceover: "¿Cómo puedes lograr que tus aplicaciones sean mucho más veloces? Pues vamos a introducir el término de Edge Computing."

Plano limpio a cámara, sin gráficos. Es la promesa del video — todo lo que sigue la paga.

## Frame 2a — El problema, parte 1 (deploy normal, proveedor)

- status: outline
- layer: talking-head
- media: edge.mp4
- media_start: 5.68s
- duration: 1.32s
- narration_range: 0:05.68–0:07.00
- transition_in: cut
- scene: Presentador arranca el modelo tradicional — "escoges tu proveedor"
- voiceover: "Normalmente tú cuando despliegas una aplicación, escoges tu proveedor,"

Micro-bloque de arranque, corta justo antes de nombrar los 3 proveedores.

## Frame 2b — Card: Cloud providers (AWS · Azure · Google Cloud)

- status: outline
- layer: card
- src: compositions/card-clouds.html (nuevo, vía /motion-graphics)
- assets: assets/logos/cloud-providers.png (fuente; se reconstruyen los 3 logotipos sobre el fondo oscuro del proyecto, no se pega el screenshot)
- duration: 5.6s
- narration_range: 0:07.00–0:12.60
- transition_in: cut
- scene: Corte a pantalla completa — los tres logos (AWS, Azure, Google Cloud) aparecen con el mismo lenguaje visual de las simulaciones (fondo #040816, glow de acento, tipografía Inter)
- voiceover: "Google Cloud, AWS, Azure, etcétera, y luego ahí te dan un panel de en qué región va a estar tu aplicación."

Card de motion graphics, no animación 3D — mismo estilo de entrada (power3.out / back.out) que `scene-gcp`/`scene-cf` para que no se sienta una pieza distinta.

## Frame 2c — El problema, parte 2 (región, latencia, réplicas)

- status: outline
- layer: talking-head
- media: edge.mp4
- media_start: 12.60s
- duration: 26.88s
- narration_range: 0:12.60–0:39.48
- transition_in: cut
- scene: Presentador continúa — región, latencia, réplicas, hasta el gancho de Edge Computing
- voiceover: "...ahí te dan un panel de en qué región va a estar tu aplicación. [región, latencia, réplicas] ...hay alguien que fue mucho más allá y a esto se le conoce como el Edge Computing."

Vuelve a talking-head para el resto del bloque conceptual — no necesita más apoyo visual.

## Frame 3 — Simulación: Google Cloud

- status: outline
- layer: animation
- src: compositions/scene-gcp.html (nuevo, a extraer de index.html)
- source_scene_ref: index.html Scene 1 (dots GCP, pin Cochabamba, arco → Bogotá, card1 39ms)
- duration: 14.8s
- narration_range: 0:39.48–0:54.28
- retime_factor: ×1.113 (natural ~13.3s → objetivo 14.8s; solo estirar constantes de tiempo, sin rediseñar)
- transition_in: cut
- scene: Corte a pantalla completa al globo 3D — 42 regiones de GCP aparecen, cámara baja a Cochabamba, pin, arco a Bogotá, card de distancia/latencia
- voiceover: "Entonces hagamos la simulación. Por ejemplo, estos son todos los puntos que tiene Google Cloud y si por ejemplo yo hago una petición desde la ciudad que estoy, Cochabamba, hasta por ejemplo el punto más cercano de Google Cloud, que sería un Bogotá o un Santiago de Chile, pues hay una latencia."

Corte disparado exactamente en "hagamos la simulación" — la frase es el cue verbal perfecto para el hard cut. Sin overlay de texto nuevo: el card de stats (Cochabamba→Bogotá, km/ms) ya existe en la animación actual y se conserva tal cual.

## Frame 4 — Giro: ¿y Cloudflare?

- status: outline
- layer: talking-head
- media: edge.mp4
- media_start: 54.28s
- duration: 8.72s
- narration_range: 0:54.28–1:03.00
- transition_in: cut
- scene: Vuelve el presentador para el giro retórico
- voiceover: "Eso es muy interesante, pero ¿sabías que Cloudflare y algunos otros proveedores tienen locaciones y puntos directamente casi por ciudad? Miremos el de Cloudflare."

Corte de vuelta a cámara para la pregunta — funciona mejor dicha por una persona que como texto en pantalla. Termina justo en "Miremos el de Cloudflare", el segundo cue verbal de corte.

## Frame 5 — Simulación: Cloudflare + payoff 11×

- status: outline
- layer: animation
- src: compositions/scene-cloudflare.html (nuevo, a extraer de index.html)
- source_scene_ref: index.html Scene 2 (dots Cloudflare, arco → La Paz, card2 3.5ms) + End card (barras 11×)
- duration: 12.52s
- narration_range: 1:03.00–1:15.52
- retime_factor: ×1.026 (natural ~12.2s → objetivo 12.52s; prácticamente sin retimear)
- transition_in: cut
- scene: Pantalla completa — 330+ ciudades de Cloudflare aparecen, arco Cochabamba→La Paz, card 3.5ms, y remata con las barras "11× lower latency" ya existentes
- voiceover: "Lawford tiene casi puntos por cada una de las ciudades de Latinoamérica. Eso hace que, por ejemplo, si yo me conecto desde Cochabamba, el punto más cercano cuál va a ser un servidor que ellos tienen en La Paz, por ende la latencia va a ser mucho menor."

Este frame absorbe también el end-card actual (11× / barras) como remate silencioso justo cuando la VO dice "la latencia va a ser mucho menor" — es la misma secuencia que ya existe en el archivo, solo re-escalada. El corte de vuelta a cámara queda alineado a inicio de oración (la siguiente línea es una pregunta nueva).

## Frame 6 — El twist: por qué Google/AWS no lo hacen (JS runtimes)

- status: outline
- layer: talking-head
- media: edge.mp4
- media_start: 75.52s
- duration: 59.68s
- narration_range: 1:15.52–2:15.20
- transition_in: cut
- scene: Presentador explica el porqué técnico — nodos complicados vs CDN liviano, y los nuevos runtimes JS (Deno, Bun, WinterJS, Cloudflare Workers)
- voiceover: "¿Y la pregunta es entonces por qué Google Cloud AWS no tienen los mismos puntos?... [CDN vs cómputo]... Pero gracias a los nuevos runtimes de JavaScript... se llaman Deno, Bun, WinterJS, hasta los Cloudflare Workers... tienes que sacrificar tecnología... Pero esto ya está pasando."

Bloque largo, sin corte a animación en la primera mitad. **Card construida:** 2:02.72–2:07.60 (host time 122.72–127.60, ~4.9s) nombra "Deno, Bun, WinterJS, Cloudflare Workers" — corte `th-6a` (75.52–122.72) → **card-runtimes** (122.72–127.60) → `th-6c` (127.60–135.20), grid 2×2 con los 4 logos reales que mandó el usuario.

## Frame 7a — Ejemplo: Hono, intro

- status: outline
- layer: talking-head
- media: edge.mp4
- media_start: 135.20s
- duration: 1.04s
- narration_range: 2:15.20–2:16.24
- transition_in: cut
- scene: Presentador introduce el ejemplo — "tenemos ejemplos como"
- voiceover: "Por ejemplo, tenemos ejemplos como"

Micro-bloque, corta justo antes de nombrar "Hono".

## Frame 7b — Card: Hono + runtimes soportados

- status: outline
- layer: card
- src: compositions/card-hono.html (nuevo, vía /motion-graphics)
- assets: assets/logos/hono.png (logo), assets/logos/hono-runtimes-grid.png (fuente del grid; se reconstruye con la tipografía/paleta del proyecto, no se pega el screenshot)
- duration: 5s
- narration_range: 2:16.24–2:21.24
- transition_in: cut
- scene: Corte a pantalla completa — logo de Hono seguido del grid de runtimes/plataformas soportadas (Cloudflare Workers, Deno Deploy, Bun, Vercel, etc.), mismo lenguaje visual que las simulaciones
- voiceover: "Hono, en el cual está escrito para que corran el runtime, para escribir API, sería como el Express para que corran este tipo de runtimes tan livianos,"

Card de motion graphics — logo con drop-in tipo `back.out(2)` seguido de un grid de tarjetas (mismo estilo `.card`/`--panel` que las stat cards de las simulaciones).

## Frame 7c — Ejemplo: Hono, resto (Diesel, frontend)

- status: outline
- layer: talking-head
- media: edge.mp4
- media_start: 141.24s
- duration: 14.56s
- narration_range: 2:21.24–2:35.80
- transition_in: cut
- scene: Presentador continúa — Diesel ORM, cualquier framework de frontend corre en el runtime
- voiceover: "...o Diesel, un ORM que también está pensado para este tipo de runtimes, o incluso cualquier framework de frontend por definición ya se puede correr en un runtime."

Vuelve a talking-head para cerrar el ejemplo — no necesita más apoyo visual.

## Frame 8 — CTA / cierre

- status: outline
- layer: talking-head
- media: edge.mp4
- media_start: 155.80s
- duration: 7.9s
- narration_range: 2:35.80–2:43.70
- transition_in: cut
- scene: Presentador cierra directo a cámara
- voiceover: "Así que la próxima vez puedes evaluar si de pronto tu proyecto ya puede correr en este tipo de y puedes ganar altas velocidades simplemente por desplegar ahí."

Cierre a cámara, sin gráficos — deja que la voz cierre el video igual que lo abrió.
