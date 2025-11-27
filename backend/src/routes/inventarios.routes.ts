import { Router } from 'express';
import { body } from 'express-validator';
import { InventariosController } from '../controllers/inventarios.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const inventariosController = new InventariosController();

router.get('/:sucursal', authMiddleware, inventariosController.getBySucursal);

router.put(
  '/actualizar',
  authMiddleware,
  [
    body('sucursalId').isInt().withMessage('sucursalId debe ser un número'),
    body('productoId').isInt().withMessage('productoId debe ser un número'),
    body('cantidad').isFloat({ min: 0 }).withMessage('cantidad debe ser un número positivo'),
  ],
  inventariosController.actualizar
);

export default router;

