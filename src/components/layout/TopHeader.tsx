"use client"

import * as React from "react"
import { Bell, Menu, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
}

interface BreadcrumbItem {
  label: string
  href?: string
}

interface TopHeaderProps {
  title?: string
  showBreadcrumbs?: boolean
  breadcrumbs?: BreadcrumbItem[]
  actions?: React.ReactNode
  user?: User | null
  showSearch?: boolean
  notificationCount?: number
  onNotificationClick?: () => void
  className?: string
}

/**
 * TopHeader component that provides page title, breadcrumb navigation,
 * search functionality, notifications, and header actions
 */
export function TopHeader({
  title,
  showBreadcrumbs = true,
  breadcrumbs = [],
  actions,
  user,
  showSearch = false,
  notificationCount = 0,
  onNotificationClick,
  className
}: TopHeaderProps) {
  const [searchQuery, setSearchQuery] = React.useState("")

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement search functionality
    console.log("Search query:", searchQuery)
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="flex h-14 items-center px-4 lg:px-6">
        {/* Mobile sidebar trigger */}
        <div className="flex items-center space-x-4 lg:space-x-6">
          <SidebarTrigger className="lg:hidden" />
          
          {/* Breadcrumbs and Title */}
          <div className="flex flex-col space-y-1 min-w-0">
            {showBreadcrumbs && breadcrumbs.length > 0 && (
              <Breadcrumb className="hidden md:flex">
                <BreadcrumbList>
                  {breadcrumbs.map((breadcrumb, index) => (
                    <React.Fragment key={index}>
                      <BreadcrumbItem>
                        {breadcrumb.href ? (
                          <BreadcrumbLink
                            href={breadcrumb.href}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            {breadcrumb.label}
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage className="font-medium">
                            {breadcrumb.label}
                          </BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            )}
            
            {title && (
              <h1 className="text-lg font-semibold text-foreground truncate md:text-xl">
                {title}
              </h1>
            )}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right-aligned actions */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Search */}
          {showSearch && (
            <form onSubmit={handleSearchSubmit} className="hidden sm:block">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-[200px] pl-8 lg:w-[300px]"
                />
              </div>
            </form>
          )}

          {/* Custom actions */}
          {actions && (
            <div className="hidden sm:flex items-center space-x-2">
              {actions}
            </div>
          )}

          {/* Notifications */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative h-9 w-9 p-0"
                  onClick={onNotificationClick}
                  aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount} unread)` : ''}`}
                >
                  <Bell className="h-4 w-4" />
                  {notificationCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                    >
                      {notificationCount > 99 ? "99+" : notificationCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="px-4 py-2 border-b">
                  <h4 className="font-medium">Notifications</h4>
                  {notificationCount > 0 && (
                    <p className="text-sm text-muted-foreground">
                      You have {notificationCount} unread notification{notificationCount !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                {notificationCount === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      No new notifications
                    </p>
                  </div>
                ) : (
                  <div className="max-h-64 overflow-y-auto">
                    {/* TODO: Replace with actual notification items */}
                    {Array.from({ length: Math.min(notificationCount, 5) }).map((_, index) => (
                      <DropdownMenuItem key={index} className="px-4 py-3 cursor-pointer">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">Sample notification {index + 1}</p>
                          <p className="text-xs text-muted-foreground">
                            This is a sample notification message
                          </p>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile actions menu */}
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {showSearch && (
                  <div className="px-3 py-2">
                    <form onSubmit={handleSearchSubmit}>
                      <Input
                        type="search"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                      />
                    </form>
                  </div>
                )}
                {actions && (
                  <div className="px-3 py-2 border-t">
                    {actions}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
} 