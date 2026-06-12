import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { KronosMark, KronosWordmark } from './kronos/KronosLogo';

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const userId = user?._id || user?.id;

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 200,
      background: 'linear-gradient(180deg, rgba(10,11,13,.92), rgba(8,9,11,.6) 70%, transparent)',
      borderBottom: '1px solid rgba(190,200,212,.10)',
      backdropFilter: 'blur(14px)',
      fontFamily: "'Manrope', system-ui, sans-serif",
      padding: '0 16px', height: 64,
    }}>
      <div style={{
        maxWidth: 680, margin: '0 auto', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>

        {/* Marca izquierda → feed */}
        <div onClick={() => navigate('/feed')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <KronosMark size={30} />
          <KronosWordmark fontSize={18} />
        </div>

        {/* Acciones derecha */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <button className="iconbtn" onClick={() => navigate('/search')} aria-label="Buscar">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></svg>
          </button>
          <div onClick={() => navigate(userId ? `/profile/${userId}` : '/auth/login')}
            className="avatar av-40" style={{ cursor: 'pointer' }}>
            <span>
              {user?.avatar ? (
                <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.2" /><path d="M5 19a7 7 0 0 1 14 0" /></svg>
              )}
            </span>
          </div>
        </div>

      </div>
    </nav>
  );
}
