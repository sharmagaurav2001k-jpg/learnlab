/* ── DATA ─────────────────────────────────────────── */
const CATS = [
  {id:'prog',  name:'Programming',     emoji:'💻', color:'#7c3aed', color2:'#a67ff0', tag:'tag-prog',  desc:'Master coding — from beginner scripting to advanced software engineering.'},
  {id:'design',name:'Design',          emoji:'🎨', color:'#be185d', color2:'#f06292', tag:'tag-design', desc:'Create stunning visuals, user interfaces and digital experiences.'},
  {id:'biz',   name:'Business',        emoji:'📊', color:'#d97706', color2:'#f59e0b', tag:'tag-biz',   desc:'Entrepreneurship, finance, marketing and the art of building things.'},
  {id:'sci',   name:'Science & Math',  emoji:'🔬', color:'#1d4ed8', color2:'#4fb3f6', tag:'tag-sci',   desc:'Explore the laws of nature, mathematics and the universe.'},
  {id:'lang',  name:'Languages',       emoji:'🌍', color:'#16a34a', color2:'#3ecfb2', tag:'tag-lang',  desc:'Speak new languages, connect with cultures around the world.'},
  {id:'fit',   name:'Health & Fitness',emoji:'💪', color:'#dc2626', color2:'#ff7d6b', tag:'tag-fit',   desc:'Build strength, wellness habits and a healthy mind-body balance.'},
  {id:'music', name:'Music & Arts',    emoji:'🎵', color:'#ca8a04', color2:'#f5a623', tag:'tag-music', desc:'Play instruments, compose music and explore creative arts.'},
  {id:'write', name:'Writing',         emoji:'✍️', color:'#0369a1', color2:'#38bdf8', tag:'tag-write', desc:'Craft compelling stories, essays, scripts and professional content.'},
  {id:'hist',  name:'History',         emoji:'🏛️', color:'#9333ea', color2:'#c084fc', tag:'tag-hist',  desc:'Journey through civilizations, revolutions and the story of humanity.'},
  {id:'dev',   name:'Personal Dev',    emoji:'🧘', color:'#ea580c', color2:'#fb923c', tag:'tag-dev',   desc:'Build confidence, habits, leadership and a growth mindset.'},
];

// Expose on window for inline event handlers and cross-module access
Object.assign(window, { CATS });
