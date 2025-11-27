import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      rol?: string;
      sucursalId?: number;
    }
  }
}

export {};

