import axiosInstance from './axios';

export const registrarVenta = async (venta) => {
  try {
    const response = await axiosInstance.post('/ventas', venta);
    // El backend retorna: { success: true, data: {...} }
    return response.data.success ? response.data.data : response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al registrar venta' };
  }
};

export const getVentasBySucursal = async (sucursalId) => {
  try {
    const response = await axiosInstance.get(`/ventas/sucursal/${sucursalId}`);
    // El backend retorna: { success: true, data: [...] }
    return response.data.success ? response.data.data : response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al obtener ventas' };
  }
};