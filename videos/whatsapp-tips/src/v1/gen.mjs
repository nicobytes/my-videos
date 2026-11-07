import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const PROJ = fileURLToPath(new URL("../..", import.meta.url));
const PUB = join(PROJ, "public");
const NOCAP = join(PROJ, "public-nocap");

const toSec = (s) => {
  const [h, m, rest] = s.trim().split(":");
  const [sec, ms] = rest.split(",");
  return +h * 3600 + +m * 60 + +sec + +ms / 1000;
};

// Parse SRT cues
const srt = readFileSync(join(PROJ, "captions.srt"), "utf8").replace(/\r/g, "");
const cues = [];
for (const block of srt.split(/\n\s*\n/)) {
  const lines = block.trim().split("\n");
  if (lines.length < 3) continue;
  const [a, b] = lines[1].split(" --> ");
  cues.push({ start: toSec(a), end: toSec(b), text: lines.slice(2).join(" ").replace(/\s+/g, " ").trim() });
}

// Word-level timing: distribute each cue's duration across its words by character length
const words = [];
for (const c of cues) {
  const ws = c.text.split(" ");
  const total = ws.reduce((n, w) => n + w.length, 0);
  const dur = c.end - c.start;
  let t = c.start;
  for (const w of ws) {
    const d = (dur * w.length) / total;
    words.push({ text: w, start: t, end: t + d });
    t += d;
  }
}

// Group into on-screen chunks of 2–3 words (never 1 unless the cue is a single word)
const chunks = [];
for (const c of cues) {
  const ws = words.filter((w) => w.start >= c.start - 1e-6 && w.end <= c.end + 1e-6);
  const groups = [];
  let i = 0;
  while (i < ws.length) {
    const remaining = ws.length - i;
    const size = remaining === 4 ? 2 : Math.min(3, remaining);
    groups.push(ws.slice(i, i + size));
    i += size;
  }
  for (const g of groups) {
    chunks.push({ text: g.map((w) => w.text).join(" "), start: g[0].start, end: g[g.length - 1].end });
  }
}

const fmt = (n) => n.toFixed(3);
const capHtml = chunks
  .map(
    (c, i) =>
      `        <div id="cap-${i}" class="cap clip" data-start="${fmt(c.start)}" data-duration="${fmt(c.end - c.start)}" data-track-index="5" data-cap="${i}"><span class="pill">${c.text}</span></div>`
  )
  .join("\n");

// WhatsApp SVG, recolored to brand green, inlined
let waSvg = readFileSync(join(PUB, "assets", "whatsapp.svg"), "utf8").trim();
waSvg = waSvg.replace('<svg role="img"', '<svg class="wa" fill="#25D366" role="img"');

const template = readFileSync(
  join(PROJ, "src", "template.html"),
  "utf8"
);

const withCaps = template
  .replace("<!--CAPTIONS-->", `<!-- Captions: word-synced chunks from captions.srt (2–3 words on screen) -->\n${capHtml}`)
  .replace("<!--WA-->", waSvg);
const noCaps = template
  .replace("<!--CAPTIONS-->", "")
  .replace("<!--WA-->", waSvg);

mkdirSync(PUB, { recursive: true });
writeFileSync(join(PUB, "index.html"), withCaps, "utf8");

// No-caption variant: a sibling dir with the same assets (render takes a dir with index.html)
mkdirSync(NOCAP, { recursive: true });
writeFileSync(join(NOCAP, "index.html"), noCaps, "utf8");
const copyTree = (src, dst) => {
  mkdirSync(dst, { recursive: true });
  for (const name of readdirSync(src)) {
    const s = join(src, name);
    const d = join(dst, name);
    if (statSync(s).isDirectory()) copyTree(s, d);
    else if (name !== "index.html") copyFileSync(s, d);
  }
};
copyTree(PUB, NOCAP);

console.log(`cues=${cues.length} words=${words.length} chunks=${chunks.length}`);
for (const c of chunks) console.log(`${fmt(c.start)}–${fmt(c.end)}  ${c.text}`);
