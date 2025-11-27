import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Venta } from '../entities/Venta';

export class VentasRepository {
  private repository: Repository<Venta>;

  constructor() {
    this.repository = AppDataSource.getRepository(Venta);
  }

  async findBySucursal(sucursalId: number): Promise<Venta[]> {
    return await this.repository.find({
      where: { sucursalId },
      relations: ['producto', 'sucursal', 'usuario'],
      order: { fechaVenta: 'DESC' },
    });
  }

  async save(venta: Venta): Promise<Venta> {
    return await this.repository.save(venta);
  }
}

