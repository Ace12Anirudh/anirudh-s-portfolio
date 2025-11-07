/* Utilities */
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

/* Counters for About KPIs */
(function counters(){
  const els = $$('[data-counter]');
  if(!els.length) return;
  const counts = {
    projects: $$('#projects .card').length,
    tools: $$('#tools .logo-grid li').length,
    certs: $$('#certs .card').length,
    internships: $$('#internships .tl-item').length,
  };
  const animate = (el, to)=>{
    const start = 0, dur = 1100; const t0 = performance.now();
    const step=(t)=>{ const p=Math.min(1,(t-t0)/dur); el.textContent = Math.floor(start + p*to); if(p<1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ const key=e.target.dataset.counter; animate(e.target, counts[key]||0); obs.unobserve(e.target); }});
  }, {threshold:.5});
  els.forEach(el=>obs.observe(el));
})();

/* Theme toggle */
(function theme(){
  const btn = $('#theme-toggle'); if(!btn) return;
  const icon = btn.querySelector('.icon');
  const Icons = {
    sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zM1 13h3v-2H1v2zm10 10h2v-3h-2v3zm9-10v-2h-3v2h3zm-3.95 7.95l1.41 1.41 1.8-1.79-1.41-1.41-1.8 1.79zM13 1h-2v3h2V1zm-7.66 3.05L3.95 5.46l1.79 1.8 1.41-1.41-1.8-1.8zM12 7a5 5 0 100 10 5 5 0 000-10z"/></svg>',
    moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.74 2a9 9 0 108.95 10.74A7 7 0 0112.74 2z"/></svg>'
  };
  const getPreferred = ()=> localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  const apply = (t)=>{
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    const label = document.getElementById('theme-label');
    if(icon){ icon.innerHTML = t==='light' ? Icons.moon : Icons.sun; }
    if(label){ label.textContent = t==='light' ? 'Light' : 'Dark'; }
    btn.setAttribute('aria-pressed', t==='light');
  };
  apply(getPreferred());
  btn.addEventListener('click', ()=>{
    const cur = document.documentElement.getAttribute('data-theme') || 'dark';
    apply(cur==='dark' ? 'light' : 'dark');
  });
})();


/* Back-to-top button with animated icon while scrolling */
(function backToTop(){
  const btn = document.getElementById('to-top');
  if(!btn) return;
  const onScroll = ()=>{ if(window.scrollY > 400) btn.classList.add('show'); else btn.classList.remove('show'); };
  addEventListener('scroll', onScroll, {passive:true});
  let stopTimer;
  const stopAnim = ()=>{ btn.classList.remove('scrolling'); };
  addEventListener('scroll', ()=>{ clearTimeout(stopTimer); stopTimer = setTimeout(stopAnim, 200); }, {passive:true});
btn.addEventListener('click', ()=>{
    btn.classList.add('scrolling');
    const start = window.scrollY || document.documentElement.scrollTop;
    const dur = 1200; // slower scroll
    const t0 = performance.now();
    const ease = t=> t<.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2; // easeInOutQuad
    const step = (t)=>{
      const p = Math.min(1, (t - t0)/dur);
      const y = Math.round(start * (1 - ease(p)));
      window.scrollTo(0, y);
      if(p < 1) requestAnimationFrame(step); else btn.classList.remove('scrolling');
    };
    requestAnimationFrame(step);
  });
  onScroll();
})();


/* Typewriter */
(function typewriter(){
  const el = $('.typing');
  if(!el) return;
  const text = el.dataset.text || '';
  let i = 0;
  const step = () => {
    el.textContent = text.slice(0, i) + (i % 2 ? '_' : '');
    i = Math.min(i + 1, text.length);
    if(i < text.length) setTimeout(step, 35);
  };
  step();
})();

/* Intersection Observer for reveal */
(function revealOnScroll(){
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in-view'); obs.unobserve(e.target); } });
  }, {threshold:.18});
  $$('.reveal').forEach(n => obs.observe(n));
})();

/* Smooth scroll for internal nav + mobile menu toggle */
(function nav(){
  const links = $$('a[href^="#"]');
  const bar = document.querySelector('.nav');
  const btn = $('#nav-toggle');
  if(btn && bar){
    const iconWrap = btn.querySelector('.icon');
    const label = btn.querySelector('.btn-label');
    const Icons = {
      menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v2H4V7zm0 4h16v2H4v-2zm0 4h16v2H4v-2z"/></svg>',
      close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.3 5.71L12 12l6.3 6.29-1.41 1.42L10.59 13.41 4.29 19.71 2.88 18.29 9.17 12 2.88 5.71 4.29 4.29l6.3 6.3 6.29-6.3z"/></svg>'
    };
    const setIcon = (open)=>{ if(iconWrap){ iconWrap.innerHTML = open ? Icons.close : Icons.menu; } if(label){ label.textContent = open ? 'Close' : 'Menu'; } };
    setIcon(false);
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      const open = bar.classList.toggle('menu-open');
      btn.setAttribute('aria-expanded', String(open));
      setIcon(open);
    });
    // Close on outside click or Escape
    document.addEventListener('click', (e)=>{ if(!bar.contains(e.target)) { bar.classList.remove('menu-open'); btn.setAttribute('aria-expanded','false'); setIcon(false);} });
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape'){ bar.classList.remove('menu-open'); btn.setAttribute('aria-expanded','false'); setIcon(false);} });
  }
  links.forEach(a => {
    a.addEventListener('click', (e)=>{
      const id = a.getAttribute('href').slice(1);
      const tgt = document.getElementById(id);
      if(tgt){ e.preventDefault(); tgt.scrollIntoView({behavior:'smooth', block:'start'}); }
      if(bar && bar.classList.contains('menu-open')){ bar.classList.remove('menu-open'); btn && btn.setAttribute('aria-expanded','false'); }
    });
  });
})();

/* Certifications clickable cards */
(function certLinks(){
  $$('.card.clickable').forEach(card => card.addEventListener('click', ()=>{
    const link = card.getAttribute('data-link');
    if(link && link !== '#') window.open(link, '_blank', 'noopener');
  }));
})();

/* Canvas particles background */
(function particles(){
  const c = document.getElementById('bg-canvas');
  if(!c) return; const dpr = Math.min(2, window.devicePixelRatio || 1);
  const ctx = c.getContext('2d');
  let W, H, pts = [];
  const resize = () => { W = c.width = innerWidth * dpr; H = c.height = innerHeight * dpr; pts = makePoints(); };
  const makePoints = ()=> Array.from({length: Math.round((W*H)/13000)}, ()=>({
    x: Math.random()*W, y: Math.random()*H, r: 0.7 + Math.random()*1.4,
    vx: (Math.random()-.5)*.25, vy: (Math.random()-.5)*.25,
  }));
  const step = ()=>{
    ctx.clearRect(0,0,W,H);
    for(const p of pts){
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>W) p.vx*=-1; if(p.y<0||p.y>H) p.vy*=-1;
      ctx.beginPath();
      const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*6);
      g.addColorStop(0,'rgba(88,114,255,0.65)');
      g.addColorStop(1,'rgba(62,199,224,0)');
      ctx.fillStyle = g; ctx.arc(p.x,p.y,p.r*6,0,Math.PI*2); ctx.fill();
    }
    requestAnimationFrame(step);
  };
  addEventListener('resize', resize); resize(); step();
})();

/* Contact form submission: EmailJS first, fallback to FormSubmit */
(function contact(){
  const form = $('#contact-form'); if(!form) return;
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const status = $('#form-status');
    status.textContent = 'Sending...';
    const name = form.user_name.value;
    const email = form.user_email.value;
    const message = form.message.value;
    try{
      if(window.emailjs && window.EMAILJS_CONFIG && EMAILJS_CONFIG.SERVICE_ID && EMAILJS_CONFIG.TEMPLATE_ID){
        await emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, { user_name:name, user_email:email, message });
        status.textContent = 'Sent! I\'ll get back to you soon.';
        form.reset();
        return;
      }
      // Fallback to FormSubmit if EmailJS is not configured
      const fd = new FormData();
      fd.append('name', name);
      fd.append('email', email);
      fd.append('_replyto', email);
      fd.append('message', message);
      fd.append('_subject','New portfolio contact');
      fd.append('_captcha','false');
      fd.append('_template','table');
      const res = await fetch('https://formsubmit.co/ajax/anirudhtrivedi3014@gmail.com', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: fd,
      });
      if(!res.ok) throw new Error('Request failed');
      const data = await res.json();
      status.textContent = data.success ? 'Sent! I\'ll get back to you soon.' : 'Sent. Please check your inbox.';
      form.reset();
    }catch(err){
      status.textContent = 'Failed to send. Please try again later.';
      console.error(err);
    }
  });
})();

/* Audio toggle, ambient sound, and hover sounds */
(function audio(){
  const hover = $('#hover-sound');
  const music = $('#bg-music');
  const toggle = $('#audio-toggle');
  let icon = toggle ? toggle.querySelector('i') : null;
  let ctx = null, gain = null, osc1 = null, osc2 = null, ambientOn = false, audioOn = false;

  const mkCtx = ()=> ctx || new (window.AudioContext||window.webkitAudioContext)();
  const startAmbient = ()=>{
    if(ambientOn) return;
    ctx = mkCtx();
    gain = gain || ctx.createGain();
    gain.gain.value = 0.0; gain.connect(ctx.destination);
    const mkOsc = (freq, detune)=>{
      const o = ctx.createOscillator(); o.type='sine'; o.frequency.value=freq; o.detune.value=detune; const g=ctx.createGain(); g.gain.value=0.25; o.connect(g); g.connect(gain); o.start(); return o;
    };
    osc1 = mkOsc(220,-8); osc2 = mkOsc(277,6);
    // fade in ambient
    let t0=performance.now(); const dur=400; const step=(t)=>{ const p=Math.min(1,(t-t0)/dur); gain.gain.value=0.04*p; if(p<1) requestAnimationFrame(step); }; requestAnimationFrame(step);
    ambientOn = true;
  };
  const stopAmbient = async ()=>{
    if(!ambientOn) return;
    try{
      // fade out
      let t0=performance.now(); const dur=300; const g0=gain?gain.gain.value:0; const step=(t)=>{ const p=Math.min(1,(t-t0)/dur); if(gain) gain.gain.value=g0*(1-p); if(p<1) requestAnimationFrame(step); else {
        try{ osc1 && osc1.stop(); osc2 && osc2.stop(); }catch(_){}
        osc1=null; osc2=null; ambientOn=false; if(ctx && ctx.state!=='closed'){ ctx.suspend && ctx.suspend(); }
      }}; requestAnimationFrame(step);
    }catch(_){ ambientOn=false; }
  };

  const setIcon = (on)=>{
    if(icon){ icon.className = on ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark'; }
    const label = document.getElementById('audio-label');
    if(label){ label.textContent = on ? '🔊' : '🔇'; }
  };

  const fadeMusic = async (to, ms)=> new Promise(res=>{
    if(!music) return res();
    const from = music.volume; const t0 = performance.now();
    const step=(t)=>{ const p=Math.min(1,(t-t0)/ms); music.volume = from + (to-from)*p; if(p<1) requestAnimationFrame(step); else res(); };
    requestAnimationFrame(step);
  });

  if(toggle){
    const iconWrap = toggle.querySelector('.icon');
    const Icons = {
      on: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10v4h4l5 5V5L7 10H3zm13.5 2a3.5 3.5 0 00-2.5-3.35v6.7a3.5 3.5 0 002.5-3.35zM14 3.23v2.06a7 7 0 010 13.42v2.06c5.05-1.01 8.56-5.99 7.55-11.04A9 9 0 0014 3.23z"/></svg>',
      off: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.5 12a3.5 3.5 0 00-2.5-3.35v6.7A3.5 3.5 0 0016.5 12zM7 10H3v4h4l5 5V5L7 10zM14 3.23v2.06a7 7 0 010 13.42v2.06c5.05-1.01 8.56-5.99 7.55-11.04A9 9 0 0014 3.23z"/></svg>'
    };
    const setIcon = (on)=>{ if(iconWrap){ iconWrap.innerHTML = on ? Icons.on : Icons.off; } const label = document.getElementById('audio-label'); if(label){ label.textContent = on ? 'Sound On' : 'Sound Off'; }};
    setIcon(false);
    toggle.addEventListener('click', async ()=>{
      if(!audioOn){
        try{ if(music){ music.volume=0.0; await music.play(); await fadeMusic(0.18, 350);} }catch(_){}
        startAmbient(); audioOn=true; toggle.setAttribute('aria-pressed','true'); setIcon(true);
      }else{
        await fadeMusic(0.0, 300); music && music.pause(); music && (music.currentTime=0);
        await stopAmbient(); audioOn=false; toggle.setAttribute('aria-pressed','false'); setIcon(false);
      }
    });
  }

  ['a','button','.card'].forEach(sel => {
    $$(sel).forEach(el => el.addEventListener('mouseenter', ()=>{ try{ hover && (hover.currentTime=0); hover && hover.play && hover.play(); }catch(_){} }));
  });
})();
