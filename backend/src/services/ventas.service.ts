import { VentasRepository } from '../repositories/ventas.repository';
import { InventariosRepository } from '../repositories/inventarios.repository';
import { Venta } from '../entities/Venta';
import { AppDataSource } from '../config/database';
import { AppError } from '../utils/error.handler';
import { sendEvent } from '../utils/sse';

export class VentasService {
  private ventasRepository: VentasRepository;
  private inventariosRepository: InventariosRepository;

  constructor() {
    this.ventasRepository = new VentasRepository();
    this.inventariosRepository = new InventariosRepository();
  }

  async crear(
    sucursalId: number,
    productoId: number,
    cantidad: number,
    precioUnitario: number,
    usuarioId?: number
  ) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verificar inventario disponible
      const inventario = await this.inventariosRepository.findBySucursalAndProducto(
        sucursalId,
        productoId
      );

      if (!inventario) {
        throw new AppError('Producto no encontrado en el inventario', 404);
      }

      if (inventario.cantidad < cantidad) {
        throw new AppError('Stock insuficiente', 400);
      }

      // Crear venta
      const venta = new Venta();
      venta.sucursalId = sucursalId;
      venta.productoId = productoId;
      venta.cantidad = cantidad;
      venta.precioUnitario = precioUnitario;
      venta.total = cantidad * precioUnitario;
      venta.usuarioId = usuarioId;
      venta.fechaVenta = new Date();

      const ventaGuardada = await this.ventasRepository.save(venta);

      // Disminuir inventario
      inventario.cantidad -= cantidad;
      await this.inventariosRepository.save(inventario);

      await queryRunner.commitTransaction();

      // Emitir evento SSE
      sendEvent('inventario-actualizado', { sucursalId, productoId, cantidad: inventario.cantidad });
      sendEvent('venta-realizada', { ventaId: ventaGuardada.id, sucursalId });

      return ventaGuardada;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getBySucursal(sucursalId: number) {
    return await this.ventasRepository.findBySucursal(sucursalId);
  }
}

