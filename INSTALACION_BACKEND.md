# 🚀 Guía de Instalación - Backend TypeScript

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- SQL Server 2019 o superior
- npm o yarn

## 🔧 Pasos de Instalación

### 1. Instalar Dependencias

```bash
cd backend
npm install
```

Esto instalará todas las dependencias necesarias, incluyendo:
- TypeScript y tipos
- TypeORM
- Express
- JWT, Bcrypt
- Y todas las demás dependencias

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la carpeta `backend/` con este contenido:

```env
DB_HOST=localhost
DB_USER=sa
DB_PASS=TuContraseñaSQL
DB_NAME=InventarioMultisucursal
JWT_SECRET=tu_secreto_jwt_super_seguro_12345
PORT=3000
```

**Importante:**
- Reemplaza `TuContraseñaSQL` con tu contraseña real de SQL Server
- Ajusta `DB_HOST` si tu SQL Server está en otro servidor
- Si usas una instancia nombrada (ej: `DESKTOP-TBR0B2F\SQLEXPRESS`), usa ese formato en `DB_HOST`

### 3. Crear Base de Datos

1. Abre SQL Server Management Studio (SSMS)
2. Conéctate a tu servidor SQL Server
3. Ejecuta:
   ```sql
   CREATE DATABASE InventarioMultisucursal;
   ```

**Nota:** TypeORM creará automáticamente todas las tablas cuando inicies el servidor (`synchronize: true`).

### 4. Ejecutar el Servidor

**Modo desarrollo (con recarga automática):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm run build
npm start
```

### 5. Verificar que Funciona

Deberías ver en la consola:
```
✅ Base de datos conectada correctamente
✅ Conexión a SQL Server establecida correctamente
🚀 Servidor corriendo en http://localhost:3000
📡 Endpoints disponibles:
   - POST /auth/login
   - GET  /productos
   ...
```

Prueba el endpoint de health:
```bash
curl http://localhost:3000/health
```

## 🎯 Endpoints Disponibles

### Autenticación
- `POST /auth/login`
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```

### Productos
- `GET /productos` (requiere token JWT)

### Inventarios
- `GET /inventarios/:sucursal` (requiere token JWT)
- `PUT /inventarios/actualizar` (requiere token JWT)

### Ventas
- `POST /ventas` (requiere token JWT)
- `GET /ventas/sucursal/:id` (requiere token JWT)

### Transferencias
- `POST /transferencias/solicitar` (requiere token JWT)
- `PUT /transferencias/:id/aprobar` (requiere token JWT + rol SUPERVISOR/ADMIN)

### Eventos SSE
- `GET /events` - Server-Sent Events para actualizaciones en tiempo real

## 🔐 Uso de Autenticación

Después de hacer login, recibirás un token JWT:

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "rol": "EMPLEADO",
    "sucursalId": 1
  }
}
```

Usa este token en las peticiones siguientes:

```
Authorization: Bearer <token>
```

## 🐛 Solución de Problemas

### Error: "Cannot find module 'typeorm'"
```bash
npm install
```

### Error de conexión a SQL Server
- Verifica que SQL Server esté corriendo
- Confirma las credenciales en `.env`
- Asegúrate de que la base de datos exista

### Error: "synchronize: true" no crea tablas
- Verifica que tengas permisos en la base de datos
- Revisa los logs de TypeORM
- Asegúrate de que las entidades estén correctamente importadas

### Errores de TypeScript
```bash
npm run build
```
Esto mostrará todos los errores de compilación.

## 📝 Notas Importantes

1. **TypeORM Synchronize:** En desarrollo, `synchronize: true` crea/actualiza tablas automáticamente. En producción, usa migraciones.

2. **SSE (Server-Sent Events):** El endpoint `/events` mantiene conexiones abiertas para enviar actualizaciones en tiempo real.

3. **Validaciones:** Todas las rutas tienen validaciones con `express-validator`.

4. **Manejo de Errores:** Todos los errores se manejan de forma centralizada y retornan JSON uniforme.

## ✅ Verificación Final

Si todo está correcto, deberías poder:
1. ✅ Conectarte a SQL Server
2. ✅ Ver las tablas creadas automáticamente
3. ✅ Hacer login y recibir un token
4. ✅ Acceder a los endpoints protegidos con el token
5. ✅ Conectarte al endpoint SSE `/events`

