// Wireframe sketch pass — one composition per storyboard frame (no motion).
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "compositions/frames");
fs.mkdirSync(dir, { recursive: true });

const INK = "#18181b", PAPER = "#fafafa", SLATE = "#27272a", CF = "#F38020";

// Background modes ---------------------------------------------------------
const face = (still) =>
  `<img class="bg" src="assets/stills/${still}" style="position:absolute;inset:0;width:1080px;height:1920px;object-fit:cover;filter:grayscale(1) brightness(.75);">`;
const split = (still) =>
  `<div style="position:absolute;left:0;top:1080px;width:1080px;height:840px;overflow:hidden;">
     <img src="assets/stills/${still}" style="position:absolute;left:0;top:-330px;width:1080px;height:1920px;object-fit:cover;filter:grayscale(1) brightness(.75);">
   </div>
   <div style="position:absolute;left:0;top:0;width:1080px;height:1080px;background:${PAPER};"></div>`;
const card = (bg = INK) => `<div style="position:absolute;inset:0;background:${bg};"></div>`;

// Primitives ----------------------------------------------------------------
const box = (x, y, w, h, label, opts = {}) =>
  `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;border:3px ${opts.dash ? "dashed" : "solid"} ${opts.c || "#a1a1aa"};border-radius:${opts.r ?? 24}px;background:${opts.bg || "transparent"};display:flex;align-items:center;justify-content:center;text-align:center;padding:16px;font:700 ${opts.fs || 34}px/1.15 Inter, sans-serif;color:${opts.tc || opts.c || "#a1a1aa"};">${label}</div>`;
const text = (x, y, w, t, fs, c = PAPER, opts = {}) =>
  `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;font:${opts.w || 800} ${fs}px/1.08 ${opts.mono ? "'JetBrains Mono', monospace" : "Inter, sans-serif"};color:${c};text-align:${opts.align || "left"};letter-spacing:${opts.ls || "-0.02em"};">${t}</div>`;
const caption = (y, t) =>
  `<div style="position:absolute;left:80px;top:${y}px;width:920px;text-align:center;font:800 54px/1.1 Inter, sans-serif;color:#fff;text-shadow:0 4px 18px rgba(0,0,0,.6);"><span style="background:rgba(24,24,27,.55);padding:10px 22px;border-radius:16px;">${t}</span></div>`;
const zoom = (t) =>
  `<div style="position:absolute;right:40px;top:1780px;font:700 26px Inter;color:${CF};background:rgba(24,24,27,.8);padding:8px 16px;border-radius:12px;">${t}</div>`;
const tag = (t) =>
  `<div style="position:absolute;left:40px;top:1780px;font:700 26px Inter;color:#a1a1aa;background:rgba(24,24,27,.8);padding:8px 16px;border-radius:12px;">${t}</div>`;

const frames = [
  ["01-hook", face("t3_8.jpg") +
    box(140, 150, 360, 150, "LOGO ASTRO", { c: "#e879f9" }) + text(510, 195, 60, "×", 64, PAPER, { align: "center" }) +
    box(580, 150, 360, 150, "LOGO CLOUDFLARE", { c: CF }) +
    box(470, 330, 140, 80, "📍 🇧🇴", { c: PAPER, fs: 40, r: 40 }) +
    caption(1340, "de acuerdo al <span style='color:" + CF + "'>país</span>") + zoom("ZOOM 1.00 → 1.18 en “país”") + tag("FACE")],

  ["02-para-que", face("t11_8.jpg") +
    box(90, 170, 280, 100, "💰 Pricing", { c: PAPER, r: 60 }) + box(400, 170, 320, 100, "🗣️ Modismos", { c: PAPER, r: 60 }) +
    box(750, 170, 240, 100, "📍 por país", { c: CF, r: 60 }) +
    caption(1340, "colocar un <span style='color:" + CF + "'>pricing</span>") + zoom("PUNCH 1.25 en “¿Y para qué?”") + tag("FACE")],

  ["03-problema", card(PAPER) +
    text(80, 140, 920, "Las formas típicas…", 72, INK) +
    box(80, 320, 920, 170, "Selecciona tu país ▾", { c: "#71717a", tc: INK }) + text(900, 360, 100, "✕", 90, "#ef4444") +
    box(80, 540, 920, 170, "parlana.bo/?country=co", { c: "#71717a", tc: INK }) + text(900, 580, 100, "✕", 90, "#ef4444") +
    box(80, 780, 920, 170, "parlana.bo → /co (redirect)", { c: "#71717a", tc: INK }) + text(900, 820, 100, "✕", 90, "#ef4444") +
    box(80, 1050, 920, 220, "🔒 parlana.bo &nbsp; ✓", { c: "#10b981", tc: INK, fs: 52 }) +
    text(80, 1300, 920, "Entras a la URL y ya está adaptado", 44, INK, { w: 700 }) +
    caption(1610, "no es la mejor experiencia") + tag("CARD")],

  ["04-solucion", split("t33_5.jpg") +
    box(60, 60, 960, 760, "SCREENSHOT · press release Cloudflare<br>“Cloudflare adquiere Astro…”<br><br>subrayado naranja: título + 16 ene 2026", { c: CF, tc: INK }) +
    box(60, 850, 960, 180, "después → globo / edge: 🇨🇴 usuario → nodo CF → country: “CO”", { c: "#06b6d4", tc: INK, fs: 30 }) +
    caption(1600, "<span style='color:" + CF + "'>Cloudflare</span> compró Astro") + tag("FACE → SPLIT")],

  ["05-codigo", card(INK) +
    text(60, 140, 960, "pricing.astro", 34, "#a1a1aa", { mono: true, w: 600 }) +
    `<div style="position:absolute;left:40px;top:210px;width:1000px;height:1000px;border-radius:28px;background:${SLATE};"></div>` +
    text(80, 270, 920, "const request = Astro.request as CfRequest;", 38, PAPER, { mono: true, w: 500, ls: "0" }) +
    text(80, 470, 920, "const cfCountry =<br>&nbsp;&nbsp;<span style='background:rgba(243,128,32,.25)'>request.cf?.country</span><br>&nbsp;&nbsp;?? <span style='background:rgba(6,182,212,.25)'>request.headers.get(\"CF-IPCountry\")</span>;", 38, PAPER, { mono: true, w: 500, ls: "0" }) +
    text(80, 800, 920, "const initialCountry =<br>&nbsp;&nbsp;countryFromCfCode(cfCountry);", 38, PAPER, { mono: true, w: 500, ls: "0" }) +
    box(640, 1060, 300, 110, "\"BO\" 🇧🇴", { c: CF, fs: 44, r: 60 }) +
    box(60, 1260, 960, 110, "☁️ corre en el edge de Cloudflare", { c: "#06b6d4", fs: 34, r: 60 }) +
    caption(1610, "me detecta el <span style='color:" + CF + "'>país</span>") + tag("CARD")],

  ["06-usos", card(PAPER) +
    text(80, 160, 920, "Mismo sitio, otro tono", 64, INK) +
    box(80, 360, 920, 220, "🇨🇴 ¡Quiubo, parce!", { c: INK, fs: 64, tc: INK }) +
    box(80, 620, 920, 160, "🇧🇴 ¡Qué tal, che!", { c: "#d4d4d8", fs: 48, tc: "#71717a", dash: true }) +
    box(80, 820, 920, 160, "🇵🇪 ¡Qué tal, causa!", { c: "#d4d4d8", fs: 48, tc: "#71717a", dash: true }) +
    text(80, 1100, 920, "PRICING", 180, CF, { align: "center", w: 900 }) +
    caption(1610, "adaptar el <span style='color:" + CF + "'>pricing</span>") + tag("FACE → CARD")],

  ["07-parlana", split("t82.jpg") +
    box(60, 60, 960, 90, "🔒 parlana.bo", { c: INK, tc: INK, r: 50 }) +
    box(60, 180, 960, 160, "Planes para crecer con Parlana · 📍🇧🇴 → 🇨🇴", { c: "#a1a1aa", tc: INK, fs: 32 }) +
    box(60, 370, 300, 420, "START<br><br>Bs 450<br>↓<br><b>COP 145.000</b>", { c: "#10b981", tc: INK, fs: 34 }) +
    box(390, 370, 300, 420, "GROW<br><br>Bs 760<br>↓<br><b>COP 250.000</b>", { c: "#10b981", tc: INK, fs: 34 }) +
    box(720, 370, 300, 420, "SCALE<br><br>Bs 1.260<br>↓<br><b>COP 415.000</b>", { c: "#10b981", tc: INK, fs: 34 }) +
    box(60, 830, 960, 200, "🇧🇴 🇵🇪 🇨🇴 🇲🇽 🇦🇷 🇨🇱 🇪🇨 🇧🇷 🇺🇸", { c: "#a1a1aa", fs: 58 }) +
    caption(1600, "en <span style='color:#10b981'>pesos colombianos</span>") + tag("SPLIT · screenshot real")],

  ["08-beneficio", face("t92.jpg") +
    text(80, 140, 920, "Mismo idioma.", 76, PAPER) + text(80, 230, 920, "Misma moneda.", 76, PAPER) +
    text(80, 320, 920, "Más conversión ↗", 76, "#10b981") +
    caption(1340, "que tu sitio <span style='color:#10b981'>convierta más</span>") + zoom("PUNCH 1.18 → push") + tag("FACE")],

  ["09-vpn", face("t97.jpg") +
    box(160, 170, 760, 130, "⚠️ Con VPN → ve el país de la VPN", { c: "#facc15", tc: PAPER, fs: 38, r: 60, bg: "rgba(24,24,27,.6)" }) +
    caption(1340, "alguna <span style='color:#facc15'>VPN</span>") + zoom("PUSH 1.10") + tag("FACE")],

  ["10-resumen", card(INK) +
    text(80, 200, 920, "Contenido por país", 76, PAPER) +
    text(80, 400, 920, "✓ Automático", 72, "#10b981") + text(80, 520, 920, "✓ Sin redirect", 72, "#10b981") +
    text(80, 640, 920, "✓ Sin query params", 72, "#10b981") + text(80, 760, 920, "✓ Nativo", 72, "#10b981") +
    box(140, 1000, 360, 150, "LOGO ASTRO", { c: "#e879f9" }) + text(510, 1045, 60, "×", 64, PAPER, { align: "center" }) +
    box(580, 1000, 360, 150, "LOGO CLOUDFLARE", { c: CF }) +
    caption(1610, "de forma <span style='color:#10b981'>nativa</span>") + tag("CARD")],

  ["11-cierre", face("t110.jpg") +
    box(300, 170, 480, 120, "#NoEsPublicidad 😅", { c: CF, tc: PAPER, fs: 42, r: 60, bg: "rgba(24,24,27,.6)" }) +
    caption(1340, "<span style='color:" + CF + "'>Cloudflare</span> no me paga nada") + zoom("PUNCH 1.30 cómico") + tag("FACE")],
];

for (const [id, body] of frames) {
  const html = `<template id="sk-${id}-template">
  <div id="sk-${id}" data-composition-id="sk-${id}" data-width="1080" data-height="1920" data-duration="3"
       style="position:relative;width:1080px;height:1920px;overflow:hidden;background:${INK};">
    ${body}
    <script>
      window.__timelines["sk-${id}"] = gsap.timeline({ paused: true });
    </script>
  </div>
</template>
`;
  fs.writeFileSync(path.join(dir, `${id}.html`), html);
}
console.log("sketches:", frames.length);
