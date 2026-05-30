import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const S = `
  @keyframes silver-flow{0%,100%{background-position:0% 50%}33%{background-position:100% 50%}66%{background-position:50% 0%}}
  @keyframes float-mark{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
  .rp-page{min-height:100vh;background:#000;display:flex;align-items:center;justify-content:center;padding:32px 20px;font-family:'Sora',sans-serif;}
  .rp-box{width:100%;max-width:380px;display:flex;flex-direction:column;align-items:center;}
  .rp-sphere{width:72px;height:72px;border-radius:50%;position:relative;isolation:isolate;overflow:hidden;
    background:radial-gradient(circle at 35% 30%,#2a2a2a,#080808);
    box-shadow:0 8px 28px rgba(0,0,0,.9),inset 0 1px 0 rgba(255,255,255,.55);
    display:flex;align-items:center;justify-content:center;margin-bottom:18px;animation:float-mark 4s ease-in-out infinite;}
  .rp-sphere::before{content:'';position:absolute;inset:0;padding:1.8px;border-radius:50%;
    background:linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff,#5d626b,#c9ced6);background-size:300% 300%;
    -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
    -webkit-mask-composite:xor;mask-composite:exclude;animation:silver-flow 5s ease-in-out infinite;}
  .rp-sphere-icon{font-size:28px;position:relative;z-index:2;}
  .rp-title{font-family:'Cinzel',serif;font-size:20px;font-weight:700;letter-spacing:3px;text-align:center;margin-bottom:4px;
    background:linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff);background-size:300% 300%;
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:silver-flow 5s ease-in-out infinite;}
  .rp-sub{font-size:12px;color:rgba(200,210,230,.4);text-align:center;margin-bottom:26px;letter-spacing:.5px;}
  .rp-card{width:100%;position:relative;isolation:isolate;overflow:hidden;border-radius:22px;padding:24px 20px;
    background:radial-gradient(circle at 35% 30%,#1a1a1a,#080808);
    box-shadow:0 10px 34px rgba(0,0,0,.85),inset 0 1px 0 rgba(255,255,255,.45);display:flex;flex-direction:column;gap:12px;}
  .rp-card::before{content:'';position:absolute;inset:0;padding:1.6px;border-radius:inherit;
    background:linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff,#5d626b,#c9ced6);background-size:300% 300%;
    -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
    -webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;animation:silver-flow 5s ease-in-out infinite;}
  .rp-input{width:100%;background:rgba(255,255,255,.03);border:1px solid rgba(215,219,226,.2);border-radius:999px;
    padding:12px 20px;color:rgba(233,236,241,.9);font-family:'Sora',sans-serif;font-size:14px;outline:none;
    position:relative;z-index:2;box-sizing:border-box;transition:border-color .2s;}
  .rp-input:focus{border-color:rgba(215,219,226,.6);}
  .rp-input::placeholder{color:rgba(200,210,230,.28);}
  .rp-btn{width:100%;padding:12px;border-radius:999px;border:none;cursor:pointer;position:relative;z-index:2;
    background:radial-gradient(circle at 35% 30%,#2a2a2a,#080808);
    color:rgba(215,219,226,.9);font-family:'Sora',sans-serif;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;
    box-shadow:0 4px 16px rgba(0,0,0,.7),inset 0 1px 0 rgba(255,255,255,.4);transition:all .2s;}
  .rp-btn:hover:not(:disabled){box-shadow:0 6px 22px rgba(0,0,0,.8),0 0 14px rgba(215,219,226,.15),inset 0 1px 0 rgba(255,255,255,.5);}
  .rp-btn:disabled{opacity:.4;cursor:not-allowed;}
  .rp-link{background:linear-gradient(135deg,#fff,#d7dbe2,#9aa0ab);background-size:300% 300%;
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
    text-decoration:none;font-weight:600;font-size:13px;animation:silver-flow 5s ease-in-out infinite;}
  .rp-success{border-radius:14px;padding:16px;text-align:center;font-size:13px;
    background:rgba(34,197,94,.06);border:1px solid rgba(34,197,94,.25);color:rgba(134,239,172,.9);
    position:relative;z-index:2;}
  .rp-err{border-radius:12px;padding:10px 14px;font-size:12px;
    background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.2);color:rgba(252,165,165,.9);
    position:relative;z-index:2;}
  .rp-invalid{min-height:100vh;background:#000;display:flex;align-items:center;justify-content:center;padding:24px;font-family:'Sora',sans-serif;}
`;

export default function ResetPassword() {
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
      <div className="rp-invalid">
        <style>{S}</style>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>❌</div>
          <div style={{ color: 'rgba(252,165,165,.9)', marginBottom: 16, fontSize: 14 }}>Enlace inválido o expirado</div>
          <Link to="/forgot-password" className="rp-link">Solicitar nuevo enlace</Link>
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
    <div className="rp-page">
      <style>{S}</style>
      <div className="rp-box">
        <div className="rp-sphere">
          <span className="rp-sphere-icon">🔐</span>
        </div>
        <div className="rp-title">NUEVA CONTRASEÑA</div>
        <div className="rp-sub">Para: {email}</div>

        {status === 'done' ? (
          <div className="rp-card">
            <div className="rp-success">
              <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
              ¡Contraseña actualizada! Redirigiendo al login...
            </div>
          </div>
        ) : (
          <div className="rp-card">
            {error && <div className="rp-err">{error}</div>}
            <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
              <input
                className="rp-input"
                type="password"
                placeholder="Nueva contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                className="rp-input"
                type="password"
                placeholder="Confirmar contraseña"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              <button className="rp-btn" type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Guardando...' : 'Guardar contraseña'}
              </button>
            </form>
            <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
              <Link to="/login" className="rp-link">Volver al login</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
