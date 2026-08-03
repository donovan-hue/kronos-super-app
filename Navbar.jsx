import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Icon } from './kronos';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function Navbar() {
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
    }
  }, [currentUser]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_URL}/notifications`);
      const list = res.data.notifications || res.data || [];
      setNotifications(list);
      setUnreadCount(list.filter(n => !n.read).length);
    } catch (err) {
      console.error('Error al cargar notificaciones:', err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`${API_URL}/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error al marcar notificación:', err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 900,
      background: '#000000', // Negro Profundo Único
      borderBottom: '1px solid rgba(192, 192, 192, 0.4)', // Borde Plata Cromado
      padding: '12px 16px'
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        
        {/* LOGO CON LETRAS EN PLATA CROMADO */}
        <div 
          onClick={() => navigate('/')} 
          style={{ 
            cursor: 'pointer', 
            fontWeight: 900, 
            fontSize: 22, 
            letterSpacing: '1px',
            color: '#e2e8f0', // Plata Cromado en Letras
            textShadow: '0 0 8px rgba(192, 192, 192, 0.6)'
          }}
        >
          KRONOS
        </div>

        {/* BÚSQUEDA: FONDO NEGRO Y BORDE DE BURBUJA EN PLATA CROMADO */}
        <form onSubmit={handleSearchSubmit} style={{ flex: 1, maxWidth: 360, position: 'relative' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en Kronos..."
            style={{ 
              width: '100%', 
              padding: '8px 12px 8px 36px', 
              borderRadius: 20, 
              border: '1px solid #c0c0c0', // Borde Plata Cromado
              background: '#000000', // Fondo Negro
              color: '#e2e8f0', // Texto Plata
              fontSize: 13, 
              outline: 'none', 
              boxSizing: 'border-box' 
            }}
          />
          <button type="submit" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
            <Icon name="search" size={16} stroke="#c0c0c0" />
          </button>
        </form>

        {/* ACCIONES DE BOTONES BURBUJA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
          
          {/* BOTÓN CAMPANA (BURBUJA NEGRA CON BORDE PLATA CROMADO) */}
          <button
            onClick={() => { setShowNotifications(!showNotifications); if (unreadCount > 0) fetchNotifications(); }}
            style={{ 
              position: 'relative', 
              background: '#000000', 
              border: '1px solid #c0c0c0', // Borde Plata Cromado
              borderRadius: '50%', 
              width: 38, 
              height: 38, 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justify: 'center' 
            }}
          >
            <Icon name="bell" size={18} stroke="#e2e8f0" />
            {unreadCount > 0 && (
              <span style={{ 
                position: 'absolute', 
                top: -2, 
                right: -2, 
                background: '#ef4444', 
                color: '#fff', 
                fontSize: 10, 
                fontWeight: 800, 
                borderRadius: '50%', 
                width: 16, 
                height: 16, 
                display: 'flex', 
                alignItems: 'center', 
                justify: 'center', 
                border: '1px solid #c0c0c0' 
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* AVATAR PERFIL (BORDE PLATA CROMADO) */}
          {currentUser && (
            <img
              onClick={() => navigate('/profile')}
              src={currentUser.avatar || '/default-avatar.jpg'}
              alt={currentUser.username}
              style={{ 
                width: 36, 
                height: 36, 
                borderRadius: '50%', 
                objectFit: 'cover', 
                cursor: 'pointer', 
                border: '1.5px solid #c0c0c0' // Borde Plata Cromado
              }}
            />
          )}

          {/* DESPLEGABLE NOTIFICACIONES (FONDO NEGRO, BORDE PLATA, LETRAS PLATA) */}
          {showNotifications && (
            <div style={{ 
              position: 'absolute', 
              top: 48, 
              right: 0, 
              width: 320, 
              background: '#000000', // Fondo Negro Profundo
              border: '1px solid #c0c0c0', // Borde Plata Cromado
              borderRadius: 16, 
              padding: 14, 
              zIndex: 1000, 
              maxHeight: 400, 
              overflowY: 'auto' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid rgba(192,192,192,0.3)' }}>
                <span style={{ fontWeight: 800, fontSize: 14, color: '#e2e8f0' }}>Notificaciones</span>
                <button onClick={() => setShowNotifications(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                  <Icon name="close" size={14} stroke="#c0c0c0" />
                </button>
              </div>

              {notifications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 20, color: 'rgba(192,192,192,0.5)', fontSize: 13 }}>
                  Sin notificaciones
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {notifications.map(n => (
                    <div
                      key={n._id}
                      onClick={() => handleMarkAsRead(n._id)}
                      style={{ 
                        padding: 10, 
                        borderRadius: 10, 
                        background: '#000000', 
                        border: '1px solid rgba(192, 192, 192, 0.2)', // Borde Plata Cromado sutil
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: n.read ? 400 : 700, color: n.read ? '#94a3b8' : '#e2e8f0' }}>
                        {n.title || n.message}
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(192,192,192,0.4)', marginTop: 2 }}>
                        {new Date(n.createdAt).toLocaleDateString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
