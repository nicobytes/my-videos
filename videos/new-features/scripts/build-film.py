"""Write index.html and compositions/*.html from scripts/film.py + edl.json.

Cues live in source seconds; this maps them to film seconds through the EDL,
so a new cut only needs a rebuild. Re-running OVERWRITES the generated files:
change copy and timing in film.py, and look/motion in the templates below.

Usage (from the video folder):
  uv run --project ../.. python scripts/build-film.py
"""

import html
import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from film import CLOSE_AT, CLOSE_CALLS, DOC, ITEMS, LAYOUT, MOVIL, MUSIC_END  # noqa: E402

EDL = json.load(open("edl.json"))
SEGS = EDL["segments"]
D = round(EDL["duration"], 3)
LEDGER = 2.6  # chapter beat length (film seconds)


def out(t):
    """Source seconds -> film seconds (a time inside a cut lands on what follows it)."""
    for s in SEGS:
        a, b = s["src"]
        if t < a:
            return s["out"][0]
        if t < b:
            return s["out"][0] + (t - a)
    return D


def r(x):
    return round(x, 3)


def esc(s):
    return html.escape(s, quote=False)


def words(s, cls):
    return " ".join(f'<span class="{cls}">{esc(w)}</span>' for w in s.split())


FONTS = """
@font-face { font-family: "Cormorant Garamond"; src: url("assets/fonts/cormorant-garamond-300.woff2") format("woff2"); font-weight: 300; }
@font-face { font-family: "Cormorant Garamond"; src: url("assets/fonts/cormorant-garamond-400.woff2") format("woff2"); font-weight: 400; }
@font-face { font-family: "Cormorant Garamond"; src: url("assets/fonts/cormorant-garamond-500.woff2") format("woff2"); font-weight: 500; }
@font-face { font-family: "Jost"; src: url("assets/fonts/jost-400.woff2") format("woff2"); font-weight: 400; }
@font-face { font-family: "Jost"; src: url("assets/fonts/jost-500.woff2") format("woff2"); font-weight: 500; }
@font-face { font-family: "Jost"; src: url("assets/fonts/jost-600.woff2") format("woff2"); font-weight: 600; }
"""

# Palette sampled from the client's PDF.
PAPER, INK, BROWN, TERRA, RULE, MUTED, BAND = "#FBF8F4", "#312A23", "#5B4334", "#A4583A", "#E4D6C6", "#8A7668", "#F3E6DE"

SHARED_CSS = f"""
{FONTS}
.lbl {{ font: 500 28px/1 "Jost"; letter-spacing: 0.16em; text-transform: uppercase; color: {BROWN}; }}
.ttl {{ font: 500 64px/1.04 "Cormorant Garamond"; color: {INK}; letter-spacing: -0.01em; }}
.txt {{ font: 400 30px/1.42 "Jost"; color: {BROWN}; }}
.meta {{ font: 400 28px/1.3 "Jost"; color: {MUTED}; }}
.w {{ display: inline-block; }}
.stamp {{ display: inline-block; padding: 12px 22px 10px; border: 3px solid {BROWN}; color: {BROWN};
  font: 600 28px/1 "Jost"; letter-spacing: 0.14em; text-transform: uppercase; transform-origin: 0% 50%; }}
.stamp.ask {{ background: {TERRA}; border-color: {TERRA}; color: #FFFFFF; }}
.chip {{ font: 500 28px/1 "Jost"; letter-spacing: 0.04em; color: {BROWN}; white-space: nowrap; }}
.chip.ask {{ color: {TERRA}; font-weight: 600; }}
.chip .mk {{ display: inline-block; width: 14px; height: 14px; border-radius: 50%; background: currentColor; margin-right: 12px; transform: translateY(-2px); }}
"""

CHIP_MARK = {"ok": "✓ ", "rev": "", "ask": ""}


def chip_html(it, idp):
    cls = "chip ask" if it["status"] == "ask" else "chip"
    mark = '<span class="mk"></span>' if it["status"] == "ask" else CHIP_MARK[it["status"]]
    return f'<span id="{idp}" class="{cls}">{mark}{esc(it["chip"])}</span>'


# ---------------------------------------------------------------- chapters

CUES = []  # film-time layout track, filled in main()
MOVE = 0.7  # layout transition length (matches the root timeline)


def hide_js(sel, start, dur, states):
    """tl.set lines that hide `sel` while the layout covers it (local seconds)."""
    track = [(q[0] - start, q[1]) for q in CUES]
    spans = []  # merged covered runs
    for i, (t, st) in enumerate(track):
        end = track[i + 1][0] if i + 1 < len(track) else 1e9
        if st not in states:
            continue
        if spans and abs(spans[-1][1] - t) < 1e-6:
            spans[-1][1] = end
        else:
            spans.append([t, end])
    lines = []
    for t, end in spans:
        a, b = max(t, 0) + MOVE, min(end, dur)
        if end <= 0 or t >= dur or b - a <= 0.05:
            continue
        lines.append(f'tl.set("{sel}", {{ opacity: 0 }}, {r(a)});')
        if b < dur:
            lines.append(f'tl.set("{sel}", {{ opacity: 1 }}, {r(b)});')
    return "\n        ".join(lines)


ROW0, ROWH = 238, 84  # ledger rows: first baseline box top, row height


def ledger_rows(cid, current):
    rows = []
    for it in ITEMS:
        n = it["n"]
        y = ROW0 + (n - 1) * ROWH
        chip = chip_html(it, f"{cid}-st{n}") if n < current else ""
        rows.append(
            f'<div class="row" style="top:{y}px"><span class="num">{n}</span>'
            f'<span id="{cid}-rt{n}" class="rt">{esc(it["short"])}</span><span class="rs">{chip}</span></div>'
        )
    return "\n        ".join(rows)


def chapter(it, start, dur):
    n, cid = it["n"], f"p{it['n']}"
    stamp_t = max(out(it["stamp_at"]) - start, LEDGER + 0.8)
    has_new = "new_at" in it
    new_t = out(it["new_at"]) - start if has_new else 0
    title_words = len(it["title"].split())
    t_title = 2.45
    t_desc = t_title + title_words * 0.067 + 0.15
    hl_from = ROW0 + (n - 2) * ROWH if n > 1 else ROW0 - ROWH
    hl_to = ROW0 + (n - 1) * ROWH
    stamp_cls = "stamp ask" if it["status"] == "ask" else "stamp"
    new_block = ""
    new_js = ""
    if has_new:
        new_block = f"""
        <div id="{cid}-new" class="ans">
          <span id="{cid}-newchip" class="stamp ask">Nuevo</span>
          <div id="{cid}-newt" class="ttl small">{words(it["new_title"], f"w {cid}-nw")}</div>
          <div id="{cid}-newb" class="txt">{esc(it["new_body"])}</div>
        </div>"""
        new_js = f"""
      tl.to("#{cid}-ans", {{ opacity: 0, filter: "blur(8px)", duration: 0.2, ease: "power2.in" }}, {r(new_t)});
      tl.fromTo("#{cid}-new", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.01 }}, {r(new_t + 0.2)});
      tl.fromTo("#{cid}-newchip", {{ opacity: 0, scale: 1.35, rotation: -6 }}, {{ opacity: 1, scale: 1, rotation: -3, duration: 0.22, ease: "expo.out" }}, {r(new_t + 0.2)});
      tl.fromTo(".{cid}-nw", {{ opacity: 0, filter: "blur(6px)" }}, {{ opacity: 1, filter: "blur(0px)", duration: 0.13, stagger: 0.067, ease: "power4.out" }}, {r(new_t + 0.45)});
      tl.fromTo("#{cid}-newb", {{ opacity: 0, filter: "blur(8px)" }}, {{ opacity: 1, filter: "blur(0px)", duration: 0.2, ease: "power4.out" }}, {r(new_t + 0.45 + len(it["new_title"].split()) * 0.067 + 0.2)});"""
    prev_stamp_js = ""
    if n > 1:
        prev_stamp_js = f"""
      tl.fromTo("#{cid}-st{n - 1}", {{ opacity: 0, scale: 1.4 }}, {{ opacity: 1, scale: 1, duration: 0.2, ease: "expo.out" }}, 0.62);"""
    return f"""<!doctype html>
<html>
  <head><meta charset="UTF-8" /></head>
  <body>
    <template>
      <style>
        {SHARED_CSS}
        #root {{ position: absolute; inset: 0; }}
        #{cid}-panel {{ position: absolute; left: 1216px; top: 104px; width: 640px; height: 912px; }}
        #{cid}-head {{ display: flex; flex-direction: column; gap: 26px; }}
        #{cid}-panel .ans {{ position: absolute; left: 0; top: 600px; width: 640px; display: flex; flex-direction: column; gap: 22px; align-items: flex-start; }}
        #{cid}-panel .ttl.small {{ font-size: 50px; }}
        #{cid}-panel .answer {{ font: 400 32px/1.38 "Jost"; color: {INK}; }}
        #{cid}-panel .stamp {{ transform: rotate(-3deg); }}
        #{cid}-led {{ position: absolute; inset: 0; background: {PAPER}; }}
        #{cid}-sheet {{ position: absolute; inset: 0; transform-origin: 1000px {hl_to + ROWH // 2}px; }}
        #{cid}-sheet .doc {{ position: absolute; left: 360px; top: 112px; font: 300 56px/1 "Cormorant Garamond"; color: {BROWN}; }}
        #{cid}-sheet .row {{ position: absolute; left: 340px; width: 1500px; height: {ROWH}px; border-bottom: 2px solid {RULE};
          display: flex; align-items: center; }}
        #{cid}-sheet .num {{ width: 70px; padding-left: 20px; font: 400 30px/1 "Jost"; color: {MUTED}; }}
        #{cid}-sheet .rt {{ flex: 1; font: 500 42px/1 "Cormorant Garamond"; color: {INK}; }}
        #{cid}-sheet .rs {{ width: 300px; text-align: right; padding-right: 20px; }}
        #{cid}-sheet .rs .chip {{ display: inline-block; transform-origin: 100% 50%; }}
        #{cid}-hl {{ position: absolute; left: 340px; top: 0; width: 1500px; height: {ROWH}px; background: {BAND}; }}
      </style>
      <div id="root" data-composition-id="{cid}" data-width="1920" data-height="1080">
        <div id="{cid}-panel">
          <div id="{cid}-head">
            <div id="{cid}-lbl" class="lbl">Pedido {n} de 9</div>
            <div id="{cid}-ttl" class="ttl">{words(it["title"], f"w {cid}-tw")}</div>
            <div id="{cid}-desc" class="txt">{esc(it["desc"])}</div>
            <div id="{cid}-meta" class="meta">{esc(it["tipo"])} · Prioridad {esc(it["prio"].lower())} · {esc(it["fecha"])}</div>
          </div>
          <div id="{cid}-ans" class="ans">
            <span id="{cid}-stamp" class="{stamp_cls}">{esc(it["stamp"])}</span>
            <div id="{cid}-answer" class="answer">{esc(it["answer"])}</div>
          </div>{new_block}
        </div>
        <div id="{cid}-led">
          <div id="{cid}-sheet">
            <div id="{cid}-hl"></div>
            <div class="doc">{esc(DOC["title"])}</div>
        {ledger_rows(cid, n)}
          </div>
        </div>
      </div>
      <script>
        const tl = gsap.timeline({{ paused: true }});
        // Ledger beat: the client's list, the highlight steps to this row.
        tl.fromTo("#{cid}-led", {{ clipPath: "inset(0% 0% 100% 0%)" }}, {{ clipPath: "inset(0% 0% 0% 0%)", duration: 0.42, ease: "power3.inOut" }}, 0);
        tl.fromTo("#{cid}-hl", {{ y: {hl_from} }}, {{ y: {hl_to}, duration: 0.55, ease: "power3.inOut" }}, 0.3);{prev_stamp_js}
        tl.fromTo("#{cid}-rt{n}", {{ color: "{INK}" }}, {{ color: "{TERRA}", duration: 0.25, ease: "power2.out" }}, 0.95);
        // Push into the row, then the card takes the frame.
        tl.fromTo("#{cid}-sheet", {{ scale: 1, filter: "blur(0px)" }}, {{ scale: 1.45, filter: "blur(10px)", duration: 0.55, ease: "power3.in" }}, 1.95);
        tl.fromTo("#{cid}-led", {{ opacity: 1 }}, {{ opacity: 0, duration: 0.25, ease: "power2.in" }}, 2.25);
        tl.fromTo("#{cid}-lbl", {{ opacity: 0, filter: "blur(6px)" }}, {{ opacity: 1, filter: "blur(0px)", duration: 0.18, ease: "power4.out" }}, 2.35);
        tl.fromTo(".{cid}-tw", {{ opacity: 0, filter: "blur(6px)" }}, {{ opacity: 1, filter: "blur(0px)", duration: 0.13, stagger: 0.067, ease: "power4.out" }}, {t_title});
        tl.fromTo("#{cid}-desc", {{ opacity: 0, filter: "blur(8px)" }}, {{ opacity: 1, filter: "blur(0px)", duration: 0.2, ease: "power4.out" }}, {r(t_desc)});
        tl.fromTo("#{cid}-meta", {{ opacity: 0, filter: "blur(8px)" }}, {{ opacity: 1, filter: "blur(0px)", duration: 0.2, ease: "power4.out" }}, {r(t_desc + 0.18)});
        // The verdict: stamped when Nicolás says it.
        tl.fromTo("#{cid}-stamp", {{ opacity: 0, scale: 1.35, rotation: -7 }}, {{ opacity: 1, scale: 1, rotation: -3, duration: 0.22, ease: "expo.out" }}, {r(stamp_t)});
        tl.fromTo("#{cid}-answer", {{ opacity: 0, filter: "blur(8px)" }}, {{ opacity: 1, filter: "blur(0px)", duration: 0.2, ease: "power4.out" }}, {r(stamp_t + 0.3)});{new_js}
        // Hidden while the screen or the camera covers the card.
        {hide_js(f"#{cid}-panel", start, dur, ("screen", "phone"))}
        window.__timelines["{cid}"] = tl;
      </script>
    </template>
  </body>
</html>
"""


# ---------------------------------------------------------------- intro

def intro(dur):
    rows = "\n            ".join(
        f'<div class="ir"><span class="in">{it["n"]}</span>{esc(it["short"])}</div>' for it in ITEMS
    )
    return f"""<!doctype html>
<html>
  <head><meta charset="UTF-8" /></head>
  <body>
    <template>
      <style>
        {SHARED_CSS}
        #root {{ position: absolute; inset: 0; }}
        #intro-panel {{ position: absolute; left: 1216px; top: 96px; width: 640px; }}
        #intro-mark {{ font: 300 46px/1 "Cormorant Garamond"; letter-spacing: 0.32em; color: {TERRA}; }}
        #intro-sub {{ margin-top: 10px; font: 400 28px/1 "Jost"; letter-spacing: 0.32em; color: {BROWN}; }}
        #intro-ttl {{ margin-top: 44px; }}
        #intro-meta {{ margin-top: 22px; }}
        #intro-list {{ margin-top: 40px; border-top: 2px solid {RULE}; }}
        #intro-list .ir {{ height: 50px; display: flex; align-items: center; border-bottom: 2px solid {RULE};
          font: 400 28px/1 "Jost"; color: {INK}; }}
        #intro-list .in {{ width: 46px; color: {MUTED}; }}
      </style>
      <div id="root" data-composition-id="intro" data-width="1920" data-height="1080">
        <div id="intro-panel">
          <div id="intro-mark">{esc(DOC["brand"])}</div>
          <div id="intro-sub">{esc(DOC["brand_sub"])}</div>
          <div id="intro-ttl" class="ttl">{words(DOC["title"], "w intro-tw")}</div>
          <div id="intro-meta" class="meta">{esc(DOC["meta"])}</div>
          <div id="intro-list">
            {rows}
          </div>
        </div>
      </div>
      <script>
        const tl = gsap.timeline({{ paused: true }});
        // Frame 0 is the thumbnail: camera, mark and title already set.
        tl.fromTo("#intro-meta", {{ opacity: 0, filter: "blur(8px)" }}, {{ opacity: 1, filter: "blur(0px)", duration: 0.2, ease: "power4.out" }}, 0.75);
        tl.fromTo("#intro-list", {{ clipPath: "inset(0% 0% 100% 0%)" }}, {{ clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power3.inOut" }}, 4.0);
        tl.fromTo("#intro-list .ir", {{ color: "{MUTED}" }}, {{ color: "{INK}", duration: 0.2, stagger: 0.09, ease: "power2.out" }}, 4.2);
        window.__timelines["intro"] = tl;
      </script>
    </template>
  </body>
</html>
"""


# ---------------------------------------------------------------- app móvil

def movil(dur):
    b_t = out(MOVIL["b_at"]) - out(MOVIL["start"])
    hide = hide_js("#movil-cap", out(MOVIL["start"]), dur, ("screen", "talk"))
    return f"""<!doctype html>
<html>
  <head><meta charset="UTF-8" /></head>
  <body>
    <template>
      <style>
        {SHARED_CSS}
        #root {{ position: absolute; inset: 0; }}
        .mcap {{ position: absolute; left: 72px; top: 300px; width: 420px; display: flex; flex-direction: column; gap: 26px; align-items: flex-start; }}
        .mcap .ttl {{ font-size: 54px; }}
      </style>
      <div id="root" data-composition-id="movil" data-width="1920" data-height="1080">
        <div id="movil-cap">
        <div id="movil-a" class="mcap">
          <div id="movil-al" class="lbl">{esc(MOVIL["a_label"])}</div>
          <div id="movil-at" class="ttl">{words(MOVIL["a_title"], "w movil-aw")}</div>
        </div>
        <div id="movil-b" class="mcap">
          <span id="movil-bc" class="stamp ask" style="transform: rotate(-3deg)">Nuevo</span>
          <div id="movil-bt" class="ttl">{words(MOVIL["b_title"], "w movil-bw")}</div>
          <div id="movil-bb" class="txt">{esc(MOVIL["b_body"])}</div>
        </div>
        </div>
      </div>
      <script>
        const tl = gsap.timeline({{ paused: true }});
        tl.fromTo("#movil-al", {{ opacity: 0, filter: "blur(6px)" }}, {{ opacity: 1, filter: "blur(0px)", duration: 0.18, ease: "power4.out" }}, 0.75);
        tl.fromTo(".movil-aw", {{ opacity: 0, filter: "blur(6px)" }}, {{ opacity: 1, filter: "blur(0px)", duration: 0.13, stagger: 0.067, ease: "power4.out" }}, 0.9);
        tl.fromTo("#movil-a", {{ opacity: 1 }}, {{ opacity: 0, filter: "blur(8px)", duration: 0.2, ease: "power2.in" }}, {r(b_t)});
        tl.fromTo("#movil-b", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.01 }}, {r(b_t + 0.2)});
        tl.fromTo("#movil-bc", {{ opacity: 0, scale: 1.35, rotation: -7 }}, {{ opacity: 1, scale: 1, rotation: -3, duration: 0.22, ease: "expo.out" }}, {r(b_t + 0.2)});
        tl.fromTo(".movil-bw", {{ opacity: 0, filter: "blur(6px)" }}, {{ opacity: 1, filter: "blur(0px)", duration: 0.13, stagger: 0.067, ease: "power4.out" }}, {r(b_t + 0.45)});
        tl.fromTo("#movil-bb", {{ opacity: 0, filter: "blur(8px)" }}, {{ opacity: 1, filter: "blur(0px)", duration: 0.2, ease: "power4.out" }}, {r(b_t + 0.9)});
        {hide}
        window.__timelines["movil"] = tl;
      </script>
    </template>
  </body>
</html>
"""


# ---------------------------------------------------------------- cierre

CROW0, CROWH = 206, 86


def cierre(start, dur):
    rows = []
    for it in ITEMS:
        n = it["n"]
        y = CROW0 + (n - 1) * CROWH
        rows.append(
            f'<div id="cierre-r{n}" class="row" style="top:{y}px"><span class="num">{n}</span>'
            f'<span id="cierre-rt{n}" class="rt">{esc(it["short"])}</span>'
            f'<span class="rs">{chip_html(it, f"cierre-st{n}")}</span></div>'
        )
    calls_js = []
    for i, (t, n) in enumerate(CLOSE_CALLS):
        lt = r(out(t) - start)
        y = CROW0 + (n - 1) * CROWH
        if i == 0:
            calls_js.append(f'tl.fromTo("#cierre-hl", {{ y: {y}, scaleX: 0 }}, {{ y: {y}, scaleX: 1, duration: 0.45, ease: "power3.out" }}, {lt});')
        else:
            calls_js.append(f'tl.to("#cierre-hl", {{ y: {y}, duration: 0.5, ease: "power3.inOut" }}, {lt});')
        calls_js.append(f'tl.fromTo("#cierre-rt{n}", {{ color: "{INK}" }}, {{ color: "{TERRA}", duration: 0.25 }}, {r(lt + 0.2)});')
    calls = "\n        ".join(calls_js)
    rows_html = "\n          ".join(rows)
    return f"""<!doctype html>
<html>
  <head><meta charset="UTF-8" /></head>
  <body>
    <template>
      <style>
        {SHARED_CSS}
        #root {{ position: absolute; inset: 0; }}
        #cierre-doc {{ position: absolute; left: 84px; top: 92px; font: 300 60px/1 "Cormorant Garamond"; color: {BROWN}; }}
        #cierre-list .row {{ position: absolute; left: 64px; width: 1088px; height: {CROWH}px; border-bottom: 2px solid {RULE};
          display: flex; align-items: center; }}
        #cierre-list .num {{ width: 64px; padding-left: 20px; font: 400 30px/1 "Jost"; color: {MUTED}; }}
        #cierre-list .rt {{ flex: 1; font: 500 40px/1 "Cormorant Garamond"; color: {INK}; }}
        #cierre-list .rs {{ width: 290px; text-align: right; padding-right: 20px; }}
        #cierre-list .rs .chip {{ display: inline-block; transform-origin: 100% 50%; }}
        #cierre-hl {{ position: absolute; left: 64px; top: 0; width: 1088px; height: {CROWH}px; background: {BAND}; transform-origin: 0% 50%; }}
      </style>
      <div id="root" data-composition-id="cierre" data-width="1920" data-height="1080">
        <div id="cierre-doc">{esc(DOC["title"])}</div>
        <div id="cierre-list">
          <div id="cierre-hl"></div>
          {rows_html}
        </div>
      </div>
      <script>
        const tl = gsap.timeline({{ paused: true }});
        tl.fromTo("#cierre-doc", {{ opacity: 0, filter: "blur(8px)" }}, {{ opacity: 1, filter: "blur(0px)", duration: 0.2, ease: "power4.out" }}, 0.5);
        tl.fromTo("#cierre-list .row", {{ opacity: 0, filter: "blur(6px)" }}, {{ opacity: 1, filter: "blur(0px)", duration: 0.18, stagger: 0.06, ease: "power4.out" }}, 0.7);
        // The whole list gets its verdicts, one stamp after another.
        tl.fromTo("#cierre-list .chip", {{ opacity: 0, scale: 1.4 }}, {{ opacity: 1, scale: 1, duration: 0.2, stagger: 0.14, ease: "expo.out" }}, 1.6);
        tl.set("#cierre-hl", {{ scaleX: 0 }}, 0);
        {calls}
        window.__timelines["cierre"] = tl;
      </script>
    </template>
  </body>
</html>
"""


# ---------------------------------------------------------------- root

def layout_track(chapter_starts):
    cues = []
    for c in LAYOUT:
        t, state = out(c[0]), c[1]
        focus = list(c[2:]) if state == "screen" else []
        cues.append([r(t), state, *focus])
    # Each chapter opens on the ledger; whatever was due in that beat waits.
    for c in chapter_starts:
        resume = None
        keep = []
        for cue in cues:
            if c <= cue[0] < c + LEDGER:
                resume = cue
            else:
                keep.append(cue)
        if resume is None:
            resume = max((q for q in keep if q[0] < c), key=lambda q: q[0])
        keep.append([r(c), "ledger"])
        keep.append([r(c + LEDGER), *resume[1:]])
        cues = sorted(keep, key=lambda q: q[0])
    return cues


def jump_cuts(cues):
    """Film times of the EDL joins that fall in talking stretches: the camera
    punches in or out there so the jump reads as a cut, not a glitch."""
    changes = [q[0] for q in cues]
    joins = [s["out"][0] for s in SEGS[1:]]
    pts, last = [], -9
    for j in joins:
        state = [q for q in cues if q[0] <= j][-1][1]
        if state != "talk" or any(abs(j - c) < 1.0 for c in changes) or j - last < 2.5:
            continue
        pts.append(r(j))
        last = j
    return pts


def root(chapters, cues, cuts, intro_end, close_start, movil_span):
    hosts = [
        f'<div id="intro" data-composition-id="intro" data-composition-src="compositions/intro.html" data-start="0" '
        f'data-duration="{r(intro_end)}" data-track-index="1" data-track-kind="graphics" data-width="1920" data-height="1080"></div>'
    ]
    for it, s, d in chapters:
        cid = f"p{it['n']}"
        hosts.append(
            f'<div id="{cid}" data-composition-id="{cid}" data-composition-src="compositions/{cid}.html" data-start="{r(s)}" '
            f'data-duration="{r(d)}" data-track-index="1" data-track-kind="graphics" data-width="1920" data-height="1080"></div>'
        )
    hosts.append(
        f'<div id="cierre" data-composition-id="cierre" data-composition-src="compositions/cierre.html" data-start="{r(close_start)}" '
        f'data-duration="{r(D - close_start)}" data-track-index="1" data-track-kind="graphics" data-width="1920" data-height="1080"></div>'
    )
    ms, me = movil_span
    hosts.append(
        f'<div id="movil" data-composition-id="movil" data-composition-src="compositions/movil.html" data-start="{r(ms)}" '
        f'data-duration="{r(me - ms)}" data-track-index="2" data-track-kind="graphics" data-width="1920" data-height="1080"></div>'
    )
    hosts_html = "\n      ".join(hosts)
    music_tag = ""
    if os.path.exists("assets/cut/music.m4a"):  # already at -30 LUFS, under the voice
        music_tag = (f'\n      <audio id="music" class="clip" src="assets/cut/music.m4a" data-start="0" data-duration="{r(min(D, MUSIC_END))}" '
                     'data-track-index="6" data-volume="1" data-fade-in="2" data-fade-out="4"></audio>')
    return f"""<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <!-- Generated by scripts/build-film.py: copy and timing live in scripts/film.py. -->
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: {PAPER}; }}
      #root {{ position: relative; width: 1920px; height: 1080px; overflow: hidden; background: {PAPER}; }}
      #ground {{ position: absolute; inset: 0; background: {PAPER}; }}
      #intro, #cierre, #movil, [id^="p"][data-composition-src] {{ z-index: 1; }}
      #bezel {{ position: absolute; left: 522px; top: 52px; width: 473px; height: 976px; border-radius: 62px;
        background: #1F1B18; z-index: 2; transform-origin: 50% 50%; opacity: 0; }}
      #bezel::after {{ content: ""; position: absolute; left: 50%; top: 6px; width: 12px; height: 12px; margin-left: -6px;
        border-radius: 50%; background: #3A332E; }}
      #scrMove {{ position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; transform-origin: 0 0; z-index: 3; }}
      #scrClip {{ position: absolute; inset: 0; }}
      #screen {{ position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }}
      #camMove {{ position: absolute; left: 0; top: 0; width: 1088px; height: 952px; transform-origin: 0 0; z-index: 4; }}
      #camClip {{ position: absolute; inset: 0; overflow: hidden; }}
      #camPunch {{ position: absolute; inset: 0; transform-origin: 50% 36%; }}
      #cam {{ position: absolute; left: 0; top: 0; width: 1088px; height: 952px; object-fit: cover; object-position: 50% 50%; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{D}" data-width="1920" data-height="1080">
      <div id="ground"></div>
      {hosts_html}
      <div id="bezel"></div>
      <div id="scrMove">
        <div id="scrClip">
          <video id="screen" class="clip" src="assets/cut/display.mp4" data-start="0" data-duration="{D}" data-track-index="3" muted playsinline></video>
        </div>
      </div>
      <div id="camMove">
        <div id="camClip" data-layout-allow-overflow>
          <div id="camPunch">
            <video id="cam" class="clip" src="assets/cut/webcam.mp4" data-start="0" data-duration="{D}" data-track-index="4" muted playsinline></video>
          </div>
        </div>
      </div>
      <audio id="voice" class="clip" src="assets/cut/mic.m4a" data-start="0" data-duration="{D}" data-track-index="5" data-volume="1"></audio>{music_tag}
    </div>
    <script>
      // Layout track in film seconds: [t, state, cx, cy, zoom] (zoom only for "screen").
      const LAYOUT = {json.dumps(cues)};
      // EDL joins inside talking stretches: the camera alternates framing there.
      const CUTS = {json.dumps(cuts)};

      const W0 = 1088, H0 = 952; // camera's native box (transform origin 0 0)
      const CAM = {{
        talk: {{ x: 64, y: 64, w: 1088, h: 952, rad: 28 }},
        screen: {{ x: 64, y: 784, w: 216, h: 216, rad: 108 }},
        ledger: {{ x: 64, y: 784, w: 216, h: 216, rad: 108 }},
        phone: {{ x: 1216, y: 64, w: 640, h: 952, rad: 28 }},
        close: {{ x: 1216, y: 64, w: 640, h: 952, rad: 28 }},
      }};
      const APP = {{ x: 0, y: 88, w: 1920, h: 992 }}; // the recording minus the browser chrome
      const SCR_T = {{ x: 40, y: 64, w: 1840, h: 951, rad: 18 }};
      const PHONE_R = {{ x: 0, y: 88, w: 456, h: 980 }}; // DevTools' mobile viewport
      const PHONE_T = {{ x: 540, y: 70, w: 437, h: 940, rad: 46 }};
      const PARK_T = {{ x: 1216, y: 300, w: 640, h: 331, rad: 18 }}; // where the screen waits, hidden

      function camProps(s) {{
        const b = CAM[s], a = b.w / b.h, a0 = W0 / H0;
        let sc, il = 0, it = 0;
        if (a < a0) {{ sc = b.h / H0; il = (W0 - H0 * a) / 2; }} else {{ sc = b.w / W0; it = (H0 - W0 / a) / 2; }}
        const rr = b.rad / sc;
        return {{
          move: {{ x: b.x - il * sc, y: b.y - it * sc, scale: sc }},
          clip: `inset(${{it}}px ${{il}}px ${{it}}px ${{il}}px round ${{rr}}px)`,
        }};
      }}

      function focusRect(cx, cy, z) {{
        const w = APP.w / z, h = APP.h / z;
        const x = Math.min(Math.max(cx - w / 2, APP.x), APP.x + APP.w - w);
        const y = Math.min(Math.max(cy - h / 2, APP.y), APP.y + APP.h - h);
        return {{ x, y, w, h }};
      }}

      function scrProps(cue) {{
        const s = cue[1];
        let R = APP, T = PARK_T, op = 0;
        if (s === "screen") {{ R = focusRect(cue[2], cue[3], cue[4]); T = SCR_T; op = 1; }}
        if (s === "phone") {{ R = PHONE_R; T = PHONE_T; op = 1; }}
        const sc = T.w / R.w;
        return {{
          move: {{ x: T.x - R.x * sc, y: T.y - R.y * sc, scale: sc, opacity: op }},
          clip: `inset(${{R.y}}px ${{1920 - R.x - R.w}}px ${{1080 - R.y - R.h}}px ${{R.x}}px round ${{T.rad / sc}}px)`,
        }};
      }}

      const tl = gsap.timeline({{ paused: true }});
      const first = LAYOUT[0];
      tl.set("#camMove", camProps(first[1]).move, 0);
      tl.set("#camClip", {{ clipPath: camProps(first[1]).clip }}, 0);
      tl.set("#scrMove", scrProps(first).move, 0);
      tl.set("#scrClip", {{ clipPath: scrProps(first).clip }}, 0);
      tl.set("#bezel", {{ scale: 0.96 }}, 0);
      tl.set("#camPunch", {{ scale: 1 }}, 0);

      for (let i = 1; i < LAYOUT.length; i++) {{
        const a = LAYOUT[i - 1], b = LAYOUT[i], t = b[0];
        const stateChange = a[1] !== b[1];
        const dur = stateChange ? 0.7 : 0.8;
        const ease = stateChange ? "power3.inOut" : "power2.inOut";
        const ca = camProps(a[1]), cb = camProps(b[1]);
        const sa = scrProps(a), sb = scrProps(b);
        if (stateChange) {{
          tl.fromTo("#camMove", ca.move, {{ ...cb.move, duration: dur, ease, immediateRender: false }}, t);
          tl.fromTo("#camClip", {{ clipPath: ca.clip }}, {{ clipPath: cb.clip, duration: dur, ease, immediateRender: false }}, t);
        }}
        const {{ opacity: oa, ...ma }} = sa.move, {{ opacity: ob, ...mb }} = sb.move;
        tl.fromTo("#scrMove", ma, {{ ...mb, duration: dur, ease, immediateRender: false }}, t);
        // Opaque within 0.2 s on the way in, so the card never shows through.
        if (oa !== ob)
          tl.fromTo("#scrMove", {{ opacity: oa }}, {{ opacity: ob, duration: 0.2, ease: "none", immediateRender: false }}, ob ? t : t + dur - 0.2);
        tl.fromTo("#scrClip", {{ clipPath: sa.clip }}, {{ clipPath: sb.clip, duration: dur, ease, immediateRender: false }}, t);
        if (a[1] !== "phone" && b[1] === "phone")
          tl.fromTo("#bezel", {{ opacity: 0, scale: 0.96 }}, {{ opacity: 1, scale: 1, duration: 0.45, ease: "power3.out", immediateRender: false }}, t + 0.35);
        if (a[1] === "phone" && b[1] !== "phone")
          tl.fromTo("#bezel", {{ opacity: 1, scale: 1 }}, {{ opacity: 0, scale: 0.96, duration: 0.25, ease: "power2.in", immediateRender: false }}, t);
      }}

      // Alternate a 1.0 / 1.12 framing on each jump cut (a hard set: a cut, not a move).
      CUTS.forEach((t, i) => tl.set("#camPunch", {{ scale: i % 2 === 0 ? 1.12 : 1 }}, t));

      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
"""


def main():
    starts = [out(it["start"]) for it in ITEMS]
    close_start = out(CLOSE_AT)
    chapters = []
    for i, it in enumerate(ITEMS):
        s = starts[i]
        e = starts[i + 1] if i + 1 < len(ITEMS) else close_start
        chapters.append((it, s, e - s))
    cues = layout_track(starts)
    CUES.extend(cues)
    cuts = jump_cuts(cues)
    os.makedirs("compositions", exist_ok=True)
    open("compositions/intro.html", "w").write(intro(starts[0]))
    for it, s, d in chapters:
        open(f"compositions/p{it['n']}.html", "w").write(chapter(it, s, d))
    open("compositions/movil.html", "w").write(movil(out(MOVIL["end"]) - out(MOVIL["start"])))
    open("compositions/cierre.html", "w").write(cierre(close_start, D - close_start))
    movil_span = (out(MOVIL["start"]), out(MOVIL["end"]))
    open("index.html", "w").write(root(chapters, cues, cuts, starts[0], close_start, movil_span))
    print(f"film {D}s · {len(chapters)} chapters · {len(cues)} layout cues · {len(cuts)} punch cuts")
    for it, s, d in chapters:
        print(f"  p{it['n']}: {s:7.2f}s  ({d:6.2f}s)")
    print(f"  cierre: {close_start:.2f}s")


main()
