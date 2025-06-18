import { messageClient } from './api-client';
import { Chat, Message, CreateChatRequest, SendMessageRequest } from '@/types/api';
import { websocketService } from './websocket-service';

class ChatService {
  // Получение списка чатов
  async getChats(): Promise<Chat[]> {
    const response = await messageClient.get<Chat[]>('/api/v1/chats/history');
    return response.data;
  }

  // Получение сообщений чата
  async getChatMessages(chatId: string): Promise<Message[]> {
    const response = await messageClient.get<Message[]>(`/api/v1/chats/${chatId}/messages/history`);
    return response.data;
  }

  // Создание нового чата
  async createChat(chatData: CreateChatRequest): Promise<Chat> {
    const response = await messageClient.post<Chat>('/api/v1/chats', chatData);
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
  async sendMessage(chatId: string, messageData: SendMessageRequest): Promise<Message> {
    const response = await messageClient.post<Message>(`/api/v1/chats/${chatId}/messages`, messageData);
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
    websocketService.subscribe(`chat:${chatId}`, (data) => {
      if ('content' in data) {
        callback(data as Message);
      }
    });
  }

  unsubscribeFromMessages(chatId: string) {
    websocketService.unsubscribe(`chat:${chatId}`, () => {});
  }

  sendMessageViaWebSocket(chatId: string, content: string) {
    websocketService.send('send_message', { chatId, content });
  }

  sendTypingStatus(chatId: string, isTyping: boolean) {
    websocketService.send('typing', { chatId, isTyping });
  }
}

export const chatService = new ChatService(); 