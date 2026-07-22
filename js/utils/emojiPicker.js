function buildEmojiPicker(containerId,stateKey){
  const c=document.getElementById(containerId); if(!c) return;
  c.innerHTML=ICONS.map(e=>`<div class="emoji-opt ${S[stateKey]===e?'selected':''}" onclick="pickEmoji('${e}','${containerId}','${stateKey}')">${e}</div>`).join('');
}
function pickEmoji(e,cid,sk){S[sk]=e;buildEmojiPicker(cid,sk)}

// Expose on window for inline event handlers and cross-module access
Object.assign(window, { buildEmojiPicker, pickEmoji });
