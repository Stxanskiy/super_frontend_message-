import { apiClient } from './api-client';
import { UserProfile, UpdateProfileRequest, FriendRequest } from '@/types/api';

class UserService {
    // Получение профиля пользователя
    async getProfile(userId: string): Promise<UserProfile> {
        const response = await apiClient.get<UserProfile>(`/users/getByID?id=${userId}`);
        return response.data;
    }

    // Поиск пользователей по никнейму
    async searchUsers(nickname: string): Promise<UserProfile[]> {
        const response = await apiClient.get<UserProfile[]>(`/users/search?nickname=${nickname}`);
        return response.data;
    }

    // Обновление профиля
    async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
        const response = await apiClient.put<UserProfile>('/users/profile/update', data);
        return response.data;
    }

    // Отправка запроса в друзья
    async sendFriendRequest(userId: string): Promise<void> {
        await apiClient.post(`/contacts/request/${userId}`);
    }

    // Получение списка запросов в друзья
    async getFriendRequests(): Promise<FriendRequest[]> {
        const response = await apiClient.get<FriendRequest[]>('/contacts/requests');
        return response.data;
    }

    // Принятие запроса в друзья
    async acceptFriendRequest(userId: string): Promise<void> {
        await apiClient.post(`/contacts/accept/${userId}`);
    }

    // Получение списка друзей
    async getFriends(): Promise<UserProfile[]> {
        const response = await apiClient.get<UserProfile[]>('/contacts/friends');
        return response.data;
    }
}

export const userService = new UserService(); 