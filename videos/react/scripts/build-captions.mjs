/**
 * Build caption-gradient-fill.html from captions.srt
 * IG Reels safe rail: bottom ~380px, side margins ~80px
 * ASR fixes: ReAct / Acting
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const DURATION = 96.533;
const srt = fs.readFileSync(path.join(root, "captions.srt"), "utf8");

function parseTime(t) {
  const [h, m, rest] = t.split(":");
  const [s, ms] = rest.split(",");
  return +h * 3600 + +m * 60 + +s + +ms / 1000;
}

function fix(t) {
  return t
    .replace(/\bReasoning and Active\b/gi, "Reasoning and Acting")
    .replace(/\bActive\b/g, "Acting")
    .replace(/\bse llama React\b/gi, "se llama ReAct")
    .replace(/\bno es de React\b/gi, "no es de React")
    .replace(/\bEse nombre React\b/gi, "Ese nombre ReAct")
    .replace(/\bpatrón React\b/gi, "patrón ReAct")
    .replace(/\bReact literalmente\b/gi, "ReAct literalmente");
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

const tplPath = path.join(root, "compositions", "caption-gradient-fill.html");
let tpl = fs.readFileSync(tplPath, "utf8");

let out = tpl
  .replace(/data-duration="[^"]+"/, `data-duration="${DURATION}"`)
  .replace(/var WORDS = \[[\s\S]*?\];/, `var WORDS = ${JSON.stringify(WORDS)};`)
  .replace(
    /var GROUPS = \[[\s\S]*?\];/,
    `var GROUPS = ${JSON.stringify(GROUPS)};`,
  );

fs.writeFileSync(tplPath, out);
console.log(
  `captions: ${cues.length} cues, ${WORDS.length} words → caption-gradient-fill.html`,
);
