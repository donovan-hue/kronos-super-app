import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { KsDefs, Icon } from './ksParts';
import '../../styles/kronospace.css';

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
      <div className="ks-root ks-bg ks-auth">
        <KsDefs />
        <div className="card ks-auth-card" style={{ textAlign: 'center' }}>
          <div className="ks-orb-ico" style={{ marginBottom: 16 }}>
            <Icon name="alert" size={28} />
          </div>
          <div className="ks-h metal-text" style={{ fontSize: 20, marginBottom: 8 }}>
            Enlace inválido o expirado
          </div>
          <div style={{ color: 'var(--ks-dim)', fontSize: 13, marginBottom: 18 }}>
            Solicita uno nuevo para continuar.
          </div>
          <Link to="/forgot-password" className="ks-link">Solicitar nuevo enlace</Link>
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
    <div className="ks-root ks-bg ks-auth">
      <KsDefs />
      <div className="card ks-auth-card">
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div className="ks-orb-ico" style={{ marginBottom: 16 }}>
            <Icon name="lock" size={30} />
          </div>
          <h1 className="ks-h metal-text" style={{ fontSize: 26, margin: 0 }}>Nueva contraseña</h1>
          <div style={{ color: 'var(--ks-dim)', fontSize: 13, marginTop: 8 }}>Para: {email}</div>
        </div>

        {status === 'done' ? (
          <div className="ks-note ok" style={{ textAlign: 'center' }}>
            <div className="ks-orb-ico" style={{ width: 48, height: 48, marginBottom: 12 }}>
              <Icon name="shieldCheck" size={24} />
            </div>
            ¡Contraseña actualizada! Redirigiendo al login…
          </div>
        ) : (
          <>
            {error && <div className="ks-note err" style={{ marginBottom: 14 }}>{error}</div>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                className="ks-input"
                type="password"
                placeholder="Nueva contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                className="ks-input"
                type="password"
                placeholder="Confirmar contraseña"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              <button type="submit" className="btn-metal" disabled={status === 'loading'}
                style={{ padding: 14, opacity: status === 'loading' ? 0.7 : 1, cursor: status === 'loading' ? 'not-allowed' : 'pointer' }}>
                {status === 'loading' ? 'Guardando…' : 'GUARDAR CONTRASEÑA'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
