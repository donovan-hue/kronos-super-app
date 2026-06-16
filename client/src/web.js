/* ===================== KRONOSPACE · WEB · navegación + interacciones ===================== */
(function(){
  // inyecta todas las pantallas (feed + shop + admin) en el host
  document.getElementById('wrap').innerHTML =
    window.KS_SCREENS + (window.KS_SHOP||'') + (window.KS_ADMIN||'');
  // overlays utilitarios van directo al body (position:fixed)
  if(window.KS_UTIL){ document.body.insertAdjacentHTML('beforeend', window.KS_UTIL); }

  const fan    = document.getElementById('fan');
  const orb    = document.getElementById('orb');
  const scrim  = document.getElementById('scrim');
  const topbar = document.getElementById('topbar');
  const sats   = [...document.querySelectorAll('.sat')];

  const LS_AUTH = 'ksw_auth', LS_SCREEN = 'ksw_screen';
  let fanOpen = false;

  // pantallas tipo overlay (no usan el stage): se muestran encima de todo
  const OVERLAY = new Set(['login','forgot','reset','callback','sub-success','sub-cancel','privacy','terms']);
  // pantallas con barra superior + abanico
  const isApp = (name)=> !OVERLAY.has(name);

  function allScreens(){ return [...document.querySelectorAll('.scrn, .util, .legal')]; }

  function showScreen(name){
    const target = document.getElementById('scr-'+name);
    if(!target) return;
    allScreens().forEach(s=> s.classList.toggle('active', s===target));
    const stage = document.querySelector('.stage');
    if(stage) stage.scrollTop = 0;
    // chrome (topbar + abanico) visible solo en pantallas de app
    const appView = isApp(name) && localStorage.getItem(LS_AUTH);
    topbar.style.display = appView ? 'flex' : 'none';
    fan.style.display    = appView ? 'block' : 'none';
    if(isApp(name)) localStorage.setItem(LS_SCREEN, name);
    // callback de Google: redirige solo
    if(name==='callback'){ clearTimeout(window.__cbT); window.__cbT = setTimeout(()=>{ setAuth(true); showScreen('inicio'); }, 2200); }
  }

  function setFan(open){
    fanOpen = open;
    sats.forEach((s,i)=>{ s.style.transitionDelay = (open? i : (sats.length-1-i))*48 + 'ms'; });
    fan.classList.toggle('open', open);
  }
  function setAuth(on){
    if(on) localStorage.setItem(LS_AUTH,'1');
    else { localStorage.removeItem(LS_AUTH); localStorage.removeItem(LS_SCREEN); setFan(false); }
  }

  orb.addEventListener('click', ()=>{ if(!fanOpen) setFan(true); else { showScreen('inicio'); setFan(false); } });
  scrim.addEventListener('click', ()=> setFan(false));
  sats.forEach(s=> s.addEventListener('click', ()=>{ showScreen(s.dataset.go); setFan(false); }));
  document.addEventListener('keydown', e=>{ if(e.key==='Escape' && fanOpen) setFan(false); });

  /* ---------- delegación global de interacciones ---------- */
  document.addEventListener('click', e=>{
    // navegación declarativa
    const goEl = e.target.closest('[data-go]');
    const stop = e.target.closest('[data-stop]');

    // stepper de cantidad
    const stepBtn = e.target.closest('[data-step]');
    if(stepBtn){
      const qv = stepBtn.parentElement.querySelector('.qv');
      let v = parseInt(qv.textContent,10) + parseInt(stepBtn.dataset.step,10);
      qv.textContent = Math.max(1, v); return;
    }

    // agregar al carrito → badge en abanico Market / botón cart
    if(e.target.closest('[data-addcart]')){ bumpCart(); }

    // quitar línea del carrito
    const rm = e.target.closest('[data-removeline]');
    if(rm){ const line = rm.closest('.cartline'); line.style.transition='opacity .3s,transform .3s'; line.style.opacity='0'; line.style.transform='translateX(20px)'; setTimeout(()=>line.remove(),300); return; }

    // pagar (Stripe) → suscripción exitosa
    if(e.target.closest('[data-pay]')){ showScreen('sub-success'); return; }

    // login / crear cuenta
    if(e.target.closest('[data-enter]')){ setAuth(true); showScreen('inicio'); return; }

    // expandir orden (mis pedidos + admin)
    const oexp = e.target.closest('[data-orderexpand]');
    if(oexp){ const o = oexp.closest('.order'); if(o){ o.classList.toggle('open'); return; } }

    // toggle de reembolso
    const rf = e.target.closest('[data-refundtoggle]');
    if(rf){ rf.closest('.order-b').querySelector('.refund').classList.toggle('open'); return; }

    // swatches color
    const sw = e.target.closest('.swatch');
    if(sw){ sw.parentElement.querySelectorAll('.swatch').forEach(x=>x.classList.remove('on')); sw.classList.add('on'); return; }
    // tallas
    const sz = e.target.closest('.sizebox');
    if(sz){ sz.parentElement.querySelectorAll('.sizebox').forEach(x=>x.classList.remove('on')); sz.classList.add('on'); return; }
    // chips
    const chip = e.target.closest('.chip');
    if(chip){ chip.parentElement.querySelectorAll('.chip').forEach(x=>x.classList.remove('on')); chip.classList.add('on'); return; }

    // pestañas admin
    const tab = e.target.closest('.tab');
    if(tab){ const root = tab.closest('.scrn');
      root.querySelectorAll('.tab').forEach(x=>x.classList.remove('on')); tab.classList.add('on');
      root.querySelectorAll('.tabpanel').forEach(p=> p.classList.toggle('on', p.dataset.panel===tab.dataset.tab)); return; }

    // acciones admin (toggles visuales)
    const susp = e.target.closest('[data-suspendtoggle]');
    if(susp){ const row=susp.closest('.drow'); const chipS=row.querySelector('.statuschip');
      const active = chipS.classList.contains('st-compl');
      chipS.classList.toggle('st-compl',!active); chipS.classList.toggle('st-rech',active);
      chipS.textContent = active?'Suspendido':'Activo'; susp.textContent = active?'Activar':'Suspender';
      susp.classList.toggle('danger',!active); return; }
    const rt = e.target.closest('[data-roletoggle]');
    if(rt){ const pill=rt.closest('.drow').querySelector('.rolepill'); pill.textContent = pill.textContent.trim()==='Admin'?'Usuario':'Admin'; return; }
    const rmrow = e.target.closest('[data-removerow]');
    if(rmrow){ const row=rmrow.closest('.drow'); row.style.transition='opacity .3s'; row.style.opacity='0'; setTimeout(()=>row.remove(),300); return; }
    const rsv = e.target.closest('[data-resolverow]');
    if(rsv){ const chipR=rsv.closest('.drow').querySelector('.statuschip'); chipR.classList.remove('st-pend'); chipR.classList.add('st-compl'); chipR.textContent='Resuelto'; rsv.textContent='Resuelto'; rsv.disabled=true; rsv.style.opacity='.5'; return; }
    const rfr = e.target.closest('[data-refresh]');
    if(rfr){ rfr.textContent='Actualizando…'; setTimeout(()=>rfr.textContent='Actualizar',900); return; }

    // acordeones legales
    const accH = e.target.closest('[data-acc]');
    if(accH){ accH.closest('.acc').classList.toggle('open'); return; }

    // navlinks del feed
    const link = e.target.closest('.navlink');
    if(link){ const label=link.textContent.trim();
      const map={'Inicio':'inicio','Perfil':'perfil','Guardados':'perfil','Tendencias':'inicio'};
      if(label==='Ajustes'){ setAuth(false); showScreen('login'); } else if(map[label]) showScreen(map[label]); return; }

    // navegación declarativa (al final, para que data-stop tenga prioridad)
    if(goEl && !stop){
      const dest = goEl.dataset.go;
      if(dest==='login'){ /* logout-ish */ }
      showScreen(dest); if(fanOpen) setFan(false); return;
    }
  });

  // badge "carrito con items" en el orbe Market
  function bumpCart(){
    const market = document.querySelector('.sat[data-go="market"]');
    document.querySelectorAll('.iconbtn.badge, [data-go="cart"]').forEach(b=> b.classList.add('badge'));
    if(market){ market.classList.add('active-orb'); }
    // micro-feedback
    const cartBtns = document.querySelectorAll('[data-go="cart"]');
    cartBtns.forEach(b=>{ b.animate?.([{transform:'scale(1)'},{transform:'scale(1.18)'},{transform:'scale(1)'}],{duration:280,easing:'cubic-bezier(.2,1.4,.3,1)'}); });
  }

  /* ---------- estado inicial ---------- */
  if(localStorage.getItem(LS_AUTH)){ showScreen(localStorage.getItem(LS_SCREEN) || 'inicio'); }
  else { showScreen('login'); }

  // exponer para pruebas
  window.KSW = { showScreen, setAuth, setFan };
})();
