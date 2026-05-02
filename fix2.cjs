const fs = require("fs");

const file = "assets/js/app.js";
let s = fs.readFileSync(file, "utf8");

// Remplace toute la fonction premiumCheckAccess
s = s.replace(/window\.premiumCheckAccess[\s\S]*?\};/, `
window.premiumCheckAccess = function(){
  var input = document.getElementById('premiumAccessCode');
  var code = input ? input.value.trim() : "";

  if(code === "Ayoub123"){
    alert("Accès autorisé");
  } else {
    alert("Code invalide");
  }
};
`);

fs.writeFileSync(file, s, "utf8");
console.log("OK CLEAN FIX");
