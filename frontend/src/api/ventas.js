import axiosInstance from './axios';

export const registrarVenta = async (venta) => {
  try {
    const response = await axiosInstance.post('/ventas', venta);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al registrar venta' };
  }
};

export const getVentasBySucursal = async (sucursalId) => {
  try {
    const response = await axiosInstance.get(`/ventas/sucursal/${sucursalId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al obtener ventas' };
  }
};