import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach JWT to every outgoing request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If server returns 401, token is invalid or expired — redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tm_token');
      localStorage.removeItem('tm_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;