import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://jobtrack-backend-xuvm.onrender.com/api' : 'http://localhost:8080/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000, // 45s timeout to accommodate cloud cold-starts
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for automatic 401 handling & cold-start retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    // Retry once if Render backend is waking up (502/503/504 or network timeout)
    if (!config._retry && (!response || [502, 503, 504].includes(response.status))) {
      config._retry = true;
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return api(config);
    }

    if (response && response.status === 401) {
      // Token expired or invalid
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

