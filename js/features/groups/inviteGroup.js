/* ── INVITE FRIEND ───────────────────────────────────── */
function openInviteModal(groupId){
  S.inviteGroupId = groupId;
  const g = S.groups.find(g=>g.id===groupId);
  if(!g) return;

  // populate group context
  document.getElementById('inviteGroupIcon').textContent = g.emoji;
  document.getElementById('inviteGroupIcon').style.background = g.color+'22';
  document.getElementById('inviteGroupName').textContent = g.name;
  document.getElementById('inviteGroupMembers').textContent = `${g.members.length} member${g.members.length>1?'s':''} · ${getCat(g.cat).name}`;

  // generate real working invite link using current page URL + hash
  const base = window.location.href.split('#')[0];
  const link = `${base}#join=${g.id}`;
  document.getElementById('inviteLinkText').textContent = link;
  document.getElementById('copyLinkBtn').textContent = 'Copy';
  document.getElementById('copyLinkBtn').classList.remove('copied');

  // clear input
  document.getElementById('inviteInput').value = '';

  // init invites list for this group
  if(!g.invites) g.invites = [];
  renderPendingList(g);

  openModal('inviteModal');
}

function copyInviteLink(){
  const link = document.getElementById('inviteLinkText').textContent;
  // update the actual browser URL hash so the link is live immediately
  history.replaceState(null,'', '#join=' + S.inviteGroupId);
  // copy to clipboard with fallback
  if(navigator.clipboard){
    navigator.clipboard.writeText(link).catch(()=>fallbackCopy(link));
  } else { fallbackCopy(link); }
  const btn = document.getElementById('copyLinkBtn');
  btn.textContent = '✓ Copied!';
  btn.classList.add('copied');
  setTimeout(()=>{ btn.textContent='Copy'; btn.classList.remove('copied'); }, 2500);
  showToast('Invite link copied! Share it with your friend 🔗','success');
}
function fallbackCopy(text){
  const ta=document.createElement('textarea');
  ta.value=text; ta.style.position='fixed'; ta.style.opacity='0';
  document.body.appendChild(ta); ta.select();
  try{document.execCommand('copy')}catch(e){}
  document.body.removeChild(ta);
}

function shareVia(platform){
  const g = S.groups.find(g=>g.id===S.inviteGroupId);
  const base = window.location.href.split('#')[0];
  const link = `${base}#join=${g.id}`;
  const msg = encodeURIComponent(`Hey! Join my study group "${g.name}" on LearnLab 🎓\n${link}`);
  const urls = {
    whatsapp: `https://wa.me/?text=${msg}`,
    email:    `mailto:?subject=${encodeURIComponent('Join my study group on LearnLab!')}&body=${msg}`,
    twitter:  `https://twitter.com/intent/tweet?text=${msg}`,
  };
  window.open(urls[platform],'_blank');
}

function sendInvite(){
  const g = S.groups.find(g=>g.id===S.inviteGroupId);
  const val = document.getElementById('inviteInput').value.trim();
  if(!val){ showToast('Enter a name or email','error'); return; }
  if(!g.invites) g.invites = [];
  // prevent duplicate
  if(g.invites.some(i=>i.name.toLowerCase()===val.toLowerCase())){
    showToast('Already invited!','error'); return;
  }
  const isEmail = val.includes('@');
  g.invites.push({
    id: 'inv'+Date.now(),
    name: val,
    type: isEmail ? 'email' : 'name',
    status: 'pending',
    time: new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),
  });
  document.getElementById('inviteInput').value = '';
  renderPendingList(g);
  showToast(`Invite sent to ${val}! 🎉`,'success');

  // simulate acceptance after random delay for realism
  if(Math.random() > 0.4){
    const inv = g.invites[g.invites.length-1];
    setTimeout(()=>{
      inv.status = 'accepted';
      g.members.push(val.split(' ')[0].slice(0,6));
      renderPendingList(g);
      renderGroups();
      showToast(`${val} accepted your invite! 🎊`,'success');
    }, 4000 + Math.random()*4000);
  }
}

function renderPendingList(g){
  const wrap = document.getElementById('pendingWrap');
  const list = document.getElementById('pendingList');
  if(!g.invites || g.invites.length===0){ wrap.style.display='none'; return; }
  wrap.style.display = 'block';
  list.innerHTML = g.invites.map(inv=>`
    <div class="pending-item">
      <div class="pending-av" style="background:${rColor(inv.name)}">${inv.name[0].toUpperCase()}</div>
      <div class="pending-info">
        <div class="pending-name">${inv.name}</div>
        <div class="pending-status">${inv.type==='email'?'📧 Email invite':'👤 Name invite'} · ${inv.time}</div>
      </div>
      <span class="pending-badge ${inv.status==='accepted'?'badge-accepted':'badge-pending'}">
        ${inv.status==='accepted'?'✓ Accepted':'⏳ Pending'}
      </span>
    </div>`).join('');
}

// Expose on window for inline event handlers and cross-module access
Object.assign(window, { openInviteModal, copyInviteLink, fallbackCopy, shareVia, sendInvite, renderPendingList });
