import React, { createContext, useState, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});
// Traduce un error de axios a un mensaje claro para el usuario.
const messageFromError = (err, fallback) => {
  if (err.code === 'ECONNABORTED') {
    return 'El servidor tardó demasiado en responder. Intenta nuevamente.';
  }

  if (!err.response) {
    return 'No se pudo conectar con el servidor.';
  }

  return err.response?.data?.message || fallback;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Configurar axios con token
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
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(authUser);
    setupAxios(authToken);
  }, [setupAxios]);
// Llama a un endpoint de autenticación
const authRequest = useCallback(async (endpoint, body, fallbackMsg) => {
  setLoading(true);
  setError(null);

  try {
    const response = await api.post(endpoint, body);

    persistSession(response.data.token, response.data.user);

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
      // Token inválido/expirado: limpiar la sesión para no quedar con
      // isAuthenticated=true y user=null (estado que deja pantallas a medias).
      if (err.response?.status === 401) {
        logout();
      }
      return null;
    }
  }, [logout]);

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
