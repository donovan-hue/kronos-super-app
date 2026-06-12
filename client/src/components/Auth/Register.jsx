import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import KronosLogo from '../kronos/KronosLogo';

const inputStyle = {
  width: '100%', padding: '14px 16px', borderRadius: 12, outline: 'none',
  background: 'rgba(255,255,255,0.022)', border: '1px solid rgba(190,200,212,0.18)',
  color: '#c9ced4', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box',
};

function Register() {
  const [method, setMethod] = useState('email'); // 'email' | 'phone'
  const [formData, setFormData] = useState({
    username: '', email: '', phone: '', password: '', firstName: '', lastName: '',
  });
  const [error, setError] = useState('');
  const [slowWarning, setSlowWarning] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSlowWarning(false);

    if (method === 'phone' && !formData.phone) {
      return setError('Ingresa tu número de teléfono');
    }
    if (method === 'email' && !formData.email) {
      return setError('Ingresa tu email');
    }

    const timer = setTimeout(() => setSlowWarning(true), 5000);
    const result = await register(
      formData.username,
      method === 'email' ? formData.email : '',
      formData.password,
      formData.firstName,
      formData.lastName,
      method === 'phone' ? formData.phone : ''
    );
    clearTimeout(timer);
    setSlowWarning(false);
    if (result.success) navigate('/feed');
    else setError(result.message);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(120% 100% at 50% 25%, #0c0d0f, #000 72%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      fontFamily: "'Manrope', system-ui, sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
          <KronosLogo markSize={84} fontSize={28} gap={14} />
          <div style={{ fontSize: 11, letterSpacing: '.4em', textTransform: 'uppercase', color: '#565b62', marginTop: 12 }}>
            Crea tu cuenta
          </div>
        </div>

        {/* Selector Email / Teléfono */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 4 }}>
          {[
            { id: 'email', label: 'Email' },
            { id: 'phone', label: 'Teléfono' },
          ].map(opt => (
            <button key={opt.id} type="button" onClick={() => setMethod(opt.id)}
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input style={inputStyle} name="firstName" placeholder="Nombre" value={formData.firstName} onChange={handleChange} />
            <input style={inputStyle} name="lastName" placeholder="Apellido" value={formData.lastName} onChange={handleChange} />
          </div>
          <input style={inputStyle} name="username" placeholder="Nombre de usuario" value={formData.username} onChange={handleChange} required />

          {method === 'email' ? (
            <input style={inputStyle} name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          ) : (
            <input style={inputStyle} name="phone" type="tel" placeholder="Número de teléfono (ej. +521234567890)" value={formData.phone} onChange={handleChange} required />
          )}

          <div style={{ position: 'relative' }}>
            <input
              style={{ ...inputStyle, paddingRight: 56 }}
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña (mín. 6 caracteres)"
              value={formData.password}
              onChange={handleChange}
              required
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
            <span style={{ width: '100%' }}>{loading ? 'Creando cuenta…' : 'Registrarse'}</span>
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', color: 'var(--silver-dim)', fontSize: 13 }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="metal-text" style={{ textDecoration: 'none', fontWeight: 700 }}>
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
