import { useState } from 'react';
import { ChatList } from '@/components/chat/ChatList';
import { ChatMessages } from '@/components/chat/ChatMessages';
import { Chat } from '@/lib/chat-service';

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <ChatList
            onSelectChat={setSelectedChat}
            selectedChatId={selectedChat?.id}
          />
        </div>
        <div className="md:col-span-3">
          {selectedChat ? (
            <ChatMessages chatId={selectedChat.id} />
          ) : (
            <div className="flex items-center justify-center h-[600px] border rounded-lg">
              <p className="text-muted-foreground">
                Select a chat to start messaging
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 