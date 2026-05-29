import React, { createContext, useState, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Timeout de 20 segundos para que no quede colgado si Render está despertando
const api = axios.create({ baseURL: API_URL, timeout: 20000 });

const USER_KEY = 'kronos_user';

function saveUserCache(u) {
  try { if (u) localStorage.setItem(USER_KEY, JSON.stringify(u)); } catch (_) {}
}
function loadUserCache() {
  try { const s = localStorage.getItem(USER_KEY); return s ? JSON.parse(s) : null; } catch (_) { return null; }
}
function clearUserCache() {
  try { localStorage.removeItem(USER_KEY); } catch (_) {}
}

export const AuthProvider = ({ children }) => {
  // Iniciar con cache local para que el usuario no vea la pantalla de login
  // mientras el backend (Render) despierta
  const [user, setUser] = useState(() => loadUserCache());
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const setupAxios = useCallback((authToken) => {
    if (authToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, []);

  const setAndCacheUser = useCallback((u) => {
    setUser(u);
    if (u) saveUserCache(u);
    else clearUserCache();
  }, []);

  // Registrar
  const register = useCallback(async (username, email, password, firstName, lastName, phone) => {
    setLoading(true);
    setError(null);
    try {
      const body = { username, password, firstName, lastName };
      if (email) body.email = email;
      if (phone) body.phone = phone;
      const response = await api.post('/auth/register', body);

      const { token: authToken, user: authUser } = response.data;
      localStorage.setItem('token', authToken);
      setToken(authToken);
      setAndCacheUser(authUser);
      setupAxios(authToken);

      return { success: true };
    } catch (err) {
      const message = err.code === 'ECONNABORTED'
        ? 'El servidor tardó demasiado. Intenta de nuevo en unos segundos.'
        : err.response?.data?.message || 'Error al registrarse';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [setupAxios, setAndCacheUser]);

  // Login
  const login = useCallback(async (email, password, phone) => {
    setLoading(true);
    setError(null);
    try {
      const body = { password };
      if (email) body.email = email;
      if (phone) body.phone = phone;
      const response = await api.post('/auth/login', body);

      const { token: authToken, user: authUser } = response.data;
      localStorage.setItem('token', authToken);
      setToken(authToken);
      setAndCacheUser(authUser);
      setupAxios(authToken);

      return { success: true };
    } catch (err) {
      const message = err.code === 'ECONNABORTED'
        ? 'El servidor tardó demasiado. Intenta de nuevo en unos segundos.'
        : err.response?.data?.message || 'Email o contraseña incorrectos';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [setupAxios, setAndCacheUser]);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    clearUserCache();
    setToken(null);
    setUser(null);
    setupAxios(null);
  }, [setupAxios]);

  // loginWithToken — usado por el callback OAuth (Google/Facebook)
  const loginWithToken = useCallback((authToken) => {
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setupAxios(authToken);
  }, [setupAxios]);

  // Obtener perfil
  const getProfile = useCallback(async () => {
    try {
      const response = await api.get('/auth/profile');
      setAndCacheUser(response.data.user);
      return response.data.user;
    } catch (err) {
      // Si falla pero tenemos token válido, mantenemos el cache — no cerramos sesión
      return null;
    }
  }, [setAndCacheUser]);

  // Inicializar con token guardado
  React.useEffect(() => {
    if (token) {
      setupAxios(token);
      getProfile();
    } else {
      clearUserCache();
      setUser(null);
    }
  }, [token, setupAxios, getProfile]);

  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    loginWithToken,
    getProfile,
    isAuthenticated: !!token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
