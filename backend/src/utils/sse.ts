import { Response } from 'express';

interface SSEClient {
  id: string;
  response: Response;
}

class SSEManager {
  private clients: Map<string, SSEClient> = new Map();
  private clientIdCounter = 0;

  addClient(response: Response): string {
    const clientId = `client-${++this.clientIdCounter}`;
    
    // Configurar headers SSE
    response.setHeader('Content-Type', 'text/event-stream');
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Connection', 'keep-alive');
    response.setHeader('X-Accel-Buffering', 'no');

    // Enviar conexión inicial
    response.write(`data: ${JSON.stringify({ type: 'connected', clientId })}\n\n`);

    // Guardar cliente
    this.clients.set(clientId, { id: clientId, response });

    // Limpiar cuando el cliente se desconecta
    response.on('close', () => {
      this.removeClient(clientId);
    });

    return clientId;
  }

  removeClient(clientId: string): void {
    this.clients.delete(clientId);
    console.log(`Cliente SSE desconectado: ${clientId}. Clientes activos: ${this.clients.size}`);
  }

  sendEvent(type: string, data: any): void {
    const message = JSON.stringify({ type, data, timestamp: new Date().toISOString() });
    const event = `event: ${type}\ndata: ${message}\n\n`;

    this.clients.forEach((client) => {
      try {
        client.response.write(event);
      } catch (error) {
        console.error(`Error enviando evento a ${client.id}:`, error);
        this.removeClient(client.id);
      }
    });

    console.log(`Evento SSE enviado: ${type} a ${this.clients.size} clientes`);
  }

  getClientCount(): number {
    return this.clients.size;
  }
}

export const sseManager = new SSEManager();

export const sendEvent = (type: string, data: any): void => {
  sseManager.sendEvent(type, data);
};

