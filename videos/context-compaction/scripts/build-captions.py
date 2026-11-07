"""Builds compositions/captions.html from the word timings.

uv run python videos/context-compaction/scripts/build-captions.py

Sources: assets/footage/intro.words.json (global time = t) and
assets/vo/voiceover.words.json (global time = t + VO_OFFSET). Groups follow
shared/CAPTIONS.md: one composition spanning the film, groups of up to 4 words
or 24 characters, broken at sentence ends and pauses of 150 ms or more.
"""

import html
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
VO_OFFSET = 7.30
FILM = 93.2
MAX_WORDS, MAX_CHARS, PAUSE = 4, 24, 0.15

# Words the transcript joined or spelled differently from how they read on screen.
FIXES = {"bot...": "bot,", "AI": "AI"}


def load(path, offset):
    words = json.loads((ROOT / path).read_text())
    out = []
    for w in words:
        text = FIXES.get(w["text"], w["text"]).strip()
        if text:
            out.append({"text": text, "start": round(w["start"] + offset, 3), "end": round(w["end"] + offset, 3)})
    return out


words = load("assets/footage/intro.words.json", 0.0)
# The intro clip is cut at 7.4 s; its last word is clamped to the cut.
for w in words:
    w["end"] = min(w["end"], 7.30)
words += load("assets/vo/voiceover.words.json", VO_OFFSET)

groups, cur = [], []
for i, w in enumerate(words):
    if cur:
        prev = cur[-1]
        chars = sum(len(x["text"]) + 1 for x in cur) + len(w["text"])
        if (
            len(cur) >= MAX_WORDS
            or chars > MAX_CHARS
            or w["start"] - prev["end"] >= PAUSE
            or prev["text"][-1] in ".?!"
            or prev["text"][-1] == ","
            and len(cur) >= 2
        ):
            groups.append(cur)
            cur = []
    cur.append(w)
if cur:
    groups.append(cur)

# Fold a lone trailing word into the previous group when they are close.
merged = []
for g in groups:
    if (
        merged
        and len(g) == 1
        and g[0]["start"] - merged[-1][-1]["end"] < 0.12
        and len(merged[-1]) < 5
        and sum(len(x["text"]) + 1 for x in merged[-1]) + len(g[0]["text"]) <= 26
    ):
        merged[-1] = merged[-1] + g
    else:
        merged.append(g)
groups = merged

cues = []
for k, g in enumerate(groups):
    start = max(0.1, g[0]["start"] - 0.06)
    nxt = groups[k + 1][0]["start"] - 0.06 if k + 1 < len(groups) else FILM
    end = min(g[-1]["end"] + 0.35, nxt)
    cues.append({"start": round(start, 3), "end": round(end, 3), "words": g})

rows = []
for k, c in enumerate(cues):
    spans = "".join(
        f'<span class="cw" data-s="{w["start"]}" data-e="{w["end"]}"><i class="hl"></i><b>{html.escape(w["text"])}</b></span>'
        for w in c["words"]
    )
    rows.append(
        f'      <div class="cg" id="cg-{k:03d}" data-s="{c["start"]}" data-e="{c["end"]}"><div class="strip">{spans}</div></div>'
    )

doc = f"""<template>
  <style>
    #root {{
      position: absolute;
      inset: 0;
      pointer-events: none;
    }}
    /* Workspace safe zone (shared/CAPTIONS.md): bottom edge 340 px from the frame
       bottom, 110 px side margins. */
    #cap-layer {{
      position: absolute;
      left: 110px;
      right: 110px;
      bottom: 340px;
      height: 150px;
      overflow: visible;
    }}
    .cg {{
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      text-align: center;
      display: none;
    }}
    .strip {{
      display: inline-block;
      padding: 16px 26px 14px;
      background: var(--color-paper, #f6f2e8) url("assets/textures/paper.png");
      background-size: 512px 512px;
      border-radius: 3px 6px 4px 7px;
      font-family: "Montserrat", sans-serif;
      font-weight: 800;
      font-size: 56px;
      line-height: 1.08;
      letter-spacing: -0.01em;
      color: var(--color-ink, #141218);
      white-space: nowrap;
    }}
    #cap-shadow {{
      position: absolute;
      inset: 0;
      filter: drop-shadow(0 3px 0 rgba(20, 10, 40, 0.3)) drop-shadow(0 12px 18px rgba(20, 10, 40, 0.35));
      overflow: visible;
    }}
    .cw {{
      position: relative;
      display: inline-block;
      margin: 0 0.13em;
    }}
    .cw b {{
      position: relative;
      font-weight: 800;
      opacity: 0.38;
    }}
    .cw .hl {{
      position: absolute;
      left: -0.12em;
      right: -0.12em;
      top: 0.12em;
      bottom: 0.02em;
      background: var(--color-accent, #ffc72c);
      transform: scaleX(0);
      transform-origin: 0 50%;
    }}
  </style>
  <div id="root" data-composition-id="captions" data-width="1080" data-height="1920">
    <div id="cap-layer">
     <div id="cap-shadow">
{chr(10).join(rows)}
     </div>
    </div>
  </div>
  <script>
    (function () {{
      const tl = gsap.timeline({{ paused: true }});
      document.querySelectorAll("#cap-layer .cg").forEach((g) => {{
        const s = parseFloat(g.dataset.s);
        const e = parseFloat(g.dataset.e);
        const strip = g.querySelector(".strip");
        tl.set(g, {{ display: "block", opacity: 1 }}, s);
        // The strip is slapped down like a paper label: slight overshoot, no fade.
        tl.fromTo(strip, {{ scale: 1.08, rotation: -2.2, y: 6 }}, {{ scale: 1, rotation: -1, y: 0, duration: 0.16, ease: "expo.out" }}, s);
        g.querySelectorAll(".cw").forEach((w) => {{
          const ws = parseFloat(w.dataset.s);
          const we = parseFloat(w.dataset.e);
          const hl = w.querySelector(".hl");
          const b = w.querySelector("b");
          tl.set(b, {{ opacity: 1 }}, ws);
          tl.fromTo(hl, {{ scaleX: 0 }}, {{ scaleX: 1, duration: Math.min(0.14, Math.max(0.06, we - ws)), ease: "power2.out" }}, ws);
          tl.set(hl, {{ scaleX: 0 }}, Math.max(we, ws + 0.12));
        }});
        tl.to(g, {{ opacity: 0, duration: 0.08, ease: "power2.in" }}, e - 0.08);
        tl.set(g, {{ opacity: 0, display: "none" }}, e);
      }});
      tl.set({{}}, {{}}, {FILM});
      window.__timelines = window.__timelines || {{}};
      window.__timelines["captions"] = tl;
    }})();
  </script>
</template>
"""
(ROOT / "compositions" / "captions.html").write_text(doc)
(ROOT / "assets" / "caption-cues.json").write_text(
    json.dumps([{"start": c["start"], "end": c["end"], "text": " ".join(w["text"] for w in c["words"])} for c in cues], ensure_ascii=False, indent=1)
)
print(len(cues), "groups")
for c in cues[:6] + cues[-4:]:
    print(c["start"], c["end"], " ".join(w["text"] for w in c["words"]))
