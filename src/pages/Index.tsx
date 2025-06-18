import { useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { ConversationList } from "@/components/conversation-list"
import { ChatArea } from "@/components/chat-area"
import { ProfileDrawer } from "@/components/profile-drawer"
import { UserSearch } from "@/components/user-search"
import { FriendsList } from "@/components/friends-list"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Search, Users } from "lucide-react"
import { APP_STRINGS } from '@/constants/strings'

const Index = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("chats")
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleChatCreated = (chatId: string) => {
    setSelectedConversation(chatId)
    setActiveTab("chats")
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <ThemeProvider defaultTheme="light">
      <div className="relative flex h-screen overflow-hidden">
        <Sidebar />
        
        <div className="grid grid-cols-[320px_1fr] flex-1">
          <div className="border-r border-border">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className="p-4 border-b border-border">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="chats" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Чаты
                  </TabsTrigger>
                  <TabsTrigger value="search" className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Поиск
                  </TabsTrigger>
                  <TabsTrigger value="friends" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Друзья
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="chats" className="flex-1 flex flex-col">
                <ConversationList 
                  onSelectConversation={(id) => setSelectedConversation(id)}
                  refreshTrigger={refreshTrigger}
                />
              </TabsContent>

              <TabsContent value="search" className="flex-1 p-4 overflow-auto">
                <UserSearch onChatCreated={handleChatCreated} />
              </TabsContent>

              <TabsContent value="friends" className="flex-1 p-4 overflow-auto">
                <FriendsList onChatCreated={handleChatCreated} />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="relative">
            {selectedConversation ? (
              <ChatArea conversationId={selectedConversation} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="bg-muted/50 rounded-full p-6 mb-4">
                  <User className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">Выберите чат</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Выберите чат из списка или найдите новых друзей
                </p>
                <div className="flex gap-2">
                  <Button onClick={() => setActiveTab("search")}>
                    Найти друзей
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab("friends")}>
                    Мои друзья
                  </Button>
                </div>
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
