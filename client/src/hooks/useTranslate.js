import api from '../services/api';

// Translations hook: replace axios.post/get with api.post/get and keep the same paths

import { useState, useCallback } from 'react';

// Example replacements:
// const detectionResponse = await api.post('/api/translation/detect', { text });
// const response = await api.post('/api/translation/translate', { ... });
// const response = await api.get('/api/translation/languages');

