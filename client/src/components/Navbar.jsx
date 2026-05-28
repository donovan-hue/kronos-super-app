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
        @keyframes kronos-gold-shift {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        @keyframes kronos-glow-gold {
          0%,100% { filter: drop-shadow(0 0 8px rgba(212,175,55,0.45)) drop-shadow(0 0 20px rgba(212,175,55,0.2)); }
          50%     { filter: drop-shadow(0 0 16px rgba(212,175,55,0.65)) drop-shadow(0 0 40px rgba(212,175,55,0.25)); }
        }
        @keyframes slogan-gold {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .navbar-avatar-ring:hover { box-shadow: 0 0 0 2px rgba(212,175,55,0.8), 0 0 20px rgba(212,175,55,0.4) !important; }
        .navbar-search:hover {
          background: rgba(212,175,55,0.1) !important;
          border-color: rgba(212,175,55,0.5) !important;
          box-shadow: 0 0 20px rgba(212,175,55,0.25), inset 0 1px 0 rgba(255,255,255,0.06) !important;
        }
      `}</style>

      <nav style={{
        position: 'sticky', top: 0, zIndex: 200,
        background: 'rgba(8,8,15,0.95)',
        borderBottom: '1px solid rgba(212,175,55,0.1)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        fontFamily: "'Outfit', sans-serif",
        padding: '10px 16px',
        boxShadow: '0 2px 24px rgba(0,0,0,0.5), 0 1px 0 rgba(212,175,55,0.06) inset',
      }}>
        <div style={{
          maxWidth: 680, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>

          {/* Avatar izquierda */}
          <div
            onClick={() => navigate(userId ? `/profile/${userId}` : '/auth/login')}
            style={{ cursor: 'pointer', flexShrink: 0 }}
          >
            <div
              className="navbar-avatar-ring"
              style={{
                width: 40, height: 40, borderRadius: '50%', padding: 2,
                background: 'linear-gradient(135deg,#A08820,#D4AF37,#F0D060,#D4AF37)',
                boxShadow: '0 0 14px rgba(212,175,55,0.35)',
                transition: 'box-shadow 0.2s',
              }}
            >
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'K')}&background=1a1a2e&color=D4AF37&size=40`}
                alt=""
                style={{
                  width: '100%', height: '100%',
                  borderRadius: '50%', objectFit: 'cover', display: 'block',
                  border: '2px solid rgba(8,8,15,0.8)',
                }}
              />
            </div>
          </div>

          {/* Centro — KRONOS + slogan */}
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{
              fontSize: 'clamp(22px,5vw,30px)',
              fontWeight: 900,
              letterSpacing: '0.22em',
              fontFamily: "'Outfit', sans-serif",
              background: 'linear-gradient(90deg, #A08820, #D4AF37, #F0D060, #D4AF37, #A08820)',
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'kronos-gold-shift 5s ease-in-out infinite, kronos-glow-gold 5s ease-in-out infinite',
              textTransform: 'uppercase',
              lineHeight: 1.1,
            }}>
              KRONOS
            </div>
            <div style={{
              fontSize: 'clamp(9px,2.2vw,11px)',
              fontWeight: 300,
              letterSpacing: '0.12em',
              background: 'linear-gradient(90deg, rgba(212,175,55,0.4), #D4AF37, #F0D060, #D4AF37, rgba(212,175,55,0.4))',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'slogan-gold 7s linear infinite',
              marginTop: 2,
              whiteSpace: 'nowrap',
            }}>
              Tu tiempo. Tu espacio. Tu orden.
            </div>
          </div>

          {/* Lupa derecha */}
          <div
            onClick={() => navigate('/search')}
            className="navbar-search"
            style={{
              flexShrink: 0,
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(212,175,55,0.06)',
              border: '1px solid rgba(212,175,55,0.2)',
              backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 17,
              cursor: 'pointer',
              boxShadow: '0 2px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
              transition: 'all 0.2s ease',
            }}
          >
            🔍
          </div>

        </div>
      </nav>
    </>
  );
}
