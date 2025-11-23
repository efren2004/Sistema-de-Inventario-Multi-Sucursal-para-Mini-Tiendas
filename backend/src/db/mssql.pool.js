const sql = require('mssql');

// Para SQL Server Express con nombre de instancia, usar el formato: SERVIDOR\INSTANCIA
// Si DB_HOST contiene '\', se asume que incluye el nombre de instancia
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : null;

// Si el host contiene '\' (instancia nombrada como DESKTOP-TBR0B2F\SQLEXPRESS),
// usar el formato completo sin especificar puerto
// Si es solo el host, usar el puerto especificado
const config = {
  server: dbHost, // Puede ser "localhost" o "DESKTOP-TBR0B2F\SQLEXPRESS"
  // Solo especificar port si NO es una instancia nombrada
  ...(dbPort && !dbHost.includes('\\') ? { port: dbPort } : {}),
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

