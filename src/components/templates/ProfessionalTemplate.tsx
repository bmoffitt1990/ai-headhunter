import React from 'react';
import BaseTemplate, { templateUtils } from './BaseTemplate';
import { TemplateRenderProps } from '@/lib/templates/types';
import PersonalInfoSection from '@/components/resume/PersonalInfoSection';
import ExperienceSection from '@/components/resume/ExperienceSection';
import EducationSection from '@/components/resume/EducationSection';
import SkillsSection from '@/components/resume/SkillsSection';
import ProjectsSection from '@/components/resume/ProjectsSection';

/**
 * Professional Template - Classic single-column layout
 * Perfect for traditional industries and ATS systems
 */
const ProfessionalTemplate: React.FC<TemplateRenderProps> = (props) => {
  const { resumeData, template, customizations } = props;
  const sectionOrder = templateUtils.getSectionOrder(customizations);

  const renderSection = (sectionId: string) => {
    if (!templateUtils.shouldShowSection(sectionId, customizations)) {
      return null;
    }

    switch (sectionId) {
      case 'personalInfo':
        return (
          <PersonalInfoSection
            key="personal-info"
            data={resumeData.personalInfo}
            template={template}
            customizations={customizations}
            variant="header"
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
            showProficiency={false}
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

  return (
    <BaseTemplate {...props}>
      <div className="professional-template-content">
        {sectionOrder.map(renderSection)}
      </div>
    </BaseTemplate>
  );
};

export default ProfessionalTemplate; 