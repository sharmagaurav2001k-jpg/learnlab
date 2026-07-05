/* ── ADD CUSTOM TOPIC (persisted to Supabase) ────────── */
function openAddModal(){
  populateSelect('newCat', S.activeCat||'prog');
  openModal('addModal');
}
async function saveNewTopic(){
  const name=document.getElementById('newName').value.trim();
  const desc=document.getElementById('newDesc').value.trim();
  const cat=document.getElementById('newCat').value;
  const status=document.getElementById('newStatus').value;
  if(!name){ showToast('Please enter a topic name','error'); return; }
  let dbId;
  try{
    dbId=await window.db.insertCustomTopic({name,desc,cat,status,emoji:S.selEmoji});
  }catch(err){
    console.error('insertCustomTopic failed', err);
    showToast('Could not save topic. Try again.','error');
    return;
  }
  S.topics.push({id:dbId,dbId,name,desc,cat,status,emoji:S.selEmoji,custom:true});
  closeModal('addModal');
  document.getElementById('newName').value='';
  document.getElementById('newDesc').value='';
  if(S.activeCat&&cat===S.activeCat) renderCatTopics();
  renderCatGrid();
  showToast(`"${name}" added! 🎉`,'success');
}

// Expose on window for inline event handlers and cross-module access
Object.assign(window, { openAddModal, saveNewTopic });
