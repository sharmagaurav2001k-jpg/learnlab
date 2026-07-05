/* ── EDIT TOPIC ──────────────────────────────────────── */
function openEdit(id){
  const t=S.topics.find(t=>t.id===id);
  document.getElementById('editId').value=id;
  document.getElementById('editName').value=t.name;
  document.getElementById('editDesc').value=t.desc||'';
  populateSelect('editCat',t.cat);
  document.getElementById('editStatus').value=t.status;
  openModal('editModal');
}
function saveEdit(){
  const id=document.getElementById('editId').value;
  const t=S.topics.find(t=>t.id===id);
  t.name=document.getElementById('editName').value.trim()||t.name;
  t.desc=document.getElementById('editDesc').value.trim();
  t.cat=document.getElementById('editCat').value;
  t.status=document.getElementById('editStatus').value;
  closeModal('editModal');
  if(S.activeCat) renderCatTopics();
  renderMyLearning();
  renderCatGrid();
  showToast('Topic updated ✨','success');
}

// Expose on window for inline event handlers and cross-module access
Object.assign(window, { openEdit, saveEdit });
