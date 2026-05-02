const fs = require("fs");

const file = "assets/js/app.js";
let s = fs.readFileSync(file, "utf8");

// Supprime l'appel API Netlify
s = s.replace(
  "var API_ENDPOINT = window.PF1BAC_ACCESS_API || '/api/validate-access';",
  "var API_ENDPOINT = null;"
);

// Force validation locale Ayoub123
s = s.replace(
  /(?:async\s+)?function\s+validateOnServer\s*\(\s*code\s*\)\s*\{[\s\S]*?\}\s*window\.premiumCheckAccess/,
  `function validateOnServer(code){
  return {
    ok: String(code).trim() === "Ayoub123",
    expiresIn: 28800
  };
}

window.premiumCheckAccess`
);

fs.writeFileSync(file, s, "utf8");
console.log("OK FIX TERMINAL");
