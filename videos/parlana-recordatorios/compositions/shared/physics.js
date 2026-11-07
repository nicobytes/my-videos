/* Closed-form spring physics for HyperFrames.
 *
 * Every value is a pure function of time: no integration, no state carried between frames,
 * so seeking forward or backward to any instant gives the exact same frame.
 *
 *   w  natural frequency (rad/s): higher is stiffer and faster
 *   z  damping ratio: 1 never overshoots; 0.78 overshoots ~2.8 %; 0.72 ~3.8 %
 */
(function (root) {
  // Unit step response of a damped spring that starts at rest: 0 → 1, t seconds after the step.
  function step(t, w, z) {
    if (t <= 0) return 0;
    if (z < 1) {
      var wd = w * Math.sqrt(1 - z * z);
      return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w) / wd) * Math.sin(wd * t));
    }
    return 1 - Math.exp(-w * t) * (1 + w * t);
  }

  // A value whose target changes at given times: keys [{ t, v, w, z }].
  // It is the sum of one step response per change. A spring is linear, so the sum is exact:
  // a new target mid-flight bends the motion and keeps its momentum instead of restarting at rest.
  function track(x0, keys) {
    var deltas = [];
    var prev = x0;
    keys.forEach(function (k) {
      deltas.push({ t: k.t, d: k.v - prev, w: k.w, z: k.z });
      prev = k.v;
    });
    return function (t) {
      var x = x0;
      for (var i = 0; i < deltas.length; i++) {
        var k = deltas[i];
        if (t > k.t) x += k.d * step(t - k.t, k.w, k.z);
      }
      return x;
    };
  }

  // Free response tau seconds after a release from x0 with velocity v0, towards target.
  function release(x0, v0, target, w, z, tau) {
    if (tau <= 0) return x0;
    var a = x0 - target;
    if (z < 1) {
      var wd = w * Math.sqrt(1 - z * z);
      var b = (v0 + z * w * a) / wd;
      return target + Math.exp(-z * w * tau) * (a * Math.cos(wd * tau) + b * Math.sin(wd * tau));
    }
    return target + Math.exp(-w * tau) * (a + (v0 + w * a) * tau);
  }

  // Velocity of any pure function of time (central difference).
  function velocity(f, t) {
    var h = 1 / 480;
    return (f(t + h) - f(t - h)) / (2 * h);
  }

  // A shape that morphs between states: [{ t, rect: [x, y, w, h], r, w?, z?, stretch?, vsat? }].
  // Centre and size each ride a spring. On top, squash & stretch from the real velocity: the
  // shape lengthens along its motion (up to `stretch` of its size, reached at `vsat` px/s),
  // thins across it, and its front leads. Capped, so a long trip never balloons the shape.
  function body(states, opts) {
    function tr(get, zz) {
      return track(get(states[0]), states.slice(1).map(function (s) {
        return { t: s.t, v: get(s), w: s.w || opts.w, z: zz || s.z || opts.z };
      }));
    }
    var CX = tr(function (s) { return s.rect[0] + s.rect[2] / 2; });
    var CY = tr(function (s) { return s.rect[1] + s.rect[3] / 2; });
    var SW = tr(function (s) { return s.rect[2]; });
    var SH = tr(function (s) { return s.rect[3]; });
    var RR = tr(function (s) { return s.r / (Math.min(s.rect[2], s.rect[3]) / 2); }, 0.95); // roundness 0..1
    return function (t) {
      var s = states[0];
      for (var i = 1; i < states.length; i++) if (states[i].t <= t) s = states[i];
      var cap = s.stretch !== undefined ? s.stretch : opts.stretch || 0;
      var vsat = s.vsat || opts.vsat || 1200;
      var vx = velocity(CX, t);
      var vy = velocity(CY, t);
      var fx = cap * Math.min(1, Math.abs(vx) / vsat);
      var fy = cap * Math.min(1, Math.abs(vy) / vsat);
      var w0 = Math.max(0, SW(t));
      var h0 = Math.max(0, SH(t));
      var w1 = w0 * (1 + fx) * (1 - 0.4 * fy);
      var h1 = h0 * (1 + fy) * (1 - 0.4 * fx);
      var cx = CX(t) + Math.sign(vx) * (w1 - w0) * 0.25;
      var cy = CY(t) + Math.sign(vy) * (h1 - h0) * 0.25;
      var rad = Math.min(1, Math.max(0, RR(t))) * Math.min(w1, h1) / 2;
      return { l: cx - w1 / 2, r: cx + w1 / 2, t: cy - h1 / 2, b: cy + h1 / 2, rad: rad };
    };
  }

  // A colour that springs between states, critically damped (a colour never overshoots).
  function color(states, w) {
    var ch = [0, 1, 2].map(function (c) {
      return track(states[0].c[c], states.slice(1).map(function (s) {
        return { t: s.t, v: s.c[c], w: w, z: 1 };
      }));
    });
    return function (t) {
      return "rgb(" + ch.map(function (f) {
        return Math.round(Math.min(255, Math.max(0, f(t))));
      }).join(",") + ")";
    };
  }

  function hex(h) {
    return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  }

  var api = { step: step, track: track, release: release, velocity: velocity, body: body, color: color, hex: hex };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Physics = api;
})(typeof window !== "undefined" ? window : globalThis);
