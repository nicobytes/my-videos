/* Motion prototype, states 1–6 of MOTION.md. Data and pure functions of time only.
 * Loaded by index.html (render) and by scripts/cues.mjs (sound cues), so both read the same instants.
 * Beat grid: the music track starts on its first beat (data-media-start 0.064), so beat k ≈ 0.6 k s.
 * World coordinates: the 1080×1920 canvas before the camera.
 */
(function (root) {
  var P = root.Physics;
  var hex = P.hex;

  var D = 15.6;
  var BEAT = [0, 0.608, 1.205, 1.803, 2.4, 2.997, 3.595, 4.203, 4.8, 5.397, 5.995, 6.603, 7.2, 7.797, 8.395, 9.003, 9.6, 10.197, 10.795, 11.403, 12.0, 12.597, 13.195, 13.803, 14.4, 14.997, 15.595];
  var S = [0, BEAT[4], BEAT[8], BEAT[12], BEAT[16], BEAT[20], D]; // state starts (1..6) and the end

  // The one shape. Each state: rect [x, y, w, h], radius, fill, edge.
  var SHELL = [
    { t: S[0], rect: [140, 590, 800, 580], r: 40, fill: "#FFFFFF", edge: "#D3D1C7" }, // 1 agenda card 10:00
    { t: S[1], rect: [170, 450, 740, 840], r: 56, fill: "#EFEAE2", edge: "#D3D1C7" }, // 2 chat
    { t: S[2], rect: [90, 600, 900, 560], r: 40, fill: "#FFFFFF", edge: "#D3D1C7" }, // 3 weeks
    { t: S[3], rect: [300, 590, 480, 480], r: 240, fill: "#FFFFFF", edge: "#FFFFFF" }, // 4 the lost hour
    { t: S[4], rect: [170, 420, 740, 880], r: 56, fill: "#FFFFFF", edge: "#D3D1C7" }, // 5 busy phone
    { t: S[5], rect: [140, 770, 800, 180], r: 90, fill: "#FFFFFF", edge: "#D3D1C7" }, // 6 automatic reminders
  ];

  // The thread: the appointment's status pill. It is in every frame and changes what it is.
  var PILL = [
    { t: 0, rect: [676, 1076, 208, 62], r: 31, fill: "#FFFFFF", edge: "#D3D1C7", face: "pending" },
    { t: BEAT[3], rect: [600, 1122, 320, 100], r: 50, fill: "#2C2C2A", edge: "#2C2C2A", face: "missed" }, // tap: "No llegó"
    { t: S[1], rect: [800, 1192, 80, 80], r: 40, fill: "#2C2C2A", edge: "#2C2C2A", face: "send" }, // the send button
    { t: BEAT[6], rect: [236, 840, 150, 76], r: 38, fill: "#FFFFFF", edge: "#FFFFFF", face: "dots" }, // "escribiendo…"
    { t: BEAT[7], rect: [236, 850, 108, 56], r: 28, fill: "#FFFFFF", edge: "#E4E1D8", face: "dots" }, // …and it dies
    { t: S[2], rect: [700, 636, 234, 64], r: 32, fill: "#2C2C2A", edge: "#2C2C2A", face: "count" }, // "No llegó · N"
    { t: S[3], rect: [508, 1050, 64, 40], r: 20, fill: "#2C2C2A", edge: "#2C2C2A", face: null }, // a seed on the disc's edge
    { t: BEAT[15], rect: [370, 1032, 340, 84], r: 42, fill: "#2C2C2A", edge: "#2C2C2A", face: "lost" }, // born from the edge
    { t: S[4], rect: [360, 448, 360, 84], r: 42, fill: "#2C2C2A", edge: "#2C2C2A", face: "island" }, // "Atendiendo a Lucía"
    { t: S[5], rect: [734, 822, 76, 76], r: 38, fill: "#FFFFFF", edge: "#E4E1D8", face: null }, // the toggle's knob
    { t: BEAT[22], rect: [802, 822, 76, 76], r: 38, fill: "#FFFFFF", edge: "#E4E1D8", face: null, stretch: 0.45, vsat: 450 }, // ON: a short, fast trip, so it stretches hard
  ];

  // Camera: zoom + world centre per state, pinned to the screen point (540, 880).
  var CAM = [
    { t: S[0], z: 1.2, x: 540, y: 900 },
    { t: S[1], z: 1.22, x: 540, y: 880 },
    { t: S[2], z: 1.08, x: 540, y: 880 },
    { t: S[3], z: 1.3, x: 540, y: 860 },
    { t: S[4], z: 1.2, x: 540, y: 860 },
    { t: S[5], z: 1.22, x: 540, y: 860 },
  ];

  // The cursor causes every change. World targets; it springs between them.
  var CUR0 = { x: 880, y: 1330 };
  var CUR = [
    { t: 0.45, x: 790, y: 1108 }, // to "Pendiente"
    { t: 2.25, x: 842, y: 1234 }, // to the send button
    { t: 3.35, x: 720, y: 990 }, // waits for an answer
    { t: 4.85, x: 780, y: 930 }, // grabs the weeks
    { t: 5.45, x: 330, y: 930, w: 5, z: 1 }, // drags them left
    { t: 6.3, x: 540, y: 835 }, // to the hour
    { t: 9.75, x: 540, y: 1198 }, // reaches for "Enviar recordatorio"…
    { t: 10.35, x: 540, y: 1268 }, // …it slips down…
    { t: 11.0, x: 650, y: 1150 }, // …gives up
    { t: 12.15, x: 772, y: 860 }, // to the knob
    { t: 13.6, x: 900, y: 1010 }, // lets go: it runs on its own
  ];
  var TAPS = [BEAT[3], BEAT[5], BEAT[22]];
  var HOLDS = [[BEAT[9], 6.2], [BEAT[13], BEAT[15]]];

  var NOTES = [BEAT[17], BEAT[18], BEAT[19]]; // WhatsApp messages piling up in state 5

  function cursorTrack(axis) {
    return P.track(CUR0[axis], CUR.map(function (k) {
      return { t: k.t, v: k[axis], w: k.w || 10, z: k.z || 0.9 };
    }));
  }
  var curX = cursorTrack("x");
  var curY = cursorTrack("y");

  // State 3: the weeks strip under direct manipulation, then thrown into its snap with the hand's velocity.
  var GRAB = HOLDS[0][0];
  var REL = HOLDS[0][1];
  var relX = curX(REL) - curX(GRAB);
  var relV = P.velocity(curX, REL);
  function stripX(t) {
    if (t < GRAB) return 0;
    if (t < REL) return curX(t) - curX(GRAB);
    return P.release(relX, relV, -520, 9, 0.8, t - REL);
  }
  function missedCount(t) {
    var x = stripX(t);
    return 3 + (x <= -130 ? 1 : 0) + (x <= -390 ? 1 : 0);
  }

  root.Proto = {
    D: D, BEAT: BEAT, S: S, SHELL: SHELL, PILL: PILL, CAM: CAM, TAPS: TAPS, HOLDS: HOLDS, NOTES: NOTES,
    curX: curX, curY: curY, stripX: stripX, missedCount: missedCount, hex: hex,
  };
})(typeof window !== "undefined" ? window : globalThis);
