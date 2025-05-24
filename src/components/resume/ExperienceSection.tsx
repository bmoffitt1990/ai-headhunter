import React from 'react';
import { cn } from '@/lib/utils';
import { Experience } from '@/features/resume/types/resume';
import { TemplateSectionProps } from '@/lib/templates/types';
import { templateUtils } from '@/components/templates/BaseTemplate';
import { Calendar, MapPin } from 'lucide-react';

interface ExperienceSectionProps extends TemplateSectionProps {
  data: Experience[];
}

/**
 * Experience section component for resume templates
 * Handles professional work experience with achievements and descriptions
 */
const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  data,
  template: _template,
  customizations,
  className,
}) => {
  const showIcons = customizations.showIcons;

  const renderExperienceEntry = (experience: Experience) => (
    <div key={experience.id} className="resume-entry">
      <div className="resume-entry-header">
        <div className="resume-entry-main">
          <h3 className="resume-entry-title">{experience.position}</h3>
          <div className="resume-entry-subtitle">{experience.company}</div>
        </div>
        <div className="resume-entry-meta">
          <div className="resume-entry-date">
            {showIcons && <Calendar size={12} className="inline mr-1" />}
            {templateUtils.formatDateRange(
              experience.startDate, 
              experience.endDate, 
              experience.current
            )}
          </div>
          <div className="resume-entry-location">
            {showIcons && <MapPin size={12} className="inline mr-1" />}
            {experience.location}
          </div>
        </div>
      </div>

      <div className="resume-entry-content">
        {/* Job Description */}
        {experience.description && experience.description.length > 0 && (
          <ul className="resume-entry-list">
            {experience.description.map((item, index) => (
              <li key={`desc-${index}`}>{item}</li>
            ))}
          </ul>
        )}

        {/* Key Achievements */}
        {experience.achievements && experience.achievements.length > 0 && (
          <>
            {experience.description && experience.description.length > 0 && (
              <div className="mt-2 font-medium text-sm text-template-secondary">
                Key Achievements:
              </div>
            )}
            <ul className="resume-entry-list">
              {experience.achievements.map((achievement, index) => (
                <li key={`achieve-${index}`} className="font-medium">
                  {achievement}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <section 
      className={cn('resume-section', 'resume-section-experience', className)}
      data-section="experience"
    >
      <div className="resume-section-header">
        <h2 className="resume-section-title">Experience</h2>
      </div>
      <div className="resume-section-content">
        {data.map(renderExperienceEntry)}
      </div>
    </section>
  );
};

export default ExperienceSection; 