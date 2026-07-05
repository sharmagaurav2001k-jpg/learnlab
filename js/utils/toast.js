function showToast(msg,type){
  const c=document.getElementById('toastCont');
  const t=document.createElement('div');
  t.className='toast '+(type||'');t.textContent=msg;c.appendChild(t);
  setTimeout(()=>{t.style.opacity='0';t.style.transform='translateY(10px)';setTimeout(()=>t.remove(),400)},2600);
}

// Expose on window for inline event handlers and cross-module access
Object.assign(window, { showToast });
