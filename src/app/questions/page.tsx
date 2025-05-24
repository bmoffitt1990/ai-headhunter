"use client"

import * as React from "react"
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw,
  Plus,
  Search,
  Filter,
  Tag,
  Clock,
  CheckCircle,
  XCircle,
  Lightbulb
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MainLayout, PageLayout } from "@/components/layout"

interface Question {
  id: string
  question: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  suggestedTime: number // in seconds
  tips?: string[]
  isBookmarked?: boolean
}

interface QuestionSession {
  id: string
  questionId: string
  answer: string
  timeSpent: number
  createdAt: Date
  rating?: number
}

interface VoiceInputProps {
  onTranscription: (text: string) => void
  placeholder?: string
  isRecording?: boolean
  className?: string
}

// Mock data
const mockQuestions: Question[] = [
  {
    id: '1',
    question: 'Tell me about yourself and your background.',
    category: 'General',
    difficulty: 'easy',
    tags: ['introduction', 'background'],
    suggestedTime: 120,
    tips: [
      'Keep it under 2 minutes',
      'Focus on relevant experience',
      'End with why you\'re interested in the role'
    ]
  },
  {
    id: '2',
    question: 'What is your greatest strength?',
    category: 'Behavioral',
    difficulty: 'easy',
    tags: ['strengths', 'self-assessment'],
    suggestedTime: 90,
    tips: [
      'Choose a strength relevant to the job',
      'Provide a specific example',
      'Show impact on your work'
    ]
  },
  {
    id: '3',
    question: 'Describe a challenging project you worked on and how you overcame obstacles.',
    category: 'Behavioral',
    difficulty: 'medium',
    tags: ['problem-solving', 'experience'],
    suggestedTime: 180,
    tips: [
      'Use the STAR method (Situation, Task, Action, Result)',
      'Focus on your specific actions',
      'Quantify the results when possible'
    ]
  },
  {
    id: '4',
    question: 'Where do you see yourself in 5 years?',
    category: 'Career',
    difficulty: 'medium',
    tags: ['career-goals', 'ambition'],
    suggestedTime: 120,
    tips: [
      'Align with the company\'s growth path',
      'Show ambition but be realistic',
      'Mention skill development goals'
    ]
  }
]

/**
 * VoiceInput component for recording and transcribing audio
 */
function VoiceInput({ onTranscription, placeholder, isRecording, className }: VoiceInputProps) {
  const [transcription, setTranscription] = React.useState('')
  const [isListening, setIsListening] = React.useState(false)
  const [recordingTime, setRecordingTime] = React.useState(0)
  
  // Mock voice recording functionality
  const startRecording = () => {
    setIsListening(true)
    setRecordingTime(0)
    
    // Start timer
    const timer = setInterval(() => {
      setRecordingTime(prev => prev + 1)
    }, 1000)
    
    // Mock transcription after 3 seconds
    setTimeout(() => {
      const mockTranscription = "This is a mock transcription of your voice input. In a real implementation, this would use the Web Speech API or a speech-to-text service."
      setTranscription(mockTranscription)
      onTranscription(mockTranscription)
      setIsListening(false)
      clearInterval(timer)
    }, 3000)
  }
  
  const stopRecording = () => {
    setIsListening(false)
    setRecordingTime(0)
  }
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center space-x-3">
        <Button
          variant={isListening ? "destructive" : "outline"}
          size="sm"
          onClick={isListening ? stopRecording : startRecording}
          className="flex items-center space-x-2"
        >
          {isListening ? (
            <>
              <MicOff className="h-4 w-4" />
              <span>Stop Recording</span>
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" />
              <span>Start Recording</span>
            </>
          )}
        </Button>
        
        {isListening && (
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Recording... {formatTime(recordingTime)}
            </span>
          </div>
        )}
      </div>
      
      {transcription && (
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Transcription:</p>
          <p className="text-sm">{transcription}</p>
        </div>
      )}
    </div>
  )
}

/**
 * QuestionCard component for displaying individual questions
 */
function QuestionCard({ 
  question, 
  onStartPractice, 
  onToggleBookmark 
}: { 
  question: Question
  onStartPractice: (question: Question) => void
  onToggleBookmark: (questionId: string) => void
}) {
  const getDifficultyColor = (difficulty: Question['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'hard': return 'text-red-600 bg-red-50'
    }
  }
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{question.question}</CardTitle>
            <CardDescription>
              Category: {question.category} • {question.suggestedTime}s suggested
            </CardDescription>
          </div>
          <Badge className={getDifficultyColor(question.difficulty)}>
            {question.difficulty}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {question.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                <Tag className="mr-1 h-3 w-3" />
                {tag}
              </Badge>
            ))}
          </div>
          
          {/* Tips */}
          {question.tips && question.tips.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Lightbulb className="mr-1 h-4 w-4 text-yellow-500" />
                Tips
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {question.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button
              size="sm"
              onClick={() => onStartPractice(question)}
              className="flex items-center space-x-2"
            >
              <Play className="h-4 w-4" />
              <span>Practice</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleBookmark(question.id)}
              className={cn(
                "flex items-center space-x-2",
                question.isBookmarked && "text-yellow-500"
              )}
            >
              <span>{question.isBookmarked ? '★' : '☆'}</span>
              <span>Bookmark</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * PracticeMode component for answering questions
 */
function PracticeMode({ 
  question, 
  onFinish, 
  onCancel 
}: { 
  question: Question
  onFinish: (session: Omit<QuestionSession, 'id' | 'createdAt'>) => void
  onCancel: () => void
}) {
  const [answer, setAnswer] = React.useState('')
  const [timeElapsed, setTimeElapsed] = React.useState(0)
  const [isStarted, setIsStarted] = React.useState(false)
  const [isPaused, setIsPaused] = React.useState(false)
  
  const timerRef = React.useRef<NodeJS.Timeout>()
  
  const startTimer = () => {
    setIsStarted(true)
    setIsPaused(false)
    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)
  }
  
  const pauseTimer = () => {
    setIsPaused(true)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }
  
  const resetTimer = () => {
    setTimeElapsed(0)
    setIsStarted(false)
    setIsPaused(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }
  
  const handleFinish = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    
    onFinish({
      questionId: question.id,
      answer,
      timeSpent: timeElapsed
    })
  }
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  const progressPercentage = Math.min((timeElapsed / question.suggestedTime) * 100, 100)
  
  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{question.question}</CardTitle>
          <CardDescription>
            Suggested time: {question.suggestedTime}s • Category: {question.category}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Timer and Progress */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-mono">
                {formatTime(timeElapsed)}
              </div>
              <div className="flex items-center space-x-2">
                {!isStarted ? (
                  <Button onClick={startTimer} size="sm">
                    <Play className="mr-2 h-4 w-4" />
                    Start
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={isPaused ? startTimer : pauseTimer}
                      variant="outline"
                      size="sm"
                    >
                      {isPaused ? (
                        <Play className="mr-2 h-4 w-4" />
                      ) : (
                        <Pause className="mr-2 h-4 w-4" />
                      )}
                      {isPaused ? 'Resume' : 'Pause'}
                    </Button>
                    <Button onClick={resetTimer} variant="outline" size="sm">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </div>
          
          {/* Answer Input */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Your Answer</label>
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here or use voice input below..."
                className="min-h-[200px]"
              />
            </div>
            
            {/* Voice Input */}
            <VoiceInput
              onTranscription={(text) => setAnswer(prev => prev + '\n\n' + text)}
              placeholder="Click to start voice recording"
            />
          </div>
          
          {/* Actions */}
          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleFinish} disabled={!answer.trim()}>
              Finish Practice
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * ApplicationQuestions page component
 */
export default function ApplicationQuestionsPage() {
  const [questions] = React.useState<Question[]>(mockQuestions)
  const [filteredQuestions, setFilteredQuestions] = React.useState<Question[]>(mockQuestions)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<string>('all')
  const [practiceQuestion, setPracticeQuestion] = React.useState<Question | null>(null)
  const [sessions, setSessions] = React.useState<QuestionSession[]>([])
  
  const categories = React.useMemo(() => {
    const cats = Array.from(new Set(questions.map(q => q.category)))
    return ['all', ...cats]
  }, [questions])
  
  const difficulties = ['all', 'easy', 'medium', 'hard']
  
  // Filter questions based on search and filters
  React.useEffect(() => {
    let filtered = questions
    
    if (searchQuery) {
      filtered = filtered.filter(q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(q => q.category === selectedCategory)
    }
    
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty === selectedDifficulty)
    }
    
    setFilteredQuestions(filtered)
  }, [questions, searchQuery, selectedCategory, selectedDifficulty])
  
  const handleStartPractice = (question: Question) => {
    setPracticeQuestion(question)
  }
  
  const handleFinishPractice = (sessionData: Omit<QuestionSession, 'id' | 'createdAt'>) => {
    const newSession: QuestionSession = {
      ...sessionData,
      id: Date.now().toString(),
      createdAt: new Date()
    }
    
    setSessions(prev => [newSession, ...prev])
    setPracticeQuestion(null)
  }
  
  const handleToggleBookmark = (questionId: string) => {
    // This would typically update the database
    console.log('Toggle bookmark for question:', questionId)
  }
  
  if (practiceQuestion) {
    return (
      <MainLayout
        title="Practice Mode"
        breadcrumbs={[
          { label: "Questions", href: "/questions" },
          { label: "Practice" }
        ]}
      >
        <PageLayout>
          <PracticeMode
            question={practiceQuestion}
            onFinish={handleFinishPractice}
            onCancel={() => setPracticeQuestion(null)}
          />
        </PageLayout>
      </MainLayout>
    )
  }
  
  return (
    <MainLayout
      title="Interview Questions"
      breadcrumbs={[
        { label: "Questions" }
      ]}
      showSearch={true}
      headerActions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Question
        </Button>
      }
    >
      <PageLayout>
        <Tabs defaultValue="practice" className="space-y-6">
          <TabsList>
            <TabsTrigger value="practice">Practice Questions</TabsTrigger>
            <TabsTrigger value="history">Practice History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="practice" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search questions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((difficulty) => (
                        <SelectItem key={difficulty} value={difficulty}>
                          {difficulty === 'all' ? 'All Levels' : difficulty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            {/* Questions Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {filteredQuestions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  onStartPractice={handleStartPractice}
                  onToggleBookmark={handleToggleBookmark}
                />
              ))}
            </div>
            
            {filteredQuestions.length === 0 && (
              <Card>
                <CardContent className="py-16 text-center">
                  <p className="text-muted-foreground">No questions found matching your criteria.</p>
                  <Button className="mt-4" onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                    setSelectedDifficulty('all')
                  }}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="history" className="space-y-6">
            {sessions.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No practice sessions yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start practicing questions to see your history here.
                  </p>
                  <Button onClick={() => {
                    const practiceTab = document.querySelector('[value="practice"]') as HTMLElement
                    practiceTab?.click()
                  }}>
                    Start Practicing
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => {
                  const question = questions.find(q => q.id === session.questionId)
                  return (
                    <Card key={session.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-medium mb-2">
                              {question?.question || 'Unknown question'}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              Practiced on {session.createdAt.toLocaleDateString()}
                            </p>
                            <div className="flex items-center space-x-4">
                              <span className="text-sm">
                                Time: {Math.floor(session.timeSpent / 60)}:{(session.timeSpent % 60).toString().padStart(2, '0')}
                              </span>
                              {question && (
                                <Badge variant="outline">
                                  {question.category}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </PageLayout>
    </MainLayout>
  )
} 