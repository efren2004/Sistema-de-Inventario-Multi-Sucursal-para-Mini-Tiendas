const express = require('express');
const router = express.Router();
// const { authenticateToken } = require('../middleware/auth.middleware');

// Ruta básica para transferencias (implementar después)
router.get('/', async (req, res) => {
  try {
    const { getPool, sql } = require('../db/mssql.pool');
    const pool = await getPool();
    
    const result = await pool.request().query(`
      SELECT 
        t.id,
        t.sucursal_origen_id,
        so.nombre as sucursal_origen,
        t.sucursal_destino_id,
        sd.nombre as sucursal_destino,
        t.estado,
        t.fecha_transferencia,
        t.created_at
      FROM transferencias t
      INNER JOIN sucursales so ON t.sucursal_origen_id = so.id
      INNER JOIN sucursales sd ON t.sucursal_destino_id = sd.id
      ORDER BY t.created_at DESC
    `);
    
    res.json({
      success: true,
      data: result.recordset,
      count: result.recordset.length
    });
  } catch (error) {
    console.error('Error en getTransfers:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener transferencias',
      message: error.message
    });
  }
});

module.exports = router;

