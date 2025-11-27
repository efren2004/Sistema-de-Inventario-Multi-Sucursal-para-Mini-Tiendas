import { Request, Response, NextFunction } from 'express';
import { ProductosService } from '../services/productos.service';

export class ProductosController {
  private productosService: ProductosService;

  constructor() {
    this.productosService = new ProductosService();
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productos = await this.productosService.getAll();
      res.json({
        success: true,
        data: productos,
      });
    } catch (error) {
      next(error);
    }
  };
}

