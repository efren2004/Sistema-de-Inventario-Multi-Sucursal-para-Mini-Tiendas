import axiosInstance, { MODO_DEMO } from './axios';

let transferenciasMock = [
  { id: 1, sucursal_origen: 1, sucursal_destino: 2, producto_id: 1, nombre_producto: 'Laptop Dell', cantidad: 5, estado: 'PENDIENTE' },
  { id: 2, sucursal_origen: 2, sucursal_destino: 3, producto_id: 2, nombre_producto: 'Mouse Logitech', cantidad: 10, estado: 'PENDIENTE' },
  { id: 3, sucursal_origen: 3, sucursal_destino: 1, producto_id: 3, nombre_producto: 'Teclado Mecánico', cantidad: 3, estado: 'APROBADO' }
];

let transferenciaIdCounter = 4;

export const solicitarTransferencia = async (transferencia) => {
  if (MODO_DEMO) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const productos = [
      { id: 1, nombre: 'Laptop Dell' },
      { id: 2, nombre: 'Mouse Logitech' },
      { id: 3, nombre: 'Teclado Mecánico' },
      { id: 4, nombre: 'Monitor Samsung' },
      { id: 5, nombre: 'Audífonos Sony' }
    ];
    
    const producto = productos.find(p => p.id === transferencia.producto_id);
    
    const nuevaTransferencia = {
      id: transferenciaIdCounter++,
      sucursal_origen: transferencia.sucursal_origen,
      sucursal_destino: transferencia.sucursal_destino,
      producto_id: transferencia.producto_id,
      nombre_producto: producto?.nombre || 'Producto',
      cantidad: transferencia.cantidad,
      estado: 'PENDIENTE'
    };
    
    transferenciasMock.push(nuevaTransferencia);
    
    return { mensaje: 'Transferencia solicitada' };
  }
  
  try {
    const response = await axiosInstance.post('/transferencias/solicitar', transferencia);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al solicitar transferencia' };
  }
};

export const aprobarTransferencia = async (id, datos) => {
  if (MODO_DEMO) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const transferencia = transferenciasMock.find(t => t.id === id);
    if (transferencia) {
      transferencia.estado = datos.aprobado ? 'APROBADO' : 'RECHAZADO';
    }
    
    return { mensaje: 'Transferencia procesada' };
  }
  
  try {
    const response = await axiosInstance.put(`/transferencias/${id}/aprobar`, datos);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al aprobar transferencia' };
  }
};

export const getTransferenciasPendientes = async () => {
  if (MODO_DEMO) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return transferenciasMock.filter(t => t.estado === 'PENDIENTE');
  }
  
  try {
    const response = await axiosInstance.get('/transferencias/pendientes');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al obtener transferencias' };
  }
};