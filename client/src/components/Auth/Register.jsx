import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BotonBurbuja3D } from '../kronos';

/* Reutiliza los mismos estilos base de auth */
const AUTH_S = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Sora:wght@300;400;500&display=swap');
  @keyframes silver-flow{0%,100%{background-position:0% 50%}33%{background-position:100% 50%}66%{background-position:50% 0%}}
  @keyframes float-mark{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes glow-pulse{0%,100%{box-shadow:0 10px 34px rgba(0,0,0,.7),inset 0 1px 0 rgba(255,255,255,.5)}50%{box-shadow:0 10px 34px rgba(0,0,0,.7),0 0 24px rgba(215,219,226,.22),inset 0 1px 0 rgba(255,255,255,.65)}}
  .auth-page{min-height:100vh;background:#000;background-image:radial-gradient(120% 50% at 50% 0%,#15161c 0%,#000 65%);display:flex;align-items:center;justify-content:center;padding:32px 20px;font-family:'Sora',sans-serif;}
  .auth-box{width:100%;max-width:400px;display:flex;flex-direction:column;align-items:center;}
  .auth-mark{width:72px;height:72px;border-radius:50%;isolation:isolate;position:relative;overflow:hidden;background:rgba(255,255,255,.045);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);box-shadow:0 10px 34px rgba(0,0,0,.7),inset 0 1px 0 rgba(255,255,255,.55);display:flex;align-items:center;justify-content:center;animation:float-mark 4s ease-in-out infinite,glow-pulse 3s ease-in-out infinite;margin-bottom:16px;}
  .auth-mark::before{content:'';position:absolute;inset:0;padding:1.6px;border-radius:50%;background:linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff,#5d626b,#c9ced6);background-size:300% 300%;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;animation:silver-flow 5s ease-in-out infinite;}
  .auth-mark::after{content:'';position:absolute;left:12%;right:12%;top:7px;height:36%;background:linear-gradient(180deg,rgba(255,255,255,.38),rgba(255,255,255,0));filter:blur(1px);border-radius:50%;pointer-events:none;}
  .auth-mark-k{font-family:'Cinzel',serif;font-size:34px;font-weight:700;position:relative;z-index:3;background:linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff);background-size:300% 300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:silver-flow 5s ease-in-out infinite;}
  .auth-title{font-family:'Cinzel',serif;font-size:24px;font-weight:700;letter-spacing:5px;text-transform:uppercase;text-align:center;background:linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff,#5d626b,#c9ced6);background-size:300% 300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:silver-flow 5s ease-in-out infinite;filter:drop-shadow(0 0 8px rgba(200,210,220,.25));margin-bottom:4px;}
  .auth-sub{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:rgba(200,210,230,.35);margin-bottom:22px;}
  .auth-card{width:100%;position:relative;isolation:isolate;overflow:hidden;border-radius:26px;padding:22px 20px;background:rgba(255,255,255,.03);backdrop-filter:blur(16px) saturate(140%);-webkit-backdrop-filter:blur(16px) saturate(140%);box-shadow:0 10px 34px rgba(0,0,0,.7),inset 0 1px 0 rgba(255,255,255,.45);display:flex;flex-direction:column;gap:10px;}
  .auth-card::before{content:'';position:absolute;inset:0;padding:1.5px;border-radius:inherit;background:linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff,#5d626b,#c9ced6);background-size:300% 300%;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;animation:silver-flow 5s ease-in-out infinite;}
  .auth-card::after{content:'';position:absolute;left:10%;right:10%;top:0;height:28%;background:linear-gradient(180deg,rgba(255,255,255,.1),rgba(255,255,255,0));filter:blur(1px);pointer-events:none;}
  .auth-method{display:flex;gap:4px;padding:4px;border-radius:999px;background:rgba(0,0,0,.3);position:relative;z-index:3;}
  .auth-method-btn{flex:1;padding:7px;border-radius:999px;border:none;cursor:pointer;font-family:'Sora',sans-serif;font-size:11px;font-weight:500;letter-spacing:.5px;text-transform:uppercase;transition:all .2s;position:relative;z-index:3;}
  .auth-method-btn.sel{background:rgba(255,255,255,.06);color:rgba(233,236,241,.9);box-shadow:0 2px 10px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.3);}
  .auth-method-btn:not(.sel){background:transparent;color:rgba(200,210,230,.3);}
  .auth-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  .auth-input-wrap{position:relative;isolation:isolate;overflow:hidden;border-radius:999px;background:rgba(255,255,255,.025);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:0 4px 16px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.3);z-index:3;}
  .auth-input-wrap::before{content:'';position:absolute;inset:0;padding:1.4px;border-radius:inherit;background:linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff,#5d626b,#c9ced6);background-size:300% 300%;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;animation:silver-flow 5s ease-in-out infinite;opacity:.55;}
  .auth-input-wrap:focus-within::before{opacity:1;}
  .auth-input{width:100%;background:transparent;border:none;outline:none;padding:12px 18px;color:rgba(233,236,241,.9);font-family:'Sora',sans-serif;font-size:13px;font-weight:300;caret-color:#d7dbe2;position:relative;z-index:2;}
  .auth-input::placeholder{color:rgba(200,210,230,.28);}
  .auth-eye{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:rgba(200,210,230,.35);font-size:15px;z-index:4;line-height:1;}
  .auth-err{background:rgba(255,255,255,.02);border-radius:14px;padding:9px 14px;font-size:12px;color:rgba(220,100,100,.85);position:relative;z-index:3;border:1px solid rgba(220,100,100,.2);}
  .auth-warn{background:rgba(255,255,255,.02);border-radius:14px;padding:9px 14px;font-size:12px;color:rgba(200,210,230,.5);position:relative;z-index:3;text-align:center;}
  .auth-footer{margin-top:16px;text-align:center;font-size:12px;color:rgba(200,210,230,.3);}
  .auth-link{background:linear-gradient(135deg,#fff,#d7dbe2,#8b9099);background-size:300% 300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;text-decoration:none;font-weight:500;animation:silver-flow 5s ease-in-out infinite;}
`;

export default function Register() {
  const [method, setMethod] = useState('email');
  const [form, setForm] = useState({ username:'',email:'',phone:'',password:'',firstName:'',lastName:'' });
  const [error, setError] = useState('');
  const [slowWarn, setSlowWarn] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSlowWarn(false);
    if (method==='phone'&&!form.phone) return setError('Ingresa tu teléfono');
    if (method==='email'&&!form.email) return setError('Ingresa tu email');
    const t = setTimeout(() => setSlowWarn(true), 5000);
    const r = await register(
      form.username,
      method==='email' ? form.email : '',
      form.password, form.firstName, form.lastName,
      method==='phone' ? form.phone : '',
    );
    clearTimeout(t); setSlowWarn(false);
    if (r.success) navigate('/feed');
    else setError(r.message);
  };

  return (
    <div className="auth-page">
      <style>{AUTH_S}</style>
      <div className="auth-box">

        <div className="auth-mark"><span className="auth-mark-k">K</span></div>
        <h1 className="auth-title">KRONOS</h1>
        <p className="auth-sub">Crear cuenta</p>

        <div className="auth-card">
          <div className="auth-method">
            {[['email','📧 Email'],['phone','📱 Tel']].map(([id,lbl]) => (
              <button key={id} type="button" className={`auth-method-btn${method===id?' sel':''}`}
                onClick={() => setMethod(id)}>{lbl}</button>
            ))}
          </div>

          {slowWarn && <div className="auth-warn">⏳ El servidor está despertando…</div>}
          {error    && <div className="auth-err">{error}</div>}

          <form onSubmit={handleSubmit} style={{ display:'flex',flexDirection:'column',gap:10 }}>
            <div className="auth-row">
              <div className="auth-input-wrap">
                <input className="auth-input" placeholder="Nombre" value={form.firstName} onChange={set('firstName')} />
              </div>
              <div className="auth-input-wrap">
                <input className="auth-input" placeholder="Apellido" value={form.lastName} onChange={set('lastName')} />
              </div>
            </div>

            <div className="auth-input-wrap">
              <input className="auth-input" placeholder="Usuario" value={form.username} onChange={set('username')} required />
            </div>

            {method==='email' ? (
              <div className="auth-input-wrap">
                <input className="auth-input" type="email" placeholder="Email" value={form.email} onChange={set('email')} required autoComplete="email" />
              </div>
            ) : (
              <div className="auth-input-wrap">
                <input className="auth-input" type="tel" placeholder="Teléfono (+52…)" value={form.phone} onChange={set('phone')} required />
              </div>
            )}

            <div className="auth-input-wrap" style={{ position:'relative' }}>
              <input
                className="auth-input"
                type={showPwd?'text':'password'}
                placeholder="Contraseña (mín. 6 caracteres)"
                value={form.password} onChange={set('password')}
                required autoComplete="new-password"
                style={{ paddingRight:48 }}
              />
              <button type="button" className="auth-eye" onClick={() => setShowPwd(v=>!v)}>
                {showPwd?'🙈':'👁️'}
              </button>
            </div>

            <BotonBurbuja3D as="button" type="submit" size="md" disabled={loading}
              style={{ width:'100%',marginTop:4 }}>
              {loading?'Creando…':'Registrarse'}
            </BotonBurbuja3D>
          </form>
        </div>

        <div className="auth-footer">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="auth-link">Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}
