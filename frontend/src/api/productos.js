import axiosInstance from './axios';

export const getProductos = async () => {
  try {
    const response = await axiosInstance.get('/productos');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al obtener productos' };
  }
};