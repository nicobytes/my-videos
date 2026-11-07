import fs from "fs";
import path from "path";

const WORK = path.resolve(import.meta.dirname, "..");
const PUBLIC = WORK;
const D = 57.9;

function parseTs(t) {
  const [h, m, rest] = t.split(":");
  const [s, ms] = rest.split(",");
  return +h * 3600 + +m * 60 + +s + +ms / 1000;
}

function wordsFromSrt(srtPath) {
  const srt = fs.readFileSync(srtPath, "utf8");
  const words = [];
  for (const block of srt.trim().split(/\n\s*\n/)) {
    const lines = block
      .split(/\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length < 2) continue;
    const m = lines[1].match(
      /(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/,
    );
    if (!m) continue;
    let text = lines
      .slice(2)
      .join(" ")
      .replace(/\bPNP\b/gi, "pnpm")
      .replace(/\bROS\b/gi, "Rust")
      .replace(/\bPersue\b/g, "Version")
      .replace(/\bnote\b/gi, "Node");
    const toks = text.split(/\s+/).filter(Boolean);
    const start = parseTs(m[1]);
    const end = Math.min(parseTs(m[2]), D);
    const dur = Math.max(0.01, end - start);
    toks.forEach((tok, i) => {
      const a = start + (dur * i) / toks.length;
      const b = start + (dur * (i + 1)) / toks.length;
      words.push({
        id: `w${words.length}`,
        text: tok,
        start: +a.toFixed(3),
        end: +Math.min(b, D).toFixed(3),
      });
    });
  }
  return words;
}

/** Group into short caption lines (~3–5 words, or break on pause ≥0.35s). */
function groupWords(words) {
  const groups = [];
  let i = 0;
  while (i < words.length) {
    const startIdx = i;
    let endIdx = i;
    let count = 1;
    i++;
    while (i < words.length && count < 5) {
      const gap = words[i].start - words[i - 1].end;
      if (gap >= 0.35 && count >= 2) break;
      // Prefer break after punctuation
      if (/[.,;:!?]$/.test(words[i - 1].text) && count >= 2) break;
      endIdx = i;
      count++;
      i++;
    }
    if (endIdx < startIdx) endIdx = startIdx;
    groups.push({
      wordStart: startIdx,
      wordEnd: endIdx,
      start: words[startIdx].start,
      end: words[endIdx].end,
    });
  }
  return groups;
}

const words = wordsFromSrt(path.join(WORK, "captions.srt"));
const groups = groupWords(words);

fs.writeFileSync(
  path.join(WORK, "transcript.json"),
  JSON.stringify(words, null, 2),
);
fs.writeFileSync(
  path.join(WORK, "caption-groups.json"),
  JSON.stringify({ words, groups }, null, 2),
);

const wordsLit = JSON.stringify(words.map(({ text, start, end }) => ({ text, start, end })), null, 2);
const groupsLit = JSON.stringify(groups, null, 2);

const html = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Gradient Fill Captions</title>
    <style>
      @font-face {
        font-family: "Inter";
        src: url("fonts/Inter-700-latin.woff2") format("woff2");
        font-weight: 700;
        font-display: block;
      }
      @font-face {
        font-family: "Inter";
        src: url("fonts/Inter-400-latin.woff2") format("woff2");
        font-weight: 400;
        font-display: block;
      }
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }
      html,
      body {
        width: 1080px;
        height: 1920px;
        margin: 0;
        overflow: hidden;
        background: transparent;
      }
      #gradient-fill {
        pointer-events: none;
        position: relative;
        width: 1080px;
        height: 1920px;
        overflow: hidden;
        background: transparent;
      }
      #gr-container {
        position: absolute;
        inset: 0;
        z-index: 10;
        pointer-events: none;
      }
      .gr-scrim {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 480px;
        z-index: 1;
        pointer-events: none;
        background: linear-gradient(
          180deg,
          rgba(0, 0, 0, 0) 0%,
          rgba(0, 0, 0, 0.45) 28%,
          rgba(0, 0, 0, 0.78) 62%,
          rgba(0, 0, 0, 0.9) 100%
        );
      }
      .gr-group {
        position: absolute;
        bottom: 140px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2;
        width: max-content;
        max-width: calc(100% - 64px);
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        justify-content: center;
        gap: 16px;
        padding: 22px 28px;
        opacity: 0;
        visibility: hidden;
        background: rgba(13, 17, 23, 0.92);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 18px;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
      }
      .gr-word {
        font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
        font-weight: 700;
        font-size: 64px;
        display: inline-block;
        letter-spacing: 0.02em;
        line-height: 1.15;
        padding-bottom: 0.05em;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        background-size: 350% 100%;
        background-position: 100% 0;
        transform-origin: center bottom;
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
      <div id="gr-container">
        <div class="gr-scrim" aria-hidden="true"></div>
      </div>
    </div>

    <script src="vendor/gsap.min.js"></script>
    <script>
      (function () {
        window.__timelines = window.__timelines || {};

        var _fitCanvas = document.createElement("canvas");
        var _fitCtx = _fitCanvas.getContext("2d");
        function fitFontSize(text, baseFontSize, fontWeight, fontFamily, maxWidth) {
          var size = baseFontSize;
          var minSize = Math.floor(baseFontSize * 0.45);
          while (size > minSize) {
            _fitCtx.font = fontWeight + " " + size + "px " + fontFamily;
            if (_fitCtx.measureText(text).width <= maxWidth) return size;
            size -= 2;
          }
          return minSize;
        }

        var WORDS = ${wordsLit};

        var GROUPS = ${groupsLit};

        // Design tokens — terminal / noir palette (pnpm12 composition)
        var TOKEN_GRAD =
          "linear-gradient(90deg, " +
          "#4ade80 0%, #fbbf24 14%, #60a5fa 28%, " +
          "#f472b6 42%, #4ade80 50%, " +
          "#e6edf3 50.5%, #e6edf3 100%)";

        var container = document.getElementById("gr-container");
        var tl = gsap.timeline({ paused: true });

        GROUPS.forEach(function (g, gi) {
          var groupWords = WORDS.slice(g.wordStart, g.wordEnd + 1);
          var groupText = groupWords
            .map(function (w) {
              return w.text;
            })
            .join(" ");
          var fontSize = fitFontSize(groupText, 64, "700", "'Inter', sans-serif", 1000);
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
            span.style.background = TOKEN_GRAD;
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
          var gap = Math.max(0.08, nextStart - lastWordEnd);
          var fadeDur = Math.min(0.22, gap * 0.75);
          var fadeStart = nextStart - fadeDur;
          var groupEnd = nextStart;

          groupWords.forEach(function (w, i) {
            var wi = g.wordStart + i;
            var el = document.getElementById("gr-w-" + wi);
            var dur = Math.max(0.08, w.end - w.start);

            tl.set(el, { backgroundPosition: "100% 0", scale: 0.55, opacity: 0 }, g.start);
            // Elastic bounce entrance on spoken cue
            tl.fromTo(
              el,
              { scale: 0.55, opacity: 0, y: 18 },
              { scale: 1, opacity: 1, y: 0, duration: Math.min(0.42, dur + 0.12), ease: "elastic.out(1, 0.55)" },
              w.start,
            );
            tl.fromTo(
              el,
              { backgroundPosition: "45% 0" },
              { backgroundPosition: "0% 0", duration: dur, ease: "none" },
              w.start,
            );
            tl.set(el, { backgroundPosition: "100% 0" }, w.end);
          });

          tl.to(grp, { opacity: 0, duration: fadeDur, ease: "power2.in" }, fadeStart);
          tl.set(grp, { visibility: "hidden" }, groupEnd);
        });

        window.__timelines["caption-gradient-fill"] = tl;
      })();
    </script>
  </body>
</html>
`;

fs.mkdirSync(path.join(PUBLIC, "compositions"), { recursive: true });
fs.writeFileSync(path.join(PUBLIC, "compositions", "caption-gradient-fill.html"), html);

console.log("words", words.length, "groups", groups.length);

// Patch host index.html: remove old caption rail, mount gradient-fill on top
let index = fs.readFileSync(path.join(PUBLIC, "index.html"), "utf8");

// Remove caption-rail CSS
index = index.replace(/\.caption-rail\s*\{[\s\S]*?\}\s*\.caption-cue\s*\{[\s\S]*?\}\s*\.caption-text\s*\{[\s\S]*?\}/m, "");

// Remove caption-rail DOM (with or without data-hf-id)
index = index.replace(
  /\s*<div[^>]*class="caption-rail"[^>]*>[\s\S]*?<\/div>\s*(?=<script)/,
  "\n",
);
// Fallback if caption-rail wraps differently
index = index.replace(
  /\s*<div[^>]*id="caption-rail"[^>]*>[\s\S]*?<\/div>\s*(?=<script)/,
  "\n",
);

const mount = `
      <div
        id="caption-gradient-fill-host"
        class="clip"
        data-composition-id="caption-gradient-fill"
        data-composition-src="compositions/caption-gradient-fill.html"
        data-start="0"
        data-duration="${D}"
        data-track-index="45"
        data-width="1080"
        data-height="1920"
        style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:45;pointer-events:none;"
      ></div>
`;

if (!index.includes("caption-gradient-fill-host")) {
  index = index.replace(/(<script src="vendor\/gsap\.min\.js"><\/script>)/, `${mount}\n      $1`);
  if (!index.includes("caption-gradient-fill-host")) {
    index = index.replace(/(<script>)/, `${mount}\n      $1`);
  }
}

fs.writeFileSync(path.join(PUBLIC, "index.html"), index);
console.log("patched index.html");
