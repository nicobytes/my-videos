// Assembles public/index.html from src/v3/{style.css, body.html, timeline.js} + captions.srt.
// Run from the project root: node src/v3/build.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SRC, "..", "..");

function parseSrt(text) {
  const t = (h, m, s, ms) => +h * 3600 + +m * 60 + +s + +ms / 1000;
  return text.replace(/\r/g, "").split(/\n\s*\n/).map((b) => b.trim().split("\n")).flatMap((L) => {
    const m = L[1] && L[1].match(/(\d+):(\d+):(\d+),(\d+) --> (\d+):(\d+):(\d+),(\d+)/);
    if (!m) return [];
    return [{ s: +t(m[1], m[2], m[3], m[4]).toFixed(2), e: +t(m[5], m[6], m[7], m[8]).toFixed(2), text: L.slice(2).join(" ").trim() }];
  });
}

const caps = parseSrt(readFileSync(join(ROOT, "captions.srt"), "utf8"));
const css = readFileSync(join(SRC, "style.css"), "utf8");
const body = readFileSync(join(SRC, "body.html"), "utf8");
const js = readFileSync(join(SRC, "timeline.js"), "utf8").replace("/*CAPTIONS*/", JSON.stringify(caps));

const html = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <style>
${css}
    </style>
  </head>
  <body>
    <div id="stage" data-composition-id="fallback-model-recut" data-start="0" data-duration="90.18" data-fps="30" data-width="1080" data-height="1920">
${body}
      <script src="vendor/gsap.min.js"></script>
      <script>
${js}
      </script>
    </div>
  </body>
</html>
`;

writeFileSync(join(ROOT, "public", "index.html"), html);
console.log(`public/index.html · ${caps.length} captions · ${html.length} bytes`);
