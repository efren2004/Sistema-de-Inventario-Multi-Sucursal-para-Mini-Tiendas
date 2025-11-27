import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Inventario } from '../entities/Inventario';

export class InventariosRepository {
  private repository: Repository<Inventario>;

  constructor() {
    this.repository = AppDataSource.getRepository(Inventario);
  }

  async findBySucursal(sucursalId: number): Promise<Inventario[]> {
    return await this.repository.find({
      where: { sucursalId, activo: true },
      relations: ['producto', 'sucursal'],
      order: { producto: { nombre: 'ASC' } },
    });
  }

  async findBySucursalAndProducto(
    sucursalId: number,
    productoId: number
  ): Promise<Inventario | null> {
    return await this.repository.findOne({
      where: { sucursalId, productoId, activo: true },
      relations: ['producto', 'sucursal'],
    });
  }

  async save(inventario: Inventario): Promise<Inventario> {
    return await this.repository.save(inventario);
  }

  async updateCantidad(
    sucursalId: number,
    productoId: number,
    cantidad: number
  ): Promise<void> {
    await this.repository.update(
      { sucursalId, productoId },
      { cantidad }
    );
  }
}

