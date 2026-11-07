import fs from "fs";
import path from "path";

const root = path.resolve(import.meta.dirname, "..");
const indexPath = path.join(root, "index.html");
let html = fs.readFileSync(indexPath, "utf8");
let card = fs.readFileSync(path.join(root, "cards", "card-04.html"), "utf8");
card = card.replace(/\s*data-hf-id="[^"]*"/g, "");

const re =
  /(<div[^>]*id="host-card-04"[^>]*>)([\s\S]*?)(<\/div>\s*<div[^>]*id="host-card-05")/;
if (!re.test(html)) {
  console.error("host-card-04 block not found");
  process.exit(1);
}
html = html.replace(re, (_m, a, _b, c) => a + "\n" + card + "\n      " + c);
html = html.replace(/#card-04-shot/g, "#card-04-code");
fs.writeFileSync(indexPath, html);
console.log("patched card-04 in index");
