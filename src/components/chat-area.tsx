import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Paperclip, Phone, Send, Video } from "lucide-react"
import { useState, useEffect } from "react"
import { Message, Chat } from "@/types/api"
import { chatService } from "@/lib/chat-service"
import { useAuth } from "@/context/AuthContext"

interface ChatAreaProps {
  className?: string
  conversationId?: string
}

export function ChatArea({ className, conversationId }: ChatAreaProps) {
  const [messageInput, setMessageInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [currentChat, setCurrentChat] = useState<Chat | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { userId } = useAuth()

  useEffect(() => {
    if (conversationId) {
      loadChatData()
      loadMessages()
    }
  }, [conversationId])

  const loadChatData = async () => {
    if (!conversationId) return
    
    try {
      const chats = await chatService.getChats()
      const chat = chats.find(c => c.id === conversationId)
      setCurrentChat(chat || null)
    } catch (error) {
      console.error('Error loading chat data:', error)
    }
  }

  const loadMessages = async () => {
    if (!conversationId) return
    
    try {
      setIsLoading(true)
      const messagesData = await chatService.getChatMessages(conversationId)
      setMessages(messagesData)
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim() || !conversationId) return
    
    try {
      const newMessage = await chatService.sendMessage(conversationId, {
        content: messageInput
      })
      setMessages(prev => [...prev, newMessage])
      setMessageInput("")
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  if (!conversationId) {
    return (
      <div className={cn("flex flex-col h-full items-center justify-center", className)}>
        <div className="text-muted-foreground">Выберите чат для начала общения</div>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {currentChat?.name.split(" ").map(n => n[0]).join("") || "Ч"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium">{currentChat?.name || "Загрузка..."}</h2>
            <p className="text-xs text-muted-foreground">В сети</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Video className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Messages area */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Загрузка сообщений...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Нет сообщений</div>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={cn("flex", message.sender_id === userId ? "justify-end" : "justify-start")}>
              <div className={cn("message-bubble", message.sender_id === userId ? "sent" : "received")}>
                <p>{message.content}</p>
                <span className={cn("text-xs", message.sender_id === userId ? "text-primary-foreground/70" : "text-secondary-foreground/70")}>
                  {formatTime(message.created_at)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Message input */}
      <div className="p-4 border-t border-border">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Button variant="ghost" size="icon" type="button" className="flex-shrink-0">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input 
            placeholder="Введите сообщение..." 
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" className="rounded-full flex-shrink-0">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
