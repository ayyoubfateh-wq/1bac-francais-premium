(function(){
  var bar = document.getElementById('perf-progress');
  if(!bar) return;
  var w = 10;
  bar.style.width = w + '%';
  var iv = setInterval(function(){
    w += (90 - w) * 0.08;
    bar.style.width = w + '%';
  }, 100);
  window.addEventListener('load', function(){
    clearInterval(iv);
    bar.style.width = '100%';
    bar.style.opacity = '0';
    bar.style.transition = 'width 0.2s ease, opacity 0.5s ease 0.2s';
    setTimeout(function(){ bar.style.display='none'; }, 800);
  });
})();

/* ---- Bloc JS extrait ---- */

/* ============================================================================
   D1. DONNÉES DU QUIZ
   Modifier ici les questions/réponses sans toucher au design.
============================================================================ */
const QUESTIONS = (typeof window !== 'undefined' && window.PF_DATA && window.PF_DATA.questions) ? window.PF_DATA.questions : {};

/* ============================================================================
   E1. UTILITAIRES GÉNÉRAUX
============================================================================ */
function getMix(){
  const all=[];
  ['boite','antigone','condamne'].forEach(k=>{
    const s=[...QUESTIONS[k]];
    for(let i=s.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[s[i],s[j]]=[s[j],s[i]];}
    all.push(...s.slice(0,10));
  });
  for(let i=all.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[all[i],all[j]]=[all[j],all[i]];}
  return all;
}

const bookColors={boite:'#1a6b5a',antigone:'#4a3070',condamne:'#b5432a',mix:'#c8922a'};
const bookNames={boite:'La Boîte à Merveilles',antigone:'Antigone',condamne:'Le Dernier Jour d\'un Condamné',mix:'Quiz Mixte'};
let qs=[],cur=0,score=0,answers=[],activeBook=null,currentBookName='';

/* ============================================================================
   E2. NAVIGATION ENTRE LES ÉCRANS
============================================================================ */
function showScreen(id,btn){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav button,.sidebar-nav button').forEach(b=>b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
  closeMobileNav();

  // Remonter en haut à chaque changement de rubrique
  setTimeout(() => {
    window.scrollTo({top:0, behavior:'smooth'});
  }, 30);
}
function toggleMobileNav(toggleBtn){
  const nav=document.querySelector('.sidebar-nav');
  const open=nav.classList.toggle('nav-open');
  toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
}
function closeMobileNav(){
  const nav=document.querySelector('.sidebar-nav');
  nav.classList.remove('nav-open');
  const toggleBtn=document.querySelector('.nav-toggle');
  if(toggleBtn) toggleBtn.setAttribute('aria-expanded','false');
}
function showCTab(id,btn){
  document.querySelectorAll('#cadre .resume-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('#cadre .rtab').forEach(b=>b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
}
function showMtab(id,btn){
  // Only deactivate direct child panels of #methode (not nested ones)
  const methode=document.getElementById('methode');
  methode.querySelectorAll(':scope>.resume-panel').forEach(p=>p.classList.remove('active'));
  methode.querySelectorAll('.resume-tabs:first-of-type .rtab').forEach(b=>b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
}
function showRtab(id,btn){
  const target=document.getElementById(id);
  if(!target || !btn) return;

  /* Correctif onglets imbriqués :
     Les sous-onglets des plans modèles sont placés à l'intérieur d'un panneau principal.
     Avant, le script désactivait tous les .resume-panel de la rubrique Méthode,
     ce qui masquait aussi le panneau parent m-plans. Maintenant, on limite le
     changement aux panneaux frères du sous-onglet cliqué. */
  const tabs = btn.closest('.resume-tabs');
  const parentPanel = tabs ? tabs.closest('.resume-panel') : null;
  const scope = parentPanel || target.parentElement;

  Array.from(scope.children).forEach(el=>{
    if(el.classList && el.classList.contains('resume-panel')){
      el.classList.remove('active');
    }
  });

  if(tabs){
    tabs.querySelectorAll('.rtab').forEach(b=>b.classList.remove('active'));
  } else {
    scope.querySelectorAll(':scope > .rtab').forEach(b=>b.classList.remove('active'));
  }

  target.classList.add('active');
  btn.classList.add('active');
}
function showEtab(id,btn){
  document.querySelectorAll('.exam-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.etab').forEach(b=>b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
}

function goBook(book){
  activeBook=book;
  currentBookName=bookNames[book];

  // Depuis l'accueil, ouvrir directement la rubrique Résumés
  const resumeNavBtn = Array.from(document.querySelectorAll('.sidebar-nav button,.nav button'))
    .find(b => b.getAttribute('onclick') && b.getAttribute('onclick').includes("showScreen('resumes'"));
  showScreen('resumes', resumeNavBtn || document.querySelector('.sidebar-nav button'));

  // Activer automatiquement le résumé de l'œuvre choisie
  const resumeMap = {
    boite: 'r-boite',
    antigone: 'r-antigone',
    condamne: 'r-condamne'
  };
  const targetId = resumeMap[book] || 'r-boite';
  const targetBtn = Array.from(document.querySelectorAll('#resumes .rtab'))
    .find(b => b.getAttribute('onclick') && b.getAttribute('onclick').includes("'" + targetId + "'"));
  if(targetBtn){
    showRtab(targetId, targetBtn);
  }

  // Remonter proprement en haut de la rubrique Résumés
  setTimeout(() => {
    const resumesSection = document.getElementById('resumes');
    if(resumesSection){
      resumesSection.scrollIntoView({behavior:'smooth', block:'start'});
    }else{
      window.scrollTo({top:0, behavior:'smooth'});
    }
  }, 50);

  // Garder les informations du Assistant pédagogique à jour sans rediriger vers lui
  const accent=document.getElementById('chat-accent');
  const title=document.getElementById('chat-title');
  const sub=document.getElementById('chat-sub');
  if(accent) accent.style.background=bookColors[book];
  if(title) title.textContent=bookNames[book];
  if(sub) sub.textContent='Assistant pédagogique prêt pour cette œuvre';
}

/* ============================================================================
   E3. LOGIQUE DU QUIZ
============================================================================ */
function startQuiz(book){
  currentBookName=bookNames[book];
  qs=book==='mix'?getMix():[...QUESTIONS[book]];
  cur=0;score=0;answers=[];
  document.getElementById('quiz-select-screen').style.display='none';
  document.getElementById('quiz-results-screen').style.display='none';
  document.getElementById('quiz-game-screen').style.display='block';
  renderQ();
}
function renderQ(){
  const q=qs[cur],total=qs.length;
  document.getElementById('qpfill').style.width=((cur/total)*100)+'%';
  document.getElementById('qnum').textContent=`Q${cur+1}/${total}`;
  document.getElementById('qtext').textContent=q.q;
  document.getElementById('qcat').textContent=q.cat||'QCM';
  document.getElementById('qfeedback').style.display='none';
  document.getElementById('qaiblock').style.display='none';
  document.getElementById('qaicontent').textContent='';
  const opts=document.getElementById('qopts');opts.innerHTML='';
  const letters=['A','B','C','D'];
  q.opts.forEach((o,i)=>{
    const b=document.createElement('button');b.className='opt';
    b.innerHTML=`<span class="opt-letter">${letters[i]}</span>${o}`;
    b.onclick=()=>answerQ(i,b);opts.appendChild(b);
  });
  document.getElementById('qbtns').innerHTML='';
}
function answerQ(idx,btn){
  const q=qs[cur];
  document.querySelectorAll('.opt').forEach(b=>b.disabled=true);
  const ok=idx===q.ans;
  if(ok){btn.classList.add('correct');score++;}
  else{btn.classList.add('wrong');document.querySelectorAll('.opt')[q.ans].classList.add('reveal');}
  answers.push({q:q.q,correct:ok,right:q.opts[q.ans]});
  const fb=document.getElementById('qfeedback');
  fb.style.display='block';
  fb.innerHTML=`<div class="feedback ${ok?'ok':'ko'}">${ok?'✓ Bonne réponse !':'✗ La bonne réponse est : '+q.opts[q.ans]}</div>`;
  showAIExp(q);
  const row=document.getElementById('qbtns');row.innerHTML='';
  const n=document.createElement('button');
  n.className='btn-dark';n.style.marginTop='8px';
  n.textContent=cur<qs.length-1?'Question suivante →':'Voir mes résultats →';
  n.onclick=cur<qs.length-1?()=>{cur++;renderQ();}:showResults;
  row.appendChild(n);
}
function showAIExp(q){
  document.getElementById('qaiblock').style.display='block';
  const content=document.getElementById('qaicontent');
  content.textContent=q.exp || 'Retenez la réponse correcte et relisez la fiche correspondante pour consolider cette notion.';
}
function showResults(){
  const total=qs.length,pct=Math.round((score/total)*100);
  const color=pct>=70?'#2e7d32':pct>=50?'#e65100':'#c62828';
  const ring=document.getElementById('sring');ring.style.borderColor=color;
  document.getElementById('snum').style.color=color;document.getElementById('snum').textContent=score;
  document.getElementById('sden').textContent='/'+total;
  document.getElementById('rtitle').textContent=pct>=70?'Excellent travail !':pct>=50?'Pas mal, continuez !':'À revoir !';
  document.getElementById('rmsg').textContent=pct>=70?'Vous maîtrisez bien cette œuvre.':pct>=50?'Quelques points à retravailler.':'Reprenez vos fiches de révision.';
  document.getElementById('stok').textContent=score;document.getElementById('stko').textContent=total-score;document.getElementById('stpct').textContent=pct+'%';
  const list=document.getElementById('revlist');list.innerHTML='';
  answers.forEach((a,i)=>{const d=document.createElement('div');d.className='rev-item '+(a.correct?'ok':'ko');d.textContent=(a.correct?'✓ ':'✗ ')+'Q'+(i+1)+' — '+(a.correct?'Correct':'Bonne réponse : '+a.right);list.appendChild(d);});
  document.getElementById('quiz-game-screen').style.display='none';
  document.getElementById('quiz-results-screen').style.display='block';
}
function resetQuiz(){
  document.getElementById('quiz-results-screen').style.display='none';
  document.getElementById('quiz-select-screen').style.display='block';
}
function toggleAIAnswer(btn,fallback){
  const box=btn.nextElementSibling;
  if(box.style.display==='block'){box.style.display='none';return;}
  box.style.display='block';
  if(box.dataset.loaded){return;}
  box.dataset.loaded='1';
  const content=document.createElement('div');
  content.style.cssText='font-size:13px;color:rgba(26,16,8,.75);line-height:1.7;margin-top:6px;';
  content.textContent=fallback || 'Réponse type indisponible. Relisez l’extrait, relevez une citation précise, puis expliquez son effet.';
  box.appendChild(content);
}

/* ============================================================================
   E4. ASSISTANT BAC FREEMIUM — SANS API EXTERNE
   Cette version ne contacte aucun service d’IA et n’expose aucune clé API.
============================================================================ */
function resetChat(){
  chatHistory=[];
  const box=document.getElementById('msgs');
  box.innerHTML='<div class="msg ai">Nouvelle conversation ! Je suis votre assistant de révision inclus pour le 1BAC. Je fonctionne sans API payante : je donne des méthodes, plans et rappels essentiels sur les trois œuvres. 📚</div>';
}
let chatBook=null;
let chatHistory=[];
function parseMarkdown(text){
  return text
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/^### (.+)$/gm,'<h5 style="font-family:\'Playfair Display\',serif;font-size:14px;color:var(--ink);margin:10px 0 4px;">$1</h5>')
    .replace(/^## (.+)$/gm,'<h4 style="font-family:\'Playfair Display\',serif;font-size:15px;color:var(--ink);margin:12px 0 5px;">$1</h4>')
    .replace(/^- (.+)$/gm,'<div style="padding:2px 0 2px 14px;position:relative;"><span style="position:absolute;left:0;color:var(--gold);">›</span>$1</div>')
    .replace(/\n\n/g,'<br><br>')
    .replace(/\n/g,'<br>');
}
function qpill(t){document.getElementById('chatinput').value=t;sendChat();}
function askProf(msg){showScreen('chat');addMsg(msg,'user');chatHistory.push({role:'user',content:msg});callAI();}
function sendChat(){
  const inp=document.getElementById('chatinput'),t=inp.value.trim();
  if(!t)return;inp.value='';
  addMsg(t,'user');
  const ctx=activeBook?'[Œuvre active : '+bookNames[activeBook]+'] ':'';
  chatHistory.push({role:'user',content:ctx+t});
  callAI();
}
function addMsg(text,role,isHtml=false){
  const box=document.getElementById('msgs'),d=document.createElement('div');
  d.className='msg '+role;
  if(isHtml){d.innerHTML=text;}else{d.textContent=text;}
  box.appendChild(d);box.scrollTop=box.scrollHeight;return d;
}
function localAssistantResponse(message){
  const m=(message||'').toLowerCase();
  const oeuvre = m.includes('antigone') ? 'antigone' : (m.includes('condamné') || m.includes('hugo') || m.includes('dernier jour')) ? 'condamne' : (m.includes('boîte') || m.includes('boite') || m.includes('sefrioui') || m.includes('sidi mohammed')) ? 'boite' : (activeBook || 'general');
  if(m.includes('introduction') || m.includes('plan') || m.includes('dissertation')){return '## Plan guidé pour une production écrite\n\n**Introduction**\n- Présentez brièvement le thème du sujet.\n- Reformulez la problématique avec vos propres mots.\n- Annoncez un plan clair en 2 parties.\n\n**Développement**\n- Partie 1 : argument principal + exemple précis tiré de l’œuvre.\n- Partie 2 : nuance ou argument opposé + exemple.\n- Utilisez des connecteurs : d’abord, ensuite, cependant, donc.\n\n**Conclusion**\n- Répondez clairement à la question.\n- Ouvrez vers une idée générale.\n\n**Conseil Bac :** évitez les phrases vagues. Chaque argument doit être accompagné d’un exemple précis de l’œuvre et, quand c’est possible, d’une citation courte. N’inventez jamais une citation.';}
  if(m.includes('commentaire') || m.includes('axe') || m.includes('analyse')){return '## Méthode d’analyse\n\nPour analyser un extrait, suivez cette formule :\n\n- **Identifier** le procédé : champ lexical, temps verbal, figure de style, registre.\n- **Citer** un mot ou une phrase du texte.\n- **Expliquer** l’effet produit sur le lecteur.\n- **Relier** l’analyse au thème de l’œuvre.\n\nExemple : **L’auteur utilise [procédé] dans “[citation]”, ce qui montre [idée] et produit un effet de [effet].**';}
  if(m.includes('figure') || m.includes('style')){return '## Figures de style à maîtriser\n\n- **Comparaison** : rapprochement avec un outil comme “comme”.\n- **Métaphore** : rapprochement direct sans outil.\n- **Antithèse** : opposition de deux idées.\n- **Énumération** : liste d’éléments pour insister ou décrire.\n- **Anaphore** : répétition au début de plusieurs phrases.\n\n**Méthode régional :** donnez le nom, citez le texte, expliquez l’effet, puis reliez l’analyse à l’idée générale du passage.';}
  if(m.includes('thème') || m.includes('themes') || m.includes('commun')){return '## Thèmes communs aux trois œuvres\n\n- **La solitude** : Sidi Mohammed est isolé, Antigone est seule contre le pouvoir, le condamné est seul face à la mort.\n- **La souffrance** : morale, familiale, politique ou existentielle.\n- **Le conflit avec la société** : monde adulte, loi politique, justice.\n- **La dignité humaine** : chaque œuvre interroge la valeur de l’être humain.';}
  if(oeuvre==='antigone'){return '## Antigone — rappel essentiel\n\n**Auteur :** Jean Anouilh.\n**Genre :** tragédie moderne.\n**Conflit central :** Antigone défend l’absolu moral, tandis que Créon défend la raison d’État.\n\n**Axes fréquents :** loi et conscience, solitude du héros tragique, pouvoir et liberté.';}
  if(oeuvre==='condamne'){return '## Le Dernier Jour d’un Condamné — rappel essentiel\n\n**Auteur :** Victor Hugo.\n**Genre :** roman à thèse / récit engagé.\n**Objectif :** dénoncer la peine de mort en montrant la souffrance psychologique du condamné.\n\n**Axes fréquents :** critique de la justice, humanisation du condamné, registre pathétique.';}
  if(oeuvre==='boite'){return '## La Boîte à Merveilles — rappel essentiel\n\n**Auteur :** Ahmed Sefrioui.\n**Genre :** roman autobiographique.\n**Narrateur :** Sidi Mohammed, enfant sensible et solitaire.\n\n**Axes fréquents :** solitude, imagination, mémoire, société traditionnelle marocaine, boîte comme refuge symbolique.';}
  return '## Réponse guidée\n\nJe peux t’aider avec : un résumé, un plan, une introduction, une figure de style, une comparaison ou une méthode Bac.\n\n**Conseil :** écris le nom de l’œuvre et le type d’aide souhaité, par exemple : “Plan sur Antigone et la liberté”.';
}
function callAI(){
  const last=chatHistory[chatHistory.length-1]?.content || '';
  const replyText=localAssistantResponse(last);
  chatHistory.push({role:'assistant',content:replyText});
  if(chatHistory.length>20){chatHistory=chatHistory.slice(-18);}
  addMsg(parseMarkdown(replyText),'ai',true);
}
/* ============================================================================
   FIN JAVASCRIPT
============================================================================ */

/* ---- Bloc JS extrait ---- */

const OPTIMIZED_IMAGE_ASSETS = {
  "img_1": "assets/img/image_1.webp",
  "img_2": "assets/img/image_2.webp",
  "img_3": "assets/img/image_3.webp",
  "img_4": "assets/img/image_4.webp",
};

// Lazy-load des images via IntersectionObserver
// Les images ne sont chargées que lorsqu'elles entrent dans le viewport
(function() {
  function loadImg(img) {
    var key = img.getAttribute("data-img-key");
    if (key && OPTIMIZED_IMAGE_ASSETS[key] && img.src !== OPTIMIZED_IMAGE_ASSETS[key]) {
      img.src = OPTIMIZED_IMAGE_ASSETS[key];
      img.removeAttribute("data-img-key");
    }
  }
  function initLazyImages() {
    var imgs = document.querySelectorAll("img[data-img-key]");
    if (!imgs.length) return;
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            loadImg(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: "200px 0px" }); // Préchargement 200px avant l'entrée dans le viewport
      imgs.forEach(function(img) { io.observe(img); });
    } else {
      // Fallback pour navigateurs anciens
      imgs.forEach(loadImg);
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLazyImages);
  } else {
    initLazyImages();
  }
})();

/* ---- Bloc JS extrait ---- */

/* ═══════════════════════════════════════════════════════════════
   ACCESSIBILITÉ — AJOUT CIBLÉ SANS TOUCHER LE RESTE
   Ajoute des rôles ARIA, labels, états actifs et navigation clavier.
═══════════════════════════════════════════════════════════════ */
(function(){
  function enhanceAccessibility(){
    document.documentElement.lang=document.documentElement.lang||'fr';

    if(!document.querySelector('.skip-link')){
      const skip=document.createElement('a');
      skip.href='#home';
      skip.className='skip-link';
      skip.textContent='Aller au contenu principal';
      document.body.insertBefore(skip,document.body.firstChild);
    }

    const app=document.querySelector('.app');
    if(app && !app.getAttribute('role')) app.setAttribute('role','main');

    const nav=document.querySelector('.sidebar-nav');
    if(nav){
      nav.setAttribute('aria-label','Navigation principale');
      nav.setAttribute('role','navigation');
    }

    document.querySelectorAll('.sidebar-nav button').forEach((btn)=>{
      const label=(btn.innerText||btn.textContent||'').replace(/^[^A-Za-zÀ-ÿ0-9]+/,'').trim();
      btn.setAttribute('type','button');
      btn.setAttribute('aria-label',label || 'Section');
      btn.setAttribute('aria-current',btn.classList.contains('active')?'page':'false');
    });

    document.querySelectorAll('button').forEach((btn)=>{
      if(!btn.getAttribute('type')) btn.setAttribute('type','button');
      if(!btn.getAttribute('aria-label')){
        const txt=(btn.innerText||btn.textContent||'').trim();
        if(txt) btn.setAttribute('aria-label',txt);
      }
    });

    document.querySelectorAll('.screen').forEach((screen)=>{
      const active=screen.classList.contains('active');
      screen.setAttribute('aria-hidden',active?'false':'true');
      if(!screen.getAttribute('tabindex')) screen.setAttribute('tabindex','-1');
    });

    document.querySelectorAll('img').forEach((img)=>{
      if(!img.hasAttribute('alt')) img.setAttribute('alt','Illustration pédagogique');
      img.setAttribute('loading','lazy');
      img.setAttribute('decoding','async');
    });

    const chatInput=document.getElementById('chatinput');
    if(chatInput){
      chatInput.setAttribute('aria-label','Écrire une question au professeur assistant');
      chatInput.setAttribute('autocomplete','off');
    }

    const msgs=document.getElementById('msgs');
    if(msgs){
      msgs.setAttribute('role','log');
      msgs.setAttribute('aria-live','polite');
      msgs.setAttribute('aria-label','Messages du professeur assistant');
    }

    document.querySelectorAll('.options').forEach((group)=>group.setAttribute('role','group'));
    document.querySelectorAll('.opt').forEach((opt)=>{
      opt.setAttribute('type','button');
      if(!opt.getAttribute('aria-label')) opt.setAttribute('aria-label',(opt.innerText||opt.textContent||'Réponse').trim());
    });
  }

  document.addEventListener('DOMContentLoaded',enhanceAccessibility);

  const originalShowScreen=window.showScreen;
  if(typeof originalShowScreen==='function'){
    window.showScreen=function(id,btn){
      originalShowScreen.apply(this,arguments);
      setTimeout(function(){
        enhanceAccessibility();
        const target=document.getElementById(id);
        if(target){
          target.setAttribute('aria-hidden','false');
          target.focus({preventScroll:true});
        }
      },0);
    };
  }else{
    window.addEventListener('load',enhanceAccessibility);
  }
})();

/* ---- Bloc JS extrait ---- */

/* ═══════════════════════════════════════════════════════════════════════════
   PATCH FINAL 18+/20 — améliorations non destructives
   - améliore SEO technique via attributs image
   - renforce clavier / lecteurs d'écran
   - mémorise la dernière section ouverte localement
═══════════════════════════════════════════════════════════════════════════ */
(function(){
  function finalPolish(){
    document.documentElement.lang = 'fr';
    document.title = document.title || '1BAC Français Maroc — Révision Bac';

    var app = document.getElementById('contenu-principal') || document.querySelector('.app');
    if(app){
      app.setAttribute('role','main');
      app.setAttribute('aria-label','Contenu principal de la plateforme 1BAC Français');
    }

    document.querySelectorAll('img').forEach(function(img){
      if(!img.hasAttribute('loading')) img.setAttribute('loading','lazy');
      if(!img.hasAttribute('decoding')) img.setAttribute('decoding','async');
      if(!img.getAttribute('alt')) img.setAttribute('alt','Illustration pédagogique');
    });

    document.querySelectorAll('button').forEach(function(btn){
      if(!btn.hasAttribute('type')) btn.setAttribute('type','button');
      if(!btn.getAttribute('aria-label')){
        var label=(btn.innerText||btn.textContent||'Bouton').replace(/\s+/g,' ').trim();
        btn.setAttribute('aria-label',label);
      }
    });

    document.querySelectorAll('.screen').forEach(function(screen){
      if(!screen.hasAttribute('tabindex')) screen.setAttribute('tabindex','-1');
      screen.setAttribute('aria-hidden', screen.classList.contains('active') ? 'false' : 'true');
    });

    var activeBtn=document.querySelector('.sidebar-nav button.active');
    document.querySelectorAll('.sidebar-nav button').forEach(function(btn){
      btn.setAttribute('aria-current', btn===activeBtn ? 'page' : 'false');
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    finalPolish();
    try{ localStorage.removeItem('pf1bac_last_screen'); }catch(e){}
    if(typeof window.showScreen==='function'){
      var homeBtn=[].slice.call(document.querySelectorAll('.sidebar-nav button')).find(function(b){
        return b.getAttribute('onclick') && b.getAttribute('onclick').indexOf("'home'")>-1;
      });
      window.showScreen('home', homeBtn || null);
    }
  });

  var previousShowScreen=window.showScreen;
  if(typeof previousShowScreen==='function' && !window.__pf1bacFinalPatch){
    window.__pf1bacFinalPatch=true;
    window.showScreen=function(id,btn){
      previousShowScreen.apply(this,arguments);
      try{localStorage.setItem('pf1bac_last_screen',id);}catch(e){}
      setTimeout(function(){
        finalPolish();
        var target=document.getElementById(id);
        if(target){target.focus({preventScroll:true});}
      },0);
    };
  }
})();

/* ---- Bloc JS extrait ---- */

/* Finitions institutionnelles 19+ — accessibilité non destructive */
(function(){
  function enhanceAccessibility(){
    document.documentElement.setAttribute('lang','fr');
    document.querySelectorAll('.sidebar-nav button').forEach(function(btn){
      var label = btn.textContent.replace(/s+/g,' ').trim();
      if(label && !btn.hasAttribute('aria-label')) btn.setAttribute('aria-label','Accéder à la section '+label.replace(/^[^A-Za-zÀ-ÿ]+/,''));
      if(btn.classList.contains('active')) btn.setAttribute('aria-current','page');
    });
    document.querySelectorAll('img').forEach(function(img, i){
      if(!img.hasAttribute('alt') || !img.getAttribute('alt').trim()) img.setAttribute('alt','Illustration pédagogique '+(i+1));
      img.setAttribute('loading','lazy');
      img.setAttribute('decoding','async');
    });
  }
  document.addEventListener('DOMContentLoaded', enhanceAccessibility);
  var oldShow = window.showScreen;
  if(typeof oldShow === 'function'){
    window.showScreen = function(id, btn){
      var result = oldShow.apply(this, arguments);
      document.querySelectorAll('.sidebar-nav button').forEach(function(b){b.removeAttribute('aria-current');});
      if(btn) btn.setAttribute('aria-current','page');
      return result;
    };
  }
})();

/* ---- Bloc JS extrait ---- */

/* ================================================================
   SYSTEME D'ACCES PREMIUM — VALIDATION SERVEUR
   - Aucun code secret ni hash n'est stocke dans le HTML.
   - La page envoie le code a une API serveur: POST /api/validate-access
   - Le serveur doit repondre: {"ok": true, "expiresIn": 28800}
   - Un exemple Node/Express est fourni dans server-example/server.js
   ================================================================ */
(function(){
  'use strict';
  var API_ENDPOINT = window.PF1BAC_ACCESS_API || '/api/validate-access';
  var SESSION_KEY = 'pf1bac_server_access_until';
  var _attempts = 0;
  var _lockUntil = 0;
  /* Identifiant d'appareil stable (anti-partage : 1 code = 2 appareils max) */
  function deviceId(){
    try {
      var id = localStorage.getItem('pf1bac_device_id');
      if (!id) {
        id = 'd-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 12);
        localStorage.setItem('pf1bac_device_id', id);
      }
      return id;
    } catch(e){ return 'd-anonyme'; }
  }
  window.pf1bacDeviceId = deviceId;
  function setError(message){ var error=document.getElementById('premiumAccessError'); if(error){ error.textContent=message; error.style.display='block'; } }
  function clearError(){ var error=document.getElementById('premiumAccessError'); if(error){ error.textContent=''; error.style.display='none'; } }
  function doUnlock(expiresIn){ var lock=document.getElementById('premiumLockScreen'); if(lock){ lock.style.display='none'; } document.documentElement.classList.add('premium-unlocked'); try{ sessionStorage.setItem(SESSION_KEY, String(Date.now()+Number(expiresIn||28800)*1000)); }catch(e){} }
  function restoreSession(){ try{ var until=Number(sessionStorage.getItem(SESSION_KEY)||0); if(until>Date.now()){ doUnlock(Math.ceil((until-Date.now())/1000)); return true; } sessionStorage.removeItem(SESSION_KEY); }catch(e){} return false; }
  async function validateOnServer(code){ var res=await fetch(API_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({code:code,deviceId:deviceId()})}); if(!res.ok){ throw new Error('HTTP '+res.status); } return await res.json(); }
  window.premiumCheckAccess = async function(){
    var now=Date.now(), input=document.getElementById('premiumAccessCode'), btn=document.querySelector('[onclick="premiumCheckAccess()"]'), code=input?input.value.trim():'';
    if(!code){ if(input) input.focus(); return; }
    if(_lockUntil>now){ setError('Acces bloque. Reessayez dans '+Math.ceil((_lockUntil-now)/1000)+'s.'); return; }
    clearError(); if(btn){ btn.textContent='Verification...'; btn.disabled=true; }
    try{ var data=await validateOnServer(code); if(data&&data.ok){ _attempts=0; doUnlock(data.expiresIn||28800);
      if(typeof window.gTrack==='function') window.gTrack('code_ok');
      /* clé de sauvegarde nuage = SHA-256 du code (jamais le code en clair) */
      try{ crypto.subtle.digest('SHA-256', new TextEncoder().encode(code.toUpperCase())).then(function(buf){
        var hex=Array.from(new Uint8Array(buf)).map(function(b){return b.toString(16).padStart(2,'0');}).join('');
        localStorage.setItem('pf1bac_sync_key', hex);
        if(typeof window.gCloudSync==='function') window.gCloudSync();
      }); }catch(e){}
    } else if(data&&data.message==='device_limit'){ setError('Ce code est déjà utilisé sur 2 appareils. Contactez le support WhatsApp pour le débloquer.'); } else { _attempts++; if(_attempts>=3){ _lockUntil=Date.now()+120000; } setError(_attempts>=3?'Trop de tentatives. Acces bloque 2 minutes.':'Code incorrect. '+(3-_attempts)+' tentative(s) restante(s).'); if(input){ input.value=''; input.focus(); } } }
    catch(e){ setError(''); }
    finally{ if(btn){ btn.textContent='Acceder maintenant'; btn.disabled=false; } }
  };
  document.addEventListener('DOMContentLoaded', function(){ if(!restoreSession()){ var lock=document.getElementById('premiumLockScreen'), input=document.getElementById('premiumAccessCode'); if(lock){ lock.style.display='flex'; } if(input){ input.addEventListener('keydown', function(e){ if(e.key==='Enter') window.premiumCheckAccess(); }); } } });
})();

/* ---- Bloc JS extrait ---- */

/* SUIVI ELEVE — score sauvegarde, progression et historique */
(function(){
  'use strict';
  var STORAGE_KEY='pf1bac_quiz_history_v1';
  function readHistory(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');}catch(e){return [];}}
  function writeHistory(items){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(items.slice(0,50)));}catch(e){}}
  function ensurePanel(){var select=document.getElementById('quiz-select-screen'); if(!select||document.getElementById('studentProgressPanel')) return; var panel=document.createElement('div'); panel.id='studentProgressPanel'; panel.className='pedagogy-audit'; panel.innerHTML='<h4>📊 Suivi de progression</h4><p id="studentProgressSummary">Aucun quiz terminé pour le moment.</p><div id="studentProgressHistory" class="review-list"></div><button type="button" class="btn-gold" id="clearProgressBtn">Effacer l historique</button>'; select.appendChild(panel); var clear=document.getElementById('clearProgressBtn'); if(clear){clear.addEventListener('click',function(){localStorage.removeItem(STORAGE_KEY); renderPanel();});}}
  function renderPanel(){ensurePanel(); var summary=document.getElementById('studentProgressSummary'), list=document.getElementById('studentProgressHistory'); if(!summary||!list) return; var h=readHistory(); var best=h.reduce(function(m,x){return Math.max(m,x.pct||0);},0); var avg=h.length?Math.round(h.reduce(function(s,x){return s+(x.pct||0);},0)/h.length):0; summary.textContent=h.length?('Quiz termines : '+h.length+' | Moyenne : '+avg+'% | Meilleur score : '+best+'%'):'Aucun quiz terminé pour le moment.'; list.innerHTML=''; h.slice(0,5).forEach(function(item){var d=document.createElement('div'); d.className='rev-item '+(item.pct>=70?'ok':item.pct>=50?'answer-mid':'ko'); d.textContent=new Date(item.date).toLocaleString('fr-FR')+' — '+item.book+' : '+item.score+'/'+item.total+' ('+item.pct+'%)'; list.appendChild(d);});}
  function saveCurrentResult(){try{var total=qs.length||0; if(!total) return; var pct=Math.round((score/total)*100); var h=readHistory(); h.unshift({date:new Date().toISOString(),book:currentBookName||'Quiz',score:score,total:total,pct:pct}); writeHistory(h);}catch(e){}}
  document.addEventListener('DOMContentLoaded', renderPanel);
  var oldShowResults=window.showResults; if(typeof oldShowResults==='function'){window.showResults=function(){saveCurrentResult(); var r=oldShowResults.apply(this,arguments); renderPanel(); return r;};}
  var oldResetQuiz=window.resetQuiz; if(typeof oldResetQuiz==='function'){window.resetQuiz=function(){var r=oldResetQuiz.apply(this,arguments); renderPanel(); return r;};}
  var oldShowScreen=window.showScreen; if(typeof oldShowScreen==='function'){window.showScreen=function(id,btn){var r=oldShowScreen.apply(this,arguments); if(id==='quiz') setTimeout(renderPanel,0); return r;};}
})();
