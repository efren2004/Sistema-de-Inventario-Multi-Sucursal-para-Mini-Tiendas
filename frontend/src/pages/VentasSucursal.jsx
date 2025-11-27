import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getVentasBySucursal } from '../api/ventas';
import { sseService } from '../api/sse';

const VentasSucursal = () => {
  const { user, isSupervisor } = useAuth();
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState(user?.sucursal || 1);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(new Date());
  const [sseConectado, setSseConectado] = useState(false);
  const [modoPolling, setModoPolling] = useState(false);

  useEffect(() => {
    cargarVentas();
  }, [sucursalSeleccionada]);

  // Verificar estado de conexión SSE
  useEffect(() => {
    const interval = setInterval(() => {
      setSseConectado(sseService.isConnected());
      setModoPolling(sseService.isFallbackMode());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Polling como fallback si SSE no está disponible
  useEffect(() => {
    if (!sseService.isFallbackMode()) return;

    console.log('ℹ️ Modo Polling activo para Ventas (actualizando cada 10 segundos)');
    const interval = setInterval(() => {
      cargarVentas(true);
      setUltimaActualizacion(new Date());
    }, 10000); // 10 segundos

    return () => clearInterval(interval);
  }, [sucursalSeleccionada, modoPolling]);

  // Suscribirse a eventos SSE
  useEffect(() => {
    const handleVentaRegistrada = (data) => {
      if (data.sucursal_id === sucursalSeleccionada) {
        cargarVentas(true);
        setUltimaActualizacion(new Date());
      }
    };

    sseService.subscribe('venta-registrada', handleVentaRegistrada);

    return () => {
      sseService.unsubscribe('venta-registrada', handleVentaRegistrada);
    };
  }, [sucursalSeleccionada]);

  const cargarVentas = async (silencioso = false) => {
    try {
      if (!silencioso) setLoading(true);
      const data = await getVentasBySucursal(sucursalSeleccionada);
      setVentas(data);
      setError('');
    } catch (err) {
      if (!silencioso) {
        setError(err.error || 'Error al cargar ventas');
      }
    } finally {
      if (!silencioso) setLoading(false);
    }
  };

  const calcularTotal = () => {
    return ventas.reduce((sum, venta) => sum + parseFloat(venta.total), 0).toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Cargando ventas...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Ventas</h1>
          
          <div className="flex items-center gap-2">
            {sseConectado ? (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                🟢 Tiempo Real
              </span>
            ) : modoPolling ? (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                🟡 Auto-actualización (10s)
              </span>
            ) : (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                ⚪ Manual
              </span>
            )}
            
            <span className="text-xs text-gray-500">
              Actualizado: {ultimaActualizacion.toLocaleTimeString()}
            </span>

            <button
              onClick={() => cargarVentas()}
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

      {modoPolling && !sseConectado && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
          ℹ️ SSE no disponible. Se actualiza automáticamente cada 10 segundos.
        </div>
      )}

      <div className="bg-blue-100 border border-blue-400 p-4 rounded-lg mb-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-blue-900">Total de Ventas:</span>
          <span className="text-2xl font-bold text-blue-900">${calcularTotal()}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio Unit.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ventas.map((venta) => (
              <tr key={venta.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {venta.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {venta.nombre_producto}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {venta.cantidad}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${parseFloat(venta.precio_unitario).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  ${parseFloat(venta.total).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(venta.fecha).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {ventas.length === 0 && !loading && (
        <div className="text-center text-gray-500 mt-8">
          No hay ventas registradas
        </div>
      )}
    </div>
  );
};

export default VentasSucursal;