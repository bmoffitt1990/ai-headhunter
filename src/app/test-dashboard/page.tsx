'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function TestDashboardPage() {
  const { user, session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Client-side redirect if not authenticated
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            🎉 SUCCESS! Client-side Auth Working!
          </h1>
          
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h2 className="font-semibold text-green-800">Authentication Status</h2>
              <div className="mt-2 space-y-1 text-sm text-green-700">
                <p>✅ User authenticated: {user.email}</p>
                <p>✅ Session active: {session?.user?.id}</p>
                <p>✅ Client-side auth working perfectly</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h2 className="font-semibold text-blue-800">User Details</h2>
              <div className="mt-2 space-y-1 text-sm text-blue-700">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</p>
                <p><strong>Email Verified:</strong> {user.email_confirmed_at ? 'Yes' : 'No'}</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <h2 className="font-semibold text-yellow-800">Next Steps</h2>
              <div className="mt-2 space-y-1 text-sm text-yellow-700">
                <p>1. The issue is with middleware/server-side session detection</p>
                <p>2. Client-side authentication is working perfectly</p>
                <p>3. Check terminal logs for middleware errors</p>
                <p>4. Consider if this is a Supabase free tier limitation</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Back to Login
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Try Real Dashboard (will hit middleware)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 