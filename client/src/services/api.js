import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials:true,
});

// If server returns 401, token is invalid or expired — redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) { 
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default api;