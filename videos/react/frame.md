---
name: nicobytes-frame
source: derived from design.md (nicobytes short-form brand, 2026-09-18)
primary_frame: 1920x1080 (landscape)
also: 1080x1920 (portrait, 9:16) · 1080x1080 (1:1)
note: >
  Video-first companion to design.md. Same atoms — foam / mango / lagoon / butter,
  Rubik + JetBrains Mono, hard sticker shadow, pill radii — re-framed so the frame
  is the unit. Landscape 16:9 is primary here; 9:16 and 1:1 reflow rules follow.

colors:
  foam: "#F3FBF8"
  mist: "#D5EDE6"
  ink: "#152A26"
  night: "#0B1A17"
  foam-soft: "#E8F6F1"
  mango: "#FF7A45"
  lagoon: "#1ECAD3"
  butter: "#FFE56A"
  white: "#FFFFFF"

pairings:
  light: { bg: foam, text: ink, accent: mango, accent-2: lagoon, highlight: butter }
  dark:  { bg: night, text: foam-soft, accent: mango, accent-2: lagoon, highlight: butter }
  voltage: "linear-gradient(135deg, #FF7A45, #1ECAD3)"
  highlighter: "linear-gradient(180deg, transparent 55%, #FFE56A 55%)"

typography:
  # ── reading ramp (source) — px + cqw equivalents (÷1920×100) ──
  body:
    fontFamily: "Rubik"
    weight: 400
    fontSize: "32px / 1.67cqw"
    lineHeight: 1.4
  body-landscape:
    fontFamily: "Rubik"
    weight: 400
    fontSize: "28px / 1.46cqw"     # at or just above the 1.4cqw floor
    lineHeight: 1.4
  label-mono:
    fontFamily: "JetBrains Mono"
    weight: 700
    fontSize: "24px / 1.25cqw"     # chrome only — below floor
    tracking: "0.04em"
  # ── display / hero ramp (frame-native, cqw) ──
  wordmark-mega:
    fontFamily: "Rubik"
    weight: 800
    fontSize: "26cqw"              # cover-plate wordmark
    lineHeight: 0.84
    tracking: "-0.03em"
  display-hero:
    fontFamily: "Rubik"
    weight: 800
    fontSize: "13cqw"              # ≤3-word hook
    lineHeight: 0.9
    tracking: "-0.03em"
  display-claim:
    fontFamily: "Rubik"
    weight: 800
    fontSize: "8.2cqw"             # 4–6 word claim
    lineHeight: 0.95
    tracking: "-0.02em"
  display-long:
    fontFamily: "Rubik"
    weight: 800
    fontSize: "5.4cqw"             # 7+ word claim
    lineHeight: 1.02
    tracking: "-0.02em"
  section-head:
    fontFamily: "Rubik"
    weight: 800
    fontSize: "4.2cqw"
    lineHeight: 1.0
    tracking: "-0.02em"
  stat-numeral:
    fontFamily: "Rubik"
    weight: 800
    fontSize: "12cqw"
    lineHeight: 0.9
    tracking: "-0.03em"
  stat-ledger:
    fontFamily: "Rubik"
    weight: 800
    fontSize: "4.6cqw"             # ledger cell numeral
    lineHeight: 0.95
  pill-giant:
    fontFamily: "Rubik"
    weight: 800
    fontSize: "3.4cqw"
    lineHeight: 1.0
    tracking: "-0.01em"
  kicker-mono:
    fontFamily: "JetBrains Mono"
    weight: 700
    fontSize: "1.5cqw"
    tracking: "0.06em"
    transform: "uppercase"
  code-mono:
    fontFamily: "JetBrains Mono"
    weight: 700
    fontSize: "1.85cqw"
    lineHeight: 1.5
    tracking: "0.02em"

rounded:
  radius-md: ".5rem"
  radius-lg: "1rem"
  radius-xl: "1.5rem"
  radius-2xl: "2rem"
  radius-pill: "9999px"

spacing:
  unit: ".25rem"
  frame-pad: "5cqw"                # safe area from every frame edge
  frame-pad-tight: "3.2cqw"
  gutter: "2.4cqw"
  shadow-sticker: "0.42cqw 0.42cqw 0 #152A26"   # hard offset scaled to frame
  shadow-sticker-px: "4px 4px 0 #152A26"        # original chrome value
  shadow-soft: "0 8px 24px #152A2614"
  glow-mango: "0 0 0 0.4cqw #FF7A4533"

components:
  surface-foam:
    backgroundColor: "{colors.foam}"
    textColor: "{colors.ink}"
  surface-mist:
    backgroundColor: "{colors.mist}"
    textColor: "{colors.ink}"
  surface-night:
    backgroundColor: "{colors.night}"
    textColor: "{colors.foam-soft}"

  wordmark:
    typography: "{typography.wordmark-mega}"
    textColor: "{colors.ink}"

  sticker-mango:
    backgroundColor: "{colors.mango}"
    textColor: "{colors.ink}"
    typography: "{typography.pill-giant}"
    rounded: "{rounded.radius-2xl}"
    padding: "1.4cqw 2.4cqw"
    boxShadow: "{spacing.shadow-sticker}"

  sticker-lagoon:
    backgroundColor: "{colors.lagoon}"
    textColor: "{colors.ink}"
    typography: "{typography.pill-giant}"
    rounded: "{rounded.radius-2xl}"
    padding: "1.4cqw 2.4cqw"
    boxShadow: "{spacing.shadow-sticker}"

  sticker-mist:
    backgroundColor: "{colors.mist}"
    textColor: "{colors.ink}"
    typography: "{typography.pill-giant}"
    rounded: "{rounded.radius-2xl}"
    padding: "1.4cqw 2.4cqw"
    boxShadow: "{spacing.shadow-sticker}"

  button-primary:
    backgroundColor: "{colors.mango}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.radius-pill}"
    padding: "0.75rem 1.25rem"

  button-primary-giant:
    backgroundColor: "{colors.mango}"
    textColor: "{colors.ink}"
    typography: "{typography.pill-giant}"
    rounded: "{rounded.radius-pill}"
    padding: "1.6cqw 3.2cqw"
    boxShadow: "{spacing.shadow-sticker}"

  code-cell:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.code-mono}"
    rounded: "{rounded.radius-xl}"
    padding: "2.4cqw 2.6cqw"
    boxShadow: "{spacing.shadow-sticker}"
    keywordColor: "{colors.lagoon}"
    commentColor: "{colors.ink}66"

  stack-tag:
    backgroundColor: "{colors.mist}"
    textColor: "{colors.ink}"
    typography: "{typography.kicker-mono}"
    rounded: "{rounded.radius-pill}"
    padding: "0.7cqw 1.4cqw"

  lower-third:
    backgroundColor: "{colors.night}"
    textColor: "{colors.foam-soft}"
    typography: "{typography.body-landscape}"
    rounded: "{rounded.radius-xl}"
    padding: "2cqw 2.6cqw"

  eyebrow-index:
    typography: "{typography.kicker-mono}"
    textColor: "{colors.ink}"

  eyebrow-index-dark:
    typography: "{typography.kicker-mono}"
    textColor: "{colors.lagoon}"

  highlighter-slap:
    background: "{pairings.highlighter}"
    textColor: "{colors.ink}"
    typography: "{typography.display-hero}"
    padding: "0 0.4cqw"

  hairline-lagoon:
    backgroundColor: "{colors.lagoon}"
    height: "0.16cqw"

  ledger-cell:
    backgroundColor: "{colors.foam}"
    textColor: "{colors.ink}"
    rounded: "{rounded.radius-lg}"
    padding: "1.6cqw 1.8cqw"
    borderTop: "0.16cqw solid {colors.mist}"

  voltage-band:
    background: "{pairings.voltage}"
    height: "0.5cqw"
---

# frame.md — nicobytes at frame scale

> **Atoms are sacred · composition is free · numbers come from the script.**

## Overview

nicobytes on video is the same relaxed lounge desk as the site — **foam** paper, one **mango** punch, **lagoon** as the quiet twin, **butter** as a marker slap — but the unit changes. The frame replaces the scroll. A hook is a plate, not a heading. Rubik 800 runs 5–30× bigger than any web hero, and JetBrains Mono runs as chrome, not as decoration. Landscape 16:9 (1920×1080) is the primary frame here; 9:16 and 1:1 are re-flows, not re-designs.

**Frame Craft Bar** — every frame passes these before any structural check:

- **Squint test** — one element dominates at **3–6×** its nearest neighbor. The wordmark, the hook, the numeral. Never a ramp of same-sized things.
- **Silence test** — cover / claim / stat / closer plates read **55–75% empty**. Foam space is the confidence. The **catalog/ledger** treatment is the *single* density exception.
- **Restraint test** — mango fires **once per frame** (fill *or* text *or* glow). Butter appears **once per frame maximum** and only under 1–3 words. Voltage gradient appears at most once (fill *or* text *or* hairline — never all three).
- **Reference bar** — aim: a Stripe Sessions keynote plate rendered by someone who watches too much design-critique TikTok. Failure: a generic dark-mode dev-tool feature grid, or a childish sticker collage.

## Colors

Same tokens as `{colors.*}` in design.md, re-cast as **full-frame grounds** and rationed accents:

- **Grounds.** `{components.surface-foam}` is the default light frame. `{components.surface-mist}` is a soft alternative when foam feels too clinical. `{components.surface-night}` is the footage/overlay ground and the closer plate. Never `#fff` or `#000` as a full ground.
- **The one hot moment.** `{colors.mango}` fires once — a sticker, a giant pill, a wordmark accent dot. If it appears twice, demote one to `{colors.lagoon}`.
- **Lagoon is a hairline, a keyword, a support voltage.** It supports; it does not shout.
- **Butter is a marker slap.** `{pairings.highlighter}` under **1–3 words maximum**, never as body color, never as a full ground.
- **Voltage** (`{pairings.voltage}`) is scarce — reserved for the closer plate's CTA fill *or* a headline word, never both in the same frame.
- **White** is code-cell chrome only. It never becomes a frame ground.

## Typography

Two ramps live in the frontmatter — a **reading ramp** (px + cqw equivalents) and a **display/hero ramp** authored frame-native in `cqw`.

**Reading ramp** carries body and label roles from the source. Body copy on a landscape frame targets `{typography.body-landscape}` (28px ≈ 1.46cqw), which just clears the legibility floor. Mono labels (`{typography.label-mono}`) at 24px sit **below** the floor and are chrome only — timestamps, stack tags, index eyebrows. They may never carry a beat's meaning.

**Display / hero ramp** is the video-native layer. `{typography.wordmark-mega}` at 26cqw is the identity plate. `{typography.display-hero}` at 13cqw is a ≤3-word hook. `{typography.display-claim}` (8.2cqw) is the 4–6-word claim. `{typography.display-long}` (5.4cqw) is the 7+ word claim — long lines go small so the block stays ≤ **78cqw** wide and never touches the safe margin.

**Legibility floor.** Any load-bearing line ≥ **1.4cqw** (≈27px @ 1920). Below that is chrome only. This is stricter than the source's 20px landscape body — landscape frames deserve slightly more air.

**Case.** Sentence case for Rubik. ALL CAPS only on `{typography.kicker-mono}` chrome, and only when short.

## Layout — The Frame

- **Primary frame:** 1920×1080 (16:9). Also authored: 1080×1920 (9:16) and 1080×1080 (1:1).
- **Safe area:** `{spacing.frame-pad}` (5cqw) from every edge on 16:9. On 9:16 keep 5cqw on the long edge and 6cqw on the short edge so lower-thirds clear TikTok chrome.
- **Frame-relative law.** Display sizes, gaps, and pads authored in `cqw` against the frame container (`px ÷ 1920 × 100 = cqw`). Fixed `px` reserved for hairlines, `radius-md/lg/xl/2xl` (source's rem values), the source's `shadow-sticker-px`, and micro chrome. This lets a frame render at true proportions in a contact sheet or full-bleed.
- **Container-query note.** In `frame-showcase.html`, frames use `container-type: size` and author internal sizing in `cqw` mapped 1:1 from these values — `vw` would resolve against the viewport and blow every frame full-screen.

## Elevation & Depth

Depth ceiling for frames: one plane of lift, maximum. `{spacing.shadow-sticker}` (hard mango-shadow offset scaled to `0.42cqw 0.42cqw 0 ink`) is the brand's signature elevation — playful, printed-sticker energy, not SaaS blur. `{spacing.shadow-soft}` is reserved for the occasional large photo/UI plate underneath a code cell. `{spacing.glow-mango}` fires only on the single focal sticker of a frame. Never stack a sticker shadow on top of a soft shadow.

## Shapes

Pill (`{rounded.radius-pill}`) for tags, stickers, and CTA chips. `{rounded.radius-2xl}` (2rem) for larger stickers and lower-thirds. `{rounded.radius-xl}` (1.5rem) for code cells. `{rounded.radius-lg}` (1rem) for ledger cells. **Never** square corners on brand chrome; square is reserved for footage rectangles.

## Components

Prose context for the frontmatter tokens — the frontmatter is the single source of truth for construction; this section is intent + when-to-use.

- **`{components.wordmark}`** — the identity mark. Rubik 800 at `{typography.wordmark-mega}`, tight leading, `-0.03em` tracking. A single mango full stop is the only decoration allowed; no icon lockup, no tagline underneath.
- **`{components.sticker-mango}` · `{components.sticker-lagoon}` · `{components.sticker-mist}`** — the brand's signature slap. Hard `{spacing.shadow-sticker}` offset toward the bottom-right, radius-2xl, giant pill type. Mango is the punch; lagoon and mist are the calmer siblings used when mango has fired elsewhere on the frame.
- **`{components.button-primary-giant}`** — CTA pill at frame scale. Uses `{spacing.shadow-sticker}` plus optional `{spacing.glow-mango}`. Appears once, in the closer plate or under an artifact.
- **`{components.code-cell}`** — the only place `{colors.white}` appears. Sets `{typography.code-mono}` (JetBrains Mono, weight 700), `{colors.lagoon}` for keywords, ink at 40% for comments. Sits on foam or night with hard sticker shadow. Border/gutter chrome (line-number rail, filename tab) is constructed inline — not tokenised because it varies per artifact.
- **`{components.stack-tag}`** — mono uppercase pill on mist. Chrome only. Used for `typescript`, `signals`, `rag`, `angular`. Never load-bearing.
- **`{components.lower-third}`** — night rounded rectangle at the bottom safe rail; carries a talking-head lower-third for footage frames. Padded internally to leave room for a name + role line and, if needed, a single `{components.sticker-mango}` overlapping its top-left corner.
- **`{components.eyebrow-index}` / `{components.eyebrow-index-dark}`** — the JetBrains Mono index like `// 03 · hooks`. Rationed — only on catalog/ledger and editorial frames, never on covers or closers.
- **`{components.highlighter-slap}`** — butter marker underline behind 1–3 words. Constructed with `{pairings.highlighter}` background clipped to the text block; padding widened to `0.4cqw` so the yellow bar overshoots the letterforms.
- **`{components.hairline-lagoon}`** — 0.16cqw lagoon rule used as a section divider or under an eyebrow.
- **`{components.ledger-cell}`** — foam-on-foam cell with a mist top-border, used only in the density-exception ledger plate.
- **`{components.voltage-band}`** — the voltage gradient as a 0.5cqw band; the closer plate's signature.

## Motion & Timing

The brand is a lounge desk with a smirk — motion follows.

- **Cut grammar.** Hard cuts on the beat. No dissolves. Transitions are the sticker landing, not the frame arriving.
- **What *may* animate:** the sticker slap (pop in 180–240ms, ease-out-back, ends at rest), the highlighter slap (a 200ms swipe under the word from left to right), the code cell's caret blink, a numeral count-up on a stat plate.
- **What *must not* animate:** the wordmark (it cuts in, at rest), body copy (never types in on landscape — that is TikTok chrome), the voltage band, the ground color.
- **Dwell.** Cover ≥ 1.2s. Claim ≥ 2.0s. Stat ≥ 1.8s. Code cell ≥ 3.0s (reading time). Closer ≥ 1.6s. These are minimums; density drives pace (more elements → longer dwell), never any per-element timer.
- **Export.** 1920×1080 H.264 or ProRes for landscape; 1080×1920 for 9:16 companion; loops export as still MP4 for platforms that block image posts.

## Frame Treatments

Six plates. Each **composes** frontmatter components and adds only placement.

### 1 · Cover — Wordmark  (identity/cover · move: centered giant word bleeds the frame)
**Ground** `{components.surface-foam}`, padding `{spacing.frame-pad}`.
**Container** flex, column, centered on both axes; the wordmark ignores the safe area horizontally and bleeds toward the edges.
**Composes** `{components.wordmark}`, `{components.eyebrow-index}`, `{components.hairline-lagoon}`.
**Focal** the wordmark set in `{typography.wordmark-mega}` (26cqw), centered, with a `{colors.mango}` full stop as the single accent.
**Chrome** a JetBrains Mono kicker at top-left (`{components.eyebrow-index}`) reading the channel handle; a `{components.hairline-lagoon}` under it.
**Accent** the mango terminal dot on the wordmark — the *only* mango on the frame.
**Silence** ~65% empty (the wordmark is huge but the frame is not busy).
**Fixed** wordmark hex, tracking, kicker font. **Free** the handle/kicker string per platform.
**Density** sparse.  **Pace** high.

### 2 · Hook — Highlighter Slap  (editorial/oversized-claim · move: fit-to-measure headline with a butter slap under one word)
**Ground** `{components.surface-foam}`, padding `{spacing.frame-pad}`.
**Container** flex, column, centered vertically, left-anchored horizontally within a text block capped at 78cqw.
**Composes** `{components.highlighter-slap}`, `{components.eyebrow-index}`, `{components.hairline-lagoon}`.
**Focal** a hook line set in `{typography.display-hero}` (≤3 words) or `{typography.display-claim}` (4–6 words) — one word wrapped in `{components.highlighter-slap}`.
**Chrome** eyebrow index at top-left (`// 02 · hooks`) with a `{components.hairline-lagoon}` under it, ≥ 2cqw clear of the headline.
**Accent** the butter slap — the single accent for the frame; no mango on this plate.
**Silence** ~60% empty.
**Fixed** the butter clip position (55% of x-height), Rubik weight 800. **Free** the hook string; the word chosen for the slap.
**Density** sparse.  **Pace** moderate.

### 3 · Artifact — Code Cell  (focal-artifact · move: centered code plate bleeds toward the reader with a sticker overlap)
**Ground** `{components.surface-foam}`, padding `{spacing.frame-pad-tight}`.
**Container** grid, single cell, centered; the cell width is 74cqw, height auto to content.
**Composes** `{components.code-cell}`, `{components.sticker-mango}`, `{components.stack-tag}` (×2–3).
**Focal** the `{components.code-cell}` at 74cqw × ~52cqh, hard-shadow toward bottom-right; `{typography.code-mono}` inside, `{colors.lagoon}` on keywords.
**Chrome** two-to-three `{components.stack-tag}`s in a row above the cell (top-left, mono chips: `typescript`, `signals`, `angular`).
**Accent** one `{components.sticker-mango}` overlapping the cell's top-right corner by ~2cqw — carries the *why* line (≤ 4 words).
**Silence** ~35% empty (this is the denser artifact plate, still not the density exception).
**Fixed** code-cell radius, keyword color, shadow offset. **Free** the code, the tags, the sticker copy.
**Density** standard.  **Pace** low.

### 4 · Stat — Numeral  (data/single-stat · move: centered oversized numeral with a mono support line)
**Ground** `{components.surface-mist}`, padding `{spacing.frame-pad}`.
**Container** flex, column, centered on both axes.
**Composes** `{typography.stat-numeral}` (used as an inline size token), `{components.eyebrow-index}`, `{components.hairline-lagoon}`.
**Focal** a single numeral set in `{typography.stat-numeral}` (12cqw), centered, `{colors.ink}` on mist.
**Chrome** an eyebrow line above (`// what the numeral means`) and a mono unit line below (`{typography.label-mono}`), separated from the numeral by `{components.hairline-lagoon}`.
**Accent** the numeral's leading character allowed to be `{colors.mango}` (a single glyph), if the script wants voltage — otherwise all-ink.
**Silence** ~70% empty.
**Fixed** the numeral typography token, the hairline. **Free** the numeral itself, unit, meaning line — all from the script; never invent a figure.
**Density** sparse.  **Pace** moderate.

### 5 · Ledger — Stack Catalog  (chrome/catalog · move: 3×2 grid of ledger cells — the density exception)
**Ground** `{components.surface-foam}`, padding `{spacing.frame-pad}`.
**Container** grid, 3 columns × 2 rows, gap `{spacing.gutter}` (2.4cqw); a section head sits above.
**Composes** `{components.ledger-cell}` (×6), `{components.stack-tag}` (one per cell), `{typography.section-head}`, `{typography.stat-ledger}`, `{components.eyebrow-index}`.
**Focal** the section head in `{typography.section-head}` (4.2cqw) at top-left, with `margin-bottom: 2cqw` so a wrapped line cannot collide with the first ledger row.
**Chrome** each `{components.ledger-cell}` carries a `{components.stack-tag}` (top-left), a numeral in `{typography.stat-ledger}` (4.6cqw), and a body-landscape support line.
**Accent** one cell's numeral rendered in `{colors.mango}` — the single hot cell of the frame.
**Silence** tight by design — the density exception.
**Fixed** grid geometry, cell radius, top-border color. **Free** which cell is the mango one; the stack tags; the numerals.
**Density** dense-exception.  **Pace** low.

### 6 · Closer — Voltage CTA  (brand-signature/closer · move: night ground, voltage band, centered giant pill)
**Ground** `{components.surface-night}`, padding `{spacing.frame-pad}`.
**Container** flex, column, centered vertically; the voltage band sits inside the safe area at 22% from the top; the wordmark sits above it; the pill sits below.
**Composes** `{components.wordmark}` (re-tuned to `{typography.display-claim}` — see Fixed note), `{components.voltage-band}`, `{components.button-primary-giant}`, `{components.eyebrow-index-dark}`.
**Focal** the `{components.button-primary-giant}` centered, with `{spacing.glow-mango}` — the frame's one hot element.
**Chrome** a small `{components.wordmark}` variant above the band (set at `{typography.display-claim}` to shrink from cover-scale to closer-scale); the eyebrow-index-dark line at bottom-left reading `// find me` or the current channel handle.
**Accent** the pill (mango) is the accent; the voltage band is the scarce voltage moment — no other lagoon on the frame.
**Silence** ~60% empty.
**Fixed** night hex, voltage angle 135°, band height 0.5cqw. **Free** the CTA copy (≤ 4 words), the handle line.
**Density** sparse.  **Pace** high.

## Do's and Don'ts

**Do**

- Default to **centered** anchor for cover / hook / stat / closer. Reserve left-anchor for the catalog/ledger and — occasionally — hook when the sentence is long.
- Vary the composition axis across consecutive frames; never run two identical centered-hook plates back-to-back.
- Bleed the wordmark, code cell, and stat numeral toward the safe-area line. Even margins on all four sides is the deck tell.
- Full-bleed the wordmark or a numeral on a cadence of one every 3–4 frames.
- Keep one idea per frame. Two things → two frames, not one denser one.
- Ration the mono eyebrow — use it only on catalog and hook plates, not on every frame.

**Don't**

- Never fire mango + lagoon + butter at full strength on the same frame.
- Never put butter under body copy or under more than three words.
- Never let a decorative sticker overlap the headline bounding box or the eyebrow rail (keep-out ≥ 2cqw).
- Never re-introduce zinc, Inter, Geist, or a warm-parchment ground; the source atoms are the ceiling.
- Never render `#fff` or `#000` as a full-frame ground; use foam or night.
- Never invent a follower count, view count, or revenue figure. Numerals come from the script only.
- Never wrap a hook set in `{typography.display-hero}` — if the line wraps, step down to `{typography.display-claim}` or `{typography.display-long}`.

## Aspect-Ratio Behavior

| Treatment | 16:9 (primary, 1920×1080) | 9:16 (1080×1920) | 1:1 (1080×1080) |
|---|---|---|---|
| 1 · Cover — Wordmark | Wordmark bleeds edge-to-edge at 26cqw, kicker top-left. | Wordmark set on two lines (`nico` / `bytes`) at 30cqw; kicker moves to top-safe. | Wordmark centered at 24cqw, one line; kicker stacked above. |
| 2 · Hook — Highlighter Slap | Hook block left-anchored, ≤ 78cqw wide, hero size. | Hook stacks; ramp steps down (hero → claim) so the block fits 82cqw with 5 lines max. | Hook centered; ramp usually claim; slap on one word only. |
| 3 · Artifact — Code Cell | Cell 74cqw × ~52cqh, sticker top-right; tags above. | Cell rotates to 88cqw × ~54cqh, tags stack above, sticker moves to top-left; sticker size grows to `pill-giant`. | Cell 82cqw × ~62cqh; tags collapse to one row of 2. |
| 4 · Stat — Numeral | Numeral 12cqw centered; hairline + unit below. | Numeral steps up to 22cqw; unit line grows to `display-claim`. | Numeral 16cqw; unit and meaning stack tighter. |
| 5 · Ledger — Stack Catalog | 3×2 grid, section head top-left. | Reflows to 2×3 grid; section head at top; cells preserve internal type ramp. | 2×3 grid or 3×2 depending on cell count; gutter increases to 3cqw. |
| 6 · Closer — Voltage CTA | Band at 22% from top; pill centered; small wordmark above band. | Band moves to 30% from top; pill scales to 4.4cqw type; handle line moves above the pill. | Band above pill; wordmark above band; all centered on 1:1. |

Safe-area rule preserved across ratios: 5cqw on long edges, 6cqw on the short edge of 9:16.

## Approved Real Entities & Numerals

- **Speaker / channel:** Nicolas Molina · `@nicobytes` (source-approved).
- **Named tech in claims:** Angular, TypeScript, agents, RAG, signals, observables (source-approved technical vocabulary).
- **All numerals** (view counts, ratios, milliseconds, revenue, dates) **come from the script only**. Never invent a figure. Placeholder syntax in showcases: `— figure —`.

## Pre-Render Self-Audit

Run before finalizing any frame:

- **Squint** — one element dominates at 3–6× its nearest neighbor?
- **Silence** — sparse plates read 55–75% empty? Ledger is the *only* frame allowed to feel tight.
- **Restraint** — mango fires exactly once? butter under ≤ 3 words and at most once? voltage at most once?
- **Weight** — Rubik 800 for display, 400 for body — no in-between weight sneaking in?
- **Depth** — one plane of lift only; sticker shadow OR soft shadow, never both stacked?
- **Geometry** — pills for tags/CTA/stickers, radius-xl for code cells, radius-lg for ledger cells; no square brand chrome?
- **Anchor** — centered-lean respected on cover/hook/stat/closer; catalog left-anchored; no more than 2 consecutive frames share an anchor across the sequence?
- **Element count** — ≤ 2–3 distinct elements per sparse frame; one idea per frame?
- **Floor** — every load-bearing line ≥ 1.4cqw?
- **Fidelity** — every hex/weight/radius traced back to `{colors.*}` / `{typography.*}` / `{rounded.*}` in the frontmatter? no ad-hoc size in a treatment?
- **Numerals** — every figure sourced from the script; no fabricated stats?

## Known Gaps

- `cqw` is stored as a string per the DESIGN.md spec's consumer-behavior table (accept; store as string). Not a runtime number in the frontmatter.
- Aspect-ratio re-scales in the table above are *guidance*: they define reflow moves, not pixel-exact re-layouts. A designer may deviate within the composition rules.
- **Motion & Timing** and **Frame Treatments** are video-extension sections (not in the source DESIGN.md); spec consumers preserve them as unknown sections.
- The reading-ramp `body` at 32px and `body-landscape` at 28px are both preserved from the source; the landscape variant is the frame-scale addition and just clears the 1.4cqw floor.
- Fonts (Rubik, JetBrains Mono) must be loaded; substitute stacks are documented in `frame-showcase.html` but the brand truth is the loaded families only.
