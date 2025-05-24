'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import type { ResumeFormData } from '@/lib/validations/resume-schema';
import { defaultSkill } from '../types/resume';
import { generateId } from '../utils/id-generator';

/**
 * Skills section component with categorized skills and proficiency levels
 */
export const SkillsSection = () => {
  const { control } = useFormContext<ResumeFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills',
  });

  const handleAddSkill = () => {
    append({
      ...defaultSkill,
      id: generateId(),
    });
  };

  const skillCategories = [
    { value: 'technical', label: 'Technical' },
    { value: 'soft', label: 'Soft Skills' },
    { value: 'certification', label: 'Certification' },
  ] as const;

  const skillLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' },
  ] as const;

  // Group skills by category for better display
  const groupedSkills = fields.reduce((acc, field, index) => {
    const skill = control._formValues.skills?.[index];
    const category = skill?.category || 'technical';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({ field, index });
    return acc;
  }, {} as Record<string, Array<{ field: { id: string }; index: number }>>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Skills</h3>
          <p className="text-sm text-muted-foreground">
            Add your technical skills, soft skills, and certifications.
          </p>
        </div>
        <Button onClick={handleAddSkill} size="sm" className="shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {fields.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">No skills added yet</p>
              <Button onClick={handleAddSkill} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Your Skills
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {skillCategories.map(({ value: categoryValue, label: categoryLabel }) => {
            const categorySkills = groupedSkills[categoryValue] || [];
            
            if (categorySkills.length === 0) return null;

            return (
              <Card key={categoryValue}>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">{categoryLabel}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categorySkills.map(({ field, index }) => (
                      <div key={field.id} className="space-y-3 p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 space-y-3">
                            <FormField
                              control={control}
                              name={`skills.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Skill Name *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., JavaScript" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={control}
                              name={`skills.${index}.category`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Category *</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {skillCategories.map((category) => (
                                        <SelectItem key={category.value} value={category.value}>
                                          {category.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={control}
                              name={`skills.${index}.level`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Proficiency Level</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select level" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {skillLevels.map((level) => (
                                        <SelectItem key={level.value} value={level.value}>
                                          {level.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <Button
                            type="button"
                            onClick={() => remove(index)}
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {fields.length > 0 && (
        <Button onClick={handleAddSkill} variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Another Skill
        </Button>
      )}
    </div>
  );
}; 