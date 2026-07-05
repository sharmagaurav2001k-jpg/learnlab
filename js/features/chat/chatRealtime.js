/* ── REALTIME CHAT (Supabase Realtime) ──────────────── */
// Subscribes to new group_messages for the group whose chat is open.
import { supabase } from '../../lib/supabaseClient.js';

let channel = null;

function subscribeToGroupChat(groupId) {
  unsubscribeGroupChat();
  channel = supabase
    .channel('group-chat-' + groupId)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'group_messages',
      filter: `group_id=eq.${groupId}`,
    }, async (payload) => {
      const g = S.groups.find((g) => g.id === groupId);
      if (!g) return;
      const m = payload.new;
      if (g.messages.some((msg) => msg.id === m.id)) return; // already shown
      await window.db.fetchProfiles([m.user_id]); // ensure sender name/color
      if (g.messages.some((msg) => msg.id === m.id)) return; // re-check after await
      g.messages.push(window.db.messageToView(m));
      if (S.activeGroup === groupId) renderChatMsgs(g);
    })
    .subscribe();
}

function unsubscribeGroupChat() {
  if (channel) {
    supabase.removeChannel(channel);
    channel = null;
  }
}

Object.assign(window, { subscribeToGroupChat, unsubscribeGroupChat });
