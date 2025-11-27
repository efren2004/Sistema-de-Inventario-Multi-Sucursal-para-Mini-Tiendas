import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { isSupervisor } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', roles: ['SUPERVISOR', 'EMPLEADO'] },
    { path: '/productos', label: 'Productos', roles: ['SUPERVISOR', 'EMPLEADO'] },
    { path: '/inventario', label: 'Inventario', roles: ['SUPERVISOR', 'EMPLEADO'] },
    { path: '/registrar-venta', label: 'Registrar Venta', roles: ['SUPERVISOR', 'EMPLEADO'] },
    { path: '/ventas-sucursal', label: 'Ver Ventas', roles: ['SUPERVISOR', 'EMPLEADO'] },
    { path: '/solicitar-transferencia', label: 'Solicitar Transferencia', roles: ['EMPLEADO'] },
    { path: '/aprobar-transferencias', label: 'Aprobar Transferencias', roles: ['SUPERVISOR'] }
  ];

  const filteredMenu = menuItems.filter(item => {
    if (isSupervisor()) return item.roles.includes('SUPERVISOR');
    return item.roles.includes('EMPLEADO');
  });

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Menú</h2>
        <div className="h-1 bg-blue-500 w-16"></div>
      </div>
      <nav>
        <ul className="space-y-2">
          {filteredMenu.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`block px-4 py-3 rounded-lg transition ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-700'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;