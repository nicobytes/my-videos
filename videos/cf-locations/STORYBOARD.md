---
format: 1080x1920
duration: 112s
message: "Con Astro + Cloudflare tu sitio sabe de qué país lo visitan y se adapta solo — sin selector, sin query params, sin redirect."
arc: Hook → ¿Para qué? → Problema (3 malas soluciones) → Solución (Astro × Cloudflare + adquisición) → Código → Usos (tono / pricing) → Caso real parlana.bo (Bs → COP) → Beneficio → Caveat VPN → Resumen → Cierre
audience: devs web / founders LATAM que venden en varios países
mode: collaborative
workflow: general-video
language: es
footage: assets/locations.mp4
captions: assets/captions.srt
destination: reels / tiktok / shorts
layout: hybrid (face ↔ split ↔ card)
status: decisiones confirmadas (layout híbrido · nicobytes + naranja CF · captions siempre)
---

# Storyboard — Contenido por país con Astro + Cloudflare

> **Este video le dice** a devs y founders LATAM **que** Cloudflare ya conoce el país del visitante en cada petición, y que Astro lo lee en el servidor para entregar precios y tono locales en la primera carga.

Base: talking-head `assets/locations.mp4` (1080×1920 · 29.97fps · **111.78s**), un solo plano, sujeto centrado (cara ≈ 22–40% de la altura). **El audio original manda todo el ritmo**; cada beat está anclado a un timecode del SRT. No se recorta ni se reordena la voz.

## Gramática visual (3 modos de pantalla)

| Modo | Qué se ve | Cuándo |
|---|---|---|
| `FACE` | Talking-head a pantalla completa + **zoom** (punch-in / push lento) + captions | Frases de opinión, preguntas, chistes, transiciones |
| `SPLIT` | Gráfico arriba (≈ 0–56%) · cara recortada abajo (≈ 56–100%) | Screenshots (press release, parlana.bo) y diagramas — se ve la cara mientras explica |
| `CARD` | Card opaca a pantalla completa (sin cara), audio sigue | Código y momentos de tipografía grande |

Regla: **nada encima de la cara.** Los cambios de modo son transiciones con dirección (whip vertical / zoom-through), nunca cortes secos sin motivo.

## Zoom plan (cámara sobre el footage)

- **Base** 1.00 → **push lento** a 1.08 durante frases largas (respira sin "wobble").
- **Punch-in** 1.18–1.25 en palabras clave / preguntas / chistes (ease power4, 0.25s) → vuelve a base en el siguiente cambio de idea.
- Ancla del zoom: entre los ojos (≈ x 50%, y 31%).

| t | Palabra | Zoom |
|---|---|---|
| 3.6 | "país" | punch 1.18 |
| 5.1 | "¿Y para qué…?" | punch 1.25 (rápido) |
| 19.2 | "no es la mejor experiencia" | push 1.08 |
| 29.9 | "Y ahí es donde…" | punch 1.20 + whoosh |
| 52.3 | "Con esto…" | base → push |
| 89.0 | "Con esto puedes adaptar…" | punch 1.18 |
| 95.8 | "Obviamente no funciona…VPN" | push 1.10 |
| 108.6 | "se los prometo, Cloudflare no me paga nada" | punch 1.30 (cómico) |

## Captions (rail)

- Palabra por palabra, grupos de 2–4 palabras, posición ≈ 70% de altura (sobre el pecho, nunca sobre la cara).
- Palabra activa resaltada; **keywords con color**: Cloudflare → naranja `#F38020`, Astro → magenta, monedas (Bs / COP) → verde.
- Texto **corregido** (concept.md §6): Astro + Cloudflare · query params · redirect · modismos · parlana.bo · "los precios en pesos colombianos".
- **Captions siempre visibles** (FACE, SPLIT y CARD). En `CARD` el rail baja a ≈ 84% y la card deja libre esa franja; en `SPLIT` va sobre la franja de la cara.

---

## Frame 1 — Hook

- status: animated
- src: compositions/frames/01-hook.html
- time: 0.00 – 5.08
- duration: 5.08s
- screen: FACE
- voiceover: "Con Astro y Cloudflare puedes personalizar la experiencia del usuario de acuerdo al país que se encuentre."
- scene: Logos Astro × Cloudflare caen en la franja superior (pared); en "país" un pin con bandera 🇧🇴 rebota junto al lockup
- zoom: 1.00 → punch 1.18 en "país" (3.6s)
- sfx: whoosh-short (logos) · pop (pin)
- assets: CF-Logo 1.png · astro-logo-light-gradient.png

Primeros 2 segundos deciden el scroll: logos + promesa ("según el país") antes de cualquier explicación.

## Frame 2 — ¿Para qué?

- status: animated
- src: compositions/frames/02-para-que.html
- time: 5.08 – 15.20
- duration: 10.12s
- screen: FACE
- voiceover: "¿Y para qué uno quiere hacer esto? Normalmente es porque necesitas adaptar la experiencia, por ejemplo, colocar un pricing o colocar modismos de acuerdo al país del cual te estén visitando."
- scene: Punch-in en la pregunta. Luego 2 chips aparecen en la franja superior: "💰 Pricing" (10.4s) y "🗣️ Modismos" (11.7s); en "país" se suma "📍 por país"
- zoom: punch 1.25 en "¿Y para qué?" → vuelve a 1.00 + push lento
- sfx: pop ×3 (chips)

## Frame 3 — El problema

- status: animated
- src: compositions/frames/03-problema.html
- time: 15.20 – 29.86
- duration: 14.66s
- screen: CARD
- transition_in: whip vertical (↑)
- voiceover: "Hay algunas formas de hacer esto, un selector en tu sitio, un query params, pero realmente no es la mejor experiencia. Uno simplemente quiere entrar a la URL y ya encontrarse con esa adaptación de contenido, sin ningún redirect ni nada, automáticamente."
- scene: 3 mini-UIs apiladas: (1) dropdown "Selecciona tu país ▾" (16.9s) (2) URL `parlana.bo/?country=co` (17.9s) — ambas se tachan con ✕ rojo en "no es la mejor experiencia" (19.2s). Luego una barra de navegador limpia escribe `parlana.bo` (21.0–23.3s) → ✓ verde. En "sin ningún redirect" (27.8s) aparece `parlana.bo → /co` y se tacha.
- sfx: error ×2 (tachones) · key-press (tipeo URL) · chime (✓) · error (redirect)

El "antes / después" del video: 3 malas opciones mueren, la URL limpia gana.

## Frame 4 — La solución: Astro × Cloudflare

- status: animated
- src: compositions/frames/04-solucion.html
- time: 29.86 – 42.08
- duration: 12.22s
- screen: FACE → SPLIT → SPLIT
- voiceover: "Y ahí es donde Astro y Cloudflare, que Cloudflare compró Astro hace poco, gracias a su red de cómputo, me dan un pedacito de código en el cual yo puedo literalmente saber de qué país y adaptar el contenido."
- scene: (a) 29.9s FACE punch + lockup Astro × Cloudflare con impacto. (b) 32.2s SPLIT: screenshot del **press release** sube desde abajo; marcador naranja subraya "Cloudflare adquiere Astro" y "16 de enero de 2026". (c) 34.1s el screenshot se va; mapa/globo con nodos del edge de Cloudflare — un usuario 🇨🇴 hace una petición → el nodo más cercano se enciende → etiqueta `country: "CO"` (39.0s "de qué país")
- zoom: punch 1.20 en (a)
- sfx: impact-bass (lockup) · whoosh (screenshot) · marker/sparkle (subrayado) · ping (nodo)
- assets: screenshot press release (cloudflare.com/es-la/press/…/cloudflare-acquires-astro…)
- data_source: "Comunicado de prensa Cloudflare, 16 ene 2026 — 'Cloudflare adquiere Astro para acelerar el futuro del desarrollo web de alto rendimiento'"

## Frame 5 — El código

- status: animated
- src: compositions/frames/05-codigo.html
- time: 42.08 – 52.32
- duration: 10.24s
- screen: CARD (editor oscuro)
- transition_in: zoom-through
- voiceover: "Fíjense, este es el pedazo de código. Simplemente en los headers, cuando yo renderizo esto y está dentro de la nube de Cloudflare, este header o este pedazo del código me detecta el país."
- scene: Ventana de editor `pricing.astro` — las 3 líneas se escriben (42.1–44.0s). 44.1s highlight en `request.headers.get("CF-IPCountry")` ("headers"); 45.5s badge "☁️ corre en el edge de Cloudflare"; 48.2s highlight en `request.cf?.country`; 50.5s "detecta el país" → un chip `"BO" 🇧🇴` sale volando de la línea hacia `initialCountry`.
- sfx: key-press (tipeo) · click (highlights) · ping (chip "BO")

```ts
const request = Astro.request as CfRequest;
const cfCountry = request.cf?.country ?? request.headers.get("CF-IPCountry");
const initialCountry = countryFromCfCode(cfCountry);
```

El frame más "dev" del video: el código tiene que leerse en un celular → fuente mono ≥ 34px, línea 2 partida en `??`.

## Frame 6 — Estrategias de contenido

- status: animated
- src: compositions/frames/06-usos.html
- time: 52.32 – 65.20
- duration: 12.88s
- screen: FACE → CARD
- voiceover: "Con esto, desde mi website, yo puedo hacer estrategias de contenido. Por ejemplo, puedo adaptar el tono a una región, por ejemplo, con modismos colombianos, modismos bolivianos o de Perú, o lo que más se usa es para adaptar el pricing."
- scene: (a) 52.3–55.6s FACE push lento. (b) 55.6s CARD: un mismo saludo de landing cambia por país al ritmo de la voz — 🇨🇴 "¡Quiubo, parce!" (59.0s) → 🇧🇴 "¡Qué tal, che!" (60.2s) → 🇵🇪 "¡Qué tal, causa!" (61.2s). (c) 62.0s el saludo se aparta y entra **"PRICING"** gigante (64.1s).
- sfx: whoosh-short ×3 (flip de saludo) · impact-bass (PRICING)

Modismos confirmados.

## Frame 7 — Caso real: parlana.bo

- status: animated
- src: compositions/frames/07-parlana.html
- time: 65.20 – 89.00
- duration: 23.80s
- screen: SPLIT
- transition_in: whip vertical (↑)
- voiceover: "Hace poco relancé Parlana, que es nuestra landing page para agentes en WhatsApp, y ustedes ingresan directamente a parlana.bo y ahí automáticamente si están en Bolivia, te carga por defecto los precios en bolivianos, pero si tú ingresas desde Colombia, te carga automáticamente los precios en pesos colombianos y así por cada una de las zonas que empiece a detectar y que tenga configurado en mi landing page."
- scene: (a) 65.2s mockup de navegador con el hero de parlana.bo. (b) 69.7s la barra escribe `parlana.bo` → scroll hasta **Planes**. (c) 72.7s pin 🇧🇴 → tarjetas **Bs 450 / Bs 760 / Bs 1.260** (Start · Grow · Scale) se marcan. (d) 79.8s "desde Colombia": el pin vuela a 🇨🇴 y los precios ruedan tipo slot-machine a **COP 145.000 / COP 250.000 / COP 415.000** (~81.9s, justo en "pesos colombianos" 83.5s). (e) 85.1s "por cada zona": fila de banderas BO · PE · CO · MX · AR · CL · EC · BR · US se enciende una por una.
- sfx: key-press (URL) · whoosh (scroll) · pop (pin) · **cha-ching / sparkle** (cambio de moneda) · ping ×9 suaves (banderas)
- assets: captura parlana.bo hero + sección precios (BO) + sección precios (CO)
- data_source: "parlana.bo #precios, selector #pricing-country-select — BO: Bs 450,00 / 760,00 / 1.260,00 · CO: COP 145.000 / 250.000 / 415.000 (capturado 2026-10-06)"

El clímax: la prueba real. El cambio Bs → COP es el único momento con 'cha-ching'.

## Frame 8 — Beneficio

- status: animated
- src: compositions/frames/08-beneficio.html
- time: 89.00 – 95.72
- duration: 6.72s
- screen: FACE
- voiceover: "Con esto puedes adaptar el contenido, hablar el mismo lenguaje de moneda y no ser genérico y hacer que tu sitio convierta más."
- scene: Triada kinética en la franja superior: "Mismo idioma." (90.6s) · "Misma moneda." (91.5s) · "Más conversión ↗" (95.0s)
- zoom: punch 1.18 al inicio → push lento
- sfx: pop ×2 · riser corto → impact (conversión)

## Frame 9 — Caveat: VPN

- status: animated
- src: compositions/frames/09-vpn.html
- time: 95.72 – 101.44
- duration: 5.72s
- screen: FACE
- voiceover: "Obviamente no funciona si el usuario está navegando por alguna VPN, pero para la mayoría de casos es una gran estrategia…"
- scene: Badge pequeño "⚠️ con VPN → ve el país de la VPN" en la franja superior; se desvanece en "pero para la mayoría"
- zoom: push 1.10
- sfx: notification (badge)

Tono honesto y breve — no rompe el ritmo.

## Frame 10 — Resumen

- status: animated
- src: compositions/frames/10-resumen.html
- time: 101.44 – 108.64
- duration: 7.20s
- screen: CARD
- transition_in: zoom-through
- voiceover: "…para adaptar tu contenido de forma automática, sin redirect, sin query params, normal, de forma nativa usando la red de Cloudflare y Astro."
- scene: Checklist que se marca con la voz: ✓ Automático (101.9s) · ✓ Sin redirect (103.6s) · ✓ Sin query params (104.4s) · ✓ Nativo (106.0s) → lockup Astro × Cloudflare abajo (107.6s)
- sfx: click ×4 (checks) · chime (lockup)

## Frame 11 — Cierre

- status: animated
- src: compositions/frames/11-cierre.html
- time: 108.64 – 111.78
- duration: 3.14s
- screen: FACE
- voiceover: "Y se los prometo, Cloudflare no me paga nada, es lo que me parece una gran tecnología."
- scene: Punch-in cómico 1.30; sticker "#NoEsPublicidad 😅" entra girando en la franja superior; último frame: logo nicobytes / handle (opcional)
- zoom: punch 1.30
- sfx: pop (sticker)

---

## Asset ledger

| ID | Archivo / fuente | Uso |
|---|---|---|
| A-footage | `assets/locations.mp4` | Base de video + audio (todo el runtime) |
| A-srt | `assets/captions.srt` | Timing + captions (corregidas) |
| A-cf | `assets/CF-Logo 1.png` | Logo Cloudflare (fondo claro) |
| A-astro | `assets/astro-logo-light-gradient.png` | Logo Astro (versión clara → solo sobre fondo oscuro) |
| S-press | captura de cloudflare.com/es-la/press/… | Frame 4 |
| S-parlana-hero | captura parlana.bo | Frame 7a |
| S-parlana-bo / S-parlana-co | captura #precios con selector BO / CO | Frame 7c–d |
| SFX | reutilizar `../prices/assets/sfx/` (whoosh, pop, error, chime, key-press, impact-bass, ping, sparkle, riser, notification, click) + buscar "cha-ching" | Todo |
| Design | `../effects/frame.md` (nicobytes: ink #18181b · paper #fafafa · slate #27272a · cyan #06b6d4 · emerald #10b981) + naranja Cloudflare `#F38020` · JetBrains Mono para código | Todo |
