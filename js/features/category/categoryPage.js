/* ── OPEN CATEGORY PAGE ─────────────────────────────── */
function openCategory(catId){
  S.activeCat=catId;
  S.catFilter='all';
  // reset filter pills
  document.querySelectorAll('#catStatusFilter .filter-pill').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('#catStatusFilter .filter-pill')[0].classList.add('active');

  const cat=getCat(catId);

  // populate hero
  document.getElementById('breadcrumbCat').textContent=cat.name;
  document.getElementById('catHeroEmoji').textContent=cat.emoji;
  document.getElementById('catHeroName').textContent=cat.name;
  document.getElementById('catHeroDesc').textContent=cat.desc;

  // hero gradient
  const card=document.getElementById('catHeroCard');
  card.style.background=`linear-gradient(135deg, ${cat.color}, ${cat.color2})`;

  // stats
  updateCatStats(catId);

  // pre-fill add modal category
  const sel=document.getElementById('newCat');
  if(sel){ sel.value=catId; }

  // render topics
  renderCatTopics();

  showPage('category','discover');
}

function updateCatStats(catId){
  const all=S.topics.filter(t=>t.cat===catId);
  const added=all.filter(t=>S.myTopics.includes(t.id)).length;
  const done=all.filter(t=>t.status==='done').length;
  document.getElementById('catStatTotal').textContent=all.length;
  document.getElementById('catStatAdded').textContent=added;
  document.getElementById('catStatDone').textContent=done;
}

function renderCatTopics(){
  const grid=document.getElementById('catTopicGrid');
  const noRes=document.getElementById('catNoRes');
  let topics=S.topics.filter(t=>t.cat===S.activeCat);
  if(S.catFilter!=='all') topics=topics.filter(t=>t.status===S.catFilter);
  if(topics.length===0){ grid.innerHTML=''; noRes.style.display='block'; }
  else{ noRes.style.display='none'; grid.innerHTML=topics.map((t,i)=>topicCardHTML(t,i)).join(''); }
  updateCatStats(S.activeCat);
}

function setCatFilter(val,btn){
  S.catFilter=val;
  document.querySelectorAll('#catStatusFilter .filter-pill').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  renderCatTopics();
}

// Expose on window for inline event handlers and cross-module access
Object.assign(window, { openCategory, updateCatStats, renderCatTopics, setCatFilter });
