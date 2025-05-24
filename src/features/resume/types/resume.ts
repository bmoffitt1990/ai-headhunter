export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary?: string;
  linkedIn?: string;
  portfolio?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string[];
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate?: string;
  gpa?: number;
  coursework?: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'certification';
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate?: string;
  githubUrl?: string;
  demoUrl?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
}

// Utility types for form management
export interface FormFieldError {
  message: string;
  field: string;
}

export interface FormSection {
  id: string;
  name: string;
  isValid: boolean;
  isComplete: boolean;
}

// Default values for new entries
export const defaultExperience: Omit<Experience, 'id'> = {
  company: '',
  position: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: [],
  achievements: [],
};

export const defaultEducation: Omit<Education, 'id'> = {
  institution: '',
  degree: '',
  field: '',
  location: '',
  startDate: '',
  endDate: '',
  gpa: undefined,
  coursework: [],
};

export const defaultSkill: Omit<Skill, 'id'> = {
  name: '',
  category: 'technical',
  level: 'intermediate',
};

export const defaultProject: Omit<Project, 'id'> = {
  name: '',
  description: '',
  technologies: [],
  startDate: '',
  endDate: '',
  githubUrl: '',
  demoUrl: '',
};

export const defaultPersonalInfo: PersonalInfo = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  summary: '',
  linkedIn: '',
  portfolio: '',
};

export const defaultResumeData: ResumeData = {
  personalInfo: defaultPersonalInfo,
  experience: [],
  education: [],
  skills: [],
  projects: [],
}; 