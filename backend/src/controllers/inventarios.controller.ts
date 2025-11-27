import { Request, Response, NextFunction } from 'express';
import { InventariosService } from '../services/inventarios.service';
import { validationResult } from 'express-validator';

export class InventariosController {
  private inventariosService: InventariosService;

  constructor() {
    this.inventariosService = new InventariosService();
  }

  getBySucursal = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sucursalId = parseInt(req.params.sucursal);
      const inventarios = await this.inventariosService.getBySucursal(sucursalId);
      res.json({
        success: true,
        data: inventarios,
      });
    } catch (error) {
      next(error);
    }
  };

  actualizar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(errors.array());
      }

      const { sucursalId, productoId, cantidad } = req.body;
      const inventario = await this.inventariosService.actualizar(
        sucursalId,
        productoId,
        cantidad
      );

      res.json({
        success: true,
        data: inventario,
      });
    } catch (error) {
      next(error);
    }
  };
}

