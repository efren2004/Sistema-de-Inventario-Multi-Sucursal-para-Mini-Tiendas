# Solución: Error de Conexión a SQL Server

## Error que estás viendo:
```
Error al conectar con SQL Server: Failed to connect to localhost:1433 - Could not connect (sequence)
```

## Causa del Problema:
El código está intentando conectarse a `localhost:1433`, pero tu servidor SQL Server Express está en `DESKTOP-TBR0B2F\SQLEXPRESS`, que es una **instancia nombrada** y puede usar un puerto dinámico.

## Solución:

### Paso 1: Verificar que SQL Server esté corriendo

1. Abre **SQL Server Configuration Manager** (búscalo en el menú de inicio)
2. Ve a **SQL Server Services**
3. Verifica que **SQL Server (SQLEXPRESS)** esté en estado **Running**

Si no está corriendo:
- Click derecho → **Start**

### Paso 2: Configurar el archivo `.env` correctamente

Crea o edita el archivo `backend/.env` con este contenido:

```
DB_HOST=DESKTOP-TBR0B2F\SQLEXPRESS
DB_PORT=
DB_USER=sa
DB_PASSWORD=TuContraseñaSQL
DB_NAME=InventarioDB
JWT_SECRET=mi_secreto_jwt_super_seguro_12345
PORT=3000
```

**IMPORTANTE:**
- `DB_HOST` debe ser exactamente `DESKTOP-TBR0B2F\SQLEXPRESS` (con la barra invertida)
- `DB_PORT` debe estar vacío o no incluirse (las instancias nombradas usan puerto dinámico)
- `DB_USER` debe ser un usuario SQL (no Windows Authentication)
- `DB_PASSWORD` debe ser la contraseña del usuario SQL

### Paso 3: Habilitar SQL Server Authentication

Si aún no tienes un usuario SQL configurado:

1. En SSMS, conecta a tu servidor
2. Click derecho en el servidor → **Properties**
3. Ve a la pestaña **Security**
4. Selecciona **"SQL Server and Windows Authentication mode"**
5. Click **OK**
6. **Reinicia SQL Server** (click derecho en el servidor → **Restart**)

### Paso 4: Crear un usuario SQL

1. En SSMS, expande **Security** → **Logins**
2. Click derecho → **New Login**
3. Login name: `sa` (o inventario_user)
4. Selecciona **"SQL Server authentication"**
5. Password: (elige una contraseña, ejemplo: `Admin123`)
6. Desmarca **"Enforce password policy"** (solo para desarrollo)
7. Click **OK**

### Paso 5: Actualizar el .env con la contraseña

Edita `backend/.env` y reemplaza `TuContraseñaSQL` con la contraseña que creaste.

### Paso 6: Verificar que la base de datos existe

1. En SSMS, expande **Databases**
2. Verifica que exista **InventarioDB**
3. Si no existe, ejecuta el script `backend/sql/001_init.sql`

### Paso 7: Reiniciar el servidor Node.js

1. Detén el servidor (Ctrl+C)
2. Vuelve a ejecutar:
   ```bash
   npm run dev
   ```

## Verificación Adicional:

Si aún no funciona, verifica el puerto de SQL Server:

1. En **SQL Server Configuration Manager**
2. Ve a **SQL Server Network Configuration** → **Protocols for SQLEXPRESS**
3. Click derecho en **TCP/IP** → **Properties**
4. Ve a la pestaña **IP Addresses**
5. Busca **IPAll** y verifica el **TCP Dynamic Ports** (puede ser algo como 49152)
6. O verifica **TCP Port** si está configurado estáticamente

Si necesitas usar un puerto específico, actualiza el `.env`:
```
DB_HOST=DESKTOP-TBR0B2F
DB_PORT=49152
DB_USER=sa
DB_PASSWORD=TuContraseñaSQL
DB_NAME=InventarioDB
JWT_SECRET=mi_secreto_jwt_super_seguro_12345
PORT=3000
```

## Resumen de Configuración Correcta:

Para tu caso específico (`DESKTOP-TBR0B2F\SQLEXPRESS`):

**Archivo `backend/.env`:**
```
DB_HOST=DESKTOP-TBR0B2F\SQLEXPRESS
DB_USER=sa
DB_PASSWORD=Admin123
DB_NAME=InventarioDB
JWT_SECRET=mi_secreto_jwt_super_seguro_12345
PORT=3000
```

**Nota:** No incluyas `DB_PORT` cuando uses una instancia nombrada con `\`.

