// Builds the renderable projects from src/:
//   public/        — with burned-in captions
//   public-nocap/  — identical, without captions (for later edits)
// Inputs: src/template.html (root), src/compositions/*.html (one per beat group), src/beats.json,
// src/brush-layer.js, src/vendor/brush.js, src/assets/**, captions.srt.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = dirname(fileURLToPath(import.meta.url));
const PROJ = join(SRC, "..");
const PUB = join(PROJ, "public");
const NOCAP = join(PROJ, "public-nocap");

const beats = JSON.parse(readFileSync(join(SRC, "beats.json"), "utf8"));
const BEATS = JSON.stringify(beats);
const r2 = (n) => String(Math.round(n * 1000) / 1000);
const SLOTS = {
  __DUR__: r2(beats.duration),
  __B04_START__: r2(beats.tier1.start),
  __B04_DUR__: r2(beats.cta.start - beats.tier1.start),
  __B07_START__: r2(beats.cta.start),
  __B07_DUR__: r2(beats.duration - beats.cta.start),
};
const inject = (html) => {
  if (!html.includes("/*BEATS*/")) throw new Error("missing /*BEATS*/ placeholder");
  let out = html.split("/*BEATS*/").join(BEATS);
  for (const [k, v] of Object.entries(SLOTS)) out = out.split(k).join(v);
  return out;
};

// ---------- Captions: SRT cues → word timings (length-proportional) → 2–3 word chunks ----------
const toSec = (s) => {
  const [h, m, rest] = s.trim().split(":");
  const [sec, ms] = rest.split(",");
  return +h * 3600 + +m * 60 + +sec + +ms / 1000;
};
const srt = readFileSync(join(PROJ, beats.srt), "utf8").replace(/\r/g, "");
const cues = [];
for (const block of srt.split(/\n\s*\n/)) {
  const lines = block.trim().split("\n");
  if (lines.length < 3) continue;
  const [a, b] = lines[1].split(" --> ");
  cues.push({ start: toSec(a), end: toSec(b), text: lines.slice(2).join(" ").replace(/\s+/g, " ").trim() });
}
const chunks = [];
for (const c of cues) {
  const ws = c.text.split(" ");
  const total = ws.reduce((n, w) => n + w.length, 0);
  let t = c.start;
  const words = ws.map((w) => {
    const d = ((c.end - c.start) * w.length) / total;
    const o = { text: w, start: t, end: t + d };
    t += d;
    return o;
  });
  let i = 0;
  while (i < words.length) {
    const remaining = words.length - i;
    const size = remaining === 4 ? 2 : Math.min(3, remaining);
    const g = words.slice(i, i + size);
    chunks.push({ text: g.map((w) => w.text).join(" "), start: g[0].start, end: g[g.length - 1].end });
    i += size;
  }
}
const fmt = (n) => n.toFixed(3);
const capHtml = chunks
  .map(
    (c, i) =>
      `          <div id="cap-${i}" class="cap clip" data-start="${fmt(c.start)}" data-duration="${fmt(c.end - c.start)}" data-track-index="5"><span class="pill">${c.text}</span></div>`
  )
  .join("\n");

// ---------- Write one project dir ----------
const copyTree = (src, dst, skip = () => false) => {
  mkdirSync(dst, { recursive: true });
  for (const name of readdirSync(src)) {
    const s = join(src, name);
    const d = join(dst, name);
    if (skip(name, s)) continue;
    if (statSync(s).isDirectory()) copyTree(s, d, skip);
    else copyFileSync(s, d);
  }
};

function build(outDir, withCaptions) {
  mkdirSync(join(outDir, "compositions"), { recursive: true });
  mkdirSync(join(outDir, "vendor"), { recursive: true });
  const brushLayer = readFileSync(join(SRC, "brush-layer.js"), "utf8");
  const root = inject(readFileSync(join(SRC, "template.html"), "utf8").replace("/*BRUSH_LAYER*/", () => brushLayer)).replace(
    "<!--CAPTIONS-->",
    withCaptions ? `<!-- Captions: chunks of 2–3 words from captions.srt -->\n${capHtml}` : ""
  );
  writeFileSync(join(outDir, "index.html"), root, "utf8");
  for (const f of readdirSync(join(SRC, "compositions"))) {
    if (!f.endsWith(".html")) continue;
    writeFileSync(join(outDir, "compositions", f), inject(readFileSync(join(SRC, "compositions", f), "utf8")), "utf8");
  }
  copyFileSync(join(SRC, "vendor", "brush.js"), join(outDir, "vendor", "brush.js"));
  copyTree(join(SRC, "assets"), join(outDir, "assets"));
}

build(PUB, true);
// public-nocap shares the heavy media (video, mix, fonts, gsap) with public/
copyTree(PUB, NOCAP, (name, p) => name === "index.html" && dirname(p) === PUB || name === "snapshots");
build(NOCAP, false);

for (const need of ["input-video.mp4", "mix.m4a", "vendor/gsap.min.js", "fonts/Inter-700-latin.woff2"]) {
  if (!existsSync(join(PUB, need))) throw new Error(`public/${need} is missing`);
}
console.log(`cues=${cues.length} chunks=${chunks.length} compositions=${readdirSync(join(SRC, "compositions")).length}`);
