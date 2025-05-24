import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ResumeData } from '@/features/resume/types/resume';
import { 
  ResumeTemplate, 
  TemplateCustomizations, 
  DEFAULT_CUSTOMIZATIONS 
} from '@/lib/templates/types';
import { templateUtils } from '@/lib/templates/registry';
import ProfessionalTemplate from '@/components/templates/ProfessionalTemplate';
import ModernTemplate from '@/components/templates/ModernTemplate';
import MinimalTemplate from '@/components/templates/MinimalTemplate';

interface ResumePreviewProps {
  resumeData: ResumeData;
  selectedTemplate?: ResumeTemplate;
  customizations?: TemplateCustomizations;
  onTemplateChange?: (template: ResumeTemplate) => void;
  viewMode?: 'edit' | 'preview' | 'print';
  className?: string;
}

/**
 * Main resume preview component with real-time data binding
 * Supports template switching and customization options
 */
const ResumePreview: React.FC<ResumePreviewProps> = ({
  resumeData,
  selectedTemplate,
  customizations = DEFAULT_CUSTOMIZATIONS,
  onTemplateChange: _onTemplateChange,
  viewMode = 'preview',
  className,
}) => {
  // Get the template to use (fallback to default if not provided)
  const template = useMemo(() => {
    if (selectedTemplate) return selectedTemplate;
    
    // Use the default template utility which handles the fallback logic
    return templateUtils.getDefaultTemplate();
  }, [selectedTemplate]);

  // Template component mapping
  const getTemplateComponent = (templateId: string) => {
    switch (templateId) {
      case 'professional':
        return ProfessionalTemplate;
      case 'modern':
        return ModernTemplate;
      case 'minimal':
        return MinimalTemplate;
      default:
        return ProfessionalTemplate;
    }
  };

  const TemplateComponent = getTemplateComponent(template.id);

  const previewClasses = useMemo(() => cn(
    'resume-preview',
    `view-mode-${viewMode}`,
    {
      'print-mode': viewMode === 'print',
      'preview-mode': viewMode === 'preview',
      'edit-mode': viewMode === 'edit',
    },
    className
  ), [viewMode, className]);

  return (
    <div className={previewClasses}>
      <div className="resume-preview-container">
        <TemplateComponent
          resumeData={resumeData}
          template={template}
          customizations={customizations}
          viewMode={viewMode}
        />
      </div>
    </div>
  );
};

export default ResumePreview; 