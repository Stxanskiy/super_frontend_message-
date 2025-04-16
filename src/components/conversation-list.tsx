
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface Conversation {
  id: string
  name: string
  avatar?: string
  message: string
  time: string
  unread: number
}

interface ConversationListProps {
  className?: string
  onSelectConversation: (id: string) => void
}

export function ConversationList({ className, onSelectConversation }: ConversationListProps) {
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  
  // Mock data
  const conversations: Conversation[] = [
    {
      id: "1",
      name: "Анна Петрова",
      message: "Привет! Как дела?",
      time: "14:30",
      unread: 2,
    },
    {
      id: "2",
      name: "Иван Смирнов",
      message: "Отправил документы на проверку",
      time: "12:45",
      unread: 0,
    },
    {
      id: "3",
      name: "Елена Иванова",
      message: "Встретимся завтра в 10:00",
      time: "Вчера",
      unread: 0,
    },
    {
      id: "4",
      name: "Максим Козлов",
      message: "Спасибо за информацию!",
      time: "Вчера",
      unread: 1,
    },
    {
      id: "5",
      name: "Ольга Николаева",
      message: "Проект почти готов",
      time: "Пн",
      unread: 0,
    },
  ]

  const handleSelectConversation = (id: string) => {
    setActiveConversation(id)
    onSelectConversation(id)
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
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {conversations.map((conversation) => (
          <div 
            key={conversation.id}
            className={cn(
              "flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors",
              activeConversation === conversation.id && "bg-muted"
            )}
            onClick={() => handleSelectConversation(conversation.id)}
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={conversation.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {conversation.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-medium truncate">{conversation.name}</span>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{conversation.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground truncate">{conversation.message}</p>
                {conversation.unread > 0 && (
                  <span className="rounded-full bg-primary text-primary-foreground text-xs px-2 py-0.5 min-w-[1.25rem] text-center">
                    {conversation.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
