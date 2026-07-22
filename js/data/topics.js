const TOPICS = [
  {id:'t1',  name:'Python Programming',      cat:'prog',  emoji:'🐍', desc:'Learn Python from basics to advanced — scripts, automation and data work.',status:'planned',custom:false},
  {id:'t2',  name:'Web Development',         cat:'prog',  emoji:'🌐', desc:'HTML, CSS, JavaScript & modern frameworks like React and Vue.',            status:'planned',custom:false},
  {id:'t3',  name:'Data Structures',         cat:'prog',  emoji:'🗂️', desc:'Arrays, trees, graphs, algorithms — the backbone of every program.',       status:'planned',custom:false},
  {id:'t4',  name:'Machine Learning',        cat:'prog',  emoji:'🤖', desc:'AI, neural networks and real-world ML models using Python.',               status:'planned',custom:false},
  {id:'t5',  name:'UI/UX Design',            cat:'design',emoji:'🖌️', desc:'Design beautiful, user-friendly interfaces that people love.',             status:'planned',custom:false},
  {id:'t6',  name:'Figma',                   cat:'design',emoji:'🎭', desc:'Master the #1 design tool used by professionals worldwide.',               status:'planned',custom:false},
  {id:'t7',  name:'Photography',             cat:'design',emoji:'📷', desc:'Composition, lighting, editing — the art of capturing moments.',          status:'planned',custom:false},
  {id:'t8',  name:'Entrepreneurship',        cat:'biz',   emoji:'🚀', desc:'Start and grow your own business from idea to launch.',                   status:'planned',custom:false},
  {id:'t9',  name:'Financial Literacy',      cat:'biz',   emoji:'💰', desc:'Understand money, investing, budgeting and building wealth.',             status:'planned',custom:false},
  {id:'t10', name:'Digital Marketing',       cat:'biz',   emoji:'📣', desc:'SEO, ads, social media and growth hacking strategies.',                   status:'planned',custom:false},
  {id:'t11', name:'Calculus',                cat:'sci',   emoji:'📐', desc:'Derivatives, integrals and real-world applications of math.',             status:'planned',custom:false},
  {id:'t12', name:'Physics',                 cat:'sci',   emoji:'⚛️', desc:'Classical mechanics to quantum theory — how the universe works.',         status:'planned',custom:false},
  {id:'t13', name:'Spanish',                 cat:'lang',  emoji:'🇪🇸', desc:'Speak Spanish fluently through vocabulary, grammar and conversation.',    status:'planned',custom:false},
  {id:'t14', name:'Japanese',                cat:'lang',  emoji:'🇯🇵', desc:'Hiragana, katakana, kanji and natural conversational Japanese.',          status:'planned',custom:false},
  {id:'t15', name:'Yoga & Meditation',       cat:'fit',   emoji:'🧘', desc:'Build flexibility, strength and inner peace through practice.',           status:'planned',custom:false},
  {id:'t16', name:'Nutrition Science',       cat:'fit',   emoji:'🥗', desc:'Understand food, macros and the science of healthy eating.',              status:'planned',custom:false},
  {id:'t17', name:'Guitar',                  cat:'music', emoji:'🎸', desc:'From beginner chords to full songs — acoustic and electric.',             status:'planned',custom:false},
  {id:'t18', name:'Piano',                   cat:'music', emoji:'🎹', desc:'Read sheet music, play melodies and build musical ear.',                  status:'planned',custom:false},
  {id:'t19', name:'Creative Writing',        cat:'write', emoji:'📝', desc:'Storytelling, character building, narrative craft and voice.',            status:'planned',custom:false},
  {id:'t20', name:'Ancient History',         cat:'hist',  emoji:'🏺', desc:'Civilizations from Egypt to Greece to Rome and beyond.',                 status:'planned',custom:false},
  {id:'t21', name:'Public Speaking',         cat:'dev',   emoji:'🎤', desc:'Overcome fear and speak with confidence in any room.',                   status:'planned',custom:false},
  {id:'t22', name:'Time Management',         cat:'dev',   emoji:'⏰', desc:'Productivity systems, deep work and getting the right things done.',      status:'planned',custom:false},
];

// Expose on window for inline event handlers and cross-module access
Object.assign(window, { TOPICS });
