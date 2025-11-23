# Configuración de Variables de Entorno

Crea un archivo `.env` en la carpeta `backend/` con el siguiente contenido:

## Para SQL Server Express con instancia nombrada (como DESKTOP-TBR0B2F\SQLEXPRESS):

```
DB_HOST=DESKTOP-TBR0B2F\SQLEXPRESS
DB_PORT=
DB_USER=sa
DB_PASSWORD=TuContraseñaSQL
DB_NAME=InventarioDB
JWT_SECRET=tu_secreto_jwt_super_seguro_cambiar_en_produccion
PORT=3000
```

## Para SQL Server en localhost (puerto 1433):

```
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=TuContraseñaSQL
DB_NAME=InventarioDB
JWT_SECRET=tu_secreto_jwt_super_seguro_cambiar_en_produccion
PORT=3000
```

**Importante:** 
- Si usas una instancia nombrada (con `\`), deja `DB_PORT` vacío o no lo incluyas
- Si usas solo el host (localhost), especifica el puerto (generalmente 1433)
- Reemplaza `TuContraseñaSQL` con tu contraseña real de SQL Server
- Cambia `JWT_SECRET` por un secreto seguro en producción
- Ajusta `DB_HOST` según tu configuración de SQL Server

