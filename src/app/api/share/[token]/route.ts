import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/auth/server';
import { sharingDb } from '@/lib/database';
import { ApiResponse, ShareAccessResult, ResumeShare } from '@/types/database';
import bcrypt from 'bcryptjs';

interface RouteParams {
  params: {
    token: string;
  };
}

/**
 * GET /api/share/[token] - Access a shared resume by token
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { token } = params;
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');
    
    // Rate limiting by IP
    if (!checkRateLimit(`share-access-${token}`, 30, 60000)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', message: 'Too many requests' },
        { status: 429 }
      );
    }
    
    // Get share by token
    const shareData = await sharingDb.getShareByToken(token);
    
    if (!shareData) {
      return NextResponse.json(
        { error: 'Not found', message: 'Share not found' },
        { status: 404 }
      );
    }
    
    const { share, resume, isExpired } = shareData;
    
    // Check if share is expired
    if (isExpired) {
      return NextResponse.json(
        { error: 'Expired', message: 'This share has expired' },
        { status: 410 }
      );
    }
    
    // Check password if required
    if (share.is_password_protected) {
      if (!password) {
        return NextResponse.json(
          { 
            error: 'Password required', 
            message: 'This resume is password protected',
            requiresPassword: true 
          },
          { status: 401 }
        );
      }
      
      if (!share.password_hash) {
        return NextResponse.json(
          { error: 'Server error', message: 'Share configuration error' },
          { status: 500 }
        );
      }
      
      const isPasswordValid = await bcrypt.compare(password, share.password_hash);
      
      if (!isPasswordValid) {
        return NextResponse.json(
          { 
            error: 'Invalid password', 
            message: 'Incorrect password',
            requiresPassword: true 
          },
          { status: 401 }
        );
      }
    }
    
    // Increment view count
    await sharingDb.incrementViewCount(token);
    
    // Remove password hash from share for response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...cleanShare } = share;
    
    const response: ApiResponse<ShareAccessResult> = {
      success: true,
      data: {
        resume,
        share: cleanShare as ResumeShare,
        isExpired: false,
        requiresPassword: share.is_password_protected,
      },
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/share/[token] error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/share/[token] - Access a password-protected shared resume
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { token } = params;
    const body = await request.json();
    const { password } = body;
    
    // Rate limiting by IP
    if (!checkRateLimit(`share-password-${token}`, 10, 60000)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', message: 'Too many requests' },
        { status: 429 }
      );
    }
    
    if (!password) {
      return NextResponse.json(
        { error: 'Validation error', message: 'Password is required' },
        { status: 400 }
      );
    }
    
    // Get share by token
    const shareData = await sharingDb.getShareByToken(token);
    
    if (!shareData) {
      return NextResponse.json(
        { error: 'Not found', message: 'Share not found' },
        { status: 404 }
      );
    }
    
    const { share, resume, isExpired } = shareData;
    
    // Check if share is expired
    if (isExpired) {
      return NextResponse.json(
        { error: 'Expired', message: 'This share has expired' },
        { status: 410 }
      );
    }
    
    // Verify password protection
    if (!share.is_password_protected || !share.password_hash) {
      return NextResponse.json(
        { error: 'Bad request', message: 'This share is not password protected' },
        { status: 400 }
      );
    }
    
    const isPasswordValid = await bcrypt.compare(password, share.password_hash);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { 
          error: 'Invalid password', 
          message: 'Incorrect password',
          requiresPassword: true 
        },
        { status: 401 }
      );
    }
    
    // Increment view count
    await sharingDb.incrementViewCount(token);
    
    // Remove password hash from share for response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...cleanShare } = share;
    
    const response: ApiResponse<ShareAccessResult> = {
      success: true,
      data: {
        resume,
        share: cleanShare as ResumeShare,
        isExpired: false,
        requiresPassword: false, // Password was validated
      },
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('POST /api/share/[token] error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 