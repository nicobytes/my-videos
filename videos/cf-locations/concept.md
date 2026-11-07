# Concepto — Contenido por país con Astro + Cloudflare

> Insumo para el editor de video. Explica **qué** se está contando, **cómo funciona técnicamente** y **qué mostrar en cada momento** del clip `assets/locations.mp4` (≈ 52 s).

---

## 1. La idea en una frase

**Cloudflare ya sabe desde qué país te visitan, antes de que tu página se renderice.** Con Astro puedes leer ese dato en el servidor y entregar la página adaptada (precios, moneda, modismos) en la primera carga: sin selector, sin redirect y sin query params.

---

## 2. El problema (la parte "antes")

Quieres que un visitante de Bolivia vea precios en **bolivianos (Bs)** y uno de Colombia en **pesos colombianos (COP)**. Las soluciones típicas son malas:

| Solución típica | Por qué es mala experiencia |
|---|---|
| **Selector de país** en el sitio | El usuario tiene que hacer un clic más y primero ve contenido genérico. |
| **Query param** (`?country=co`) | URLs feas, hay que compartir el link correcto y no es automático. |
| **Redirect** (`parlana.bo` → `/co`) | Es un salto extra, más lento, y a veces se ve un parpadeo. |

**Lo que uno quiere:** entrar a la URL y que todo ya esté adaptado.

---

## 3. Cómo funciona (la parte técnica, explicada simple)

```
 Usuario en Colombia
        │  pide parlana.bo
        ▼
 ┌──────────────────────────────┐
 │  Red de Cloudflare (edge)    │  ← el servidor más cercano al usuario
 │  Ve la IP → la geolocaliza   │
 │  Agrega a la petición:       │
 │   • request.cf.country = "CO"│
 │   • header CF-IPCountry: CO  │
 └──────────────┬───────────────┘
                ▼
 ┌──────────────────────────────┐
 │  Astro (SSR en Cloudflare)   │
 │  Lee "CO" → elige config CO  │
 │  Renderiza precios en COP    │
 └──────────────┬───────────────┘
                ▼
   HTML ya adaptado, en UNA sola respuesta
```

### El código

```ts
const request = Astro.request as CfRequest;
const cfCountry = request.cf?.country ?? request.headers.get("CF-IPCountry");
const initialCountry = countryFromCfCode(cfCountry);
```

Línea por línea:

1. **`Astro.request as CfRequest`**: la petición que llega a la página. Se le pone el tipo `CfRequest` porque, al correr en Cloudflare, trae información extra que una petición normal no tiene.
2. **`request.cf?.country`**: Cloudflare adjunta a cada petición un objeto `cf` con datos de geolocalización. `country` es el código ISO de 2 letras (`"BO"`, `"CO"`, `"PE"`…). Es la fuente **principal**.
3. **`?? request.headers.get("CF-IPCountry")`**: si `cf` no está disponible, se usa como **respaldo** el header `CF-IPCountry`, que Cloudflare también agrega con el mismo código de país.
4. **`countryFromCfCode(cfCountry)`**: función propia del proyecto. Convierte el código (`"CO"`) en la configuración de ese país (moneda, precios, textos). Si el país no está configurado, devuelve uno por defecto.

**Punto clave para el video:** el país **no** lo pide el navegador ni lo elige el usuario. Lo detecta Cloudflare en su red, antes de que el código de Astro se ejecute. Por eso no hace falta ningún redirect.

### Requisitos (por si alguien pregunta)
- Astro con el adapter de Cloudflare (`@astrojs/cloudflare`), desplegado en Cloudflare.
- La página tiene que renderizarse en el servidor (SSR, `export const prerender = false`). En una página estática no hay petición que leer.
- En desarrollo local el país normalmente viene vacío, así que conviene tener un país por defecto.

### Limitación (la menciona el narrador)
- Si el usuario navega con **VPN**, Cloudflare ve el país de la VPN, no el real. Para la mayoría de visitantes funciona bien.
- Lo ideal es permitir igual que el usuario cambie de país manualmente si lo necesita.

---

## 4. Caso real: Parlana (parlana.bo)

Parlana es la landing page de agentes de IA para WhatsApp que el narrador relanzó hace poco.

| Entras desde | Ves |
|---|---|
| 🇧🇴 Bolivia | Precios en **bolivianos (Bs)** |
| 🇨🇴 Colombia | Precios en **pesos colombianos (COP)** |
| 🇵🇪 Perú / otros configurados | Su moneda / su tono |
| País no configurado | Versión por defecto |

**Beneficio:** hablas el mismo idioma de moneda que el visitante, no eres genérico y **el sitio convierte más**.

Otros usos que menciona: adaptar el **tono** con modismos regionales (colombianos, bolivianos, peruanos). El uso más común es el **pricing**.

---

## 5. Mapa del video (timecodes del SRT → qué mostrar)

| Tiempo | Lo que dice | Beat | Sugerencia visual |
|---|---|---|---|
| 00:00 – 00:05 | "Con Astro y Cloudflare puedes personalizar la experiencia según el país…" | **Hook** | Logos Astro + Cloudflare (`assets/`). Un globo/mapa con un pin que cambia de país. |
| 00:05 – 00:15 | "¿Para qué? Adaptar pricing o modismos según el país…" | **Por qué** | Dos tarjetas de precio lado a lado: `Bs 350` / `COP 200.000`. Chips: "Pricing", "Modismos". |
| 00:15 – 00:30 | "Selector, query param… no es la mejor experiencia. Quieres entrar a la URL y listo, sin redirect" | **Problema** | Las 3 soluciones malas (selector, `?country=co`, redirect) tachándose una por una. Después, una URL limpia: `parlana.bo` ✓ |
| 00:30 – 00:42 | "Ahí entran Astro y Cloudflare (Cloudflare compró Astro hace poco)… su red de cómputo me da un pedacito de código" | **Solución** | Diagrama del punto 3: usuario → edge de Cloudflare → Astro. |
| 00:42 – 00:52 | "Este es el pedazo de código… en los headers… me detecta el país" | **Código** | Las 3 líneas de código, resaltando `request.cf?.country` y `CF-IPCountry`. Un valor `"CO"` saliendo de la línea. |
| 00:52 – 01:05 | "Estrategias de contenido: tono con modismos colombianos, bolivianos, peruanos… o pricing" | **Usos** | Mismo titular en 3 variantes regionales. Banderas 🇨🇴 🇧🇴 🇵🇪. |
| 01:05 – 01:29 | "Relancé Parlana… desde Bolivia, bolivianos; desde Colombia, pesos colombianos" | **Caso real** | Captura de parlana.bo con la tarjeta de precio que cambia de moneda al cambiar la bandera/pin. |
| 01:29 – 01:35 | "Hablar el mismo lenguaje de moneda, no ser genérico, que tu sitio convierta más" | **Beneficio** | Texto grande: "Mismo idioma. Misma moneda. Más conversión." |
| 01:35 – 01:48 | "No funciona con VPN, pero para la mayoría es una gran estrategia… sin redirect, sin query params, nativo" | **Caveat + resumen** | Icono de VPN con ⚠️ pequeño. Luego checklist: ✓ sin redirect ✓ sin query params ✓ nativo. |
| 01:48 – 01:52 | "Cloudflare no me paga nada, es una gran tecnología" | **Cierre** | Logos Astro × Cloudflare, tono ligero. |

> Nota: el SRT llega hasta ~01:52. Si el MP4 está recortado a 52 s, hay que tomar como referencia los timecodes del video final.

---

## 6. Correcciones del transcript (para subtítulos)

El SRT viene de transcripción automática y tiene errores. Al subtitular, usar:

| En el SRT | Correcto |
|---|---|
| Astrid Cloudford / Cloudfor / Cloudford | **Astro + Cloudflare** / **Cloudflare** |
| query paran | **query params** |
| Ruidirect | **redirect** |
| movísmos | **modismos** |
| el relancé Parlana | **relancé Parlana** |
| parlana punto bo | **parlana.bo** |
| "adaptación a de contenido" | **adaptación de contenido** |
| "los precios como en. Pues en pesos colombianos" | **los precios en pesos colombianos** |

---

## 7. Mensajes clave (lo que el espectador debe recordar)

1. **Cloudflare sabe el país del visitante** en cada petición (`request.cf.country` / `CF-IPCountry`).
2. **Astro lo lee en el servidor** y entrega la página ya adaptada.
3. **Sin selector, sin query params, sin redirect.**
4. **Uso estrella: precios en moneda local** (ejemplo real: parlana.bo).
5. **Excepción: VPN.**
