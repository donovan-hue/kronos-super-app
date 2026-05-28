import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BotonBurbuja3D } from '../kronos';

const inputStyle = {
  width: '100%', padding: '13px 16px', borderRadius: 13, outline: 'none',
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

function Register() {
  const [method, setMethod] = useState('email');
  const [formData, setFormData] = useState({
    username: '', email: '', phone: '', password: '', firstName: '', lastName: '',
  });
  const [error, setError] = useState('');
  const [slowWarning, setSlowWarning] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSlowWarning(false);
    if (method === 'phone' && !formData.phone) return setError('Ingresa tu número de teléfono');
    if (method === 'email' && !formData.email) return setError('Ingresa tu email');

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
      background: '#08080f',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '28px 20px', fontFamily: "'Outfit', sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '-15%', right: '10%',
        width: '50%', height: '50%',
        background: 'radial-gradient(ellipse, rgba(212,175,55,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', left: '5%',
        width: '40%', height: '40%',
        background: 'radial-gradient(ellipse, rgba(124,58,237,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 86, height: 86, borderRadius: '50%', margin: '0 auto 18px',
            background: 'linear-gradient(135deg, #6B5A0A, #A08820, #D4AF37, #F0D060, #D4AF37, #A08820)',
            backgroundSize: '300% 300%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(212,175,55,0.45), 0 0 80px rgba(212,175,55,0.12)',
            animation: 'k-gold-shift 5s ease-in-out infinite',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: '10%', left: '16%', width: '55%', height: '30%',
              background: 'linear-gradient(180deg,rgba(255,255,255,0.45) 0%,transparent 100%)',
              borderRadius: '50%', filter: 'blur(3px)',
            }} />
            <span style={{ fontSize: 40, fontWeight: 900, color: '#08080f', position: 'relative', zIndex: 1, lineHeight: 1 }}>K</span>
          </div>

          <div style={{
            fontSize: 'clamp(30px,9vw,44px)', fontWeight: 900, letterSpacing: 9,
            background: 'linear-gradient(90deg, #6B5A0A, #A08820, #D4AF37, #F0D060, #D4AF37, #A08820)',
            backgroundSize: '300% 300%',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            animation: 'k-gold-shift 5s ease-in-out infinite',
            filter: 'drop-shadow(0 0 16px rgba(212,175,55,0.35))',
            marginBottom: 6,
          }}>KRONOS</div>

          <div style={{ color: 'rgba(212,175,55,0.4)', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 300 }}>
            Crear cuenta
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(212,175,55,0.15)',
          borderRadius: 20, padding: '24px 22px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(212,175,55,0.06)',
        }}>

          {/* Selector método */}
          <div style={{
            display: 'flex', gap: 4, marginBottom: 18,
            background: 'rgba(255,255,255,0.03)', borderRadius: 11, padding: 4,
            border: '1px solid rgba(212,175,55,0.1)',
          }}>
            {[{ id: 'email', label: '📧 Email' }, { id: 'phone', label: '📱 Teléfono' }].map(opt => (
              <button key={opt.id} type="button" onClick={() => setMethod(opt.id)}
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
              fontSize: 13, marginBottom: 14,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11 }}>
              <input style={inputStyle} name="firstName" placeholder="Nombre"
                value={formData.firstName} onChange={handleChange} {...inputFocusHandlers} />
              <input style={inputStyle} name="lastName" placeholder="Apellido"
                value={formData.lastName} onChange={handleChange} {...inputFocusHandlers} />
            </div>

            <input style={inputStyle} name="username" placeholder="Nombre de usuario"
              value={formData.username} onChange={handleChange} required {...inputFocusHandlers} />

            {method === 'email' ? (
              <input style={inputStyle} name="email" type="email" placeholder="Email"
                value={formData.email} onChange={handleChange} required {...inputFocusHandlers} />
            ) : (
              <input style={inputStyle} name="phone" type="tel" placeholder="Teléfono (+521234567890)"
                value={formData.phone} onChange={handleChange} required {...inputFocusHandlers} />
            )}

            <div style={{ position: 'relative' }}>
              <input
                style={{ ...inputStyle, paddingRight: 48 }}
                name="password" type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña (mín. 6 caracteres)"
                value={formData.password} onChange={handleChange} required
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
              {loading ? 'Creando cuenta...' : 'REGISTRARSE'}
            </BotonBurbuja3D>
          </form>
        </div>

        <div style={{ marginTop: 22, textAlign: 'center', color: 'rgba(240,240,248,0.35)', fontSize: 13 }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{
            background: 'linear-gradient(90deg, #A08820, #D4AF37, #F0D060)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', textDecoration: 'none', fontWeight: 700,
          }}>
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
