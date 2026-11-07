// Original 8-bit soundtrack, synthesized deterministically (no samples, no
// randomness → royalty-free and reproducible). Sections start exactly on the
// scene cuts so the music changes mood with the story.
// Run: node tools/chiptune.mjs → assets/audio/bgm-chiptune.wav
import fs from "fs";

const SR = 48000, DUR = 35.3, N = Math.ceil(SR * DUR);
const L = new Float32Array(N), R = new Float32Array(N);
const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);

// ── voices ──
function note(t0, dur, freq, { wave = "square", duty = 0.5, vol = 0.2, pan = 0, attack = 0.005, release = 0.06, slide = 0 } = {}) {
  const s0 = Math.floor(t0 * SR), s1 = Math.min(N, Math.floor((t0 + dur + release) * SR));
  let ph = 0;
  for (let i = s0; i < s1; i++) {
    const t = (i - s0) / SR;
    const f = freq * Math.pow(2, (slide * t) / 12);
    ph += f / SR; ph -= Math.floor(ph);
    let v;
    if (wave === "square") v = ph < duty ? 1 : -1;
    else if (wave === "tri") v = ph < 0.5 ? 4 * ph - 1 : 3 - 4 * ph;
    else v = Math.sin(2 * Math.PI * ph);
    let env = t < attack ? t / attack : 1;
    if (t > dur) env *= Math.max(0, 1 - (t - dur) / release);
    const x = v * env * vol;
    L[i] += x * (1 - Math.max(0, pan)); R[i] += x * (1 + Math.min(0, pan));
  }
}
let lfsr = 0xace1; // deterministic noise (LFSR), like the NES noise channel
function noise() { const bit = ((lfsr >> 0) ^ (lfsr >> 2) ^ (lfsr >> 3) ^ (lfsr >> 5)) & 1; lfsr = (lfsr >> 1) | (bit << 15); return (lfsr & 1) * 2 - 1; }
function drum(t0, kind, vol = 0.12) {
  const d = kind === "hat" ? 0.03 : kind === "snare" ? 0.12 : 0.15;
  const s0 = Math.floor(t0 * SR), s1 = Math.min(N, Math.floor((t0 + d) * SR));
  for (let i = s0; i < s1; i++) {
    const t = (i - s0) / SR, env = Math.pow(1 - t / d, 2);
    let x;
    if (kind === "kick") x = Math.sin(2 * Math.PI * (120 - 600 * t) * t) * env * vol * 2.2;
    else x = noise() * env * vol * (kind === "hat" ? 0.5 : 1);
    L[i] += x; R[i] += x;
  }
}

// ── harmony helpers ──
const CH = { C: [60, 64, 67], G: [55, 59, 62], Am: [57, 60, 64], F: [53, 57, 60], Dm: [50, 53, 57], E: [52, 56, 59], Em: [52, 55, 59] };
function section({ start, end, bpm, chords, beatsPerChord = 4, arp = 4, arpDuty = 0.25, arpVol = 0.07, bass = true, bassVol = 0.16, drums = "none", lead = null, octave = 12 }) {
  const beat = 60 / bpm;
  let t = start, ci = 0;
  while (t < end - 0.01) {
    const ch = CH[chords[ci % chords.length]];
    const chordEnd = Math.min(end, t + beatsPerChord * beat);
    // arpeggio (pulse wave)
    const step = beat / arp;
    for (let k = 0, at = t; at < chordEnd - 0.005; k++, at += step) {
      const n = ch[k % 3] + octave + (k % 6 >= 3 ? 12 : 0);
      note(at, step * 0.7, midi(n), { duty: arpDuty, vol: arpVol, pan: 0.3 });
    }
    // bass (triangle) on beats
    if (bass) for (let b = 0, at = t; at < chordEnd - 0.005; b++, at += beat) note(at, beat * 0.8, midi(ch[0] - 12), { wave: "tri", vol: bassVol, release: 0.03 });
    // drums
    for (let b = 0, at = t; at < chordEnd - 0.005; b++, at += beat) {
      if (drums === "none") continue;
      if (b % 2 === 0) drum(at, "kick", 0.11); else if (drums !== "light") drum(at, "snare", 0.07);
      drum(at + beat / 2, "hat", 0.06);
      if (drums === "busy") { drum(at + beat / 4, "hat", 0.04); drum(at + (3 * beat) / 4, "hat", 0.04); }
    }
    t = chordEnd; ci++;
  }
  if (lead) lead.forEach(([beatAt, len, n]) => { const at = start + beatAt * beat; if (at < end) note(at, len * beat * 0.9, midi(n), { duty: 0.5, vol: 0.075, pan: -0.3, attack: 0.01 }); });
}

// ── arrangement (scene cuts: 2.70 · 5.16 · 9.84 · 16.24 · 20.90 · 28.68 · 31.92) ──
section({ start: 0, end: 2.7, bpm: 132, chords: ["Am"], beatsPerChord: 8, arp: 4, drums: "busy", arpVol: 0.06 });           // hook: tense pulse
note(2.55, 0.15, midi(76), { duty: 0.5, vol: 0.06, slide: -24 });                                                               // rewind zip
section({ start: 2.7, end: 5.16, bpm: 120, chords: ["C", "G"], beatsPerChord: 2.46 / 0.5 / 2, arp: 2, drums: "none", arpVol: 0.06 }); // promise: bright
section({ start: 5.16, end: 9.84, bpm: 116, chords: ["C", "G", "Am", "F"], beatsPerChord: 2, arp: 2, drums: "light",          // the spa: cozy
  lead: [[0, 1, 72], [1, 1, 76], [2, 2, 79], [4, 1, 74], [5, 1, 71], [6, 2, 72]] });
section({ start: 9.84, end: 16.24, bpm: 140, chords: ["Am", "F", "C", "G"], beatsPerChord: 2, arp: 4, drums: "busy", arpVol: 0.065 }); // avalanche
section({ start: 16.24, end: 20.9, bpm: 84, chords: ["Am", "Dm", "E", "Am"], beatsPerChord: 2, arp: 1, bass: true, bassVol: 0.1, drums: "none", arpVol: 0.05,
  lead: [[0, 2, 69], [2, 2, 65], [4, 2, 64], [6, 2, 64]] });                                                                      // the loss: slow, minor
section({ start: 20.9, end: 28.68, bpm: 126, chords: ["F", "G", "C", "Am"], beatsPerChord: 2, arp: 4, drums: "busy",            // Parlana: bright groove
  lead: [[0, 0.5, 72], [0.5, 0.5, 74], [1, 1, 77], [2, 1, 79], [3, 1, 76], [4, 1, 74], [5, 1, 72], [6, 2, 76], [8, 0.5, 77], [8.5, 0.5, 79], [9, 1, 81], [10, 2, 79],
    [12, 1, 76], [13, 1, 74], [14, 2, 72]] });
section({ start: 28.68, end: 31.92, bpm: 116, chords: ["C", "G", "F", "C"], beatsPerChord: 1.5, arp: 2, drums: "light",          // calm, full agenda
  lead: [[0, 1, 76], [1, 1, 79], [2, 2, 84], [4, 2, 79]] });
section({ start: 31.92, end: 34.4, bpm: 120, chords: ["F", "G"], beatsPerChord: 2.5, arp: 4, drums: "light" });                 // CTA build
CH.Cend = [60, 64, 67];
[48, 60, 64, 67, 72].forEach((n, i) => note(34.4, 0.6, midi(n), { wave: i === 0 ? "tri" : "square", duty: 0.25, vol: i === 0 ? 0.14 : 0.06, release: 0.3 })); // final chord

// ── master: gentle one-pole lowpass (tames 8-bit fizz), soft clip, normalize, fades ──
function lp(buf, a) { let y = 0; for (let i = 0; i < buf.length; i++) { y += a * (buf[i] - y); buf[i] = y; } }
lp(L, 0.35); lp(R, 0.35);
let peak = 0; for (let i = 0; i < N; i++) { L[i] = Math.tanh(L[i] * 1.2); R[i] = Math.tanh(R[i] * 1.2); peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i])); }
const g = 0.89 / peak;
const fadeIn = 0.05 * SR, fadeOut = 0.4 * SR;
const out = Buffer.alloc(44 + N * 4);
out.write("RIFF", 0); out.writeUInt32LE(36 + N * 4, 4); out.write("WAVE", 8); out.write("fmt ", 12); out.writeUInt32LE(16, 16);
out.writeUInt16LE(1, 20); out.writeUInt16LE(2, 22); out.writeUInt32LE(SR, 24); out.writeUInt32LE(SR * 4, 28); out.writeUInt16LE(4, 32); out.writeUInt16LE(16, 34);
out.write("data", 36); out.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  let f = 1; if (i < fadeIn) f = i / fadeIn; if (i > N - fadeOut) f = (N - i) / fadeOut;
  out.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * g * f)) * 32767), 44 + i * 4);
  out.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * g * f)) * 32767), 46 + i * 4);
}
fs.mkdirSync("assets/audio", { recursive: true });
fs.writeFileSync("assets/audio/bgm-chiptune.wav", out);
console.log("bgm-chiptune.wav", DUR + "s");
