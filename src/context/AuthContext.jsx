import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    const token = localStorage.getItem('infishelf_access_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userData = await authService.getMe();
      setUser(userData);
    } catch {
      setUser(null);
      localStorage.removeItem('infishelf_access_token');
      localStorage.removeItem('infishelf_refresh_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();

    const handleUnauthorized = () => {
      setUser(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [fetchCurrentUser]);

  const login = async (username, password) => {
    const data = await authService.login(username, password);
    localStorage.setItem('infishelf_access_token', data.access);
    localStorage.setItem('infishelf_refresh_token', data.refresh);
    await fetchCurrentUser();
    return data;
  };

  const register = async (username, email, password, passwordConfirm) => {
    const data = await authService.register(username, email, password, passwordConfirm);
    if (data.tokens) {
      localStorage.setItem('infishelf_access_token', data.tokens.access);
      localStorage.setItem('infishelf_refresh_token', data.tokens.refresh);
    }
    await fetchCurrentUser();
    return data;
  };

  const logout = () => {
    localStorage.removeItem('infishelf_access_token');
    localStorage.removeItem('infishelf_refresh_token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser: fetchCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
