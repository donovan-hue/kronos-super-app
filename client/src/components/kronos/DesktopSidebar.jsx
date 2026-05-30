import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const NAV_ITEMS = [
  { icon: '👤', label: 'Perfil',         to: '/profile/me' },
  { icon: '🌐', label: 'Conexiones',     to: '/communities' },
  { icon: '📰', label: 'Feed',           to: '/feed' },
  { icon: '🔭', label: 'Explorar',       to: '/search' },
  { icon: '📱', label: 'Plataforma',     to: '/mockups' },
  { icon: '🔔', label: 'Notificaciones', to: '/notifications' },
  { icon: '📊', label: 'Estadísticas',   to: '/gamification' },
  { icon: '📡', label: 'Alcance',        to: '/analytics' },
  { icon: '🎬', label: 'Crear Reel',     to: '/video-editor' },
  { icon: '📸', label: 'Foto',           to: '/feed?type=photo' },
  { icon: '💬', label: 'Mensajes',       to: '/social/chat' },
  { icon: '📍', label: 'Ubicación',      to: '/map' },
  { icon: '🛒', label: 'Tienda',         to: '/shop' },
  { icon: '🔒', label: 'Privacidad',     to: '/settings/privacy' },
  { icon: '⚙️', label: 'Cuenta',         to: '/settings' },
  { icon: '#',  label: 'Hashtags',       to: '/search?type=hashtags' },
  { icon: '👥', label: 'Grupos',         to: '/social/groups' },
  { icon: '📸', label: 'Tomar Foto',     to: '/feed?type=photo' },
  { icon: '📍', label: 'Demografía',     to: '/settings' },
  { icon: '❤️', label: 'Likes',          to: '/notifications' },
  { icon: '🗓️', label: 'Publicaciones',  to: '/feed' },
  { icon: '📈', label: 'Compromiso',     to: '/gamification' },
  { icon: '👥', label: 'Seguidores',     to: '/profile/me' },
  { icon: '🔗', label: 'Compartidos',    to: '/feed' },
];

const SPHERE_S = `
  @keyframes silver-flow {
    0%,100%{background-position:0% 50%}33%{background-position:100% 50%}66%{background-position:50% 0%}
  }
`;

function SphereItem({ item, isActive, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        cursor: 'pointer', padding: '8px 4px',
        transition: 'transform 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
      onMouseLeave={e => e.currentTarget.style.transform = ''}
    >
      {/* Esfera */}
      <div style={{
        width: 52, height: 52, borderRadius: '50%',
        position: 'relative', isolation: 'isolate', overflow: 'hidden',
        background: isActive
          ? 'radial-gradient(circle at 35% 30%, #3a3a3a 0%, #202020 40%, #111 100%)'
          : 'radial-gradient(circle at 35% 30%, #2a2a2a 0%, #141414 40%, #080808 100%)',
        boxShadow: isActive
          ? '0 6px 20px rgba(0,0,0,0.9), 0 0 16px rgba(215,219,226,.2), inset 0 1px 0 rgba(255,255,255,.65)'
          : '0 4px 14px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,.45)',
        flexShrink: 0,
      }}>
        {/* Filo plateado */}
        <div style={{
          position: 'absolute', inset: 0, padding: '1.8px', borderRadius: '50%',
          background: 'linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff,#5d626b,#c9ced6)',
          backgroundSize: '300% 300%',
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor', maskComposite: 'exclude',
          pointerEvents: 'none',
          animation: 'silver-flow 5s ease-in-out infinite',
          opacity: isActive ? 1 : 0.75,
        }} />
        {/* Reflejo */}
        <div style={{
          position: 'absolute', top: '8%', left: '14%',
          width: '42%', height: '28%', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(255,255,255,.7) 0%, rgba(255,255,255,.15) 50%, transparent 100%)',
          filter: 'blur(1px)', transform: 'rotate(-25deg)', pointerEvents: 'none',
        }} />
        {/* Icono */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 3,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: item.icon === '#' ? 18 : 22,
          fontWeight: item.icon === '#' ? 900 : 400,
          color: 'rgba(255,255,255,0.92)',
          filter: 'drop-shadow(0 1px 3px rgba(0,0,0,.9))',
          fontFamily: item.icon === '#' ? 'Cinzel, serif' : 'inherit',
        }}>
          {item.icon}
        </div>
      </div>

      {/* Label */}
      <span style={{
        fontFamily: "'Cinzel','Sora',sans-serif",
        fontSize: 7, fontWeight: 600, letterSpacing: 0.6,
        textTransform: 'uppercase', textAlign: 'center',
        maxWidth: 60, lineHeight: 1.3,
        background: isActive
          ? 'linear-gradient(135deg,#fff,#e9ecf1,#c7ccd6)'
          : 'linear-gradient(135deg,#9aa0ab,#d7dbe2,#9aa0ab)',
        backgroundSize: '300% 300%',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'silver-flow 5s ease-in-out infinite',
      }}>
        {item.label}
      </span>
    </div>
  );
}

export default function DesktopSidebar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      className="kronos-sidebar"
      style={{
        background: '#000',
        borderRight: '1px solid rgba(255,255,255,.05)',
        boxShadow: '2px 0 24px rgba(0,0,0,.9)',
        overflowY: 'auto',
        paddingBottom: 20,
      }}
    >
      <style>{SPHERE_S}</style>

      {/* Logo KRONOS */}
      <div style={{
        padding: '20px 16px 12px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,.06)',
        marginBottom: 8,
      }}>
        <div
          onClick={() => navigate('/feed')}
          style={{ cursor: 'pointer', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
        >
          {/* K esfera grande */}
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            position: 'relative', isolation: 'isolate', overflow: 'hidden',
            background: 'radial-gradient(circle at 35% 30%, #2a2a2a 0%, #141414 40%, #080808 100%)',
            boxShadow: '0 6px 24px rgba(0,0,0,.9), 0 0 20px rgba(215,219,226,.15), inset 0 1px 0 rgba(255,255,255,.6)',
          }}>
            <div style={{
              position: 'absolute', inset: 0, padding: '1.8px', borderRadius: '50%',
              background: 'linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff,#5d626b,#c9ced6)',
              backgroundSize: '300% 300%',
              WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
              WebkitMaskComposite: 'xor', maskComposite: 'exclude',
              animation: 'silver-flow 5s ease-in-out infinite',
            }} />
            <div style={{
              position: 'absolute', top: '8%', left: '14%', width: '42%', height: '28%',
              borderRadius: '50%',
              background: 'radial-gradient(ellipse, rgba(255,255,255,.75) 0%, transparent 100%)',
              filter: 'blur(1px)', transform: 'rotate(-25deg)',
            }} />
            <div style={{
              position: 'absolute', inset: 0, zIndex: 3,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Cinzel',serif", fontSize: 22, fontWeight: 700,
              background: 'linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff)',
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'silver-flow 5s ease-in-out infinite',
            }}>K</div>
          </div>
          <span style={{
            fontFamily: "'Cinzel',serif", fontSize: 11, fontWeight: 700, letterSpacing: 4,
            background: 'linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff)',
            backgroundSize: '300% 300%',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'silver-flow 5s ease-in-out infinite',
          }}>KRONOS</span>
        </div>
      </div>

      {/* Grid de esferas — 3 columnas como en la imagen */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 4,
        padding: '0 8px',
      }}>
        {NAV_ITEMS.map(item => (
          <SphereItem
            key={item.to + item.label}
            item={item}
            isActive={location.pathname === item.to}
            onClick={() => navigate(item.to)}
          />
        ))}
      </div>

      {/* User + logout */}
      {user && (
        <div style={{
          margin: '16px 8px 0',
          borderTop: '1px solid rgba(255,255,255,.06)',
          paddingTop: 12,
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <div
            onClick={() => navigate(`/profile/${user._id || user.id}`)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
              padding: '8px 10px', borderRadius: 12,
              background: 'rgba(255,255,255,.03)',
              border: '1px solid rgba(255,255,255,.06)',
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
              border: '1px solid rgba(215,219,226,.3)',
            }}>
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username||'K')}&background=111&color=d7dbe2&size=32`}
                alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'rgba(233,236,241,.85)', fontWeight: 500, fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.firstName || user.username}
              </div>
              <div style={{ color: 'rgba(200,210,230,.35)', fontSize: 10 }}>@{user.username}</div>
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              width: '100%', padding: '7px', borderRadius: 8, border: '1px solid rgba(255,255,255,.06)',
              background: 'transparent', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 10, color: 'rgba(200,210,230,.3)', letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </aside>
  );
}
