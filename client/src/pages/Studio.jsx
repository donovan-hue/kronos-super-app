import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { KronosMark } from '../components/kronos/KronosLogo';
import { Icon } from '../components/kronos';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Iconos de línea plata (originales, sistema KRONOSPACE)
const ICONS = {
  image: <><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8.5" cy="10" r="1.8" /><path d="M21 16l-5-5-9 8" /></>,
  variants: <><rect x="4" y="4" width="11" height="11" rx="2" /><rect x="9" y="9" width="11" height="11" rx="2" /></>,
  enhance: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><circle cx="12" cy="12" r="3.2" /></>,
  cut: <><circle cx="6" cy="6" r="2.4" /><circle cx="6" cy="18" r="2.4" /><path d="M8 7l12 10M8 17L20 7" /></>,
  bg: <><rect x="4" y="4" width="16" height="16" rx="2" strokeDasharray="3 3" /><circle cx="12" cy="11" r="3" /><path d="M7 19a5 5 0 0 1 10 0" /></>,
  caption: <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M7 11h5M7 14h8" /></>,
  film: <><rect x="4" y="5" width="16" height="14" rx="2" /><path d="M9 5v14M15 5v14M4 9h5M4 14h5M15 9h5M15 14h5" /></>,
  music: <><circle cx="7" cy="17" r="2.5" /><circle cx="17" cy="15" r="2.5" /><path d="M9.5 17V6l10-2v11" /></>,
};

function Ico({ name, size = 24 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}
      style={{ fill: 'none', stroke: 'url(#ksV)', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
      {ICONS[name]}
    </svg>
  );
}

// Herramientas del estudio. ready=true → funcional ahora; false → en preparación.
const TOOLS = [
  { id: 'image',    icon: 'image',    name: 'Generar imagen',   desc: 'De texto a imagen en alta definición', ready: true },
  { id: 'variants', icon: 'variants', name: 'Variantes',        desc: 'Varias versiones de una misma idea',   ready: true },
  { id: 'enhance',  icon: 'enhance',  name: 'Mejorar / Upscale', desc: 'Más nitidez y resolución',            ready: false },
  { id: 'bg',       icon: 'bg',       name: 'Quitar fondo',     desc: 'Recorta el sujeto al instante',        ready: false },
  { id: 'video',    icon: 'film',     name: 'Generar video',    desc: 'Clips verticales con IA',              ready: false },
  { id: 'cut',      icon: 'cut',      name: 'Editor de cortes', desc: 'Corta y arma tu video vertical',       ready: false },
  { id: 'caption',  icon: 'caption',  name: 'Subtítulos auto',  desc: 'Transcribe y subtitula',               ready: false },
  { id: 'music',    icon: 'music',    name: 'Música / SFX',     desc: 'Pistas y efectos sin copyright',       ready: false },
];

export default function Studio() {
  const [tool, setTool] = useState('image');
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const current = TOOLS.find(t => t.id === tool) || TOOLS[0];

  const generar = async () => {
    if (!prompt.trim() || loading || !current.ready) return;
    setLoading(true); setErr('');
    try {
      if (tool === 'variants') {
        const { data } = await axios.post(`${API_URL}/ai/image/variants`, { prompt, count: 3 });
        setImages(data.urls || []);
      } else {
        const { data } = await axios.post(`${API_URL}/ai/image`, { prompt, size: '1024x1024', quality: 'standard' });
        setImages(data.imageUrl ? [data.imageUrl] : []);
      }
    } catch (e) {
      const s = e?.response?.status;
      if (s === 402 || s === 403) setErr('Alcanzaste el límite de tu plan para medios. Mejora tu plan para seguir creando.');
      else if (s === 401) setErr('Inicia sesión para usar el estudio.');
      else if (s === 503) setErr('El servicio de IA aún no está configurado en el servidor.');
      else setErr('No se pudo generar. Inténtalo de nuevo.');
    } finally { setLoading(false); }
  };

  const card = { background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 18, padding: 18, marginBottom: 14 };

  return (
    <div style={{ minHeight: '100vh', color: 'var(--silver)', fontFamily: "'Manrope', system-ui, sans-serif", padding: '0 16px 80px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>

        {/* Cabecera */}
        <header style={{ padding: '40px 0 22px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <KronosMark size={56} />
          <h1 className="metal-text" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 38, fontWeight: 700, letterSpacing: '0.12em', margin: '14px 0 0' }}>ESTUDIO IA</h1>
          <p style={{ fontSize: 12, color: 'var(--silver-faint)', marginTop: 6, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Crea y mejora · todo en KRONOSPACE</p>
        </header>

        {/* Rejilla de herramientas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12, marginBottom: 18 }}>
          {TOOLS.map(t => {
            const on = t.id === tool;
            return (
              <button key={t.id} onClick={() => { setTool(t.id); setImages([]); setErr(''); }}
                style={{
                  textAlign: 'left', cursor: 'pointer', padding: '16px 14px', borderRadius: 16,
                  background: on ? 'var(--panel-2)' : 'var(--panel)',
                  border: on ? '1px solid var(--line-2)' : '1px solid var(--line)',
                  boxShadow: on ? '0 0 0 1px rgba(201,206,212,.12)' : 'none',
                  transition: 'all .25s', position: 'relative',
                }}>
                <div style={{ marginBottom: 10 }}><Ico name={t.icon} /></div>
                <div className="metal-text" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 13.5, marginBottom: 3 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: 'var(--silver-dim)', lineHeight: 1.4 }}>{t.desc}</div>
                {!t.ready && (
                  <span style={{ position: 'absolute', top: 12, right: 12, fontSize: 8.5, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--silver-faint)', border: '1px solid var(--line-2)', borderRadius: 999, padding: '2px 7px' }}>Pronto</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Panel de la herramienta activa */}
        <div style={card}>
          <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--silver-faint)', fontWeight: 600, marginBottom: 10 }}>
            {current.name}
          </div>

          {current.ready ? (
            <>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe lo que quieres crear… ej: astronauta plateado flotando sobre una ciudad oscura, estilo cinematográfico"
                rows={3}
                style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical', background: 'rgba(0,0,0,0.35)', border: '1px solid var(--line-2)', borderRadius: 12, padding: '13px 14px', color: '#f2f4f8', fontSize: 14, fontFamily: "'Manrope', system-ui, sans-serif" }}
              />
              <button onClick={generar} disabled={loading || !prompt.trim()} className="btn-metal" style={{ width: '100%', marginTop: 12, opacity: !prompt.trim() && !loading ? 0.5 : 1 }}>
                <span style={{ width: '100%' }}>{loading ? 'Creando…' : (tool === 'variants' ? 'Generar variantes' : 'Generar')}</span>
              </button>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '22px 10px' }}>
              <p style={{ color: 'var(--silver-dim)', fontSize: 13, lineHeight: 1.5, margin: 0 }}>
                <strong className="metal-text">{current.name}</strong> está en preparación. Las herramientas de generación de imagen ya están activas — el resto llega en las próximas actualizaciones.
              </p>
            </div>
          )}

          {err && <p style={{ color: '#E8A0A0', fontSize: 13, marginTop: 10 }}>{err} {err.includes('plan') && <Link to="/pricing" className="metal-text" style={{ textDecoration: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>Ver planes <Icon name="arrowRight" size={13} stroke="currentColor" /></Link>}</p>}
        </div>

        {/* Resultado */}
        {loading && (
          <div style={{ ...card, textAlign: 'center', padding: 40 }}>
            <div className="metal-text" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.2em', fontSize: 13 }}>RENDERIZANDO…</div>
          </div>
        )}

        {images.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: images.length > 1 ? 'repeat(auto-fill, minmax(180px,1fr))' : '1fr', gap: 12 }}>
            {images.map((url, i) => (
              <div key={i} style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--line)', background: 'var(--panel)' }}>
                <img src={url} alt={`resultado ${i + 1}`} style={{ width: '100%', display: 'block' }} />
                <a href={url} target="_blank" rel="noreferrer" className="btn-ghost" style={{ display: 'block', textAlign: 'center', borderRadius: 0, borderWidth: '1px 0 0' }}>
                  Abrir / Descargar
                </a>
              </div>
            ))}
          </div>
        )}

        <footer style={{ textAlign: 'center', fontSize: 11, color: 'var(--silver-faint)', marginTop: 30, letterSpacing: '0.1em' }}>
          ESTUDIO IA · diseño original de KRONOSPACE
        </footer>
      </div>
    </div>
  );
}
