import React from 'react';
import { cn } from '@/lib/utils';
import { Skill } from '@/features/resume/types/resume';
import { TemplateSectionProps } from '@/lib/templates/types';
import { templateUtils } from '@/components/templates/BaseTemplate';
import { Settings, Award, Users, BookOpen } from 'lucide-react';

interface SkillsSectionProps extends TemplateSectionProps {
  data: Skill[];
  displayMode?: 'list' | 'grid' | 'bars' | 'tags';
  showProficiency?: boolean;
  groupByCategory?: boolean;
}

/**
 * Skills section component for resume templates
 * Supports multiple display modes and skill categorization
 */
const SkillsSection: React.FC<SkillsSectionProps> = ({
  data,
  template: _template,
  customizations,
  displayMode = 'tags',
  showProficiency = true,
  groupByCategory = true,
  className,
}) => {
  const showIcons = customizations.showIcons;

  // Group skills by category
  const groupedSkills: Record<string, Skill[]> = groupByCategory 
    ? templateUtils.groupSkillsByCategory(data)
    : { 'All Skills': data };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const iconProps = { size: 16, className: "inline mr-1" };
    switch (category) {
      case 'technical': return <Settings {...iconProps} />;
      case 'certification': return <Award {...iconProps} />;
      case 'soft': return <Users {...iconProps} />;
      default: return <BookOpen {...iconProps} />;
    }
  };

  // Render proficiency indicator
  const renderProficiencyIndicator = (level?: string) => {
    if (!showProficiency || !level) return null;

    const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
    const currentIndex = levels.indexOf(level);
    
    if (displayMode === 'bars') {
      return (
        <div className="skill-proficiency-bar">
          <div className="skill-bar-container">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className={cn(
                  'skill-bar-segment',
                  index <= currentIndex ? 'filled' : 'empty'
                )}
              />
            ))}
          </div>
        </div>
      );
    }

    return (
      <span className="skill-level text-xs opacity-75">
        ({level})
      </span>
    );
  };

  // Render individual skill
  const renderSkill = (skill: Skill) => {
    const skillClass = cn(
      'resume-skill-tag',
      `level-${skill.level || 'intermediate'}`,
      {
        'with-proficiency': showProficiency && skill.level,
      }
    );

    switch (displayMode) {
      case 'list':
        return (
          <li key={skill.id} className="skill-list-item">
            <span className="skill-name">{skill.name}</span>
            {renderProficiencyIndicator(skill.level)}
          </li>
        );

      case 'grid':
        return (
          <div key={skill.id} className="skill-grid-item">
            <span className="skill-name">{skill.name}</span>
            {renderProficiencyIndicator(skill.level)}
          </div>
        );

      case 'bars':
        return (
          <div key={skill.id} className="skill-bar-item">
            <div className="skill-bar-header">
              <span className="skill-name">{skill.name}</span>
              <span className="skill-level-text">{skill.level || 'intermediate'}</span>
            </div>
            {renderProficiencyIndicator(skill.level)}
          </div>
        );

      case 'tags':
      default:
        return (
          <span key={skill.id} className={skillClass}>
            {skill.name}
            {showProficiency && skill.level && (
              <span className="ml-1 opacity-75 text-xs">
                •{skill.level.charAt(0).toUpperCase()}
              </span>
            )}
          </span>
        );
    }
  };

  // Render skills for a category
  const renderSkillsCategory = (category: string, skills: Skill[]) => {
    const containerClass = cn(
      'resume-skills-category',
      `display-mode-${displayMode}`,
      {
        'show-proficiency': showProficiency,
      }
    );

    const skillsContainerClass = cn({
      'resume-skills-list': displayMode === 'tags',
      'skills-list-container': displayMode === 'list',
      'skills-grid-container': displayMode === 'grid',
      'skills-bars-container': displayMode === 'bars',
    });

    return (
      <div key={category} className={containerClass}>
        {groupByCategory && (
          <h4 className="resume-skills-category-title">
            {showIcons && getCategoryIcon(category)}
            {templateUtils.getCategoryDisplayName(category)}
          </h4>
        )}
        
        <div className={skillsContainerClass}>
          {displayMode === 'list' ? (
            <ul className="skills-list">
              {skills.map(renderSkill)}
            </ul>
          ) : (
            skills.map(renderSkill)
          )}
        </div>
      </div>
    );
  };

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <section 
      className={cn('resume-section', 'resume-section-skills', className)}
      data-section="skills"
    >
      <div className="resume-section-header">
        <h2 className="resume-section-title">Skills</h2>
      </div>
      <div className="resume-section-content">
        <div className={cn(
          'resume-skills-grid',
          `mode-${displayMode}`,
          {
            'grouped': groupByCategory,
            'with-proficiency': showProficiency,
          }
        )}>
          {Object.entries(groupedSkills).map(([category, skills]) =>
            renderSkillsCategory(category, skills)
          )}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection; 