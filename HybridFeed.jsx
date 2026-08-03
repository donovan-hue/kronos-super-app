import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { GlassCard, Icon } from './kronos';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function HybridFeed() {
  const { user: currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/posts`);
      setPosts(res.data.posts || res.data || []);
    } catch (err) {
      console.error('Error al cargar feed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Manejo de archivo de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Crear una nueva publicación
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim() && !selectedImage) return;

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('content', newPostContent);
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const res = await axios.post(`${API_URL}/posts`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const createdPost = res.data.post || res.data;
      setPosts(prev => [createdPost, ...prev]);
      setNewPostContent('');
      setSelectedImage(null);
      setImagePreview('');
    } catch (err) {
      console.error('Error al publicar post:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Acción: Dar o quitar Like (Persistente)
  const handleLike = async (postId) => {
    try {
      const res = await axios.post(`${API_URL}/posts/${postId}/like`);
      const updatedPost = res.data.post || res.data;

      setPosts(prev => prev.map(p => {
        if (p._id === postId) {
          const currentUserId = currentUser?._id || currentUser?.id;
          const hasLiked = p.likes?.some(id => (id._id || id)?.toString() === currentUserId?.toString());
          
          let newLikes = p.likes || [];
          if (hasLiked) {
            newLikes = newLikes.filter(id => (id._id || id)?.toString() !== currentUserId?.toString());
          } else {
            newLikes = [...newLikes, currentUserId];
          }
          return { ...p, likes: updatedPost.likes || newLikes };
        }
        return p;
      }));
    } catch (err) {
      console.error('Error al reaccionar:', err);
    }
  };

  // Acción: Guardar / Bookmark (Persistente)
  const handleBookmark = async (postId) => {
    try {
      const res = await axios.post(`${API_URL}/posts/${postId}/bookmark`);
      const isBookmarked = res.data.isBookmarked;

      setPosts(prev => prev.map(p => {
        if (p._id === postId) {
          return { ...p, isBookmarked };
        }
        return p;
      }));
    } catch (err) {
      console.error('Error al guardar post:', err);
    }
  };

  // Acción: Compartir (Copiar enlace o Web Share API)
  const handleShare = async (post) => {
    const shareUrl = `${window.location.origin}/post/${post._id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Publicación en Kronos',
          text: post.content,
          url: shareUrl,
        });
      } catch (err) {
        // Compartir cancelado
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('¡Enlace de la publicación copiado al portapapeles!');
      } catch (err) {
        console.error('Error al copiar enlace:', err);
      }
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(10,10,20,0.5)' }}>
        Cargando publicaciones...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '16px 16px 100px 16px' }}>
      {/* CREADOR DE PUBLICACIONES */}
      {currentUser && (
        <GlassCard style={{ padding: 16, marginBottom: 20, borderRadius: 16, background: '#ffffff' }}>
          <form onSubmit={handleCreatePost}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <img 
                src={currentUser.avatar || '/default-avatar.jpg'} 
                alt={currentUser.username} 
                style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} 
              />
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="¿Qué estás pensando o creando hoy, chiludo?"
                rows="3"
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  color: '#0a0a14'
                }}
              />
            </div>

            {imagePreview && (
              <div style={{ position: 'relative', marginBottom: 12 }}>
                <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: 240, objectFit: 'cover', borderRadius: 12 }} />
                <button
                  type="button"
                  onClick={() => { setSelectedImage(null); setImagePreview(''); }}
                  style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Icon name="close" size={14} stroke="#fff" />
                </button>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(10,10,20,0.08)', paddingTop: 10 }}>
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(124,58,237,0.9)', fontSize: 13, fontWeight: 600 }}>
                <Icon name="note" size={18} stroke="rgba(124,58,237,0.9)" /> Adjuntar Imagen
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              </label>

              <button
                type="submit"
                disabled={isSubmitting || (!newPostContent.trim() && !selectedImage)}
                style={{
                  padding: '8px 20px',
                  borderRadius: 20,
                  border: 'none',
                  background: 'linear-gradient(135deg,rgba(124,58,237,0.8),rgba(168,85,247,0.8))',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  opacity: isSubmitting || (!newPostContent.trim() && !selectedImage) ? 0.5 : 1
                }}
              >
                {isSubmitting ? 'Publicando...' : 'Publicar'}
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* FEED DE PUBLICACIONES */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {posts.map((post) => {
          const currentUserId = currentUser?._id || currentUser?.id;
          const isLiked = post.likes?.some(id => (id._id || id)?.toString() === currentUserId?.toString());

          return (
            <GlassCard key={post._id} style={{ padding: 16, borderRadius: 16, background: '#ffffff' }}>
              {/* Header del Post */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <img 
                  src={post.author?.avatar || '/default-avatar.jpg'} 
                  alt={post.author?.username} 
                  style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }} 
                />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0a0a14' }}>
                    {post.author?.firstName || post.author?.username || 'Usuario'}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(10,10,20,0.4)' }}>
                    @{post.author?.username} • {new Date(post.createdAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
              </div>

              {/* Contenido */}
              <div style={{ fontSize: 14, lineHeight: 1.5, color: '#0a0a14', marginBottom: 10, whiteSpace: 'pre-line' }}>
                {post.content}
              </div>

              {/* Imagen adjunta */}
              {post.image && (
                <img 
                  src={post.image} 
                  alt="" 
                  style={{ width: '100%', borderRadius: 12, marginBottom: 12, maxHeight: 380, objectFit: 'cover' }} 
                />
              )}

              {/* Botones de Acción */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(10,10,20,0.06)', paddingTop: 10, fontSize: 13, color: 'rgba(10,10,20,0.6)' }}>
                {/* Like */}
                <button 
                  onClick={() => handleLike(post._id)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: isLiked ? '#ef4444' : 'rgba(10,10,20,0.6)', fontWeight: 600 }}
                >
                  <Icon name="heart" size={16} stroke={isLiked ? '#ef4444' : 'rgba(10,10,20,0.6)'} fill={isLiked ? '#ef4444' : 'none'} />
                  <span>{post.likes?.length || 0}</span>
                </button>

                {/* Comentarios */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="message" size={16} stroke="rgba(10,10,20,0.6)" />
                  <span>{post.comments?.length || 0}</span>
                </div>

                {/* Guardar / Bookmark */}
                <button 
                  onClick={() => handleBookmark(post._id)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: post.isBookmarked ? '#f59e0b' : 'rgba(10,10,20,0.6)' }}
                >
                  <Icon name="bookmark" size={16} stroke={post.isBookmarked ? '#f59e0b' : 'rgba(10,10,20,0.6)'} fill={post.isBookmarked ? '#f59e0b' : 'none'} />
                </button>

                {/* Compartir */}
                <button 
                  onClick={() => handleShare(post)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(10,10,20,0.6)' }}
                >
                  <Icon name="share" size={16} stroke="rgba(10,10,20,0.6)" />
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

