// Auth helpers — session gate, profile loading, sign out.
import { supabase } from './supabaseClient.js';

let currentUser = null;
let currentProfile = null;

export function getUser() { return currentUser; }
export function getProfile() { return currentProfile; }

// Redirects to auth.html when there is no active session.
// Returns the user when authenticated.
export async function requireAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.replace('auth.html');
    return null;
  }
  currentUser = session.user;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', currentUser.id)
    .single();
  currentProfile = profile || {
    id: currentUser.id,
    display_name: (currentUser.email || 'Learner').split('@')[0],
    avatar_color: '#7c5cbf',
  };

  // keep the gate active if the user signs out in another tab
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') window.location.replace('auth.html');
  });

  return currentUser;
}

export async function signOut() {
  await supabase.auth.signOut();
  window.location.replace('auth.html');
}

Object.assign(window, { signOut, getProfile, getUser });
