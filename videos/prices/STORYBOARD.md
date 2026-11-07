---
format: 1080x1920
duration: 135s
message: "Desde el 1 de octubre, automatizar WhatsApp en Bolivia cuesta — pero los primeros 1.000 mensajes/mes siguen gratis"
arc: Hook (fecha) → Tarifas ya conocidas (Marketing, Utility) → El cambio (Servicio inbound pasa a cobrar) → Alivio (umbral de 1.000 gratis) → Refuerzo → Buena noticia (Click-to-WhatsApp sigue gratis) → Cierre
audience: dueños de negocio / devs en Bolivia con bots, IA o CRMs ya conectados a la API de WhatsApp Business
---

## Frame 1 — Fecha

- status: built
- src: compositions/frames/01-fecha.html
- duration: 6.6s
- voiceover: "Desde hoy, primero de octubre, WhatsApp empieza a cobrar ciertas tarifas si tienes automatizaciones, sobre todo cuando utilizas la API."
- scene: Sello/ticket de fecha "1 oct 2026" en la zona de cielo, tono de alerta — sin postal todavía, aún no se nombra ningún precio
- overlay_color: ink
- data_source: "concept.md §1 — fecha de entrada en vigencia"

Apertura. Fija el disparador del video (la fecha) antes de cualquier cifra.

## Frame 2 — Título de sección

- status: built
- src: compositions/frames/02-titulo.html
- duration: 5.56s
- voiceover: "Vamos a repasar esos precios y cómo aplican aquí en Bolivia. Hay muchas alarmas de estos precios, pero vamos a repasar cuáles son."
- scene: section-head "Nueva tarifa de WhatsApp — Bolivia" reemplaza el sello de fecha
- overlay_color: ink
- data_source: "—"

Transición de hook a cuerpo del video — nombra el país y el tema.

## Frame 3 — Marketing

- status: built
- src: compositions/frames/03-marketing.html
- duration: 22.4s
- voiceover: "Primero tenemos los mensajes de marketing que cuestan 0.9 bolivianos. [...] si tú tuviste contacto, por ejemplo, alguna vez con ese WhatsApp, pueden enviar una campaña [...] los bancos en donde te ofrecen una tarjeta de crédito [...] esa es la tarifa."
- scene: Ticket centrado — numeral + tag-claim "Marketing", tono neutro (esta tarifa YA se cobraba, no es la novedad)
- overlay_color: neutral
- data_source: "concept.md §2.1 — Marketing: Bs 0,9354/msg, ya se cobraba"

Primer dato duro del video. Establece el patrón visual "ticket" que se reutiliza en los siguientes beats.

## Frame 4 — Utility

- status: built
- src: compositions/frames/04-utility.html
- duration: 29.88s
- voiceover: "Ahora tenemos los mensajes de utility y estos están en 0.1 bolivianos [...] un password o un código [...] recordatorios de citas [...] recordatorios de tus pedidos [...] por eso cuesta mucho menos."
- scene: Segundo ticket, mismo tratamiento neutro — ledger acumulando: la fila de Marketing sube/se reduce, Utility se agrega debajo
- overlay_color: neutral
- data_source: "concept.md §2.1 — Utility: Bs 0,1428/msg, ya se cobraba"

Segunda tarifa conocida. El patrón "ledger que acumula" prepara al espectador para el contraste del Frame 5.

## Frame 5 — El cambio (clímax)

- status: built
- src: compositions/frames/05-el-cambio.html
- duration: 18.04s
- voiceover: "Luego está el gran cambio [...] automatizaciones [...] inteligencia artificial [...] respondes dentro de un hilo conversacional. Estos no se cobraban, estos eran gratis, pero WhatsApp a partir de hoy, primero de octubre, los empieza a cobrar con la misma tarifa de Utility."
- scene: ÚNICO frame con postal. "Gratis" en ledger-green se apaga/tacha → el ticket se enciende en postal: "Servicio inbound — antes Bs 0 → ahora Bs 0,1428/msg"
- overlay_color: postal
- data_source: "concept.md §2.1 — Servicio inbound (automatización), nuevo desde 1 oct 2026, misma tarifa que Utility"

El clímax narrativo y visual. Regla de frame.md/concept.md: postal se gana una sola vez en todo el video — es este frame.

## Frame 6 — Umbral gratuito

- status: built
- src: compositions/frames/06-umbral.html
- duration: 7.84s
- voiceover: "Hay algo importante, y es que los primeros 1000 mensajes que envíes van a ser gratis. A partir de 1000 para adelante, pues ya se te cobra la tarifa de Utility."
- scene: Callout brass "primeros 1.000 gratis" bajo el ticket rojo que sigue sostenido del Frame 5 — el único acento brass del video
- overlay_color: brass (subordinado al postal sostenido)
- data_source: "concept.md §2.1 — umbral: primeros 1.000 msg/mes de Servicio inbound gratis"

El respiro inmediato después del susto del rojo — calma sin anular el mensaje central.

## Frame 7 — Refuerzo

- status: built
- src: compositions/frames/07-refuerzo.html
- duration: 23.32s
- voiceover: "Esto es muy importante porque si tienes automatizaciones, estos mensajes antes eran gratis [...] pero ahora son los que empiezan a cobrar [...] De nuevo, recuerda que tienes 1000 mensajes gratis, después de eso si empiezas a pagar [...] WhatsApp, Meta y Facebook quieren potenciar tu plataforma."
- scene: Sostener el overlay del Frame 5/6 (no se repite el ticket completo) — opcional: pulso corto en la línea de ledger del umbral
- overlay_color: (sostenido, sin postal nuevo)
- data_source: "concept.md §4 — regla: no repetir el ticket completo en el refuerzo"

Repetición narrativa del guion — el overlay descansa en vez de reconstruirse.

## Frame 8 — Buena noticia

- status: built
- src: compositions/frames/08-buena-noticia.html
- duration: 18.08s
- voiceover: "Y si el mensaje, si la conversación fue iniciada por un ad de Instagram, de Facebook, de WhatsApp, literalmente si dan en el botón click to add, o vino desde un anuncio de una campaña paga, hay una ventana de 72 horas. Todo eso va a ser gratis, pero sí viene desde allá."
- scene: Ticket/ledger en ledger-green — "Click-to-WhatsApp Ads — $0 · ventana 72h" — contraste deliberado con el rojo del Frame 5
- overlay_color: ledger-green
- data_source: "concept.md §2.1 — Click-to-WhatsApp Ads: $0 (Meta), ventana de 72h, sigue gratis"

La "buena noticia" que cierra antes del cierre final — alivia después del clímax.

## Frame 9 — Cierre

- status: built
- src: compositions/frames/09-cierre.html
- duration: 2.96s
- voiceover: "Así que sí, esta es la nueva tarifa de costos aplicadas para Bolivia."
- scene: Sostener el overlay verde del Frame 8 hasta el final — SIN card de total (decisión confirmada: el guion no narra el ejemplo numérico de cierre del screenshot, así que no se muestra)
- overlay_color: ledger-green (sostenido)
- data_source: "—"

Cierre limpio sobre la nota positiva, sin introducir una cifra que el audio no dice.
