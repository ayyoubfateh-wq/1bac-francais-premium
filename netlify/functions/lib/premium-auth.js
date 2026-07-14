/* Preuve d'accès premium — module partagé des fonctions serveur.
   La preuve = l'empreinte SHA-256 du code du client (jamais le code en
   clair), comparée À TEMPS CONSTANT à la liste des codes vendus
   (variable d'environnement PREMIUM_CODE_HASHES). */
const crypto = require('crypto');

function parseHashes() {
  const raw = process.env.PREMIUM_CODE_HASHES || '';
  return raw
    .split(/[\n,; ]+/)
    .map((x) => x.trim().toLowerCase())
    .filter((x) => /^[a-f0-9]{64}$/.test(x));
}

function safeEqualHex(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'));
  } catch (_) {
    return false;
  }
}

function isValidPremiumKey(key) {
  const k = String(key || '').trim().toLowerCase();
  if (!/^[a-f0-9]{64}$/.test(k)) return false;
  return parseHashes().some((h) => safeEqualHex(k, h));
}

/* La requête vient-elle de NOTRE site ? (filtre anti-abus léger pour les
   endpoints qui doivent rester ouverts aux visiteurs non payants) */
function fromOurSite(event) {
  const o = String((event.headers && (event.headers.origin || event.headers.referer)) || '');
  return /^https?:\/\/(play-bac\.com|www\.play-bac\.com|play-bac-premium\.netlify\.app|localhost(:\d+)?|127\.0\.0\.1(:\d+)?)([/:]|$)/.test(o);
}

module.exports = { parseHashes, safeEqualHex, isValidPremiumKey, fromOurSite };
