import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import { ChevronRight, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { authService } from "@/lib/auth-service"
import { useNavigate } from "react-router-dom"

interface ProfileDrawerProps {
  open: boolean
  onClose: () => void
  className?: string
}

export function ProfileDrawer({ open, onClose, className }: ProfileDrawerProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div 
      className={cn(
        "fixed inset-y-0 right-0 w-80 bg-background border-l border-border transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto",
        open ? "translate-x-0" : "translate-x-full",
        className
      )}
    >
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Профиль</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex flex-col items-center mb-6">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src="" />
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">ПИ</AvatarFallback>
          </Avatar>
          <h3 className="text-lg font-medium">Петр Иванов</h3>
          <p className="text-sm text-muted-foreground">Онлайн</p>
        </div>
        
        <Tabs defaultValue="account" className="flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Аккаунт</TabsTrigger>
            <TabsTrigger value="appearance">Внешний вид</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input id="name" defaultValue="Петр Иванов" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue="petr@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Статус</Label>
              <Input id="status" defaultValue="Всегда на связи" />
            </div>
            
            <div className="pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Уведомления</p>
                  <p className="text-sm text-muted-foreground">Получать уведомления о новых сообщениях</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Звуки</p>
                  <p className="text-sm text-muted-foreground">Проигрывать звуки уведомлений</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-6 mt-6">
            <div>
              <Label className="text-base">Тема</Label>
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-muted-foreground">Выберите тему приложения</p>
                <ThemeToggle />
              </div>
            </div>
            
            <div className="space-y-4">
              <Label className="text-base">Цветовая схема</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center">
                  <div className="w-full h-10 rounded-md bg-primary mb-1 cursor-pointer border-2 border-primary" />
                  <span className="text-xs">Основной</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-full h-10 rounded-md bg-[#9b87f5] mb-1 cursor-pointer" />
                  <span className="text-xs">Фиолетовый</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-full h-10 rounded-md bg-[#1EAEDB] mb-1 cursor-pointer" />
                  <span className="text-xs">Синий</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-medium">Компактный режим</p>
                <Switch />
              </div>
              <p className="text-sm text-muted-foreground">Уменьшает отступы и размер элементов</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-medium">Анимации</p>
                <Switch defaultChecked />
              </div>
              <p className="text-sm text-muted-foreground">Включает анимации интерфейса</p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="pt-6 border-t border-border mt-6">
          <Button 
            variant="ghost" 
            className="w-full justify-between"
            onClick={handleLogout}
          >
            Выйти
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
