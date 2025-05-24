import { 
  ResumeTemplate, 
  TemplateRegistry, 
  TemplateMetadata,
  DEFAULT_COLOR_THEMES,
  DEFAULT_FONT_OPTIONS 
} from './types';

/**
 * Template registry implementation for managing available resume templates
 */
class TemplateRegistryImpl implements TemplateRegistry {
  private _templates: Map<string, ResumeTemplate> = new Map();

  constructor() {
    // Initialize with default templates
    this.initializeDefaultTemplates();
  }

  get templates(): ResumeTemplate[] {
    return Array.from(this._templates.values());
  }

  /**
   * Get a specific template by ID
   */
  getTemplate(id: string): ResumeTemplate | undefined {
    return this._templates.get(id);
  }

  /**
   * Get templates filtered by category
   */
  getTemplatesByCategory(category: ResumeTemplate['category']): ResumeTemplate[] {
    return this.templates.filter(template => template.category === category);
  }

  /**
   * Register a new template
   */
  registerTemplate(template: ResumeTemplate): void {
    this._templates.set(template.id, template);
  }

  /**
   * Get template metadata for display purposes
   */
  getTemplateMetadata(): TemplateMetadata[] {
    return this.templates.map(template => ({
      id: template.id,
      name: template.name,
      description: template.description,
      category: template.category,
      previewImage: template.previewImage,
      features: this.getTemplateFeatures(template),
      isATSFriendly: template.isATSFriendly,
      isPrintOptimized: template.isPrintOptimized,
    }));
  }

  /**
   * Get feature list for a template
   */
  private getTemplateFeatures(template: ResumeTemplate): string[] {
    const features: string[] = [];
    
    if (template.isATSFriendly) {
      features.push('ATS-Friendly');
    }
    
    if (template.isPrintOptimized) {
      features.push('Print-Optimized');
    }
    
    if (template.supportedLayouts.includes('two-column')) {
      features.push('Two-Column Layout');
    }
    
    if (template.colorThemes.length > 1) {
      features.push('Multiple Color Themes');
    }
    
    features.push(`${template.fontOptions.length} Font Options`);
    
    return features;
  }

  /**
   * Initialize default templates
   */
  private initializeDefaultTemplates(): void {
    // Professional Template
    this.registerTemplate({
      id: 'professional',
      name: 'Professional',
      description: 'Classic single-column layout perfect for traditional industries',
      previewImage: '/templates/professional-preview.png',
      category: 'professional',
      colorThemes: DEFAULT_COLOR_THEMES,
      fontOptions: DEFAULT_FONT_OPTIONS,
      supportedLayouts: ['single-column'],
      isATSFriendly: true,
      isPrintOptimized: true,
      version: '1.0.0',
    });

    // Modern Template
    this.registerTemplate({
      id: 'modern',
      name: 'Modern',
      description: 'Two-column layout with sidebar for modern professionals',
      previewImage: '/templates/modern-preview.png',
      category: 'modern',
      colorThemes: DEFAULT_COLOR_THEMES,
      fontOptions: DEFAULT_FONT_OPTIONS,
      supportedLayouts: ['two-column', 'single-column'],
      isATSFriendly: true,
      isPrintOptimized: true,
      version: '1.0.0',
    });

    // Minimal Template
    this.registerTemplate({
      id: 'minimal',
      name: 'Minimal',
      description: 'Clean typography-focused design with minimal styling',
      previewImage: '/templates/minimal-preview.png',
      category: 'minimal',
      colorThemes: DEFAULT_COLOR_THEMES.filter(theme => 
        ['professional', 'modern'].includes(theme.id)
      ),
      fontOptions: DEFAULT_FONT_OPTIONS,
      supportedLayouts: ['single-column'],
      isATSFriendly: true,
      isPrintOptimized: true,
      version: '1.0.0',
    });
  }
}

// Export singleton instance
export const templateRegistry = new TemplateRegistryImpl();

/**
 * Helper functions for template management
 */
export const templateUtils = {
  /**
   * Get default template (Professional)
   */
  getDefaultTemplate: (): ResumeTemplate => {
    const template = templateRegistry.getTemplate('professional');
    if (!template) {
      throw new Error('Default template not found');
    }
    return template;
  },

  /**
   * Validate template compatibility with customizations
   */
  validateCustomizations: (template: ResumeTemplate, customizations: any): boolean => {
    // Check if layout is supported
    if (!template.supportedLayouts.includes(customizations.layout)) {
      return false;
    }
    
    // Check if color theme exists
    const hasColorTheme = template.colorThemes.some(
      theme => theme.id === customizations.colorTheme
    );
    if (!hasColorTheme) {
      return false;
    }
    
    // Check if font option exists
    const hasFontOption = template.fontOptions.some(
      font => font.id === customizations.fontFamily
    );
    if (!hasFontOption) {
      return false;
    }
    
    return true;
  },

  /**
   * Get compatible templates for specific requirements
   */
  getCompatibleTemplates: (requirements: {
    atsRequired?: boolean;
    printOptimized?: boolean;
    category?: ResumeTemplate['category'];
    layout?: string;
  }): ResumeTemplate[] => {
    return templateRegistry.templates.filter(template => {
      if (requirements.atsRequired && !template.isATSFriendly) {
        return false;
      }
      
      if (requirements.printOptimized && !template.isPrintOptimized) {
        return false;
      }
      
      if (requirements.category && template.category !== requirements.category) {
        return false;
      }
      
      if (requirements.layout && !template.supportedLayouts.includes(requirements.layout as any)) {
        return false;
      }
      
      return true;
    });
  },
}; 