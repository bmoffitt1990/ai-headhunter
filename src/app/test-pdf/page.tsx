'use client';

import React, { useState, useEffect } from 'react';
import { PDFExport, PDFQuickExport } from '@/components/PDFExport';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { defaultResumeData } from '@/features/resume/types/resume';
import { DEFAULT_CUSTOMIZATIONS } from '@/lib/templates/types';
import { supabase } from '@/lib/supabase/client';

// Sample template for testing
const sampleTemplate = {
  id: 'professional-modern',
  name: 'Professional Modern',
  description: 'Clean and modern design perfect for tech professionals',
  category: 'professional' as const,
  previewImage: '/templates/professional-modern.png',
  isPremium: false,
  structure: {
    layout: 'single-column' as const,
    sections: ['header', 'summary', 'experience', 'education', 'skills'],
    spacing: 'normal' as const,
  },
  styles: {
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    colors: {
      primary: '#1e3a8a',
      secondary: '#6b7280',
      accent: '#3b82f6',
      text: '#111827',
      background: '#ffffff',
    },
    spacing: {
      section: 24,
      element: 16,
    },
  },
  colorThemes: [{
    id: 'professional',
    name: 'Professional',
    primary: '#1e3a8a',
    secondary: '#6b7280',
    accent: '#3b82f6',
    text: '#111827',
    textSecondary: '#6b7280',
    background: '#ffffff',
    border: '#e5e7eb',
  }],
  fontOptions: [{
    id: 'inter',
    name: 'Inter',
    fontFamily: 'Inter, sans-serif',
    webSafe: true,
    category: 'sans-serif' as const,
  }],
  supportedLayouts: ['single-column' as const],
  isATSFriendly: true,
  isPrintOptimized: true,
  version: '1.0'
};

// Enhanced sample resume data
const sampleResumeData = {
  ...defaultResumeData,
  personalInfo: {
    ...defaultResumeData.personalInfo,
    fullName: 'Alex Thompson',
    email: 'alex.thompson@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedIn: 'linkedin.com/in/alexthompson',
    portfolio: 'alexthompson.dev',
    summary: 'Senior Full Stack Developer with 8+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud technologies. Passionate about creating user-centric solutions and leading high-performing teams.',
  },
  experience: [
    {
      id: '1',
      position: 'Senior Full Stack Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      startDate: '2021-03',
      endDate: '',
      current: true,
      description: [
        'Led development of microservices architecture serving 2M+ users',
        'Implemented CI/CD pipelines reducing deployment time by 60%',
        'Mentored 5 junior developers and conducted technical interviews',
        'Collaborated with product teams to deliver 15+ major features'
      ],
      achievements: [
        'Reduced application load time by 40% through performance optimization',
        'Successfully migrated legacy system to modern React/Node.js stack'
      ]
    },
    {
      id: '2',
      position: 'Full Stack Developer',
      company: 'StartupXYZ',
      location: 'San Francisco, CA',
      startDate: '2019-01',
      endDate: '2021-02',
      current: false,
      description: [
        'Built real-time analytics dashboard using React and D3.js',
        'Developed RESTful APIs serving 500K+ requests per day',
        'Implemented automated testing suite with 90% code coverage'
      ],
      achievements: [
        'Increased user engagement by 35% through UX improvements'
      ]
    }
  ],
  education: [
    {
      id: '1',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      institution: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      startDate: '2015-09',
      endDate: '2019-05',
      gpa: 3.8,
      coursework: ['Data Structures', 'Algorithms', 'Database Systems', 'Software Engineering']
    }
  ],
  skills: [
    { id: '1', name: 'React', category: 'technical' as const, level: 'expert' as const },
    { id: '2', name: 'TypeScript', category: 'technical' as const, level: 'advanced' as const },
    { id: '3', name: 'Node.js', category: 'technical' as const, level: 'advanced' as const },
    { id: '4', name: 'Python', category: 'technical' as const, level: 'intermediate' as const },
    { id: '5', name: 'AWS', category: 'technical' as const, level: 'intermediate' as const },
    { id: '6', name: 'Leadership', category: 'soft' as const, level: 'advanced' as const },
    { id: '7', name: 'Communication', category: 'soft' as const, level: 'expert' as const },
  ],
  projects: [
    {
      id: '1',
      name: 'E-Commerce Platform',
      description: 'Built a scalable e-commerce platform using React, Node.js, and PostgreSQL',
      startDate: '2022-01',
      endDate: '2022-06',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'AWS'],
      githubUrl: 'github.com/alexthompson/ecommerce',
      demoUrl: 'ecommerce-demo.alexthompson.dev'
    }
  ]
};

export default function TestPDFPage() {
  const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const [user, setUser] = useState<{ email?: string; id?: string } | null>(null);
  const [exportCount, setExportCount] = useState(0);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      console.log('🔍 Client Auth Debug:', {
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        accessToken: session?.access_token ? 'present' : 'missing',
        refreshToken: session?.refresh_token ? 'present' : 'missing',
        timestamp: new Date().toISOString()
      });
      
      if (session?.user) {
        setAuthStatus('authenticated');
        setUser(session.user);
      } else {
        setAuthStatus('unauthenticated');
      }
    };

    checkAuth();
  }, []);

  const handleExportComplete = (success: boolean, filename?: string) => {
    if (success) {
      setExportCount(prev => prev + 1);
      console.log(`✅ PDF export completed: ${filename}`);
    }
  };

  const handleExportError = (error: string) => {
    console.error('❌ PDF export error:', error);
  };

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Client-Side PDF Export Testing</h1>
        <p className="text-muted-foreground">
          Test the new browser-based PDF export functionality (no server dependencies)
        </p>
        
        {/* Authentication Status */}
        <div className="mt-4 p-4 rounded border">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Authentication Status:</span>
            {authStatus === 'loading' && (
              <span className="text-yellow-600">⏳ Checking...</span>
            )}
            {authStatus === 'authenticated' && (
              <span className="text-green-600">✅ Authenticated as {user?.email}</span>
            )}
            {authStatus === 'unauthenticated' && (
              <span className="text-orange-600">🔓 Not authenticated</span>
            )}
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <strong>Note:</strong> PDF export now works entirely in your browser - no authentication required!
          </div>
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Export</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
          <TabsTrigger value="analytics">Export Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic PDF Export</CardTitle>
              <CardDescription>
                Export resume to PDF using browser-native functionality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PDFExport
                resumeData={sampleResumeData}
                template={sampleTemplate}
                customizations={DEFAULT_CUSTOMIZATIONS}
                onExportComplete={handleExportComplete}
                onError={handleExportError}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Export Options</CardTitle>
              <CardDescription>
                Test different export methods and options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <PDFQuickExport
                  resumeData={sampleResumeData}
                  template={sampleTemplate}
                  customizations={DEFAULT_CUSTOMIZATIONS}
                />
                
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">Multiple Export Test</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <PDFExport
                      resumeData={sampleResumeData}
                      template={sampleTemplate}
                      customizations={DEFAULT_CUSTOMIZATIONS}
                      filename="Resume_Browser_Print.pdf"
                      variant="outline"
                      size="sm"
                      onExportComplete={handleExportComplete}
                      onError={handleExportError}
                    />
                    
                    <PDFExport
                      resumeData={sampleResumeData}
                      template={sampleTemplate}
                      customizations={DEFAULT_CUSTOMIZATIONS}
                      filename="Resume_Direct_Download.pdf"
                      variant="outline"
                      size="sm"
                      onExportComplete={handleExportComplete}
                      onError={handleExportError}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Statistics</CardTitle>
              <CardDescription>
                Track your PDF export usage (client-side only)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted p-4 rounded">
                  <h3 className="font-semibold">Total Exports</h3>
                  <p className="text-2xl font-bold">{exportCount}</p>
                </div>
                <div className="bg-muted p-4 rounded">
                  <h3 className="font-semibold">Method</h3>
                  <p className="text-sm">Browser-based</p>
                </div>
                <div className="bg-muted p-4 rounded">
                  <h3 className="font-semibold">Server Load</h3>
                  <p className="text-sm text-green-600">Zero ✅</p>
                </div>
                <div className="bg-muted p-4 rounded">
                  <h3 className="font-semibold">Dependencies</h3>
                  <p className="text-sm text-green-600">None ✅</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
                <h4 className="font-semibold text-green-800 mb-2">✅ Benefits of Client-Side PDF Export:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• No server processing load</li>
                  <li>• No Puppeteer/Chromium dependencies</li>
                  <li>• Works offline</li>
                  <li>• Instant generation</li>
                  <li>• Perfect for B2C applications</li>
                  <li>• No authentication required</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 