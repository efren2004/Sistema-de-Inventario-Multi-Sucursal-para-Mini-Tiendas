import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Transferencia } from '../entities/Transferencia';

export class TransferenciasRepository {
  private repository: Repository<Transferencia>;

  constructor() {
    this.repository = AppDataSource.getRepository(Transferencia);
  }

  async findById(id: number): Promise<Transferencia | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['sucursalOrigen', 'sucursalDestino', 'producto', 'usuario'],
    });
  }

  async save(transferencia: Transferencia): Promise<Transferencia> {
    return await this.repository.save(transferencia);
  }

  async updateEstado(id: number, estado: string, fechaAprobacion?: Date): Promise<void> {
    await this.repository.update(
      { id },
      { estado, fechaAprobacion: fechaAprobacion || new Date() }
    );
  }
}

