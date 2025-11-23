const productService = require('../services/product.service');

async function getProducts(req, res) {
  try {
    const products = await productService.getProducts();
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Error en getProducts controller:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener productos',
      message: error.message
    });
  }
}

async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(parseInt(id));
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error en getProductById controller:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener producto',
      message: error.message
    });
  }
}

async function createProduct(req, res) {
  try {
    const { codigo, nombre, descripcion, precio, categoria, unidad_medida } = req.body;
    
    // Validaciones básicas
    if (!codigo || !nombre || precio === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Campos requeridos: codigo, nombre, precio'
      });
    }
    
    const product = await productService.createProduct({
      codigo,
      nombre,
      descripcion,
      precio: parseFloat(precio),
      categoria,
      unidad_medida
    });
    
    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: product
    });
  } catch (error) {
    console.error('Error en createProduct controller:', error);
    
    // Manejo de errores de SQL (duplicados, etc.)
    if (error.number === 2627) { // Violación de clave única
      return res.status(400).json({
        success: false,
        error: 'El código del producto ya existe'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Error al crear producto',
      message: error.message
    });
  }
}

async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { codigo, nombre, descripcion, precio, categoria, unidad_medida } = req.body;
    
    const product = await productService.updateProduct(parseInt(id), {
      codigo,
      nombre,
      descripcion,
      precio: precio ? parseFloat(precio) : undefined,
      categoria,
      unidad_medida
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: product
    });
  } catch (error) {
    console.error('Error en updateProduct controller:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar producto',
      message: error.message
    });
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const deleted = await productService.deleteProduct(parseInt(id));
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error en deleteProduct controller:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar producto',
      message: error.message
    });
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};

