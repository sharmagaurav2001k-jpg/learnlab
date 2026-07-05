// Account dropdown in the navbar
import { getProfile, getUser } from '../../lib/auth.js';

function toggleUserMenu() {
  const menu = document.getElementById('userMenu');
  const open = menu.classList.toggle('open');
  if (open) {
    const profile = getProfile();
    const user = getUser();
    document.getElementById('userMenuName').textContent = profile?.display_name || 'Learner';
    document.getElementById('userMenuEmail').textContent = user?.email || '';
  }
}

// close when clicking outside
document.addEventListener('click', (e) => {
  const wrap = e.target.closest('.user-menu-wrap');
  if (!wrap) document.getElementById('userMenu')?.classList.remove('open');
});

Object.assign(window, { toggleUserMenu });
