/* Reel v3: the 3D camera (MOTION.md § 3D), shared by the WebGL layers (Three.js) and the DOM layers (matrix3d).
 * Needs physics.js, timing.js and timeline.js loaded first. Pure functions of time; also runs in Node.
 *
 * World: the v2 canvas in px (x right, y down) plus a height z in px above the background.
 * GL space is (x, -y, z). Every layer reads the same matrices, so WebGL and DOM cannot drift apart.
 */
(function (root) {
  var P = root.Physics;
  var R = root.Reel;
  var A = R.A;
  var S = R.S;
  var W = R.W;
  var H = R.H;
  var DEG = Math.PI / 180;

  var FOV = 30 * DEG; // vertical
  var NEAR = 100;
  var FAR = 20000;
  var SHIFT = (H / 2 - 880) / (H / 2); // lens shift: the camera target lands on the v2 screen anchor (540, 880)

  // Heights in px above the background.
  var FLOAT = 56; // the slab hovers: its shadow sits off it
  var SLAB_D = 40; // slab thickness, bevels included
  var SLAB_TOP = FLOAT + SLAB_D;
  var PILL_D = 18;
  var BEVEL = 4;
  var LIGHT = [-0.12, 0.45, 1]; // towards the key light (GL): a little left, above, in front

  // ── mat4, column-major (WebGL, Three.js and CSS matrix3d all read this order) ────────────────────
  function mul(a, b) {
    var o = new Array(16);
    for (var c = 0; c < 4; c++) {
      for (var r = 0; r < 4; r++) {
        o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
      }
    }
    return o;
  }
  function chain() {
    var m = arguments[0];
    for (var i = 1; i < arguments.length; i++) m = mul(m, arguments[i]);
    return m;
  }
  function translate(x, y, z) {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1];
  }
  function rotX(a) {
    var c = Math.cos(a);
    var s = Math.sin(a);
    return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
  }
  function rotY(a) {
    var c = Math.cos(a);
    var s = Math.sin(a);
    return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
  }
  function rotZ(a) {
    var c = Math.cos(a);
    var s = Math.sin(a);
    return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  }
  function perspective(fovy, aspect, n, f) {
    var k = 1 / Math.tan(fovy / 2);
    var m = [k / aspect, 0, 0, 0, 0, k, 0, 0, 0, 0, (f + n) / (n - f), -1, 0, 0, (2 * f * n) / (n - f), 0];
    m[9] -= SHIFT; // y_clip += SHIFT · w_clip
    return m;
  }
  function sub(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  }
  function cross(a, b) {
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  }
  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
  function norm(a) {
    var l = Math.sqrt(dot(a, a));
    return [a[0] / l, a[1] / l, a[2] / l];
  }
  function lookAt(eye, at, up) {
    var f = norm(sub(at, eye));
    var s = norm(cross(f, up));
    var u = cross(s, f);
    return [s[0], u[0], -f[0], 0, s[1], u[1], -f[1], 0, s[2], u[2], -f[2], 0, -dot(s, eye), -dot(u, eye), dot(f, eye), 1];
  }
  function apply(m, v) {
    var o = [0, 0, 0, 0];
    for (var r = 0; r < 4; r++) o[r] = m[r] * v[0] + m[4 + r] * v[1] + m[8 + r] * v[2] + m[12 + r] * v[3];
    return o;
  }
  // clip → canvas px (before ÷w). z is negated so CSS sees a surface that faces the camera as front-facing
  // (backface-visibility relies on it; flattened layers otherwise ignore z).
  var VIEWPORT = [W / 2, 0, 0, 0, 0, -H / 2, 0, 0, 0, 0, -1, 0, W / 2, H / 2, 0, 1];
  var DOM = [1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]; // DOM px (y down) → GL (y up)

  // ── camera pose per state: pitch (camera below, looking up) and yaw (camera to the right), in degrees ─
  // "Se inclina al cambiar, se endereza al leer": a calm pose while the state reads, a lean on every morph.
  var POSE = {
    card: [12, -6],
    chat: [10, 7],
    weeks: [12, -5],
    disc: [16, 0],
    list: [11, 6],
    busy: [10, -7],
    toggle: [14, 5],
    timeline: [12, -6],
    client: [10, 7],
    price: [12, -5],
    parlana: [16, 0],
    inbox: [10, 7],
    split: [10, 0],
    cta: [12, -4],
    loop: [12, -6], // = card: the loop does not jump
  };
  // Looks inside a state: [pitch, yaw] keys on a word (the split screen turns to each side as the voice names it).
  var LOOK = [
    { t: R.beatNear(A.llegan), v: [10, -10] }, // "quienes llegan": towards "En tu local"
    { t: R.beatNear(A.escriben), v: [10, 10] }, // "quienes te escriben": towards "En WhatsApp"
    { t: R.beatNear(A.organizar), v: [10, 0] },
  ];
  function poseTrack(i) {
    var keys = R.ORDER.slice(1).map(function (n) {
      return { t: S[n], v: POSE[n][i] * DEG, w: 6.5, z: 0.92 };
    });
    LOOK.forEach(function (k) {
      keys.push({ t: k.t, v: k.v[i] * DEG, w: 5, z: 0.92 });
    });
    keys.sort(function (a, b) {
      return a.t - b.t;
    });
    return P.track(POSE.card[i] * DEG, keys);
  }
  var pitchBase = poseTrack(0);
  var yawBase = poseTrack(1);
  var MORPHS = R.ORDER.slice(1).map(function (n) {
    return S[n];
  });
  // On each morph the camera dips and comes back (a critically damped there-and-back).
  function dip(t) {
    var b = 0;
    for (var i = 0; i < MORPHS.length; i++) {
      var tau = t - MORPHS[i];
      if (tau > 0 && tau < 3) b += P.step(tau, 9, 1) - P.step(tau - 0.3, 9, 1);
    }
    return b;
  }

  var memo = { t: NaN };
  function camera3(t) {
    if (memo.t === t) return memo;
    var c = R.camera(t);
    var pitch = pitchBase(t) + 7 * DEG * dip(t);
    var yaw = yawBase(t);
    var d = H / 2 / (c.z * Math.tan(FOV / 2));
    var at = [c.x, -c.y, SLAB_TOP];
    var eye = [at[0] + d * Math.sin(yaw) * Math.cos(pitch), at[1] - d * Math.sin(pitch), at[2] + d * Math.cos(yaw) * Math.cos(pitch)];
    var proj = perspective(FOV, W / H, NEAR, FAR);
    var view = lookAt(eye, at, [0, 1, 0]);
    var tilt = slabTilt(t);
    memo = { t: t, proj: proj, view: view, eye: eye, pitch: pitch, yaw: yaw, tilt: tilt, screen: chain(VIEWPORT, proj, view, tilt) };
    return memo;
  }

  // ── the slab leans into its own motion (a few degrees, from the real velocity of its centre) ─────
  function centre(t) {
    var g = R.shell(t);
    return [(g.l + g.r) / 2, (g.t + g.b) / 2];
  }
  function slabTilt(t) {
    var h = 1 / 480;
    var a = centre(t + h);
    var b = centre(t - h);
    var vx = (a[0] - b[0]) / (2 * h);
    var vy = (a[1] - b[1]) / (2 * h);
    var c = centre(t);
    var drag = P.velocity(R.weeksX, t) + 0.6 * P.velocity(R.sliderX, t); // a hand dragging across the surface tips it
    var ax = 3.5 * DEG * Math.tanh(vy / 2200); // moving down: the leading (bottom) edge dips away
    var ay = 3.5 * DEG * Math.tanh(vx / 2200) + 2.5 * DEG * Math.tanh(drag / 900); // moving right: the right edge dips away
    var p = [c[0], -c[1], SLAB_TOP];
    return chain(translate(p[0], p[1], p[2]), rotX(ax), rotY(ay), translate(-p[0], -p[1], -p[2]));
  }

  // ── DOM: a plane at height z (DOM px in, canvas px out) ──────────────────────────────────────────
  function fmt(m) {
    return "matrix3d(" + m.map(function (v) {
      return +v.toPrecision(10);
    }).join(",") + ")";
  }
  // model: an extra transform in GL world units, applied to the raised plane (a coin that flips, a card that tips).
  function placeMatrix(t, z, model) {
    var m = camera3(t).screen;
    if (model) m = mul(m, model);
    return chain(m, translate(0, 0, z), DOM);
  }
  function place(t, z, model) {
    return fmt(placeMatrix(t, z, model));
  }
  function project(t, x, y, z) {
    var v = apply(camera3(t).screen, [x, -y, z, 1]);
    return { x: v[0] / v[3], y: v[1] / v[3] };
  }

  // ── the thread: the status pill as a 3D token ───────────────────────────────────────────────────
  var pillBody = P.body(R.PILL, { w: 15, z: 0.72, stretch: 0.22, vsat: 1400 });
  var PRESSED = [R.TAP.stamp, R.TAP.confirm, R.TAP.cta, R.TAP.carla, R.TAP.diego];
  function selfPress(t) {
    var k = 0;
    R.AUTOSEND.forEach(function (a) {
      if (t >= a && t < a + 0.06) k = Math.max(k, (t - a) / 0.06);
      else if (t >= a + 0.06 && t < a + 0.24) k = Math.max(k, 1 - P.step(t - a - 0.06, 26, 0.8));
    });
    return k;
  }
  function pillPress(t) {
    var k = 0;
    PRESSED.forEach(function (a) {
      if (t >= a - 0.01 && t < a + 0.35) k = Math.max(k, R.press(t));
    });
    return Math.max(k, 0.8 * selfPress(t));
  }
  // Drops: lifted, carried and slammed down; a bounce is the spring reflected off the surface.
  function dropper(up, land, h) {
    var f = P.track(0, [{ t: up, v: h, w: 11, z: 0.9 }, { t: land - 0.086, v: 0, w: 30, z: 0.55 }]); // first contact ≈ land
    return function (t) {
      return Math.abs(f(t));
    };
  }
  // The coin is tossed on "un boliviano": up on the beat before the word, down on the next one, one flip in the air.
  var TOSS = { up: R.beatAfter(A.boliviano - 0.3, 0), land: R.beatAfter(A.boliviano, 0) };
  var DROPS = [dropper(R.HOLD.stamp[0], R.TAP.stamp, 150), dropper(TOSS.up, TOSS.land, 130)];
  function flip(t) {
    return 2 * Math.PI * R.smooth((t - TOSS.up - 0.04) / (TOSS.land - TOSS.up - 0.1));
  }
  // Roundness: 0 = a flat token, 1 = a ball (the switch's knob).
  var ball = P.track(0, R.PILL.slice(1).map(function (k) {
    return { t: k.t, v: k.ball || 0, w: 12, z: 1 };
  }));
  function pillCentre(t) {
    var g = pillBody(t);
    return [(g.l + g.r) / 2, (g.t + g.b) / 2];
  }
  function pill(t) {
    var g = pillBody(t);
    var k = pillPress(t);
    if (k > 0) {
      var mx = (g.l + g.r) / 2;
      var my = (g.t + g.b) / 2;
      var f = 1 - 0.06 * k;
      g = { l: mx - (mx - g.l) * f, r: mx + (g.r - mx) * f, t: my - (my - g.t) * f, b: my + (g.b - my) * f, rad: g.rad * f };
    }
    // A token that travels lifts off the surface and lands when it arrives.
    var h = 1 / 480;
    var a = pillCentre(t + h);
    var b = pillCentre(t - h);
    var v = Math.hypot((a[0] - b[0]) / (2 * h), (a[1] - b[1]) / (2 * h));
    var lift = 60 * Math.tanh(v / 1600);
    DROPS.forEach(function (d) {
      lift += d(t);
    });
    lift = Math.max(0, lift - 8 * k);
    // Thickness: a token, or a ball as tall as it is wide; a press squashes it.
    var rho = R.clamp01(ball(t));
    var size = Math.min(g.r - g.l, g.b - g.t);
    var depth = (PILL_D + (size - PILL_D) * rho) * (1 - 0.35 * k);
    var bevel = Math.min(0.48 * depth, 3 + (0.48 * depth - 3) * rho);
    var base = SLAB_TOP + lift;
    var model = null;
    var a = flip(t);
    if (a > 1e-4 && a < 2 * Math.PI - 1e-4) {
      var cx = (g.l + g.r) / 2;
      var cy = -(g.t + g.b) / 2;
      var cz = base + depth / 2;
      model = chain(translate(cx, cy, cz), rotX(a), translate(-cx, -cy, -cz));
    }
    return { g: g, k: k, lift: lift, base: base, depth: depth, bevel: bevel, top: base + depth, model: model, round: rho };
  }

  // ── soft shadows: where a caster at height h above a receiver lands, and how soft it is ─────────
  function shadowOf(h) {
    return {
      dx: (-LIGHT[0] / LIGHT[2]) * h,
      dy: (LIGHT[1] / LIGHT[2]) * h, // DOM px: down
      blur: 6 + 0.45 * h,
      alpha: 0.2 / (1 + h / 120),
    };
  }

  // ── moments that belong to one state ────────────────────────────────────────────────────────────
  // 4 · the disc's rim is the clock: inked from 12 o'clock, it drains with the held hour (as the ring on its face).
  function rim(t) {
    var h = R.HOLD.hour;
    return { on: R.vis(t, S.disc, S.list).v, frac: 1 - R.clamp01((t - h[0]) / (h[1] - h[0])) };
  }
  // 11 · the Parlana mark rises out of the slab as it pops in, and sinks back as the state leaves.
  var LOGO_AT = R.beatNear(A.parlana) - 0.1;
  function logoLift(t) {
    var out = R.vis(t, S.parlana, S.inbox).vout;
    return { h: 22 * P.step(t - LOGO_AT - 0.05, 11, 0.55) * out, k: 0.82 + 0.18 * P.step(t - LOGO_AT, 18, 0.72), at: LOGO_AT };
  }

  R.SLAB_TOP = SLAB_TOP;
  R.FLOAT = FLOAT;
  R.SLAB_D = SLAB_D;
  R.PILL_D = PILL_D;
  R.BEVEL = BEVEL;
  R.LIGHT = LIGHT;
  R.camera3 = camera3;
  R.place = place;
  R.placeMatrix = placeMatrix;
  R.project = project;
  R.pill = pill;
  R.TOSS = TOSS;
  R.rim = rim;
  R.logoLift = logoLift;
  R.shadowOf = shadowOf;
  R.mat = { mul: mul, chain: chain, translate: translate, rotX: rotX, rotY: rotY, rotZ: rotZ, apply: apply };
  // The v2 layers keep calling these; they now go through the 3D camera.
  R.worldTransform = function (t) {
    return place(t, SLAB_TOP);
  };
  R.toScreen = function (t, x, y) {
    return project(t, x, y, SLAB_TOP);
  };
})(typeof window !== "undefined" ? window : globalThis);
