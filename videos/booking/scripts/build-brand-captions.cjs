#!/usr/bin/env node
/**
 * Build FRAME.md caption-gradient-fill (same motion system as videos/react)
 * from theme.json lines + transcript.json word timings.
 */
const fs = require("fs");
const path = require("path");

const proj = path.resolve(__dirname, "..");
const theme = JSON.parse(fs.readFileSync(path.join(proj, "theme.json"), "utf8"));
const tr = JSON.parse(fs.readFileSync(path.join(proj, "transcript.json"), "utf8"));
const wordsIn = tr.words.filter((w) => w && "start" in w);
const norm = (s) => String(s).replace(/[^\p{L}\p{N}]+/gu, "").toLowerCase();

let wi = 0;
const WORDS = [];
const GROUPS = [];

for (const line of theme.lines) {
  const wordStart = WORDS.length;
  for (const tok of line) {
    while (wi < wordsIn.length && norm(wordsIn[wi].text) !== norm(tok)) wi++;
    if (wi >= wordsIn.length) throw new Error("token miss: " + tok);
    WORDS.push({
      text: tok,
      start: +wordsIn[wi].start.toFixed(3),
      end: +wordsIn[wi].end.toFixed(3),
    });
    wi++;
  }
  const wordEnd = WORDS.length - 1;
  GROUPS.push({
    wordStart,
    wordEnd,
    start: WORDS[wordStart].start,
    end: WORDS[wordEnd].end,
  });
}

const DUR = 106.02;

const captionHtml = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <style>
      @font-face { font-family: "Rubik"; src: url("fonts/Rubik-800-latin.woff2") format("woff2"); font-weight: 800; font-display: block; }
      @font-face { font-family: "Rubik"; src: url("fonts/Rubik-400-latin.woff2") format("woff2"); font-weight: 400; font-display: block; }
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
      /* FRAME.md lower-third + DESIGN.md tokens — Instagram Reels safe rail */
      .gr-group {
        position: absolute;
        left: 50%;
        bottom: 380px;
        transform: translateX(-50%);
        width: max-content;
        max-width: 920px;
        display: flex; flex-wrap: wrap;
        align-items: flex-end; justify-content: center;
        gap: 8px 12px;
        padding: 18px 28px;
        border-radius: 1.5rem;
        background: #0B1A17;
        box-shadow: 4px 4px 0 #152A26;
        opacity: 0; visibility: hidden;
      }
      .gr-word {
        font-family: Rubik, ui-sans-serif, system-ui, sans-serif;
        font-weight: 800;
        font-size: 52px;
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
    <div id="gradient-fill" data-composition-id="caption-gradient-fill" data-timeline-locked="" data-start="0" data-duration="${DUR}" data-fps="24" data-width="1080" data-height="1920">
      <div id="gr-container"></div>
    </div>
    <script src="vendor/gsap.min.js"></script>
    <script>
      (function () {
        window.__timelines = window.__timelines || {};
        var WORDS = ${JSON.stringify(WORDS)};
        var GROUPS = ${JSON.stringify(GROUPS)};
        /* DESIGN.md voltage: mango → lagoon → foam-soft */
        var BRAND_GRAD = "linear-gradient(90deg, #FF7A45 0%, #1ECAD3 22%, #E8F6F1 48%, #E8F6F1 100%)";
        var MAX_W = 920;
        var BASE_SIZE = 52;

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
          var fontSize = fitFontSize(groupText, BASE_SIZE, "800", "Rubik, sans-serif", MAX_W);
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

const indexHtml = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <style>
@font-face { font-family: "Rubik"; src: url("fonts/Rubik-400-latin.woff2") format("woff2"); font-weight: 400; font-display: block; }
@font-face { font-family: "Rubik"; src: url("fonts/Rubik-800-latin.woff2") format("woff2"); font-weight: 800; font-display: block; }
* { box-sizing: border-box; }
html, body {
  margin:0; padding:0; width:100%; height:100%; overflow:hidden; background:#0B1A17;
  font-family: Rubik, ui-sans-serif, system-ui, sans-serif;
}
#stage { position:relative; width:100%; height:100%; overflow:hidden; background:#0B1A17; }
.video-wrapper {
  position:absolute; left:0; top:0; width:1080px; height:1920px;
  overflow:hidden; z-index:1; opacity:1; pointer-events:none;
}
.video-wrapper video { width:100%; height:100%; object-fit:cover; display:block; }
.clip { position:absolute; }
.caption-host {
  position:absolute; left:0; top:0; width:1080px; height:1920px;
  z-index:50; pointer-events:none; overflow:hidden;
}
</style>
  </head>
  <body>
    <div id="stage" data-composition-id="main" data-start="0" data-duration="${DUR}" data-fps="24" data-width="1080" data-height="1920">
      <div class="video-wrapper" id="video-wrap">
        <video id="a-roll" class="clip" src="source.mp4" muted playsinline
               data-start="0" data-duration="${DUR}" data-track-index="1"></video>
      </div>
      <audio id="a-roll-audio" src="source.mp4" data-start="0" data-duration="${DUR}"
             data-track-index="10" data-volume="1"></audio>

      <div id="caption-gradient-fill-host" class="caption-host clip"
           data-composition-id="caption-gradient-fill"
           data-composition-src="compositions/caption-gradient-fill.html"
           data-track-kind="captions"
           data-start="0" data-duration="${DUR}"
           data-width="1080" data-height="1920" data-track-index="50"></div>
    </div>
    <script src="vendor/gsap.min.js"></script>
    <script>
      (function () {
        window.__timelines = window.__timelines || {};
        const tl = gsap.timeline({ paused: true });
        gsap.set("#video-wrap", { x: 0, y: 0, scale: 1, opacity: 1, zIndex: 1 });
        gsap.set("#caption-gradient-fill-host", { opacity: 1 });
        window.__timelines["main"] = tl;
      })();
    </script>
  </body>
</html>
`;

fs.writeFileSync(path.join(proj, "compositions", "caption-gradient-fill.html"), captionHtml);
fs.writeFileSync(path.join(proj, "index.html"), indexHtml);
console.log("WORDS", WORDS.length, "GROUPS", GROUPS.length);
console.log("wrote compositions/caption-gradient-fill.html + index.html");
