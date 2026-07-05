/* ── GROUP CHAT (persisted to Supabase) ─────────────── */
function openChat(id){
  S.activeGroup=id;
  const g=S.groups.find(g=>g.id===id);
  document.getElementById('chatGName').textContent=g.emoji+' '+g.name;
  document.getElementById('chatGSub').textContent=g.members.length+' member'+(g.members.length!==1?'s':'');
  document.getElementById('chatPanel').classList.add('open');
  if(!g.joined){
    document.getElementById('chatMessages').innerHTML=
      `<div class="empty-state" style="padding:36px 12px"><div class="empty-icon">🔒</div><h3 style="font-size:1rem">Members only</h3><p>Join this group to see and send messages.</p></div>`;
    return;
  }
  subscribeToGroupChat(id);
  renderChatMsgs(g);
  window.db.loadMessages(g).then(()=>{
    if(S.activeGroup===id) renderChatMsgs(g);
  }).catch(err=>{
    console.error('loadMessages failed', err);
    showToast('Could not load messages','error');
  });
}
function closeChat(){
  document.getElementById('chatPanel').classList.remove('open');
  unsubscribeGroupChat();
  S.activeGroup=null;
}
function renderChatMsgs(g){
  const c=document.getElementById('chatMessages');
  if(g.messages.length===0){
    c.innerHTML=`<div class="empty-state" style="padding:36px 12px"><div class="empty-icon">💬</div><h3 style="font-size:1rem">No messages yet</h3><p>Say hello to the group!</p></div>`;
    return;
  }
  c.innerHTML=g.messages.map(m=>`
    <div class="chat-msg ${m.mine?'mine':''}">
      <div class="msg-av" style="background:${m.color}">${m.from[0]}</div>
      <div>
        ${!m.mine?`<div style="font-size:.72rem;color:var(--ink3);margin-bottom:3px">${m.from}</div>`:''}
        <div class="msg-bubble">${m.text}</div>
        <div class="msg-time">${m.time}</div>
      </div>
    </div>`).join('');
  c.scrollTop=c.scrollHeight;
}
async function sendChat(){
  const inp=document.getElementById('chatInput');
  const text=inp.value.trim();
  if(!text||!S.activeGroup) return;
  const g=S.groups.find(g=>g.id===S.activeGroup);
  if(!g.joined){ showToast('Join the group to send messages','error'); return; }
  inp.value='';
  try{
    const row=await window.db.sendMessageRow(g.id,text);
    // realtime may already have appended it — avoid duplicates
    if(!g.messages.some(m=>m.id===row.id)){
      g.messages.push(window.db.messageToView(row));
      renderChatMsgs(g);
    }
  }catch(err){
    console.error('sendChat failed', err);
    inp.value=text;
    showToast('Message not sent. Try again.','error');
  }
}

// Expose on window for inline event handlers and cross-module access
Object.assign(window, { openChat, closeChat, renderChatMsgs, sendChat });
