let S = {
  topics: [...TOPICS],
  myTopics: [],
  activeCat: null,
  catFilter: 'all',
  searchQ: '',
  prevPage: 'discover',
  groups: [
    {id:'g1',name:'Python Wizards',emoji:'🐍',desc:'Learning Python together from basics to machine learning projects.',cat:'prog',color:'#7c5cbf',members:['A','B','C'],joined:false,invites:[],messages:[
      {from:'Alice',color:'#7c5cbf',text:'Hey everyone! Ready to learn Python?',time:'10:30 AM',mine:false},
      {from:'Bob',color:'#3ecfb2',text:'Absolutely! Starting with functions today 🙌',time:'10:32 AM',mine:false},
    ]},
    {id:'g2',name:'Design Squad',emoji:'🎨',desc:'UI/UX designers sharing resources, feedback and creative tips.',cat:'design',color:'#f06292',members:['D','E'],joined:false,invites:[],messages:[
      {from:'Diana',color:'#f06292',text:'Just finished my first Figma prototype! 🎉',time:'9:15 AM',mine:false},
    ]},
    {id:'g3',name:'Language Learners',emoji:'🌍',desc:'Practicing Spanish, Japanese and French together daily.',cat:'lang',color:'#3ecfb2',members:['F','G','H','I'],joined:false,invites:[],messages:[
      {from:'Fatima',color:'#3ecfb2',text:'¡Buenos días a todos! 🇪🇸',time:'8:00 AM',mine:false},
    ]},
  ],
  activeGroup: null,
  inviteGroupId: null,
  groupFilter: 'all',
  selEmoji: '📚',
  gEmoji: '👥',
  gColor: '#7c5cbf',
  qaFilter: 'all',
  activeQId: null,
  questions: [
    {id:'q1',title:'What is the difference between a list and a tuple in Python?',body:'I keep confusing these two. When should I use a list vs a tuple? Is there a performance difference?',cat:'prog',author:'Alex',votes:14,answers:[
      {id:'a1',text:'A list is mutable (you can change it after creation) while a tuple is immutable (cannot be changed). Use tuples for fixed data like coordinates or RGB values, and lists when you need to add/remove items.\n\nTuples are also slightly faster than lists for iteration.',author:'Priya',votes:9,best:true},
      {id:'a2',text:'Simple rule: if your data should not change, use a tuple. If it might change, use a list. Tuples can also be used as dictionary keys because they are hashable, while lists cannot.',author:'Sam',votes:5,best:false},
    ],time:'2h ago',solved:true},
    {id:'q2',title:'How do I stay motivated when learning a new language?',body:"I started Spanish 3 months ago and I'm losing motivation. Any tips from people who've successfully learned a language?",cat:'lang',author:'Maria',votes:11,answers:[
      {id:'a3',text:'Change your environment! Watch Spanish Netflix shows (with Spanish subtitles, not English). Your brain starts to associate the language with entertainment rather than "study".',author:'Carlos',votes:7,best:true},
      {id:'a4',text:'Set a micro-goal: just 10 minutes a day. Consistency beats intensity. After 30 days it becomes a habit.',author:'Ji-ho',votes:4,best:false},
    ],time:'5h ago',solved:true},
    {id:'q3',title:'Best resources to learn UI/UX design from scratch?',body:'I am a complete beginner in design. What courses, tools, or YouTube channels would you recommend?',cat:'design',author:'Rohan',votes:8,answers:[
      {id:'a5',text:'Start with the Google UX Design certificate on Coursera — it is free to audit and very beginner friendly. Then practice by redesigning apps you use daily.',author:'Neha',votes:6,best:false},
    ],time:'1d ago',solved:false},
    {id:'q4',title:'How to solve quadratic equations step by step?',body:'My exam is tomorrow and I am still struggling with quadratic equations. Can someone explain both the formula method and factoring?',cat:'sci',author:'Aisha',votes:6,answers:[],time:'3h ago',solved:false},
    {id:'q5',title:'What is compound interest and how do I calculate it?',body:'I want to understand personal finance better. Can someone explain compound interest with a simple example?',cat:'biz',author:'David',votes:4,answers:[
      {id:'a6',text:'Compound interest = P × (1 + r/n)^(nt)\nWhere P = principal, r = annual rate, n = times compounded per year, t = years.\n\nExample: ₹10,000 at 8% compounded yearly for 5 years = 10000 × (1.08)^5 ≈ ₹14,693. Your money grew by ₹4,693!',author:'Finance_Nerd',votes:8,best:true},
    ],time:'2d ago',solved:true},
    {id:'q6',title:'How do I overcome stage fright before public speaking?',body:'I have to give a presentation next week and I am terrified. Heart racing, mind goes blank. Any practical advice?',cat:'dev',author:'Lena',votes:9,answers:[],time:'6h ago',solved:false},
  ],
};

// Expose on window for inline event handlers and cross-module access
Object.assign(window, { S });
