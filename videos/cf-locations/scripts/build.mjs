// Builds index.html — talking-head edit for "Contenido por país con Astro + Cloudflare".
// Layers: camera (footage + zoom/split moves) → scene overlays/cards → captions → SFX.
// All beat times come from assets/words.json (SRT, char-weighted) — see STORYBOARD.md.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const words = JSON.parse(fs.readFileSync(path.join(root, "assets/words.json"), "utf8"));
const DUR = 111.778;
const SPLIT_Y = 640; // camera drop in SPLIT mode (face lands in the lower strip)

// ---------------------------------------------------------------- captions
const KEY = [
  [/^cloudflare/i, "k-cf"],
  [/^astro/i, "k-astro"],
  [/^(pricing|precios|bolivianos|pesos|colombianos|moneda|bs|cop|convierta)/i, "k-money"],
  [/^(país|headers?|código|url|parlana\.bo|modismos|nativa|automática|automáticamente)/i, "k-hl"],
  [/^(vpn|redirect|selector|query|params)/i, "k-warn"],
];
const keyClass = (w) => (KEY.find(([re]) => re.test(w.replace(/^[¿¡]/, ""))) || [, ""])[1];
const groups = [];
let g = [];
words.forEach((w, i) => {
  const next = words[i + 1];
  g.push(w);
  const chars = g.map((x) => x.text).join(" ").length;
  const punct = /[.,?!:]$/.test(w.text);
  const gap = next ? next.start - w.end : 9;
  if (!next || punct || gap > 0.22 || g.length >= 4 || (chars > 16 && g.length >= 2)) {
    groups.push(g);
    g = [];
  }
});
const capHTML = groups
  .map(
    (grp, gi) =>
      `<div class="cap" id="cap${gi}">${grp
        .map((w, wi) => `<span class="w ${keyClass(w.text)}" id="cap${gi}w${wi}">${w.text}</span>`)
        .join(" ")}</div>`,
  )
  .join("\n");
const capJS = JSON.stringify(
  groups.map((grp, gi) => ({
    s: grp[0].start,
    e: groups[gi + 1] ? groups[gi + 1][0].start : Math.min(DUR, grp.at(-1).end + 0.6),
    w: grp.map((w) => w.start),
  })),
);

// ---------------------------------------------------------------- SFX
const SFX = [
  // F1 hook
  ["whoosh-short", 0.27, 0.45], ["pop", 0.65, 0.4], ["pop", 3.91, 0.45],
  // F2
  ["whoosh-short", 5.08, 0.5], ["pop", 10.36, 0.4], ["pop", 11.59, 0.4], ["pop", 13.16, 0.4],
  // F3 problem card
  ["whoosh", 15.2, 0.5], ["click", 16.92, 0.5], ["click", 18.22, 0.5], ["error", 19.62, 0.32],
  ["whoosh-short", 20.96, 0.4], ["key-press", 22.3, 0.35], ["key-press", 22.55, 0.35],
  ["key-press", 22.8, 0.35], ["key-press", 23.05, 0.35], ["chime", 23.59, 0.4],
  ["error", 27.76, 0.32], ["ping", 28.86, 0.4],
  // F4 solution
  ["whoosh", 29.86, 0.5], ["impact-bass-1", 30.88, 0.55], ["whoosh", 32.24, 0.5],
  ["sparkle", 32.68, 0.35], ["whoosh-short", 34.12, 0.4], ["pop", 34.33, 0.35], ["pop", 35.71, 0.35],
  ["ping", 39.45, 0.45], ["pop", 40.73, 0.4],
  // F5 code
  ["whoosh", 42.08, 0.5], ["key-press", 42.25, 0.35], ["key-press", 42.6, 0.35],
  ["key-press", 42.95, 0.35], ["key-press", 43.3, 0.35], ["key-press", 43.65, 0.35],
  ["click", 44.82, 0.5], ["pop", 47.44, 0.35], ["click", 48.45, 0.5], ["ping", 50.52, 0.5],
  // F6 tone
  ["whoosh-short", 52.32, 0.45], ["whoosh", 55.64, 0.5], ["whoosh-short", 59.0, 0.4],
  ["whoosh-short", 60.17, 0.4], ["whoosh-short", 61.13, 0.4], ["impact-bass-2", 64.74, 0.55],
  // F7 parlana
  ["whoosh", 65.2, 0.5], ["key-press", 70.35, 0.35], ["key-press", 70.65, 0.35],
  ["key-press", 70.95, 0.35], ["key-press", 71.25, 0.35], ["key-press", 71.55, 0.35],
  ["whoosh-short", 72.72, 0.45], ["pop", 74.94, 0.45], ["whoosh-short", 79.84, 0.45],
  ["cha-ching", 80.32, 0.6], ["sparkle", 83.63, 0.3],
  ...[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => ["pop", 85.12 + i * 0.1, 0.22]),
  // F8–F11
  ["whoosh", 89.0, 0.5], ["pop", 90.64, 0.4], ["pop", 91.89, 0.4], ["impact-bass-1", 95.04, 0.45],
  ["notification", 98.43, 0.35], ["whoosh", 101.44, 0.5], ["click", 103.2, 0.5],
  ["click", 103.95, 0.5], ["click", 104.62, 0.5], ["click", 106.3, 0.5], ["chime", 107.6, 0.4],
  ["whoosh-short", 108.64, 0.45], ["pop", 109.25, 0.5],
];
const SFX_LEN = {
  "whoosh-short": 0.575, whoosh: 0.575, pop: 0.72, click: 0.366, error: 1.62, "key-press": 0.4,
  chime: 2.5, ping: 1.32, sparkle: 1.8, "impact-bass-1": 2.116, "impact-bass-2": 2.592,
  notification: 2.455, "cha-ching": 1.4,
};
// Greedy lane packing: each SFX goes on the first track whose last clip already ended.
const laneEnds = [];
const sfxHTML = SFX.map(([n, t, v], i) => {
  const d = Math.min(SFX_LEN[n], DUR - t);
  let lane = laneEnds.findIndex((end) => end <= t);
  if (lane < 0) lane = laneEnds.push(0) - 1;
  laneEnds[lane] = t + d;
  return `<audio id="sfx${i}" src="assets/sfx/${n}.mp3" data-start="${t}" data-duration="${d.toFixed(3)}" data-track-index="${20 + lane}" data-volume="${v}"></audio>`;
}).join("\n      ");

// ---------------------------------------------------------------- helpers
const flag = (cc, w = 64) =>
  `<img class="flag" src="assets/flags/${cc}.svg" style="width:${w}px;height:${Math.round((w * 3) / 4)}px;">`;
const clip = (id, start, end, inner, extra = "") =>
  `<div id="${id}" class="clip scene ${extra}" data-start="${start}" data-duration="${(end - start).toFixed(3)}" data-track-index="3">${inner}</div>`;
const browser = (id, url, content) => `
  <div class="browser" id="${id}">
    <div class="chrome"><i></i><i></i><i></i>
      <div class="url"><span class="lock">🔒</span><span class="url-t" id="${id}-url">${url}</span></div>
    </div>
    <div class="viewport">${content}</div>
  </div>`;

// Pricing screenshot geometry (css px of the 1280×900 capture, dpr 2)
const PX = 32, PY = 190, PW = 1216, S = 1000 / PW; // css → panel px
const BG = (img) => `background-image:url(assets/shots/${img});background-size:${(2560 * S) / 2}px ${(1800 * S) / 2}px;`;
const win = (id, cx, cy, cw, ch) => {
  const L = (cx - PX) * S, T = (cy - PY) * S, W = cw * S, H = ch * S;
  const pos = `background-position:${-cx * S}px ${-cy * S}px;`;
  return `<div class="roll" id="${id}" style="left:${L}px;top:${T}px;width:${W}px;height:${H}px;">
      <div class="roll-in" id="${id}-in" style="height:${H * 2}px;">
        <div style="width:${W}px;height:${H}px;${BG("pricing-bo.png")}${pos}"></div>
        <div style="width:${W}px;height:${H}px;${BG("pricing-co.png")}${pos}"></div>
      </div></div>`;
};
const PRICE_X = [62.59, 476.92, 889.25];

// ---------------------------------------------------------------- scenes
const astroChip = (id) => `<div class="chip-logo ink" id="${id}"><img src="assets/astro-logo-light-gradient.png" style="width:330px;height:117px;object-fit:cover;"></div>`;
const cfChip = (id) => `<div class="chip-logo paper" id="${id}"><img src="assets/CF-Logo%201.png" style="width:290px;height:98px;"></div>`;

const F1 = clip("f1", 0, 5.4, `
  <div class="band row center" style="top:150px;gap:22px;">${astroChip("f1-astro")}<div class="x" id="f1-x">×</div>${cfChip("f1-cf")}</div>
  <div class="band row center" style="top:330px;"><div class="pill paper" id="f1-pin">📍 ${flag("bo", 52)} <b>Bolivia</b></div></div>`);

const F2 = clip("f2", 5.08, 15.6, `
  <div class="band row center" style="top:190px;gap:18px;">
    <div class="pill paper big" id="f2-a">💰 Pricing</div>
    <div class="pill paper big" id="f2-b">🗣️ Modismos</div>
    <div class="pill cf big" id="f2-c">📍 Por país</div>
  </div>`);

const F3 = clip("f3", 15.2, 30.3, `
  <div class="card paper-bg" id="f3-card">
    <div class="kicker" id="f3-k">Las formas típicas</div>
    <h1 class="h1" id="f3-t">¿Cómo adapto mi sitio por país?</h1>
    <div class="opts" id="f3-opts">
      <div class="opt" id="f3-o1"><div class="mock-select">🌎 Selecciona tu país <span>▾</span></div><div class="lbl">Selector</div><div class="strike" id="f3-s1"></div><div class="xmark" id="f3-x1">✕</div></div>
      <div class="opt" id="f3-o2"><div class="mock-url">parlana.bo<b>/?country=co</b></div><div class="lbl">Query params</div><div class="strike" id="f3-s2"></div><div class="xmark" id="f3-x2">✕</div></div>
      <div class="opt" id="f3-o3"><div class="mock-url">parlana.bo <b>→ /co</b></div><div class="lbl">Redirect</div><div class="strike" id="f3-s3"></div><div class="xmark" id="f3-x3">✕</div></div>
    </div>
    <div class="want" id="f3-want">
      <div class="lbl dark">Lo que uno quiere</div>
      <div class="bigurl"><span class="lock">🔒</span><span id="f3-url" class="typed">parlana.bo</span><span class="ok" id="f3-ok">✓</span></div>
      <div class="adapted" id="f3-ad">${flag("bo", 48)} <span>Precios en <b>Bs</b> · contenido local</span></div>
      <div class="auto" id="f3-auto">⚡ Automático</div>
    </div>
  </div>`);

const F4a = clip("f4a", 29.86, 32.6, `
  <div class="band row center" style="top:170px;gap:22px;">${astroChip("f4-astro")}<div class="x" id="f4-x">×</div>${cfChip("f4-cf")}</div>`);

const F4 = clip("f4", 32.24, 42.6, `
  <div class="panel" id="f4-panel">
    <div class="panel-in" id="f4-press">${browser("f4-br", "cloudflare.com/es-la/press/…", `
      <div style="position:absolute;left:0;top:0;width:1000px;height:1778px;transform-origin:0 0;" id="f4-shot">
        <img src="assets/shots/press.png" style="position:absolute;left:0;top:${-300 * (1000 / 1080)}px;width:1000px;height:${1920 * (1000 / 1080)}px;">
        <div class="marker" id="f4-mark" style="left:40px;top:116px;width:665px;height:52px;"></div>
        <div class="datebox" id="f4-date" style="left:338px;top:44px;width:262px;height:44px;"></div>
      </div>
      <div class="stamp" id="f4-stamp">Cloudflare compró Astro · ene 2026</div>`)}
    </div>
    <div class="panel-in diagram" id="f4-diag">
      <div class="kicker cfk" id="f4-dk">La red de Cloudflare</div>
      <div class="node user" id="f4-n1">${flag("co", 72)}<div><b>Usuario en Colombia</b><small>pide parlana.bo</small></div></div>
      <div class="wire" id="f4-w1" style="top:300px;"><i class="dot" id="f4-p1"></i></div>
      <div class="node edge" id="f4-n2"><img src="assets/CF-Logo%201.png" style="width:250px;height:84px;"><div><b>Edge más cercano</b><small>ve la IP → sabe el país</small></div>
        <div class="badge" id="f4-cc">country: "CO"</div></div>
      <div class="wire" id="f4-w2" style="top:620px;"><i class="dot" id="f4-p2"></i></div>
      <div class="node astro" id="f4-n3"><img src="assets/astro-logo-light-gradient.png" style="width:250px;height:89px;object-fit:cover;"><div><b>Astro renderiza</b><small>con un pedacito de código</small></div>
        <div class="badge money" id="f4-out">precios en COP</div></div>
    </div>
  </div>`);

const CODE = [
  ["c", "---"],
  ["", `<span class="kw">const</span> request =`],
  ["", `  Astro.request <span class="kw">as</span> <span class="ty">CfRequest</span>;`],
  ["", ""],
  ["", `<span class="kw">const</span> cfCountry =`],
  ["L1", `  <span class="hl-cf" id="f5-h1">request.cf?.country</span> ??`],
  ["L2", `  <span class="hl-cy" id="f5-h2">request.headers.get(<span class="str">"CF-IPCountry"</span>)</span>;`],
  ["", ""],
  ["L3", `<span class="kw">const</span> initialCountry =`],
  ["", `  <span class="fn">countryFromCfCode</span>(cfCountry);`],
  ["c", "---"],
];
const F5 = clip("f5", 42.08, 52.7, `
  <div class="card ink-bg" id="f5-card">
    <div class="kicker cfk" id="f5-k">Este es el código</div>
    <div class="editor" id="f5-ed">
      <div class="tab"><span class="tabname">pricing.astro</span><span class="tabdim">src/pages</span></div>
      <div class="code">${CODE.map(([k, l], i) => `<div class="ln ${k === "c" ? "cm" : ""}" id="f5-l${i}"><em>${i + 1}</em><span class="lt">${l || "&nbsp;"}</span></div>`).join("")}</div>
      <div class="ccchip" id="f5-chip">${flag("bo", 46)}<span>"BO"</span></div>
      <div class="resolved" id="f5-res">→ Bolivia · precios en Bs</div>
    </div>
    <div class="edgebadge" id="f5-badge">☁️ Corre dentro de la red de Cloudflare</div>
  </div>`);

const F6 = clip("f6", 55.64, 65.6, `
  <div class="card paper-bg" id="f6-card">
    <div class="kicker" id="f6-k">Estrategia de contenido</div>
    <h1 class="h1" id="f6-t">Mismo sitio, otro tono</h1>
    <div class="hero-mock" id="f6-mock">
      <div class="mock-bar"><i></i><i></i><i></i><span>tusitio.com</span></div>
      <div class="greets">
        <div class="greet" id="f6-g1">${flag("co", 84)}<span>¡Quiubo, parce!</span></div>
        <div class="greet" id="f6-g2">${flag("bo", 84)}<span>¡Qué tal, che!</span></div>
        <div class="greet" id="f6-g3">${flag("pe", 84)}<span>¡Qué tal, causa!</span></div>
      </div>
      <div class="mock-lines"><i style="width:70%"></i><i style="width:52%"></i></div>
    </div>
    <div class="pricing-word" id="f6-p">PRICING</div>
    <div class="row center cur" id="f6-cur"><span>Bs</span><span>COP</span><span>S/</span><span>MXN</span><span>USD</span></div>
  </div>`);

const F7 = clip("f7", 65.2, 89.7, `
  <div class="panel" id="f7-panel">
    <div class="panel-in" id="f7-in">${browser("f7-br", "parlana.bo", `
      <div class="page" id="f7-hero"><img src="assets/shots/parlana-hero.png" style="width:1000px;height:${1920 * (1000 / 1080)}px;"></div>
      <div class="page" id="f7-pricing">
        <div style="position:absolute;left:0;top:0;width:1000px;height:${710 * S}px;${BG("pricing-bo.png")}background-position:${-PX * S}px ${-PY * S}px;"></div>
        ${PRICE_X.map((x, i) => win(`f7-r${i}`, x - 4, 712, 304, 66)).join("")}
        ${win("f7-rs", 546, 396, 190, 52)}
        <div class="ring" id="f7-ring" style="left:${(50 - PX) * S}px;top:${(704 - PY) * S}px;width:${(1150) * S}px;height:${82 * S}px;"></div>
        <div class="pin" id="f7-pin" style="left:${(735 - PX) * S}px;top:${(374 - PY) * S}px;">
          <div class="pin-f" id="f7-pbo">${flag("bo", 56)}</div><div class="pin-f" id="f7-pco">${flag("co", 56)}</div></div>
        <div class="flags" id="f7-flags" style="top:${710 * S + 26}px;">
          <div class="flags-t">Detecta y adapta en</div>
          <div class="row center" style="gap:14px;">${["bo", "pe", "co", "mx", "ar", "cl", "ec", "br", "us"].map((c, i) => `<div class="fl" id="f7-fl${i}">${flag(c, 74)}<span>${c.toUpperCase()}</span></div>`).join("")}</div>
        </div>
      </div>`)}
    </div>
  </div>`);

const F8 = clip("f8", 89.0, 95.9, `
  <div class="band col center" style="top:120px;gap:14px;">
    <div class="pill paper big" id="f8-a">Mismo idioma.</div>
    <div class="pill paper big" id="f8-b">Misma moneda.</div>
    <div class="pill money big" id="f8-c">Más conversión ↗</div>
  </div>`);

const F9 = clip("f9", 98.2, 101.5, `
  <div class="band row center" style="top:200px;"><div class="pill warn big" id="f9-a">⚠️ Con VPN → ve el país de la VPN</div></div>`);

const F10 = clip("f10", 101.44, 109.0, `
  <div class="card ink-bg" id="f10-card">
    <div class="kicker cfk" id="f10-k">Contenido por país</div>
    <h1 class="h1 light" id="f10-t">Sin fricción, desde el edge</h1>
    <div class="checks">
      <div class="check" id="f10-c1"><i>✓</i>Automático</div>
      <div class="check" id="f10-c2"><i>✓</i>Sin redirect</div>
      <div class="check" id="f10-c3"><i>✓</i>Sin query params</div>
      <div class="check" id="f10-c4"><i>✓</i>Nativo</div>
    </div>
    <div class="row center" style="gap:22px;margin-top:70px;">${cfChip("f10-cf")}<div class="x light" id="f10-x">×</div>${astroChip("f10-astro")}</div>
  </div>`);

const F11 = clip("f11", 108.64, DUR, `
  <div class="band row center" style="top:190px;"><div class="sticker" id="f11-s">#NoEsPublicidad 😅</div></div>`);

// ---------------------------------------------------------------- page
const html = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      :root { --ink:#18181b; --paper:#fafafa; --slate:#27272a; --cyan:#06b6d4; --emerald:#10b981; --cf:#F38020; --astro:#e9469d; --zinc:#f4f4f5; --red:#ef4444; --amber:#f59e0b; }
      * { margin:0; padding:0; box-sizing:border-box; }
      html, body { width:1080px; height:1920px; overflow:hidden; background:var(--ink); }
      body { font-family: Inter, sans-serif; color:var(--ink); }
      #root { position:relative; width:1080px; height:1920px; overflow:hidden; background:var(--ink); }
      .clip { position:absolute; left:0; top:0; width:1080px; height:1920px; }
      .scene { pointer-events:none; z-index:10; }
      #cam-frame { position:absolute; inset:0; overflow:hidden; z-index:1; }
      #cam { position:absolute; left:0; top:0; width:1080px; height:1920px; transform-origin:50% 32%; }
      #a-roll { position:absolute; left:0; top:0; width:1080px; height:1920px; object-fit:cover; }
      .flag { display:inline-block; border-radius:8px; object-fit:cover; box-shadow:0 0 0 2px rgba(24,24,27,.12); vertical-align:middle; }
      .row { display:flex; align-items:center; } .col { display:flex; flex-direction:column; align-items:center; }
      .center { justify-content:center; }
      .band { position:absolute; left:0; width:1080px; }
      .x { font:900 64px Inter; color:var(--ink); } .x.light { color:var(--paper); }
      .chip-logo { width:370px; height:150px; border-radius:36px; display:flex; align-items:center; justify-content:center; box-shadow:0 18px 40px rgba(24,24,27,.28); }
      .chip-logo.ink { background:var(--ink); border:3px solid #3f3f46; } .chip-logo.paper { background:var(--paper); }
      .pill { display:flex; align-items:center; gap:14px; padding:18px 30px; border-radius:999px; font:800 40px Inter; box-shadow:0 14px 34px rgba(24,24,27,.25); white-space:nowrap; }
      .pill.big { font-size:46px; padding:22px 36px; }
      .pill.paper { background:var(--paper); color:var(--ink); }
      .pill.cf { background:var(--cf); color:var(--ink); }
      .pill.money { background:var(--emerald); color:var(--ink); }
      .pill.warn { background:var(--ink); color:var(--paper); border:4px solid var(--amber); font-size:40px; }
      .sticker { background:var(--cf); color:var(--ink); font:900 58px Inter; padding:24px 40px; border-radius:28px; box-shadow:0 20px 44px rgba(24,24,27,.35); }

      /* full-screen cards — content stays in 120–1380, caption rail lives at ~1500 */
      .card { position:absolute; inset:0; padding:150px 70px 0; display:flex; flex-direction:column; }
      .paper-bg { background:var(--paper); } .ink-bg { background:var(--ink); }
      .kicker { font:700 30px 'JetBrains Mono', monospace; letter-spacing:.12em; text-transform:uppercase; color:#0e7490; }
      .kicker.cfk { color:var(--cf); }
      .h1 { font:900 76px/1.02 Inter; letter-spacing:-.035em; color:var(--ink); margin-top:18px; max-width:940px; }
      .h1.light { color:var(--paper); }
      .opts { margin-top:46px; display:flex; flex-direction:column; gap:22px; }
      .opt { position:relative; display:flex; align-items:center; justify-content:space-between; background:#fff; border:3px solid #e4e4e7; border-radius:26px; padding:26px 30px; height:118px; }
      .opt .lbl { font:700 26px 'JetBrains Mono', monospace; color:#52525b; text-transform:uppercase; letter-spacing:.08em; margin-right:90px; }
      .lbl.dark { font:700 26px 'JetBrains Mono', monospace; color:#52525b; text-transform:uppercase; letter-spacing:.08em; }
      .mock-select { font:700 36px Inter; color:var(--ink); border:3px solid #d4d4d8; border-radius:14px; padding:10px 20px; }
      .mock-select span { color:#71717a; margin-left:10px; }
      .mock-url { font:700 36px 'JetBrains Mono', monospace; color:var(--ink); } .mock-url b { color:#c2410c; }
      .strike { position:absolute; left:24px; right:24px; top:56px; height:6px; background:var(--red); border-radius:4px; transform-origin:0 50%; }
      .xmark { position:absolute; right:26px; top:26px; width:64px; height:64px; border-radius:50%; background:var(--red); color:#fff; font:900 38px/64px Inter; text-align:center; }
      .want { margin-top:40px; display:flex; flex-direction:column; gap:20px; }
      .bigurl { display:flex; align-items:center; gap:18px; background:#fff; border:4px solid var(--emerald); border-radius:999px; padding:26px 40px; font:700 54px 'JetBrains Mono', monospace; color:var(--ink); box-shadow:0 18px 40px rgba(16,185,129,.18); }
      .typed { display:inline-block; overflow:hidden; white-space:nowrap; width:330px; }
      .ok { margin-left:auto; width:70px; height:70px; border-radius:50%; background:var(--emerald); color:#fff; font:900 44px/70px Inter; text-align:center; }
      .adapted { display:flex; align-items:center; gap:18px; font:700 38px Inter; color:var(--ink); padding-left:10px; }
      .auto { align-self:flex-start; font:800 34px Inter; background:var(--ink); color:var(--paper); padding:14px 26px; border-radius:999px; }

      .panel { position:absolute; left:0; top:0; width:1080px; height:1080px; background:var(--zinc); overflow:hidden; border-bottom:6px solid var(--cf); }
      .panel-in { position:absolute; inset:0; }
      .browser { position:absolute; left:40px; top:56px; width:1000px; height:980px; background:#fff; border-radius:28px; overflow:hidden; box-shadow:0 30px 70px rgba(24,24,27,.22); }
      .chrome { height:84px; background:#f4f4f5; border-bottom:2px solid #e4e4e7; display:flex; align-items:center; gap:12px; padding:0 26px; }
      .chrome > i { width:18px; height:18px; border-radius:50%; background:#d4d4d8; }
      .url { margin-left:22px; flex:1; height:54px; border-radius:999px; background:#fff; border:2px solid #e4e4e7; display:flex; align-items:center; gap:12px; padding:0 24px; font:700 30px 'JetBrains Mono', monospace; color:var(--ink); }
      .url-t { display:inline-block; overflow:hidden; white-space:nowrap; }
      .viewport { position:absolute; left:0; top:84px; width:1000px; height:896px; overflow:hidden; }
      .page { position:absolute; left:0; top:0; width:1000px; height:896px; overflow:hidden; background:#fff; }
      .marker { position:absolute; background:rgba(243,128,32,.38); mix-blend-mode:multiply; border-radius:6px; transform-origin:0 50%; }
      .datebox { position:absolute; border:4px solid var(--cf); border-radius:10px; }
      .stamp { position:absolute; left:0; right:0; margin:0 auto; width:max-content; bottom:40px; background:var(--ink); color:var(--paper); font:800 36px Inter; padding:18px 30px; border-radius:999px; white-space:nowrap; }
      .diagram { padding:60px 70px 0; }
      .node { position:absolute; left:110px; width:860px; border-radius:30px; display:flex; align-items:center; gap:28px; padding:26px 34px; }
      .node b { display:block; font:900 40px Inter; letter-spacing:-.02em; } .node small { display:block; font:600 28px Inter; margin-top:6px; }
      .node.user { top:150px; background:#fff; border:3px solid #d4d4d8; color:var(--ink); } .node.user small { color:#52525b; }
      .node.edge { top:380px; background:#fff; border:4px solid var(--cf); color:var(--ink); } .node.edge small { color:#52525b; }
      .node.astro { top:700px; background:var(--ink); color:var(--paper); } .node.astro small { color:#d4d4d8; }
      .wire { position:absolute; left:536px; width:8px; height:80px; background:repeating-linear-gradient(var(--cf) 0 12px, transparent 12px 22px); }
      .dot { position:absolute; left:-10px; top:0; width:28px; height:28px; border-radius:50%; background:var(--cf); box-shadow:0 0 0 8px rgba(243,128,32,.25); }
      .badge { position:absolute; right:-24px; top:-30px; font:700 34px 'JetBrains Mono', monospace; background:var(--ink); color:var(--cf); padding:12px 22px; border-radius:16px; box-shadow:0 12px 26px rgba(24,24,27,.3); }
      .badge.money { background:var(--emerald); color:var(--ink); }

      .editor { position:relative; margin-top:30px; background:var(--slate); border-radius:30px; border:2px solid rgba(244,244,245,.12); overflow:visible; }
      .tab { display:flex; align-items:baseline; gap:18px; padding:22px 34px; border-bottom:2px solid rgba(244,244,245,.1); }
      .tabname { font:700 30px 'JetBrains Mono', monospace; color:var(--paper); } .tabdim { font:400 24px 'JetBrains Mono', monospace; color:#a1a1aa; }
      .code { padding:22px 26px 30px; }
      .ln { display:flex; font:400 37px/1.55 'JetBrains Mono', monospace; color:var(--zinc); white-space:pre; }
      .ln em { font-style:normal; color:#71717a; width:58px; flex:none; }
      .ln.cm { color:#a1a1aa; }
      .lt { display:inline-block; overflow:hidden; }
      .kw { color:#c084fc; } .ty { color:var(--cyan); } .fn { color:#fbbf24; } .str { color:#86efac; }
      .hl-cf, .hl-cy { border-radius:8px; padding:0 4px; margin:0 -4px; }
      .ccchip { position:absolute; display:flex; align-items:center; gap:14px; left:600px; top:540px; background:var(--cf); color:var(--ink); font:700 40px 'JetBrains Mono', monospace; padding:12px 22px; border-radius:999px; box-shadow:0 16px 34px rgba(0,0,0,.35); }
      .resolved { position:absolute; left:34px; bottom:-74px; font:800 34px Inter; color:var(--emerald); }
      .edgebadge { margin-top:110px; align-self:flex-start; font:800 34px Inter; color:var(--paper); background:rgba(243,128,32,.16); border:3px solid var(--cf); padding:18px 28px; border-radius:999px; }

      .hero-mock { margin-top:44px; background:#fff; border:3px solid #e4e4e7; border-radius:30px; overflow:hidden; box-shadow:0 24px 50px rgba(24,24,27,.12); }
      .mock-bar { display:flex; align-items:center; gap:10px; height:64px; padding:0 24px; background:#f4f4f5; border-bottom:2px solid #e4e4e7; }
      .mock-bar i { width:14px; height:14px; border-radius:50%; background:#d4d4d8; } .mock-bar span { margin-left:18px; font:700 26px 'JetBrains Mono', monospace; color:#52525b; }
      .greets { position:relative; height:190px; overflow:hidden; }
      .greet { position:absolute; inset:0; display:flex; align-items:center; gap:26px; padding:0 44px; font:900 74px Inter; letter-spacing:-.035em; color:var(--ink); }
      .mock-lines { padding:0 44px 40px; display:flex; flex-direction:column; gap:16px; } .mock-lines i { height:22px; border-radius:11px; background:#e4e4e7; }
      .pricing-word { margin-top:60px; font:900 168px/1 Inter; letter-spacing:-.05em; color:var(--cf); text-align:center; }
      .cur { gap:16px; margin-top:26px; } .cur span { font:700 34px 'JetBrains Mono', monospace; background:var(--ink); color:var(--emerald); padding:12px 22px; border-radius:16px; }

      .roll { position:absolute; overflow:hidden; } .roll-in { position:absolute; left:0; top:0; width:100%; }
      .ring { position:absolute; border:5px solid var(--emerald); border-radius:18px; box-shadow:0 0 0 10px rgba(16,185,129,.18); }
      .pin { position:absolute; width:96px; height:96px; }
      .pin-f { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; background:var(--ink); border-radius:50% 50% 50% 8px; box-shadow:0 14px 30px rgba(24,24,27,.35); }
      .flags { position:absolute; left:0; width:1000px; }
      .flags-t { text-align:center; font:700 26px 'JetBrains Mono', monospace; color:#52525b; text-transform:uppercase; letter-spacing:.1em; margin-bottom:16px; }
      .fl { display:flex; flex-direction:column; align-items:center; gap:6px; font:700 22px 'JetBrains Mono', monospace; color:var(--ink); }

      .checks { margin-top:56px; display:flex; flex-direction:column; gap:26px; }
      .check { display:flex; align-items:center; gap:28px; font:900 74px Inter; letter-spacing:-.03em; color:var(--paper); }
      .check i { font-style:normal; width:84px; height:84px; border-radius:50%; background:var(--emerald); color:var(--ink); font:900 50px/84px Inter; text-align:center; }

      /* caption rail */
      #caps { position:absolute; left:0; top:0; width:1080px; height:1920px; z-index:50; pointer-events:none; }
      .cap { position:absolute; left:70px; top:1430px; width:940px; text-align:center; font:900 68px/1.12 Inter; letter-spacing:-.02em; color:#fff; paint-order:stroke fill; -webkit-text-stroke:10px var(--ink); text-shadow:0 6px 22px rgba(0,0,0,.45); }
      .cap .w { display:inline-block; margin:0 .09em; }
      .k-cf { color:var(--cf); } .k-astro { color:#ec4899; } .k-money { color:#34d399; } .k-hl { color:#22d3ee; } .k-warn { color:#fbbf24; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="1080" data-height="1920">
      <div id="cam-frame"><div id="cam">
        <video id="a-roll" class="clip" src="assets/locations.mp4" data-start="0" data-duration="${DUR}" data-track-index="0" muted playsinline></video>
      </div></div>
      <audio id="a-roll-audio" src="assets/locations.mp4" data-start="0" data-duration="${DUR}" data-track-index="10" data-volume="1"></audio>
      ${[F1, F2, F3, F4a, F4, F5, F6, F7, F8, F9, F10, F11].join("\n      ")}
      <div id="caps">
${capHTML}
      </div>
      ${sfxHTML}
    </div>

    <script>
      const tl = gsap.timeline({ paused: true });
      const CAPS = ${capJS};
      const E4 = "power4", R = 230;

      // ---------- motion vocabulary
      const hide = (s) => gsap.set(s, { autoAlpha: 0 });
      const pop = (s, t, d = 0.38) => tl.fromTo(s, { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: d, ease: "back.out(1.6)", immediateRender: false }, t);
      const rise = (s, t, d = 0.45, y = 40) => tl.fromTo(s, { y, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: d, ease: "power3.out", immediateRender: false }, t);
      const inR = (s, t, d = 0.36) => tl.fromTo(s, { x: R, autoAlpha: 0.35 }, { x: 0, autoAlpha: 1, duration: d, ease: E4 + ".out", immediateRender: false }, t);
      const outL = (s, t, d = 0.3) => { tl.to(s, { x: -R, duration: d, ease: E4 + ".in" }, t); tl.to(s, { autoAlpha: 0, duration: d * 0.75, ease: "power1.in" }, t); };
      const outUp = (s, t, d = 0.3) => { tl.to(s, { y: -120, duration: d, ease: E4 + ".in" }, t); tl.to(s, { autoAlpha: 0, duration: d * 0.75, ease: "power1.in" }, t); };
      const zoomIn = (s, t, d = 0.42) => tl.fromTo(s, { scale: 0.86, autoAlpha: 0.35 }, { scale: 1, autoAlpha: 1, duration: d, ease: E4 + ".out", immediateRender: false }, t);
      const cam = (t, vars, d = 0.28, ease = E4 + ".out") => tl.to("#cam", { ...vars, duration: d, ease }, t);
      const push = (t, scale, d) => tl.to("#cam", { scale, duration: d, ease: "none" }, t);

      // ---------- camera (zooms + split moves) — anchored between the eyes
      gsap.set("#cam", { scale: 1, x: 0, y: 0 });
      push(0, 1.05, 3.7);
      cam(3.74, { scale: 1.18 });                       // "al país"
      cam(5.08, { scale: 1.3 }, 0.22);                  // "¿Y para qué…?"
      cam(6.72, { scale: 1.0 }, 0.5, "power2.inOut");   // "Normalmente"
      push(7.25, 1.07, 7.9);
      tl.set("#cam", { scale: 1.12 }, 29.5);             // hidden under the problem card
      push(29.86, 1.06, 0.9);
      cam(30.88, { scale: 1.22 }, 0.25);                // "Astro y Cloudflare" impact
      cam(32.24, { scale: 1, y: ${SPLIT_Y} }, 0.55, "power3.inOut"); // → SPLIT (down)
      tl.set("#cam", { y: 0, scale: 1.0 }, 51.9);         // under code card
      push(52.32, 1.08, 3.3);
      tl.set("#cam", { y: ${SPLIT_Y}, scale: 1, x: 0 }, 64.9); // under tone card
      cam(89.0, { y: 0, scale: 1.18 }, 0.55, "power3.inOut"); // SPLIT → FACE (up)
      push(89.6, 1.24, 6.1);
      cam(95.76, { scale: 1.02 }, 0.45, "power2.inOut");    // "Obviamente…"
      push(96.3, 1.1, 5.1);
      tl.set("#cam", { scale: 1.0 }, 108.3);
      push(108.64, 1.05, 0.6);
      cam(109.25, { scale: 1.32 }, 0.2);                // "Cloudflare no me paga nada"

      // ---------- F1 hook
      ["#f1-astro", "#f1-x", "#f1-cf", "#f1-pin"].forEach(hide);
      tl.fromTo("#f1-astro", { x: -R, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.45, ease: E4 + ".out", immediateRender: false }, 0.27);
      pop("#f1-x", 0.55, 0.3);
      tl.fromTo("#f1-cf", { x: R, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.45, ease: E4 + ".out", immediateRender: false }, 0.65);
      pop("#f1-pin", 3.91);
      outUp("#f1 .band", 5.08, 0.28);

      // ---------- F2 why
      ["#f2-a", "#f2-b", "#f2-c"].forEach(hide);
      pop("#f2-a", 10.36); pop("#f2-b", 11.59); pop("#f2-c", 13.16);
      outL("#f2 .band", 15.2);

      // ---------- F3 problem (card)
      ["#f3-card", "#f3-o1", "#f3-o2", "#f3-o3", "#f3-want", "#f3-ok", "#f3-ad", "#f3-auto", "#f3-x1", "#f3-x2", "#f3-x3"].forEach(hide);
      gsap.set(["#f3-s1", "#f3-s2", "#f3-s3"], { scaleX: 0 });
      gsap.set("#f3-url", { width: 0 });
      inR("#f3-card", 15.2);
      tl.fromTo(["#f3-k", "#f3-t"], { x: 120, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.4, stagger: 0.08, ease: E4 + ".out", immediateRender: false }, 15.3);
      inR("#f3-o1", 16.92); inR("#f3-o2", 18.22);
      tl.to("#f3-s1", { scaleX: 1, duration: 0.3, ease: "power3.out" }, 19.62); pop("#f3-x1", 19.62, 0.3);
      tl.to("#f3-s2", { scaleX: 1, duration: 0.3, ease: "power3.out" }, 19.79); pop("#f3-x2", 19.79, 0.3);
      tl.to(["#f3-o1", "#f3-o2"], { opacity: 0.45, duration: 0.3 }, 20.1);
      rise("#f3-want", 20.96);
      tl.to("#f3-url", { width: 330, duration: 0.95, ease: "steps(10)" }, 22.27);
      pop("#f3-ok", 23.59); rise("#f3-ad", 23.75, 0.4, 24);
      inR("#f3-o3", 26.86);
      tl.to("#f3-s3", { scaleX: 1, duration: 0.3, ease: "power3.out" }, 27.76); pop("#f3-x3", 27.76, 0.3);
      tl.to("#f3-o3", { opacity: 0.45, duration: 0.3 }, 28.1);
      pop("#f3-auto", 28.86);
      outL("#f3-card", 29.86);

      // ---------- F4a lockup on the face
      ["#f4-astro", "#f4-x", "#f4-cf"].forEach(hide);
      tl.fromTo("#f4-astro", { scale: 1.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: E4 + ".out", immediateRender: false }, 30.88);
      pop("#f4-x", 31.1, 0.25);
      tl.fromTo("#f4-cf", { scale: 1.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: E4 + ".out", immediateRender: false }, 31.38);
      tl.to("#f4a .band", { y: 380, autoAlpha: 0, duration: 0.4, ease: E4 + ".in" }, 32.2);

      // ---------- F4 split: press release → edge diagram
      gsap.set("#f4-panel", { y: -1080 });
      tl.to("#f4-panel", { y: 0, duration: 0.55, ease: "power3.inOut" }, 32.24);
      gsap.set("#f4-mark", { scaleX: 0 }); hide("#f4-date"); hide("#f4-stamp");
      tl.to("#f4-mark", { scaleX: 1, duration: 0.45, ease: "power2.out" }, 32.68);
      tl.fromTo("#f4-date", { scale: 1.3, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: "power3.out", immediateRender: false }, 33.23);
      pop("#f4-stamp", 33.46);
      outL("#f4-press", 34.12);
      ["#f4-diag", "#f4-n1", "#f4-n2", "#f4-n3", "#f4-w1", "#f4-w2", "#f4-cc", "#f4-out"].forEach(hide);
      gsap.set(["#f4-p1", "#f4-p2"], { y: 0, autoAlpha: 0 });
      inR("#f4-diag", 34.12);
      rise("#f4-n1", 34.2); rise("#f4-n2", 34.33); rise("#f4-w1", 34.6, 0.3, 10);
      rise("#f4-n3", 35.71); rise("#f4-w2", 35.9, 0.3, 10);
      tl.set("#f4-p1", { autoAlpha: 1 }, 36.6); tl.to("#f4-p1", { y: 52, duration: 0.6, ease: "power2.inOut" }, 36.6); tl.set("#f4-p1", { autoAlpha: 0 }, 37.25);
      pop("#f4-cc", 39.45);
      tl.set("#f4-p2", { autoAlpha: 1 }, 40.0); tl.to("#f4-p2", { y: 52, duration: 0.6, ease: "power2.inOut" }, 40.0); tl.set("#f4-p2", { autoAlpha: 0 }, 40.65);
      pop("#f4-out", 40.73);
      tl.to("#f4-panel", { scale: 1.08, duration: 0.36, ease: E4 + ".in" }, 42.08);

      // ---------- F5 code card
      hide("#f5-card"); hide("#f5-chip"); hide("#f5-res"); hide("#f5-badge");
      zoomIn("#f5-card", 42.08);
      ${CODE.map((_, i) => `gsap.set("#f5-l${i} .lt", { clipPath: "inset(0 100% 0 0)" });`).join(" ")}
      ${CODE.map((_, i) => `tl.to("#f5-l${i} .lt", { clipPath: "inset(0 0% 0 0)", duration: 0.16, ease: "steps(6)" }, ${(42.2 + i * 0.16).toFixed(2)});`).join("\n      ")}
      tl.to("#f5-h2", { backgroundColor: "rgba(6,182,212,.30)", duration: 0.25 }, 44.82);
      pop("#f5-badge", 47.44);
      tl.to("#f5-h2", { backgroundColor: "rgba(6,182,212,0)", duration: 0.25 }, 48.3);
      tl.to("#f5-h1", { backgroundColor: "rgba(243,128,32,.34)", duration: 0.25 }, 48.45);
      tl.fromTo("#f5-chip", { x: -260, y: -150, scale: 0.5, autoAlpha: 0 }, { x: 0, y: 0, scale: 1, autoAlpha: 1, duration: 0.6, ease: "power3.out", immediateRender: false }, 50.52);
      rise("#f5-res", 51.37, 0.4, 20);
      outL("#f5-card", 52.32);

      // ---------- F6 tone card
      hide("#f6-card"); hide("#f6-mock"); hide("#f6-p"); hide("#f6-cur");
      ["#f6-g1", "#f6-g2", "#f6-g3"].forEach((s) => gsap.set(s, { yPercent: 100, autoAlpha: 0 }));
      inR("#f6-card", 55.64);
      tl.fromTo(["#f6-k", "#f6-t"], { x: 120, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.4, stagger: 0.08, ease: E4 + ".out", immediateRender: false }, 55.74);
      rise("#f6-mock", 57.03);
      const flip = (inS, outS, t) => { if (outS) tl.to(outS, { yPercent: -100, autoAlpha: 0, duration: 0.3, ease: E4 + ".in" }, t); tl.to(inS, { yPercent: 0, autoAlpha: 1, duration: 0.36, ease: E4 + ".out" }, t + (outS ? 0.12 : 0)); };
      flip("#f6-g1", null, 59.0); flip("#f6-g2", "#f6-g1", 60.17); flip("#f6-g3", "#f6-g2", 61.13);
      tl.fromTo("#f6-p", { scale: 1.8, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.32, ease: E4 + ".out", immediateRender: false }, 64.74);
      tl.fromTo("#f6-cur span", { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.3, stagger: 0.05, ease: "power3.out", immediateRender: false }, 64.9);
      outL("#f6-card", 65.2);

      // ---------- F7 parlana split
      hide("#f7-in"); hide("#f7-pricing"); hide("#f7-ring"); hide("#f7-pin"); hide("#f7-pco");
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `hide("#f7-fl${i}");`).join(" ")}
      hide("#f7-flags");
      inR("#f7-in", 65.2);
      tl.fromTo("#cam-frame", { x: R }, { x: 0, duration: 0.36, ease: E4 + ".out", immediateRender: false }, 65.2);
      gsap.set("#f7-br-url", { width: 0 });
      tl.set("#f7-br-url", { width: 190 }, 65.2);
      tl.set("#f7-br-url", { width: 0 }, 70.2);
      tl.to("#f7-br-url", { width: 190, duration: 1.3, ease: "steps(10)" }, 70.35);
      tl.to("#f7-hero", { y: -896, duration: 0.6, ease: "power3.inOut" }, 72.72);
      tl.fromTo("#f7-pricing", { y: 896, autoAlpha: 1 }, { y: 0, duration: 0.6, ease: "power3.inOut", immediateRender: false }, 72.72);
      pop("#f7-pin", 74.94);
      tl.fromTo("#f7-ring", { scale: 0.96, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: "power3.out", immediateRender: false }, 77.68);
      tl.to("#f7-ring", { autoAlpha: 0, duration: 0.2 }, 79.7);
      tl.to("#f7-pbo", { rotationY: 90, duration: 0.18, ease: "power2.in" }, 79.84);
      tl.fromTo("#f7-pco", { rotationY: -90, autoAlpha: 1 }, { rotationY: 0, duration: 0.22, ease: "power2.out", immediateRender: false }, 80.02);
      ["#f7-rs-in", "#f7-r0-in", "#f7-r1-in", "#f7-r2-in"].forEach((s, i) =>
        tl.to(s, { yPercent: -50, duration: 0.45, ease: "back.out(1.4)" }, 80.1 + i * 0.08));
      tl.fromTo("#f7-ring", { scale: 0.96, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: "power3.out", immediateRender: false }, 83.63);
      tl.to("#f7-ring", { autoAlpha: 0, duration: 0.2 }, 85.0);
      tl.set("#f7-flags", { autoAlpha: 1 }, 85.0);
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `pop("#f7-fl${i}", ${(85.12 + i * 0.1).toFixed(2)}, 0.3);`).join(" ")}
      tl.to("#f7-panel", { y: -1080, duration: 0.55, ease: "power3.inOut" }, 89.0);

      // ---------- F8 benefit
      ["#f8-a", "#f8-b", "#f8-c"].forEach(hide);
      pop("#f8-a", 90.64); pop("#f8-b", 91.89); pop("#f8-c", 95.04);
      outUp("#f8 .band", 95.55);

      // ---------- F9 VPN caveat
      hide("#f9-a"); pop("#f9-a", 98.43); outUp("#f9-a", 101.1);

      // ---------- F10 summary card
      hide("#f10-card"); ["#f10-c1", "#f10-c2", "#f10-c3", "#f10-c4", "#f10-cf", "#f10-x", "#f10-astro"].forEach(hide);
      zoomIn("#f10-card", 101.44);
      tl.fromTo(["#f10-k", "#f10-t"], { x: 120, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.4, stagger: 0.08, ease: E4 + ".out", immediateRender: false }, 101.55);
      inR("#f10-c1", 103.2); inR("#f10-c2", 103.95); inR("#f10-c3", 104.62); inR("#f10-c4", 106.3);
      pop("#f10-cf", 107.6); pop("#f10-x", 107.9, 0.25); pop("#f10-astro", 108.17);
      outL("#f10-card", 108.64);

      // ---------- F11 close
      hide("#f11-s");
      tl.fromTo("#f11-s", { scale: 0.3, rotation: -28, autoAlpha: 0 }, { scale: 1, rotation: -6, autoAlpha: 1, duration: 0.45, ease: "back.out(1.7)", immediateRender: false }, 109.25);

      // ---------- captions (word-by-word karaoke build)
      gsap.set(".cap", { autoAlpha: 0 });
      gsap.set(".cap .w", { autoAlpha: 0, y: 18, scale: 0.85 });
      CAPS.forEach((c, gi) => {
        tl.set("#cap" + gi, { autoAlpha: 1 }, c.s);
        c.w.forEach((t, wi) => tl.to("#cap" + gi + "w" + wi, { autoAlpha: 1, y: 0, scale: 1, duration: 0.14, ease: "back.out(2)" }, t));
        tl.set("#cap" + gi, { autoAlpha: 0 }, c.e);
      });

      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
`;
fs.writeFileSync(path.join(root, "index.html"), html);
console.log("index.html", (html.length / 1024).toFixed(0) + "KB", groups.length, "caption groups", SFX.length, "sfx");
