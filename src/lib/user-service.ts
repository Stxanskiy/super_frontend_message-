import { userClient } from './api-client';
import { UserProfile, UpdateProfileRequest, FriendRequest, SearchUsersResponse, UserProfileResponse, FriendRequestsResponse, FriendsResponse } from '@/types/api';

class UserService {
    // Получение профиля пользователя
    async getProfile(userId: string): Promise<UserProfile> {
        const response = await userClient.get<UserProfileResponse>(`/users/getByID?id=${userId}`);
        console.log('getProfile response:', response.data);
        
        let userData: UserProfile | undefined;
        
        if (response.data.success && response.data.data) {
            userData = response.data.data;
        } else if (response.data.id) {
            userData = response.data as UserProfile;
        }
        
        if (!userData) {
            throw new Error('Invalid response from getProfile');
        }
        return userData;
    }

    // Поиск пользователей по никнейму
    async searchUsers(nickname: string): Promise<UserProfile[]> {
        const response = await userClient.get<SearchUsersResponse>(`/users/search?nickname=${nickname}`);
        console.log('searchUsers response:', response.data);
        
        let users: UserProfile[] | undefined;
        
        if (response.data.success && response.data.data) {
            users = response.data.data;
        } else if (response.data.users) {
            users = response.data.users;
        } else if (Array.isArray(response.data)) {
            users = response.data;
        }
        
        if (!users) {
            throw new Error('Invalid response from searchUsers');
        }
        return users;
    }

    // Обновление профиля
    async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
        const response = await userClient.put<UserProfileResponse>('/users/profile/update', data);
        console.log('updateProfile response:', response.data);
        
        let userData: UserProfile | undefined;
        
        if (response.data.success && response.data.data) {
            userData = response.data.data;
        } else if (response.data.id) {
            userData = response.data as UserProfile;
        }
        
        if (!userData) {
            throw new Error('Invalid response from updateProfile');
        }
        return userData;
    }

    // Отправка запроса в друзья
    async sendFriendRequest(userId: string): Promise<void> {
        await userClient.post(`/contacts/request/${userId}`);
    }

    // Получение списка запросов в друзья
    async getFriendRequests(): Promise<FriendRequest[]> {
        const response = await userClient.get<FriendRequestsResponse>('/contacts/requests');
        console.log('getFriendRequests response:', response.data);
        
        let requests: FriendRequest[] | undefined;
        
        if (response.data.success && response.data.data) {
            requests = response.data.data;
        } else if (Array.isArray(response.data)) {
            requests = response.data;
        }
        
        if (!requests) {
            throw new Error('Invalid response from getFriendRequests');
        }
        return requests;
    }

    // Принятие запроса в друзья
    async acceptFriendRequest(userId: string): Promise<void> {
        await userClient.post(`/contacts/accept/${userId}`);
    }

    // Получение списка друзей
    async getFriends(): Promise<UserProfile[]> {
        const response = await userClient.get<FriendsResponse>('/contacts/friends');
        console.log('getFriends response:', response.data);
        
        let friends: UserProfile[] | undefined;
        
        if (response.data.success && response.data.data) {
            friends = response.data.data;
        } else if (Array.isArray(response.data)) {
            friends = response.data;
        }
        
        if (!friends) {
            throw new Error('Invalid response from getFriends');
        }
        return friends;
    }
}

export const userService = new UserService(); 