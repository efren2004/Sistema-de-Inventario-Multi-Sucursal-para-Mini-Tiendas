import { DataSource } from 'typeorm';
import { env } from './env';
import { Usuario } from '../entities/Usuario';
import { Rol } from '../entities/Rol';
import { Sucursal } from '../entities/Sucursal';
import { Producto } from '../entities/Producto';
import { Inventario } from '../entities/Inventario';
import { Venta } from '../entities/Venta';
import { Transferencia } from '../entities/Transferencia';

console.log('📋 Variables de entorno cargadas:');
console.log('DB_HOST:', env.DB_HOST);
console.log('DB_NAME:', env.DB_NAME);
console.log('DB_USER:', env.DB_USER ? 'definido' : 'vacío');

const useWindowsAuth = !env.DB_USER || env.DB_USER.trim() === '';

console.log('🔧 Configuración de conexión:');
console.log(`   - Servidor: ${env.DB_HOST}`);
console.log(`   - Usuario: ${useWindowsAuth ? 'Windows Auth' : env.DB_USER}`);
console.log(`   - Base de datos: ${env.DB_NAME}`);
console.log(`   - Tipo Auth: ${useWindowsAuth ? 'Windows' : 'SQL Server'}`);

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: env.DB_HOST,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  synchronize: true,
  logging: true,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  entities: [
    Usuario,
    Rol,
    Sucursal,
    Producto,
    Inventario,
    Venta,
    Transferencia,
  ],
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    console.log('🔄 Intentando conectar a la base de datos...');
    await AppDataSource.initialize();
    console.log('✅ Base de datos conectada correctamente');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    throw error;
  }
};