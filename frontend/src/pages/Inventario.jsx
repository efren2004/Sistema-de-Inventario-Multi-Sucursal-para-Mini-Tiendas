import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getInventarioBySucursal, actualizarInventario } from '../api/inventarios';
import { sseService } from '../api/sse';

const Inventario = () => {
  const { user, isSupervisor } = useAuth();
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState(user?.sucursal || 1);
  const [showModal, setShowModal] = useState(false);
  const [itemSeleccionado, setItemSeleccionado] = useState(null);
  const [formData, setFormData] = useState({ tipo: 'entrada', cantidad: '' });
  const [ultimaActualizacion, setUltimaActualizacion] = useState(new Date());
  const [sseConectado, setSseConectado] = useState(false);

  useEffect(() => {
    cargarInventario();
  }, [sucursalSeleccionada]);

  // Verificar estado de conexión SSE
  useEffect(() => {
    const interval = setInterval(() => {
      setSseConectado(sseService.isConnected());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Suscribirse a eventos SSE
  useEffect(() => {
    const handleInventarioActualizado = (data) => {
      console.log('Inventario.jsx: Evento recibido', data);
      // Solo actualizar si es la sucursal que estamos viendo
      if (data.sucursal_id === sucursalSeleccionada) {
        console.log('Inventario.jsx: Recargando inventario de sucursal', sucursalSeleccionada);
        cargarInventario(true);
        setUltimaActualizacion(new Date());
      }
    };

    sseService.subscribe('inventario-actualizado', handleInventarioActualizado);

    return () => {
      sseService.unsubscribe('inventario-actualizado', handleInventarioActualizado);
    };
  }, [sucursalSeleccionada]);

  const cargarInventario = async (silencioso = false) => {
    try {
      if (!silencioso) setLoading(true);
      const data = await getInventarioBySucursal(sucursalSeleccionada);
      setInventario(data);
      setError('');
    } catch (err) {
      if (!silencioso) {
        setError(err.error || 'Error al cargar inventario');
      }
    } finally {
      if (!silencioso) setLoading(false);
    }
  };

  const abrirModal = (item) => {
    setItemSeleccionado(item);
    setFormData({ tipo: 'entrada', cantidad: '' });
    setShowModal(true);
    setSuccess('');
    setError('');
  };

  const handleActualizar = async (e) => {
    e.preventDefault();
    
    try {
      const cantidad = parseInt(formData.cantidad);
      if (cantidad <= 0) {
        setError('La cantidad debe ser mayor a 0');
        return;
      }

      await actualizarInventario({
        sucursal_id: sucursalSeleccionada,
        producto_id: itemSeleccionado.producto_id,
        tipo: formData.tipo,
        cantidad: cantidad
      });

      setSuccess('Inventario actualizado correctamente');
      setShowModal(false);
      // SSE se encargará de actualizar automáticamente
    } catch (err) {
      setError(err.error || 'Error al actualizar inventario');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Cargando inventario...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Inventario</h1>
          
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              sseConectado 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {sseConectado ? '🟢 En vivo' : '🔴 Desconectado'}
            </span>
            
            <span className="text-xs text-gray-500">
              Actualizado: {ultimaActualizacion.toLocaleTimeString()}
            </span>

            <button
              onClick={() => cargarInventario()}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition"
            >
              ↻ Actualizar
            </button>
          </div>
        </div>

        {isSupervisor() && (
          <select
            value={sucursalSeleccionada}
            onChange={(e) => setSucursalSeleccionada(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value={1}>Sucursal 1</option>
            <option value={2}>Sucursal 2</option>
            <option value={3}>Sucursal 3</option>
          </select>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock Actual
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock Mínimo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventario.map((item) => (
              <tr key={item.producto_id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.nombre_producto}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                  {item.stock_actual}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.stock_minimo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.stock_actual <= item.stock_minimo ? (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      Stock Bajo
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Normal
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => abrirModal(item)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                  >
                    Actualizar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {inventario.length === 0 && !loading && (
        <div className="text-center text-gray-500 mt-8">
          No hay productos en el inventario
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Actualizar Inventario</h2>
            <p className="text-gray-600 mb-4">
              Producto: <span className="font-semibold">{itemSeleccionado?.nombre_producto}</span>
            </p>
            <p className="text-gray-600 mb-4">
              Stock Actual: <span className="font-semibold">{itemSeleccionado?.stock_actual}</span>
            </p>

            <form onSubmit={handleActualizar} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Tipo de Movimiento
                </label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="entrada">Entrada</option>
                  <option value="salida">Salida</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Cantidad
                </label>
                <input
                  type="number"
                  value={formData.cantidad}
                  onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  min="1"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
                >
                  Actualizar
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 rounded-lg transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventario;