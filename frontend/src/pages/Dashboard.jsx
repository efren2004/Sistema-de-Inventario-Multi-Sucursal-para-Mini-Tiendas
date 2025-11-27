import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, isSupervisor } = useAuth();

  const supervisorCards = [
    { title: 'Productos', description: 'Ver catálogo de productos', link: '/productos', color: 'bg-blue-500' },
    { title: 'Inventario', description: 'Gestionar inventario', link: '/inventario', color: 'bg-green-500' },
    { title: 'Ventas', description: 'Ver ventas por sucursal', link: '/ventas-sucursal', color: 'bg-purple-500' },
    { title: 'Aprobar Transferencias', description: 'Gestionar solicitudes', link: '/aprobar-transferencias', color: 'bg-orange-500' }
  ];

  const empleadoCards = [
    { title: 'Productos', description: 'Ver catálogo de productos', link: '/productos', color: 'bg-blue-500' },
    { title: 'Inventario', description: 'Ver inventario de mi sucursal', link: '/inventario', color: 'bg-green-500' },
    { title: 'Registrar Venta', description: 'Nueva venta', link: '/registrar-venta', color: 'bg-purple-500' },
    { title: 'Mis Ventas', description: 'Ver ventas realizadas', link: '/ventas-sucursal', color: 'bg-indigo-500' },
    { title: 'Solicitar Transferencia', description: 'Pedir productos', link: '/solicitar-transferencia', color: 'bg-orange-500' }
  ];

  const cards = isSupervisor() ? supervisorCards : empleadoCards;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Bienvenido, {user?.username}
        </h1>
        <p className="text-gray-600">
          Rol: <span className="font-semibold">{user?.rol}</span>
          {user?.sucursal && ` | Sucursal: ${user.sucursal}`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className={`${card.color} text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1`}
          >
            <h3 className="text-xl font-bold mb-2">{card.title}</h3>
            <p className="text-white text-opacity-90">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;