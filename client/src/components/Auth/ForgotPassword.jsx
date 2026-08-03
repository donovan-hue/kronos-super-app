import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KsDefs, Icon } from './ksParts';
import '../../styles/kronospace.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | sent | error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('sent');
      } else {
        setStatus('error');
        setMessage(data.message || 'No se pudo enviar el correo. Intenta de nuevo.');
      }
    } catch {
      setStatus('error');
      setMessage('El servidor tardó demasiado. Espera unos segundos y vuelve a intentarlo.');
    }
  };

  return (
    <div className="ks-root ks-bg ks-auth">
      <KsDefs />
      <div className="card ks-auth-card">
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div className="ks-orb-ico" style={{ marginBottom: 16 }}>
            <Icon name="key" size={30} />
          </div>
          <h1 className="ks-h metal-text" style={{ fontSize: 26, margin: 0 }}>
            Recuperar contraseña
          </h1>
          <div style={{ color: 'var(--ks-dim)', fontSize: 13, marginTop: 8 }}>
            Te enviaremos un enlace a tu email
          </div>
        </div>

        {status === 'sent' ? (
          <div className="ks-note ok" style={{ textAlign: 'center' }}>
            <div className="ks-orb-ico" style={{ width: 48, height: 48, marginBottom: 12 }}>
              <Icon name="mail" size={24} />
            </div>
            <strong>¡Listo!</strong> Si ese email existe, recibirás el enlace en unos minutos.
            <div style={{ marginTop: 18 }}>
              <Link to="/login" className="ks-link">Volver al login</Link>
            </div>
          </div>
        ) : (
          <>
            {status === 'error' && (
              <div className="ks-note err" style={{ marginBottom: 14 }}>{message}</div>
            )}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                className="ks-input"
                type="email"
                placeholder="Tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn-metal" disabled={status === 'loading'}
                style={{ padding: 14, opacity: status === 'loading' ? 0.7 : 1, cursor: status === 'loading' ? 'not-allowed' : 'pointer' }}>
                {status === 'loading' ? 'Enviando…' : 'ENVIAR ENLACE'}
              </button>
            </form>
            <div style={{ marginTop: 22, textAlign: 'center', fontSize: 13 }}>
              <Link to="/login" className="ks-link"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Icon name="back" size={15} /> Volver al login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
