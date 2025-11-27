import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Usuario } from '../entities/Usuario';

export class UsuarioRepository {
  private repository: Repository<Usuario>;

  constructor() {
    this.repository = AppDataSource.getRepository(Usuario);
  }

  async findByUsername(username: string): Promise<Usuario | null> {
    return await this.repository.findOne({
      where: { username, activo: true },
      relations: ['rol', 'sucursal'],
    });
  }

  async findById(id: number): Promise<Usuario | null> {
    return await this.repository.findOne({
      where: { id, activo: true },
      relations: ['rol', 'sucursal'],
    });
  }
}

