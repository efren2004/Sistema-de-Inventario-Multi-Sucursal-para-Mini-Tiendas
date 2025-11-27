import { ProductosRepository } from '../repositories/productos.repository';

export class ProductosService {
  private productosRepository: ProductosRepository;

  constructor() {
    this.productosRepository = new ProductosRepository();
  }

  async getAll() {
    return await this.productosRepository.findAll();
  }
}

