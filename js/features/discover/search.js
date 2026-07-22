/* ── SEARCH ─────────────────────────────────────────── */
function handleSearch(inp){
  S.searchQ=inp.value.trim().toLowerCase();
  document.getElementById('searchClear').classList.toggle('show',inp.value.length>0);
  const searching=S.searchQ.length>0;
  document.getElementById('catSection').style.display=searching?'none':'block';
  document.getElementById('searchResultsSection').style.display=searching?'block':'none';
  if(searching) renderSearchResults();
}
function clearSearch(){
  document.getElementById('searchBar').value='';
  S.searchQ='';
  document.getElementById('searchClear').classList.remove('show');
  document.getElementById('catSection').style.display='block';
  document.getElementById('searchResultsSection').style.display='none';
}
function renderSearchResults(){
  const results=S.topics.filter(t=>
    t.name.toLowerCase().includes(S.searchQ)||
    (t.desc||'').toLowerCase().includes(S.searchQ)||
    getCat(t.cat).name.toLowerCase().includes(S.searchQ)
  );
  const grid=document.getElementById('searchResultsGrid');
  const nr=document.getElementById('searchNoRes');
  if(results.length===0){ grid.innerHTML=''; nr.style.display='block'; }
  else{ nr.style.display='none'; grid.innerHTML=results.map((t,i)=>topicCardHTML(t,i)).join(''); }
}

// Expose on window for inline event handlers and cross-module access
Object.assign(window, { handleSearch, clearSearch, renderSearchResults });
