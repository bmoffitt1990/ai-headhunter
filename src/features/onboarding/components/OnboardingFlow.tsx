"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Check, Briefcase, User, Target, FileText } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface OnboardingStep {
  id: string
  title: string
  description: string
  component: React.ComponentType<OnboardingStepProps>
  required: boolean
  icon: React.ComponentType<{ className?: string }>
}

interface OnboardingStepProps {
  onNext: () => void
  onSkip?: () => void
  onDataChange: (data: any) => void
  data: any
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    description: 'Get started with AI Headhunter',
    component: WelcomeStep,
    required: true,
    icon: User
  },
  {
    id: 'profile',
    title: 'Profile Setup',
    description: 'Tell us about yourself',
    component: ProfileStep,
    required: true,
    icon: User
  },
  {
    id: 'preferences',
    title: 'Job Preferences',
    description: 'What type of roles are you seeking?',
    component: PreferencesStep,
    required: false,
    icon: Target
  },
  {
    id: 'first-resume',
    title: 'Create Resume',
    description: 'Build your first resume',
    component: ResumeStep,
    required: false,
    icon: FileText
  }
]

/**
 * WelcomeStep component
 */
function WelcomeStep({ onNext }: OnboardingStepProps) {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-white">
          <span className="text-2xl font-bold">AI</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Welcome to AI Headhunter</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Let's get you set up with a professional resume that stands out to employers. 
          This quick setup will only take a few minutes.
        </p>
      </div>

      <div className="grid gap-4 max-w-md mx-auto">
        <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
          <Check className="h-5 w-5 text-green-500 shrink-0" />
          <span className="text-sm">AI-powered resume optimization</span>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
          <Check className="h-5 w-5 text-green-500 shrink-0" />
          <span className="text-sm">Multiple professional templates</span>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
          <Check className="h-5 w-5 text-green-500 shrink-0" />
          <span className="text-sm">ATS-friendly formatting</span>
        </div>
      </div>

      <Button onClick={onNext} size="lg" className="w-full max-w-xs">
        Get Started
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}

/**
 * ProfileStep component
 */
function ProfileStep({ onNext, onDataChange, data }: OnboardingStepProps) {
  const [formData, setFormData] = React.useState({
    fullName: data?.fullName || '',
    email: data?.email || '',
    phone: data?.phone || '',
    location: data?.location || '',
    linkedIn: data?.linkedIn || '',
    website: data?.website || ''
  })

  const handleChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    onDataChange(newData)
  }

  const isValid = formData.fullName && formData.email

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Tell us about yourself</h2>
        <p className="text-muted-foreground">
          This information will be used across your resumes
        </p>
      </div>

      <div className="grid gap-4 max-w-md mx-auto">
        <div>
          <label className="text-sm font-medium">Full Name *</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-border rounded-md"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-border rounded-md"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-border rounded-md"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-border rounded-md"
            placeholder="San Francisco, CA"
          />
        </div>

        <div>
          <label className="text-sm font-medium">LinkedIn Profile</label>
          <input
            type="url"
            value={formData.linkedIn}
            onChange={(e) => handleChange('linkedIn', e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-border rounded-md"
            placeholder="https://linkedin.com/in/johndoe"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Personal Website</label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => handleChange('website', e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-border rounded-md"
            placeholder="https://johndoe.com"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={onNext} disabled={!isValid} size="lg" className="w-full max-w-xs">
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

/**
 * PreferencesStep component
 */
function PreferencesStep({ onNext, onSkip, onDataChange, data }: OnboardingStepProps) {
  const [preferences, setPreferences] = React.useState({
    jobTitle: data?.jobTitle || '',
    industries: data?.industries || [],
    experienceLevel: data?.experienceLevel || '',
    workType: data?.workType || '',
    salaryRange: data?.salaryRange || ''
  })

  const industries = [
    'Technology', 'Finance', 'Healthcare', 'Education', 'Marketing',
    'Sales', 'Design', 'Engineering', 'Operations', 'Consulting'
  ]

  const handleIndustryToggle = (industry: string) => {
    const newIndustries = preferences.industries.includes(industry)
      ? preferences.industries.filter((i: string) => i !== industry)
      : [...preferences.industries, industry]
    
    const newPreferences = { ...preferences, industries: newIndustries }
    setPreferences(newPreferences)
    onDataChange(newPreferences)
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">What are you looking for?</h2>
        <p className="text-muted-foreground">
          Help us tailor your resume for the right opportunities
        </p>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <div>
          <label className="text-sm font-medium">Target Job Title</label>
          <input
            type="text"
            value={preferences.jobTitle}
            onChange={(e) => setPreferences({...preferences, jobTitle: e.target.value})}
            className="w-full mt-1 px-3 py-2 border border-border rounded-md"
            placeholder="Software Engineer"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Industries of Interest</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {industries.map((industry) => (
              <Badge
                key={industry}
                variant={preferences.industries.includes(industry) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleIndustryToggle(industry)}
              >
                {industry}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Experience Level</label>
          <select
            value={preferences.experienceLevel}
            onChange={(e) => setPreferences({...preferences, experienceLevel: e.target.value})}
            className="w-full mt-1 px-3 py-2 border border-border rounded-md"
          >
            <option value="">Select level</option>
            <option value="entry">Entry Level (0-2 years)</option>
            <option value="mid">Mid Level (3-5 years)</option>
            <option value="senior">Senior Level (6-10 years)</option>
            <option value="executive">Executive (10+ years)</option>
          </select>
        </div>
      </div>

      <div className="flex justify-center space-x-3">
        <Button variant="outline" onClick={onSkip}>
          Skip for now
        </Button>
        <Button onClick={onNext} size="lg">
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

/**
 * ResumeStep component
 */
function ResumeStep({ onNext, onSkip }: OnboardingStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Ready to create your resume?</h2>
        <p className="text-muted-foreground">
          You can start building your resume now or skip this step and do it later
        </p>
      </div>

      <div className="grid gap-4 max-w-md mx-auto">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 mx-auto mb-3 text-brand-500" />
            <h3 className="font-semibold mb-2">Start from Scratch</h3>
            <p className="text-sm text-muted-foreground">
              Build your resume step by step with our guided process
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Briefcase className="h-12 w-12 mx-auto mb-3 text-brand-500" />
            <h3 className="font-semibold mb-2">Use a Template</h3>
            <p className="text-sm text-muted-foreground">
              Choose from our professional templates and customize
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center space-x-3">
        <Button variant="outline" onClick={onSkip}>
          Skip for now
        </Button>
        <Button onClick={onNext} size="lg">
          Create Resume
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

/**
 * OnboardingFlow component with step navigation and progress tracking
 */
export function OnboardingFlow() {
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0)
  const [completedSteps, setCompletedSteps] = React.useState<string[]>([])
  const [stepData, setStepData] = React.useState<Record<string, any>>({})

  const currentStep = onboardingSteps[currentStepIndex]
  const progress = ((currentStepIndex + 1) / onboardingSteps.length) * 100

  const handleNext = React.useCallback(() => {
    if (!currentStep) return
    
    // Mark current step as completed
    setCompletedSteps(prev => [...prev, currentStep.id])
    
    // Save to localStorage
    localStorage.setItem('onboarding-progress', JSON.stringify({
      currentStep: currentStepIndex + 1,
      completedSteps: [...completedSteps, currentStep.id],
      data: stepData
    }))

    if (currentStepIndex < onboardingSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1)
    } else {
      handleComplete()
    }
  }, [currentStep, currentStepIndex, completedSteps, stepData])

  const handlePrevious = React.useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1)
    }
  }, [currentStepIndex])

  const handleSkip = React.useCallback(() => {
    handleNext()
  }, [handleNext])

  const handleStepData = React.useCallback((data: any) => {
    if (!currentStep) return
    
    setStepData(prev => ({
      ...prev,
      [currentStep.id]: data
    }))
  }, [currentStep])

  const handleComplete = React.useCallback(() => {
    // Clear onboarding progress
    localStorage.removeItem('onboarding-progress')
    
    // Save user preferences
    localStorage.setItem('user-preferences', JSON.stringify(stepData))
    
    // Redirect to dashboard
    window.location.href = '/dashboard'
  }, [stepData])

  // Load saved progress on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('onboarding-progress')
    if (saved) {
      try {
        const { currentStep: savedCurrentStep, completedSteps: saved_completed, data } = JSON.parse(saved)
        setCurrentStepIndex(savedCurrentStep || 0)
        setCompletedSteps(saved_completed || [])
        setStepData(data || {})
      } catch {
        // Invalid saved data, start fresh
      }
    }
  }, [])

  if (!currentStep) {
    return <div>Loading...</div>
  }

  const StepComponent = currentStep.component

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress Header */}
      <div className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-lg font-semibold">Getting Started</h1>
              <p className="text-sm text-muted-foreground">
                Step {currentStepIndex + 1} of {onboardingSteps.length}
              </p>
            </div>
            
            {currentStepIndex > 0 && (
              <Button variant="outline" size="sm" onClick={handlePrevious}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
          </div>
          
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Step Navigation */}
      <div className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-8 overflow-x-auto">
            {onboardingSteps.map((step, index) => {
              const Icon = step.icon
              const isCompleted = completedSteps.includes(step.id)
              const isCurrent = index === currentStepIndex
              const isPast = index < currentStepIndex
              
              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center space-x-3 min-w-0 whitespace-nowrap",
                    isCurrent && "text-primary",
                    isPast && "text-muted-foreground",
                    !isCurrent && !isPast && "text-muted-foreground/50"
                  )}
                >
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2",
                    isCompleted && "bg-green-500 border-green-500 text-white",
                    isCurrent && "border-primary bg-primary text-white",
                    !isCurrent && !isCompleted && "border-border"
                  )}>
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium">{step.title}</p>
                    {!step.required && (
                      <Badge variant="outline" className="text-xs">Optional</Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">{currentStep.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <StepComponent
                onNext={handleNext}
                onSkip={!currentStep.required ? handleSkip : undefined}
                onDataChange={handleStepData}
                data={stepData[currentStep.id]}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 