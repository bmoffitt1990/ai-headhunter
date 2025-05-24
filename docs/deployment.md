# Deployment Guide

## Vercel Deployment

### Prerequisites

1. **Supabase Project**: Ensure you have a Supabase project set up with the required database schema
2. **Environment Variables**: Have your Supabase URL and anon key ready
3. **Vercel Account**: Sign up for a Vercel account if you don't have one

### Step-by-Step Deployment

#### 1. Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Select the repository and click "Import"

#### 2. Configure Environment Variables

In the Vercel project settings, add the following environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### 3. Deploy

1. Vercel will automatically detect this is a Next.js project
2. Click "Deploy" to start the deployment process
3. Wait for the build to complete

#### 4. Verify Deployment

1. Visit the deployed URL provided by Vercel
2. Check that the application loads correctly
3. Verify Supabase connection is working

### Build Configuration

The project includes:

- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Dev Command**: `npm run dev`

### Environment Variables

Required environment variables for production:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### Performance Optimizations

The deployment includes:

- Package import optimization for Radix UI and Lucide React
- Image optimization for Supabase storage
- Proper caching headers
- Function timeout configuration

### Troubleshooting

#### Build Failures

1. Check that all environment variables are set correctly
2. Verify that the Supabase project is accessible
3. Check the build logs for specific error messages

#### Runtime Issues

1. Verify environment variables in Vercel dashboard
2. Check Supabase project status
3. Review function logs in Vercel dashboard

### Custom Domain (Optional)

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions 