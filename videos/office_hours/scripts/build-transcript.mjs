import fs from "fs";
import path from "path";

const root = path.resolve(import.meta.dirname, "..");
const srt = fs.readFileSync(path.join(root, "captions.srt"), "utf8");
const D = 35.233;

function parseTs(t) {
  const [h, m, rest] = t.split(":");
  const [s, ms] = rest.split(",");
  return +h * 3600 + +m * 60 + +s + +ms / 1000;
}

const fixes = {
  estadística: "estadística",
  "este estadística": "esta estadística",
  haz: "hace",
  "la altas": "las altas",
};

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
    .replace(/\beste estadística\b/gi, "esta estadística")
    .replace(/\bhaz atención\b/gi, "hace atención")
    .replace(/\bla altas horas\b/gi, "las altas horas");
  cues.push({ start: parseTs(m[1]), end: Math.min(parseTs(m[2]), D), text });
}

const words = [];
for (const c of cues) {
  const toks = c.text.split(/\s+/).filter(Boolean);
  const dur = Math.max(0.01, c.end - c.start);
  toks.forEach((t, i) => {
    const a = c.start + (dur * i) / toks.length;
    const b = c.start + (dur * (i + 1)) / toks.length;
    words.push({
      text: t,
      start: +a.toFixed(3),
      end: +Math.min(b, D).toFixed(3),
    });
  });
}

fs.writeFileSync(path.join(root, "transcript.json"), JSON.stringify(words, null, 2));
fs.writeFileSync(path.join(root, "caption-cues.json"), JSON.stringify(cues, null, 2));
console.log("words", words.length, "cues", cues.length);
