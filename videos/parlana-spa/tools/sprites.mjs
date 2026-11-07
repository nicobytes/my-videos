// Pixel-art sprite generator → assets/sprites/*.svg
// Each sprite is an ASCII grid; one char = one art pixel (palette below).
// Symmetric sprites are drawn as a LEFT half and mirrored. Output SVGs use
// shape-rendering="crispEdges" so they scale to any whole-number size cleanly.
// Run: node tools/sprites.mjs
import fs from "fs";
import path from "path";

const OUT = path.join(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Z]:)/, "$1"), "..", "assets", "sprites");
fs.mkdirSync(OUT, { recursive: true });

const PAL = {
  k: "#00260F", // ink outline
  h: "#8F9A45", H: "#6A7633", l: "#B3BD5E", // olive hair
  s: "#F2C5A0", S: "#DDA07C", r: "#E8796A", // skin, shade, blush
  e: "#2C2C2A", w: "#FFFFFF", c: "#F1EFE8", // eye, white, cream
  g: "#009A3E", G: "#00702D", n: "#00BD4C", N: "#7FE0A6", // greens
  m: "#E6F9EE", // mint
  p: "#2C2C2A", P: "#45453F", // charcoal (pants / phone)
  a: "#BA7517", A: "#8C5610", y: "#E8B04A", // amber wood / light
  q: "#FAEEDA", // peach
  u: "#5E3A4A", U: "#46293A", // plum
  d: "#3B2A24", D: "#2A1C18", // dark brown hair
  t: "#888780", T: "#B9B8B0", // stone grays
  x: "#E5484D", X: "#B8323A", // alert red
  b: "#7FB8E8", // sweat / water blue
  f: "#FFD45C", F: "#FF9B3D", // flame
  i: "#C13584", j: "#F77737", o: "#833AB4", // IG gradient stops
  z: "#1877F2", // FB blue
};

const mirror = (rows) => rows.map((r) => r + [...r].reverse().join(""));
function overlay(base, patches) {
  const g = base.map((r) => [...r]);
  for (const [y, x, str] of patches) [...str].forEach((ch, i) => { if (ch !== "_") g[y][x + i] = ch; });
  return g.map((r) => r.join(""));
}
function svg(name, rows, pal = PAL) {
  const w = Math.max(...rows.map((r) => r.length));
  const h = rows.length;
  let rects = "";
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      if (ch === "." || ch === " ") { x++; continue; }
      let run = 1;
      while (row[x + run] === ch) run++;
      if (!pal[ch]) throw new Error(`${name}: unknown color '${ch}' at ${x},${y}`);
      rects += `<rect x="${x}" y="${y}" width="${run}" height="1" fill="${pal[ch]}"/>`;
      x += run;
    }
  });
  fs.writeFileSync(path.join(OUT, name + ".svg"),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" shape-rendering="crispEdges">${rects}</svg>\n`);
  return { name, w, h };
}

// ───────────────────────── Vale (spa owner) — 22×32, front ─────────────────────────
const VALE_L = [
  "...........", //  0 (sprout overlay)
  "...........", //  1
  "......kkkkk", //  2
  "....kkhhhhh", //  3
  "...khhhhhhh", //  4
  "..khhlhhhhh", //  5
  ".khhllhhhhh", //  6
  ".khhhhhhhhh", //  7
  "khhhhhhhhhh", //  8
  "khhhhhhhhhh", //  9
  "khHhhshhhhs", // 10 fringe strands
  "khHhsssshss", // 11
  "khHssssssss", // 12
  "khHssssssss", // 13
  "khHsseessss", // 14 eyes
  "khHsseessss", // 15
  "khHsrrsssss", // 16 blush
  "khHssssssss", // 17
  ".kHHsssssss", // 18
  ".kHHSSSSSSS", // 19
  "..kkkkkkkkk", // 20 chin
  ".....kmmmmm", // 21 collar
  "...kkgggmmm", // 22
  "..kggggggmm", // 23
  "..kgggggggg", // 24
  ".ksGggggggg", // 25 hands
  ".ksGggggggg", // 26
  "..kGGGGGGGG", // 27
  "...kppppppk", // 28 legs
  "...kppppk..", // 29
  "...kkkkkk..", // 30 shoes
  "...........", // 31
];
const vale = mirror(VALE_L);
const sprout = [[0, 9, "kk_kk"], [1, 8, "khhkhhk"], [2, 9, "_kk"]]; // two leaves, like the reference
const mouth = [[18, 10, "kk"]];
const smile = [[18, 9, "k__k"], [19, 10, "kk"]];
const blink = [[14, 4, "ss"], [15, 4, "kk"], [14, 16, "ss"], [15, 16, "kk"]];
const happyEyes = [[14, 4, "_k"], [14, 5, "k"], [15, 4, "k_"], [15, 5, "s"], [14, 16, "k_"], [15, 16, "s"], [15, 17, "k"], [14, 17, "s"]];
const worried = [[13, 3, "kk"], [13, 17, "kk"], [18, 9, "_kkk"]]; // slanted brows, wavy mouth
const phone = [ // phone held at chest, screen glowing
  [22, 8, "kkkkkk"], [23, 8, "kNNNNk"], [24, 8, "kNwwNk"], [25, 7, "skNNNNks"], [26, 7, "skPPPPks"], [27, 8, "kkkkkk"],
];
const V = (patches) => overlay(vale, [...sprout, ...patches]);
svg("vale-idle", V(mouth));
svg("vale-blink", V([...mouth, ...blink]));
svg("vale-smile", V(smile));
svg("vale-happy", V([...smile, ...happyEyes]));
svg("vale-phone", V([...mouth, ...phone]));
svg("vale-phone-smile", V([...smile, ...phone]));
svg("vale-stress", V([...worried, ...phone, [9, 20, "b"], [10, 19, "bb"], [11, 19, "bb"]]));
svg("vale-tired", V([...worried, ...blink, ...phone]));
svg("vale-worried", V([...worried, [9, 20, "b"], [10, 19, "bb"], [11, 19, "bb"]]));
svg("vale-worried-blink", V([...worried, ...blink, [9, 20, "b"], [10, 19, "bb"], [11, 19, "bb"]]));
svg("vale-sad", V([...worried, ...blink]));
svg("vale-happy-blink", V([...smile, ...blink]));
svg("vale-phone-happy", V([...smile, ...happyEyes, ...phone]));
svg("vale-phone-blink", V([...smile, ...blink, ...phone]));

// ───────────────────── Client walking (side view) — 14×22, 2 frames ─────────────────────
const WALK_TOP = [
  "....kkkkk.....",
  "...kdddddkk...",
  "..kdddddddDk..",
  "..kdddddddDk..",
  "..kdsssdddDk..",
  "..ksseskdDDk..",
  "..ksrssskDk...",
  "...ksssskk....",
  "....kkkk......",
  "...kuuuuk.....",
  "..kuuuuuUk....",
  "..kuuuuuUk....",
  "..kusuuuUk....",
  "..kuuuuuUk....",
  "...kUUUUk.....",
];
svg("client-walk-1", [...WALK_TOP, "...kpppk......", "..kpk.kpk.....", "..kpk..kpk....", ".kpk....kpk...", ".kkk....kkk...", "..............", ".............."]);
svg("client-walk-2", [...WALK_TOP, "...kpppk......", "...kpkpk......", "...kpkpk......", "...kpkkpk.....", "...kkk.kkk....", "..............", ".............."]);

// ───────────────── Client lying on the massage bed — 44×16 ─────────────────
svg("bed-client", [
  "............................................",
  "....kkkkk...................................",
  "...kdddddk..................................",
  "..kdddddddk.kkkkkkkkkkkkkkkkkkkkkkkkkkkkk...",
  "..kdddddddkkwwwwwwwwwwwwwwwwwwwwwwwwwwwwwk..",
  "..kddsskddkwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwk..",
  "..kdssrskkwTwwwwwwwwwwwwwwwwwwwwwwwwwwwwwk..",
  "...ksssskwTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTk..",
  "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
  "kmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmk",
  "kNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNk",
  "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
  "..kaak..............................kaak....",
  "..kaak..............................kaak....",
  "..kAAk..............................kAAk....",
  "..kkkk..............................kkkk....",
]);

// ───────────── Parlana agent — logo-born mascot (green bubble + bolt), 22×24 ─────────────
const AGENT_L = [
  "......kkkkk",
  "....kknnnnn",
  "...knnnnnnn",
  "..knNNnnnnn",
  ".knNNnnnnnn",
  ".knNnnnnnnn",
  "knnnnnnnnnn",
  "knnnkknnnnn", // eyes
  "knnnkknnnnn",
  "knnnnnnnnnn",
  "knnnnnnnnnw", // bolt starts at center
  "knnnnnnnnww",
  "knnnnnnnnnw",
  "knnnnnnnnnn",
  ".knnnnnnnnn",
  ".kgnnnnnnnn",
  "..kgnnnnnnn",
  "...kggnnnnn",
  "....kkggggg",
  "......kkkkk",
];
const agentBase = mirror(AGENT_L);
// The logo's bolt + tail (asymmetric) and a little headset
const agentPatches = [
  [10, 10, "nn"], [11, 10, "nn"], [12, 10, "nn"], // clear the mirrored center
  [10, 11, "ww"], [11, 10, "ww"], [12, 9, "wwww"], [13, 10, "ww"], [14, 9, "ww"], // white bolt (logo)
  [20, 2, "kk"], [21, 1, "knk"], [22, 0, "knnk"], [23, 0, "kkk"], // speech tail bottom-left (like the logo)
  [3, 0, "kk"], [4, 0, "kPk"], [5, 0, "kPk"], [6, 0, "kPk"], [7, 0, "kk"], // headset ear
  [3, 20, "kk"], [4, 19, "kPk"], [5, 19, "kPk"], [6, 19, "kPk"], [7, 20, "kk"],
  [8, 20, "k"], [9, 20, "k"], [10, 19, "kPk"], // short mic, outside the face
];
const agent = overlay([...agentBase, "......................", "......................", "......................", "......................"], agentPatches);
svg("agent", agent);
svg("agent-blink", overlay(agent, [[7, 4, "nn"], [8, 4, "kk"], [7, 16, "nn"], [8, 16, "kk"]]));
svg("agent-happy", overlay(agent, [[7, 4, "kk"], [8, 4, "nn"], [7, 16, "kk"], [8, 16, "nn"], [6, 3, "_k"], [6, 18, "k"]]));

// ───────────────────────────── Props ─────────────────────────────
svg("plant", [
  "....kk..kk....", "...knnkknnk...", "..knNnkknNnk..", "..knnnnnnnnk..", ".kknnkknnkknk.", "knNnnnnnnnnnnk",
  "knnnkknnkknnnk", ".kkkknnnnkkkk.", "...kkkkkkkk...", "...kaaaaaaak...".slice(0, 14), "...kaaaaaaak..".slice(0, 14),
  "...kaAaaaAak..", "....kaaaaak...", "....kAAAAAk...", "....kkkkkkk...",
]);
svg("candle-1", ["...f...", "..fFf..", "..fFf..", "...F...", ".kkkkk.", ".kqqqk.", ".kqqqk.", ".kqqqk.", "kkkkkkk", "kaaaaak", "kkkkkkk"]);
svg("candle-2", ["....f..", "...fF..", "..fFf..", "...F...", ".kkkkk.", ".kqqqk.", ".kqqqk.", ".kqqqk.", "kkkkkkk", "kaaaaak", "kkkkkkk"]);
svg("towels", [
  ".kkkkkkkkkkkk.", "kmmmmmmmmmmmmk", "kNNNNNNNNNNNNk", "kkkkkkkkkkkkkk", "kwwwwwwwwwwwwk", "kTTTTTTTTTTTTk",
  "kkkkkkkkkkkkkk", "kmmmmmmmmmmmmk", "kNNNNNNNNNNNNk", "kkkkkkkkkkkkkk",
]);
svg("coin-1", ["..kkkk..", ".kyyyyk.", "kyyffyyk", "kyfyyyyk", "kyfyyyyk", "kyyffyyk", ".kyyyyk.", "..kkkk.."]);
svg("coin-2", ["...kk...", "..kyyk..", "..kyfk..", "..kyfk..", "..kyfk..", "..kyfk..", "..kyyk..", "...kk..."]);
svg("heart", [".kk.kk.", "kxxkxxk", "kxxxxxk", ".kxxxk.", "..kxk..", "...k..."]);
svg("heart-green", [".kk.kk.", "knnknnk", "knnnnnk", ".knnnk.", "..knk..", "...k..."]);
svg("moon", ["..kkk...", ".kyyk...", "kyyk....", "kyyk....", "kyyk....", "kyyyk...", ".kyyyyk.", "..kkkk.."]);
svg("ig", [
  "kkkkkkkkkkkk", "koooooooooik", "kooookkkkoik", "koookiiiikik", "kookiwwwikjk", "kookiwiwikjk",
  "kookiwwwikjk", "koookiiiikjk", "kiiiikkkkjjk", "kiiijjjjjjjk", "kkkkkkkkkkkk",
].map((r) => r.padEnd(12, ".")));
svg("fb", [
  "kkkkkkkkkkkk", "kzzzzzzzzzzk", "kzzzzzkwwwzk", "kzzzzkwzzzzk", "kzzzzkwzzzzk", "kzzzwwwwwzzk",
  "kzzzzkwzzzzk", "kzzzzkwzzzzk", "kzzzzkwzzzzk", "kzzzzkwzzzzk", "kkkkkkkkkkkk",
]);
svg("sweat", [".b..", ".bb.", "bbbb", "bbbb", ".bb."]);
svg("zzz", ["kkkk", "..k.", ".k..", "kkkk"]);
svg("check", ["......k", ".....kn", "k...kn.", "nk.kn..", ".nkn...", "..n...."].map((r) => r.replace(/n/g, "n")));
svg("logo-pixel", overlay(agentBase.slice(0, 20).map((r) => r.replace(/[PeH]/g, "n")), [[10, 10, "nwwn"], [11, 10, "wwnn"].map((v,i)=>v), [12, 9, "wwww"], [13, 10, "ww"], [14, 9, "ww"], [7, 4, "nn"], [8, 4, "nn"], [7, 16, "nn"], [8, 16, "nn"], [7, 13, "n"]]));

console.log("sprites →", OUT, fs.readdirSync(OUT).length, "files");

// ───────────────────── Backgrounds (rect-drawn, 108×192 art grid) ─────────────────────
function bg(name, w, h, draw) {
  const rects = [];
  const R = (x, y, rw, rh, c) => rects.push(`<rect x="${x}" y="${y}" width="${rw}" height="${rh}" fill="${PAL[c] || c}"/>`);
  draw(R);
  fs.writeFileSync(path.join(OUT, name + ".svg"),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" shape-rendering="crispEdges">${rects.join("")}</svg>\n`);
}
function spaRoom(R, t) {
  // t = palette overrides for the night / gray variants
  const C = (k) => t[k] || k;
  R(0, 0, 108, 192, C("c"));                       // cream wall
  for (let y = 6; y < 118; y += 12) R(0, y, 108, 1, C("#E6E3D8")); // faint wall stripes
  R(0, 118, 108, 1, C("k")); R(0, 119, 108, 14, C("m")); R(0, 125, 108, 1, C("#CDEFD9")); // mint wainscot
  R(0, 133, 108, 1, C("k"));
  R(0, 134, 108, 58, C("a"));                      // amber floor
  for (let y = 134, i = 0; y < 192; y += 7, i++) { // long horizontal boards, sparse seams
    R(0, y + 6, 108, 1, C("A"));
    R(((i * 37) % 80) + 10, y, 1, 6, C("A"));
    R(0, y, 108, 1, C("y"));
  }
  // window with garden
  R(10, 22, 40, 44, C("k")); R(12, 24, 36, 40, C("#BFEFD3"));
  R(12, 50, 36, 14, C("n")); R(16, 44, 10, 8, C("g")); R(30, 40, 14, 12, C("g")); R(22, 47, 8, 6, C("n"));
  R(29, 24, 2, 40, C("k")); R(12, 43, 36, 2, C("k"));
  R(8, 66, 44, 3, C("a")); R(8, 69, 44, 1, C("A"));
  // shelf
  R(62, 70, 38, 3, C("a")); R(62, 73, 38, 1, C("A")); R(66, 74, 2, 4, C("A")); R(94, 74, 2, 4, C("A"));
}
bg("bg-spa", 108, 192, (R) => spaRoom(R, {}));
bg("bg-spa-night", 108, 192, (R) => spaRoom(R, { c: "#2E4A42", "#E6E3D8": "#2A443C", m: "#365A50", "#CDEFD9": "#2F5248", a: "#5A4A33", A: "#463927", "#BFEFD3": "#1B2D3A", n: "#2C4A3A", g: "#22392D" }));
console.log("backgrounds ok");

// reception counter (70×20 art px): amber top, mint front with a leaf emblem
bg("counter", 70, 20, (R) => {
  R(0, 0, 70, 1, PAL.k); R(0, 1, 70, 3, PAL.y); R(0, 4, 70, 1, PAL.A); R(0, 5, 70, 1, PAL.k);
  R(2, 6, 66, 14, PAL.k); R(3, 6, 64, 13, PAL.m); R(3, 16, 64, 3, "#CDEFD9");
  R(32, 9, 6, 1, PAL.k); R(31, 10, 2, 3, PAL.k); R(37, 10, 2, 3, PAL.k); R(33, 10, 4, 3, PAL.n); R(32, 13, 6, 1, PAL.k); R(34, 14, 2, 2, PAL.G); // leaf
});
console.log("counter ok");
// door to "otro spa" (26×44) and a small shelf phone (10×16), sparkle (7×7)
bg("door", 26, 44, (R) => {
  R(0, 0, 26, 44, PAL.k); R(2, 2, 22, 42, PAL.t); R(4, 4, 18, 40, PAL.T);
  R(6, 7, 14, 12, PAL.k); R(7, 8, 12, 10, "#9FB6B0"); R(6, 24, 14, 1, PAL.t); R(6, 33, 14, 1, PAL.t);
  R(18, 25, 3, 3, PAL.k); R(19, 26, 1, 1, PAL.y);
});
svg("phone-small", ["kkkkkkkkkk", "kPPPPPPPPk", "kNNNNNNNNk", "kNwwwwwwNk", "kNNNNNNNNk", "kNwwwwNNNk", "kNNNNNNNNk", "kNwwwwwwNk",
  "kNNNNNNNNk", "kNwwwNNNNk", "kNNNNNNNNk", "kNNNNNNNNk", "kPPPPPPPPk", "kPPPkkPPPk", "kPPPPPPPPk", "kkkkkkkkkk"]);
svg("sparkle", ["...k...", "...y...", "..kyk..", "kyyfyyk", "..kyk..", "...y...", "...k..."]);
console.log("extra sprites ok");
