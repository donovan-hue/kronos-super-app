import api from '../services/api';
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import HoloText from '../components/HoloText';
import axios from 'axios';

export default function Communities() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);
  const [tab, setTab] = useState('explore');
  const navigate = useNavigate();

  const fetchCommunities = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (category) params.category = category;
      if (search) params.search = search;
      const endpoint = tab === 'mine' ? '/api/communities/mine' : '/api/communities';
      const res = await api.get(endpoint, { params });
      setCommunities(res.data.data || []);
    } catch (e) {
      // silenced;
    } finally {
      setLoading(false);
    }
  }, [category, search, tab]);

  useEffect(() => {
    fetchCommunities();
  }, [category, tab, fetchCommunities]);

  const handleSearch = e => {
    e.preventDefault();
    fetchCommunities();
  };

  const handleJoin = async id => {
    try {
      await api.post(`/api/communities/${id}/join`);
      fetchCommunities();
    } catch (e) {
      // silenced;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 680, margin: '0 auto' }}>
        <HoloText size={26}>Comunidades</HoloText>
        <button
          onClick={() => setCreating(true)}
          style={{ padding: '8px 18px', borderRadius: 20, background: 'linear-gradient(180deg,#2c2f32 0%,#1a1c1e 100%)', color: '#15171a', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
        >
          + Nueva
        </button>
      </div>

      {/* content omitted for brevity */}
    </div>
  );
}
