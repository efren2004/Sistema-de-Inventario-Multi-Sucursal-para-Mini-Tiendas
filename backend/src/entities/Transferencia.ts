import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Sucursal } from './Sucursal';
import { Producto } from './Producto';
import { Usuario } from './Usuario';

@Entity('transferencias')
export class Transferencia {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Sucursal, { eager: true })
  @JoinColumn({ name: 'sucursalOrigenId' })
  sucursalOrigen!: Sucursal;

  @Column()
  sucursalOrigenId!: number;

  @ManyToOne(() => Sucursal, { eager: true })
  @JoinColumn({ name: 'sucursalDestinoId' })
  sucursalDestino!: Sucursal;

  @Column()
  sucursalDestinoId!: number;

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

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cantidad!: number;

  @Column({ type: 'varchar', length: 50, default: 'PENDIENTE' })
  estado!: string; // PENDIENTE, APROBADA, RECHAZADA

  @Column({ type: 'datetime', default: () => 'GETDATE()' })
  fechaSolicitud!: Date;

  @Column({ type: 'datetime', nullable: true })
  fechaAprobacion?: Date;

  @Column({ type: 'text', nullable: true })
  observaciones?: string;
}

