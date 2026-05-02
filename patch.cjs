const fs = require("fs");

const file = "assets/js/app.js";
let s = fs.readFileSync(file, "utf8");

s = s.replace(
  /(?:async\s+)?function\s+validateOnServer\s*\(\s*code\s*\)\s*\{[\s\S]*?\}\s*window\.premiumCheckAccess/,
  `async function validateOnServer(code){
  return {
    ok: String(code).trim() === "Ayoub123",
    expiresIn: 28800
  };
}

window.premiumCheckAccess`
);

fs.writeFileSync(file, s, "utf8");
console.log("OK app.js patched");
