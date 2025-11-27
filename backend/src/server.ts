import 'reflect-metadata';
import { createApp } from './app';
import { initializeDatabase } from './config/database';
import { env } from './config/env';

const startServer = async () => {
  try {
    // Inicializar base de datos
    await initializeDatabase();

    // Crear aplicación Express
    const app = createApp();

    // Iniciar servidor
    app.listen(env.PORT, () => {
      console.log('✅ Conexión a SQL Server establecida correctamente');
      console.log(`🚀 Servidor corriendo en http://localhost:${env.PORT}`);
      console.log(`📡 Endpoints disponibles:`);
      console.log(`   - POST /auth/login`);
      console.log(`   - GET  /productos`);
      console.log(`   - GET  /inventarios/:sucursal`);
      console.log(`   - PUT  /inventarios/actualizar`);
      console.log(`   - POST /ventas`);
      console.log(`   - GET  /ventas/sucursal/:id`);
      console.log(`   - POST /transferencias/solicitar`);
      console.log(`   - PUT  /transferencias/:id/aprobar`);
      console.log(`   - GET  /events (SSE)`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

