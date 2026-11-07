---
name: nicobytes
source: evolved for TikTok / short-form overlays (was site-derived zinc + cyan)
updated: 2026-09-18
note: >
  Brand for @nicobytes short-form video (TikTok-first, also Reels / Shorts).
  Kept the engineer voice and teal DNA from nicobytes.com, but swapped flat zinc
  + system UI for a warmer lounge-desk system: soft mint foam, mango punch,
  lagoon teal, butter highlighter, Rubik + JetBrains Mono.

colors:
  foam: "#F3FBF8"           # light canvas — cool mint paper (not cream parchment)
  mist: "#D5EDE6"           # soft elevated surface / sticker fill
  ink: "#152A26"            # primary text — deep teal-black
  night: "#0B1A17"          # dark canvas for overlays on footage
  foam-soft: "#E8F6F1"      # text on night (slightly dimmer than foam)
  mango: "#FF7A45"          # primary punch — hooks, CTAs, stickers
  lagoon: "#1ECAD3"         # secondary voltage — links, code keywords, hairlines
  butter: "#FFE56A"         # highlighter / kinetic word slap
  white: "#FFFFFF"          # rare pure surface (code chrome only)

pairings:
  light: { bg: foam, text: ink, accent: mango, accent-2: lagoon, highlight: butter }
  dark:  { bg: night, text: foam, accent: mango, accent-2: lagoon, highlight: butter }
  voltage: "linear-gradient(135deg, #FF7A45, #1ECAD3)"
  highlighter: "linear-gradient(180deg, transparent 55%, #FFE56A 55%)"  # marker underline

typography:
  display:
    fontFamily: "Rubik"
    weight: 800
    tracking: "-0.03em"
    sizes: "hooks 90px+ (in-feed); landscape heroes 60px+"
  body:
    fontFamily: "Rubik"
    weight: 400
    sizes: "body ≥32px in-feed; ≥20px landscape"
    lineHeight: "1.35–1.45"
  label:
    fontFamily: "JetBrains Mono"
    weight: 700
    tracking: "0.04em"
    size: "chrome / stack tags / timestamps — ≥24px in-feed"

spacing:
  unit: ".25rem"
  radius-md: ".5rem"
  radius-lg: "1rem"
  radius-xl: "1.5rem"
  radius-2xl: "2rem"
  radius-pill: "full"
  shadow-sticker: "4px 4px 0 #152A26"          # hard offset — playful, not soft SaaS blur
  shadow-soft: "0 8px 24px #152A2614"
  glow-mango: "#FF7A4533"
---

# nicobytes — Design

Short-form brand for **@nicobytes** (Nicolas Molina): a relaxed lounge desk for teaching frontend, agents, and applied AI on TikTok. Soft mint foam, one mango punch, lagoon teal as the quiet twin, butter as a highlighter slap. Type is **Rubik** (friendly geometric) with **JetBrains Mono** for stack chrome — not system UI, not zinc flatness.

## Voice & tone

Still first-person practitioner — but warmer and punchier for the feed:

1. **I'm Nicolas Molina.** (who)
2. **I turn complex systems into tools people actually use.** (thesis, shortened for screen)
3. Hook-shaped titles: short, concrete, slightly playful (*“signals > observables (for real)”*, *“the RAG decision I didn’t know I needed”*)

**Sound like:** a senior engineer explaining at a café table — clear stack nouns, zero hype, a little smirk.

**Do not sound like:** agency slogan, “revolutionize,” third-person bio, or dry changelog voice.

## Colors (roles)

| Name | Hex | Role |
|------|-----|------|
| **foam** | `#F3FBF8` | Default light canvas |
| **mist** | `#D5EDE6` | Soft panels / sticker fills on foam |
| **ink** | `#152A26` | Primary text on light; hard sticker shadow |
| **night** | `#0B1A17` | Dark canvas / lower-thirds over footage |
| **foam-soft** | `#E8F6F1` | Secondary text on night |
| **mango** | `#FF7A45` | Primary punch — hooks, CTAs, focal stickers |
| **lagoon** | `#1ECAD3` | Secondary voltage — keywords, hairlines, links |
| **butter** | `#FFE56A` | Highlighter slap under 1–3 words max |
| **white** | `#FFFFFF` | Code-cell chrome only — not a full-frame ground |

**Pairings:** ink on foam; foam on night; mango for the single hot moment; lagoon as support; butter only as a marker underline or sticker fill — never as body text color.

**Voltage:** `linear-gradient(135deg, #FF7A45, #1ECAD3)` — scarce; one use per frame (fill **or** text **or** hairline).

## Type (2 roles + mono chrome)

Load **Rubik** and **JetBrains Mono** (bundled Mono; Rubik via project `@font-face` / Google fetch — do not fall back to `ui-sans-serif`).

1. **Display / body** — `Rubik`, weight **800** for hooks, **400** for supporting lines. Same family, extreme weight contrast.
2. **Label / code / stack tags** — `JetBrains Mono`, weight **700**, slight positive tracking.

**In-feed floor (TikTok / Reels):** body ≥ **32px**, hooks ≥ **90px**, labels ≥ **24px**.  
**Landscape floor:** body ≥ **20px**, hooks ≥ **60px**.

Sentence case by default. ALL CAPS only on mono labels (and only when short).

## Spacing / radius / shadow

- **Radii:** generous — `1rem` → `2rem` on cards; **pill** for tags and CTA chips
- **Elevation:** prefer **hard sticker offset** `4px 4px 0 #152A26` over soft grey SaaS blur; soft shadow only under large photo/UI plates
- **Glow:** mango wash `#FF7A4533` only on the one focal CTA / sticker

## Hard rules

**Always**

- Default canvas is **foam** (light) or **night** (footage overlay) — never raw `#fff` / `#000`
- Fire **mango** as the scarce punch; pair with **lagoon** only inside voltage or as syntax support
- Set type in **Rubik** + **JetBrains Mono** only
- Prefer **sentence case**; first-person when the speaker is Nico
- Name real tech (Angular, agents, RAG, TypeScript) when the claim is technical
- Author TikTok frames for **9:16 first**; scale type up for in-feed legibility

**Never**

- Never reintroduce flat zinc `#18181b` / `#fafafa` / system `ui-sans-serif` as brand truth
- Never use purple/indigo meshes, terracotta/cream editorial, or warm-parchment “AI default” palettes
- Never use Inter / Geist / Poppins / Syne / Playfair as the brand face
- Never put butter on long body copy or use mango + lagoon + butter as three competing solids in one frame
- Never write voice as anonymous SaaS marketing copy
- Never invent follower counts or fake stats

## TikTok / short-form notes

- One idea per beat; ≤ 6–8 words on a hook card
- Stickers and lower-thirds sit in the **lower third** or **top safe** — keep center clear for face cam when footage is present
- Hard sticker shadows + soft mint grounds read “fun” without going kawaii-childish
- Motion: short pops (≤ 280ms) and highlighter slaps — not calm hard-cut-only engineering decks
