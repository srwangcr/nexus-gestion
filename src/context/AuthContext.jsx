import React, { createContext, useState } from 'react';

/**
 * Contexto de autenticación para manejar el estado del usuario
 * BACKEND: Este contexto consume los endpoints de autenticación
 */
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  const [user, setUser] = useState(() => {
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  });
  const [token, setToken] = useState(storedToken);

  /**
   * Iniciar sesión
   * BACKEND: POST /api/auth/login
   * Body: { email, password }
   * Response: { token, user }
   */
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  /**
   * Cerrar sesión
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  /**
   * Verificar si el usuario está autenticado
   */
  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading: false,
      isAuthenticated,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};