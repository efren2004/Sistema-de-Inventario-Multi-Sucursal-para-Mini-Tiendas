import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Producto } from '../entities/Producto';

export class ProductosRepository {
  private repository: Repository<Producto>;

  constructor() {
    this.repository = AppDataSource.getRepository(Producto);
  }

  async findAll(): Promise<Producto[]> {
    return await this.repository.find({
      where: { activo: true },
      order: { nombre: 'ASC' },
    });
  }

  async findById(id: number): Promise<Producto | null> {
    return await this.repository.findOne({
      where: { id, activo: true },
    });
  }

  async findByCodigo(codigo: string): Promise<Producto | null> {
    return await this.repository.findOne({
      where: { codigo, activo: true },
    });
  }
}

