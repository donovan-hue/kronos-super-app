import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const BUBBLES = [
  {
    id: 'inicio', emoji: '◇',
    corner: { bottom: 90, left: 16 },
    fanDirection: 'up-right',
    subs: [
      { emoji: '▷', label: 'Feed',     path: '/feed' },
      { emoji: '◎', label: 'Foto',     path: '/feed?type=photo' },
      { emoji: '▶', label: 'Video',    path: '/video-editor' },
      { emoji: '◉', label: 'Historia', path: '/social/stories' },
      { emoji: '●', label: 'LIVE',     path: '/live' },
    ],
  },
  {
    id: 'buscar', emoji: '◎',
    corner: { bottom: 90, right: 16 },
    fanDirection: 'up-left',
    subs: [
      { emoji: '◑', label: 'Personas',    path: '/search?type=people' },
      { emoji: '◈', label: 'Tiendas',     path: '/search?type=shops' },
      { emoji: '⬡', label: 'Comunidades', path: '/communities' },
    ],
  },
  {
    id: 'chat', emoji: '▣',
    corner: { bottom: 16, left: 16 },
    fanDirection: 'up-right',
    subs: [
      { emoji: '◇', label: 'Chat',    path: '/social/chat' },
      { emoji: '◫', label: 'Grupos',  path: '/social/groups' },
      { emoji: '◉', label: 'Notifs',  path: '/notifications' },
    ],
  },
  {
    id: 'perfil', emoji: '◑',
    corner: { bottom: 16, right: 16 },
    fanDirection: 'up-left',
    subs: [
      { emoji: '◎', label: 'Perfil',  path: '/profile/me' },
      { emoji: '✦', label: 'Logros',  path: '/gamification' },
      { emoji: '◆', label: 'Wallet',  path: '/wallet' },
      { emoji: '▦', label: 'Eventos', path: '/events' },
      { emoji: '◎', label: 'Ajustes', path: '/settings' },
    ],
  },
];

function getFanPositions(direction, count) {
  const radius = 86;
  const startAngle = direction === 'up-right' ? -160 : -20;
  const range      = direction === 'up-right' ?   80 : -80;
  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const angle = ((startAngle + range * t) * Math.PI) / 180;
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
  });
}

/* Esfera burbuja cristalina plateada */
function CrystalSphere({ size, emoji, isOpen, onClick, style = {} }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: size, height: size, borderRadius: '50%',
        position: 'relative', cursor: 'pointer', userSelect: 'none',
        isolation: 'isolate',
        transform: isOpen ? 'scale(1.15)' : 'scale(1)',
        transition: 'transform 0.25s cubic-bezier(.34,1.56,.64,1)',
        ...style,
      }}
    >
      {/* Cuerpo translúcido */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: isOpen
          ? 'rgba(255,255,255,.085)'
          : 'rgba(255,255,255,.045)',
        backdropFilter: 'blur(16px) saturate(140%)',
        WebkitBackdropFilter: 'blur(16px) saturate(140%)',
        boxShadow: isOpen
          ? '0 8px 28px rgba(0,0,0,.75), 0 0 18px rgba(215,219,226,.22), inset 0 1px 0 rgba(255,255,255,.55)'
          : '0 6px 20px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.45)',
      }} />

      {/* Filo plateado animado */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        padding: '1.6px',
        background: 'linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff,#5d626b,#c9ced6)',
        backgroundSize: '300% 300%',
        WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
        pointerEvents: 'none',
        animation: 'silver-flow 5s ease-in-out infinite',
      }} />

      {/* Reflejo superior */}
      <div style={{
        position: 'absolute',
        top: '8%', left: '14%',
        width: '44%', height: '28%',
        borderRadius: '50%',
        background: 'linear-gradient(180deg, rgba(255,255,255,.42) 0%, rgba(255,255,255,0) 100%)',
        filter: 'blur(1.5px)',
        transform: 'rotate(-20deg)',
        pointerEvents: 'none',
      }} />

      {/* Reflejo secundario pequeño */}
      <div style={{
        position: 'absolute', top: '16%', left: '54%',
        width: '13%', height: '9%', borderRadius: '50%',
        background: 'rgba(255,255,255,.55)',
        filter: 'blur(1px)',
        pointerEvents: 'none',
      }} />

      {/* Emoji / símbolo centrado */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.38,
        color: isOpen ? 'rgba(233,236,241,.95)' : 'rgba(200,210,230,.7)',
        filter: isOpen ? 'drop-shadow(0 0 5px rgba(215,219,226,.7))' : 'none',
        transition: 'color .2s, filter .2s',
        fontFamily: "'Cinzel', serif",
        zIndex: 3,
      }}>
        {emoji}
      </div>

      {/* Espejo de piso (reflejo debajo) */}
      <div style={{
        position: 'absolute',
        top: '100%', left: '10%', right: '10%',
        height: size * 0.4,
        background: 'rgba(255,255,255,.015)',
        borderRadius: '0 0 50% 50%',
        transform: 'scaleY(-1)',
        filter: 'blur(3px)',
        opacity: 0.35,
        pointerEvents: 'none',
        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,.5), transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,.5), transparent)',
      }} />
    </div>
  );
}

const MAIN_SIZE = 52;
const SUB_SIZE  = 40;

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
          0%,100% { background-position: 0% 50%; }
          33%     { background-position: 100% 50%; }
          66%     { background-position: 50% 0%; }
        }
        @keyframes bubbleFloat {
          0%,100% { transform: translateY(0px) scale(1); }
          50%      { transform: translateY(-6px) scale(1.02); }
        }
        @keyframes subPopIn {
          0%   { opacity:0; transform: translate(var(--tx),var(--ty)) scale(0.1); }
          70%  { transform: translate(var(--tx),var(--ty)) scale(1.08); }
          100% { opacity:1; transform: translate(var(--tx),var(--ty)) scale(1); }
        }
        @media (min-width: 768px) { .bubble-corner { display: none !important; } }
      `}</style>

      {openId && (
        <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 298 }} />
      )}

      {BUBBLES.map(bubble => {
        const isOpen = openId === bubble.id;
        const fanPos = getFanPositions(bubble.fanDirection, bubble.subs.length);

        return (
          <div
            key={bubble.id}
            className="bubble-corner"
            style={{ position: 'fixed', ...bubble.corner, zIndex: 299, width: MAIN_SIZE, height: MAIN_SIZE }}
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
                    animation: `subPopIn 0.35s cubic-bezier(.34,1.56,.64,1) ${i * 0.055}s both`,
                    transform: `translate(${pos.x}px, ${pos.y}px)`,
                    cursor: 'pointer',
                  }}
                >
                  <CrystalSphere size={SUB_SIZE} emoji={sub.emoji} isOpen={false} onClick={() => {}} />
                </div>
              );
            })}

            {/* Burbuja principal */}
            <div style={{ animation: isOpen ? 'none' : 'bubbleFloat 4s ease-in-out infinite' }}>
              <CrystalSphere
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
