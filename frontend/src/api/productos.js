import axiosInstance, { MODO_DEMO } from './axios';

const productosMock = [
  { id: 1, nombre: 'Laptop Dell', descripcion: 'Laptop Dell Inspiron 15', precio: 899.99 },
  { id: 2, nombre: 'Mouse Logitech', descripcion: 'Mouse inalámbrico', precio: 25.50 },
  { id: 3, nombre: 'Teclado Mecánico', descripcion: 'Teclado RGB', precio: 120.00 },
  { id: 4, nombre: 'Monitor Samsung', descripcion: 'Monitor 24 pulgadas', precio: 199.99 },
  { id: 5, nombre: 'Audífonos Sony', descripcion: 'Audífonos Bluetooth', precio: 89.99 }
];

export const getProductos = async () => {
  if (MODO_DEMO) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return productosMock;
  }
  
  try {
    const response = await axiosInstance.get('/productos');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al obtener productos' };
  }
};