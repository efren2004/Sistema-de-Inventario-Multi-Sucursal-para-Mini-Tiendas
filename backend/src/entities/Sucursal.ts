import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Usuario } from './Usuario';
import { Inventario } from './Inventario';
import { Venta } from './Venta';
import { Transferencia } from './Transferencia';

@Entity('sucursales')
export class Sucursal {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  codigo!: string;

  @Column({ type: 'varchar', length: 200 })
  nombre!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  direccion?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  telefono?: string;

  @Column({ type: 'bit', default: true })
  activo!: boolean;

  @OneToMany(() => Usuario, (usuario) => usuario.sucursal)
  usuarios!: Usuario[];

  @OneToMany(() => Inventario, (inventario) => inventario.sucursal)
  inventarios!: Inventario[];

  @OneToMany(() => Venta, (venta) => venta.sucursal)
  ventas!: Venta[];

  @OneToMany(() => Transferencia, (transferencia) => transferencia.sucursalOrigen)
  transferenciasOrigen!: Transferencia[];

  @OneToMany(() => Transferencia, (transferencia) => transferencia.sucursalDestino)
  transferenciasDestino!: Transferencia[];
}

