import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SupervisorRoute from './components/SupervisorRoute';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Productos from './pages/Productos';
import Inventario from './pages/Inventario';
import RegistrarVenta from './pages/RegistrarVenta';
import VentasSucursal from './pages/VentasSucursal';
import SolicitarTransferencia from './pages/SolicitarTransferencia';
import AprobarTransferencias from './pages/AprobarTransferencias';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/*"
            element={
              <ProtectedRoute>
            <div className="flex h-screen bg-gray-100">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/productos" element={<Productos />} />
                    <Route path="/inventario" element={<Inventario />} />
                    <Route path="/registrar-venta" element={<RegistrarVenta />} />
                    <Route path="/ventas-sucursal" element={<VentasSucursal />} />
                    <Route path="/solicitar-transferencia" element={<SolicitarTransferencia />} />
                    <Route
                      path="/aprobar-transferencias"
                      element={
                        <SupervisorRoute>
                          <AprobarTransferencias />
                        </SupervisorRoute>
                      }
                    />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </main>
              </div>
            </div>
              </ProtectedRoute>
            }
          />
    </Routes>
  </BrowserRouter>
</AuthProvider>
);
}
export default App;