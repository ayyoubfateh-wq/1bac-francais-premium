document.addEventListener("DOMContentLoaded", function () {
  window.premiumCheckAccess = function () {
    const input = document.getElementById("premiumAccessCode");
    const code = input ? input.value.trim() : "";

    if (code === "Ayoub123") {

      // cacher le bloc verrou
      const lock = document.getElementById("premiumLockScreen");
      if (lock) lock.style.display = "none";

      // afficher contenu premium
      const content = document.getElementById("premiumContent");
      if (content) content.style.display = "block";

    } else {
      alert("Code invalide");
    }
  };
});
