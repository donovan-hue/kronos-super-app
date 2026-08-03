/* ===================== KRONOSPACE · WEB · pantallas (placeholders neutros) ===================== */
(function(){
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
    at:'<circle cx="12" cy="12" r="4"/><path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1"/>',
    home:'<path d="M3.5 11.4 12 4l8.5 7.4"/><path d="M5.6 9.8V20h12.8V9.8"/><path d="M9.8 20v-5.2h4.4V20"/>',
    dots:'<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
    bookmark:'<path d="M7 4h10v16l-5-3.5L7 20Z"/>',
    grid:'<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'
  };
  const ic  = (k,cls='') => `<svg class="${cls}" viewBox="0 0 24 24">${G[k]}</svg>`;
  const bar = (w,c='') => `<div class="ph-bar ${c}" style="width:${w}"></div>`;
  const av  = (sz='av-46') => `<span class="avatar ${sz}"><span>${ic('user')}</span></span>`;

  /* ---------- LOGIN ---------- */
  const login = `
  <section class="scrn" id="scr-login" data-screen="login" data-screen-label="Login">
    <div class="login-card">
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
    </div>
  </section>`;

  /* ---------- INICIO (feed 3 columnas) ---------- */
  const story = () => `<div style="flex:none;text-align:center"><span class="avatar av-56" style="background:var(--metal-bright)"><span>${ic('user')}</span></span></div>`;
  const navItem = (k,label) => `<div class="navlink">${ic(k)}<span>${label}</span></div>`;
  const post = () => `
    <article class="post">
      <div class="row ph-head spread">
        <div class="row">${av('av-46')}<div class="grow stack">${bar('150px')}${bar('90px','sm')}</div></div>
        ${ic('dots','').replace('class=""','style="width:20px;height:20px;fill:none;stroke:url(#ksV);stroke-width:1.8;opacity:.6"')}
      </div>
      <div class="media wide" style="border-radius:0;border-left:0;border-right:0">${ic('image')}</div>
      <div class="ph-body">
        <div class="row spread"><div class="acts">${ic('heart')}${ic('chat')}${ic('share')}</div>${ic('bookmark','').replace('class=""','style="width:21px;height:21px;fill:none;stroke:url(#ksV);stroke-width:1.6;opacity:.7"')}</div>
        <div class="stack" style="margin-top:14px">${bar('70%','sm')}${bar('45%','sm')}</div>
      </div>
    </article>`;
  const suggestItem = () => `<div class="item">${av('av-40')}<div class="grow stack">${bar('70%','sm')}${bar('45%','sm')}</div><button class="btn-ghost" style="padding:8px 16px;font-size:11px">Seguir</button></div>`;
  const inicio = `
  <section class="scrn" id="scr-inicio" data-screen="inicio" data-screen-label="Inicio">
    <div class="page-h"><div><div class="crumb">Red Social</div><h1 class="metal-text">Inicio</h1></div></div>
    <div class="feed-grid">
      <aside class="col-sticky col-left">
        <div class="minicard">
          <div class="cover"></div>
          <div class="body"><span class="avatar av-56"><span>${ic('user')}</span></span>${bar('110px','lg')}${bar('70px','sm')}</div>
        </div>
        <div class="card" style="padding:10px">
          <div class="navlist">
            ${navItem('home','Inicio')}${navItem('user','Perfil')}${navItem('bookmark','Guardados')}${navItem('spark','Tendencias')}${navItem('gear','Ajustes')}
          </div>
        </div>
      </aside>

      <div class="col-mid">
        <div class="composer">
          <div class="row">${av('av-46')}<div class="field grow" style="border-radius:12px">${bar('40%')}</div></div>
          <div class="row spread" style="margin-top:14px">
            <div class="row" style="gap:8px"><span class="iconbtn" style="width:36px;height:36px">${ic('image')}</span><span class="iconbtn" style="width:36px;height:36px">${ic('film')}</span><span class="iconbtn" style="width:36px;height:36px">${ic('spark')}</span></div>
            <button class="btn-metal"><span class="metal-text">Publicar</span></button>
          </div>
        </div>
        <div class="chips" style="margin-bottom:22px">${story()}${story()}${story()}${story()}${story()}${story()}</div>
        ${post()}${post()}
      </div>

      <aside class="col-sticky col-right">
        <div class="suggest">
          <div class="section-t">Tendencias</div>
          <div class="stack" style="gap:16px">
            <div class="stack">${bar('40%','sm')}${bar('70%')}</div>
            <div class="stack">${bar('38%','sm')}${bar('62%')}</div>
            <div class="stack">${bar('44%','sm')}${bar('66%')}</div>
          </div>
        </div>
        <div class="suggest" style="margin-top:18px">
          <div class="section-t">A quién seguir</div>
          ${suggestItem()}${suggestItem()}${suggestItem()}
        </div>
      </aside>
    </div>
  </section>`;

  /* ---------- PERFIL ---------- */
  const stat = () => `<div class="st">${bar('46px','lg')}${bar('64px','sm')}</div>`;
  const perfil = `
  <section class="scrn" id="scr-perfil" data-screen="perfil" data-screen-label="Perfil">
    <div class="page-h"><div><div class="crumb">Red Social</div><h1 class="metal-text">Perfil</h1></div>
      <div class="row"><button class="btn-ghost">Compartir</button><button class="btn-metal"><span class="metal-text">Editar perfil</span></button></div></div>
    <div class="profile-hero">
      <div class="cover"></div>
      <div class="profile-bar">
        <span class="avatar av-72" style="width:128px;height:128px"><span>${ic('user')}</span></span>
        <div class="profile-meta">${bar('220px','lg')}${bar('150px','sm')}
          <div class="row" style="gap:18px;margin-top:6px">${bar('120px','sm')}${bar('90px','sm')}</div>
        </div>
        <div class="profile-stats">${stat()}${stat()}${stat()}</div>
      </div>
    </div>
    <div class="chips" style="margin:30px 0 6px"><span class="chip on">Publicaciones</span><span class="chip">Multimedia</span><span class="chip">Guardados</span><span class="chip">Amigos</span></div>
    <div class="gallery">${Array(8).fill('<div class="media sq tile" style="border-radius:16px">'+ic('image')+'</div>').join('')}</div>
  </section>`;

  /* ---------- MENSAJE (2 paneles) ---------- */
  const chatrow = (on='') => `<div class="chatrow ${on}">${av('av-46')}
    <div class="grow stack">${bar('60%')}${bar('80%','sm')}</div>
    <div class="stack" style="align-items:flex-end;gap:8px">${bar('34px','sm')}${on?'<span style="width:9px;height:9px;border-radius:50%;background:var(--metal-bright)"></span>':'<span style="height:9px"></span>'}</div></div>`;
  const mensaje = `
  <section class="scrn" id="scr-mensaje" data-screen="mensaje" data-screen-label="Mensaje">
    <div class="page-h"><div><div class="crumb">Mensajería · Socket.io</div><h1 class="metal-text">Mensaje</h1></div></div>
    <div class="msg-grid">
      <div class="msg-list">
        <div class="ml-head"><div class="field">${ic('search')}${bar('50%')}</div></div>
        <div class="ml-scroll">${chatrow('on')}${chatrow()}${chatrow()}${chatrow()}${chatrow()}${chatrow()}${chatrow()}${chatrow()}</div>
      </div>
      <div class="msg-conv">
        <div class="conv-head">${av('av-46')}<div class="grow stack">${bar('160px')}${bar('90px','sm')}</div>
          <span class="iconbtn">${ic('play')}</span><span class="iconbtn">${ic('dots')}</span></div>
        <div class="conv-body">
          <div class="bubble them stack">${bar('200px','sm')}${bar('140px','sm')}</div>
          <div class="bubble me stack">${bar('170px','sm')}</div>
          <div class="bubble them"><div class="media sq" style="width:200px;border:0">${ic('image')}</div></div>
          <div class="bubble me stack">${bar('120px','sm')}${bar('90px','sm')}</div>
          <div class="bubble them stack">${bar('180px','sm')}</div>
        </div>
        <div class="conv-input"><span class="iconbtn">${ic('plus')}</span><div class="field grow" style="border-radius:12px">${bar('35%')}</div><button class="btn-metal"><span class="metal-text">Enviar</span></button></div>
      </div>
    </div>
  </section>`;

  /* ---------- NOTIFICA ---------- */
  const noti = (k) => `<div class="notirow"><span class="iconbtn" style="cursor:default">${ic(k)}</span>
    <div class="grow stack">${bar('70%','sm')}${bar('35%','sm')}</div><div>${bar('40px','sm')}</div></div>`;
  const notifica = `
  <section class="scrn" id="scr-notifica" data-screen="notifica" data-screen-label="Notifica">
    <div class="page-h"><div><div class="crumb">Actividad</div><h1 class="metal-text">Notifica</h1></div>
      <button class="btn-ghost">Marcar todo leído</button></div>
    <div class="noti-wrap">
      <div class="section-t">Hoy</div>${noti('heart')}${noti('user')}${noti('chat')}
      <div class="section-t" style="margin-top:30px">Esta semana</div>${noti('cart')}${noti('spark')}${noti('bell')}${noti('share')}
    </div>
  </section>`;

  /* ---------- MARKET ---------- */
  const prod = () => `<div class="tile">
    <div class="media sq" style="border:0;border-radius:0">${ic('image')}</div>
    <div style="padding:16px" class="stack">${bar('80%','sm')}${bar('55%','sm')}
      <div class="row spread" style="margin-top:8px"><span class="price metal-text" style="font-size:17px">$ —</span><span class="iconbtn" style="width:36px;height:36px">${ic('plus')}</span></div></div></div>`;
  const fgroup = (label) => `<div class="fgroup"><div class="section-t" style="margin-bottom:12px">${label}</div><div class="stack" style="gap:11px">${bar('80%','sm')}${bar('65%','sm')}${bar('72%','sm')}</div></div>`;
  const market = `
  <section class="scrn" id="scr-market" data-screen="market" data-screen-label="Market">
    <div class="page-h"><div><div class="crumb">Marketplace · Stripe</div><h1 class="metal-text">Market</h1></div>
      <div class="row"><div class="field" style="width:280px">${ic('search')}${bar('50%')}</div><button class="iconbtn badge">${ic('cart')}</button></div></div>
    <div class="market-grid">
      <aside class="filters col-sticky">${fgroup('Categoría')}${fgroup('Precio')}${fgroup('Marca')}</aside>
      <div>
        <div class="chips" style="margin-bottom:22px"><span class="chip on">Todo</span><span class="chip">Nuevos</span><span class="chip">Populares</span><span class="chip">Ofertas</span></div>
        <div class="prod-grid">${Array(9).fill(0).map(prod).join('')}</div>
      </div>
    </div>
  </section>`;

  /* ---------- GAME ---------- */
  const gameTile = () => `<div class="tile"><div class="media sq" style="border:0;border-radius:0">${ic('pad')}</div>
    <div style="padding:14px" class="stack">${bar('70%','sm')}${bar('45%','sm')}</div></div>`;
  const game = `
  <section class="scrn" id="scr-game" data-screen="game" data-screen-label="Game">
    <div class="page-h"><div><div class="crumb">Arcade</div><h1 class="metal-text">Game</h1></div>
      <div class="field" style="width:280px">${ic('search')}${bar('50%')}</div></div>
    <div class="game-hero">
      <div class="media">${ic('play')}</div>
      <div class="overlay"><div class="stack" style="gap:12px;max-width:420px">${bar('260px','lg')}${bar('200px','sm')}${bar('150px','sm')}</div>
        <button class="btn-metal" style="align-self:flex-start"><span class="metal-text" style="padding:0 40px">Jugar ahora</span></button></div>
    </div>
    <div class="section-t">Populares</div>
    <div class="game-grid">${Array(8).fill(0).map(gameTile).join('')}</div>
  </section>`;

  /* ---------- PUBLICA (IA generativa) ---------- */
  const genTile = (k,label) => `<div class="gen-tile"><div class="gen-ic">${ic(k)}</div><div class="stack">${bar('70%')}${bar('90%','sm')}</div></div>`;
  const scriptRow = () => `<div class="scriptrow"><span class="iconbtn" style="cursor:default">${ic('doc')}</span>
    <div class="grow stack">${bar('60%','sm')}${bar('35%','sm')}</div>
    <svg viewBox="0 0 24 24" style="width:18px;height:18px;fill:none;stroke:url(#ksV);stroke-width:1.8;opacity:.5"><path d="M9 6l6 6-6 6"/></svg></div>`;
  const publica = `
  <section class="scrn" id="scr-publica" data-screen="publica" data-screen-label="Publica">
    <div class="page-h"><div><div class="crumb">IA Generativa</div><h1 class="metal-text">Publica</h1></div>
      <button class="btn-metal"><span class="metal-text">Publicación nueva</span></button></div>
    <div class="section-t">Crear con IA</div>
    <div class="gen-grid">${genTile('image','Imagen')}${genTile('film','Video')}${genTile('filter','Filtros')}${genTile('spark','Mejora')}</div>
    <div class="publica-grid" style="margin-top:34px">
      <div>
        <div class="section-t">Generador de guiones · listado principal</div>
        <div class="card" style="padding:8px 20px">${Array(7).fill(0).map(scriptRow).join('')}</div>
      </div>
      <aside class="col-sticky">
        <div class="card">
          <div class="section-t">Cola de procesamiento</div>
          <div class="stack" style="gap:16px">
            <div class="row">${ic('film','').replace('class=""','style="width:22px;height:22px;fill:none;stroke:url(#ksV);stroke-width:1.6;opacity:.6"')}<div class="grow stack">${bar('80%','sm')}<div class="ph-bar sm" style="width:60%;background:var(--metal)"></div></div></div>
            <div class="row">${ic('image','').replace('class=""','style="width:22px;height:22px;fill:none;stroke:url(#ksV);stroke-width:1.6;opacity:.6"')}<div class="grow stack">${bar('70%','sm')}<div class="ph-bar sm" style="width:35%;background:var(--metal)"></div></div></div>
          </div>
        </div>
      </aside>
    </div>
  </section>`;

  window.KS_SCREENS = login + inicio + perfil + mensaje + notifica + market + game + publica;
})();
