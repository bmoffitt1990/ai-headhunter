import { createClient } from '@/lib/supabase/server';
import { UserProfile } from '@/types/database';
import { User } from '@supabase/supabase-js';
import { cache } from 'react';

/**
 * Get the current authenticated user from server context
 * Throws error if user is not authenticated
 */
export const getServerUser = cache(async (): Promise<User> => {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error('Unauthorized: User not authenticated');
  }
  
  return user;
});

/**
 * Get the current authenticated user with their profile
 * Returns null if user is not authenticated
 */
export const getServerUserWithProfile = cache(async (): Promise<{
  user: User;
  profile: UserProfile;
} | null> => {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return null;
    }
    
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError || !profile) {
      console.error('Profile fetch error:', profileError);
      return null;
    }
    
    return { user, profile };
  } catch (error) {
    console.error('getServerUserWithProfile error:', error);
    return null;
  }
});

/**
 * Check if user is authenticated (without throwing)
 * Returns user if authenticated, null otherwise
 */
export const getOptionalServerUser = cache(async (): Promise<User | null> => {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('getOptionalServerUser error:', error);
    return null;
  }
});

/**
 * Validate session and refresh if necessary
 * Returns refreshed session or null if invalid
 */
export const validateSession = async () => {
  try {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return null;
    }
    
    // Check if session is close to expiring (within 5 minutes)
    const expiresAt = session.expires_at;
    const now = Math.floor(Date.now() / 1000);
    const fiveMinutes = 5 * 60;
    
    if (expiresAt && (expiresAt - now) < fiveMinutes) {
      // Attempt to refresh
      const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError || !refreshed.session) {
        return null;
      }
      
      return refreshed.session;
    }
    
    return session;
  } catch (error) {
    console.error('validateSession error:', error);
    return null;
  }
};

/**
 * Create or update user profile after authentication
 */
export const ensureUserProfile = async (user: User): Promise<UserProfile> => {
  const supabase = await createClient();
  
  // First try to get existing profile
  const { data: existingProfile, error: fetchError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (existingProfile && !fetchError) {
    return existingProfile;
  }
  
  // Profile doesn't exist, create it
  const profileData = {
    id: user.id,
    email: user.email!,
    full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
    avatar_url: user.user_metadata?.avatar_url || null,
  };
  
  const { data: newProfile, error: createError } = await supabase
    .from('user_profiles')
    .upsert(profileData, { onConflict: 'id' })
    .select()
    .single();
  
  if (createError || !newProfile) {
    throw new Error(`Failed to create user profile: ${createError?.message}`);
  }
  
  return newProfile;
};

/**
 * Get user's subscription tier and permissions
 */
export const getUserPermissions = async (userId: string) => {
  const supabase = await createClient();
  
  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('subscription_tier')
    .eq('id', userId)
    .single();
  
  if (error || !profile) {
    return {
      tier: 'free' as const,
      canCreateMultipleResumes: false,
      canUsePremiumTemplates: false,
      maxResumes: 1,
    };
  }
  
  const permissions = {
    free: {
      canCreateMultipleResumes: false,
      canUsePremiumTemplates: false,
      maxResumes: 1,
    },
    pro: {
      canCreateMultipleResumes: true,
      canUsePremiumTemplates: true,
      maxResumes: 10,
    },
    enterprise: {
      canCreateMultipleResumes: true,
      canUsePremiumTemplates: true,
      maxResumes: -1, // unlimited
    },
  } as const;
  
  const tier = profile.subscription_tier as keyof typeof permissions;
  
  return {
    tier: profile.subscription_tier,
    ...permissions[tier],
  };
};

/**
 * Middleware helper for API route authentication
 */
export const withAuth = <T extends unknown[]>(
  handler: (user: User, ...args: T) => Promise<Response>
) => {
  return async (...args: T): Promise<Response> => {
    try {
      const user = await getServerUser();
      return await handler(user, ...args);
    } catch {
      return new Response(
        JSON.stringify({ 
          error: 'Unauthorized', 
          message: 'Authentication required' 
        }),
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
  };
};

/**
 * Middleware helper for API route authentication with profile
 */
export const withAuthAndProfile = <T extends unknown[]>(
  handler: (user: User, profile: UserProfile, ...args: T) => Promise<Response>
) => {
  return async (...args: T): Promise<Response> => {
    try {
      const user = await getServerUser();
      const profile = await ensureUserProfile(user);
      return await handler(user, profile, ...args);
    } catch {
      return new Response(
        JSON.stringify({ 
          error: 'Unauthorized', 
          message: 'Authentication required' 
        }),
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
  };
};

/**
 * Extract client IP address for audit logging
 */
export const getClientIP = async (): Promise<string | null> => {
  try {
    // In a real deployment, this would come from headers
    // For development, we'll return a placeholder
    return '127.0.0.1';
  } catch {
    return null;
  }
};

/**
 * Extract user agent for audit logging
 */
export const getUserAgent = async (): Promise<string | null> => {
  try {
    // In a real deployment, this would come from request headers
    // For development, we'll return a placeholder
    return 'Unknown';
  } catch {
    return null;
  }
};

/**
 * Create audit log entry
 */
export const createAuditLog = async ({
  tableName,
  recordId,
  action,
  oldValues = null,
  newValues = null,
  userId,
}: {
  tableName: string;
  recordId: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE' | 'SELECT';
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  userId?: string;
}) => {
  try {
    const supabase = await createClient();
    const ip = await getClientIP();
    const userAgent = await getUserAgent();
    
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        table_name: tableName,
        record_id: recordId,
        action,
        old_values: oldValues,
        new_values: newValues,
        user_id: userId || null,
        ip_address: ip,
        user_agent: userAgent,
      });
    
    if (error) {
      console.error('Failed to create audit log:', error);
    }
  } catch (error) {
    console.error('createAuditLog error:', error);
  }
};

/**
 * Rate limiting helper (simple in-memory implementation)
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (
  key: string, 
  maxRequests: number = 10, 
  windowMs: number = 60000 // 1 minute
): boolean => {
  const now = Date.now();
  const record = rateLimitMap.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
};

/**
 * Clean up expired rate limit entries
 */
export const cleanupRateLimit = () => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
};

// Clean up rate limit entries every 5 minutes
setInterval(cleanupRateLimit, 5 * 60 * 1000); 