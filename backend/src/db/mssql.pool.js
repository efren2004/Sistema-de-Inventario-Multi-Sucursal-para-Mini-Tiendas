const sql = require('mssql');

const config = {
  server: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 1433,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  options: {
    encrypt: false, // Usar true si tienes SSL habilitado
    trustServerCertificate: true, // Para desarrollo local
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let pool = null;

async function getPool() {
  if (!pool) {
    try {
      pool = await sql.connect(config);
      console.log('📦 Pool de conexiones creado');
      return pool;
    } catch (error) {
      console.error('Error al crear pool de conexiones:', error);
      throw error;
    }
  }
  return pool;
}

async function testConnection() {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT 1 as test');
    return result;
  } catch (error) {
    throw error;
  }
}

// Cerrar pool al terminar la aplicación
process.on('SIGINT', async () => {
  if (pool) {
    await pool.close();
    console.log('🔒 Pool de conexiones cerrado');
  }
  process.exit(0);
});

module.exports = {
  getPool,
  testConnection,
  sql
};

