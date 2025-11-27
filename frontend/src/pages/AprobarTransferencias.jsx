import { useState, useEffect } from 'react';
import { getTransferenciasPendientes, aprobarTransferencia } from '../api/transferencias';
import { sseService } from '../api/sse';

const AprobarTransferencias = () => {
  const [transferencias, setTransferencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [ultimaActualizacion, setUltimaActualizacion] = useState(new Date());
  const [sseConectado, setSseConectado] = useState(false);

  useEffect(() => {
    cargarTransferencias();
  }, []);

  // Verificar estado de conexión SSE
  useEffect(() => {
    const interval = setInterval(() => {
      setSseConectado(sseService.isConnected());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Suscribirse a eventos SSE
  useEffect(() => {
    const handleTransferenciaNueva = (data) => {
      console.log('AprobarTransferencias.jsx: Nueva transferencia', data);
      cargarTransferencias(true);
      setUltimaActualizacion(new Date());
    };

    const handleTransferenciaAprobada = (data) => {
      console.log('AprobarTransferencias.jsx: Transferencia aprobada', data);
      cargarTransferencias(true);
      setUltimaActualizacion(new Date());
    };

    sseService.subscribe('transferencia-nueva', handleTransferenciaNueva);
    sseService.subscribe('transferencia-aprobada', handleTransferenciaAprobada);

    return () => {
      sseService.unsubscribe('transferencia-nueva', handleTransferenciaNueva);
      sseService.unsubscribe('transferencia-aprobada', handleTransferenciaAprobada);
    };
  }, []);

  const cargarTransferencias = async (silencioso = false) => {
    try {
      if (!silencioso) setLoading(true);
      const data = await getTransferenciasPendientes();
      setTransferencias(data);
      setError('');
    } catch (err) {
      if (!silencioso) {
        setError(err.error || 'Error al cargar transferencias');
      }
    } finally {
      if (!silencioso) setLoading(false);
    }
  };

  const handleAprobar = async (id) => {
    try {
      await aprobarTransferencia(id, { aprobado: true });
      setSuccess('Transferencia aprobada exitosamente');
      setTimeout(() => setSuccess(''), 3000);
      // SSE se encargará de actualizar automáticamente
    } catch (err) {
      setError(err.error || 'Error al aprobar transferencia');
    }
  };

  const handleRechazar = async (id) => {
    try {
      await aprobarTransferencia(id, { aprobado: false });
      setSuccess('Transferencia rechazada');
      setTimeout(() => setSuccess(''), 3000);
// SSE se encargará de actualizar automáticamente
} catch (err) {
setError(err.error || 'Error al rechazar transferencia');
}
};
if (loading) {
return (
<div className="flex justify-center items-center h-64">
<div className="text-xl text-gray-600">Cargando transferencias...</div>
</div>
);
}
return (
<div>
<div className="flex justify-between items-center mb-6">
<div className="flex items-center gap-4">
<h1 className="text-3xl font-bold text-gray-800">Aprobar Transferencias</h1>
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
          onClick={() => cargarTransferencias()}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition"
        >
          ↻ Actualizar
        </button>
      </div>
    </div>
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
            ID
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Producto
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Origen
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Destino
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Cantidad
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
        {transferencias.map((transferencia) => (
          <tr key={transferencia.id} className="hover:bg-gray-50 transition">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {transferencia.id}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {transferencia.nombre_producto}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              Sucursal {transferencia.sucursal_origen}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              Sucursal {transferencia.sucursal_destino}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {transferencia.cantidad}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                {transferencia.estado}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
              {transferencia.estado === 'PENDIENTE' && (
                <>
                  <button
                    onClick={() => handleAprobar(transferencia.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => handleRechazar(transferencia.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                  >
                    Rechazar
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {transferencias.length === 0 && !loading && (
    <div className="text-center text-gray-500 mt-8">
      No hay transferencias pendientes
    </div>
  )}
</div>
);
};
export default AprobarTransferencias;