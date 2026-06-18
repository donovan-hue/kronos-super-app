import React, { createContext, useState, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

// Timeout de 60s para sobrevivir el arranque en frío de Render (free tier ~30-60s)
const api = axios.create({ baseURL: API_URL, timeout: 60000 });

// Despierta el servidor: pega a /api/health hasta que responda 200 o se agote el tiempo.
const wakeServer = async (maxWaitMs = 50000) => {
  const deadline = Date.now() + maxWaitMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${API_ORIGIN}/api/health`, { signal: AbortSignal.timeout(10000) });
      if (res.ok) return true; // 200 = servidor + DB listos
    } catch {
      /* sigue intentando */
    }
    await new Promise(r => setTimeout(r, 2000));
  }
  return false;
};

// Traduce un error de axios a un mensaje claro para el usuario.
const messageFromError = (err, fallback) => {
  if (err.code === 'ECONNABORTED') {
    return 'El servidor tardó demasiado (arranque en frío). Vuelve a intentarlo.';
  }
  if (!err.response) {
    return 'No se pudo conectar con el servidor. Revisa tu conexión e intenta de nuevo.';
  }
  return err.response.data?.message || fallback;
};

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

  // Guarda la sesión tras un login/registro exitoso
  const persistSession = useCallback((authToken, authUser) => {
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(authUser);
    setupAxios(authToken);
  }, [setupAxios]);

  // Llama a un endpoint de auth con wake + reintento automático:
  // si no hay respuesta (servidor dormido/red), despierta el server y reintenta una vez.
  const authRequest = useCallback(async (endpoint, body, fallbackMsg) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      try {
        response = await api.post(endpoint, body);
      } catch (err) {
        // Sin respuesta o timeout: pudo ser arranque en frío. Despierta y reintenta 1 vez.
        if (!err.response || err.code === 'ECONNABORTED') {
          await wakeServer();
          response = await api.post(endpoint, body);
        } else {
          throw err;
        }
      }
      persistSession(response.data.token, response.data.user);
      return { success: true };
    } catch (err) {
      const message = messageFromError(err, fallbackMsg);
      setError(message);
      return { success: false, message };
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
