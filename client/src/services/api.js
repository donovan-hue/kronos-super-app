// Frontend API service for token operations
import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Set global axios defaults so files that import axios directly inherit baseURL and headers
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Create a dedicated instance for app-level customizations
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests — clave 'token' (la misma que usa AuthContext)
const attachAuthHeader = (config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Apply to both the api instance and the global axios so existing imports work without changes
api.interceptors.request.use(attachAuthHeader, (error) => Promise.reject(error));
axios.interceptors.request.use(attachAuthHeader, (error) => Promise.reject(error));

// Handle errors consistently
const handleResponseError = (error) => {
  // If we have an axios response, normalize the error object
  const status = error?.response?.status;
  if (status === 401) {
    try { localStorage.removeItem('token'); } catch (e) {}
    if (typeof window !== 'undefined') window.location.href = '/login';
  }
  return Promise.reject(error.response?.data || error.message || error);
};

api.interceptors.response.use((response) => response, handleResponseError);
axios.interceptors.response.use((response) => response, handleResponseError);

export default api;
