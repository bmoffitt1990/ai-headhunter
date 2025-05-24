'use client';

import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X } from 'lucide-react';
import type { ResumeFormData } from '@/lib/validations/resume-schema';

interface ProjectEntryProps {
  index: number;
}

/**
 * Individual project entry component with dynamic technologies array
 */
export const ProjectEntry = ({ index }: ProjectEntryProps) => {
  const { control, watch, setValue, getValues } = useFormContext<ResumeFormData>();

  const technologies = watch(`projects.${index}.technologies`) || [];

  const addTechnology = () => {
    const currentTechnologies = getValues(`projects.${index}.technologies`) || [];
    setValue(`projects.${index}.technologies`, [...currentTechnologies, '']);
  };

  const removeTechnology = (techIndex: number) => {
    const currentTechnologies = getValues(`projects.${index}.technologies`) || [];
    setValue(`projects.${index}.technologies`, currentTechnologies.filter((_, i) => i !== techIndex));
  };

  return (
    <div className="space-y-4">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name={`projects.${index}.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name *</FormLabel>
              <FormControl>
                <Input placeholder="My Awesome Project" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={control}
            name={`projects.${index}.startDate`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date *</FormLabel>
                <FormControl>
                  <Input type="month" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`projects.${index}.endDate`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="month" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Project Description */}
      <FormField
        control={control}
        name={`projects.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Description *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe what the project does, your role, and key features..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
            <p className="text-xs text-muted-foreground">
              {field.value?.length || 0}/500 characters
            </p>
          </FormItem>
        )}
      />

      {/* Technologies Used */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <FormLabel>Technologies Used *</FormLabel>
          <Button
            type="button"
            onClick={addTechnology}
            size="sm"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Technology
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {technologies.map((_, techIndex) => (
            <div key={techIndex} className="flex gap-2">
              <FormField
                control={control}
                name={`projects.${index}.technologies.${techIndex}` as const}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="e.g., React, Node.js, MongoDB"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                onClick={() => removeTechnology(techIndex)}
                size="sm"
                variant="ghost"
                className="text-destructive shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Project Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name={`projects.${index}.githubUrl`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>GitHub URL</FormLabel>
              <FormControl>
                <Input placeholder="https://github.com/username/project" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`projects.${index}.demoUrl`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Demo/Live URL</FormLabel>
              <FormControl>
                <Input placeholder="https://myproject.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}; 