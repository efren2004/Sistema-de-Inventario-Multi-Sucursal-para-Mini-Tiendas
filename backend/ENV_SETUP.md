# Configuración de Variables de Entorno

Crea un archivo `.env` en la carpeta `backend/` con el siguiente contenido:

```
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=YourPassword123
DB_NAME=InventarioDB
JWT_SECRET=tu_secreto_jwt_super_seguro_cambiar_en_produccion
PORT=3000
```

**Importante:** 
- Reemplaza `YourPassword123` con tu contraseña real de SQL Server
- Cambia `JWT_SECRET` por un secreto seguro en producción
- Ajusta `DB_HOST`, `DB_PORT` y `DB_USER` según tu configuración de SQL Server

