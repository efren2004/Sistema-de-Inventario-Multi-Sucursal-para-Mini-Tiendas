import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { ProductosController } from '../controllers/productos.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const productosController = new ProductosController();

router.get('/', authMiddleware, productosController.getAll);

router.post(
  '/',
  authMiddleware,
  [
    body('codigo').notEmpty().withMessage('El código es requerido'),
    body('codigo').isLength({ min: 1, max: 50 }).withMessage('El código debe tener entre 1 y 50 caracteres'),
    body('nombre').notEmpty().withMessage('El nombre es requerido'),
    body('nombre').isLength({ min: 1, max: 200 }).withMessage('El nombre debe tener entre 1 y 200 caracteres'),
    body('precio').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
    body('unidadMedida').optional().isLength({ max: 20 }).withMessage('La unidad de medida no puede exceder 20 caracteres'),
    body('categoria').optional().isLength({ max: 100 }).withMessage('La categoría no puede exceder 100 caracteres'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
  productosController.create
);

export default router;

