import { API_CONFIG } from '@/constants/config';

type MessageHandler = (data: any) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private messageHandlers: Map<string, Set<MessageHandler>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private messageQueue: Array<{ type: string; payload: any }> = [];

  constructor() {
    this.connect();
  }

  private connect() {
    const wsUrl = API_CONFIG.WS_URL;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.notifyConnectionStatus('connected');
      this.processMessageQueue();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const { type, payload } = data;
        
        const handlers = this.messageHandlers.get(type);
        if (handlers) {
          handlers.forEach(handler => handler(payload));
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.notifyConnectionStatus('disconnected');
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.notifyConnectionStatus('error');
    };
  }

  private notifyConnectionStatus(status: 'connected' | 'disconnected' | 'reconnecting' | 'error') {
    const handlers = this.messageHandlers.get('connection_status');
    if (handlers) {
      handlers.forEach(handler => handler({ status, attempt: this.reconnectAttempts }));
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      this.notifyConnectionStatus('reconnecting');
      
      this.reconnectTimeout = setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, delay);
    } else {
      this.notifyConnectionStatus('disconnected');
    }
  }

  private processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.send(message.type, message.payload);
      }
    }
  }

  public subscribe(type: string, handler: MessageHandler) {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, new Set());
    }
    this.messageHandlers.get(type)?.add(handler);
  }

  public unsubscribe(type: string, handler: MessageHandler) {
    this.messageHandlers.get(type)?.delete(handler);
  }

  public send(type: string, payload: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    } else {
      // Добавляем сообщение в очередь для повторной отправки
      this.messageQueue.push({ type, payload });
      console.warn('WebSocket is not connected. Message queued for later delivery.');
    }
  }

  public disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const websocketService = new WebSocketService(); 