// auth.html logic — login, signup, email-confirmation notice
import { supabase } from './lib/supabaseClient.js';

// Already signed in? Go straight to the app.
const { data: { session } } = await supabase.auth.getSession();
if (session) window.location.replace('index.html');

const views = ['login', 'signup', 'confirm'];
function switchView(name) {
  views.forEach((v) => {
    document.getElementById(v + 'View').style.display = v === name ? 'block' : 'none';
  });
}
window.switchView = switchView;

function showError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.add('show');
}
function clearError(id) {
  document.getElementById(id).classList.remove('show');
}

// ── LOGIN ────────────────────────────────────────────
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearError('loginError');
  const btn = document.getElementById('loginBtn');
  btn.disabled = true; btn.textContent = 'Signing in…';

  const { error } = await supabase.auth.signInWithPassword({
    email: document.getElementById('loginEmail').value.trim(),
    password: document.getElementById('loginPassword').value,
  });

  btn.disabled = false; btn.textContent = 'Sign In';
  if (error) {
    showError('loginError', error.message === 'Invalid login credentials'
      ? 'Incorrect email or password. If you just signed up, confirm your email first.'
      : error.message);
    return;
  }
  window.location.replace('index.html');
});

// ── SIGN UP ──────────────────────────────────────────
document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearError('signupError');
  const btn = document.getElementById('signupBtn');
  btn.disabled = true; btn.textContent = 'Creating account…';

  const email = document.getElementById('signupEmail').value.trim();
  const { data, error } = await supabase.auth.signUp({
    email,
    password: document.getElementById('signupPassword').value,
    options: {
      emailRedirectTo: `${window.location.origin}/index.html`,
      data: { display_name: document.getElementById('signupName').value.trim() },
    },
  });

  btn.disabled = false; btn.textContent = 'Create Account';
  if (error) { showError('signupError', error.message); return; }

  if (data.session) {
    // email confirmation disabled — signed in immediately
    window.location.replace('index.html');
  } else {
    document.getElementById('confirmMsg').textContent =
      `We sent a confirmation link to ${email}. Click it, then come back and sign in.`;
    switchView('confirm');
  }
});
