import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/error.handler';

export const roleMiddleware = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.rol) {
      throw new AppError('No autorizado', 403);
    }

    if (!allowedRoles.includes(req.rol)) {
      throw new AppError('No tienes permisos para esta acción', 403);
    }

    next();
  };
};

