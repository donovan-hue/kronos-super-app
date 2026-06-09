import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * RadialMenu — menú en abanico metálico (plata) único para celular, tablet y PC.
 * Botón flotante abajo-centro; al tocarlo despliega 6 burbujas principales en
 * semicírculo hacia arriba. Las que tienen hijos despliegan un segundo nivel
 * (drill-down) y el botón central funciona como "atrás". Reemplaza la barra
 * lateral y los 4 botones de esquina.
 */

// 6 categorías principales (mismas 6 del diseño abanico). Las que tienen
// `children` despliegan un segundo nivel al tocarlas.
const MENU = [
  { id: 'home',   label: 'Inicio',  emoji: '🏠', to: '/feed' },
  { id: 'me',     label: 'Perfil',  emoji: '👤', children: [
      { label: 'Mi perfil',      emoji: '👤', to: '/profile/me' },
      { label: 'Notificaciones', emoji: '🔔', to: '/notifications' },
      { label: 'Gamificación',   emoji: '🏆', to: '/gamification' },
      { label: 'Avatar',         emoji: '🧑‍🚀', to: '/avatar' },
      { label: 'Ajustes',        emoji: '⚙️', to: '/settings' },
  ] },
  { id: 'social', label: 'Social',  emoji: '💬', children: [
      { label: 'Mensajes',    emoji: '💬', to: '/social/chat' },
      { label: 'Comunidades', emoji: '🏘️', to: '/communities' },
      { label: 'LIVE',        emoji: '🔴', to: '/live' },
  ] },
  { id: 'market', label: 'Mercado', emoji: '🛍️', children: [
      { label: 'Tienda',        emoji: '🛒', to: '/shop' },
      { label: 'Marketplace',   emoji: '🛍️', to: '/marketplace' },
      { label: 'Wallet',        emoji: '💰', to: '/wallet' },
      { label: 'Reservaciones', emoji: '📅', to: '/reservations' },
  ] },
  { id: 'create', label: 'Crear',   emoji: '🎬', children: [
      { label: 'Video',   emoji: '🎬', to: '/video-editor' },
      { label: 'Eventos', emoji: '🎪', to: '/events' },
      { label: 'Health',  emoji: '❤️', to: '/health' },
  ] },
  { id: 'search', label: 'Buscar',  emoji: '🔍', to: '/search' },
];

// Ángulos en semicírculo superior (270° = arriba). Reparte N burbujas.
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
        .rm-face span{ font-size:22px; filter:drop-shadow(0 1px 1px rgba(0,0,0,.6)); }
        .rm-center .rm-face span{ font-size:26px; }
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
              <span className="rm-face"><span>{it.emoji}</span></span>
              <span className="rm-label">{it.label}</span>
            </button>
          );
        })}

        <button className="rm-btn rm-center" onClick={onCenter} aria-label={active ? 'Atrás' : (open ? 'Cerrar menú' : 'Abrir menú')}>
          <span className="rm-face"><span>{active ? '←' : (open ? '✕' : 'K')}</span></span>
        </button>
      </nav>
    </>
  );
}
