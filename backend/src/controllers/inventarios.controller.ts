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
      
      // Transformar datos para el frontend
      const inventariosFormateados = inventarios.map((inv) => ({
        id: inv.id,
        producto_id: inv.productoId,
        nombre_producto: inv.producto?.nombre || 'Sin nombre',
        stock_actual: parseFloat(inv.cantidad.toString()),
        stock_minimo: parseFloat(inv.cantidadMinima.toString()),
        sucursal_id: inv.sucursalId,
        activo: inv.activo,
      }));

      res.json({
        success: true,
        data: inventariosFormateados,
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

