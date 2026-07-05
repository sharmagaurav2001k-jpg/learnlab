function openCreateGroup(){
  populateSelect('gCat');
  openModal('createGroupModal');
}
function saveGroup(){
  const name=document.getElementById('gName').value.trim();
  const desc=document.getElementById('gDesc').value.trim();
  const cat=document.getElementById('gCat').value;
  if(!name){showToast('Enter a group name','error');return;}
  S.groups.push({id:'g'+Date.now(),name,desc:desc||'A great study group!',emoji:S.gEmoji,cat,color:S.gColor,members:['You'],joined:true,messages:[]});
  closeModal('createGroupModal');
  document.getElementById('gName').value='';document.getElementById('gDesc').value='';
  renderGroups();showToast(`"${name}" created! 🎉`,'success');
}

// Expose on window for inline event handlers and cross-module access
Object.assign(window, { openCreateGroup, saveGroup });
