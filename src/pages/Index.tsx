
import { useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { ConversationList } from "@/components/conversation-list"
import { ChatArea } from "@/components/chat-area"
import { ProfileDrawer } from "@/components/profile-drawer"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

const Index = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <ThemeProvider defaultTheme="light">
      <div className="relative flex h-screen overflow-hidden">
        {/* Main sidebar */}
        <Sidebar />
        
        {/* Conversations */}
        <div className="grid grid-cols-[320px_1fr] flex-1">
          <ConversationList 
            onSelectConversation={(id) => setSelectedConversation(id)} 
          />
          
          {/* Chat area */}
          <div className="relative">
            {selectedConversation ? (
              <ChatArea conversationId={selectedConversation} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="bg-muted/50 rounded-full p-6 mb-4">
                  <User className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">Выберите диалог</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Выберите существующий диалог из списка слева или начните новую беседу
                </p>
                <Button>Новое сообщение</Button>
              </div>
            )}
            
            {/* Profile button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4 rounded-full"
              onClick={() => setProfileOpen(true)}
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Profile drawer */}
        <ProfileDrawer 
          open={profileOpen} 
          onClose={() => setProfileOpen(false)} 
        />
      </div>
    </ThemeProvider>
  )
}

export default Index
