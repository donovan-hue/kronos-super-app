import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaApple, FaFacebookF } from 'react-icons/fa';
import Icon from '../kronos/Icon';

const options = [
  { id: 'register', label: 'Crear Cuenta',    icon: <Icon name="sparkle" size={26} stroke="#fff" />, route: '/register' },
  { id: 'login',    label: 'Iniciar Sesión',  icon: <Icon name="lock" size={26} stroke="#fff" />,    route: '/login' },
  { id: 'google',   label: 'Google',    icon: <FaGoogle size={24} />,     oauth: true },
  { id: 'apple',    label: 'Apple',     icon: <FaApple size={26} />,      oauth: true },
  { id: 'facebook', label: 'Facebook',  icon: <FaFacebookF size={24} />,  oauth: true },
];

const AuthBubbles = ({ onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'auth-bubbles-anim';
    if (!document.getElementById('auth-bubbles-anim')) {
      style.textContent = `
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div style={styles.overlay}>
      <div style={styles.backdrop} onClick={onClose} />
      <div style={styles.card}>
        <h2 style={styles.title}>Elige cómo entrar</h2>
        <div style={styles.grid}>
          {options.map((opt, i) => (
            <button
              key={opt.id}
              style={{ ...styles.btn, animation: `slideUp 0.5s ease-out ${i * 0.08}s both` }}
              onClick={() => !opt.oauth && navigate(opt.route)}
            >
              <span style={styles.btnIcon}>{opt.icon}</span>
              <span style={styles.btnLabel}>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 200,
  },
  backdrop: {
    position: 'absolute', inset: 0,
    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
  },
  card: {
    position: 'relative', zIndex: 201,
    width: '90%', maxWidth: '380px',
    padding: '40px 32px',
    borderRadius: '36px',
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.12)',
    boxShadow: '0 0 60px rgba(124,58,237,0.5)',
  },
  title: {
    margin: '0 0 28px', fontSize: '22px', fontWeight: 700,
    color: '#fff', textAlign: 'center',
  },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px',
  },
  btn: {
    padding: '18px 12px',
    borderRadius: '20px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#fff', cursor: 'pointer',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  btnIcon:  { fontSize: '28px' },
  btnLabel: { fontSize: '12px', fontWeight: 600 },
};

export default AuthBubbles;
