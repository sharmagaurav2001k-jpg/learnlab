/* ── CATEGORIES HOMEPAGE ────────────────────────────── */
function renderCatGrid(){
  const grid=document.getElementById('catGrid');
  grid.innerHTML=CATS.map((c,i)=>{
    const cnt=S.topics.filter(t=>t.cat===c.id).length;
    return `<div class="cat-card" style="--cc:${c.color};animation-delay:${i*.05}s" onclick="openCategory('${c.id}')">
      <span class="cat-emoji">${c.emoji}</span>
      <div class="cat-name">${c.name}</div>
      <div class="cat-count">${cnt} topics available</div>
      <div class="cat-arrow">→</div>
    </div>`;
  }).join('');
}

// Expose on window for inline event handlers and cross-module access
Object.assign(window, { renderCatGrid });
