import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const BUBBLES = [
  {
    id: 'inicio',
    emoji: '🏠',
    corner: { bottom: 90, left: 16 },
    fanDirection: 'up-right',
    subs: [
      { emoji: '📝', label: 'Post',     path: '/feed' },
      { emoji: '📸', label: 'Foto',     path: '/feed?type=photo' },
      { emoji: '🎥', label: 'Video',    path: '/video-editor' },
      { emoji: '📖', label: 'Historia', path: '/social/stories' },
      { emoji: '🔴', label: 'LIVE',     path: '/live' },
    ],
  },
  {
    id: 'buscar',
    emoji: '🔍',
    corner: { bottom: 90, right: 16 },
    fanDirection: 'up-left',
    subs: [
      { emoji: '👤', label: 'Personas',    path: '/search?type=people' },
      { emoji: '🏪', label: 'Tiendas',     path: '/search?type=shops' },
      { emoji: '🏘️', label: 'Comunidades', path: '/communities' },
    ],
  },
  {
    id: 'chat',
    emoji: '💬',
    corner: { bottom: 16, left: 16 },
    fanDirection: 'up-right',
    subs: [
      { emoji: '💬', label: 'Chat',           path: '/social/chat' },
      { emoji: '👥', label: 'Grupos',         path: '/social/groups' },
      { emoji: '🔔', label: 'Notificaciones', path: '/notifications' },
    ],
  },
  {
    id: 'perfil',
    emoji: '👤',
    corner: { bottom: 16, right: 16 },
    fanDirection: 'up-left',
    subs: [
      { emoji: '👁️', label: 'Mi perfil',    path: '/profile/me' },
      { emoji: '🏆', label: 'Gamificación', path: '/gamification' },
      { emoji: '💰', label: 'Wallet',       path: '/wallet' },
      { emoji: '🎪', label: 'Eventos',      path: '/events' },
      { emoji: '⚙️', label: 'Ajustes',      path: '/settings' },
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

function GoldSphere({ size, emoji, isOpen, onClick, style = {} }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: size, height: size, borderRadius: '50%',
        position: 'relative', cursor: 'pointer', userSelect: 'none',
        transform: isOpen ? 'scale(1.2)' : 'scale(1)',
        transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        ...style,
      }}
    >
      {/* Capa base — cristal oscuro con borde dorado */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: isOpen
          ? 'radial-gradient(circle at 38% 38%, rgba(212,175,55,0.25) 0%, rgba(160,136,32,0.15) 40%, rgba(8,8,15,0.85) 100%)'
          : 'radial-gradient(circle at 38% 38%, rgba(212,175,55,0.15) 0%, rgba(14,14,26,0.92) 55%, rgba(8,8,15,0.95) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: isOpen
          ? '0 6px 28px rgba(212,175,55,0.5), 0 0 40px rgba(212,175,55,0.2), inset 0 -2px 6px rgba(0,0,0,0.5)'
          : '0 4px 18px rgba(0,0,0,0.6), 0 0 16px rgba(212,175,55,0.15), inset 0 -2px 4px rgba(0,0,0,0.4)',
      }} />

      {/* Borde dorado */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        border: isOpen ? '1.5px solid rgba(212,175,55,0.7)' : '1px solid rgba(212,175,55,0.3)',
        boxSizing: 'border-box',
      }} />

      {/* Reflejo lateral dorado */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'radial-gradient(circle at 75% 45%, rgba(240,208,96,0.12) 0%, transparent 50%)',
      }} />

      {/* Brillo especular — punto de luz */}
      <div style={{
        position: 'absolute',
        top: '11%', left: '17%',
        width: '40%', height: '26%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
        filter: 'blur(1.5px)',
        transform: 'rotate(-25deg)',
      }} />

      {/* Brillo secundario pequeño */}
      <div style={{
        position: 'absolute', top: '18%', left: '55%',
        width: '13%', height: '9%', borderRadius: '50%',
        background: 'rgba(255,255,255,0.5)',
        filter: 'blur(1px)',
      }} />

      {/* Emoji */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.38,
        filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.7))',
      }}>
        {emoji}
      </div>
    </div>
  );
}

const MAIN_SIZE = 54;
const SUB_SIZE  = 42;

export default function ExpandableBubbleNav() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [openId, setOpenId] = useState(null);

  if (!user) return null;

  const toggle = (id) => setOpenId(prev => (prev === id ? null : id));
  const close  = () => setOpenId(null);

  return (
    <>
      <style>{`
        @keyframes bubbleFloat {
          0%,100% { transform: translateY(0px) scale(1); }
          50%      { transform: translateY(-6px) scale(1.02); }
        }
        @keyframes bubblePulseGold {
          0%,100% { filter: drop-shadow(0 0 6px rgba(212,175,55,0.4)); }
          50%     { filter: drop-shadow(0 0 14px rgba(212,175,55,0.7)); }
        }
        @keyframes subPopIn {
          0%   { opacity:0; transform: translate(var(--tx),var(--ty)) scale(0.15); }
          65%  { transform: translate(var(--tx),var(--ty)) scale(1.12); }
          100% { opacity:1; transform: translate(var(--tx),var(--ty)) scale(1); }
        }
        @media (min-width: 768px) {
          .bubble-corner { display: none !important; }
        }
      `}</style>

      {openId && (
        <div onClick={close} style={{ position:'fixed', inset:0, zIndex:298 }} />
      )}

      {BUBBLES.map((bubble) => {
        const isOpen = openId === bubble.id;
        const fanPos = getFanPositions(bubble.fanDirection, bubble.subs.length);

        return (
          <div
            key={bubble.id}
            className="bubble-corner"
            style={{
              position: 'fixed',
              ...bubble.corner,
              zIndex: 299,
              width: MAIN_SIZE, height: MAIN_SIZE,
            }}
          >
            {/* Sub-burbujas */}
            {isOpen && bubble.subs.map((sub, i) => {
              const pos = fanPos[i];
              return (
                <div
                  key={sub.path}
                  onClick={() => { navigate(sub.path); close(); }}
                  title={sub.label}
                  style={{
                    position: 'absolute',
                    top: (MAIN_SIZE - SUB_SIZE) / 2,
                    left: (MAIN_SIZE - SUB_SIZE) / 2,
                    width: SUB_SIZE, height: SUB_SIZE,
                    zIndex: 300,
                    '--tx': `${pos.x}px`,
                    '--ty': `${pos.y}px`,
                    animation: `subPopIn 0.38s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.06}s both`,
                    transform: `translate(${pos.x}px, ${pos.y}px)`,
                    cursor: 'pointer',
                  }}
                >
                  <GoldSphere size={SUB_SIZE} emoji={sub.emoji} isOpen={false} onClick={() => {}} />
                </div>
              );
            })}

            {/* Burbuja principal */}
            <div style={{
              animation: isOpen ? 'bubblePulseGold 1.5s ease-in-out infinite' : 'bubbleFloat 4s ease-in-out infinite, bubblePulseGold 3s ease-in-out infinite',
            }}>
              <GoldSphere
                size={MAIN_SIZE}
                emoji={bubble.emoji}
                isOpen={isOpen}
                onClick={() => toggle(bubble.id)}
              />
            </div>
          </div>
        );
      })}
    </>
  );
}
