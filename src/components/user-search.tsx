import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, UserPlus, MessageSquare } from "lucide-react"
import { UserProfile } from "@/types/api"
import { userService } from "@/lib/user-service"
import { chatService } from "@/lib/chat-service"
import { useAuth } from "@/context/AuthContext"

interface UserSearchProps {
  onChatCreated?: (chatId: string) => void
}

export function UserSearch({ onChatCreated }: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<UserProfile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const { userId } = useAuth()

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      setIsSearching(true)
      const searchResults = await userService.searchUsers(searchQuery)
      // Исключаем текущего пользователя из результатов
      const filteredUsers = searchResults.filter(user => user.id !== userId)
      setUsers(filteredUsers)
    } catch (error) {
      console.error('Error searching users:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleAddFriend = async (targetUserId: string) => {
    try {
      setIsLoading(true)
      await userService.sendFriendRequest(targetUserId)
      // Обновляем список пользователей, убирая того, кому отправили запрос
      setUsers(prev => prev.filter(user => user.id !== targetUserId))
    } catch (error) {
      console.error('Error sending friend request:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateChat = async (targetUserId: string, nickname: string) => {
    try {
      setIsLoading(true)
      const chat = await chatService.createChat({
        name: nickname,
        is_group: false,
        user_ids: [targetUserId]
      })
      onChatCreated?.(chat.id)
      // Убираем пользователя из списка после создания чата
      setUsers(prev => prev.filter(user => user.id !== targetUserId))
    } catch (error) {
      console.error('Error creating chat:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Поиск пользователей по никнейму..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button 
          onClick={handleSearch} 
          disabled={isSearching || !searchQuery.trim()}
          variant="outline"
        >
          {isSearching ? "Поиск..." : "Найти"}
        </Button>
      </div>

      {users.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Найденные пользователи:</h3>
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {user.nickname.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.nickname}</p>
                  {user.about && (
                    <p className="text-sm text-muted-foreground">{user.about}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCreateChat(user.id, user.nickname)}
                  disabled={isLoading}
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Чат
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleAddFriend(user.id)}
                  disabled={isLoading}
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  В друзья
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {searchQuery && users.length === 0 && !isSearching && (
        <div className="text-center text-muted-foreground py-4">
          Пользователи не найдены
        </div>
      )}
    </div>
  )
} 