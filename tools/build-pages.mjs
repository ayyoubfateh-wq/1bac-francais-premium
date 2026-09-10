/* ============================================================================
   GÉNÉRATION DES PAGES PUBLIQUES + sitemap.xml + robots.txt

   Une page par entrée de src/pages/index.mjs, écrite dans dist/<slug>/index.html
   (URL propre : play-bac.com/antigone). Ces pages sont volontairement
   autonomes : ni app.js, ni gamification.js, ni donnée d'essai — juste du
   HTML et un peu de CSS en ligne. Elles doivent s'afficher en une fraction
   de seconde sur un téléphone en 3G, c'est ce que Google mesure et c'est
   aussi ce que vit l'élève.

   Appelé par tools/build-html.mjs à la fin du build.
============================================================================ */
import fs from 'node:fs';
import path from 'node:path';
import { PAGES } from '../src/pages/index.mjs';

export const SITE = 'https://play-bac.com';

/* --------------------------------------------------------------- garde-fous
   Une page vide ou dupliquée nuit au référencement au lieu de l'aider :
   on préfère faire échouer le build. */
function valider() {
  const erreurs = [];
  const vus = { slug: new Set(), titre: new Set(), description: new Set() };
  for (const p of PAGES) {
    if (!/^[a-z0-9-]+$/.test(p.slug)) erreurs.push(`slug invalide : « ${p.slug} »`);
    for (const champ of ['slug', 'titre', 'description']) {
      if (vus[champ].has(p[champ])) erreurs.push(`${champ} en double : « ${p[champ]} »`);
      vus[champ].add(p[champ]);
    }
    if (p.titre.length > 70) erreurs.push(`titre trop long (${p.titre.length} > 70) : ${p.slug}`);
    if (p.description.length < 70 || p.description.length > 175) {
      erreurs.push(`description hors bornes (${p.description.length}, attendu 70-175) : ${p.slug}`);
    }
    const mots = motsDe(p);
    if (mots < 400) erreurs.push(`page trop courte (${mots} mots, minimum 400) : ${p.slug}`);
  }
  return erreurs;
}

function motsDe(p) {
  const textes = [p.chapo];
  for (const s of p.sections || []) {
    textes.push(s.h2);
    for (const b of s.blocs || []) {
      if (b.p) textes.push(b.p);
      if (b.liste) textes.push(b.liste.join(' '));
    }
  }
  for (const f of p.faq || []) textes.push(f.q, f.r);
  return textes.join(' ').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
}

/* ------------------------------------------------------------------- rendu */
const echapper = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/* le texte des données contient volontairement <b> et <sup> : on ne les
   échappe pas, mais rien de ces pages ne vient d'une saisie extérieure. */

function rendreBlocs(blocs) {
  return (blocs || []).map((b) => {
    if (b.liste) return '<ul>' + b.liste.map((li) => `<li>${li}</li>`).join('') + '</ul>';
    return `<p>${b.p}</p>`;
  }).join('\n      ');
}

function autresPages(slug) {
  return PAGES.filter((p) => p.slug !== slug)
    .map((p) => `<li><a href="/${p.slug}">${echapper(p.h1.split('—')[0].trim())}</a></li>`)
    .join('');
}

const CSS = `
:root{--ink:#1a1008;--cream:#faf6ee;--gold:#b8842a;--gold-d:#8a6218;--muted:#6b5d4a;--line:#e6dcc9}
*{box-sizing:border-box}
body{margin:0;background:var(--cream);color:var(--ink);
 font:16px/1.75 'Tajawal',-apple-system,Segoe UI,Roboto,Arial,sans-serif;-webkit-text-size-adjust:100%}
a{color:var(--gold-d)}
.bandeau{background:#1a1008;color:#f6d985;padding:12px 0}
.bandeau .wrap{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.bandeau a{color:#f6d985;text-decoration:none;font-weight:900;font-size:14px}
.bandeau .cta{margin-left:auto;background:linear-gradient(135deg,#f0c75d,#c8922a);color:#1a1008;
 padding:8px 16px;border-radius:999px;font-size:13px}
.wrap{width:100%;max-width:760px;margin:0 auto;padding:0 20px}
main{padding:34px 0 10px}
h1{font-family:'Playfair Display',Georgia,serif;font-size:clamp(27px,5vw,40px);line-height:1.14;margin:0 0 14px}
h2{font-family:'Playfair Display',Georgia,serif;font-size:clamp(21px,3.4vw,27px);line-height:1.25;
 margin:40px 0 12px;padding-top:22px;border-top:1px solid var(--line)}
h3{font-size:17px;margin:22px 0 6px}
.chapo{font-size:18px;color:#3d2c17;border-left:3px solid var(--gold);padding-left:16px;margin:0 0 8px}
.fil{font-size:13px;color:var(--muted);margin:0 0 18px}
.fil a{color:var(--muted)}
ul{padding-left:22px}
li{margin:7px 0}
.encart{background:#fff;border:1px solid var(--line);border-left:4px solid var(--gold);
 border-radius:14px;padding:22px;margin:38px 0}
.encart h2{margin:0 0 8px;padding:0;border:none;font-size:22px}
.encart p{margin:0 0 16px;color:#3d2c17}
.bouton{display:inline-block;background:linear-gradient(135deg,#f0c75d,#c8922a);color:#1a1008;
 text-decoration:none;font-weight:900;padding:14px 24px;border-radius:14px}
.bouton small{display:block;font-weight:600;font-size:12px;opacity:.72;margin-top:2px}
details{background:#fff;border:1px solid var(--line);border-radius:12px;margin:8px 0;overflow:hidden}
summary{cursor:pointer;padding:14px 18px;font-weight:800}
details p{margin:0;padding:0 18px 16px;color:#3d2c17}
.liens{background:#fff;border:1px solid var(--line);border-radius:14px;padding:18px 22px;margin:34px 0}
.liens strong{display:block;margin-bottom:6px;font-size:15px}
footer{border-top:1px solid var(--line);margin-top:30px;padding:24px 0 40px;color:var(--muted);font-size:13px}
footer p{margin:3px 0}
@media(max-width:620px){main{padding:24px 0 6px}.encart{padding:18px}}
`.trim();

function rendrePage(p) {
  const url = `${SITE}/${p.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: p.h1,
        description: p.description,
        inLanguage: 'fr',
        mainEntityOfPage: url,
        author: { '@type': 'Organization', name: '1BAC Français — Parcours régional' },
        publisher: { '@type': 'Organization', name: '1BAC Français — Parcours régional' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: (p.faq || []).map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.r.replace(/<[^>]+>/g, '') },
        })),
      },
    ],
  };

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${echapper(p.titre)}</title>
<meta name="description" content="${echapper(p.description)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:title" content="${echapper(p.titre)}">
<meta property="og:description" content="${echapper(p.description)}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="fr_MA">
<meta name="twitter:card" content="summary">
<link rel="icon" href="/assets/img/icon-192.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Tajawal:wght@400;700;900&display=swap">
<style>${CSS}</style>
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>

<div class="bandeau"><div class="wrap">
  <a href="/">📚 1BAC Français · Régional</a>
  <a class="cta" href="/">Commencer gratuitement</a>
</div></div>

<main class="wrap">
  <p class="fil"><a href="/">Accueil</a> › ${echapper(p.h1.split('—')[0].trim())}</p>
  <article>
    <h1>${p.h1}</h1>
    <p class="chapo">${p.chapo}</p>

    ${(p.sections || []).map((s) => `<h2>${s.h2}</h2>
      ${rendreBlocs(s.blocs)}`).join('\n\n    ')}

    <div class="encart">
      <h2>S’entraîner, pas seulement relire</h2>
      <p>Trois leçons sont ouvertes gratuitement, sans inscription et sans carte bancaire : cinq questions corrigées à chaque fois, deux minutes par leçon. C’est en répondant qu’on retient, pas en relisant.</p>
      <a class="bouton" href="/">🎮 Commencer mes 3 leçons gratuites<small>Sans inscription · 6 minutes</small></a>
    </div>

    ${(p.faq || []).length ? `<h2>Questions fréquentes</h2>
    ${p.faq.map((f) => `<details><summary>${echapper(f.q)}</summary><p>${f.r}</p></details>`).join('\n    ')}` : ''}

    <div class="liens">
      <strong>À lire aussi</strong>
      <ul>${autresPages(p.slug)}</ul>
    </div>
  </article>
</main>

<footer class="wrap">
  <p>1BAC Français — Parcours régional · Maroc</p>
  <p>Plateforme de révision indépendante, sans lien avec le Ministère de l’Éducation nationale.</p>
</footer>

</body>
</html>`;
}

/* ------------------------------------------------------------------ écriture */
export function genererPagesPubliques(DIST) {
  const erreurs = valider();
  if (erreurs.length) {
    console.error('❌ Build refusé (pages publiques) :');
    for (const e of erreurs) console.error('   - ' + e);
    process.exit(1);
  }

  /* Un fichier <slug>.html à la racine, PAS <slug>/index.html : Netlify sert
     alors /antigone directement (URL propre), alors qu'un dossier provoque
     une redirection 301 vers /antigone/ — l'adresse servie ne correspondrait
     plus au canonical ni au sitemap. */
  for (const p of PAGES) {
    fs.writeFileSync(path.join(DIST, p.slug + '.html'), rendrePage(p), 'utf8');
  }

  const aujourdhui = new Date().toISOString().slice(0, 10);
  const urls = [{ loc: SITE + '/', prio: '1.0' }]
    .concat(PAGES.map((p) => ({ loc: `${SITE}/${p.slug}`, prio: '0.8' })));
  const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${aujourdhui}</lastmod><priority>${u.prio}</priority></url>`).join('\n') +
    '\n</urlset>\n';
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap, 'utf8');

  /* gestion-codes.html est l'espace vendeur : hors de question qu'il soit
     indexé (il est déjà protégé par la clé, mais on n'expose pas son URL). */
  fs.writeFileSync(path.join(DIST, 'robots.txt'),
    'User-agent: *\nAllow: /\nDisallow: /gestion-codes.html\n\nSitemap: ' + SITE + '/sitemap.xml\n', 'utf8');

  return { pages: PAGES.length, mots: PAGES.reduce((n, p) => n + motsDe(p), 0) };
}
