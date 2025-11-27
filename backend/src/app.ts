import 'reflect-metadata';
import express, { Express } from 'express';
import cors from 'cors';
import { errorHandler } from './utils/error.handler';
import authRoutes from './routes/auth.routes';
import productosRoutes from './routes/productos.routes';
import inventariosRoutes from './routes/inventarios.routes';
import ventasRoutes from './routes/ventas.routes';
import transferenciasRoutes from './routes/transferencias.routes';
import eventsRoutes from './routes/events.routes';

export const createApp = (): Express => {
  const app = express();

  // Middleware
  app.use(cors({ origin: '*', credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use('/auth', authRoutes);
  app.use('/productos', productosRoutes);
  app.use('/inventarios', inventariosRoutes);
  app.use('/ventas', ventasRoutes);
  app.use('/transferencias', transferenciasRoutes);
  app.use('/', eventsRoutes);

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Servidor funcionando correctamente' });
  });

  // Error handler
  app.use(errorHandler);

  return app;
};

