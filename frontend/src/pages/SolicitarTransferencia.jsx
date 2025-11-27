import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { solicitarTransferencia } from '../api/transferencias';
import { getProductos } from '../api/productos';

const SolicitarTransferencia = () => {
  const { user } = useAuth();
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    sucursal_destino: '',
    producto_id: '',
    cantidad: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const data = await getProductos();
      setProductos(data);
    } catch (err) {
      setError('Error al cargar productos');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const transferencia = {
        sucursal_origen: user.sucursal,
        sucursal_destino: parseInt(formData.sucursal_destino),
        producto_id: parseInt(formData.producto_id),
        cantidad: parseInt(formData.cantidad)
      };

      if (transferencia.sucursal_origen === transferencia.sucursal_destino) {
        setError('La sucursal destino debe ser diferente a la sucursal origen');
        setLoading(false);
        return;
      }

      await solicitarTransferencia(transferencia);
      setSuccess('Solicitud de transferencia enviada exitosamente');
      setFormData({ sucursal_destino: '', producto_id: '', cantidad: '' });
    } catch (err) {
      setError(err.error || 'Error al solicitar transferencia');
    } finally {
      setLoading(false);
    }
  };

  const sucursalesDisponibles = [1, 2, 3].filter(s => s !== user.sucursal);

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Solicitar Transferencia</h1>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800">
          <span className="font-semibold">Sucursal Origen:</span> Sucursal {user.sucursal}
        </p>
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

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Sucursal Destino
            </label>
            <select
              value={formData.sucursal_destino}
              onChange={(e) => setFormData({ ...formData, sucursal_destino: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Seleccione una sucursal</option>
              {sucursalesDisponibles.map((sucursal) => (
                <option key={sucursal} value={sucursal}>
                  Sucursal {sucursal}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Producto
            </label>
            <select
              value={formData.producto_id}
              onChange={(e) => setFormData({ ...formData, producto_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Seleccione un producto</option>
              {productos.map((producto) => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre}
                </option>
              ))}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition disabled:bg-gray-400"
          >
            {loading ? 'Enviando solicitud...' : 'Solicitar Transferencia'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SolicitarTransferencia;