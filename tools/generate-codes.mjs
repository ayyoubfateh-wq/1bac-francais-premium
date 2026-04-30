import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const count = Number(process.argv[2] || 20);
const prefix = (process.argv[3] || 'BAC').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) || 'BAC';
const outDir = path.resolve('generated-codes');
fs.mkdirSync(outDir, { recursive: true });

function makeCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 10; i++) s += alphabet[crypto.randomInt(alphabet.length)];
  return `${prefix}-${s.slice(0, 5)}-${s.slice(5)}`;
}
function sha256(v) { return crypto.createHash('sha256').update(v, 'utf8').digest('hex'); }

const codes = new Set();
while (codes.size < count) codes.add(makeCode());
const rows = [['code', 'sha256_hash'], ...[...codes].map((c) => [c, sha256(c)])];
const csv = rows.map((r) => r.join(',')).join('\n') + '\n';
const codesPath = path.join(outDir, 'codes-a-envoyer-aux-clients.csv');
const hashesPath = path.join(outDir, 'netlify-env-PREMIUM_CODE_HASHES.txt');
fs.writeFileSync(codesPath, csv, 'utf8');
fs.writeFileSync(hashesPath, [...codes].map(sha256).join(','), 'utf8');
console.log(`OK: ${count} codes generes.`);
console.log(`Codes clients: ${codesPath}`);
console.log(`Valeur Netlify PREMIUM_CODE_HASHES: ${hashesPath}`);
