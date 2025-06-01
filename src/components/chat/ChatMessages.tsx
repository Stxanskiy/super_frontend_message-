import { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => chatService.getMessages(chatId),
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => chatService.sendMessage(chatId, content),
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
    },
  });

  const editMessageMutation = useMutation({
    mutationFn: ({ messageId, content }: { messageId: string; content: string }) =>
      chatService.editMessage(messageId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
      setEditDialogOpen(false);
      setEditingMessage(null);
      setEditedContent('');
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: chatService.deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
      toast({
        title: APP_STRINGS.MESSAGE_DELETED,
        description: APP_STRINGS.MESSAGE_DELETED_SUCCESS,
      });
    },
  });

  useEffect(() => {
    const handleNewMessage = (newMessage: Message) => {
      queryClient.setQueryData(['messages', chatId], (old: Message[] = []) => [...old, newMessage]);
    };

    chatService.subscribeToMessages(chatId, handleNewMessage);
    return () => {
      chatService.unsubscribeFromMessages(chatId, handleNewMessage);
    };
  }, [chatId, queryClient]);

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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessageMutation.mutate(message);
    }
  };

  const handleEditMessage = () => {
    if (editingMessage && editedContent.trim()) {
      editMessageMutation.mutate({
        messageId: editingMessage.id,
        content: editedContent.trim(),
      });
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading messages...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_id === 'current_user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.sender_id === 'current_user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">{msg.sender.nickname}</span>
                  <span className="text-xs opacity-70">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <p>{msg.content}</p>
                {msg.sender_id === 'current_user' && (
                  <div className="flex justify-end mt-1">
                    {msg.status === 'read' ? (
                      <CheckCheck className="h-3 w-3" />
                    ) : msg.status === 'delivered' ? (
                      <Check className="h-3 w-3" />
                    ) : null}
                  </div>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-2">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => {
                      setEditingMessage(msg);
                      setEditedContent(msg.content);
                      setEditDialogOpen(true);
                    }}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => deleteMessageMutation.mutate(msg.id)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </ScrollArea>
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setIsTyping(true);
            }}
            onBlur={() => setIsTyping(false)}
            placeholder="Type a message..."
            disabled={sendMessageMutation.isPending}
          />
          <Button type="submit" disabled={sendMessageMutation.isPending}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Message</DialogTitle>
          </DialogHeader>
          <Input
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="Edit your message..."
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditMessage} disabled={!editedContent.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 