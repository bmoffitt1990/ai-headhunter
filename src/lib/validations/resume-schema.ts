import { z } from 'zod';

// Email and phone validation patterns
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
const urlRegex = /^https?:\/\/.+\..+/;

// Date validation helper
const dateString = z.string().regex(/^\d{4}-\d{2}$/, 'Date must be in YYYY-MM format');

// Custom date comparison validation
const dateRangeValidator = (data: { startDate: string; endDate?: string; current?: boolean }) => {
  if (!data.current && data.endDate) {
    const start = new Date(data.startDate + '-01');
    const end = new Date(data.endDate + '-01');
    return end > start;
  }
  return true;
};

export const personalInfoSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100, 'Full name must be less than 100 characters'),
  email: z.string().regex(emailRegex, 'Please enter a valid email address'),
  phone: z.string().regex(phoneRegex, 'Please enter a valid phone number'),
  location: z.string().min(2, 'Location must be at least 2 characters').max(100, 'Location must be less than 100 characters'),
  summary: z.string().max(500, 'Summary must be less than 500 characters').optional(),
  linkedIn: z.string().regex(urlRegex, 'LinkedIn must be a valid URL').optional().or(z.literal('')),
  portfolio: z.string().regex(urlRegex, 'Portfolio must be a valid URL').optional().or(z.literal('')),
});

export const experienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, 'Company name is required').max(100, 'Company name must be less than 100 characters'),
  position: z.string().min(1, 'Position is required').max(100, 'Position must be less than 100 characters'),
  location: z.string().min(1, 'Location is required').max(100, 'Location must be less than 100 characters'),
  startDate: dateString,
  endDate: dateString.optional(),
  current: z.boolean(),
  description: z.array(z.string().min(10, 'Each description must be at least 10 characters').max(200, 'Each description must be less than 200 characters')).max(5, 'Maximum 5 description points'),
  achievements: z.array(z.string().min(10, 'Each achievement must be at least 10 characters').max(200, 'Each achievement must be less than 200 characters')).max(5, 'Maximum 5 achievement points'),
}).refine(dateRangeValidator, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, 'Institution name is required').max(100, 'Institution name must be less than 100 characters'),
  degree: z.string().min(1, 'Degree is required').max(100, 'Degree must be less than 100 characters'),
  field: z.string().min(1, 'Field of study is required').max(100, 'Field of study must be less than 100 characters'),
  location: z.string().min(1, 'Location is required').max(100, 'Location must be less than 100 characters'),
  startDate: dateString,
  endDate: dateString.optional(),
  gpa: z.number().min(0).max(4.0, 'GPA must be between 0 and 4.0').optional(),
  coursework: z.array(z.string().min(2, 'Course name must be at least 2 characters').max(50, 'Course name must be less than 50 characters')).max(10, 'Maximum 10 courses').optional(),
}).refine(dateRangeValidator, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export const skillSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Skill name is required').max(50, 'Skill name must be less than 50 characters'),
  category: z.enum(['technical', 'soft', 'certification'], {
    errorMap: () => ({ message: 'Category must be technical, soft, or certification' }),
  }),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Project name is required').max(100, 'Project name must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  technologies: z.array(z.string().min(1, 'Technology name is required').max(30, 'Technology name must be less than 30 characters')).min(1, 'At least one technology is required').max(10, 'Maximum 10 technologies'),
  startDate: dateString,
  endDate: dateString.optional(),
  githubUrl: z.string().regex(urlRegex, 'GitHub URL must be a valid URL').optional().or(z.literal('')),
  demoUrl: z.string().regex(urlRegex, 'Demo URL must be a valid URL').optional().or(z.literal('')),
}).refine(dateRangeValidator, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export const resumeDataSchema = z.object({
  personalInfo: personalInfoSchema,
  experience: z.array(experienceSchema).max(10, 'Maximum 10 work experiences'),
  education: z.array(educationSchema).max(5, 'Maximum 5 education entries'),
  skills: z.array(skillSchema).max(50, 'Maximum 50 skills'),
  projects: z.array(projectSchema).max(10, 'Maximum 10 projects'),
});

// Individual form step schemas for better validation feedback
export const personalInfoFormSchema = personalInfoSchema;
export const experienceFormSchema = z.array(experienceSchema);
export const educationFormSchema = z.array(educationSchema);
export const skillsFormSchema = z.array(skillSchema);
export const projectsFormSchema = z.array(projectSchema);

// Type inference from schemas
export type PersonalInfoFormData = z.infer<typeof personalInfoFormSchema>;
export type ExperienceFormData = z.infer<typeof experienceFormSchema>;
export type EducationFormData = z.infer<typeof educationFormSchema>;
export type SkillsFormData = z.infer<typeof skillsFormSchema>;
export type ProjectsFormData = z.infer<typeof projectsFormSchema>;
export type ResumeFormData = z.infer<typeof resumeDataSchema>; 