
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Paperclip, Phone, Send, Video } from "lucide-react"
import { useState } from "react"

interface Message {
  id: string
  content: string
  timestamp: string
  sender: "user" | "contact"
}

interface ChatAreaProps {
  className?: string
  conversationId?: string
}

export function ChatArea({ className, conversationId }: ChatAreaProps) {
  const [messageInput, setMessageInput] = useState("")
  
  // Mock data
  const contactName = "Анна Петрова"
  const messages: Message[] = [
    {
      id: "1",
      content: "Привет! Как дела?",
      timestamp: "14:30",
      sender: "contact"
    },
    {
      id: "2",
      content: "Привет! Всё отлично, спасибо. Как у тебя?",
      timestamp: "14:32",
      sender: "user"
    },
    {
      id: "3",
      content: "Тоже хорошо. Работаю над новым проектом.",
      timestamp: "14:33",
      sender: "contact"
    },
    {
      id: "4",
      content: "Интересно! Расскажешь подробнее?",
      timestamp: "14:35",
      sender: "user"
    },
    {
      id: "5",
      content: "Конечно! Это веб-приложение с современным дизайном. Использую новые технологии и интересные решения для пользовательского интерфейса.",
      timestamp: "14:36",
      sender: "contact"
    },
  ]

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim()) return
    
    // Here you would typically send the message to your backend
    console.log("Sending message:", messageInput)
    
    // Clear the input
    setMessageInput("")
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">АП</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium">{contactName}</h2>
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
        {messages.map((message) => (
          <div key={message.id} className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}>
            <div className={cn("message-bubble", message.sender === "user" ? "sent" : "received")}>
              <p>{message.content}</p>
              <span className={cn("text-xs", message.sender === "user" ? "text-primary-foreground/70" : "text-secondary-foreground/70")}>{message.timestamp}</span>
            </div>
          </div>
        ))}
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
