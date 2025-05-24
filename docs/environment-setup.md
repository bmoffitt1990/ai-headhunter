# Environment Setup

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: For server-side operations
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Getting Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select an existing one
3. Go to Settings > API
4. Copy the Project URL and anon/public key
5. Add these to your `.env.local` file

## Database Setup

The application expects the following database tables:

### profiles
- `user_id` (uuid, primary key, references auth.users)
- `email` (text)
- `full_name` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### resumes
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles.user_id)
- `resume_data` (jsonb)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Row Level Security

Both tables should have RLS enabled with policies that allow users to only access their own data. 