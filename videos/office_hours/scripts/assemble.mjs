import fs from "fs";
import path from "path";

const WORK = path.resolve(import.meta.dirname, "..");
const D = 35.233;
const q = (t) => Math.round(t * 30) / 30;

// TikTok / Reels safe zone (1080×1920)
// top tabs ~160 · right buttons ~120 · bottom chrome+captions UI ~340
const SAFE = { top: 160, right: 120, bottom: 380, left: 48 };

const CHART = [
  [0, 24, false],
  [1, 35, false],
  [2, 14, false],
  [3, 16, false],
  [4, 11, false],
  [5, 16, false],
  [6, 70, false],
  [7, 92, false],
  [8, 149, false],
  [9, 136, true],
  [10, 136, true],
  [11, 92, true],
  [12, 75, true],
  [13, 65, true],
  [14, 98, true],
  [15, 65, true],
  [16, 119, true],
  [17, 91, true],
  [18, 208, false],
  [19, 141, false],
  [20, 83, false],
  [21, 109, false],
  [22, 115, false],
  [23, 49, false],
];
const MAX = 250;

function chartRows(mode, range) {
  const [from, to] = range || [0, 23];
  return CHART.filter(([h]) => h >= from && h <= to)
    .map(([h, v, habil]) => {
      const w = Math.round((v / MAX) * 1000) / 10;
      let dim = false;
      if (mode === "habil") dim = !habil;
      if (mode === "night") dim = !(h <= 5 || h >= 21);
      if (mode === "peak") dim = h !== 18 && h !== 8;
      const cls = [
        "bar-row",
        habil ? "habil" : "fuera",
        dim ? "dim" : "",
        h === 18 || h === 8 ? "peak" : "",
      ]
        .filter(Boolean)
        .join(" ");
      return `<div class="${cls}" data-h="${h}" style="--w:${w}%">
      <span class="hlabel">${h}h</span>
      <div class="track"><div class="fill" id="bar-${mode}-${h}"></div></div>
      <span class="vlabel">${v}</span>
    </div>`;
    })
    .join("\n");
}

function chartBlock(mode) {
  return `<div class="chart-grid" id="chart-${mode}">
    <div class="chart-col">
      <div class="col-label">0h – 11h</div>
      <div class="chart">${chartRows(mode, [0, 11])}</div>
    </div>
    <div class="chart-col">
      <div class="col-label">12h – 23h</div>
      <div class="chart">${chartRows(mode, [12, 23])}</div>
    </div>
  </div>`;
}

const cues = JSON.parse(
  fs.readFileSync(path.join(WORK, "caption-cues.json"), "utf8"),
);
const wordTranscript = JSON.parse(
  fs.readFileSync(path.join(WORK, "transcript.json"), "utf8"),
);

/** Build WORDS + GROUPS from existing SRT cues + word-level transcript (no re-transcribe). */
function buildCaptionData() {
  const WORDS = wordTranscript.map((w) => ({
    text: w.text,
    start: +w.start.toFixed(3),
    end: +w.end.toFixed(3),
  }));
  const used = new Set();
  const GROUPS = [];
  for (const cue of cues) {
    const idxs = [];
    WORDS.forEach((w, i) => {
      if (used.has(i)) return;
      const mid = (w.start + w.end) / 2;
      if (mid >= cue.start - 0.02 && mid <= cue.end + 0.02) idxs.push(i);
    });
    if (!idxs.length) {
      // Fallback: words whose start falls in cue window
      WORDS.forEach((w, i) => {
        if (used.has(i)) return;
        if (w.start >= cue.start - 0.02 && w.start < cue.end) idxs.push(i);
      });
    }
    if (!idxs.length) continue;
    idxs.forEach((i) => used.add(i));
    GROUPS.push({
      wordStart: idxs[0],
      wordEnd: idxs[idxs.length - 1],
      start: cue.start,
      end: cue.end,
    });
  }
  return { WORDS, GROUPS };
}

function writeCaptionGradientFill() {
  const { WORDS, GROUPS } = buildCaptionData();
  const maxW = 1080 - SAFE.left - SAFE.right;
  // nicobytes voltage: cyan → emerald, inactive paper (frame.md)
  const GRAD =
    "linear-gradient(90deg, #06b6d4 0%, #10b981 18%, #06b6d4 36%, #fafafa 50%, #fafafa 100%)";
  const html = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <style>
      @font-face { font-family: "Inter"; src: url("fonts/Inter-700-latin.woff2") format("woff2"); font-weight: 700; font-display: block; }
      @font-face { font-family: "Inter"; src: url("fonts/Inter-400-latin.woff2") format("woff2"); font-weight: 400; font-display: block; }
      *, *::before, *::after { box-sizing: border-box; }
      html, body {
        width: 1080px; height: 1920px; margin: 0; overflow: hidden; background: transparent;
      }
      #gradient-fill {
        pointer-events: none; position: relative;
        width: 1080px; height: 1920px; overflow: hidden; background: transparent;
      }
      #gr-container {
        position: absolute; inset: 0; z-index: 50; pointer-events: none;
      }
      .gr-group {
        position: absolute;
        left: 50%;
        bottom: ${SAFE.bottom}px;
        transform: translateX(-50%);
        width: max-content;
        max-width: ${maxW}px;
        display: flex; flex-wrap: wrap;
        align-items: flex-end; justify-content: center;
        gap: 8px 12px;
        padding: 18px 28px;
        border-radius: 18px;
        background: #18181b;
        box-shadow: 0 8px 28px rgba(0,0,0,0.45);
        opacity: 0; visibility: hidden;
      }
      .gr-word {
        font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        font-weight: 700;
        font-size: 44px;
        display: inline-block;
        letter-spacing: -0.02em;
        line-height: 1.2;
        padding-bottom: 0.02em;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        background-size: 350% 100%;
        background-position: 100% 0;
        opacity: 0;
      }
    </style>
  </head>
  <body>
    <div
      id="gradient-fill"
      data-composition-id="caption-gradient-fill"
      data-timeline-locked
      data-start="0"
      data-duration="${D}"
      data-fps="30"
      data-width="1080"
      data-height="1920"
    >
      <div id="gr-container"></div>
    </div>
    <script src="vendor/gsap.min.js"></script>
    <script>
      (function () {
        window.__timelines = window.__timelines || {};
        var WORDS = ${JSON.stringify(WORDS)};
        var GROUPS = ${JSON.stringify(GROUPS)};
        var BRAND_GRAD = ${JSON.stringify(GRAD)};
        var MAX_W = ${maxW - 56};
        var BASE_SIZE = 42;

        var _fitCanvas = document.createElement("canvas");
        var _fitCtx = _fitCanvas.getContext("2d");
        function fitFontSize(text, baseFontSize, fontWeight, fontFamily, maxWidth) {
          var size = baseFontSize;
          var minSize = Math.floor(baseFontSize * 0.6);
          while (size > minSize) {
            _fitCtx.font = fontWeight + " " + size + "px " + fontFamily;
            if (_fitCtx.measureText(text).width <= maxWidth) return size;
            size -= 2;
          }
          return minSize;
        }

        var container = document.getElementById("gr-container");
        var tl = gsap.timeline({ paused: true });

        GROUPS.forEach(function (g, gi) {
          var groupWords = WORDS.slice(g.wordStart, g.wordEnd + 1);
          var groupText = groupWords.map(function (w) { return w.text; }).join(" ");
          var fontSize = fitFontSize(groupText, BASE_SIZE, "700", "Inter, sans-serif", MAX_W);
          var grp = document.createElement("div");
          grp.className = "gr-group";
          grp.id = "gr-grp-" + gi;

          groupWords.forEach(function (w, i) {
            var wi = g.wordStart + i;
            var span = document.createElement("span");
            span.className = "gr-word";
            span.id = "gr-w-" + wi;
            span.textContent = w.text;
            span.style.fontSize = fontSize + "px";
            span.style.background = BRAND_GRAD;
            span.style.backgroundSize = "350% 100%";
            span.style.backgroundPosition = "100% 0";
            span.style.webkitBackgroundClip = "text";
            span.style.backgroundClip = "text";
            grp.appendChild(span);
          });

          container.appendChild(grp);

          tl.set(grp, { visibility: "visible", opacity: 1 }, g.start);

          var lastWordEnd = groupWords[groupWords.length - 1].end;
          var nextStart = gi < GROUPS.length - 1 ? GROUPS[gi + 1].start : lastWordEnd + 0.45;
          var gap = nextStart - lastWordEnd;
          var fadeDur = Math.min(0.22, Math.max(0.08, gap * 0.75));
          var fadeStart = nextStart - fadeDur;
          var groupEnd = nextStart;

          groupWords.forEach(function (w, i) {
            var wi = g.wordStart + i;
            var el = document.getElementById("gr-w-" + wi);
            var dur = Math.max(0.08, w.end - w.start);

            // Keep upcoming words hidden at full size — avoids tiny unreadables
            tl.set(el, { opacity: 0, scale: 1, y: 18, backgroundPosition: "100% 0" }, g.start);
            tl.fromTo(
              el,
              { opacity: 0, y: 18, scale: 0.92 },
              { opacity: 1, y: 0, scale: 1.04, duration: 0.32, ease: "elastic.out(1, 0.6)" },
              w.start
            );
            tl.fromTo(
              el,
              { backgroundPosition: "45% 0" },
              { backgroundPosition: "0% 0", duration: dur, ease: "none" },
              w.start
            );
            tl.set(el, { backgroundPosition: "100% 0" }, w.end);
            tl.to(el, { scale: 1, duration: 0.12, ease: "power2.out" }, w.end);
          });

          tl.to(grp, { opacity: 0, duration: fadeDur }, fadeStart);
          tl.set(grp, { visibility: "hidden" }, groupEnd);
        });

        window.__timelines["caption-gradient-fill"] = tl;
      })();
    </script>
  </body>
</html>
`;
  const outDir = path.join(WORK, "compositions");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "caption-gradient-fill.html"), html);
  return { words: WORDS.length, groups: GROUPS.length };
}

function chartCss(prefix) {
  return `
    .card[data-card-id="${prefix}"] .chart-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 18px 22px;
      flex: 1; min-height: 0; align-content: stretch;
    }
    .card[data-card-id="${prefix}"] .chart-col {
      display: flex; flex-direction: column; min-height: 0; gap: 8px;
    }
    .card[data-card-id="${prefix}"] .col-label {
      font-size: 18px; font-weight: 700; letter-spacing: 0.04em;
      text-transform: uppercase; color: var(--muted);
    }
    .card[data-card-id="${prefix}"] .chart {
      display: flex; flex-direction: column; gap: 8px;
      width: 100%; flex: 1; min-height: 0; justify-content: space-between;
    }
    .card[data-card-id="${prefix}"] .bar-row {
      display: grid; grid-template-columns: 48px 1fr 58px;
      align-items: center; gap: 8px; flex: 1; min-height: 48px;
    }
    .card[data-card-id="${prefix}"] .bar-row.dim .fill { opacity: 0.35; }
    .card[data-card-id="${prefix}"] .bar-row.dim .hlabel,
    .card[data-card-id="${prefix}"] .bar-row.dim .vlabel { opacity: 1; color: #52525b; }
    .card[data-card-id="${prefix}"] .bar-row.peak:not(.dim) {
      background: rgba(14,116,144,0.08); border-radius: 12px; margin: 0 -6px; padding: 0 6px;
    }
    .card[data-card-id="${prefix}"] .bar-row.peak:not(.dim) .fill {
      box-shadow: 0 0 0 2px rgba(14,116,144,0.4);
    }
    .card[data-card-id="${prefix}"] .bar-row.peak:not(.dim) .hlabel,
    .card[data-card-id="${prefix}"] .bar-row.peak:not(.dim) .vlabel {
      font-weight: 800; color: var(--cyan); font-size: 22px;
    }
    .card[data-card-id="${prefix}"] .hlabel,
    .card[data-card-id="${prefix}"] .vlabel {
      font-size: 20px; font-weight: 700; color: #3f3f46;
      font-variant-numeric: tabular-nums;
    }
    .card[data-card-id="${prefix}"] .vlabel { text-align: right; color: var(--ink); }
    .card[data-card-id="${prefix}"] .track {
      height: 22px; background: rgba(24,24,27,0.08); border-radius: 999px; overflow: hidden;
    }
    .card[data-card-id="${prefix}"] .fill {
      height: 100%; width: 0%; border-radius: 999px;
      background: var(--cyan);
    }
    .card[data-card-id="${prefix}"] .bar-row.habil .fill { background: var(--emerald); }
  `;
}

const safePad = `padding: ${SAFE.top}px ${SAFE.right}px ${SAFE.bottom}px ${SAFE.left}px;`;

const cards = {};

cards["card-01"] = `
<div class="card" data-card-id="card-01">
  <style>
    .card[data-card-id="card-01"] .root {
      --ink:#fafafa; --muted:#d4d4d8; --cyan:#67e8f9; --emerald:#34d399;
      width:100%; height:100%; box-sizing:border-box; ${safePad}
      display:flex; flex-direction:column; justify-content:center;
      background: #18181b;
      color: var(--ink); font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    }
    .card[data-card-id="card-01"] .kicker {
      font-size: 24px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--cyan); margin-bottom: 20px; opacity:0;
    }
    .card[data-card-id="card-01"] .title {
      font-size: 68px; font-weight: 700; letter-spacing: -0.03em; line-height: 1.05;
      margin: 0 0 20px; opacity:0; max-width: 900px;
    }
    .card[data-card-id="card-01"] .title em { font-style: normal; color: var(--emerald); }
    .card[data-card-id="card-01"] .detail {
      font-size: 30px; font-weight: 500; color: var(--muted); opacity:0;
    }
    .card[data-card-id="card-01"] .rule {
      width:0; height:6px; background: linear-gradient(90deg, var(--cyan), var(--emerald));
      border-radius: 999px; margin: 24px 0 20px;
    }
  </style>
  <div class="root">
    <div class="kicker" id="card-01-kicker" data-anim="fade-in" data-anim-at="0.2" data-anim-duration="0.35">Office hours</div>
    <h1 class="title" id="card-01-title" data-anim="fade-in" data-anim-at="0.45" data-anim-duration="0.45">Agentes que viven en <em>WhatsApp</em></h1>
    <div class="rule" id="card-01-rule" data-anim="grow-x" data-anim-at="0.85" data-anim-duration="0.4" data-anim-target-w="220"></div>
    <div class="detail" id="card-01-detail" data-anim="fade-in" data-anim-at="1.1" data-anim-duration="0.35">Para diferentes empresas</div>
  </div>
</div>`;

cards["card-02"] = `
<div class="card" data-card-id="card-02">
  <style>
    .card[data-card-id="card-02"] .root {
      --ink:#18181b; --muted:#71717a; --cyan:#0e7490; --emerald:#047857; --paper:#fafafa;
      width:100%; height:100%; box-sizing:border-box; ${safePad}
      display:flex; flex-direction:column; background: #fafafa;
      font-family: Inter, ui-sans-serif, system-ui, sans-serif; color: var(--ink);
    }
    .card[data-card-id="card-02"] .panel {
      flex: 1; display:flex; flex-direction:column; min-height:0; opacity:0;
    }
    .card[data-card-id="card-02"] .kicker {
      font-size: 22px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
      color: var(--cyan); margin-bottom: 6px;
    }
    .card[data-card-id="card-02"] .title {
      font-size: 44px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.05; margin: 0 0 10px;
    }
    .card[data-card-id="card-02"] .legend {
      display:flex; gap: 22px; margin-bottom: 10px; font-size: 22px; font-weight: 700; color: var(--muted);
    }
    .card[data-card-id="card-02"] .legend i {
      display:inline-block; width:12px; height:12px; border-radius:50%; margin-right:8px;
    }
    .card[data-card-id="card-02"] .legend .g { background: var(--emerald); }
    .card[data-card-id="card-02"] .legend .c { background: var(--cyan); }
    .card[data-card-id="card-02"] .vital {
      margin-top: 18px; font-size: 30px; font-weight: 700; color: var(--ink); opacity:0;
    }
    .card[data-card-id="card-02"] .vital span { color: var(--cyan); }
    ${chartCss("card-02")}
  </style>
  <div class="root">
    <div class="panel" id="card-02-panel">
      <div class="kicker" id="card-02-kicker">La estadística</div>
      <h2 class="title" id="card-02-title">Mensajes por hora del día</h2>
      <div class="legend" id="card-02-legend">
        <span><i class="g"></i>Horario hábil</span>
        <span><i class="c"></i>Fuera de horario</span>
      </div>
      <div class="vital" id="card-02-vital" style="opacity:0;margin:0 0 8px;font-size:28px;font-weight:800">Esto es lo <span>vital</span> · <span>208 @ 18h</span></div>
      ${chartBlock("all")}
    </div>
  </div>
</div>`;

cards["card-03"] = `
<div class="card" data-card-id="card-03">
  <style>
    .card[data-card-id="card-03"] .root {
      --ink:#18181b; --muted:#71717a; --cyan:#0e7490; --emerald:#047857; --paper:#fafafa;
      width:100%; height:100%; box-sizing:border-box; ${safePad}
      display:flex; flex-direction:column; gap: 22px; background: #fafafa;
      font-family: Inter, ui-sans-serif, system-ui, sans-serif; color: var(--ink);
    }
    .card[data-card-id="card-03"] .panel { opacity:0; }
    .card[data-card-id="card-03"] .stat {
      display:flex; align-items:flex-end; gap: 16px; margin-bottom: 12px;
    }
    .card[data-card-id="card-03"] .num {
      font-size: 110px; font-weight: 700; letter-spacing: -0.04em; line-height: 0.9; color: var(--cyan);
      opacity:0;
    }
    .card[data-card-id="card-03"] .num-meta {
      font-size: 26px; font-weight: 600; color: var(--muted); padding-bottom: 12px; opacity:0;
    }
    .card[data-card-id="card-03"] .headline {
      font-size: 38px; font-weight: 700; letter-spacing: -0.025em; line-height: 1.15; margin: 0;
      opacity:0;
    }
    .card[data-card-id="card-03"] .headline em { font-style:normal; color: var(--emerald); }
    ${chartCss("card-03")}
    .card[data-card-id="card-03"] .chart-wrap {
      flex:1; min-height:0; opacity:0; display:flex; flex-direction:column;
    }
  </style>
  <div class="root">
    <div class="panel" id="card-03-top">
      <div class="stat">
        <div class="num" id="card-03-num">208</div>
        <div class="num-meta" id="card-03-meta">mensajes @ 18h<br/>pico fuera de horario</div>
      </div>
      <h2 class="headline" id="card-03-headline">También responde cuando <em>nadie te atiende</em></h2>
    </div>
    <div class="chart-wrap" id="card-03-chartwrap">
      ${chartBlock("peak")}
    </div>
  </div>
</div>`;

cards["card-04"] = `
<div class="card" data-card-id="card-04">
  <style>
    .card[data-card-id="card-04"] .root {
      --ink:#fafafa; --muted:#d4d4d8; --cyan:#67e8f9; --emerald:#34d399; --slate:#27272a;
      width:100%; height:100%; box-sizing:border-box; ${safePad}
      display:flex; flex-direction:column; justify-content:center; gap: 22px;
      background: #18181b;
      font-family: Inter, ui-sans-serif, system-ui, sans-serif; color: var(--ink);
    }
    .card[data-card-id="card-04"] .kicker {
      font-size: 22px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--cyan); opacity:0;
    }
    .card[data-card-id="card-04"] .title {
      font-size: 56px; font-weight: 700; letter-spacing: -0.03em; line-height: 1.05; margin:0; opacity:0;
    }
    .card[data-card-id="card-04"] .steps { display:flex; flex-direction:column; gap: 14px; margin-top: 10px; }
    .card[data-card-id="card-04"] .step {
      display:flex; align-items:center; gap: 16px; padding: 20px 22px; border-radius: 18px;
      background: #27272a; border: 1px solid rgba(103,232,249,0.28); opacity:0;
      font-size: 30px; font-weight: 600;
    }
    .card[data-card-id="card-04"] .step b {
      width: 40px; height: 40px; border-radius: 999px; display:grid; place-items:center;
      background: linear-gradient(135deg, var(--cyan), var(--emerald)); color:#18181b; font-size: 18px;
      flex-shrink: 0;
    }
  </style>
  <div class="root">
    <div class="kicker" id="card-04-kicker" data-anim="fade-in" data-anim-at="0.25" data-anim-duration="0.35">Madrugada / noche</div>
    <h2 class="title" id="card-04-title" data-anim="fade-in" data-anim-at="0.5" data-anim-duration="0.4">Toma la base de conocimiento</h2>
    <div class="steps">
      <div class="step" id="card-04-s1" data-anim="fade-in" data-anim-at="1.0" data-anim-duration="0.35"><b>1</b> Responde</div>
      <div class="step" id="card-04-s2" data-anim="fade-in" data-anim-at="1.45" data-anim-duration="0.35"><b>2</b> Hace atención</div>
      <div class="step" id="card-04-s3" data-anim="fade-in" data-anim-at="1.9" data-anim-duration="0.35"><b>3</b> Deja listo para ventas</div>
    </div>
  </div>
</div>`;

cards["card-05"] = `
<div class="card" data-card-id="card-05">
  <style>
    .card[data-card-id="card-05"] .root {
      --ink:#fafafa; --muted:#d4d4d8; --cyan:#67e8f9; --emerald:#34d399;
      width:100%; height:100%; box-sizing:border-box; ${safePad}
      display:flex; flex-direction:column; justify-content:center; align-items:stretch; gap: 20px;
      background: #18181b;
      font-family: Inter, ui-sans-serif, system-ui, sans-serif; color: var(--ink); text-align:center;
    }
    .card[data-card-id="card-05"] .kicker {
      font-size: 22px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--cyan); opacity:0;
    }
    .card[data-card-id="card-05"] .flow {
      display:flex; justify-content:center; align-items:center; gap: 12px; flex-wrap:wrap; opacity:0;
    }
    .card[data-card-id="card-05"] .chip {
      padding: 16px 24px; border-radius: 999px; font-size: 28px; font-weight: 700;
      background: #27272a; border: 1px solid rgba(255,255,255,0.08);
    }
    .card[data-card-id="card-05"] .chip.ok {
      background: linear-gradient(135deg, var(--cyan), var(--emerald)); color:#18181b; border:none;
    }
    .card[data-card-id="card-05"] .arrow { font-size: 28px; color: var(--muted); }
    .card[data-card-id="card-05"] .title {
      font-size: 58px; font-weight: 700; letter-spacing: -0.03em; line-height: 1.05; margin: 12px 0 0; opacity:0;
    }
    .card[data-card-id="card-05"] .title em { font-style:normal; color: var(--emerald); }
  </style>
  <div class="root">
    <div class="kicker" id="card-05-kicker" data-anim="fade-in" data-anim-at="0.2" data-anim-duration="0.3">Cierre</div>
    <div class="flow" id="card-05-flow" data-anim="fade-in" data-anim-at="0.45" data-anim-duration="0.4">
      <span class="chip">Agente</span><span class="arrow">→</span>
      <span class="chip">Ventas</span><span class="arrow">→</span>
      <span class="chip ok">Cierre</span>
    </div>
    <h2 class="title" id="card-05-title" data-anim="fade-in" data-anim-at="0.85" data-anim-duration="0.4">Y <em>cierra la venta</em></h2>
  </div>
</div>`;

const timing = [
  // Full-screen A/B: video bridges between full-screen cards (no PIP)
  { id: "card-01", start: 1.4, end: 5.6 },
  { id: "card-02", start: 6.6, end: 9.2 },
  { id: "card-03", start: 10.2, end: 18.0 },
  { id: "card-04", start: 19.2, end: 28.8 },
  { id: "card-05", start: 30.0, end: 34.2 },
];

function parseAnims(cardHtml, cardId, startSec) {
  const lines = [];
  const re =
    /id="([^"]+)"[^>]*\bdata-anim="([^"]+)"[^>]*\bdata-anim-at="([^"]+)"[^>]*\bdata-anim-duration="([^"]+)"/g;
  let m;
  while ((m = re.exec(cardHtml)) !== null) {
    const [, id, kind, atS, durS] = m;
    const at = parseFloat(atS);
    const dur = parseFloat(durS);
    const T = q(startSec + at);
    const sel = `.card[data-card-id="${cardId}"] #${id}`;
    if (kind === "fade-in") {
      lines.push(
        `tl.fromTo(${JSON.stringify(sel)}, { opacity: 0 }, { opacity: 1, duration: ${dur}, ease: "power2.out" }, ${T});`,
      );
    } else if (kind === "grow-x") {
      const twM = cardHtml.match(
        new RegExp(`id="${id}"[^>]*data-anim-target-w="([^"]+)"`),
      );
      const tw = twM ? parseFloat(twM[1]) : 200;
      lines.push(
        `tl.fromTo(${JSON.stringify(sel)}, { width: 0 }, { width: ${tw}, duration: ${dur}, ease: "power2.out" }, ${T});`,
      );
    }
  }
  return lines;
}

let hosts = "";
let gsapBlocks = `
          // Talking-head always full-bleed; opaque cards take 100% then release back to video
          gsap.set('#video-wrap', { x: 0, y: 0, scale: 1, opacity: 1, zIndex: 1 });
`;

for (const t of timing) {
  const html = cards[t.id];
  fs.writeFileSync(path.join(WORK, "cards", `${t.id}.html`), html);
  hosts += `
      <div class="card-host clip" data-card-id="${t.id}" id="host-${t.id}"
        data-start="${t.start}" data-duration="${+(t.end - t.start).toFixed(3)}" data-track-index="3"
        style="left:0;top:0;width:1080px;height:1920px;opacity:1;">
        ${html}
      </div>`;

  const enter = 0.35;
  const exit = 0.3;
  const exitAt = t.end - exit;
  const animLines = parseAnims(html, t.id, t.start)
    .map((l) => "          " + l)
    .join("\n");

  gsapBlocks += `
          // ── ${t.id} [${t.start} → ${t.end}] FULL card over FULL video ──
          gsap.set('.card-host[data-card-id="${t.id}"] .card', { opacity: 0 });
          tl.to('#video-wrap', { opacity: 0, duration: ${enter}, ease: 'power2.inOut' }, ${q(t.start)});
          tl.fromTo('.card-host[data-card-id="${t.id}"] .card', { opacity: 0, scale: 1.02 }, { opacity: 1, scale: 1, duration: ${enter}, ease: "power2.out" }, ${q(t.start)});
${animLines}
`;

  if (t.id === "card-02") {
    gsapBlocks += `
          tl.fromTo('#card-02-panel', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, ${q(t.start + 0.12)});
          document.querySelectorAll('#chart-all .fill').forEach((el, i) => {
            const row = el.closest('.bar-row');
            const w = getComputedStyle(row).getPropertyValue('--w').trim();
            tl.fromTo(el, { width: '0%' }, { width: w, duration: 0.32, ease: "power2.out" }, ${q(t.start + 0.3)} + i * 0.018);
          });
          tl.fromTo('#card-02-vital', { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" }, ${q(t.start + 0.5)});
`;
  }
  if (t.id === "card-03") {
    gsapBlocks += `
          tl.fromTo('#card-03-top', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, ${q(t.start + 0.08)});
          tl.fromTo('#card-03-num', { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.3)" }, ${q(t.start + 0.2)});
          tl.fromTo('#card-03-meta', { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" }, ${q(t.start + 0.4)});
          tl.fromTo('#card-03-headline', { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" }, ${q(t.start + 0.6)});
          tl.fromTo('#card-03-chartwrap', { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" }, ${q(t.start + 0.9)});
          document.querySelectorAll('#chart-peak .fill').forEach((el, i) => {
            const row = el.closest('.bar-row');
            const w = getComputedStyle(row).getPropertyValue('--w').trim();
            tl.fromTo(el, { width: '0%' }, { width: w, duration: 0.28, ease: "power2.out" }, ${q(t.start + 1.05)} + i * 0.014);
          });
`;
  }

  gsapBlocks += `
          tl.to('.card-host[data-card-id="${t.id}"] .card', { opacity: 0, duration: ${exit}, ease: "power2.in" }, ${q(exitAt)});
          tl.to('#video-wrap', { opacity: 1, duration: ${exit}, ease: 'power2.inOut' }, ${q(exitAt)});
          tl.set('.card-host[data-card-id="${t.id}"] .card', { opacity: 0 }, ${q(t.end)});
`;
}

const captionMeta = writeCaptionGradientFill();

const index = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <style>
      @font-face { font-family: "Inter"; src: url("fonts/Inter-400-latin.woff2") format("woff2"); font-weight: 400; font-display: block; }
      @font-face { font-family: "Inter"; src: url("fonts/Inter-700-latin.woff2") format("woff2"); font-weight: 700; font-display: block; }
      * { box-sizing: border-box; }
      html, body { margin:0; padding:0; width:100%; height:100%; overflow:hidden; background:#18181b; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
      #stage { position:relative; width:100%; height:100%; overflow:hidden; background:#18181b; }
      /* Talking-head: full-bleed; cards take 100% then release back to video */
      .video-wrapper {
        position:absolute; left:0; top:0; width:1080px; height:1920px;
        overflow:hidden; z-index:1; opacity:1; pointer-events:none;
        border-radius: 0;
      }
      .video-wrapper video { width:100%; height:100%; object-fit:cover; display:block; }
      .card-host { position:absolute; pointer-events:none; overflow:hidden; z-index:3; }
      .card-host .card { position:relative; width:100%; height:100%; overflow:hidden; }
      .clip { position:absolute; }
      /* Caption block sits above all content */
      .caption-host {
        position:absolute; left:0; top:0; width:1080px; height:1920px;
        z-index:50; pointer-events:none; overflow:hidden;
      }
    </style>
  </head>
  <body>
    <div id="stage" data-composition-id="office-hours" data-start="0" data-duration="${D}" data-fps="30" data-width="1080" data-height="1920">
      <div class="video-wrapper" id="video-wrap">
        <video id="bg-video" class="clip" src="input-video.mp4" muted playsinline data-start="0" data-duration="${D}" data-track-index="1"></video>
      </div>
      <audio id="source-audio" src="input-video.mp4" data-start="0" data-duration="${D}" data-track-index="10" data-volume="1"></audio>
${hosts}
      <div
        id="caption-gradient-fill-host"
        class="caption-host clip"
        data-composition-id="caption-gradient-fill"
        data-composition-src="compositions/caption-gradient-fill.html"
        data-start="0"
        data-duration="${D}"
        data-width="1080"
        data-height="1920"
        data-track-index="50"
      ></div>
      <script src="vendor/gsap.min.js"></script>
      <script>
        (function () {
          const tl = gsap.timeline({ paused: true });
${gsapBlocks}
          window.__timelines = window.__timelines || {};
          window.__timelines["office-hours"] = tl;
        })();
      </script>
    </div>
  </body>
</html>
`;

fs.writeFileSync(path.join(WORK, "index.html"), index);
console.log(
  "Wrote video↔card + caption-gradient-fill",
  SAFE,
  "cards",
  timing.length,
  "captions",
  captionMeta,
  timing.map((t) => `${t.id}:${t.start}-${t.end}`).join(" | "),
);
