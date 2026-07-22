/* ── DARK MODE ───────────────────────────────────────── */
function toggleDark(){
  const dark=document.documentElement.getAttribute('data-theme')==='dark';
  document.documentElement.setAttribute('data-theme',dark?'light':'dark');
  const t=document.getElementById('darkToggle');
  t.classList.toggle('on',!dark);
  t.querySelector('.dark-toggle-knob').textContent=dark?'☀️':'🌙';
}

// Expose on window for inline event handlers and cross-module access
Object.assign(window, { toggleDark });
