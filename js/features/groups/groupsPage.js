/* ── GROUPS ──────────────────────────────────────────── */
function renderGroups(){
  const grid=document.getElementById('groupsGrid');
  let groups=S.groups;
  if(S.groupFilter==='joined') groups=groups.filter(g=>g.joined);
  if(groups.length===0){
    grid.innerHTML=`<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">👥</div><h3>No groups yet</h3><p>Create a study group or join one!</p></div>`;
    return;
  }
  grid.innerHTML=groups.map((g,i)=>{
    const avs=g.members.slice(0,4).map(m=>`<div class="mav" style="background:${rColor(m)}">${m}</div>`).join('');
    return `<div class="group-card" style="animation-delay:${i*.06}s" onclick="openChat('${g.id}')">
      <div class="group-banner" style="background:linear-gradient(135deg,${g.color},${g.color}99)">
        <div style="font-size:2rem">${g.emoji}</div>
        <div class="group-banner-name">${g.name}</div>
      </div>
      <div class="group-body">
        <div class="group-desc">${g.desc}</div>
        <div class="group-meta">
          <div class="group-members"><div class="mavs">${avs}</div>${g.members.length} member${g.members.length>1?'s':''}</div>
          <div style="display:flex;gap:6px;align-items:center">
            ${g.joined?`<button class="invite-btn" onclick="event.stopPropagation();openInviteModal('${g.id}')">✉️ Invite</button>`:''}
            <button class="btn btn-sm ${g.joined?'btn-outline':'btn-primary'}" onclick="event.stopPropagation();joinGroup('${g.id}')">${g.joined?'✓ Joined':'Join'}</button>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
}
function setGroupFilter(val,btn){
  S.groupFilter=val;
  document.querySelectorAll('#groupFilter .filter-pill').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active'); renderGroups();
}
function joinGroup(id){
  const g=S.groups.find(g=>g.id===id);
  g.joined=!g.joined;
  if(g.joined){g.members.push('You');showToast(`Joined "${g.name}"! 🎉`,'success');}
  else{g.members=g.members.filter(m=>m!=='You');showToast(`Left "${g.name}"`,'');}
  renderGroups();
}

// Expose on window for inline event handlers and cross-module access
Object.assign(window, { renderGroups, setGroupFilter, joinGroup });
