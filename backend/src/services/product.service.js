const { getConnection, sql } = require('../db/mssql.pool');

async function getProducts() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT 
        p.id,
        p.codigo,
        p.nombre,
        p.descripcion,
        p.precio,
        p.categoria,
        p.unidad_medida,
        p.activo,
        p.created_at
      FROM productos p
      WHERE p.activo = 1
      ORDER BY p.nombre
    `);
    return result.recordset;
  } catch (error) {
    console.error('Error en getProducts:', error);
    throw error;
  }
}

async function getProductById(id) {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM productos WHERE id = @id AND activo = 1');
    
    if (result.recordset.length === 0) {
      return null;
    }
    return result.recordset[0];
  } catch (error) {
    console.error('Error en getProductById:', error);
    throw error;
  }
}

async function createProduct(productData) {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('codigo', sql.VarChar(50), productData.codigo)
      .input('nombre', sql.VarChar(200), productData.nombre)
      .input('descripcion', sql.Text, productData.descripcion || null)
      .input('precio', sql.Decimal(10, 2), productData.precio)
      .input('categoria', sql.VarChar(100), productData.categoria || null)
      .input('unidad_medida', sql.VarChar(20), productData.unidad_medida || 'UNIDAD')
      .query(`
        INSERT INTO productos (codigo, nombre, descripcion, precio, categoria, unidad_medida, activo, created_at)
        OUTPUT INSERTED.*
        VALUES (@codigo, @nombre, @descripcion, @precio, @categoria, @unidad_medida, 1, GETDATE())
      `);
    
    return result.recordset[0];
  } catch (error) {
    console.error('Error en createProduct:', error);
    throw error;
  }
}

async function updateProduct(id, productData) {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('codigo', sql.VarChar(50), productData.codigo)
      .input('nombre', sql.VarChar(200), productData.nombre)
      .input('descripcion', sql.Text, productData.descripcion || null)
      .input('precio', sql.Decimal(10, 2), productData.precio)
      .input('categoria', sql.VarChar(100), productData.categoria || null)
      .input('unidad_medida', sql.VarChar(20), productData.unidad_medida || 'UNIDAD')
      .query(`
        UPDATE productos
        SET codigo = @codigo,
            nombre = @nombre,
            descripcion = @descripcion,
            precio = @precio,
            categoria = @categoria,
            unidad_medida = @unidad_medida,
            updated_at = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id AND activo = 1
      `);
    
    if (result.recordset.length === 0) {
      return null;
    }
    return result.recordset[0];
  } catch (error) {
    console.error('Error en updateProduct:', error);
    throw error;
  }
}

async function deleteProduct(id) {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        UPDATE productos
        SET activo = 0, updated_at = GETDATE()
        WHERE id = @id
      `);
    
    return result.rowsAffected[0] > 0;
  } catch (error) {
    console.error('Error en deleteProduct:', error);
    throw error;
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};

