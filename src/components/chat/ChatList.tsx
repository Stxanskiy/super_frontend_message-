import { useQuery } from '@tanstack/react-query';
import { chatService } from '@/lib/chat-service';
import { Chat } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { APP_STRINGS } from '@/constants/strings';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ChatListProps {
  onSelectChat: (chatId: string) => void;
  selectedChatId: string | null;
}

export const ChatList = ({ onSelectChat, selectedChatId }: ChatListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const [isGroupChat, setIsGroupChat] = useState(false);

  const { data: chats, isLoading } = useQuery({
    queryKey: ['chats'],
    queryFn: chatService.getChats,
  });

  const createChatMutation = useMutation({
    mutationFn: chatService.createChat,
    onSuccess: (newChat) => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      toast({
        title: APP_STRINGS.CHAT_CREATED,
        description: APP_STRINGS.CHAT_CREATED_SUCCESS,
      });
      setIsCreateDialogOpen(false);
      setNewChatName('');
      setIsGroupChat(false);
      onSelectChat(newChat.id);
    },
    onError: () => {
      toast({
        title: APP_STRINGS.ERROR,
        description: APP_STRINGS.CHAT_CREATE_ERROR,
        variant: 'destructive',
      });
    },
  });

  const handleCreateChat = () => {
    if (!newChatName.trim()) return;
    createChatMutation.mutate({ name: newChatName.trim(), is_group: isGroupChat });
  };

  if (isLoading) {
    return <div className="p-4">Loading chats...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{APP_STRINGS.CHATS}</CardTitle>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{APP_STRINGS.NEW_CHAT}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="chatName">{APP_STRINGS.CHAT_NAME}</Label>
                <Input
                  id="chatName"
                  value={newChatName}
                  onChange={(e) => setNewChatName(e.target.value)}
                  placeholder={APP_STRINGS.CHAT_NAME}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="groupChat"
                  checked={isGroupChat}
                  onCheckedChange={(checked) => setIsGroupChat(checked as boolean)}
                />
                <Label htmlFor="groupChat">{APP_STRINGS.GROUP_CHAT}</Label>
              </div>
              <Button onClick={handleCreateChat} className="w-full">
                {APP_STRINGS.CREATE_CHAT}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {chats?.map((chat) => (
            <div
              key={chat.id}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${
                selectedChatId === chat.id ? 'bg-gray-100' : ''
              }`}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="font-medium">{chat.name}</div>
              <div className="text-sm text-gray-500">{chat.lastMessage?.content || 'No messages yet'}</div>
            </div>
          ))}
          {chats?.length === 0 && (
            <p className="text-center text-muted-foreground">
              {APP_STRINGS.NO_CHATS}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 