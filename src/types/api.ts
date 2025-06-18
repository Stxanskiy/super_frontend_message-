// Типы для API ответов в соответствии с документацией

// Auth API
export interface AuthResponse {
  access_token: string;
  user_id: string;
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

// Chat API
export interface Chat {
  id: string;
  name: string;
  is_group: boolean;
  participants: string[];
  last_message?: Message;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  chat_id: string;
  created_at: string;
  updated_at: string;
  sender: {
    id: string;
    nickname: string;
    avatarUrl?: string;
  };
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

export interface CreateChatRequest {
  name: string;
  is_group: boolean;
  user_ids: string[];
}

export interface SendMessageRequest {
  content: string;
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