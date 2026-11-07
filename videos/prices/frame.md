---
name: prices-ticket-ledger
source: bespoke — built for the "prices" project; revised to nod at WhatsApp's own palette
primary_frame: 1080x1920 (portrait, 9:16)
cqw_basis: "primary frame width is 1080px — cqw = px ÷ 1080 × 100 (NOT ÷1920; this project's primary frame is portrait)"
note: >
  Content: WhatsApp Business API pricing in Bolivia. One family, two voices —
  WhatsApp has no public licensed typeface of its own (its UI rides each
  platform's system font), so instead of faking one, Ticket & Ledger takes
  the same honest root and splits it by weight: Nunito at 900 is the price
  tag's shout, Nunito at 400/700 is the ledger's deadpan. HyperFrames-bundled
  (renders offline, deterministic, no @font-face needed): Nunito only.
  ledger-green is WhatsApp's own dark brand teal (#075E54) — a deliberate,
  scoped nod to the subject, kept to ONE token so the piece still reads as
  independent commentary, not an official WhatsApp asset.

colors:
  paper: "#EDEFE6"      # ground — cool sage-tinted ledger paper, not warm cream
  paper-dim: "#E2E6D7"  # recessed paper panel (ledger cell fill)
  ink: "#16231C"        # primary text on paper — deep bottle-green-black
  night: "#0F1A14"      # dark ground for closer/CTA frames
  night-ink: "#EDEFE6"  # text on night (= paper, inverted role)
  postal: "#C8381F"     # the sale-sticker red — markdowns, the one hot price
  ledger-green: "#075E54" # WhatsApp's own dark brand teal — totals, confirmations, "included"/"still free"
  brass: "#AB8332"      # rare third accent — a single unit/value callout, never a ground (darkened to clear 3:1 on paper)

pairings:
  light: { bg: paper, text: ink, accent: postal, accent-2: ledger-green, highlight: brass }
  dark:  { bg: night, text: night-ink, accent: postal, accent-2: ledger-green, highlight: brass }

typography:
  # ── display voice — Nunito 900, the price tag's shout ──
  ticket-numeral:
    fontFamily: "Nunito"
    weight: 900
    fontSize: "40cqw"           # the hero price — one number dominates the frame
    lineHeight: 0.85
    tracking: "0em"
    feature: "tabular-nums"
  tag-claim:
    fontFamily: "Nunito"
    weight: 900
    fontSize: "14cqw"           # ≤6-word headline
    lineHeight: 0.95
    tracking: "-0.005em"
  tag-long:
    fontFamily: "Nunito"
    weight: 900
    fontSize: "9cqw"            # 7+ word headline — steps down, never wraps tag-claim
    lineHeight: 1.05
    tracking: "0em"
  section-head:
    fontFamily: "Nunito"
    weight: 900
    fontSize: "6cqw"
    lineHeight: 1.0
    tracking: "0em"
  # ── ledger voice — Nunito 400/700, the receipt-tape deadpan ──
  ledger-line:
    fontFamily: "Nunito"
    weight: 400
    fontSize: "3.2cqw"          # body — clears the in-feed 32px floor at 1080 width
    lineHeight: 1.45
    tracking: "0em"
  ledger-strong:
    fontFamily: "Nunito"
    weight: 700
    fontSize: "3.2cqw"
    lineHeight: 1.45
    tracking: "0em"
  unit-label:
    fontFamily: "Nunito"
    weight: 700
    fontSize: "2.6cqw"          # "per month", "billed yearly" — sentence case, not caps
    lineHeight: 1.3
    tracking: "0.01em"
  ledger-fine:
    fontFamily: "Nunito"
    weight: 400
    fontSize: "2.2cqw"          # fine print only — below the legibility floor on purpose
    lineHeight: 1.4
    tracking: "0em"

rounded:
  radius-none: "0px"             # tickets and ledger cells are cut corners, not rounded
  radius-pill: "9999px"          # reserved for the one CTA chip only

spacing:
  unit: ".25rem"
  frame-pad: "6cqw"              # safe area from every edge (short-edge value, see CAPTIONS.md)
  gutter: "2.2cqw"
  hairline: "0.12cqw solid {colors.ink}"   # the only border style — no shadows anywhere
  perforation: "repeating-linear-gradient(to bottom, {colors.ink} 0 6px, transparent 6px 14px)"

components:
  surface-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  surface-night:
    backgroundColor: "{colors.night}"
    textColor: "{colors.night-ink}"

  ticket:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.ticket-numeral}"
    rounded: "{rounded.radius-none}"
    border: "{spacing.hairline}"

  ledger-cell:
    backgroundColor: "{colors.paper-dim}"
    textColor: "{colors.ink}"
    typography: "{typography.ledger-line}"
    rounded: "{rounded.radius-none}"
    borderTop: "{spacing.hairline}"
    padding: "2cqw 2.4cqw"

  price-tag:
    backgroundColor: "{colors.postal}"
    textColor: "{colors.paper}"
    typography: "{typography.tag-claim}"
    rounded: "{rounded.radius-none}"
    padding: "1cqw 2cqw"

  cta-chip:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.unit-label}"
    rounded: "{rounded.radius-pill}"
    padding: "1.4cqw 3cqw"

  included-line:
    textColor: "{colors.ledger-green}"
    typography: "{typography.ledger-line}"

  value-callout:
    textColor: "{colors.brass}"
    typography: "{typography.unit-label}"
---

# frame.md — prices: Ticket & Ledger

> **No content brief yet.** This spec fixes the typographic and color system
> only, so the project has a distinctive foundation before the video's real
> message, pricing data, and script arrive. Nothing below should be read as
> locked copy or a locked layout — only the tokens are locked.

## Overview

One family, two voices by weight, not by typeface. WhatsApp doesn't publish
or license a distinctive typeface of its own — its UI rides whatever font
the host platform already ships (San Francisco on iOS, Roboto on Android,
Segoe UI on desktop web). Rather than fake a "WhatsApp font" that doesn't
exist, Ticket & Ledger takes that same pragmatic move and runs **one**
rounded, friendly sans — **Nunito** — split by weight instead of by family:
**900** is the price tag's shout (loud, public, the number that just
changed), **400/700** is the ledger's deadpan (quiet, private, the fine
print that explains it). The tension that used to live between two typeface
*forms* (condensed display vs. fixed-width mono) now lives entirely in
*weight contrast* — 900 against 400 is the video-native "extreme weight
contrast" move, not a softened compromise.

Nunito is on HyperFrames' pre-bundled, offline-deterministic font list — no
`@font-face`, no local `.woff2` files, no network fetch at render time, all
three weights used here (400/700/900) ship in the bundle.

## Colors

- **Ground.** `{colors.paper}` — a cool, sage-leaning ledger paper, not the
  warm-cream default. `{colors.paper-dim}` is a recessed panel fill for ledger
  cells — never a shadow, a border instead (`{spacing.hairline}`).
- **Ink.** `{colors.ink}` is the only body/display text color on paper — a
  deep bottle-green-black, never pure `#000`.
- **Night.** `{colors.night}` is the dark ground reserved for a closer/CTA
  frame — never a mid-scene background; text on it is `{colors.night-ink}`.
- **The one hot price.** `{colors.postal}` fires on exactly one numeral or tag
  per frame — the markdown, the single price actually being sold this frame.
  It is a fill or a text color, never both at once.
- **The ledger total — now WhatsApp's own teal.** `{colors.ledger-green}`
  is `#075E54`, WhatsApp's real dark brand green (not the brighter
  `#25D366` action-green — the darker teal passes contrast as both a fill
  and a text color, and reads as the classic, instantly-recognizable
  WhatsApp header color). It marks what's included, confirmed, or still
  free — never the same frame as `{colors.postal}` unless one is clearly
  subordinate (a small included-line under a dominant price tag). **Scoped
  deliberately to this one token** — it is not the system's dominant/base
  color — so the piece still reads as independent commentary about WhatsApp,
  not an official WhatsApp-branded asset.
- **The rare third.** `{colors.brass}` appears on at most one short value
  callout per frame (a unit, a multiplier, a "saves X" figure) — never a
  ground, never two frames in a row.

## Typography

**Display ramp** (Nunito 900 — the heaviest bundled cut, used only here):
`{typography.ticket-numeral}` (40cqw) is the hero price number and should
dominate at 3–6× any neighboring text, same as any single-focal-element
frame. `{typography.tag-claim}` (14cqw, ≤6 words) and `{typography.tag-long}`
(9cqw, 7+ words) are headline sizes — a claim that wraps at `tag-claim` steps
down to `tag-long` rather than wrapping. `{typography.section-head}` (6cqw)
labels a block of content, sentence case.

**Ledger ramp** (Nunito 400/700): `{typography.ledger-line}` (3.2cqw ≈ 35px
at 1080 width) is body copy and clears the in-feed legibility floor.
`{typography.ledger-strong}` is the weight-700 cut of the same size, for the
one emphasized word in a ledger line — not a different color, a different
weight, so the ledger voice stays monochrome. `{typography.unit-label}`
(2.6cqw) is sentence case, never tracked-out caps. `{typography.ledger-fine}`
(2.2cqw) is fine print only and sits intentionally below the legibility floor.

**Tabular numerals.** Every price, total, or stat uses
`font-variant-numeric: tabular-nums` (already specified on
`{typography.ticket-numeral}`) so digits align in columns — essential the
moment two prices sit near each other.

**Case rule.** Sentence case everywhere, on both voices. No all-caps labels,
no tracked-out eyebrows.

## Layout — The Frame

- **Primary frame:** 1080×1920 (9:16, portrait) — Reels/TikTok/Shorts native,
  matching `shared/CAPTIONS.md`'s own 1080×1920 reference exactly.
- **Safe area:** `{spacing.frame-pad}` (6cqw) from every edge.
- **Captions.** This project carries burned-in captions. Follow
  `shared/CAPTIONS.md` verbatim: the safe zone is fixed for the whole video
  (left/right 110px, bottom 340px), every scene's own content ends by
  y≈1460, and the caption sub-composition self-manages visibility across the
  full video span. `compositions/captions.html` in this project already
  follows that pattern — read it before adding any new scene, and treat
  y≈1460 as the content ceiling from the first scene on, not something fixed
  after the fact.
- **Alignment.** Ticket/hero-price frames center on both axes (a price tag is
  looked at, not read down). Ledger frames (anything with more than one line
  of ledger-voice text) left-align in a column capped near 80cqw wide, the
  way a receipt or a ledger sheet reads top-to-bottom, not centered.
- **Corners.** Square corners everywhere except the single CTA chip
  (`{rounded.radius-pill}`), which is the one rounded shape in the whole
  system — a ticket is cut, not rounded.
- **Depth.** No shadows anywhere. `{spacing.hairline}` (a 1px-equivalent ink
  rule) is the only separator/border device — a ledger uses rules, not
  elevation.

## Do's and Don'ts

**Do**
- Let the hero numeral dominate at 3–6× its nearest neighbor on any ticket
  frame.
- Keep the 900/400/700 weight roles fixed — display never drops to 400, the
  ledger's body voice never climbs to 900. The contrast IS the typeface
  system now that there's only one family.
- Use `{spacing.hairline}` to separate ledger rows instead of spacing alone.
- Use tabular numerals any time two or more figures appear near each other.

**Don't**
- Never introduce a second typeface — Nunito's own weight range carries the
  whole system now (no third font without a documented reason in this file).
- Never render an all-caps label or a tracked-out eyebrow — sentence case only.
- Never add a drop shadow, soft glow, or gradient — the system is flat ink on
  paper.
- Never let `{colors.ledger-green}` become the system's dominant/background
  color — it stays a scoped, single-token nod to WhatsApp's palette, not a
  reskin. Using it everywhere reads as an official WhatsApp asset, which
  this isn't.
- Never invent a real price, plan name, or feature list — every figure here is
  a placeholder until the real brief lands; swap `{components.ticket}` content
  for the actual numbers then, without changing the tokens.
- Never move the caption safe zone per-scene — `shared/CAPTIONS.md`'s rule
  stands above this file.

## Known Gaps

- No content brief yet (`message`, `destination`, `length`, pricing data are
  all unset). This file is the typography/color foundation only — re-read it
  once the brief exists, but its tokens shouldn't need to change for it.
- `cqw` here is computed against **1080px** (portrait primary), not 1920px —
  do not reuse the nicobytes frame.md's conversion constant in this project.
- **Revision history**: originally League Gothic (display) + Space Mono
  (ledger), two typeface forms. Revised to single-family Nunito at 900/400/700
  after the user disliked the original typefaces and asked for a WhatsApp-
  adjacent look; `ledger-green` was repointed from a neutral accounting green
  (`#2F6B4F`) to WhatsApp's real dark brand teal (`#075E54`) at the same time.
