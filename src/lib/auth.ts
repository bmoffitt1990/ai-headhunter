import { supabase } from './supabase/client';
import { AuthError, User, Session } from '@supabase/supabase-js';

export interface AuthResult {
  user: User | null;
  session: Session | null;
  error: string | null;
}

export interface PasswordResetResult {
  success: boolean;
  error: string | null;
}

/**
 * Sign up a new user with email and password
 */
export const signUp = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return {
        user: null,
        session: null,
        error: getAuthErrorMessage(error),
      };
    }

    return {
      user: data.user,
      session: data.session,
      error: null,
    };
  } catch {
    return {
      user: null,
      session: null,
      error: 'An unexpected error occurred during sign up',
    };
  }
};

/**
 * Sign in user with email and password
 */
export const signIn = async (email: string, password: string): Promise<AuthResult> => {
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('🔐 auth.ts signIn - Error:', error);
      return {
        user: null,
        session: null,
        error: getAuthErrorMessage(error),
      };
    }

    // Double-check session is established
    const { data: sessionCheck } = await supabase.auth.getSession();

    return {
      user: data.user,
      session: data.session,
      error: null,
    };
  } catch (err) {
    console.error('🔐 auth.ts signIn - Unexpected error:', err);
    return {
      user: null,
      session: null,
      error: 'An unexpected error occurred during sign in',
    };
  }
};

/**
 * Sign in with Google OAuth
 */
export const signInWithGoogle = async (): Promise<{ error: string | null }> => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      return { error: getAuthErrorMessage(error) };
    }

    return { error: null };
  } catch {
    return { error: 'An unexpected error occurred during Google sign in' };
  }
};

/**
 * Sign out current user
 */
export const signOut = async (): Promise<{ error: string | null }> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { error: getAuthErrorMessage(error) };
    }

    // Clear any local storage data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sb-auth-token');
      localStorage.removeItem('remember-me');
    }

    return { error: null };
  } catch {
    return { error: 'An unexpected error occurred during sign out' };
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<PasswordResetResult> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      return {
        success: false,
        error: getAuthErrorMessage(error),
      };
    }

    return {
      success: true,
      error: null,
    };
  } catch {
    return {
      success: false,
      error: 'An unexpected error occurred while sending reset email',
    };
  }
};

/**
 * Update user password (used after reset)
 */
export const updatePassword = async (newPassword: string): Promise<PasswordResetResult> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return {
        success: false,
        error: getAuthErrorMessage(error),
      };
    }

    return {
      success: true,
      error: null,
    };
  } catch {
    return {
      success: false,
      error: 'An unexpected error occurred while updating password',
    };
  }
};

/**
 * Get current user session
 */
export const getCurrentSession = async (): Promise<{ session: Session | null; error: string | null }> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      return {
        session: null,
        error: getAuthErrorMessage(error),
      };
    }

    return {
      session,
      error: null,
    };
  } catch {
    return {
      session: null,
      error: 'An unexpected error occurred while getting session',
    };
  }
};

/**
 * Refresh current session
 */
export const refreshSession = async (): Promise<AuthResult> => {
  try {
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      return {
        user: null,
        session: null,
        error: getAuthErrorMessage(error),
      };
    }

    return {
      user: data.user,
      session: data.session,
      error: null,
    };
  } catch {
    return {
      user: null,
      session: null,
      error: 'An unexpected error occurred while refreshing session',
    };
  }
};

/**
 * Convert Supabase auth errors to user-friendly messages
 */
function getAuthErrorMessage(error: AuthError): string {
  const message = error.message ?? '';
  switch (message) {
    case 'Invalid login credentials':
      return 'Invalid email or password. Please try again.';
    case 'Email not confirmed':
      return 'Please check your email and click the confirmation link before signing in.';
    case 'User already registered':
      return 'An account with this email already exists. Please sign in instead.';
    case 'Password should be at least 6 characters':
      return 'Password must be at least 6 characters long.';
    case 'Unable to validate email address: invalid format':
      return 'Please enter a valid email address.';
    case 'Email rate limit exceeded':
      return 'Too many emails sent. Please wait a moment before trying again.';
    case 'Too many requests':
      return 'Too many attempts. Please wait a moment before trying again.';
    case 'Token has expired or is invalid':
      return 'Your session has expired. Please sign in again.';
    case 'New password should be different from the old password':
      return 'New password must be different from your current password.';
    default:
      if (message.includes('rate limit')) {
        return 'Too many attempts. Please wait a moment before trying again.';
      }
      if (message.includes('network')) {
        return 'Network error. Please check your connection and try again.';
      }
      return message || 'An authentication error occurred. Please try again.';
  }
}

/**
 * Validate password strength
 */
export const validatePasswordStrength = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Get password strength score (1-5)
 */
export const getPasswordStrength = (password: string): { score: number; label: string } => {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const finalScore = Math.min(score, 5);
  return {
    score: finalScore,
    label: labels[finalScore] || 'Very Weak',
  };
}; 