/* ── INVITE HASH HANDLER ───────────────────────────── */
function checkInviteHash(){
  const hash = window.location.hash; // e.g. #join=g1
  const match = hash.match(/^#join=(.+)$/);
  if(!match) return;
  const groupId = match[1];
  const g = S.groups.find(g=>g.id===groupId);
  // clear hash from URL cleanly
  history.replaceState(null,'', window.location.pathname + window.location.search);
  if(!g){
    showJoinError();
    return;
  }
  // show the join overlay after a short delay so the page renders first
  setTimeout(()=> showJoinOverlay(g), 500);
}

function showJoinOverlay(g){
  const cat = getCat(g.cat);
  // set banner gradient to group colour
  document.getElementById('joinOverlayBanner').style.background =
    `linear-gradient(135deg, ${g.color}, ${g.color}bb)`;
  document.getElementById('joinOverlayIcon').textContent = g.emoji;
  document.getElementById('joinOverlayName').textContent = g.name;
  document.getElementById('joinOverlayDesc').textContent = g.desc;
  document.getElementById('joinOverlayCat').textContent = cat.emoji+' '+cat.name;
  document.getElementById('joinOverlayMembers').textContent = '👥 '+g.members.length+' member'+(g.members.length>1?'s':'');
  // already joined vs fresh join
  document.getElementById('joinAlreadyBox').style.display = g.joined ? 'block' : 'none';
  document.getElementById('joinActionBox').style.display  = g.joined ? 'none'  : 'block';
  S._pendingJoinId = g.id;
  document.getElementById('joinOverlay').classList.add('open');
}

function confirmJoinFromLink(){
  const g = S.groups.find(g=>g.id===S._pendingJoinId);
  if(!g) return;
  if(!g.joined){
    g.joined = true;
    g.members.push('You');
  }
  document.getElementById('joinOverlay').classList.remove('open');
  showPage('groups');
  renderGroups();
  showToast(`Welcome to "${g.name}"! 🎉`,'success');
}

function showJoinError(){
  document.getElementById('joinErrorOverlay').classList.add('open');
}

// Expose on window for inline event handlers and cross-module access
Object.assign(window, { checkInviteHash, showJoinOverlay, confirmJoinFromLink, showJoinError });
