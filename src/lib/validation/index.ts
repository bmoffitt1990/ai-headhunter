import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';
import { ResumeData } from '@/types/database';
import { resumeDataSchema } from '@/lib/validations/resume-schema';

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(content: string): string {
  if (typeof content !== 'string') return '';
  
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'u', 'br', 'p'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
}

/**
 * Sanitize text content by removing harmful characters
 */
export function sanitizeText(text: string): string {
  if (typeof text !== 'string') return '';
  
  // Remove null bytes and control characters except newlines and tabs
  return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

/**
 * Validate and sanitize email address
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') return '';
  
  const sanitized = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(sanitized)) {
    throw new Error('Invalid email format');
  }
  
  return sanitized;
}

/**
 * Validate and sanitize URL
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== 'string' || !url.trim()) return '';
  
  try {
    const urlObj = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('Invalid URL protocol');
    }
    
    return urlObj.toString();
  } catch {
    throw new Error('Invalid URL format');
  }
}

/**
 * Sanitize phone number
 */
export function sanitizePhone(phone: string): string {
  if (typeof phone !== 'string') return '';
  
  // Remove all non-numeric characters except + and spaces
  const cleaned = phone.replace(/[^\d\+\s\-\(\)]/g, '');
  
  // Basic validation - must have at least 10 digits
  const digitsOnly = cleaned.replace(/\D/g, '');
  if (digitsOnly.length < 10) {
    throw new Error('Phone number must have at least 10 digits');
  }
  
  return cleaned.trim();
}

/**
 * Sanitize array of strings
 */
export function sanitizeStringArray(array: unknown): string[] {
  if (!Array.isArray(array)) return [];
  
  return array
    .filter((item): item is string => typeof item === 'string')
    .map(sanitizeText)
    .filter(Boolean);
}

/**
 * Comprehensive resume data sanitization
 */
export function sanitizeResumeData(data: unknown): ResumeData {
  const sanitized: ResumeData = {};
  
  if (!data || typeof data !== 'object') {
    return sanitized;
  }
  
  const resumeData = data as Record<string, unknown>;
  
  // Sanitize personal information
  if (resumeData.personalInfo && typeof resumeData.personalInfo === 'object') {
    const personalInfo = resumeData.personalInfo as Record<string, unknown>;
    sanitized.personalInfo = {
      fullName: personalInfo.fullName ? sanitizeText(String(personalInfo.fullName)) : undefined,
      email: personalInfo.email ? sanitizeEmail(String(personalInfo.email)) : undefined,
      phone: personalInfo.phone ? sanitizePhone(String(personalInfo.phone)) : undefined,
      location: personalInfo.location ? sanitizeText(String(personalInfo.location)) : undefined,
      website: personalInfo.website ? sanitizeUrl(String(personalInfo.website)) : undefined,
      linkedin: personalInfo.linkedin ? sanitizeUrl(String(personalInfo.linkedin)) : undefined,
      portfolio: personalInfo.portfolio ? sanitizeUrl(String(personalInfo.portfolio)) : undefined,
      summary: personalInfo.summary ? sanitizeHtml(String(personalInfo.summary)) : undefined,
    };
  }
  
  // Sanitize experience
  if (Array.isArray(resumeData.experience)) {
    sanitized.experience = resumeData.experience.map((exp: unknown) => {
      if (!exp || typeof exp !== 'object') return null;
      const experience = exp as Record<string, unknown>;
      return {
        id: sanitizeText(String(experience.id || '')),
        company: sanitizeText(String(experience.company || '')),
        position: sanitizeText(String(experience.position || '')),
        location: sanitizeText(String(experience.location || '')),
        startDate: sanitizeText(String(experience.startDate || '')),
        endDate: experience.endDate ? sanitizeText(String(experience.endDate)) : undefined,
        current: Boolean(experience.current),
        description: Array.isArray(experience.description) 
          ? experience.description.map((desc: unknown) => sanitizeHtml(String(desc)))
          : [],
        achievements: Array.isArray(experience.achievements) 
          ? experience.achievements.map((ach: unknown) => sanitizeHtml(String(ach)))
          : [],
      };
    }).filter(Boolean) as NonNullable<ResumeData['experience']>;
  }
  
  // Sanitize education
  if (Array.isArray(resumeData.education)) {
    sanitized.education = resumeData.education.map((edu: unknown) => {
      if (!edu || typeof edu !== 'object') return null;
      const education = edu as Record<string, unknown>;
      return {
        id: sanitizeText(String(education.id || '')),
        institution: sanitizeText(String(education.institution || '')),
        degree: sanitizeText(String(education.degree || '')),
        field: sanitizeText(String(education.field || '')),
        location: sanitizeText(String(education.location || '')),
        startDate: sanitizeText(String(education.startDate || '')),
        endDate: education.endDate ? sanitizeText(String(education.endDate)) : undefined,
        gpa: typeof education.gpa === 'number' ? education.gpa : undefined,
        coursework: Array.isArray(education.coursework) 
          ? education.coursework.map((course: unknown) => sanitizeText(String(course)))
          : undefined,
      };
    }).filter(Boolean) as NonNullable<ResumeData['education']>;
  }
  
  // Sanitize skills
  if (Array.isArray(resumeData.skills)) {
    sanitized.skills = resumeData.skills.map((skill: unknown) => {
      if (!skill || typeof skill !== 'object') return null;
      const skillData = skill as Record<string, unknown>;
      return {
        id: sanitizeText(String(skillData.id || '')),
        name: sanitizeText(String(skillData.name || '')),
        category: ['technical', 'soft', 'certification'].includes(String(skillData.category)) 
          ? String(skillData.category) as 'technical' | 'soft' | 'certification'
          : 'technical',
        level: ['beginner', 'intermediate', 'advanced', 'expert'].includes(String(skillData.level)) 
          ? String(skillData.level) as 'beginner' | 'intermediate' | 'advanced' | 'expert'
          : undefined,
      };
    }).filter(Boolean) as NonNullable<ResumeData['skills']>;
  }
  
  // Sanitize projects
  if (Array.isArray(resumeData.projects)) {
    sanitized.projects = resumeData.projects.map((project: unknown) => {
      if (!project || typeof project !== 'object') return null;
      const projectData = project as Record<string, unknown>;
      return {
        id: sanitizeText(String(projectData.id || '')),
        name: sanitizeText(String(projectData.name || '')),
        description: sanitizeHtml(String(projectData.description || '')),
        technologies: sanitizeStringArray(projectData.technologies),
        githubUrl: projectData.githubUrl ? sanitizeUrl(String(projectData.githubUrl)) : undefined,
        demoUrl: projectData.demoUrl ? sanitizeUrl(String(projectData.demoUrl)) : undefined,
        startDate: sanitizeText(String(projectData.startDate || '')),
        endDate: projectData.endDate ? sanitizeText(String(projectData.endDate)) : undefined,
      };
    }).filter(Boolean) as NonNullable<ResumeData['projects']>;
  }
  
  // Sanitize certifications
  if (Array.isArray(resumeData.certifications)) {
    sanitized.certifications = resumeData.certifications.map((cert: unknown) => {
      if (!cert || typeof cert !== 'object') return null;
      const certData = cert as Record<string, unknown>;
      return {
        id: sanitizeText(String(certData.id || '')),
        name: sanitizeText(String(certData.name || '')),
        issuer: sanitizeText(String(certData.issuer || '')),
        date: sanitizeText(String(certData.date || '')),
        expiryDate: certData.expiryDate ? sanitizeText(String(certData.expiryDate)) : undefined,
        credentialId: certData.credentialId ? sanitizeText(String(certData.credentialId)) : undefined,
        url: certData.url ? sanitizeUrl(String(certData.url)) : undefined,
      };
    }).filter(Boolean) as NonNullable<ResumeData['certifications']>;
  }
  
  return sanitized;
}

/**
 * Validate resume data against schema and return sanitized version
 */
export function validateAndSanitizeResumeData(data: unknown): ResumeData {
  try {
    // First sanitize the data
    const sanitized = sanitizeResumeData(data);
    
    // Then validate against schema
    const validated = resumeDataSchema.parse(sanitized);
    
    return validated;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Validation failed: ${errorMessages.join(', ')}`);
    }
    
    throw error;
  }
}

/**
 * Check if resume data has required minimum content
 */
export function validateResumeCompleteness(data: ResumeData): {
  isComplete: boolean;
  missingFields: string[];
  warnings: string[];
} {
  const missingFields: string[] = [];
  const warnings: string[] = [];
  
  // Check personal info
  if (!data.personalInfo?.fullName) {
    missingFields.push('Full name');
  }
  if (!data.personalInfo?.email) {
    missingFields.push('Email address');
  }
  if (!data.personalInfo?.phone) {
    warnings.push('Phone number');
  }
  
  // Check for at least some experience or education
  const hasExperience = data.experience && data.experience.length > 0;
  const hasEducation = data.education && data.education.length > 0;
  
  if (!hasExperience && !hasEducation) {
    missingFields.push('Work experience or education');
  }
  
  // Check for skills
  if (!data.skills || data.skills.length === 0) {
    warnings.push('Skills section');
  }
  
  return {
    isComplete: missingFields.length === 0,
    missingFields,
    warnings,
  };
}

/**
 * Calculate resume content score (0-100)
 */
export function calculateResumeScore(data: ResumeData): {
  score: number;
  breakdown: Record<string, number>;
  suggestions: string[];
} {
  let score = 0;
  const breakdown: Record<string, number> = {};
  const suggestions: string[] = [];
  
  // Personal info (20 points)
  let personalScore = 0;
  if (data.personalInfo?.fullName) personalScore += 5;
  if (data.personalInfo?.email) personalScore += 5;
  if (data.personalInfo?.phone) personalScore += 3;
  if (data.personalInfo?.location) personalScore += 2;
  if (data.personalInfo?.summary && data.personalInfo.summary.length > 50) {
    personalScore += 5;
  } else if (data.personalInfo?.summary) {
    personalScore += 2;
    suggestions.push('Expand your professional summary');
  } else {
    suggestions.push('Add a professional summary');
  }
  breakdown.personalInfo = personalScore;
  score += personalScore;
  
  // Experience (30 points)
  let experienceScore = 0;
  if (data.experience && data.experience.length > 0) {
    experienceScore = Math.min(30, data.experience.length * 10);
    if (data.experience.length === 1) {
      suggestions.push('Add more work experience entries');
    }
  } else {
    suggestions.push('Add work experience');
  }
  breakdown.experience = experienceScore;
  score += experienceScore;
  
  // Education (20 points)
  let educationScore = 0;
  if (data.education && data.education.length > 0) {
    educationScore = Math.min(20, data.education.length * 10);
  } else {
    suggestions.push('Add education information');
  }
  breakdown.education = educationScore;
  score += educationScore;
  
  // Skills (20 points)
  let skillsScore = 0;
  if (data.skills && data.skills.length > 0) {
    skillsScore = Math.min(20, data.skills.length * 2);
    if (data.skills.length < 5) {
      suggestions.push('Add more relevant skills');
    }
  } else {
    suggestions.push('Add skills');
  }
  breakdown.skills = skillsScore;
  score += skillsScore;
  
  // Projects (10 points)
  let projectsScore = 0;
  if (data.projects && data.projects.length > 0) {
    projectsScore = Math.min(10, data.projects.length * 5);
  } else {
    suggestions.push('Consider adding relevant projects');
  }
  breakdown.projects = projectsScore;
  score += projectsScore;
  
  return {
    score: Math.round(score),
    breakdown,
    suggestions,
  };
}

/**
 * Detect potentially harmful content in resume data
 */
export function detectSuspiciousContent(data: ResumeData): {
  hasSuspiciousContent: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  // Check for potentially harmful patterns
  const suspiciousPatterns = [
    /javascript:/i,
    /data:/i,
    /vbscript:/i,
    /<script/i,
    /onload=/i,
    /onerror=/i,
    /onclick=/i,
  ];
  
  const textToCheck = JSON.stringify(data);
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(textToCheck)) {
      warnings.push(`Potentially harmful content detected: ${pattern.source}`);
    }
  }
  
  // Check for excessive length (potential DoS)
  if (textToCheck.length > 100000) { // 100KB limit
    warnings.push('Resume data exceeds recommended size limit');
  }
  
  return {
    hasSuspiciousContent: warnings.length > 0,
    warnings,
  };
}

/**
 * Clean up and optimize resume data
 */
export function optimizeResumeData(data: ResumeData): ResumeData {
  const optimized = { ...data };
  
  // Remove empty arrays
  if (optimized.experience?.length === 0) delete optimized.experience;
  if (optimized.education?.length === 0) delete optimized.education;
  if (optimized.skills?.length === 0) delete optimized.skills;
  if (optimized.projects?.length === 0) delete optimized.projects;
  if (optimized.certifications?.length === 0) delete optimized.certifications;
  
  // Trim whitespace and remove empty fields
  if (optimized.personalInfo) {
    Object.keys(optimized.personalInfo).forEach(key => {
      const value = optimized.personalInfo![key as keyof typeof optimized.personalInfo];
      if (typeof value === 'string' && !value.trim()) {
        delete optimized.personalInfo![key as keyof typeof optimized.personalInfo];
      }
    });
  }
  
  return optimized;
} 