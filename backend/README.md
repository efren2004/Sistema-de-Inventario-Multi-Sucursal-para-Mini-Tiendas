# Backend - Sistema de Inventario Multi-Sucursal

Backend completo desarrollado con **Node.js + TypeScript + Express + TypeORM + SQL Server**.

## 🚀 Tecnologías

- **Node.js** + **TypeScript**
- **Express** - Framework web
- **TypeORM** - ORM para SQL Server
- **SQL Server 2025** - Base de datos
- **JWT** - Autenticación
- **Bcrypt** - Hash de contraseñas
- **SSE (Server-Sent Events)** - Actualizaciones en tiempo real
- **express-validator** - Validaciones

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── app.ts                 # Configuración de Express
│   ├── server.ts              # Punto de entrada
│   ├── config/
│   │   ├── database.ts        # Configuración TypeORM
│   │   └── env.ts             # Variables de entorno
│   ├── entities/              # Entidades TypeORM
│   ├── repositories/          # Capa de repositorios
│   ├── services/              # Lógica de negocio
│   ├── controllers/           # Controladores
│   ├── routes/                # Rutas de la API
│   ├── middleware/            # Middlewares (auth, roles)
│   ├── utils/                 # Utilidades (JWT, SSE, errors)
│   └── types/                 # Tipos TypeScript
├── package.json
├── tsconfig.json
└── .env                       # Variables de entorno (crear)
```

## 📦 Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   - Copia `.env.example` a `.env`
   - Ajusta las credenciales de SQL Server:
   ```
   DB_HOST=localhost
   DB_USER=sa
   DB_PASS=TuContraseña
   DB_NAME=InventarioMultisucursal
   JWT_SECRET=tu_secreto_jwt
   PORT=3000
   ```

3. **Asegúrate de que SQL Server esté corriendo y la base de datos exista**

## 🏃 Ejecutar

**Desarrollo (con recarga automática):**
```bash
npm run dev
```

**Producción:**
```bash
npm run build
npm start
```

## 📡 Endpoints

### Autenticación
- `POST /auth/login` - Iniciar sesión

### Productos
- `GET /productos` - Listar productos (requiere autenticación)

### Inventarios
- `GET /inventarios/:sucursal` - Obtener inventario por sucursal
- `PUT /inventarios/actualizar` - Actualizar inventario

### Ventas
- `POST /ventas` - Crear venta
- `GET /ventas/sucursal/:id` - Obtener ventas por sucursal

### Transferencias
- `POST /transferencias/solicitar` - Solicitar transferencia
- `PUT /transferencias/:id/aprobar` - Aprobar transferencia (SUPERVISOR/ADMIN)

### Eventos SSE
- `GET /events` - Endpoint para Server-Sent Events

## 🔐 Autenticación

Todas las rutas (excepto `/auth/login` y `/events`) requieren autenticación JWT.

**Header requerido:**
```
Authorization: Bearer <token>
```

## 🎯 Arquitectura

El proyecto sigue una **arquitectura por capas**:

1. **Routes** → Define endpoints y validaciones
2. **Controllers** → Maneja requests/responses
3. **Services** → Lógica de negocio
4. **Repositories** → Acceso a datos
5. **Entities** → Modelos de base de datos

## 🔔 SSE (Server-Sent Events)

El sistema emite eventos en tiempo real cuando:
- Se actualiza el inventario
- Se realiza una venta
- Se solicita/aprueba una transferencia

**Eventos disponibles:**
- `inventario-actualizado`
- `venta-realizada`
- `transferencia-solicitada`
- `transferencia-aprobada`

## 📝 Notas

- TypeORM crea automáticamente las tablas (`synchronize: true`)
- Las validaciones se realizan con `express-validator`
- Los errores se manejan de forma centralizada
- CORS está habilitado para todos los orígenes

