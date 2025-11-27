import axiosInstance from './axios';

export const getInventarioBySucursal = async (sucursalId) => {
  try {
    const response = await axiosInstance.get(`/inventarios/${sucursalId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al obtener inventario' };
  }
};

export const actualizarInventario = async (datos) => {
  try {
    const response = await axiosInstance.put('/inventarios/actualizar', datos);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al actualizar inventario' };
  }
};