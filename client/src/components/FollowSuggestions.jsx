import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { KronosImage } from './kronos';

const API = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');

export default function FollowSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [following, setFollowing] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    axios.get(`${API}/api/users/suggestions`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => setSuggestions(r.data.users || r.data || []))
      .catch(() => {});
  }, []);

  const handleFollow = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${API}/api/users/${userId}/follow`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFollowing(prev => new Set([...prev, userId]));
    } catch {}
  };

  if (suggestions.length === 0) return null;

  return (
    <div style={{
      background: 'rgba(255,255,255,0.8)',
      border: '1.5px solid rgba(190,200,212,0.12)',
      borderRadius: 16, padding: '14px 16px', marginBottom: 16,
      boxShadow: '0 2px 12px rgba(190,200,212,0.06)',
    }}>
      <div style={{ color: 'rgba(201,206,212,0.45)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
        A quién seguir
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {suggestions.slice(0, 5).map(user => {
          const isFollowing = following.has(user._id);
          return (
            <div key={user._id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <KronosImage
                src={user.avatar}
                alt={user.username}
                width={36} height={36}
                rounded
                style={{ cursor: 'pointer', flexShrink: 0 }}
              />
              <div
                style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
                onClick={() => navigate(`/profile/${user._id}`)}
              >
                <div style={{ color: '#c9ced4', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.firstName} {user.lastName || ''}
                </div>
                <div style={{ color: 'rgba(201,206,212,0.45)', fontSize: 11 }}>@{user.username}</div>
              </div>
              <button
                onClick={() => handleFollow(user._id)}
                disabled={isFollowing}
                style={{
                  padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                  border: isFollowing ? '1px solid rgba(190,200,212,0.20)' : 'none',
                  background: isFollowing ? 'transparent' : 'linear-gradient(135deg,#c9ced4,#e9ecf0)',
                  color: isFollowing ? 'rgba(201,206,212,0.50)' : '#fff', cursor: isFollowing ? 'default' : 'pointer', flexShrink: 0,
                }}
              >
                {isFollowing ? 'Siguiendo' : 'Seguir'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
