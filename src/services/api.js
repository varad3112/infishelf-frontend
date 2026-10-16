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

// Request interceptor: attach JWT access token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('infishelf_access_token');
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

      const refreshToken = localStorage.getItem('infishelf_refresh_token');

      if (!refreshToken) {
        isRefreshing = false;
        localStorage.removeItem('infishelf_access_token');
        localStorage.removeItem('infishelf_refresh_token');
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${BASE_URL}/api/auth/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        localStorage.setItem('infishelf_access_token', newAccessToken);

        if (response.data.refresh) {
          localStorage.setItem('infishelf_refresh_token', response.data.refresh);
        }

        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('infishelf_access_token');
        localStorage.removeItem('infishelf_refresh_token');
        window.dispatchEvent(new Event('auth:unauthorized'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
