import axios from 'axios';

// Use environment variable if provided, or default to relative path (leveraging Vite dev proxy)
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
// Strip trailing /api or / so endpoints calling /api/... work regardless of whether user includes /api in the env var
const cleanBaseUrl = rawBaseUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');

export const BASE_URL = cleanBaseUrl;
export const DOCS_URL = (cleanBaseUrl || 'http://localhost:8000') + '/api/docs/';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

/**
 * Token Storage Helpers for Session vs Persistent (Remember Me) Login
 * - If "Remember Me" is checked: tokens live in localStorage (persists across tabs and browser restarts)
 * - If "Remember Me" is NOT checked: tokens live in sessionStorage (isolated strictly to the active tab)
 */
export const getStoredAccessToken = () => {
  return sessionStorage.getItem('infishelf_access_token') || localStorage.getItem('infishelf_access_token') || null;
};

export const getStoredRefreshToken = () => {
  return sessionStorage.getItem('infishelf_refresh_token') || localStorage.getItem('infishelf_refresh_token') || null;
};

export const setStoredTokens = (accessToken, refreshToken, remember = false) => {
  if (remember) {
    localStorage.setItem('infishelf_access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('infishelf_refresh_token', refreshToken);
    }
    sessionStorage.removeItem('infishelf_access_token');
    sessionStorage.removeItem('infishelf_refresh_token');
  } else {
    sessionStorage.setItem('infishelf_access_token', accessToken);
    if (refreshToken) {
      sessionStorage.setItem('infishelf_refresh_token', refreshToken);
    }
    localStorage.removeItem('infishelf_access_token');
    localStorage.removeItem('infishelf_refresh_token');
  }
};

export const clearStoredTokens = () => {
  sessionStorage.removeItem('infishelf_access_token');
  sessionStorage.removeItem('infishelf_refresh_token');
  localStorage.removeItem('infishelf_access_token');
  localStorage.removeItem('infishelf_refresh_token');
};

// Request interceptor: attach JWT access token if present
api.interceptors.request.use(
  (config) => {
    const token = getStoredAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: auto-refresh on 401 Unauthorized
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loop on auth endpoints
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/api/auth/login/') &&
      !originalRequest.url.includes('/api/auth/refresh/')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const isSession = Boolean(sessionStorage.getItem('infishelf_refresh_token'));
      const refreshToken = getStoredRefreshToken();

      if (!refreshToken) {
        isRefreshing = false;
        clearStoredTokens();
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${BASE_URL}/api/auth/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        const newRefreshToken = response.data.refresh || refreshToken;

        // Maintain the same storage medium (sessionStorage vs localStorage)
        setStoredTokens(newAccessToken, newRefreshToken, !isSession);

        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearStoredTokens();
        window.dispatchEvent(new Event('auth:unauthorized'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // If the server returned an HTML error page (e.g. Django debug page or 502/504 Bad Gateway),
    // sanitize response.data into a clean object to prevent raw markup appearing in UI modals/toasts.
    if (
      error.response &&
      typeof error.response.data === 'string' &&
      (error.response.data.trim().startsWith('<') || error.response.data.includes('<!DOCTYPE'))
    ) {
      const status = error.response.status;
      const cleanMessage =
        status === 503
          ? 'Database service temporarily unavailable. Please retry in a few moments.'
          : status >= 500
          ? 'Server connection error. Please try again shortly.'
          : 'An unexpected response was received from the server.';
      error.response.data = {
        success: false,
        message: cleanMessage,
        detail: cleanMessage,
        error: cleanMessage,
      };
    }

    return Promise.reject(error);
  }
);
