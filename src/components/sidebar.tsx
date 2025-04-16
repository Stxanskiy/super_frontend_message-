
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, MessageSquare, Settings, Users, Menu, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div 
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && <h1 className="text-xl font-semibold text-sidebar-foreground">Messenger</h1>}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground"
        >
          {collapsed ? <Menu /> : <ChevronLeft />}
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          <Button variant="ghost" className={cn("flex justify-start gap-3 text-sidebar-foreground",
            collapsed && "justify-center px-0")}>
            <MessageSquare className="h-5 w-5" />
            {!collapsed && <span>Messages</span>}
          </Button>
          <Button variant="ghost" className={cn("flex justify-start gap-3 text-sidebar-foreground",
            collapsed && "justify-center px-0")}>
            <Users className="h-5 w-5" />
            {!collapsed && <span>Contacts</span>}
          </Button>
          <Button variant="ghost" className={cn("flex justify-start gap-3 text-sidebar-foreground",
            collapsed && "justify-center px-0")}>
            <Bell className="h-5 w-5" />
            {!collapsed && <span>Notifications</span>}
          </Button>
          <Button variant="ghost" className={cn("flex justify-start gap-3 text-sidebar-foreground",
            collapsed && "justify-center px-0")}>
            <Settings className="h-5 w-5" />
            {!collapsed && <span>Settings</span>}
          </Button>
        </nav>
      </div>

      <div className="mt-auto border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary text-primary-foreground">ПИ</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-sidebar-foreground">Петр Иванов</span>
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          )}
          {!collapsed && <ThemeToggle />}
        </div>
      </div>
    </div>
  )
}
