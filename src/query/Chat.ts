import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/lib/chat-service';
import { CreateChatRequest } from '@/types/chat';

// Хук для создания нового чата
export const useCreateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateChatRequest) => chatService.createChat(data),
    onSuccess: () => {
      // Инвалидируем кеш чатов
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
};

// Хук для переименования чата
export const useRenameChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chatId, name }: { chatId: string; name: string }) =>
      chatService.renameChat(chatId, name),
    onSuccess: (_, { chatId }) => {
      // Инвалидируем кеши чатов и конкретного чата
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.invalidateQueries({ queryKey: ['chat', chatId] });
    },
  });
};

// Хук для добавления пользователя в чат
export const useAddUserToChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chatId, userId }: { chatId: string; userId: string }) =>
      chatService.addUserToChat(chatId, userId),
    onSuccess: (_, { chatId }) => {
      // Инвалидируем кеш конкретного чата
      queryClient.invalidateQueries({ queryKey: ['chat', chatId] });
    },
  });
};

// Хук для удаления пользователя из чата
export const useRemoveUserFromChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chatId, userId }: { chatId: string; userId: string }) =>
      chatService.removeUserFromChat(chatId, userId),
    onSuccess: (_, { chatId }) => {
      // Инвалидируем кеш конкретного чата
      queryClient.invalidateQueries({ queryKey: ['chat', chatId] });
    },
  });
};

// Хук для отправки сообщения
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chatId, content }: { chatId: string; content: string }) =>
      chatService.sendMessage(chatId, content),
    onSuccess: (_, { chatId }) => {
      // Инвалидируем кеш сообщений чата
      queryClient.invalidateQueries({ queryKey: ['chat', chatId, 'messages'] });
      // Инвалидируем кеш чатов для обновления последнего сообщения
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
};

// Хук для редактирования сообщения
export const useEditMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId, content }: { messageId: string; content: string }) =>
      chatService.editMessage(messageId, content),
    onSuccess: (message) => {
      // Инвалидируем кеш сообщений чата
      queryClient.invalidateQueries({ queryKey: ['chat', message.chatId, 'messages'] });
    },
  });
};

// Хук для удаления сообщения
export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => chatService.deleteMessage(messageId),
    onSuccess: () => {
      // Инвалидируем все кеши сообщений (можно оптимизировать, если знать chatId)
      queryClient.invalidateQueries({ queryKey: ['chat'] });
    },
  });
};

// Хук для удаления чата
export const useDeleteChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chatId: string) => chatService.deleteChat(chatId),
    onSuccess: () => {
      // Инвалидируем кеш чатов
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
}; 