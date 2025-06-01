import { apiClient } from './api-client';
import { API_CONFIG } from '@/constants/config';

export interface Contact {
  id: string;
  nickname: string;
  email: string;
  about?: string;
  phone?: string;
  avatar_url?: string;
}

export interface FriendRequest {
  id: string;
  sender: Contact;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export const contactsService = {
  // Получить список друзей
  getFriends: async (): Promise<Contact[]> => {
    const response = await apiClient.get('/contacts/friends');
    return response.data;
  },

  // Получить список входящих заявок в друзья
  getFriendRequests: async (): Promise<FriendRequest[]> => {
    const response = await apiClient.get('/contacts/requests');
    return response.data;
  },

  // Отправить заявку в друзья
  sendFriendRequest: async (userId: string): Promise<void> => {
    await apiClient.post(`/contacts/request/${userId}`);
  },

  // Принять заявку в друзья
  acceptFriendRequest: async (userId: string): Promise<void> => {
    await apiClient.post(`/contacts/accept/${userId}`);
  },

  // Отклонить заявку в друзья
  rejectFriendRequest: async (userId: string): Promise<void> => {
    await apiClient.post(`/contacts/reject/${userId}`);
  },

  // Поиск пользователей по никнейму
  searchUsers: async (nickname: string): Promise<Contact[]> => {
    const response = await apiClient.get(`/users/search?nickname=${nickname}`);
    return response.data;
  },
}; 