'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form } from '@/components/ui/form';
import { resumeDataSchema, type ResumeFormData } from '@/lib/validations/resume-schema';
import { defaultResumeData, type ResumeData } from '../types/resume';
import { saveResumeDraft, getResumeDataWithDefaults, clearResumeDraft, hasSavedDraft } from '../utils/form-persistence';
import { PersonalInfoSection } from './PersonalInfoSection';
import { ExperienceSection } from './ExperienceSection';
import { EducationSection } from './EducationSection';
import { SkillsSection } from './SkillsSection';
import { ProjectsSection } from './ProjectsSection';

interface ResumeFormProps {
  onSubmit?: (data: ResumeData) => void;
  initialData?: ResumeData;
}

export const ResumeForm = ({ onSubmit, initialData }: ResumeFormProps) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showDraftNotice, setShowDraftNotice] = useState(false);

  const form = useForm<ResumeFormData>({
    resolver: zodResolver(resumeDataSchema),
    defaultValues: initialData || defaultResumeData,
    mode: 'onChange',
  });

  const { handleSubmit, watch, reset, formState: { isValid, isDirty } } = form;

  // Check for saved draft on mount
  useEffect(() => {
    if (!initialData && hasSavedDraft()) {
      setShowDraftNotice(true);
    }
  }, [initialData]);

  // Auto-save functionality
  useEffect(() => {
    let saveTimer: NodeJS.Timeout;
    
    const subscription = watch((data) => {
      if (isDirty) {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
          saveResumeDraft(data as ResumeData);
          setLastSaved(new Date());
        }, 30000); // Auto-save after 30 seconds
      }
    });

    return () => {
      clearTimeout(saveTimer);
      subscription.unsubscribe();
    };
  }, [watch, isDirty]);

  const handleFormSubmit = (data: ResumeFormData) => {
    clearResumeDraft();
    onSubmit?.(data);
  };

  const handleManualSave = () => {
    const currentData = form.getValues();
    saveResumeDraft(currentData);
    setLastSaved(new Date());
  };

  const handleLoadDraft = () => {
    const draftData = getResumeDataWithDefaults();
    reset(draftData);
    setShowDraftNotice(false);
  };

  const handleDiscardDraft = () => {
    clearResumeDraft();
    setShowDraftNotice(false);
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', component: PersonalInfoSection },
    { id: 'experience', label: 'Experience', component: ExperienceSection },
    { id: 'education', label: 'Education', component: EducationSection },
    { id: 'skills', label: 'Skills', component: SkillsSection },
    { id: 'projects', label: 'Projects', component: ProjectsSection },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Draft Notice */}
      {showDraftNotice && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-orange-800">Draft Found</CardTitle>
            <CardDescription className="text-orange-700">
              We found a saved draft of your resume. Would you like to continue editing it?
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex gap-2">
              <Button onClick={handleLoadDraft} variant="outline" size="sm">
                Load Draft
              </Button>
              <Button onClick={handleDiscardDraft} variant="ghost" size="sm">
                Start Fresh
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Form */}
      <Card>
        <CardHeader>
          <CardTitle>Resume Builder</CardTitle>
          <CardDescription>
            Create your professional resume step by step. Your progress is automatically saved.
          </CardDescription>
          {lastSaved && (
            <p className="text-sm text-green-600">
              Last saved: {lastSaved.toLocaleTimeString()}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                  {tabs.map((tab) => (
                    <TabsTrigger key={tab.id} value={tab.id} className="text-xs sm:text-sm">
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {tabs.map((tab) => {
                  const Component = tab.component;
                  return (
                    <TabsContent key={tab.id} value={tab.id} className="mt-6">
                      <Component />
                    </TabsContent>
                  );
                })}
              </Tabs>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                <Button
                  type="button"
                  onClick={handleManualSave}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Save Draft
                </Button>
                <Button
                  type="submit"
                  disabled={!isValid}
                  className="w-full sm:w-auto"
                >
                  Complete Resume
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}; 