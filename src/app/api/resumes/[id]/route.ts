import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getServerUser, createAuditLog, checkRateLimit } from '@/lib/auth/server';
import { validateAndSanitizeResumeData } from '@/lib/validation';
import { ApiResponse, Resume, ResumeUpdate } from '@/types/database';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/resumes/[id] - Get a specific resume
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getServerUser();
    const { id } = params;
    
    // Rate limiting
    if (!checkRateLimit(`resume-get-${user.id}`, 60, 60000)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', message: 'Too many requests' },
        { status: 429 }
      );
    }
    
    const supabase = await createClient();
    
    // Fetch the resume with version history
    const { data: resume, error } = await supabase
      .from('resumes')
      .select(`
        *,
        versions:resume_versions(
          id,
          version_number,
          change_summary,
          created_at,
          created_by
        )
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (error || !resume) {
      return NextResponse.json(
        { error: 'Not found', message: 'Resume not found' },
        { status: 404 }
      );
    }
    
    // Create audit log
    await createAuditLog({
      tableName: 'resumes',
      recordId: id,
      action: 'SELECT',
      userId: user.id,
    });
    
    const response: ApiResponse<Resume> = {
      success: true,
      data: resume,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/resumes/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/resumes/[id] - Update a specific resume
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getServerUser();
    const { id } = params;
    
    // Rate limiting
    if (!checkRateLimit(`resume-update-${user.id}`, 30, 60000)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', message: 'Too many requests' },
        { status: 429 }
      );
    }
    
    const body = await request.json();
    const { title, resume_data, template_id, is_primary, status } = body;
    
    const supabase = await createClient();
    
    // First, verify the resume exists and belongs to the user
    const { data: existingResume, error: fetchError } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (fetchError || !existingResume) {
      return NextResponse.json(
        { error: 'Not found', message: 'Resume not found' },
        { status: 404 }
      );
    }
    
    // Prepare update data
    const updateData: ResumeUpdate = {};
    
    // Validate and update title if provided
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length === 0) {
        return NextResponse.json(
          { error: 'Validation error', message: 'Title must be a non-empty string' },
          { status: 400 }
        );
      }
      updateData.title = title.trim();
    }
    
    // Validate and sanitize resume data if provided
    if (resume_data !== undefined) {
      try {
        updateData.resume_data = validateAndSanitizeResumeData(resume_data);
      } catch (validationError) {
        return NextResponse.json(
          { 
            error: 'Validation error', 
            message: validationError instanceof Error ? validationError.message : 'Invalid resume data' 
          },
          { status: 400 }
        );
      }
    }
    
    // Update template if provided
    if (template_id !== undefined) {
      const validTemplates = ['professional', 'modern', 'creative', 'executive', 'minimal'];
      if (!validTemplates.includes(template_id)) {
        return NextResponse.json(
          { error: 'Validation error', message: 'Invalid template ID' },
          { status: 400 }
        );
      }
      updateData.template_id = template_id;
    }
    
    // Update status if provided
    if (status !== undefined) {
      const validStatuses = ['draft', 'published', 'archived'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: 'Validation error', message: 'Invalid status' },
          { status: 400 }
        );
      }
      updateData.status = status;
    }
    
    // Handle primary resume setting
    if (is_primary !== undefined) {
      updateData.is_primary = Boolean(is_primary);
      
      // If setting as primary, unset other primary resumes
      if (updateData.is_primary) {
        await supabase
          .from('resumes')
          .update({ is_primary: false })
          .eq('user_id', user.id)
          .eq('is_primary', true)
          .neq('id', id);
      }
    }
    
    // Perform the update
    const { data: updatedResume, error: updateError } = await supabase
      .from('resumes')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    
    if (updateError || !updatedResume) {
      console.error('Error updating resume:', updateError);
      return NextResponse.json(
        { error: 'Database error', message: 'Failed to update resume' },
        { status: 500 }
      );
    }
    
    // Create audit log
    await createAuditLog({
      tableName: 'resumes',
      recordId: id,
      action: 'UPDATE',
      oldValues: existingResume,
      newValues: updatedResume,
      userId: user.id,
    });
    
    const response: ApiResponse<Resume> = {
      success: true,
      data: updatedResume,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('PUT /api/resumes/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/resumes/[id] - Delete a specific resume
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getServerUser();
    const { id } = params;
    
    // Rate limiting
    if (!checkRateLimit(`resume-delete-${user.id}`, 10, 60000)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', message: 'Too many requests' },
        { status: 429 }
      );
    }
    
    const supabase = await createClient();
    
    // First, verify the resume exists and belongs to the user
    const { data: existingResume, error: fetchError } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (fetchError || !existingResume) {
      return NextResponse.json(
        { error: 'Not found', message: 'Resume not found' },
        { status: 404 }
      );
    }
    
    // Check if this is the user's only resume
    const { data: userResumes } = await supabase
      .from('resumes')
      .select('id')
      .eq('user_id', user.id);
    
    if (userResumes && userResumes.length === 1) {
      return NextResponse.json(
        { error: 'Validation error', message: 'Cannot delete your only resume' },
        { status: 400 }
      );
    }
    
    // If deleting the primary resume, set another resume as primary
    if (existingResume.is_primary && userResumes && userResumes.length > 1) {
      const otherResumeId = userResumes.find(r => r.id !== id)?.id;
      if (otherResumeId) {
        await supabase
          .from('resumes')
          .update({ is_primary: true })
          .eq('id', otherResumeId);
      }
    }
    
    // Delete the resume (cascade will handle versions and shares)
    const { error: deleteError } = await supabase
      .from('resumes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    
    if (deleteError) {
      console.error('Error deleting resume:', deleteError);
      return NextResponse.json(
        { error: 'Database error', message: 'Failed to delete resume' },
        { status: 500 }
      );
    }
    
    // Create audit log
    await createAuditLog({
      tableName: 'resumes',
      recordId: id,
      action: 'DELETE',
      oldValues: existingResume,
      userId: user.id,
    });
    
    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Resume deleted successfully' },
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('DELETE /api/resumes/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 