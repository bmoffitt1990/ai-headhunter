import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ResumeData, defaultResumeData } from '@/features/resume/types/resume';
import { 
  ResumeTemplate, 
  TemplateCustomizations, 
  DEFAULT_CUSTOMIZATIONS 
} from '@/lib/templates/types';
import { templateUtils } from '@/lib/templates/registry';
import ResumePreview from './ResumePreview';
import PrintPreview from './PrintPreview';
import TemplateSelector from './TemplateSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ResumeBuilderProps {
  initialData?: ResumeData;
  onDataChange?: (data: ResumeData) => void;
  className?: string;
}

/**
 * Main resume builder component with side-by-side editing and preview
 * Provides responsive layout with collapsible preview panel
 */
const ResumeBuilder: React.FC<ResumeBuilderProps> = ({
  initialData = defaultResumeData,
  onDataChange,
  className,
}) => {
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>(() => {
    return templateUtils.getDefaultTemplate();
  });
  const [customizations, setCustomizations] = useState<TemplateCustomizations>(DEFAULT_CUSTOMIZATIONS);
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'print'>('preview');
  const [activeTab, setActiveTab] = useState('edit');
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  // Handle data changes
  const handleDataChange = (newData: ResumeData) => {
    setResumeData(newData);
    onDataChange?.(newData);
  };

  // Handle template changes
  const handleTemplateChange = (template: ResumeTemplate) => {
    setSelectedTemplate(template);
    // Reset customizations to defaults when changing templates
    setCustomizations({
      ...DEFAULT_CUSTOMIZATIONS,
      colorTheme: template.colorThemes[0]?.id || DEFAULT_CUSTOMIZATIONS.colorTheme,
      fontFamily: template.fontOptions[0]?.id || DEFAULT_CUSTOMIZATIONS.fontFamily,
    });
  };

  // Handle customization changes
  const handleCustomizationsChange = (newCustomizations: TemplateCustomizations) => {
    setCustomizations(newCustomizations);
  };

  // Responsive layout classes
  const layoutClasses = useMemo(() => cn(
    'resume-builder',
    'min-h-screen bg-gray-50',
    className
  ), [className]);

  const renderEditPanel = () => (
    <div className="resume-edit-panel">
      <Card>
        <CardHeader>
          <CardTitle>Resume Editor</CardTitle>
          <p className="text-sm text-muted-foreground">
            Edit your resume information below. Changes will appear in the preview in real-time.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Resume editing form would go here. This integrates with the existing form components from Task 1.2.
            </p>
            {/* TODO: Integrate with existing ResumeForm component from Task 1.2 */}
            
            {/* Quick data demo for testing */}
            <Button 
              onClick={() => handleDataChange({
                ...resumeData,
                personalInfo: {
                  ...resumeData.personalInfo,
                  fullName: 'John Doe',
                  email: 'john.doe@example.com',
                  phone: '(555) 123-4567',
                  location: 'New York, NY',
                  summary: 'Experienced software developer with expertise in React and Node.js'
                }
              })}
              variant="outline"
              size="sm"
            >
              Load Sample Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPreviewPanel = () => (
    <div className="resume-preview-panel">
      <div className="sticky top-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Preview</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'preview' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('preview')}
                >
                  Preview
                </Button>
                <Button
                  variant={viewMode === 'print' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('print')}
                >
                  Print View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPrintPreview(true)}
                >
                  Full Print Preview
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="resume-preview-container border rounded-lg bg-white p-4 shadow-sm">
              <ResumePreview
                resumeData={resumeData}
                selectedTemplate={selectedTemplate}
                customizations={customizations}
                viewMode={viewMode}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTemplatePanel = () => (
    <div className="template-panel">
      <Card>
        <CardHeader>
          <CardTitle>Templates & Customization</CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose a template and customize its appearance.
          </p>
        </CardHeader>
        <CardContent>
          <TemplateSelector
            selectedTemplate={selectedTemplate}
            customizations={customizations}
            onTemplateChange={handleTemplateChange}
            onCustomizationsChange={handleCustomizationsChange}
          />
        </CardContent>
      </Card>
    </div>
  );

  // Mobile-first responsive layout
  return (
    <div className={layoutClasses}>
      <div className="container mx-auto p-4">
        {/* Mobile Layout - Tabs */}
        <div className="lg:hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="template">Template</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="edit" className="mt-4">
              {renderEditPanel()}
            </TabsContent>
            
            <TabsContent value="template" className="mt-4">
              {renderTemplatePanel()}
            </TabsContent>
            
            <TabsContent value="preview" className="mt-4">
              {renderPreviewPanel()}
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop Layout - Side by Side */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6">
          {/* Left Panel - Edit and Template */}
          <div className="space-y-6">
            {renderEditPanel()}
            {renderTemplatePanel()}
          </div>

          {/* Right Panel - Preview */}
          <div>
            {renderPreviewPanel()}
          </div>
        </div>
      </div>

      {/* Print Preview Modal */}
      {showPrintPreview && (
        <PrintPreview
          resumeData={resumeData}
          selectedTemplate={selectedTemplate}
          customizations={customizations}
          onClose={() => setShowPrintPreview(false)}
        />
      )}
    </div>
  );
};

export default ResumeBuilder; 