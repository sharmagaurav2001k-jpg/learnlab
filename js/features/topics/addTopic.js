/* ── ADD CUSTOM TOPIC ────────────────────────────────── */
function openAddModal(){
  populateSelect('newCat', S.activeCat||'prog');
  openModal('addModal');
}
function saveNewTopic(){
  const name=document.getElementById('newName').value.trim();
  const desc=document.getElementById('newDesc').value.trim();
  const cat=document.getElementById('newCat').value;
  const status=document.getElementById('newStatus').value;
  if(!name){ showToast('Please enter a topic name','error'); return; }
  const id='c'+Date.now();
  S.topics.push({id,name,desc,cat,status,emoji:S.selEmoji,custom:true});
  closeModal('addModal');
  document.getElementById('newName').value='';
  document.getElementById('newDesc').value='';
  if(S.activeCat&&cat===S.activeCat) renderCatTopics();
  renderCatGrid();
  showToast(`"${name}" added! 🎉`,'success');
}

// Expose on window for inline event handlers and cross-module access
Object.assign(window, { openAddModal, saveNewTopic });
