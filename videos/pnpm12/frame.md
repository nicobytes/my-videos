---
name: nicobytes-frame
source: design.md (nicobytes)
fetched: 2026-09-08
note: >
  Video-first companion to nicobytes/design.md. Atoms carried verbatim (hexes, weights,
  radii, font stack). Frame-scale sizes authored in cqw against a 1920-wide primary frame
  (px ÷ 1920 × 100 = cqw). Reading ramp kept in px for chrome; hero ramp is frame-native.

colors:
  ink: "#18181b"
  paper: "#fafafa"
  white: "#fff"
  slate: "#27272a"
  cyan: "#06b6d4"
  emerald: "#10b981"
  zinc-100: "#f4f4f5"        # support surface, not a 7th brand hue
  shadow-soft: "#0000001f"
  shadow-md: "#0000001a"
  glow-cyan: "#06b6d426"

pairings:
  light: { bg: "{colors.paper}|{colors.white}", text: "{colors.ink}", accent: "{colors.cyan}", accent-2: "{colors.emerald}" }
  dark:  { bg: "{colors.slate}|{colors.ink}",   text: "{colors.paper}", accent: "{colors.cyan}", accent-2: "{colors.emerald}" }
  voltage: "linear-gradient(135deg, {colors.cyan}, {colors.emerald})"

typography:
  # --- Reading ramp (carried from source; unchanged for chrome / body) ---
  reading:
    body-sm:
      fontFamily: "ui-sans-serif, system-ui, sans-serif"
      fontSize: "14px"        # --text-sm .875rem
      weight: 400
      lineHeight: 1.6
    body:
      fontFamily: "ui-sans-serif, system-ui, sans-serif"
      fontSize: "16px"        # --text-base 1rem
      weight: 400
      lineHeight: 1.6
    label:
      fontFamily: "ui-sans-serif, system-ui, sans-serif"
      fontSize: "14px"
      weight: 500
      tracking: "0"
    title:
      fontFamily: "ui-sans-serif, system-ui, sans-serif"
      fontSize: "32px"        # --text-4xl 2rem
      weight: 700
      tracking: "-0.025em"
      lineHeight: 1.1
    title-lg:
      fontFamily: "ui-sans-serif, system-ui, sans-serif"
      fontSize: "48px"        # --text-5xl 3rem
      weight: 700
      tracking: "-0.025em"
      lineHeight: 1.05

  # --- Hero / display ramp (frame-native, cqw against 1920) ---
  hero:
    wordmark-mega:
      fontFamily: "ui-sans-serif, system-ui, sans-serif"
      fontSize: "17cqw"       # ~326px @1920 — fits "nicobytes" (9 chars) edge-to-edge with 5cqw safe margin
      weight: 700
      tracking: "-0.04em"
      lineHeight: 0.86
    display-hero:
      fontFamily: "ui-sans-serif, system-ui, sans-serif"
      fontSize: "11cqw"       # ~211px @1920
      weight: 700
      tracking: "-0.03em"
      lineHeight: 0.94
    display-mid:
      fontFamily: "ui-sans-serif, system-ui, sans-serif"
      fontSize: "7.2cqw"      # ~138px @1920
      weight: 700
      tracking: "-0.025em"
      lineHeight: 1.0
    section-head:
      fontFamily: "ui-sans-serif, system-ui, sans-serif"
      fontSize: "4.2cqw"      # ~80px @1920
      weight: 700
      tracking: "-0.025em"
      lineHeight: 1.05
    ledger-row:
      fontFamily: "ui-sans-serif, system-ui, sans-serif"
      fontSize: "2.6cqw"      # ~50px @1920
      weight: 600
      tracking: "-0.02em"
      lineHeight: 1.15
    stat-numeral:
      fontFamily: "ui-sans-serif, system-ui, sans-serif"
      fontSize: "13cqw"       # ~250px @1920
      weight: 700
      tracking: "-0.03em"
      lineHeight: 0.9
    pill-giant:
      fontFamily: "ui-sans-serif, system-ui, sans-serif"
      fontSize: "3.4cqw"      # ~65px @1920
      weight: 600
      tracking: "-0.015em"
      lineHeight: 1.0
    kicker:
      fontFamily: "ui-sans-serif, system-ui, sans-serif"
      fontSize: "1.5cqw"      # ~29px @1920 — sits on the legibility floor
      weight: 500
      tracking: "0.08em"
      textTransform: "uppercase"
      lineHeight: 1.0
    body-frame:
      fontFamily: "ui-sans-serif, system-ui, sans-serif"
      fontSize: "1.7cqw"      # ~33px @1920 — floor + margin
      weight: 400
      lineHeight: 1.45
    code-frame:
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
      fontSize: "2.1cqw"      # ~40px @1920
      weight: 500
      tracking: "0"
      lineHeight: 1.4

rounded:
  md: ".375rem"     # 6px
  lg: ".5rem"       # 8px
  xl: ".75rem"      # 12px
  "2xl": "1rem"     # 16px
  "3xl": "1.5rem"   # 24px
  pill: "9999px"

spacing:
  unit: ".25rem"
  frame-pad: "5cqw"          # 96px @1920 safe-area inset
  frame-pad-tight: "3.5cqw"  # 67px @1920
  gap-sm: "1.2cqw"           # ~23px
  gap-md: "2.4cqw"           # ~46px
  gap-lg: "4cqw"             # ~77px
  shadow-soft: "0 1px 3px {colors.shadow-soft}"
  shadow-md: "0 4px 6px -1px {colors.shadow-md}, 0 2px 4px -2px {colors.shadow-md}"
  shadow-lg: "0 10px 15px -3px {colors.shadow-md}, 0 4px 6px -4px {colors.shadow-md}"
  glow-cyan: "0 0 0 1px {colors.glow-cyan}, 0 8px 32px {colors.glow-cyan}"

components:

  # --- Chrome / atoms ---
  pill-nav:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.reading.label}"
    rounded: "{rounded.pill}"
    padding: "0.5cqw 1.4cqw"
    border: "1px solid {colors.shadow-md}"

  pill-nav-dark:
    backgroundColor: "{colors.slate}"
    textColor: "{colors.paper}"
    typography: "{typography.reading.label}"
    rounded: "{rounded.pill}"
    padding: "0.5cqw 1.4cqw"

  kicker-eyebrow:
    textColor: "{colors.ink}"
    typography: "{typography.hero.kicker}"
    padding: "0"

  kicker-accent:
    textColor: "{colors.cyan}"
    typography: "{typography.hero.kicker}"

  # --- Buttons ---
  button-primary:
    backgroundColor: "{colors.cyan}"
    textColor: "{colors.white}"
    typography: "{typography.reading.label}"
    rounded: "{rounded.lg}"
    padding: "0.5rem 1rem"

  button-primary-giant:
    backgroundColor: "{colors.cyan}"
    textColor: "{colors.white}"
    typography: "{typography.hero.pill-giant}"
    rounded: "{rounded.pill}"
    padding: "1.6cqw 3.4cqw"
    shadow: "{spacing.glow-cyan}"

  button-ghost-giant:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.hero.pill-giant}"
    rounded: "{rounded.pill}"
    padding: "1.6cqw 3.4cqw"
    border: "2px solid {colors.ink}"

  # --- Voltage device (cyan → emerald 135deg) ---
  voltage-fill:
    backgroundImage: "{pairings.voltage}"
    textColor: "{colors.white}"

  voltage-text:
    backgroundImage: "{pairings.voltage}"
    backgroundClip: "text"
    textColor: "transparent"

  voltage-hairline:
    height: "0.25cqw"          # ~5px @1920
    backgroundImage: "{pairings.voltage}"

  # --- Cards / surfaces ---
  card-elevated:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.2xl}"
    padding: "2.4cqw"
    shadow: "{spacing.shadow-md}"

  card-post:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "1.8cqw 2.2cqw"
    shadow: "{spacing.shadow-soft}"

  card-elevated-dark:
    backgroundColor: "{colors.slate}"
    textColor: "{colors.paper}"
    rounded: "{rounded.2xl}"
    padding: "2.4cqw"

  code-cell:
    backgroundColor: "{colors.slate}"
    textColor: "{colors.paper}"
    typography: "{typography.hero.code-frame}"
    rounded: "{rounded.xl}"
    padding: "2.4cqw 2.8cqw"
    shadow: "{spacing.shadow-lg}"

  tech-tag:
    backgroundColor: "{colors.zinc-100}"
    textColor: "{colors.ink}"
    typography: "{typography.hero.pill-giant}"
    rounded: "{rounded.pill}"
    padding: "1cqw 2.2cqw"
    border: "1px solid {colors.shadow-md}"

  tech-tag-voltage:
    backgroundImage: "{pairings.voltage}"
    textColor: "{colors.white}"
    typography: "{typography.hero.pill-giant}"
    rounded: "{rounded.pill}"
    padding: "1cqw 2.2cqw"

  # --- Ledger / editorial ---
  ledger-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.hero.ledger-row}"
    padding: "1.2cqw 0"
    borderBottom: "1px solid {colors.shadow-md}"

  meta-cell:
    textColor: "{colors.slate}"
    typography: "{typography.hero.kicker}"

  index-numeral:
    textColor: "{colors.cyan}"
    typography:
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
      fontSize: "2.2cqw"
      weight: 500
      tracking: "0"

  stat-numeral:
    textColor: "{colors.ink}"
    typography: "{typography.hero.stat-numeral}"
---

# nicobytes — Frame

> **Atoms are sacred · composition is free · numbers come from the script.**

## Overview

nicobytes is Nicolas Molina's first-person engineering brand — calm zinc surfaces, one voltage
(cyan → emerald, 135°), platform UI sans, and titles that read like engineering notes. At frame
scale, the same brand becomes a **very quiet 1920×1080 canvas** with a single hot moment per
frame: the wordmark rendered edge-to-edge, or a headline pulled straight from a post title, or a
`code-cell` sitting on paper with nothing else in the frame. The brand does not shout; it lets
one thing carry the frame.

**Frame Craft Bar** — every frame passes these three eyeball tests before any structural check:

- **Squint test.** Exactly one element dominates at 3–6× its nearest neighbor. The wordmark
  bleeds; everything else is a whisper.
- **Silence test.** Sparse archetypes (cover, oversized-claim, stat, closer) read **60–75%
  empty**. The **ledger/index** frame is the one named density exception — it is *supposed*
  to feel like an engineering log.
- **Restraint test.** The **voltage** (cyan → emerald gradient) fires **once per frame** — as a
  text fill, OR as a color-block ground, OR as a hairline, never two at once. Cyan alone as a
  solid tint may support (link, syntax keyword) but the gradient is scarce.
- **Reference bar.** Aim: an engineer's talk-deck opening slide — Cassidoo, Rich Harris, Evan
  You. Failure: a SaaS landing hero with two CTAs, a mesh-gradient blob, and a floating iPhone.

## Colors

Tokens verbatim from `design.md`. At frame scale they are re-cast as **full-frame grounds** with
a rationed accent:

- **paper `#fafafa`** — default light ground for cover, oversized-claim, ledger, closer.
- **white `#fff`** — elevated card surfaces sitting on paper or slate (never a full-frame ground —
  it is indistinguishable from paper at frame scale and wastes the surface budget).
- **slate `#27272a`** — dark ground for `code-cell` frames and the one dark cover variant.
- **ink `#18181b`** — text on paper/white; secondary dark ground when a frame needs more weight
  than slate carries.
- **cyan `#06b6d4`** — solid accent for links, keyword syntax, hairlines, and the `button-primary`
  giant. May appear as a small solid.
- **emerald `#10b981`** — pairs only with cyan inside the voltage gradient, or as a soft support
  (string syntax). Never a solo accent.
- **voltage gradient `linear-gradient(135deg, #06b6d4, #10b981)`** — the scarce hero device.
  One per frame. Used as: (a) text fill on the wordmark/headline, or (b) full-bleed ground for
  the color-block cover, or (c) a 0.25cqw hairline underlining a kicker.

**Never** introduce purple/indigo, terracotta/cream, or warm-parchment. Zinc + voltage is the
whole system.

## Typography

Two ramps live in the frontmatter — the reading ramp is carried straight from `design.md` for
chrome and card body; the **hero ramp** is frame-native.

- **Reading ramp** (`typography.reading.*`) — 14–48px, weight 400/500/600/700, `tracking-tight`
  on titles. Used inside `card-elevated`, `card-post`, `code-cell`, and the meta rail.
- **Hero ramp** (`typography.hero.*`) — 1.5cqw kicker to 22cqw wordmark. Weight is always 700
  on the hero step, 500–600 on chrome. Tracking tightens as size grows (`-0.025em` → `-0.04em`)
  — this is the source's `tracking-tight` philosophy extended to hero scale.
- **Legibility floor.** Any load-bearing line ≥ **1.4cqw (~27px @1920)**. `{typography.hero.kicker}`
  sits at 1.5cqw with room to spare; `{typography.hero.body-frame}` at 1.7cqw. Anything smaller
  is decorative colophon and may not carry a beat's meaning.
- **Fit-to-measure headlines.** Hero text block ≤ **78cqw** wide, never touching safe margin.
  Step by word count: ≤ 3 words → `wordmark-mega` or `display-hero`; 4–6 words → `display-mid`;
  7+ words → `section-head`. A long headline at hero-mega blows out — step down.
- **No new fonts.** The source loads `ui-sans-serif` via generic and `ui-monospace` for the
  (unused) mono. Do not swap in Inter, Geist, or a display serif at any point.

## Layout — The Frame

- **Primary frame:** 1920×1080 (16:9). Also authored: 9:16 (1080×1920) and 1:1 (1080×1080).
- **Safe area:** inset `{spacing.frame-pad}` = **5cqw** on all four edges. No load-bearing
  element crosses this margin. The wordmark on the cover *may* bleed the horizontal safe
  margin; nothing else may.
- **The vw law.** Every display size, gap, and padding is authored in `cqw`
  (`px ÷ 1920 × 100 = cqw`). Fixed `px` is reserved for chrome atoms: border widths, small
  radii, shadow blur specs. This is what makes a frame render at true proportion whether it is
  shown at 1920px or 720px.
- **cqw note.** In the showcase HTML the frame container gets `container-type: size`, and
  internal sizing uses `cqw` (same numeric values as this spec). Plain `vw` would resolve
  against the viewport and turn the contact sheet into a wall of full-bleed billboards — that
  is the bug this authoring model exists to prevent.

## Elevation & Depth

Depth ceiling for frames is deliberately low — this is a calm brand.

- **Allowed:** the source's soft-black shadows (`shadow-soft`, `shadow-md`, `shadow-lg`) on
  `card-elevated`, `card-post`, and `code-cell`. Cyan glow (`glow-cyan #06b6d426`) used **only**
  on `button-primary-giant` and only when the button is the focal.
- **Banned at frame scale:** stacked cards, parallax scrollytelling, mesh gradients, drop shadows
  on type, and colored shadows other than the one cyan glow above. A frame with more than one
  shadow layer is a frame in trouble.

## Shapes

Radius scale carried verbatim from source. At frame scale, apply this hierarchy:

- **Chrome pills** (`pill-nav`, `tech-tag`, `button-*-giant`): `{rounded.pill}` — full radius.
  This is the source's `rounded-full` reflex.
- **Cards on paper** (`card-elevated`): `{rounded.2xl}` (16px).
- **Cards in dense grids / code-cell**: `{rounded.xl}` (12px).
- **Small chips**: `{rounded.lg}` (8px).
- **The wordmark is not a shape** — it is type. Do not enclose it in a pill.
- **CTA geometry.** `button-primary-giant` is always a full pill; ghost variants share the same
  geometry so a paired CTA doesn't create two silhouettes.

## Components

Every buildable unit is a frontmatter token — treatments compose these, they do not re-state
their construction. Prose here is intent + when-to-use.

- **`{components.pill-nav}` / `{components.pill-nav-dark}`** — the site's `rounded-full` chrome
  pill. At frame scale it appears in the *establishing* nav frame (once) and as a "→ nicobytes.com"
  colophon on the closer. Never as recurring per-frame chrome.
- **`{components.kicker-eyebrow}` / `{components.kicker-accent}`** — uppercase 1.5cqw label,
  weight 500, `+0.08em` tracking. Rationed — appears on a minority of frames, not all. When it
  appears, it sits top-left OR directly under the focal, never both.
- **`{components.button-primary}` / `{components.button-primary-giant}`** — the source's cyan
  solid CTA, scaled up to a hero pill for closer frames. The giant variant is the only element
  allowed to carry `glow-cyan`. Ghost pair uses `{components.button-ghost-giant}` (2px ink stroke).
- **`{components.voltage-fill}` / `{components.voltage-text}` / `{components.voltage-hairline}`**
  — the three faces of the scarce accent. One per frame, one form only.
- **`{components.card-elevated}` / `{components.card-post}` / `{components.card-elevated-dark}`**
  — white surfaces on paper (or slate on ink) for post previews and content clusters. Corners
  are the source's 2xl/xl; shadow is soft-black, never colored.
- **`{components.code-cell}`** — dark slate rounded-xl surface for real code lines. Uses
  `ui-monospace`; syntax accent is `{colors.cyan}` for keywords, `{colors.emerald}` for strings,
  `{colors.paper}` for identifiers. **No other syntax colors.** This is the one place emerald
  gets to appear as a solid.
- **`{components.tech-tag}` / `{components.tech-tag-voltage}`** — chip for stack nouns (Angular,
  RAG, TypeScript, agents). Default is zinc-100 pill with hairline border; the voltage variant
  is used **once per catalog frame** to pick out the "hero" tag.
- **`{components.ledger-row}`, `{components.index-numeral}`, `{components.meta-cell}`** — the
  three atoms that compose the post-index frame. `index-numeral` uses `ui-monospace` in cyan;
  the row is separated by a 1px shadow-md hairline; meta is right-aligned in slate.
- **`{components.stat-numeral}`** — huge numeral for a focal-artifact stat frame. Ink by default;
  becomes `{components.voltage-text}` when the numeral is the single hot moment in the frame.

## Motion & Timing

The brand character is *engineering notes, applied, not hype* — so cut grammar is **calm hard
cuts**, no easing showcases.

- **May animate:** wordmark reveal (mask, one step, ≤ 240ms); code-cell line-by-line insertion;
  a single voltage-hairline draw beneath a kicker (≤ 320ms). That is the entire menu.
- **Must not animate:** cards flying in, type springing, particle voltage trails, ledger rows
  cascading, or any camera move on a static frame. The brand does not have that vocabulary.
- **Dwell.** Sparse frames dwell **~2.2s**; oversized-claim ~2.6s; ledger ~4.0s (reader must
  scan several rows); closer ~1.8s.
- **Cadence, not motion.** Density drives pace — a sequence of 6 sparse frames feels fast; a
  ledger frame feels slow because it *carries* more. Never accelerate a sparse frame with
  movement to fake energy.
- **Export.** 1920×1080 at 30fps for landscape; frame-relative sizes make 9:16 and 1:1 re-exports
  a container-shape swap, not a redesign.

## Frame Treatments

Each treatment composes frontmatter components and specifies only ground, container, focal
placement, and the Fixed/Free split. Sizes reference tokens — no ad-hoc numbers in prose.

### 1 · Identity / Cover  (identity · move: hero wordmark bleeds the horizontal safe margin, voltage text-fill)
**Ground** `{colors.paper}`, padding:`{spacing.frame-pad}`.
**Container** flex column, `justify-content:center`, `align-items:center`, gap:`{spacing.gap-md}`.
**Composes** `{components.voltage-text}` (applied to the wordmark), `{components.kicker-eyebrow}`.
**Focal** the wordmark **"nicobytes"** at `{typography.hero.wordmark-mega}`, centered, allowed to touch the horizontal safe margin.
**Chrome** a single `{components.kicker-eyebrow}` beneath the wordmark reading the practitioner tag ("Senior Software Engineer · Bogotá / remote").
**Accent** voltage — as **text-fill only**, no other gradient anywhere in the frame.
**Silence** ~70% empty. The top and bottom of the frame are paper; the wordmark carries the middle band.
**Fixed** wordmark string; typography token; center anchor; voltage-text is the only accent.
**Free** the kicker string per script.
**Density** sparse.

### 2 · Editorial / Oversized-Claim  (editorial · move: 3–6 word claim in display-hero, centered, ink on paper)
**Ground** `{colors.paper}`, padding:`{spacing.frame-pad}`.
**Container** flex column, `justify-content:center`, `align-items:center`, gap:`{spacing.gap-sm}`; text block max-width **78cqw**.
**Composes** `{components.kicker-accent}` (optional, above the claim), `{components.voltage-hairline}` (optional, beneath).
**Focal** claim set in `{typography.hero.display-hero}` (3–6 words) or `{typography.hero.display-mid}` (7+ words), ink text, centered.
**Chrome** optional `{components.kicker-accent}` above the claim (rationed — used on ~half the claim frames, never all).
**Accent** either the kicker cyan **or** a `{components.voltage-hairline}` beneath the claim — one, not both.
**Silence** ~65% empty; safe margin never touched by text.
**Fixed** center anchor; `-0.025em` tracking; ink-on-paper.
**Free** claim string (from source: post title, home H1, about thesis); kicker string.
**Density** sparse.

### 3 · Focal-Artifact / Code Cell  (focal-artifact · move: a single code-cell floats centered on paper, everything else silent)
**Ground** `{colors.paper}`, padding:`{spacing.frame-pad}`.
**Container** flex column, `justify-content:center`, `align-items:center`, gap:`{spacing.gap-md}`; cell max-width **80cqw**.
**Composes** `{components.code-cell}`, `{components.kicker-eyebrow}` (small caption above the cell).
**Focal** the `{components.code-cell}` — 3–6 lines of real code at `{typography.hero.code-frame}`, syntax colored per the component rule (cyan keywords, emerald strings, paper identifiers).
**Chrome** a single kicker above the cell naming the file or topic ("toSignal.ts", "hybrid-search").
**Accent** the syntax cyan **inside** the cell is the frame's one accent; no gradient anywhere.
**Silence** ~60% empty. The cell is one dense atom on a wide silent ground.
**Fixed** slate cell on paper ground; monospace; 2-color syntax palette.
**Free** the code lines per script; the kicker caption.
**Density** sparse.

### 4 · Ledger / Post Index  (data/ledger · move: dense-exception — numbered post rows with meta, engineering-log feel)
**Ground** `{colors.paper}`, padding:`{spacing.frame-pad}`.
**Container** flex column, `justify-content:flex-start`, gap:0; left-anchored (one of two treatments that legitimately reads left).
**Composes** `{components.kicker-accent}` (single header row), `{components.ledger-row}` × 4–6, each row = `{components.index-numeral}` + title (`{typography.hero.ledger-row}`) + `{components.meta-cell}`.
**Focal** the *list* is the focal — no single row dominates; the reader scans.
**Chrome** a `{components.kicker-accent}` header reading "Writing · 2026" or "Recent notes"; a single `{components.voltage-hairline}` under the header.
**Accent** the voltage-hairline **and** the cyan index numerals share the accent budget (numerals are solid cyan, not gradient).
**Silence** ~30% empty — the **named density exception**.
**Fixed** left anchor; hairline dividers; monospace numerals; right-aligned meta.
**Free** post titles (must be real, source-cited); dates; row count (4–6).
**Density** dense-exception.

### 5 · Chrome / Catalog  (chrome/catalog · move: stack of tech tags with one voltage tag picking out the hero)
**Ground** `{colors.paper}`, padding:`{spacing.frame-pad}`.
**Container** flex row wrap, `justify-content:center`, `align-items:center`, gap:`{spacing.gap-sm}`; tag block max-width **80cqw**.
**Composes** `{components.tech-tag}` × 6–10, `{components.tech-tag-voltage}` × 1, `{components.kicker-eyebrow}` above.
**Focal** the single `{components.tech-tag-voltage}` — 3–6× the visual weight of its neighbors because it is the only saturated element.
**Chrome** kicker above the cluster ("Stack", "Working with", "This quarter").
**Accent** the one voltage tag; nothing else.
**Silence** ~55% empty around the cluster.
**Fixed** wrap layout; one voltage tag maximum; zinc-100 for defaults.
**Free** which tags appear; which one is voltage; kicker string.
**Density** standard.

### 6 · Closer / CTA  (closer · move: giant cyan pill centered on paper, one line of ink above)
**Ground** `{colors.paper}`, padding:`{spacing.frame-pad}`.
**Container** flex column, `justify-content:center`, `align-items:center`, gap:`{spacing.gap-md}`.
**Composes** one line at `{typography.hero.display-mid}` (ink), `{components.button-primary-giant}` (with cyan glow), `{components.kicker-eyebrow}` (small colophon below).
**Focal** the `{components.button-primary-giant}` — with `glow-cyan` (the only frame allowed to use it).
**Chrome** a short line above ("Let's build something."); a colophon below ("nicobytes.com · @nicobytes").
**Accent** the cyan button + its glow. No other gradient or hairline.
**Silence** ~65% empty.
**Fixed** center anchor; ink line above; cyan pill; colophon below.
**Free** the line copy; the button label.
**Density** sparse.

### 7 · Dark / Voltage Ground  (brand-signature · move: full-bleed voltage gradient carries a single hero line, once per sequence)
**Ground** `{components.voltage-fill}` (full-bleed), padding:`{spacing.frame-pad}`.
**Container** flex column, `justify-content:center`, `align-items:center`.
**Composes** one line at `{typography.hero.display-hero}` in `{colors.white}`, optional `{components.kicker-eyebrow}` in `{colors.white}` above.
**Focal** the single white headline (3–6 words, from source).
**Chrome** optional white kicker above; nothing else. No pill, no card, no code.
**Accent** the ground **is** the voltage; no other accent may appear on this frame.
**Silence** ~70% empty (large paper-equivalent gutters around the headline).
**Fixed** voltage ground; white type; center anchor; **used at most once per sequence**.
**Free** the headline; the optional kicker.
**Density** sparse.

## Do's and Don'ts

**Do**
- Lean **centered** — cover, oversized-claim, focal-artifact, catalog, closer, voltage-ground
  all center their focal. Only ledger and (occasionally) editorial go left.
- Vary the anchor between consecutive frames — no more than ~2 in a row share one.
- Keep to **≤ 2–3 elements per frame** (focal + kicker + at most one support). Two ideas → two frames.
- Fit the headline: ≤ 3 words → hero-mega; 4–6 → display-hero; 7+ → display-mid or section-head.
- Fire the voltage **once per frame**, in one form only (text OR ground OR hairline).
- Let the wordmark bleed the horizontal safe margin — nothing else may.
- Name real tech (Angular, RAG, TypeScript, agents) in catalog and code frames.

**Don't**
- Don't ship a top-nav or footer on every frame — they are not persistent chrome at frame scale.
- Don't stack two accents (voltage text + voltage ground; cyan glow + voltage hairline). Pick one.
- Don't put emerald on the frame as a solo solid — cyan solo is fine, emerald only inside the
  gradient or as a string-syntax accent inside `code-cell`.
- Don't animate cards, springs, particles, or camera moves. Hard cuts + the three allowed reveals.
- Don't set headlines in a display serif or a webfont — `ui-sans-serif` only.
- Don't drop a load-bearing line below `1.4cqw`.
- Don't set the kicker on every frame — it is rationed.
- Don't put a floating decoration over the headline or eyebrow rail (≥ 2cqw keep-out).

## Aspect-Ratio Behavior

| Treatment | 16:9 (1920×1080) | 9:16 (1080×1920) | 1:1 (1080×1080) |
|---|---|---|---|
| **1 · Cover** | Wordmark edge-to-edge horizontally; kicker beneath. | Wordmark stacks ("nico" / "bytes") at `display-hero`; kicker below. | Wordmark at `display-hero` on one line; kicker below. |
| **2 · Oversized-Claim** | 3–6 words in `display-hero` centered; text block ≤ 78cqw. | Claim wraps to 2–3 short lines at `display-mid`. | Claim at `display-mid`, 2 lines; kicker optional. |
| **3 · Code Cell** | Cell 3–6 lines wide, ≤ 80cqw; kicker above. | Cell reflows to ≤ 88cqw, 4–6 shorter lines. | Cell at ≤ 82cqw, 4–5 lines. |
| **4 · Ledger** | 4–6 rows, three-column (numeral · title · meta). | 4 rows; meta drops beneath the title on each row. | 4 rows; two-line row shape, wider gutters. |
| **5 · Catalog** | Single centered cluster wrapping across ~80cqw. | Cluster wraps into 3–4 tag rows; kicker above. | Cluster wraps into 3 tag rows. |
| **6 · Closer** | Pill centered, ink line above, colophon below. | Same stack; pill padding stays token values. | Same stack; tighter vertical gap. |
| **7 · Voltage Ground** | Full-bleed voltage; white headline centered. | Full-bleed voltage; headline wraps to 2 lines at `display-mid`. | Full-bleed voltage; headline at `display-mid`. |

Rule across all ratios: safe area stays `5cqw` on the *short* edge; hero sizes step down one
notch on 9:16 and 1:1 so no load-bearing line drops below `1.4cqw` or crosses the safe margin.

## Approved Real Entities & Numerals

Copy allowed on a frame must come from the source. Do **not** invent stats, follower counts,
company logos, or client names.

- **Person:** *Nicolas Molina* ("I'm Nicolas Molina."); handle *@nicobytes*; role *Senior Software Engineer*.
- **Thesis:** *"I enjoy turning complex systems into practical tools people can actually use."*
- **Post titles (source-cited):** *"Hybrid search: the decision I didn't know I needed in my agent."*
  *"Observables to signals using toSignal in Angular."*
- **Domains named in `## Voice & tone`:** Frontend, JavaScript, agents, applied AI, Angular, RAG,
  TypeScript.
- **Numerals:** none in source. **Do not invent** post counts, years-of-experience, project
  totals, star counts, or "10,000+ developers." If a frame needs a numeral, it must come from
  the script.

## Pre-Render Self-Audit

Before finalizing a frame, tick every line:

- [ ] **Squint** — one element dominates at 3–6× the next.
- [ ] **Silence** — sparse archetypes read 60–75% empty (ledger is the exception).
- [ ] **Restraint** — voltage fires exactly once, in exactly one form.
- [ ] **Weight** — no display type below weight 700; no chrome above 600.
- [ ] **Depth** — at most one shadow layer; cyan glow only on the closer button.
- [ ] **Geometry** — pills are full radius; cards are 2xl/xl; no ad-hoc corners.
- [ ] **Anchor** — center by default; ledger left; no 3 consecutive frames share an anchor.
- [ ] **Element count** — ≤ 2–3 distinct elements (focal + kicker + at most one support).
- [ ] **Floor** — no load-bearing line below `1.4cqw`; kicker is exactly at the floor.
- [ ] **Fidelity** — every hex, weight, radius traces back to `design.md`; every size is a
      frontmatter token, never a number invented in prose.
- [ ] **Entities** — copy strings are from source or from the script; no invented numerals.

## Known Gaps

- **`cqw`/`vw` as YAML strings.** The DESIGN.md spec's atom vocabulary is px/rem/em; frame-scale
  sizes here are authored as `cqw` strings. Spec consumers accept-and-store them as strings; the
  showcase HTML resolves them against the frame container (not the viewport).
- **`## Motion & Timing`, `## Frame Treatments`, `## Aspect-Ratio Behavior`, `## Pre-Render
  Self-Audit`, `## Approved Real Entities & Numerals`** are video extensions to the DESIGN.md
  section order — spec consumers preserve them as unknown sections.
- **Aspect re-scales are guidance, not measurement.** 9:16 and 1:1 rows in the table are how
  each treatment *should* reflow; the exact hero step per treatment is set at render.
- **No brand webfont exists.** The source loads `ui-sans-serif` via CSS generics; the showcase
  uses the same stack. Any deck or video that swaps in a display face is off-brand.
- **No press/brand page.** All values trace to a single CSS file cited in `design.md`; nothing
  in this spec adds a hex, weight, or radius not present there.
