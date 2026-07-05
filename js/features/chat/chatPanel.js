function openChat(id){
  S.activeGroup=id;
  const g=S.groups.find(g=>g.id===id);
  document.getElementById('chatGName').textContent=g.emoji+' '+g.name;
  document.getElementById('chatGSub').textContent=g.members.length+' members';
  renderChatMsgs(g);
  document.getElementById('chatPanel').classList.add('open');
}
function closeChat(){document.getElementById('chatPanel').classList.remove('open')}
function renderChatMsgs(g){
  const c=document.getElementById('chatMessages');
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
function sendChat(){
  const inp=document.getElementById('chatInput');
  const text=inp.value.trim();
  if(!text||!S.activeGroup) return;
  const g=S.groups.find(g=>g.id===S.activeGroup);
  const now=new Date();
  g.messages.push({from:'You',color:'#7c5cbf',text,time:now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),mine:true});
  inp.value=''; renderChatMsgs(g);
}

// Expose on window for inline event handlers and cross-module access
Object.assign(window, { openChat, closeChat, renderChatMsgs, sendChat });
