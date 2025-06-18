import { userClient } from './api-client';

export interface UserProfile {
  id: string;
  nickname: string;
  email: string;
  about?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface UpdateProfileData {
  about?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface FriendRequest {
  id: string;
  sender: UserProfile;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export const userService = {
  // Получение профиля пользователя по ID
  async getProfile(userId: string): Promise<UserProfile> {
    const response = await userClient.get<UserProfile>(`/users/getByID?id=${userId}`);
    return response.data;
  },

  // Поиск пользователей по никнейму
  async searchUsers(nickname: string): Promise<UserProfile[]> {
    const response = await userClient.get<UserProfile[]>(`/users/search?nickname=${nickname}`);
    return response.data;
  },

  // Обновление профиля
  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    const response = await userClient.put<UserProfile>('/users/profile/update', data);
    return response.data;
  },

  // Отправка запроса в друзья
  async sendFriendRequest(userId: string): Promise<void> {
    await userClient.post(`/contacts/request/${userId}`);
  },

  // Получение списка входящих запросов в друзья
  async getFriendRequests(): Promise<FriendRequest[]> {
    const response = await userClient.get<FriendRequest[]>('/contacts/requests');
    return response.data;
  },

  // Принятие запроса в друзья
  async acceptFriendRequest(userId: string): Promise<void> {
    await userClient.post(`/contacts/accept/${userId}`);
  },

  // Получение списка друзей
  async getFriends(): Promise<UserProfile[]> {
    const response = await userClient.get<UserProfile[]>('/contacts/friends');
    return response.data;
  }
}; 