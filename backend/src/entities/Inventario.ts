import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Check } from 'typeorm';
import { Sucursal } from './Sucursal';
import { Producto } from './Producto';

@Entity('inventarios')
@Check(`"cantidad" >= 0`)
export class Inventario {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Sucursal, { eager: true })
  @JoinColumn({ name: 'sucursalId' })
  sucursal!: Sucursal;

  @Column()
  sucursalId!: number;

  @ManyToOne(() => Producto, { eager: true })
  @JoinColumn({ name: 'productoId' })
  producto!: Producto;

  @Column()
  productoId!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cantidad!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cantidadMinima!: number;

  @Column({ type: 'bit', default: true })
  activo!: boolean;
}

