export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          subscription_tier: 'free' | 'pro' | 'enterprise';
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          subscription_tier?: 'free' | 'pro' | 'enterprise';
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          subscription_tier?: 'free' | 'pro' | 'enterprise';
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      resumes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          resume_data: ResumeData;
          template_id: string;
          is_primary: boolean;
          status: 'draft' | 'published' | 'archived';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          resume_data?: ResumeData;
          template_id?: string;
          is_primary?: boolean;
          status?: 'draft' | 'published' | 'archived';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          resume_data?: ResumeData;
          template_id?: string;
          is_primary?: boolean;
          status?: 'draft' | 'published' | 'archived';
          created_at?: string;
          updated_at?: string;
        };
      };
      resume_versions: {
        Row: {
          id: string;
          resume_id: string;
          version_number: number;
          resume_data: ResumeData;
          change_summary: string | null;
          created_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          resume_id: string;
          version_number: number;
          resume_data: ResumeData;
          change_summary?: string | null;
          created_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          resume_id?: string;
          version_number?: number;
          resume_data?: ResumeData;
          change_summary?: string | null;
          created_at?: string;
          created_by?: string | null;
        };
      };
      resume_shares: {
        Row: {
          id: string;
          resume_id: string;
          shared_by: string;
          share_token: string;
          title: string | null;
          expires_at: string | null;
          is_password_protected: boolean;
          password_hash: string | null;
          view_count: number;
          last_viewed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          resume_id: string;
          shared_by: string;
          share_token?: string;
          title?: string | null;
          expires_at?: string | null;
          is_password_protected?: boolean;
          password_hash?: string | null;
          view_count?: number;
          last_viewed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          resume_id?: string;
          shared_by?: string;
          share_token?: string;
          title?: string | null;
          expires_at?: string | null;
          is_password_protected?: boolean;
          password_hash?: string | null;
          view_count?: number;
          last_viewed_at?: string | null;
          created_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          table_name: string;
          record_id: string;
          action: 'INSERT' | 'UPDATE' | 'DELETE' | 'SELECT';
          old_values: Record<string, unknown> | null;
          new_values: Record<string, unknown> | null;
          user_id: string | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          table_name: string;
          record_id: string;
          action: 'INSERT' | 'UPDATE' | 'DELETE' | 'SELECT';
          old_values?: Record<string, unknown> | null;
          new_values?: Record<string, unknown> | null;
          user_id?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          table_name?: string;
          record_id?: string;
          action?: 'INSERT' | 'UPDATE' | 'DELETE' | 'SELECT';
          old_values?: Record<string, unknown> | null;
          new_values?: Record<string, unknown> | null;
          user_id?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
      resume_templates: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          is_premium: boolean;
          config: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          description?: string | null;
          is_premium?: boolean;
          config?: Record<string, unknown>;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          is_premium?: boolean;
          config?: Record<string, unknown>;
          created_at?: string;
        };
      };
    };
    Functions: {
      get_primary_resume: {
        Args: { user_uuid: string };
        Returns: {
          resume_id: string;
          title: string;
          resume_data: ResumeData;
          template_id: string;
        }[];
      };
      increment_share_view: {
        Args: { token: string };
        Returns: void;
      };
      search_resumes: {
        Args: { 
          user_uuid: string; 
          search_term: string; 
          limit_count?: number 
        };
        Returns: {
          resume_id: string;
          title: string;
          relevance: number;
        }[];
      };
      cleanup_expired_shares: {
        Args: Record<string, never>;
        Returns: number;
      };
    };
  };
}

export interface ResumeData {
  personalInfo?: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    portfolio?: string;
    summary?: string;
  };
  experience?: Array<{
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string[];
    achievements: string[];
  }>;
  education?: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    location: string;
    startDate: string;
    endDate?: string;
    gpa?: number;
    coursework?: string[];
  }>;
  skills?: Array<{
    id: string;
    name: string;
    category: 'technical' | 'soft' | 'certification';
    level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  }>;
  projects?: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    githubUrl?: string;
    demoUrl?: string;
    startDate: string;
    endDate?: string;
  }>;
  certifications?: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
    credentialId?: string;
    url?: string;
  }>;
}

// Type aliases for convenience
export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
export type Resume = Database['public']['Tables']['resumes']['Row'];
export type ResumeVersion = Database['public']['Tables']['resume_versions']['Row'];
export type ResumeShare = Database['public']['Tables']['resume_shares']['Row'];
export type AuditLog = Database['public']['Tables']['audit_logs']['Row'];
export type ResumeTemplate = Database['public']['Tables']['resume_templates']['Row'];

export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert'];
export type ResumeInsert = Database['public']['Tables']['resumes']['Insert'];
export type ResumeVersionInsert = Database['public']['Tables']['resume_versions']['Insert'];
export type ResumeShareInsert = Database['public']['Tables']['resume_shares']['Insert'];
export type AuditLogInsert = Database['public']['Tables']['audit_logs']['Insert'];
export type ResumeTemplateInsert = Database['public']['Tables']['resume_templates']['Insert'];

export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update'];
export type ResumeUpdate = Database['public']['Tables']['resumes']['Update'];
export type ResumeVersionUpdate = Database['public']['Tables']['resume_versions']['Update'];
export type ResumeShareUpdate = Database['public']['Tables']['resume_shares']['Update'];
export type AuditLogUpdate = Database['public']['Tables']['audit_logs']['Update'];
export type ResumeTemplateUpdate = Database['public']['Tables']['resume_templates']['Update'];

// API Response types
export interface ResumeWithVersions extends Resume {
  versions?: ResumeVersion[];
}

export interface ResumeWithShares extends Resume {
  shares?: ResumeShare[];
}

export interface ResumeSearchResult {
  resume_id: string;
  title: string;
  relevance: number;
}

export interface ShareAccessResult {
  resume: Resume;
  share: ResumeShare;
  isExpired: boolean;
  requiresPassword: boolean;
}

// Error types for API responses
export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: ApiError;
  success: boolean;
} 