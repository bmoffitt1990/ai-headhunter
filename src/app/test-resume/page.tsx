'use client';

import React from 'react';
import ResumeBuilder from '@/components/ResumeBuilder';
import { ResumeData } from '@/features/resume/types/resume';

// Sample data for testing
const sampleResumeData: ResumeData = {
  personalInfo: {
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    linkedIn: 'https://linkedin.com/in/sarahjohnson',
    portfolio: 'https://sarahjohnson.dev',
    summary: 'Experienced Frontend Developer with 5+ years building modern web applications using React, TypeScript, and Node.js. Passionate about creating intuitive user interfaces and optimizing performance.',
  },
  experience: [
    {
      id: '1',
      company: 'TechCorp Inc.',
      position: 'Senior Frontend Developer',
      location: 'San Francisco, CA',
      startDate: '2022-03',
      endDate: '',
      current: true,
      description: [
        'Led development of a React-based dashboard serving 50,000+ daily active users',
        'Implemented TypeScript migration reducing bugs by 40% and improving developer experience',
        'Optimized application performance resulting in 30% faster page load times',
      ],
      achievements: [
        'Reduced bundle size by 35% through code splitting and lazy loading',
        'Mentored 3 junior developers and established frontend coding standards',
      ],
    },
    {
      id: '2',
      company: 'StartupXYZ',
      position: 'Frontend Developer',
      location: 'Remote',
      startDate: '2020-06',
      endDate: '2022-02',
      current: false,
      description: [
        'Developed responsive web applications using React, Redux, and Material-UI',
        'Collaborated with design team to implement pixel-perfect UI components',
        'Integrated RESTful APIs and implemented real-time features using WebSockets',
      ],
      achievements: [
        'Built reusable component library adopted across 3 product teams',
        'Improved mobile user experience leading to 25% increase in engagement',
      ],
    },
  ],
  education: [
    {
      id: '1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      location: 'Berkeley, CA',
      startDate: '2016-08',
      endDate: '2020-05',
      gpa: 3.8,
      coursework: [
        'Data Structures & Algorithms',
        'Web Development',
        'Database Systems',
        'Software Engineering',
      ],
    },
  ],
  skills: [
    {
      id: '1',
      name: 'React',
      category: 'technical',
      level: 'expert',
    },
    {
      id: '2',
      name: 'TypeScript',
      category: 'technical',
      level: 'advanced',
    },
    {
      id: '3',
      name: 'Node.js',
      category: 'technical',
      level: 'intermediate',
    },
    {
      id: '4',
      name: 'GraphQL',
      category: 'technical',
      level: 'intermediate',
    },
    {
      id: '5',
      name: 'Team Leadership',
      category: 'soft',
      level: 'advanced',
    },
    {
      id: '6',
      name: 'AWS Certified Developer',
      category: 'certification',
      level: 'expert',
    },
  ],
  projects: [
    {
      id: '1',
      name: 'E-commerce Dashboard',
      description: 'Built a comprehensive admin dashboard for managing online store operations with real-time analytics, inventory management, and customer insights.',
      technologies: ['React', 'TypeScript', 'Chart.js', 'Node.js', 'PostgreSQL'],
      startDate: '2023-01',
      endDate: '2023-06',
      githubUrl: 'https://github.com/sarahjohnson/ecommerce-dashboard',
      demoUrl: 'https://dashboard-demo.sarahjohnson.dev',
    },
    {
      id: '2',
      name: 'Task Management App',
      description: 'Developed a collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
      technologies: ['React', 'Redux', 'Socket.io', 'Express', 'MongoDB'],
      startDate: '2022-08',
      endDate: '2022-12',
      githubUrl: 'https://github.com/sarahjohnson/task-manager',
      demoUrl: 'https://tasks.sarahjohnson.dev',
    },
  ],
};

/**
 * Test page for the Resume Builder functionality
 * Demonstrates all templates, customization options, and features
 */
export default function TestResumePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Resume Builder Test</h1>
          <p className="text-muted-foreground">
            Test the HTML Resume Rendering Engine with sample data
          </p>
        </div>
        
        <ResumeBuilder 
          initialData={sampleResumeData}
          onDataChange={(data) => console.log('Resume data changed:', data)}
        />
      </div>
    </div>
  );
} 