import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Chat from './Chat';
import ConversationList from './ConversationList';
import GroupChat from './GroupChat';
import StoriesBar from '../components/stories/StoriesBar';
import StoryList from '../components/stories/StoryList';
import StoryBuilder from '../components/stories/StoryBuilder';

function StoriesPage() {
  const [showBuilder, setShowBuilder] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <section style={{ minHeight: '100vh', padding: '16px', background: '#050506' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h1 style={{ margin: 0, color: '#c9ced4', fontSize: 24 }}>Historias</h1>
            <p style={{ margin: '5px 0 12px', color: 'rgba(201,206,212,.6)', fontSize: 13 }}>Comparte momentos y explora historias de la comunidad.</p>
          </div>
          <button type="button" onClick={() => setShowBuilder((open) => !open)} className="btn-metal">
            {showBuilder ? 'Cerrar editor' : 'Crear historia'}
          </button>
        </div>

        <StoriesBar />
        {showBuilder && (
          <StoryBuilder onStoryCreated={() => { setRefreshKey((key) => key + 1); setShowBuilder(false); }} />
        )}
        <StoryList key={refreshKey} />
      </div>
    </section>
  );
}

function SocialModule() {
  return (
    <Routes>
      <Route path="/chat" element={<ConversationList />} />
      <Route path="/groups" element={<ConversationList initialTab="grupos" />} />
      <Route path="/chat/:userName" element={<Chat />} />
      <Route path="/group/:groupId" element={<GroupChat />} />
      <Route path="/stories" element={<StoriesPage />} />
    </Routes>
  );
}

export default SocialModule;
