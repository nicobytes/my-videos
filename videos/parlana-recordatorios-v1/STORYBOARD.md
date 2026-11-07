---
format: 1080x1920
duration: 53.75s
message: "Por unos 14 centavos, un recordatorio por WhatsApp evita sillas vacías, y Parlana lo envía solo."
arc: "PAS · Conflicto → Contexto → Mensaje → CTA (framework del usuario)"
audience: "Dueños de consultorios y negocios con citas en Bolivia que atienden por WhatsApp"
mode: collaborative
music: "pista del usuario ~120 BPM (assets/music/track.wav, pendiente) como cama bajo la voz, con voiceover carve"
style: "frame.md: una sola forma que nunca corta, marca parlana.bo, gramática @twoclipping"
---

# Storyboard — parlana-recordatorios

Una sola forma recorre todo el reel. Cada frame arranca con la geometría con la que terminó el anterior (`handoff`), así que entre frames no hay transición inyectada: `transition_in: cut` es una costura invisible. Los tiempos son estimados; la grabación de la voz los reemplaza.

## Video direction

- **Una forma, una pista:** `compositions/shell.html` es la única superficie del reel (tarjeta, teléfono, disco, botón). Cambia de rect, radio y relleno con `clip-path: inset(… round r)` en cada corte (0,5 s, `power2.inOut`; `card-morph-anchor` con máscara en vez de width/height). Los frames solo traen contenido, sin superficie propia.
- **Cambio de contenido:** sale con blur en los últimos 0,18 s del frame y entra con blur 0,3 s después del inicio del morph (valores de `text-state-swap`). El frame 5 no sale: el 6 continúa el mismo chat.
- **Paleta por rol** (`frame.md`): neutro en Conflicto y Contexto; el verde `#155B3F` aparece por primera vez en el chip "Bs 0,14" (frame 4) y desde ahí significa resuelto. El ámbar solo marca Marketing y la serie de Buenos Aires. Nunca rojo.
- **Movimiento:** `power3.out` en entradas, sin rebote; solo los clics usan un resorte suave (`press-release-spring`, `back.out(1.4)`). Cada pieza se revela cuando la voz la nombra. Cámara quieta; la única deriva es la del fondo.
- **Ritmo:** el frame 8 (precio) es el respiro, un solo movimiento y quietud. El frame 6 es el beat sin voz (el clic).
- **Cursor:** una pista propia (`compositions/cursor.html`) que llega desacelerando antes de cada acción y hace tres clics (Confirmar, el toggle, el CTA). Al final vuelve a su posición inicial para cerrar el loop.
- **Tiempos:** cada frame tiene una tabla `CUE` (segundos locales); la forma, el cursor y los subtítulos usan tiempos globales. Al recibir la voz se recalibran esas tablas y los `data-start` de `index.html`.
- **Nunca:** degradados en la UI, glows, partículas, easing rebotón, `repeat` infinito, texto centrado sobre degradado, todo con fade-in, logos de terceros, la calculadora de parlana.bo.

## Frame 1: El hook (0.0–4.30s)

- act: Conflicto
- status: animated
- src: compositions/frames/01-hook.html
- duration: 4.3s
- poster: 2.8
- transition_in: cut
- scene: Un chip "10:00" se abre en una tarjeta de cita blanca; el reloj corre a 10:14 y la tarjeta se apaga con el sello "No llegó"
- voiceover: "Son las 10 de la mañana. Ana espera a su paciente, que nunca llega."
- type: hook
- persuasion: Pain validation
- beat: tension
- blueprint: cta-morph-press — Adapt (variante Hook: un widget solo sobre el campo vacío se transforma en su sitio)
- rules: card-morph-anchor, vertical-spring-ticker, spring-pop-entrance
- registry: text-state-swap
- on_screen: "HOY · 10:00" · "Consulta" · "Juan Pérez" · chip "Pendiente" → "10:14" → sello "No llegó"
- handoff: sale → el chip de hora "10:14" sobrevive como la hora de la burbuja del Frame 2
- sfx: tick por minuto (suave), thump en el sello

narrativeRole: abre en el dolor exacto del público, sin saludo ni contexto. keyMessage: tu paciente no llegó. El cursor solo flota sobre "Pendiente": todavía no hay nada que tocar.

## Frame 2: No avisó (4.30–6.10s)

- act: Contexto
- status: animated
- src: compositions/frames/02-silencio.html
- duration: 1.8s
- poster: 1.8
- transition_in: cut
- scene: La tarjeta se vuelve el teléfono del mock de chat de Parlana, todavía en gris: cabecera "Juan Pérez · últ. vez ayer" y la burbuja "Hola Juan, ¿vienes a tu cita?" con ✓✓; aparece "escribiendo…" y se va sin respuesta
- voiceover: "No avisó. No contesta."
- type: pain_point
- persuasion: Pain agitation
- beat: frustration
- blueprint: compose (sin blueprint: el silencio es el beat)
- rules: card-morph-anchor, discrete-text-sequence
- registry: chat-message
- on_screen: "Hola Juan, ¿vienes a tu cita?" · ✓✓ · "10:14" · "escribiendo…" (aparece y desaparece)
- handoff: entra ← el chip "10:14"; sale → la burbuja se vuelve el espacio de las 10:00 del Frame 3
- sfx: pop al enviar; después, silencio

narrativeRole: escala la tensión con algo que el público ya vivió. keyMessage: ni siquiera avisan. La burbuja es blanca, no verde: el verde se guarda para la solución.

## Frame 3: Una de cada cinco (6.10–11.05s)

- act: Contexto
- status: animated
- src: compositions/frames/03-uno-de-cinco.html
- duration: 4.95s
- poster: 3.8
- transition_in: cut
- scene: La burbuja se vuelve el espacio de las 10:00 en una fila de 5 citas del día que entran en cascada; la de las 10:00 queda gris "No llegó" y arriba entra "1 de cada 5"
- voiceover: "Y no es la primera vez: en muchos consultorios, una de cada 5 citas termina así."
- type: pain_point
- persuasion: Statistical proof
- beat: frustration
- blueprint: grid-card-assemble — Adapt (cambio de estado después del armado)
- rules: spring-pop-entrance, card-morph-anchor
- registry: —
- on_screen: "09:00" · "10:00 · No llegó" · "11:00" · "15:00" · "16:00" · "1 de cada 5" (Fraunces) · chip mono "BMJ Open · 2016"
- handoff: entra ← burbuja → espacio de las 10:00; sale → ese espacio se separa de la fila y se vuelve el anillo del Frame 4
- sfx: ticks en cascada, thump cuando se apaga

narrativeRole: convierte un mal día en un patrón. keyMessage: le pasa a uno de cada cinco. "1 de cada 5" sale de la línea base del 21 % del metaanálisis de BMJ Open que cita el blog.

## Frame 4: La promesa (11.05–15.60s)

- act: Contexto
- status: animated
- src: compositions/frames/04-promesa.html
- duration: 4.55s
- poster: 3.4
- transition_in: cut
- scene: El espacio gris se vuelve un anillo de 60 minutos que se vacía hasta "−1 hora"; al final, dentro del anillo, aparece un chip verde "Bs 0,14" (el primer verde del video)
- voiceover: "Una hora perdida que se pudo haber evitado con un mensaje de solo 14 centavos."
- type: pain_point
- persuasion: Negative contrast
- beat: frustration → curiosity
- blueprint: dataviz-countup — Adapt (el conteo dramatiza el problema)
- rules: stat-bars-and-fills, counting-dynamic-scale, spring-pop-entrance
- registry: count-up
- on_screen: "60 min" → "−1 hora" · chip verde "Bs 0,14"
- handoff: entra ← espacio de las 10:00; sale → el chip verde se abre en el chat del Frame 5
- sfx: tick que se desacelera con el anillo, pop en el chip verde

narrativeRole: pone el valor en el beat 2 del relato (story spine) y abre el loop que sostiene la retención hasta el Mensaje. keyMessage: una hora contra 14 centavos.

## Frame 5: El recordatorio (15.60–18.0s)

- act: Mensaje
- status: animated
- src: compositions/frames/05-recordatorio.html
- duration: 2.4s
- poster: 2.6
- transition_in: cut
- scene: El chip verde se abre en el chat del paciente: "Tu consultorio · en línea" y la burbuja "Recordatorio: tu cita es mañana a las 10:00." con [Confirmar] [Cambiar hora]; el cursor llega a "Confirmar"
- voiceover: "La solución es simple: un recordatorio por WhatsApp el día antes."
- type: product_intro
- persuasion: Show-don't-tell proof
- beat: relief
- blueprint: cursor-ui-demo — Adapt (chat reconstruido; el cursor guía)
- rules: card-morph-anchor, spring-pop-entrance, cursor-click-ripple
- registry: chat-message, text-state-swap
- on_screen: "Tu consultorio · en línea" · "Recordatorio: tu cita es mañana a las 10:00." · [Confirmar] [Cambiar hora]
- design_source: capture-blog/ — mock de chat del propio blog (cabecera #155B3F, fondo #EFEAE2, burbuja del negocio en verde a la derecha); el paciente responde en blanco a la izquierda
- handoff: entra ← chip verde → avatar y tarjeta de chat; sale → la respuesta verde del Frame 6
- sfx: whoosh en el morph, pop en la burbuja

narrativeRole: el giro. Llega la solución y, con ella, el verde de la marca. keyMessage: un recordatorio, el día antes. El texto de la burbuja es el ejemplo exacto del blog; los botones ilustran "confirmar o cambiar la hora en el mismo chat".

## Frame 6: Confirmada (18.0–20.55s)

- act: Mensaje
- status: animated
- src: compositions/frames/06-confirmada.html
- duration: 2.55s
- poster: 1.2
- transition_in: cut
- scene: Clic en "Confirmar": el botón se vuelve verde, entra la respuesta "Confirmo ✓" del paciente (blanca, a la izquierda) y arriba aparece "✓ Cita confirmada"
- voiceover: "" (1 s pause opened after "antes" in the edit: the tap does the talking)
- type: feature_showcase
- persuasion: Friction reduction
- beat: relief + control
- blueprint: cursor-ui-demo — continúa el Frame 5
- rules: cursor-click-ripple, press-release-spring, spring-pop-entrance
- registry: chat-message
- on_screen: "Confirmo ✓" · "✓ Cita confirmada"
- handoff: sale → la burbuja verde se estira en la línea verde (BMJ Open) del gráfico del Frame 7
- sfx: click y chime

narrativeRole: beat silencioso (la pausa de 1 s de la grabación). El sonido del check lo dice todo. keyMessage: un toque y listo.

## Frame 7: La prueba (20.55–25.75s)

- act: Mensaje
- status: animated
- src: compositions/frames/07-prueba.html
- duration: 5.2s
- poster: 3.6
- transition_in: cut
- scene: La burbuja verde se estira en el gráfico de pendiente del propio blog, "Inasistencias": dos estudios bajan de "Sin aviso" a "Con aviso", BMJ Open 21 % → 15 % (verde) y Buenos Aires 34,6 % → 26,4 % (ámbar, preprint)
- voiceover: "Los estudios muestran que un aviso de notificación baja las inasistencias entre 5 y 10 puntos."
- type: feature_showcase
- persuasion: Statistical proof
- beat: confidence
- blueprint: dataviz-countup — Adapt (gráfico de pendiente en vez de anillo; las cifras cuentan al llegar)
- rules: svg-path-draw, counting-dynamic-scale
- registry: count-up
- on_screen: "DOS ESTUDIOS" · "Inasistencias" · chip "−5 a −10 puntos" · 34,6 % → 26,4 % · 21 % → 15 % · "Sin aviso" / "Con aviso" · "BMJ Open" · "Buenos Aires preprint" · "Fuentes: BMJ Open 2016 · preprint Buenos Aires"
- design_source: capture-blog/ — el gráfico "Inasistencias" del blog, con la misma escala honesta de 0 a 40 %, sin grilla y con los valores sobre las líneas
- handoff: entra ← burbuja verde → línea verde; sale → el punto final verde (15 %) se abre en la etiqueta de precio del Frame 8
- sfx: ticks mientras cuentan las cifras

narrativeRole: la evidencia que respalda la promesa, con fuente a la vista. keyMessage: funciona. BMJ Open baja 6 puntos y Buenos Aires 8,2: los dos dentro del "entre cinco y diez puntos" que dice la voz (el titular del blog).

## Frame 8: El precio (25.75–30.20s)

- act: Mensaje
- status: animated
- src: compositions/frames/08-precio.html
- duration: 4.45s
- poster: 2.6
- transition_in: cut
- scene: La barra se contrae en una etiqueta de precio: "Bs 0,14" en Fraunces 700 rueda desde 0,00; debajo, "por mensaje" y un chip mono "Utilidad · US$0,0113"
- voiceover: "¿Y cuánto cuesta? 14 centavos por mensaje, por la API oficial."
- type: benefit_highlight
- persuasion: Price anchoring
- beat: surprise → ease
- blueprint: titlecard-reveal — un solo movimiento contenido y luego quietud
- rules: spring-pop-entrance, vertical-spring-ticker
- registry: number-wheel
- on_screen: "Bs 0,14" · "por mensaje" · chip "Utilidad · US$0,0113"
- handoff: entra ← el punto verde del 15 %; sale → la etiqueta se vuelve el primero de los 500 puntos del Frame 9
- sfx: pop

narrativeRole: cobra el loop abierto en el Frame 4, con calma: la quietud es la confianza. keyMessage: 14 centavos.

## Frame 9: Quinientos al mes (30.20–34.90s)

- act: Mensaje
- status: animated
- src: compositions/frames/09-quinientos.html
- duration: 4.7s
- poster: 2.4
- transition_in: cut
- scene: La etiqueta se vuelve el primer punto de una tarjeta que se llena con 500 puntos verdes (uno por recordatorio) mientras el total rueda a "Bs 71,42 /mes"
- voiceover: "Si hacemos los cálculos: 500 recordatorios al mes, 71 bolivianos."
- type: benefit_highlight
- persuasion: Feature-to-benefit translation
- beat: ease
- blueprint: dataviz-countup — Adapt (el total cuenta mientras los 500 puntos se llenan; sin UI de calculadora)
- rules: counting-dynamic-scale, stat-bars-and-fills
- registry: number-wheel
- on_screen: "500 recordatorios al mes" · "Bs 71,42 /mes" · 25 × 20 puntos verdes · "500 × Bs 0,1428"
- handoff: entra ← la etiqueta de precio → el primer punto; sale → los 500 puntos se recogen en una sola burbuja, la del recordatorio del Frame 10
- sfx: ticks suaves mientras se llenan, chime en el total

narrativeRole: lleva el precio a la escala de su negocio; los puntos le dan peso al número. keyMessage: un mes entero por Bs 71. 500 × Bs 0,1428 = Bs 71,42, como en el blog. La calculadora de parlana.bo no aparece (pedido del usuario).

## Frame 10: Sin ofertas (34.90–44.70s)

- act: Mensaje
- status: animated
- src: compositions/frames/10-sin-ofertas.html
- duration: 9.8s
- poster: 3.0
- transition_in: cut
- scene: Vuelve la burbuja del recordatorio con un toggle "Agregar oferta"; el cursor lo enciende, la burbuja crece con "Aprovecha 20% de descuento en tu próxima visita." y bajo el teléfono la comparación pasa de "Utilidad Bs 0,14" a "→ Marketing Bs 0,94"; el toggle queda encendido para que el frame cierre sobre la diferencia
- voiceover: "Eso sí, que sea solo de recordatorio. Si le pones una oferta, WhatsApp lo cobra como si fuera un mensaje de marketing, y pasa de 14 a 94 centavos."
- type: feature_showcase
- persuasion: Risk reversal
- beat: intrigue → control
- blueprint: compose (anchored-layout-expand + control-target-sync)
- rules: anchored-layout-expand, control-target-sync, press-release-spring
- registry: toggle-flip, text-state-swap
- on_screen: tarjeta con toggle "Agregar oferta" sobre el teléfono del mock · burbuja "Recordatorio: tu cita es mañana a las 10:00." + "Aprovecha 20% de descuento en tu próxima visita." · comparación bajo el teléfono, como en el blog: "Utilidad Bs 0,14" → "Marketing Bs 0,94" · "por mensaje" (Bs 0,94 confirmado por el usuario)
- handoff: entra ← los 500 puntos se recogen en una sola burbuja; sale → la burbuja se despliega en la agenda del Frame 11
- sfx: click al encender, click al apagar

narrativeRole: el dato poco obvio que hace que guarden y compartan el reel. keyMessage: sin ofertas en el recordatorio. Ambos textos de la burbuja son los ejemplos exactos del blog.

## Frame 11: La agenda llena (44.70–49.25s)

- act: Mensaje
- status: animated
- src: compositions/frames/11-agenda.html
- duration: 4.55s
- poster: 3.4
- transition_in: cut
- scene: La burbuja se despliega en la agenda de la semana de Ana (L–V); las citas entran y se marcan "✓ Confirmada" en verde, en cascada; en la cabecera aparece la marca Parlana
- voiceover: "Con nuestros agentes, cada cita se recuerda y se confirma sola en el mismo chat."
- type: benefit_highlight
- persuasion: Future pacing
- beat: relief + confidence
- blueprint: grid-card-assemble — Adapt (tablero que se llena con cambios de estado)
- rules: spring-pop-entrance, card-morph-anchor
- registry: —
- asset_candidates: assets/brand/parlana-logo.svg — marca oficial de Parlana (#155B3F)
- on_screen: "Semana de Ana" · L M M J V · citas con "✓ Confirmada" · logo + "Parlana" (Fraunces)
- handoff: entra ← burbuja → agenda; sale → la agenda se condensa en el botón del Frame 12
- sfx: pops en cascada, chime al final

narrativeRole: muestra el después y presenta la marca como quien lo hace solo. keyMessage: tu semana, confirmada. Primera vez que se nombra a Parlana.

## Frame 12: Comenta CITAS (49.25–53.75s)

- act: CTA
- status: animated
- src: compositions/frames/12-cta.html
- duration: 4.5s
- poster: 2.0
- transition_in: cut
- scene: La agenda se condensa en un botón verde "Comenta CITAS" bajo la marca Parlana; el cursor hace clic sobre el ícono del botón (la palabra queda limpia); debajo, "y te muestro cómo"; en el último segundo el botón se vuelve la tarjeta de las 10:00, ahora "✓ Confirmada"
- voiceover: "¿Quieres que no te pase lo de Ana? Comenta CITAS y te muestro cómo."
- type: cta
- persuasion: Single clear ask
- beat: urgency-to-act
- blueprint: cta-morph-press — la identidad se condensa en un clic
- rules: card-morph-anchor, cursor-click-ripple, press-release-spring
- registry: text-state-swap
- asset_candidates: assets/brand/parlana-logo.svg — marca
- on_screen: logo + "Parlana" · botón "Comenta CITAS" · "y te muestro cómo" · cierre: "HOY · 10:00 · Juan Pérez · ✓ Confirmada"
- handoff: entra ← agenda → botón; sale → la tarjeta del Frame 1, confirmada (la costura del loop)
- sfx: click y chime

narrativeRole: una sola acción, clara, que retoma la historia de Ana, y un final que espeja el comienzo con el problema resuelto. keyMessage: comenta CITAS. Sin calculadora ni URL: una sola llamada a la acción.
