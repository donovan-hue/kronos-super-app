/* ===================== KRONOSPACE · pantallas (placeholders neutros) ===================== */
(function(){
  // glyphs reutilizables
  const G = {
    heart:'<path d="M12 20s-7-4.5-9.5-9A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9.5 5C19 15.5 12 20 12 20Z"/>',
    chat:'<path d="M20 6.5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h1.4v3l3.6-3H18a2 2 0 0 0 2-2Z"/>',
    share:'<path d="M5 12v7h14v-7"/><path d="M12 3v12M8 7l4-4 4 4"/>',
    image:'<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="8.5" cy="9.5" r="1.8"/><path d="M4 17l5-5 4 3 3-3 4 4"/>',
    play:'<circle cx="12" cy="12" r="9"/><path d="M10 8.5l6 3.5-6 3.5Z"/>',
    search:'<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
    cart:'<path d="M3.2 4.5H5.4L7.3 15h9.1l1.7-7.4H6.1"/><circle cx="9" cy="18.6" r="1.3"/><circle cx="16" cy="18.6" r="1.3"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    gear:'<circle cx="12" cy="12" r="3.2"/><path d="M12 3v2.2M12 18.8V21M21 12h-2.2M5.2 12H3M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6M18.4 18.4l-1.6-1.6M7.2 7.2 5.6 5.6"/>',
    send:'<path d="M5 12 20 5l-5 15-3.5-6.5L5 12Z"/>',
    spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/>',
    film:'<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M8 4v16M16 4v16M3 9h5M16 9h5M3 15h5M16 15h5"/>',
    filter:'<path d="M5 5h14l-5.5 7v5l-3 2v-7L5 5Z"/>',
    doc:'<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h6M10 16h6"/>',
    user:'<circle cx="12" cy="8" r="3.6"/><path d="M5.4 19.6a6.6 6.6 0 0 1 13.2 0"/>',
    bell:'<path d="M18 16v-5a6 6 0 0 0-12 0v5l-1.6 2h15.2Z"/><path d="M9.8 19.6a2.4 2.4 0 0 0 4.4 0"/>',
    pad:'<path d="M7.5 8h9a3.8 3.8 0 0 1 3.8 4.1l-.4 3.3a2.4 2.4 0 0 1-4.3 1.1L14.4 15H9.6l-1.2 1.5a2.4 2.4 0 0 1-4.3-1.1l-.4-3.3A3.8 3.8 0 0 1 7.5 8Z"/><path d="M7 10.6v2.2M5.9 11.7h2.2"/>',
    lock:'<rect x="5" y="10" width="14" height="10" rx="2.5"/><path d="M8 10V8a4 4 0 0 1 8 0v2"/>',
    at:'<circle cx="12" cy="12" r="4"/><path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1"/>'
  };
  const ic = (k,cls='') => `<svg class="${cls}" viewBox="0 0 24 24">${G[k]}</svg>`;
  const bar = (w,c='') => `<div class="ph-bar ${c}" style="width:${w}"></div>`;
  const av  = (sz='av-46') => `<span class="avatar ${sz}"><span>${ic('user')}</span></span>`;

  // ---------- LOGIN ----------
  const login = `
  <section class="scrn" id="scr-login" data-screen="login" data-screen-label="Login">
    <div class="logo"><svg viewBox="0 0 100 100">
      <ellipse cx="50" cy="50" rx="44" ry="20" fill="none" stroke="url(#ksV)" stroke-width="1.4" transform="rotate(-26 50 50)" opacity=".8"/>
      <circle cx="50" cy="50" r="36" fill="none" stroke="url(#ksV)" stroke-width="2.2"/>
      <circle cx="50" cy="50" r="30.5" fill="none" stroke="url(#ksV)" stroke-width="3.6" stroke-dasharray="1.5 14.46"/>
      <line x1="50" y1="50" x2="50" y2="24" stroke="url(#ksV)" stroke-width="2.8" stroke-linecap="round"/>
      <line x1="50" y1="50" x2="65" y2="58" stroke="url(#ksV)" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="86" cy="38" r="5.4" fill="url(#ksSph)"/><circle cx="50" cy="50" r="3.8" fill="url(#ksSph)"/>
    </svg></div>
    <div class="wm metal-text"><span class="k">KRONO</span><span class="s">SPACE</span></div>
    <div class="sub">Time × Space</div>
    <div class="form">
      <div class="field">${ic('at')}${bar('60%')}</div>
      <div class="field">${ic('lock')}${bar('45%')}</div>
      <button class="btn-metal" data-enter><span class="metal-text">Entrar</span></button>
      <button class="btn-ghost" data-enter>Crear cuenta</button>
    </div>
  </section>`;

  // ---------- INICIO (feed) ----------
  const story = () => `<div style="flex:none;text-align:center"><span class="avatar av-56" style="background:var(--metal-bright)"><span>${ic('user')}</span></span></div>`;
  const post = () => `
    <div class="card" style="padding:0;overflow:hidden;margin-bottom:16px">
      <div class="row" style="padding:14px 14px 12px">${av('av-46')}<div class="grow stack">${bar('45%')}${bar('28%','sm')}</div>
        <svg viewBox="0 0 24 24" style="width:18px;height:18px;fill:none;stroke:url(#ksV);stroke-width:1.8;opacity:.6"><circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/></svg>
      </div>
      <div class="media wide" style="border-radius:0;border-left:0;border-right:0">${ic('image')}</div>
      <div style="padding:14px"><div class="acts">${ic('heart')}${ic('chat')}${ic('share')}</div>
        <div class="stack" style="margin-top:12px">${bar('80%','sm')}${bar('55%','sm')}</div></div>
    </div>`;
  const inicio = `
  <section class="scrn" id="scr-inicio" data-screen="inicio" data-screen-label="Inicio">
    <div class="head"><h1 class="metal-text">Inicio</h1>
      <div class="h-actions"><button class="iconbtn">${ic('search')}</button><button class="iconbtn badge">${ic('chat')}</button></div></div>
    <div class="chips" style="margin-bottom:18px">${story()}${story()}${story()}${story()}${story()}</div>
    ${post()}${post()}
  </section>`;

  // ---------- PERFIL ----------
  const stat = () => `<div style="text-align:center" class="stack">${bar('38px','lg')}<div style="height:4px"></div>${bar('54px','sm')}</div>`;
  const perfil = `
  <section class="scrn" id="scr-perfil" data-screen="perfil" data-screen-label="Perfil">
    <div class="head"><h1 class="metal-text">Perfil</h1><button class="iconbtn">${ic('gear')}</button></div>
    <div class="media wide" style="aspect-ratio:16/7;margin-bottom:-34px"></div>
    <div style="display:flex;flex-direction:column;align-items:center;position:relative">
      <span class="avatar" style="width:80px;height:80px"><span>${ic('user')}</span></span>
      <div class="stack" style="align-items:center;margin-top:12px">${bar('120px','lg')}${bar('80px','sm')}</div>
    </div>
    <div class="row spread" style="margin:20px 24px 18px">${stat()}${stat()}${stat()}</div>
    <div class="row" style="gap:10px;margin-bottom:18px">
      <button class="btn-metal" style="flex:1"><span class="metal-text" style="font-size:13px">Editar</span></button>
      <button class="btn-ghost" style="flex:1">Compartir</button></div>
    <div class="grid-3">${Array(9).fill('<div class="media sq"></div>').join('')}</div>
  </section>`;

  // ---------- MENSAJE ----------
  const chat = () => `<div class="row" style="padding:13px 4px;border-bottom:1px solid var(--line)">${av('av-46')}
    <div class="grow stack">${bar('50%')}${bar('72%','sm')}</div>
    <div class="stack" style="align-items:flex-end;gap:8px">${bar('30px','sm')}<span style="width:8px;height:8px;border-radius:50%;background:var(--metal-bright)"></span></div></div>`;
  const roomCard = () => `<div class="tile" style="flex:none;width:120px"><div class="media" style="aspect-ratio:1;border-radius:0;border:0">${ic('play')}</div><div style="padding:10px" class="stack">${bar('80%','sm')}${bar('50%','sm')}</div></div>`;
  const mensaje = `
  <section class="scrn" id="scr-mensaje" data-screen="mensaje" data-screen-label="Mensaje">
    <div class="head"><h1 class="metal-text">Mensaje</h1><button class="iconbtn">${ic('plus')}</button></div>
    <div class="field" style="margin-bottom:20px">${ic('search')}${bar('40%')}</div>
    <div class="section-t">Salas multimedia</div>
    <div class="chips" style="margin-bottom:22px">${roomCard()}${roomCard()}${roomCard()}</div>
    <div class="section-t">Chats</div>
    ${Array(6).fill(0).map(chat).join('')}
  </section>`;

  // ---------- NOTIFICA ----------
  const noti = (k) => `<div class="row" style="padding:14px 0;border-bottom:1px solid var(--line)">
    <span class="iconbtn" style="cursor:default">${ic(k)}</span>
    <div class="grow stack">${bar('85%','sm')}${bar('40%','sm')}</div><div>${bar('26px','sm')}</div></div>`;
  const notifica = `
  <section class="scrn" id="scr-notifica" data-screen="notifica" data-screen-label="Notifica">
    <div class="head"><h1 class="metal-text">Notifica</h1><button class="iconbtn">${ic('gear')}</button></div>
    <div class="section-t">Hoy</div>${noti('heart')}${noti('user')}${noti('chat')}
    <div class="section-t" style="margin-top:20px">Antes</div>${noti('cart')}${noti('spark')}${noti('bell')}
  </section>`;

  // ---------- MARKET ----------
  const prod = () => `<div class="tile"><div class="media" style="aspect-ratio:1;border-radius:0;border:0">${ic('image')}</div>
    <div style="padding:12px" class="stack">${bar('70%','sm')}<div class="row spread" style="margin-top:4px">${bar('40px','lg')}<span class="iconbtn" style="width:30px;height:30px">${ic('plus')}</span></div></div></div>`;
  const market = `
  <section class="scrn" id="scr-market" data-screen="market" data-screen-label="Market">
    <div class="head"><h1 class="metal-text">Market</h1><button class="iconbtn badge">${ic('cart')}</button></div>
    <div class="field" style="margin-bottom:16px">${ic('search')}${bar('45%')}</div>
    <div class="chips" style="margin-bottom:20px"><span class="chip on">Todo</span><span class="chip">—</span><span class="chip">—</span><span class="chip">—</span></div>
    <div class="grid-2">${Array(6).fill(0).map(prod).join('')}</div>
  </section>`;

  // ---------- GAME ----------
  const gameTile = () => `<div class="tile"><div class="media" style="aspect-ratio:1;border-radius:0;border:0">${ic('pad')}</div>
    <div style="padding:11px" class="stack">${bar('65%','sm')}${bar('40%','sm')}</div></div>`;
  const game = `
  <section class="scrn" id="scr-game" data-screen="game" data-screen-label="Game">
    <div class="head"><h1 class="metal-text">Game</h1><button class="iconbtn">${ic('search')}</button></div>
    <div class="tile" style="margin-bottom:22px"><div class="media wide" style="border:0;border-radius:0">${ic('play')}</div>
      <div style="padding:16px"><div class="row spread"><div class="stack grow">${bar('55%')}${bar('30%','sm')}</div>
      <button class="btn-metal" style="width:auto"><span class="metal-text" style="font-size:12px;padding:0 22px">Jugar</span></button></div></div></div>
    <div class="section-t">Populares</div>
    <div class="grid-2">${Array(4).fill(0).map(gameTile).join('')}</div>
  </section>`;

  // ---------- PUBLICA (IA generativa) ----------
  const createOpt = (k,big) => `<div class="tile" style="${big?'grid-column:span 2':''}"><div style="padding:18px" class="row" style="gap:14px">
    <span class="iconbtn" style="width:44px;height:44px;background:var(--metal)">${ic(k).replace('class=""','')}</span>
    <div class="grow stack">${bar(big?'40%':'70%')}${bar(big?'60%':'45%','sm')}</div></div></div>`;
  const scriptRow = () => `<div class="row" style="padding:13px 0;border-bottom:1px solid var(--line)">
    <span class="iconbtn" style="cursor:default">${ic('doc')}</span><div class="grow stack">${bar('72%','sm')}${bar('38%','sm')}</div>
    <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:none;stroke:url(#ksV);stroke-width:1.8;opacity:.5"><path d="M9 6l6 6-6 6"/></svg></div>`;
  const publica = `
  <section class="scrn" id="scr-publica" data-screen="publica" data-screen-label="Publica">
    <div class="head"><h1 class="metal-text">Publica</h1></div>
    <div class="section-t">Crear con IA</div>
    <div class="grid-2" style="margin-bottom:8px">
      <div class="tile"><div style="padding:18px" class="stack" style="gap:12px"><span class="iconbtn" style="width:42px;height:42px;background:var(--metal)">${ic('image')}</span>${bar('75%','sm')}</div></div>
      <div class="tile"><div style="padding:18px" class="stack" style="gap:12px"><span class="iconbtn" style="width:42px;height:42px;background:var(--metal)">${ic('film')}</span>${bar('70%','sm')}</div></div>
      <div class="tile"><div style="padding:18px" class="stack" style="gap:12px"><span class="iconbtn" style="width:42px;height:42px;background:var(--metal)">${ic('filter')}</span>${bar('60%','sm')}</div></div>
      <div class="tile"><div style="padding:18px" class="stack" style="gap:12px"><span class="iconbtn" style="width:42px;height:42px;background:var(--metal)">${ic('spark')}</span>${bar('80%','sm')}</div></div>
    </div>
    <button class="btn-metal" style="margin:14px 0 24px"><span class="metal-text">Publicación nueva</span></button>
    <div class="section-t">Generador de guiones · listado</div>
    ${Array(5).fill(0).map(scriptRow).join('')}
  </section>`;

  window.KS_SCREENS = login + inicio + perfil + mensaje + notifica + market + game + publica;
})();
