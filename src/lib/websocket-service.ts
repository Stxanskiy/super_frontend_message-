import { API_CONFIG } from '@/constants/config';
import { WebSocketMessage, TypingEvent } from '@/types/api';

type MessageHandler = (data: WebSocketMessage['data']) => void;
type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting' | 'error';
type ConnectionStatusHandler = (data: ConnectionStatusData) => void;

interface ConnectionStatusData {
  status: ConnectionStatus;
  attempt: number;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private messageHandlers: Map<string, Set<MessageHandler>> = new Map();
  private connectionStatusHandlers: Set<ConnectionStatusHandler> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private messageQueue: Array<{ type: string; payload: unknown }> = [];
  private isConnecting = false;

  constructor() {
    // Не подключаемся автоматически при создании
    // Подключение будет происходить только при наличии токена
  }

  private connectInternal() {
    if (this.isConnecting) return;
    
    const token = localStorage.getItem(API_CONFIG.TOKEN_KEY);
    if (!token) {
      console.log('WebSocket: No token available, skipping connection');
      return;
    }
    
    this.isConnecting = true;
    const wsUrl = `${API_CONFIG.WS_URL}?token=${token}`;
    console.log('WebSocket: Connecting to', wsUrl);
    
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.notifyConnectionStatus('connected');
      this.processMessageQueue();
    };

    this.ws.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        const { type, data: payload } = data;
        
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
      this.isConnecting = false;
      this.notifyConnectionStatus('disconnected');
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.isConnecting = false;
      this.notifyConnectionStatus('error');
    };
  }

  private notifyConnectionStatus(status: ConnectionStatus) {
    const statusData: ConnectionStatusData = { status, attempt: this.reconnectAttempts };
    this.connectionStatusHandlers.forEach(handler => handler(statusData));
  }

  private attemptReconnect() {
    const token = localStorage.getItem(API_CONFIG.TOKEN_KEY);
    if (!token) {
      console.log('WebSocket: No token available, stopping reconnection attempts');
      return;
    }
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      this.notifyConnectionStatus('reconnecting');
      
      this.reconnectTimeout = setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connectInternal();
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

  public subscribeToConnectionStatus(handler: ConnectionStatusHandler) {
    this.connectionStatusHandlers.add(handler);
  }

  public unsubscribeFromConnectionStatus(handler: ConnectionStatusHandler) {
    this.connectionStatusHandlers.delete(handler);
  }

  public send(type: string, payload: unknown) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    } else {
      // Добавляем сообщение в очередь для повторной отправки
      this.messageQueue.push({ type, payload });
      console.warn('WebSocket is not connected. Message queued for later delivery.');
    }
  }

  public getConnectionStatus(): 'connecting' | 'connected' | 'disconnected' | 'reconnecting' {
    if (this.isConnecting) return 'connecting';
    if (this.ws?.readyState === WebSocket.OPEN) return 'connected';
    if (this.reconnectAttempts > 0) return 'reconnecting';
    return 'disconnected';
  }

  public connect() {
    this.connectInternal();
  }

  public disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnecting = false;
  }
}

export const websocketService = new WebSocketService(); 