import React, { useEffect } from 'react';

const MainBubble = ({ onGetStarted, onExplore }) => {
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'main-bubble-anim';
    if (!document.getElementById('main-bubble-anim')) {
      style.textContent = `
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-18px); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.glow} />
      <div style={styles.bubble}>
        <div style={styles.logoRing}>
          <span style={styles.logoLetter}>K</span>
        </div>

        <h1 style={styles.title}>KRONOS</h1>
        <p style={styles.subtitle}>
          Experience the future of social, shopping, and food delivery in one revolutionary platform
        </p>

        <div style={styles.buttons}>
          <button style={styles.btnPrimary} onClick={onGetStarted}>
            Get Started
          </button>
          <button style={styles.btnSecondary} onClick={onExplore}>
            Explorar Features
          </button>
        </div>

        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>o continúa con</span>
          <span style={styles.dividerLine} />
        </div>

        <div style={styles.socialRow}>
          {['🍎', '🔍', 'f'].map((icon, i) => (
            <button key={i} style={styles.socialBtn}>{icon}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' },
  glow: {
    position: 'absolute', width: '420px', height: '420px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)',
    filter: 'blur(48px)', zIndex: -1,
  },
  bubble: {
    width: '320px', padding: '56px 36px',
    borderRadius: '40px',
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 0 40px rgba(124,58,237,0.4)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px',
    textAlign: 'center',
    animation: 'float 4s ease-in-out infinite',
  },
  logoRing: {
    width: '76px', height: '76px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    boxShadow: '0 0 24px rgba(124,58,237,0.6)',
  },
  logoLetter: { fontSize: '38px', fontWeight: 900, color: '#fff' },
  title: {
    margin: 0, fontSize: '30px', fontWeight: 900,
    background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    letterSpacing: '3px',
  },
  subtitle: { margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 },
  buttons: { width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' },
  btnPrimary: {
    padding: '13px', borderRadius: '24px',
    background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
    color: '#fff', border: 'none', fontSize: '15px', fontWeight: 700,
    cursor: 'pointer', transition: 'transform 0.2s',
    boxShadow: '0 0 20px rgba(124,58,237,0.45)',
  },
  btnSecondary: {
    padding: '12px', borderRadius: '24px',
    background: 'transparent',
    color: 'rgba(255,255,255,0.6)',
    border: '1px solid rgba(255,255,255,0.2)',
    fontSize: '15px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
  },
  divider: { display: 'flex', alignItems: 'center', gap: '10px', width: '100%' },
  dividerLine: { flex: 1, height: '1px', background: 'rgba(255,255,255,0.15)' },
  dividerText: { fontSize: '11px', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' },
  socialRow: { display: 'flex', gap: '12px', justifyContent: 'center' },
  socialBtn: {
    width: '44px', height: '44px', borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.18)',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff', fontSize: '18px', cursor: 'pointer',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
  },
};

export default MainBubble;
