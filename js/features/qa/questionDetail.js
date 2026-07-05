/* ── Open a question detail ── */
function openQuestion(id){
  S.activeQId = id;
  const q = S.questions.find(q=>q.id===id);
  document.getElementById('qa-list-view').style.display   = 'none';
  document.getElementById('qa-detail-view').style.display = 'block';
  renderQuestionDetail(q);
  document.getElementById('answerInput').value='';
  document.getElementById('ansCharCount').textContent='0/1000';
  window.scrollTo({top:0,behavior:'smooth'});
}

function closeQuestionDetail(){
  S.activeQId=null;
  document.getElementById('qa-list-view').style.display   = 'block';
  document.getElementById('qa-detail-view').style.display = 'none';
  filterQA();
}

function renderQuestionDetail(q){
  const cat = getCat(q.cat);
  // render question card
  document.getElementById('qdQuestion').innerHTML=`
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px;flex-wrap:wrap">
      <span class="q-tag ${cat.tag}" style="font-size:.8rem">${cat.emoji} ${cat.name}</span>
      ${q.solved?'<span style="background:#ecfdf5;color:#059669;padding:4px 12px;border-radius:50px;font-size:.75rem;font-weight:700;border:1px solid #6ee7b7">✅ Solved</span>':''}
    </div>
    <div class="qd-title">${q.title}</div>
    <div class="qd-body">${q.body||'No further details provided.'}</div>
    <div class="qd-meta">
      <div class="qd-vote-row">
        <button class="vote-up ${q._myVote===1?'voted':''}" onclick="voteQD('${q.id}',1)" style="width:34px;height:34px">▲</button>
        <span class="vote-count" id="qdVoteCount" style="font-size:1.2rem;font-weight:700;min-width:28px;text-align:center">${q.votes}</span>
        <button class="vote-dn ${q._myVote===-1?'voted':''}" onclick="voteQD('${q.id}',-1)" style="width:34px;height:34px">▼</button>
      </div>
      <span class="q-author">
        <span class="q-author-av" style="background:${rColor(q.author)};width:24px;height:24px">${q.author[0]}</span>
        Asked by <strong>${q.author}</strong>
      </span>
      <span class="q-time">🕐 ${q.time}</span>
    </div>`;

  // render answers
  const ansSect = document.getElementById('qdAnswers');
  if(q.answers.length===0){
    ansSect.innerHTML=`<div class="ans-section-title">💬 Answers <span>(0)</span></div>
      <div class="empty-state" style="padding:36px 0"><div class="empty-icon">💭</div><h3>No answers yet</h3><p>Be the first to help ${q.author}!</p></div>`;
    return;
  }
  const sorted = [...q.answers].sort((a,b)=>(b.best?1:0)-(a.best?1:0)||(b.votes-a.votes));
  ansSect.innerHTML=`<div class="ans-section-title">💬 Answers <span>(${q.answers.length})</span></div>`
    + sorted.map((a,i)=>`
    <div class="ans-card ${a.best?'best':''}" style="animation-delay:${i*.05}s" id="anscard-${a.id}">
      ${a.best?'<div class="best-badge">✅ Best Answer</div>':''}
      <div class="ans-top">
        <div class="ans-vote">
          <button class="vote-up ${a._myVote===1?'voted':''}" onclick="voteA('${q.id}','${a.id}',1)" style="width:28px;height:28px;font-size:.75rem">▲</button>
          <span class="ans-vote-count" id="av-${a.id}">${a.votes}</span>
          <button class="vote-dn ${a._myVote===-1?'voted':''}" onclick="voteA('${q.id}','${a.id}',-1)" style="width:28px;height:28px;font-size:.75rem">▼</button>
        </div>
        <div class="ans-body-col">
          <div class="ans-text">${a.text}</div>
          <div class="ans-footer">
            <div class="ans-meta">
              <span class="ans-author-av" style="background:${rColor(a.author)}">${a.author[0]}</span>
              <strong>${a.author}</strong>
            </div>
            ${!a.best?`<button class="mark-best-btn" onclick="markBest('${q.id}','${a.id}')">☑ Mark as Best</button>`:''}
          </div>
        </div>
      </div>
    </div>`).join('');
}

function voteQD(qid, dir){
  const q=S.questions.find(q=>q.id===qid);
  if(q._myVote===dir){q.votes-=dir;q._myVote=0;}
  else{q.votes+=q._myVote?dir*2:dir;q._myVote=dir;}
  document.getElementById('qdVoteCount').textContent=q.votes;
  // update vote buttons
  q._myVote===1
    ? (document.querySelectorAll(`#qdQuestion .vote-up`)[0].classList.add('voted'), document.querySelectorAll(`#qdQuestion .vote-dn`)[0].classList.remove('voted'))
    : q._myVote===-1
      ? (document.querySelectorAll(`#qdQuestion .vote-up`)[0].classList.remove('voted'), document.querySelectorAll(`#qdQuestion .vote-dn`)[0].classList.add('voted'))
      : (document.querySelectorAll(`#qdQuestion .vote-up`)[0].classList.remove('voted'), document.querySelectorAll(`#qdQuestion .vote-dn`)[0].classList.remove('voted'));
}

function voteA(qid,aid,dir){
  const q=S.questions.find(q=>q.id===qid);
  const a=q.answers.find(a=>a.id===aid);
  if(a._myVote===dir){a.votes-=dir;a._myVote=0;}
  else{a.votes+=a._myVote?dir*2:dir;a._myVote=dir;}
  document.getElementById('av-'+aid).textContent=a.votes;
}

function markBest(qid,aid){
  const q=S.questions.find(q=>q.id===qid);
  q.answers.forEach(a=>a.best=false);
  const a=q.answers.find(a=>a.id===aid);
  a.best=true; q.solved=true;
  renderQuestionDetail(q);
  showToast('Marked as best answer ✅','success');
}

// Expose on window for inline event handlers and cross-module access
Object.assign(window, { openQuestion, closeQuestionDetail, renderQuestionDetail, voteQD, voteA, markBest });
