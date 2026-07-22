/* ── HELPERS ─────────────────────────────────────────── */
function getCat(id){return CATS.find(c=>c.id===id)||CATS[0]}
function rColor(seed){const p=['#7c5cbf','#ff7d6b','#3ecfb2','#f5a623','#4fb3f6','#f06292','#66bb6a'];let h=0;for(let c of seed)h=(h*31+c.charCodeAt(0))%p.length;return p[Math.abs(h)]}

// Expose on window for inline event handlers and cross-module access
Object.assign(window, { getCat, rColor });
