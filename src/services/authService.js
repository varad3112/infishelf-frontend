import { api } from './api';

export const authService = {
  /**
   * Log in user with username and password
   * Returns: { access, refresh }
   */
  async login(username, password) {
    const response = await api.post('/api/auth/login/', {
      username: username.trim(),
      password,
    });
    return response.data;
  },

  /**
   * Register a new user
   * Body: { username, email, password, password_confirm }
   */
  async register(username, email, password, passwordConfirm) {
    const response = await api.post('/api/auth/register/', {
      username: username.trim(),
      email: email.trim(),
      password,
      confirm_password: passwordConfirm,
      password_confirm: passwordConfirm,
    });
    return response.data;
  },

  /**
   * Retrieve current authenticated user profile
   */
  async getMe() {
    const response = await api.get('/api/auth/me/');
    return response.data;
  },

  /**
   * Refresh JWT token
   */
  async refreshToken(refreshToken) {
    const response = await api.post('/api/auth/refresh/', {
      refresh: refreshToken,
    });
    return response.data;
  },
};
