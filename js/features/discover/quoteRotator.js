/* ── QUOTE ─────────────────────────────────────────── */
function renderQuote(){
  const el = document.getElementById('quoteBar');
  el.style.opacity=0;
  setTimeout(()=>{ el.textContent=QUOTES[Math.floor(Math.random()*QUOTES.length)]; el.style.opacity=1; },400);
}

// Expose on window for inline event handlers and cross-module access
Object.assign(window, { renderQuote });
