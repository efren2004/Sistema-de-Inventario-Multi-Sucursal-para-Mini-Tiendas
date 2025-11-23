# Guía de Instalación - Sistema de Inventario Multi-Sucursal

## Requisitos Previos

- Node.js (v16 o superior)
- SQL Server 2019 o superior (SSMS 20)
- npm o yarn

## Pasos de Instalación

### 1. Configurar Base de Datos

1. Abre SQL Server Management Studio (SSMS)
2. Conéctate a tu instancia de SQL Server
3. Abre el archivo `backend/sql/001_init.sql`
4. **IMPORTANTE:** Antes de ejecutar el script, genera el hash de contraseña para el usuario admin:
   ```bash
   cd backend
   npm install
   node src/utils/passwordHelper.js admin123
   ```
5. Copia el hash generado y reemplázalo en el script SQL (línea del INSERT de usuarios)
6. Ejecuta el script completo en SSMS para crear la base de datos y las tablas

### 2. Configurar Backend

1. Navega a la carpeta backend:
   ```bash
   cd backend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea el archivo `.env` basándote en `ENV_SETUP.md`:
   ```bash
   # Copia el contenido de ENV_SETUP.md y crea .env
   # Ajusta las credenciales de SQL Server según tu configuración
   ```

4. Verifica que el archivo `.env` tenga las siguientes variables:
   ```
   DB_HOST=localhost
   DB_PORT=1433
   DB_USER=sa
   DB_PASSWORD=TuPasswordReal
   DB_NAME=InventarioDB
   JWT_SECRET=tu_secreto_jwt_super_seguro
   PORT=3000
   ```

### 3. Iniciar el Servidor

Para desarrollo (con recarga automática):
```bash
npm run dev
```

Para producción:
```bash
npm start
```

El servidor debería iniciar en `http://localhost:3000`

### 4. Probar los Endpoints

Puedes probar los endpoints con:

- **GET** `http://localhost:3000/api/health` - Verificar que el servidor funciona
- **GET** `http://localhost:3000/api/products` - Obtener lista de productos
- **POST** `http://localhost:3000/api/products` - Crear un producto (requiere body JSON)

### 5. Usar el Frontend

1. Abre `frontend/index.html` en tu navegador
2. O usa un servidor local simple:
   ```bash
   # Desde la carpeta frontend
   python -m http.server 8080
   # O con Node.js
   npx http-server frontend -p 8080
   ```
3. Navega a `http://localhost:8080`

## Estructura del Proyecto

```
.
├── backend/
│   ├── src/
│   │   ├── index.js          # Punto de entrada
│   │   ├── app.js            # Configuración de Express
│   │   ├── db/
│   │   │   └── mssql.pool.js # Pool de conexiones SQL Server
│   │   ├── routes/           # Rutas de la API
│   │   ├── controllers/      # Controladores
│   │   ├── services/         # Lógica de negocio
│   │   ├── middleware/       # Middlewares (auth, etc.)
│   │   └── utils/            # Utilidades
│   ├── sql/
│   │   └── 001_init.sql      # Script de inicialización DB
│   ├── package.json
│   └── .env                  # Variables de entorno (crear)
├── frontend/
│   ├── index.html            # Página de login
│   ├── productos.html        # Gestión de productos
│   ├── dashboard.html        # Dashboard principal
│   └── assets/
│       └── scripts/
│           ├── api.js        # Helper para llamadas API
│           └── app.js        # Funciones auxiliares
└── README.md
```

## Credenciales por Defecto

- **Usuario:** admin
- **Contraseña:** admin123

**Nota:** Asegúrate de cambiar estas credenciales en producción.

## Solución de Problemas

### Error de conexión a SQL Server

- Verifica que SQL Server esté corriendo
- Confirma que las credenciales en `.env` sean correctas
- Asegúrate de que el puerto 1433 esté abierto
- Verifica que la autenticación SQL esté habilitada

### Error al ejecutar el script SQL

- Asegúrate de estar conectado a la instancia correcta
- Verifica que tengas permisos para crear bases de datos
- Si la base ya existe, comenta las líneas de CREATE DATABASE

### El servidor no inicia

- Verifica que el puerto 3000 no esté en uso
- Revisa los logs de error en la consola
- Confirma que todas las dependencias estén instaladas (`npm install`)

## Próximos Pasos

- Implementar autenticación JWT en todas las rutas protegidas
- Agregar validaciones más robustas
- Implementar gestión completa de inventario
- Agregar funcionalidad de transferencias
- Implementar sistema de alertas

