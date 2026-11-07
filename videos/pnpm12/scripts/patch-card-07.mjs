import fs from "fs";
import path from "path";

const root = path.resolve(import.meta.dirname, "..");
const indexPath = path.join(root, "index.html");
let html = fs.readFileSync(indexPath, "utf8");
let card = fs.readFileSync(path.join(root, "cards", "card-07.html"), "utf8");
card = card.replace(/\s*data-hf-id="[^"]*"/g, "");

const re =
  /(<div[^>]*id="host-card-07"[^>]*>)([\s\S]*?)(<\/div>\s*<div[^>]*id="host-card-08")/;
if (!re.test(html)) {
  console.error("host-card-07 block not found");
  process.exit(1);
}
html = html.replace(re, (_m, a, _b, c) => a + "\n" + card + "\n      " + c);

const start = 47.5;
const end = 51.8;
const enter = 0.35;
const exit = 0.3;
const exitAt = end - exit;
const q = (t) => Math.round(t * 30) / 30;

function parseAnims(cardHtml, cardId, startSec) {
  const lines = [];
  const reAnim =
    /(?:^|[\s])id="([^"]+)"[^>]*\bdata-anim="([^"]+)"[^>]*\bdata-anim-at="([^"]+)"[^>]*\bdata-anim-duration="([^"]+)"/g;
  let m;
  while ((m = reAnim.exec(cardHtml)) !== null) {
    const id = m[1];
    const kind = m[2];
    const at = parseFloat(m[3]);
    const dur = parseFloat(m[4]);
    const T = q(startSec + at);
    const sel = `.card[data-card-id="${cardId}"] #${id}`;
    if (kind === "fade-in") {
      lines.push(
        `tl.fromTo(${JSON.stringify(sel)}, { opacity: 0 }, { opacity: 1, duration: ${dur}, ease: "power2.out" }, ${T});`,
      );
    } else if (kind === "grow-x") {
      const twM = cardHtml.match(
        new RegExp(
          `id="${id}"[^>]*data-anim-target-w="([^"]+)"|data-anim-target-w="([^"]+)"[^>]*id="${id}"`,
        ),
      );
      const tw = twM ? parseFloat(twM[1] || twM[2]) : 100;
      lines.push(
        `tl.fromTo(${JSON.stringify(sel)}, { width: 0 }, { width: ${tw}, duration: ${dur}, ease: "power2.out" }, ${T});`,
      );
    }
  }
  return lines;
}

const animLines = parseAnims(card, "card-07", start)
  .map((l) => "          " + l)
  .join("\n");

const gsapBlock = `
          // ── card-07 [${start} → ${end}] fullscreen opaque ──
          tl.set('.card-host[data-card-id="card-07"] .card', { opacity: 0 }, 0);
          tl.fromTo(
            '.card-host[data-card-id="card-07"] .card',
            { opacity: 0 },
            { opacity: 1, duration: ${enter}, ease: "power2.out" },
            ${q(start)},
          );
${animLines}
          tl.to(
            '.card-host[data-card-id="card-07"] .card',
            { opacity: 0, duration: ${exit}, ease: "power2.in" },
            ${exitAt},
          );
          tl.set('.card-host[data-card-id="card-07"] .card', { opacity: 0 }, ${q(end)});
`;

const gsapRe =
  /\n\s*\/\/ ── card-07 \[[\s\S]*?tl\.set\('\.card-host\[data-card-id="card-07"\] \.card', \{ opacity: 0 \}, [^)]+\);/;
if (!gsapRe.test(html)) {
  console.error("card-07 GSAP block not found");
  process.exit(1);
}
html = html.replace(gsapRe, "\n" + gsapBlock);

fs.writeFileSync(indexPath, html);
console.log("patched card-07 HTML + GSAP");
