'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import type { ResumeFormData } from '@/lib/validations/resume-schema';
import { defaultProject } from '../types/resume';
import { generateId } from '../utils/id-generator';
import { ProjectEntry } from './ProjectEntry';

/**
 * Projects section component for managing project entries
 */
export const ProjectsSection = () => {
  const { control } = useFormContext<ResumeFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'projects',
  });

  const handleAddProject = () => {
    append({
      ...defaultProject,
      id: generateId(),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Projects</h3>
          <p className="text-sm text-muted-foreground">
            Showcase your personal and professional projects.
          </p>
        </div>
        <Button onClick={handleAddProject} size="sm" className="shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {fields.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">No projects added yet</p>
              <Button onClick={handleAddProject} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Project
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
                  Project #{index + 1}
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
                <ProjectEntry index={index} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {fields.length > 0 && (
        <Button onClick={handleAddProject} variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Another Project
        </Button>
      )}
    </div>
  );
}; 