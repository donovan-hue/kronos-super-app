import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { HoloText } from '../kronos';

const HOLO = 'linear-gradient(135deg,#4facfe,#00f2fe,#f3a0ff,#ff85a2)';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  if (!token || !email) {
    return (
      <div style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Outfit', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>❌</div>
          <div style={{ color: '#ef4444', marginBottom: 16 }}>Enlace inválido o expirado</div>
          <Link to="/forgot-password" style={{ background: HOLO, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontWeight: 700, textDecoration: 'none' }}>
            Solicitar nuevo enlace
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres');
    if (password !== confirm) return setError('Las contraseñas no coinciden');

    setStatus('loading');
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('done');
        setTimeout(() => navigate('/login'), 2500);
      } else {
        setError(data.message || 'Error al restablecer la contraseña');
        setStatus('idle');
      }
    } catch {
      setError('No se pudo conectar al servidor');
      setStatus('idle');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 70% 20%, rgba(243,160,255,0.07), transparent 50%), #ffffff',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      fontFamily: "'Outfit', sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>🔐</div>
          <HoloText size={30}>Nueva contraseña</HoloText>
          <div style={{ color: 'rgba(10,10,20,0.45)', fontSize: 13, marginTop: 8 }}>
            Para: {email}
          </div>
        </div>

        {status === 'done' ? (
          <div style={{
            background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)',
            color: '#16a34a', padding: '18px', borderRadius: 14, textAlign: 'center', fontSize: 14,
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
            ¡Contraseña actualizada! Redirigiendo al login...
          </div>
        ) : (
          <>
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '12px 14px', borderRadius: 12, fontSize: 13, marginBottom: 14 }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                type="password"
                placeholder="Nueva contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%', padding: '13px 16px', borderRadius: 12, outline: 'none',
                  background: 'rgba(79,172,254,0.05)', border: '1.5px solid rgba(79,172,254,0.2)',
                  color: '#0a0a14', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box',
                }}
              />
              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                style={{
                  width: '100%', padding: '13px 16px', borderRadius: 12, outline: 'none',
                  background: 'rgba(79,172,254,0.05)', border: '1.5px solid rgba(79,172,254,0.2)',
                  color: '#0a0a14', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box',
                }}
              />
              <button type="submit" disabled={status === 'loading'} style={{
                padding: '14px', borderRadius: 12, border: 'none', cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                background: HOLO, color: '#fff', fontSize: 14, fontWeight: 700,
                fontFamily: 'inherit', letterSpacing: 1, opacity: status === 'loading' ? 0.7 : 1,
                boxShadow: '0 4px 16px rgba(79,172,254,0.3)',
              }}>
                {status === 'loading' ? 'Guardando...' : 'GUARDAR CONTRASEÑA'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
