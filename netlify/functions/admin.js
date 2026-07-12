/* Administration vendeur — protégée par ADMIN_KEY (variable Netlify).
   POST { adminKey, action, code }
   - action "check" : combien d'appareils utilisent ce code ?
   - action "reset" : libère le code (l'élève peut le réactiver ailleurs)
   Le code est haché côté serveur ; rien n'est stocké en clair. */
const crypto = require('crypto');
const { connectLambda, getStore } = require('@netlify/blobs');

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

  const expected = process.env.ADMIN_KEY || '';
  if (!expected || String(body.adminKey || '') !== expected) {
    return { statusCode: 403, headers, body: JSON.stringify({ ok: false, error: 'forbidden' }) };
  }

  const code = String(body.code || '').trim().toUpperCase();
  if (!/^[A-Z0-9-]{6,40}$/.test(code)) {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'invalid_code_format' }) };
  }
  const hash = crypto.createHash('sha256').update(code, 'utf8').digest('hex');

  let devices;
  try {
    connectLambda(event);
    devices = getStore('premium-devices');
  } catch (_) {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'storage_unavailable' }) };
  }

  const action = String(body.action || 'check');

  if (action === 'check') {
    try {
      const rec = await devices.get(hash, { type: 'json' });
      return { statusCode: 200, headers, body: JSON.stringify({
        ok: true,
        used: !!rec,
        deviceCount: rec ? (rec.devices || []).length : 0,
        lastUsed: rec ? rec.updated || null : null,
      }) };
    } catch (_) {
      return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'read_failed' }) };
    }
  }

  if (action === 'reset') {
    try {
      await devices.delete(hash);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true, reset: true }) };
    } catch (_) {
      return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'delete_failed' }) };
    }
  }

  return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'unknown_action' }) };
};
