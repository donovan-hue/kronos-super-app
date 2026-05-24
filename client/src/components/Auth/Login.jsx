import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HoloText } from '../kronos';

const API_BASE = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace('/api', '')
  : 'http://localhost:5000';

const HOLO = 'linear-gradient(135deg,#4facfe,#00f2fe,#f3a0ff,#ff85a2)';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) navigate('/feed');
    else setError(result.message);
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}/api/auth/google`;
  };
  const handleFacebookLogin = () => {
    window.location.href = `${API_BASE}/api/auth/facebook`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 30% 20%, rgba(79,172,254,0.08), transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(243,160,255,0.06), transparent 50%), #ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      fontFamily: "'Outfit', sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>⭐</div>
          <HoloText size={36}>KRONOS</HoloText>
          <div style={{ color: 'rgba(10,10,20,0.45)', fontSize: 13, marginTop: 6 }}>
            Inicia sesión en tu cuenta
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#ef4444',
            padding: '12px 14px',
            borderRadius: 12,
            fontSize: 13,
            marginBottom: 14,
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%', padding: '13px 16px', borderRadius: 12, outline: 'none',
              background: 'rgba(79,172,254,0.05)', border: '1.5px solid rgba(79,172,254,0.2)',
              color: '#0a0a14', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box',
              transition: 'border-color 0.2s',
            }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%', padding: '13px 16px', borderRadius: 12, outline: 'none',
              background: 'rgba(79,172,254,0.05)', border: '1.5px solid rgba(79,172,254,0.2)',
              color: '#0a0a14', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box',
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 4, padding: '14px', borderRadius: 12, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              background: HOLO, color: '#fff', fontSize: 14, fontWeight: 700,
              fontFamily: 'inherit', letterSpacing: 1, opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 16px rgba(79,172,254,0.3)',
            }}
          >
            {loading ? 'Entrando...' : 'ENTRAR'}
          </button>
        </form>

        {/* Social login */}
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <button onClick={handleGoogleLogin} style={{
            flex: 1, padding: '11px 0', borderRadius: 10, cursor: 'pointer',
            background: '#fff', border: '1.5px solid rgba(79,172,254,0.2)',
            color: '#0a0a14', fontSize: 12, fontFamily: 'inherit', fontWeight: 600,
            boxShadow: '0 2px 8px rgba(79,172,254,0.08)',
          }}>
            🔵 Google
          </button>
          <button onClick={handleFacebookLogin} style={{
            flex: 1, padding: '11px 0', borderRadius: 10, cursor: 'pointer',
            background: '#fff', border: '1.5px solid rgba(79,172,254,0.2)',
            color: '#0a0a14', fontSize: 12, fontFamily: 'inherit', fontWeight: 600,
            boxShadow: '0 2px 8px rgba(79,172,254,0.08)',
          }}>
            🔷 Facebook
          </button>
        </div>

        <div style={{ marginTop: 28, textAlign: 'center', color: 'rgba(10,10,20,0.45)', fontSize: 13 }}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" style={{ background: HOLO, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', textDecoration: 'none', fontWeight: 700 }}>
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
