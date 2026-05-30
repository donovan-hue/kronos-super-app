import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const S = `
  @keyframes silver-flow{0%,100%{background-position:0% 50%}33%{background-position:100% 50%}66%{background-position:50% 0%}}
  @keyframes float-mark{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
  .fp-page{min-height:100vh;background:#000;display:flex;align-items:center;justify-content:center;padding:32px 20px;font-family:'Sora',sans-serif;}
  .fp-box{width:100%;max-width:380px;display:flex;flex-direction:column;align-items:center;}
  .fp-sphere{width:72px;height:72px;border-radius:50%;position:relative;isolation:isolate;overflow:hidden;
    background:radial-gradient(circle at 35% 30%,#2a2a2a,#080808);
    box-shadow:0 8px 28px rgba(0,0,0,.9),inset 0 1px 0 rgba(255,255,255,.55);
    display:flex;align-items:center;justify-content:center;margin-bottom:18px;animation:float-mark 4s ease-in-out infinite;}
  .fp-sphere::before{content:'';position:absolute;inset:0;padding:1.8px;border-radius:50%;
    background:linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff,#5d626b,#c9ced6);background-size:300% 300%;
    -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
    -webkit-mask-composite:xor;mask-composite:exclude;animation:silver-flow 5s ease-in-out infinite;}
  .fp-title{font-family:'Cinzel',serif;font-size:20px;font-weight:700;letter-spacing:3px;text-align:center;margin-bottom:4px;
    background:linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff);background-size:300% 300%;
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:silver-flow 5s ease-in-out infinite;}
  .fp-sub{font-size:12px;color:rgba(200,210,230,.4);text-align:center;margin-bottom:26px;letter-spacing:.5px;}
  .fp-card{width:100%;position:relative;isolation:isolate;overflow:hidden;border-radius:22px;padding:24px 20px;
    background:radial-gradient(circle at 35% 30%,#1a1a1a,#080808);
    box-shadow:0 10px 34px rgba(0,0,0,.85),inset 0 1px 0 rgba(255,255,255,.45);display:flex;flex-direction:column;gap:12px;}
  .fp-card::before{content:'';position:absolute;inset:0;padding:1.6px;border-radius:inherit;
    background:linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff,#5d626b,#c9ced6);background-size:300% 300%;
    -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
    -webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;animation:silver-flow 5s ease-in-out infinite;}
  .fp-input{width:100%;background:rgba(255,255,255,.03);border:1px solid rgba(215,219,226,.2);border-radius:999px;
    padding:12px 20px;color:rgba(233,236,241,.9);font-family:'Sora',sans-serif;font-size:14px;outline:none;
    position:relative;z-index:2;box-sizing:border-box;transition:border-color .2s;}
  .fp-input:focus{border-color:rgba(215,219,226,.6);}
  .fp-input::placeholder{color:rgba(200,210,230,.28);}
  .fp-btn{width:100%;padding:12px;border-radius:999px;border:none;cursor:pointer;position:relative;z-index:2;
    background:radial-gradient(circle at 35% 30%,#2a2a2a,#080808);
    color:rgba(215,219,226,.9);font-family:'Sora',sans-serif;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;
    box-shadow:0 4px 16px rgba(0,0,0,.7),inset 0 1px 0 rgba(255,255,255,.4);transition:all .2s;}
  .fp-btn:hover:not(:disabled){box-shadow:0 6px 22px rgba(0,0,0,.8),0 0 14px rgba(215,219,226,.15),inset 0 1px 0 rgba(255,255,255,.5);}
  .fp-btn:disabled{opacity:.4;cursor:not-allowed;}
  .fp-link{background:linear-gradient(135deg,#fff,#d7dbe2,#9aa0ab);background-size:300% 300%;
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
    text-decoration:none;font-weight:600;font-size:13px;animation:silver-flow 5s ease-in-out infinite;}
  .fp-success{border-radius:14px;padding:16px;text-align:center;font-size:13px;
    background:rgba(34,197,94,.06);border:1px solid rgba(34,197,94,.25);color:rgba(134,239,172,.9);
    position:relative;z-index:2;}
  .fp-err{border-radius:12px;padding:10px 14px;font-size:12px;
    background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.2);color:rgba(252,165,165,.9);
    position:relative;z-index:2;}
`;

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
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
      if (res.ok) { setStatus('sent'); }
      else { setStatus('error'); setMessage(data.message || 'No se pudo enviar el correo.'); }
    } catch {
      setStatus('error');
      setMessage('El servidor tardó demasiado. Intenta de nuevo.');
    }
  };

  return (
    <div className="fp-page">
      <style>{S}</style>
      <div className="fp-box">
        <div className="fp-sphere">
          <span style={{ fontSize: 32, position: 'relative', zIndex: 3 }}>🔑</span>
        </div>
        <div className="fp-title">RECUPERAR ACCESO</div>
        <div className="fp-sub">Te enviaremos un enlace a tu email</div>

        <div className="fp-card">
          {status === 'sent' ? (
            <div className="fp-success">
              <div style={{ fontSize: 28, marginBottom: 8 }}>📧</div>
              <strong>¡Listo!</strong> Si ese email existe, recibirás el enlace en unos minutos.
              <div style={{ marginTop: 14 }}>
                <Link to="/login" className="fp-link">← Volver al login</Link>
              </div>
            </div>
          ) : (
            <>
              {status === 'error' && <div className="fp-err">{message}</div>}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input className="fp-input" type="email" placeholder="Tu email"
                  value={email} onChange={e => setEmail(e.target.value)} required />
                <button className="fp-btn" type="submit" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Enviando...' : 'ENVIAR ENLACE'}
                </button>
              </form>
              <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                <Link to="/login" className="fp-link">← Volver al login</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
