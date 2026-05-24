import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const NICHES = ['Fitness','Finanzas','Motivación','Tecnología','Moda','Cocina','Gaming','Viajes','Conspiración / OVNI','Negocios','Otro']
const TONES  = ['Thriller / Misterioso','Motivacional','Educativo','Humorístico','Dramático','Informativo']
const MODES  = [
  { id: 'full',     label: '⚡ Script',    desc: 'Script completo 45-55s',     pro: false },
  { id: 'hook',     label: '🎣 Hook',      desc: 'Los 3 segundos que enganchan', pro: false },
  { id: 'hashtags', label: '#️⃣ Hashtags', desc: '20 hashtags optimizados',     pro: false },
  { id: 'bio',      label: '👤 Bio',       desc: '3 versiones de bio pro',      pro: true  },
  { id: 'ideas',    label: '💡 Ideas',     desc: '10 ideas para el mes',        pro: true  },
]
const FREE_LIMIT = 3

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [mode,       setMode]       = useState('full')
  const [niche,      setNiche]      = useState('')
  const [topic,      setTopic]      = useState('')
  const [tone,       setTone]       = useState('Thriller / Misterioso')
  const [result,     setResult]     = useState('')
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState('')
  const [usageCount, setUsageCount] = useState(0)
  const [isPro,      setIsPro]      = useState(false)
  const [isAgency,   setIsAgency]   = useState(false)
  const [copied,     setCopied]     = useState(false)
  const [history,    setHistory]    = useState([])
  const [tab,        setTab]        = useState('generator')

  useEffect(() => { if (!user) navigate('/login'); else { loadProfile(); loadHistory() } }, [user])

  async function loadProfile() {
    const today = new Date().toISOString().split('T')[0]
    const { data: usage } = await supabase.from('usage').select('count').eq('user_id', user.id).eq('date', today).single()
    setUsageCount(usage?.count || 0)
    const { data: profile } = await supabase.from('profiles').select('is_pro, is_agency').eq('id', user.id).single()
    setIsPro(profile?.is_pro || false)
    setIsAgency(profile?.is_agency || false)
  }

  async function loadHistory() {
    const { data } = await supabase.from('scripts').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(30)
    setHistory(data || [])
  }

  async function incrementUsage() {
    const today = new Date().toISOString().split('T')[0]
    const { data } = await supabase.from('usage').select('*').eq('user_id', user.id).eq('date', today).single()
    if (data) await supabase.from('usage').update({ count: data.count + 1 }).eq('id', data.id)
    else       await supabase.from('usage').insert({ user_id: user.id, date: today, count: 1 })
    setUsageCount(p => p + 1)
  }

  async function generate() {
    const selectedMode = MODES.find(m => m.id === mode)
    if (selectedMode?.pro && !isPro && !isAgency) { setError('Este modo es exclusivo Pro ⚡'); return }
    if (!niche) { setError('Selecciona el nicho'); return }
    if ((mode === 'full' || mode === 'hook') && !topic) { setError('Escribe el tema del video'); return }
    if (!isPro && !isAgency && usageCount >= FREE_LIMIT) { setError('Límite diario alcanzado. Actualiza a Pro ⚡'); return }

    setLoading(true); setError(''); setResult('')

    try {
      const { data, error: fnErr } = await supabase.functions.invoke('generate-script', {
        body: { mode, niche, topic, tone }
      })
      if (fnErr) throw new Error(fnErr.message)
      setResult(data.result)
      await supabase.from('scripts').insert({ user_id: user.id, mode, niche, topic, tone, result: data.result })
      await incrementUsage()
      await loadHistory()
    } catch {
      setError('Error al generar. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  function copyResult() {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function exportTxt() {
    const blob = new Blob([result], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `scriptdrop-${mode}-${Date.now()}.txt`
    a.click()
  }

  const remaining   = (isPro || isAgency) ? '∞' : Math.max(0, FREE_LIMIT - usageCount)
  const planLabel   = isAgency ? 'AGENCIA' : isPro ? 'PRO' : 'GRATIS'
  const planColor   = isAgency ? '#A78BFA' : isPro ? '#00FFB2' : '#444'

  return (
    <div style={{ background: '#08080F', minHeight: '100vh', fontFamily: "'Courier New', monospace" }}>

      {/* NAV */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #1A1A2E', flexWrap: 'wrap', gap: '10px' }}>
        <span style={{ fontSize: '18px', fontWeight: '900', color: '#00FFB2' }}>ScriptDrop</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', color: planColor, background: `${planColor}20`, border: `1px solid ${planColor}40`, padding: '3px 10px', borderRadius: '2px' }}>{planLabel}</span>
          <span style={{ fontSize: '11px', color: '#555' }}>{remaining} generaciones hoy</span>
          <button onClick={() => { signOut(); navigate('/') }} style={btnSmall}>Salir</button>
        </div>
      </nav>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid #1A1A2E' }}>
        {[{id:'generator',label:'Generador'},{id:'history',label:`Historial (${history.length})`}].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: 'none', border: 'none', borderBottom: `2px solid ${tab === t.id ? '#00FFB2' : 'transparent'}`,
            color: tab === t.id ? '#00FFB2' : '#444', padding: '12px 24px', cursor: 'pointer',
            fontSize: '13px', fontFamily: "'Courier New', monospace"
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '28px 16px' }}>

        {/* GENERATOR TAB */}
        {tab === 'generator' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: '20px' }}>

            <div>
              {/* MODE PILLS */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {MODES.map(m => {
                  const locked = m.pro && !isPro && !isAgency
                  return (
                    <button key={m.id} onClick={() => setMode(m.id)} style={{
                      background: mode === m.id ? '#00FFB210' : '#0F0F1A',
                      border: `1px solid ${mode === m.id ? '#00FFB2' : '#1E1E30'}`,
                      borderRadius: '20px', padding: '8px 16px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '6px'
                    }}>
                      <span style={{ fontSize: '13px', color: mode === m.id ? '#00FFB2' : locked ? '#333' : '#AAA' }}>
                        {m.label} {locked ? '🔒' : ''}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* FORM */}
              <div style={{ background: '#0F0F1A', border: '1px solid #1E1E30', borderRadius: '6px', padding: '20px', marginBottom: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={lbl}>Nicho</label>
                    <select value={niche} onChange={e => setNiche(e.target.value)} style={inp}>
                      <option value="">Selecciona...</option>
                      {NICHES.map(n => <option key={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>Tono</label>
                    <select value={tone} onChange={e => setTone(e.target.value)} style={inp}>
                      {TONES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                {(mode === 'full' || mode === 'hook') && (
                  <div style={{ marginBottom: '14px' }}>
                    <label style={lbl}>Tema del video</label>
                    <input style={{ ...inp, width: '100%' }} placeholder="ej: La verdad sobre los programas secretos de la NASA" value={topic} onChange={e => setTopic(e.target.value)} />
                  </div>
                )}
                {error && <div style={{ background: '#FF3B3B15', border: '1px solid #FF3B3B40', color: '#FF3B3B', padding: '10px 14px', borderRadius: '4px', fontSize: '12px', marginBottom: '12px' }}>{error}</div>}
                <button onClick={generate} disabled={loading} style={{ width: '100%', background: loading ? '#00FFB250' : '#00FFB2', color: '#000', border: 'none', padding: '13px', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '900', fontSize: '14px', fontFamily: "'Courier New', monospace" }}>
                  {loading ? '⏳ Generando...' : '⚡ GENERAR'}
                </button>
              </div>

              {/* RESULT */}
              {result && (
                <div style={{ background: '#0F0F1A', border: '1px solid #00FFB240', borderRadius: '6px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#00FFB2', letterSpacing: '3px' }}>RESULTADO</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={copyResult} style={btnSmall}>{copied ? '✓ Copiado' : 'Copiar'}</button>
                      {(isPro || isAgency) && <button onClick={exportTxt} style={btnSmall}>Exportar TXT</button>}
                    </div>
                  </div>
                  {/* PHONE PREVIEW para scripts completos */}
                  {mode === 'full' ? (
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      <pre style={{ color: '#D0D0E0', fontSize: '13px', lineHeight: '1.9', whiteSpace: 'pre-wrap', wordBreak: 'break-word', flex: 1 }}>{result}</pre>
                      <div style={{ width: '140px', flexShrink: 0, background: '#000', border: '2px solid #333', borderRadius: '20px', padding: '12px 8px', minHeight: '200px' }}>
                        <div style={{ background: '#333', height: '4px', width: '40px', borderRadius: '2px', margin: '0 auto 10px' }}></div>
                        <div style={{ fontSize: '9px', color: '#888', lineHeight: '1.6', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                          {result.slice(0, 200)}...
                        </div>
                        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                          <span style={{ fontSize: '16px' }}>❤️</span>
                          <span style={{ fontSize: '16px' }}>💬</span>
                          <span style={{ fontSize: '16px' }}>↗️</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <pre style={{ color: '#D0D0E0', fontSize: '13px', lineHeight: '1.9', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{result}</pre>
                  )}
                </div>
              )}

              {/* UPGRADE BANNER */}
              {!isPro && !isAgency && (
                <div style={{ marginTop: '14px', background: '#FF6B3510', border: '1px solid #FF6B3530', borderRadius: '6px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ color: '#FF6B35', fontWeight: '700', fontSize: '13px' }}>⚡ Pro — Scripts ilimitados + Bio + Ideas</span>
                    <p style={{ color: '#555', fontSize: '11px', marginTop: '3px' }}>Sin límite diario · Exportar TXT · Historial completo</p>
                  </div>
                  <a href="https://buy.stripe.com/PENDIENTE" target="_blank" rel="noreferrer" style={{ background: '#FF6B35', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '3px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', fontFamily: "'Courier New', monospace", textDecoration: 'none', whiteSpace: 'nowrap' }}>
                    $9.99/mes →
                  </a>
                </div>
              )}
            </div>

            {/* SIDEBAR STATS */}
            <div>
              <div style={{ background: '#0F0F1A', border: '1px solid #1E1E30', borderRadius: '6px', padding: '18px', marginBottom: '14px' }}>
                <div style={{ fontSize: '11px', color: '#444', letterSpacing: '2px', marginBottom: '14px' }}>TU CUENTA</div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px', wordBreak: 'break-all' }}>{user?.email}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#555' }}>Plan</span>
                  <span style={{ fontSize: '12px', color: planColor, fontWeight: '700' }}>{planLabel}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#555' }}>Hoy</span>
                  <span style={{ fontSize: '12px', color: '#AAA' }}>{usageCount} generados</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', color: '#555' }}>Total</span>
                  <span style={{ fontSize: '12px', color: '#AAA' }}>{history.length} scripts</span>
                </div>
              </div>

              <div style={{ background: '#0F0F1A', border: '1px solid #1E1E30', borderRadius: '6px', padding: '18px' }}>
                <div style={{ fontSize: '11px', color: '#444', letterSpacing: '2px', marginBottom: '14px' }}>ÚLTIMOS 3</div>
                {history.slice(0, 3).length === 0
                  ? <div style={{ color: '#2A2A2A', fontSize: '12px' }}>Sin scripts aún</div>
                  : history.slice(0, 3).map(h => (
                    <div key={h.id} onClick={() => { setResult(h.result); setTab('generator') }} style={{ background: '#08080F', border: '1px solid #1A1A2E', borderRadius: '4px', padding: '10px', marginBottom: '8px', cursor: 'pointer' }}>
                      <div style={{ fontSize: '10px', color: '#00FFB2', marginBottom: '3px' }}>{h.niche} · {h.mode}</div>
                      <div style={{ fontSize: '11px', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.topic || h.niche}</div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {tab === 'history' && (
          <div>
            <div style={{ fontSize: '11px', color: '#444', letterSpacing: '3px', marginBottom: '16px' }}>HISTORIAL COMPLETO</div>
            {history.length === 0
              ? <div style={{ color: '#333', textAlign: 'center', marginTop: '60px', fontSize: '14px' }}>Aún no tienes scripts generados</div>
              : history.map(h => (
                <div key={h.id} onClick={() => { setResult(h.result); setTab('generator') }} style={{ background: '#0F0F1A', border: '1px solid #1E1E30', borderRadius: '5px', padding: '16px', marginBottom: '10px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#00FFB2', marginBottom: '4px' }}>{h.niche} · {h.mode} · {h.tone}</div>
                    <div style={{ fontSize: '13px', color: '#CCC' }}>{h.topic || '—'}</div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#333', flexShrink: 0 }}>{new Date(h.created_at).toLocaleDateString('es-MX')}</div>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  )
}

const lbl      = { display: 'block', fontSize: '10px', color: '#444', letterSpacing: '2px', marginBottom: '5px' }
const inp      = { background: '#08080F', border: '1px solid #2A2A3E', color: '#E0E0E0', padding: '10px 12px', borderRadius: '4px', fontSize: '13px', fontFamily: "'Courier New', monospace", outline: 'none', width: '100%' }
const btnSmall = { background: '#1A1A2E', border: '1px solid #2A2A3E', color: '#888', padding: '6px 14px', borderRadius: '3px', cursor: 'pointer', fontSize: '11px', fontFamily: "'Courier New', monospace" }
