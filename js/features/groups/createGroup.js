function openCreateGroup(){
  populateSelect('gCat');
  openModal('createGroupModal');
}
async function saveGroup(){
  const name=document.getElementById('gName').value.trim();
  const desc=document.getElementById('gDesc').value.trim();
  const cat=document.getElementById('gCat').value;
  if(!name){showToast('Enter a group name','error');return;}
  let row;
  try{
    row=await window.db.createGroupRow({name,desc:desc||'A great study group!',cat,emoji:S.gEmoji,color:S.gColor});
  }catch(err){
    console.error('createGroup failed', err);
    showToast('Could not create group. Try again.','error');
    return;
  }
  const me=(getProfile().display_name||'L').charAt(0).toUpperCase();
  S.groups.push({id:row.id,name,desc:desc||'A great study group!',emoji:S.gEmoji,cat,color:S.gColor,
    ownerId:row.owner_id,members:[me],memberIds:[row.owner_id],joined:true,invites:[],messages:[],messagesLoaded:true});
  closeModal('createGroupModal');
  document.getElementById('gName').value='';document.getElementById('gDesc').value='';
  renderGroups();showToast(`"${name}" created! 🎉`,'success');
}

// Expose on window for inline event handlers and cross-module access
Object.assign(window, { openCreateGroup, saveGroup });
