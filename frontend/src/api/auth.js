import axiosInstance, { MODO_DEMO } from './axios';

// Datos de prueba
const usuariosMock = {
  supervisor: { username: 'supervisor', password: 'pass123', rol: 'SUPERVISOR', sucursal: null },
  empleado1: { username: 'empleado1', password: 'pass123', rol: 'EMPLEADO', sucursal: 1 },
  empleado2: { username: 'empleado2', password: 'pass123', rol: 'EMPLEADO', sucursal: 2 }
};

export const login = async (credentials) => {
  if (MODO_DEMO) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const usuario = usuariosMock[credentials.username];
    
    if (usuario && usuario.password === credentials.password) {
      return {
        token: 'token-demo-' + Math.random(),
        rol: usuario.rol,
        sucursal: usuario.sucursal
      };
    } else {
      throw { error: 'Credenciales inválidas' };
    }
  }
  
  try {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Error al iniciar sesión' };
  }
};