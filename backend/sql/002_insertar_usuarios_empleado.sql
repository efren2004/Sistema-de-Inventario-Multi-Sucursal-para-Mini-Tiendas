-- Script para insertar usuarios con rol EMPLEADO
-- Ejecuta este script en SQL Server Management Studio (SSMS)

USE InventarioMultisucursal;
GO

-- Verificar que los roles existan
IF NOT EXISTS (SELECT 1 FROM roles WHERE nombre = 'EMPLEADO')
BEGIN
    INSERT INTO roles (nombre) VALUES ('EMPLEADO');
    PRINT 'Rol EMPLEADO creado';
END
GO

IF NOT EXISTS (SELECT 1 FROM roles WHERE nombre = 'SUPERVISOR')
BEGIN
    INSERT INTO roles (nombre) VALUES ('SUPERVISOR');
    PRINT 'Rol SUPERVISOR creado';
END
GO

IF NOT EXISTS (SELECT 1 FROM roles WHERE nombre = 'ADMIN')
BEGIN
    INSERT INTO roles (nombre) VALUES ('ADMIN');
    PRINT 'Rol ADMIN creado';
END
GO

-- Obtener IDs de roles
DECLARE @RolEmpleadoId INT = (SELECT id FROM roles WHERE nombre = 'EMPLEADO');
DECLARE @RolSupervisorId INT = (SELECT id FROM roles WHERE nombre = 'SUPERVISOR');
DECLARE @Sucursal1Id INT = (SELECT TOP 1 id FROM sucursales ORDER BY id);
DECLARE @Sucursal2Id INT = (SELECT TOP 1 id FROM sucursales ORDER BY id OFFSET 1 ROWS FETCH NEXT 1 ROWS ONLY);
DECLARE @Sucursal3Id INT = (SELECT TOP 1 id FROM sucursales ORDER BY id OFFSET 2 ROWS FETCH NEXT 1 ROWS ONLY);

-- Hash de contraseña "empleado123" (generado con bcrypt)
-- Para generar tu propio hash, ejecuta en Node.js:
-- node -e "const bcrypt = require('bcrypt'); bcrypt.hash('empleado123', 10).then(hash => console.log(hash));"
DECLARE @HashEmpleado123 VARCHAR(255) = '$2b$10$qxanT09XW4FSU7exHbLxruO8MzoEFlDxGEBFx35GDHm/1fZcZcd/6';
DECLARE @HashSupervisor123 VARCHAR(255) = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

-- Insertar usuarios EMPLEADO (uno por cada sucursal)
IF NOT EXISTS (SELECT 1 FROM usuarios WHERE username = 'empleado1')
BEGIN
    INSERT INTO usuarios (username, passwordHash, nombre, email, rolId, sucursalId, activo)
    VALUES ('empleado1', @HashEmpleado123, 'Empleado Sucursal 1', 'empleado1@tienda.com', @RolEmpleadoId, @Sucursal1Id, 1);
    PRINT 'Usuario empleado1 creado';
END
GO

IF NOT EXISTS (SELECT 1 FROM usuarios WHERE username = 'empleado2')
BEGIN
    INSERT INTO usuarios (username, passwordHash, nombre, email, rolId, sucursalId, activo)
    VALUES ('empleado2', @HashEmpleado123, 'Empleado Sucursal 2', 'empleado2@tienda.com', @RolEmpleadoId, @Sucursal2Id, 1);
    PRINT 'Usuario empleado2 creado';
END
GO

IF NOT EXISTS (SELECT 1 FROM usuarios WHERE username = 'empleado3')
BEGIN
    INSERT INTO usuarios (username, passwordHash, nombre, email, rolId, sucursalId, activo)
    VALUES ('empleado3', @HashEmpleado123, 'Empleado Sucursal 3', 'empleado3@tienda.com', @RolEmpleadoId, @Sucursal3Id, 1);
    PRINT 'Usuario empleado3 creado';
END
GO

-- Insertar usuario SUPERVISOR
IF NOT EXISTS (SELECT 1 FROM usuarios WHERE username = 'supervisor')
BEGIN
    INSERT INTO usuarios (username, passwordHash, nombre, email, rolId, sucursalId, activo)
    VALUES ('supervisor', @HashSupervisor123, 'Supervisor General', 'supervisor@tienda.com', @RolSupervisorId, @Sucursal1Id, 1);
    PRINT 'Usuario supervisor creado';
END
GO

PRINT '========================================';
PRINT 'Usuarios creados exitosamente';
PRINT '========================================';
PRINT 'Credenciales:';
PRINT '  - empleado1 / empleado123 (Sucursal 1)';
PRINT '  - empleado2 / empleado123 (Sucursal 2)';
PRINT '  - empleado3 / empleado123 (Sucursal 3)';
PRINT '  - supervisor / supervisor123 (Supervisor)';
PRINT '========================================';

