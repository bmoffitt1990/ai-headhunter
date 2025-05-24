import { ResumeData } from '@/features/resume/types/resume';
import { ResumeTemplate, TemplateCustomizations } from '@/lib/templates/types';

/**
 * PDF export configuration options for client-side generation
 */
export interface PDFExportOptions {
  /** Paper format */
  format: PaperFormat;
  /** Output quality/compression */
  quality: 'standard' | 'high' | 'print-ready';
  /** Custom filename (optional) */
  filename?: string;
  /** Include metadata in PDF */
  includeMetadata: boolean;
  /** Margin settings in inches */
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

/**
 * Supported paper formats
 */
export type PaperFormat = 'Letter' | 'A4' | 'Legal';

/**
 * Paper size dimensions in pixels (at 96 DPI)
 */
export const PAPER_SIZES: Record<PaperFormat, { width: number; height: number }> = {
  Letter: { width: 816, height: 1056 }, // 8.5" x 11"
  A4: { width: 794, height: 1123 },     // 210mm x 297mm
  Legal: { width: 816, height: 1344 },  // 8.5" x 14"
};

/**
 * Default PDF export options
 */
export const DEFAULT_PDF_OPTIONS: PDFExportOptions = {
  format: 'Letter',
  quality: 'standard',
  includeMetadata: true,
  margin: {
    top: 0.5,
    right: 0.5,
    bottom: 0.5,
    left: 0.5,
  },
};

/**
 * Quality presets for quick selection
 */
export const PDF_QUALITY_PRESETS = {
  standard: {
    name: 'Standard Quality',
    description: 'Good for most applications',
    quality: 'standard' as const,
    fileSize: 'Small-Medium',
  },
  high: {
    name: 'High Quality',
    description: 'Better for professional use',
    quality: 'high' as const,
    fileSize: 'Medium-Large',
  },
  'print-ready': {
    name: 'Print Ready',
    description: 'Best quality for printing',
    quality: 'print-ready' as const,
    fileSize: 'Large',
  },
} as const;

/**
 * PDF metadata structure
 */
export interface PDFMetadata {
  title: string;
  author: string;
  subject: string;
  keywords: string[];
  creator: string;
  producer: string;
  creationDate: Date;
  modificationDate: Date;
}

/**
 * PDF generation request for client-side processing
 */
export interface PDFGenerationRequest {
  resumeData: ResumeData;
  template: ResumeTemplate;
  customizations: TemplateCustomizations;
  options?: Partial<PDFExportOptions>;
}

/**
 * PDF generation response
 */
export interface PDFGenerationResponse {
  success: boolean;
  filename: string;
  fileSize?: number;
  generationTime?: number;
  error?: string;
  metadata?: PDFMetadata;
}

/**
 * PDF generation backend types
 */
export type PDFBackend = 'puppeteer' | 'jspdf' | 'browser-print';

/**
 * PDF generation status tracking
 */
export interface PDFGenerationStatus {
  id: string;
  status: 'preparing' | 'generating' | 'processing' | 'ready' | 'error' | 'expired';
  progress: number;
  estimatedTimeRemaining?: number;
  error?: string;
  startTime: Date;
  endTime?: Date;
}

/**
 * Download tracking event for analytics
 */
export interface DownloadEvent {
  id: string;
  userId: string;
  templateId: string;
  format: PDFExportOptions['format'];
  quality: PDFExportOptions['quality'];
  timestamp: Date;
  fileSize: number;
  generationTime: number;
  backend: PDFBackend;
  success: boolean;
  error?: string;
  userAgent?: string;
  ipAddress?: string;
}

/**
 * PDF quality presets for different use cases
 */
export interface PDFQualityPreset {
  id: string;
  name: string;
  description: string;
  options: Partial<PDFExportOptions>;
  recommendedFor: string[];
}

/**
 * Page break configuration for multi-page resumes
 */
export interface PageBreakConfig {
  strategy: 'auto' | 'manual' | 'section-based';
  avoidOrphans: boolean;
  minimumSectionHeight: number;
  keepSectionsTogether: string[];
  pageNumbering: boolean;
  pageNumberPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'bottom-center';
}

/**
 * Font configuration for PDF generation
 */
export interface PDFFontConfig {
  primaryFont: string;
  fallbackFonts: string[];
  embedFonts: boolean;
  fontSubsetting: boolean;
  loadTimeout: number;
}

/**
 * ATS (Applicant Tracking System) compliance configuration
 */
export interface ATSComplianceConfig {
  ensureSearchableText: boolean;
  optimizeStructure: boolean;
  includeAltText: boolean;
  validateReadability: boolean;
  removeComplexFormatting: boolean;
  embedKeywords: string[];
} 