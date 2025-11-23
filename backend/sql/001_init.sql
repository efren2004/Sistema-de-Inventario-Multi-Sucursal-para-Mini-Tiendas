-- Script de inicialización de base de datos
-- Sistema de Inventario Multi-Sucursal

-- Crear base de datos (ejecutar en master primero si no existe)
-- IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'InventarioDB')
-- BEGIN
--     CREATE DATABASE InventarioDB;
-- END
-- GO

-- USE InventarioDB;
-- GO

-- Tabla de usuarios
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usuarios]') AND type in (N'U'))
BEGIN
    CREATE TABLE usuarios (
        id INT IDENTITY(1,1) PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        nombre VARCHAR(200) NOT NULL,
        email VARCHAR(200),
        rol VARCHAR(50) NOT NULL DEFAULT 'usuario', -- admin, usuario, supervisor
        activo BIT NOT NULL DEFAULT 1,
        created_at DATETIME NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME
    );
END
GO

-- Tabla de sucursales
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sucursales]') AND type in (N'U'))
BEGIN
    CREATE TABLE sucursales (
        id INT IDENTITY(1,1) PRIMARY KEY,
        codigo VARCHAR(50) NOT NULL UNIQUE,
        nombre VARCHAR(200) NOT NULL,
        direccion VARCHAR(500),
        telefono VARCHAR(50),
        email VARCHAR(200),
        responsable VARCHAR(200),
        activo BIT NOT NULL DEFAULT 1,
        created_at DATETIME NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME
    );
END
GO

-- Tabla de productos
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[productos]') AND type in (N'U'))
BEGIN
    CREATE TABLE productos (
        id INT IDENTITY(1,1) PRIMARY KEY,
        codigo VARCHAR(50) NOT NULL UNIQUE,
        nombre VARCHAR(200) NOT NULL,
        descripcion TEXT,
        precio DECIMAL(10,2) NOT NULL DEFAULT 0,
        categoria VARCHAR(100),
        unidad_medida VARCHAR(20) NOT NULL DEFAULT 'UNIDAD', -- UNIDAD, KILO, LITRO, etc.
        activo BIT NOT NULL DEFAULT 1,
        created_at DATETIME NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME
    );
END
GO

-- Tabla de inventarios (stock por sucursal)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[inventarios]') AND type in (N'U'))
BEGIN
    CREATE TABLE inventarios (
        id INT IDENTITY(1,1) PRIMARY KEY,
        sucursal_id INT NOT NULL,
        producto_id INT NOT NULL,
        cantidad DECIMAL(10,2) NOT NULL DEFAULT 0,
        cantidad_minima DECIMAL(10,2) NOT NULL DEFAULT 0,
        fecha_ultima_entrada DATETIME,
        fecha_ultima_salida DATETIME,
        activo BIT NOT NULL DEFAULT 1,
        created_at DATETIME NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME,
        FOREIGN KEY (sucursal_id) REFERENCES sucursales(id),
        FOREIGN KEY (producto_id) REFERENCES productos(id),
        UNIQUE(sucursal_id, producto_id)
    );
END
GO

-- Tabla de transferencias
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[transferencias]') AND type in (N'U'))
BEGIN
    CREATE TABLE transferencias (
        id INT IDENTITY(1,1) PRIMARY KEY,
        sucursal_origen_id INT NOT NULL,
        sucursal_destino_id INT NOT NULL,
        usuario_id INT,
        estado VARCHAR(50) NOT NULL DEFAULT 'pendiente', -- pendiente, en_transito, completada, cancelada
        fecha_transferencia DATETIME,
        observaciones TEXT,
        created_at DATETIME NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME,
        FOREIGN KEY (sucursal_origen_id) REFERENCES sucursales(id),
        FOREIGN KEY (sucursal_destino_id) REFERENCES sucursales(id),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );
END
GO

-- Tabla de items de transferencia
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[transferencias_items]') AND type in (N'U'))
BEGIN
    CREATE TABLE transferencias_items (
        id INT IDENTITY(1,1) PRIMARY KEY,
        transferencia_id INT NOT NULL,
        producto_id INT NOT NULL,
        cantidad DECIMAL(10,2) NOT NULL,
        cantidad_recibida DECIMAL(10,2) DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT GETDATE(),
        FOREIGN KEY (transferencia_id) REFERENCES transferencias(id),
        FOREIGN KEY (producto_id) REFERENCES productos(id)
    );
END
GO

-- Tabla de ventas
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ventas]') AND type in (N'U'))
BEGIN
    CREATE TABLE ventas (
        id INT IDENTITY(1,1) PRIMARY KEY,
        sucursal_id INT NOT NULL,
        usuario_id INT,
        numero_factura VARCHAR(50),
        fecha_venta DATETIME NOT NULL DEFAULT GETDATE(),
        total DECIMAL(10,2) NOT NULL DEFAULT 0,
        estado VARCHAR(50) NOT NULL DEFAULT 'completada', -- completada, cancelada
        created_at DATETIME NOT NULL DEFAULT GETDATE(),
        FOREIGN KEY (sucursal_id) REFERENCES sucursales(id),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );
END
GO

-- Tabla de alertas
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[alertas]') AND type in (N'U'))
BEGIN
    CREATE TABLE alertas (
        id INT IDENTITY(1,1) PRIMARY KEY,
        tipo VARCHAR(50) NOT NULL, -- stock_minimo, caducidad, transferencia_pendiente
        sucursal_id INT,
        producto_id INT,
        mensaje TEXT NOT NULL,
        nivel VARCHAR(20) NOT NULL DEFAULT 'info', -- info, warning, critical
        leida BIT NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT GETDATE(),
        FOREIGN KEY (sucursal_id) REFERENCES sucursales(id),
        FOREIGN KEY (producto_id) REFERENCES productos(id)
    );
END
GO

-- Insertar datos de ejemplo

-- Usuario administrador (password: admin123)
-- NOTA: El hash debe generarse con bcrypt usando el script:
--   cd backend
--   node src/utils/passwordHelper.js admin123
-- Luego reemplaza el hash en la siguiente línea
-- Ejemplo de hash válido para 'admin123': $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
IF NOT EXISTS (SELECT * FROM usuarios WHERE username = 'admin')
BEGIN
    -- IMPORTANTE: Reemplaza el hash con el generado por passwordHelper.js
    INSERT INTO usuarios (username, password_hash, nombre, email, rol)
    VALUES ('admin', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Administrador', 'admin@inventario.com', 'admin');
END
GO

-- Sucursales de ejemplo
IF NOT EXISTS (SELECT * FROM sucursales WHERE codigo = 'SUC001')
BEGIN
    INSERT INTO sucursales (codigo, nombre, direccion, telefono, responsable)
    VALUES 
        ('SUC001', 'Sucursal Central', 'Av. Principal 123', '555-0001', 'Juan Pérez'),
        ('SUC002', 'Sucursal Norte', 'Calle Norte 456', '555-0002', 'María García');
END
GO

-- Índices para mejorar rendimiento
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_productos_codigo')
BEGIN
    CREATE INDEX IX_productos_codigo ON productos(codigo);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_inventarios_sucursal_producto')
BEGIN
    CREATE INDEX IX_inventarios_sucursal_producto ON inventarios(sucursal_id, producto_id);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_alertas_leida')
BEGIN
    CREATE INDEX IX_alertas_leida ON alertas(leida, created_at);
END
GO

PRINT 'Base de datos inicializada correctamente';
GO

