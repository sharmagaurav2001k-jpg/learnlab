/* ══ SUPPORT SYSTEM ══════════════════════════════════ */

const SP_CATS = [
  {id:'course',   name:'Course Help',        icon:'📚', color:'#7c3aed', cc:'#ede9fe'},
  {id:'roadmap',  name:'Roadmap Guidance',   icon:'🗺️', color:'#0369a1', cc:'#e0f2fe'},
  {id:'technical',name:'Technical Issue',    icon:'🔧', color:'#dc2626', cc:'#fee2e2'},
  {id:'account',  name:'Profile / Account',  icon:'👤', color:'#d97706', cc:'#fff8e6'},
  {id:'billing',  name:'Billing / Payment',  icon:'💳', color:'#16a34a', cc:'#dcfce7'},
  {id:'other',    name:'Other Query',         icon:'💬', color:'#9333ea', cc:'#f3e8ff'},
];

let spPriority = 'low';
let spActiveCat = null;
let spTickets = [];   // loaded from Supabase

function initSupportPage(){
  renderSpCatGrid();
  renderMyTickets();
  updateSpTicketCount();
  // pre-fill from the signed-in account
  const profile = getProfile();
  const user = getUser();
  if(profile && !document.getElementById('spName').value){
    document.getElementById('spName').value = profile.display_name;
  }
  if(user && !document.getElementById('spEmail').value){
    document.getElementById('spEmail').value = user.email || '';
  }
  const el = document.getElementById('liveStatus');
  if(el){ el.innerHTML = '● Online now'; el.style.color = '#059669'; }
  // refresh tickets from the server
  window.db.loadTickets().then(tickets=>{
    spTickets = tickets;
    renderMyTickets(); updateSpTicketCount();
  }).catch(err=>console.error('loadTickets failed', err));
}

function renderSpCatGrid(){
  const grid = document.getElementById('spCatGrid');
  if(!grid) return;
  grid.innerHTML = SP_CATS.map(c=>`
    <div class="sp-cat-card ${spActiveCat===c.id?'selected':''}" style="--cc:${c.color}"
      onclick="selectSpCat('${c.id}')">
      <div class="sp-cat-icon">${c.icon}</div>
      <div class="sp-cat-name">${c.name}</div>
    </div>`).join('');
}

function selectSpCat(id){
  spActiveCat = spActiveCat===id ? null : id;
  renderSpCatGrid();
  // auto-fill the dropdown
  const sel = document.getElementById('spCategory');
  if(sel && spActiveCat) sel.value = spActiveCat;
  // smooth scroll to form
  if(spActiveCat) document.getElementById('spFormCard').scrollIntoView({behavior:'smooth',block:'start'});
}

function spSetPriority(val, el){
  spPriority = val;
  document.querySelectorAll('.sp-priority-opt').forEach(o=>o.classList.remove('sel'));
  el.classList.add('sel');
}

function spClearErr(fieldId){
  const el = document.getElementById(fieldId);
  if(el) el.classList.remove('err');
  const err = document.getElementById(fieldId+'Err');
  if(err) err.classList.remove('show');
}

function spValidate(){
  let valid = true;
  const fields = [
    {id:'spName',     check: v=>v.trim().length>=2,       errId:'spNameErr'},
    {id:'spEmail',    check: v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), errId:'spEmailErr'},
    {id:'spCategory', check: v=>v!=='',                    errId:'spCategoryErr'},
    {id:'spMessage',  check: v=>v.trim().length>=20,       errId:'spMessageErr'},
  ];
  fields.forEach(f=>{
    const el = document.getElementById(f.id);
    if(!f.check(el.value)){
      el.classList.add('err');
      document.getElementById(f.errId).classList.add('show');
      valid = false;
    }
  });
  if(!valid) document.getElementById('spFormCard').scrollIntoView({behavior:'smooth'});
  return valid;
}

async function submitSupportTicket(){
  if(!spValidate()) return;

  const btn = document.getElementById('spSubmitBtn');
  btn.disabled = true;
  btn.textContent = '⏳ Submitting…';

  const ticket = {
    name:     document.getElementById('spName').value.trim(),
    email:    document.getElementById('spEmail').value.trim(),
    course:   document.getElementById('spCourse').value.trim() || 'Not specified',
    category: document.getElementById('spCategory').value,
    priority: spPriority,
    message:  document.getElementById('spMessage').value.trim(),
  };

  let ticketRef;
  try{
    ticketRef = await window.db.insertTicket(ticket);
  }catch(err){
    console.error('insertTicket failed', err);
    btn.disabled = false;
    btn.textContent = '🚀 Submit Support Request';
    showToast('Could not submit ticket. Try again.','error');
    return;
  }

  spTickets.unshift({...ticket, id:ticketRef, status:'open', created:new Date().toLocaleString()});

  btn.disabled = false;
  btn.textContent = '🚀 Submit Support Request';

  // show success
  document.getElementById('spFormCard').style.display = 'none';
  const succ = document.getElementById('spSuccess');
  succ.classList.add('show');
  document.getElementById('spTicketIdDisplay').textContent = ticketRef;

  // reset form
  ['spName','spEmail','spCourse','spMessage'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.value='';
  });
  document.getElementById('spCategory').value = '';
  document.getElementById('spMsgCount').textContent = '0/1200';
  spActiveCat = null; spPriority = 'low';

  renderMyTickets(); updateSpTicketCount();
  showToast('Support ticket submitted! 🎉','success');
}

function spSubmitAnother(){
  document.getElementById('spFormCard').style.display = 'block';
  document.getElementById('spSuccess').classList.remove('show');
  const profile = getProfile();
  if(profile) document.getElementById('spName').value = profile.display_name;
  const user = getUser();
  if(user) document.getElementById('spEmail').value = user.email || '';
  renderSpCatGrid();
}

function spGetTickets(){
  return spTickets;
}

function renderMyTickets(){
  const list = document.getElementById('spTicketList');
  const tickets = spGetTickets();
  if(!list) return;
  if(tickets.length===0){
    list.innerHTML=`<div class="empty-state" style="padding:36px 0"><div class="empty-icon">🎫</div><h3 style="font-size:1.1rem">No tickets yet</h3><p>Submit your first support request above!</p></div>`;
    return;
  }
  const catMap = {course:'📚',roadmap:'🗺️',technical:'🔧',account:'👤',billing:'💳',other:'💬'};
  const priColor = {low:'#059669',medium:'#d97706',high:'#dc2626'};
  list.innerHTML = tickets.map((t,i)=>{
    const status = t.status || 'open';
    const stCls  = {open:'ts-open',progress:'ts-progress',resolved:'ts-resolved'}[status];
    const stLbl  = {open:'🟡 Open',progress:'🔵 In Progress',resolved:'✅ Resolved'}[status];
    const cat = SP_CATS.find(c=>c.id===t.category)||SP_CATS[5];
    return `<div class="ticket-item">
      <div class="ticket-icon" style="background:${cat.cc};color:${cat.color}">${catMap[t.category]||'💬'}</div>
      <div class="ticket-info">
        <div class="ticket-title">${t.course!=='Not specified'?t.course+' — ':''}${cat.name}</div>
        <div class="ticket-meta">${t.id} · ${t.created} · Priority: <span style="color:${priColor[t.priority]||'#059669'};font-weight:600">${t.priority}</span></div>
      </div>
      <span class="ticket-status ${stCls}">${stLbl}</span>
    </div>`;
  }).join('');
}

function updateSpTicketCount(){
  const el = document.getElementById('spTicketCount');
  if(!el) return;
  const base = 1247;
  el.textContent = (base + spGetTickets().length).toLocaleString();
}

function spContact(type){
  const msgs = {
    email:     ()=>{ window.location.href = 'mailto:pokerlover2001k@gmail.com?subject=LearnLab%20Support%20Request&body=Hi%2C%20I%20need%20help%20with%20LearnLab.'; showToast('Opening email client…',''); },
    whatsapp:  ()=>{ window.open('https://wa.me/919000000000?text=Hi%2C%20I%20need%20help%20with%20LearnLab','_blank'); showToast('Opening WhatsApp…',''); },
    community: ()=>{ showPage('qa'); showToast('Redirecting to Q&A Community…',''); },
    live:      ()=>{ showToast('Live chat agent connecting… ⚡','success'); },
  };
  if(msgs[type]) msgs[type]();
}

function openSupportWithContext(){
  // pre-fill course field from active category
  showPage('support');
  setTimeout(()=>{
    if(S.activeCat){
      const cat = getCat(S.activeCat);
      const inp = document.getElementById('spCourse');
      if(inp && !inp.value) inp.value = cat.name;
      // auto-select Course Help category
      const sel = document.getElementById('spCategory');
      if(sel) sel.value = 'course';
      spActiveCat = 'course';
      renderSpCatGrid();
    }
    document.getElementById('spFormCard').scrollIntoView({behavior:'smooth'});
  }, 300);
}

// Expose on window for inline event handlers and cross-module access
Object.assign(window, { SP_CATS, spPriority, spActiveCat, initSupportPage, renderSpCatGrid, selectSpCat, spSetPriority, spClearErr, spValidate, submitSupportTicket, spSubmitAnother, spGetTickets, renderMyTickets, updateSpTicketCount, spContact, openSupportWithContext });
