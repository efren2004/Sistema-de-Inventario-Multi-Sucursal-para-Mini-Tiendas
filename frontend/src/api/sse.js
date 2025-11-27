import { API_URL } from '../config';

class SSEService {
  constructor() {
    this.eventSource = null;
    this.listeners = {};
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
  }

  connect(token) {
    if (this.eventSource) {
      console.log('SSE: Ya existe una conexión activa');
      return;
    }

    console.log('SSE: Conectando...');
    this.eventSource = new EventSource(`${API_URL}/events?token=${token}`);

    this.eventSource.onopen = () => {
      console.log('SSE: Conexión establecida');
      this.reconnectAttempts = 0;
    };

    // Evento: inventario-actualizado
    this.eventSource.addEventListener('inventario-actualizado', (event) => {
      console.log('SSE: Inventario actualizado', event.data);
      const data = JSON.parse(event.data);
      this.notificar('inventario-actualizado', data);
    });

    // Evento: venta-registrada
    this.eventSource.addEventListener('venta-registrada', (event) => {
      console.log('SSE: Venta registrada', event.data);
      const data = JSON.parse(event.data);
      this.notificar('venta-registrada', data);
    });

    // Evento: transferencia-nueva
    this.eventSource.addEventListener('transferencia-nueva', (event) => {
      console.log('SSE: Nueva transferencia', event.data);
      const data = JSON.parse(event.data);
      this.notificar('transferencia-nueva', data);
    });

    // Evento: transferencia-aprobada
    this.eventSource.addEventListener('transferencia-aprobada', (event) => {
      console.log('SSE: Transferencia aprobada', event.data);
      const data = JSON.parse(event.data);
      this.notificar('transferencia-aprobada', data);
    });

    // Manejo de errores
    this.eventSource.onerror = (error) => {
      console.error('SSE: Error en la conexión', error);
      this.disconnect();
      
      // Reconexión con backoff exponencial
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
        console.log(`SSE: Reconectando en ${delay}ms (intento ${this.reconnectAttempts})`);
        setTimeout(() => this.connect(token), delay);
      } else {
        console.error('SSE: Máximo de intentos de reconexión alcanzado');
      }
    };
  }

  subscribe(evento, callback) {
    if (!this.listeners[evento]) {
      this.listeners[evento] = [];
    }
    this.listeners[evento].push(callback);
    console.log(`SSE: Suscrito al evento '${evento}'`);
  }

  unsubscribe(evento, callback) {
    if (this.listeners[evento]) {
      this.listeners[evento] = this.listeners[evento].filter(cb => cb !== callback);
      console.log(`SSE: Desuscrito del evento '${evento}'`);
    }
  }

  notificar(evento, data) {
    if (this.listeners[evento]) {
      console.log(`SSE: Notificando ${this.listeners[evento].length} listeners del evento '${evento}'`);
      this.listeners[evento].forEach(callback => callback(data));
    }
  }

  disconnect() {
    if (this.eventSource) {
      console.log('SSE: Desconectando...');
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  isConnected() {
    return this.eventSource !== null && this.eventSource.readyState === EventSource.OPEN;
  }
}

export const sseService = new SSEService();