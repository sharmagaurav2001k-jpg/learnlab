// Data layer — all Supabase reads/writes for LearnLab.
// Loads server data into the global S state, and persists mutations.
import { supabase } from './supabaseClient.js';
import { getUser, getProfile } from './auth.js';

/* ── helpers ─────────────────────────────────────────── */
export function timeAgo(iso) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'Just now';
  const m = Math.floor(s / 60); if (m < 60) return m + 'm ago';
  const h = Math.floor(m / 60); if (h < 24) return h + 'h ago';
  const d = Math.floor(h / 24); if (d < 7) return d + 'd ago';
  return new Date(iso).toLocaleDateString();
}

function msgTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// profile lookup cache (id → {display_name, avatar_color})
const profileCache = new Map();
export async function fetchProfiles(ids) {
  const missing = [...new Set(ids)].filter((id) => id && !profileCache.has(id));
  if (missing.length) {
    const { data } = await supabase.from('profiles')
      .select('id, display_name, avatar_color').in('id', missing);
    (data || []).forEach((p) => profileCache.set(p.id, p));
  }
  return profileCache;
}
export function profileOf(id) {
  return profileCache.get(id) || { display_name: 'Learner', avatar_color: '#7c5cbf' };
}

/* ── TOPICS ──────────────────────────────────────────── */
// Merge the static catalog with the user's rows. Rows with catalog_id
// overlay a built-in topic; rows without are custom topics.
export async function loadTopics() {
  const user = getUser();
  const { data: rows, error } = await supabase.from('topics')
    .select('*').eq('user_id', user.id).order('created_at');
  if (error) throw error;

  const topics = TOPICS.map((t) => ({ ...t, dbId: null }));
  const myTopics = [];
  for (const r of rows || []) {
    if (r.catalog_id) {
      const t = topics.find((t) => t.id === r.catalog_id);
      if (t) {
        Object.assign(t, {
          dbId: r.id, name: r.name, desc: r.description,
          cat: r.category_id, emoji: r.emoji, status: r.status,
        });
        if (r.is_saved) myTopics.push(t.id);
      }
    } else {
      topics.push({
        id: r.id, dbId: r.id, name: r.name, desc: r.description,
        cat: r.category_id, emoji: r.emoji, status: r.status, custom: true,
      });
      if (r.is_saved) myTopics.push(r.id);
    }
  }
  S.topics = topics;
  S.myTopics = myTopics;
}

// Ensure a DB row exists for a topic (creates overlay rows for catalog topics).
export async function ensureTopicRow(t) {
  if (t.dbId) return t.dbId;
  const user = getUser();
  const { data, error } = await supabase.from('topics').insert({
    user_id: user.id,
    catalog_id: t.custom ? null : t.id,
    name: t.name, description: t.desc || '', emoji: t.emoji,
    category_id: t.cat, status: t.status,
    is_saved: S.myTopics.includes(t.id),
  }).select('id').single();
  if (error) throw error;
  t.dbId = data.id;
  return data.id;
}

export async function saveTopic(t) {
  await ensureTopicRow(t);
  const { error } = await supabase.from('topics').update({
    name: t.name, description: t.desc || '', emoji: t.emoji,
    category_id: t.cat, status: t.status,
    is_saved: S.myTopics.includes(t.id),
  }).eq('id', t.dbId);
  if (error) throw error;
}

export async function insertCustomTopic({ name, desc, cat, status, emoji }) {
  const user = getUser();
  const { data, error } = await supabase.from('topics').insert({
    user_id: user.id, catalog_id: null,
    name, description: desc, emoji, category_id: cat, status, is_saved: false,
  }).select('id').single();
  if (error) throw error;
  return data.id;
}

export async function deleteTopicRow(t) {
  if (!t.dbId) return;
  const { error } = await supabase.from('topics').delete().eq('id', t.dbId);
  if (error) throw error;
}

/* ── GROUPS ──────────────────────────────────────────── */
export async function loadGroups() {
  const user = getUser();
  const [{ data: groups, error: gErr }, { data: members, error: mErr }] = await Promise.all([
    supabase.from('groups').select('*').order('created_at'),
    supabase.from('group_members').select('group_id, user_id'),
  ]);
  if (gErr) throw gErr;
  if (mErr) throw mErr;

  await fetchProfiles((members || []).map((m) => m.user_id));

  S.groups = (groups || []).map((g) => {
    const mems = (members || []).filter((m) => m.group_id === g.id);
    return {
      id: g.id, name: g.name, emoji: g.emoji, desc: g.description,
      cat: g.category_id, color: g.color, ownerId: g.owner_id,
      members: mems.map((m) => {
        const p = profileOf(m.user_id);
        return (p.display_name || 'L').charAt(0).toUpperCase();
      }),
      memberIds: mems.map((m) => m.user_id),
      joined: mems.some((m) => m.user_id === user.id),
      invites: [], messages: [], messagesLoaded: false,
    };
  });
}

export async function createGroupRow({ name, desc, cat, emoji, color }) {
  const user = getUser();
  const { data, error } = await supabase.from('groups').insert({
    owner_id: user.id, name, description: desc,
    category_id: cat, emoji, color,
  }).select('*').single();
  if (error) throw error;
  const { error: mErr } = await supabase.from('group_members')
    .insert({ group_id: data.id, user_id: user.id, role: 'owner' });
  if (mErr) throw mErr;
  return data;
}

export async function joinGroupRow(groupId) {
  const user = getUser();
  const { error } = await supabase.from('group_members')
    .insert({ group_id: groupId, user_id: user.id });
  if (error && error.code !== '23505') throw error; // ignore already-member
}

export async function leaveGroupRow(groupId) {
  const user = getUser();
  const { error } = await supabase.from('group_members')
    .delete().eq('group_id', groupId).eq('user_id', user.id);
  if (error) throw error;
}

/* ── CHAT ────────────────────────────────────────────── */
export async function loadMessages(g) {
  const user = getUser();
  const { data, error } = await supabase.from('group_messages')
    .select('*').eq('group_id', g.id).order('created_at').limit(200);
  if (error) throw error;
  await fetchProfiles((data || []).map((m) => m.user_id));
  g.messages = (data || []).map((m) => {
    const p = profileOf(m.user_id);
    return {
      id: m.id, from: p.display_name, color: p.avatar_color,
      text: m.content, time: msgTime(m.created_at), mine: m.user_id === user.id,
    };
  });
  g.messagesLoaded = true;
}

export async function sendMessageRow(groupId, content) {
  const user = getUser();
  const { data, error } = await supabase.from('group_messages')
    .insert({ group_id: groupId, user_id: user.id, content })
    .select('*').single();
  if (error) throw error;
  return data;
}

export function messageToView(m) {
  const user = getUser();
  const p = m.user_id === user.id ? getProfile() : profileOf(m.user_id);
  return {
    id: m.id, from: p.display_name, color: p.avatar_color,
    text: m.content, time: msgTime(m.created_at), mine: m.user_id === user.id,
  };
}

/* ── Q&A ─────────────────────────────────────────────── */
export async function loadQuestions() {
  const user = getUser();
  const [qRes, aRes, qvRes, avRes] = await Promise.all([
    supabase.from('questions').select('*').order('created_at', { ascending: false }),
    supabase.from('answers').select('*').order('created_at'),
    supabase.from('question_votes').select('*'),
    supabase.from('answer_votes').select('*'),
  ]);
  for (const r of [qRes, aRes, qvRes, avRes]) if (r.error) throw r.error;

  const answers = aRes.data || [], qVotes = qvRes.data || [], aVotes = avRes.data || [];
  await fetchProfiles([
    ...(qRes.data || []).map((q) => q.user_id),
    ...answers.map((a) => a.user_id),
  ]);

  S.questions = (qRes.data || []).map((q) => {
    const qv = qVotes.filter((v) => v.question_id === q.id);
    const myQv = qv.find((v) => v.user_id === user.id);
    const ans = answers.filter((a) => a.question_id === q.id).map((a) => {
      const av = aVotes.filter((v) => v.answer_id === a.id);
      const myAv = av.find((v) => v.user_id === user.id);
      return {
        id: a.id, text: a.body, author: profileOf(a.user_id).display_name,
        authorId: a.user_id, best: a.is_best,
        votes: av.reduce((s, v) => s + v.value, 0), _myVote: myAv ? myAv.value : 0,
      };
    });
    return {
      id: q.id, title: q.title, body: q.body, cat: q.category_id,
      author: profileOf(q.user_id).display_name, authorId: q.user_id,
      votes: qv.reduce((s, v) => s + v.value, 0), _myVote: myQv ? myQv.value : 0,
      answers: ans, time: timeAgo(q.created_at), solved: ans.some((a) => a.best),
    };
  });
}

export async function insertQuestion({ title, body, cat }) {
  const user = getUser();
  const { data, error } = await supabase.from('questions')
    .insert({ user_id: user.id, title, body, category_id: cat })
    .select('*').single();
  if (error) throw error;
  return data;
}

export async function insertAnswer(questionId, body) {
  const user = getUser();
  const { data, error } = await supabase.from('answers')
    .insert({ question_id: questionId, user_id: user.id, body })
    .select('*').single();
  if (error) throw error;
  return data;
}

// vote = -1, 0 (remove), or 1
export async function setQuestionVote(questionId, value) {
  const user = getUser();
  if (value === 0) {
    const { error } = await supabase.from('question_votes')
      .delete().eq('question_id', questionId).eq('user_id', user.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('question_votes')
      .upsert({ question_id: questionId, user_id: user.id, value });
    if (error) throw error;
  }
}

export async function setAnswerVote(answerId, value) {
  const user = getUser();
  if (value === 0) {
    const { error } = await supabase.from('answer_votes')
      .delete().eq('answer_id', answerId).eq('user_id', user.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('answer_votes')
      .upsert({ answer_id: answerId, user_id: user.id, value });
    if (error) throw error;
  }
}

export async function markBestAnswer(questionId, answerId) {
  const { error: clearErr } = await supabase.from('answers')
    .update({ is_best: false }).eq('question_id', questionId);
  if (clearErr) throw clearErr;
  const { error } = await supabase.from('answers')
    .update({ is_best: true }).eq('id', answerId);
  if (error) throw error;
}

/* ── SUPPORT ─────────────────────────────────────────── */
export async function loadTickets() {
  const user = getUser();
  const { data, error } = await supabase.from('support_tickets')
    .select('*').eq('user_id', user.id).order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((t) => ({
    id: t.ticket_ref, name: t.name, email: t.email, course: t.course,
    category: t.category, priority: t.priority, message: t.message,
    status: t.status, created: new Date(t.created_at).toLocaleString(),
  }));
}

export async function insertTicket({ name, email, course, category, priority, message }) {
  const user = getUser();
  const { data, error } = await supabase.from('support_tickets')
    .insert({ user_id: user.id, name, email, course, category, priority, message })
    .select('ticket_ref').single();
  if (error) throw error;
  return data.ticket_ref;
}

/* ── LOAD EVERYTHING ─────────────────────────────────── */
export async function loadAllData() {
  await Promise.all([loadTopics(), loadGroups(), loadQuestions()]);
}

Object.assign(window, {
  db: {
    timeAgo, profileOf, fetchProfiles, loadTopics, ensureTopicRow, saveTopic, insertCustomTopic,
    deleteTopicRow, loadGroups, createGroupRow, joinGroupRow, leaveGroupRow,
    loadMessages, sendMessageRow, messageToView, loadQuestions, insertQuestion,
    insertAnswer, setQuestionVote, setAnswerVote, markBestAnswer,
    loadTickets, insertTicket, loadAllData,
  },
});
