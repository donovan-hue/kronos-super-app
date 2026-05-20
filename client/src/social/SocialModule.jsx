import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Chat from './Chat';
import ConversationList from './ConversationList';
import GroupChat from './GroupChat';

function SocialModule() {
  return (
    <Routes>
      <Route path="/chat" element={<ConversationList />} />
      <Route path="/chat/:userName" element={<Chat />} />
      <Route path="/group/:groupId" element={<GroupChat />} />
    </Routes>
  );
}

export default SocialModule;
