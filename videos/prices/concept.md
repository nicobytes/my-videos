# concept.md — "prices" (nueva tarifa de WhatsApp Business API en Bolivia)

> Documento de referencia para el agente que va a diseñar/animar los overlays
> gráficos de este video. No es un brief de ruteo (eso es `BRIEF.md`, que no
> existe todavía) ni el sistema visual (eso es `frame.md`, ya fijado). Este
> archivo explica **de qué trata el video** y aporta **los datos duros**
> exactos que cualquier animación debe mostrar — no inventar ni redondear
> distinto a como aparecen aquí.

## 1. Qué es este video

Es un **talking-head explicativo** (workflow `/talking-head-recut`): hay
metraje real de una persona hablando a cámara (`precios.mp4`, con su
transcripción palabra-por-palabra lista para sincronizar en `prices.srt`), y
el trabajo del agente es vestirlo con **overlays gráficos** (tickets de
precio, líneas de ledger, callouts) sincronizados al guion — el clip de abajo
no se toca, no se recorta, no se re-ordena.

El tema: **a partir del 1 de octubre, WhatsApp (Meta) empieza a cobrar
tarifas nuevas a negocios que usan la API de WhatsApp Business para
automatizaciones (bots, IA, CRMs)**, y el video explica esas tarifas
aplicadas específicamente a **Bolivia**. Es contenido de utilidad/alerta para
dueños de negocio o devs que ya tienen automatizado su WhatsApp y van a ver
subir su factura sin haber cambiado nada de su lado.

**Formato:** 9:16 vertical (1080×1920, ver `frame.md`), con captions
quemados ya resueltos en `compositions/captions.html` — las animaciones de
esta pieza son overlays **adicionales** a los captions, no un reemplazo.

**Sistema visual ya fijado** (`frame.md`, "Ticket & Ledger"): dos voces
tipográficas que nunca se mezclan — **League Gothic** (condensada, el precio
que grita, `ticket-numeral`/`tag-claim`) y **Space Mono** (el detalle que se
lee en voz baja, `ledger-line`/`unit-label`). Colores: `postal` (#C8381F)
reservado para **el precio nuevo que duele** (la tarifa que antes era
gratis), `ledger-green` (#2F6B4F) para **lo que sigue incluido/gratis**,
`brass` (#AB8332) para **un solo dato de unidad** por frame (ej. "primeros
1.000 gratis"). Ese mapeo de color → significado es la lógica central de las
animaciones de este video: *rojo = ahora cobra, verde = sigue gratis*.

## 2. Fuentes de datos duros (no inventar números fuera de esto)

1. **`prices.srt`** — el guion real narrado en el video (verdad de lo que se
   dice y en qué momento).
2. **Screenshot "Calculadora WhatsApp" (Meta, país Bolivia, estimación con
   tarifas de lista Meta jul 2026)** — las cifras exactas en bolivianos.
3. **Documentación oficial de Meta**
   (`developers.facebook.com/documentation/business-messaging/whatsapp/pricing`)
   — define las categorías de mensaje y su lógica de cobro a nivel global;
   úsala para la terminología, no para contradecir las cifras locales de (2).

### 2.1 Categorías de mensaje y tarifa (Bolivia, Bs)

| Categoría | Tarifa | Qué es | Cobra desde |
|---|---|---|---|
| **Marketing** | Bs 0,9354 / msg | Mensajes salientes comerciales/campaña a alguien que ya tuvo contacto con el número (ej. banco ofreciendo tarjeta de crédito). La más cara. | Ya se cobraba |
| **Utility** | Bs 0,1428 / msg | Notificaciones: confirmaciones, OTP/password, recordatorios de citas o de pedidos ya hechos. No es campaña. | Ya se cobraba |
| **Servicio inbound** (conversación/automatización) | Bs 0,1428 / msg (misma tarifa que Utility) | Respuestas dentro de un hilo conversacional — el caso típico de **bots, IA, automatizaciones de API**. Antes del 1 oct era **gratis**. | **Nuevo: 1 oct 2026** |
| **Click-to-WhatsApp Ads** | $0 (Meta) | Conversación iniciada por un clic en un anuncio de Instagram/Facebook/WhatsApp ("Click to add"), ventana de **72 horas** gratis. | Sigue gratis |

**Umbral gratuito clave:** los primeros **1.000 mensajes/mes** de "Servicio
inbound" (automatización) son gratis; de ahí en adelante se cobra la tarifa
de Utility (Bs 0,1428/msg). Esto es lo más importante que el video comunica:
*no es que todo empiece a cobrar desde el mensaje 1*.

### 2.2 El ejemplo numérico del screenshot (usarlo como caso ancla si se anima una calculadora/ledger)

- Marketing: 1.000 msg → **Bs 935,36**
- Utility: 400 msg → **Bs 57,13**
- Servicio inbound: 1.200 msg → **+Bs 28,57** de impacto
  (verificable: 1.200 − 1.000 gratis = 200 msg cobrados × Bs 0,1428 ≈ Bs 28,56)
- Click-to-WhatsApp Ads: 500 msg → **Bs 0**
- **Total actual: Bs 992,49/mes → Total octubre 2026: Bs 1.021,06/mes**
  (**+Bs 28,57, +3%** de impacto)
- Nota legal del screenshot: *"Estimación con tarifas de lista Meta (jul
  2026). No es una cotización oficial."* / *"Meta factura Bolivia en USD...
  tipo de cambio de referencia al 2026-09-08."* — si se muestra el total en
  pantalla, este disclaimer debe poder leerse (aunque sea en `ledger-fine`),
  no es opcional ocultarlo.

### 2.3 Terminología de respaldo (Meta docs, uso solo como contexto/glosario)

- Modelo de cobro es **por mensaje entregado** (no por conversación) desde
  jul 2025.
- Las categorías oficiales son: Marketing, Utility, Authentication,
  Service/Inbound.
- Existen niveles de volumen con tarifas más bajas para Utility/Authentication
  según cuánto envías al mes (no hay cifras concretas de esto en el guion —
  no animar un dato que no está en §2.1/§2.2).

## 3. Desglose por beats (srt → intención de overlay)

Los tiempos son los del `.srt`. Cada beat es candidato a un **ticket** (precio
hero, centrado, `ticket-numeral`/`tag-claim`) o una **línea de ledger**
(detalle, alineado a la izquierda, `ledger-line`), según el patrón de
`frame.md`. No animar dos precios "hot" (`postal`) en el mismo frame.

| Tiempo | Línea narrada | Dato duro a mostrar | Sugerencia visual |
|---|---|---|---|
| 0:00–0:05 | "Desde hoy, primero de octubre, WhatsApp empieza a cobrar ciertas tarifas si tienes automatizaciones..." | Fecha: **1 oct 2026** | Apertura: sello/ticket de fecha, tono de alerta pero sin color `postal` todavía (aún no se nombra ningún precio) |
| 0:05–0:12 | "Vamos a repasar esos precios... aquí en Bolivia. Hay muchas alarmas..." | — | Título/section-head: "Nueva tarifa de WhatsApp — Bolivia" |
| 0:12–0:23 | "mensajes de marketing que cuestan 0.9 bolivianos... campaña... banco ofreciendo tarjeta de crédito" | **Bs 0,9354/msg — Marketing** | Ticket hero con el numeral, `tag-claim` "Marketing", sin `postal` (esta tarifa no es la novedad) |
| 0:35–0:45 | "mensajes de utility... 0.1 bolivianos... password u OTP... recordatorio de cita" | **Bs 0,1428/msg — Utility** | Segundo ticket, mismo tratamiento neutro, posiblemente en una secuencia tipo "ledger" que va acumulando categorías (marketing → utility) |
| 1:05–1:23 | "el gran cambio... automatizaciones... IA... respondes dentro de un hilo... esto no se cobraba, era gratis, pero a partir de hoy lo cobran con la tarifa de Utility" | **Servicio inbound: de Bs 0 → Bs 0,1428/msg** | Este es el clímax del video: una transición "gratis" (`ledger-green`, tachado o apagándose) → "ahora cobra" (`postal`, el ticket que se enciende). Es el único momento que debería usar el rojo `postal` con fuerza. |
| 1:23–1:30 | "los primeros 1000 mensajes... van a ser gratis, a partir de 1000 ya se cobra" | **1.000 msg gratis/mes** (umbral) | Callout `brass` (el único acento de unidad permitido por frame) sobre el ticket rojo — "primeros 1.000 gratis" calma el susto que acaba de generar el rojo |
| 1:30–1:49 | repite el mismo punto (refuerzo narrativo) | mismos datos | No repetir el ticket completo; reforzar con una línea de ledger corta o dejar el overlay anterior sostenido |
| 1:49–2:12 | "si la conversación fue iniciada por un ad... click to add... ventana de 72 horas... todo eso va a ser gratis" | **Click-to-WhatsApp Ads: $0, ventana de 72h** | Ticket/ledger en `ledger-green` — es la "buena noticia" que cierra antes del cierre final, contraste deliberado con el rojo de 1:05 |
| 2:12–2:15 | "esta es la nueva tarifa... aplicada para Bolivia" | Resumen: **Bs 992,49 → Bs 1.021,06/mes (+3%)** | Cierre tipo recibo/ledger total — el ejemplo numérico de §2.2 como "ticket total", en fondo `night` (frame de cierre/CTA según frame.md) |

## 4. Reglas narrativas para la animación

- **El rojo (`postal`) se gana, no se regala.** Úsalo solo cuando el guion
  está nombrando el cargo que antes no existía (el beat de 1:05–1:23). Si se
  usa en Marketing/Utility (que ya se cobraban) se pierde el contraste que
  hace entender "esto es lo nuevo".
- **El verde (`ledger-green`) es alivio.** Úsalo para lo que sigue gratis
  (Click-to-WhatsApp, los primeros 1.000 mensajes) — es el respiro después
  del susto del rojo.
- **No both en el mismo frame** salvo que uno sea claramente subordinado
  (frame.md ya lo dice): ej. el ticket rojo de "Servicio inbound" con una
  línea pequeña verde de "primeros 1.000 gratis" debajo sí es válido.
- **Un solo `brass` por frame, y solo para un dato de unidad** — candidato
  natural: "1.000 msg" o "72 horas".
- **No inventar cifras.** Si una animación necesita un número que no está en
  §2, no se anima ese número — se vuelve a este archivo primero.
- Los captions ya están resueltos en `compositions/captions.html` y respetan
  la zona segura de `shared/CAPTIONS.md` (contenido de escena ≤ y≈1460). Los
  nuevos overlays de precio deben vivir dentro de esa misma zona segura, no
  superponerse a los captions.

## 5. Gaps conocidos / a confirmar antes de animar

- No hay `BRIEF.md` todavía — este `concept.md` cubre el contenido, pero
  duración total objetivo, CTA de cierre (si lleva alguno) y destino de
  publicación no están decididos.
- El screenshot es una estimación ("no es una cotización oficial"); si el
  video muestra el total Bs 992,49 → Bs 1.021,06, debe quedar claro que es un
  ejemplo/estimación, no una promesa de factura exacta.
- La doc oficial de Meta menciona niveles de volumen con tarifas más bajas
  para Utility/Authentication — no hay cifras de esto en el guion ni en el
  screenshot, así que no se anima (ver regla "no inventar cifras" en §4).
