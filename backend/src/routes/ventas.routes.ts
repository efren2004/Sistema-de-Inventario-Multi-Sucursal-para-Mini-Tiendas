import { Router } from 'express';
import { body } from 'express-validator';
import { VentasController } from '../controllers/ventas.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const ventasController = new VentasController();

router.post(
  '/',
  authMiddleware,
  [
    body('sucursalId').isInt().withMessage('sucursalId debe ser un número'),
    body('productoId').isInt().withMessage('productoId debe ser un número'),
    body('cantidad').isFloat({ min: 0.01 }).withMessage('cantidad debe ser mayor a 0'),
    body('precioUnitario').isFloat({ min: 0 }).withMessage('precioUnitario debe ser un número positivo'),
  ],
  ventasController.crear
);

router.get('/sucursal/:id', authMiddleware, ventasController.getBySucursal);

export default router;

