'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import type { ResumeFormData } from '@/lib/validations/resume-schema';
import { defaultExperience } from '../types/resume';
import { generateId } from '../utils/id-generator';
import { ExperienceEntry } from './ExperienceEntry';

/**
 * Experience section component for managing work experience entries
 */
export const ExperienceSection = () => {
  const { control } = useFormContext<ResumeFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experience',
  });

  const handleAddExperience = () => {
    append({
      ...defaultExperience,
      id: generateId(),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Work Experience</h3>
          <p className="text-sm text-muted-foreground">
            Add your professional work experience, starting with the most recent.
          </p>
        </div>
        <Button onClick={handleAddExperience} size="sm" className="shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {fields.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">No work experience added yet</p>
              <Button onClick={handleAddExperience} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Experience
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center justify-between">
                  Experience #{index + 1}
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    Remove
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ExperienceEntry index={index} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {fields.length > 0 && (
        <Button onClick={handleAddExperience} variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Another Experience
        </Button>
      )}
    </div>
  );
}; 