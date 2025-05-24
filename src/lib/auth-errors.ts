export enum AuthErrorType {
  INVALID_CREDENTIALS = 'invalid_credentials',
  EMAIL_NOT_CONFIRMED = 'email_not_confirmed',
  USER_ALREADY_EXISTS = 'user_already_exists',
  WEAK_PASSWORD = 'weak_password',
  INVALID_EMAIL = 'invalid_email',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  NETWORK_ERROR = 'network_error',
  TOKEN_EXPIRED = 'token_expired',
  UNKNOWN_ERROR = 'unknown_error',
}

export interface AuthErrorInfo {
  type: AuthErrorType;
  message: string;
  suggestion?: string;
  retryable: boolean;
}

/**
 * Map Supabase error messages to our error types
 */
export const mapSupabaseError = (errorMessage: string): AuthErrorInfo => {
  const message = errorMessage.toLowerCase();

  if (message.includes('invalid login credentials')) {
    return {
      type: AuthErrorType.INVALID_CREDENTIALS,
      message: 'Invalid email or password. Please check your credentials and try again.',
      suggestion: 'Make sure you entered the correct email and password.',
      retryable: true,
    };
  }

  if (message.includes('email not confirmed')) {
    return {
      type: AuthErrorType.EMAIL_NOT_CONFIRMED,
      message: 'Please check your email and click the confirmation link before signing in.',
      suggestion: 'Check your spam folder if you don\'t see the confirmation email.',
      retryable: false,
    };
  }

  if (message.includes('user already registered')) {
    return {
      type: AuthErrorType.USER_ALREADY_EXISTS,
      message: 'An account with this email already exists.',
      suggestion: 'Try signing in instead, or use the password reset option.',
      retryable: false,
    };
  }

  if (message.includes('password should be at least')) {
    return {
      type: AuthErrorType.WEAK_PASSWORD,
      message: 'Password must be at least 6 characters long.',
      suggestion: 'Choose a stronger password with at least 8 characters.',
      retryable: true,
    };
  }

  if (message.includes('invalid format') || message.includes('invalid email')) {
    return {
      type: AuthErrorType.INVALID_EMAIL,
      message: 'Please enter a valid email address.',
      suggestion: 'Check that your email address is formatted correctly.',
      retryable: true,
    };
  }

  if (message.includes('rate limit') || message.includes('too many requests')) {
    return {
      type: AuthErrorType.RATE_LIMIT_EXCEEDED,
      message: 'Too many attempts. Please wait a moment before trying again.',
      suggestion: 'Wait a few minutes before attempting to sign in again.',
      retryable: true,
    };
  }

  if (message.includes('token has expired') || message.includes('invalid token')) {
    return {
      type: AuthErrorType.TOKEN_EXPIRED,
      message: 'Your session has expired. Please sign in again.',
      suggestion: 'Click the sign in button to start a new session.',
      retryable: true,
    };
  }

  if (message.includes('network') || message.includes('fetch')) {
    return {
      type: AuthErrorType.NETWORK_ERROR,
      message: 'Network error. Please check your connection and try again.',
      suggestion: 'Check your internet connection and try again.',
      retryable: true,
    };
  }

  return {
    type: AuthErrorType.UNKNOWN_ERROR,
    message: errorMessage || 'An unexpected error occurred. Please try again.',
    suggestion: 'If the problem persists, please contact support.',
    retryable: true,
  };
};

/**
 * Get user-friendly error message for display
 */
export const getErrorMessage = (error: string | AuthErrorInfo): string => {
  if (typeof error === 'string') {
    return mapSupabaseError(error).message;
  }
  return error.message;
};

/**
 * Get error suggestion for user guidance
 */
export const getErrorSuggestion = (error: string | AuthErrorInfo): string | undefined => {
  if (typeof error === 'string') {
    return mapSupabaseError(error).suggestion;
  }
  return error.suggestion;
};

/**
 * Check if an error is retryable
 */
export const isRetryableError = (error: string | AuthErrorInfo): boolean => {
  if (typeof error === 'string') {
    return mapSupabaseError(error).retryable;
  }
  return error.retryable;
}; 