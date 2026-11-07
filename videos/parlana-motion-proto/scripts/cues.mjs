// Sound cues for the prototype, read from the same timeline the composition renders.
// Usage (from this folder): node scripts/cues.mjs && node ../../scripts/sfx.mjs assets/sfx/cues.json assets/sfx/mix.wav --peak
import { writeFileSync } from "node:fs";

await import("../compositions/shared/physics.js");
await import("../compositions/shared/timeline.js");
const X = globalThis.Proto;
const B = X.BEAT;
const cues = [];
const add = (t, type, gain) => cues.push({ t: +t.toFixed(3), type, gain });

for (let i = 0; i < 14; i++) add(0.3 + i * 0.1, "tick", 0.45); // the clock's minutes
add(B[3], "thump", 0.6); // "No llegó"
add(B[5], "click", 1.0); // send
add(B[5] + 0.04, "pop", 0.55); // the message lands
add(B[6], "pop", 0.45); // "escribiendo…"
add(X.HOLDS[0][0], "click", 0.8); // grab the weeks
// One tick each time a week crosses (measured on the strip's own physics).
let prev = X.missedCount(0);
for (let t = 0; t < X.D; t += 1 / 240) {
  const n = X.missedCount(t);
  if (n !== prev) add(t, "tick", 0.6);
  prev = n;
}
add(X.HOLDS[1][0], "click", 0.7); // press and hold the hour
add(B[15], "thump", 0.5); // "Ingreso perdido"
add(X.S[4], "whoosh", 0.35); // into the busy day
X.NOTES.forEach((a) => add(a, "pop", 0.55)); // messages pile up
add(B[22], "click", 1.0); // the toggle
add(B[22] + 0.12, "chime", 0.6); // on

cues.sort((a, b) => a.t - b.t);
writeFileSync("assets/sfx/cues.json", JSON.stringify(cues, null, 1));
console.log(`${cues.length} cues; week ticks at ${cues.filter((c) => c.type === "tick" && c.t > 5).map((c) => c.t).join(", ")}`);
