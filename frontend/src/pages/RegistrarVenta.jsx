import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { registrarVenta } from '../api/ventas';
import { getProductos } from '../api/productos';

const RegistrarVenta = () => {
  const { user } = useAuth();
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    producto_id: '',
    cantidad: '',
    precio_unitario: ''
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

  const handleProductoChange = (e) => {
    const productoId = parseInt(e.target.value);
    const producto = productos.find(p => p.id === productoId);
    
    setFormData({
      ...formData,
      producto_id: productoId,
      precio_unitario: producto ? producto.precio : ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const ventaData = {
        sucursal_id: user.sucursal,
        producto_id: parseInt(formData.producto_id),
        cantidad: parseInt(formData.cantidad),
        precio_unitario: parseFloat(formData.precio_unitario)
      };

      await registrarVenta(ventaData);
      setSuccess('Venta registrada exitosamente');
      setFormData({ producto_id: '', cantidad: '', precio_unitario: '' });
    } catch (err) {
      setError(err.error || 'Error al registrar venta');
    } finally {
      setLoading(false);
    }
  };

  const calcularTotal = () => {
    const cantidad = parseFloat(formData.cantidad) || 0;
    const precio = parseFloat(formData.precio_unitario) || 0;
    return (cantidad * precio).toFixed(2);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Registrar Nueva Venta</h1>

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
              Producto
            </label>
            <select
              value={formData.producto_id}
              onChange={handleProductoChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Seleccione un producto</option>
              {productos.map((producto) => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre} - ${producto.precio}
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

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Precio Unitario
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.precio_unitario}
              onChange={(e) => setFormData({ ...formData, precio_unitario: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              min="0"
            />
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-700">Total:</span>
              <span className="text-2xl font-bold text-blue-600">${calcularTotal()}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition disabled:bg-gray-400"
          >
            {loading ? 'Registrando...' : 'Registrar Venta'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrarVenta;