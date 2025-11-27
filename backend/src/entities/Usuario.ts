import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Rol } from './Rol';
import { Sucursal } from './Sucursal';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  username!: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash!: string;

  @Column({ type: 'varchar', length: 200 })
  nombre!: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  email?: string;

  @ManyToOne(() => Rol, { eager: true })
  @JoinColumn({ name: 'rolId' })
  rol!: Rol;

  @Column()
  rolId!: number;

  @ManyToOne(() => Sucursal, { nullable: true })
  @JoinColumn({ name: 'sucursalId' })
  sucursal?: Sucursal;

  @Column({ nullable: true })
  sucursalId?: number;

  @Column({ type: 'bit', default: true })
  activo!: boolean;
}

