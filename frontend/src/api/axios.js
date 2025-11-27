import axios from 'axios';
import { API_URL } from '../config';

// Variable para activar/desactivar modo demo
export const MODO_DEMO = true; // Cambia a false cuando tengas el backend

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !MODO_DEMO) {
      localStorage.removeItem('token');
      localStorage.removeItem('rol');
      localStorage.removeItem('sucursal');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;