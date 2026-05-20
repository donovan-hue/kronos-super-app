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
        <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="absolute right-0 top-10 z-50 w-80 max-h-96 overflow-y-auto rounded-2xl border border-white/10 bg-[#0f0f1a]/95 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <h3 className="text-sm font-semibold text-white">Notificaciones</h3>
              {unread > 0 && (
                <button onClick={markAllRead} className="text-xs text-purple-400 hover:text-purple-300">
                  Marcar todas
                </button>
              )}
            </div>
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-white/30 text-sm">Sin notificaciones</div>
            ) : (
              notifications.map(n => (
                <button
                  key={n._id}
                  onClick={() => handleClick(n)}
                  className={`w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 ${!n.read ? 'bg-purple-900/20' : ''}`}
                >
                  <p className="text-sm text-white/90 font-medium">{n.title}</p>
                  {n.body && <p className="text-xs text-white/50 mt-0.5 line-clamp-1">{n.body}</p>}
                  <p className="text-[10px] text-white/30 mt-1">
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
