import React, { createContext, useState, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Timeout de 20 segundos para que no quede colgado si Render está despertando
const api = axios.create({ baseURL: API_URL, timeout: 20000 });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Configurar axios con token
  const setupAxios = useCallback((authToken) => {
    if (authToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, []);

  // Registrar
  const register = useCallback(async (username, email, password, firstName, lastName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/register', {
        username, email, password, firstName, lastName
      });

      const { token: authToken, user: authUser } = response.data;
      localStorage.setItem('token', authToken);
      setToken(authToken);
      setUser(authUser);
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
  }, [setupAxios]);

  // Login
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });

      const { token: authToken, user: authUser } = response.data;
      localStorage.setItem('token', authToken);
      setToken(authToken);
      setUser(authUser);
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
  }, [setupAxios]);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setupAxios(null);
  }, [setupAxios]);

  // loginWithToken — usado por el callback OAuth (Google/Facebook)
  // Recibe el JWT que el backend incrusta en el redirect URL
  const loginWithToken = useCallback((authToken) => {
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setupAxios(authToken);
    // getProfile se ejecutara automaticamente por el efecto que observa `token`
  }, [setupAxios]);

  // Obtener perfil
  const getProfile = useCallback(async () => {
    try {
      const response = await api.get('/auth/profile');
      setUser(response.data.user);
      return response.data.user;
    } catch (err) {
      return null;
    }
  }, []);

  // Inicializar con token guardado
  React.useEffect(() => {
    if (token) {
      setupAxios(token);
      getProfile();
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
