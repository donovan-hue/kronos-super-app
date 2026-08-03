import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { GlassCard, Icon } from './kronos';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function UniversalSearch() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);
  
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'users' | 'posts' | 'communities'
  const [results, setResults] = useState({ users: [], posts: [], communities: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (searchTerm) => {
    if (!searchTerm.trim()) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/search?q=${encodeURIComponent(searchTerm)}`);
      setResults({
        users: res.data.users || [],
        posts: res.data.posts || [],
        communities: res.data.communities || []
      });
    } catch (err) {
      console.error('Error al realizar búsqueda:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      performSearch(query);
    }
  };

  const handleFollowToggle = async (userId, isFollowing) => {
    try {
      const endpoint = isFollowing ? `${API_URL}/auth/unfollow/${userId}` : `${API_URL}/auth/follow/${userId}`;
      await axios.post(endpoint);

      setResults(prev => ({
        ...prev,
        users: prev.users.map(u => u._id === userId ? { ...u, isFollowing: !isFollowing } : u)
      }));
    } catch (err) {
      console.error('Error al seguir usuario:', err);
    }
  };

  const handleCommunityJoin = async (communityId, isMember) => {
    try {
      const endpoint = isMember ? `${API_URL}/communities/${communityId}/leave` : `${API_URL}/communities/${communityId}/join`;
      await axios.post(endpoint);

      setResults(prev => ({
        ...prev,
        communities: prev.communities.map(c => c._id === communityId ? { ...c, isMember: !isMember } : c)
      }));
    } catch (err) {
      console.error('Error en comunidad:', err);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '16px 16px 100px 16px', color: '#e2e8f0', background: '#000000', minHeight: '100vh' }}>
      
      {/* Formulario de Búsqueda */}
      <form onSubmit={handleSearchSubmit} style={{ marginBottom: 16 }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar personas, posts, comunidades..."
            style={{
              width: '100%',
              padding: '12px 16px 12px 42px',
              borderRadius: 24,
              border: '1px solid #c0c0c0',
              background: '#000000',
              color: '#ffffff',
              fontSize: 14,
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          <button type="submit" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
            <Icon name="search" size={18} stroke="#c0c0c0" />
          </button>
        </div>
      </form>

      {/* Pestañas de Filtro */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
        {[
          { id: 'all', label: 'Todo' },
          { id: 'users', label: 'Personas' },
          { id: 'posts', label: 'Posts' },
          { id: 'communities', label: 'Comunidades' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              border: '1px solid #c0c0c0',
              background: activeTab === t.id ? '#c0c0c0' : '#000000',
              color: activeTab === t.id ? '#000000' : '#ffffff',
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'rgba(192, 192, 192, 0.5)' }}>
          Buscando en Kronos...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* SECCIÓN USUARIOS */}
          {(activeTab === 'all' || activeTab === 'users') && results.users.length > 0 && (
            <div>
              <h3 style={{ fontSize: 16, color: '#ffffff', marginBottom: 12 }}>Personas</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {results.users.map(user => (
                  <GlassCard key={user._id} style={{ padding: 12, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div onClick={() => navigate(`/profile/${user._id}`)} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                      <img src={user.avatar || '/default-avatar.jpg'} alt="" style={{ width: 42, height: 42, borderRadius: '50%', border: '1px solid #c0c0c0', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>{user.firstName} {user.lastName}</div>
                        <div style={{ fontSize: 12, color: 'rgba(192,192,192,0.6)' }}>@{user.username}</div>
                      </div>
                    </div>
                    {currentUser?._id !== user._id && (
                      <button
                        onClick={() => handleFollowToggle(user._id, user.isFollowing)}
                        style={{ padding: '6px 16px', borderRadius: 18, border: '1px solid #c0c0c0', background: '#000000', color: '#ffffff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                      >
                        {user.isFollowing ? 'Siguiendo' : 'Seguir'}
                      </button>
                    )}
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* SECCIÓN COMUNIDADES */}
          {(activeTab === 'all' || activeTab === 'communities') && results.communities.length > 0 && (
            <div>
              <h3 style={{ fontSize: 16, color: '#ffffff', marginBottom: 12 }}>Comunidades</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {results.communities.map(community => (
                  <GlassCard key={community._id} style={{ padding: 12, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>{community.name}</div>
                      <div style={{ fontSize: 12, color: 'rgba(192,192,192,0.6)' }}>{community.members?.length || 0} Miembros</div>
                    </div>
                    <button
                      onClick={() => handleCommunityJoin(community._id, community.isMember)}
                      style={{ padding: '6px 16px', borderRadius: 18, border: '1px solid #c0c0c0', background: '#000000', color: '#ffffff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                    >
                      {community.isMember ? 'Unido' : 'Unirse'}
                    </button>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* SECCIÓN POSTS */}
          {(activeTab === 'all' || activeTab === 'posts') && results.posts.length > 0 && (
            <div>
              <h3 style={{ fontSize: 16, color: '#ffffff', marginBottom: 12 }}>Publicaciones</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {results.posts.map(post => (
                  <GlassCard key={post._id} style={{ padding: 14, borderRadius: 14 }}>
                    <div style={{ fontSize: 13, color: '#ffffff', marginBottom: 8 }}>{post.content}</div>
                    <div style={{ fontSize: 11, color: 'rgba(192,192,192,0.5)' }}>Por @{post.author?.username || 'Usuario'}</div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {results.users.length === 0 && results.posts.length === 0 && results.communities.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: 'rgba(192, 192, 192, 0.4)' }}>
              No se encontraron resultados para "{query}"
            </div>
          )}

        </div>
      )}
    </div>
  );
}

