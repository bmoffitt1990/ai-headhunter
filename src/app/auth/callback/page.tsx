'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Use the imported supabase client
        
        // Debug: Log the full URL
        console.log('Full URL:', window.location.href);
        console.log('Hash:', window.location.hash);
        console.log('Search:', window.location.search);
        
        // Check if there are any URL fragments (for email confirmations)
        const urlParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = urlParams.get('access_token');
        const refreshToken = urlParams.get('refresh_token');
        const type = urlParams.get('type');
        
        // Also check search parameters (for OAuth)
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        
        console.log('Auth callback - fragments:', { 
          accessToken: accessToken ? `${accessToken.substring(0, 20)}...` : null, 
          refreshToken: refreshToken ? `${refreshToken.substring(0, 20)}...` : null, 
          type 
        });
        console.log('Auth callback - search:', { code: !!code, error });
        
        // Debug: List all URL parameters
        console.log('All hash params:', Object.fromEntries(urlParams));
        console.log('All search params:', Object.fromEntries(searchParams));
        
        // Handle errors
        if (error) {
          setStatus('error');
          setMessage(searchParams.get('error_description') || error);
          setTimeout(() => router.push('/login'), 3000);
          return;
        }
        
        // Handle email confirmation tokens - try simpler approach first
        if (accessToken && refreshToken) {
          console.log('Processing email confirmation tokens...');
          
          // Instead of manually setting session, just redirect to login with success message
          // This is a more compatible approach for free tier
          setStatus('success');
          setMessage('Email confirmed successfully! Please sign in with your credentials.');
          setTimeout(() => {
            router.push('/login?message=Email confirmed! You can now sign in.');
          }, 3000);
          return;
        }
        
        // Handle OAuth code exchange
        if (code) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            console.error('Error exchanging code:', exchangeError);
            setStatus('error');
            setMessage('Authentication failed. Please try again.');
            setTimeout(() => router.push('/login'), 3000);
            return;
          }
          
          if (data.session) {
            console.log('OAuth session established');
            setStatus('success');
            setMessage('Successfully signed in! Redirecting...');
            
            const next = searchParams.get('next') || '/dashboard';
            setTimeout(() => {
              window.location.href = next;
            }, 2000);
            return;
          }
        }
        
        // If no valid tokens or code found, try Supabase's built-in URL detection
        console.log('No explicit tokens found, trying Supabase URL detection...');
        
        try {
          // This will automatically detect and process auth callbacks
          const { data, error: authError } = await supabase.auth.getSession();
          
          console.log('Supabase URL detection result:', { 
            hasSession: !!data?.session, 
            hasUser: !!data?.user, 
            error: authError 
          });
          
          if (data.session) {
            console.log('Session found via URL detection');
            setStatus('success');
            setMessage('Authentication successful! Redirecting...');
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 2000);
            return;
          }
        } catch (urlError) {
          console.error('Error with URL detection:', urlError);
        }
        
        console.warn('No valid authentication tokens found');
        setStatus('error');
        setMessage('Invalid authentication link. Please try signing in again.');
        setTimeout(() => router.push('/login'), 3000);
        
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
        setTimeout(() => router.push('/login'), 3000);
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Authentication
          </h2>
          <div className="mt-8">
            {status === 'loading' && (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-gray-600">{message}</span>
              </div>
            )}
            
            {status === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">{message}</p>
                  </div>
                </div>
              </div>
            )}
            
            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{message}</p>
                    <p className="text-sm text-red-600 mt-1">You will be redirected to the login page.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 