import React, { useEffect } from 'react';

const features = [
  { icon: '🔗', name: 'Social',    color: '#c9ced4' },
  { icon: '🛒', name: 'Shopping',  color: '#c9ced4' },
  { icon: '🍔', name: 'Food',      color: '#c9ced4' },
  { icon: '🎬', name: 'Cinema',    color: '#f59e0b' },
  { icon: '💬', name: 'Chat',      color: '#10b981' },
  { icon: '💰', name: 'Tokens',    color: '#8b5cf6' },
];

const FeatureBubbles = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'feature-bubbles-anim';
    if (!document.getElementById('feature-bubbles-anim')) {
      style.textContent = `
        @keyframes popIn {
          from { opacity: 0; transform: scale(0) translateY(-30px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div style={styles.grid}>
      {features.map((f, i) => (
        <div
          key={f.name}
          style={{
            ...styles.bubble,
            background: `radial-gradient(circle at 30% 30%, ${f.color}, rgba(0,0,0,0.4))`,
            animation: `popIn 0.5s ease-out ${i * 0.08}s both`,
          }}
        >
          <span style={styles.icon}>{f.icon}</span>
          <span style={styles.label}>{f.name}</span>
        </div>
      ))}
    </div>
  );
};

const styles = {
  grid: {
    position: 'absolute',
    inset: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    padding: '30px',
    placeItems: 'center',
    pointerEvents: 'none',
    zIndex: -1,
  },
  bubble: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.2)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '4px',
  },
  icon:  { fontSize: '28px' },
  label: { fontSize: '11px', color: '#fff', fontWeight: 'bold' },
};

export default FeatureBubbles;
