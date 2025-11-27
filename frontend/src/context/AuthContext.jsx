import { createContext, useState, useContext, useEffect } from 'react';
import { login as loginAPI } from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

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

      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('sucursal');
    localStorage.removeItem('username');
    setToken(null);
    setUser(null);
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
      loading 
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