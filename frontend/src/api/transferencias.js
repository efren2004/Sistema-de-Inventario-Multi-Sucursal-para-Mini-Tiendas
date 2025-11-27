import axiosInstance from './axios';

export const solicitarTransferencia = async (transferencia) => {
  try {
    const response = await axiosInstance.post('/transferencias/solicitar', transferencia);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al solicitar transferencia' };
  }
};

export const aprobarTransferencia = async (id, datos) => {
  try {
    const response = await axiosInstance.put(`/transferencias/${id}/aprobar`, datos);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al aprobar transferencia' };
  }
};

export const getTransferenciasPendientes = async () => {
  try {
    const response = await axiosInstance.get('/transferencias/pendientes');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al obtener transferencias' };
  }
};