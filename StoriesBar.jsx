import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Icon } from '../kronos';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function StoriesBar() {
  const { user: currentUser } = useContext(AuthContext);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStoryGroup, setActiveStoryGroup] = useState(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/stories`);
      setStories(res.data.stories || res.data || []);
    } catch (err) {
      console.error('Error al cargar historias:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '12px 16px', background: '#ffffff', borderRadius: 16, marginBottom: 16, border: '1px solid rgba(10,10,20,0.06)' }}>
      <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
        
        {/* Mi Historia (Agregar) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', minWidth: 64 }}>
          <div style={{ position: 'relative', width: 58, height: 58 }}>
            <img
              src={currentUser?.avatar || '/default-avatar.jpg'}
              alt="Tu historia"
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '2px solid #7c3aed' }}
            />
            <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#7c3aed', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>
              <Icon name="plus" size={12} stroke="#fff" />
            </div>
          </div>
          <span style={{ fontSize: 11, color: '#0a0a14', fontWeight: 600 }}>Tu historia</span>
        </div>

        {/* Historias de Usuarios */}
        {loading ? (
          <div style={{ fontSize: 12, color: 'rgba(10,10,20,0.4)', alignSelf: 'center' }}>Cargando...</div>
        ) : (
          stories.map((group) => (
            <div
              key={group.user?._id || group._id}
              onClick={() => setActiveStoryGroup(group)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', minWidth: 64 }}
            >
              <div style={{ width: 58, height: 58, borderRadius: '50%', padding: 2, background: 'linear-gradient(135deg, #7c3aed, #06b6d4, #f43f5e)' }}>
                <img
                  src={group.user?.avatar || '/default-avatar.jpg'}
                  alt={group.user?.username}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff' }}
                />
              </div>
              <span style={{ fontSize: 11, color: '#0a0a14', fontWeight: 500, maxWidth: 64, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {group.user?.username || 'Usuario'}
              </span>
            </div>
          ))
        )}
      </div>

      {/* REPRODUCTOR DE HISTORIAS MODAL */}
      {activeStoryGroup && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000', zIndex: 1200, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src={activeStoryGroup.user?.avatar || '/default-avatar.jpg'} alt="" style={{ width: 36, height: 38, borderRadius: '50%' }} />
              <span style={{ fontWeight: 700, fontSize: 14 }}>{activeStoryGroup.user?.username}</span>
            </div>
            <button onClick={() => setActiveStoryGroup(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
              <Icon name="close" size={24} stroke="#fff" />
            </button>
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            {activeStoryGroup.stories?.[0]?.image ? (
              <img src={activeStoryGroup.stories[0].image} alt="" style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 16, objectFit: 'contain' }} />
            ) : (
              <div style={{ color: '#fff', fontSize: 18, textAlign: 'center', padding: 20 }}>
                {activeStoryGroup.stories?.[0]?.content}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
