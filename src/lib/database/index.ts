import { createClient } from '@/lib/supabase/server';
import { 
  Resume, 
  UserProfile, 
  ResumeVersion, 
  ResumeShare,
  ResumeSearchResult 
} from '@/types/database';

/**
 * Resume database operations
 */
export class ResumeDatabase {
  private supabase;

  constructor() {
    this.supabase = createClient();
  }

  /**
   * Get user's primary resume
   */
  async getPrimaryResume(userId: string): Promise<Resume | null> {
    const supabase = await this.supabase;
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .eq('is_primary', true)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  }

  /**
   * Set a resume as primary (and unset others)
   */
  async setPrimaryResume(userId: string, resumeId: string): Promise<boolean> {
    const supabase = await this.supabase;
    
    try {
      // First, unset all primary resumes for the user
      await supabase
        .from('resumes')
        .update({ is_primary: false })
        .eq('user_id', userId)
        .eq('is_primary', true);

      // Then set the specified resume as primary
      const { error } = await supabase
        .from('resumes')
        .update({ is_primary: true })
        .eq('id', resumeId)
        .eq('user_id', userId);

      return !error;
    } catch (error) {
      console.error('Error setting primary resume:', error);
      return false;
    }
  }

  /**
   * Get resume versions with pagination
   */
  async getResumeVersions(
    resumeId: string, 
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ versions: ResumeVersion[]; total: number }> {
    const supabase = await this.supabase;
    const offset = (page - 1) * limit;

    const { data: versions, error, count } = await supabase
      .from('resume_versions')
      .select('*', { count: 'exact' })
      .eq('resume_id', resumeId)
      .in('resume_id', [
        // Subquery to ensure user owns the resume
        supabase
          .from('resumes')
          .select('id')
          .eq('user_id', userId)
          .eq('id', resumeId)
      ])
      .order('version_number', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch resume versions: ${error.message}`);
    }

    return {
      versions: versions || [],
      total: count || 0,
    };
  }

  /**
   * Restore a resume from a specific version
   */
  async restoreFromVersion(
    resumeId: string, 
    userId: string, 
    versionNumber: number
  ): Promise<Resume | null> {
    const supabase = await this.supabase;

    try {
      // Get the version data
      const { data: version, error: versionError } = await supabase
        .from('resume_versions')
        .select('resume_data')
        .eq('resume_id', resumeId)
        .eq('version_number', versionNumber)
        .single();

      if (versionError || !version) {
        throw new Error('Version not found');
      }

      // Update the resume with the version data
      const { data: updatedResume, error: updateError } = await supabase
        .from('resumes')
        .update({ resume_data: version.resume_data })
        .eq('id', resumeId)
        .eq('user_id', userId)
        .select()
        .single();

      if (updateError || !updatedResume) {
        throw new Error('Failed to restore resume');
      }

      return updatedResume;
    } catch (error) {
      console.error('Error restoring resume version:', error);
      return null;
    }
  }

  /**
   * Search resumes by content
   */
  async searchResumes(
    userId: string,
    searchTerm: string,
    limit: number = 10
  ): Promise<ResumeSearchResult[]> {
    const supabase = await this.supabase;

    const { data, error } = await supabase
      .rpc('search_resumes', {
        user_uuid: userId,
        search_term: searchTerm,
        limit_count: limit,
      });

    if (error) {
      console.error('Search error:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Get resume statistics for a user
   */
  async getResumeStats(userId: string): Promise<{
    total: number;
    drafts: number;
    published: number;
    archived: number;
    lastUpdated: string | null;
  }> {
    const supabase = await this.supabase;

    const { data: resumes, error } = await supabase
      .from('resumes')
      .select('status, updated_at')
      .eq('user_id', userId);

    if (error || !resumes) {
      return {
        total: 0,
        drafts: 0,
        published: 0,
        archived: 0,
        lastUpdated: null,
      };
    }

    const stats = resumes.reduce(
      (acc, resume) => {
        acc.total++;
        acc[resume.status as keyof typeof acc]++;
        
        if (!acc.lastUpdated || resume.updated_at > acc.lastUpdated) {
          acc.lastUpdated = resume.updated_at;
        }
        
        return acc;
      },
      {
        total: 0,
        drafts: 0,
        published: 0,
        archived: 0,
        lastUpdated: null as string | null,
      }
    );

    return stats;
  }

  /**
   * Cleanup old resume versions (keep last N versions)
   */
  async cleanupOldVersions(resumeId: string, keepCount: number = 10): Promise<number> {
    const supabase = await this.supabase;

    try {
      // Get version numbers to delete
      const { data: versions, error: fetchError } = await supabase
        .from('resume_versions')
        .select('id, version_number')
        .eq('resume_id', resumeId)
        .order('version_number', { ascending: false })
        .range(keepCount, 1000); // Get versions beyond the keep count

      if (fetchError || !versions || versions.length === 0) {
        return 0;
      }

      // Delete old versions
      const versionIds = versions.map(v => v.id);
      const { error: deleteError } = await supabase
        .from('resume_versions')
        .delete()
        .in('id', versionIds);

      if (deleteError) {
        throw deleteError;
      }

      return versions.length;
    } catch (error) {
      console.error('Error cleaning up old versions:', error);
      return 0;
    }
  }
}

/**
 * User profile database operations
 */
export class UserDatabase {
  private supabase;

  constructor() {
    this.supabase = createClient();
  }

  /**
   * Get or create user profile
   */
  async getOrCreateProfile(userId: string, email: string): Promise<UserProfile | null> {
    const supabase = await this.supabase;

    // Try to get existing profile
    const { data: existingProfile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (existingProfile && !fetchError) {
      return existingProfile;
    }

    // Create new profile
    const { data: newProfile, error: createError } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        email,
        subscription_tier: 'free',
        onboarding_completed: false,
      })
      .select()
      .single();

    if (createError || !newProfile) {
      console.error('Error creating user profile:', createError);
      return null;
    }

    return newProfile;
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string, 
    updates: Partial<UserProfile>
  ): Promise<UserProfile | null> {
    const supabase = await this.supabase;

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error || !data) {
      console.error('Error updating user profile:', error);
      return null;
    }

    return data;
  }

  /**
   * Check user permissions based on subscription tier
   */
  async getUserPermissions(userId: string): Promise<{
    canCreateMultipleResumes: boolean;
    canUsePremiumTemplates: boolean;
    maxResumes: number;
    currentResumeCount: number;
  }> {
    const supabase = await this.supabase;

    // Get user profile and resume count
    const [profileResult, resumeCountResult] = await Promise.all([
      supabase
        .from('user_profiles')
        .select('subscription_tier')
        .eq('id', userId)
        .single(),
      supabase
        .from('resumes')
        .select('id', { count: 'exact' })
        .eq('user_id', userId),
    ]);

    const tier = profileResult.data?.subscription_tier || 'free';
    const currentResumeCount = resumeCountResult.count || 0;

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
    };

    return {
      ...permissions[tier as keyof typeof permissions],
      currentResumeCount,
    };
  }
}

/**
 * Resume sharing database operations
 */
export class SharingDatabase {
  private supabase;

  constructor() {
    this.supabase = createClient();
  }

  /**
   * Create a resume share
   */
  async createShare(
    resumeId: string,
    userId: string,
    options: {
      title?: string;
      expiresAt?: Date;
      isPasswordProtected?: boolean;
      password?: string;
    } = {}
  ): Promise<ResumeShare | null> {
    const supabase = await this.supabase;

    try {
      const shareData: Record<string, unknown> = {
        resume_id: resumeId,
        shared_by: userId,
        title: options.title,
        expires_at: options.expiresAt?.toISOString(),
        is_password_protected: options.isPasswordProtected || false,
      };

      // Hash password if provided
      if (options.password && options.isPasswordProtected) {
        const bcrypt = await import('bcryptjs');
        shareData.password_hash = await bcrypt.hash(options.password, 10);
      }

      const { data, error } = await supabase
        .from('resume_shares')
        .insert(shareData)
        .select()
        .single();

      if (error || !data) {
        console.error('Error creating share:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating share:', error);
      return null;
    }
  }

  /**
   * Get share by token
   */
  async getShareByToken(token: string): Promise<{
    share: ResumeShare;
    resume: Resume;
    isExpired: boolean;
  } | null> {
    const supabase = await this.supabase;

    const { data: share, error } = await supabase
      .from('resume_shares')
      .select(`
        *,
        resume:resumes(*)
      `)
      .eq('share_token', token)
      .single();

    if (error || !share) {
      return null;
    }

    const isExpired = share.expires_at ? new Date(share.expires_at) < new Date() : false;

    return {
      share,
      resume: share.resume,
      isExpired,
    };
  }

  /**
   * Increment share view count
   */
  async incrementViewCount(token: string): Promise<void> {
    const supabase = await this.supabase;
    
    await supabase.rpc('increment_share_view', { token });
  }

  /**
   * Cleanup expired shares
   */
  async cleanupExpiredShares(): Promise<number> {
    const supabase = await this.supabase;
    
    const { data } = await supabase.rpc('cleanup_expired_shares');
    return data || 0;
  }
}

// Export singleton instances
export const resumeDb = new ResumeDatabase();
export const userDb = new UserDatabase();
export const sharingDb = new SharingDatabase(); 