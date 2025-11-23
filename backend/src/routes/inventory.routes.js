const express = require('express');
const router = express.Router();
// const { authenticateToken } = require('../middleware/auth.middleware');

// Ruta básica para inventario (implementar después)
router.get('/', async (req, res) => {
  try {
    const { getPool, sql } = require('../db/mssql.pool');
    const pool = await getPool();
    
    const result = await pool.request().query(`
      SELECT 
        i.id,
        i.sucursal_id,
        s.nombre as sucursal_nombre,
        i.producto_id,
        p.nombre as producto_nombre,
        p.codigo as producto_codigo,
        i.cantidad,
        i.cantidad_minima,
        i.updated_at
      FROM inventarios i
      INNER JOIN sucursales s ON i.sucursal_id = s.id
      INNER JOIN productos p ON i.producto_id = p.id
      WHERE i.activo = 1
      ORDER BY s.nombre, p.nombre
    `);
    
    res.json({
      success: true,
      data: result.recordset,
      count: result.recordset.length
    });
  } catch (error) {
    console.error('Error en getInventory:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener inventario',
      message: error.message
    });
  }
});

module.exports = router;

