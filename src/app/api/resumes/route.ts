import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getServerUser, createAuditLog, checkRateLimit } from '@/lib/auth/server';
import { validateAndSanitizeResumeData } from '@/lib/validation';
import { ApiResponse, Resume, ResumeInsert } from '@/types/database';

/**
 * GET /api/resumes - List user's resumes with pagination and filtering
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser();
    const { searchParams } = new URL(request.url);
    
    // Rate limiting
    if (!checkRateLimit(`resumes-list-${user.id}`, 30, 60000)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', message: 'Too many requests' },
        { status: 429 }
      );
    }
    
    const supabase = await createClient();
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const status = searchParams.get('status') as 'draft' | 'published' | 'archived' | null;
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'updated_at';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';
    
    const offset = (page - 1) * limit;
    
    // Build query
    let query = supabase
      .from('resumes')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id);
    
    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,resume_data->>personalInfo->>fullName.ilike.%${search}%`);
    }
    
    // Apply sorting and pagination
    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);
    
    const { data: resumes, error, count } = await query;
    
    if (error) {
      console.error('Error fetching resumes:', error);
      return NextResponse.json(
        { error: 'Database error', message: 'Failed to fetch resumes' },
        { status: 500 }
      );
    }
    
    // Create audit log for data access
    await createAuditLog({
      tableName: 'resumes',
      recordId: 'list',
      action: 'SELECT',
      userId: user.id,
    });
    
    const response: ApiResponse<{
      resumes: Resume[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }> = {
      success: true,
      data: {
        resumes: resumes || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      },
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/resumes error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/resumes - Create a new resume
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser();
    
    // Rate limiting
    if (!checkRateLimit(`resumes-create-${user.id}`, 10, 60000)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', message: 'Too many requests' },
        { status: 429 }
      );
    }
    
    const body = await request.json();
    const { title, resume_data, template_id, is_primary } = body;
    
    // Validate required fields
    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: 'Validation error', message: 'Title is required and must be a string' },
        { status: 400 }
      );
    }
    
    if (!resume_data) {
      return NextResponse.json(
        { error: 'Validation error', message: 'Resume data is required' },
        { status: 400 }
      );
    }
    
    // Validate and sanitize resume data
    let validatedData;
    try {
      validatedData = validateAndSanitizeResumeData(resume_data);
    } catch (validationError) {
      return NextResponse.json(
        { 
          error: 'Validation error', 
          message: validationError instanceof Error ? validationError.message : 'Invalid resume data' 
        },
        { status: 400 }
      );
    }
    
    const supabase = await createClient();
    
    // Check user permissions and resume limits
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();
    
    const { data: existingResumes } = await supabase
      .from('resumes')
      .select('id')
      .eq('user_id', user.id);
    
    const resumeCount = existingResumes?.length || 0;
    const maxResumes = profile?.subscription_tier === 'free' ? 1 : 
                      profile?.subscription_tier === 'pro' ? 10 : -1;
    
    if (maxResumes !== -1 && resumeCount >= maxResumes) {
      return NextResponse.json(
        { 
          error: 'Limit exceeded', 
          message: `You have reached the maximum number of resumes for your ${profile?.subscription_tier} plan` 
        },
        { status: 403 }
      );
    }
    
    // If this is the first resume or explicitly set as primary, make it primary
    const shouldBePrimary = is_primary || resumeCount === 0;
    
    // If setting as primary, unset other primary resumes
    if (shouldBePrimary) {
      await supabase
        .from('resumes')
        .update({ is_primary: false })
        .eq('user_id', user.id)
        .eq('is_primary', true);
    }
    
    // Create the resume
    const resumeData: ResumeInsert = {
      user_id: user.id,
      title: title.trim(),
      resume_data: validatedData,
      template_id: template_id || 'professional',
      is_primary: shouldBePrimary,
      status: 'draft',
    };
    
    const { data: newResume, error: createError } = await supabase
      .from('resumes')
      .insert(resumeData)
      .select()
      .single();
    
    if (createError || !newResume) {
      console.error('Error creating resume:', createError);
      return NextResponse.json(
        { error: 'Database error', message: 'Failed to create resume' },
        { status: 500 }
      );
    }
    
    // Create audit log
    await createAuditLog({
      tableName: 'resumes',
      recordId: newResume.id,
      action: 'INSERT',
      newValues: newResume,
      userId: user.id,
    });
    
    const response: ApiResponse<Resume> = {
      success: true,
      data: newResume,
    };
    
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('POST /api/resumes error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 