import { API_URL } from '../config';

class SSEService {
  constructor() {
    this.eventSource = null;
    this.listeners = {};
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 3; // Solo 3 intentos
    this.useFallback = false; // Flag para fallback
  }

  connect(token) {
    if (this.eventSource || this.useFallback) {
      return;
    }

    console.log('SSE: Intentando conectar...');
    
    try {
      this.eventSource = new EventSource(`${API_URL}/events?token=${token}`);

      this.eventSource.onopen = () => {
        console.log('✅ SSE: Conexión establecida (Tiempo real activo)');
        this.reconnectAttempts = 0;
        this.useFallback = false;
      };

      this.eventSource.addEventListener('inventario-actualizado', (event) => {
        const data = JSON.parse(event.data);
        this.notificar('inventario-actualizado', data);
      });

      this.eventSource.addEventListener('venta-registrada', (event) => {
        const data = JSON.parse(event.data);
        this.notificar('venta-registrada', data);
      });

      this.eventSource.addEventListener('transferencia-nueva', (event) => {
        const data = JSON.parse(event.data);
        this.notificar('transferencia-nueva', data);
      });

      this.eventSource.addEventListener('transferencia-aprobada', (event) => {
        const data = JSON.parse(event.data);
        this.notificar('transferencia-aprobada', data);
      });

      this.eventSource.onerror = (error) => {
        console.warn('⚠️ SSE: Error en la conexión');
        this.disconnect();
        
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          const delay = 2000;
          console.log(`🔄 SSE: Reintentando conexión (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
          setTimeout(() => this.connect(token), delay);
        } else {
          console.warn('❌ SSE no disponible. El backend no tiene SSE implementado.');
          console.log('ℹ️ Usa el botón "Actualizar" para ver cambios');
          this.useFallback = true;
        }
      };
    } catch (error) {
      console.error('❌ SSE: Error al crear conexión', error);
      this.useFallback = true;
    }
  }

  subscribe(evento, callback) {
    if (!this.listeners[evento]) {
      this.listeners[evento] = [];
    }
    this.listeners[evento].push(callback);
  }

  unsubscribe(evento, callback) {
    if (this.listeners[evento]) {
      this.listeners[evento] = this.listeners[evento].filter(cb => cb !== callback);
    }
  }

  notificar(evento, data) {
    if (this.listeners[evento]) {
      this.listeners[evento].forEach(callback => callback(data));
    }
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  isConnected() {
    return this.eventSource !== null && this.eventSource.readyState === EventSource.OPEN;
  }

  isFallbackMode() {
    return this.useFallback;
  }
}

export const sseService = new SSEService();