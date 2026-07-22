/* ── Submit question (persisted to Supabase) ── */
function openAskModal(){
  populateSelect('qCat');
  openModal('askModal');
}

async function submitQuestion(){
  const title = document.getElementById('qTitle').value.trim();
  const body  = document.getElementById('qBody').value.trim();
  const cat   = document.getElementById('qCat').value;
  if(!title){ showToast('Please enter a question title','error'); return; }
  if(title.length<3){ showToast('Title must be at least 3 characters','error'); return; }
  let row;
  try{
    row = await window.db.insertQuestion({title, body, cat});
  }catch(err){
    console.error('submitQuestion failed', err);
    showToast('Could not post question. Try again.','error');
    return;
  }
  const me = getProfile();
  S.questions.unshift({id:row.id, title, body, cat, author:me.display_name,
    authorId:row.user_id, votes:0, _myVote:0, answers:[], time:'Just now', solved:false});
  document.getElementById('qTitle').value='';
  document.getElementById('qBody').value='';
  document.getElementById('qTitleCount').textContent='0/150';
  document.getElementById('qBodyCount').textContent='0/800';
  closeModal('askModal');
  renderQAFilters(); filterQA(); updateQAStats();
  showToast('Question posted! 🎉','success');
}

/* ── Submit answer (persisted to Supabase) ── */
async function submitAnswer(){
  const text = document.getElementById('answerInput').value.trim();
  if(!text){ showToast('Please write an answer first','error'); return; }
  const q=S.questions.find(q=>q.id===S.activeQId);
  let row;
  try{
    row = await window.db.insertAnswer(q.id, text);
  }catch(err){
    console.error('submitAnswer failed', err);
    showToast('Could not post answer. Try again.','error');
    return;
  }
  const me = getProfile();
  q.answers.push({id:row.id, text, author:me.display_name, authorId:row.user_id,
    votes:0, _myVote:0, best:false});
  document.getElementById('answerInput').value='';
  document.getElementById('ansCharCount').textContent='0/1000';
  renderQuestionDetail(q);
  updateQAStats();
  showToast('Answer posted! 🙌','success');
}

// Expose on window for inline event handlers and cross-module access
Object.assign(window, { openAskModal, submitQuestion, submitAnswer });
