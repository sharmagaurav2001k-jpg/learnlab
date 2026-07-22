/* ── INIT ──────────────────────────────────────────── */
import { getProfile } from './lib/auth.js';
import { loadAllData } from './lib/db.js';

async function initApp() {
  const user = await window.authReady;
  if (!user) return; // requireAuth is redirecting to auth.html

  // set initial display — all pages hidden except discover
  document.querySelectorAll('.page').forEach(p=>{
    p.style.display = p.id==='page-discover' ? 'block' : 'none';
    if(p.id==='page-discover') p.classList.add('active');
  });
  renderUserAvatar();
  renderQuote();
  populateAllSelects();
  buildEmojiPicker('emojiPick','selEmoji');
  buildEmojiPicker('gEmojiPick','gEmoji');
  buildColorPicker();
  setInterval(renderQuote, 6000);
  document.body.classList.add('auth-ready');

  // load server data, then render data-driven sections
  try {
    await loadAllData();
  } catch (err) {
    console.error('Failed to load data', err);
    showToast('Could not load your data. Please refresh.', 'error');
  }
  renderCatGrid();
  renderMyLearning();
  renderGroups();
  checkInviteHash();
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
