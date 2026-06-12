import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://kronos-api-qq0o.onrender.com/api';

/* Icono de línea plata (estética KRONOSPACE) */
function LineIcon({ d, size = 22 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}
      style={{ fill: 'none', stroke: 'url(#ksV)', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', opacity: 0.9 }}>
      {d}
    </svg>
  );
}

/* ── Catálogo: 3 PRODUCTOS INDEPENDIENTES (espejo de server/config/subscriptionPlans.js) ── */
const CATALOG = [
  {
    id: 'social',
    name: 'Red Social',
    tagline: 'Toda la red es gratis. Premium suma extras sin cómputo.',
    icon: <><circle cx="8" cy="9" r="2.4" /><circle cx="16" cy="9" r="2.4" /><path d="M4 18a4 4 0 0 1 8 0M12 18a4 4 0 0 1 8 0" /></>,
    plans: [
      {
        key: 'free', name: 'Gratuito', price: 0,
        features: ['Publicar, reaccionar, comentar', 'Subir fotos y videos', 'Archivos grandes', 'Videollamadas básicas'],
      },
      {
        key: 'premium', name: 'Premium', price: 4.99, featured: true,
        features: ['Todo lo gratuito', 'Sin anuncios', 'Insignia verificada', 'Videollamadas premium', 'Soporte prioritario'],
      },
    ],
  },
  {
    id: 'scripts',
    name: 'Kairos · Guiones IA',
    tagline: 'Generador de guiones con IA. Paga solo lo que produces.',
    icon: <><path d="M7 4h7l4 4v12H7z" /><path d="M14 4v4h4" /><path d="M10 13h5M10 16h5" /></>,
    plans: [
      { key: 'free', name: 'Gratuito', price: 0, quota: '5 guiones / mes' },
      { key: 'estandar', name: 'Estándar', price: 4.99, quota: '100 guiones / mes' },
      { key: 'premium', name: 'Premium', price: 9.99, featured: true, quota: '300 guiones / mes', note: 'Modelo gpt-4o' },
      { key: 'pro', name: 'Pro', price: 19.99, quota: '1000 guiones / mes', note: 'Modelo gpt-4o' },
    ],
  },
  {
    id: 'media',
    name: 'Estudio IA · Imágenes y Video',
    tagline: 'Genera imágenes y video con IA desde el Estudio.',
    icon: <><rect x="4" y="5" width="16" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M5 17l4.5-4.5L13 16l2.5-2.5L19 17" /></>,
    plans: [
      { key: 'free', name: 'Gratuito', price: 0, quota: '5 imágenes / mes', note: 'Sin video' },
      { key: 'estandar', name: 'Estándar', price: 9.99, quota: '100 imágenes · 5 videos' },
      { key: 'premium', name: 'Premium', price: 19.99, featured: true, quota: '300 imágenes · 20 videos', note: 'Calidad HD' },
      { key: 'pro', name: 'Pro', price: 39.99, quota: '800 imágenes · 60 videos', note: 'Calidad HD' },
    ],
  },
];

const priceLabel = (p) => (p === 0 ? 'Gratis' : `$${p.toFixed(2)}`);

function PlanCard({ product, plan, current, busy, onActivate }) {
  const isCurrent = current === plan.key;
  const isFree = plan.price === 0;
  const featured = plan.featured;

  return (
    <div
      className="tile"
      style={{
        position: 'relative',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        cursor: 'default',
        borderColor: featured ? 'var(--line-2)' : undefined,
        boxShadow: featured ? '0 22px 50px -26px rgba(0,0,0,.9), 0 0 0 1px rgba(167,139,250,.22)' : undefined,
      }}
    >
      {featured && (
        <span style={{
          position: 'absolute', top: -10, right: 16,
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, fontWeight: 700,
          letterSpacing: '.18em', textTransform: 'uppercase',
          color: 'var(--accent-bright)', background: 'var(--accent-soft)',
          border: '1px solid rgba(167,139,250,.32)', borderRadius: 8, padding: '3px 9px',
        }}>
          Recomendado
        </span>
      )}

      <div className="metal-text" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: '.04em' }}>
        {plan.name}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span className="metal-text" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 30, fontWeight: 700 }}>
          {priceLabel(plan.price)}
        </span>
        {!isFree && <span style={{ fontSize: 12, color: 'var(--silver-faint)' }}>/mes</span>}
      </div>

      {plan.quota && (
        <div style={{ fontSize: 12.5, color: 'var(--silver)', fontWeight: 600 }}>{plan.quota}</div>
      )}
      {plan.note && (
        <div style={{ fontSize: 11.5, color: 'var(--silver-faint)', letterSpacing: '.02em' }}>{plan.note}</div>
      )}

      {plan.features && (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
          {plan.features.map((f) => (
            <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 12.5, color: 'var(--silver-dim)' }}>
              <LineIcon size={14} d={<path d="M5 12l4 4 10-10" />} />
              {f}
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: 'auto', paddingTop: 4 }}>
        {isCurrent ? (
          <div style={{
            textAlign: 'center', fontSize: 12, color: 'var(--silver-faint)',
            border: '1px dashed var(--line-2)', borderRadius: 11, padding: '11px 0',
          }}>
            Tu plan actual
          </div>
        ) : isFree ? (
          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--silver-faint)', padding: '11px 0' }}>
            Incluido por defecto
          </div>
        ) : (
          <button
            className={featured ? 'btn-metal' : 'btn-ghost'}
            style={{ width: '100%', opacity: busy ? 0.6 : 1, cursor: busy ? 'wait' : 'pointer' }}
            disabled={busy}
            onClick={() => onActivate(product.id, plan.key)}
          >
            {featured ? <span style={{ width: '100%' }}>{busy ? 'Redirigiendo…' : `Activar ${plan.name}`}</span>
              : (busy ? 'Redirigiendo…' : `Activar ${plan.name}`)}
          </button>
        )}
      </div>
    </div>
  );
}

export default function Pricing() {
  const navigate = useNavigate();
  const [currentPlans, setCurrentPlans] = React.useState({});
  const [busy, setBusy] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await axios.get(`${API_URL}/subscription/products`);
        if (!alive) return;
        const map = {};
        Object.entries(data.products || {}).forEach(([id, p]) => { map[id] = p.plan; });
        setCurrentPlans(map);
      } catch {
        /* sin sesión o sin datos → todos seleccionables */
      }
    })();
    return () => { alive = false; };
  }, []);

  const handleActivate = async (productId, planKey) => {
    const id = `${productId}:${planKey}`;
    setBusy(id);
    setError(null);
    try {
      const { data } = await axios.post(`${API_URL}/subscription/checkout`, { productId, planKey });
      if (data?.url) { window.location.href = data.url; return; }
      throw new Error('Stripe no devolvió una URL de checkout');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setBusy(null);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(120% 90% at 50% -5%, #101113 0%, transparent 46%), #050506',
      padding: '64px 24px 96px',
      fontFamily: "'Manrope', system-ui, sans-serif",
      color: 'var(--silver)',
    }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        {/* Cabecera */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{ fontSize: 11, letterSpacing: '.34em', textTransform: 'uppercase', color: 'var(--silver-faint)', fontWeight: 600, marginBottom: 12 }}>
            Planes
          </div>
          <h1 className="metal-text" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 40, margin: 0, letterSpacing: '.01em' }}>
            Tres productos. Paga solo lo que usas.
          </h1>
          <p style={{ color: 'var(--silver-dim)', marginTop: 14, fontSize: 15, maxWidth: 620, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.5 }}>
            La red social, el generador de guiones y el estudio de IA son independientes.
            Activa uno, otro o todos — nunca van amarrados.
          </p>
          {error && (
            <div style={{ color: 'var(--accent-bright)', fontSize: 13, marginTop: 14 }}>{error}</div>
          )}
        </div>

        {/* Productos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 44 }}>
          {CATALOG.map((product) => (
            <section key={product.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <span className="iconbtn" style={{ flex: 'none' }}><LineIcon d={product.icon} /></span>
                <div>
                  <div className="metal-text" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 20 }}>
                    {product.name}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--silver-faint)', marginTop: 2 }}>{product.tagline}</div>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(auto-fit, minmax(${product.plans.length <= 2 ? 280 : 230}px, 1fr))`,
                gap: 16,
                alignItems: 'stretch',
              }}>
                {product.plans.map((plan) => (
                  <PlanCard
                    key={plan.key}
                    product={product}
                    plan={plan}
                    current={currentPlans[product.id]}
                    busy={busy === `${product.id}:${plan.key}`}
                    onActivate={handleActivate}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Volver */}
        <div style={{ textAlign: 'center', marginTop: 56 }}>
          <button className="btn-ghost" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>
            ← Volver
          </button>
        </div>
      </div>
    </div>
  );
}
