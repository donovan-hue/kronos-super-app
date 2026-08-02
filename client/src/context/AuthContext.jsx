import React, { createContext, useState, useCallback } from 'react';
import axios from 'axios';
import api from '../services/api';

export const AuthContext = createContext();
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Traduce un error de axios a un mensaje claro para el usuario.
const messageFromError = (err, fallback) => {
  if (err?.code === 'ECONNABORTED') {
    return 'El servidor tardó demasiado en responder. Intenta nuevamente.';
  }

  if (!err?.response) {
    return 'No se pudo conectar con el servidor.';
  }

  return err.response?.data?.message || fallback;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ensure the shared api instance has a sensible timeout
  try { api.defaults.timeout = 15000; } catch (e) {}

  // Configurar axios con token (afecta tanto al global axios como al wrapper api)
  const setupAxios = useCallback((authToken) => {
    const authorizationHeader = authToken ? `Bearer ${authToken}` : null;

    if (authorizationHeader) {
      axios.defaults.headers.common['Authorization'] = authorizationHeader;
      api.defaults.headers.common['Authorization'] = authorizationHeader;
    } else {
      delete axios.defaults.headers.common['Authorization'];
      delete api.defaults.headers.common['Authorization'];
    }
  }, []);

  // Guarda la sesión tras un login/registro exitoso
  const persistSession = useCallback((authToken, authUser) => {
    try { localStorage.setItem('token', authToken); } catch (e) {}
    setToken(authToken);
    setUser(authUser);
    setupAxios(authToken);
  }, [setupAxios]);

  // Llama a un endpoint de autenticación usando el wrapper centralizado
  const authRequest = useCallback(async (endpoint, body, fallbackMsg) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(endpoint, body);

      // Persist session based on response structure
      persistSession(response.data?.token || response?.data?.data?.token, response.data?.user || response?.data?.data?.user || response.data?.data);

      return { success: true };
    } catch (err) {
      const message = messageFromError(err, fallbackMsg);
      setError(message);

      return {
        success: false,
        message,
      };
    } finally {
      setLoading(false);
    }
  }, [persistSession]);

  // Registrar
  const register = useCallback((username, email, password, firstName, lastName, phone) => {
    const body = { username, password, firstName, lastName };
    if (email) body.email = email;
    if (phone) body.phone = phone;
    return authRequest('/auth/register', body, 'Error al registrarse');
  }, [authRequest]);

  // Login
  const login = useCallback((email, password, phone) => {
    const body = { password };
    if (email) body.email = email;
    if (phone) body.phone = phone;
    return authRequest('/auth/login', body, 'Email o contraseña incorrectos');
  }, [authRequest]);

  // Logout
  const logout = useCallback(() => {
    try { localStorage.removeItem('token'); } catch (e) {}
    setToken(null);
    setUser(null);
    setupAxios(null);
  }, [setupAxios]);

  // loginWithToken — usado por el callback OAuth (Google/Facebook)
  // Recibe el JWT que el backend incrusta en el redirect URL
  const loginWithToken = useCallback((authToken) => {
    try { localStorage.setItem('token', authToken); } catch (e) {}
    setToken(authToken);
    setupAxios(authToken);
    // getProfile se ejecutara automaticamente por el efecto que observa `token`
  }, [setupAxios]);

  // Obtener perfil
  const getProfile = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/profile');
      const profile = data?.user || data?.data || data;
      setUser(profile);
      return profile;
    } catch (err) {
      return null;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, error, register, login, logout, loginWithToken, getProfile, persistSession }}>
      {children}
    </AuthContext.Provider>
  );
};
