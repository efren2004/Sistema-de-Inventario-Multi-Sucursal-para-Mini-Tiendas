import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Sucursal } from './Sucursal';
import { Producto } from './Producto';
import { Usuario } from './Usuario';

@Entity('ventas')
export class Venta {
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

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'usuarioId' })
  usuario?: Usuario;

  @Column({ nullable: true })
  usuarioId?: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  numeroFactura?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cantidad!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precioUnitario!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total!: number;

  @Column({ type: 'datetime', default: () => 'GETDATE()' })
  fechaVenta!: Date;
}

