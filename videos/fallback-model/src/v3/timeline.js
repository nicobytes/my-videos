(function () {
  var tl = gsap.timeline({ paused: true });
  var CAPS = /*CAPTIONS*/;
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var IR = { immediateRender: false };
  function o(a, b) { for (var k in b) a[k] = b[k]; return a; }

  // Camera helper: scale the .cam (origin 0 0) so content point (cx,cy) lands on view point (tx,ty)
  function cam(card, t, s, cx, cy, tx, ty, d, ease) {
    tl.to("#" + card + " .cam", { scale: s, x: tx - s * cx, y: ty - s * cy, duration: d, ease: ease || "power3.inOut" }, t);
  }
  function shake(sel, t, amp) {
    [-1, 1, -0.6, 0.4, 0].forEach(function (k, i) { tl.to(sel, { x: k * amp, duration: 1 / 30, ease: "none" }, t + i / 30); });
  }
  function vzoom(t, from, to, d, ease) {
    tl.fromTo("#video-zoom", { scale: from }, o({ scale: to, duration: d, ease: ease || "power1.inOut" }, IR), t);
  }

  // ── Cards: wipe up in (camera arrives pulling back), wipe up out (camera keeps rising) ──
  // Vector law: every card seam moves on the same upward axis, cut mid-motion on both sides.
  var CARDS = [
    ["k1", 5.0, 12.48, 1.07], ["k2", 19.68, 32.24, 1.14], ["k2b", 33.8, 36.08, 1.1],
    ["k3", 36.08, 50.32, null], ["k4", 57.08, 66.04, 1.16], ["k5", 66.04, 76.4, null], ["k6", 81.76, 90.18, 1.13]
  ];
  CARDS.forEach(function (c, i) {
    var id = c[0], s = c[1], e = c[2], el = "#" + id;
    var next = CARDS[i + 1], toCard = next && Math.abs(next[1] - e) < 0.01;
    tl.set(el, { visibility: "visible" }, s);
    tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, o({ clipPath: "inset(0% 0% 0% 0%)", duration: 0.75, ease: "power4.inOut" }, IR), s);
    tl.fromTo(el + " .cam", { scale: 1.12, x: 540 - 1.12 * 540, y: 460 - 1.12 * 460 + 120 }, o({ scale: 1, x: 0, y: 0, duration: 1.1, ease: "expo.out" }, IR), s + 0.05);
    if (c[3] !== null) {
      // the talking head pushes forward into the card, then drops out
      vzoom(s, c[3], c[3] + 0.18, 0.7, "power2.in");
      tl.fromTo("#video-wrap", { opacity: 1 }, o({ opacity: 0, duration: 0.4, ease: "power2.in" }, IR), s + 0.3);
    }
    tl.fromTo(el + " .lbl:not([data-at])", { opacity: 0, x: 40 }, o({ opacity: 1, x: 0, duration: 0.6, ease: "expo.out" }, IR), s + 0.3);
    tl.fromTo(el + " .ttl.ln > span:not([id])", { yPercent: 115 }, o({ yPercent: 0, duration: 0.8, ease: "expo.out" }, IR), s + 0.38);

    if (e >= 90) return;
    var out = e - 0.35;
    tl.to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.7, ease: "power4.inOut" }, out);
    tl.to(el + " .view", { y: -160, duration: 0.7, ease: "power4.in" }, out);
    if (!toCard) {
      tl.fromTo("#video-wrap", { opacity: 0 }, o({ opacity: 1, duration: 0.2, ease: "none" }, IR), out);
      vzoom(out, 1.14, 1.0, 1.0, "expo.out");
    }
    tl.set(el, { visibility: "hidden" }, e + 0.4);
  });

  tl.set("#k2-fill, #k3-a .bar i, #k3-bfill, #k5 .strike, #k5 .hl", { scaleX: 0, transformOrigin: "0% 50%" }, 0);

  // ── Staged reveals: each [data-at] element lands on its word ──
  $$("[data-at]").forEach(function (n) {
    var t = parseFloat(n.getAttribute("data-at"));
    if (n.classList.contains("big")) {
      tl.fromTo(n, { opacity: 0, scale: 1.5, transformOrigin: "0% 80%" }, o({ opacity: 1, scale: 1, duration: 0.42, ease: "power4.in" }, IR), t);
    } else if (n.classList.contains("unav")) {
      tl.fromTo(n, { opacity: 0, x: -60, scaleX: 1.15, transformOrigin: "0% 50%" }, o({ opacity: 1, x: 0, scaleX: 1, duration: 0.7, ease: "expo.out" }, IR), t);
    } else if (n.classList.contains("row") || n.classList.contains("opt") || n.classList.contains("node") || n.classList.contains("model")) {
      tl.fromTo(n, { opacity: 0, x: 90 }, o({ opacity: 1, x: 0, duration: 0.65, ease: "expo.out" }, IR), t);
    } else if (n.classList.contains("focus")) {
      tl.fromTo(n, { opacity: 0, scale: 1.25 }, o({ opacity: 1, scale: 1, duration: 0.5, ease: "expo.out" }, IR), t);
    } else {
      tl.fromTo(n, { opacity: 0, y: 46 }, o({ opacity: 1, y: 0, duration: 0.7, ease: "expo.out" }, IR), t);
    }
  });

  // ── k1 · 503: slam, then the camera dives into the error block ──
  shake("#k1 .view", 7.02, 12);
  cam("k1", 9.6, 1.62, 390, 601, 540, 470, 1.4);

  // ── k2 · reintentos: each retry fails, the service saturates ──
  $$("#k2 .row .bad").forEach(function (b, i) {
    var t = [21.7, 24.1, 25.2][i] + 0.35;
    tl.fromTo(b, { scale: 0.3, opacity: 0 }, o({ scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2.2)" }, IR), t);
    shake(b.parentNode, t + 0.05, 7);
  });
  [[26.1, 0.3, "#2f9e5a"], [27.6, 0.52, "#f5a524"], [28.9, 0.76, "#f08a24"], [30.6, 1, "#e5484d"]].forEach(function (s) {
    tl.to("#k2-fill", { scaleX: s[1], backgroundColor: s[2], duration: 0.5, ease: "power2.out" }, s[0]);
  });
  cam("k2", 28.8, 1.16, 540, 650, 540, 500, 1.3);
  tl.fromTo("#k2-stamp", { opacity: 0, scale: 1.9, rotation: -16 }, o({ opacity: 1, scale: 1, rotation: -6, duration: 0.26, ease: "power4.in" }, IR), 31.0);
  shake("#k2 .view", 31.26, 16);

  // ── k2b · la solución: hero lands, camera drifts in ──
  tl.fromTo("#k2b .hero", { opacity: 0, scale: 0.9, y: 50 }, o({ opacity: 1, scale: 1, y: 0, duration: 0.9, ease: "expo.out" }, IR), 34.0);
  tl.fromTo("#k2b .sub", { opacity: 0, y: 30 }, o({ opacity: 1, y: 0, duration: 0.6, ease: "expo.out" }, IR), 34.6);
  cam("k2b", 34.9, 1.05, 540, 440, 540, 440, 1.2, "power1.inOut");

  // ── k3 · OpenRouter: wires draw, A fails, B takes over, then B saturates ──
  ["#w0", "#wa", "#wb"].forEach(function (id, i) {
    var p = $(id), L = p.getTotalLength();
    tl.set(p, { strokeDasharray: L, strokeDashoffset: L }, 0);
    tl.to(p, { strokeDashoffset: 0, duration: 0.55, ease: "power2.inOut" }, [37.2, 39.4, 42.0][i]);
  });
  tl.to("#k3-a", { borderColor: "#e5484d", backgroundColor: "#fdecec", duration: 0.25 }, 41.5);
  tl.to("#wa", { stroke: "#e5484d", duration: 0.25 }, 41.5);
  tl.fromTo("#k3-a503", { opacity: 0, scale: 0.3 }, o({ opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2.2)" }, IR), 41.55);
  tl.to("#k3-a .bar i", { scaleX: 1, duration: 0.5, ease: "power2.out" }, 41.5);
  shake("#k3-a", 41.6, 8);
  cam("k3", 45.9, 1.3, 780, 685, 600, 520, 1.3);
  tl.to("#k3-bfill", { scaleX: 1, duration: 1.6, ease: "power1.in" }, 46.3);
  tl.to("#k3-b", { borderColor: "#e5484d", duration: 0.3 }, 47.8);

  // ── k4 · ADK: experimental stamp slams, the class name types itself ──
  tl.fromTo("#k4-exp", { opacity: 0, scale: 1.7, rotation: 6 }, o({ opacity: 1, scale: 1, rotation: -4, duration: 0.26, ease: "power4.in" }, IR), 61.5);
  shake("#k4 .view", 61.76, 10);
  var chars = $$("#k4-fbm > span");
  tl.set(chars, { opacity: 0 }, 0);
  tl.set("#k4-fbm .caret", { opacity: 0 }, 0);
  tl.set("#k4-fbm .caret", { opacity: 1 }, 62.9);
  tl.to(chars, { opacity: 1, duration: 0.01, stagger: 0.045 }, 63.0);
  tl.set("#k4-fbm .caret", { opacity: 0 }, 64.0);
  cam("k4", 63.0, 1.06, 540, 400, 540, 400, 1.2, "power2.out");
  cam("k4", 64.0, 1.0, 0, 0, 0, 0, 1.0, "power2.inOut");

  // ── k5 · code: types in, camera dives to the failing model, pans to the backup ──
  tl.fromTo("#k5 .code", { opacity: 0, y: 60 }, o({ opacity: 1, y: 0, duration: 0.7, ease: "expo.out" }, IR), 66.3);
  tl.fromTo("#k5 .code .ty", { clipPath: "inset(0% 100% 0% 0%)" }, o({ clipPath: "inset(0% 0% 0% 0%)", duration: 0.34, ease: "steps(14)", stagger: 0.22 }, IR), 66.45);
  cam("k5", 68.6, 1.3, 500, 482, 540, 420, 0.9);
  tl.to("#k5 .strike", { scaleX: 1, duration: 0.35, ease: "power3.inOut" }, 69.0);
  tl.fromTo("#k5-503", { opacity: 0, scale: 0.3 }, o({ opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2.2)" }, IR), 69.25);
  shake("#k5 .code .l:nth-child(5)", 69.3, 8);
  cam("k5", 70.1, 1.3, 500, 538, 540, 420, 0.75);
  tl.to("#k5 .hl", { scaleX: 1, duration: 0.45, ease: "power3.out" }, 71.6);
  cam("k5", 73.7, 1.0, 0, 0, 0, 0, 0.9);
  tl.fromTo("#k5-resp", { opacity: 0, y: 50, scale: 0.95 }, o({ opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "expo.out" }, IR), 75.0);

  // ── k6 · conclusión: title lands on "usar este fallback", camera keeps pushing ──
  tl.fromTo("#k6-t", { opacity: 0, yPercent: 115 }, o({ opacity: 1, yPercent: 0, duration: 0.85, ease: "expo.out" }, IR), 83.6);
  cam("k6", 82.2, 1.05, 540, 400, 540, 400, 7.8, "power1.inOut");

  // ── Chips over the talking head ──
  function chip(id, s, e, extra) {
    var el = "#" + id;
    tl.set(el, { visibility: "visible" }, s);
    tl.fromTo(el, { opacity: 0, y: 50, scale: 0.96 }, o({ opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "expo.out" }, IR), s);
    tl.fromTo(el + " > .ln > span", { yPercent: 115 }, o({ yPercent: 0, duration: 0.75, ease: "expo.out", stagger: 0.12 }, IR), s + 0.08);
    (extra || []).forEach(function (x) {
      tl.fromTo(x[0], { opacity: 0, y: 18 }, o({ opacity: 1, y: 0, duration: 0.5, ease: "expo.out" }, IR), x[1]);
    });
    tl.to(el, { opacity: 0, y: -50, duration: 0.32, ease: "power3.in" }, e - 0.32);
    tl.set(el, { visibility: "hidden" }, e);
  }
  chip("c0", 0.05, 5.0);
  chip("c1a", 12.6, 16.5);
  chip("c1b", 16.56, 19.68, [["#c1b .s", 18.64]]);
  chip("c3", 32.3, 33.8);
  chip("c4", 50.5, 57.08);
  tl.set("#c4-r2", { opacity: 0 }, 0);
  tl.fromTo("#c4-r2", { opacity: 0, y: 18 }, o({ opacity: 1, y: 0, duration: 0.5, ease: "expo.out" }, IR), 53.5);
  chip("c5", 76.5, 81.76, [["#c5-s", 78.4]]);

  // ── Talking-head camera: slow pushes, punch-ins on the key words ──
  vzoom(0, 1.0, 1.07, 5.0);
  vzoom(13.2, 1.0, 1.04, 4.8);
  vzoom(18.1, 1.04, 1.14, 0.45, "expo.out");
  vzoom(32.5, 1.0, 1.1, 0.45, "expo.out");
  vzoom(51.0, 1.0, 1.05, 2.5);
  vzoom(53.55, 1.05, 1.13, 0.45, "expo.out");
  vzoom(54.2, 1.13, 1.16, 2.8);
  vzoom(77.2, 1.0, 1.04, 2.7);
  vzoom(80.0, 1.04, 1.13, 0.45, "expo.out");

  // ── Captions (phrase-level from captions.srt) ──
  CAPS.forEach(function (c) {
    tl.set("#cap", { innerHTML: c.text }, c.s);
    tl.fromTo("#cap", { opacity: 0, y: 10 }, o({ opacity: 1, y: 0, duration: 0.14, ease: "power2.out" }, IR), c.s);
    tl.to("#cap", { opacity: 0, duration: 0.1, ease: "power1.in" }, c.e - 0.1);
  });

  window.__timelines = window.__timelines || {};
  window.__timelines["fallback-model-recut"] = tl;
})();
