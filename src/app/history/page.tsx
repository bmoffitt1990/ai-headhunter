"use client"

import * as React from "react"
import { 
  Calendar,
  Filter,
  Download,
  Search,
  ChevronDown,
  ChevronUp,
  Eye,
  Edit,
  Trash2,
  FileText,
  Send,
  MessageSquare,
  User,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  MoreHorizontal
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MainLayout, PageLayout } from "@/components/layout"

interface HistoryEntry {
  id: string
  type: 'resume_edit' | 'application' | 'feedback' | 'interview' | 'export'
  title: string
  description: string
  status: 'pending' | 'completed' | 'failed' | 'in_progress'
  createdAt: Date
  updatedAt: Date
  metadata?: Record<string, any>
}

// Mock data
const mockHistory: HistoryEntry[] = [
  {
    id: '1',
    type: 'resume_edit',
    title: 'Updated Software Engineer Resume',
    description: 'Added new project and refined skills section',
    status: 'completed',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    metadata: {
      resumeId: 'resume-1',
      changes: ['projects', 'skills'],
      version: '1.2'
    }
  },
  {
    id: '2',
    type: 'application',
    title: 'Applied to Tech Corp',
    description: 'Submitted application for Senior Developer position',
    status: 'pending',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    metadata: {
      company: 'Tech Corp',
      position: 'Senior Developer',
      resumeUsed: 'resume-1'
    }
  },
  {
    id: '3',
    type: 'export',
    title: 'Resume PDF Export',
    description: 'Downloaded resume as PDF for job application',
    status: 'completed',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    metadata: {
      format: 'pdf',
      template: 'professional',
      fileSize: '2.3MB'
    }
  },
  {
    id: '4',
    type: 'feedback',
    title: 'AI Resume Analysis',
    description: 'Received feedback on resume optimization',
    status: 'completed',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    metadata: {
      score: 85,
      suggestions: 12,
      categories: ['formatting', 'content', 'keywords']
    }
  },
  {
    id: '5',
    type: 'interview',
    title: 'Practice Interview Session',
    description: 'Completed mock interview for behavioral questions',
    status: 'completed',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    metadata: {
      duration: 1800, // 30 minutes
      questionsAnswered: 8,
      averageTime: 225 // seconds per question
    }
  }
]

/**
 * Get icon for entry type
 */
function getTypeIcon(type: HistoryEntry['type']) {
  switch (type) {
    case 'resume_edit': return FileText
    case 'application': return Send
    case 'feedback': return BarChart3
    case 'interview': return MessageSquare
    case 'export': return Download
    default: return Clock
  }
}

/**
 * Get status badge variant and text
 */
function getStatusInfo(status: HistoryEntry['status']) {
  switch (status) {
    case 'completed':
      return { variant: 'default' as const, label: 'Completed', icon: CheckCircle }
    case 'pending':
      return { variant: 'secondary' as const, label: 'Pending', icon: Clock }
    case 'failed':
      return { variant: 'destructive' as const, label: 'Failed', icon: XCircle }
    case 'in_progress':
      return { variant: 'outline' as const, label: 'In Progress', icon: Clock }
    default:
      return { variant: 'outline' as const, label: 'Unknown', icon: Clock }
  }
}

/**
 * Format relative time
 */
function formatRelativeTime(date: Date) {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) return `${diffInDays}d ago`
  
  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) return `${diffInMonths}mo ago`
  
  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears}y ago`
}

/**
 * ActivityTimeline component
 */
function ActivityTimeline({ entries }: { entries: HistoryEntry[] }) {
  return (
    <div className="space-y-4">
      {entries.map((entry, index) => {
        const Icon = getTypeIcon(entry.type)
        const statusInfo = getStatusInfo(entry.status)
        const StatusIcon = statusInfo.icon
        
        return (
          <div key={entry.id} className="relative">
            {/* Timeline line */}
            {index < entries.length - 1 && (
              <div className="absolute left-5 top-12 h-8 w-0.5 bg-border" />
            )}
            
            <div className="flex items-start space-x-4">
              {/* Icon */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground truncate">
                    {entry.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Badge variant={statusInfo.variant} className="text-xs">
                      <StatusIcon className="mr-1 h-3 w-3" />
                      {statusInfo.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(entry.createdAt)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {entry.description}
                </p>
                
                {/* Metadata */}
                {entry.metadata && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Object.entries(entry.metadata).slice(0, 3).map(([key, value]) => (
                      <span key={key} className="text-xs bg-muted px-2 py-1 rounded">
                        {key}: {String(value)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  {entry.type === 'resume_edit' && (
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Open Resume
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Entry
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/**
 * HistoryTable component
 */
function HistoryTable({ entries }: { entries: HistoryEntry[] }) {
  const [sortField, setSortField] = React.useState<keyof HistoryEntry>('createdAt')
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc')
  
  const handleSort = (field: keyof HistoryEntry) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }
  
  const sortedEntries = React.useMemo(() => {
    return [...entries].sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      let comparison = 0
      if (aValue < bValue) comparison = -1
      if (aValue > bValue) comparison = 1
      
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [entries, sortField, sortDirection])
  
  const SortIcon = ({ field }: { field: keyof HistoryEntry }) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? 
      <ChevronUp className="ml-1 h-4 w-4" /> : 
      <ChevronDown className="ml-1 h-4 w-4" />
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('title')}
            >
              <div className="flex items-center">
                Title
                <SortIcon field="title" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('status')}
            >
              <div className="flex items-center">
                Status
                <SortIcon field="status" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('createdAt')}
            >
              <div className="flex items-center">
                Date
                <SortIcon field="createdAt" />
              </div>
            </TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEntries.map((entry) => {
            const Icon = getTypeIcon(entry.type)
            const statusInfo = getStatusInfo(entry.status)
            const StatusIcon = statusInfo.icon
            
            return (
              <TableRow key={entry.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm capitalize">{entry.type.replace('_', ' ')}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{entry.title}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-xs">
                      {entry.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusInfo.variant} className="text-xs">
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {statusInfo.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {entry.createdAt.toLocaleDateString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatRelativeTime(entry.createdAt)}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      {entry.type === 'resume_edit' && (
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Open Resume
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Entry
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

/**
 * HistoryStats component
 */
function HistoryStats({ entries }: { entries: HistoryEntry[] }) {
  const stats = React.useMemo(() => {
    const totalEntries = entries.length
    const completedEntries = entries.filter(e => e.status === 'completed').length
    const recentEntries = entries.filter(e => 
      Date.now() - e.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000 // Last 7 days
    ).length
    
    const typeStats = entries.reduce((acc, entry) => {
      acc[entry.type] = (acc[entry.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return {
      total: totalEntries,
      completed: completedEntries,
      recent: recentEntries,
      completionRate: totalEntries > 0 ? Math.round((completedEntries / totalEntries) * 100) : 0,
      types: typeStats
    }
  }, [entries])
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div className="ml-2">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Activities</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <div className="ml-2">
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="ml-2">
              <p className="text-2xl font-bold">{stats.recent}</p>
              <p className="text-xs text-muted-foreground">This Week</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <div className="ml-2">
              <p className="text-2xl font-bold">{stats.completionRate}%</p>
              <p className="text-xs text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * History page component
 */
export default function HistoryPage() {
  const [history, setHistory] = React.useState<HistoryEntry[]>(mockHistory)
  const [filteredHistory, setFilteredHistory] = React.useState<HistoryEntry[]>(mockHistory)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedType, setSelectedType] = React.useState<string>('all')
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all')
  const [dateRange, setDateRange] = React.useState<string>('all')
  
  const types = React.useMemo(() => {
    const uniqueTypes = Array.from(new Set(history.map(h => h.type)))
    return ['all', ...uniqueTypes]
  }, [history])
  
  const statuses = ['all', 'completed', 'pending', 'failed', 'in_progress']
  
  // Filter history based on search and filters
  React.useEffect(() => {
    let filtered = history
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(h => 
        h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(h => h.type === selectedType)
    }
    
    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(h => h.status === selectedStatus)
    }
    
    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date()
      let cutoffDate: Date
      
      switch (dateRange) {
        case 'today':
          cutoffDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case 'week':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        default:
          cutoffDate = new Date(0)
      }
      
      filtered = filtered.filter(h => h.createdAt >= cutoffDate)
    }
    
    setFilteredHistory(filtered)
  }, [history, searchQuery, selectedType, selectedStatus, dateRange])
  
  const handleExport = () => {
    const csvContent = [
      ['Type', 'Title', 'Description', 'Status', 'Date'],
      ...filteredHistory.map(entry => [
        entry.type,
        entry.title,
        entry.description,
        entry.status,
        entry.createdAt.toISOString()
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'activity-history.csv'
    a.click()
    URL.revokeObjectURL(url)
  }
  
  return (
    <MainLayout
      title="Activity History"
      breadcrumbs={[
        { label: "History" }
      ]}
      showSearch={true}
      headerActions={
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      }
    >
      <PageLayout>
        <div className="space-y-6">
          {/* Stats */}
          <HistoryStats entries={filteredHistory} />
          
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search activities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type === 'all' ? 'All Types' : type.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status === 'all' ? 'All Status' : status.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          {/* Content */}
          <Tabs defaultValue="timeline" className="space-y-4">
            <TabsList>
              <TabsTrigger value="timeline">Timeline View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="timeline">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
                  <CardDescription>
                    Chronological view of your recent activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredHistory.length === 0 ? (
                    <div className="py-16 text-center">
                      <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No activities found</h3>
                      <p className="text-muted-foreground mb-4">
                        No activities match your current filters.
                      </p>
                      <Button onClick={() => {
                        setSearchQuery('')
                        setSelectedType('all')
                        setSelectedStatus('all')
                        setDateRange('all')
                      }}>
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    <ActivityTimeline entries={filteredHistory} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="table">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Table</CardTitle>
                  <CardDescription>
                    Detailed view with sorting and filtering capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredHistory.length === 0 ? (
                    <div className="py-16 text-center">
                      <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No activities found</h3>
                      <p className="text-muted-foreground mb-4">
                        No activities match your current filters.
                      </p>
                      <Button onClick={() => {
                        setSearchQuery('')
                        setSelectedType('all')
                        setSelectedStatus('all')
                        setDateRange('all')
                      }}>
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    <HistoryTable entries={filteredHistory} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PageLayout>
    </MainLayout>
  )
} 