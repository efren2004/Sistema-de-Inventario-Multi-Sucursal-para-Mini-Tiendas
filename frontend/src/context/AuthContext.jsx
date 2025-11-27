import { createContext, useState, useContext, useEffect } from 'react';
import { login as loginAPI } from '../api/auth';
import { sseService } from '../api/sse';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // NUEVO → Estado para saber si el sistema usa SSE o Polling
  const [realtimeMode, setRealtimeMode] = useState("none");

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRol = localStorage.getItem('rol');
    const storedSucursal = localStorage.getItem('sucursal');
    const storedUsername = localStorage.getItem('username');

    if (storedToken && storedRol) {
      setUser({
        rol: storedRol,
        sucursal: storedSucursal ? parseInt(storedSucursal) : null,
        username: storedUsername
      });
      setToken(storedToken);

      console.log('AuthContext: Intentando conectar SSE con token existente');
      
      // Intentar conectar SSE → si falla, activar polling
      sseService.connect(storedToken,
        () => setRealtimeMode("sse"),      // onSuccess
        () => setRealtimeMode("polling")   // onError fallback
      );
    }

    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const data = await loginAPI(credentials);

      localStorage.setItem('token', data.token);
      localStorage.setItem('rol', data.rol);
      localStorage.setItem('username', credentials.username);
      
      if (data.sucursal) {
        localStorage.setItem('sucursal', data.sucursal.toString());
      }

      setToken(data.token);
      setUser({
        rol: data.rol,
        sucursal: data.sucursal,
        username: credentials.username
      });

      console.log('AuthContext: Usuario autenticado, intentando conectar SSE');

      // Intentar conectar SSE → fallback Automático
      sseService.connect(
        data.token,
        () => setRealtimeMode("sse"),     // SSE OK
        () => setRealtimeMode("polling")  // Fallback
      );

      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    console.log('AuthContext: Cerrando sesión, desconectando SSE');

    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('sucursal');
    localStorage.removeItem('username');

    setToken(null);
    setUser(null);

    sseService.disconnect();
    setRealtimeMode("none");
  };

  const isSupervisor = () => user?.rol === 'SUPERVISOR';
  const isEmpleado = () => user?.rol === 'EMPLEADO';

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      isSupervisor,
      isEmpleado,
      loading,
      realtimeMode  // NUEVO
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};
 