import { API_CONFIG } from '@/constants/config';
import { Chat, Message, CreateChatRequest } from '@/types/chat';
import { websocketService } from './websocket-service';

class ChatService {
  private readonly baseUrl = API_CONFIG.API_URL;

  async getChats(): Promise<Chat[]> {
    const response = await fetch(`${this.baseUrl}/chats`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch chats');
    }
    return response.json();
  }

  async getChat(chatId: string): Promise<Chat> {
    const response = await fetch(`${this.baseUrl}/chats/${chatId}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch chat');
    }
    return response.json();
  }

  async getMessages(chatId: string): Promise<Message[]> {
    const response = await fetch(`${this.baseUrl}/chats/${chatId}/messages`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }
    return response.json();
  }

  async createChat(data: CreateChatRequest): Promise<Chat> {
    const response = await fetch(`${this.baseUrl}/chats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create chat');
    }
    return response.json();
  }

  async sendMessage(chatId: string, content: string): Promise<Message> {
    const response = await fetch(`${this.baseUrl}/chats/${chatId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ content }),
    });
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    return response.json();
  }

  async editMessage(messageId: string, content: string): Promise<Message> {
    const response = await fetch(`${this.baseUrl}/messages/${messageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ content }),
    });
    if (!response.ok) {
      throw new Error('Failed to edit message');
    }
    return response.json();
  }

  async deleteMessage(messageId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/messages/${messageId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to delete message');
    }
  }

  // WebSocket methods
  subscribeToMessages(chatId: string, callback: (message: Message) => void) {
    websocketService.subscribe(`chat:${chatId}`, callback);
  }

  unsubscribeFromMessages(chatId: string, callback: (message: Message) => void) {
    websocketService.unsubscribe(`chat:${chatId}`, callback);
  }

  sendMessageViaWebSocket(chatId: string, content: string) {
    websocketService.send('send_message', { chat_id: chatId, content });
  }

  sendTypingStatus(chatId: string, isTyping: boolean) {
    websocketService.send('typing', { chat_id: chatId, is_typing: isTyping });
  }
}

export const chatService = new ChatService(); 