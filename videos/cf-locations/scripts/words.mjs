// SRT → corrected, char-weighted word timings (assets/words.json).
// Whisper isn't available locally; SRT cues are ~2s so interpolation stays tight.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srt = fs.readFileSync(path.join(root, "assets/captions.srt"), "utf8");

const t = (s) => {
  const [h, m, r] = s.split(":");
  const [sec, ms] = r.split(",");
  return +h * 3600 + +m * 60 + +sec + +ms / 1000;
};

// concept.md §6 — ASR fixes
const fix = (s) =>
  s
    .replace(/Astrid Cloudford/g, "Astro y Cloudflare")
    .replace(/Cloudford|Cloudfor\b/g, "Cloudflare")
    .replace(/query paran/g, "query params")
    .replace(/Ruidirect/g, "redirect")
    .replace(/movísmos/g, "modismos")
    .replace(/el relancé/g, "relancé")
    .replace(/parlana$/g, "parlana.bo")
    .replace(/^punto bo$/g, "")
    .replace(/adaptación a de/g, "adaptación de")
    .replace(/que entrar/g, "entrar")
    .replace(/^precios como en\.$/g, "precios")
    .replace(/^Pues en pesos/g, "en pesos")
    .replace(/Tono/g, "tono")
    .replace(/pues en$/g, "en");

const cues = fs
  .readFileSync(path.join(root, "assets/captions.srt"), "utf8")
  .trim()
  .split(/\r?\n\s*\r?\n/)
  .map((b) => b.split(/\r?\n/))
  .map((l) => {
    const [a, b] = l[1].split(" --> ");
    return { start: t(a), end: t(b), text: fix(l.slice(2).join(" ").trim()) };
  });

// "parlana" + "punto bo" span two cues: extend the first over the dropped second
for (let i = 0; i < cues.length; i++) {
  if (!cues[i].text && i > 0) cues[i - 1].end = cues[i].end;
}

const words = [];
for (const c of cues.filter((c) => c.text)) {
  const parts = c.text.split(/\s+/).filter(Boolean);
  const weights = parts.map((w) => w.replace(/[^\p{L}\p{N}]/gu, "").length + 2);
  const total = weights.reduce((a, b) => a + b, 0);
  let acc = c.start;
  parts.forEach((w, i) => {
    const d = ((c.end - c.start) * weights[i]) / total;
    words.push({ text: w, start: +acc.toFixed(3), end: +(acc + d).toFixed(3) });
    acc += d;
  });
}
fs.writeFileSync(path.join(root, "assets/words.json"), JSON.stringify(words));
console.log(words.length, "words");
console.log(words.map((w) => `${w.start.toFixed(2)} ${w.text}`).join("\n"));
