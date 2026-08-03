import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { KronosMark } from '../components/kronos/KronosLogo';
import { Icon } from '../components/kronos';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PLATAFORMAS = ['TikTok', 'Reels', 'Shorts'];
const DURACIONES = ['30s', '45s', '60s'];

const SYSTEM = `Eres KAIROS, un director de cine de ciencia ficción especializado en video vertical de alta retención en español.
Reglas de oficio (no negociables):
- HOOK en los primeros 2 segundos: una afirmación o pregunta que duela ignorar. Prohibido "¿Sabías que...?".
- Ritmo anti-scroll: cada bloque de 5-8s termina en un micro-cliffhanger que obliga a seguir.
- Tono: misterio documental + tensión cinematográfica. Datos reales o claramente especulativos, nunca inventados como hechos.
- Lenguaje: español neutro latino, frases cortas, verbos fuertes.
Responde SOLO con JSON válido, sin markdown, sin backticks, con esta estructura exacta:
{"hook":"...","bloques":[{"t":"0-2s","voz":"...","visual":"...","corte":"micro-cliffhanger del bloque"}],"cta":"...","orden_produccion":["paso 1","paso 2"],"variantes":{"tiktok":"ajuste","reels":"ajuste","shorts":"ajuste"},"hashtags":["#..."]}`;

export default function Kairos() {
  const [tema, setTema] = useState('');
  const [plat, setPlat] = useState('TikTok');
  const [dur, setDur] = useState('45s');
  const [zyx, setZyx] = useState(false);
  const [g, setG] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [copied, setCopied] = useState('');

  const generar = async () => {
    if (!tema.trim() || loading) return;
    setLoading(true); setErr(''); setG(null);
    try {
      const userMsg =
        `Tema: ${tema}. Plataforma principal: ${plat}. Duración objetivo: ${dur}. ` +
        (zyx ? 'Narrador: Zyx, avatar IA — voz fría, precisa, levemente inquietante; escribe la voz en su registro. ' : 'Narrador: voz humana en off. ') +
        'Genera el guión completo. Sé conciso en cada campo.';

      const { data } = await axios.post(`${API_URL}/ai/chat`, {
        systemPrompt: SYSTEM,
        messages: [{ role: 'user', content: userMsg }],
      });
      const text = String(data.reply || '');
      const clean = text.replace(/```json|```/g, '').trim();
      setG(JSON.parse(clean));
    } catch (e) {
      const status = e?.response?.status;
      if (status === 402 || status === 403) {
        setErr('Alcanzaste el límite de tu plan para guiones. Mejora tu plan para seguir generando.');
      } else if (status === 401) {
        setErr('Inicia sesión para generar guiones.');
      } else {
        setErr('El guión no llegó completo. Genera de nuevo — suele resolverse al segundo intento.');
      }
    } finally { setLoading(false); }
  };

  const copiar = (id, texto) => {
    const ta = document.createElement('textarea');
    ta.value = texto; document.body.appendChild(ta);
    ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
    setCopied(id); setTimeout(() => setCopied(''), 1500);
  };

  const guionCompleto = () => !g ? '' : [
    `HOOK (0-2s): ${g.hook}`, '',
    ...g.bloques.map(b => `[${b.t}]\nVOZ: ${b.voz}\nVISUAL: ${b.visual}\nCORTE: ${b.corte}`),
    '', `CTA: ${g.cta}`, '', 'HASHTAGS: ' + (g.hashtags || []).join(' '),
  ].join('\n');

  const S = {
    page: { minHeight: '100vh', color: 'var(--silver)', fontFamily: "'Manrope', system-ui, sans-serif", padding: '0 16px 80px' },
    wrap: { maxWidth: 680, margin: '0 auto' },
    glass: { background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 18, backdropFilter: 'blur(12px)', padding: 18, marginBottom: 14 },
    label: { fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--silver-faint)', marginBottom: 8, fontWeight: 600 },
    chip: (on) => ({ padding: '8px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer', border: on ? '1px solid transparent' : '1px solid var(--line-2)', background: on ? 'var(--metal)' : 'transparent', color: on ? '#15171a' : 'var(--silver-dim)', fontWeight: on ? 600 : 400, WebkitTextFillColor: on ? '#15171a' : undefined, transition: 'all .2s' }),
    btnCopy: { fontSize: 11, padding: '4px 10px', borderRadius: 8, border: '1px solid var(--line-2)', background: 'transparent', color: 'var(--silver-dim)', cursor: 'pointer' },
  };

  return (
    <div style={S.page}>
      <style>{`@keyframes pulso{0%,100%{opacity:.35}50%{opacity:1}} input::placeholder{color:var(--silver-faint)}`}</style>

      <div style={S.wrap}>
        {/* Cabecera */}
        <header style={{ padding: '40px 0 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <KronosMark size={56} />
          <h1 className="metal-text" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 40, fontWeight: 700, letterSpacing: '0.14em', margin: '14px 0 0' }}>KAIROS</h1>
          <p style={{ fontSize: 12, color: 'var(--silver-faint)', marginTop: 6, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Generador de guiones · corta el scroll</p>
        </header>

        {/* Entrada */}
        <div style={S.glass}>
          <div style={S.label}>Tema</div>
          <input
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generar()}
            placeholder="Ej: El Pentágono acaba de desclasificar 1,500 páginas sobre UAP…"
            style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(0,0,0,0.35)', border: '1px solid var(--line-2)', borderRadius: 12, padding: '13px 14px', color: '#f2f4f8', fontSize: 15, fontFamily: "'Manrope', system-ui, sans-serif" }}
          />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
            {PLATAFORMAS.map(p => <button key={p} style={S.chip(plat === p)} onClick={() => setPlat(p)}>{p}</button>)}
            <span style={{ width: 1, background: 'var(--line-2)', margin: '0 2px' }} />
            {DURACIONES.map(d => <button key={d} style={S.chip(dur === d)} onClick={() => setDur(d)}>{d}</button>)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
            <button style={S.chip(zyx)} onClick={() => setZyx(!zyx)}>{zyx ? '◈ Narrado por Zyx' : '◇ Narrar con Zyx'}</button>
          </div>
          <button onClick={generar} disabled={loading || !tema.trim()} className="btn-metal" style={{ width: '100%', marginTop: 16, opacity: !tema.trim() && !loading ? 0.5 : 1 }}>
            <span style={{ width: '100%' }}>{loading ? 'Afilando…' : 'Cortar'}</span>
          </button>
          {err && <p style={{ color: '#E8A0A0', fontSize: 13, marginTop: 10 }}>{err} {(err.includes('plan')) && <Link to="/pricing" className="metal-text" style={{ textDecoration: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>Ver planes <Icon name="arrowRight" size={13} stroke="currentColor" /></Link>}</p>}
        </div>

        {loading && (
          <div style={{ ...S.glass, textAlign: 'center', padding: 30 }}>
            <div className="metal-text" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.2em', fontSize: 13, animation: 'pulso 1.4s infinite' }}>ESCENA EN CONSTRUCCIÓN</div>
          </div>
        )}

        {g && (
          <>
            {/* Hook */}
            <div style={{ ...S.glass, borderColor: 'var(--line-2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={S.label}>Hook · 0–2s</div>
                <button style={S.btnCopy} onClick={() => copiar('hook', g.hook)}>{copied === 'hook' ? <Icon name="check" size={12} stroke="currentColor" /> : 'copiar'}</button>
              </div>
              <p className="metal-text" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, lineHeight: 1.45, margin: 0 }}>{g.hook}</p>
            </div>

            {/* Bloques */}
            <div style={S.glass}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div style={S.label}>Guión · ritmo anti-scroll</div>
                <button style={{ ...S.btnCopy, display: 'inline-flex', alignItems: 'center', gap: 4 }} onClick={() => copiar('guion', guionCompleto())}>{copied === 'guion' ? <><Icon name="check" size={12} stroke="currentColor" /> copiado</> : 'copiar todo'}</button>
              </div>
              {g.bloques.map((b, i) => (
                <div key={i} style={{ padding: '14px 0', borderBottom: i < g.bloques.length - 1 ? '1px solid var(--line)' : 'none' }}>
                  <div style={{ fontSize: 11, color: 'var(--silver-faint)', letterSpacing: '0.15em', marginBottom: 6 }}>⟨ {b.t} ⟩</div>
                  <p style={{ margin: '0 0 6px', fontSize: 15, color: '#E6E8EE', lineHeight: 1.55 }}>{b.voz}</p>
                  <p style={{ margin: '0 0 6px', fontSize: 13, color: 'var(--silver-dim)', fontStyle: 'italic' }}>Visual: {b.visual}</p>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--silver-dim)' }}>Corte: {b.corte}</p>
                </div>
              ))}
              <div style={{ marginTop: 14, padding: '12px 14px', borderRadius: 12, background: 'var(--panel-2)', border: '1px dashed var(--line-2)' }}>
                <span style={{ fontSize: 11, color: 'var(--silver-faint)', letterSpacing: '0.15em' }}>CTA · </span>
                <span style={{ fontSize: 14, color: '#f2f4f8' }}>{g.cta}</span>
              </div>
            </div>

            {/* Orden de producción */}
            <div style={S.glass}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={S.label}>Orden de producción</div>
                <button style={S.btnCopy} onClick={() => copiar('orden', (g.orden_produccion || []).join('\n'))}>{copied === 'orden' ? <Icon name="check" size={12} stroke="currentColor" /> : 'copiar'}</button>
              </div>
              {(g.orden_produccion || []).map((p, i) => (
                <p key={i} style={{ margin: '0 0 8px', fontSize: 14, color: 'var(--silver)', lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--silver-faint)', fontFamily: "'Space Grotesk', sans-serif", marginRight: 8 }}>{String(i + 1).padStart(2, '0')}</span>{p}
                </p>
              ))}
            </div>

            {/* Variantes y hashtags */}
            <div style={S.glass}>
              <div style={S.label}>Variantes por plataforma</div>
              {g.variantes && Object.entries(g.variantes).map(([k, v]) => (
                <p key={k} style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--silver-dim)', lineHeight: 1.5 }}>
                  <span style={{ color: '#E6E8EE', textTransform: 'capitalize' }}>{k}: </span>{v}
                </p>
              ))}
              <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(g.hashtags || []).map((h, i) => (
                  <span key={i} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 999, border: '1px solid var(--line-2)', color: 'var(--silver-dim)' }}>{h}</span>
                ))}
              </div>
            </div>
          </>
        )}

        <footer style={{ textAlign: 'center', fontSize: 11, color: 'var(--silver-faint)', marginTop: 30, letterSpacing: '0.1em' }}>
          KAIROS · generador de guiones de KRONOSPACE
        </footer>
      </div>
    </div>
  );
}
