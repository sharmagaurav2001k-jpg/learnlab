/* ══ Q&A FUNCTIONS ══════════════════════════════════ */

function updateQAStats(){
  const qs = S.questions;
  document.getElementById('qStatTotal').textContent   = qs.length;
  document.getElementById('qStatAnswered').textContent = qs.filter(q=>q.answers.length>0).length;
  document.getElementById('qStatAnswers').textContent  = qs.reduce((s,q)=>s+q.answers.length,0);
}

/* category filter pills for Q&A */
function renderQAFilters(){
  const wrap = document.getElementById('qaFilters');
  const cats  = ['all', ...new Set(S.questions.map(q=>q.cat))];
  wrap.innerHTML = cats.map(c=>{
    const label = c==='all' ? 'All Categories' : getCat(c).emoji+' '+getCat(c).name;
    return `<button class="filter-pill ${S.qaFilter===c?'active':''}" onclick="setQAFilter('${c}',this)">${label}</button>`;
  }).join('');
}

function setQAFilter(val,btn){
  S.qaFilter=val;
  document.querySelectorAll('#qaFilters .filter-pill').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  filterQA();
}

function filterQA(){
  const search = (document.getElementById('qaSearch')||{value:''}).value.trim().toLowerCase();
  const sort   = (document.getElementById('qaSort')||{value:'newest'}).value;
  let qs = [...S.questions];

  if(S.qaFilter!=='all') qs = qs.filter(q=>q.cat===S.qaFilter);
  if(search) qs = qs.filter(q=>q.title.toLowerCase().includes(search)||q.body.toLowerCase().includes(search));

  if(sort==='votes')      qs.sort((a,b)=>b.votes-a.votes);
  else if(sort==='unanswered') qs = qs.filter(q=>q.answers.length===0);
  else if(sort==='answered')   qs = qs.filter(q=>q.answers.length>0);
  // newest = default order (most recently added last in array = show first)
  else qs.reverse();

  renderQAList(qs);
  updateQAStats();
}

function renderQAList(qs){
  const list = document.getElementById('qaList');
  if(qs.length===0){
    list.innerHTML=`<div class="empty-state"><div class="empty-icon">🔍</div><h3>No questions found</h3><p>Try a different filter or <button onclick="openAskModal()" style="color:var(--accent);font-weight:600;cursor:pointer">ask the first question!</button></p></div>`;
    return;
  }
  list.innerHTML = qs.map((q,i)=>{
    const cat = getCat(q.cat);
    const hasAns = q.answers.length>0;
    return `<div class="q-card" style="animation-delay:${i*.04}s">
      <div class="q-card-main" onclick="openQuestion('${q.id}')">
        <div class="q-vote" onclick="event.stopPropagation()">
          <button class="vote-up ${q._myVote===1?'voted':''}" onclick="voteQ('${q.id}',1)">▲</button>
          <span class="vote-count">${q.votes}</span>
          <button class="vote-dn ${q._myVote===-1?'voted':''}" onclick="voteQ('${q.id}',-1)">▼</button>
        </div>
        <div class="q-body">
          <div class="q-title">${q.title}</div>
          <div class="q-excerpt">${q.body||'No description provided.'}</div>
          <div class="q-meta">
            <span class="q-tag ${cat.tag}">${cat.emoji} ${cat.name}</span>
            <span class="q-author">
              <span class="q-author-av" style="background:${rColor(q.author)}">${q.author[0]}</span>
              ${q.author}
            </span>
            <span class="q-time">🕐 ${q.time}</span>
          </div>
        </div>
        <div class="q-ans-badge">
          <div class="q-ans-num ${hasAns?'has-ans':''}">${q.answers.length}</div>
          <div class="q-ans-lbl ${hasAns?'has-ans':''}">${hasAns?'answer'+(q.answers.length>1?'s':''):'No answers'}</div>
          ${q.solved?'<div class="q-solved-tick" title="Has best answer">✅</div>':''}
        </div>
      </div>
    </div>`;
  }).join('');
}

function voteQ(id, dir){
  const q = S.questions.find(q=>q.id===id);
  if(q._myVote===dir){ q.votes-=dir; q._myVote=0; }
  else { q.votes += q._myVote?dir*2:dir; q._myVote=dir; }
  filterQA();
  window.db.setQuestionVote(id, q._myVote).catch(err=>{
    console.error('voteQ failed', err);
    showToast('Could not save vote','error');
  });
}

// Expose on window for inline event handlers and cross-module access
Object.assign(window, { updateQAStats, renderQAFilters, setQAFilter, filterQA, renderQAList, voteQ });
