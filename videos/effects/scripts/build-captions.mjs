import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const srt = fs.readFileSync(path.join(root, "captions.srt"), "utf8");

function parseTime(t) {
  const [h, m, rest] = t.split(":");
  const [s, ms] = rest.split(",");
  return +h * 3600 + +m * 60 + +s + +ms / 1000;
}

function fix(t) {
  return t
    .replace(/un\s+tracket/gi, "untracked")
    .replace(/tracket/gi, "untracked")
    .replace(/\bun track\b/gi, "untracked")
    .replace(/usar untracked o no/gi, "usar untracked o no")
    .replace(/un\s+untracked/gi, "untracked")
    .replace(/signal method/gi, "signalMethod")
    .replace(/paquete de NRS signal/gi, "paquete de NgRx Signals")
    .replace(/NRS signal/gi, "NgRx Signals");
}

const blocks = srt.trim().split(/\n\s*\n/);
const cues = [];
for (const b of blocks) {
  const lines = b
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) continue;
  const m = lines[1].match(
    /(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/,
  );
  if (!m) continue;
  const text = lines.slice(2).join(" ").replace(/\s+/g, " ").trim();
  cues.push({ start: parseTime(m[1]), end: parseTime(m[2]), text });
}

const WORDS = [];
const GROUPS = [];
for (const c of cues) {
  const parts = fix(c.text).split(/\s+/).filter(Boolean);
  const wordStart = WORDS.length;
  const dur = Math.max(0.05, c.end - c.start);
  parts.forEach((w, i) => {
    const start = c.start + (dur * i) / parts.length;
    const end = c.start + (dur * (i + 1)) / parts.length;
    WORDS.push({
      text: w,
      start: +start.toFixed(3),
      end: +end.toFixed(3),
    });
  });
  GROUPS.push({
    wordStart,
    wordEnd: WORDS.length - 1,
    start: c.start,
    end: c.end,
  });
}

fs.writeFileSync(
  path.join(root, "caption-cues.json"),
  JSON.stringify(
    cues.map((c) => ({ start: c.start, end: c.end, text: fix(c.text) })),
    null,
    2,
  ),
);

const tpl = fs.readFileSync(
  path.join(root, "compositions", "caption-gradient-fill.html"),
  "utf8",
);

// Replace duration + WORDS + GROUPS arrays in the caption composition
let out = tpl
  .replace(/data-duration="[^"]+"/, `data-duration="63.033"`)
  .replace(
    /var WORDS = \[[\s\S]*?\];/,
    `var WORDS = ${JSON.stringify(WORDS)};`,
  )
  .replace(
    /var GROUPS = \[[\s\S]*?\];/,
    `var GROUPS = ${JSON.stringify(GROUPS)};`,
  )
  // TikTok / Reels safe zone: above bottom chrome (~250–300px), side margins ~80px
  .replace(/bottom:\s*380px;/, "bottom: 320px;")
  .replace(/max-width:\s*912px;/, "max-width: 920px;")
  .replace(/font-size:\s*44px;/, "font-size: 56px;")
  .replace(/padding:\s*18px 28px;/, "padding: 20px 32px;")
  .replace(/var MAX_W = \d+;/, "var MAX_W = 920;")
  .replace(/var BASE_SIZE = \d+;/, "var BASE_SIZE = 56;");


fs.writeFileSync(
  path.join(root, "compositions", "caption-gradient-fill.html"),
  out,
);
console.log(
  `captions: ${cues.length} cues, ${WORDS.length} words → caption-gradient-fill.html`,
);
