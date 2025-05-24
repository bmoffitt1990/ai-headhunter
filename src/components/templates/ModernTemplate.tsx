import React from 'react';
import BaseTemplate, { templateUtils } from './BaseTemplate';
import { TemplateRenderProps } from '@/lib/templates/types';
import PersonalInfoSection from '@/components/resume/PersonalInfoSection';
import ExperienceSection from '@/components/resume/ExperienceSection';
import EducationSection from '@/components/resume/EducationSection';
import SkillsSection from '@/components/resume/SkillsSection';
import ProjectsSection from '@/components/resume/ProjectsSection';

/**
 * Modern Template - Two-column layout with sidebar
 * Perfect for modern professionals and creative industries
 */
const ModernTemplate: React.FC<TemplateRenderProps> = (props) => {
  const { resumeData, template, customizations } = props;
  const isLayoutTwoColumn = customizations.layout === 'two-column';

  // Define sidebar and main content sections
  const sidebarSections = ['personalInfo', 'skills'];
  const mainSections = ['experience', 'education', 'projects'];

  const renderSection = (sectionId: string, variant?: 'sidebar' | 'header') => {
    switch (sectionId) {
      case 'personalInfo':
        return (
          <PersonalInfoSection
            key="personal-info"
            data={resumeData.personalInfo}
            template={template}
            customizations={customizations}
            variant={variant || 'header'}
          />
        );

      case 'experience':
        return resumeData.experience.length > 0 ? (
          <ExperienceSection
            key="experience"
            data={resumeData.experience}
            template={template}
            customizations={customizations}
          />
        ) : null;

      case 'education':
        return resumeData.education.length > 0 ? (
          <EducationSection
            key="education"
            data={resumeData.education}
            template={template}
            customizations={customizations}
          />
        ) : null;

      case 'skills':
        return resumeData.skills.length > 0 ? (
          <SkillsSection
            key="skills"
            data={resumeData.skills}
            template={template}
            customizations={customizations}
            displayMode="tags"
            showProficiency={true}
            groupByCategory={true}
          />
        ) : null;

      case 'projects':
        return resumeData.projects.length > 0 ? (
          <ProjectsSection
            key="projects"
            data={resumeData.projects}
            template={template}
            customizations={customizations}
          />
        ) : null;

      default:
        return null;
    }
  };

  if (!isLayoutTwoColumn) {
    // Fall back to single column layout
    const sectionOrder = templateUtils.getSectionOrder(customizations);
    return (
      <BaseTemplate {...props}>
        <div className="modern-template-content single-column">
          {sectionOrder.map((sectionId: string) => renderSection(sectionId))}
        </div>
      </BaseTemplate>
    );
  }

  return (
    <BaseTemplate {...props}>
      <div className="modern-template-content two-column">
        {/* Sidebar */}
        <aside className="modern-template-sidebar">
          {sidebarSections.map((sectionId: string) => 
            templateUtils.shouldShowSection(sectionId, customizations) 
              ? renderSection(sectionId, 'sidebar')
              : null
          )}
        </aside>

        {/* Main Content */}
        <main className="modern-template-main">
          {mainSections.map((sectionId: string) => 
            templateUtils.shouldShowSection(sectionId, customizations) 
              ? renderSection(sectionId)
              : null
          )}
        </main>
      </div>
    </BaseTemplate>
  );
};

export default ModernTemplate; 