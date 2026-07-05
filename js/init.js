/* ── INIT ──────────────────────────────────────────── */
window.onload = () => {
  // set initial display — all pages hidden except discover
  document.querySelectorAll('.page').forEach(p=>{
    p.style.display = p.id==='page-discover' ? 'block' : 'none';
    if(p.id==='page-discover') p.classList.add('active');
  });
  renderCatGrid();
  renderQuote();
  populateAllSelects();
  buildEmojiPicker('emojiPick','selEmoji');
  buildEmojiPicker('gEmojiPick','gEmoji');
  buildColorPicker();
  setInterval(renderQuote, 6000);
  checkInviteHash();
};
