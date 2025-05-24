"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { AppSidebar } from "./AppSidebar"
import { TopHeader } from "./TopHeader"
import { SidebarProvider } from "@/components/ui/sidebar"

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

interface MainLayoutProps {
  children: React.ReactNode
  sidebar?: boolean
  className?: string
  user?: User | null
  title?: string
  breadcrumbs?: BreadcrumbItem[]
  headerActions?: React.ReactNode
  showSearch?: boolean
  loading?: boolean
  onLogout?: () => void
}

/**
 * Error Boundary component for layout stability
 */
class LayoutErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Layout Error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <h2 className="text-lg font-semibold">Something went wrong</h2>
              <p className="text-muted-foreground">
                An error occurred while loading the page.
              </p>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
              >
                Try again
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}

/**
 * Loading skeleton component
 */
function LoadingSkeleton() {
  return (
    <div className="flex h-screen">
      {/* Sidebar skeleton */}
      <div className="hidden lg:flex w-sidebar border-r bg-card">
        <div className="flex flex-col w-full">
          <div className="h-16 border-b px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-muted animate-skeleton" />
              <div className="space-y-1">
                <div className="h-4 w-32 bg-muted animate-skeleton" />
                <div className="h-3 w-24 bg-muted animate-skeleton" />
              </div>
            </div>
          </div>
          <div className="flex-1 px-3 py-4 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-muted animate-skeleton rounded-md" />
            ))}
          </div>
        </div>
      </div>
      
      {/* Main content skeleton */}
      <div className="flex-1 flex flex-col">
        <div className="h-14 border-b bg-muted animate-skeleton" />
        <div className="flex-1 p-6 space-y-4">
          <div className="h-8 w-64 bg-muted animate-skeleton" />
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted animate-skeleton rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * MainLayout component that provides the overall application layout structure
 * with sidebar navigation, header, and main content area
 */
export function MainLayout({
  children,
  sidebar = true,
  className,
  user,
  title,
  breadcrumbs,
  headerActions,
  showSearch = false,
  loading = false,
  onLogout,
}: MainLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleNavigation = React.useCallback((path: string) => {
    router.push(path)
  }, [router])

  const handleLogout = React.useCallback(() => {
    if (onLogout) {
      onLogout()
    } else {
      // Default logout behavior
      router.push("/login")
    }
  }, [onLogout, router])

  if (loading) {
    return <LoadingSkeleton />
  }

  if (!sidebar) {
    // Simple layout without sidebar
    return (
      <LayoutErrorBoundary>
        <div className={cn("min-h-screen bg-background", className)}>
          <TopHeader
            title={title}
            breadcrumbs={breadcrumbs}
            actions={headerActions}
            user={user}
            showSearch={showSearch}
            className="print:hidden"
          />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </LayoutErrorBoundary>
    )
  }

  return (
    <LayoutErrorBoundary>
      <div className={cn("min-h-screen bg-background", className)}>
        <SidebarProvider>
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar - Hidden on print */}
            <aside className="print:hidden">
              <AppSidebar
                user={user}
                currentPath={pathname}
                onNavigate={handleNavigation}
                onLogout={handleLogout}
              />
            </aside>

            {/* Main content area */}
            <div className="flex flex-1 flex-col min-w-0">
              {/* Header - Hidden on print */}
              <TopHeader
                title={title}
                breadcrumbs={breadcrumbs}
                actions={headerActions}
                user={user}
                showSearch={showSearch}
                className="print:hidden"
              />

              {/* Main content */}
              <main 
                className={cn(
                  "flex-1 overflow-auto bg-background",
                  "print:overflow-visible print:h-auto"
                )}
                role="main"
                aria-label="Main content"
              >
                <div className="h-full">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </LayoutErrorBoundary>
  )
}

/**
 * Page wrapper component for consistent page layouts
 */
export function PageLayout({
  children,
  title,
  description,
  actions,
  className,
  maxWidth = "7xl",
}: {
  children: React.ReactNode
  title?: string
  description?: string
  actions?: React.ReactNode
  className?: string
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full"
}) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md", 
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    full: "max-w-full",
  }

  return (
    <div className={cn("container mx-auto p-6", maxWidthClasses[maxWidth], className)}>
      {(title || description || actions) && (
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              {title && (
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
              )}
              {description && (
                <p className="text-muted-foreground">{description}</p>
              )}
            </div>
            {actions && (
              <div className="flex items-center space-x-2">{actions}</div>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  )
} 