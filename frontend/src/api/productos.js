import axiosInstance from './axios';

export const getProductos = async () => {
  try {
    const response = await axiosInstance.get('/productos');
    // El backend retorna: { success: true, data: [...] }
    return response.data.success ? response.data.data : response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al obtener productos' };
  }
};

export const createProducto = async (producto) => {
  try {
    const response = await axiosInstance.post('/productos', producto);
    // El backend retorna: { success: true, data: {...} }
    return response.data.success ? response.data.data : response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al crear producto' };
  }
};