/* p5.brush accent layer — seek-safe and deterministic.
 *
 * Every stroke is data: { id, layer, kind, brush, color, weight, pts | arc | rect, head:[t0,t1], tail?:[t2,t3], until? }.
 * A stroke draws on along its path during `head`, and (optionally) retracts from its start during `tail`,
 * which is how the panel wipes read as a brush sweeping across. `until` hard-cuts a held stroke at a scene change.
 *
 * renderBrush(t) is a pure function of t: each stroke reseeds the RNG from its own id, so one stroke's
 * progress never changes another stroke's texture (shared-RNG flicker found in the spike).
 * Drawing happens on one off-DOM WebGL2 OffscreenCanvas and is blitted into two visible 2D canvases:
 * #brush-under (behind the scene content) and #brush-over (on top of it).
 */
(function () {
  var B = window.__BEATS;
  var W = 1080, H = 1920;

  var TEAL = "#075E54", GREEN = "#25D366", INK = "#111111", PARLANA = "#00BD4C", TRACK = "#CFE0DC";

  function lerp(a, b, k) { return a + (b - a) * k; }
  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function easeOut(x) { return 1 - Math.pow(1 - x, 3); }
  function easeInOut(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  function prog(t, span, ease) { return span ? (ease || easeInOut)(clamp01((t - span[0]) / (span[1] - span[0]))) : 0; }
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

  // A gently waved horizontal band from x0 to x1 at y (hand-drawn, not ruler-straight)
  function band(x0, x1, y, amp, n) {
    var pts = [];
    n = n || 6;
    for (var i = 0; i <= n; i++) {
      var k = i / n;
      pts.push([lerp(x0, x1, k), y + Math.sin(k * Math.PI * 1.6 + y * 0.01) * amp]);
    }
    return pts;
  }
  function shift(span, d) { return [span[0] + d, span[1] + d]; }

  // ---------- Stroke list (absolute seconds from beats.json; coordinates in the 1080×1920 frame) ----------
  var S = [];

  // T1 — split opens: three marker bands sweep across the new top panel, then retract
  [["#E7FBEF", 230], ["#BDF0D1", 480], ["#E7FBEF", 730]].forEach(function (c, i) {
    S.push({ id: "t1-band-" + i, layer: "over", kind: "path", brush: "marker", color: c[0], weight: 40,
      pts: band(-60, 1140, c[1], 18), head: shift([B.split.start, B.split.land - 0.1], i * 0.05),
      tail: shift([B.split.land - 0.1, B.split.land + 0.18], i * 0.05) });
  });

  // B02 — charcoal ring around the big "3"; it unwinds as the 3 morphs into the phrase
  S.push({ id: "three-ring", layer: "over", kind: "arc", brush: "charcoal", color: TEAL, weight: 2.5,
    arc: { x: 540, y: 430, r: 236, start: -Math.PI * 0.62, sweep: Math.PI * 2 * 0.96 },
    head: B.three.circle, tail: [B.phrase.morphOut, B.phrase.morphOut + 0.3] });

  // B03 — marker swipe under "igual"
  S.push({ id: "igual-under", layer: "under", kind: "path", brush: "marker", color: GREEN, weight: 9,
    pts: band(262, 818, 545, 5, 4), head: [B.phrase.igual, B.phrase.igual + 0.35], until: B.wipe1.head[1] });

  // T2 — four teal/green bands cover the panel, the scene swaps underneath, bands retract to reveal tier 1
  [[TEAL, 150], [GREEN, 360], [TEAL, 570], [GREEN, 780]].forEach(function (c, i) {
    S.push({ id: "w1-band-" + i, layer: "over", kind: "path", brush: "marker", color: c[0], weight: 40,
      pts: band(-60, 1140, c[1], 16), head: shift(B.wipe1.head, i * 0.04 - 0.12), tail: shift(B.wipe1.tail, i * 0.04) });
  });

  // B04 — "se queda corto": charcoal ring around the 99+ unread pill
  S.push({ id: "corto-ring", layer: "over", kind: "arc", brush: "charcoal", color: INK, weight: 2.5,
    arc: { x: 912, y: 318, r: 74, start: -Math.PI * 0.7, sweep: Math.PI * 2 * 0.95 },
    head: [B.tier1.corto, B.tier1.corto + 0.32], until: B.morph2.head[0] + 0.1 });

  // Morphs — one marker band sweeps over the tier header while badge + title swap underneath
  [["m2", B.morph2], ["m3", B.morph3]].forEach(function (m) {
    S.push({ id: m[0] + "-band", layer: "over", kind: "path", brush: "marker", color: TEAL, weight: 30,
      pts: band(20, 1060, 172, 10, 5), head: m[1].head, tail: m[1].tail });
  });

  // B05 — progress track + painted bar that steps 10 → 50 in sync with the counter, then overflows at "más de 50"
  var BAR_Y = 650, BAR_X0 = 65, BAR_X1 = 1015;
  S.push({ id: "bar-track", layer: "under", kind: "path", brush: "pen", color: TRACK, weight: 1.5,
    pts: [[BAR_X0, BAR_Y], [BAR_X1, BAR_Y]], head: [B.tier2.count[0], B.tier2.count[0] + 0.3], until: B.tier2.statExit });
  S.push({ id: "bar-fill", layer: "under", kind: "path", brush: "marker", color: GREEN, weight: 7,
    pts: band(BAR_X0, BAR_X1, BAR_Y, 3, 6),
    headFn: function (t) {
      var c = B.tier2.count;
      if (t < c[0]) return 0;
      var n = Math.min(8, Math.floor((t - c[0]) / ((c[1] - c[0]) / 8) + 1e-6));
      return (10 + 5 * n) / 50;
    }, head: [B.tier2.count[0], B.tier2.count[1]], tail: [B.tier2.statExit, B.tier2.statExit + 0.25] });
  // tier 3: the counter comes back with a freshly painted full bar
  S.push({ id: "bar3-track", layer: "under", kind: "path", brush: "pen", color: TRACK, weight: 1.5,
    pts: [[BAR_X0, BAR_Y], [BAR_X1, BAR_Y]], head: [B.tier3.statBack, B.tier3.statBack + 0.3], until: B.tier3.aiExit });
  S.push({ id: "bar3-fill", layer: "under", kind: "path", brush: "marker", color: GREEN, weight: 7,
    pts: band(BAR_X0, BAR_X1, BAR_Y, 3, 6), head: [B.tier3.statBack + 0.05, B.tier3.statBack + 0.5], tail: [B.tier3.aiExit, B.tier3.aiExit + 0.25] });
  S.push({ id: "bar-plus", layer: "under", kind: "path", brush: "marker", color: GREEN, weight: 7,
    pts: band(BAR_X1 - 6, 1120, BAR_Y, 3, 3), head: [B.tier3.masde50, B.tier3.masde50 + 0.25], tail: [B.tier3.aiExit, B.tier3.aiExit + 0.2] });

  // Pen check-marks land in each feature chip's icon slot as the feature is named
  [[100, 328], [100, 424], [100, 520]].forEach(function (p, i) {
    var t = B.tier2.chips[i] + 0.12;
    S.push({ id: "chk-" + i, layer: "over", kind: "path", brush: "pen", color: TEAL, weight: 3.2,
      pts: [[p[0] - 15, p[1] + 1], [p[0] - 4, p[1] + 13], [p[0] + 17, p[1] - 14]], head: [t, t + 0.22], until: B.morph3.head[0] });
  });
  // "ahorrar tiempo" — pen ring around the clock
  S.push({ id: "tiempo-ring", layer: "over", kind: "arc", brush: "pen", color: TEAL, weight: 2.4,
    arc: { x: 105, y: 630, r: 56, start: -Math.PI * 0.6, sweep: Math.PI * 2 * 0.95 },
    head: [B.tier2.tiempo + 0.15, B.tier2.tiempo + 0.5], until: B.morph3.head[0] });

  // B06 — bot-flow connections drawn in pen between the four nodes, then the AI spark sprays out
  var NODE_Y = 730, NODES = [140, 400, 660, 920];
  for (var k = 0; k < 3; k++) {
    var x0 = NODES[k] + 52, x1 = NODES[k + 1] - 52, step = (B.tier3.flow[1] - B.tier3.flow[0]) / 3;
    S.push({ id: "flow-" + k, layer: "under", kind: "path", brush: "pen", color: TEAL, weight: 3,
      pts: [[x0, NODE_Y], [lerp(x0, x1, 0.5), NODE_Y - 18], [x1, NODE_Y]],
      head: [B.tier3.flow[0] + k * step, B.tier3.flow[0] + (k + 1) * step], until: B.tier3.aiExit });
  }
  for (var r = 0; r < 8; r++) {
    var a = (r / 8) * Math.PI * 2 + 0.2;
    S.push({ id: "spark-" + r, layer: "over", kind: "path", brush: "spray", color: GREEN, weight: 2.4,
      pts: [[105 + Math.cos(a) * 52, 330 + Math.sin(a) * 52], [105 + Math.cos(a) * 92, 330 + Math.sin(a) * 92]],
      head: [B.tier3.ai + r * 0.015, B.tier3.ai + 0.24 + r * 0.015], until: B.wipe2.head[0] + 0.2 });
  }

  // AI chips get the same pen check-mark as the tier-2 features
  [[100, 438], [100, 534], [100, 630]].forEach(function (p, i) {
    var t = B.tier3.aiChips[i] + 0.12;
    S.push({ id: "aichk-" + i, layer: "over", kind: "path", brush: "pen", color: TEAL, weight: 3.2,
      pts: [[p[0] - 15, p[1] + 1], [p[0] - 4, p[1] + 13], [p[0] + 17, p[1] - 14]], head: [t, t + 0.22], until: B.wipe2.head[0] + 0.2 });
  });

  // T3 — panel wipe into the CTA (green/teal, mirrors T2)
  [[GREEN, 150], [TEAL, 360], [GREEN, 570], [TEAL, 780]].forEach(function (c, i) {
    S.push({ id: "w2-band-" + i, layer: "over", kind: "path", brush: "marker", color: c[0], weight: 40,
      pts: band(-60, 1140, c[1], 16), head: shift(B.wipe2.head, i * 0.04 - 0.12), tail: shift(B.wipe2.tail, i * 0.04) });
  });

  // B08 — soft Parlana-green swash behind the lockup, underline under "Cuál de estos 3", rings around 1 · 2 · 3
  S.push({ id: "lockup-wash", layer: "under", kind: "fill", color: PARLANA, alpha: 34,
    rect: [175, 112, 730, 156], head: [B.cta.lockup - 0.05, B.cta.lockup + 0.4] });
  S.push({ id: "cual-under", layer: "under", kind: "path", brush: "marker", color: GREEN, weight: 7,
    pts: band(236, 842, 368, 4, 5), head: [B.cta.underline, B.cta.underline + 0.42] });
  [300, 540, 780].forEach(function (x, i) {
    S.push({ id: "badge-ring-" + i, layer: "over", kind: "arc", brush: "marker", color: GREEN, weight: 2.2,
      arc: { x: x, y: 662, r: 90, start: -Math.PI * 0.55, sweep: Math.PI * 2 * 0.97 },
      head: [B.cta.circles[i], B.cta.circles[i] + 0.34] });
  });

  // ---------- Partial path by arc length: the visible segment between fractions a and b ----------
  function segment(pts, a, b) {
    var L = [0], i;
    for (i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    var total = L[L.length - 1];
    function at(d) {
      for (var j = 1; j < pts.length; j++) {
        if (L[j] >= d) {
          var k = (d - L[j - 1]) / (L[j] - L[j - 1] || 1);
          return [lerp(pts[j - 1][0], pts[j][0], k), lerp(pts[j - 1][1], pts[j][1], k)];
        }
      }
      return pts[pts.length - 1];
    }
    var da = a * total, db = b * total, out = [at(da)];
    for (i = 1; i < pts.length - 1; i++) if (L[i] > da && L[i] < db) out.push(pts[i]);
    out.push(at(db));
    return out;
  }

  // Visible window [a, b] of a stroke at time t, or null when it is not on screen
  function windowOf(s, t) {
    if (t < s.head[0]) return null;
    if (s.until !== undefined && t >= s.until) return null;
    if (s.tail && t >= s.tail[1]) return null;
    var b = s.headFn ? s.headFn(t) : prog(t, s.head);
    var a = s.tail ? prog(t, s.tail) : 0;
    if (b - a < 0.004) return null;
    return [a, b];
  }

  function drawStroke(s, w) {
    brush.seed(hash(s.id));
    brush.noiseSeed(hash(s.id) ^ 0x9e3779b9);
    if (s.kind === "fill") {
      brush.noStroke();
      brush.fill(s.color, Math.round(s.alpha * w[1]));
      brush.fillBleed(0.18, "out");
      brush.rect(s.rect[0], s.rect[1], s.rect[2], s.rect[3]);
      brush.noFill();
      return;
    }
    brush.set(s.brush, s.color, s.weight);
    if (s.kind === "arc") {
      var c = s.arc;
      brush.arc(c.x, c.y, c.r, c.start + c.sweep * w[0], c.start + c.sweep * w[1]);
      return;
    }
    var seg = segment(s.pts, w[0], w[1]);
    if (seg.length === 2) brush.line(seg[0][0], seg[0][1], seg[1][0], seg[1][1]);
    else brush.spline(seg, 0.5);
  }

  // ---------- Runtime: one off-DOM WebGL2 target, blitted into the two visible 2D layers ----------
  var off = new OffscreenCanvas(W, H);
  brush.load(off);
  brush.scaleBrushes(4);
  // brush.clear() leaves (1,1,1,0): an invalid premultiplied pixel that headless Chrome composites as
  // additive white over everything below. Clear the GL buffer to true transparent after it.
  var gl = off.getContext("webgl2");
  var views = {
    under: document.getElementById("brush-under").getContext("2d"),
    over: document.getElementById("brush-over").getContext("2d"),
  };
  var lastKey = { under: null, over: null };

  function renderLayer(layer, t) {
    var active = [], key = "";
    for (var i = 0; i < S.length; i++) {
      if (S[i].layer !== layer) continue;
      var w = windowOf(S[i], t);
      if (!w) continue;
      active.push([S[i], w]);
      key += S[i].id + ":" + w[0].toFixed(3) + "-" + w[1].toFixed(3) + ";";
    }
    if (key === lastKey[layer]) return; // nothing moved on this layer since the last frame
    lastKey[layer] = key;
    var view = views[layer];
    view.clearRect(0, 0, W, H);
    // an empty layer is hidden, so it never sits over the scene as an (audited) canvas
    view.canvas.style.visibility = active.length ? "visible" : "hidden";
    if (!active.length) return;
    brush.clear();
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    brush.push();
    brush.translate(-W / 2, -H / 2);
    for (var j = 0; j < active.length; j++) drawStroke(active[j][0], active[j][1]);
    brush.pop();
    brush.render();
    view.drawImage(off, 0, 0);
  }

  window.__renderBrush = function (t) {
    renderLayer("under", t);
    renderLayer("over", t);
  };
})();
