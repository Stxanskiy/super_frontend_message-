import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserPlus, MessageSquare, Check, X } from "lucide-react"
import { UserProfile, FriendRequest } from "@/types/api"
import { userService } from "@/lib/user-service"
import { chatService } from "@/lib/chat-service"

interface FriendsListProps {
  onChatCreated?: (chatId: string) => void
}

export function FriendsList({ onChatCreated }: FriendsListProps) {
  const [friends, setFriends] = useState<UserProfile[]>([])
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("friends")

  useEffect(() => {
    loadFriends()
    loadFriendRequests()
  }, [])

  const loadFriends = async () => {
    try {
      setIsLoading(true)
      const friendsData = await userService.getFriends()
      setFriends(friendsData)
    } catch (error) {
      console.error('Error loading friends:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadFriendRequests = async () => {
    try {
      const requestsData = await userService.getFriendRequests()
      setFriendRequests(requestsData)
    } catch (error) {
      console.error('Error loading friend requests:', error)
    }
  }

  const handleAcceptRequest = async (userId: string) => {
    try {
      await userService.acceptFriendRequest(userId)
      // Обновляем списки
      await loadFriends()
      await loadFriendRequests()
    } catch (error) {
      console.error('Error accepting friend request:', error)
    }
  }

  const handleCreateChat = async (userId: string, nickname: string) => {
    try {
      setIsLoading(true)
      const chat = await chatService.createChat({
        name: nickname,
        is_group: false,
        user_ids: [userId]
      })
      onChatCreated?.(chat.id)
    } catch (error) {
      console.error('Error creating chat:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="friends">Друзья ({friends.length})</TabsTrigger>
        <TabsTrigger value="requests">Запросы ({friendRequests.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="friends" className="space-y-4 mt-4">
        {isLoading ? (
          <div className="text-center text-muted-foreground py-4">
            Загрузка друзей...
          </div>
        ) : friends.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            У вас пока нет друзей
          </div>
        ) : (
          <div className="space-y-2">
            {friends.map((friend) => (
              <div key={friend.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={friend.avatarUrl} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {friend.nickname.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{friend.nickname}</p>
                    {friend.about && (
                      <p className="text-sm text-muted-foreground">{friend.about}</p>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCreateChat(friend.id, friend.nickname)}
                  disabled={isLoading}
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Написать
                </Button>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="requests" className="space-y-4 mt-4">
        {friendRequests.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            Нет новых запросов в друзья
          </div>
        ) : (
          <div className="space-y-2">
            {friendRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={request.sender.avatarUrl} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {request.sender.nickname.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{request.sender.nickname}</p>
                    {request.sender.about && (
                      <p className="text-sm text-muted-foreground">{request.sender.about}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleAcceptRequest(request.sender.id)}
                    disabled={isLoading}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Принять
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Отклонить
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
} 