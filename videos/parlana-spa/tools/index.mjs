// Assembles index.html: scenes on the voice's timing, pixel-wipe transitions,
// flash, voice + chiptune bed + SFX. Run: node tools/index.mjs
import fs from "fs";
const DUR = 35.3;
const SCENES = [
  ["f01", "01-hook", 0, 2.7], ["f02", "02-promesa", 2.7, 2.46], ["f03", "03-spa", 5.16, 4.68], ["f04", "04-avalancha", 9.84, 6.4],
  ["f05", "05-perdida", 16.24, 4.66], ["f06", "06-parlana", 20.9, 1.74], ["f07", "07-agente", 22.64, 6.04], ["f08", "08-calma", 28.68, 3.24],
  ["f09", "09-cta", 31.92, 3.38],
];
// SFX: per-file gain (measured raw levels) so hits sit under the -16 LUFS voice; accent 1 = normal
const BASE = { "impact-bass-1": 0.14, "impact-bass-2": 0.11, "glitch-2": 0.2, riser: 0.3, sparkle: 0.4, whoosh: 0.45, "whoosh-short": 0.45, pop: 0.55,
  notification: 0.55, chime: 0.8, click: 0.9, error: 1, ping: 0.8, "key-press": 0.8 };
const LEN = { whoosh: 0.57, "whoosh-short": 0.57, pop: 0.72, notification: 2.45, "impact-bass-1": 2.1, "impact-bass-2": 2.59, riser: 10.03, "glitch-2": 3.5,
  error: 1.62, ping: 1.32, chime: 2.5, sparkle: 1.8, click: 0.36, "key-press": 0.4 };
const SFX = [
  [0.05, "notification", 0.8], [0.66, "pop"], [1.16, "pop"], [1.5, "pop"], [1.8, "notification", 0.7], [2.2, "pop"], [2.45, "pop"],
  [2.7, "glitch-2", 1, { dur: 0.45 }], [3.36, "sparkle"], [3.7, "ping", 0.6], [4.12, "ping", 0.6], [4.54, "ping", 0.6],
  [5.06, "whoosh"], [6.16, "pop"], [6.56, "whoosh-short"], [7.31, "click"], [7.6, "ping", 0.5], [7.78, "pop"], [8.0, "ping", 0.5], [8.31, "pop"], [9.11, "chime", 0.8],
  [9.84, "notification", 0.8], [9.9, "pop", 0.7], [10.15, "pop", 0.7], [10.4, "pop", 0.7], [10.92, "pop"], [11.64, "pop"], [12.53, "pop"],
  [13.24, "whoosh-short", 0.8], [13.3, "pop", 0.6], [13.9, "pop", 0.6], [14.5, "notification", 0.6], [15.09, "error", 0.7],
  [16.14, "whoosh"], [16.96, "key-press"], [17.7, "error", 0.6], [19.1, "pop"], [19.4, "riser", 1, { ms: 8.5, dur: 1.5 }], [20.46, "impact-bass-1", 0.8],
  [20.9, "impact-bass-2"], [20.95, "sparkle"], [21.2, "whoosh-short", 0.8], [21.6, "pop"],
  [22.72, "pop"], [23.97, "ping"], [25.09, "ping"], [25.49, "pop"], [25.79, "ping"], [26.36, "pop"], [26.84, "chime"], [27.62, "pop"], [28.04, "ping"],
  [28.58, "whoosh"], [30.13, "sparkle"], [31.43, "chime", 0.8], [31.92, "whoosh-short"], [31.95, "sparkle", 0.8], [33.82, "pop"], [34.34, "click"],
].sort((a, b) => a[0] - b[0]);
const lanes = [];
const lane = (t, d) => { let k = lanes.findIndex((e) => e <= t); if (k < 0) { k = lanes.length; lanes.push(0); } lanes[k] = t + d; return 20 + k; };
const audio = SFX.map(([t, f, acc = 1, o = {}], i) => {
  const d = Math.min(o.dur || LEN[f], DUR - t).toFixed(2);
  const ms = o.ms != null ? ` data-media-start="${o.ms}"` : "";
  return `      <audio id="sfx-${String(i + 1).padStart(2, "0")}" src="assets/sfx/${f}.mp3" data-start="${t}" data-duration="${d}"${ms} data-track-index="${lane(t, +d)}" data-volume="${Math.min(1, BASE[f] * acc).toFixed(3)}"></audio>`;
}).join("\n");
const scenes = SCENES.map(([id, f, s, d], i) =>
  `      <div id="${id}" class="clip" data-composition-id="${id}" data-composition-src="compositions/frames/${f}.html" data-start="${s}" data-duration="${d}" data-track-index="${1 + (i % 2)}" data-width="1080" data-height="1920"></div>`).join("\n");

fs.writeFileSync("index.html", `<!DOCTYPE html>
<html lang="es" data-resolution="portrait">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=1080, height=1920">
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { margin: 0; width: 1080px; height: 1920px; overflow: hidden; background: #00260f; }
      #root { position: relative; width: 1080px; height: 1920px; overflow: hidden; background: #00260f; }
      .clip { position: absolute; inset: 0; }
      #wipe { position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; pointer-events: none; z-index: 40; }
      .wb { position: absolute; width: 90px; height: 90px; background: #00260f; transform: scale(0); }
      #flash { position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; background: #e6f9ee; opacity: 0; z-index: 41; pointer-events: none; }
      #captions { z-index: 50; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="1080" data-height="1920">
${scenes}
      <div id="wipe"></div>
      <div id="flash"></div>
      <div id="captions" class="clip" data-composition-id="captions" data-composition-src="compositions/captions.html" data-start="0" data-duration="${DUR}" data-track-index="5" data-track-kind="captions" data-width="1080" data-height="1920"></div>

      <!-- Voice: the user's own recording (assets/audio.wav), high-passed + loudnorm −16 LUFS -->
      <audio id="voice" src="assets/vo/voice.wav" data-start="0" data-duration="34.8" data-track-index="10" data-volume="1"></audio>
      <!-- Original chiptune bed (tools/chiptune.mjs), sections cut on the scene changes -->
      <audio id="bgm" src="assets/audio/bgm-chiptune.wav" data-start="0" data-duration="${DUR}" data-track-index="11" data-volume="0.08"></audio>
      <!-- SFX (media-use bundled library), each on the beat it punctuates -->
${audio}
    </div>
    <script>
      (function () {
        var tl = gsap.timeline({ paused: true });
        // Pixel-wipe transition: a 12×22 grid of ink blocks covers the frame in a
        // diagonal stepped cascade, the scene cuts underneath, then it uncovers.
        var wipe = document.getElementById("wipe"), blocks = [];
        for (var r = 0; r < 22; r++) for (var c = 0; c < 12; c++) {
          var b = document.createElement("div"); b.className = "wb";
          b.style.left = c * 90 + "px"; b.style.top = r * 90 + "px"; wipe.appendChild(b);
          blocks.push({ el: b, d: (r + c) / 32 });
        }
        function pixelWipe(cut) {
          blocks.forEach(function (o) {
            tl.fromTo(o.el, { scale: 0 }, { scale: 1, duration: 0.06, ease: "steps(2)", immediateRender: false }, cut - 0.24 + o.d * 0.18);
            tl.fromTo(o.el, { scale: 1 }, { scale: 0, duration: 0.06, ease: "steps(2)", immediateRender: false }, cut + 0.02 + o.d * 0.18);
          });
        }
        [5.16, 16.24, 28.68].forEach(pixelWipe);
        // Parlana's arrival: mint flash
        tl.fromTo("#flash", { opacity: 0.95 }, { opacity: 0, duration: 0.35, ease: "steps(5)", immediateRender: false }, 20.9);
        window.__timelines["main"] = tl;
      })();
    </script>
  </body>
</html>
`);
console.log("index.html:", SCENES.length, "scenes,", SFX.length, "sfx");
