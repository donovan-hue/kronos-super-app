/* ===================== KRONOSPACE · WEB · módulo 2 (Shop · Admin · Utilitarias) ===================== */
(function(){
  const G = {
    search:'<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
    image:'<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="8.5" cy="9.5" r="1.8"/><path d="M4 17l5-5 4 3 3-3 4 4"/>',
    cart:'<path d="M3.2 4.5H5.4L7.3 15h9.1l1.7-7.4H6.1"/><circle cx="9" cy="18.6" r="1.3"/><circle cx="16" cy="18.6" r="1.3"/>',
    trash:'<path d="M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13"/>',
    user:'<circle cx="12" cy="8" r="3.6"/><path d="M5.4 19.6a6.6 6.6 0 0 1 13.2 0"/>',
    card:'<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3 10h18M6.5 14.5h4"/>',
    truck:'<path d="M3 6h11v9H3zM14 9h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.6"/><circle cx="17.5" cy="17.5" r="1.6"/>',
    lock:'<rect x="5" y="10" width="14" height="10" rx="2.5"/><path d="M8 10V8a4 4 0 0 1 8 0v2"/>',
    at:'<circle cx="12" cy="12" r="4"/><path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1"/>',
    check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    x:'<path d="M6 6l12 12M18 6 6 18"/>',
    arrow:'<path d="M15 6l-6 6 6 6"/>',
    chev:'<path d="M9 6l6 6-6 6"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/>',
    flag:'<path d="M6 3v18M6 4h11l-2 3.5 2 3.5H6"/>',
    doc:'<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h6M10 16h6"/>',
    shield:'<path d="M12 3l7 3v5c0 4.4-3 8-7 10-4-2-7-5.6-7-10V6Z"/>',
    bag:'<path d="M6 8h12l-1 12H7Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'
  };
  const ic  = (k,style='') => `<svg viewBox="0 0 24 24" ${style?`style="${style}"`:''}>${G[k]}</svg>`;
  const sic = 'fill:none;stroke:url(#ksV);stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round';
  const bar = (w,c='') => `<div class="ph-bar ${c}" style="width:${w}"></div>`;
  const av  = (sz='av-46') => `<span class="avatar ${sz}"><span><svg viewBox="0 0 24 24" style="${sic};opacity:.55">${G.user}</svg></span></span>`;
  const star = (on) => `<span class="${on?'on':'off'}"><svg viewBox="0 0 24 24"><path d="M12 3l2.6 6.3L21 10l-4.8 4.1L17.6 21 12 17.3 6.4 21l1.4-6.9L3 10l6.4-.7Z"/></svg></span>`;
  const stars = (n) => `<span class="stars">${[1,2,3,4,5].map(i=>star(i<=n)).join('')}</span>`;
  const logoSVG = `<svg viewBox="0 0 100 100">
    <ellipse cx="50" cy="50" rx="44" ry="20" fill="none" stroke="url(#ksV)" stroke-width="1.4" transform="rotate(-26 50 50)" opacity=".8"/>
    <circle cx="50" cy="50" r="36" fill="none" stroke="url(#ksV)" stroke-width="2.2"/>
    <circle cx="50" cy="50" r="30.5" fill="none" stroke="url(#ksV)" stroke-width="3.6" stroke-dasharray="1.5 14.46"/>
    <line x1="50" y1="50" x2="50" y2="24" stroke="url(#ksV)" stroke-width="2.8" stroke-linecap="round"/>
    <line x1="50" y1="50" x2="65" y2="58" stroke="url(#ksV)" stroke-width="2.2" stroke-linecap="round"/>
    <circle cx="86" cy="38" r="5.4" fill="url(#ksSph)"/><circle cx="50" cy="50" r="3.8" fill="url(#ksSph)"/></svg>`;
  const stepper = (q=1) => `<div class="stepper"><button data-step="-1">−</button><span class="qv">${q}</span><button data-step="1">+</button></div>`;
  const field = (g,w='60%') => `<div class="field">${ic(g,sic)}${bar(w)}</div>`;

  /* ===================== A · CATÁLOGO /shop ===================== */
  const prod = () => `<div class="tile" data-go="product">
    <div class="media sq" style="border:0;border-radius:0">${ic('image',sic+';opacity:.4;width:34px;height:34px')}</div>
    <div style="padding:16px" class="stack">${bar('80%','sm')}${bar('55%','sm')}
      <div class="row spread" style="margin-top:10px"><span class="price metal-text" style="font-size:17px">$ —</span>
        <button class="iconbtn" style="width:38px;height:38px" data-addcart data-stop>${ic('plus',sic)}</button></div></div></div>`;
  const shop = `
  <section class="scrn" id="scr-shop" data-screen="shop" data-screen-label="Shop">
    <div class="page-h"><div><div class="crumb">Marketplace · Stripe</div><h1 class="metal-text">Catálogo</h1></div>
      <div class="row"><div class="field" style="width:280px">${ic('search',sic+';opacity:.65')}${bar('50%')}</div>
        <button class="btn-ghost" data-go="orders">Mis pedidos</button>
        <button class="iconbtn badge" data-go="cart">${ic('cart',sic)}</button></div></div>
    <div class="chips" style="margin-bottom:24px"><span class="chip on">Todo</span><span class="chip">Nuevos</span><span class="chip">Populares</span><span class="chip">Ofertas</span><span class="chip">Accesorios</span></div>
    <div class="prod-grid">${Array(9).fill(0).map(prod).join('')}</div>
  </section>`;

  /* ===================== B · DETALLE /shop/product ===================== */
  const reviewItem = (n) => `<div class="review">${av('av-46')}
    <div class="grow stack" style="gap:10px"><div class="row spread">${bar('120px','sm')}${stars(n)}</div>
      ${bar('92%','sm')}${bar('70%','sm')}</div></div>`;
  const product = `
  <section class="scrn" id="scr-product" data-screen="product" data-screen-label="Producto">
    <button class="backlink" data-go="shop" style="margin-bottom:24px">${ic('arrow')}Volver al catálogo</button>
    <div class="product-grid">
      <div class="product-media">
        <div class="media wide" style="aspect-ratio:1">${ic('image',sic+';opacity:.4;width:42px;height:42px')}</div>
        <div class="thumbs">
          <div class="media on">${ic('image',sic+';opacity:.4;width:22px;height:22px')}</div>
          <div class="media">${ic('image',sic+';opacity:.4;width:22px;height:22px')}</div>
          <div class="media">${ic('image',sic+';opacity:.4;width:22px;height:22px')}</div>
          <div class="media">${ic('image',sic+';opacity:.4;width:22px;height:22px')}</div>
        </div>
      </div>
      <div>
        <div class="crumb" style="margin-bottom:14px">KRONOSPACE · Edición metálica</div>
        <div class="stack" style="gap:13px">${bar('85%','lg')}${bar('60%','sm')}</div>
        <div class="row" style="gap:14px;margin:18px 0">${stars(4)}<span style="font-size:12px;color:var(--silver-faint);letter-spacing:.08em">128 reseñas</span></div>
        <div class="price metal-text" style="font-family:'Space Grotesk';font-weight:600;font-size:34px">$ —</div>

        <div class="prop"><div class="section-t">Color</div>
          <div class="swatches">
            <button class="swatch sw-silver on"><i></i></button><button class="swatch sw-graph"><i></i></button>
            <button class="swatch sw-pearl"><i></i></button><button class="swatch sw-ink"><i></i></button></div></div>

        <div class="prop"><div class="section-t">Talla</div>
          <div class="sizes"><button class="sizebox">S</button><button class="sizebox on">M</button><button class="sizebox">L</button><button class="sizebox">XL</button></div></div>

        <div class="prop"><div class="section-t">Cantidad</div>${stepper(1)}</div>

        <div class="row" style="gap:14px;margin-top:26px">
          <button class="btn-metal" data-addcart data-go="cart"><span class="metal-text" style="padding:0 44px">Agregar al carrito</span></button>
          <button class="btn-ghost">Comprar ahora</button>
        </div>
      </div>
    </div>
    <div style="margin-top:54px">
      <div class="section-t">Reseñas de clientes</div>
      <div class="card" style="padding:6px 24px">${reviewItem(5)}${reviewItem(4)}${reviewItem(5)}</div>
    </div>
  </section>`;

  /* ===================== C · CARRITO /shop/cart ===================== */
  const cartline = () => `<div class="cartline">
    <div class="media sq">${ic('image',sic+';opacity:.4;width:30px;height:30px')}</div>
    <div class="grow stack" style="gap:9px">${bar('60%')}${bar('40%','sm')}<span class="price metal-text" style="font-size:16px">$ —</span></div>
    ${stepper(1)}
    <button class="iconbtn" data-removeline>${ic('trash',sic)}</button></div>`;
  const cart = `
  <section class="scrn" id="scr-cart" data-screen="cart" data-screen-label="Carrito">
    <button class="backlink" data-go="shop" style="margin-bottom:24px">${ic('arrow')}Seguir comprando</button>
    <div class="page-h"><div><div class="crumb">Marketplace</div><h1 class="metal-text">Carrito</h1></div></div>
    <div class="cart-grid">
      <div class="card" style="padding:6px 24px" id="cartlines">${cartline()}${cartline()}${cartline()}</div>
      <aside class="card col-sticky">
        <div class="section-t">Resumen</div>
        <div class="summary">
          <div class="ln">Subtotal <span class="v">$ —</span></div>
          <div class="ln free">Envío <span class="v">GRATIS</span></div>
          <div class="ln">Impuesto (IVA 16%) <span class="v">$ —</span></div>
          <div class="div"></div>
          <div class="ln total">Total <span class="v metal-text">$ —</span></div>
        </div>
        <button class="btn-metal" data-go="checkout" style="margin-top:24px;width:100%"><span class="metal-text">Ir a pagar</span></button>
      </aside>
    </div>
  </section>`;

  /* ===================== D · CHECKOUT /shop/checkout ===================== */
  const fblock = (label,g,w) => `<div><div class="flabel">${label}</div>${field(g,w)}</div>`;
  const checkout = `
  <section class="scrn" id="scr-checkout" data-screen="checkout" data-screen-label="Checkout">
    <button class="backlink" data-go="cart" style="margin-bottom:24px">${ic('arrow')}Volver al carrito</button>
    <div class="page-h"><div><div class="crumb">Pago seguro · Stripe</div><h1 class="metal-text">Checkout</h1></div></div>
    <div class="checkout-grid">
      <div class="stack" style="gap:30px">
        <div class="card">
          <div class="row" style="gap:12px;margin-bottom:20px">${ic('truck',sic+';width:22px;height:22px')}<span class="section-t" style="margin:0">Datos de envío</span></div>
          <div class="formgrid">
            ${fblock('Nombre','user','80%')}${fblock('Apellido','user','80%')}
            <div class="full">${fblock('Dirección','truck','90%')}</div>
            ${fblock('Ciudad','truck','70%')}${fblock('Código postal','truck','50%')}
          </div>
        </div>
        <div class="card">
          <div class="row" style="gap:12px;margin-bottom:20px">${ic('card',sic+';width:22px;height:22px')}<span class="section-t" style="margin:0">Datos de pago</span></div>
          <div class="formgrid">
            <div class="full">${fblock('Número de tarjeta','card','85%')}</div>
            ${fblock('Vencimiento','card','50%')}${fblock('CVC','lock','40%')}
          </div>
        </div>
      </div>
      <aside class="card col-sticky">
        <div class="section-t">Tu orden</div>
        <div class="summary" style="margin-bottom:8px">
          <div class="ln">Subtotal <span class="v">$ —</span></div>
          <div class="ln free">Envío <span class="v">GRATIS</span></div>
          <div class="ln">Impuesto (IVA 16%) <span class="v">$ —</span></div>
          <div class="div"></div>
          <div class="ln total">Total <span class="v metal-text">$ —</span></div>
        </div>
        <button class="btn-metal" data-pay style="margin-top:20px;width:100%"><span class="metal-text">Pagar ahora</span></button>
        <button class="btn-ghost" data-go="sub-cancel" style="width:100%;margin-top:12px">Cancelar</button>
        <div class="row" style="gap:9px;justify-content:center;margin-top:18px;color:var(--silver-faint);font-size:11px;letter-spacing:.1em">
          ${ic('lock',sic+';width:14px;height:14px;opacity:.6')}<span>PAGO CIFRADO · SAT/IVA 16%</span></div>
      </aside>
    </div>
  </section>`;

  /* ===================== E · MIS PEDIDOS /shop/my-orders ===================== */
  const order = (status,cls,refund=false) => `<div class="order">
    <div class="order-h" data-orderexpand>
      <span class="iconbtn" style="cursor:default;width:44px;height:44px">${ic('bag',sic)}</span>
      <div class="grow"><div class="row" style="gap:14px">${bar('140px')}<span class="statuschip ${cls}">${status}</span></div>${bar('90px','sm')}</div>
      <span class="price metal-text" style="font-size:17px">$ —</span>
      <svg class="chev" viewBox="0 0 24 24">${G.chev}</svg></div>
    <div class="order-b"><div class="inner">
      <div class="cartline" style="padding:14px 0;border:0">
        <div class="media sq" style="width:64px;height:64px">${ic('image',sic+';opacity:.4;width:24px;height:24px')}</div>
        <div class="grow stack" style="gap:8px">${bar('50%','sm')}${bar('35%','sm')}</div><span class="price metal-text" style="font-size:15px">$ —</span></div>
      <div class="row spread">
        <button class="btn-ghost" data-refundtoggle>Solicitar reembolso</button>
        <button class="minibtn" data-refresh>Actualizar</button></div>
      <div class="refund">
        <div class="card" style="margin-top:6px">
          <div class="flabel">Motivo</div>
          <div class="field" style="margin-bottom:14px">${ic('flag',sic+';opacity:.65')}${bar('40%')}</div>
          <div class="flabel">Describe el problema</div>
          <div class="field" style="height:96px;align-items:flex-start;padding-top:16px">${bar('70%')}</div>
          <button class="btn-metal" style="margin-top:16px"><span class="metal-text">Enviar solicitud</span></button>
        </div></div>
    </div></div></div>`;
  const orders = `
  <section class="scrn" id="scr-orders" data-screen="orders" data-screen-label="Mis pedidos">
    <button class="backlink" data-go="shop" style="margin-bottom:24px">${ic('arrow')}Volver al catálogo</button>
    <div class="page-h"><div><div class="crumb">Marketplace</div><h1 class="metal-text">Mis pedidos</h1></div>
      <button class="minibtn" data-refresh>Actualizar</button></div>
    <div class="chips" style="margin-bottom:26px"><span class="chip on">Todos</span><span class="chip">Pendiente</span><span class="chip">Aprobado</span><span class="chip">Procesado</span><span class="chip">Completado</span></div>
    ${order('Completado','st-compl',true)}${order('Procesado','st-proc')}${order('Aprobado','st-aprob')}${order('Pendiente','st-pend')}${order('Rechazado','st-rech')}
  </section>`;

  window.KS_SHOP = shop + product + cart + checkout + orders;

  /* ===================== ADMIN /admin ===================== */
  const userRow = (role,active) => `<div class="drow cols-users">
    <div class="row">${av('av-40')}<div class="grow stack" style="gap:7px">${bar('120px','sm')}${bar('80px','sm')}</div></div>
    <span class="rolepill">${role}</span>
    <span class="statuschip ${active?'st-compl':'st-rech'}">${active?'Activo':'Suspendido'}</span>
    <div class="row" style="gap:8px;justify-content:flex-end">
      <button class="minibtn" data-roletoggle>Rol</button>
      <button class="minibtn ${active?'danger':''}" data-suspendtoggle>${active?'Suspender':'Activar'}</button></div></div>`;
  const contentRow = () => `<div class="drow cols-content">
    <div class="row">${av('av-40')}<div class="grow stack" style="gap:7px">${bar('60%','sm')}${bar('40%','sm')}</div></div>
    ${bar('80%','sm')}<span class="rolepill">— vistas</span>
    <button class="minibtn danger" data-removerow>Eliminar</button></div>`;
  const reportRow = () => `<div class="drow cols-reports">
    <div class="row">${ic('flag',sic+';width:20px;height:20px;opacity:.7')}<div class="grow stack" style="gap:7px">${bar('70%','sm')}${bar('45%','sm')}</div></div>
    ${bar('70%','sm')}<span class="statuschip st-pend">Abierto</span>
    <button class="minibtn" data-resolverow>Resolver</button></div>`;
  const orderRow = (status,cls) => `<div class="drow cols-orders">
    ${bar('70px','sm')}<div class="row">${av('av-40')}<div class="grow">${bar('110px','sm')}</div></div>
    <span class="price metal-text" style="font-size:14px">$ —</span>
    <span class="statuschip ${cls}">${status}</span>
    <button class="minibtn" data-orderexpand>Expandir</button></div>`;
  const kpi = (label) => `<div class="kpi"><div class="section-t" style="margin:0">${label}</div><div class="big metal-text">—</div><div class="ph-bar sm" style="width:55%;background:var(--metal)"></div></div>`;
  const admin = `
  <section class="scrn" id="scr-admin" data-screen="admin" data-screen-label="Admin">
    <div class="page-h"><div><div class="crumb">Panel de administración</div><h1 class="metal-text">Admin</h1></div>
      <div class="row" style="gap:10px">${ic('shield',sic+';width:22px;height:22px;opacity:.7')}<span class="rolepill">Acceso protegido</span></div></div>
    <div class="tabs" id="admintabs">
      <button class="tab on" data-tab="resumen">Resumen</button>
      <button class="tab" data-tab="usuarios">Usuarios</button>
      <button class="tab" data-tab="contenido">Contenido</button>
      <button class="tab" data-tab="reportes">Reportes</button>
      <button class="tab" data-tab="ordenes">Órdenes</button>
    </div>

    <div class="tabpanel on" data-panel="resumen">
      <div class="kpis">${kpi('Usuarios')}${kpi('Publicaciones')}${kpi('Órdenes')}${kpi('Ingresos')}</div>
      <div class="card"><div class="section-t">Actividad reciente</div>
        <div class="stack" style="gap:18px">
          <div class="row">${av('av-40')}<div class="grow stack" style="gap:7px">${bar('60%','sm')}${bar('35%','sm')}</div><span class="statuschip st-compl">Completado</span></div>
          <div class="row">${av('av-40')}<div class="grow stack" style="gap:7px">${bar('55%','sm')}${bar('30%','sm')}</div><span class="statuschip st-pend">Pendiente</span></div>
          <div class="row">${av('av-40')}<div class="grow stack" style="gap:7px">${bar('62%','sm')}${bar('38%','sm')}</div><span class="statuschip st-aprob">Aprobado</span></div>
        </div></div>
    </div>

    <div class="tabpanel" data-panel="usuarios">
      <div class="row spread" style="margin-bottom:20px">
        <div class="field" style="width:320px">${ic('search',sic+';opacity:.65')}${bar('50%')}</div>
        <span class="rolepill">— usuarios</span></div>
      <div class="dtable">
        <div class="thead cols-users"><span>Usuario</span><span>Rol</span><span>Estado</span><span style="text-align:right">Acciones</span></div>
        ${userRow('Admin',true)}${userRow('Usuario',true)}${userRow('Usuario',false)}${userRow('Usuario',true)}${userRow('Admin',true)}</div>
    </div>

    <div class="tabpanel" data-panel="contenido">
      <div class="dtable">
        <div class="thead cols-content"><span>Autor</span><span>Publicación</span><span>Métrica</span><span style="text-align:right">Acción</span></div>
        ${contentRow()}${contentRow()}${contentRow()}${contentRow()}</div>
    </div>

    <div class="tabpanel" data-panel="reportes">
      <div class="dtable">
        <div class="thead cols-reports"><span>Reporte</span><span>Detalle</span><span>Estado</span><span style="text-align:right">Acción</span></div>
        ${reportRow()}${reportRow()}${reportRow()}</div>
    </div>

    <div class="tabpanel" data-panel="ordenes">
      <div class="chips" style="margin-bottom:20px"><span class="chip on">Todas</span><span class="chip">Pendiente</span><span class="chip">Aprobado</span><span class="chip">Procesado</span><span class="chip">Completado</span><span class="chip">Rechazado</span></div>
      <div class="dtable">
        <div class="thead cols-orders"><span>Orden</span><span>Cliente</span><span>Total</span><span>Estado</span><span style="text-align:right">—</span></div>
        ${orderRow('Completado','st-compl')}${orderRow('Procesado','st-proc')}${orderRow('Aprobado','st-aprob')}${orderRow('Pendiente','st-pend')}${orderRow('Rechazado','st-rech')}</div>
    </div>
  </section>`;

  window.KS_ADMIN = admin;

  /* ===================== UTILITARIAS (overlays) ===================== */
  const utilCard = (id,label,title,lead,body,links='') => `
  <div class="util" id="scr-${id}" data-screen="${id}" data-screen-label="${label}">
    <div class="util-card"><div class="logo">${logoSVG}</div>
      <h2 class="metal-text">${title}</h2>${lead?`<p class="lead">${lead}</p>`:''}
      ${body}${links}</div></div>`;

  const forgot = utilCard('forgot','Recuperar','Recuperar contraseña',
    'Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.',
    `<div class="form">${field('at','60%')}
      <button class="btn-metal" data-go="reset"><span class="metal-text">Enviar enlace</span></button>
      <button class="btn-ghost" data-go="login">Volver al login</button></div>`);

  const reset = utilCard('reset','Restablecer','Restablecer contraseña',
    'Crea una contraseña nueva para tu cuenta.',
    `<div class="form">
      <div class="field">${ic('lock',sic+';opacity:.7')}${bar('55%')}</div>
      <div class="field">${ic('lock',sic+';opacity:.7')}${bar('50%')}</div>
      <button class="btn-metal" data-go="login"><span class="metal-text">Guardar</span></button>
      <button class="btn-ghost" data-go="login">El enlace expiró · Ir al login</button></div>`);

  const callback = `
  <div class="util" id="scr-callback" data-screen="callback" data-screen-label="Callback">
    <div class="util-card">
      <div class="spinner"><svg viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="none" stroke="rgba(190,200,212,.12)" stroke-width="4"/><path d="M25 5a20 20 0 0 1 20 20" fill="none" stroke="url(#ksV)" stroke-width="4" stroke-linecap="round"/></svg></div>
      <h2 class="metal-text">Autenticando…</h2>
      <p class="lead">Conectando con Google. Te redirigiremos automáticamente.</p></div></div>`;

  const subSuccess = utilCard('sub-success','Suscripción OK','¡Suscripción exitosa!',
    'Tu pago se procesó correctamente. Ya tienes acceso completo a KRONOSPACE.',
    `<div class="form">
      <div style="margin:-6px auto 22px;width:62px;height:62px;border-radius:50%;background:var(--metal);display:grid;place-items:center">
        <svg viewBox="0 0 24 24" style="width:30px;height:30px;fill:none;stroke:#15171a;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round">${G.check}</svg></div>
      <button class="btn-metal" data-go="inicio"><span class="metal-text">Continuar</span></button></div>`);

  const subCancel = utilCard('sub-cancel','Suscripción cancelada','Suscripción cancelada',
    'No se realizó ningún cargo. Puedes intentarlo de nuevo cuando quieras.',
    `<div class="form">
      <div style="margin:-6px auto 22px;width:62px;height:62px;border-radius:50%;border:1.5px solid var(--line-2);display:grid;place-items:center">
        <svg viewBox="0 0 24 24" style="width:26px;height:26px;fill:none;stroke:url(#ksV);stroke-width:2.2;stroke-linecap:round">${G.x}</svg></div>
      <button class="btn-metal" data-go="checkout"><span class="metal-text">Volver</span></button></div>`);

  /* páginas legales */
  const accItem = (n=4) => `<div class="acc"><button class="acc-h" data-acc>${bar(['58%','66%','50%','62%','54%'][n%5])}
    <svg class="pm" viewBox="0 0 24 24"><path d="M12 6v12M6 12h12"/></svg></button>
    <div class="acc-b"><div class="inner">${bar('92%','sm')}${bar('88%','sm')}${bar('80%','sm')}${bar('60%','sm')}</div></div></div>`;
  const legal = (id,label,title,otherId,otherLabel) => `
  <div class="legal" id="scr-${id}" data-screen="${id}" data-screen-label="${label}">
    <div class="legal-wrap">
      <div class="legal-top"><button class="backlink" data-go="login">${ic('arrow')}Volver</button>
        <button class="btn-ghost" data-go="${otherId}" style="padding:11px 20px">Ir a ${otherLabel}</button></div>
      <h1 class="metal-text" style="font-family:'Space Grotesk';font-weight:600;font-size:40px;margin-bottom:10px">${title}</h1>
      <p style="color:var(--silver-faint);font-size:12px;letter-spacing:.16em;text-transform:uppercase;margin-bottom:30px">Última actualización · 2026</p>
      ${[0,1,2,3,4,5].map(accItem).join('')}
    </div></div>`;
  const privacy = legal('privacy','Privacidad','Privacidad','terms','Términos');
  const terms   = legal('terms','Términos','Términos','privacy','Privacidad');

  window.KS_UTIL = forgot + reset + callback + subSuccess + subCancel + privacy + terms;
})();
