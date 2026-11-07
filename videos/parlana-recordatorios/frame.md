---
name: parlana-recordatorios
source: "parlana.bo (captura de /calculadora/, 2026-10-16) × gramática UI morph de @twoclipping (refs/)"
primary_frame: 1080x1920 (9:16, Reels)

colors:
  canvas: "#F6F4EF"        # fondo de parlana.bo: el escenario
  cream: "#F1EFE8"         # superficie cálida secundaria: pistas, chips neutros
  surface: "#FFFFFF"       # tarjetas y burbujas claras
  line: "#D3D1C7"          # bordes, pistas de slider, espacios vacíos
  ink: "#2C2C2A"           # texto y UI oscura neutra (actos del problema)
  muted: "#5F5E58"         # texto secundario y estado "perdido"
  green: "#155B3F"         # EL acento: marca, resuelto, confirmado, botón principal
  green-deep: "#0F422E"    # estado presionado, superficie más oscura
  green-text: "#145A41"    # cifras verdes sobre blanco
  green-tint: "#E7F0EB"    # relleno de confirmado, chips verdes, anillo de clic
  amber: "#BA7517"         # SOLO como en parlana.bo: categoría Marketing y la segunda serie de sus gráficos
  chat-bg: "#EFEAE2"       # fondo del chat en el mock del blog
  chat-neutral: "#3C3B36"  # cabecera y burbuja del chat en el acto del problema (antes de que llegue el verde)
  aurora-green: "rgba(21, 91, 63, 0.10)"
  aurora-warm: "rgba(186, 117, 23, 0.10)"

typography:
  display:
    fontFamily: "Fraunces"
    weights: [600, 700]
    src: ["assets/fonts/fraunces-600.woff2", "assets/fonts/fraunces-700.woff2"]
    tracking: "-0.02em"
  ui:
    fontFamily: "Figtree"
    weights: [400, 500, 600, 700]
    src: ["assets/fonts/figtree-400.woff2", "assets/fonts/figtree-500.woff2", "assets/fonts/figtree-600.woff2", "assets/fonts/figtree-700.woff2"]
  data:
    fontFamily: "JetBrains Mono"
    weights: [500, 700]
    note: "embebida por el CLI; reemplaza la mono del sistema que usa el sitio"
  numerals: "font-variant-numeric: tabular-nums"
  sizes:
    hero-number: "200px"
    title: "96px"
    ui: "44px"
    chat: "46px"
    data: "32px"
    caption: "56px"

spacing:
  unit: "8px"
  stage-center: "540, 830"
  object-max: "860x920"
  content-band: "y 250–1460, x 110–970"
  caption-bottom: "340px"

radius:
  pill: "9999px"
  card: "36px"
  bubble: "36px, esquina de la cola 10px"

components:
  border: "3px solid #D3D1C7 en tarjetas blancas (el 1px del sitio, escalado a video)"
  shadow: "0 24px 64px rgba(21, 91, 63, 0.14), 0 6px 16px rgba(21, 91, 63, 0.08)"
  primary-button: "pastilla #155B3F, texto #F6F4EF, Figtree 600"
  cursor: "flecha clásica, relleno #2C2C2A, contorno blanco 3px, 46px de alto; anillo de clic #E7F0EB"
  caption-plate: "pastilla #2C2C2A, Figtree 700 56px; palabra activa en crema sobre chip #155B3F"

motion:
  morph: "0.40s, spring con overshoot ≤3%"
  swap-out: "0.12s, blur 0→14px y opacidad→0"
  swap-in: "0.22s desde blur 12px y y+12px; empieza 0.08s después del morph"
  cursor-lead: "llega 0.4–0.6s antes de cada acción"
  camera: "quieta (doctrina: nada de push/pan lento); la única deriva es la del fondo aurora"
  shell: "una sola superficie (compositions/shell.html) que cambia de rect, radio y relleno con clip-path en cada corte, 0.5s power2.inOut"
---

# Parlana · recordatorios — la verdad del diseño

**Concepto:** una sola cita, contada por un solo objeto. La tarjeta de la cita de las 10:00 se convierte en todo lo que el video tiene que decir: un chat sin respuesta, un hueco en la agenda, un recordatorio, un precio. Al final vuelve a ser la misma tarjeta, ya confirmada.

## El escenario

- **Fondo:** `canvas` (#F6F4EF), el fondo de parlana.bo, con tres manchas aurora grandes y desenfocadas: verde arriba a la izquierda, cálida a la derecha y verde-tinte abajo. Solo tienen una deriva lenta (sine ±40px); nada más se mueve en el fondo.
- **Un solo objeto:** centrado en x, con su centro en y≈830. Nunca pasa de y=1460, porque debajo viven los subtítulos.
- **Dos focos siempre:** el objeto y el cursor, o la cifra que acompaña al objeto.

## Historia del color

- **Conflicto y Contexto:** neutros. Blanco, `ink` y grises (`muted`, `line`), sin verde.
- **Primer verde:** el `green` aparece por primera vez en el chip "Bs 0,14" (Frame 4) y llega de lleno con el recordatorio (Frame 5). Desde ahí, verde = resuelto.
- **Ámbar:** solo donde parlana.bo lo usa: la categoría Marketing (punto y cifra) y la segunda serie del gráfico "Inasistencias" (Buenos Aires).
- **El chat** es el mock del propio blog (`capture-blog/`): cabecera verde, fondo `chat-bg`, el mensaje del negocio en verde a la derecha y el del paciente en blanco a la izquierda. En el acto del problema el mismo chat va en `chat-neutral`.
- **Nunca rojo:** el problema se cuenta en gris, no en alarma.

## Tipografía

- **Fraunces** para lo que hay que recordar: las cifras héroe (Bs 0,14, Bs 71,42, 21 % → 15 %) y el sello del hook.
- **Figtree** para la UI: el chat, las etiquetas y los botones.
- **JetBrains Mono** para los datos: tarifas por mensaje, fuentes y horas.
- **Cifras tabulares siempre.** Los números ruedan o cambian detrás de un blur; nunca hacen fade.

## Gramática de movimiento (estudiada en la referencia)

1. **Una forma que nunca corta.** Cada estado es la misma forma con otra superficie, otro tamaño y otro radio. Los cambios de tamaño van con proxies de transform (`card-morph-anchor`, `anchored-layout-expand`), nunca con tweens de width o height.
2. **Elemento compartido.** En cada cambio sobrevive una pieza del estado anterior y pasa a ser parte del siguiente: el chip de hora, la burbuja, la barra. `STORYBOARD.md` nombra cuál es en cada frame (`handoff`).
3. **El contenido no se superpone.** Sale con blur antes del morph y entra con blur después de que empieza. Nunca hay dos textos legibles a la vez.
4. **El cursor provoca cada cambio.** Llega, presiona (dip de 0.08s) y suelta con spring. Deja estela de eco solo en recorridos rápidos.
5. **Nunca un momento muerto.** Dentro de cada estado algo cambia cada ~1 s (el cursor, una cifra, un check); ningún hueco dura más de 1.2 s.
6. **El loop cierra.** La última imagen espeja la primera: la tarjeta de las 10:00, ahora "Confirmada".

## Do / Don't

**Do:**
- Superficies de UI reales: la tarjeta de cita y el chat del mock de Parlana. La calculadora de parlana.bo no aparece.
- Los textos del blog tal cual.
- Bordes de 3px y sombra con tinte verde.

**Don't:**
- Degradados en la UI, glows, partículas o easing rebotón.
- Texto centrado sobre un degradado, o todo con fade-in.
- Etiquetas en las esquinas.
- Rojo.
- Logos de WhatsApp o de terceros.
- Recortar la UI.

## Procedencia

- **Chat y gráfico:** captura del artículo (`capture-blog/`, 2026-10-16).
- **Marca:** captura de parlana.bo/calculadora/ (`capture/`, 2026-10-16).
  - Fuentes: Fraunces y Figtree (OFL), en `assets/fonts/`.
  - Colores: `capture/extracted/tokens.json`.
  - Sombra, radios y botón: `capture/extracted/design-styles.json`.
  - Logo: `assets/brand/parlana-logo.svg` (#155B3F).
- **Gramática:** @twoclipping (`refs/`). Solo la forma de moverse; ningún elemento de su contenido.
