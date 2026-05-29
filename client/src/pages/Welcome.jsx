import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BotonBurbuja3D } from '../components/kronos';

/* Estilos locales — en línea para no depender de clases externas */
const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Sora:wght@300;400;500&display=swap');
  @keyframes silver-flow {
    0%,100%{background-position:0% 50%} 33%{background-position:100% 50%} 66%{background-position:50% 0%}
  }
  @keyframes float-logo { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes glow-pulse {
    0%,100%{box-shadow:0 10px 34px rgba(0,0,0,.7),inset 0 1px 0 rgba(255,255,255,.5)}
    50%{box-shadow:0 10px 34px rgba(0,0,0,.7),0 0 28px rgba(215,219,226,.25),inset 0 1px 0 rgba(255,255,255,.65)}
  }
  @keyframes scan { 0%{transform:translateY(-100%)} 100%{transform:translateY(200%)} }
  .wc-page { min-height:100vh; background:#000; background-image:radial-gradient(120% 50% at 50% 0%,#15161c 0%,#000 65%); display:flex;flex-direction:column;align-items:center;justify-content:center; padding:40px 20px 80px; font-family:'Sora',sans-serif; position:relative;overflow:hidden; }
  .wc-scanline { position:fixed;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.04),transparent);animation:scan 8s linear infinite;pointer-events:none;z-index:0; }
  .wc-logo-wrap { position:relative;z-index:1;animation:float-logo 4s ease-in-out infinite;margin-bottom:28px; }
  .wc-logo-sphere {
    width:110px;height:110px;border-radius:50%;isolation:isolate;position:relative;
    background:rgba(255,255,255,.045);backdrop-filter:blur(16px) saturate(140%);-webkit-backdrop-filter:blur(16px) saturate(140%);
    box-shadow:0 10px 34px rgba(0,0,0,.7),inset 0 1px 0 rgba(255,255,255,.55);
    display:flex;align-items:center;justify-content:center;overflow:hidden;
    animation:glow-pulse 3s ease-in-out infinite;
  }
  .wc-logo-sphere::before {
    content:'';position:absolute;inset:0;padding:1.6px;border-radius:50%;
    background:linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff,#5d626b,#c9ced6);
    background-size:300% 300%;
    -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
    -webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;
    animation:silver-flow 5s ease-in-out infinite;
  }
  .wc-logo-sphere::after {
    content:'';position:absolute;left:12%;right:12%;top:8px;height:38%;
    background:linear-gradient(180deg,rgba(255,255,255,.38),rgba(255,255,255,0));
    filter:blur(1px);border-radius:50%;pointer-events:none;
  }
  .wc-logo-k {
    font-family:'Cinzel',serif;font-size:52px;font-weight:700;position:relative;z-index:3;
    background:linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff,#5d626b,#c9ced6);
    background-size:300% 300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;
    background-clip:text;animation:silver-flow 5s ease-in-out infinite;
  }
  /* Reflejo de piso del logo */
  .wc-logo-reflect {
    width:110px;height:40px;margin-top:-4px;position:relative;
    background:rgba(255,255,255,.015);border-radius:0 0 55px 55px;
    transform:scaleY(-1);filter:blur(4px);opacity:.3;pointer-events:none;
  }
  .wc-title {
    font-family:'Cinzel',serif;font-size:clamp(38px,11vw,64px);font-weight:700;
    letter-spacing:8px;text-transform:uppercase;text-align:center;
    background:linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff,#5d626b,#c9ced6);
    background-size:300% 300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;
    background-clip:text;animation:silver-flow 5s ease-in-out infinite;
    filter:drop-shadow(0 0 14px rgba(200,210,220,.3));
    position:relative;z-index:1;margin-bottom:10px;
  }
  .wc-sub {
    font-family:'Cinzel',serif;font-size:10px;letter-spacing:4px;text-transform:uppercase;
    background:linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff);
    background-size:300% 300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;
    background-clip:text;animation:silver-flow 6s ease-in-out infinite;opacity:.55;
    text-align:center;margin-bottom:40px;position:relative;z-index:1;
  }
  .wc-divider {
    width:100px;height:1px;margin:0 auto 40px;
    background:linear-gradient(90deg,transparent,rgba(215,219,226,.4),transparent);
  }
  .wc-btns { display:flex;flex-direction:column;gap:14px;align-items:center;width:100%;max-width:320px;position:relative;z-index:1; }
  .wc-toggle { background:none;border:none;cursor:pointer;font-family:'Sora',sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(200,210,230,.35);margin-top:6px;transition:color .2s; }
  .wc-toggle:hover { color:rgba(200,210,230,.7); }
  /* Features grid */
  .wc-features { display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:12px;width:100%;max-width:640px;position:relative;z-index:1;margin-top:32px; }
  .wc-feat {
    position:relative;isolation:isolate;overflow:hidden;border-radius:26px;padding:18px 14px;text-align:center;
    background:rgba(255,255,255,.03);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
    box-shadow:0 6px 20px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.4);
    transition:transform .22s cubic-bezier(.22,1,.36,1),box-shadow .3s;cursor:default;
  }
  .wc-feat::before {
    content:'';position:absolute;inset:0;padding:1.4px;border-radius:inherit;
    background:linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff,#5d626b,#c9ced6);
    background-size:300% 300%;
    -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
    -webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;
    animation:silver-flow 5s ease-in-out infinite;
  }
  .wc-feat:hover{transform:translateY(-4px);box-shadow:0 10px 30px rgba(0,0,0,.7),0 0 18px rgba(215,219,226,.14),inset 0 1px 0 rgba(255,255,255,.5);}
  .wc-feat-icon{font-size:26px;margin-bottom:9px;position:relative;z-index:2;}
  .wc-feat-label{font-family:'Cinzel',serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;
    background:linear-gradient(135deg,#fff,#d7dbe2,#8b9099);background-size:300% 300%;
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
    animation:silver-flow 5s ease-in-out infinite;position:relative;z-index:2;margin-bottom:4px;}
  .wc-feat-desc{font-size:10px;color:rgba(200,210,230,.38);line-height:1.5;position:relative;z-index:2;}
`;

export default function Welcome() {
  const navigate = useNavigate();
  const [showFeatures, setShowFeatures] = useState(false);

  const features = [
    { icon: '◇', label: 'Social',       desc: 'Feed, stories, chat' },
    { icon: '◈', label: 'Tienda',        desc: 'Compras con Stripe' },
    { icon: '◎', label: 'Wallet',        desc: 'Pagos P2P gratuitos' },
    { icon: '✦', label: 'Tokens',        desc: 'Gana por actividad' },
    { icon: '◆', label: 'Eventos',       desc: 'QR y check-in' },
    { icon: '◉', label: 'Gamificación',  desc: 'XP, niveles, badges' },
    { icon: '▶', label: 'LIVE',          desc: 'Streaming en vivo' },
    { icon: '⬡', label: 'Comunidades',   desc: 'Grupos y roles' },
    { icon: '◫', label: 'Marketplace',   desc: 'P2P con escrow' },
    { icon: '◑', label: 'Avatar',        desc: 'Avatar 3D tuyo' },
    { icon: '♡', label: 'Health',        desc: 'Metas y fitness' },
    { icon: '▦', label: 'Reservas',      desc: 'Restaurantes y más' },
  ];

  return (
    <div className="wc-page">
      <style>{S}</style>
      <div className="wc-scanline" />

      {/* Logo flotante */}
      <div className="wc-logo-wrap">
        <div className="wc-logo-sphere">
          <span className="wc-logo-k">K</span>
        </div>
        {/* Espejo de piso */}
        <div className="wc-logo-reflect" />
      </div>

      {/* Título */}
      <h1 className="wc-title">KRONOS</h1>
      <div className="wc-sub">Tu tiempo · Tu espacio · Tu orden</div>
      <div className="wc-divider" />

      {/* Botones */}
      <div className="wc-btns">
        <BotonBurbuja3D size="lg" className="full" onClick={() => navigate('/auth/login')}>
          Iniciar sesión
        </BotonBurbuja3D>
        <BotonBurbuja3D size="md" variant="outline" className="full" onClick={() => navigate('/auth/register')}>
          Crear cuenta
        </BotonBurbuja3D>
        <button className="wc-toggle" onClick={() => setShowFeatures(v => !v)}>
          {showFeatures ? '↑ ocultar' : '↓ explorar la app'}
        </button>
      </div>

      {/* Features */}
      {showFeatures && (
        <div className="wc-features">
          {features.map(f => (
            <div key={f.label} className="wc-feat">
              <div className="wc-feat-icon">{f.icon}</div>
              <div className="wc-feat-label">{f.label}</div>
              <div className="wc-feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
