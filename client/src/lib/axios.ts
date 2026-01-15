import axios from 'axios';

// Use environment variable for API URL in production, fallback to /api for development
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests (only if token exists)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Don't redirect automatically - let components handle it
      // This prevents auto-redirect on page load for guest users
      if (import.meta.env.MODE === 'development') {
        console.warn('Authentication required');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
