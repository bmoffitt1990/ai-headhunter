import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Define public routes that don't require authentication
const publicRoutes = [
  '/login',
  '/signup',
  '/reset-password',
  '/update-password',
  '/auth/callback',
  '/terms',
  '/privacy',
  '/test-resume', // Public demo page for resume templates
  '/test-dashboard', // Temporary: bypass middleware for testing
  '/test-pdf', // PDF export testing page
  '/dashboard', // Use client-side auth protection instead
];

// Define auth routes that authenticated users should be redirected away from
const authRoutes = [
  '/login',
  '/signup',
  '/reset-password',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  try {
    // Create Supabase client with proper cookie handling for middleware
    const response = NextResponse.next();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value);
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { data: { session }, error } = await supabase.auth.getSession();

    const isPublicRoute = publicRoutes.includes(pathname);
    const isAuthRoute = authRoutes.includes(pathname);
    const isAuthenticated = !!session && !error;

    // Handle root route
    if (pathname === '/') {
      if (isAuthenticated) {
        // Redirect authenticated users to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } else {
        // Redirect unauthenticated users to login
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    // If user is authenticated and trying to access auth routes, redirect to dashboard
    if (isAuthenticated && isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If user is not authenticated and trying to access protected routes
    if (!isAuthenticated && !isPublicRoute) {
      // Store the intended destination for post-login redirect
      const loginUrl = new URL('/login', request.url);
      
      // Only store redirect for GET requests to avoid issues with form submissions
      if (request.method === 'GET') {
        loginUrl.searchParams.set('redirectTo', pathname);
      }
      
      return NextResponse.redirect(loginUrl);
    }

    // Allow the request to proceed with updated cookies
    return response;

  } catch (error) {
    console.error('Middleware error:', error);
    
    // On error, redirect to login for protected routes
    const isPublicRoute = publicRoutes.includes(pathname);
    if (!isPublicRoute && pathname !== '/') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 