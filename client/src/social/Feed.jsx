import React, { useState } from 'react';
import axios from 'axios';
import { FaImage, FaVideo, FaMusic, FaTimesCircle, FaGlobe, FaUsers, FaLock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { GlassCard, HoloText } from '../components/kronos';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const HOLO = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 40%, #f3a0ff 70%, #ff85a2 100%)';

function Feed({ posts, setPosts, refreshFeed }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [visibility, setVisibility] = useState('public');
  const [posting, setPosting] = useState(false);
  const { user } = useAuth();

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setPosting(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('visibility', visibility);
      if (image) formData.append('image', image);
      await axios.post(`${API_URL}/posts`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setContent('');
      setImage(null);
      setVisibility('public');
      refreshFeed();
    } catch {}
    finally { setPosting(false); }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`${API_URL}/posts/${postId}/like`);
      refreshFeed();
    } catch {}
  };

  const avatarUrl = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random`;

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px' }}>

      {/* Crear post */}
      <GlassCard style={{ marginBottom: 20 }} padding={20}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{
            borderRadius: '50%', padding: 2,
            background: HOLO, flexShrink: 0
          }}>
            <img
              src={user?.avatar || avatarUrl(user?.name || user?.username)}
              alt={user?.username}
              onError={(e) => { e.target.src = avatarUrl(user?.name || user?.username); }}
              style={{ width: 44, height: 44, borderRadius: '50%', display: 'block', border: '2px solid #fff' }}
            />
          </div>
          <input
            type="text"
            placeholder="¿Qué estás pensando?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              flex: 1, padding: '12px 16px', borderRadius: 14,
              border: '1.5px solid rgba(79,172,254,0.25)',
              background: 'rgba(255,255,255,0.95)',
              fontSize: 14, outline: 'none',
              boxShadow: '0 2px 8px rgba(79,172,254,0.08)',
              color: '#0a0a14'
            }}
          />
        </div>

        {image && (
          <div style={{ position: 'relative', marginBottom: 14 }}>
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              style={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 14 }}
            />
            <button
              onClick={() => setImage(null)}
              style={{
                position: 'absolute', top: 8, right: 8,
                background: 'rgba(255,255,255,0.9)', border: 'none',
                borderRadius: '50%', width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#ef4444', fontSize: 18
              }}
            >
              <FaTimesCircle />
            </button>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', gap: 16 }}>
            {[
              { icon: <FaImage />, color: '#4facfe', label: 'Foto', accept: 'image/*', onChange: (e) => setImage(e.target.files[0]) },
              { icon: <FaVideo />, color: '#f3a0ff', label: 'Video', accept: 'video/*', onChange: () => {} },
              { icon: <FaMusic />, color: '#00f2fe', label: 'Música', accept: 'audio/*', onChange: () => {} },
            ].map(({ icon, color, label, accept, onChange }) => (
              <label key={label} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color, fontSize: 13, fontWeight: 600 }}>
                {icon} <span>{label}</span>
                <input type="file" style={{ display: 'none' }} accept={accept} onChange={onChange} />
              </label>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              style={{
                padding: '8px 12px', borderRadius: 10, fontSize: 13,
                border: '1.5px solid rgba(79,172,254,0.25)',
                background: 'rgba(255,255,255,0.9)', cursor: 'pointer',
                color: '#0a0a14', outline: 'none'
              }}
            >
              <option value="public">🌍 Público</option>
              <option value="followers">👥 Seguidores</option>
              <option value="private">🔒 Privado</option>
            </select>

            <button
              onClick={handlePost}
              disabled={!content.trim() || posting}
              style={{
                padding: '10px 24px', borderRadius: 14, border: 'none',
                background: (!content.trim() || posting) ? 'rgba(79,172,254,0.3)' : HOLO,
                color: '#fff', fontWeight: 700, fontSize: 14,
                cursor: (!content.trim() || posting) ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 16px rgba(79,172,254,0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              {posting ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Lista de posts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {posts.map((post) => (
          <GlassCard key={post._id} padding={20}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ borderRadius: '50%', padding: 2, background: HOLO, flexShrink: 0 }}>
                  <img
                    src={post.author?.avatar || avatarUrl(post.author?.name || post.author?.username)}
                    alt={post.author?.username}
                    onError={(e) => { e.target.src = avatarUrl(post.author?.name || post.author?.username); }}
                    style={{ width: 38, height: 38, borderRadius: '50%', display: 'block', border: '2px solid #fff' }}
                  />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: '#0a0a14', margin: 0 }}>
                    {post.author?.username}
                  </p>
                  <p style={{ fontSize: 11, color: 'rgba(10,10,20,0.45)', margin: 0 }}>
                    {new Date(post.createdAt).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <span style={{ fontSize: 16 }}>
                {post.visibility === 'public' && '🌍'}
                {post.visibility === 'followers' && '👥'}
                {post.visibility === 'private' && '🔒'}
              </span>
            </div>

            <p style={{ color: '#0a0a14', fontSize: 15, lineHeight: 1.6, margin: '0 0 12px' }}>
              {post.content}
            </p>

            {post.image && (
              <img
                src={post.image}
                alt="post"
                style={{ width: '100%', borderRadius: 12, marginBottom: 12, objectFit: 'cover' }}
              />
            )}

            <div style={{
              display: 'flex', justifyContent: 'space-around',
              borderTop: '1px solid rgba(79,172,254,0.15)', paddingTop: 12, marginTop: 4
            }}>
              {[
                { emoji: '👍', count: post.likes?.length || 0, action: () => handleLike(post._id), label: 'Me gusta' },
                { emoji: '💬', count: post.comments?.length || 0, action: null, label: 'Comentar' },
                { emoji: '↗️', count: post.shares || 0, action: null, label: 'Compartir' },
              ].map(({ emoji, count, action, label }) => (
                <button
                  key={label}
                  onClick={action || undefined}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: 'none', border: 'none', cursor: action ? 'pointer' : 'default',
                    color: 'rgba(10,10,20,0.6)', fontSize: 13, fontWeight: 600,
                    padding: '6px 12px', borderRadius: 10,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => action && (e.currentTarget.style.background = 'rgba(79,172,254,0.1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <span style={{ fontSize: 16 }}>{emoji}</span>
                  <span>{count}</span>
                </button>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

export default Feed;
