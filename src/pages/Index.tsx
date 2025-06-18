import { useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { ConversationList } from "@/components/conversation-list"
import { ChatArea } from "@/components/chat-area"
import { ProfileDrawer } from "@/components/profile-drawer"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import Navigation from '@/components/Navigation'
import { APP_STRINGS } from '@/constants/strings'

const Index = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <ThemeProvider defaultTheme="light">
      <Navigation />
      <div className="relative flex h-screen overflow-hidden">
        <Sidebar />
        
        <div className="grid grid-cols-[320px_1fr] flex-1">
          <ConversationList 
            onSelectConversation={(id) => setSelectedConversation(id)} 
          />
          
          <div className="relative">
            {selectedConversation ? (
              <ChatArea conversationId={selectedConversation} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="bg-muted/50 rounded-full p-6 mb-4">
                  <User className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">{APP_STRINGS.SELECT_CONVERSATION}</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  {APP_STRINGS.SELECT_CONVERSATION_DESCRIPTION}
                </p>
                <Button>{APP_STRINGS.NEW_MESSAGE}</Button>
              </div>
            )}
            
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
        
        <ProfileDrawer 
          open={profileOpen} 
          onClose={() => setProfileOpen(false)} 
        />
      </div>
    </ThemeProvider>
  )
}

export default Index
