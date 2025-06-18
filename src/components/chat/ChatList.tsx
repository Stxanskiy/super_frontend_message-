import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/lib/chat-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { APP_STRINGS } from '@/constants/strings';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

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
    createChatMutation.mutate({ name: newChatName.trim(), isGroup: isGroupChat });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {APP_STRINGS.CHATS}
          <Button
            size="sm"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            {APP_STRINGS.CREATE_CHAT}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-center text-muted-foreground">
            No chats available
          </p>
          <p className="text-sm text-muted-foreground text-center">
            Create your first chat to start messaging
          </p>
        </div>
      </CardContent>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{APP_STRINGS.NEW_CHAT}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder={APP_STRINGS.CHAT_NAME}
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="group-chat"
                checked={isGroupChat}
                onCheckedChange={(checked) => setIsGroupChat(checked as boolean)}
              />
              <label htmlFor="group-chat">{APP_STRINGS.GROUP_CHAT}</label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              {APP_STRINGS.CANCEL}
            </Button>
            <Button
              onClick={handleCreateChat}
              disabled={createChatMutation.isPending || !newChatName.trim()}
            >
              {createChatMutation.isPending ? 'Creating...' : APP_STRINGS.CREATE_CHAT}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}; 