import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username es requerido'),
    body('password').notEmpty().withMessage('Password es requerido'),
  ],
  authController.login
);

export default router;

