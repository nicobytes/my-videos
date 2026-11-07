---
format: 1080x1920 (Reels), 60 fps
duration: ~74.5s (voz de 73.8 s: toma de 69.8 s + línea 6 insertada en 27.1 s)
message: "Parlana envía solo los recordatorios de tus citas por WhatsApp (con Bs 1 alcanzan hasta 7), y además responde y agenda: tú atiendes a quien llega."
arc: PAS (problema → agitación → solución) + CTA
mode: collaborative
status: built (aprobado por el usuario el 2026-10-17; construido con el motor de MOTION.md)
motion: MOTION.md (motor de resortes de compositions/shared/physics.js, probado en videos/parlana-motion-proto)
---

# Storyboard v2 — estados sobre la voz

La v1 (Ana, 14 centavos, Bs 0,94) está congelada en `videos/parlana-recordatorios-v1/`.

**Tiempos:** son los de `assets/vo/voice.wav` (transcript en `assets/vo/transcript.json`). La línea 6 se grabó aparte (`assets/vo/l6-original.wav`, otro micrófono), se igualó en tono y volumen a la toma y se insertó en 27,1 s (+4,07 s). La toma sin la línea queda en `assets/vo/voice-take.wav`. Música: "Tears of Joy" (Mixkit), 123 BPM. Cada cambio va al pulso más cercano si queda a ±150 ms de su palabra (scripts/timing.py).

**Los dos objetos que nunca se pierden:**
- **La forma** (el contenedor): cambia de estado en cada fila.
- **La píldora de estado** (la protagonista): está en todas las filas.

| # | Toma (s) | Lo que se dice (palabra ancla) | La forma se convierte en… | La píldora es… | El cursor… |
|---|---|---|---|---|---|
| 1 | 0,0–4,4 | "¿Alguna vez agendaste una cita para un cliente y, cuando **llegó la hora** (2,4), **no apareció**? (3,4)" | Tarjeta de agenda **10:00 · Consulta**; el reloj llega a 10:00 en "llegó la hora"; la silla vacía late en "no apareció" | "Pendiente" | Pasa por la tarjeta y se detiene en la silla |
| 2 | 4,4–8,2 | "Seguramente tenías **todo listo** (5,3) para atenderlo, pero **pasó la hora** (7,0) y **no llegó** (7,7)" | La tarjeta se estira hacia abajo en un checklist que se marca solo (✓ sala lista ✓ ficha ✓ horario reservado); en "pasó la hora" el reloj corre de 10:00 a 10:30 | En "no llegó" se oscurece y crece en el sello **"No llegó"**, montado sobre el borde | Toca la píldora en "no llegó" |
| 3 | 8,2–9,6 | "**No avisó** (8,3), **no contesta** (9,0)…" | Chat con Juan: tu mensaje "¿Vienes a tu cita?" ✓✓ | Los puntos de "escribiendo", que se apagan en "no contesta" | Espera sobre el chat |
| 4 | 9,6–12,2 | "…y quizás **tampoco es la primera vez** (9,9) que te sucede" | Tira de semanas, cada una con "No llegó" | "No llegó · 3 → 4 → 5" (sube cuando cada semana cruza) | **Arrastra** las semanas; al soltar, la tira se desliza y encaja |
| 5 | 12,2–17,2 | "Y claro, cada cita perdida representa **tiempo que reservaste** (14,0) y una oportunidad de **ingreso** (16,0) que se pierde" | Disco: el anillo de la hora se vacía | Una semilla en el borde del disco → **"Ingreso perdido"** en "ingreso" | **Mantiene presionado** el anillo de "tiempo" a "reservaste" |
| 6 | 17,2–19,9 | "Seguramente **ya envías recordatorios** (18,0) a tus clientes…" | Lista "Recordatorios de mañana": Carla ☐ → ✓, Diego ☐ → ✓, Juan ☐ | El check de la fila que se está marcando | Marca a Carla y a Diego a mano |
| 7 | 19,9–26,9 | "…pero entre **atenderlos** (20,1), **responder mensajes** (20,6) y **ocuparte de todo** (21,6)… a veces **el tiempo no alcanza** (24,5) y **alguno se te puede pasar** (25,4)" | Teléfono ocupado: llegan mensajes de WhatsApp en cada palabra ancla (insignia 4 → 15); la fila "Juan ☐" baja y se pierde por el borde | La isla **"Atendiendo a Lucía"** | Intenta alcanzar a Juan, la fila se le escapa y se rinde |
| 7b | 26,9–31,0 | "**¿Y si esos recordatorios se enviaran automáticamente?**" (grabada aparte e insertada en 27,1 s) | La isla se vuelve la fila **"Recordatorios automáticos"** | El **knob**, que se estira al encenderse en "automáticamente" (29,6) | Lo enciende en el pulso |
| 8 | 31,0–33,9 | "**Un día anterior** (31,2) o **unas horas antes** (31,9)…" | Línea de tiempo de la cita (día anterior · día de la cita) | Se divide en los dos chips "Día anterior" y "Unas horas antes" | **Arrastra** cada chip a su lugar, uno en cada palabra |
| 9 | 33,9–37,4 | "…para que el cliente **recuerde su cita** (34,1) y tenga la oportunidad de **confirmar** (36,2) o **reprogramar** (36,7)" | Teléfono del cliente: llega el recordatorio, con "Confirmar" y "Reprogramar" | Los chips se vuelven a unir en el botón **"Confirmar"** → "✓ Confirmada" (primer verde) | Toca "Confirmar" en "confirmar" |
| 10 | 37,4–42,6 | "Y aquí viene algo muy interesante: con solo **un boliviano** (39,3) puedes enviar **hasta 7** (40,4) recordatorios por WhatsApp…" | Tarjeta de precio | La moneda **Bs 1** → **7 burbujas** (Bs 0,14 c/u). Nota al pie: "Costo de Meta por mensaje de utilidad (≈ Bs 0,14). No incluye el servicio de Parlana." | **Arrastra** un deslizador de 1 a 7; en "7" lo pasa del máximo y rebota |
| 11 | 42,6–44,5 | "…y lo mejor, **sin tener que enviarlos tú mismo** (42,7)" | Las 7 burbujas salen solas, una por pulso | El botón "Enviar", que se presiona solo | **Suelta** y se aparta: la interfaz sigue sola |
| 12 | 44,5–52,5 | "Por eso creamos **Parlana** (45,3), para ayudarte a **automatizar** (46,8) esos recordatorios y **gestionar las confirmaciones** (48,7)… sin tener que escribir a cada cliente" | El logo de Parlana se arma; después, la lista de mañana se envía sola y llegan las respuestas: "✓ Confirmada" × 3, "↻ Reprogramada" × 1 | El sello de estado que va confirmando fila por fila | Mira, sin hacer nada |
| 13 | 52,5–58,7 | "Pero Parlana no solo envía recordatorios: también te ayuda a **responder las consultas** (55,5) de tus clientes y **agendar sus citas** (57,3) por WhatsApp" | Bandeja: "¿Tienen turno mañana?" → Parlana responde con 3 horarios → el cliente elige uno | El chip **"Cita agendada"** en "agendar" | Mira |
| 14 | 58,7–68,6 | "Así, tú puedes concentrarte en atender a **quienes llegan** (61,2) a tu negocio, mientras Parlana te ayuda a atender a **quienes te escriben** (64,1), **organizar las citas** (65,8) y **recordarles** (66,7) cuándo deben asistir" | Pantalla dividida "En tu local" / "En WhatsApp"; la semana se llena de ✓ en "organizar las citas" | La isla "Atendiendo a Lucía" (vuelve), ahora tranquila | Se queda del lado "En tu local" |
| 15 | 68,6–~74 | "¿Te gustaría automatizar los recordatorios de citas de tu negocio? **Comenta citas** (72,0) y te mostramos cómo hacerlo" | El logo de Parlana y un comentario que se escribe solo: **"CITAS"** | El botón **"Comenta CITAS"** | Lo toca en "citas" |
| 16 | cierre | — | La tarjeta de las 10:00, **igual que el primer cuadro** | "✓ Confirmada" | Vuelve a su lugar inicial, quieto: el loop no salta |

**Micro-eventos** (entre cambios grandes, cada 2 pulsos): tic del reloj, checks que se marcan, puntos de "escribiendo", contador de semanas, insignia de mensajes, burbujas que salen, ✓ que llegan, horarios que aparecen.

**Diferencias de la toma con el guion** (todas se quedan, salvo la línea 6):
- "Un día anterior o unas horas antes" (en vez de "Uno el día anterior y otro unas horas antes").
- "Y aquí viene algo **muy** interesante".
- "Seguramente ya envías…" (sin "Sabemos que").
- "atender a clientes, quienes llegan a tu negocio".
