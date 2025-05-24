import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
}

let toastCount = 0;

// Simple toast implementation - in production, use a proper toast library
export const useToast = () => {
  const [state, setState] = useState<ToastState>({ toasts: [] });

  const toast = useCallback(({ title, description, variant = 'default', duration = 5000 }: Omit<Toast, 'id'>) => {
    const id = (++toastCount).toString();
    const newToast: Toast = { id, title, description, variant, duration };

    setState(prev => ({
      toasts: [...prev.toasts, newToast]
    }));

    // Auto-remove toast after duration
    setTimeout(() => {
      setState(prev => ({
        toasts: prev.toasts.filter(t => t.id !== id)
      }));
    }, duration);

    // For now, just log to console - in production, integrate with a toast UI
    console.log(`Toast: ${title}${description ? ` - ${description}` : ''}`);
  }, []);

  const dismiss = useCallback((toastId: string) => {
    setState(prev => ({
      toasts: prev.toasts.filter(t => t.id !== toastId)
    }));
  }, []);

  return {
    toast,
    dismiss,
    toasts: state.toasts,
  };
}; 