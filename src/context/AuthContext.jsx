import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import {
  getStoredAccessToken,
  setStoredTokens,
  clearStoredTokens,
} from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    const token = getStoredAccessToken();
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
      clearStoredTokens();
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

  const login = async (username, password, remember = false) => {
    const data = await authService.login(username, password);
    setStoredTokens(data.access, data.refresh, remember);
    await fetchCurrentUser();
    return data;
  };

  const register = async (username, email, password, passwordConfirm) => {
    const data = await authService.register(username, email, password, passwordConfirm);
    if (data.tokens) {
      // New registrations default to session-based unless remembered
      setStoredTokens(data.tokens.access, data.tokens.refresh, false);
    }
    await fetchCurrentUser();
    return data;
  };

  const logout = () => {
    clearStoredTokens();
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
