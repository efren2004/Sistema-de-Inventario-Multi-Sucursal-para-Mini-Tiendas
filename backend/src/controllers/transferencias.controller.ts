import { Request, Response, NextFunction } from 'express';
import { TransferenciasService } from '../services/transferencias.service';
import { validationResult } from 'express-validator';

export class TransferenciasController {
  private transferenciasService: TransferenciasService;

  constructor() {
    this.transferenciasService = new TransferenciasService();
  }

  solicitar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(errors.array());
      }

      const { sucursalOrigenId, sucursalDestinoId, productoId, cantidad } = req.body;
      const transferencia = await this.transferenciasService.solicitar(
        sucursalOrigenId,
        sucursalDestinoId,
        productoId,
        cantidad,
        req.userId
      );

      res.status(201).json({
        success: true,
        data: transferencia,
      });
    } catch (error) {
      next(error);
    }
  };

  aprobar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transferenciaId = parseInt(req.params.id);
      const transferencia = await this.transferenciasService.aprobar(transferenciaId);

      res.json({
        success: true,
        data: transferencia,
      });
    } catch (error) {
      next(error);
    }
  };
}

