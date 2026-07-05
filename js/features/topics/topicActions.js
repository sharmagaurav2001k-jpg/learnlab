/* ── TOPIC ACTIONS ──────────────────────────────────── */
function cycleStatus(id){
  const t=S.topics.find(t=>t.id===id);
  const o=['planned','learning','done'];
  t.status=o[(o.indexOf(t.status)+1)%o.length];
  rerenderTopic(t);
  updateCatStats(S.activeCat||t.cat);
  renderMyLearning();
  showToast(`Status → ${t.status} 🔄`,'success');
}

function toggleMy(id){
  const idx=S.myTopics.indexOf(id);
  if(idx===-1){ S.myTopics.push(id); showToast('Added to My Learning! 🎉','success'); }
  else{ S.myTopics.splice(idx,1); showToast('Removed from My Learning',''); }
  rerenderTopic(S.topics.find(t=>t.id===id));
  if(S.activeCat) updateCatStats(S.activeCat);
}

function rerenderTopic(t){
  const el=document.getElementById('tc-'+t.id);
  if(el){ const tmp=document.createElement('div'); tmp.innerHTML=topicCardHTML(t); el.replaceWith(tmp.firstElementChild); }
}

function deleteTopic(id){
  if(!confirm('Delete this topic?')) return;
  S.topics=S.topics.filter(t=>t.id!==id);
  S.myTopics=S.myTopics.filter(i=>i!==id);
  renderCatTopics(); renderCatGrid(); renderMyLearning();
  showToast('Topic deleted','error');
}

// Expose on window for inline event handlers and cross-module access
Object.assign(window, { cycleStatus, toggleMy, rerenderTopic, deleteTopic });
