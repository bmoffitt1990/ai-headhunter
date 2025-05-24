'use client';

import { ResumeForm } from '@/features/resume/components/ResumeForm';
import type { ResumeData } from '@/features/resume/types/resume';

/**
 * Resume builder page
 */
export default function ResumePage() {
  const handleSubmit = (data: ResumeData) => {
    console.log('Resume data submitted:', data);
    // Here you would typically save to Supabase or send to an API
    alert('Resume submitted successfully! Check the console for data.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Headhunter Resume Builder
          </h1>
          <p className="text-gray-600">
            Create your professional resume with our intelligent form system
          </p>
        </div>
        
        <ResumeForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
} 