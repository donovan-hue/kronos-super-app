import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KronosLogo from '../components/kronos/KronosLogo';

// Icono de línea plata (estética KRONOSPACE) — un solo trazo orbital reutilizable
function LineIcon({ d }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24"
      style={{ fill: 'none', stroke: 'url(#ksV)', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', opacity: 0.9 }}>
      {d}
    </svg>
  );
}

const MODULES = [
  { label: 'Social', desc: 'Feed, stories y chat en tiempo real', d: <><circle cx="12" cy="8" r="3.2" /><path d="M5 19a7 7 0 0 1 14 0" /></> },
  { label: 'Tienda', desc: 'Compras con checkout Stripe', d: <><path d="M5 8h14l-1 11H6L5 8z" /><path d="M9 8a3 3 0 0 1 6 0" /></> },
  { label: 'Wallet', desc: 'Pagos P2P entre usuarios', d: <><rect x="4" y="7" width="16" height="11" rx="2.5" /><path d="M16 12h2" /></> },
  { label: 'Tokens', desc: 'Gana KRO por tu actividad', d: <><circle cx="12" cy="12" r="7" /><path d="M12 8v8M9.5 10h3.5a1.8 1.8 0 0 1 0 3.6H9.5" /></> },
  { label: 'Eventos', desc: 'Boletos con QR y check-in', d: <><rect x="4" y="6" width="16" height="12" rx="2" /><path d="M4 11h16" /></> },
  { label: 'Gamificación', desc: 'XP, niveles y badges', d: <><path d="M7 4h10v5a5 5 0 0 1-10 0V4z" /><path d="M10 16h4v3h-4z" /></> },
  { label: 'LIVE', desc: 'Streaming y videollamadas', d: <><rect x="3" y="7" width="12" height="10" rx="2" /><path d="M15 10l5-3v10l-5-3" /></> },
  { label: 'Comunidades', desc: 'Grupos con roles y moderación', d: <><circle cx="8" cy="9" r="2.4" /><circle cx="16" cy="9" r="2.4" /><path d="M4 18a4 4 0 0 1 8 0M12 18a4 4 0 0 1 8 0" /></> },
  { label: 'Marketplace', desc: 'P2P con escrow de seguridad', d: <><path d="M4 9l2-4h12l2 4" /><path d="M5 9v9h14V9" /><path d="M9 13h6" /></> },
  { label: 'Avatar', desc: 'Personaliza tu avatar 3D', d: <><circle cx="12" cy="9" r="3.2" /><path d="M6 19a6 6 0 0 1 12 0" /></> },
  { label: 'Health', desc: 'Metas diarias y tokens fitness', d: <><path d="M12 20s-7-4.3-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.7-7 9-7 9z" /></> },
  { label: 'Reservas', desc: 'Restaurantes y servicios', d: <><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></> },
];

export default function Welcome() {
  const navigate = useNavigate();
  const [showFeatures, setShowFeatures] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '56px 22px 80px',
      fontFamily: "'Manrope', system-ui, sans-serif",
      position: 'relative', overflow: 'hidden',
      background: 'radial-gradient(120% 90% at 50% -5%, #101113 0%, transparent 46%), #050506',
    }}>
      {/* ── HERO ── */}
      <div style={{ textAlign: 'center', marginBottom: 36, position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        <KronosLogo markSize={112} fontSize={46} gap={22}
          style={{ filter: 'drop-shadow(0 0 26px rgba(174,186,200,.10))', marginBottom: 18 }} />

        <div style={{
          width: 320, maxWidth: '80%', height: 1, margin: '8px 0 16px',
          background: 'linear-gradient(90deg, transparent, rgba(190,200,212,.45), transparent)',
        }} />

        <div className="metal-text" style={{
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 12,
          letterSpacing: '.42em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 6,
        }}>
          Time × Space Platform
        </div>
        <div style={{ fontSize: 12, letterSpacing: '.28em', color: '#565b62', marginBottom: 40 }}>
          Tu tiempo · Tu espacio · Tu orden
        </div>

        {/* Botones */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', width: 300, maxWidth: '90vw' }}>
          <button className="btn-metal" style={{ width: '100%' }} onClick={() => navigate('/auth/login')}>
            <span style={{ width: '100%' }}>Iniciar sesión</span>
          </button>
          <button className="btn-ghost" style={{ width: '100%' }} onClick={() => navigate('/auth/register')}>
            Crear cuenta
          </button>
          <button onClick={() => setShowFeatures(v => !v)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--silver-faint)', fontSize: 12, letterSpacing: '.1em', marginTop: 6,
          }}>
            {showFeatures ? 'Ocultar módulos ↑' : 'Ver los 12 módulos ↓'}
          </button>
        </div>
      </div>

      {/* ── GRID DE MÓDULOS ── */}
      {showFeatures && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 14, width: '100%', maxWidth: 720, position: 'relative', zIndex: 2,
        }}>
          {MODULES.map(m => (
            <div key={m.label} className="tile" style={{ padding: '20px 16px', textAlign: 'left', cursor: 'default' }}>
              <div style={{ marginBottom: 12 }}><LineIcon d={m.d} /></div>
              <div className="metal-text" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontSize: 11.5, color: 'var(--silver-dim)', lineHeight: 1.45 }}>{m.desc}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
