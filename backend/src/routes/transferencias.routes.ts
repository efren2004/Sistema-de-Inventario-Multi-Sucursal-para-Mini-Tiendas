import { Router } from 'express';
import { body } from 'express-validator';
import { TransferenciasController } from '../controllers/transferencias.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();
const transferenciasController = new TransferenciasController();

router.post(
  '/solicitar',
  authMiddleware,
  [
    body('sucursalOrigenId').isInt().withMessage('sucursalOrigenId debe ser un número'),
    body('sucursalDestinoId').isInt().withMessage('sucursalDestinoId debe ser un número'),
    body('productoId').isInt().withMessage('productoId debe ser un número'),
    body('cantidad').isFloat({ min: 0.01 }).withMessage('cantidad debe ser mayor a 0'),
  ],
  transferenciasController.solicitar
);

router.put(
  '/:id/aprobar',
  authMiddleware,
  roleMiddleware('SUPERVISOR', 'ADMIN'),
  transferenciasController.aprobar
);

export default router;

