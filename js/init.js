/* ── INIT ──────────────────────────────────────────── */
import { getProfile } from './lib/auth.js';

async function initApp() {
  const user = await window.authReady;
  if (!user) return; // requireAuth is redirecting to auth.html

  // set initial display — all pages hidden except discover
  document.querySelectorAll('.page').forEach(p=>{
    p.style.display = p.id==='page-discover' ? 'block' : 'none';
    if(p.id==='page-discover') p.classList.add('active');
  });
  renderUserAvatar();
  renderCatGrid();
  renderQuote();
  populateAllSelects();
  buildEmojiPicker('emojiPick','selEmoji');
  buildEmojiPicker('gEmojiPick','gEmoji');
  buildColorPicker();
  setInterval(renderQuote, 6000);
  checkInviteHash();
  document.body.classList.add('auth-ready');
}

function renderUserAvatar() {
  const profile = getProfile();
  const av = document.getElementById('userAvatar');
  if (!av || !profile) return;
  av.textContent = (profile.display_name || 'L').charAt(0).toUpperCase();
  av.style.background = profile.avatar_color || 'var(--accent)';
  av.title = profile.display_name;
}

if (document.readyState === 'complete') initApp();
else window.addEventListener('load', initApp);
