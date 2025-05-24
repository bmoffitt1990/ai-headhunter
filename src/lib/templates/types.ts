import { ResumeData } from '@/features/resume/types/resume';

/**
 * Color theme configuration for template customization
 */
export interface TemplateColorTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  textSecondary: string;
  background: string;
  border: string;
}

/**
 * Font configuration options for templates
 */
export interface TemplateFontOption {
  id: string;
  name: string;
  fontFamily: string;
  webSafe: boolean;
  category: 'serif' | 'sans-serif' | 'monospace';
}

/**
 * Template customization options
 */
export interface TemplateCustomizations {
  colorTheme: string;
  fontFamily: string;
  spacing: 'compact' | 'normal' | 'spacious';
  layout: 'single-column' | 'two-column' | 'three-column';
  sectionOrder: string[];
  showPhoto: boolean;
  showIcons: boolean;
  pageBreaks: 'auto' | 'manual' | 'none';
}

/**
 * Main template interface
 */
export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  category: 'professional' | 'creative' | 'modern' | 'minimal';
  colorThemes: TemplateColorTheme[];
  fontOptions: TemplateFontOption[];
  supportedLayouts: TemplateCustomizations['layout'][];
  isATSFriendly: boolean;
  isPrintOptimized: boolean;
  version: string;
}

/**
 * Props for template rendering components
 */
export interface TemplateRenderProps {
  resumeData: ResumeData;
  template: ResumeTemplate;
  customizations: TemplateCustomizations;
  viewMode: 'edit' | 'preview' | 'print';
  className?: string;
  children?: React.ReactNode;
}

/**
 * Individual section component props
 */
export interface TemplateSectionProps {
  template: ResumeTemplate;
  customizations: TemplateCustomizations;
  className?: string;
}

/**
 * Template registry interface for managing available templates
 */
export interface TemplateRegistry {
  templates: ResumeTemplate[];
  getTemplate: (id: string) => ResumeTemplate | undefined;
  getTemplatesByCategory: (category: ResumeTemplate['category']) => ResumeTemplate[];
  registerTemplate: (template: ResumeTemplate) => void;
}

/**
 * Template metadata for display and selection
 */
export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  category: ResumeTemplate['category'];
  previewImage: string;
  features: string[];
  isATSFriendly: boolean;
  isPrintOptimized: boolean;
}

/**
 * Default color themes
 */
export const DEFAULT_COLOR_THEMES: TemplateColorTheme[] = [
  {
    id: 'professional',
    name: 'Professional',
    primary: '#1e3a8a', // blue-800
    secondary: '#374151', // gray-700
    accent: '#2563eb', // blue-600
    text: '#111827', // gray-900
    textSecondary: '#6b7280', // gray-500
    background: '#ffffff',
    border: '#e5e7eb', // gray-200
  },
  {
    id: 'modern',
    name: 'Modern',
    primary: '#2563eb', // blue-600
    secondary: '#475569', // slate-600
    accent: '#3b82f6', // blue-500
    text: '#0f172a', // slate-900
    textSecondary: '#64748b', // slate-500
    background: '#ffffff',
    border: '#e2e8f0', // slate-200
  },
  {
    id: 'creative',
    name: 'Creative',
    primary: '#0d9488', // teal-600
    secondary: '#059669', // emerald-600
    accent: '#14b8a6', // teal-500
    text: '#111827', // gray-900
    textSecondary: '#6b7280', // gray-500
    background: '#ffffff',
    border: '#d1d5db', // gray-300
  },
];

/**
 * Default font options
 */
export const DEFAULT_FONT_OPTIONS: TemplateFontOption[] = [
  {
    id: 'inter',
    name: 'Inter',
    fontFamily: 'Inter, sans-serif',
    webSafe: true,
    category: 'sans-serif',
  },
  {
    id: 'roboto',
    name: 'Roboto',
    fontFamily: 'Roboto, sans-serif',
    webSafe: true,
    category: 'sans-serif',
  },
  {
    id: 'open-sans',
    name: 'Open Sans',
    fontFamily: 'Open Sans, sans-serif',
    webSafe: true,
    category: 'sans-serif',
  },
  {
    id: 'times',
    name: 'Times New Roman',
    fontFamily: 'Times New Roman, serif',
    webSafe: true,
    category: 'serif',
  },
  {
    id: 'georgia',
    name: 'Georgia',
    fontFamily: 'Georgia, serif',
    webSafe: true,
    category: 'serif',
  },
];

/**
 * Default template customizations
 */
export const DEFAULT_CUSTOMIZATIONS: TemplateCustomizations = {
  colorTheme: 'professional',
  fontFamily: 'inter',
  spacing: 'normal',
  layout: 'single-column',
  sectionOrder: ['personalInfo', 'experience', 'education', 'skills', 'projects'],
  showPhoto: false,
  showIcons: true,
  pageBreaks: 'auto',
}; 