import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BotonBurbuja3D } from '../kronos';

const API_BASE = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace('/api', '')
  : 'http://localhost:5000';

const AUTH_S = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Sora:wght@300;400;500&display=swap');
  @keyframes silver-flow {
    0%,100%{background-position:0% 50%} 33%{background-position:100% 50%} 66%{background-position:50% 0%}
  }
  @keyframes float-mark{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes glow-pulse{
    0%,100%{box-shadow:0 10px 34px rgba(0,0,0,.7),inset 0 1px 0 rgba(255,255,255,.5)}
    50%{box-shadow:0 10px 34px rgba(0,0,0,.7),0 0 24px rgba(215,219,226,.22),inset 0 1px 0 rgba(255,255,255,.65)}
  }
  .auth-page{min-height:100vh;background:#000;background-image:radial-gradient(120% 50% at 50% 0%,#15161c 0%,#000 65%);display:flex;align-items:center;justify-content:center;padding:32px 20px;font-family:'Sora',sans-serif;}
  .auth-box{width:100%;max-width:380px;display:flex;flex-direction:column;align-items:center;gap:0;}

  /* K mark */
  .auth-mark{width:84px;height:84px;border-radius:50%;isolation:isolate;position:relative;overflow:hidden;
    background:rgba(255,255,255,.045);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
    box-shadow:0 10px 34px rgba(0,0,0,.7),inset 0 1px 0 rgba(255,255,255,.55);
    display:flex;align-items:center;justify-content:center;
    animation:float-mark 4s ease-in-out infinite,glow-pulse 3s ease-in-out infinite;margin-bottom:20px;}
  .auth-mark::before{content:'';position:absolute;inset:0;padding:1.6px;border-radius:50%;
    background:linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff,#5d626b,#c9ced6);background-size:300% 300%;
    -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
    -webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;animation:silver-flow 5s ease-in-out infinite;}
  .auth-mark::after{content:'';position:absolute;left:12%;right:12%;top:7px;height:36%;
    background:linear-gradient(180deg,rgba(255,255,255,.38),rgba(255,255,255,0));filter:blur(1px);border-radius:50%;pointer-events:none;}
  .auth-mark-k{font-family:'Cinzel',serif;font-size:40px;font-weight:700;position:relative;z-index:3;
    background:linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff);background-size:300% 300%;
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
    animation:silver-flow 5s ease-in-out infinite;}

  .auth-title{font-family:'Cinzel',serif;font-size:28px;font-weight:700;letter-spacing:6px;text-transform:uppercase;text-align:center;
    background:linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff,#5d626b,#c9ced6);background-size:300% 300%;
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
    animation:silver-flow 5s ease-in-out infinite;filter:drop-shadow(0 0 8px rgba(200,210,220,.25));margin-bottom:4px;}
  .auth-sub{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:rgba(200,210,230,.35);margin-bottom:28px;}

  /* Card burbuja */
  .auth-card{width:100%;position:relative;isolation:isolate;overflow:hidden;border-radius:26px;padding:26px 22px;
    background:rgba(255,255,255,.03);backdrop-filter:blur(16px) saturate(140%);-webkit-backdrop-filter:blur(16px) saturate(140%);
    box-shadow:0 10px 34px rgba(0,0,0,.7),inset 0 1px 0 rgba(255,255,255,.45);
    display:flex;flex-direction:column;gap:12px;}
  .auth-card::before{content:'';position:absolute;inset:0;padding:1.5px;border-radius:inherit;
    background:linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff,#5d626b,#c9ced6);background-size:300% 300%;
    -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
    -webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;animation:silver-flow 5s ease-in-out infinite;}
  .auth-card::after{content:'';position:absolute;left:10%;right:10%;top:0;height:30%;
    background:linear-gradient(180deg,rgba(255,255,255,.12),rgba(255,255,255,0));filter:blur(1px);pointer-events:none;}

  /* Selector método */
  .auth-method{display:flex;gap:4px;padding:4px;border-radius:999px;background:rgba(0,0,0,.3);position:relative;z-index:3;}
  .auth-method-btn{flex:1;padding:8px;border-radius:999px;border:none;cursor:pointer;font-family:'Sora',sans-serif;font-size:11px;font-weight:500;letter-spacing:.5px;text-transform:uppercase;transition:all .2s;position:relative;z-index:3;}
  .auth-method-btn.sel{background:rgba(255,255,255,.06);color:rgba(233,236,241,.9);box-shadow:0 2px 10px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.3);}
  .auth-method-btn:not(.sel){background:transparent;color:rgba(200,210,230,.3);}

  /* Input burbuja */
  .auth-input-wrap{position:relative;isolation:isolate;overflow:hidden;border-radius:999px;
    background:rgba(255,255,255,.025);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
    box-shadow:0 4px 16px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.3);z-index:3;}
  .auth-input-wrap::before{content:'';position:absolute;inset:0;padding:1.4px;border-radius:inherit;
    background:linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff,#5d626b,#c9ced6);background-size:300% 300%;
    -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
    -webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;animation:silver-flow 5s ease-in-out infinite;opacity:.6;}
  .auth-input-wrap:focus-within::before{opacity:1;}
  .auth-input{width:100%;background:transparent;border:none;outline:none;padding:13px 20px;
    color:rgba(233,236,241,.9);font-family:'Sora',sans-serif;font-size:14px;font-weight:300;
    caret-color:#d7dbe2;position:relative;z-index:2;}
  .auth-input::placeholder{color:rgba(200,210,230,.28);}
  .auth-eye{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:rgba(200,210,230,.35);font-size:16px;z-index:4;line-height:1;}

  /* Error / warning */
  .auth-err{background:rgba(255,255,255,.02);border-radius:14px;padding:10px 14px;font-size:12px;color:rgba(220,100,100,.85);position:relative;z-index:3;border:1px solid rgba(220,100,100,.2);}
  .auth-warn{background:rgba(255,255,255,.02);border-radius:14px;padding:10px 14px;font-size:12px;color:rgba(200,210,230,.5);position:relative;z-index:3;text-align:center;}

  /* Divider */
  .auth-divider{display:flex;align-items:center;gap:10px;margin:4px 0;position:relative;z-index:3;}
  .auth-divider-line{flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent);}
  .auth-divider-text{font-size:10px;color:rgba(200,210,230,.25);letter-spacing:2px;text-transform:uppercase;}

  /* Google btn */
  .auth-google{width:100%;padding:12px;border-radius:999px;cursor:pointer;font-family:'Sora',sans-serif;font-size:12px;font-weight:500;letter-spacing:1px;text-transform:uppercase;
    background:rgba(255,255,255,.025);color:rgba(200,210,230,.55);
    position:relative;isolation:isolate;overflow:hidden;
    box-shadow:0 4px 16px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.25);
    border:none;transition:all .22s;z-index:3;}
  .auth-google::before{content:'';position:absolute;inset:0;padding:1.4px;border-radius:inherit;
    background:linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff,#5d626b,#c9ced6);background-size:300% 300%;
    -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
    -webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;animation:silver-flow 5s ease-in-out infinite;opacity:.5;}
  .auth-google:hover{background:rgba(255,255,255,.045);color:rgba(233,236,241,.75);}
  .auth-google:hover::before{opacity:1;}
  .auth-google span{position:relative;z-index:2;}

  .auth-footer{margin-top:18px;text-align:center;font-size:12px;color:rgba(200,210,230,.3);}
  .auth-link{background:linear-gradient(135deg,#fff,#d7dbe2,#8b9099);background-size:300% 300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;text-decoration:none;font-weight:500;animation:silver-flow 5s ease-in-out infinite;}
  .auth-forgot{color:rgba(200,210,230,.28);font-size:11px;text-decoration:none;display:block;text-align:center;margin-top:4px;position:relative;z-index:3;transition:color .2s;}
  .auth-forgot:hover{color:rgba(200,210,230,.6);}
`;

export default function Login() {
  const [method, setMethod] = useState('email');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [slowWarn, setSlowWarn] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSlowWarn(false);
    const t = setTimeout(() => setSlowWarn(true), 5000);
    const r = await login(
      method === 'email' ? identifier : '',
      password,
      method === 'phone' ? identifier : '',
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
        <p className="auth-sub">Iniciar sesión</p>

        <div className="auth-card">
          {/* Selector */}
          <div className="auth-method">
            {[['email','📧 Email'],['phone','📱 Tel']].map(([id,lbl]) => (
              <button key={id} type="button" className={`auth-method-btn${method===id?' sel':''}`}
                onClick={() => { setMethod(id); setIdentifier(''); }}>
                {lbl}
              </button>
            ))}
          </div>

          {slowWarn && <div className="auth-warn">⏳ El servidor está despertando…</div>}
          {error    && <div className="auth-err">{error}</div>}

          <form onSubmit={handleSubmit} style={{ display:'flex',flexDirection:'column',gap:10 }}>
            <div className="auth-input-wrap">
              <input
                className="auth-input"
                type={method==='email'?'email':'tel'}
                placeholder={method==='email'?'Email':'Teléfono (+52...)'}
                value={identifier} onChange={e=>setIdentifier(e.target.value)}
                required autoComplete={method==='email'?'email':'tel'}
              />
            </div>

            <div className="auth-input-wrap" style={{ position:'relative' }}>
              <input
                className="auth-input"
                type={showPwd?'text':'password'}
                placeholder="Contraseña"
                value={password} onChange={e=>setPassword(e.target.value)}
                required autoComplete="current-password"
                style={{ paddingRight:48 }}
              />
              <button type="button" className="auth-eye" onClick={()=>setShowPwd(v=>!v)}>
                {showPwd?'🙈':'👁️'}
              </button>
            </div>

            <BotonBurbuja3D as="button" type="submit" size="md" disabled={loading}
              style={{ width:'100%',marginTop:4 }}>
              {loading?'Entrando…':'Entrar'}
            </BotonBurbuja3D>
          </form>

          <Link to="/forgot-password" className="auth-forgot">¿Olvidaste tu contraseña?</Link>

          <div className="auth-divider">
            <div className="auth-divider-line"/><span className="auth-divider-text">o</span><div className="auth-divider-line"/>
          </div>

          <button className="auth-google" onClick={()=>{ window.location.href=`${API_BASE}/api/auth/google`; }}>
            <span>🔵 Continuar con Google</span>
          </button>
        </div>

        <div className="auth-footer">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="auth-link">Regístrate</Link>
        </div>
      </div>
    </div>
  );
}
