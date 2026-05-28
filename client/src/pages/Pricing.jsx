import React from 'react';
import { useNavigate } from 'react-router-dom';
import useSubscription from '../hooks/useSubscription';

const TIERS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    cadence: 'siempre',
    color: 'rgba(240,240,248,0.06)',
    border: 'rgba(240,240,248,0.08)',
    features: [
      { label: 'Feed, stories y chat en tiempo real',  ok: true },
      { label: 'Tienda, marketplace y delivery',        ok: true },
      { label: 'Wallet y pagos P2P',                   ok: true },
      { label: 'Comunidades, eventos y reservas',       ok: true },
      { label: 'Gamificación, avatar y health',         ok: true },
      { label: 'Streaming LIVE',                        ok: true },
      { label: 'Badge verificado ✓',                   ok: false },
      { label: 'AXIS — Agente 3D IA',                  ok: false },
      { label: 'Generador de guiones TikTok',           ok: false },
      { label: 'Generar imágenes con IA',               ok: false },
      { label: 'Mejorar y editar fotos con IA',         ok: false },
      { label: 'Generación de contenido IA',            ok: false },
    ],
    cta: null,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$9.99',
    cadence: '/ mes',
    color: 'linear-gradient(135deg, rgba(212,175,55,0.12), rgba(160,136,32,0.06))',
    border: 'rgba(212,175,55,0.4)',
    highlighted: true,
    features: [
      { label: 'Todo lo del plan Free',                 ok: true },
      { label: 'Badge verificado ✓',                   ok: true },
      { label: 'AXIS — Agente 3D IA',                  ok: true },
      { label: 'Generador de guiones TikTok',           ok: true },
      { label: 'Generar imágenes con IA',               ok: true },
      { label: 'Mejorar y editar fotos con IA',         ok: true },
      { label: 'Generación de contenido IA',            ok: true },
      { label: 'Sin anuncios',                          ok: true },
      { label: 'Recompensas diarias 3× mayor',          ok: true },
      { label: 'Analytics avanzado',                   ok: false },
      { label: 'API access',                            ok: false },
      { label: 'Soporte prioritario',                   ok: false },
    ],
    cta: 'Suscribirme a Pro',
  },
  {
    id: 'business',
    name: 'Business',
    price: '$29.99',
    cadence: '/ mes',
    color: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.06))',
    border: 'rgba(124,58,237,0.4)',
    features: [
      { label: 'Todo lo del plan Pro',                  ok: true },
      { label: 'Analytics avanzado',                   ok: true },
      { label: 'API access',                            ok: true },
      { label: 'Soporte prioritario',                   ok: true },
      { label: 'Tienda customizable con branding',      ok: true },
      { label: 'Recompensas diarias 5× mayor',          ok: true },
      { label: 'Stripe en tu tienda propia',            ok: true },
      { label: 'Onboarding 1:1',                       ok: true },
      { label: 'SLA de respuesta 24h',                  ok: true },
      { label: 'Hasta 10 cuentas equipo',               ok: true },
      { label: 'Panel de administración',               ok: true },
      { label: 'Facturación fiscal',                    ok: true },
    ],
    cta: 'Suscribirme a Business',
  },
];

function TierCard({ tier, currentTier, onSelect, busy }) {
  const isCurrent = currentTier === tier.id;
  const isGold = tier.highlighted;

  return (
    <div style={{
      background: tier.color,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: `1px solid ${tier.border}`,
      borderRadius: 20,
      padding: '28px 24px',
      width: '100%', maxWidth: 340,
      display: 'flex', flexDirection: 'column', gap: 18,
      position: 'relative',
      boxShadow: isGold
        ? '0 12px 48px rgba(212,175,55,0.2), 0 0 0 1px rgba(212,175,55,0.12)'
        : '0 6px 24px rgba(0,0,0,0.4)',
      transform: isGold ? 'scale(1.04)' : 'none',
      transition: 'box-shadow 0.3s',
    }}>
      {isGold && (
        <div style={{
          position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #A08820, #D4AF37, #F0D060)',
          color: '#08080f', fontSize: 10, fontWeight: 800,
          padding: '4px 14px', borderRadius: 10, letterSpacing: 1.5,
          textTransform: 'uppercase', whiteSpace: 'nowrap',
          boxShadow: '0 2px 12px rgba(212,175,55,0.5)',
        }}>
          ★ Más popular
        </div>
      )}

      {/* Nombre y precio */}
      <div>
        <div style={{
          fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8,
          color: isGold ? 'rgba(212,175,55,0.7)' : 'rgba(240,240,248,0.4)',
          fontFamily: "'Outfit', sans-serif",
        }}>
          {tier.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{
            fontSize: 40, fontWeight: 900,
            background: isGold
              ? 'linear-gradient(135deg, #A08820, #D4AF37, #F0D060)'
              : 'none',
            WebkitBackgroundClip: isGold ? 'text' : 'unset',
            WebkitTextFillColor: isGold ? 'transparent' : '#F0F0F8',
            backgroundClip: isGold ? 'text' : 'unset',
          }}>{tier.price}</span>
          <span style={{ color: 'rgba(240,240,248,0.35)', fontSize: 13 }}>{tier.cadence}</span>
        </div>
      </div>

      {/* Features */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
        {tier.features.map(f => (
          <li key={f.label} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            color: f.ok ? 'rgba(240,240,248,0.85)' : 'rgba(240,240,248,0.28)',
            fontSize: 13,
          }}>
            <span style={{
              width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: f.ok
                ? (isGold ? 'rgba(212,175,55,0.15)' : 'rgba(34,197,94,0.12)')
                : 'rgba(255,255,255,0.04)',
              color: f.ok ? (isGold ? '#D4AF37' : '#22c55e') : 'rgba(255,255,255,0.2)',
              fontSize: 11, fontWeight: 700,
            }}>
              {f.ok ? '✓' : '–'}
            </span>
            {f.label}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div style={{ marginTop: 'auto' }}>
        {isCurrent ? (
          <div style={{
            padding: '12px 0', borderRadius: 12,
            border: `1px dashed ${isGold ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.12)'}`,
            textAlign: 'center',
            color: isGold ? 'rgba(212,175,55,0.6)' : 'rgba(240,240,248,0.35)',
            fontSize: 13,
          }}>
            Tu plan actual
          </div>
        ) : tier.cta ? (
          <button
            onClick={() => onSelect(tier.id)}
            disabled={busy}
            style={{
              width: '100%', padding: '13px 0', borderRadius: 12, border: 'none',
              cursor: busy ? 'wait' : 'pointer',
              background: isGold
                ? 'linear-gradient(135deg, #A08820, #D4AF37, #F0D060)'
                : 'linear-gradient(135deg, #4c1d95, #6d28d9)',
              color: isGold ? '#08080f' : '#fff',
              fontWeight: 800, fontSize: 14, letterSpacing: 0.5,
              fontFamily: "'Outfit', sans-serif",
              opacity: busy ? 0.6 : 1,
              boxShadow: isGold ? '0 4px 20px rgba(212,175,55,0.4)' : '0 4px 16px rgba(109,40,217,0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { if (!busy) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = isGold ? '0 8px 32px rgba(212,175,55,0.6)' : '0 8px 24px rgba(109,40,217,0.5)'; }}}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = isGold ? '0 4px 20px rgba(212,175,55,0.4)' : '0 4px 16px rgba(109,40,217,0.3)'; }}
          >
            {busy ? 'Redirigiendo...' : tier.cta}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default function Pricing() {
  const navigate = useNavigate();
  const { tier, upgrade, error, loading } = useSubscription();
  const [busy, setBusy] = React.useState(null);

  const handleSelect = async (target) => {
    setBusy(target);
    const result = await upgrade(target);
    if (!result?.success) setBusy(null);
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#08080f',
      padding: '64px 24px', color: '#F0F0F8',
      fontFamily: "'Outfit', sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 300, pointerEvents: 'none',
        background: 'radial-gradient(ellipse, rgba(212,175,55,0.07) 0%, transparent 70%)',
      }} />

      {/* Header */}
      <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center', marginBottom: 56 }}>
        <div style={{
          display: 'inline-block', padding: '4px 14px', borderRadius: 20, marginBottom: 16,
          background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)',
          fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
          color: 'rgba(212,175,55,0.7)',
        }}>
          Planes Kronos
        </div>
        <h1 style={{
          fontSize: 'clamp(32px, 6vw, 52px)', margin: '0 0 12px', fontWeight: 900, letterSpacing: 2,
          background: 'linear-gradient(135deg, #A08820, #D4AF37, #F0D060, #D4AF37, #A08820)',
          backgroundSize: '300% 300%',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.3))',
        }}>
          Potencia tu experiencia
        </h1>
        <p style={{ color: 'rgba(240,240,248,0.45)', fontSize: 15, maxWidth: 480, margin: '0 auto' }}>
          La app completa es <strong style={{ color: 'rgba(240,240,248,0.7)' }}>gratis</strong>. Solo las herramientas de IA y la verificación son exclusivas de Pro y Business.
        </p>
        {loading && <div style={{ color: 'rgba(212,175,55,0.4)', fontSize: 12, marginTop: 12 }}>Cargando tu plan...</div>}
        {error && <div style={{ color: '#ef4444', fontSize: 13, marginTop: 12 }}>{error}</div>}
      </div>

      {/* Cards */}
      <div style={{
        display: 'flex', gap: 24, justifyContent: 'center',
        flexWrap: 'wrap', alignItems: 'center',
        maxWidth: 1100, margin: '0 auto',
      }}>
        {TIERS.map(t => (
          <TierCard key={t.id} tier={t} currentTier={tier} onSelect={handleSelect} busy={busy === t.id} />
        ))}
      </div>

      {/* Features premium destacadas */}
      <div style={{ maxWidth: 700, margin: '56px auto 0', textAlign: 'center' }}>
        <div style={{ color: 'rgba(212,175,55,0.45)', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 20 }}>
          Exclusivo Pro · Business
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          {[
            { icon: '◈', label: 'AXIS Studio',     desc: 'Arquitecturas 3D con IA' },
            { icon: '🎬', label: 'ScriptDrop',      desc: 'Guiones TikTok con IA' },
            { icon: '✓',  label: 'Verificación',   desc: 'Badge oficial en tu perfil' },
            { icon: '🖼️', label: 'IA Imágenes',     desc: 'Genera y edita con IA' },
            { icon: '✍️', label: 'IA Contenido',    desc: 'Textos y captions pro' },
          ].map(f => (
            <div key={f.label} style={{
              background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.1)',
              borderRadius: 14, padding: '16px 12px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{f.icon}</div>
              <div style={{ color: '#F0D060', fontWeight: 700, fontSize: 12, marginBottom: 3 }}>{f.label}</div>
              <div style={{ color: 'rgba(240,240,248,0.35)', fontSize: 11 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 48 }}>
        <button onClick={() => navigate(-1)} style={{
          background: 'transparent', border: '1px solid rgba(212,175,55,0.15)',
          color: 'rgba(212,175,55,0.45)', padding: '10px 20px', borderRadius: 10,
          cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'; e.currentTarget.style.color = 'rgba(212,175,55,0.8)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.15)'; e.currentTarget.style.color = 'rgba(212,175,55,0.45)'; }}
        >
          ← Volver
        </button>
      </div>
    </div>
  );
}
