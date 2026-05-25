import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const { data } = await axios.get(`${API}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(data.notifications);
      setUnread(data.unreadCount);
    } catch {}
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API}/api/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnread(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch {}
  };

  const handleClick = async (notif) => {
    if (!notif.read) {
      const token = localStorage.getItem('token');
      await axios.put(`${API}/api/notifications/${notif._id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
      setNotifications(prev =>
        prev.map(n => n._id === notif._id ? { ...n, read: true } : n)
      );
      setUnread(prev => Math.max(0, prev - 1));
    }
    if (notif.link) navigate(notif.link);
    setOpen(false);
  };

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
      >
        <svg className="w-5 h-5" style={{ color: 'rgba(10,10,20,0.55)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-purple-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div style={{ position: 'absolute', right: 0, top: 40, zIndex: 50, width: 320, maxHeight: 384, overflowY: 'auto', borderRadius: 20, border: '1.5px solid rgba(79,172,254,0.2)', background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 40px rgba(79,172,254,0.18)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid rgba(79,172,254,0.1)' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#0a0a14', fontFamily: "'Outfit', sans-serif" }}>Notificaciones</span>
              {unread > 0 && (
                <button onClick={markAllRead} style={{ background: 'none', border: 'none', fontSize: 12, color: '#4facfe', cursor: 'pointer', fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}>
                  Marcar todas
                </button>
              )}
            </div>
            {notifications.length === 0 ? (
              <div style={{ padding: '48px 0', textAlign: 'center', color: 'rgba(10,10,20,0.35)', fontSize: 14 }}>Sin notificaciones</div>
            ) : (
              notifications.map(n => (
                <button
                  key={n._id}
                  onClick={() => handleClick(n)}
                  style={{ width: '100%', textAlign: 'left', padding: '12px 16px', background: !n.read ? 'rgba(79,172,254,0.06)' : 'none', border: 'none', borderBottom: '1px solid rgba(79,172,254,0.07)', cursor: 'pointer', transition: 'background 0.15s' }}
                >
                  <p style={{ fontSize: 14, color: '#0a0a14', fontWeight: 600, margin: 0, fontFamily: "'Outfit', sans-serif" }}>{n.title}</p>
                  {n.body && <p style={{ fontSize: 12, color: 'rgba(10,10,20,0.5)', marginTop: 2, marginBottom: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>{n.body}</p>}
                  <p style={{ fontSize: 10, color: 'rgba(10,10,20,0.35)', marginTop: 4, marginBottom: 0 }}>
                    {new Date(n.createdAt).toLocaleString('es', { dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
