import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useSubscription from '../hooks/useSubscription';

// ─── Paywall ─────────────────────────────────────────────────────────────────
function NoirPaywall() {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: '100vh', background: '#08080f',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 32, fontFamily: "'Outfit', sans-serif", position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: 500, height: 300, background: 'radial-gradient(ellipse, rgba(212,175,55,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#A08820,#D4AF37,#F0D060)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, marginBottom: 24, boxShadow: '0 0 50px rgba(212,175,55,0.4)' }}>🎬</div>
      <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: 4, marginBottom: 10, background: 'linear-gradient(90deg,#A08820,#D4AF37,#F0D060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>NOIR SCRIPTS</div>
      <div style={{ color: 'rgba(240,240,248,0.45)', fontSize: 14, textAlign: 'center', maxWidth: 400, lineHeight: 1.8, marginBottom: 32 }}>
        Genera guiones profesionales con IA, edita escenas, mejora diálogos y exporta en formato screenplay. Exclusivo para <strong style={{ color: '#F0D060' }}>Pro</strong> y <strong style={{ color: '#D4AF37' }}>Business</strong>.
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => navigate('/pricing')} style={{ padding: '13px 32px', borderRadius: 12, background: 'linear-gradient(135deg,#A08820,#D4AF37,#F0D060)', border: 'none', color: '#08080f', fontWeight: 800, fontSize: 14, cursor: 'pointer', letterSpacing: 1, fontFamily: 'inherit', boxShadow: '0 4px 24px rgba(212,175,55,0.45)' }}>VER PLANES</button>
        <button onClick={() => navigate('/feed')} style={{ padding: '13px 28px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.2)', color: 'rgba(212,175,55,0.7)', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>Volver</button>
      </div>
    </div>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────
const GENEROS = ['Cyberpunk','Space Opera','Distópico','Post-Humano','Biopunk','Solarpunk','Horror Cósmico','Neo-Noir'];
const DURACIONES = [{ label: '30 seg', val: '30_seg', tokens: 400 }, { label: '1 min', val: '1_min', tokens: 600 }, { label: '3 min', val: '3_min', tokens: 1200 }, { label: '5 min', val: '5_min', tokens: 1800 }, { label: '10 min', val: '10_min', tokens: 2800 }, { label: '15 min', val: '15_min', tokens: 3500 }];
const TONOS = ['Serio y oscuro','Épico y cinematográfico','Minimalista','Cómico-satírico','Experimental'];
const PLATAFORMAS = ['TikTok / Reels','YouTube','Cortometraje','Podcast / Audio','Teatro'];

const CATALOGO = [
  { id: 'c1', titulo: 'Señales del Vacío', genero: 'Space Opera', duracion: '5 min', desc: 'Una astronauta recibe transmisiones de su yo alternativo desde el borde del universo observable.', tags: ['Drama','Soledad','IA'], precio: '$250' },
  { id: 'c2', titulo: 'Código Rojo: NEXUS', genero: 'Cyberpunk', duracion: '3 min', desc: 'Un hacker descubre que la corporación que persigue es en realidad su subconsciente digitalizado.', tags: ['Acción','Thriller','Matrix'], precio: '$250' },
  { id: 'c3', titulo: 'El Último Jardín', genero: 'Post-Humano', duracion: '10 min', desc: 'En 2187, un androide jardinero custodia el único árbol real en la Tierra. Un niño le pregunta qué es la muerte.', tags: ['Filosófico','Emotivo','Naturaleza'], precio: '$600' },
  { id: 'c4', titulo: 'Protocolo Espejo', genero: 'Distópico', duracion: '15 min', desc: 'Un detective investiga asesinatos donde todas las víctimas tienen la misma cara — la suya.', tags: ['Misterio','Identidad','Noir'], precio: '$1,000' },
  { id: 'c5', titulo: 'Marea Sintética', genero: 'Biopunk', duracion: '3 min', desc: 'Una biohackers modifica su ADN cada semana. Hoy amaneció con recuerdos que no son suyos.', tags: ['Horror','Biología','Thriller'], precio: '$250' },
  { id: 'c6', titulo: 'Aurora Perpetua', genero: 'Solarpunk', duracion: '5 min', desc: 'Una comunidad en los Andes construye el primer generador de consciencia colectiva solar.', tags: ['Esperanza','Comunidad','Tecnología'], precio: '$250' },
];

const STRIPE_LINKS = {
  starter: 'https://buy.stripe.com/14AdR849D51r6fCdNB8og01',
  pack: 'https://buy.stripe.com/5kQbJ0ay179zavSgZN8og02',
  studio: 'https://buy.stripe.com/8x27sK21v2Tj9rO4d18og03',
};

// ─── Helpers ────────────────────────────────────────────────────────────────
const TABS = ['Generar','Catálogo','Editor','Guía','Exportar'];

const inputBase = {
  width: '100%', background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(212,175,55,0.18)', borderRadius: 10,
  padding: '11px 14px', color: '#F0F0F8', fontSize: 13,
  fontFamily: "'Outfit', sans-serif", outline: 'none',
  transition: 'border-color 0.2s',
};

function GoldBtn({ children, onClick, disabled, style = {} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: '12px 24px', borderRadius: 11, border: 'none',
      background: disabled ? 'rgba(212,175,55,0.2)' : 'linear-gradient(135deg,#A08820,#D4AF37,#F0D060)',
      color: disabled ? 'rgba(212,175,55,0.4)' : '#08080f',
      fontWeight: 800, fontSize: 13, letterSpacing: 1, cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: "'Outfit', sans-serif",
      boxShadow: disabled ? 'none' : '0 4px 20px rgba(212,175,55,0.4)',
      transition: 'all 0.2s', ...style,
    }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(212,175,55,0.55)'; }}}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = disabled ? 'none' : '0 4px 20px rgba(212,175,55,0.4)'; }}
    >{children}</button>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: 16, padding: 20, ...style }}>
      {children}
    </div>
  );
}

function Label({ children }) {
  return <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: 3, color: 'rgba(212,175,55,0.5)', textTransform: 'uppercase', marginBottom: 8 }}>{children}</div>;
}

// ─── MAIN ───────────────────────────────────────────────────────────────────
export default function Noir() {
  const { tier, loading: subLoading } = useSubscription();
  const navigate = useNavigate();
  const isPremium = tier === 'pro' || tier === 'business';

  const [tab, setTab] = useState('Generar');
  const [genLoading, setGenLoading] = useState(false);
  const [genError, setGenError] = useState('');

  // Formulario generador
  const [genForm, setGenForm] = useState({
    genero: 'Cyberpunk', duracion: '3_min', tono: 'Serio y oscuro',
    plataforma: 'TikTok / Reels', premisa: '', personajes: '',
  });

  // Guión generado
  const [script, setScript] = useState(null); // { titulo, sinopsis, guion, notas }

  // Editor
  const [editText, setEditText] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editInstruction, setEditInstruction] = useState('');
  const [editResult, setEditResult] = useState('');

  // Catálogo
  const [catFilter, setCatFilter] = useState('Todos');

  const textareaRef = useRef(null);

  // ── API call helper ───────────────────────────────────────────────────────
  const callClaude = async (systemPrompt, userMsg, maxTokens = 2000) => {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMsg }],
      }),
    });
    const data = await resp.json();
    if (data.error) throw new Error(data.error.message);
    return data.content?.filter(b => b.type === 'text').map(b => b.text).join('') || '';
  };

  // ── Generar guión ─────────────────────────────────────────────────────────
  const generateScript = async () => {
    if (!genForm.premisa.trim()) return;
    setGenLoading(true);
    setGenError('');
    setScript(null);

    const durObj = DURACIONES.find(d => d.val === genForm.duracion);

    try {
      const raw = await callClaude(
        `Eres NOIR, un escritor de guiones sci-fi profesional de nivel Hollywood.
Creas guiones cinematográficos precisos, con diálogos memorables y dirección visual detallada.
RESPONDE SOLO CON JSON VÁLIDO, sin backticks, sin markdown.

Estructura:
{
  "titulo": "Título impactante",
  "sinopsis": "1-2 oraciones de logline",
  "guion": "El guión completo en formato screenplay:\nINT./EXT. LUGAR - DÍA/NOCHE\nAcciones en párrafo.\nPERSONAJE\nDiálogo.\n(etc.)",
  "notas_director": "3-4 notas de producción: paleta de color, música, referencias visuales",
  "hashtags": ["#tag1","#tag2","#tag3","#tag4","#tag5"]
}`,
        `Escribe un guión ${genForm.genero} para ${genForm.plataforma}.
Duración: ${durObj?.label || '3 min'}.
Tono: ${genForm.tono}.
Premisa: ${genForm.premisa}.
${genForm.personajes ? `Personajes: ${genForm.personajes}.` : ''}
El guión debe ser completamente original, visualmente poderoso y con diálogos que enganchen desde el primer segundo.`,
        durObj?.tokens || 1200,
      );

      const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(clean);
      setScript(parsed);
      setEditText(parsed.guion || '');
      setTab('Editor');
    } catch (e) {
      setGenError('Error generando el guión. Intenta de nuevo.');
      console.error(e);
    } finally {
      setGenLoading(false);
    }
  };

  // ── Mejorar con IA ────────────────────────────────────────────────────────
  const improveScript = async () => {
    if (!editText.trim() || !editInstruction.trim()) return;
    setEditLoading(true);
    setEditResult('');
    try {
      const result = await callClaude(
        `Eres un editor experto de guiones sci-fi. Aplica la instrucción del usuario al guión dado.
Devuelve SOLO el guión mejorado en formato screenplay, sin explicaciones adicionales.`,
        `Instrucción: ${editInstruction}\n\nGuión original:\n${editText}`,
        2500,
      );
      setEditResult(result);
    } catch (e) {
      setEditResult('Error al mejorar. Intenta de nuevo.');
    } finally {
      setEditLoading(false);
    }
  };

  const applyEdit = () => {
    if (editResult) { setEditText(editResult); setEditResult(''); setEditInstruction(''); }
  };

  // ── Exportar ──────────────────────────────────────────────────────────────
  const exportTxt = () => {
    const content = script
      ? `TÍTULO: ${script.titulo}\n\nSINOPSIS:\n${script.sinopsis}\n\nGUIÓN:\n${editText}\n\nNOTAS DE DIRECTOR:\n${script.notas_director}\n\nHASHTAGS: ${(script.hashtags || []).join(' ')}`
      : editText;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${script?.titulo?.replace(/\s+/g, '_') || 'guion_noir'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJson = () => {
    if (!script) return;
    const blob = new Blob([JSON.stringify({ ...script, guion: editText }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${script.titulo?.replace(/\s+/g, '_') || 'guion_noir'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).catch(() => {});
  };

  // ── Loading / Paywall ────────────────────────────────────────────────────
  if (subLoading) return (
    <div style={{ minHeight: '100vh', background: '#08080f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'rgba(212,175,55,0.4)', fontFamily: "'Outfit',sans-serif", letterSpacing: 2 }}>Cargando...</div>
    </div>
  );
  if (!isPremium) return <NoirPaywall />;

  const catGeneros = ['Todos', ...GENEROS];
  const catFiltrado = catFilter === 'Todos' ? CATALOGO : CATALOGO.filter(g => g.genero === catFilter);

  return (
    <div style={{ minHeight: '100vh', background: '#08080f', fontFamily: "'Outfit', sans-serif", color: '#F0F0F8' }}>

      {/* ── HEADER ── */}
      <div style={{ background: 'rgba(8,8,15,0.98)', borderBottom: '1px solid rgba(212,175,55,0.1)', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 16, height: 56, position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(20px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>🎬</span>
          <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: 4, background: 'linear-gradient(90deg,#A08820,#D4AF37,#F0D060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>NOIR</span>
          <span style={{ fontSize: 10, color: 'rgba(212,175,55,0.4)', letterSpacing: 2, textTransform: 'uppercase' }}>Scripts Studio</span>
          <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: '#F0D060', letterSpacing: 1 }}>
            KRONOS {tier.toUpperCase()}
          </span>
        </div>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 2, marginLeft: 24 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: tab === t ? 'linear-gradient(135deg,rgba(212,175,55,0.2),rgba(212,175,55,0.08))' : 'transparent',
              color: tab === t ? '#F0D060' : 'rgba(240,240,248,0.4)',
              fontWeight: tab === t ? 700 : 400, fontSize: 12, fontFamily: 'inherit',
              borderBottom: `2px solid ${tab === t ? '#D4AF37' : 'transparent'}`,
              transition: 'all 0.15s',
            }}>{t}</button>
          ))}
        </div>
        {script && (
          <div style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(212,175,55,0.6)', fontStyle: 'italic' }}>
            ✓ {script.titulo}
          </div>
        )}
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

        {/* ══════════════════════════ GENERAR ══════════════════════════ */}
        {tab === 'Generar' && (
          <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24, alignItems: 'start' }}>
            {/* Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 4, background: 'linear-gradient(90deg,#A08820,#D4AF37,#F0D060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Generar Guión</div>
                <div style={{ fontSize: 12, color: 'rgba(240,240,248,0.35)' }}>IA entrenada en cine sci-fi de nivel profesional</div>
              </div>

              <Card>
                <Label>Premisa (requerida)</Label>
                <textarea
                  value={genForm.premisa}
                  onChange={e => setGenForm(p => ({ ...p, premisa: e.target.value }))}
                  placeholder="Describe la idea central de tu historia. Ej: Un hacker descubre que los sueños de las personas están siendo transmitidos en vivo..."
                  style={{ ...inputBase, height: 90, resize: 'none', lineHeight: 1.5 }}
                  onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(212,175,55,0.18)'}
                />
              </Card>

              <Card>
                <Label>Personajes (opcional)</Label>
                <input
                  value={genForm.personajes}
                  onChange={e => setGenForm(p => ({ ...p, personajes: e.target.value }))}
                  placeholder="Ej: ARIA (IA femenina, fría), KAI (hacker, 25 años)"
                  style={inputBase}
                  onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(212,175,55,0.18)'}
                />
              </Card>

              <Card>
                <Label>Género</Label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {GENEROS.map(g => (
                    <button key={g} onClick={() => setGenForm(p => ({ ...p, genero: g }))} style={{
                      padding: '7px 8px', borderRadius: 8, border: `1px solid ${genForm.genero === g ? 'rgba(212,175,55,0.5)' : 'rgba(212,175,55,0.1)'}`,
                      background: genForm.genero === g ? 'rgba(212,175,55,0.12)' : 'transparent',
                      color: genForm.genero === g ? '#F0D060' : 'rgba(240,240,248,0.4)',
                      fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                    }}>{g}</button>
                  ))}
                </div>
              </Card>

              <Card>
                <Label>Duración</Label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {DURACIONES.map(d => (
                    <button key={d.val} onClick={() => setGenForm(p => ({ ...p, duracion: d.val }))} style={{
                      padding: '6px 14px', borderRadius: 20, border: `1px solid ${genForm.duracion === d.val ? 'rgba(212,175,55,0.5)' : 'rgba(212,175,55,0.1)'}`,
                      background: genForm.duracion === d.val ? 'rgba(212,175,55,0.12)' : 'transparent',
                      color: genForm.duracion === d.val ? '#F0D060' : 'rgba(240,240,248,0.4)',
                      fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                    }}>{d.label}</button>
                  ))}
                </div>
              </Card>

              <Card>
                <Label>Tono</Label>
                <select
                  value={genForm.tono} onChange={e => setGenForm(p => ({ ...p, tono: e.target.value }))}
                  style={{ ...inputBase, cursor: 'pointer' }}
                >
                  {TONOS.map(t => <option key={t} value={t} style={{ background: '#0f0f1c' }}>{t}</option>)}
                </select>
              </Card>

              <Card>
                <Label>Plataforma</Label>
                <select
                  value={genForm.plataforma} onChange={e => setGenForm(p => ({ ...p, plataforma: e.target.value }))}
                  style={{ ...inputBase, cursor: 'pointer' }}
                >
                  {PLATAFORMAS.map(p => <option key={p} value={p} style={{ background: '#0f0f1c' }}>{p}</option>)}
                </select>
              </Card>

              {genError && (
                <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.25)', color: 'rgba(239,68,68,0.9)', padding: '10px 14px', borderRadius: 10, fontSize: 13 }}>{genError}</div>
              )}

              <GoldBtn onClick={generateScript} disabled={genLoading || !genForm.premisa.trim()} style={{ width: '100%', padding: '14px 0' }}>
                {genLoading ? '⟳ Escribiendo...' : '⚡ GENERAR GUIÓN'}
              </GoldBtn>
            </div>

            {/* Preview / resultado */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {genLoading ? (
                <Card style={{ minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                  <div style={{ fontSize: 40, animation: 'noir-spin 1.5s linear infinite' }}>◈</div>
                  <div style={{ color: 'rgba(212,175,55,0.6)', fontSize: 14 }}>La IA está escribiendo tu guión...</div>
                  <div style={{ color: 'rgba(240,240,248,0.25)', fontSize: 12 }}>Esto puede tomar 15-30 segundos</div>
                </Card>
              ) : script ? (
                <>
                  <Card>
                    <div style={{ fontSize: 20, fontWeight: 900, color: '#F0D060', marginBottom: 6 }}>{script.titulo}</div>
                    <div style={{ fontSize: 13, color: 'rgba(240,240,248,0.55)', fontStyle: 'italic', marginBottom: 16, lineHeight: 1.6 }}>{script.sinopsis}</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {(script.hashtags || []).map(h => (
                        <span key={h} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: 'rgba(212,175,55,0.7)' }}>{h}</span>
                      ))}
                    </div>
                  </Card>
                  <Card style={{ maxHeight: 380, overflowY: 'auto' }}>
                    <Label>Vista previa del guión</Label>
                    <pre style={{ fontFamily: "'Crimson Text', serif", fontSize: 14, lineHeight: 1.9, color: 'rgba(240,240,248,0.8)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {(script.guion || '').slice(0, 1200)}{(script.guion || '').length > 1200 ? '\n\n...(abre Editor para ver completo)' : ''}
                    </pre>
                  </Card>
                  {script.notas_director && (
                    <Card>
                      <Label>Notas de director</Label>
                      <div style={{ fontSize: 13, color: 'rgba(240,240,248,0.5)', lineHeight: 1.8 }}>{script.notas_director}</div>
                    </Card>
                  )}
                  <div style={{ display: 'flex', gap: 10 }}>
                    <GoldBtn onClick={() => setTab('Editor')} style={{ flex: 1 }}>✏️ Editar</GoldBtn>
                    <GoldBtn onClick={() => setTab('Exportar')} style={{ flex: 1 }}>📤 Exportar</GoldBtn>
                  </div>
                </>
              ) : (
                <Card style={{ minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <div style={{ fontSize: 40, opacity: 0.12 }}>🎬</div>
                  <div style={{ color: 'rgba(240,240,248,0.25)', fontSize: 13, textAlign: 'center', lineHeight: 1.8 }}>
                    Configura tu guión y presiona<br /><strong style={{ color: 'rgba(212,175,55,0.5)' }}>GENERAR GUIÓN</strong>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════ CATÁLOGO ══════════════════════════ */}
        {tab === 'Catálogo' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, background: 'linear-gradient(90deg,#A08820,#D4AF37,#F0D060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Catálogo NOIR</div>
                <div style={{ fontSize: 12, color: 'rgba(240,240,248,0.35)', marginTop: 2 }}>Guiones listos para producir · Descarga inmediata con Stripe</div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {catGeneros.map(g => (
                  <button key={g} onClick={() => setCatFilter(g)} style={{
                    padding: '6px 14px', borderRadius: 20, border: `1px solid ${catFilter === g ? 'rgba(212,175,55,0.5)' : 'rgba(212,175,55,0.12)'}`,
                    background: catFilter === g ? 'rgba(212,175,55,0.12)' : 'transparent',
                    color: catFilter === g ? '#F0D060' : 'rgba(240,240,248,0.4)',
                    fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                  }}>{g}</button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 16, marginBottom: 40 }}>
              {catFiltrado.map(g => (
                <Card key={g.id} style={{ display: 'flex', flexDirection: 'column', gap: 12, transition: 'border-color 0.2s', cursor: 'default' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#F0D060', marginBottom: 2 }}>{g.titulo}</div>
                      <div style={{ fontSize: 10, color: 'rgba(212,175,55,0.45)', letterSpacing: 1, textTransform: 'uppercase' }}>{g.genero} · {g.duracion}</div>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: '#D4AF37', whiteSpace: 'nowrap' }}>{g.precio}</div>
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(240,240,248,0.5)', lineHeight: 1.7 }}>{g.desc}</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {g.tags.map(t => (
                      <span key={t} style={{ fontSize: 10, padding: '2px 9px', borderRadius: 20, background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)', color: 'rgba(212,175,55,0.55)' }}>{t}</span>
                    ))}
                  </div>
                  <a href={STRIPE_LINKS.starter} target="_blank" rel="noreferrer" style={{
                    display: 'block', textAlign: 'center', padding: '10px 0', borderRadius: 10,
                    background: 'linear-gradient(135deg,#A08820,#D4AF37,#F0D060)',
                    color: '#08080f', fontWeight: 800, fontSize: 12, letterSpacing: 1,
                    textDecoration: 'none', boxShadow: '0 3px 14px rgba(212,175,55,0.3)',
                    transition: 'transform 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = ''}
                  >
                    COMPRAR — {g.precio}
                  </a>
                </Card>
              ))}
            </div>

            {/* Paquetes Stripe */}
            <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(212,175,55,0.2),transparent)', marginBottom: 32 }} />
            <div style={{ fontSize: 16, fontWeight: 800, color: '#F0D060', marginBottom: 4 }}>Paquetes</div>
            <div style={{ fontSize: 12, color: 'rgba(240,240,248,0.35)', marginBottom: 20 }}>Compra varios guiones con descuento</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 14 }}>
              {[
                { name: 'Starter', price: '$250', desc: '1 guión a tu elección', link: STRIPE_LINKS.starter },
                { name: 'Pack',    price: '$600', desc: '3 guiones variados',    link: STRIPE_LINKS.pack },
                { name: 'Studio',  price: '$1,000', desc: '6 guiones + derechos exclusivos', link: STRIPE_LINKS.studio },
              ].map(p => (
                <Card key={p.name} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(212,175,55,0.6)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>{p.name}</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#F0D060', marginBottom: 4 }}>{p.price}</div>
                  <div style={{ fontSize: 12, color: 'rgba(240,240,248,0.35)', marginBottom: 16 }}>{p.desc}</div>
                  <a href={p.link} target="_blank" rel="noreferrer" style={{
                    display: 'block', padding: '10px 0', borderRadius: 10,
                    background: 'linear-gradient(135deg,#A08820,#D4AF37,#F0D060)',
                    color: '#08080f', fontWeight: 800, fontSize: 12, textDecoration: 'none',
                    letterSpacing: 1, boxShadow: '0 3px 14px rgba(212,175,55,0.3)',
                  }}>COMPRAR</a>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════ EDITOR ══════════════════════════ */}
        {tab === 'Editor' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#F0D060' }}>{script?.titulo || 'Editor de Guión'}</div>
                  <div style={{ fontSize: 11, color: 'rgba(240,240,248,0.3)', marginTop: 2 }}>Edita directamente o usa la IA para mejorar</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => copyToClipboard(editText)} style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(212,175,55,0.2)', background: 'transparent', color: 'rgba(212,175,55,0.6)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Copiar</button>
                  <GoldBtn onClick={exportTxt} style={{ padding: '7px 16px', fontSize: 12 }}>Exportar .txt</GoldBtn>
                </div>
              </div>
              <textarea
                ref={textareaRef}
                value={editText}
                onChange={e => setEditText(e.target.value)}
                placeholder={'El guión aparecerá aquí después de generarlo.\nTambién puedes pegar un guión externo para editarlo.'}
                style={{
                  ...inputBase, height: 520, resize: 'vertical',
                  fontFamily: "'Crimson Text', serif", fontSize: 14,
                  lineHeight: 1.9, padding: '16px 18px',
                  color: 'rgba(240,240,248,0.85)',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.45)'}
                onBlur={e => e.target.style.borderColor = 'rgba(212,175,55,0.18)'}
              />
              <div style={{ fontSize: 11, color: 'rgba(240,240,248,0.2)', textAlign: 'right' }}>
                {editText.length.toLocaleString()} caracteres · ~{Math.round(editText.split(' ').length / 130)} min lectura
              </div>
            </div>

            {/* Panel IA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Card>
                <Label>Mejorar con IA</Label>
                <div style={{ fontSize: 12, color: 'rgba(240,240,248,0.35)', marginBottom: 12, lineHeight: 1.6 }}>
                  Dile a la IA qué cambiar: mejorar diálogos, añadir tensión, cambiar el final, adaptarlo a TikTok, etc.
                </div>
                <textarea
                  value={editInstruction}
                  onChange={e => setEditInstruction(e.target.value)}
                  placeholder="Ej: Haz los diálogos más cortos y directos. Añade un twist en el clímax. Adapta el ritmo para TikTok..."
                  style={{ ...inputBase, height: 80, resize: 'none', lineHeight: 1.5, marginBottom: 10 }}
                  onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(212,175,55,0.18)'}
                />
                <GoldBtn onClick={improveScript} disabled={editLoading || !editInstruction.trim() || !editText.trim()} style={{ width: '100%', padding: '11px 0' }}>
                  {editLoading ? '⟳ Procesando...' : '✨ APLICAR CON IA'}
                </GoldBtn>
              </Card>

              {editResult && (
                <Card style={{ borderColor: 'rgba(212,175,55,0.3)' }}>
                  <Label>Resultado de la IA</Label>
                  <pre style={{ fontFamily: "'Crimson Text',serif", fontSize: 13, lineHeight: 1.8, color: 'rgba(240,240,248,0.7)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 280, overflowY: 'auto', marginBottom: 12 }}>
                    {editResult.slice(0, 600)}{editResult.length > 600 ? '...' : ''}
                  </pre>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <GoldBtn onClick={applyEdit} style={{ flex: 1, padding: '9px 0', fontSize: 12 }}>✓ Aplicar</GoldBtn>
                    <button onClick={() => setEditResult('')} style={{ flex: 1, padding: '9px 0', borderRadius: 10, border: '1px solid rgba(239,68,68,0.25)', background: 'transparent', color: 'rgba(239,68,68,0.6)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>✕ Descartar</button>
                  </div>
                </Card>
              )}

              {/* Quick actions */}
              <Card>
                <Label>Acciones rápidas</Label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {[
                    'Acortar para TikTok (60 seg)',
                    'Intensificar el clímax',
                    'Mejorar los diálogos',
                    'Añadir descripción visual',
                    'Traducir al inglés',
                    'Versión narración en voz',
                  ].map(action => (
                    <button key={action} onClick={() => { setEditInstruction(action); }} style={{
                      padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(212,175,55,0.12)',
                      background: 'transparent', color: 'rgba(240,240,248,0.5)',
                      fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                      textAlign: 'left', transition: 'all 0.15s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)'; e.currentTarget.style.color = '#F0D060'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.12)'; e.currentTarget.style.color = 'rgba(240,240,248,0.5)'; }}
                    >→ {action}</button>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ══════════════════════════ GUÍA ══════════════════════════ */}
        {tab === 'Guía' && (
          <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 22, fontWeight: 900, background: 'linear-gradient(90deg,#A08820,#D4AF37,#F0D060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Guía de Producción</div>
              <div style={{ fontSize: 13, color: 'rgba(240,240,248,0.35)', marginTop: 4 }}>Cómo llevar tu guión NOIR a la pantalla</div>
            </div>

            {[
              {
                num: '01', titulo: 'Estructura del Guión',
                contenido: `Un guión NOIR sigue el formato screenplay estándar:\n\n• INT./EXT. LUGAR — HORA (encabezado de escena)\n• Descripción de acción en párrafo (presente, activo)\n• PERSONAJE (en mayúsculas, centrado)\n• Diálogo (indentado)\n• (Paréntesis) para acotaciones\n\nPara TikTok/Reels: máximo 1 escena principal, 3-5 líneas de diálogo, gancho visual en los primeros 3 segundos.`,
              },
              {
                num: '02', titulo: 'Ritmo Sci-Fi',
                contenido: `El sci-fi efectivo en video corto usa:\n\n• Worldbuilding implícito: muestra, no expliques\n• Vocabulario técnico creíble (inventa pero hazlo sonar real)\n• Contraste emocional: tecnología fría + humanidad cálida\n• El "twist" revelar algo que cambia la percepción del espectador\n\nReferencias visuales recomendadas: Blade Runner 2049, Arrival, Ex Machina, Black Mirror.`,
              },
              {
                num: '03', titulo: 'Producción con CapCut',
                contenido: `Para llevar tu guión a video:\n\n1. Copia el texto del guión\n2. En CapCut → "Script to Video" (función IA)\n3. Selecciona estilo visual: Cinematic / Sci-Fi\n4. Genera los clips base y edita sincronizando\n5. Añade voz en off con el texto del narrador\n6. Música: tonos ambientales + sintetizadores\n\nAlternativa: generar imágenes con Midjourney usando las descripciones visuales de tus escenas.`,
              },
              {
                num: '04', titulo: 'Optimización para Plataformas',
                contenido: `TikTok / Instagram Reels:\n• Duración óptima: 30-60 segundos\n• Gancho en primeros 1.5 segundos\n• Texto en pantalla para los primeros 2 seg\n• Hashtags: #SciFi #Cortometraje + nicho\n\nYouTube Shorts:\n• Hasta 60 segundos, vertical 9:16\n• Thumbnail personalizado importa\n\nYouTube largo:\n• 3-15 min funciona para sci-fi narrativo\n• Añade capítulos en la descripción`,
              },
              {
                num: '05', titulo: 'Derechos y Licencias',
                contenido: `Guiones generados con NOIR:\n\n• Plan Pro: uso personal y comercial libre\n• Plan Business: derechos de distribución extendidos\n• Catálogo Starter/Pack: 1 producción por guión\n• Catálogo Studio: derechos exclusivos incluidos\n\nPuedes monetizar los videos resultantes en TikTok, YouTube y otras plataformas. No se requiere atribución a NOIR.`,
              },
            ].map(s => (
              <Card key={s.num}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: 'rgba(212,175,55,0.25)', flexShrink: 0, lineHeight: 1 }}>{s.num}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#F0D060', marginBottom: 10 }}>{s.titulo}</div>
                    <pre style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: 'rgba(240,240,248,0.55)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{s.contenido}</pre>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ══════════════════════════ EXPORTAR ══════════════════════════ */}
        {tab === 'Exportar' && (
          <div style={{ maxWidth: 620, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, background: 'linear-gradient(90deg,#A08820,#D4AF37,#F0D060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 4 }}>Exportar Guión</div>
              {script ? (
                <div style={{ fontSize: 13, color: 'rgba(212,175,55,0.5)' }}>"{script.titulo}"</div>
              ) : (
                <div style={{ fontSize: 12, color: 'rgba(240,240,248,0.3)' }}>Genera un guión primero para exportarlo</div>
              )}
            </div>

            {[
              {
                icon: '📄', title: 'Texto plano (.txt)',
                desc: 'Formato screenplay limpio. Compatible con cualquier app de notas, CapCut, Google Docs.',
                action: exportTxt, label: 'Descargar .TXT',
                disabled: !editText,
              },
              {
                icon: '📋', title: 'Copiar al portapapeles',
                desc: 'Copia el guión completo para pegarlo directamente en CapCut, Notion, etc.',
                action: () => copyToClipboard(editText), label: 'Copiar guión',
                disabled: !editText,
              },
              {
                icon: '{}', title: 'JSON estructurado (.json)',
                desc: 'Incluye título, sinopsis, guión, notas de director y hashtags. Útil para integraciones.',
                action: exportJson, label: 'Descargar .JSON',
                disabled: !script,
              },
            ].map(opt => (
              <Card key={opt.title} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ fontSize: 32, flexShrink: 0 }}>{opt.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#F0D060', marginBottom: 4 }}>{opt.title}</div>
                  <div style={{ fontSize: 12, color: 'rgba(240,240,248,0.4)', lineHeight: 1.6 }}>{opt.desc}</div>
                </div>
                <GoldBtn onClick={opt.action} disabled={opt.disabled} style={{ padding: '9px 18px', fontSize: 11, whiteSpace: 'nowrap' }}>
                  {opt.label}
                </GoldBtn>
              </Card>
            ))}

            {script && (
              <Card style={{ borderColor: 'rgba(212,175,55,0.25)' }}>
                <Label>Vista previa de exportación</Label>
                <div style={{ fontSize: 12, color: '#F0D060', marginBottom: 6 }}>{script.titulo}</div>
                <div style={{ fontSize: 11, color: 'rgba(240,240,248,0.35)', marginBottom: 8, fontStyle: 'italic' }}>{script.sinopsis}</div>
                <pre style={{ fontFamily: "'Crimson Text',serif", fontSize: 13, color: 'rgba(240,240,248,0.5)', lineHeight: 1.8, whiteSpace: 'pre-wrap', maxHeight: 200, overflowY: 'auto' }}>
                  {editText.slice(0, 500)}{editText.length > 500 ? '\n...' : ''}
                </pre>
              </Card>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes noir-spin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(212,175,55,0.25);border-radius:2px}
        select option{background:#0f0f1c;color:#F0F0F8}
      `}</style>
    </div>
  );
}
