/* Classement hebdomadaire — Netlify Blobs.
   POST { deviceId, pseudo, xp }  → enregistre le score de la semaine
   GET                            → top 20 de la semaine en cours
   Clé par appareil (semaine/deviceId) : pas de course en écriture.
   Aucune donnée personnelle : pseudo choisi + XP, c'est tout. */
const { connectLambda, getStore } = require('@netlify/blobs');

function isoWeek(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  return date.getUTCFullYear() + '-W' + String(week).padStart(2, '0');
}

function sanitizePseudo(raw) {
  return String(raw || '')
    .replace(/[<>"'&\\/]/g, '')
    .trim()
    .slice(0, 15) || 'Anonyme';
}

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
    store = getStore('leaderboard');
  } catch (_) {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'storage_unavailable' }) };
  }

  const week = isoWeek(new Date());

  if (event.httpMethod === 'POST') {
    let body = {};
    try { body = JSON.parse(event.body || '{}'); } catch (_) {
      return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: 'invalid_json' }) };
    }
    const deviceId = String(body.deviceId || '').trim();
    if (!/^[a-z0-9-]{10,64}$/i.test(deviceId)) {
      return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'invalid_device' }) };
    }
    const xp = Math.max(0, Math.min(Math.round(Number(body.xp) || 0), 50000));
    const pseudo = sanitizePseudo(body.pseudo);
    try {
      await store.setJSON(week + '/' + deviceId, { pseudo, xp, t: Date.now() });
    } catch (_) {
      return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'write_failed' }) };
    }
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, week }) };
  }

  if (event.httpMethod === 'GET') {
    try {
      const { blobs } = await store.list({ prefix: week + '/' });
      const rows = [];
      for (const b of blobs.slice(0, 300)) {
        const rec = await store.get(b.key, { type: 'json' });
        if (rec && rec.pseudo) rows.push({ pseudo: rec.pseudo, xp: rec.xp || 0, id: b.key.split('/')[1] });
      }
      rows.sort((a, b) => b.xp - a.xp);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true, week, top: rows.slice(0, 20), count: rows.length }) };
    } catch (_) {
      return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'read_failed' }) };
    }
  }

  return { statusCode: 405, headers, body: JSON.stringify({ ok: false, error: 'method_not_allowed' }) };
};
