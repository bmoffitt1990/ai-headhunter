import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { 
  TemplateRenderProps, 
  TemplateColorTheme,
  TemplateFontOption 
} from '@/lib/templates/types';

/**
 * Base template wrapper component that provides common functionality
 * and styling for all resume templates
 */
const BaseTemplate = React.memo<TemplateRenderProps>(({
  resumeData: _resumeData,
  template,
  customizations,
  viewMode,
  className,
  children,
}) => {
  // Get the selected color theme and font with fallbacks
  const colorTheme = useMemo(() => {
    const selectedTheme = template.colorThemes.find(theme => theme.id === customizations.colorTheme);
    return selectedTheme || template.colorThemes[0];
  }, [template.colorThemes, customizations.colorTheme]);

  const fontOption = useMemo(() => {
    const selectedFont = template.fontOptions.find(font => font.id === customizations.fontFamily);
    return selectedFont || template.fontOptions[0];
  }, [template.fontOptions, customizations.fontFamily]);

  // Generate CSS custom properties for dynamic theming
  const templateStyles = useMemo(() => {
    if (!colorTheme || !fontOption) return {};
    
    return {
      '--template-primary': colorTheme.primary,
      '--template-secondary': colorTheme.secondary,
      '--template-accent': colorTheme.accent,
      '--template-text': colorTheme.text,
      '--template-text-secondary': colorTheme.textSecondary,
      '--template-background': colorTheme.background,
      '--template-border': colorTheme.border,
      fontFamily: fontOption.fontFamily,
    } as React.CSSProperties;
  }, [colorTheme, fontOption]);

  // Generate CSS classes based on customizations
  const templateClasses = useMemo(() => cn(
    'resume-template',
    `layout-${customizations.layout}`,
    `spacing-${customizations.spacing}`,
    `template-${template.id}`,
    {
      'print-mode': viewMode === 'print',
      'preview-mode': viewMode === 'preview',
      'edit-mode': viewMode === 'edit',
    },
    className
  ), [customizations.layout, customizations.spacing, template.id, viewMode, className]);

  return (
    <div 
      className={templateClasses}
      style={templateStyles}
      data-template-id={template.id}
      data-view-mode={viewMode}
    >
      {children}
    </div>
  );
});

BaseTemplate.displayName = 'BaseTemplate';

/**
 * Template section wrapper component for consistent section styling
 */
export const TemplateSection: React.FC<{
  id: string;
  title?: string;
  className?: string;
  children: React.ReactNode;
  showTitle?: boolean;
}> = ({ 
  id, 
  title, 
  className, 
  children, 
  showTitle = true 
}) => {
  return (
    <section 
      className={cn('resume-section', `resume-section-${id}`, className)}
      data-section={id}
    >
      {showTitle && title && (
        <div className="resume-section-header">
          <h2 className="resume-section-title">{title}</h2>
        </div>
      )}
      <div className="resume-section-content">
        {children}
      </div>
    </section>
  );
};

/**
 * Template utilities for common template operations
 */
export const templateUtils = {
  /**
   * Format date for display in templates
   */
  formatDate: (dateString: string, current?: boolean) => {
    if (current) return 'Present';
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString + '-01');
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
    } catch {
      return dateString;
    }
  },

  /**
   * Format date range for experience/education entries
   */
  formatDateRange: (startDate: string, endDate?: string, current?: boolean) => {
    const start = templateUtils.formatDate(startDate);
    const end = current ? 'Present' : templateUtils.formatDate(endDate || '');
    return end ? `${start} - ${end}` : start;
  },

  /**
   * Get skills grouped by category
   */
  groupSkillsByCategory: (skills: any[]) => {
    return skills.reduce((groups, skill) => {
      const category = skill.category || 'other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(skill);
      return groups;
    }, {} as Record<string, any[]>);
  },

  /**
   * Get category display name
   */
  getCategoryDisplayName: (category: string) => {
    const displayNames: Record<string, string> = {
      technical: 'Technical Skills',
      soft: 'Soft Skills',
      certification: 'Certifications',
      language: 'Languages',
      other: 'Other Skills',
    };
    return displayNames[category] || category;
  },

  /**
   * Truncate text with ellipsis
   */
  truncateText: (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  },

  /**
   * Clean URL for display
   */
  cleanUrl: (url: string) => {
    if (!url) return '';
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  },

  /**
   * Check if content should be shown based on customizations
   */
  shouldShowSection: (sectionId: string, customizations: any) => {
    return customizations.sectionOrder.includes(sectionId);
  },

  /**
   * Get section order based on customizations
   */
  getSectionOrder: (customizations: any) => {
    return customizations.sectionOrder || [
      'personalInfo', 
      'experience', 
      'education', 
      'skills', 
      'projects'
    ];
  },
};

/**
 * Hook for template customization
 */
export const useTemplateCustomization = (
  template: any, 
  customizations: any
) => {
  const appliedTheme = useMemo(() => 
    template.colorThemes.find((theme: TemplateColorTheme) => 
      theme.id === customizations.colorTheme
    ) || template.colorThemes[0]
  , [template.colorThemes, customizations.colorTheme]);

  const appliedFont = useMemo(() =>
    template.fontOptions.find((font: TemplateFontOption) => 
      font.id === customizations.fontFamily
    ) || template.fontOptions[0]
  , [template.fontOptions, customizations.fontFamily]);

  const cssVariables = useMemo(() => ({
    '--template-primary': appliedTheme.primary,
    '--template-secondary': appliedTheme.secondary,
    '--template-accent': appliedTheme.accent,
    '--template-text': appliedTheme.text,
    '--template-text-secondary': appliedTheme.textSecondary,
    '--template-background': appliedTheme.background,
    '--template-border': appliedTheme.border,
  }), [appliedTheme]);

  return {
    appliedTheme,
    appliedFont,
    cssVariables,
    fontFamily: appliedFont.fontFamily,
  };
};

export default BaseTemplate; 