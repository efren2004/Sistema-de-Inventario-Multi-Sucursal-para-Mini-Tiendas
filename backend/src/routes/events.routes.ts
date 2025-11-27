import { Router, Response } from 'express';
import { sseManager } from '../utils/sse';

const router = Router();

router.get('/events', (req, res: Response) => {
  const clientId = sseManager.addClient(res);
  console.log(`Cliente SSE conectado: ${clientId}`);

  // Mantener la conexión abierta
  req.on('close', () => {
    sseManager.removeClient(clientId);
  });
});

export default router;

