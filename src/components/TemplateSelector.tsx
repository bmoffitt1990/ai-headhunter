import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  ResumeTemplate, 
  TemplateCustomizations, 
  TemplateColorTheme,
  TemplateFontOption
} from '@/lib/templates/types';
import { templateRegistry } from '@/lib/templates/registry';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';

interface TemplateSelectorProps {
  selectedTemplate: ResumeTemplate;
  customizations: TemplateCustomizations;
  onTemplateChange: (template: ResumeTemplate) => void;
  onCustomizationsChange: (customizations: TemplateCustomizations) => void;
  className?: string;
}

/**
 * Template selection and customization interface
 * Provides template thumbnails and customization controls
 */
const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  customizations,
  onTemplateChange,
  onCustomizationsChange,
  className,
}) => {
  const [activeTab, setActiveTab] = useState('templates');
  const templates = templateRegistry.templates;

  const handleTemplateSelect = (template: ResumeTemplate) => {
    onTemplateChange(template);
  };

  const handleCustomizationChange = (key: keyof TemplateCustomizations, value: unknown) => {
    onCustomizationsChange({
      ...customizations,
      [key]: value,
    });
  };

  const renderTemplateCard = (template: ResumeTemplate) => {
    const isSelected = selectedTemplate.id === template.id;
    
    return (
      <Card 
        key={template.id}
        className={cn(
          'cursor-pointer transition-all hover:shadow-md',
          isSelected && 'ring-2 ring-blue-500'
        )}
        onClick={() => handleTemplateSelect(template)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">{template.name}</CardTitle>
            {isSelected && (
              <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded">
                Selected
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{template.description}</p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="aspect-[8.5/11] bg-gray-100 rounded border mb-2 flex items-center justify-center">
            <span className="text-xs text-gray-500">Preview</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {template.isATSFriendly && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                ATS-Friendly
              </span>
            )}
            {template.isPrintOptimized && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                Print-Optimized
              </span>
            )}
            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded border">
              {template.category}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderColorThemeSelector = () => (
    <div className="space-y-2">
      <Label>Color Theme</Label>
      <Select
        value={customizations.colorTheme}
        onValueChange={(value) => handleCustomizationChange('colorTheme', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select color theme" />
        </SelectTrigger>
        <SelectContent>
          {selectedTemplate.colorThemes.map((theme: TemplateColorTheme) => (
            <SelectItem key={theme.id} value={theme.id}>
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded border"
                  style={{ backgroundColor: theme.primary }}
                />
                {theme.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const renderFontSelector = () => (
    <div className="space-y-2">
      <Label>Font Family</Label>
      <Select
        value={customizations.fontFamily}
        onValueChange={(value) => handleCustomizationChange('fontFamily', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select font" />
        </SelectTrigger>
        <SelectContent>
          {selectedTemplate.fontOptions.map((font: TemplateFontOption) => (
            <SelectItem key={font.id} value={font.id}>
              <span style={{ fontFamily: font.fontFamily }}>
                {font.name} ({font.category})
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const renderLayoutSelector = () => (
    <div className="space-y-2">
      <Label>Layout</Label>
      <Select
        value={customizations.layout}
        onValueChange={(value) => handleCustomizationChange('layout', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select layout" />
        </SelectTrigger>
        <SelectContent>
          {selectedTemplate.supportedLayouts.map((layout) => (
            <SelectItem key={layout} value={layout}>
              {layout.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const renderSpacingSelector = () => (
    <div className="space-y-2">
      <Label>Spacing</Label>
      <Select
        value={customizations.spacing}
        onValueChange={(value) => handleCustomizationChange('spacing', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select spacing" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="compact">Compact</SelectItem>
          <SelectItem value="normal">Normal</SelectItem>
          <SelectItem value="spacious">Spacious</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  const renderToggleOptions = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Show Icons</Label>
        <Button
          variant={customizations.showIcons ? "default" : "outline"}
          size="sm"
          onClick={() => handleCustomizationChange('showIcons', !customizations.showIcons)}
        >
          {customizations.showIcons ? 'On' : 'Off'}
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <Label>Show Photo</Label>
        <Button
          variant={customizations.showPhoto ? "default" : "outline"}
          size="sm"
          onClick={() => handleCustomizationChange('showPhoto', !customizations.showPhoto)}
        >
          {customizations.showPhoto ? 'On' : 'Off'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className={cn('template-selector', className)}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="customize">Customize</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map(renderTemplateCard)}
          </div>
        </TabsContent>
        
        <TabsContent value="customize" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderColorThemeSelector()}
            {renderFontSelector()}
            {renderLayoutSelector()}
            {renderSpacingSelector()}
          </div>
          {renderToggleOptions()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TemplateSelector; 