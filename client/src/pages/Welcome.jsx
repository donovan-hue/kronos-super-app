import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BotonBurbuja3D } from '../components/kronos';

export default function Welcome() {
  const navigate = useNavigate();
  const [showFeatures, setShowFeatures] = useState(false);

  const features = [
    { icon: '💬', label: 'Social',        desc: 'Feed, stories, chat en tiempo real' },
    { icon: '🛒', label: 'Tienda',        desc: 'Compras con checkout Stripe' },
    { icon: '💰', label: 'Wallet',        desc: 'Pagos P2P gratis entre usuarios' },
    { icon: '🪙', label: 'Tokens',        desc: 'Gana tokens diarios por actividad' },
    { icon: '🎪', label: 'Eventos',       desc: 'Boletos con QR y check-in' },
    { icon: '🏆', label: 'Gamificación',  desc: 'XP, niveles y badges únicos' },
    { icon: '🎥', label: 'LIVE',          desc: 'Streaming y videollamadas' },
    { icon: '🌐', label: 'Comunidades',   desc: 'Grupos con roles y moderación' },
    { icon: '🏪', label: 'Marketplace',   desc: 'P2P con escrow de seguridad' },
    { icon: '🎮', label: 'Avatar',        desc: 'Personaliza tu avatar 3D' },
    { icon: '❤️', label: 'Health',        desc: 'Metas diarias y tokens fitness' },
    { icon: '📅', label: 'Reservas',      desc: 'Restaurantes y servicios' },
  ];

  return (
    <div style={{
      minHeight: '100vh', background: '#08080f',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '48px 20px 64px',
      fontFamily: "'Outfit', sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>

      {/* Ambient glow de fondo */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background:
          'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 60%),' +
          'radial-gradient(ellipse at 20% 100%, rgba(124,58,237,0.05) 0%, transparent 50%),' +
          'radial-gradient(ellipse at 80% 80%, rgba(6,182,212,0.04) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

      {/* Línea horizontal decorativa superior */}
      <div style={{
        position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)',
      }} />

      {/* ── HERO ── */}
      <div style={{ textAlign: 'center', marginBottom: 44, position: 'relative', zIndex: 2 }}>

        {/* K logo dorado */}
        <div style={{
          width: 120, height: 120, borderRadius: '50%',
          background: 'linear-gradient(135deg, #5A4A08, #A08820, #D4AF37, #F0D060, #D4AF37, #A08820, #5A4A08)',
          backgroundSize: '300% 300%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 28px',
          boxShadow: '0 0 60px rgba(212,175,55,0.5), 0 0 120px rgba(212,175,55,0.15)',
          animation: 'welcome-gold 5s ease-in-out infinite',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '10%', left: '16%', width: '58%', height: '30%',
            background: 'linear-gradient(180deg,rgba(255,255,255,0.45) 0%,transparent 100%)',
            borderRadius: '50%', filter: 'blur(4px)',
          }} />
          <span style={{
            fontSize: 58, fontWeight: 900, color: '#0a0a0f',
            textShadow: '0 2px 8px rgba(0,0,0,0.4)',
            lineHeight: 1, position: 'relative', zIndex: 1,
          }}>K</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(54px,13vw,78px)', fontWeight: 900, letterSpacing: 12, margin: '0 0 10px',
          background: 'linear-gradient(90deg, #5A4A08, #A08820, #D4AF37, #F0D060, #D4AF37, #A08820, #5A4A08)',
          backgroundSize: '300% 300%',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          animation: 'welcome-gold 5s ease-in-out infinite',
          filter: 'drop-shadow(0 0 30px rgba(212,175,55,0.45)) drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
        }}>
          KRONOS
        </h1>

        <p style={{
          fontSize: 'clamp(10px,2.8vw,13px)', fontWeight: 300, letterSpacing: 4,
          background: 'linear-gradient(90deg, rgba(212,175,55,0.4), #D4AF37, #F0D060, #D4AF37, rgba(212,175,55,0.4))',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          animation: 'welcome-shimmer 7s linear infinite',
          margin: '0 auto 12px',
          textTransform: 'uppercase',
        }}>
          Tu tiempo. Tu espacio. Tu orden.
        </p>

        {/* Línea dorada decorativa */}
        <div style={{
          width: 80, height: 1, margin: '20px auto 36px',
          background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)',
        }} />

        {/* Botones */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
          <BotonBurbuja3D size="lg" onClick={() => navigate('/auth/login')}>
            Iniciar sesión
          </BotonBurbuja3D>
          <BotonBurbuja3D size="md" variant="outline" onClick={() => navigate('/auth/register')}>
            Crear cuenta
          </BotonBurbuja3D>
          <button onClick={() => setShowFeatures(v => !v)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(212,175,55,0.4)', fontSize: 12, marginTop: 4,
            fontFamily: 'inherit', letterSpacing: 1, textTransform: 'uppercase',
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(212,175,55,0.75)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(212,175,55,0.4)'}
          >
            {showFeatures ? '↑ Ocultar' : '↓ Ver los 12 mundos'}
          </button>
        </div>
      </div>

      {/* ── GRID DE FEATURES ── */}
      {showFeatures && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))',
          gap: 12, width: '100%', maxWidth: 680,
          position: 'relative', zIndex: 2,
        }}>
          {features.map(f => (
            <div key={f.label}
              style={{
                background: 'rgba(255,255,255,0.025)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(212,175,55,0.12)',
                borderRadius: 18, padding: '20px 14px',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                transition: 'transform 0.3s, box-shadow 0.3s, border-color 0.3s',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)';
                e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.5), 0 0 20px rgba(212,175,55,0.12)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.borderColor = 'rgba(212,175,55,0.12)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)';
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#F0D060', marginBottom: 4 }}>{f.label}</div>
              <div style={{ fontSize: 11, color: 'rgba(240,240,248,0.4)', lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      )}

      {/* Línea inferior decorativa */}
      <div style={{
        position: 'absolute', bottom: 0, left: '10%', right: '10%', height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)',
      }} />

      <style>{`
        @keyframes welcome-gold {
          0%,100% { background-position: 0% 50%; }
          50%     { background-position: 100% 50%; }
        }
        @keyframes welcome-shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </div>
  );
}
