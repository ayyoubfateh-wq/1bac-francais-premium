/* Sauvegarde de progression dans le nuage — Netlify Blobs.
   Clé = SHA-256 du code premium (jamais le code en clair) :
   l'élève retrouve ses XP, son parcours et ses productions sur
   n'importe quel appareil où il active son code.
   GET  ?key=<hex64>          → { ok, state, updated }
   POST { key, state }        → enregistre (max ~200 Ko) */
const { connectLambda, getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };

  let store;
  try {
    connectLambda(event);
    store = getStore('progress');
  } catch (_) {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'storage_unavailable' }) };
  }

  if (event.httpMethod === 'GET') {
    const key = String((event.queryStringParameters || {}).key || '');
    if (!/^[a-f0-9]{64}$/.test(key)) {
      return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'invalid_key' }) };
    }
    try {
      const rec = await store.get(key, { type: 'json' });
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true, state: rec ? rec.state : null, updated: rec ? rec.updated : null }) };
    } catch (_) {
      return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'read_failed' }) };
    }
  }

  if (event.httpMethod === 'POST') {
    if ((event.body || '').length > 200000) {
      return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'too_large' }) };
    }
    let body = {};
    try { body = JSON.parse(event.body || '{}'); } catch (_) {
      return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: 'invalid_json' }) };
    }
    const key = String(body.key || '');
    if (!/^[a-f0-9]{64}$/.test(key) || !body.state || typeof body.state !== 'object') {
      return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'invalid_payload' }) };
    }
    try {
      await store.setJSON(key, { state: body.state, updated: new Date().toISOString() });
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    } catch (_) {
      return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'write_failed' }) };
    }
  }

  return { statusCode: 405, headers, body: JSON.stringify({ ok: false, error: 'method_not_allowed' }) };
};
