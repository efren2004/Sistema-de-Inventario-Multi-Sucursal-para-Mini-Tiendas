import { InventariosRepository } from '../repositories/inventarios.repository';
import { Inventario } from '../entities/Inventario';
import { AppDataSource } from '../config/database';
import { AppError } from '../utils/error.handler';
import { sendEvent } from '../utils/sse';

export class InventariosService {
  private inventariosRepository: InventariosRepository;

  constructor() {
    this.inventariosRepository = new InventariosRepository();
  }

  async getBySucursal(sucursalId: number) {
    return await this.inventariosRepository.findBySucursal(sucursalId);
  }

  async actualizar(
    sucursalId: number,
    productoId: number,
    cantidad: number
  ) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let inventario = await this.inventariosRepository.findBySucursalAndProducto(
        sucursalId,
        productoId
      );

      if (!inventario) {
        // Crear nuevo inventario si no existe
        inventario = new Inventario();
        inventario.sucursalId = sucursalId;
        inventario.productoId = productoId;
        inventario.cantidad = 0;
        inventario.cantidadMinima = 0;
        inventario.activo = true;
      }

      if (cantidad < 0) {
        throw new AppError('La cantidad no puede ser negativa', 400);
      }

      inventario.cantidad = cantidad;
      await this.inventariosRepository.save(inventario);

      await queryRunner.commitTransaction();

      // Emitir evento SSE
      sendEvent('inventario-actualizado', { sucursalId, productoId, cantidad });

      return inventario;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

