# SPEC — context-compaction (reel 9:16)

```text
GOAL:    El dev que lo ve siente la factura subiendo, entiende que la culpa es el contexto
         que crece en cada mensaje, y se queda con "compacta el contexto: un modelo ligero
         lo resume y la curva cae" + dónde se configura en Google ADK. Sin CTA.
OUTPUT:  HyperFrames, 1080 x 1920, 30 fps
TIME:    93.2 s x 30 = 2796 frames. Voz: intro 0–7.4 s (audio del clip) + voiceover.mp3 desde
         7.30 s (t_global = t_vo + 7.30); la última palabra termina en 92.7 s. Sin CTA.
         Sin música hasta elegirla.
LOOK:    Medio: papel recortado (paper cut) sobre cartulina.
         - ground: cartulina morada #493A80 (muestreada de la referencia), textura fija
           assets/textures/cardboard.png (moteado 3.5 %, grano 4.5 %, fibras). Sin degradados.
         - paper: #F6F2E8 con assets/textures/paper.png; borde de corte irregular (clip-path
           con jitter 2–4 px, semilla fija); sombra de papel levantado:
           0 3px 0 rgba(20,10,40,.30) + 0 14px 22px rgba(20,10,40,.32).
         - sticker: borde blanco #FFFFFF de 12 px alrededor de recortes y del footage en split.
         - tape: cinta negra #141218, extremos en zigzag, rotación -4°…+3°, texto blanco.
         - ink #141218: todo texto y línea estructural.
         - accent #FFC72C (amarillo resaltador): UNA cosa por frame: el pico de la factura,
           el umbral del 85 %, la palabra activa del subtítulo, la línea de código en foco,
           las barras después del release.
         - display: League Gothic 400, 120–190 px, mayúsculas, tracking +1 %.
         - interfaz: Montserrat 800 (subtítulos 54–60 px) y 700 (etiquetas 34–44 px).
         - fuentes propias de objetos: Roboto 400/500 30–32 px dentro del teléfono;
           IBM Plex Mono 500 31 px en el código.
         - footage: sin grade (se ofrece Natural Portrait si se ve plano en el review).
OBJECTS: - teléfono de papel con chat tipo WhatsApp (cabecera #008069, fondo #EFE7DC,
           burbuja saliente #D9FDD3, entrante #FFFFFF, check doble), SIN logo de WhatsApp;
           contacto "Tienda Bot"; ejemplo real que viaja: el pedido #4821.
         - gráfico de tokens: tarjeta de papel 980 x 460, línea en escalones (un escalón por
           mensaje), picos por tool call/skill, umbral punteado amarillo "LÍMITE 85 %",
           caída al resumir. Valores ILUSTRATIVOS, sin números en ejes, sin grilla, sin leyenda.
         - gráfico de facturación: barras diarias de papel, 1–22 oct, alturas relativas medidas
           de la captura del usuario (el eje sin montos: no se muestran cifras). Pico 8 oct en
           amarillo. Bandera "release" entre el 13 y el 14 (A CONFIRMAR con el usuario).
         - tiras de eventos (mensaje, tool call, skill, info vieja) que se cortan, arrancan,
           comprimen y doblan en una tarjeta "RESUMEN".
         - tarjeta de código en papel con el snippet de ADK verificado en adk.dev.
MOTION:  El papel se coloca, no aparece: "slap" = scale 1.10→1 y rotación +2°→final en
         0.22 s expo.out, la sombra pasa de 0 30px 40px a la de reposo. Salidas = levantar y
         tirar: y −40 y rotación ±4° en 0.12 s, luego fuera de cuadro 0.28 s power3.in.
         Barras y escalones crecen con steps(6) (stop-motion a 15 fps) en 0.3 s.
         Cámara (punch-ins sobre footage y zooms al código): power2.inOut 0.6 s.
         Rasgado de papel (torn-paper-rip) en 3 costuras; el resto: objeto que se vuelve
         mundo, corte duro en un movimiento, whip de 0.2 s. Ningún elemento de papel con fade.
         Stagger: palabras 80 ms, burbujas por la voz, barras 40 ms.
SHOTS:   ver STORYBOARD.md (14 frames, tiempos anclados a palabras de la voz).
BANNED:  vacío oscuro con cosas flotando; glow, neón, partículas; degradados morado/azul;
         todo centrado; todo con fade-in; texto que se mueve mientras se lee; etiquetas en
         esquinas; tres tarjetas en fila; logo en esquina; emoji como icono (💸 → billete de
         papel recortado); grilla/leyenda en gráficos; el logo y la leyenda del gráfico de
         referencia; la captura de facturación como imagen; logo de WhatsApp.
QA:      t=0.5 hook legible a 360 px y cara libre; t=11.5 pico amarillo en la factura;
         t=24.5 la curva toca el techo; t=48 tiras dobladas en RESUMEN; t=66.5 la caída;
         t=74 y 76 zoom legible en EventsCompactionConfig / LlmEventSummarizer;
         t=88 barras bajas después del release; t=93.1 último frame. Ningún contenido bajo y=1460
         salvo subtítulos (zona 1440–1580); nada en los 250 px superiores.
```
