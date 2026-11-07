// UI sound cues for the reel, read from the same timeline the compositions render.
// Usage (from the video folder): node scripts/cues.mjs && node ../../scripts/sfx.mjs assets/sfx/cues.json assets/sfx/mix.wav --peak
import { writeFileSync } from "node:fs";

globalThis.gsap = { timeline: () => ({ fromTo() {} }) };
await import("../compositions/shared/physics.js");
await import("../compositions/shared/timing.js");
await import("../compositions/shared/timeline.js");
const R = globalThis.Reel;
const { A, S, TAP, HOLD } = R;
const cues = [];
const add = (t, type, gain) => cues.push({ t: +t.toFixed(3), type, gain });

// 1 · the clock reaches 10:00, the checklist ticks itself, the stamp lands.
add(1.2, "tick", 0.45);
add(A.hora, "tick", 0.6);
[0, 1, 2].forEach((i) => add(R.beatAfter(A.listo - 0.2, i), "pop", 0.4));
for (let i = 1; i <= 15; i += 2) add(A.paso + (i * (TAP.stamp - A.paso)) / 15, "tick", 0.35);
add(TAP.stamp, "thump", 0.6);
// 2 · the message.
add(S.chat + 0.12, "pop", 0.45);
// 3 · grab the weeks; a tick each time a week crosses.
add(HOLD.weeks[0], "click", 0.7);
let prev = R.missedCount(0);
for (let t = HOLD.weeks[0]; t < S.disc; t += 1 / 240) {
  const n = R.missedCount(t);
  if (n !== prev) add(t, "tick", 0.6);
  prev = n;
}
// 4 · hold the hour; "ingreso perdido".
add(HOLD.hour[0], "click", 0.6);
add(R.beatNear(A.ingreso), "thump", 0.5);
// 5 · ticked by hand.
add(TAP.carla, "click", 0.9);
add(TAP.diego, "click", 0.9);
// 6 · messages pile up.
[A.mensajes, A.ocuparte, A.implica, A.negocio, A.tiempo2].map(R.beatNear).forEach((a) => add(a, "pop", 0.45));
// 7 · the turn: a whoosh whose peak sits on the downbeat, then the switch.
add(A.ySi, "whoosh", 0.4);
add(TAP.knob, "click", 1.0);
add(TAP.knob + 0.1, "chime", 0.55);
// 8 · chips dropped into place.
add(HOLD.chipA[1], "pop", 0.5);
add(HOLD.chipB[0], "click", 0.6);
add(HOLD.chipB[1], "pop", 0.5);
// 9 · the reminder arrives; Confirmar.
add(R.beatNear(A.recuerde), "pop", 0.55);
add(TAP.confirm, "click", 1.0);
add(TAP.confirm + 0.12, "chime", 0.6);
add(TAP.confirm + 0.35, "pop", 0.4);
// 10 · Bs 1 → 7: a tick per new reminder, then they leave on their own.
add(S.price + 0.3, "pop", 0.45);
let v = 1;
for (let t = HOLD.slider[0]; t < HOLD.slider[1] + 0.5; t += 1 / 240) {
  const nv = R.sliderValue(t);
  if (nv > v) add(t, "tick", 0.55);
  v = Math.max(v, nv);
}
R.AUTOSEND.forEach((a) => add(a, "tick", 0.4));
// 11 · Parlana: the lockup, sent rows, confirmations.
add(R.beatNear(A.parlana), "chime", 0.45);
[0, 1, 2, 3].forEach((i) => add(R.beatAfter(A.automatizar, i), "tick", 0.4));
[R.beatNear(A.gestionar), R.beatAfter(A.gestionar, 2), R.beatAfter(A.gestionar, 4), R.beatAfter(A.gestionar, 6)].forEach((a) => add(a, "pop", 0.45));
// 12 · question, answer, slots, booked.
add(S.inbox + 0.3, "pop", 0.45);
add(R.beatNear(A.responder), "pop", 0.5);
add(R.beatNear(A.consultas) + 0.75, "click", 0.6);
add(R.beatNear(A.agendar), "chime", 0.55);
// 13 · answered chats; the week fills; reminders set.
[0, 1, 2].forEach((i) => add(R.beatAfter(A.escriben - 0.6, i), "pop", 0.35));
add(R.beatNear(A.organizar), "tick", 0.5);
add(R.beatNear(A.organizar) + 0.35, "tick", 0.4);
add(R.beatNear(A.recordarles), "chime", 0.4);
// 14 · typing CITAS, the tap.
for (let i = 0; i < 5; i++) add(A.comenta - 0.2 + i * 0.08, "tick", 0.3);
add(TAP.cta, "click", 1.0);
add(TAP.cta + 0.1, "chime", 0.6);

cues.sort((a, b) => a.t - b.t);
writeFileSync("assets/sfx/cues.json", JSON.stringify(cues, null, 1));
console.log(`${cues.length} cues, last at ${cues[cues.length - 1].t}s`);
