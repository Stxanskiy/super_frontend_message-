import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Chat } from "@/types/api"
import { chatService } from "@/lib/chat-service"

interface ConversationListProps {
  className?: string
  onSelectConversation: (id: string) => void
  refreshTrigger?: number
}

export function ConversationList({ className, onSelectConversation, refreshTrigger }: ConversationListProps) {
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [chats, setChats] = useState<Chat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadChats()
  }, [refreshTrigger])

  const loadChats = async () => {
    try {
      setIsLoading(true)
      const chatsData = await chatService.getChats()
      setChats(chatsData)
    } catch (error) {
      console.error('Error loading chats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectConversation = (id: string) => {
    setActiveConversation(id)
    onSelectConversation(id)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 48) {
      return 'Вчера'
    } else {
      return date.toLocaleDateString('ru-RU', { weekday: 'short' })
    }
  }

  return (
    <div className={cn("flex flex-col h-full border-r border-border", className)}>
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-semibold mb-4">Сообщения</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Поиск" 
            className="pl-10 bg-secondary/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-muted-foreground">Загрузка чатов...</div>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-muted-foreground">
              {searchQuery ? 'Чаты не найдены' : 'Нет чатов'}
            </div>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div 
              key={chat.id}
              className={cn(
                "flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors",
                activeConversation === chat.id && "bg-muted"
              )}
              onClick={() => handleSelectConversation(chat.id)}
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {chat.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium truncate">{chat.name}</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {chat.last_message ? formatTime(chat.last_message.created_at) : ''}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate">
                    {chat.last_message?.content || 'Нет сообщений'}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
