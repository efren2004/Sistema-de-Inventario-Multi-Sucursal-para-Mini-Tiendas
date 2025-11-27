import { Router } from 'express';
import { ProductosController } from '../controllers/productos.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const productosController = new ProductosController();

router.get('/', authMiddleware, productosController.getAll);

export default router;

