/* ── TOPIC CARD ─────────────────────────────────────── */
function topicCardHTML(t,i=0){
  const cat=getCat(t.cat);
  const statusLabel={planned:'📋 Planned',learning:'🎓 Learning',done:'✅ Done'}[t.status];
  const statusClass={planned:'st-planned',learning:'st-learning',done:'st-done'}[t.status];
  const added=S.myTopics.includes(t.id);
  return `<div class="topic-card" style="animation-delay:${i*.04}s" id="tc-${t.id}">
    <div class="tc-top">
      <div class="tc-icon" style="background:${cat.color}22">${t.emoji}</div>
      <div class="tc-actions">
        <button class="tc-btn" onclick="openEdit('${t.id}')" title="Edit">✏️</button>
        <button class="tc-btn danger" onclick="deleteTopic('${t.id}')" title="Delete">🗑️</button>
      </div>
    </div>
    <div class="tc-name">${t.name}</div>
    <div class="tc-desc">${t.desc||'A great topic to explore and master.'}</div>
    <div class="tc-footer">
      <span class="topic-tag ${cat.tag}">${cat.emoji} ${cat.name}</span>
      <span class="topic-status ${statusClass}" onclick="cycleStatus('${t.id}')" title="Click to change">${statusLabel}</span>
    </div>
    <button class="tc-add-btn ${added?'added':''}" onclick="toggleMy('${t.id}')">
      ${added?'✓ Added to My Learning':'＋ Add to My Learning'}
    </button>
  </div>`;
}

// Expose on window for inline event handlers and cross-module access
Object.assign(window, { topicCardHTML });
