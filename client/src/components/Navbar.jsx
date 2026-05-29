import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const userId = user?._id || user?.id;

  return (
    <>
      <style>{`
        @keyframes silver-flow {
          0%,100% { background-position: 0%   50%; }
          33%     { background-position: 100% 50%; }
          66%     { background-position: 50%  0%;  }
        }
        .kronos-navbar {
          position: sticky; top: 0; z-index: 200;
          background: rgba(0,0,0,.85);
          backdrop-filter: blur(20px) saturate(140%);
          -webkit-backdrop-filter: blur(20px) saturate(140%);
          border-bottom: 1px solid rgba(255,255,255,.06);
          padding: 10px 16px;
          box-shadow: 0 2px 24px rgba(0,0,0,.8), inset 0 -1px 0 rgba(255,255,255,.04);
        }
        .kronos-navbar-inner {
          max-width: 680px; margin: 0 auto;
          display: flex; align-items: center;
          justify-content: space-between; gap: 12px;
        }
        .k-logo-mark {
          width: 40px; height: 40px; border-radius: 50%;
          position: relative; isolation: isolate;
          background: rgba(255,255,255,.045);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 8px 24px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.5);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; overflow: hidden; flex-shrink: 0;
          transition: transform .2s cubic-bezier(.22,1,.36,1), box-shadow .3s;
        }
        .k-logo-mark::before {
          content: ''; position: absolute; inset: 0;
          padding: 1.6px; border-radius: inherit;
          background: linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff,#5d626b,#c9ced6);
          background-size: 300% 300%;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          pointer-events: none; z-index: 2;
          animation: silver-flow 5s ease-in-out infinite;
        }
        .k-logo-mark::after {
          content: ''; position: absolute;
          left: 12%; right: 12%; top: 5px; height: 38%;
          background: linear-gradient(180deg,rgba(255,255,255,.35),rgba(255,255,255,0));
          filter: blur(1px); pointer-events: none; z-index: 1; border-radius: inherit;
        }
        .k-logo-mark:hover { transform: scale(1.08); box-shadow: 0 0 18px rgba(215,219,226,.25), 0 8px 24px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.5); }
        .k-logo-mark span { font-family: 'Cinzel', serif; font-size: 18px; font-weight: 700; position: relative; z-index: 3; background: linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff); background-size: 300% 300%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: silver-flow 5s ease-in-out infinite; }

        .k-wordmark { text-align: center; flex: 1; }
        .k-wordmark-title {
          font-family: 'Cinzel', serif; font-size: clamp(18px,5vw,26px);
          font-weight: 700; letter-spacing: 6px; text-transform: uppercase;
          background: linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff,#5d626b,#c9ced6);
          background-size: 300% 300%;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          animation: silver-flow 5s ease-in-out infinite;
          filter: drop-shadow(0 0 10px rgba(200,210,220,.35));
          line-height: 1;
        }
        .k-wordmark-sub {
          font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 3px;
          background: linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff);
          background-size: 300% 300%;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          animation: silver-flow 6s ease-in-out infinite; opacity: .6; margin-top: 2px;
          text-transform: uppercase;
        }
        .k-nav-search {
          width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
          position: relative; isolation: isolate; cursor: pointer; overflow: hidden;
          background: rgba(255,255,255,.045);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 4px 16px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.45);
          display: flex; align-items: center; justify-content: center; font-size: 16px;
          border: none; color: rgba(240,240,248,.7);
          transition: transform .2s cubic-bezier(.22,1,.36,1), box-shadow .3s;
        }
        .k-nav-search::before {
          content: ''; position: absolute; inset: 0; padding: 1.6px; border-radius: inherit;
          background: linear-gradient(135deg,#fff,#d7dbe2,#8b9099,#fff,#5d626b,#c9ced6);
          background-size: 300% 300%;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          pointer-events: none; z-index: 2;
          animation: silver-flow 5s ease-in-out infinite;
        }
        .k-nav-search::after {
          content: ''; position: absolute; left: 12%; right: 12%; top: 5px; height: 38%;
          background: linear-gradient(180deg,rgba(255,255,255,.35),rgba(255,255,255,0));
          filter: blur(1px); pointer-events: none; z-index: 1; border-radius: inherit;
        }
        .k-nav-search:hover { transform: scale(1.08); box-shadow: 0 0 16px rgba(215,219,226,.2), 0 4px 16px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.45); }
        .k-nav-search span { position: relative; z-index: 3; }

        /* Reflejo de piso debajo del navbar */
        .kronos-navbar-reflect {
          pointer-events: none;
          position: relative;
          height: 20px;
          background: linear-gradient(180deg, rgba(255,255,255,.03) 0%, transparent 100%);
          margin-top: -1px;
        }
      `}</style>

      <nav className="kronos-navbar">
        <div className="kronos-navbar-inner">
          {/* Avatar / Logo izquierda */}
          <div
            className="k-logo-mark"
            onClick={() => navigate(userId ? `/profile/${userId}` : '/auth/login')}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt=""
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', position: 'relative', zIndex: 3 }}
              />
            ) : (
              <span>K</span>
            )}
          </div>

          {/* Wordmark centro */}
          <div className="k-wordmark">
            <div className="k-wordmark-title">KRONOS</div>
            <div className="k-wordmark-sub">Tu tiempo · Tu espacio</div>
          </div>

          {/* Búsqueda derecha */}
          <button
            className="k-nav-search"
            onClick={() => navigate('/search')}
            aria-label="Buscar"
          >
            <span>🔍</span>
          </button>
        </div>
      </nav>
      <div className="kronos-navbar-reflect" />
    </>
  );
}
