/* ===================== KRONOSPACE · navegación ===================== */
(function(){
  // inyecta pantallas
  document.getElementById('stagewrap').innerHTML = window.KS_SCREENS;

  const nav   = document.getElementById('nav');
  const orb   = document.getElementById('orb');
  const scrim = document.getElementById('scrim');
  const phone = document.getElementById('phone');
  const sats  = [...document.querySelectorAll('.sat')];
  const screens = [...document.querySelectorAll('.scrn')];

  const LS_AUTH = 'ks_auth', LS_SCREEN = 'ks_screen';
  let fanOpen = false;

  function showScreen(name){
    const target = document.getElementById('scr-'+name);
    if(!target) return;
    screens.forEach(s=>s.classList.toggle('active', s===target));
    target.scrollTop = 0;
    if(name !== 'login') localStorage.setItem(LS_SCREEN, name);
  }

  function setFan(open){
    fanOpen = open;
    sats.forEach((s,i)=>{ s.style.transitionDelay = (open? i : (sats.length-1-i))*48 + 'ms'; });
    nav.classList.toggle('open', open);
  }

  function setAuth(on){
    if(on){ localStorage.setItem(LS_AUTH,'1'); nav.hidden=false; }
    else  { localStorage.removeItem(LS_AUTH); localStorage.removeItem(LS_SCREEN); nav.hidden=true; setFan(false); }
  }

  // ----- eventos -----
  orb.addEventListener('click', ()=>{
    if(!fanOpen) setFan(true);
    else { showScreen('inicio'); setFan(false); }
  });
  scrim.addEventListener('click', ()=> setFan(false));
  sats.forEach(s=> s.addEventListener('click', ()=>{
    showScreen(s.dataset.go); setFan(false);
  }));
  document.querySelectorAll('[data-enter]').forEach(b=> b.addEventListener('click', ()=>{
    setAuth(true); showScreen('inicio');
  }));
  // salir desde ajustes de Perfil (engranaje) → vuelve al login
  document.querySelectorAll('#scr-perfil .iconbtn').forEach(b=> b.addEventListener('click', ()=>{
    setAuth(false); showScreen('login');
  }));
  document.addEventListener('keydown', e=>{ if(e.key==='Escape' && fanOpen) setFan(false); });

  // ----- escalado del teléfono -----
  function scale(){
    const PW = 414+22, PH = 896+22;
    const s = Math.min(window.innerWidth/PW, window.innerHeight/PH, 1) * 0.98;
    phone.style.transform = 'scale('+s+')';
  }
  scale(); window.addEventListener('resize', scale);

  // ----- estado inicial -----
  if(localStorage.getItem(LS_AUTH)){
    nav.hidden = false;
    showScreen(localStorage.getItem(LS_SCREEN) || 'inicio');
  } else {
    nav.hidden = true;
    showScreen('login');
  }
})();
