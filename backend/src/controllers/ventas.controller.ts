import { Request, Response, NextFunction } from 'express';
import { VentasService } from '../services/ventas.service';
import { validationResult } from 'express-validator';

export class VentasController {
  private ventasService: VentasService;

  constructor() {
    this.ventasService = new VentasService();
  }

  crear = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(errors.array());
      }

      const { sucursalId, productoId, cantidad, precioUnitario } = req.body;
      const venta = await this.ventasService.crear(
        sucursalId,
        productoId,
        cantidad,
        precioUnitario,
        req.userId
      );

      res.status(201).json({
        success: true,
        data: venta,
      });
    } catch (error) {
      next(error);
    }
  };

  getBySucursal = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sucursalId = parseInt(req.params.id);
      const ventas = await this.ventasService.getBySucursal(sucursalId);
      res.json({
        success: true,
        data: ventas,
      });
    } catch (error) {
      next(error);
    }
  };
}

