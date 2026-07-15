/* Suite serveur : les vraies fonctions Netlify, avec @netlify/blobs
   remplacé par un stub en mémoire. On teste la sécurité et les données —
   là où une régression coûte de l'argent. */
import Module from 'node:module';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { suite, test, assert, eq } from './harness.mjs';
import { fakeBlobs, resetBlobs, seedBlob } from './helpers/fake-blobs.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);

/* intercepte require('@netlify/blobs') → stub mémoire */
const origLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (request === '@netlify/blobs') return fakeBlobs;
  return origLoad.apply(this, arguments);
};

const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const CODE = 'BAC-TEST-CODE1';
const KEY = sha(CODE);

process.env.PREMIUM_CODE_HASHES = KEY;
process.env.ADMIN_KEY = 'admin-secret-test';

const fn = (name) => require(path.join(ROOT, 'netlify', 'functions', name + '.js'));
const call = async (name, { body = {}, headers = {}, method = 'POST' } = {}) => {
  const res = await fn(name).handler({ httpMethod: method, body: JSON.stringify(body), headers });
  return { status: res.statusCode, json: JSON.parse(res.body || '{}') };
};

export async function run() {
  /* ---------------------------------------------------- premium-auth */
  suite('serveur · premium-auth');
  const auth = require(path.join(ROOT, 'netlify', 'functions', 'lib', 'premium-auth.js'));
  await test('empreinte valide acceptée', () => assert(auth.isValidPremiumKey(KEY)));
  await test('empreinte inconnue rejetée', () => assert(!auth.isValidPremiumKey(sha('AUTRE-CODE'))));
  await test('format invalide rejeté', () => assert(!auth.isValidPremiumKey('pas-une-empreinte')));
  await test('origine du site reconnue', () => assert(auth.fromOurSite({ headers: { origin: 'https://play-bac.com' } })));
  await test('origine étrangère rejetée', () => assert(!auth.fromOurSite({ headers: { origin: 'https://pirate.example' } })));

  /* ---------------------------------------------------- content (paywall) */
  suite('serveur · content (le vrai paywall)');
  await test('sans clé → 403', async () => { const r = await call('content', { body: {} }); eq(r.status, 403); });
  await test('fausse clé → 403', async () => { const r = await call('content', { body: { key: sha('FAUX') } }); eq(r.status, 403); });
  await test('vraie empreinte → 200 + contenu', async () => {
    const r = await call('content', { body: { key: KEY } });
    eq(r.status, 200); assert(r.json.ok, 'ok attendu');
    assert(r.json.data && r.json.data.questions && r.json.data.questions.boite.length >= 90, 'banque complète attendue');
    assert(r.json.data.screens && Object.keys(r.json.data.screens).length >= 9, '9 écrans protégés attendus');
  });

  /* ---------------------------------------------------- leaderboard */
  suite('serveur · leaderboard (anti-injection)');
  resetBlobs();
  await test('POST sans preuve → 403 (attaque de l’audit)', async () => {
    const r = await call('leaderboard', { body: { deviceId: 'd-hacker-000001', pseudo: 'Pirate', xp: 9999 } });
    eq(r.status, 403); eq(r.json.error, 'forbidden');
  });
  await test('POST fausse clé → 403', async () => {
    const r = await call('leaderboard', { body: { key: sha('X'), deviceId: 'd-hacker-000001', pseudo: 'Pirate', xp: 9999 } });
    eq(r.status, 403);
  });
  await test('membre légitime → enregistré', async () => {
    const r = await call('leaderboard', { body: { key: KEY, deviceId: 'd-eleve-000001', pseudo: 'Sara', xp: 120 } });
    assert(r.json.ok, 'ok attendu');
  });
  await test('pseudo insultant neutralisé en « Élève »', async () => {
    await call('leaderboard', { body: { key: KEY, deviceId: 'd-eleve-000002', pseudo: 'connard93', xp: 50 } });
    const g = await call('leaderboard', { method: 'GET' });
    const found = g.json.top.find((r) => r.id === 'd-eleve-000002');
    assert(found && found.pseudo === 'Élève', 'pseudo devait devenir « Élève », obtenu : ' + (found && found.pseudo));
  });
  await test('GET public → top trié par XP décroissant', async () => {
    const g = await call('leaderboard', { method: 'GET' });
    assert(g.json.ok && g.json.top.length >= 2, 'top attendu');
    for (let i = 1; i < g.json.top.length; i++) assert(g.json.top[i - 1].xp >= g.json.top[i].xp, 'ordre décroissant');
  });

  /* ---------------------------------------------------- stats */
  suite('serveur · stats (filtre d’origine)');
  resetBlobs();
  await test('événement hors-site → 403', async () => {
    const r = await call('stats', { body: { event: 'code_ok' }, headers: {} });
    eq(r.status, 403); eq(r.json.error, 'forbidden_origin');
  });
  await test('événement depuis le site → compté', async () => {
    const r = await call('stats', { body: { event: 'visit' }, headers: { origin: 'https://play-bac.com' } });
    assert(r.json.ok, 'ok attendu');
  });
  await test('événement inconnu → refusé', async () => {
    const r = await call('stats', { body: { event: 'n_importe_quoi' }, headers: { origin: 'https://play-bac.com' } });
    assert(!r.json.ok, 'refus attendu');
  });
  await test('rapport sans clé admin → 403', async () => {
    const r = await call('stats', { body: { action: 'report', adminKey: 'faux' } });
    eq(r.status, 403);
  });
  await test('rapport avec clé admin → 14 jours', async () => {
    const r = await call('stats', { body: { action: 'report', adminKey: 'admin-secret-test' } });
    assert(r.json.ok && Array.isArray(r.json.days) && r.json.days.length === 14, '14 jours attendus');
  });

  /* ---------------------------------------------------- validate-access */
  suite('serveur · validate-access (anti-partage)');
  resetBlobs();
  await test('code valide → accès accordé', async () => {
    const r = await call('validate-access', { body: { code: CODE, deviceId: 'd-appareil-un-01' } });
    assert(r.json.ok && r.json.expiresIn > 0, 'accès attendu');
  });
  await test('même code, 2e appareil → accordé', async () => {
    const r = await call('validate-access', { body: { code: CODE, deviceId: 'd-appareil-deux-2' } });
    assert(r.json.ok, '2e appareil doit passer');
  });
  await test('même code, 3e appareil → device_limit', async () => {
    const r = await call('validate-access', { body: { code: CODE, deviceId: 'd-appareil-trois3' } });
    assert(!r.json.ok && r.json.message === 'device_limit', 'limite d’appareils attendue, obtenu : ' + r.json.message);
  });
  await test('mauvais code → refusé', async () => {
    const r = await call('validate-access', { body: { code: 'BAC-INEXISTANT-99', deviceId: 'd-appareil-un-01' } });
    assert(!r.json.ok, 'refus attendu');
  });

  /* ---------------------------------------------------- progress */
  suite('serveur · progress (sauvegarde nuage)');
  resetBlobs();
  await test('POST puis GET → aller-retour exact', async () => {
    const state = { game: { xp: 275, streak: { count: 4 } }, prod: null };
    const p = await call('progress', { body: { key: KEY, state } });
    assert(p.json.ok, 'écriture ok');
    const g = await call('progress', { body: { key: KEY }, method: 'GET' });
    // GET lit ?key= ; on passe par queryStringParameters
    const res = await fn('progress').handler({ httpMethod: 'GET', queryStringParameters: { key: KEY }, headers: {} });
    const back = JSON.parse(res.body);
    eq(back.state.game.xp, 275);
  });
  await test('clé invalide → refus', async () => {
    const res = await fn('progress').handler({ httpMethod: 'GET', queryStringParameters: { key: 'court' }, headers: {} });
    const j = JSON.parse(res.body); assert(!j.ok, 'refus attendu');
  });

  /* ---------------------------------------------------- admin */
  suite('serveur · admin (espace vendeur)');
  resetBlobs();
  seedBlob('premium-devices', KEY, { devices: ['d-a', 'd-b'], updated: new Date().toISOString() });
  await test('mauvaise clé admin → forbidden', async () => {
    const r = await call('admin', { body: { adminKey: 'faux', action: 'check', code: CODE } });
    eq(r.status, 403);
  });
  await test('check → 2 appareils', async () => {
    const r = await call('admin', { body: { adminKey: 'admin-secret-test', action: 'check', code: CODE } });
    assert(r.json.ok && r.json.deviceCount === 2, '2 appareils attendus, obtenu : ' + r.json.deviceCount);
  });
  await test('reset → libère le code', async () => {
    const r = await call('admin', { body: { adminKey: 'admin-secret-test', action: 'reset', code: CODE } });
    assert(r.json.ok, 'reset ok');
    const after = await call('admin', { body: { adminKey: 'admin-secret-test', action: 'check', code: CODE } });
    assert(after.json.deviceCount === 0, 'code libéré attendu');
  });

  Module._load = origLoad; // restaure
}
