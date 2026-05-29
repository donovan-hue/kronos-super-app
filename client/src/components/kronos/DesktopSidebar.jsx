import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const NAV_ITEMS = [
  { emoji: '◇', label: 'Inicio',         to: '/feed' },
  { emoji: '◎', label: 'Buscar',          to: '/search' },
  { emoji: '▣', label: 'Mensajes',        to: '/social/chat' },
  { emoji: '◉', label: 'Notificaciones',  to: '/notifications' },
  { emoji: '⬡', label: 'Comunidades',     to: '/communities' },
  { emoji: '◈', label: 'Tienda',          to: '/shop' },
  { emoji: '◫', label: 'Marketplace',     to: '/marketplace' },
  { emoji: '◎', label: 'Wallet',          to: '/wallet' },
  { emoji: '▶', label: 'LIVE',            to: '/live' },
  { emoji: '♡', label: 'Health',          to: '/health' },
  { emoji: '◑', label: 'Avatar',          to: '/avatar' },
  { emoji: '▦', label: 'Reservaciones',   to: '/reservations' },
  { emoji: '▷', label: 'Video Editor',    to: '/video-editor' },
  { emoji: '◆', label: 'Eventos',         to: '/events' },
  { emoji: '✦', label: 'Gamificación',    to: '/gamification' },
  { emoji: '◈', label: 'AXIS Studio',     to: '/axis',     premium: true },
  { emoji: '▣', label: 'NOIR Scripts',    to: '/scripts',  premium: true },
  { emoji: '◎', label: 'Ajustes',         to: '/settings' },
];

const BUBBLE_STYLE = `
  @keyframes silver-flow {
    0%,100% { background-position: 0% 50%; }
    33%     { background-position: 100% 50%; }
    66%     { background-position: 50% 0%; }
  }
  .sb-item {
    display: flex; align-items: center; gap: 11px;
    padding: 9px 12px; border-radius: 999px;
    text-decoration: none; position: relative; isolation: isolate;
    transition: all .2s cubic-bezier(.22,1,.36,1);
    overflow: hidden; cursor: pointer;
    background: transparent;
  }
  .sb-item::before {
    content: ''; position: absolute; inset: 0; padding: 1.4px;
    border-radius: inherit;
    background: linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff,#5d626b,#c9ced6);
    background-size: 300% 300%;
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor; mask-composite: exclude;
    pointer-events: none; z-index: 2; opacity: 0;
    animation: silver-flow 5s ease-in-out infinite;
    transition: opacity .2s;
  }
  .sb-item.active, .sb-item:hover {
    background: rgba(255,255,255,.045);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    box-shadow: 0 4px 18px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.45);
  }
  .sb-item.active::before, .sb-item:hover::before { opacity: 1; }
  .sb-icon {
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; flex-shrink: 0;
    position: relative; z-index: 3;
    color: rgba(200,210,230,.5);
    transition: color .2s, filter .2s;
  }
  .sb-item.active .sb-icon, .sb-item:hover .sb-icon {
    color: rgba(233,236,241,.95);
    filter: drop-shadow(0 0 4px rgba(215,219,226,.6));
  }
  .sb-label {
    font-family: 'Sora', sans-serif; font-size: 12.5px; font-weight: 400;
    color: rgba(200,210,230,.45); letter-spacing: .3px;
    position: relative; z-index: 3;
    transition: color .2s; flex: 1;
  }
  .sb-item.active .sb-label, .sb-item:hover .sb-label {
    color: rgba(233,236,241,.9);
  }
  .sb-pro-badge {
    font-size: 8px; font-weight: 600; padding: 2px 7px; border-radius: 999px;
    background: rgba(255,255,255,.045); color: rgba(200,210,230,.6);
    position: relative; z-index: 3; letter-spacing: .5px;
    border: 1px solid rgba(200,210,230,.18);
  }
  .sb-dot {
    width: 4px; height: 4px; border-radius: 50%; margin-left: auto;
    background: rgba(233,236,241,.9);
    box-shadow: 0 0 6px rgba(255,255,255,.7);
    position: relative; z-index: 3;
  }
`;

function SidebarItem({ item, isActive }) {
  return (
    <div className={`sb-item${isActive ? ' active' : ''}`}>
      <div className="sb-icon">{item.emoji}</div>
      <span className="sb-label">{item.label}</span>
      {item.premium && <span className="sb-pro-badge">PRO</span>}
      {isActive && <div className="sb-dot" />}
    </div>
  );
}

export default function DesktopSidebar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const userId = user?._id || user?.id;

  return (
    <aside
      className="kronos-sidebar"
      style={{
        background: '#000',
        borderRight: '1px solid rgba(255,255,255,.05)',
        boxShadow: '2px 0 24px rgba(0,0,0,.9)',
      }}
    >
      <style>{BUBBLE_STYLE}</style>

      {/* Logo */}
      <div
        onClick={() => navigate('/feed')}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 14px', marginBottom: 16, cursor: 'pointer',
          position: 'relative', isolation: 'isolate',
          background: 'rgba(255,255,255,.03)',
          borderRadius: 999,
          overflow: 'hidden',
        }}
        className="sb-item"
      >
        {/* K mark */}
        <div style={{
          width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
          background: 'rgba(255,255,255,.045)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', zIndex: 3,
        }}>
          <span style={{
            fontFamily: "'Cinzel', serif", fontSize: 15, fontWeight: 700,
            background: 'linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff)',
            backgroundSize: '300% 300%',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'silver-flow 5s ease-in-out infinite',
          }}>K</span>
        </div>
        <div style={{ position: 'relative', zIndex: 3 }}>
          <div style={{
            fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 15, letterSpacing: 4,
            background: 'linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff,#5d626b,#c9ced6)',
            backgroundSize: '300% 300%',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            animation: 'silver-flow 5s ease-in-out infinite',
          }}>KRONOS</div>
          <div style={{
            fontSize: 8, color: 'rgba(200,210,230,.4)', letterSpacing: 2, marginTop: -1,
            fontFamily: "'Sora', sans-serif", textTransform: 'uppercase',
          }}>Super App</div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent)', marginBottom: 10 }} />

      {/* Nav items */}
      {NAV_ITEMS.map(item => (
        <NavLink key={item.to} to={item.to} style={{ textDecoration: 'none' }}>
          {({ isActive }) => <SidebarItem item={item} isActive={isActive} />}
        </NavLink>
      ))}

      <div style={{ flex: 1 }} />

      {/* Divider */}
      <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent)', margin: '10px 0' }} />

      {/* User */}
      {user && (
        <div style={{ padding: '4px 0' }}>
          <div
            onClick={() => navigate(userId ? `/profile/${userId}` : '/profile/me')}
            className="sb-item"
            style={{ marginBottom: 6 }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
              position: 'relative', zIndex: 3,
              border: '1px solid rgba(200,210,230,.2)',
            }}>
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || 'K')}&background=111&color=d7dbe2&size=32`}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 3 }}>
              <div style={{ color: 'rgba(233,236,241,.85)', fontWeight: 500, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: "'Sora',sans-serif" }}>
                {user.firstName || user.username}
              </div>
              <div style={{ color: 'rgba(200,210,230,.38)', fontSize: 10, fontFamily: "'Sora',sans-serif" }}>
                @{user.username}
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="sb-item"
            style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: "'Sora',sans-serif", fontSize: 12, color: 'rgba(200,210,230,.38)', justifyContent: 'center', letterSpacing: 1 }}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </aside>
  );
}
