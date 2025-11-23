require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./db/mssql.pool');

const PORT = process.env.PORT || 3000;

// Probar conexión a la base de datos al iniciar
testConnection()
  .then(() => {
    console.log('✅ Conexión a SQL Server establecida correctamente');
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📡 Endpoints disponibles:`);
      console.log(`   - GET  /api/products`);
      console.log(`   - POST /api/products`);
      console.log(`   - GET  /api/inventory`);
      console.log(`   - POST /api/auth/login`);
    });
  })
  .catch((error) => {
    console.error('❌ Error al conectar con SQL Server:', error.message);
    console.error('⚠️  Asegúrate de que SQL Server esté corriendo y las credenciales en .env sean correctas');
    process.exit(1);
  });

