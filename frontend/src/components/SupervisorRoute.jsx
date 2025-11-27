import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SupervisorRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  if (!user || user.rol !== 'SUPERVISOR') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default SupervisorRoute;