import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, UpdateProfileData } from '@/lib/user-service';
import { authService } from '@/lib/auth-service';

// Хук для получения профиля пользователя
export const useUserProfile = (userId?: string) => {
  const currentUserId = userId || authService.getUserId();

  return useQuery({
    queryKey: ['user', 'profile', currentUserId],
    queryFn: () => userService.getProfile(currentUserId!),
    enabled: !!currentUserId,
  });
};

// Хук для поиска пользователей
export const useSearchUsers = (nickname: string) => {
  return useQuery({
    queryKey: ['users', 'search', nickname],
    queryFn: () => userService.searchUsers(nickname),
    enabled: nickname.length > 0,
  });
};

// Хук для обновления профиля
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const userId = authService.getUserId();

  return useMutation({
    mutationFn: (data: UpdateProfileData) => userService.updateProfile(data),
    onSuccess: () => {
      // Инвалидируем кеш профиля пользователя
      queryClient.invalidateQueries({ queryKey: ['user', 'profile', userId] });
    },
  });
};

// Хук для получения списка друзей
export const useFriends = () => {
  return useQuery({
    queryKey: ['user', 'friends'],
    queryFn: () => userService.getFriends(),
  });
};

// Хук для получения запросов в друзья
export const useFriendRequests = () => {
  return useQuery({
    queryKey: ['user', 'friend-requests'],
    queryFn: () => userService.getFriendRequests(),
  });
};

// Хук для отправки запроса в друзья
export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userService.sendFriendRequest(userId),
    onSuccess: () => {
      // Инвалидируем кеш запросов в друзья
      queryClient.invalidateQueries({ queryKey: ['user', 'friend-requests'] });
    },
  });
};

// Хук для принятия запроса в друзья
export const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userService.acceptFriendRequest(userId),
    onSuccess: () => {
      // Инвалидируем кеши друзей и запросов
      queryClient.invalidateQueries({ queryKey: ['user', 'friends'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'friend-requests'] });
    },
  });
}; 