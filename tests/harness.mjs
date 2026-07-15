/* Micro-cadre de test — aucune dépendance. Partagé par les suites et
   le runner (évite toute dépendance circulaire). */
const state = { passed: 0, failed: 0, failures: [], suite: '' };

export function suite(name) { state.suite = name; console.log('\n▸ ' + name); }
export async function test(name, fn) {
  try {
    await fn();
    state.passed++; console.log('  ✅ ' + name);
  } catch (e) {
    state.failed++; state.failures.push({ suite: state.suite, name, err: e });
    console.log('  ❌ ' + name + '\n       ' + (e && e.message ? e.message : e));
  }
}
export function assert(cond, msg) { if (!cond) throw new Error(msg || 'assertion échouée'); }
export function eq(actual, expected, msg) {
  const a = JSON.stringify(actual), e = JSON.stringify(expected);
  if (a !== e) throw new Error((msg || 'égalité attendue') + `\n       attendu : ${e}\n       obtenu  : ${a}`);
}
export function results() { return state; }
