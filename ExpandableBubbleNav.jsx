import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';
import GlassCard from './GlassCard';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function ExpandableBubbleNav() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'post' | 'story' | 'live'
  
  // Estado para Post Rápido / Historia
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setContent('');
    setImage(null);
    setPreview('');
  };

  const handleQuickPostSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image) return;

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('content', content);
      if (image) formData.append('image', image);

      const endpoint = activeModal === 'story' ? `${API_URL}/stories` : `${API_URL}/posts`;

      await axios.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      closeModal();
      window.location.reload(); // Refrescar para ver el nuevo contenido
    } catch (err) {
      console.error('Error en creación rápida:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* MENÚ RADIAL DE ABANICO (+) */}
      <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 999, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Sub-botones del abanico */}
        {isOpen && (
          <div style={{ display: 'flex', gap: 16, marginBottom: 16, transition: 'all 0.3s ease' }}>
            <button
              onClick={() => { setIsOpen(false); navigate('/live'); }}
              style={subButtonStyle('#ef4444')}
              title="Transmitir en Vivo"
            >
              <Icon name="video" size={18} stroke="#fff" />
              <span style={labelStyle}>Live</span>
            </button>

            <button
              onClick={() => { setIsOpen(false); setActiveModal('story'); }}
              style={subButtonStyle('#f59e0b')}
              title="Nueva Historia"
            >
              <Icon name="star" size={18} stroke="#fff" />
              <span style={labelStyle}>Historia</span>
            </button>

            <button
              onClick={() => { setIsOpen(false); setActiveModal('post'); }}
              style={subButtonStyle('#7c3aed')}
              title="Nuevo Post"
            >
              <Icon name="note" size={18} stroke="#fff" />
              <span style={labelStyle}>Post</span>
            </button>
          </div>
        )}

        {/* Botón Principal (+) */}
        <button
          onClick={toggleMenu}
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            border: 'none',
            boxShadow: '0 0 20px rgba(124, 58, 237, 0.5)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}
        >
          <Icon name="plus" size={24} stroke="#ffffff" />
        </button>
      </div>

      {/* MODAL FLOTANTE DE CREACIÓN RÁPIDA (POST O HISTORIA) */}
      {(activeModal === 'post' || activeModal === 'story') && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <GlassCard style={{ width: '100%', maxWidth: 460, padding: 24, borderRadius: 20, background: '#ffffff', color: '#0a0a14' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>
                {activeModal === 'story' ? 'Crear Nueva Historia' : 'Publicación Rápida'}
              </h3>
              <button onClick={closeModal} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <Icon name="close" size={20} stroke="#0a0a14" />
              </button>
            </div>

            <form onSubmit={handleQuickPostSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={activeModal === 'story' ? 'Agrega un texto a tu historia...' : '¿Qué quieres compartir, chiludo?'}
                rows="3"
                style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid rgba(10,10,20,0.15)', fontSize: 14, resize: 'none', boxSizing: 'border-box' }}
              />

              {preview && (
                <div style={{ position: 'relative' }}>
                  <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 12 }} />
                  <button type="button" onClick={() => { setImage(null); setPreview(''); }} style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="close" size={12} stroke="#fff" />
                  </button>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(124,58,237,0.9)', fontSize: 13, fontWeight: 600 }}>
                  <Icon name="note" size={18} stroke="rgba(124,58,237,0.9)" /> Adjuntar Archivo
                  <input type="file" accept="image/*,video/*" onChange={handleFileChange} style={{ display: 'none' }} />
                </label>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="button" onClick={closeModal} style={{ padding: '8px 16px', borderRadius: 18, border: 'none', background: 'rgba(10,10,20,0.06)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    Cancelar
                  </button>
                  <button type="submit" disabled={submitting || (!content.trim() && !image)} style={{ padding: '8px 20px', borderRadius: 18, border: 'none', background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: submitting || (!content.trim() && !image) ? 0.5 : 1 }}>
                    {submitting ? 'Enviando...' : 'Publicar'}
                  </button>
                </div>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </>
  );
}

const subButtonStyle = (bgColor) => ({
  width: 44,
  height: 44,
  borderRadius: '50%',
  background: bgColor,
  border: 'none',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justify: 'center',
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  position: 'relative'
});

const labelStyle = {
  position: 'absolute',
  top: -22,
  fontSize: 10,
  fontWeight: 700,
  color: '#0a0a14',
  background: 'rgba(255,255,255,0.9)',
  padding: '2px 6px',
  borderRadius: 8,
  whiteSpace: 'nowrap'
};

