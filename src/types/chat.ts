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
  participants?: string[];
}

export interface ChatMember {
  id: string;
  nickname: string;
  avatarUrl?: string;
}

export interface ChatDetails extends Chat {
  members: ChatMember[];
  messageCount: number;
}

export interface WebSocketMessage {
  type: 'message' | 'typing' | 'user_joined' | 'user_left';
  data: Message | TypingEvent | ChatMember;
}

export interface TypingEvent {
  chatId: string;
  userId: string;
  isTyping: boolean;
} 