/* ── Submit question ── */
function openAskModal(){
  populateSelect('qCat');
  openModal('askModal');
}

function submitQuestion(){
  const title = document.getElementById('qTitle').value.trim();
  const body  = document.getElementById('qBody').value.trim();
  const cat   = document.getElementById('qCat').value;
  if(!title){ showToast('Please enter a question title','error'); return; }
  const id = 'q'+Date.now();
  S.questions.unshift({id, title, body, cat, author:'You', votes:0, answers:[], time:'Just now', solved:false});
  document.getElementById('qTitle').value='';
  document.getElementById('qBody').value='';
  document.getElementById('qTitleCount').textContent='0/150';
  document.getElementById('qBodyCount').textContent='0/800';
  closeModal('askModal');
  renderQAFilters(); filterQA(); updateQAStats();
  showToast('Question posted! 🎉','success');
}

/* ── Submit answer ── */
function submitAnswer(){
  const text = document.getElementById('answerInput').value.trim();
  if(!text){ showToast('Please write an answer first','error'); return; }
  const q=S.questions.find(q=>q.id===S.activeQId);
  q.answers.push({id:'a'+Date.now(), text, author:'You', votes:0, best:false});
  document.getElementById('answerInput').value='';
  document.getElementById('ansCharCount').textContent='0/1000';
  renderQuestionDetail(q);
  updateQAStats();
  showToast('Answer posted! 🙌','success');
}

// Expose on window for inline event handlers and cross-module access
Object.assign(window, { openAskModal, submitQuestion, submitAnswer });
