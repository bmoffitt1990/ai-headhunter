'use client';

import React from 'react';
import { ResumeData } from '@/features/resume/types/resume';
import { ResumeTemplate, TemplateCustomizations } from '@/lib/templates/types';

interface PrintableResumeProps {
  resumeData: ResumeData;
  template: ResumeTemplate;
  customizations: TemplateCustomizations;
}

const PrintableResume = React.forwardRef<HTMLDivElement, PrintableResumeProps>(
  ({ resumeData, template: _template, customizations: _customizations }, ref) => {
    const { personalInfo, experience, education, skills, projects } = resumeData;

    return (
      <div 
        ref={ref}
        className="bg-white text-gray-900 max-w-[8.5in] mx-auto p-8 print:p-6 print:max-w-none print:mx-0 font-sans leading-relaxed"
        style={{ 
          minHeight: '11in',
          fontSize: '11pt',
          lineHeight: '1.4'
        }}
      >
        {/* Header */}
        <header className="mb-8 print:mb-6">
          <h1 className="text-3xl print:text-2xl font-bold text-gray-900 mb-2">
            {personalInfo.fullName}
          </h1>
          <div className="flex flex-wrap gap-4 print:gap-3 text-sm print:text-xs text-gray-600">
            {personalInfo.email && (
              <span>{personalInfo.email}</span>
            )}
            {personalInfo.phone && (
              <span>{personalInfo.phone}</span>
            )}
            {personalInfo.location && (
              <span>{personalInfo.location}</span>
            )}
            {personalInfo.linkedIn && (
              <span>{personalInfo.linkedIn}</span>
            )}
            {personalInfo.portfolio && (
              <span>{personalInfo.portfolio}</span>
            )}
          </div>
        </header>

        {/* Summary */}
        {personalInfo.summary && (
          <section className="mb-6 print:mb-4">
            <h2 className="text-lg print:text-base font-semibold text-gray-900 mb-3 print:mb-2 border-b border-gray-300 pb-1">
              Professional Summary
            </h2>
            <p className="text-sm print:text-xs text-gray-700 leading-relaxed">
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-6 print:mb-4">
            <h2 className="text-lg print:text-base font-semibold text-gray-900 mb-3 print:mb-2 border-b border-gray-300 pb-1">
              Professional Experience
            </h2>
            <div className="space-y-4 print:space-y-3">
              {experience.map((exp) => (
                <div key={exp.id} className="print:break-inside-avoid">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-base print:text-sm font-semibold text-gray-900">
                      {exp.position}
                    </h3>
                    <span className="text-sm print:text-xs text-gray-600 whitespace-nowrap ml-4">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-sm print:text-xs text-gray-700 mb-2">
                    <span className="font-medium">{exp.company}</span>
                    {exp.location && <span className="ml-2">• {exp.location}</span>}
                  </div>
                  {exp.description.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-sm print:text-xs text-gray-700 ml-2">
                      {exp.description.map((desc, index) => (
                        <li key={index}>{desc}</li>
                      ))}
                    </ul>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <div className="mt-2">
                      <h4 className="text-sm print:text-xs font-medium text-gray-800 mb-1">Key Achievements:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm print:text-xs text-gray-700 ml-2">
                        {exp.achievements.map((achievement, index) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-6 print:mb-4">
            <h2 className="text-lg print:text-base font-semibold text-gray-900 mb-3 print:mb-2 border-b border-gray-300 pb-1">
              Education
            </h2>
            <div className="space-y-3 print:space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="print:break-inside-avoid">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-base print:text-sm font-semibold text-gray-900">
                      {edu.degree} in {edu.field}
                    </h3>
                    <span className="text-sm print:text-xs text-gray-600 whitespace-nowrap ml-4">
                      {edu.startDate} - {edu.endDate || 'Present'}
                    </span>
                  </div>
                  <div className="text-sm print:text-xs text-gray-700">
                    <span className="font-medium">{edu.institution}</span>
                    {edu.location && <span className="ml-2">• {edu.location}</span>}
                    {edu.gpa && <span className="ml-2">• GPA: {edu.gpa}</span>}
                  </div>
                  {edu.coursework && edu.coursework.length > 0 && (
                    <div className="mt-1 text-sm print:text-xs text-gray-600">
                      <span className="font-medium">Relevant Coursework:</span> {edu.coursework.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section className="mb-6 print:mb-4">
            <h2 className="text-lg print:text-base font-semibold text-gray-900 mb-3 print:mb-2 border-b border-gray-300 pb-1">
              Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2">
              {['technical', 'soft'].map((category) => {
                const categorySkills = skills.filter(skill => skill.category === category);
                if (categorySkills.length === 0) return null;
                
                return (
                  <div key={category}>
                    <h3 className="text-sm print:text-xs font-medium text-gray-800 mb-2 capitalize">
                      {category} Skills
                    </h3>
                    <div className="flex flex-wrap gap-2 print:gap-1">
                      {categorySkills.map((skill) => (
                        <span 
                          key={skill.id}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs print:text-[10px] print:px-1 print:py-0.5"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="mb-6 print:mb-4">
            <h2 className="text-lg print:text-base font-semibold text-gray-900 mb-3 print:mb-2 border-b border-gray-300 pb-1">
              Projects
            </h2>
            <div className="space-y-4 print:space-y-3">
              {projects.map((project) => (
                <div key={project.id} className="print:break-inside-avoid">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-base print:text-sm font-semibold text-gray-900">
                      {project.name}
                    </h3>
                    <span className="text-sm print:text-xs text-gray-600 whitespace-nowrap ml-4">
                      {project.startDate} - {project.endDate || 'Present'}
                    </span>
                  </div>
                  <p className="text-sm print:text-xs text-gray-700 mb-2">
                    {project.description}
                  </p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {project.technologies.map((tech, index) => (
                        <span 
                          key={index}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs print:text-[10px] print:px-1"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="text-sm print:text-xs text-gray-600 space-x-4">
                    {project.githubUrl && (
                      <span>GitHub: {project.githubUrl}</span>
                    )}
                    {project.demoUrl && (
                      <span>Live: {project.demoUrl}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Print styles */}
        <style jsx>{`
          @media print {
            @page {
              margin: 0.5in;
              size: letter;
            }
            
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            .print\\:break-inside-avoid {
              break-inside: avoid;
              page-break-inside: avoid;
            }
          }
        `}</style>
      </div>
    );
  }
);

PrintableResume.displayName = 'PrintableResume';

export default PrintableResume; 