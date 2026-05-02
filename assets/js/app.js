document.addEventListener("DOMContentLoaded", function () {
  window.premiumCheckAccess = function () {
    const input = document.getElementById("premiumAccessCode");
    const code = input ? input.value.trim() : "";

    if (code === "Ayoub123") {
      alert("Accès autorisé !");
    } else {
      alert("Code invalide");
    }
  };
});
