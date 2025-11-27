import { TransferenciasRepository } from '../repositories/transferencias.repository';
import { InventariosRepository } from '../repositories/inventarios.repository';
import { Inventario } from '../entities/Inventario';
import { Transferencia } from '../entities/Transferencia';
import { AppDataSource } from '../config/database';
import { AppError } from '../utils/error.handler';
import { sendEvent } from '../utils/sse';

export class TransferenciasService {
  private transferenciasRepository: TransferenciasRepository;
  private inventariosRepository: InventariosRepository;

  constructor() {
    this.transferenciasRepository = new TransferenciasRepository();
    this.inventariosRepository = new InventariosRepository();
  }

  async solicitar(
    sucursalOrigenId: number,
    sucursalDestinoId: number,
    productoId: number,
    cantidad: number,
    usuarioId?: number
  ) {
    // Verificar inventario en origen
    const inventarioOrigen = await this.inventariosRepository.findBySucursalAndProducto(
      sucursalOrigenId,
      productoId
    );

    if (!inventarioOrigen) {
      throw new AppError('Producto no encontrado en la sucursal origen', 404);
    }

    if (inventarioOrigen.cantidad < cantidad) {
      throw new AppError('Stock insuficiente en la sucursal origen', 400);
    }

    // Crear transferencia
    const transferencia = new Transferencia();
    transferencia.sucursalOrigenId = sucursalOrigenId;
    transferencia.sucursalDestinoId = sucursalDestinoId;
    transferencia.productoId = productoId;
    transferencia.cantidad = cantidad;
    transferencia.estado = 'PENDIENTE';
    transferencia.usuarioId = usuarioId;
    transferencia.fechaSolicitud = new Date();

    const transferenciaGuardada = await this.transferenciasRepository.save(transferencia);

    // Emitir evento SSE
    sendEvent('transferencia-solicitada', {
      transferenciaId: transferenciaGuardada.id,
      sucursalOrigenId,
      sucursalDestinoId,
    });

    return transferenciaGuardada;
  }

  async aprobar(transferenciaId: number) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const transferencia = await this.transferenciasRepository.findById(transferenciaId);

      if (!transferencia) {
        throw new AppError('Transferencia no encontrada', 404);
      }

      if (transferencia.estado !== 'PENDIENTE') {
        throw new AppError('La transferencia ya fue procesada', 400);
      }

      // Verificar inventario en origen
      const inventarioOrigen = await this.inventariosRepository.findBySucursalAndProducto(
        transferencia.sucursalOrigenId,
        transferencia.productoId
      );

      if (!inventarioOrigen || inventarioOrigen.cantidad < transferencia.cantidad) {
        throw new AppError('Stock insuficiente en la sucursal origen', 400);
      }

      // Disminuir inventario origen
      inventarioOrigen.cantidad -= transferencia.cantidad;
      await this.inventariosRepository.save(inventarioOrigen);

      // Aumentar inventario destino
      let inventarioDestino = await this.inventariosRepository.findBySucursalAndProducto(
        transferencia.sucursalDestinoId,
        transferencia.productoId
      );

      if (!inventarioDestino) {
        // Crear inventario en destino si no existe
        inventarioDestino = new Inventario();
        inventarioDestino.sucursalId = transferencia.sucursalDestinoId;
        inventarioDestino.productoId = transferencia.productoId;
        inventarioDestino.cantidad = 0;
        inventarioDestino.cantidadMinima = 0;
        inventarioDestino.activo = true;
      }

      inventarioDestino.cantidad += transferencia.cantidad;
      await this.inventariosRepository.save(inventarioDestino);

      // Actualizar estado de transferencia
      await this.transferenciasRepository.updateEstado(
        transferenciaId,
        'APROBADA',
        new Date()
      );

      await queryRunner.commitTransaction();

      // Emitir eventos SSE
      sendEvent('transferencia-aprobada', {
        transferenciaId,
        sucursalOrigenId: transferencia.sucursalOrigenId,
        sucursalDestinoId: transferencia.sucursalDestinoId,
      });
      sendEvent('inventario-actualizado', {
        sucursalId: transferencia.sucursalOrigenId,
        productoId: transferencia.productoId,
        cantidad: inventarioOrigen.cantidad,
      });
      sendEvent('inventario-actualizado', {
        sucursalId: transferencia.sucursalDestinoId,
        productoId: transferencia.productoId,
        cantidad: inventarioDestino.cantidad,
      });

      return await this.transferenciasRepository.findById(transferenciaId);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

