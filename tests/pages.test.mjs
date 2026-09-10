/* Suite « pages publiques » : vérifie ce que le build a RÉELLEMENT écrit
   dans dist/. Ces pages sont la porte d'entrée depuis Google — une balise
   manquante ou un contenu premium qui s'y glisse ne doit pas passer. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { suite, test, assert, eq } from './harness.mjs';
import { PAGES } from '../src/pages/index.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

const lire = (rel) => fs.readFileSync(path.join(DIST, rel), 'utf8');

export async function run() {
  suite('pages publiques · référencement');

  await test('une page générée par entrée, avec ses balises essentielles', () => {
    for (const p of PAGES) {
      const html = lire(path.join(p.slug, 'index.html'));
      assert(html.includes(`<title>`), `${p.slug} : titre manquant`);
      assert(html.includes(`rel="canonical" href="https://play-bac.com/${p.slug}"`), `${p.slug} : canonical manquant ou faux`);
      assert(html.includes('name="description"'), `${p.slug} : meta description manquante`);
      assert(html.includes('application/ld+json'), `${p.slug} : données structurées manquantes`);
      assert(/<h1>/.test(html), `${p.slug} : h1 manquant`);
      assert(html.includes('lang="fr"'), `${p.slug} : langue non déclarée`);
    }
  });

  await test('chaque page renvoie vers l’essai gratuit et vers les autres fiches', () => {
    for (const p of PAGES) {
      const html = lire(path.join(p.slug, 'index.html'));
      assert(html.includes('leçons gratuites'), `${p.slug} : aucun appel à l’essai`);
      for (const autre of PAGES) {
        if (autre.slug === p.slug) continue;
        assert(html.includes(`href="/${autre.slug}"`), `${p.slug} : lien manquant vers ${autre.slug}`);
      }
    }
  });

  await test('la page d’accueil renvoie vers les quatre fiches', () => {
    const home = lire('index.html');
    for (const p of PAGES) {
      assert(home.includes(`href="/${p.slug}"`), `accueil : lien manquant vers ${p.slug}`);
    }
  });

  await test('sitemap et robots cohérents avec les pages générées', () => {
    const sitemap = lire('sitemap.xml');
    const robots = lire('robots.txt');
    eq((sitemap.match(/<url>/g) || []).length, PAGES.length + 1, 'sitemap : nombre d’URL inattendu');
    for (const p of PAGES) {
      assert(sitemap.includes(`https://play-bac.com/${p.slug}`), `sitemap : ${p.slug} absent`);
    }
    assert(robots.includes('Sitemap: https://play-bac.com/sitemap.xml'), 'robots.txt : sitemap non déclaré');
    assert(robots.includes('Disallow: /gestion-codes.html'), 'robots.txt : l’espace vendeur ne doit pas être indexable');
  });

  await test('aucune page publique ne contient de contenu premium', () => {
    const contenu = JSON.parse(fs.readFileSync(path.join(ROOT, 'private', 'content.json'), 'utf8'));
    /* on prend de vrais fragments du contenu payant et on vérifie qu'aucun
       n'apparaît dans les pages libres */
    const sondes = [
      JSON.stringify(contenu.data.questions.boite[0].opts),
      contenu.data.annales[0].etude[0].correction.slice(0, 80),
      contenu.data.screens.resumes.slice(200, 260),
    ];
    for (const p of PAGES) {
      const html = lire(path.join(p.slug, 'index.html'));
      assert(!html.includes('"ans":'), `${p.slug} : réponses de la banque exposées`);
      for (const s of sondes) {
        assert(!html.includes(s), `${p.slug} : fuite de contenu premium`);
      }
    }
  });
}
