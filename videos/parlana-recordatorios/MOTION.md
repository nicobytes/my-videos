# MOTION — dirección de movimiento v2

Versión para Parlana de un prompt de "UI morph a nivel Dribbble". Del original se toma la disciplina de movimiento. **No** se toma su estética (Geist, blanco y negro, cuadrado 1440, 120 BPM fijos) ni su motor (`seek(t)` con Playwright y `tmix`): aquí renderiza HyperFrames, como dice `CLAUDE.md`.

La diferencia de fondo: el original es una pieza **sin voz**, donde la música decide todo. La nuestra es **narrada**: la voz decide *qué* pasa y el pulso decide *cuándo* exactamente.

---

## <inputs>

- **Guion:** `SCRIPT.md` v2 (12 líneas, ~87 s). La voz grabada del usuario manda sobre todos los tiempos.
- **Estados:** 14 estados de interfaz, que salen del guion (ver `<structure>`).
- **Color:** la marca de Parlana. Lienzo crema `#F6F4EF`, tinta `#2C2C2A`, superficies blancas y **un solo acento**, el verde `#155B3F`. Los problemas van en gris, nunca en rojo. El ámbar de la v1 sale, porque ya no hay "marketing".
- **Tipos:** Fraunces para cifras y titulares, Figtree para la interfaz. Las dos van embebidas en `assets/fonts/`.
- **Música:** una pista **con licencia comercial**, de ~100–120 BPM (por ejemplo, Mixkit, gratis para uso comercial). Los borradores de MusicGen sirven para maquetar, no para publicar.

## <direction>

- **Una sola forma, nunca cortada.** Cada estado es la misma superficie, que cambia de tamaño, radio y color. El contenido se intercambia detrás de un desenfoque corto, con **su propia entrada y salida**: sale antes de que la forma termine de moverse y entra después de que empieza.
- **El cursor provoca cada cambio.** Hace clics, hover y **arrastres reales**. Nada cambia solo, salvo cuando el guion dice "sin tener que enviarlos tú mismo": ahí el cursor suelta y la interfaz sigue sola. Ese contraste es el mensaje. No hay movimientos de cursor "para descansar".
- **Resortes en todo**, con un sobreimpulso máximo del 4 %. Nunca rebote.
- **Bordes líquidos.** Cuando la forma crece hacia un lado, el borde delantero va primero, con un resorte más rápido, y el trasero lo sigue. Así la forma se estira con intención en vez de escalar en bloque. El knob del interruptor hace lo mismo.
- **La cámara encuadra cada estado.** Un estado chico (un botón, una moneda, un interruptor) se acerca con un resorte hasta llenar la zona útil; uno grande (un teléfono, una agenda) queda a escala 1. No hay deriva lenta: la cámara solo se mueve para encuadrar un estado nuevo.
- **Prohibido:** easing rebotón, partículas o confeti, brillos, degradados en la interfaz, íconos con trazos desparejos (todos a 2 px sobre una grilla de 24), más de 2 pulsos seguidos sin que pase nada, y cualquier cosa que parezca plantilla.

## Física real, no curvas

La v1 usaba curvas de duración fija (`power2.inOut`, `power3.out`): cada movimiento arranca en reposo y no hereda la velocidad del anterior. En la v2, todo lo que se mueve lo mueve un **resorte**:

- **Resorte amortiguado de forma cerrada.** Para cada instante `t`, la posición se calcula exacta con la solución analítica del oscilador, con rigidez, amortiguamiento, posición y velocidad iniciales. No se simula paso a paso, así que es determinista y funciona con seek en las dos direcciones.
- **Cambiar de objetivo conserva la velocidad.** Un valor que cambia de objetivo varias veces es la **suma de una respuesta de resorte por cambio**, empezando en el instante de cada cambio. Como el resorte es lineal, la suma es exacta: si la forma está viajando y recibe un objetivo nuevo, gira con la inercia que traía, sin frenar a cero.
- **Arrastre con inercia.** Mientras el cursor sostiene, el valor sigue al cursor. Al soltar, el resorte arranca desde esa posición **con la velocidad que llevaba el cursor**.
- **Un solo motor.** Una función compartida (`compositions/shared/physics.js`, probada en `videos/parlana-motion-proto/`) mueve la forma (sus 4 bordes, radio y color), el hilo, la cámara, el cursor y los knobs. Cada pista se lee como una tabla de objetivos `{t, valor}` y un driver GSAP `ease: "none"` evalúa el resorte en `onUpdate`.
- **Estiramiento por velocidad (squash & stretch), con tope.** El centro y el tamaño van cada uno en su resorte. La forma se alarga en la dirección en que se mueve según su velocidad real, se adelgaza en la otra dirección y el frente va adelante. El estiramiento tiene tope: 22 % para la píldora, 5 % para la forma grande y 45 % para el knob. *Probado en el prototipo:* un resorte por borde estiraba en proporción a la distancia, y en un viaje de 560 px la píldora se volvía un cuadrado gigante. Con el estiramiento por velocidad, nunca supera el tamaño de su estado más grande más un 10–20 %.
- **El color cambia rápido** (resorte crítico, w = 22), para que el paso de oscuro a blanco no se vea como un gris.
- **Prueba:** ningún borde de la forma cambia de velocidad de golpe entre dos cuadros, salvo en los clics. Se mide exportando la posición por cuadro.

## El objeto nunca se pierde

1. **Todo el contenido vive dentro de la forma.** Nada flota fuera de ella: ni titulares, ni chips, ni controles. Si un estado necesita un elemento afuera, ese elemento **nace del borde de la forma** (se desprende y vuelve), nunca aparece de la nada.
2. **La forma nunca está vacía.** El contenido viejo sale en la primera mitad del morph y el nuevo entra en la segunda, superpuestos. Ningún cuadro muestra la forma sin contenido durante más de 2 cuadros.
3. **Un hilo que atraviesa todo: la píldora de estado de la cita.** Es un segundo objeto persistente, chico, que cuenta la historia con su estado y su color:

   | Estado | La píldora es… |
   |---|---|
   | 1 | el chip "Pendiente" de la tarjeta de las 10:00 → se oscurece en "No llegó" |
   | 2 | los puntos de "escribiendo" del chat, que se apagan |
   | 3 | la marca "No llegó" que se repite semana a semana |
   | 4 | el chip "Ingreso perdido" |
   | 5 | la isla "Atendiendo a Lucía" |
   | 6 | el knob del interruptor "Recordatorios automáticos" |
   | 7 | se divide en los dos chips: "Día anterior" y "Unas horas antes" |
   | 8 | se vuelve a unir en el botón "Confirmar" → "✓ Confirmada" (verde) |
   | 9 | la moneda Bs 1, que se abre en 7 burbujas |
   | 10 | el botón "Enviar", que se presiona solo |
   | 11 | el chip "Cita agendada" |
   | 12 | las ✓ de la semana |
   | 13 | el botón "Comenta CITAS" |
   | 14 | de nuevo el chip de la tarjeta de las 10:00, ahora "✓ Confirmada" |

   La forma grande es el contenedor; la píldora es la protagonista. Las dos están en todos los cuadros.
4. **Una sola composición para lo persistente.** La forma, la píldora, el cursor y la cámara viven en **una** composición que dura todo el video (`compositions/rig.html`). Así son los mismos nodos del DOM de principio a fin. Las sub-composiciones por estado llevan solo el contenido pasajero, posicionado relativo a la forma.
5. **Prueba:** en la hoja de contacto cada 2 pulsos, en todos los cuadros se ve la píldora, y el contenido principal queda dentro de la forma.

## <structure>

**Doble grilla.** La voz marca la palabra; el pulso de la música marca el instante:

- Cada cambio de estado cae en el pulso más cercano a su palabra, si ese pulso queda a ±150 ms. Si no, manda la palabra.
- Entre dos cambios de estado hay un **micro-evento cada 2 pulsos**: hover, puntos de "escribiendo", contador, insignia de notificación, tick del reloj. Nunca hay tiempo muerto.
- La música arranca en un pulso fuerte en t = 0. El sello "No llegó" cae en un tiempo fuerte del compás.

**Cadena de estados** (línea del guion → la forma se convierte en…):

| # | Línea | Estado | Lo que hace el cursor |
|---|---|---|---|
| 1 | L1 | Tarjeta de agenda 10:00, silla vacía; el reloj corre → sello "No llegó" | Toca la tarjeta: pasa de "Pendiente" a "No llegó" |
| 2 | L2–L3 | Chat "¿Vienes a tu cita?" con los puntos de "escribiendo" que se apagan | Envía el mensaje; queda esperando sobre el chat |
| 3 | L3 | Agenda de varias semanas: la misma silla vacía se repite | Pasa las semanas: arrastre horizontal |
| 4 | L4 | Anillo de "−1 h" y chip "Ingreso perdido" | Mantiene presionado el anillo y lo vacía |
| 5 | L5 | Isla "Atendiendo a Lucía", mientras se apilan las notificaciones de WhatsApp (insignia 1 → 12) y la tarea "Enviar recordatorio" se va al fondo | Intenta alcanzar la tarea, pero llegan mensajes nuevos |
| 6 | L6 | La isla se vuelve el interruptor **"Recordatorios automáticos"** | Lo enciende justo en el pulso; el knob se estira |
| 7 | L7 | Línea de tiempo de la cita: dos chips, "Día anterior" y "Unas horas antes" | **Arrastra** cada chip a su lugar; al soltar, rebota |
| 8 | L7 + pausa | Teléfono: llega el recordatorio con "Confirmar" y "Reprogramar" | Toca "Confirmar" → "✓ Confirmada" |
| 9 | L8 | Moneda **Bs 1** que se abre en 7 burbujas (Bs 0,14 c/u), con su nota al pie | **Arrastra** un deslizador de 1 a 7; al pasar el máximo se estira y vuelve |
| 10 | L8–L9 | Botón "Enviar" que se presiona solo; aparece el logo de Parlana | **Suelta** y se aparta: Parlana sigue sola |
| 11 | L10 | Bandeja de entrada: "¿Tienen turno mañana?" → Parlana responde con horarios → "Cita agendada" | Solo observa |
| 12 | L11 | Pantalla dividida "En tu local: atendiendo" / "En WhatsApp: Parlana"; la semana se llena de ✓ | Vuelve al lado "En tu local" |
| 13 | L12 | Botón "Comenta CITAS"; se escribe un comentario "CITAS" | Toca el botón |
| 14 | cierre | La tarjeta de las 10:00, ahora "Confirmada", **idéntica al primer cuadro** | Vuelve a la posición inicial, con velocidad cero |

## <build> (traducido a HyperFrames)

1. **Formato:** composición de 1080×1920, renderizada a **60 fps**. Cada cuadro es función pura del tiempo: timelines GSAP pausadas, `fromTo` con estados explícitos, sin transiciones CSS, sin temporizadores y sin estado que pase de un cuadro a otro.
2. **Resortes de forma cerrada:** una sola función `spring(ζ, ω)` (resorte amortiguado normalizado) usada como `ease` de GSAP en todas las composiciones. Un valor que cambia de objetivo varias veces es una cadena de `fromTo` contiguos, así que sigue siendo función del tiempo.
3. **Bordes en resortes distintos:** el `clip-path: inset()` de la forma se anima por bordes, con el delantero más rápido y el trasero con un leve retraso. Se elige qué borde va primero según hacia dónde crece la forma. El knob del interruptor usa el mismo truco.
4. **Arrastres** con las reglas `cursor-drag` y `control-target-sync`. Mientras el cursor sostiene, el valor sale de su posición, en la misma etiqueta, duración y ease. Al soltar, el valor rebota desde donde quedó.
5. **Música:** `scripts/beats.py` produce la grilla. La pista se recorta para arrancar en un pulso fuerte. Cada efecto se coloca por **su pico medido**, no por el inicio del archivo: `sfx.mjs` calcula el pico de cada sonido y lo resta del cue.
6. **Desenfoque de movimiento:** HyperFrames no hace sub-cuadros. Se usa 60 fps y, solo en los movimientos más rápidos (un tirón del cursor, un morph grande), la regla `motion-blur-streak`. No se escribe un motor de render propio.
7. **Revisión por pulso antes del render:** `npx hyperframes snapshot --at <cada 2 pulsos>` produce una hoja de contacto. Antes del render completo se corrige todo lo que quede fuera de la grilla, apretado o difícil de leer.

## <gotchas>

- Nunca uses `will-change` en algo que la cámara escala: el texto sale borroso.
- El texto dentro de un contenedor que cambia de forma necesita su propia entrada y salida, o se superpone.
- Los subtítulos van **fuera** de la cámara, y el zoom nunca empuja la interfaz por debajo de y = 1460 (zona de subtítulos y de la interfaz de Reels).
- El último cuadro es igual al primero, incluidas la posición y la velocidad del cursor; si no, el loop tartamudea.
- **Narrado:** un cambio de estado nunca cae en medio de la palabra que nombra el estado anterior.
- La nota "Bs 1 = 7 recordatorios" debe leerse a 360 px de ancho: mínimo 28 px en el lienzo de 1080.

## <start>

Antes de escribir código:

1. Confirmar la música (pista con licencia comercial o borrador de MusicGen).
2. Con la voz grabada, mostrar la **tabla de estados sobre la grilla de voz y pulso**, con el segundo de cada estado, su palabra, su pulso y su micro-evento. Esa tabla es el storyboard v2, y se aprueba antes de construir.
