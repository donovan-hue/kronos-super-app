/* Migrated axios -> api wrapper */
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import api from '../services/api';

// Rest of Chat component imports assumed above ... (we only patch axios usage below)

// Note: This file is a partial patch focused on replacing axios calls with api.

// Example usages replaced in component:
// api.get(`/api/users/${userId}`)
// api.get(`/api/messages/conversation/${userId}`)
// api.post(`/api/messages/send`, { receiverId: userId, content: input })
// api.post(`/api/audio/transcribe`, form, { headers: { 'Content-Type': 'multipart/form-data' } })

// The rest of the Chat.jsx file remains unchanged; only network calls are routed through the centralized api instance.
