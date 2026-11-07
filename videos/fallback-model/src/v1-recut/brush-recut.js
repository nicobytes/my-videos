/* p5.brush accent layer for fallback-model — seek-safe and deterministic.
 *
 * Engine adapted from videos/whatsapp-tips/src/brush-layer.js (p5.brush 2.2.3, MIT).
 * Strokes are data read from window.__RECUT.strokes:
 *   { id, layer, kind, brush, color, weight, pts | arc | rect, head:[t0,t1], tail?:[t2,t3], until? }
 * renderRecut(t) is a pure function of t: each stroke reseeds the RNG from its own id.
 * Drawing happens on one off-DOM WebGL2 canvas and is blitted into #brush-under and #brush-over.
 */
(function () {
  var R = window.__RECUT;
  var W = 1080, H = 1920;

  function lerp(a, b, k) { return a + (b - a) * k; }
  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function easeInOut(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  function prog(t, span, ease) { return span ? (ease || easeInOut)(clamp01((t - span[0]) / (span[1] - span[0]))) : 0; }
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

  // Partial path by arc length: the visible segment between fractions a and b
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
    var b = prog(t, s.head);
    var a = s.tail ? prog(t, s.tail) : 0;
    if (b - a < 0.004) return null;
    return [a, b];
  }

  // Hand-drawn horizontal band from x0 to x1 at y (waved, not ruler-straight)
  function band(x0, x1, y, amp, n) {
    var pts = [];
    n = n || 6;
    for (var i = 0; i <= n; i++) {
      var k = i / n;
      pts.push([lerp(x0, x1, k), y + Math.sin(k * Math.PI * 2 + (hash("b" + y) % 7)) * amp]);
    }
    return pts;
  }

  var S = (R.strokes || []).map(function (s) {
    if (s.band) { s.pts = band(s.band[0], s.band[1], s.band[2], s.band[3] || 4, s.band[4] || 5); }
    return s;
  });

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

  // One off-DOM WebGL2 target, blitted into the two visible 2D layers
  var off = new OffscreenCanvas(W, H);
  brush.load(off);
  brush.scaleBrushes(4);
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
    if (key === lastKey[layer]) return;
    lastKey[layer] = key;
    var view = views[layer];
    view.clearRect(0, 0, W, H);
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

  window.__renderRecut = function (t) {
    renderLayer("under", t);
    renderLayer("over", t);
  };
})();
