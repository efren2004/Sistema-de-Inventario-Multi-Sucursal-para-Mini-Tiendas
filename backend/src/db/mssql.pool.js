const sql = require('mssql');

const config = {
    server: process.env.DB_HOST || 'localhost\\SQLEXPRESS',
    database: process.env.DB_NAME || 'InventarioDB',
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        trustedConnection: true
    }
};

// Pool de conexiones
let pool = null;

async function getConnection() {
    try {
        if (!pool) {
            pool = await sql.connect(config);
            console.log('✅ Conectado a SQL Server');
        }
        return pool;
    } catch (err) {
        console.error('❌ Error conectando a la base de datos:', err);
        throw err;
    }
}

async function testConnection() {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT 1 as number');
        console.log('✅ Test de conexión exitoso:', result.recordset);
        return true;
    } catch (err) {
        console.error('❌ Error en test de conexión:', err);
        return false;
    }
}

// IMPORTANTE: Exporta las funciones
module.exports = {
    getConnection,
    testConnection,
    sql
};