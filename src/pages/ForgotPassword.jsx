import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ForgotPassword() {
  const [email,   setEmail]   = useState('')
  const [msg,     setMsg]     = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setLoading(true)
    await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` })
    setMsg('Revisa tu email — te enviamos el enlace de recuperación.')
    setLoading(false)
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Recuperar contraseña</h2>
        <p style={{ textAlign: 'center', color: '#444', fontSize: '13px', marginBottom: '24px' }}>Te enviamos un enlace a tu email</p>
        {msg
          ? <div style={successStyle}>{msg}</div>
          : <>
              <input style={inputStyle} type="email" placeholder="Tu email" value={email} onChange={e => setEmail(e.target.value)} />
              <button onClick={handleSubmit} disabled={loading} style={{ ...btnStyle, marginTop: '12px' }}>
                {loading ? 'Enviando...' : 'Enviar enlace →'}
              </button>
            </>
        }
        <p style={{ textAlign: 'center', marginTop: '18px', fontSize: '13px', color: '#444' }}>
          <Link to="/login" style={{ color: '#00FFB2' }}>← Volver al login</Link>
        </p>
      </div>
    </div>
  )
}

const pageStyle    = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#08080F', padding: '24px' }
const cardStyle    = { background: '#0F0F1A', border: '1px solid #1E1E30', borderRadius: '8px', padding: '42px', width: '100%', maxWidth: '380px' }
const titleStyle   = { fontSize: '20px', fontWeight: '900', color: '#FFF', marginBottom: '8px', textAlign: 'center' }
const inputStyle   = { width: '100%', background: '#08080F', border: '1px solid #2A2A3E', color: '#E0E0E0', padding: '12px 16px', borderRadius: '4px', fontSize: '14px', fontFamily: "'Courier New', monospace", outline: 'none', boxSizing: 'border-box' }
const btnStyle     = { width: '100%', background: '#00FFB2', color: '#000', border: 'none', padding: '13px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', fontFamily: "'Courier New', monospace" }
const successStyle = { background: '#00FFB215', border: '1px solid #00FFB240', color: '#00FFB2', padding: '12px 16px', borderRadius: '4px', fontSize: '13px', textAlign: 'center' }
