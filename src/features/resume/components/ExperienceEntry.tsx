'use client';

import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X } from 'lucide-react';
import type { ResumeFormData } from '@/lib/validations/resume-schema';

interface ExperienceEntryProps {
  index: number;
}

/**
 * Individual experience entry component with dynamic description and achievement fields
 */
export const ExperienceEntry = ({ index }: ExperienceEntryProps) => {
  const { control, watch, setValue, getValues } = useFormContext<ResumeFormData>();

  const isCurrent = watch(`experience.${index}.current`);
  const descriptions = watch(`experience.${index}.description`) || [];
  const achievements = watch(`experience.${index}.achievements`) || [];

  const addDescription = () => {
    const currentDescriptions = getValues(`experience.${index}.description`) || [];
    setValue(`experience.${index}.description`, [...currentDescriptions, '']);
  };

  const removeDescription = (descIndex: number) => {
    const currentDescriptions = getValues(`experience.${index}.description`) || [];
    setValue(`experience.${index}.description`, currentDescriptions.filter((_, i) => i !== descIndex));
  };

  const addAchievement = () => {
    const currentAchievements = getValues(`experience.${index}.achievements`) || [];
    setValue(`experience.${index}.achievements`, [...currentAchievements, '']);
  };

  const removeAchievement = (achIndex: number) => {
    const currentAchievements = getValues(`experience.${index}.achievements`) || [];
    setValue(`experience.${index}.achievements`, currentAchievements.filter((_, i) => i !== achIndex));
  };

  return (
    <div className="space-y-4">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name={`experience.${index}.company`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company *</FormLabel>
              <FormControl>
                <Input placeholder="Company Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`experience.${index}.position`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position *</FormLabel>
              <FormControl>
                <Input placeholder="Job Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`experience.${index}.location`}
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

        <FormField
          control={control}
          name={`experience.${index}.current`}
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2 space-y-0 pt-6">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </FormControl>
              <FormLabel className="text-sm font-normal">
                I currently work here
              </FormLabel>
            </FormItem>
          )}
        />
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name={`experience.${index}.startDate`}
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

        {!isCurrent && (
          <FormField
            control={control}
            name={`experience.${index}.endDate`}
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
        )}
      </div>

      {/* Job Description */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <FormLabel>Job Description</FormLabel>
          <Button
            type="button"
            onClick={addDescription}
            size="sm"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Point
          </Button>
        </div>
        
        {descriptions.map((_, descIndex) => (
          <div key={descIndex} className="flex gap-2">
            <FormField
              control={control}
              name={`experience.${index}.description.${descIndex}` as const}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Textarea
                      placeholder="Describe your responsibilities and daily tasks..."
                      className="min-h-[60px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              onClick={() => removeDescription(descIndex)}
              size="sm"
              variant="ghost"
              className="text-destructive shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <FormLabel>Key Achievements</FormLabel>
          <Button
            type="button"
            onClick={addAchievement}
            size="sm"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Achievement
          </Button>
        </div>
        
        {achievements.map((_, achIndex) => (
          <div key={achIndex} className="flex gap-2">
            <FormField
              control={control}
              name={`experience.${index}.achievements.${achIndex}` as const}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Textarea
                      placeholder="Quantify your impact (e.g., 'Increased sales by 25%')..."
                      className="min-h-[60px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              onClick={() => removeAchievement(achIndex)}
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