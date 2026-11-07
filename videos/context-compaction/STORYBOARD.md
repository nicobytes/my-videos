---
format: 1080x1920
duration: 93.2s
message: "El contexto que crece dispara la factura; compactarlo (un modelo ligero lo resume) la baja sin perder memoria"
arc: Hook → Conflicto (factura) → Contexto (chat + tokens) → Mensaje (compactar, límite, caída, ADK) → Resultado (factura real baja)
audience: devs con agentes/bots de IA en producción
look: paper cut — cartulina #493A80, papel #F6F2E8, cinta negra, sticker blanco, acento #FFC72C
---

Tiempos globales. La voz en off arranca en 7.30 s (t_global = t_vo + 7.30). Layouts:
**FULL** = footage a pantalla completa · **SPLIT** = motion arriba (y 250–940) / footage abajo
(y 980–1920, borde rasgado) · **MOTION** = escena de papel a pantalla completa.
Subtítulos karaoke en papel en todos los frames con voz (zona y 1440–1580). Sin CTA al final.

Tablero con stills: boards/storyboard.html. Confirmado por el usuario (2026-10-22): release el 13 oct; el código queda tal cual (`compaction_interval=3`); música generada con MusicGen siguiendo la voz (3 opciones, va la 1 hasta que elija).

## Frame 1 — Hook (0.0-3.6s)

- act: Hook
- layout: FULL — intro.mp4 con su audio
- scene: Hablas a cámara; sobre el pecho, dos cintas negras ya pegadas en el frame 0: "CÓMO EVITAR QUE TUS AGENTES DE IA" / "TE DEJEN EN QUIEBRA", y un billete de papel con alas.
- voiceover: "Mis agentes de AI estaban costando más de lo normal y había un culpable."
- reads: hook completo en pantalla desde el frame 0 (0.0-3.4s); se arrancan las cintas en "culpable" (3.3-3.6s)
- sound: voz del intro; rip de papel al arrancar las cintas
- poster: 1.0
- status: animated
- src: compositions/intro.html

## Frame 2 — El culpable (3.6-7.4s)

- act: Hook
- layout: FULL — intro.mp4
- scene: Punch-in 1.0→1.15 en "Yo, obviamente". En "contexto" se pega una cinta amarilla "CONTEXTO" que se rasga hacia la consola.
- voiceover: "Yo, obviamente, que no estaba manejando bien el contexto."
- reads: punch-in en "Yo" (3.8s); "CONTEXTO" en amarillo (6.2-7.4s)
- sound: slap de cinta en "contexto"; rip a la siguiente escena
- poster: 6.8
- status: animated
- src: compositions/intro.html

## Frame 3 — La consola (7.4-12.0s)

- act: Conflicto
- layout: FULL → SPLIT — working.mp4 (desde 9.0 s de la fuente)
- scene: Te ves de espaldas frente a la consola; el monitor se vuelve el gráfico: tus barras de facturación de octubre (reconstruidas en papel) crecen día a día hasta el pico del 8 oct, marcado en amarillo.
- voiceover: "Así que me puse a ver mi Google Cloud Console y realmente los costos estaban bastante elevados."
- reads: consola (7.4-9.0s); barras 1-13 oct crecen (9.0-11.0s); pico 8 oct en amarillo + cinta "COSTOS ALTOS" (11.0-12.0s)
- sound: whoosh al abrir el split; tick por barra (pocas, rotadas)
- poster: 11.6
- status: animated
- src: compositions/consola.html

## Frame 4 — El chat crece (12.0-18.2s)

- act: Contexto
- layout: MOTION — escena hogar: teléfono arriba, gráfico de tokens abajo
- scene: Llegan los mensajes del pedido #4821 al chat; cada burbuja sube un escalón de la curva de tokens.
- voiceover: "¿Y esto por qué? Porque a medida que un usuario chatea con mi bot, mi agente de inteligencia artificial, el historial crece."
- reads: teléfono y tarjeta se pegan (12.0-12.6s); 4 burbujas = 4 escalones (13.7-17.2s); etiqueta "HISTORIAL" en la punta (17.2-18.2s)
- sound: pop suave por burbuja
- poster: 17.6
- status: animated
- src: compositions/chat.html

## Frame 5 — Tools y skills (18.2-25.3s)

- act: Contexto
- layout: MOTION — misma escena hogar
- scene: Salen fichas de papel del teléfono ("tool: buscar_pedido", "skill: politicas.md") y cada una dispara un pico; en "va y va y va" tres escalones rápidos; en "explotar" la curva toca el techo de la tarjeta.
- voiceover: "Y si tu agente usa herramientas, skills, el tamaño del contexto va y va y va en aumento y pues en algún momento va a explotar."
- reads: ficha tool + pico (19.3s); ficha skill + pico (20.3s); tres escalones (22.1-22.6s); la curva toca el techo (24.8s)
- sound: thump por pico; golpe en "explotar"
- poster: 24.9
- status: animated
- src: compositions/chat.html

## Frame 6 — La factura de la API (25.3-33.0s)

- act: Contexto
- layout: SPLIT — arriba recibo de papel / abajo watching-results (8.0–15.7 s de la fuente)
- scene: Un recibo "FACTURA API" se imprime: cada llamada reenvía todo el historial, así que cada renglón es más largo que el anterior. Abajo, tu cara frente a la pantalla.
- voiceover: "Más contexto significa más tokens y la factura de mi API se dispara y va aumentando. Me pasó exactamente eso con mis agentes."
- reads: renglones crecen (25.4-29.7s); sello amarillo "SE DISPARA" (29.0s); "ME PASÓ A MÍ" en cinta (30.5-33.0s)
- sound: tick de impresora por renglón; slap del sello
- poster: 31.0
- status: animated
- src: compositions/factura.html

## Frame 7 — Buscando (33.0-39.9s)

- act: Mensaje
- layout: FULL — keywork.mp4 (desde 7.5 s: Google en el monitor)
- scene: Tus manos buscan; en "ingeniería de contexto" se pega la cinta "INGENIERÍA DE CONTEXTO"; en "compactarlo" la cinta se comprime de lado.
- voiceover: "Así que buscando y demás, hay una práctica en lo que se llama ingeniería de contexto, que es justamente compactarlo"
- reads: footage (33.0-36.0s); cinta (36.1-38.8s); la cinta se comprime (38.8-39.9s)
- sound: slap de cinta; crunch de papel al comprimir
- poster: 37.6
- status: animated
- src: compositions/busqueda.html

## Frame 8 — Compactar (39.9-50.3s)

- act: Mensaje
- layout: MOTION
- scene: El historial del pedido #4821 como tiras de papel apiladas. Las de skills se cortan, las viejas se arrancan, el resto se prensa y se dobla en una tarjeta "RESUMEN: cambió el pedido #4821 · llega el jueves". Una regla muestra que la pila quedó mucho más baja.
- voiceover: "para que no sea tan grande, ahorrando todas las llamadas de skills, quitando toda la información vieja, lo va compactando, también lo va sumarizando y eso hace que quede más liviano."
- reads: pila completa (39.9-41.6s); skills cortadas (41.7-44.3s); viejas arrancadas (44.7-46.3s); prensa (46.4-47.7s); RESUMEN (47.8-50.3s)
- sound: tijera; rip; crunch; slap de la tarjeta
- poster: 48.6
- status: animated
- src: compositions/compactar.html

## Frame 9 — El límite (50.3-60.4s)

- act: Mensaje
- layout: MOTION — vuelve la escena hogar
- scene: El chat sigue; la curva sube hasta la línea amarilla punteada "LÍMITE 85 %"; entra una insignia de papel "gemini-flash · modelo ligero"; las burbujas del chat se doblan en la tarjeta RESUMEN.
- voiceover: "¿Cómo funciona? Cuando la conversación alcanza un límite de tokens, entra en acción un modelo un poco más ligero que lo que hace es resumir todos los eventos y todas las partes importantes de la conversación."
- reads: umbral se dibuja (53.2-53.9s); la curva lo toca (53.9s); insignia flash (54.9-56.0s); burbujas → RESUMEN (56.9-60.2s)
- sound: tick en el umbral; slap de la insignia; papel doblándose
- poster: 59.0
- status: animated
- src: compositions/limite.html

## Frame 10 — La caída (60.4-67.9s)

- act: Mensaje (payoff)
- layout: MOTION — escena hogar
- scene: El cliente pregunta "¿cuándo llega mi pedido?" y el bot responde "El jueves" (no perdió memoria). En "drásticamente" la curva cae del límite casi al piso: el momento más grande del video.
- voiceover: "Esto es importante porque con esto el bot no pierde memoria de lo que le estaban hablando, pero sí reduces drásticamente la carga de tokens."
- reads: pregunta + respuesta con check (62.4-64.8s); pausa de 0.4 s; la caída (66.0-66.6s); cinta "MENOS TOKENS" (66.6-67.9s)
- sound: pop de burbujas; riser corto en la caída (único en el film)
- poster: 66.8
- status: animated
- src: compositions/limite.html

## Frame 11 — Google ADK (67.9-73.0s)

- act: Mensaje
- layout: SPLIT — arriba tarjeta de código / abajo keywork.mp4 (desde 16 s: código en el monitor)
- scene: Una tarjeta de papel con el snippet de ADK se imprime línea por línea con la pestaña "Google ADK".
- voiceover: "Esto ya por defecto lo tienen habilitados varios frameworks. En el Google ADK tú lo habilitas utilizando…"
- reads: tarjeta entra (67.9-68.6s); líneas se imprimen (68.6-72.0s); pestaña "Google ADK" (71.0s)
- sound: ticks de tecla por línea
- poster: 72.0
- status: animated
- src: compositions/adk.html

## Frame 12 — Zoom al código (73.0-82.5s)

- act: Mensaje
- layout: SPLIT → MOTION — la tarjeta toma el cuadro
- scene: Zoom 1.9× a `EventsCompactionConfig` con resaltador amarillo; luego a `LlmEventSummarizer`; en "tu modelo" a `gemini-flash-latest`; en "tu umbral" a `compaction_interval=3`; en "automáticamente" vuelve al snippet completo.
- voiceover: "…EventsCompactionConfig y el LlmEventSummarizer. Le mandas tu configuración, tu modelo y tu umbral y él va a hacer esto automáticamente por ti."
- reads: EventsCompactionConfig (73.1-75.2s); LlmEventSummarizer (75.2-77.4s); modelo (78.3s); umbral (78.9s); snippet completo (80.2-82.5s)
- sound: whoosh corto por zoom (2 tomas alternadas)
- poster: 75.8
- status: animated
- src: compositions/adk.html

## Frame 13 — Resultados (82.5-90.2s)

- act: Resultado
- layout: SPLIT — arriba tus barras de facturación / abajo watching-results (17.0–24.8 s de la fuente)
- scene: Vuelve el gráfico real de octubre; bandera "RELEASE · 13 OCT" (fecha confirmada por el usuario); desde ahí las barras se quedan bajas. En "calidad", una burbuja del chat con check doble.
- voiceover: "Así que luego de implementar esta mejora, fui viendo los logs de facturación desde que implementé este nuevo release y las conversaciones siguen manteniendo calidad,"
- reads: barras 1-13 oct ya puestas (82.5-84.0s); bandera release (87.0s); barras 14-22 oct crecen bajas (84.4-87.6s); burbuja con check (87.7-90.2s)
- sound: tick por barra; pop de burbuja
- poster: 88.4
- status: animated
- src: compositions/resultados.html

## Frame 14 — La factura baja (90.2-93.2s)

- act: Resultado
- layout: MOTION — el gráfico toma el cuadro
- scene: El split se cierra; el gráfico toma el cuadro; resaltador amarillo sobre las barras después del release, flecha de papel del pico hacia ellas y cinta "MISMA CALIDAD, MENOS GASTO" (no repite la voz). Es el último frame: sin CTA (pedido del usuario).
- voiceover: "pero mi facturación ha bajado y ya no está en alta."
- reads: flecha del pico a las barras bajas (90.3-91.6s); resaltador y cinta (91.8-93.2s, último frame en pantalla)
- sound: whoosh del split; slap de la flecha
- poster: 92.2
- status: animated
- src: compositions/resultados.html
