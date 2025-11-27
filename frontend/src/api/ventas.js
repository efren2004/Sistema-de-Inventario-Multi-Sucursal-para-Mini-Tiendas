import axiosInstance, { MODO_DEMO } from './axios';

let ventasMock = {
  1: [
    { id: 1, sucursal_id: 1, producto_id: 1, nombre_producto: 'Laptop Dell', cantidad: 2, precio_unitario: 899.99, total: 1799.98, fecha: new Date().toISOString() },
    { id: 2, sucursal_id: 1, producto_id: 2, nombre_producto: 'Mouse Logitech', cantidad: 5, precio_unitario: 25.50, total: 127.50, fecha: new Date().toISOString() }
  ],
  2: [
    { id: 3, sucursal_id: 2, producto_id: 3, nombre_producto: 'Teclado Mecánico', cantidad: 3, precio_unitario: 120.00, total: 360.00, fecha: new Date().toISOString() }
  ],
  3: [
    { id: 4, sucursal_id: 3, producto_id: 4, nombre_producto: 'Monitor Samsung', cantidad: 1, precio_unitario: 199.99, total: 199.99, fecha: new Date().toISOString() }
  ]
};

let ventaIdCounter = 5;

export const registrarVenta = async (venta) => {
  if (MODO_DEMO) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const productos = [
      { id: 1, nombre: 'Laptop Dell' },
      { id: 2, nombre: 'Mouse Logitech' },
      { id: 3, nombre: 'Teclado Mecánico' },
      { id: 4, nombre: 'Monitor Samsung' },
      { id: 5, nombre: 'Audífonos Sony' }
    ];
    
    const producto = productos.find(p => p.id === venta.producto_id);
    
    const nuevaVenta = {
      id: ventaIdCounter++,
      sucursal_id: venta.sucursal_id,
      producto_id: venta.producto_id,
      nombre_producto: producto?.nombre || 'Producto',
      cantidad: venta.cantidad,
      precio_unitario: venta.precio_unitario,
      total: venta.cantidad * venta.precio_unitario,
      fecha: new Date().toISOString()
    };
    
    if (!ventasMock[venta.sucursal_id]) {
      ventasMock[venta.sucursal_id] = [];
    }
    ventasMock[venta.sucursal_id].push(nuevaVenta);
    
    return { mensaje: 'Venta registrada' };
  }
  
  try {
    const response = await axiosInstance.post('/ventas', venta);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al registrar venta' };
  }
};

export const getVentasBySucursal = async (sucursalId) => {
  if (MODO_DEMO) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return ventasMock[sucursalId] || [];
  }
  
  try {
    const response = await axiosInstance.get(`/ventas/sucursal/${sucursalId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al obtener ventas' };
  }
};