"use client"

import * as React from "react"
import { 
  FileText, 
  Send, 
  TrendingUp, 
  Clock, 
  Plus, 
  Upload, 
  Eye,
  BarChart3,
  Users,
  Calendar
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MainLayout, PageLayout } from "@/components/layout"

interface DashboardMetrics {
  totalResumes: number
  applicationsSubmitted: number
  responseRate: number
  lastActivity: Date
}

interface ActivityItem {
  id: string
  type: 'resume_edit' | 'application' | 'feedback' | 'interview'
  title: string
  description: string
  timestamp: Date
  status?: 'completed' | 'pending' | 'in_progress'
}

// Mock data - replace with actual data fetching
const mockMetrics: DashboardMetrics = {
  totalResumes: 3,
  applicationsSubmitted: 12,
  responseRate: 25,
  lastActivity: new Date(),
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'resume_edit',
    title: 'Updated Software Engineer Resume',
    description: 'Added new project and refined skills section',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: 'completed'
  },
  {
    id: '2',
    type: 'application',
    title: 'Applied to Tech Corp',
    description: 'Submitted application for Senior Developer position',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    status: 'pending'
  },
  {
    id: '3',
    type: 'interview',
    title: 'Interview Scheduled',
    description: 'Video interview with StartupXYZ for Friday 2PM',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    status: 'in_progress'
  },
  {
    id: '4',
    type: 'feedback',
    title: 'Resume Feedback Received',
    description: 'AI analysis completed with suggestions',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    status: 'completed'
  }
]

/**
 * MetricCard component for displaying dashboard metrics
 */
function MetricCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend,
  className 
}: {
  title: string
  value: string | number
  description: string
  icon: React.ComponentType<{ className?: string }>
  trend?: { value: number; label: string }
  className?: string
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
        {trend && (
          <div className="flex items-center pt-1">
            <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
            <span className="text-xs text-green-500 font-medium">
              +{trend.value}% {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * ActivityFeed component for displaying recent activities
 */
function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'resume_edit': return FileText
      case 'application': return Send
      case 'interview': return Calendar
      case 'feedback': return BarChart3
      default: return Clock
    }
  }

  const getStatusBadge = (status?: ActivityItem['status']) => {
    if (!status) return null
    
    const variants = {
      completed: { variant: 'default' as const, label: 'Completed' },
      pending: { variant: 'secondary' as const, label: 'Pending' },
      in_progress: { variant: 'outline' as const, label: 'In Progress' }
    }
    
    const config = variants[status]
    return <Badge variant={config.variant} className="text-xs">{config.label}</Badge>
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
        <CardDescription>
          Your latest actions and updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = getActivityIcon(activity.type)
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.title}
                    </p>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(activity.status)}
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * QuickActions component for common dashboard actions
 */
function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
        <CardDescription>
          Get started with common tasks
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <Button className="justify-start h-auto p-4" variant="outline">
          <Plus className="mr-3 h-4 w-4" />
          <div className="text-left">
            <div className="font-medium">Create New Resume</div>
            <div className="text-sm text-muted-foreground">Start from scratch or use a template</div>
          </div>
        </Button>
        
        <Button className="justify-start h-auto p-4" variant="outline">
          <Upload className="mr-3 h-4 w-4" />
          <div className="text-left">
            <div className="font-medium">Import Resume</div>
            <div className="text-sm text-muted-foreground">Upload an existing resume to edit</div>
          </div>
        </Button>
        
        <Button className="justify-start h-auto p-4" variant="outline">
          <Eye className="mr-3 h-4 w-4" />
          <div className="text-left">
            <div className="font-medium">View Applications</div>
            <div className="text-sm text-muted-foreground">Track your job applications</div>
          </div>
        </Button>
      </CardContent>
    </Card>
  )
}

/**
 * EmptyState component for new users
 */
function EmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Welcome to AI Headhunter</h3>
        <p className="text-muted-foreground text-center mb-6 max-w-md">
          Get started by creating your first resume. Our AI will help you craft a professional 
          resume that stands out to employers.
        </p>
        <div className="flex gap-3">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Resume
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import Resume
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Dashboard page component
 */
export default function DashboardPage() {
  const [metrics] = React.useState<DashboardMetrics>(mockMetrics)
  const [activities] = React.useState<ActivityItem[]>(mockActivities)
  
  // Check if user is new (has no resumes)
  const isNewUser = metrics.totalResumes === 0

  return (
    <MainLayout
      title="Dashboard"
      breadcrumbs={[
        { label: "Dashboard" }
      ]}
      showSearch={true}
    >
      <PageLayout>
        {isNewUser ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
            {/* Metrics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Total Resumes"
                value={metrics.totalResumes}
                description="Created resumes"
                icon={FileText}
              />
              <MetricCard
                title="Applications"
                value={metrics.applicationsSubmitted}
                description="Jobs applied to"
                icon={Send}
                trend={{ value: 12, label: "this month" }}
              />
              <MetricCard
                title="Response Rate"
                value={`${metrics.responseRate}%`}
                description="Employer responses"
                icon={TrendingUp}
                trend={{ value: 5, label: "vs last month" }}
              />
              <MetricCard
                title="Last Activity"
                value="2h ago"
                description="Resume updated"
                icon={Clock}
              />
            </div>

            {/* Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Activity Feed - Takes 2/3 width */}
              <div className="lg:col-span-2">
                <ActivityFeed activities={activities} />
              </div>
              
              {/* Quick Actions - Takes 1/3 width */}
              <div>
                <QuickActions />
              </div>
            </div>

            {/* Weekly Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Weekly Progress</CardTitle>
                <CardDescription>
                  Your job search activity this week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Applications Sent</span>
                    <span className="text-sm text-muted-foreground">3 of 5 goal</span>
                  </div>
                  <Progress value={60} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Resume Updates</span>
                    <span className="text-sm text-muted-foreground">2 of 3 goal</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </PageLayout>
    </MainLayout>
  )
} 