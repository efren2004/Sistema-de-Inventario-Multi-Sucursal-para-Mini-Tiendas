import * as dotenv from 'dotenv';

dotenv.config();

export const env = {
  DB_HOST: process.env.DB_HOST || 'localhost\\SQLEXPRESS',
  DB_USER: process.env.DB_USER || '',
  DB_PASS: process.env.DB_PASS || '',
  DB_NAME: process.env.DB_NAME || 'InventarioMultisucursal',
  JWT_SECRET: process.env.JWT_SECRET || 'change-me',
  PORT: parseInt(process.env.PORT || '3000', 10),
};

// Debug: imprime las variables para verificar
console.log('📋 Variables de entorno cargadas:');
console.log('DB_HOST:', env.DB_HOST);
console.log('DB_NAME:', env.DB_NAME);
console.log('DB_USER:', env.DB_USER ? 'definido' : 'vacío');