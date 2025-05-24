import React from 'react';
import { cn } from '@/lib/utils';
import { Education } from '@/features/resume/types/resume';
import { TemplateSectionProps } from '@/lib/templates/types';
import { templateUtils } from '@/components/templates/BaseTemplate';
import { Calendar, MapPin, GraduationCap } from 'lucide-react';

interface EducationSectionProps extends TemplateSectionProps {
  data: Education[];
}

/**
 * Education section component for resume templates
 * Handles academic credentials, degrees, and coursework
 */
const EducationSection: React.FC<EducationSectionProps> = ({
  data,
  template: _template,
  customizations,
  className,
}) => {
  const showIcons = customizations.showIcons;

  const renderEducationEntry = (education: Education) => (
    <div key={education.id} className="resume-entry">
      <div className="resume-entry-header">
        <div className="resume-entry-main">
          <h3 className="resume-entry-title">
            {education.degree} in {education.field}
          </h3>
          <div className="resume-entry-subtitle">{education.institution}</div>
          
          {/* GPA Display */}
          {education.gpa && education.gpa > 0 && (
            <div className="resume-entry-gpa text-sm font-medium mt-1">
              GPA: {education.gpa.toFixed(2)}
            </div>
          )}
        </div>
        
        <div className="resume-entry-meta">
          <div className="resume-entry-date">
            {showIcons && <Calendar size={12} className="inline mr-1" />}
            {templateUtils.formatDateRange(
              education.startDate, 
              education.endDate
            )}
          </div>
          <div className="resume-entry-location">
            {showIcons && <MapPin size={12} className="inline mr-1" />}
            {education.location}
          </div>
        </div>
      </div>

      <div className="resume-entry-content">
        {/* Relevant Coursework */}
        {education.coursework && education.coursework.length > 0 && (
          <div className="resume-coursework">
            <div className="font-medium text-sm text-template-secondary mb-1">
              Relevant Coursework:
            </div>
            <div className="resume-coursework-list text-sm">
              {education.coursework.join(', ')}
            </div>
          </div>
        )}

        {/* Academic Honors/Activities placeholder */}
        {/* Note: Could be extended to include honors, activities, etc. */}
      </div>
    </div>
  );

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <section 
      className={cn('resume-section', 'resume-section-education', className)}
      data-section="education"
    >
      <div className="resume-section-header">
        <h2 className="resume-section-title">
          {showIcons && <GraduationCap size={18} className="inline mr-2" />}
          Education
        </h2>
      </div>
      <div className="resume-section-content">
        {data.map(renderEducationEntry)}
      </div>
    </section>
  );
};

export default EducationSection; 