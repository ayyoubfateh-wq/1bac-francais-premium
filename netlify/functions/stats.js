/* Statistiques d'usage — compteurs quotidiens 100 % anonymes.
   POST { event }                          → enregistre l'événement du jour
   POST { adminKey, action:'report' }      → rapport des 14 derniers jours
   Stockage append-only (un blob minuscule par événement) : aucune
   écriture concurrente ne peut écraser une autre — les comptes sont
   exacts. Aucune donnée personnelle : des horodatages, rien d'autre. */
const crypto = require('crypto');
const { connectLambda, getStore } = require('@netlify/blobs');

const VALID_EVENTS = [
  'visit',        // visite (1 max/jour/appareil, dédupliquée côté client)
  'trial_start',  // essai gratuit lancé
  'trial_done',   // leçon d'essai réussie
  'paywall_view', // mur de paiement affiché
  'code_ok',      // code premium activé
  'lesson_done',  // leçon du parcours réussie
  'review_done',  // session de révision terminée
  'exam_done',    // examen blanc réussi
  'prod_done'     // production écrite terminée
];

function dayStr(offset) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - (offset || 0));
  return d.toISOString().slice(0, 10);
}

async function countDay(store, day) {
  const counts = {};
  let cursor;
  /* pagination : chaque page apporte jusqu'à 1000 clés */
  do {
    const page = await store.list({ prefix: day + '/', cursor });
    for (const b of page.blobs) {
      const ev = b.key.split('/')[1];
      counts[ev] = (counts[ev] || 0) + 1;
    }
    cursor = page.cursor;
  } while (cursor);
  return counts;
}

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

  let store;
  try {
    connectLambda(event);
    store = getStore('stats-events');
  } catch (_) {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'storage_unavailable' }) };
  }

  /* rapport vendeur (protégé) */
  if (body.action === 'report') {
    const expected = process.env.ADMIN_KEY || '';
    if (!expected || String(body.adminKey || '') !== expected) {
      return { statusCode: 403, headers, body: JSON.stringify({ ok: false, error: 'forbidden' }) };
    }
    try {
      const days = [];
      for (let i = 0; i < 14; i++) {
        const day = dayStr(i);
        days.push({ day, counts: await countDay(store, day) });
      }
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true, days }) };
    } catch (_) {
      return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'read_failed' }) };
    }
  }

  /* comptage d'un événement (public, anonyme, sans écrasement possible) */
  const ev = String(body.event || '');
  if (VALID_EVENTS.indexOf(ev) === -1) {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'invalid_event' }) };
  }
  try {
    const key = dayStr(0) + '/' + ev + '/' + Date.now().toString(36) + '-' + crypto.randomBytes(4).toString('hex');
    await store.set(key, '1');
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (_) {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'write_failed' }) };
  }
};
