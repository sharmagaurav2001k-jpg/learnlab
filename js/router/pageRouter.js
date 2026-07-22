/* ── PAGE NAVIGATION ───────────────────────────────── */
function showPage(id, from){
  // handle support page (outside .app)
  document.querySelectorAll('.page').forEach(p=>{ p.classList.remove('active'); p.style.display='none'; });
  const pg = document.getElementById('page-'+id);
  if(pg){ pg.classList.add('active'); pg.style.display='block'; }

  // update nav tabs
  const order=['discover','mylearning','groups','qa'];
  document.querySelectorAll('.nav-tab').forEach((t,i)=>t.classList.toggle('active', order[i]===id));
  document.querySelectorAll('.mobile-tab').forEach(t=>t.classList.remove('active'));
  const mt=document.getElementById('mt-'+id);
  if(mt) mt.classList.add('active');
  if(id==='category'){
    document.querySelectorAll('.nav-tab')[0].classList.add('active');
    const dm=document.getElementById('mt-discover');
    if(dm) dm.classList.add('active');
  }

  // hide float widget on support page
  const fw = document.getElementById('supportFloat');
  if(fw) fw.style.display = (id==='support')?'none':'flex';

  if(id==='mylearning') renderMyLearning();
  if(id==='groups') renderGroups();
  if(id==='qa'){ renderQAFilters(); filterQA(); updateQAStats(); }
  if(id==='support') initSupportPage();
  if(from) S.prevPage=from;
  window.scrollTo({top:0,behavior:'smooth'});
}

function goBack(){ showPage(S.prevPage||'discover'); }

// Expose on window for inline event handlers and cross-module access
Object.assign(window, { showPage, goBack });
