import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-md px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sistema de Inventario</h1>
          <p className="text-sm text-gray-600">
            {user?.rol} {user?.sucursal && `- Sucursal ${user.sucursal}`}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">{user?.username}</span>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;