import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { GlassCard, Icon } from '../components/kronos';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function Communities() {
  const { user: currentUser } = useContext(AuthContext);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowEditModal] = useState(false);
  const [newCommunity, setNewCommunity] = useState({ name: '', description: '', category: 'General' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/communities`);
      setCommunities(res.data.communities || res.data || []);
    } catch (err) {
      console.error('Error al cargar comunidades:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinToggle = async (communityId, isMember) => {
    try {
      const endpoint = isMember 
        ? `${API_URL}/communities/${communityId}/leave` 
        : `${API_URL}/communities/${communityId}/join`;
      
      await axios.post(endpoint);

      setCommunities(prev => prev.map(c => {
        if (c._id === communityId) {
          const currentUserId = currentUser?._id || currentUser?.id;
          let newMembers = c.members || [];
          if (isMember) {
            newMembers = newMembers.filter(id => (id._id || id)?.toString() !== currentUserId?.toString());
          } else {
            newMembers = [...newMembers, currentUserId];
          }
          return { ...c, members: newMembers };
        }
        return c;
      }));
    } catch (err) {
      console.error('Error al unirse/salir de comunidad:', err);
    }
  };

  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    if (!newCommunity.name.trim()) return;

    try {
      setSubmitting(true);
      const res = await axios.post(`${API_URL}/communities`, newCommunity);
      const created = res.data.community || res.data;
      setCommunities(prev => [created, ...prev]);
      setShowEditModal(false);
      setNewCommunity({ name: '', description: '', category: 'General' });
    } catch (err) {
      console.error('Error al crear comunidad:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCommunities = communities.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase()) || 
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '16px 16px 100px 16px' }}>
      {/* Header del Módulo */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0a0a14' }}>Comunidades</h2>
          <p style={{ margin: 0, fontSize: 13, color: 'rgba(10,10,20,0.5)' }}>Encuentra grupos y espacios afines a tus gustos</p>
        </div>
        <button
          onClick={() => setShowEditModal(true)}
          style={{
            padding: '8px 16px',
            borderRadius: 20,
            border: 'none',
            background: 'linear-gradient(135deg,#7c3aed,#06b6d4)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <Icon name="plus" size={16} stroke="#fff" /> Crear
        </button>
      </div>

      {/* Buscador */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar comunidades..."
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 12,
            border: '1px solid rgba(10,10,20,0.1)',
            fontSize: 13,
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Lista de Comunidades */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'rgba(10,10,20,0.4)' }}>Cargando comunidades...</div>
      ) : filteredCommunities.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'rgba(10,10,20,0.4)' }}>
          No se encontraron comunidades.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredCommunities.map(community => {
            const currentUserId = currentUser?._id || currentUser?.id;
            const isMember = community.members?.some(id => (id._id || id)?.toString() === currentUserId?.toString());

            return (
              <GlassCard key={community._id} style={{ padding: 16, borderRadius: 16, background: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#0a0a14', marginBottom: 4 }}>
                      {community.name}
                    </div>
                    <div style={{ fontSize: 13, color: 'rgba(10,10,20,0.6)', lineHeight: 1.4, marginBottom: 10 }}>
                      {community.description || 'Sin descripción disponible.'}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(10,10,20,0.4)', fontWeight: 600 }}>
                      {community.members?.length || 0} Miembros • {community.category || 'General'}
                    </div>
                  </div>

                  <button
                    onClick={() => handleJoinToggle(community._id, isMember)}
                    style={{
                      padding: '8px 18px',
                      borderRadius: 20,
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: 12,
                      background: isMember ? 'rgba(10,10,20,0.08)' : 'linear-gradient(135deg,rgba(124,58,237,0.8),rgba(168,85,247,0.8))',
                      color: isMember ? '#0a0a14' : '#ffffff'
                    }}
                  >
                    {isMember ? 'Unido' : 'Unirse'}
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* MODAL CREAR COMUNIDAD */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <GlassCard style={{ width: '100%', maxWidth: 440, padding: 24, borderRadius: 20, background: '#ffffff', color: '#0a0a14' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Nueva Comunidad</h3>
              <button onClick={() => setShowEditModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <Icon name="close" size={20} stroke="#0a0a14" />
              </button>
            </div>

            <form onSubmit={handleCreateCommunity} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Nombre de la Comunidad</label>
                <input
                  type="text"
                  value={newCommunity.name}
                  onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(10,10,20,0.15)', fontSize: 13, boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Categoría</label>
                <input
                  type="text"
                  value={newCommunity.category}
                  onChange={(e) => setNewCommunity({ ...newCommunity, category: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(10,10,20,0.15)', fontSize: 13, boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Descripción</label>
                <textarea
                  value={newCommunity.description}
                  onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
                  rows="3"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(10,10,20,0.15)', fontSize: 13, boxSizing: 'border-box', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{ padding: '9px 18px', borderRadius: 20, border: 'none', background: 'rgba(10,10,20,0.06)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting || !newCommunity.name.trim()}
                  style={{ padding: '9px 22px', borderRadius: 20, border: 'none', background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: submitting ? 0.6 : 1 }}
                >
                  {submitting ? 'Creando...' : 'Crear Comunidad'}
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
}

