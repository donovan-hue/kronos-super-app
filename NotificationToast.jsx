import React from 'react';
import { GlassCard, Icon } from './kronos';

export default function NotificationToast({ notification, onClose }) {
  if (!notification) return null;

  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 1100, maxWidth: 320, width: '100%', animation: 'slideIn 0.3s ease-out' }}>
      <GlassCard style={{ padding: 14, borderRadius: 16, background: '#ffffff', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ background: 'rgba(124,58,237,0.1)', padding: 8, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="bell" size={20} stroke="#7c3aed" />
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0a0a14' }}>
            {notification.title || 'Nueva Notificación'}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(10,10,20,0.6)', marginTop: 2 }}>
            {notification.message || notification.content}
          </div>
        </div>

        <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}>
          <Icon name="close" size={16} stroke="rgba(10,10,20,0.4)" />
        </button>
      </GlassCard>
    </div>
  );
}

