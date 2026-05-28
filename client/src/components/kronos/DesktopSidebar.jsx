import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const NAV_ITEMS = [
  { emoji: '🏠', label: 'Inicio',          to: '/feed' },
  { emoji: '🔍', label: 'Buscar',           to: '/search' },
  { emoji: '💬', label: 'Mensajes',         to: '/social/chat' },
  { emoji: '🔔', label: 'Notificaciones',   to: '/notifications' },
  { emoji: '🏘️', label: 'Comunidades',      to: '/communities' },
  { emoji: '🛒', label: 'Tienda',           to: '/shop' },
  { emoji: '🛍️', label: 'Marketplace',      to: '/marketplace' },
  { emoji: '💰', label: 'Wallet',           to: '/wallet' },
  { emoji: '🔴', label: 'LIVE',             to: '/live' },
  { emoji: '❤️', label: 'Health',           to: '/health' },
  { emoji: '🎮', label: 'Avatar',           to: '/avatar' },
  { emoji: '📅', label: 'Reservaciones',    to: '/reservations' },
  { emoji: '🎬', label: 'Video Editor',     to: '/video-editor' },
  { emoji: '🎪', label: 'Eventos',          to: '/events' },
  { emoji: '🏆', label: 'Gamificación',     to: '/gamification' },
  { emoji: '⚙️', label: 'Ajustes',          to: '/settings' },
  { emoji: '◈',  label: 'AXIS Studio',      to: '/axis',     premium: true },
];

function SidebarItem({ item, isActive }) {
  const [hovered, setHovered] = useState(false);
  const active = isActive || hovered;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        padding: '8px 12px',
        borderRadius: 13,
        background: isActive
          ? 'linear-gradient(135deg, rgba(212,175,55,0.14), rgba(212,175,55,0.06))'
          : hovered ? 'rgba(212,175,55,0.06)' : 'transparent',
        border: isActive
          ? '1px solid rgba(212,175,55,0.3)'
          : `1px solid ${hovered ? 'rgba(212,175,55,0.12)' : 'transparent'}`,
        boxShadow: isActive ? '0 0 16px rgba(212,175,55,0.12), inset 0 1px 0 rgba(255,255,255,0.03)' : 'none',
        transition: 'all 0.17s ease',
        cursor: 'pointer',
      }}
    >
      {/* Icono contenedor */}
      <div style={{
        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
        background: isActive
          ? 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.08))'
          : 'rgba(255,255,255,0.04)',
        border: isActive
          ? '1px solid rgba(212,175,55,0.4)'
          : '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16,
        boxShadow: isActive ? '0 0 12px rgba(212,175,55,0.2)' : 'none',
        transition: 'all 0.17s',
      }}>
        {item.emoji}
      </div>

      <span style={{
        color: isActive ? '#F0D060' : hovered ? 'rgba(240,240,248,0.85)' : 'rgba(240,240,248,0.5)',
        fontWeight: isActive ? 700 : 400,
        fontSize: 13,
        fontFamily: "'Outfit', sans-serif",
        letterSpacing: 0.2,
        transition: 'color 0.17s',
        flex: 1,
      }}>
        {item.label}
      </span>

      {item.premium && !isActive && (
        <span style={{
          fontSize: 8, fontWeight: 700, padding: '2px 5px', borderRadius: 6,
          background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)',
          color: 'rgba(212,175,55,0.6)', letterSpacing: 0.5,
        }}>PRO</span>
      )}

      {/* Indicador activo */}
      {isActive && (
        <div style={{
          marginLeft: 'auto',
          width: 4, height: 4, borderRadius: '50%',
          background: '#D4AF37',
          boxShadow: '0 0 8px rgba(212,175,55,0.8)',
        }} />
      )}
    </div>
  );
}

export default function DesktopSidebar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const userId = user?._id || user?.id;

  return (
    <aside className="kronos-sidebar" style={{ background: 'rgba(8,8,15,0.98)' }}>

      {/* Logo */}
      <div
        onClick={() => navigate('/feed')}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', marginBottom: 20, cursor: 'pointer',
          borderRadius: 14,
          background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.03))',
          border: '1px solid rgba(212,175,55,0.15)',
        }}
      >
        {/* K logo */}
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg, #A08820, #D4AF37, #F0D060)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 17, fontWeight: 900, color: '#0a0a0f',
          boxShadow: '0 0 20px rgba(212,175,55,0.4)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Brillo */}
          <div style={{
            position: 'absolute', top: 4, left: 6, width: 16, height: 8,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.5), transparent 70%)',
          }} />
          K
        </div>
        <div>
          <div style={{
            fontWeight: 900, fontSize: 17, letterSpacing: 1,
            background: 'linear-gradient(90deg, #A08820, #D4AF37, #F0D060, #D4AF37)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            animation: 'k-gold-shift 5s ease-in-out infinite',
          }}>
            KRONOS
          </div>
          <div style={{ fontSize: 9, color: 'rgba(212,175,55,0.45)', letterSpacing: 0.5, marginTop: -1 }}>
            SUPER APP
          </div>
        </div>
      </div>

      {/* Línea separadora dorada */}
      <div style={{
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)',
        marginBottom: 12,
      }} />

      {/* Nav items */}
      {NAV_ITEMS.map(item => (
        <NavLink key={item.to} to={item.to} style={{ textDecoration: 'none' }}>
          {({ isActive }) => <SidebarItem item={item} isActive={isActive} />}
        </NavLink>
      ))}

      <div style={{ flex: 1 }} />

      {/* User card */}
      {user && (
        <div style={{ borderTop: '1px solid rgba(212,175,55,0.08)', paddingTop: 16, marginTop: 8 }}>
          <div
            onClick={() => navigate(userId ? `/profile/${userId}` : '/profile/me')}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 14, cursor: 'pointer', marginBottom: 8,
              background: 'linear-gradient(135deg, rgba(212,175,55,0.06), rgba(212,175,55,0.02))',
              border: '1px solid rgba(212,175,55,0.12)',
              transition: 'border-color 0.2s',
            }}
          >
            <div style={{
              width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #A08820, #D4AF37)',
              padding: 2,
              boxShadow: '0 0 10px rgba(212,175,55,0.3)',
            }}>
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || 'K')}&background=1a1a2e&color=D4AF37&size=34`}
                alt=""
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid rgba(8,8,15,0.8)' }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#F0D060', fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.firstName || user.username}
              </div>
              <div style={{ color: 'rgba(212,175,55,0.45)', fontSize: 11 }}>@{user.username}</div>
            </div>
          </div>

          <button
            onClick={logout}
            style={{
              width: '100%', padding: '8px', borderRadius: 10,
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.15)',
              color: 'rgba(239,68,68,0.7)',
              fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.2s',
            }}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </aside>
  );
}
