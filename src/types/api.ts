// Типы для API ответов в соответствии с документацией

// Auth API
export interface AuthResponse {
  accessToken: string;
  userId: string;
}

// User API
export interface UserProfile {
  id: string;
  nickname: string;
  email: string;
  about?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface UpdateProfileRequest {
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

// Message API
export interface Message {
  id: string;
  content: string;
  senderId: string;
  chatId: string;
  createdAt: string;
  updatedAt: string;
  sender: {
    id: string;
    nickname: string;
    avatarUrl?: string;
  };
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

export interface Chat {
  id: string;
  name: string;
  isGroup: boolean;
  participants: string[];
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChatRequest {
  name: string;
  isGroup: boolean;
}

export interface EditMessageRequest {
  content: string;
}

export interface RenameChatRequest {
  name: string;
}

// WebSocket
export interface WebSocketMessage {
  type: 'message' | 'typing' | 'user_joined' | 'user_left';
  data: Message | TypingEvent | ChatMember;
}

export interface TypingEvent {
  chatId: string;
  userId: string;
  isTyping: boolean;
}

export interface ChatMember {
  id: string;
  nickname: string;
  avatarUrl?: string;
}

// Общие типы
export interface ApiError {
  message: string;
  status: number;
  details?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
} 