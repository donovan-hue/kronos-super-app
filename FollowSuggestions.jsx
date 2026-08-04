import React, { useState } from 'react';

export default function FollowSuggestions({ suggestions = [], onFollowToggle }) {
  const [followingStates, setFollowingStates] = useState({});

  const handleFollow = async (userId) => {
    const isCurrentlyFollowing = followingStates[userId] || false;
    
    // Actualización optimista del estado local
    setFollowingStates(prev => ({
      ...prev,
      [userId]: !isCurrentlyFollowing
    }));

    if (onFollowToggle) {
      await onFollowToggle(userId, !isCurrentlyFollowing);
    }
  };

  return (
    <div className="glass-card p-4 space-y-4">
      <h3 className="text-sm font-bold tracking-wider text-gray-300 uppercase">Sugerencias para ti</h3>
      {suggestions.map((user) => {
        const isFollowing = followingStates[user.id] || false;
        return (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={user.avatar || '/icons/icon-128.png'} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-cyan-500/30" />
              <div>
                <p className="text-sm font-semibold text-white">{user.name}</p>
                <p className="text-xs text-gray-400">@{user.username}</p>
              </div>
            </div>
            <button
              onClick={() => handleFollow(user.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                isFollowing 
                  ? 'bg-transparent border border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-400' 
                  : 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-lg shadow-cyan-500/20'
              }`}
            >
              {isFollowing ? 'Siguiendo' : 'Seguir'}
            </button>
          </div>
        );
      })}
    </div>
  );
}
