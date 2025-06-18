import { messageClient } from './api-client';
import { Chat, Message, CreateChatRequest } from '@/types/chat';
import { websocketService } from './websocket-service';

class ChatService {
  // Создание нового чата
  async createChat(data: CreateChatRequest): Promise<Chat> {
    const response = await messageClient.post<Chat>('/api/v1/chats', {
      name: data.name,
      is_group: data.isGroup
    });
    return response.data;
  }

  // Переименование чата
  async renameChat(chatId: string, name: string): Promise<Chat> {
    const response = await messageClient.put<Chat>(`/api/v1/chats/${chatId}`, {
      name
    });
    return response.data;
  }

  // Добавление пользователя в чат
  async addUserToChat(chatId: string, userId: string): Promise<void> {
    await messageClient.post(`/api/v1/chats/${chatId}/users/${userId}`);
  }

  // Удаление пользователя из чата
  async removeUserFromChat(chatId: string, userId: string): Promise<void> {
    await messageClient.delete(`/api/v1/chats/${chatId}/users/${userId}`);
  }

  // Отправка текстового сообщения
  async sendMessage(chatId: string, content: string): Promise<Message> {
    const formData = new FormData();
    formData.append('content', content);
    
    const response = await messageClient.post<Message>(`/api/v1/chats/${chatId}/messages`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Редактирование сообщения
  async editMessage(messageId: string, content: string): Promise<Message> {
    const response = await messageClient.put<Message>(`/api/v1/messages/${messageId}`, {
      content
    });
    return response.data;
  }

  // Удаление сообщения
  async deleteMessage(messageId: string): Promise<void> {
    await messageClient.delete(`/api/v1/messages/${messageId}`);
  }

  // Удаление чата
  async deleteChat(chatId: string): Promise<void> {
    await messageClient.delete(`/api/v1/chats/${chatId}`);
  }

  // WebSocket методы для real-time сообщений
  subscribeToMessages(chatId: string, callback: (message: Message) => void) {
    websocketService.subscribe(`chat:${chatId}`, callback);
  }

  unsubscribeFromMessages(chatId: string, callback: (message: Message) => void) {
    websocketService.unsubscribe(`chat:${chatId}`, callback);
  }

  sendMessageViaWebSocket(chatId: string, content: string) {
    websocketService.send('send_message', { chatId, content });
  }

  sendTypingStatus(chatId: string, isTyping: boolean) {
    websocketService.send('typing', { chatId, isTyping });
  }
}

export const chatService = new ChatService(); 