import fs from "fs";

import path from "path";

const PUBLIC = path.resolve(import.meta.dirname, "..");
let html = fs.readFileSync(`${PUBLIC}/index.html`, "utf8");

function replaceHost(html, hostId, nextHostId, cardFile) {
  let card = fs.readFileSync(`${PUBLIC}/cards/${cardFile}`, "utf8");
  card = card.replace(/\s*data-hf-id="[^"]*"/g, "");
  const re = new RegExp(
    `(<div[^>]*id="${hostId}"[^>]*>)([\\s\\S]*?)(<\\/div>\\s*<div[^>]*id="${nextHostId}")`,
  );
  if (!re.test(html)) {
    throw new Error(`block ${hostId} not found`);
  }
  return html.replace(re, (_m, a, _b, c) => a + "\n" + card + "\n      " + c);
}

html = replaceHost(html, "host-card-02", "host-card-03", "card-02.html");
html = replaceHost(html, "host-card-05", "host-card-06", "card-05.html");
html = replaceHost(html, "host-card-08", "caption-gradient-fill-host", "card-08.html");

// Safety: fix any remaining swapped refs in index
html = html.replace(
  /id="card-02-logo"[^>]*src="assets\/logo-npm\.png"/g,
  'id="card-02-logo" src="assets/logo-nvm.svg"',
);
html = html.replace(
  /id="card-02-logo"[^>]*src="assets\/logo-nvm\.png"/g,
  'id="card-02-logo" src="assets/logo-nvm.svg"',
);
html = html.replace(
  /id="card-05-logo"[^>]*src="assets\/logo-nvm\.(png|svg)"/g,
  'id="card-05-logo" src="assets/logo-npm.png"',
);
html = html.replace(
  /id="card-08-nvm"[^>]*src="assets\/logo-nvm\.png"/g,
  'id="card-08-nvm" src="assets/logo-nvm.svg"',
);
html = html.replace(
  /id="card-08-nvm"[^>]*src="assets\/logo-npm\.png"/g,
  'id="card-08-nvm" src="assets/logo-nvm.svg"',
);

fs.writeFileSync(`${PUBLIC}/index.html`, html);
console.log("patched cards 02/05/08 logos in index");

// verify
for (const p of ["card-02-logo", "card-05-logo", "card-08-nvm", "card-08-npm"]) {
  const m = html.match(new RegExp(`id="${p}"[^>]*src="([^"]+)"`));
  console.log(p, "→", m ? m[1] : "MISSING");
}
