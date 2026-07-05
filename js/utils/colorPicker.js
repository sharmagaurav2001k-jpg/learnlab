function buildColorPicker(){
  const c=document.getElementById('gColorPick'); if(!c) return;
  c.innerHTML=GCOLORS.map(col=>`<div class="color-opt${S.gColor===col?' selected':''}" style="background:${col}" onclick="pickColor('${col}')"></div>`).join('');
}
function pickColor(col){S.gColor=col;buildColorPicker()}

// Expose on window for inline event handlers and cross-module access
Object.assign(window, { buildColorPicker, pickColor });
