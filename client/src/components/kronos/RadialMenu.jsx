import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * RadialMenu — menú en abanico metálico (plata) único para celular, tablet y PC.
 * Botón flotante abajo-centro; al tocarlo despliega las burbujas principales en
 * semicírculo hacia arriba. Las que tienen hijos despliegan un segundo nivel
 * (drill-down) y el botón central funciona como "atrás". Reemplaza la barra
 * lateral. Iconos de línea en plata (sin emojis de color).
 */

// ── Iconos de línea (plata vía stroke url(#ksV), definido en index.html) ──
const P = {
  home: <path d="M4 11l8-6 8 6M6 10v9h12v-9" />,
  user: <><circle cx="12" cy="8" r="3.2" /><path d="M5 19a7 7 0 0 1 14 0" /></>,
  bell: <><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" /><path d="M10 19a2 2 0 0 0 4 0" /></>,
  trophy: <><path d="M7 4h10v4a5 5 0 0 1-10 0V4z" /><path d="M5 5H3v2a3 3 0 0 0 3 3M19 5h2v2a3 3 0 0 1-3 3M10 16h4v3h-4z" /></>,
  avatar: <><circle cx="12" cy="8" r="3" /><path d="M6 20a6 6 0 0 1 12 0" /><circle cx="12" cy="12" r="9" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.5 5.5l2 2M16.5 16.5l2 2M18.5 5.5l-2 2M7.5 16.5l-2 2" /></>,
  chat: <path d="M5 6h14v9H9l-4 4z" />,
  group: <><circle cx="8" cy="9" r="2.4" /><circle cx="16" cy="9" r="2.4" /><path d="M4 18a4 4 0 0 1 8 0M12 18a4 4 0 0 1 8 0" /></>,
  live: <><circle cx="12" cy="12" r="3" /><path d="M6 6a8.5 8.5 0 0 0 0 12M18 6a8.5 8.5 0 0 1 0 12" /></>,
  bag: <><path d="M6 8h12l-1 11H7L6 8z" /><path d="M9 8a3 3 0 0 1 6 0" /></>,
  store: <><path d="M4 9l1.5-4h13L20 9" /><path d="M5 9v10h14V9" /><path d="M4 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" /></>,
  wallet: <><rect x="4" y="7" width="16" height="11" rx="2.5" /><path d="M16 12h2" /></>,
  calendar: <><rect x="4" y="6" width="16" height="14" rx="2" /><path d="M4 10h16M8 4v3M16 4v3" /></>,
  film: <><rect x="4" y="5" width="16" height="14" rx="2" /><path d="M9 5v14M15 5v14M4 9h5M4 14h5M15 9h5M15 14h5" /></>,
  ticket: <><path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1 0 4H6a2 2 0 0 1-2-2 2 2 0 0 0 0-4z" /></>,
  heart: <path d="M12 20s-7-4.3-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.7-7 9-7 9z" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></>,
  script: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.2 2" /><path d="M9 16.5l1.5-1.5 1.5 1.5 1.5-1.5 1.5 1.5" /></>,
  sparkle: <><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /><path d="M18 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" /></>,
};

function Ico({ name, big }) {
  const s = big ? 26 : 22;
  return (
    <svg viewBox="0 0 24 24" width={s} height={s}
      style={{ fill: 'none', stroke: 'url(#ksV)', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', filter: 'drop-shadow(0 1px 1px rgba(0,0,0,.6))' }}>
      {P[name]}
    </svg>
  );
}

const MENU = [
  { id: 'home',   label: 'Inicio',  icon: 'home', to: '/feed' },
  { id: 'me',     label: 'Perfil',  icon: 'user', children: [
      { label: 'Mi perfil',      icon: 'user',     to: '/profile/me' },
      { label: 'Notificaciones', icon: 'bell',     to: '/notifications' },
      { label: 'Gamificación',   icon: 'trophy',   to: '/gamification' },
      { label: 'Avatar',         icon: 'avatar',   to: '/avatar' },
      { label: 'Ajustes',        icon: 'gear',     to: '/settings' },
  ] },
  { id: 'social', label: 'Social',  icon: 'chat', children: [
      { label: 'Mensajes',    icon: 'chat',  to: '/social/chat' },
      { label: 'Comunidades', icon: 'group', to: '/communities' },
      { label: 'LIVE',        icon: 'live',  to: '/live' },
  ] },
  { id: 'market', label: 'Mercado', icon: 'bag', children: [
      { label: 'Tienda',        icon: 'store',    to: '/shop' },
      { label: 'Marketplace',   icon: 'bag',      to: '/marketplace' },
      { label: 'Wallet',        icon: 'wallet',   to: '/wallet' },
      { label: 'Reservaciones', icon: 'calendar', to: '/reservations' },
  ] },
  { id: 'create', label: 'Crear',   icon: 'film', children: [
      { label: 'Kairos',     icon: 'script',  to: '/kairos' },
      { label: 'Estudio IA', icon: 'sparkle', to: '/studio' },
      { label: 'Video',      icon: 'film',    to: '/video-editor' },
      { label: 'Eventos',    icon: 'ticket',  to: '/events' },
      { label: 'Health',     icon: 'heart',   to: '/health' },
  ] },
  { id: 'search', label: 'Buscar',  icon: 'search', to: '/search' },
];

// Ángulos en semicírculo superior. Reparte N burbujas.
function arcAngles(n) {
  if (n === 1) return [270];
  const start = 200, end = 340; // arco hacia arriba
  const step = (end - start) / (n - 1);
  return Array.from({ length: n }, (_, i) => start + i * step);
}

export default function RadialMenu() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null); // categoría desplegada (2º nivel)

  const items = active ? active.children : MENU;
  const angles = arcAngles(items.length);
  const radius = 120;

  const close = useCallback(() => { setOpen(false); setActive(null); }, []);

  const onCenter = () => {
    if (active) { setActive(null); return; } // "atrás" al primer nivel
    setOpen((o) => !o);
  };

  const onItem = (it) => {
    if (it.children) { setActive(it); return; }
    if (it.to) { navigate(it.to); close(); }
  };

  return (
    <>
      <style>{`
        :root{
          --rm-metal: conic-gradient(from 138deg,#54585d 0%,#c9ced4 11%,#fff 19%,#9aa0a7 29%,#686c71 41%,#e9ecf0 54%,#b4b9c0 65%,#f5f7f9 77%,#7e8288 89%,#54585d 100%);
        }
        .rm-wrap{ position:fixed; left:50%; bottom:26px; transform:translateX(-50%); z-index:1000; pointer-events:none; }
        .rm-backdrop{ position:fixed; inset:0; z-index:999; background:rgba(4,4,6,.55); backdrop-filter:blur(3px);
          opacity:0; pointer-events:none; transition:opacity .35s ease; }
        .rm-backdrop.show{ opacity:1; pointer-events:auto; }
        .rm-btn{ position:absolute; left:50%; bottom:0; transform:translate(-50%,0);
          border:0; padding:2.5px; border-radius:50%; cursor:pointer; background:var(--rm-metal); pointer-events:auto;
          box-shadow:0 14px 30px -8px rgba(0,0,0,.85),0 2px 6px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.04);
          transition:transform .5s cubic-bezier(.2,1.1,.3,1), opacity .4s ease; }
        .rm-center{ width:62px; height:62px; z-index:6; }
        .rm-sat{ width:54px; height:54px; opacity:0; transform:translate(-50%,0) scale(.3);
          transition:transform .5s cubic-bezier(.2,1.12,.32,1), opacity .35s ease; }
        .rm-open .rm-sat{ opacity:1; }
        .rm-face{ width:100%; height:100%; border-radius:50%; display:grid; place-items:center;
          background:radial-gradient(122% 120% at 32% 22%,#26282b 0%,#17181a 36%,#0b0c0d 72%,#050506 100%);
          box-shadow:inset 0 1.5px 1.5px rgba(255,255,255,.22),inset 0 -10px 18px rgba(0,0,0,.65),inset 0 0 0 1px rgba(0,0,0,.45);
          position:relative; }
        .rm-ctext{ font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:22px;
          background:linear-gradient(180deg,#fdfdfe,#cdd2d8 46%,#888d93 100%); -webkit-background-clip:text; background-clip:text; color:transparent; }
        .rm-label{ position:absolute; left:50%; top:calc(100% + 5px); transform:translateX(-50%);
          font-size:9.5px; font-weight:600; letter-spacing:.12em; text-transform:uppercase; white-space:nowrap;
          background:linear-gradient(180deg,#fdfdfe,#cdd2d8 46%,#888d93 100%); -webkit-background-clip:text;
          background-clip:text; color:transparent; opacity:0; transition:opacity .3s ease; }
        .rm-open .rm-sat .rm-label{ opacity:1; }
        .rm-btn:active{ transform:translate(-50%,0) scale(.94); }
        @keyframes rm-breathe{ 0%,100%{ box-shadow:0 14px 30px -8px rgba(0,0,0,.85),0 0 0 1px rgba(255,255,255,.05),0 0 16px rgba(176,186,198,.12);} 50%{ box-shadow:0 14px 30px -8px rgba(0,0,0,.85),0 0 0 1px rgba(255,255,255,.05),0 0 30px rgba(176,186,198,.28);} }
        .rm-center{ animation:rm-breathe 4s ease-in-out infinite; }
        .rm-open .rm-center{ animation:none; }
      `}</style>

      <div className={`rm-backdrop ${open ? 'show' : ''}`} onClick={close} />

      <nav className={`rm-wrap ${open ? 'rm-open' : ''}`} aria-label="Menú principal">
        {items.map((it, i) => {
          const a = angles[i] * Math.PI / 180;
          const tx = open ? Math.cos(a) * radius : 0;
          const ty = open ? Math.sin(a) * radius : 0;
          return (
            <button
              key={it.id || it.label}
              className="rm-btn rm-sat"
              style={{
                transform: `translate(calc(-50% + ${tx}px), ${ty}px) scale(${open ? 1 : 0.3})`,
                transitionDelay: `${(open ? i : items.length - i) * 45}ms`,
              }}
              onClick={() => onItem(it)}
              aria-label={it.label}
            >
              <span className="rm-face"><Ico name={it.icon} /></span>
              <span className="rm-label">{it.label}</span>
            </button>
          );
        })}

        <button className="rm-btn rm-center" onClick={onCenter} aria-label={active ? 'Atrás' : (open ? 'Cerrar menú' : 'Abrir menú')}>
          <span className="rm-face">
            {active ? <Ico name="home" big /> : (open ? <span className="rm-ctext">✕</span> : <span className="rm-ctext">K</span>)}
          </span>
        </button>
      </nav>
    </>
  );
}
