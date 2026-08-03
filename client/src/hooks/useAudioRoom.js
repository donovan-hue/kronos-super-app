import api from '../services/api';

// All axios calls migrated to api in useAudioRoom

import { useState, useCallback, useEffect, useRef } from 'react';
// ... other imports

// When calling backend, use api.post('/api/audio/sessions/join', { roomId }) etc.

