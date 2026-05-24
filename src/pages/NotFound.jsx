import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#08080F', fontFamily: "'Courier New', monospace", textAlign: 'center', padding: '24px' }}>
      <div style={{ fontSize: '72px', fontWeight: '900', color: '#1A1A2E', marginBottom: '8px' }}>404</div>
      <div style={{ fontSize: '20px', color: '#FFF', fontWeight: '700', marginBottom: '8px' }}>Página no encontrada</div>
      <div style={{ fontSize: '13px', color: '#444', marginBottom: '32px' }}>Esta ruta no existe en ScriptDrop</div>
      <button onClick={() => navigate('/')} style={{ background: '#00FFB2', color: '#000', border: 'none', padding: '12px 28px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', fontFamily: "'Courier New', monospace" }}>
        Volver al inicio →
      </button>
    </div>
  )
}
