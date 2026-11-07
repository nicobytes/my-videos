import fs from "fs";
import path from "path";

const WORK = path.resolve(import.meta.dirname, "..");
const PUBLIC = WORK; // composition root (flattened; was public/)
const sb = JSON.parse(fs.readFileSync(path.join(WORK, "storyboard.json"), "utf8"));
const { fps, width, height, durationSeconds } = sb.composition;
const D = durationSeconds;

function q(t) {
  return Math.round(t * fps) / fps;
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseSrt(srtPath) {
  const srt = fs.readFileSync(srtPath, "utf8");
  function parseTs(t) {
    const [h, m, rest] = t.split(":");
    const [s, ms] = rest.split(",");
    return +h * 3600 + +m * 60 + +s + +ms / 1000;
  }
  const cues = [];
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
    let text = lines.slice(2).join(" ");
    text = text
      .replace(/\bPNP\b/gi, "pnpm")
      .replace(/\bROS\b/gi, "Rust")
      .replace(/\bPersue\b/g, "Version")
      .replace(/\bnote\b/gi, "Node");
    const start = parseTs(m[1]);
    const end = Math.min(parseTs(m[2]), D);
    if (end <= start) continue;
    cues.push({ start, end, text });
  }
  return cues;
}

function parseAnims(cardHtml, cardId, startSec) {
  const lines = [];
  // Require a real id= attribute (not data-hf-id= injected by Studio)
  const re =
    /(?:^|[\s])id="([^"]+)"[^>]*\bdata-anim="([^"]+)"[^>]*\bdata-anim-at="([^"]+)"[^>]*\bdata-anim-duration="([^"]+)"|(?:^|[\s])\bdata-anim="([^"]+)"[^>]*\bdata-anim-at="([^"]+)"[^>]*\bdata-anim-duration="([^"]+)"[^>]*\bid="([^"]+)"/g;
  let m;
  while ((m = re.exec(cardHtml)) !== null) {
    const id = m[1] || m[8];
    const kind = m[2] || m[5];
    const at = parseFloat(m[3] || m[6]);
    const dur = parseFloat(m[4] || m[7]);
    if (!id || id.startsWith("hf-") || !kind || Number.isNaN(at) || Number.isNaN(dur)) continue;
    const T = q(startSec + at);
    const sel = `.card[data-card-id="${cardId}"] #${id}`;
    if (kind === "fade-in") {
      lines.push(
        `tl.fromTo(${JSON.stringify(sel)}, { opacity: 0 }, { opacity: 1, duration: ${dur}, ease: "power2.out" }, ${T});`,
      );
    } else if (kind === "scale-pop") {
      lines.push(
        `tl.fromTo(${JSON.stringify(sel)}, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: ${dur}, ease: "back.out(1.6)" }, ${T});`,
      );
    } else if (kind === "grow-x") {
      const tw = tagMatchTargetW(cardHtml, id) ?? 100;
      lines.push(
        `tl.fromTo(${JSON.stringify(sel)}, { width: 0 }, { width: ${tw}, duration: ${dur}, ease: "power2.out" }, ${T});`,
      );
    }
  }
  return lines;
}

function tagMatchTargetW(html, id) {
  const re = new RegExp(
    `id="${id}"[^>]*data-anim-target-w="([^"]+)"|data-anim-target-w="([^"]+)"[^>]*id="${id}"`,
  );
  const m = html.match(re);
  return m ? parseFloat(m[1] || m[2]) : null;
}

// Legacy sentence captions removed — use compositions/caption-gradient-fill.html
const captionMount = `
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
      ></div>`;
const captionGsap = "";

const cardBlocks = [];
const gsapBlocks = [];
const videoHideBlocks = [];

for (const card of sb.cards) {
  let html = fs.readFileSync(path.join(PUBLIC, "cards", `${card.id}.html`), "utf8");
  // Studio may have injected data-hf-id into source cards — strip before assemble
  html = html.replace(/\s*data-hf-id="[^"]*"/g, "");
  const start = card.startSec;
  const end = Math.min(card.endSec, D);
  const dur = +(end - start).toFixed(4);
  const enter = 0.35;
  const exit = 0.3;
  const exitAt = q(end - exit);

  cardBlocks.push(`
      <div
        id="host-${card.id}"
        class="card-host clip"
        data-card-id="${card.id}"
        data-start="${start.toFixed(4)}"
        data-duration="${dur.toFixed(4)}"
        data-track-index="2"
        style="left:0;top:0;width:${width}px;height:${height}px;"
      >
${html}
      </div>`);

  // Hide talking-head completely while opaque card is up
  videoHideBlocks.push(`
          tl.to("#video-wrap", { opacity: 0, duration: ${enter}, ease: "power2.out" }, ${q(start)});
          tl.to("#video-wrap", { opacity: 1, duration: ${exit}, ease: "power2.in" }, ${exitAt});
`);

  // Card-host is a .clip — framework owns visibility; animate a wrapper child only.
  gsapBlocks.push(`
          // ── ${card.id} [${start} → ${end}] fullscreen opaque ──
          tl.set('.card-host[data-card-id="${card.id}"] .card', { opacity: 0 }, 0);
          tl.fromTo(
            '.card-host[data-card-id="${card.id}"] .card',
            { opacity: 0 },
            { opacity: 1, duration: ${enter}, ease: "power2.out" },
            ${q(start)},
          );
${parseAnims(html, card.id, start)
  .map((l) => "          " + l)
  .join("\n")}
          tl.to(
            '.card-host[data-card-id="${card.id}"] .card',
            { opacity: 0, duration: ${exit}, ease: "power2.in" },
            ${exitAt},
          );
          tl.set('.card-host[data-card-id="${card.id}"] .card', { opacity: 0 }, ${q(end)});
`);
}

const index = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <style>
      @font-face {
        font-family: "Inter";
        src: url("fonts/Inter-400-latin.woff2") format("woff2");
        font-weight: 400;
        font-display: block;
      }
      @font-face {
        font-family: "Inter";
        src: url("fonts/Inter-700-latin.woff2") format("woff2");
        font-weight: 700;
        font-display: block;
      }
      @font-face {
        font-family: "Caveat";
        src: url("fonts/Caveat-400-latin.woff2") format("woff2");
        font-weight: 400;
        font-display: block;
      }
      @font-face {
        font-family: "Caveat";
        src: url("fonts/Caveat-700-latin.woff2") format("woff2");
        font-weight: 700;
        font-display: block;
      }
      @font-face {
        font-family: "LXGW WenKai TC";
        src: url("fonts/LXGWWenKaiTC-400-latin.woff2") format("woff2");
        font-weight: 400;
        font-display: block;
      }
      @font-face {
        font-family: "Virgil";
        src: url("fonts/Virgil.woff2") format("woff2");
        font-display: block;
      }

      :root {
        --bg: #0d1117;
        --text: #f1f1f1;
        --accent-0: #4ade80;
        --accent-1: #f472b6;
        --accent-2: #60a5fa;
        --accent-3: #fbbf24;
        --accent-4: #a78bfa;
      }
      * { box-sizing: border-box; }
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #000;
        font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
      }
      #stage {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #000;
      }
      .video-wrapper {
        position: absolute;
        left: 0;
        top: 0;
        width: ${width}px;
        height: ${height}px;
        overflow: hidden;
        z-index: 1;
      }
      .video-wrapper video {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .card-host {
        position: absolute;
        pointer-events: none;
        overflow: hidden;
        z-index: 3;
      }
      .card-host .card {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
    </style>
  </head>
  <body>
    <div
      id="stage"
      data-composition-id="talking-head-recut"
      data-start="0"
      data-duration="${D}"
      data-fps="${fps}"
      data-width="${width}"
      data-height="${height}"
    >
      <div class="video-wrapper" id="video-wrap" style="left:0;top:0;width:${width}px;height:${height}px;opacity:1;">
        <video
          id="bg-video"
          src="input-video.mp4"
          muted
          playsinline
          data-start="0"
          data-duration="${D}"
          data-track-index="1"
        ></video>
      </div>
      <audio
        id="source-audio"
        src="input-video.mp4"
        data-start="0"
        data-duration="${D}"
        data-track-index="10"
        data-volume="1"
      ></audio>
${cardBlocks.join("\n")}
${captionMount}
      <script src="vendor/gsap.min.js"></script>
      <script>
        (function () {
          window.__fmt = function (v, fmt) {
            if (typeof fmt === "string" && /^\\.[0-9]+f$/.test(fmt)) {
              return Number(v).toFixed(Number(fmt.slice(1, -1)));
            }
            if (fmt === ",d") return Math.round(v).toLocaleString();
            return String(Math.round(v));
          };

          const tl = window.gsap.timeline({ paused: true });

          tl.set("#video-wrap", {
            left: 0,
            top: 0,
            width: ${width},
            height: ${height},
            opacity: 1,
          }, 0);
${videoHideBlocks.join("\n")}
${gsapBlocks.join("\n")}
${captionGsap}
          window.__timelines = window.__timelines || {};
          window.__timelines["talking-head-recut"] = tl;
        })();
      </script>
    </div>
  </body>
</html>
`;

fs.writeFileSync(path.join(PUBLIC, "index.html"), index);
console.log(
  "Wrote index.html",
  "cards:",
  sb.cards.length,
  "captions:",
  cues.length,
  "duration:",
  D,
);
