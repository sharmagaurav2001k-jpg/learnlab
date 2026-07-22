/* ── MY LEARNING ─────────────────────────────────────── */
function renderMyLearning(){
  const grid=document.getElementById('myTopicGrid');
  const empty=document.getElementById('myEmpty');
  const mine=S.topics.filter(t=>S.myTopics.includes(t.id));
  if(mine.length===0){ grid.innerHTML=''; empty.style.display='block'; }
  else{ empty.style.display='none'; grid.innerHTML=mine.map((t,i)=>topicCardHTML(t,i)).join(''); }
  updateProgress(mine);
}
function updateProgress(topics){
  const total=topics.length;
  const done=topics.filter(t=>t.status==='done').length;
  const learning=topics.filter(t=>t.status==='learning').length;
  const planned=topics.filter(t=>t.status==='planned').length;
  const pct=total?Math.round(done/total*100):0;
  document.getElementById('progressPct').textContent=pct+'%';
  document.getElementById('progressBar').style.width=pct+'%';
  document.getElementById('stPlanned').textContent=planned;
  document.getElementById('stLearning').textContent=learning;
  document.getElementById('stDone').textContent=done;
  document.getElementById('stTotal').textContent=total;
}

// Expose on window for inline event handlers and cross-module access
Object.assign(window, { renderMyLearning, updateProgress });
