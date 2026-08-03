import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import KronosLogo from '../kronos/KronosLogo';

const API_BASE = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace('/api', '')
  : 'http://localhost:5000';

const inputStyle = {
  width: '100%', padding: '14px 16px', borderRadius: 12, outline: 'none',
  background: 'rgba(255,255,255,0.022)', border: '1px solid rgba(190,200,212,0.18)',
  color: '#c9ced4', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

function Login() {
  const [method, setMethod] = useState('email'); // 'email' | 'phone'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [slowWarning, setSlowWarning] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSlowWarning(false);
    const timer = setTimeout(() => setSlowWarning(true), 5000);
    const result = await login(
      method === 'email' ? identifier : '',
      password,
      method === 'phone' ? identifier : ''
    );
    clearTimeout(timer);
    setSlowWarning(false);
    if (result.success) navigate('/feed');
    else setError(result.message);
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}/api/auth/google`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(120% 100% at 50% 30%, #0c0d0f, #000 72%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      fontFamily: "'Manrope', system-ui, sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column' }}>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 30 }}>
          <KronosLogo markSize={88} fontSize={30} gap={16} />
          <div style={{ fontSize: 11, letterSpacing: '.4em', textTransform: 'uppercase', color: '#565b62', marginTop: 12 }}>
            Bienvenido de vuelta
          </div>
        </div>

        {/* Selector Email / Teléfono */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 4 }}>
          {[
            { id: 'email', label: 'Email' },
            { id: 'phone', label: 'Teléfono' },
          ].map(opt => (
            <button key={opt.id} type="button" onClick={() => { setMethod(opt.id); setIdentifier(''); }}
              style={{
                flex: 1, padding: '10px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                letterSpacing: '.08em', border: 'none', cursor: 'pointer',
                background: method === opt.id ? 'var(--metal)' : 'transparent',
                color: method === opt.id ? '#15171a' : 'rgba(201,206,212,0.55)',
                transition: 'all 0.2s',
              }}>
              {opt.label}
            </button>
          ))}
        </div>

        {slowWarning && (
          <div style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(190,200,212,0.20)',
            color: 'var(--silver-dim)', padding: '10px 14px', borderRadius: 12, fontSize: 12,
            marginBottom: 14, textAlign: 'center',
          }}>
            El servidor está despertando, espera unos segundos…
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#ef4444', padding: '12px 14px', borderRadius: 12, fontSize: 13, marginBottom: 14,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {method === 'email' ? (
            <input type="email" placeholder="Email" value={identifier}
              onChange={(e) => setIdentifier(e.target.value)} required style={inputStyle} />
          ) : (
            <input type="tel" placeholder="Teléfono (ej. +521234567890)" value={identifier}
              onChange={(e) => setIdentifier(e.target.value)} required style={inputStyle} />
          )}
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ ...inputStyle, paddingRight: 56 }}
            />
            <button type="button" onClick={() => setShowPassword(v => !v)}
              style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', fontSize: 11,
                color: 'var(--silver-dim)', letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 600,
              }}>
              {showPassword ? 'Ocultar' : 'Ver'}
            </button>
          </div>
          <button type="submit" className="btn-metal" disabled={loading} style={{ width: '100%', marginTop: 4, opacity: loading ? 0.6 : 1 }}>
            <span style={{ width: '100%' }}>{loading ? 'Entrando…' : 'Entrar'}</span>
          </button>
        </form>

        <div style={{ marginTop: 14, textAlign: 'center' }}>
          <Link to="/forgot-password" style={{ color: 'var(--silver-faint)', fontSize: 12, textDecoration: 'none', letterSpacing: '.04em' }}>
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '20px 0 16px' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(190,200,212,0.12)' }} />
          <span style={{ fontSize: 10, letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--silver-faint)' }}>o</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(190,200,212,0.12)' }} />
        </div>

        <button onClick={handleGoogleLogin} className="btn-ghost" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" style={{ flex: 'none' }}>
            <path fill="#c9ced4" d="M21.35 11.1H12v3.83h5.35c-.23 1.5-1.7 4.4-5.35 4.4-3.22 0-5.85-2.67-5.85-5.95S8.78 7.43 12 7.43c1.83 0 3.06.78 3.76 1.45l2.56-2.47C16.7 4.86 14.6 4 12 4 6.92 4 2.8 8.12 2.8 13.2S6.92 22.4 12 22.4c5.27 0 8.76-3.7 8.76-8.92 0-.6-.06-1.05-.16-1.5z" />
          </svg>
          Continuar con Google
        </button>

        <div style={{ marginTop: 24, textAlign: 'center', color: 'var(--silver-dim)', fontSize: 13 }}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="metal-text" style={{ textDecoration: 'none', fontWeight: 700 }}>
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
