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
    avatar_url?: string;
  };
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

export interface Chat {
  id: string;
  name: string;
  is_group: boolean;
  participants: string[];
  lastMessage?: Message;
  created_at: string;
  updated_at: string;
}

export interface CreateChatRequest {
  name: string;
  is_group: boolean;
  participants: string[];
} 