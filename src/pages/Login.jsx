import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const { signIn } = useAuth()
  const navigate   = useNavigate()

  async function handleSubmit() {
    setLoading(true); setError('')
    const { error } = await signIn(email, password)
    if (error) { setError('Email o contraseña incorrectos'); setLoading(false) }
    else navigate('/app')
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{ fontSize: '20px', fontWeight: '900', color: '#00FFB2' }}>ScriptDrop</span>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#FFF', marginTop: '8px' }}>Entrar a tu cuenta</h2>
        </div>
        {error && <div style={errorStyle}>{error}</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input style={inputStyle} type="email"    placeholder="Email"      value={email}    onChange={e => setEmail(e.target.value)} />
          <input style={inputStyle} type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          <button onClick={handleSubmit} disabled={loading} style={btnStyle}>
            {loading ? 'Entrando...' : 'Entrar →'}
          </button>
        </div>
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link to="/forgot-password" style={{ color: '#444', fontSize: '12px' }}>¿Olvidaste tu contraseña?</Link>
        </div>
        <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '13px', color: '#333' }}>
          ¿No tienes cuenta? <Link to="/register" style={{ color: '#00FFB2' }}>Regístrate gratis</Link>
        </p>
      </div>
    </div>
  )
}

const pageStyle  = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#08080F', padding: '24px' }
const cardStyle  = { background: '#0F0F1A', border: '1px solid #1E1E30', borderRadius: '8px', padding: '40px', width: '100%', maxWidth: '400px' }
const inputStyle = { width: '100%', background: '#08080F', border: '1px solid #2A2A3E', color: '#E0E0E0', padding: '12px 16px', borderRadius: '4px', fontSize: '14px', fontFamily: "'Courier New', monospace", outline: 'none' }
const btnStyle   = { width: '100%', background: '#00FFB2', color: '#000', border: 'none', padding: '13px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', fontFamily: "'Courier New', monospace" }
const errorStyle = { background: '#FF3B3B15', border: '1px solid #FF3B3B40', color: '#FF3B3B', padding: '10px 14px', borderRadius: '4px', fontSize: '13px', marginBottom: '16px' }
