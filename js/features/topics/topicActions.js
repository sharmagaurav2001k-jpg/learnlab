/* ── TOPIC ACTIONS (persisted to Supabase) ──────────── */
function cycleStatus(id){
  const t=S.topics.find(t=>t.id===id);
  const o=['planned','learning','done'];
  t.status=o[(o.indexOf(t.status)+1)%o.length];
  rerenderTopic(t);
  updateCatStats(S.activeCat||t.cat);
  renderMyLearning();
  showToast(`Status → ${t.status} 🔄`,'success');
  window.db.saveTopic(t).catch(err=>{
    console.error('saveTopic failed', err);
    showToast('Could not save status change','error');
  });
}

function toggleMy(id){
  const idx=S.myTopics.indexOf(id);
  if(idx===-1){ S.myTopics.push(id); showToast('Added to My Learning! 🎉','success'); }
  else{ S.myTopics.splice(idx,1); showToast('Removed from My Learning',''); }
  const t=S.topics.find(t=>t.id===id);
  rerenderTopic(t);
  if(S.activeCat) updateCatStats(S.activeCat);
  renderMyLearning();
  window.db.saveTopic(t).catch(err=>{
    console.error('saveTopic failed', err);
    showToast('Could not save to your account','error');
  });
}

function rerenderTopic(t){
  const el=document.getElementById('tc-'+t.id);
  if(el){ const tmp=document.createElement('div'); tmp.innerHTML=topicCardHTML(t); el.replaceWith(tmp.firstElementChild); }
}

function deleteTopic(id){
  if(!confirm('Delete this topic?')) return;
  const t=S.topics.find(t=>t.id===id);
  const dbDelete=t&&t.dbId ? window.db.deleteTopicRow(t) : Promise.resolve();
  if(t&&!t.custom){
    // built-in topic: reset to catalog defaults instead of removing
    const orig=TOPICS.find(o=>o.id===id);
    Object.assign(t,{...orig,dbId:null});
    S.myTopics=S.myTopics.filter(i=>i!==id);
  } else {
    S.topics=S.topics.filter(t=>t.id!==id);
    S.myTopics=S.myTopics.filter(i=>i!==id);
  }
  renderCatTopics(); renderCatGrid(); renderMyLearning();
  showToast(t&&!t.custom?'Topic reset to default':'Topic deleted','error');
  dbDelete.catch(err=>{
    console.error('deleteTopic failed', err);
    showToast('Could not delete on server','error');
  });
}

// Expose on window for inline event handlers and cross-module access
Object.assign(window, { cycleStatus, toggleMy, rerenderTopic, deleteTopic });
