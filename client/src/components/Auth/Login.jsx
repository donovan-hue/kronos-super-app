import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BotonBurbuja3D } from '../kronos';

const API_BASE = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace('/api', '')
  : 'http://localhost:5000';

const inputStyle = {
  width: '100%', padding: '14px 16px', borderRadius: 13, outline: 'none',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(212,175,55,0.18)',
  color: '#F0F0F8', fontSize: 14, fontFamily: "'Outfit', sans-serif",
  boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
};

const inputFocusHandlers = {
  onFocus: e => {
    e.target.style.borderColor = 'rgba(212,175,55,0.55)';
    e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08), inset 0 1px 0 rgba(255,255,255,0.04)';
  },
  onBlur: e => {
    e.target.style.borderColor = 'rgba(212,175,55,0.18)';
    e.target.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.03)';
  },
};

function Login() {
  const [method, setMethod] = useState('email');
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
      background: '#08080f',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: "'Outfit', sans-serif", position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient glow de fondo */}
      <div style={{
        position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
        width: '60%', height: '50%',
        background: 'radial-gradient(ellipse, rgba(212,175,55,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', left: '10%',
        width: '40%', height: '40%',
        background: 'radial-gradient(ellipse, rgba(124,58,237,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          {/* K logo */}
          <div style={{
            width: 96, height: 96, borderRadius: '50%', margin: '0 auto 22px',
            background: 'linear-gradient(135deg, #6B5A0A, #A08820, #D4AF37, #F0D060, #D4AF37, #A08820)',
            backgroundSize: '300% 300%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 50px rgba(212,175,55,0.5), 0 0 100px rgba(212,175,55,0.15)',
            animation: 'k-gold-shift 5s ease-in-out infinite',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: '10%', left: '16%', width: '55%', height: '30%',
              background: 'linear-gradient(180deg,rgba(255,255,255,0.45) 0%,transparent 100%)',
              borderRadius: '50%', filter: 'blur(3px)',
            }} />
            <span style={{
              fontSize: 46, fontWeight: 900, color: '#08080f',
              textShadow: '0 2px 8px rgba(0,0,0,0.3)',
              position: 'relative', zIndex: 1, lineHeight: 1,
            }}>K</span>
          </div>

          <div style={{
            fontSize: 'clamp(34px,10vw,50px)', fontWeight: 900, letterSpacing: 10,
            background: 'linear-gradient(90deg, #6B5A0A, #A08820, #D4AF37, #F0D060, #D4AF37, #A08820, #6B5A0A)',
            backgroundSize: '300% 300%',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            animation: 'k-gold-shift 5s ease-in-out infinite',
            filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.4))',
            marginBottom: 8,
          }}>KRONOS</div>

          <div style={{ color: 'rgba(212,175,55,0.45)', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 300 }}>
            Tu tiempo. Tu espacio. Tu orden.
          </div>
        </div>

        {/* Card de login */}
        <div style={{
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(212,175,55,0.15)',
          borderRadius: 20,
          padding: '28px 24px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(212,175,55,0.06)',
        }}>

          {/* Selector Email / Teléfono */}
          <div style={{
            display: 'flex', gap: 4, marginBottom: 20,
            background: 'rgba(255,255,255,0.03)', borderRadius: 11, padding: 4,
            border: '1px solid rgba(212,175,55,0.1)',
          }}>
            {[
              { id: 'email', label: '📧 Email' },
              { id: 'phone', label: '📱 Teléfono' },
            ].map(opt => (
              <button key={opt.id} type="button"
                onClick={() => { setMethod(opt.id); setIdentifier(''); }}
                style={{
                  flex: 1, padding: '9px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  background: method === opt.id
                    ? 'linear-gradient(135deg, #A08820, #D4AF37, #F0D060)'
                    : 'transparent',
                  color: method === opt.id ? '#08080f' : 'rgba(240,240,248,0.4)',
                  boxShadow: method === opt.id ? '0 2px 12px rgba(212,175,55,0.4)' : 'none',
                  transition: 'all 0.2s',
                }}>
                {opt.label}
              </button>
            ))}
          </div>

          {slowWarning && (
            <div style={{
              background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.25)',
              color: 'rgba(212,175,55,0.85)', padding: '10px 14px', borderRadius: 11,
              fontSize: 12, marginBottom: 14, textAlign: 'center',
            }}>
              ⏳ El servidor está despertando, espera unos segundos...
            </div>
          )}

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)',
              color: 'rgba(239,68,68,0.9)', padding: '12px 14px', borderRadius: 11,
              fontSize: 13, marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {method === 'email' ? (
              <input
                type="email" placeholder="Email"
                value={identifier} onChange={e => setIdentifier(e.target.value)}
                required style={inputStyle} {...inputFocusHandlers}
              />
            ) : (
              <input
                type="tel" placeholder="Teléfono (ej. +521234567890)"
                value={identifier} onChange={e => setIdentifier(e.target.value)}
                required style={inputStyle} {...inputFocusHandlers}
              />
            )}

            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                value={password} onChange={e => setPassword(e.target.value)}
                required style={{ ...inputStyle, paddingRight: 48 }}
                {...inputFocusHandlers}
              />
              <button type="button" onClick={() => setShowPassword(v => !v)} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', fontSize: 17,
                color: 'rgba(212,175,55,0.5)', padding: 4, lineHeight: 1,
              }}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <BotonBurbuja3D
              as="button" type="submit" size="md"
              disabled={loading} style={{ width: '100%', marginTop: 6 }}
            >
              {loading ? 'Entrando...' : 'ENTRAR'}
            </BotonBurbuja3D>
          </form>

          <div style={{ marginTop: 14, textAlign: 'center' }}>
            <Link to="/forgot-password" style={{
              color: 'rgba(212,175,55,0.45)', fontSize: 12, textDecoration: 'none',
              transition: 'color 0.2s',
            }}>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(212,175,55,0.1)' }} />
            <span style={{ color: 'rgba(212,175,55,0.3)', fontSize: 11, letterSpacing: 1 }}>O</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(212,175,55,0.1)' }} />
          </div>

          {/* Google */}
          <button onClick={handleGoogleLogin} style={{
            width: '100%', padding: '12px 0', borderRadius: 12, cursor: 'pointer',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(212,175,55,0.15)',
            color: 'rgba(240,240,248,0.75)', fontSize: 13,
            fontFamily: 'inherit', fontWeight: 600,
            boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'; e.currentTarget.style.background = 'rgba(212,175,55,0.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.15)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
          >
            🔵 Continuar con Google
          </button>
        </div>

        <div style={{ marginTop: 24, textAlign: 'center', color: 'rgba(240,240,248,0.35)', fontSize: 13 }}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" style={{
            background: 'linear-gradient(90deg, #A08820, #D4AF37, #F0D060)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', textDecoration: 'none', fontWeight: 700,
          }}>
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
