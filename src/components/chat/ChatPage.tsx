import { useState } from 'react';
import { ChatList } from './ChatList';
import { ChatMessages } from './ChatMessages';
import { ConnectionStatus } from './ConnectionStatus';

export const ChatPage = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  return (
    <div className="flex h-full">
      <div className="w-1/4 border-r border-gray-200">
        <div className="p-4">
          <ConnectionStatus />
        </div>
        <ChatList onSelectChat={setSelectedChatId} selectedChatId={selectedChatId} />
      </div>
      <div className="flex-1">
        {selectedChatId ? (
          <ChatMessages chatId={selectedChatId} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}; 