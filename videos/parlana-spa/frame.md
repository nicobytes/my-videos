---
name: parlana-pixel-spa
source: user pixel-art reference (assets/reference/pixel-style-ref.png) × parlana.bo brand colors
primary_frame: 1080x1920 (portrait, 9:16)
pixel_unit: "1 art pixel = 10 screen px on full-frame scenes (108×192 art grid); close-ups may use 14–16px"

colors:
  # Parlana brand (measured on parlana.bo)
  cream: "#F1EFE8"        # brand ground — walls, cards
  white: "#FFFFFF"
  green: "#00BD4C"        # Parlana bright green — logo, agent, "answered", success
  green-deep: "#009A3E"   # Parlana dark green — buttons, uniform
  mint: "#E6F9EE"         # Parlana tint — calm/relief light
  ink: "#00260F"          # Parlana deep green-black — pixel outline + text ink
  charcoal: "#2C2C2A"     # Parlana body text
  stone: "#888780"        # Parlana muted gray — "seen", unanswered, gray-out
  amber: "#BA7517"        # Parlana CTA amber — wood, warm light, CTA button
  peach: "#FAEEDA"        # Parlana warm tint — candle glow
  # Pixel cast (from the user's reference — chibi skin/blush/hair)
  skin: "#F2C5A0"
  skin-shade: "#DDA07C"
  blush: "#E8796A"
  hair-olive: "#8F9A45"   # Vale's hair (the reference's green-haired girl)
  hair-olive-shade: "#6A7633"
  plum: "#5E3A4A"         # reference coat plum — clients' clothes, night tones
  night: "#1E3A33"        # loss scene — teal night (echoes the reference ground)
  alert: "#E5484D"        # notification badge red — used ONLY on unread counters

typography:
  in-world: { fontFamily: "Jersey 10", weight: 400 }  # clearest pixel digits + accents (tested vs Pixelify, Silkscreen, Press Start, VT323)      # chat bubbles, labels inside the pixel world
  brand: { fontFamily: "Plus Jakarta Sans", weight: 800 }    # parlana.bo's heading face — CTA + captions only
---

# Parlana pixel spa — design truth

**Concept:** a cozy pixel-art spa in Parlana's own colors. The world is cream and
green; stress turns it gray and teal-night; Parlana's bright green is the light
that returns. Color carries the story: **green = answered**, **stone gray =
unanswered/lost**, the red badge only ever counts unread messages.

## Rules

- Everything in-world is pixel art on a strict grid: sprites are SVG pixel
  grids (`shape-rendering: crispEdges`), scaled by whole numbers, positions
  snapped to the art grid. No smooth gradients, no blur, no soft shadows —
  shading is done with a second tone of the same hue.
- Outline color is `ink` (#00260F), never pure black.
- Motion has pixel-art cadence: stepped eases (`steps(n)`) for sprite moves,
  2–4-frame sprite cycles (blink, typing, walking). Smooth eases only for the
  camera and UI cards.
- Chat bubbles are pixel-bordered cards in `white`/`mint` with `Jersey 10`.
  The agent's replies are always `green`.
- The Parlana logo appears only from Frame 6 on (the brand arrives with the turn).
- Captions: `Plus Jakarta Sans` 800, cream on an `ink` pixel-edged plate,
  inside the Reels safe zone (bottom 340px clear).
