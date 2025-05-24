'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to require authentication for a component
 */
export const useAuthRequired = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        router.push('/login');
      } else {
        setIsChecking(false);
      }
    }
  }, [user, loading, router]);

  return {
    user,
    loading: loading || isChecking,
    isAuthenticated: !!user,
  };
};

/**
 * Hook to get the current authenticated user
 */
export const useUser = () => {
  const { user, loading } = useAuth();
  
  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
};

/**
 * Get the authenticated user on the server side
 */
export async function getAuthenticatedUser() {
  try {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error getting authenticated user:', error);
    return null;
  }
}

/**
 * Check if user has specific permissions
 */
export const usePermissions = (requiredPermissions: string[] = []) => {
  const { user } = useAuth();
  
  const hasPermissions = (_permissions: string[]) => {
    if (!user) return false;
    return true;
  };

  return {
    hasPermissions: hasPermissions(requiredPermissions),
    checkPermission: (permission: string) => hasPermissions([permission]),
  };
}; 