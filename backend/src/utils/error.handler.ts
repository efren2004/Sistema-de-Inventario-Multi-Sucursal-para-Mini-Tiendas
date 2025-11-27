import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validator';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError | ValidationError[],
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Errores de express-validator
  if (Array.isArray(err)) {
    res.status(400).json({
      success: false,
      error: 'Error de validación',
      details: err.map((e: any) => ({
        field: e.param || e.path,
        message: e.msg,
      })),
    });
    return;
  }

  // Errores de SQL Server
  if (err.name === 'QueryFailedError' || err.name === 'EntityNotFoundError') {
    res.status(400).json({
      success: false,
      error: 'Error en la base de datos',
      message: err.message,
    });
    return;
  }

  // Errores personalizados
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  // Errores JWT
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      error: 'Token inválido o expirado',
    });
    return;
  }

  // Error genérico
  console.error('Error no manejado:', err);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};

