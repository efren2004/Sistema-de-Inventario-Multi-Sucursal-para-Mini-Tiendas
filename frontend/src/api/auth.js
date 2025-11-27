import api from './axios';

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', {
      username: credentials.username,
      password: credentials.password
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error de conexión' };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('rol');
  localStorage.removeItem('sucursalId');
};