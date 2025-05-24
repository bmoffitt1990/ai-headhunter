"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  History,
  Settings,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
}

interface AppSidebarProps {
  user?: User | null
  currentPath?: string
  onNavigate?: (path: string) => void
  onLogout?: () => void
}

const navigationItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/dashboard",
    description: "Overview and metrics"
  },
  {
    icon: FileText,
    label: "Resume Builder",
    path: "/resume",
    description: "Create and edit resumes"
  },
  {
    icon: MessageSquare,
    label: "Application Questions",
    path: "/questions",
    description: "Practice interview questions"
  },
  {
    icon: History,
    label: "History",
    path: "/history",
    description: "Activity and feedback"
  },
  {
    icon: Settings,
    label: "Settings",
    path: "/settings",
    description: "Account preferences"
  },
]

export function AppSidebar({ user, currentPath, onNavigate, onLogout }: AppSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { state } = useSidebar()
  
  const currentPathName = currentPath || pathname
  const isCollapsed = state === "collapsed"

  const handleNavigation = (path: string) => {
    if (onNavigate) {
      onNavigate(path)
    } else {
      router.push(path)
    }
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
  }

  const getUserInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    if (email) {
      return email.slice(0, 2).toUpperCase()
    }
    return "U"
  }

  return (
    <Sidebar className="border-r bg-card">
      {/* Header */}
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
            <span className="text-sm font-bold">AI</span>
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-semibold text-foreground">AI Headhunter</h1>
              <p className="text-xs text-muted-foreground">Resume Builder</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="px-3 py-4">
        <SidebarMenu>
          {navigationItems.map((item) => {
            const isActive = currentPathName === item.path
            const Icon = item.icon

            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "w-full justify-start px-3 py-2.5 text-sm font-medium transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive && "bg-accent text-accent-foreground border border-border"
                  )}
                  aria-current={isActive ? "page" : undefined}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {!isCollapsed && (
                    <span className="ml-3 truncate">{item.label}</span>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer - User Profile */}
      <SidebarFooter className="border-t p-3">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start p-2 h-auto",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
                aria-label="User menu"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={user.avatar_url} alt={user.full_name || user.email} />
                    <AvatarFallback className="bg-brand-500 text-white text-xs">
                      {getUserInitials(user.full_name, user.email)}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user.full_name || user.email}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={() => handleNavigation("/profile")}
                className="cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleNavigation("/settings")}
                className="cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleNavigation("/login")}
              className="w-full"
            >
              Sign In
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
} 