import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Inventario } from './Inventario';
import { Venta } from './Venta';
import { Transferencia } from './Transferencia';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  codigo!: string;

  @Column({ type: 'varchar', length: 200 })
  nombre!: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio!: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  categoria?: string;

  @Column({ type: 'varchar', length: 20, default: 'UNIDAD' })
  unidadMedida!: string;

  @Column({ type: 'bit', default: true })
  activo!: boolean;

  @OneToMany(() => Inventario, (inventario) => inventario.producto)
  inventarios!: Inventario[];

  @OneToMany(() => Venta, (venta) => venta.producto)
  ventas!: Venta[];

  @OneToMany(() => Transferencia, (transferencia) => transferencia.producto)
  transferencias!: Transferencia[];
}

