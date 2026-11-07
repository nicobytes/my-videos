/**
 * Assembles videos/react/index.html — interleaved cutaways (face ↔ card)
 * Brand: shared/brand/FRAME.md · punch cards synced to SRT beats
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const DURATION = 96.533;

/** TikTok density: face gaps ≤ ~3.5s; punches synced to SRT beats. */
const PUNCHES = {
  "card-02": { in: 9.88, out: 15.2 }, // es un loop
  "card-03": { in: 18.92, out: 29.5 }, // tools + chips
  "card-04": { in: 33.12, out: 39.8 }, // Reasoning → Acting
  "card-04b": { in: 42.8, out: 47.5 }, // escribir un correo → se queda en loop
  "card-05a": { in: 50.8, out: 54.5 }, // no infinito / tokens
  "card-05": { in: 54.6, out: 61.8 }, // 100 / 50 / 10
  "card-06": { in: 65.5, out: 71.8 }, // Finish vs Ask
  "card-07": { in: 75.36, out: 82.0 }, // agéndame una cita
  "card-08": { in: 85.5, out: 91.8 }, // salir a ti → volver al loop → Answer
};

const css = `
@font-face { font-family: "Rubik"; src: url("fonts/Rubik-400-latin.woff2") format("woff2"); font-weight: 400; font-display: block; }
@font-face { font-family: "Rubik"; src: url("fonts/Rubik-800-latin.woff2") format("woff2"); font-weight: 800; font-display: block; }
@font-face { font-family: "JetBrains Mono"; src: url("fonts/JetBrainsMono-700-latin.woff2") format("woff2"); font-weight: 700; font-display: block; }
* { box-sizing: border-box; }
html, body {
  margin:0; padding:0; width:100%; height:100%; overflow:hidden; background:#0B1A17;
  font-family: Rubik, ui-sans-serif, system-ui, sans-serif;
}
#stage { position:relative; width:100%; height:100%; overflow:hidden; background:#0B1A17; }
.video-wrapper {
  position:absolute; left:0; top:0; width:1080px; height:1920px;
  overflow:hidden; z-index:1; opacity:1; pointer-events:none;
}
.video-wrapper video { width:100%; height:100%; object-fit:cover; display:block; }
.card-host { position:absolute; pointer-events:none; overflow:hidden; z-index:3; }
.card-host .card { position:relative; width:100%; height:100%; overflow:hidden; }
.clip { position:absolute; }
.caption-host {
  position:absolute; left:0; top:0; width:1080px; height:1920px;
  z-index:50; pointer-events:none; overflow:hidden;
}
`;

const BRAND = `
  --foam:#F3FBF8; --mist:#D5EDE6; --ink:#152A26; --night:#0B1A17; --foam-soft:#E8F6F1;
  --mango:#FF7A45; --lagoon:#1ECAD3; --butter:#FFE56A; --white:#FFFFFF;
  --sticker: 4px 4px 0 #152A26;
`;

function card01() {
  return `
<div class="card" data-card-id="card-01">
  <style>
    .card[data-card-id="card-01"] .root {
      ${BRAND}
      width:100%; height:100%; box-sizing:border-box; padding: 200px 56px 420px;
      display:flex; flex-direction:column; justify-content:center; gap: 28px;
      background: var(--foam); color: var(--ink);
      font-family: Rubik, ui-sans-serif, system-ui, sans-serif;
    }
    .card[data-card-id="card-01"] .kicker {
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 22px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
      color: var(--ink); opacity:0;
    }
    .card[data-card-id="card-01"] .hero {
      font-size: 96px; font-weight: 800; letter-spacing: -0.04em; line-height: 0.92; margin:0; opacity:0;
    }
    .card[data-card-id="card-01"] .hero em {
      font-style:normal; background: linear-gradient(180deg, transparent 55%, #FFE56A 55%);
    }
    .card[data-card-id="card-01"] .neq {
      font-size: 36px; font-weight: 800; opacity:0;
      padding: 16px 28px; border-radius: 9999px; background: var(--mist);
      box-shadow: var(--sticker); width: fit-content;
    }
    .card[data-card-id="card-01"] .neq span { font-weight: 800; text-decoration: line-through; }
    .card[data-card-id="card-01"] .pair {
      display:flex; flex-direction:column; gap: 14px;
    }
    .card[data-card-id="card-01"] .pill {
      opacity:0; padding: 22px 28px; border-radius: 1.5rem; font-size: 36px; font-weight: 800;
      background: var(--white); border: 2px solid var(--ink); box-shadow: var(--sticker);
    }
    .card[data-card-id="card-01"] .pill.a { background: var(--mango); }
    .card[data-card-id="card-01"] .pill.b { background: var(--lagoon); }
  </style>
  <div class="root">
    <div class="kicker" id="c01-kicker">Patrón de agentes</div>
    <h1 class="hero" id="c01-hero"><em>ReAct</em></h1>
    <div class="neq" id="c01-neq">≠ <span>React</span> el framework</div>
    <div class="pair">
      <div class="pill a" id="c01-a">Reasoning</div>
      <div class="pill b" id="c01-b">Acting</div>
    </div>
  </div>
</div>`;
}

function card02() {
  return `
<div class="card" data-card-id="card-02">
  <style>
    .card[data-card-id="card-02"] .root {
      ${BRAND}
      width:100%; height:100%; box-sizing:border-box; padding: 140px 48px 400px;
      display:flex; flex-direction:column; align-items:center; justify-content:flex-start; gap: 20px;
      background: var(--foam); color: var(--ink);
      font-family: Rubik, ui-sans-serif, system-ui, sans-serif;
    }
    .card[data-card-id="card-02"] .kicker {
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 22px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
      color: var(--ink); opacity:0; align-self:flex-start; margin-left: 24px;
    }
    .card[data-card-id="card-02"] .title {
      font-size: 68px; font-weight: 800; letter-spacing: -0.03em; line-height: 0.95; margin:0; opacity:0;
      align-self:flex-start; margin-left: 24px;
    }
    .card[data-card-id="card-02"] .title .slap {
      background: linear-gradient(180deg, transparent 55%, #FFE56A 55%);
    }
    .card[data-card-id="card-02"] .cycle {
      position:relative; width: 920px; height: 980px; margin-top: 12px;
    }
    .card[data-card-id="card-02"] .node {
      position:absolute; display:flex; align-items:center; justify-content:center;
      font-weight: 800; border: 3px solid var(--ink); box-shadow: var(--sticker);
      opacity:0; z-index:2;
    }
    .card[data-card-id="card-02"] .n-think {
      top: 80px; left: 330px;
      width: 260px; height: 260px; background: var(--lagoon);
      clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
      border: none; box-shadow: none;
      font-size: 30px;
    }
    .card[data-card-id="card-02"] .n-tool {
      top: 620px; left: 310px;
      padding: 22px 36px; border-radius: 2rem; background: var(--mango);
      font-size: 36px; gap: 12px;
    }
    .card[data-card-id="card-02"] .edge-label {
      position:absolute; font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 22px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
      color: var(--ink); opacity:0; z-index:3;
      padding: 8px 14px; border-radius: 9999px; background: var(--butter);
      box-shadow: var(--sticker);
    }
    .card[data-card-id="card-02"] .l-action { top: 380px; left: 70px; }
    .card[data-card-id="card-02"] .l-obs { top: 380px; right: 70px; }
    .card[data-card-id="card-02"] .svg-cycle {
      position:absolute; inset:0; width:100%; height:100%; z-index:1;
    }
    .card[data-card-id="card-02"] .svg-cycle path {
      fill:none; stroke:#152A26; stroke-width:4; stroke-linecap:round; stroke-linejoin:round;
      stroke-dasharray: 14 12; opacity:0.25;
    }
    .card[data-card-id="card-02"] .token {
      position:absolute; width: 28px; height: 28px; border-radius: 50%;
      background: var(--mango); border: 3px solid var(--ink); box-shadow: var(--sticker);
      z-index:4; opacity:0; left: 446px; top: 200px;
    }
    .card[data-card-id="card-02"] .step-hint {
      position:absolute; bottom: 40px; left: 50%; transform:translateX(-50%);
      font-size: 32px; font-weight: 800; opacity:0; white-space:nowrap;
      padding: 14px 28px; border-radius: 9999px; background: var(--mist);
      box-shadow: var(--sticker);
    }
    .card[data-card-id="card-02"] .node.on {
      outline: 6px solid rgba(255,122,69,0.45); outline-offset: 6px;
    }
  </style>
  <div class="root">
    <div class="kicker" id="c02-kicker">ReAct pattern</div>
    <h1 class="title" id="c02-title">Es un <span class="slap">loop</span></h1>
    <div class="cycle" id="c02-cycle">
      <svg class="svg-cycle" viewBox="0 0 920 980" aria-hidden="true">
        <!-- left: Thinking → Tool (Action) -->
        <path id="c02-path-action" d="M 360 280 C 120 360, 120 560, 360 680" />
        <!-- right: Tool → Thinking (Observation) -->
        <path id="c02-path-obs" d="M 560 680 C 800 560, 800 360, 560 280" />
      </svg>
      <div class="node n-think" id="c02-think"><span>Thinking</span></div>
      <div class="edge-label l-action" id="c02-lact">Action</div>
      <div class="node n-tool" id="c02-tool"><span>🔧</span><span>Tool</span></div>
      <div class="edge-label l-obs" id="c02-lobs">Observation</div>
      <div class="token" id="c02-token"></div>
      <div class="step-hint" id="c02-hint">Thinking → Tool → Thinking</div>
    </div>
  </div>
</div>`;
}

function card03() {
  return `
<div class="card" data-card-id="card-03">
  <style>
    .card[data-card-id="card-03"] .root {
      ${BRAND}
      width:100%; height:100%; box-sizing:border-box; padding: 180px 56px 420px;
      display:flex; flex-direction:column; justify-content:center; gap: 24px;
      background: var(--foam); color: var(--ink);
      font-family: Rubik, ui-sans-serif, system-ui, sans-serif;
    }
    .card[data-card-id="card-03"] .kicker {
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 22px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
      color: var(--ink); opacity:0;
    }
    .card[data-card-id="card-03"] .title {
      font-size: 56px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.02; margin:0; opacity:0;
    }
    .card[data-card-id="card-03"] .tool-box {
      display:flex; align-items:center; gap: 20px; opacity:0;
      padding: 28px 32px; border-radius: 2rem; background: var(--mango); color: var(--ink);
      box-shadow: var(--sticker); max-width: 520px;
    }
    .card[data-card-id="card-03"] .tool-icon { font-size: 48px; }
    .card[data-card-id="card-03"] .tool-label { font-size: 40px; font-weight: 800; letter-spacing: -0.02em; }
    .card[data-card-id="card-03"] .chips { display:flex; flex-wrap:wrap; gap: 14px; margin-top: 8px; }
    .card[data-card-id="card-03"] .chip {
      padding: 18px 26px; border-radius: 9999px; font-size: 28px; font-weight: 800;
      background: var(--mist); color: var(--ink); box-shadow: var(--sticker); opacity:0;
    }
  </style>
  <div class="root">
    <div class="kicker" id="c03-kicker">Mundo exterior</div>
    <h1 class="title" id="c03-title">Tools para actuar</h1>
    <div class="tool-box" id="c03-tool">
      <span class="tool-icon">🔧</span>
      <span class="tool-label">Tool</span>
    </div>
    <div class="chips">
      <span class="chip" id="c03-a">archivos</span>
      <span class="chip" id="c03-b">bases de datos</span>
      <span class="chip" id="c03-c">calendar</span>
      <span class="chip" id="c03-d">agendar cita</span>
    </div>
  </div>
</div>`;
}

function card04() {
  return `
<div class="card" data-card-id="card-04">
  <style>
    .card[data-card-id="card-04"] .root {
      ${BRAND}
      width:100%; height:100%; box-sizing:border-box; padding: 200px 56px 420px;
      display:flex; flex-direction:column; justify-content:center; gap: 28px;
      background: var(--foam); color: var(--ink);
      font-family: Rubik, ui-sans-serif, system-ui, sans-serif;
    }
    .card[data-card-id="card-04"] .kicker {
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 22px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
      color: var(--ink); opacity:0;
    }
    .card[data-card-id="card-04"] .eq {
      font-size: 44px; font-weight: 800; letter-spacing: -0.02em; opacity:0;
    }
    .card[data-card-id="card-04"] .names {
      display:flex; flex-direction:column; gap: 18px;
    }
    .card[data-card-id="card-04"] .name {
      padding: 28px 32px; border-radius: 1.5rem; font-size: 44px; font-weight: 800;
      background: var(--mist); color: var(--ink); box-shadow: var(--sticker); opacity:0;
    }
    .card[data-card-id="card-04"] .name.hot { background: var(--mango); }
    .card[data-card-id="card-04"] .name .sub {
      display:block; font-size: 24px; font-weight: 400; margin-top: 8px; opacity: 0.75;
    }
  </style>
  <div class="root">
    <div class="kicker" id="c04-kicker">El nombre</div>
    <div class="eq" id="c04-eq">ReAct =</div>
    <div class="names">
      <div class="name" id="c04-reason">Reasoning<span class="sub">razona tools + goal</span></div>
      <div class="name" id="c04-acting">Acting<span class="sub">actúa con las herramientas</span></div>
    </div>
  </div>
</div>`;
}

function card05() {
  return `
<div class="card" data-card-id="card-05">
  <style>
    .card[data-card-id="card-05"] .root {
      ${BRAND}
      width:100%; height:100%; box-sizing:border-box; padding: 180px 48px 420px;
      display:flex; flex-direction:column; justify-content:center; gap: 22px;
      background: var(--foam); color: var(--ink);
      font-family: Rubik, ui-sans-serif, system-ui, sans-serif;
    }
    .card[data-card-id="card-05"] .kicker {
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 22px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
      color: var(--ink); opacity:0;
    }
    .card[data-card-id="card-05"] .title {
      font-size: 48px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.05; margin:0; opacity:0;
    }
    .card[data-card-id="card-05"] .token {
      font-size: 26px; font-weight: 400; opacity:0;
      padding: 12px 22px; border-radius: 9999px; background: var(--mist);
      box-shadow: var(--sticker); width: fit-content;
    }
    .card[data-card-id="card-05"] .counts { display:flex; gap: 14px; flex-wrap:wrap; margin-top: 8px; }
    .card[data-card-id="card-05"] .count {
      flex:1; min-width: 180px; opacity:0;
      padding: 28px 20px; border-radius: 1.5rem; background: var(--white);
      box-shadow: var(--sticker); text-align:center; border: 2px solid var(--ink);
    }
    .card[data-card-id="card-05"] .count.hot { background: var(--mango); }
    .card[data-card-id="card-05"] .count .n {
      font-size: 64px; font-weight: 800; letter-spacing: -0.04em;
      font-variant-numeric: tabular-nums;
    }
    .card[data-card-id="card-05"] .count .lbl {
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 18px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;
      opacity: 0.7; margin-top: 8px;
    }
  </style>
  <div class="root">
    <div class="kicker" id="c05-kicker">Restricciones</div>
    <h1 class="title" id="c05-title">No se queda infinito</h1>
    <div class="token" id="c05-token">consume tokens</div>
    <div class="counts">
      <div class="count" id="c05-a"><div class="n">100</div><div class="lbl">max</div></div>
      <div class="count" id="c05-b"><div class="n">50</div><div class="lbl">max</div></div>
      <div class="count hot" id="c05-c"><div class="n">10</div><div class="lbl">máximo</div></div>
    </div>
  </div>
</div>`;
}

function card06() {
  return `
<div class="card" data-card-id="card-06">
  <style>
    .card[data-card-id="card-06"] .root {
      ${BRAND}
      width:100%; height:100%; box-sizing:border-box; padding: 180px 48px 420px;
      display:flex; flex-direction:column; justify-content:center; gap: 24px;
      background: var(--foam); color: var(--ink);
      font-family: Rubik, ui-sans-serif, system-ui, sans-serif;
    }
    .card[data-card-id="card-06"] .kicker {
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 22px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
      color: var(--ink); opacity:0;
    }
    .card[data-card-id="card-06"] .title {
      font-size: 44px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.05; margin:0; opacity:0;
    }
    .card[data-card-id="card-06"] .branches { display:flex; flex-direction:column; gap: 18px; }
    .card[data-card-id="card-06"] .branch {
      display:flex; align-items:center; gap: 18px; opacity:0;
      padding: 26px 28px; border-radius: 1.5rem; background: var(--white);
      border: 2px solid var(--ink); box-shadow: var(--sticker);
    }
    .card[data-card-id="card-06"] .branch.a { background: var(--mist); }
    .card[data-card-id="card-06"] .branch.b { background: var(--mango); }
    .card[data-card-id="card-06"] .tag {
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 18px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
      padding: 8px 14px; border-radius: 9999px; background: var(--ink); color: var(--foam-soft);
    }
    .card[data-card-id="card-06"] .blabel { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; }
  </style>
  <div class="root">
    <div class="kicker" id="c06-kicker">Salida del ciclo</div>
    <h1 class="title" id="c06-title">¿Cuándo sale?</h1>
    <div class="branches">
      <div class="branch a" id="c06-a">
        <span class="tag">Finish</span>
        <span class="blabel">Terminó la tarea</span>
      </div>
      <div class="branch b" id="c06-b">
        <span class="tag">Ask</span>
        <span class="blabel">Necesita más info de ti</span>
      </div>
    </div>
  </div>
</div>`;
}

function card07() {
  return `
<div class="card" data-card-id="card-07">
  <style>
    .card[data-card-id="card-07"] .root {
      ${BRAND}
      width:100%; height:100%; box-sizing:border-box; padding: 160px 44px 400px;
      display:flex; flex-direction:column; gap: 18px; justify-content:center;
      background: var(--foam); color: var(--ink);
      font-family: Rubik, ui-sans-serif, system-ui, sans-serif;
    }
    .card[data-card-id="card-07"] .kicker {
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 22px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
      color: var(--ink); opacity:0;
    }
    .card[data-card-id="card-07"] .query {
      opacity:0; padding: 22px 28px; border-radius: 1.5rem; background: var(--mist);
      border: 2px solid var(--ink); box-shadow: var(--sticker);
      font-size: 34px; font-weight: 800; letter-spacing: -0.02em;
      width: fit-content; max-width: 980px;
    }
    .card[data-card-id="card-07"] .have { display:flex; gap: 12px; flex-wrap:wrap; opacity:0; }
    .card[data-card-id="card-07"] .ok {
      padding: 14px 20px; border-radius: 9999px; font-size: 26px; font-weight: 800;
      background: var(--lagoon); color: var(--ink); box-shadow: var(--sticker);
    }
    .card[data-card-id="card-07"] .miss { display:flex; flex-direction:column; gap: 12px; }
    .card[data-card-id="card-07"] .slot {
      opacity:0; padding: 18px 24px; border-radius: 1rem; background: var(--white);
      border: 2px dashed var(--ink); font-size: 28px; font-weight: 800;
    }
    .card[data-card-id="card-07"] .ask {
      opacity:0; padding: 22px 26px; border-radius: 1.5rem; background: var(--mango);
      border: 2px solid var(--ink); box-shadow: var(--sticker);
      font-size: 28px; font-weight: 800;
    }
  </style>
  <div class="root">
    <div class="kicker" id="c07-kicker">Ejemplo</div>
    <div class="query" id="c07-query">“agéndame una cita”</div>
    <div class="have" id="c07-have">
      <span class="ok">✓ calendar</span>
      <span class="ok">✓ goal</span>
    </div>
    <div class="miss">
      <div class="slot" id="c07-s1">✗ de qué</div>
      <div class="slot" id="c07-s2">✗ a qué hora</div>
      <div class="slot" id="c07-s3">✗ detalle</div>
    </div>
    <div class="ask" id="c07-ask">→ Sale a ti por info</div>
  </div>
</div>`;
}

function card04b() {
  return `
<div class="card" data-card-id="card-04b">
  <style>
    .card[data-card-id="card-04b"] .root {
      ${BRAND}
      width:100%; height:100%; box-sizing:border-box; padding: 200px 56px 420px;
      display:flex; flex-direction:column; justify-content:center; gap: 24px;
      background: var(--foam); color: var(--ink);
      font-family: Rubik, ui-sans-serif, system-ui, sans-serif;
    }
    .card[data-card-id="card-04b"] .kicker {
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 22px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
      color: var(--ink); opacity:0;
    }
    .card[data-card-id="card-04b"] .query {
      opacity:0; padding: 28px 32px; border-radius: 1.5rem; background: var(--mist);
      border: 2px solid var(--ink); box-shadow: var(--sticker);
      font-size: 40px; font-weight: 800; letter-spacing: -0.02em;
    }
    .card[data-card-id="card-04b"] .loop-badge {
      opacity:0; align-self:flex-start; padding: 18px 28px; border-radius: 9999px;
      background: var(--mango); font-size: 32px; font-weight: 800;
      box-shadow: var(--sticker);
    }
  </style>
  <div class="root">
    <div class="kicker" id="c04b-kicker">Objetivo</div>
    <div class="query" id="c04b-query">“escribir un correo”</div>
    <div class="loop-badge" id="c04b-loop">→ se queda en el LOOP</div>
  </div>
</div>`;
}

function card05a() {
  return `
<div class="card" data-card-id="card-05a">
  <style>
    .card[data-card-id="card-05a"] .root {
      ${BRAND}
      width:100%; height:100%; box-sizing:border-box; padding: 220px 56px 420px;
      display:flex; flex-direction:column; justify-content:center; align-items:flex-start; gap: 28px;
      background: var(--foam); color: var(--ink);
      font-family: Rubik, ui-sans-serif, system-ui, sans-serif;
    }
    .card[data-card-id="card-05a"] .kicker {
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 22px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
      color: var(--ink); opacity:0;
    }
    .card[data-card-id="card-05a"] .title {
      font-size: 64px; font-weight: 800; letter-spacing: -0.03em; line-height: 0.98; margin:0; opacity:0;
    }
    .card[data-card-id="card-05a"] .title .slap {
      background: linear-gradient(180deg, transparent 55%, #FFE56A 55%);
    }
    .card[data-card-id="card-05a"] .token {
      opacity:0; padding: 18px 28px; border-radius: 9999px; background: var(--mist);
      font-size: 30px; font-weight: 800; box-shadow: var(--sticker);
    }
  </style>
  <div class="root">
    <div class="kicker" id="c05a-kicker">Restricciones</div>
    <h1 class="title" id="c05a-title">No se queda<br/><span class="slap">infinito</span></h1>
    <div class="token" id="c05a-token">consume tokens</div>
  </div>
</div>`;
}

function card08() {
  return `
<div class="card" data-card-id="card-08">
  <style>
    .card[data-card-id="card-08"] .root {
      ${BRAND}
      width:100%; height:100%; box-sizing:border-box; padding: 180px 48px 400px;
      display:flex; flex-direction:column; justify-content:center; gap: 20px;
      background: var(--foam); color: var(--ink);
      font-family: Rubik, ui-sans-serif, system-ui, sans-serif;
    }
    .card[data-card-id="card-08"] .kicker {
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 22px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
      color: var(--ink); opacity:0;
    }
    .card[data-card-id="card-08"] .step {
      opacity:0; padding: 24px 28px; border-radius: 1.5rem; font-size: 32px; font-weight: 800;
      border: 2px solid var(--ink); box-shadow: var(--sticker);
    }
    .card[data-card-id="card-08"] .step.a { background: var(--mango); }
    .card[data-card-id="card-08"] .step.b { background: var(--mist); }
    .card[data-card-id="card-08"] .step.c { background: var(--butter); }
  </style>
  <div class="root">
    <div class="kicker" id="c08-kicker">Vuelve al ciclo</div>
    <div class="step a" id="c08-a">1 · Sale a ti</div>
    <div class="step b" id="c08-b">2 · Más especificaciones</div>
    <div class="step c" id="c08-c">3 · LOOP → Answer</div>
  </div>
</div>`;
}

function host(id, start, duration, inner) {
  return `
      <div class="card-host clip" data-card-id="${id}" id="host-${id}" data-start="${start}" data-duration="${duration}" data-track-index="3" style="left:0;top:0;width:1080px;height:1920px;opacity:1;">
        ${inner}
      </div>`;
}

function dur(id) {
  const p = PUNCHES[id];
  return +(p.out - p.in).toFixed(3);
}

const html = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <style>${css}</style>
  </head>
  <body>
    <div id="stage" data-composition-id="react" data-start="0" data-duration="${DURATION}" data-fps="30" data-width="1080" data-height="1920">
      <div class="video-wrapper" id="video-wrap">
        <video id="bg-video" class="clip" src="assets/tiktok.mp4" muted playsinline data-start="0" data-duration="${DURATION}" data-track-index="1"></video>
      </div>
      <audio id="source-audio" src="assets/tiktok.mp4" data-start="0" data-duration="${DURATION}" data-track-index="10" data-volume="1"></audio>
${host("card-02", PUNCHES["card-02"].in, dur("card-02"), card02())}
${host("card-03", PUNCHES["card-03"].in, dur("card-03"), card03())}
${host("card-04", PUNCHES["card-04"].in, dur("card-04"), card04())}
${host("card-04b", PUNCHES["card-04b"].in, dur("card-04b"), card04b())}
${host("card-05a", PUNCHES["card-05a"].in, dur("card-05a"), card05a())}
${host("card-05", PUNCHES["card-05"].in, dur("card-05"), card05())}
${host("card-06", PUNCHES["card-06"].in, dur("card-06"), card06())}
${host("card-07", PUNCHES["card-07"].in, dur("card-07"), card07())}
${host("card-08", PUNCHES["card-08"].in, dur("card-08"), card08())}
      <div id="caption-gradient-fill-host" class="caption-host clip" data-composition-id="caption-gradient-fill" data-composition-src="compositions/caption-gradient-fill.html" data-start="0" data-duration="${DURATION}" data-width="1080" data-height="1920" data-track-index="50"></div>
      <script src="vendor/gsap.min.js"></script>
      <script>
        (function () {
          const tl = gsap.timeline({ paused: true });
          gsap.set("#video-wrap", { x: 0, y: 0, scale: 1, opacity: 1, zIndex: 1 });
          gsap.set("#caption-gradient-fill-host", { opacity: 1 });
          gsap.set(".card-host .card", { opacity: 0 });

          /** Punch cutaway: hide face only; captions stay on (over cards too). */
          function showCard(id, tIn, tOut) {
            gsap.set('.card-host[data-card-id="' + id + '"] .card', { opacity: 0 });
            tl.to("#video-wrap", { opacity: 0, duration: 0.22, ease: "power2.inOut" }, tIn);
            tl.fromTo(
              '.card-host[data-card-id="' + id + '"] .card',
              { opacity: 0, scale: 1.02 },
              { opacity: 1, scale: 1, duration: 0.28, ease: "power2.out" },
              tIn
            );
            tl.to('.card-host[data-card-id="' + id + '"] .card', { opacity: 0, duration: 0.2, ease: "power2.in" }, tOut - 0.2);
            tl.to("#video-wrap", { opacity: 1, duration: 0.22, ease: "power2.inOut" }, tOut - 0.2);
            tl.set('.card-host[data-card-id="' + id + '"] .card', { opacity: 0 }, tOut);
          }

          function setHint(text, t) {
            tl.call(function () {
              var el = document.querySelector("#c02-hint");
              if (el) el.textContent = text;
            }, null, t);
          }
          function lightPath(which, t) {
            if (which === "action") {
              tl.to("#c02-path-action", { stroke: "#FF7A45", strokeDasharray: "0", strokeWidth: 6, opacity: 1, duration: 0.15 }, t);
              tl.to("#c02-path-obs", { stroke: "#152A26", strokeDasharray: "14 12", strokeWidth: 4, opacity: 0.25, duration: 0.15 }, t);
            } else {
              tl.to("#c02-path-obs", { stroke: "#FF7A45", strokeDasharray: "0", strokeWidth: 6, opacity: 1, duration: 0.15 }, t);
              tl.to("#c02-path-action", { stroke: "#152A26", strokeDasharray: "14 12", strokeWidth: 4, opacity: 0.25, duration: 0.15 }, t);
            }
          }

          // ── card-02 LOOP [9.88 → 15.20]
          // (card-01 removed — focus change in footage covers the 0–8s beat)
          showCard("card-02", 9.88, 15.2);
          tl.fromTo("#c02-kicker", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.25 }, 10.0);
          tl.fromTo("#c02-title", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3 }, 10.15);
          tl.fromTo("#c02-think", { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.4)" }, 10.35);
          tl.fromTo("#c02-tool", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.3)" }, 10.55);
          tl.fromTo("#c02-lact", { opacity: 0 }, { opacity: 1, duration: 0.22 }, 10.75);
          tl.fromTo("#c02-lobs", { opacity: 0 }, { opacity: 1, duration: 0.22 }, 10.9);
          tl.fromTo("#c02-hint", { opacity: 0 }, { opacity: 1, duration: 0.22 }, 11.0);
          tl.fromTo("#c02-token", { opacity: 0, scale: 0.5, x: 0, y: 0 }, { opacity: 1, scale: 1, duration: 0.2 }, 11.1);

          const cycle = (t0) => {
            lightPath("action", t0);
            setHint("Action → Tool", t0);
            tl.to("#c02-think", { scale: 1.08, duration: 0.18, ease: "power2.out" }, t0);
            tl.to("#c02-think", { scale: 1, duration: 0.2 }, t0 + 0.3);
            tl.to("#c02-token", { x: -306, y: 220, duration: 0.4, ease: "power1.inOut" }, t0);
            tl.to("#c02-token", { x: 0, y: 480, duration: 0.35, ease: "power1.inOut" }, t0 + 0.4);
            tl.to("#c02-tool", { scale: 1.08, duration: 0.18, ease: "power2.out" }, t0 + 0.65);
            tl.to("#c02-tool", { scale: 1, duration: 0.2 }, t0 + 0.9);
            lightPath("obs", t0 + 0.95);
            setHint("Observation → Thinking", t0 + 0.95);
            tl.to("#c02-token", { x: 314, y: 220, duration: 0.35, ease: "power1.inOut" }, t0 + 1.0);
            tl.to("#c02-token", { x: 0, y: 0, duration: 0.35, ease: "power1.inOut" }, t0 + 1.35);
            tl.to("#c02-think", { scale: 1.08, duration: 0.18, ease: "power2.out" }, t0 + 1.6);
            tl.to("#c02-think", { scale: 1, duration: 0.2 }, t0 + 1.85);
            setHint("LOOP", t0 + 1.9);
          };
          cycle(11.25);
          cycle(13.2);
          setHint("hasta resolver", 14.9);

          // ── card-03 tools [18.92 → 29.5]
          showCard("card-03", 18.92, 29.5);
          tl.fromTo("#c03-kicker", { opacity: 0 }, { opacity: 1, duration: 0.22 }, 19.05);
          tl.fromTo("#c03-title", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3 }, 19.2);
          tl.fromTo("#c03-tool", { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.3)" }, 19.5);
          [["#c03-a", 23.2], ["#c03-b", 25.4], ["#c03-c", 26.5], ["#c03-d", 28.0]].forEach(([sel, t]) => {
            tl.fromTo(sel, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(1.4)" }, t);
            tl.to(sel, { backgroundColor: "#1ECAD3", duration: 0.15 }, t + 0.1);
          });

          // ── card-04 Reasoning + Acting [33.12 → 39.8]
          showCard("card-04", 33.12, 39.8);
          tl.fromTo("#c04-kicker", { opacity: 0 }, { opacity: 1, duration: 0.22 }, 33.25);
          tl.fromTo("#c04-eq", { opacity: 0 }, { opacity: 1, duration: 0.25 }, 33.4);
          tl.fromTo("#c04-reason", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.35 }, 33.55);
          tl.to("#c04-reason", { backgroundColor: "#FF7A45", duration: 0.2 }, 34.0);
          tl.fromTo("#c04-acting", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.35 }, 38.0);
          tl.to("#c04-acting", { backgroundColor: "#1ECAD3", duration: 0.2 }, 38.5);

          // ── card-04b correo → loop [42.8 → 47.5]
          showCard("card-04b", 42.8, 47.5);
          tl.fromTo("#c04b-kicker", { opacity: 0 }, { opacity: 1, duration: 0.22 }, 42.95);
          tl.fromTo("#c04b-query", { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.3)" }, 43.15);
          tl.fromTo("#c04b-loop", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35 }, 45.5);

          // ── card-05a no infinito [50.8 → 54.5]
          showCard("card-05a", 50.8, 54.5);
          tl.fromTo("#c05a-kicker", { opacity: 0 }, { opacity: 1, duration: 0.22 }, 50.95);
          tl.fromTo("#c05a-title", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.35 }, 51.15);
          tl.fromTo("#c05a-token", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 52.5);

          // ── card-05 max N [54.6 → 61.8]
          showCard("card-05", 54.6, 61.8);
          tl.fromTo("#c05-kicker", { opacity: 0 }, { opacity: 1, duration: 0.22 }, 54.75);
          tl.fromTo("#c05-title", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3 }, 54.9);
          tl.fromTo("#c05-token", { opacity: 0 }, { opacity: 1, duration: 0.25 }, 55.1);
          tl.fromTo("#c05-a", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.3 }, 56.9);
          tl.fromTo("#c05-b", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.3 }, 59.0);
          tl.fromTo("#c05-c", { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.3)" }, 60.4);

          // ── card-06 exit [65.5 → 71.8]
          showCard("card-06", 65.5, 71.8);
          tl.fromTo("#c06-kicker", { opacity: 0 }, { opacity: 1, duration: 0.22 }, 65.65);
          tl.fromTo("#c06-title", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3 }, 65.8);
          tl.fromTo("#c06-a", { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.35 }, 67.8);
          tl.fromTo("#c06-b", { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.35 }, 69.8);

          // ── card-07 example [75.36 → 82.0]
          showCard("card-07", 75.36, 82.0);
          tl.fromTo("#c07-kicker", { opacity: 0 }, { opacity: 1, duration: 0.22 }, 75.5);
          tl.fromTo("#c07-query", { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.3)" }, 75.65);
          tl.fromTo("#c07-have", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 77.7);
          tl.fromTo("#c07-s1", { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.25 }, 79.5);
          tl.fromTo("#c07-s2", { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.25 }, 80.3);
          tl.fromTo("#c07-s3", { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.25 }, 81.0);
          tl.fromTo("#c07-ask", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.28 }, 81.4);

          // ── card-08 return [85.5 → 91.8]
          showCard("card-08", 85.5, 91.8);
          tl.fromTo("#c08-kicker", { opacity: 0 }, { opacity: 1, duration: 0.22 }, 85.65);
          tl.fromTo("#c08-a", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3 }, 85.9);
          tl.fromTo("#c08-b", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3 }, 87.8);
          tl.fromTo("#c08-c", { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.3)" }, 90.0);

          window.__timelines = window.__timelines || {};
          window.__timelines["react"] = tl;
        })();
      </script>
    </div>
  </body>
</html>
`;

fs.writeFileSync(path.join(root, "index.html"), html);

// Keep storyboard.json punches in sync
const sbPath = path.join(root, "storyboard.json");
if (fs.existsSync(sbPath)) {
  const sb = JSON.parse(fs.readFileSync(sbPath, "utf8"));
  sb.cards = Object.entries(PUNCHES).map(([id, p], i) => ({
    id,
    intent: sb.cards?.[i]?.intent || id,
    startSec: p.in,
    endSec: p.out,
    accentIndex: i % 5,
    zone: "fullscreen",
    transition: "wipe",
    contentHints: sb.cards?.[i]?.contentHints || {},
  }));
  sb.notes =
    "Interleaved punches: face fills gaps. Captions on footage only.";
  fs.writeFileSync(sbPath, JSON.stringify(sb, null, 2));
}

console.log("Wrote index.html with interleaved punches:");
Object.entries(PUNCHES).forEach(([id, p]) =>
  console.log(`  ${id}  ${p.in.toFixed(2)} → ${p.out.toFixed(2)}  (${(p.out - p.in).toFixed(1)}s)`),
);
