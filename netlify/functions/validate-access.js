const crypto = require('crypto');

function sha256(value) {
  return crypto.createHash('sha256').update(String(value).trim(), 'utf8').digest('hex');
}

function safeEqualHex(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'));
  } catch (_) {
    return false;
  }
}

function parseHashes() {
  const raw = process.env.PREMIUM_CODE_HASHES || '';
  return raw
    .split(/[\n,; ]+/)
    .map((x) => x.trim().toLowerCase())
    .filter((x) => /^[a-f0-9]{64}$/.test(x));
}

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ ok: false, error: 'method_not_allowed' }) };
  }

  let body = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch (_) {
    return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: 'invalid_json' }) };
  }

  const code = String(body.code || '').trim().toUpperCase();
  if (!/^[A-Z0-9-]{6,40}$/.test(code)) {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'invalid_format' }) };
  }

  const hashes = parseHashes();
  if (!hashes.length) {
    return { statusCode: 500, headers, body: JSON.stringify({ ok: false, error: 'codes_not_configured' }) };
  }

  const codeHash = sha256(code);
  const ok = hashes.some((h) => safeEqualHex(codeHash, h));
  const hours = Math.max(1, Math.min(Number(process.env.ACCESS_DURATION_HOURS || 24), 24 * 30));

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      ok,
      expiresIn: ok ? Math.round(hours * 3600) : 0,
      message: ok ? 'access_granted' : 'invalid_code',
    }),
  };
};
