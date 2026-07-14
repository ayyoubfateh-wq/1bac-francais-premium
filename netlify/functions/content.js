/* Contenu premium — servi UNIQUEMENT sur preuve d'un code valide.
   Le client envoie l'empreinte SHA-256 de son code (jamais le code en
   clair) ; on la compare, à temps constant, à la liste des codes vendus
   (variable Netlify PREMIUM_CODE_HASHES). Sans preuve valide : rien.

   private/content.json est généré par `npm run build` et incorporé au
   bundle de cette fonction par esbuild — il n'existe nulle part sur le
   site public. */
const { isValidPremiumKey, parseHashes } = require('./lib/premium-auth.js');
const CONTENT = require('../../private/content.json');

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ ok: false, error: 'method_not_allowed' }) };
  }

  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch (_) {
    return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: 'invalid_json' }) };
  }

  if (!parseHashes().length) {
    return { statusCode: 500, headers, body: JSON.stringify({ ok: false, error: 'codes_not_configured' }) };
  }
  if (!isValidPremiumKey(body.key)) {
    return { statusCode: 403, headers, body: JSON.stringify({ ok: false, error: 'invalid_key' }) };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ ok: true, version: CONTENT.version, data: CONTENT.data }),
  };
};
