// SRT (user's recording) → word timings. Each cue's span is split across its
// words weighted by word length (no word-level ASR available locally).
// Run: node tools/words.mjs  → writes assets/vo/words.json
import fs from "fs";
const srt = fs.readFileSync("assets/12.Tuanunciofuncion.srt", "utf8");
const toS = (t) => { const [h, m, r] = t.split(":"); const [s, ms] = r.split(","); return +h * 3600 + +m * 60 + +s + +ms / 1000; };
const FIX = [
  ["Barlana", "Parlana"], ["Vale, tiene", "Vale tiene"], ["Instagram, en", "Instagram y"], ["Ahora vale, se dedica", "Ahora Vale se dedica"],
  ["¿Cuánto cuesta? Tienes un turno hoy donde", "¿Cuánto cuesta? ¿Tienes turno hoy? ¿Dónde"], ["quedan, pero", "quedan? Pero"],
  ["que corra en WhatsApp.", "que corre en WhatsApp."], ["Facebook y funciona.", "Facebook… y funciona."], ["agenda cita", "agenda citas"],
];
const words = [];
srt.trim().split(/\r?\n\r?\n/).forEach((b) => {
  const l = b.split(/\r?\n/); const [a, z] = l[1].split(" --> ");
  let text = l.slice(2).join(" ").trim(); FIX.forEach(([x, y]) => (text = text.replace(x, y)));
  const s = toS(a), e = toS(z); const ws = text.split(/\s+/); const wt = ws.map((w) => w.replace(/[¿?¡!.,…]/g, "").length + 1.5);
  const tot = wt.reduce((p, q) => p + q, 0); let t = s;
  ws.forEach((w, i) => { const d = ((e - s) * wt[i]) / tot; words.push({ text: w, start: +t.toFixed(3), end: +(t + d).toFixed(3) }); t += d; });
});
fs.mkdirSync("assets/vo", { recursive: true });
fs.writeFileSync("assets/vo/words.json", JSON.stringify(words, null, 0));
console.log(words.length, "words"); console.log(words.map((w) => w.start.toFixed(2) + " " + w.text).join(" | "));
