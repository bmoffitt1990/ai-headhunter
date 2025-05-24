import React from 'react';
import { cn } from '@/lib/utils';
import { Project } from '@/features/resume/types/resume';
import { TemplateSectionProps } from '@/lib/templates/types';
import { templateUtils } from '@/components/templates/BaseTemplate';
import { Calendar, Github, ExternalLink, Code } from 'lucide-react';

interface ProjectsSectionProps extends TemplateSectionProps {
  data: Project[];
}

/**
 * Projects section component for resume templates
 * Handles project descriptions, technology stacks, and links
 */
const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  data,
  template: _template,
  customizations,
  className,
}) => {
  const showIcons = customizations.showIcons;

  const renderProjectEntry = (project: Project) => (
    <div key={project.id} className="resume-project">
      <div className="resume-entry-header">
        <div className="resume-entry-main">
          <h3 className="resume-project-title">{project.name}</h3>
          
          {/* Project Links */}
          <div className="resume-project-links">
            {project.githubUrl && (
              <a 
                href={project.githubUrl}
                className="resume-project-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {showIcons && <Github size={12} className="inline mr-1" />}
                GitHub
              </a>
            )}
            {project.demoUrl && (
              <a 
                href={project.demoUrl}
                className="resume-project-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {showIcons && <ExternalLink size={12} className="inline mr-1" />}
                Live Demo
              </a>
            )}
          </div>
        </div>
        
        <div className="resume-entry-meta">
          <div className="resume-entry-date">
            {showIcons && <Calendar size={12} className="inline mr-1" />}
            {templateUtils.formatDateRange(
              project.startDate, 
              project.endDate
            )}
          </div>
        </div>
      </div>

      {/* Project Description */}
      <div className="resume-entry-content">
        <p className="resume-project-description text-sm leading-relaxed">
          {project.description}
        </p>

        {/* Technology Stack */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="resume-project-technologies">
            {showIcons && (
              <span className="tech-label">
                <Code size={12} className="inline mr-1" />
                Technologies:
              </span>
            )}
            <div className="tech-tags-container">
              {project.technologies.map((tech, index) => (
                <span key={`${project.id}-tech-${index}`} className="resume-tech-tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <section 
      className={cn('resume-section', 'resume-section-projects', className)}
      data-section="projects"
    >
      <div className="resume-section-header">
        <h2 className="resume-section-title">Projects</h2>
      </div>
      <div className="resume-section-content">
        {data.map(renderProjectEntry)}
      </div>
    </section>
  );
};

export default ProjectsSection; 