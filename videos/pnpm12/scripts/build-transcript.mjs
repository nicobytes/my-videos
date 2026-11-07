import fs from "fs";
import path from "path";

const root = path.resolve(import.meta.dirname, "..");
const srt = fs.readFileSync(path.join(root, "captions.srt"), "utf8");

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
  cues.push({
    start: parseTs(m[1]),
    end: parseTs(m[2]),
    text: lines.slice(2).join(" "),
  });
}

const fixes = {
  PNP: "pnpm",
  Pnp: "pnpm",
  pnp: "pnpm",
  ROS: "Rust",
  Ros: "Rust",
  Persue: "Version",
  note: "Node",
  Note: "Node",
};

const words = [];
const durCap = 57.9;
for (const c of cues) {
  const toks = c.text
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => {
      const bare = w.replace(/[.,;:!?]/g, "");
      const punct = w.slice(bare.length);
      return (fixes[bare] || bare) + punct;
    });
  const dur = Math.max(0.01, c.end - c.start);
  toks.forEach((t, i) => {
    const a = c.start + (dur * i) / toks.length;
    const b = c.start + (dur * (i + 1)) / toks.length;
    words.push({
      text: t,
      start: +a.toFixed(3),
      end: +Math.min(b, durCap).toFixed(3),
    });
  });
}

fs.writeFileSync(
  path.join(root, "transcript.json"),
  JSON.stringify(words, null, 2),
);
console.log("words", words.length);
