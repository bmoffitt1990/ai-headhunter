-- AI Headhunter Database Schema Migration
-- Creates comprehensive schema for user profiles, resumes, versions, sharing, and audit logging

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================
-- USER PROFILES TABLE
-- =========================================

-- Create user profiles table extending Supabase Auth
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- RESUMES TABLE
-- =========================================

-- Create resumes table with flexible JSON storage
CREATE TABLE resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Resume',
  resume_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  template_id TEXT NOT NULL DEFAULT 'professional',
  is_primary BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- RESUME VERSIONS TABLE
-- =========================================

-- Create resume versions table for revision history
CREATE TABLE resume_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE NOT NULL,
  version_number INTEGER NOT NULL,
  resume_data JSONB NOT NULL,
  change_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES user_profiles(id)
);

-- =========================================
-- RESUME SHARES TABLE
-- =========================================

-- Create resume shares table for sharing functionality
CREATE TABLE resume_shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE NOT NULL,
  shared_by UUID REFERENCES user_profiles(id) NOT NULL,
  share_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'base64url'),
  title TEXT,
  expires_at TIMESTAMPTZ,
  is_password_protected BOOLEAN DEFAULT FALSE,
  password_hash TEXT,
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- AUDIT LOGS TABLE
-- =========================================

-- Create audit logs table for security and compliance
CREATE TABLE audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE', 'SELECT')),
  old_values JSONB,
  new_values JSONB,
  user_id UUID REFERENCES user_profiles(id),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- INDEXES FOR PERFORMANCE
-- =========================================

-- User profiles indexes
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_created_at ON user_profiles(created_at);

-- Resumes indexes
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_resumes_created_at ON resumes(created_at);
CREATE INDEX idx_resumes_updated_at ON resumes(updated_at);
CREATE INDEX idx_resumes_is_primary ON resumes(is_primary) WHERE is_primary = TRUE;
CREATE INDEX idx_resumes_template_id ON resumes(template_id);
CREATE INDEX idx_resumes_status ON resumes(status);

-- JSONB indexes for resume data queries
CREATE INDEX idx_resumes_personal_info ON resumes USING GIN ((resume_data->'personalInfo'));
CREATE INDEX idx_resumes_experience ON resumes USING GIN ((resume_data->'experience'));
CREATE INDEX idx_resumes_skills ON resumes USING GIN ((resume_data->'skills'));

-- Resume versions indexes
CREATE INDEX idx_resume_versions_resume_id ON resume_versions(resume_id);
CREATE INDEX idx_resume_versions_created_at ON resume_versions(created_at);
CREATE UNIQUE INDEX idx_resume_versions_unique ON resume_versions(resume_id, version_number);

-- Resume shares indexes
CREATE INDEX idx_resume_shares_resume_id ON resume_shares(resume_id);
CREATE INDEX idx_resume_shares_shared_by ON resume_shares(shared_by);
CREATE INDEX idx_resume_shares_share_token ON resume_shares(share_token);
CREATE INDEX idx_resume_shares_expires_at ON resume_shares(expires_at);

-- Audit logs indexes
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_record_id ON audit_logs(record_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- =========================================
-- CONSTRAINTS
-- =========================================

-- Ensure only one primary resume per user
CREATE UNIQUE INDEX idx_resumes_user_primary ON resumes(user_id) WHERE is_primary = TRUE;

-- Ensure template_id is valid
ALTER TABLE resumes ADD CONSTRAINT chk_template_id 
  CHECK (template_id IN ('professional', 'modern', 'creative', 'executive', 'minimal'));

-- =========================================
-- FUNCTIONS AND TRIGGERS
-- =========================================

-- Function to create user profile on auth user creation
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name')
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the auth creation
    RAISE WARNING 'Failed to create user profile for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_resumes_updated_at
  BEFORE UPDATE ON resumes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to create resume version on update
CREATE OR REPLACE FUNCTION create_resume_version()
RETURNS TRIGGER AS $$
DECLARE
  latest_version INTEGER;
BEGIN
  -- Only create version if resume_data actually changed
  IF OLD.resume_data IS DISTINCT FROM NEW.resume_data THEN
    -- Get the latest version number
    SELECT COALESCE(MAX(version_number), 0) + 1
    INTO latest_version
    FROM resume_versions
    WHERE resume_id = NEW.id;
    
    -- Insert new version
    INSERT INTO resume_versions (
      resume_id,
      version_number,
      resume_data,
      change_summary,
      created_by
    ) VALUES (
      NEW.id,
      latest_version,
      OLD.resume_data,
      'Auto-saved version',
      NEW.user_id
    );
    
    -- Clean up old versions (keep last 10)
    DELETE FROM resume_versions
    WHERE resume_id = NEW.id
      AND version_number <= latest_version - 10;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for resume versioning
CREATE TRIGGER create_resume_version_trigger
  AFTER UPDATE ON resumes
  FOR EACH ROW EXECUTE FUNCTION create_resume_version();

-- Function for audit logging
CREATE OR REPLACE FUNCTION audit_table_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    table_name,
    record_id,
    action,
    old_values,
    new_values,
    user_id
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END,
    COALESCE(NEW.user_id, OLD.user_id)
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Audit triggers for key tables
CREATE TRIGGER audit_resumes_changes
  AFTER INSERT OR UPDATE OR DELETE ON resumes
  FOR EACH ROW EXECUTE FUNCTION audit_table_changes();

CREATE TRIGGER audit_resume_shares_changes
  AFTER INSERT OR UPDATE OR DELETE ON resume_shares
  FOR EACH ROW EXECUTE FUNCTION audit_table_changes();

-- Function to validate resume JSON structure
CREATE OR REPLACE FUNCTION validate_resume_data(data JSONB)
RETURNS BOOLEAN AS $$
BEGIN
  -- Basic structure validation
  IF NOT (data ? 'personalInfo') THEN
    RAISE EXCEPTION 'Resume data must contain personalInfo';
  END IF;
  
  -- Validate personalInfo has required fields
  IF NOT (data->'personalInfo' ? 'fullName' AND data->'personalInfo' ? 'email') THEN
    RAISE EXCEPTION 'personalInfo must contain fullName and email';
  END IF;
  
  -- Validate arrays exist and are arrays
  IF data ? 'experience' AND jsonb_typeof(data->'experience') != 'array' THEN
    RAISE EXCEPTION 'experience must be an array';
  END IF;
  
  IF data ? 'education' AND jsonb_typeof(data->'education') != 'array' THEN
    RAISE EXCEPTION 'education must be an array';
  END IF;
  
  IF data ? 'skills' AND jsonb_typeof(data->'skills') != 'array' THEN
    RAISE EXCEPTION 'skills must be an array';
  END IF;
  
  IF data ? 'projects' AND jsonb_typeof(data->'projects') != 'array' THEN
    RAISE EXCEPTION 'projects must be an array';
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Add validation constraint to resumes table
ALTER TABLE resumes ADD CONSTRAINT chk_valid_resume_data 
  CHECK (validate_resume_data(resume_data));

-- Function to cleanup expired shares
CREATE OR REPLACE FUNCTION cleanup_expired_shares()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM resume_shares 
  WHERE expires_at IS NOT NULL AND expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Resumes Policies
CREATE POLICY "Users can view own resumes"
  ON resumes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes"
  ON resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes"
  ON resumes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes"
  ON resumes FOR DELETE
  USING (auth.uid() = user_id);

-- Shared resumes policy for public access
CREATE POLICY "Anyone can view shared resumes"
  ON resumes FOR SELECT
  USING (
    id IN (
      SELECT resume_id FROM resume_shares 
      WHERE (expires_at IS NULL OR expires_at > NOW())
    )
  );

-- Resume Versions Policies
CREATE POLICY "Users can view own resume versions"
  ON resume_versions FOR SELECT
  USING (
    resume_id IN (
      SELECT id FROM resumes WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert resume versions"
  ON resume_versions FOR INSERT
  WITH CHECK (
    resume_id IN (
      SELECT id FROM resumes WHERE user_id = auth.uid()
    )
  );

-- Resume Shares Policies
CREATE POLICY "Users can view own shares"
  ON resume_shares FOR SELECT
  USING (shared_by = auth.uid());

CREATE POLICY "Users can create shares for own resumes"
  ON resume_shares FOR INSERT
  WITH CHECK (
    shared_by = auth.uid() AND
    resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own shares"
  ON resume_shares FOR UPDATE
  USING (shared_by = auth.uid())
  WITH CHECK (shared_by = auth.uid());

CREATE POLICY "Users can delete own shares"
  ON resume_shares FOR DELETE
  USING (shared_by = auth.uid());

-- Public access to shares for viewing
CREATE POLICY "Anyone can view active shares"
  ON resume_shares FOR SELECT
  USING (expires_at IS NULL OR expires_at > NOW());

-- Audit Logs Policies (read-only for users)
CREATE POLICY "Users can view own audit logs"
  ON audit_logs FOR SELECT
  USING (user_id = auth.uid());

-- =========================================
-- INITIAL DATA
-- =========================================

-- Insert default template configurations (for future use)
CREATE TABLE resume_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO resume_templates (id, name, description, is_premium) VALUES
  ('professional', 'Professional', 'Clean and professional design suitable for corporate roles', false),
  ('modern', 'Modern', 'Contemporary design with modern typography and layout', false),
  ('creative', 'Creative', 'Creative design for design and creative industry roles', true),
  ('executive', 'Executive', 'Executive-level design for senior positions', true),
  ('minimal', 'Minimal', 'Minimalist design focusing on content', false);

-- =========================================
-- FUNCTIONS FOR APPLICATION USE
-- =========================================

-- Function to get user's primary resume
CREATE OR REPLACE FUNCTION get_primary_resume(user_uuid UUID)
RETURNS TABLE(resume_id UUID, title TEXT, resume_data JSONB, template_id TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT r.id, r.title, r.resume_data, r.template_id
  FROM resumes r
  WHERE r.user_id = user_uuid AND r.is_primary = TRUE
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment share view count
CREATE OR REPLACE FUNCTION increment_share_view(token TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE resume_shares 
  SET 
    view_count = view_count + 1,
    last_viewed_at = NOW()
  WHERE share_token = token
    AND (expires_at IS NULL OR expires_at > NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search resumes by content
CREATE OR REPLACE FUNCTION search_resumes(
  user_uuid UUID,
  search_term TEXT,
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE(resume_id UUID, title TEXT, relevance REAL) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.title,
    ts_rank(
      to_tsvector('english', 
        COALESCE(r.title, '') || ' ' ||
        COALESCE(r.resume_data->>'personalInfo'->>'fullName', '') || ' ' ||
        COALESCE(r.resume_data->>'personalInfo'->>'summary', '')
      ),
      plainto_tsquery('english', search_term)
    ) as relevance
  FROM resumes r
  WHERE r.user_id = user_uuid
    AND (
      to_tsvector('english', 
        COALESCE(r.title, '') || ' ' ||
        COALESCE(r.resume_data->>'personalInfo'->>'fullName', '') || ' ' ||
        COALESCE(r.resume_data->>'personalInfo'->>'summary', '')
      ) @@ plainto_tsquery('english', search_term)
    )
  ORDER BY relevance DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Create a scheduled job to cleanup expired shares (if pg_cron is available)
-- SELECT cron.schedule('cleanup-expired-shares', '0 2 * * *', 'SELECT cleanup_expired_shares();');

COMMENT ON TABLE user_profiles IS 'Extended user profile information linked to Supabase Auth';
COMMENT ON TABLE resumes IS 'User resumes with flexible JSONB storage for resume data';
COMMENT ON TABLE resume_versions IS 'Version history for resume changes and revisions';
COMMENT ON TABLE resume_shares IS 'Public sharing configuration for resumes';
COMMENT ON TABLE audit_logs IS 'Audit trail for security and compliance monitoring';
COMMENT ON TABLE resume_templates IS 'Available resume templates and their configurations'; 