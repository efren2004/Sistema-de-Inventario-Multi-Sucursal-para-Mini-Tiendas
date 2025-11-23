const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller');
// const { authenticateToken } = require('../middleware/auth.middleware');

// Rutas de productos
router.get('/', productsController.getProducts);
router.get('/:id', productsController.getProductById);
router.post('/', productsController.createProduct);
router.put('/:id', productsController.updateProduct);
router.delete('/:id', productsController.deleteProduct);

// Si quieres proteger las rutas, descomenta la siguiente línea:
// router.use(authenticateToken);

module.exports = router;

