import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/lib/chat-service';
import { Message } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { APP_STRINGS } from '@/constants/strings';
import { MoreVertical, Send, Check, CheckCheck } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useDebounce } from '@/hooks/use-debounce';

interface ChatMessagesProps {
  chatId: string;
}

export const ChatMessages = ({ chatId }: ChatMessagesProps) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const debouncedTyping = useDebounce(isTyping, 1000);

  // Временные данные для демонстрации (в реальном приложении здесь были бы сообщения из WebSocket)
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => chatService.sendMessage(chatId, content),
    onSuccess: (newMessage) => {
      setMessage('');
      setMessages(prev => [...prev, newMessage]);
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
    },
  });

  const editMessageMutation = useMutation({
    mutationFn: ({ messageId, content }: { messageId: string; content: string }) =>
      chatService.editMessage(messageId, content),
    onSuccess: (updatedMessage) => {
      setMessages(prev => prev.map(msg => 
        msg.id === updatedMessage.id ? updatedMessage : msg
      ));
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
      setEditDialogOpen(false);
      setEditingMessage(null);
      setEditedContent('');
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: chatService.deleteMessage,
    onSuccess: (_, messageId) => {
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
      toast({
        title: APP_STRINGS.MESSAGE_DELETED,
        description: APP_STRINGS.MESSAGE_DELETED_SUCCESS,
      });
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessageMutation.mutate(message.trim());
  };

  const handleEditMessage = (msg: Message) => {
    setEditingMessage(msg);
    setEditedContent(msg.content);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingMessage || !editedContent.trim()) return;
    editMessageMutation.mutate({
      messageId: editingMessage.id,
      content: editedContent.trim(),
    });
  };

  const handleDeleteMessage = (messageId: string) => {
    deleteMessageMutation.mutate(messageId);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (debouncedTyping) {
      chatService.sendTypingStatus(chatId, true);
    } else {
      chatService.sendTypingStatus(chatId, false);
    }
  }, [debouncedTyping, chatId]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <ScrollArea ref={scrollRef} className="h-full p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                {APP_STRINGS.NO_MESSAGES}
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.senderId === 'current-user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">
                        {msg.sender?.nickname || 'Unknown'}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleEditMessage(msg)}>
                            {APP_STRINGS.EDIT}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="text-destructive"
                          >
                            {APP_STRINGS.DELETE}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="mt-1">{msg.content}</p>
                    <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                      <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
                      {msg.senderId === 'current-user' && (
                        <div className="flex items-center gap-1">
                          {msg.status === 'sent' && <Check className="h-3 w-3" />}
                          {msg.status === 'delivered' && <CheckCheck className="h-3 w-3" />}
                          {msg.status === 'read' && <CheckCheck className="h-3 w-3 text-blue-500" />}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder={APP_STRINGS.TYPE_MESSAGE}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setIsTyping(true);
            }}
            onKeyPress={handleKeyPress}
            onBlur={() => setIsTyping(false)}
          />
          <Button
            onClick={handleSendMessage}
            disabled={sendMessageMutation.isPending || !message.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{APP_STRINGS.EDIT}</DialogTitle>
          </DialogHeader>
          <Input
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder={APP_STRINGS.TYPE_MESSAGE}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              {APP_STRINGS.CANCEL}
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={editMessageMutation.isPending || !editedContent.trim()}
            >
              {APP_STRINGS.SAVE}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 