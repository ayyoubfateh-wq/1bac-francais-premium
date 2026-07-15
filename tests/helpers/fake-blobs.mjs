/* Stub en mémoire de @netlify/blobs pour tester les fonctions serveur
   sans réseau. Reproduit l'API réellement utilisée : connectLambda (no-op),
   getStore(name) → { get, set, setJSON, delete, list } avec pagination. */
const stores = new Map();

function getStore(name) {
  if (!stores.has(name)) stores.set(name, new Map());
  const m = stores.get(name);
  return {
    async get(key, opts) {
      if (!m.has(key)) return null;
      const raw = m.get(key);
      return opts && opts.type === 'json' ? JSON.parse(raw) : raw;
    },
    async set(key, value) { m.set(key, String(value)); },
    async setJSON(key, value) { m.set(key, JSON.stringify(value)); },
    async delete(key) { m.delete(key); },
    async list({ prefix = '', cursor } = {}) {
      const keys = [...m.keys()].filter((k) => k.startsWith(prefix)).sort();
      const start = cursor ? parseInt(cursor, 10) : 0;
      const page = keys.slice(start, start + 1000);
      const next = start + 1000 < keys.length ? String(start + 1000) : undefined;
      return { blobs: page.map((key) => ({ key })), cursor: next };
    },
  };
}

export const fakeBlobs = { connectLambda() {}, getStore };
export function resetBlobs() { stores.clear(); }
export function seedBlob(store, key, value) {
  if (!stores.has(store)) stores.set(store, new Map());
  stores.get(store).set(key, typeof value === 'string' ? value : JSON.stringify(value));
}
export function dumpStore(store) {
  return stores.has(store) ? Object.fromEntries(stores.get(store)) : {};
}
