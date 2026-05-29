import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

/* Grupos de burbujas en las 4 esquinas */
const BUBBLES = [
  {
    id: 'inicio',
    icon: '🏠',
    label: 'Inicio',
    corner: { bottom: 90, left: 16 },
    fanDirection: 'up-right',
    subs: [
      { icon: '📝', label: 'Feed',     path: '/feed' },
      { icon: '📸', label: 'Foto',     path: '/feed?type=photo' },
      { icon: '🎥', label: 'Video',    path: '/video-editor' },
      { icon: '📖', label: 'Historia', path: '/social/stories' },
      { icon: '🔴', label: 'LIVE',     path: '/live' },
    ],
  },
  {
    id: 'buscar',
    icon: '🔍',
    label: 'Buscar',
    corner: { bottom: 90, right: 16 },
    fanDirection: 'up-left',
    subs: [
      { icon: '👤', label: 'Personas',    path: '/search' },
      { icon: '🛍️', label: 'Tiendas',     path: '/shop' },
      { icon: '🏘️', label: 'Comunidades', path: '/communities' },
    ],
  },
  {
    id: 'chat',
    icon: '💬',
    label: 'Chat',
    corner: { bottom: 16, left: 16 },
    fanDirection: 'up-right',
    subs: [
      { icon: '💬', label: 'Mensajes',  path: '/social/chat' },
      { icon: '👥', label: 'Grupos',   path: '/social/groups' },
      { icon: '🔔', label: 'Notifs',   path: '/notifications' },
    ],
  },
  {
    id: 'perfil',
    icon: '👤',
    label: 'Perfil',
    corner: { bottom: 16, right: 16 },
    fanDirection: 'up-left',
    subs: [
      { icon: '👁️', label: 'Mi perfil',    path: '/profile/me' },
      { icon: '🏆', label: 'Logros',       path: '/gamification' },
      { icon: '💰', label: 'Wallet',       path: '/wallet' },
      { icon: '🎪', label: 'Eventos',      path: '/events' },
      { icon: '⚙️', label: 'Ajustes',      path: '/settings' },
    ],
  },
];

function getFanPositions(direction, count) {
  const radius = 88;
  const startAngle = direction === 'up-right' ? -160 : -20;
  const range      = direction === 'up-right' ?   80 : -80;
  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const angle = ((startAngle + range * t) * Math.PI) / 180;
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
  });
}

/* Esfera individual — igual al estilo de la imagen */
function Sphere({ size, icon, label, isOpen, onClick, style = {}, showLabel = false }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
        cursor: 'pointer', userSelect: 'none',
        transform: isOpen ? 'scale(1.15)' : 'scale(1)',
        transition: 'transform 0.25s cubic-bezier(.34,1.56,.64,1)',
        ...style,
      }}
    >
      {/* Esfera */}
      <div style={{
        width: size, height: size, borderRadius: '50%',
        position: 'relative', isolation: 'isolate', overflow: 'hidden',
        background: `radial-gradient(circle at 35% 30%, #2a2a2a 0%, #141414 40%, #080808 100%)`,
        boxShadow: isOpen
          ? '0 8px 28px rgba(0,0,0,0.95), 0 0 18px rgba(215,219,226,.22), inset 0 1px 0 rgba(255,255,255,.65)'
          : '0 6px 20px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,.5)',
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
        }} />
        {/* Reflejo especular */}
        <div style={{
          position: 'absolute', top: '8%', left: '14%',
          width: '42%', height: '28%', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(255,255,255,.75) 0%, rgba(255,255,255,.2) 50%, transparent 100%)',
          filter: 'blur(1px)', transform: 'rotate(-25deg)', pointerEvents: 'none',
        }} />
        {/* Icono */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: size * 0.38,
          filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.9))',
          zIndex: 3,
        }}>
          {icon}
        </div>
      </div>

      {/* Label plateado */}
      {showLabel && label && (
        <span style={{
          fontFamily: "'Cinzel','Sora',sans-serif",
          fontSize: 7, fontWeight: 600, letterSpacing: 0.8,
          textTransform: 'uppercase', textAlign: 'center',
          maxWidth: size + 12,
          background: 'linear-gradient(135deg,#fff,#d7dbe2,#9aa0ab)',
          backgroundSize: '300% 300%',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'silver-flow 5s ease-in-out infinite',
          lineHeight: 1.3,
        }}>
          {label}
        </span>
      )}
    </div>
  );
}

const MAIN_SIZE = 54;
const SUB_SIZE  = 42;

export default function ExpandableBubbleNav() {
  const navigate  = useNavigate();
  const { user }  = useContext(AuthContext);
  const [openId, setOpenId] = useState(null);

  if (!user) return null;

  const toggle = (id) => setOpenId(prev => (prev === id ? null : id));
  const close  = () => setOpenId(null);

  return (
    <>
      <style>{`
        @keyframes silver-flow {
          0%,100%{background-position:0% 50%}
          33%{background-position:100% 50%}
          66%{background-position:50% 0%}
        }
        @keyframes sphereFloat {
          0%,100%{transform:translateY(0px)}
          50%{transform:translateY(-6px)}
        }
        @keyframes subPopIn {
          0%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(0.1)}
          70%{transform:translate(var(--tx),var(--ty)) scale(1.08)}
          100%{opacity:1;transform:translate(var(--tx),var(--ty)) scale(1)}
        }
        @media(min-width:768px){.bubble-corner{display:none !important}}
      `}</style>

      {openId && (
        <div onClick={close} style={{ position:'fixed', inset:0, zIndex:298 }} />
      )}

      {BUBBLES.map(bubble => {
        const isOpen = openId === bubble.id;
        const fanPos = getFanPositions(bubble.fanDirection, bubble.subs.length);

        return (
          <div
            key={bubble.id}
            className="bubble-corner"
            style={{ position:'fixed', ...bubble.corner, zIndex:299, width:MAIN_SIZE, height:MAIN_SIZE }}
          >
            {/* Sub-burbujas */}
            {isOpen && bubble.subs.map((sub, i) => {
              const pos = fanPos[i];
              return (
                <div
                  key={sub.path}
                  onClick={() => { navigate(sub.path); close(); }}
                  style={{
                    position: 'absolute',
                    top: (MAIN_SIZE - SUB_SIZE) / 2,
                    left: (MAIN_SIZE - SUB_SIZE) / 2,
                    width: SUB_SIZE, height: SUB_SIZE,
                    zIndex: 300,
                    '--tx': `${pos.x}px`,
                    '--ty': `${pos.y}px`,
                    animation: `subPopIn 0.35s cubic-bezier(.34,1.56,.64,1) ${i * 0.055}s both`,
                    transform: `translate(${pos.x}px, ${pos.y}px)`,
                  }}
                >
                  <Sphere size={SUB_SIZE} icon={sub.icon} label={sub.label} isOpen={false} onClick={() => {}} showLabel />
                </div>
              );
            })}

            {/* Burbuja principal */}
            <div style={{ animation: isOpen ? 'none' : 'sphereFloat 4s ease-in-out infinite' }}>
              <Sphere
                size={MAIN_SIZE}
                icon={bubble.icon}
                label={bubble.label}
                isOpen={isOpen}
                onClick={() => toggle(bubble.id)}
                showLabel
              />
            </div>
          </div>
        );
      })}
    </>
  );
}
