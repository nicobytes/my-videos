// Soundtrack: original voice (0 dB) + synthesized 120 BPM bed (−12 dB) + SFX placed from beats.json,
// normalized to −14 LUFS integrated / −1 dBTP. Output: public/mix.m4a (AAC 48 kHz).
import { readFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const SRC = dirname(fileURLToPath(import.meta.url));
const PUB = join(SRC, "..", "public");
const AUD = join(PUB, "audio");
const FFMPEG = process.env.FFMPEG || "ffmpeg";
const beats = JSON.parse(readFileSync(join(SRC, "beats.json"), "utf8"));
const ff = (args) => execFileSync(FFMPEG, ["-y", "-v", "error", ...args], { stdio: "inherit" });

mkdirSync(AUD, { recursive: true });
const synth = {
  bass: ["-f", "lavfi", "-i", "aevalsrc='sin(2*PI*(45+60*exp(-20*t))*t)*exp(-4*t)*0.9':s=48000:d=0.8"],
  whoosh: ["-f", "lavfi", "-i", "anoisesrc=d=0.7:c=pink:r=48000", "-af", "afade=t=in:d=0.3,afade=t=out:st=0.3:d=0.4,lowpass=f=1800,volume=0.8"],
  pop: ["-f", "lavfi", "-i", "aevalsrc='sin(2*PI*900*t)*exp(-60*t)*0.5':s=48000:d=0.15"],
  tick: ["-f", "lavfi", "-i", "aevalsrc='sin(2*PI*2200*t)*exp(-120*t)*0.4':s=48000:d=0.06"],
  ding: ["-f", "lavfi", "-i", "aevalsrc='sin(2*PI*1760*t)*exp(-6*t)*0.4':s=48000:d=1.2"],
  // brush swish: short band-passed noise with a fast attack — the sound of a marker stroke
  swish: ["-f", "lavfi", "-i", "anoisesrc=d=0.32:c=white:r=48000", "-af", "afade=t=in:d=0.04,afade=t=out:st=0.08:d=0.24,bandpass=f=3200:w=2200,volume=0.6"],
};
for (const [name, args] of Object.entries(synth)) ff([...args, "-ac", "1", "-c:a", "pcm_s16le", join(AUD, `${name}.wav`)]);
{
  // regenerated every run so it always matches beats.duration
  ff(["-f", "lavfi", "-i", "aevalsrc='0.8*sin(2*PI*(45+40*exp(-25*mod(t\\,0.5)))*mod(t\\,0.5))*exp(-7*mod(t\\,0.5))+0.12*(random(0)*2-1)*exp(-50*mod(t+0.25\\,0.5))+0.18*sin(2*PI*55*t)*exp(-3*mod(t\\,0.25))':s=48000:d=" + beats.duration, "-ac", "1", "-c:a", "pcm_s16le", join(AUD, "music.wav")]);
}

const inputs = ["-i", join(PUB, "voice.wav"), "-i", join(AUD, "music.wav")];
let filter = "[1:a]volume=0.25[m];";
let labels = "[0:a][m]";
beats.sfx.forEach((e, i) => {
  const idx = i + 2;
  const ms = Math.round(e.t * 1000);
  inputs.push("-i", join(AUD, `${e.type}.wav`));
  filter += `[${idx}:a]adelay=${ms}|${ms},volume=${e.gain}[s${idx}];`;
  labels += `[s${idx}]`;
});
filter += `${labels}amix=inputs=${beats.sfx.length + 2}:normalize=0:duration=first,loudnorm=I=-14:TP=-1:LRA=11[out]`;
ff([...inputs, "-filter_complex", filter, "-map", "[out]", "-t", String(beats.duration), "-c:a", "aac", "-b:a", "192k", "-ar", "48000", join(PUB, "mix.m4a")]);
console.log(`mix.m4a written with ${beats.sfx.length} SFX events`);
