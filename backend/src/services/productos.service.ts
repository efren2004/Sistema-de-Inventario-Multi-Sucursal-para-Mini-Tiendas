import { ProductosRepository } from '../repositories/productos.repository';
import { Producto } from '../entities/Producto';
import { AppError } from '../utils/error.handler';

export class ProductosService {
  private productosRepository: ProductosRepository;

  constructor() {
    this.productosRepository = new ProductosRepository();
  }

  async getAll() {
    return await this.productosRepository.findAll();
  }

  async create(data: {
    codigo: string;
    nombre: string;
    descripcion?: string;
    precio: number;
    categoria?: string;
    unidadMedida?: string;
  }): Promise<Producto> {
    // Verificar si el código ya existe
    const productoExistente = await this.productosRepository.findByCodigo(data.codigo);
    if (productoExistente) {
      throw new AppError('El código de producto ya existe', 400);
    }

    const producto = new Producto();
    producto.codigo = data.codigo;
    producto.nombre = data.nombre;
    producto.descripcion = data.descripcion;
    producto.precio = data.precio;
    producto.categoria = data.categoria;
    producto.unidadMedida = data.unidadMedida || 'UNIDAD';
    producto.activo = true;

    return await this.productosRepository.save(producto);
  }
}

