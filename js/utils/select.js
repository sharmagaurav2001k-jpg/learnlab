function populateAllSelects(){['newCat','editCat','gCat','qCat'].forEach(id=>populateSelect(id))}
function populateSelect(id,selected){
  const sel=document.getElementById(id);
  if(!sel) return;
  sel.innerHTML=CATS.map(c=>`<option value="${c.id}"${c.id===selected?' selected':''}>${c.emoji} ${c.name}</option>`).join('');
}

// Expose on window for inline event handlers and cross-module access
Object.assign(window, { populateAllSelects, populateSelect });
