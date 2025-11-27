import axiosInstance from './axios';

export const getInventarioBySucursal = async (sucursalId) => {
  try {
    const response = await axiosInstance.get(`/inventarios/${sucursalId}`);
    // El backend retorna: { success: true, data: [...] }
    return response.data.success ? response.data.data : response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al obtener inventario' };
  }
};

export const actualizarInventario = async (datos) => {
  try {
    const response = await axiosInstance.put('/inventarios/actualizar', datos);
    // El backend retorna: { success: true, data: {...} }
    return response.data.success ? response.data.data : response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al actualizar inventario' };
  }
};