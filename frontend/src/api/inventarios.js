import axiosInstance, { MODO_DEMO } from './axios';

let inventarioMock = {
  1: [
    { producto_id: 1, nombre_producto: 'Laptop Dell', stock_actual: 15, stock_minimo: 5 },
    { producto_id: 2, nombre_producto: 'Mouse Logitech', stock_actual: 50, stock_minimo: 20 },
    { producto_id: 3, nombre_producto: 'Teclado Mecánico', stock_actual: 8, stock_minimo: 10 },
    { producto_id: 4, nombre_producto: 'Monitor Samsung', stock_actual: 12, stock_minimo: 5 },
    { producto_id: 5, nombre_producto: 'Audífonos Sony', stock_actual: 25, stock_minimo: 15 }
  ],
  2: [
    { producto_id: 1, nombre_producto: 'Laptop Dell', stock_actual: 10, stock_minimo: 5 },
    { producto_id: 2, nombre_producto: 'Mouse Logitech', stock_actual: 30, stock_minimo: 20 },
    { producto_id: 3, nombre_producto: 'Teclado Mecánico', stock_actual: 15, stock_minimo: 10 },
    { producto_id: 4, nombre_producto: 'Monitor Samsung', stock_actual: 8, stock_minimo: 5 },
    { producto_id: 5, nombre_producto: 'Audífonos Sony', stock_actual: 20, stock_minimo: 15 }
  ],
  3: [
    { producto_id: 1, nombre_producto: 'Laptop Dell', stock_actual: 20, stock_minimo: 5 },
    { producto_id: 2, nombre_producto: 'Mouse Logitech', stock_actual: 45, stock_minimo: 20 },
    { producto_id: 3, nombre_producto: 'Teclado Mecánico', stock_actual: 12, stock_minimo: 10 },
    { producto_id: 4, nombre_producto: 'Monitor Samsung', stock_actual: 18, stock_minimo: 5 },
    { producto_id: 5, nombre_producto: 'Audífonos Sony', stock_actual: 30, stock_minimo: 15 }
  ]
};

export const getInventarioBySucursal = async (sucursalId) => {
  if (MODO_DEMO) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return inventarioMock[sucursalId] || [];
  }
  
  try {
    const response = await axiosInstance.get(`/inventarios/${sucursalId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al obtener inventario' };
  }
};

export const actualizarInventario = async (datos) => {
  if (MODO_DEMO) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const { sucursal_id, producto_id, tipo, cantidad } = datos;
    const inventario = inventarioMock[sucursal_id];
    const item = inventario.find(i => i.producto_id === producto_id);
    
    if (item) {
      if (tipo === 'entrada') {
        item.stock_actual += cantidad;
      } else {
        item.stock_actual = Math.max(0, item.stock_actual - cantidad);
      }
    }
    
    return { mensaje: 'Inventario actualizado' };
  }
  
  try {
    const response = await axiosInstance.put('/inventarios/actualizar', datos);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al actualizar inventario' };
  }
};