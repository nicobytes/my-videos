/**
 * Assembles videos/effects/index.html from the STORYBOARD cutaway plan.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const DURATION = 63.033;

const css = `
@font-face { font-family: "Inter"; src: url("fonts/Inter-400-latin.woff2") format("woff2"); font-weight: 400; font-display: block; }
@font-face { font-family: "Inter"; src: url("fonts/Inter-700-latin.woff2") format("woff2"); font-weight: 700; font-display: block; }
* { box-sizing: border-box; }
html, body { margin:0; padding:0; width:100%; height:100%; overflow:hidden; background:#18181b; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
#stage { position:relative; width:100%; height:100%; overflow:hidden; background:#18181b; }
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
.mono { font-family: ui-monospace, Menlo, Consolas, monospace; }
`;

function card02() {
  return `
<div class="card" data-card-id="card-02">
  <style>
    .card[data-card-id="card-02"] .root {
      --ink:#18181b; --muted:#71717a; --cyan:#06b6d4; --emerald:#10b981; --paper:#fafafa; --slate:#27272a;
      width:100%; height:100%; box-sizing:border-box; padding: 160px 56px 480px;
      display:flex; flex-direction:column; justify-content:center; gap: 28px;
      background: var(--paper); color: var(--ink);
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    }
    .card[data-card-id="card-02"] .kicker {
      font-size: 24px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--cyan); opacity:0;
    }
    .card[data-card-id="card-02"] .title {
      font-size: 58px; font-weight: 700; letter-spacing: -0.03em; line-height: 1.08; margin:0; opacity:0;
      max-width: 920px;
    }
    .card[data-card-id="card-02"] .chips {
      display:flex; flex-wrap:wrap; gap: 14px; margin-top: 12px;
    }
    .card[data-card-id="card-02"] .chip {
      padding: 18px 26px; border-radius: 999px; font-size: 28px; font-weight: 700;
      background: #fff; border: 2px solid #e4e4e7; color: var(--ink); opacity:0;
    }
    .card[data-card-id="card-02"] .chip.on {
      border-color: var(--cyan); background: rgba(6,182,212,0.12); color: #0e7490;
    }
  </style>
  <div class="root">
    <div class="kicker" id="c02-kicker">A veces hay que usarlos</div>
    <h1 class="title" id="c02-title">Effects inevitables en el mundo real</h1>
    <div class="chips" id="c02-chips">
      <span class="chip" id="c02-a">analytics</span>
      <span class="chip" id="c02-b">logging</span>
      <span class="chip" id="c02-c">debugging</span>
      <span class="chip" id="c02-d">DOM</span>
    </div>
  </div>
</div>`;
}

function card03() {
  return `
<div class="card" data-card-id="card-03">
  <style>
    .card[data-card-id="card-03"] .root {
      --ink:#fafafa; --muted:#a1a1aa; --cyan:#06b6d4; --emerald:#10b981; --slate:#27272a;
      width:100%; height:100%; box-sizing:border-box; padding: 160px 56px 480px;
      display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; gap: 28px;
      background: #18181b; color: var(--ink);
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    }
    .card[data-card-id="card-03"] .logo {
      width: 180px; height: 180px; opacity:0;
      background: url("assets/ngrx-logo.svg") center / contain no-repeat;
    }
    .card[data-card-id="card-03"] .eyebrow {
      font-size: 24px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--cyan); opacity:0;
    }
    .card[data-card-id="card-03"] .title {
      font-size: 72px; font-weight: 700; letter-spacing: -0.04em; line-height: 1.02; margin:0; opacity:0;
    }
    .card[data-card-id="card-03"] .title em { font-style:normal; color: var(--emerald); }
    .card[data-card-id="card-03"] .pkg {
      font-size: 28px; font-weight: 600; color: var(--muted); opacity:0;
      padding: 14px 28px; border-radius: 999px; background: var(--slate);
      border: 1px solid rgba(6,182,212,0.35);
    }
    .card[data-card-id="card-03"] .pkg span { color: var(--cyan); font-family: ui-monospace, Menlo, Consolas, monospace; }

  </style>
  <div class="root">
    <div class="eyebrow" id="c03-eye">Forma más limpia</div>
    <div class="logo" id="c03-logo"></div>
    <h1 class="title" id="c03-title"><em>signalMethod</em></h1>
    <div class="pkg" id="c03-pkg">paquete <span>@ngrx/signals</span></div>
  </div>
</div>`;
}

function card04() {
  return `
<div class="card" data-card-id="card-04">
  <style>
    .card[data-card-id="card-04"] .root {
      --ink:#18181b; --muted:#71717a; --cyan:#06b6d4; --emerald:#10b981; --paper:#fafafa;
      width:100%; height:100%; box-sizing:border-box; padding: 160px 56px 480px;
      display:flex; flex-direction:column; justify-content:center; gap: 32px;
      background: var(--paper); color: var(--ink);
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    }
    .card[data-card-id="card-04"] .kicker {
      font-size: 24px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--cyan); opacity:0;
    }
    .card[data-card-id="card-04"] .title {
      font-size: 52px; font-weight: 700; letter-spacing: -0.03em; line-height: 1.08; margin:0 0 8px; opacity:0;
    }
    .card[data-card-id="card-04"] .list { display:flex; flex-direction:column; gap: 18px; }
    .card[data-card-id="card-04"] .row {
      display:flex; align-items:center; gap: 20px; opacity:0;
      padding: 22px 26px; border-radius: 20px; background:#fff; border: 2px solid #e4e4e7;
    }
    .card[data-card-id="card-04"] .row.hot {
      border-color: var(--emerald); box-shadow: 0 0 0 4px rgba(16,185,129,0.15);
    }
    .card[data-card-id="card-04"] .num {
      font-size: 28px; font-weight: 800; color: var(--cyan);
      font-variant-numeric: tabular-nums; min-width: 48px;
    }
    .card[data-card-id="card-04"] .label {
      font-size: 32px; font-weight: 700; letter-spacing: -0.02em;
    }
  </style>
  <div class="root">
    <div class="kicker" id="c04-kicker">3 ventajas</div>
    <h1 class="title" id="c04-title">Sobre el effect normal</h1>
    <div class="list">
      <div class="row hot" id="c04-r1"><span class="num">01</span><span class="label">Flexible inputs</span></div>
      <div class="row" id="c04-r2"><span class="num">02</span><span class="label">Implicit untracked</span></div>
      <div class="row" id="c04-r3"><span class="num">03</span><span class="label">Injectable</span></div>
    </div>
  </div>
</div>`;
}

function card05() {
  return `
<div class="card" data-card-id="card-05">
  <style>
    .card[data-card-id="card-05"] .root {
      --ink:#fafafa; --muted:#a1a1aa; --cyan:#06b6d4; --emerald:#10b981; --slate:#27272a; --zinc:#f4f4f5;
      width:100%; height:100%; box-sizing:border-box;
      padding: 100px 36px 560px;
      display:flex; flex-direction:column; gap: 18px;
      background: #18181b; color: var(--ink);
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    }
    .card[data-card-id="card-05"] .kicker {
      font-size: 22px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--cyan); opacity:0; flex:none;
    }
    .card[data-card-id="card-05"] .title {
      font-size: 40px; font-weight: 700; letter-spacing: -0.03em; line-height: 1.08; margin:0; opacity:0; flex:none;
    }
    .card[data-card-id="card-05"] .toggle {
      display:flex; gap: 12px; opacity:0; flex:none;
    }
    .card[data-card-id="card-05"] .pill {
      padding: 12px 20px; border-radius: 999px; font-size: 24px; font-weight: 700;
      background: var(--slate); border: 2px solid transparent;
    }
    .card[data-card-id="card-05"] .pill.a { border-color: var(--cyan); color: var(--cyan); }
    .card[data-card-id="card-05"] .pill.b { border-color: var(--emerald); color: var(--emerald); }
    .card[data-card-id="card-05"] .code {
      flex:1; min-height: 0; opacity:0;
      display:flex; align-items:center;
      background: var(--slate); border-radius: 28px; padding: 36px 32px;
      border: 1px solid rgba(244,244,245,0.14);
    }
    .card[data-card-id="card-05"] .code pre {
      margin:0; width:100%;
      font-family: ui-monospace, Menlo, Consolas, monospace;
      font-size: 36px; line-height: 1.38; font-weight: 600; color: var(--zinc);
      white-space: pre-wrap; word-break: break-word;
    }
    .card[data-card-id="card-05"] .code .kw { color: var(--cyan); }
    .card[data-card-id="card-05"] .code .fn { color: var(--emerald); }
    .card[data-card-id="card-05"] .code .cm { color: #71717a; }
    .card[data-card-id="card-05"] .callout {
      opacity:0; padding: 16px 20px; border-radius: 18px; flex:none;
      background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.4);
      font-size: 24px; font-weight: 700; color: var(--emerald);
    }
  </style>
  <div class="root">
    <div class="kicker" id="c05-kicker">01 · Flexible inputs</div>
    <h2 class="title" id="c05-title">Signal o valor — misma API</h2>
    <div class="toggle" id="c05-toggle">
      <span class="pill a">signal</span>
      <span class="pill b">value</span>
    </div>
    <div class="code" id="c05-code"><pre><span class="fn">logDoubledNumber</span> = <span class="kw">signalMethod</span>&lt;number&gt;((num) =&gt; {
  const double = num * 2;
  console.log(double);
});

<span class="cm">// constructor</span>
this.logDoubledNumber(this.mySignal);</pre></div>
    <div class="callout" id="c05-call">Ideal para unit test · sin pelear el constructor</div>
  </div>
</div>`;
}

function card06() {
  return `
<div class="card" data-card-id="card-06">
  <style>
    .card[data-card-id="card-06"] .root {
      --ink:#fafafa; --muted:#a1a1aa; --cyan:#06b6d4; --emerald:#10b981; --slate:#27272a; --zinc:#f4f4f5;
      width:100%; height:100%; box-sizing:border-box;
      padding: 100px 32px 560px;
      display:flex; flex-direction:column; gap: 16px;
      background: #18181b; color: var(--ink);
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    }
    .card[data-card-id="card-06"] .kicker {
      font-size: 22px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--cyan); opacity:0; flex:none;
    }
    .card[data-card-id="card-06"] .title {
      font-size: 38px; font-weight: 700; letter-spacing: -0.03em; line-height: 1.08; margin:0; opacity:0; flex:none;
    }
    .card[data-card-id="card-06"] .panels {
      flex:1; min-height:0; display:flex; flex-direction:column; gap: 18px;
    }
    .card[data-card-id="card-06"] .panel {
      flex:1; min-height:0; opacity:0; border-radius: 24px; padding: 22px 26px;
      background: var(--slate); border: 2px solid rgba(244,244,245,0.1);
      display:flex; flex-direction:column; justify-content:center; gap: 12px;
    }
    .card[data-card-id="card-06"] .panel.before { border-color: rgba(244,63,94,0.45); }
    .card[data-card-id="card-06"] .panel.after { border-color: rgba(16,185,129,0.55); }
    .card[data-card-id="card-06"] .tag {
      font-size: 22px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;
      flex:none;
    }
    .card[data-card-id="card-06"] .before .tag { color: #fb7185; }
    .card[data-card-id="card-06"] .after .tag { color: var(--emerald); }
    .card[data-card-id="card-06"] pre {
      margin:0; font-family: ui-monospace, Menlo, Consolas, monospace;
      font-size: 32px; line-height: 1.36; font-weight: 600; color: var(--zinc);
      white-space: pre-wrap; word-break: break-word;
    }
    .card[data-card-id="card-06"] .kw { color: var(--cyan); }
    .card[data-card-id="card-06"] .bad { color: #fb7185; }
    .card[data-card-id="card-06"] .fn { color: var(--emerald); }
    .card[data-card-id="card-06"] .footer {
      opacity:0; display:flex; gap: 10px; flex-wrap:wrap; flex:none;
    }
    .card[data-card-id="card-06"] .chip {
      padding: 12px 16px; border-radius: 999px; font-size: 22px; font-weight: 700;
      background: rgba(6,182,212,0.12); color: var(--cyan);
      border: 1px solid rgba(6,182,212,0.35);
    }
  </style>
  <div class="root">
    <div class="kicker" id="c06-kicker">02 · Implicit untracked</div>
    <h2 class="title" id="c06-title">Sin pelear memory leaks</h2>
    <div class="panels">
      <div class="panel before" id="c06-before">
        <div class="tag">Antes</div>
        <pre><span class="kw">effect</span>(() =&gt; {
  const value = this.mySignal();
  <span class="bad">untracked</span>(() =&gt; {
    console.log(value * 2);
  });
});</pre>
      </div>
      <div class="panel after" id="c06-after">
        <div class="tag">Después</div>
        <pre><span class="fn">logDoubledNumber</span> = <span class="kw">signalMethod</span>&lt;number&gt;((num) =&gt; {
  console.log(num * 2);
});</pre>
      </div>
    </div>
    <div class="footer" id="c06-foot">
      <span class="chip">declarativo</span>
      <span class="chip">inyectable</span>
      <span class="chip">untracked automático</span>
    </div>
  </div>
</div>`;
}

function card07() {
  return `
<div class="card" data-card-id="card-07">
  <style>
    .card[data-card-id="card-07"] .root {
      --ink:#fafafa; --muted:#a1a1aa; --cyan:#06b6d4; --emerald:#10b981; --slate:#27272a;
      width:100%; height:100%; box-sizing:border-box; padding: 160px 56px 480px;
      display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; gap: 26px;
      background: #18181b; color: var(--ink);
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    }
    .card[data-card-id="card-07"] .logo { width: 160px; height: 160px; opacity:0; background: url("assets/ngrx-logo.svg") center / contain no-repeat; }
    .card[data-card-id="card-07"] .rule {
      width:0; height:6px; border-radius:999px;
      background: linear-gradient(90deg, var(--cyan), var(--emerald));
    }
    .card[data-card-id="card-07"] .title {
      font-size: 56px; font-weight: 700; letter-spacing: -0.03em; line-height: 1.08; margin:0; opacity:0;
      max-width: 900px;
    }
    .card[data-card-id="card-07"] .title em { font-style:normal; color: var(--emerald); }
    .card[data-card-id="card-07"] .pkg {
      font-size: 28px; font-weight: 600; color: var(--muted); opacity:0;
      font-family: ui-monospace, Menlo, Consolas, monospace;
    }
    .card[data-card-id="card-07"] .pkg span { color: var(--cyan); }
  </style>
  <div class="root">
    <div class="logo" id="c07-logo"></div>
    <div class="rule" id="c07-rule"></div>
    <h1 class="title" id="c07-title">Usa <em>signalMethod</em></h1>
    <div class="pkg" id="c07-pkg"><span>@ngrx/signals</span> · NgRx Signals</div>
  </div>
</div>`;
}

function host(id, start, duration, inner) {
  return `
      <div class="card-host clip" data-card-id="${id}" id="host-${id}" data-start="${start}" data-duration="${duration}" data-track-index="3" style="left:0;top:0;width:1080px;height:1920px;opacity:1;">
        ${inner}
      </div>`;
}

const html = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <style>${css}</style>
  </head>
  <body>
    <div id="stage" data-composition-id="effects" data-start="0" data-duration="${DURATION}" data-fps="30" data-width="1080" data-height="1920">
      <div class="video-wrapper" id="video-wrap">
        <video id="bg-video" class="clip" src="assets/effects.mp4" muted playsinline data-start="0" data-duration="${DURATION}" data-track-index="1"></video>
      </div>
      <audio id="source-audio" src="assets/effects.mp4" data-start="0" data-duration="${DURATION}" data-track-index="10" data-volume="1"></audio>
${host("card-02", 10.4, 3.2, card02())}
${host("card-03", 19.5, 2.7, card03())}
${host("card-04", 22.24, 2.32, card04())}
${host("card-05", 28.4, 5.6, card05())}
${host("card-06", 42.0, 7.0, card06())}
${host("card-07", 59.5, 3.533, card07())}
      <div id="caption-gradient-fill-host" class="caption-host clip" data-composition-id="caption-gradient-fill" data-composition-src="compositions/caption-gradient-fill.html" data-start="0" data-duration="${DURATION}" data-width="1080" data-height="1920" data-track-index="50"></div>
      <script src="vendor/gsap.min.js"></script>
      <script>
        (function () {
          const tl = gsap.timeline({ paused: true });
          gsap.set("#video-wrap", { x: 0, y: 0, scale: 1, opacity: 1, zIndex: 1 });
          // Captions always on (over cards + face) — TikTok/Reels safe rail
          gsap.set("#caption-gradient-fill-host", { opacity: 1 });

          function showCard(id, tIn, tOut) {
            gsap.set('.card-host[data-card-id="' + id + '"] .card', { opacity: 0 });
            tl.to("#video-wrap", { opacity: 0, duration: 0.28, ease: "power2.inOut" }, tIn);
            tl.fromTo(
              '.card-host[data-card-id="' + id + '"] .card',
              { opacity: 0, scale: 1.02 },
              { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" },
              tIn
            );
            tl.to('.card-host[data-card-id="' + id + '"] .card', { opacity: 0, duration: 0.25, ease: "power2.in" }, tOut - 0.25);
            tl.to("#video-wrap", { opacity: 1, duration: 0.28, ease: "power2.inOut" }, tOut - 0.25);
            tl.set('.card-host[data-card-id="' + id + '"] .card', { opacity: 0 }, tOut);
          }

          // Punch cards only — most runtime is talking-head
          // card-02 use-cases [10.4 → 13.6]
          showCard("card-02", 10.4, 13.6);
          tl.fromTo("#c02-kicker", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, 10.55);
          tl.fromTo("#c02-title", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, 10.75);
          ["#c02-a", "#c02-b", "#c02-c", "#c02-d"].forEach((sel, i) => {
            const t = 10.9 + i * 0.35;
            tl.fromTo(sel, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.28, ease: "back.out(1.4)" }, t);
            tl.to(sel, { borderColor: "#06b6d4", backgroundColor: "rgba(6,182,212,0.12)", color: "#0e7490", duration: 0.18 }, t + 0.12);
          });

          // card-03 signalMethod [19.5 → 22.2]
          showCard("card-03", 19.5, 22.2);
          tl.fromTo("#c03-eye", { opacity: 0 }, { opacity: 1, duration: 0.25 }, 19.65);
          tl.fromTo("#c03-logo", { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.3)" }, 19.85);
          tl.fromTo("#c03-title", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, 20.15);
          tl.fromTo("#c03-pkg", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 20.55);

          // card-04 three advantages [22.24 → 24.56] — chain right after naming
          gsap.set('.card-host[data-card-id="card-04"] .card', { opacity: 0 });
          tl.to("#video-wrap", { opacity: 0, duration: 0.2, ease: "power2.inOut" }, 22.24);
          tl.fromTo('.card-host[data-card-id="card-04"] .card', { opacity: 0, scale: 1.02 }, { opacity: 1, scale: 1, duration: 0.28, ease: "power2.out" }, 22.24);
          tl.fromTo("#c04-kicker", { opacity: 0 }, { opacity: 1, duration: 0.22 }, 22.35);
          tl.fromTo("#c04-title", { opacity: 0 }, { opacity: 1, duration: 0.25 }, 22.45);
          tl.fromTo("#c04-r1", { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.25, ease: "power2.out" }, 22.55);
          tl.fromTo("#c04-r2", { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.25, ease: "power2.out" }, 22.8);
          tl.fromTo("#c04-r3", { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.25, ease: "power2.out" }, 23.05);
          tl.to('.card-host[data-card-id="card-04"] .card', { opacity: 0, duration: 0.22, ease: "power2.in" }, 24.34);
          tl.to("#video-wrap", { opacity: 1, duration: 0.25, ease: "power2.inOut" }, 24.34);
          tl.set('.card-host[data-card-id="card-04"] .card', { opacity: 0 }, 24.56);

          // card-05 code punch [28.4 → 34.0]
          showCard("card-05", 28.4, 34.0);
          tl.fromTo("#c05-kicker", { opacity: 0 }, { opacity: 1, duration: 0.25 }, 28.55);
          tl.fromTo("#c05-title", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3 }, 28.7);
          tl.fromTo("#c05-toggle", { opacity: 0 }, { opacity: 1, duration: 0.25 }, 28.95);
          tl.fromTo("#c05-code", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 29.15);
          tl.fromTo("#c05-call", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 32.4);

          // card-06 before/after [42.0 → 49.0]
          showCard("card-06", 42.0, 49.0);
          tl.fromTo("#c06-kicker", { opacity: 0 }, { opacity: 1, duration: 0.25 }, 42.15);
          tl.fromTo("#c06-title", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 42.35);
          tl.fromTo("#c06-before", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.35 }, 42.55);
          tl.fromTo("#c06-after", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.35 }, 45.2);
          tl.fromTo("#c06-foot", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 47.2);

          // CTA [59.5 → 63.03]
          showCard("card-07", 59.5, 63.033);
          tl.fromTo("#c07-logo", { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.3)" }, 59.65);
          tl.fromTo("#c07-rule", { width: 0 }, { width: 220, duration: 0.3, ease: "power2.out" }, 59.95);
          tl.fromTo("#c07-title", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.35 }, 60.15);
          tl.fromTo("#c07-pkg", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 60.5);

          window.__timelines = window.__timelines || {};
          window.__timelines["effects"] = tl;
        })();
      </script>
    </div>
  </body>
</html>
`;

fs.writeFileSync(path.join(root, "index.html"), html);
console.log("Wrote index.html", html.length, "bytes");
