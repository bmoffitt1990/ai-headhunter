import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getServerUser, createAuditLog, checkRateLimit } from '@/lib/auth/server';
import { sharingDb } from '@/lib/database';
import { ApiResponse, ResumeShare } from '@/types/database';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * POST /api/resumes/[id]/share - Create a resume share
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getServerUser();
    const { id } = params;
    
    // Rate limiting
    if (!checkRateLimit(`resume-share-${user.id}`, 10, 60000)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', message: 'Too many requests' },
        { status: 429 }
      );
    }
    
    const body = await request.json();
    const { title, expiresAt, isPasswordProtected, password } = body;
    
    const supabase = await createClient();
    
    // Verify the resume exists and belongs to the user
    const { data: resume, error: fetchError } = await supabase
      .from('resumes')
      .select('id, title')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (fetchError || !resume) {
      return NextResponse.json(
        { error: 'Not found', message: 'Resume not found' },
        { status: 404 }
      );
    }
    
    // Validate password if required
    if (isPasswordProtected && (!password || password.length < 4)) {
      return NextResponse.json(
        { error: 'Validation error', message: 'Password must be at least 4 characters' },
        { status: 400 }
      );
    }
    
    // Create the share
    const shareOptions = {
      title: title || resume.title,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      isPasswordProtected: Boolean(isPasswordProtected),
      password: isPasswordProtected ? password : undefined,
    };
    
    const share = await sharingDb.createShare(id, user.id, shareOptions);
    
    if (!share) {
      return NextResponse.json(
        { error: 'Database error', message: 'Failed to create share' },
        { status: 500 }
      );
    }
    
    // Create audit log
    await createAuditLog({
      tableName: 'resume_shares',
      recordId: share.id,
      action: 'INSERT',
      newValues: share,
      userId: user.id,
    });
    
    // Remove password hash from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...shareResponse } = share;
    
    const response: ApiResponse<ResumeShare> = {
      success: true,
      data: shareResponse as ResumeShare,
    };
    
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('POST /api/resumes/[id]/share error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/resumes/[id]/share - Get shares for a resume
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getServerUser();
    const { id } = params;
    
    // Rate limiting
    if (!checkRateLimit(`resume-shares-${user.id}`, 30, 60000)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', message: 'Too many requests' },
        { status: 429 }
      );
    }
    
    const supabase = await createClient();
    
    // Verify the resume exists and belongs to the user
    const { data: resume, error: fetchError } = await supabase
      .from('resumes')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (fetchError || !resume) {
      return NextResponse.json(
        { error: 'Not found', message: 'Resume not found' },
        { status: 404 }
      );
    }
    
    // Get all shares for this resume
    const { data: shares, error } = await supabase
      .from('resume_shares')
      .select('*')
      .eq('resume_id', id)
      .eq('shared_by', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching shares:', error);
      return NextResponse.json(
        { error: 'Database error', message: 'Failed to fetch shares' },
        { status: 500 }
      );
    }
    
    // Remove password hashes from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const cleanShares = shares?.map(({ password_hash, ...share }) => share) || [];
    
    const response: ApiResponse<ResumeShare[]> = {
      success: true,
      data: cleanShares as ResumeShare[],
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/resumes/[id]/share error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 