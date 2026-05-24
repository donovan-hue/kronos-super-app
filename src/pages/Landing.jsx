import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function useCounter(target, duration = 2000) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target])
  return count.toLocaleString('es-MX')
}

export default function Landing() {
  const navigate = useNavigate()
  const scriptsCount = useCounter(47382)
  const usersCount   = useCounter(3241)
  const hooksCount   = useCounter(12905)

  return (
    <div style={{ background: '#08080F', minHeight: '100vh', fontFamily: "'Courier New', monospace" }}>

      {/* NAV */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 32px', borderBottom: '1px solid #111', flexWrap: 'wrap', gap: '12px' }}>
        <span style={{ fontSize: '20px', fontWeight: '900', color: '#00FFB2', letterSpacing: '-1px' }}>ScriptDrop</span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/login')}    style={btnGhost}>Entrar</button>
          <button onClick={() => navigate('/register')} style={btnPrimary}>Empezar gratis</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: '80px 20px 60px' }}>
        <div style={{ display: 'inline-block', background: '#00FFB210', border: '1px solid #00FFB230', color: '#00FFB2', padding: '4px 18px', borderRadius: '2px', fontSize: '11px', letterSpacing: '4px', marginBottom: '28px' }}>
          IA PARA CREADORES DE CONTENIDO
        </div>
        <h1 style={{ fontSize: 'clamp(34px, 7vw, 72px)', fontWeight: '900', color: '#FFF', lineHeight: '1.05', marginBottom: '20px', letterSpacing: '-2px' }}>
          Scripts virales para<br /><span style={{ color: '#00FFB2' }}>TikTok y Reels</span><br />en 10 segundos.
        </h1>
        <p style={{ fontSize: '16px', color: '#555', maxWidth: '480px', margin: '0 auto 36px', lineHeight: '1.8' }}>
          Deja de perder horas frente a la pantalla en blanco. ScriptDrop genera tu script completo con hook, desarrollo y CTA al instante.
        </p>
        <button onClick={() => navigate('/register')} style={{ ...btnPrimary, fontSize: '16px', padding: '16px 40px' }}>
          Generar mi primer script gratis →
        </button>
        <p style={{ marginTop: '12px', fontSize: '11px', color: '#333' }}>Sin tarjeta de crédito · 3 scripts gratis al día</p>
      </section>

      {/* STATS */}
      <section style={{ padding: '0 20px 70px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', textAlign: 'center' }}>
          {[
            { value: scriptsCount, label: 'Scripts generados' },
            { value: usersCount,   label: 'Creadores activos' },
            { value: hooksCount,   label: 'Hooks virales' },
          ].map(s => (
            <div key={s.label} style={{ background: '#0F0F1A', border: '1px solid #1A1A2E', borderRadius: '6px', padding: '24px 12px' }}>
              <div style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: '900', color: '#00FFB2', marginBottom: '6px' }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: '#444', letterSpacing: '1px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '0 20px 70px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', fontSize: '11px', color: '#00FFB2', letterSpacing: '4px', marginBottom: '32px' }}>HERRAMIENTAS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          {[
            { emoji: '⚡', title: 'Script completo',   desc: 'Hook + desarrollo + CTA listo para grabar.',  pro: false },
            { emoji: '🎣', title: 'Hook viral',         desc: '5 opciones de gancho para tus primeros 3s.',  pro: false },
            { emoji: '#️⃣', title: 'Hashtags',          desc: '20 hashtags optimizados para tu nicho.',      pro: false },
            { emoji: '👤', title: 'Bio de perfil',      desc: '3 versiones de bio profesional con CTA.',     pro: true  },
            { emoji: '💡', title: 'Ideas del mes',      desc: '10 ideas de contenido para todo el mes.',     pro: true  },
            { emoji: '📂', title: 'Historial',          desc: 'Todos tus scripts guardados y accesibles.',   pro: false },
          ].map(f => (
            <div key={f.title} style={{ background: '#0F0F1A', border: `1px solid ${f.pro ? '#FF6B3530' : '#1A1A2E'}`, borderRadius: '6px', padding: '22px 18px', position: 'relative' }}>
              {f.pro && <span style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '9px', color: '#FF6B35', background: '#FF6B3515', border: '1px solid #FF6B3530', padding: '2px 7px', borderRadius: '10px' }}>PRO</span>}
              <div style={{ fontSize: '26px', marginBottom: '12px' }}>{f.emoji}</div>
              <div style={{ fontWeight: '700', color: '#FFF', marginBottom: '6px', fontSize: '14px' }}>{f.title}</div>
              <div style={{ fontSize: '12px', color: '#444', lineHeight: '1.6' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: '0 20px 80px', maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', fontSize: '11px', color: '#00FFB2', letterSpacing: '4px', marginBottom: '32px' }}>PLANES</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          {[
            {
              plan: 'GRATIS', price: '$0', sub: 'Para empezar',
              perks: ['3 scripts al día','Hook generator','Hashtags','Historial (últimos 5)'],
              cta: 'Empezar gratis', highlight: false, purple: false,
              action: () => navigate('/register')
            },
            {
              plan: 'PRO', price: '$9.99', sub: 'por mes',
              perks: ['Scripts ilimitados','Bio de perfil IA','Ideas del mes','Historial 30 días','Exportar TXT','Todos los tonos'],
              cta: 'Obtener Pro', highlight: true, purple: false,
              action: () => navigate('/register')
            },
            {
              plan: 'AGENCIA', price: '$24.99', sub: 'por mes',
              perks: ['Todo lo de Pro','5 cuentas de equipo','Historial ilimitado','ES + EN + PT','Soporte prioritario','Facturación'],
              cta: 'Obtener Agencia', highlight: false, purple: true,
              action: () => navigate('/register')
            },
          ].map(p => (
            <div key={p.plan} style={{
              background: p.highlight ? '#00FFB208' : p.purple ? '#A78BFA08' : '#0F0F1A',
              border: `1px solid ${p.highlight ? '#00FFB2' : p.purple ? '#A78BFA' : '#1E1E30'}`,
              borderRadius: '8px', padding: '28px 22px'
            }}>
              <div style={{ fontSize: '10px', letterSpacing: '3px', color: p.highlight ? '#00FFB2' : p.purple ? '#A78BFA' : '#444', marginBottom: '8px' }}>{p.plan}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                <span style={{ fontSize: '32px', fontWeight: '900', color: '#FFF' }}>{p.price}</span>
              </div>
              <div style={{ fontSize: '11px', color: '#333', marginBottom: '22px' }}>{p.sub}</div>
              {p.perks.map(perk => (
                <div key={perk} style={{ fontSize: '12px', color: '#666', marginBottom: '9px' }}>✓ {perk}</div>
              ))}
              <button onClick={p.action} style={{
                width: '100%', marginTop: '20px', padding: '11px',
                background: p.highlight ? '#00FFB2' : p.purple ? '#A78BFA' : 'transparent',
                color: (p.highlight || p.purple) ? '#000' : '#666',
                border: `1px solid ${p.highlight ? '#00FFB2' : p.purple ? '#A78BFA' : '#2A2A3E'}`,
                borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '13px',
                fontFamily: "'Courier New', monospace"
              }}>{p.cta}</button>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ textAlign: 'center', padding: '28px', borderTop: '1px solid #0F0F0F', color: '#222', fontSize: '11px', letterSpacing: '1px' }}>
        © 2025 ScriptDrop · Todos los derechos reservados
      </footer>
    </div>
  )
}

const btnPrimary = { background: '#00FFB2', color: '#000', border: 'none', padding: '10px 22px', borderRadius: '3px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', fontFamily: "'Courier New', monospace" }
const btnGhost   = { background: 'transparent', color: '#00FFB2', border: '1px solid #00FFB230', padding: '10px 22px', borderRadius: '3px', cursor: 'pointer', fontSize: '13px', fontFamily: "'Courier New', monospace" }
