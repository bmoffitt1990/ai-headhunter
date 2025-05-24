'use client';

import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import type { ResumeFormData } from '@/lib/validations/resume-schema';

interface EducationEntryProps {
  index: number;
}

/**
 * Individual education entry component with dynamic coursework fields
 */
export const EducationEntry = ({ index }: EducationEntryProps) => {
  const { control, watch, setValue, getValues } = useFormContext<ResumeFormData>();

  const coursework = watch(`education.${index}.coursework`) || [];

  const addCoursework = () => {
    const currentCoursework = getValues(`education.${index}.coursework`) || [];
    setValue(`education.${index}.coursework`, [...currentCoursework, '']);
  };

  const removeCoursework = (courseIndex: number) => {
    const currentCoursework = getValues(`education.${index}.coursework`) || [];
    setValue(`education.${index}.coursework`, currentCoursework.filter((_, i) => i !== courseIndex));
  };

  return (
    <div className="space-y-4">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name={`education.${index}.institution`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Institution *</FormLabel>
              <FormControl>
                <Input placeholder="University Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`education.${index}.degree`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Degree *</FormLabel>
              <FormControl>
                <Input placeholder="Bachelor of Science" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`education.${index}.field`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field of Study *</FormLabel>
              <FormControl>
                <Input placeholder="Computer Science" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`education.${index}.location`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location *</FormLabel>
              <FormControl>
                <Input placeholder="City, State" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Date Range and GPA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name={`education.${index}.startDate`}
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
          name={`education.${index}.endDate`}
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

        <FormField
          control={control}
          name={`education.${index}.gpa`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>GPA (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4.0"
                  placeholder="3.85"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Relevant Coursework */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <FormLabel>Relevant Coursework (Optional)</FormLabel>
          <Button
            type="button"
            onClick={addCoursework}
            size="sm"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Course
          </Button>
        </div>
        
        {coursework.map((_, courseIndex) => (
          <div key={courseIndex} className="flex gap-2">
            <FormField
              control={control}
              name={`education.${index}.coursework.${courseIndex}` as const}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="Course name (e.g., Data Structures and Algorithms)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              onClick={() => removeCoursework(courseIndex)}
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
  );
}; 