import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Icon } from '../kronos';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function VideoPlayer({ video }) {
  const { user: currentUser } = useContext(AuthContext);
  const [likesCount, setLikesCount] = useState(video?.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(
    video?.likes?.some(id => (id._id || id)?.toString() === (currentUser?._id || currentUser?.id)?.toString())
  );
  const [isBookmarked, setIsBookmarked] = useState(video?.isBookmarked || false);

  if (!video) return null;

  const handleLike = async () => {
    try {
      const res = await axios.post(`${API_URL}/posts/${video._id}/like`);
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    } catch (err) {
      console.error('Error al dar like al video:', err);
    }
  };

  const handleBookmark = async () => {
    try {
      await axios.post(`${API_URL}/posts/${video._id}/bookmark`);
      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.error('Error al guardar video:', err);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/post/${video._id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Video en Kronos',
          text: video.content,
          url: shareUrl,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('¡Enlace del video copiado al portapapeles!');
    }
  };

  return (
    <div style={{
      background: '#000000',
      border: '1px solid #c0c0c0',
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 16,
      color: '#e2e8f0'
    }}>
      {/* Video Container */}
      <div style={{ position: 'relative', width: '100%', background: '#000' }}>
        <video 
          src={video.videoUrl || video.url} 
          controls 
          style={{ width: '100%', maxHeight: 480, display: 'block' }} 
        />
      </div>

      {/* Info y Botones */}
      <div style={{ padding: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, color: '#ffffff' }}>
          {video.content}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(192, 192, 192, 0.2)' }}>
          {/* Autor */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src={video.author?.avatar || '/default-avatar.jpg'} alt="" style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #c0c0c0' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>@{video.author?.username}</span>
          </div>

          {/* Interacciones */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button 
              onClick={handleLike} 
              style={{ background: '#000000', border: '1px solid #c0c0c0', borderRadius: 20, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', color: isLiked ? '#ef4444' : '#ffffff' }}
            >
              <Icon name="heart" size={14} stroke={isLiked ? '#ef4444' : '#c0c0c0'} fill={isLiked ? '#ef4444' : 'none'} />
              <span style={{ fontSize: 12 }}>{likesCount}</span>
            </button>

            <button 
              onClick={handleBookmark} 
              style={{ background: '#000000', border: '1px solid #c0c0c0', borderRadius: 20, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', color: isBookmarked ? '#f59e0b' : '#ffffff' }}
            >
              <Icon name="bookmark" size={14} stroke={isBookmarked ? '#f59e0b' : '#c0c0c0'} fill={isBookmarked ? '#f59e0b' : 'none'} />
            </button>

            <button 
              onClick={handleShare} 
              style={{ background: '#000000', border: '1px solid #c0c0c0', borderRadius: 20, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', color: '#ffffff' }}
            >
              <Icon name="share" size={14} stroke="#c0c0c0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
