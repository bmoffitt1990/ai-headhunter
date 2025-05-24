'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import type { ResumeFormData } from '@/lib/validations/resume-schema';
import { defaultEducation } from '../types/resume';
import { generateId } from '../utils/id-generator';
import { EducationEntry } from './EducationEntry';

/**
 * Education section component for managing education entries
 */
export const EducationSection = () => {
  const { control } = useFormContext<ResumeFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
  });

  const handleAddEducation = () => {
    append({
      ...defaultEducation,
      id: generateId(),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Education</h3>
          <p className="text-sm text-muted-foreground">
            Add your educational background, starting with the most recent.
          </p>
        </div>
        <Button onClick={handleAddEducation} size="sm" className="shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </div>

      {fields.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">No education added yet</p>
              <Button onClick={handleAddEducation} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Your Education
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
                  Education #{index + 1}
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
                <EducationEntry index={index} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {fields.length > 0 && (
        <Button onClick={handleAddEducation} variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Another Education
        </Button>
      )}
    </div>
  );
}; 