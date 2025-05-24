import { useState, useEffect, useCallback } from 'react';
import { ResumeData } from '@/types/database';
import { validateAndSanitizeResumeData } from '@/lib/validation';

export interface AutoSaveOptions {
  debounceDelay?: number;
  maxRetries?: number;
  retryDelay?: number;
  onSaveStart?: () => void;
  onSaveSuccess?: (data: any) => void;
  onSaveError?: (error: Error) => void;
  onConflict?: (serverData: any, localData: any) => Promise<any>;
}

export interface AutoSaveStatus {
  status: 'idle' | 'saving' | 'saved' | 'error' | 'conflict';
  lastSaved?: Date;
  error?: string;
  pendingChanges: boolean;
}

export class AutoSaveService {
  private debounceTimer: NodeJS.Timeout | null = null;
  private readonly debounceDelay: number;
  private readonly maxRetries: number;
  private readonly retryDelay: number;
  private retryCount = 0;
  private lastSavedData: string | null = null;
  private lastServerVersion: string | null = null;
  private status: AutoSaveStatus = {
    status: 'idle',
    pendingChanges: false,
  };
  
  private readonly options: AutoSaveOptions;
  private statusCallbacks: ((status: AutoSaveStatus) => void)[] = [];

  constructor(options: AutoSaveOptions = {}) {
    this.debounceDelay = options.debounceDelay || 2000; // 2 seconds
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 1000; // 1 second
    this.options = options;
  }

  /**
   * Subscribe to auto-save status changes
   */
  public onStatusChange(callback: (status: AutoSaveStatus) => void): () => void {
    this.statusCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.statusCallbacks.indexOf(callback);
      if (index > -1) {
        this.statusCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Get current auto-save status
   */
  public getStatus(): AutoSaveStatus {
    return { ...this.status };
  }

  /**
   * Schedule an auto-save operation with debouncing
   */
  public scheduleAutoSave(resumeId: string, data: ResumeData): void {
    // Clear existing timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    // Check if data has actually changed
    const dataString = JSON.stringify(data);
    if (dataString === this.lastSavedData) {
      return; // No changes to save
    }

    // Update status
    this.updateStatus({
      status: 'idle',
      pendingChanges: true,
    });

    // Schedule the save operation
    this.debounceTimer = setTimeout(() => {
      this.performAutoSave(resumeId, data);
    }, this.debounceDelay);
  }

  /**
   * Force an immediate save (bypassing debounce)
   */
  public async forceSave(resumeId: string, data: ResumeData): Promise<void> {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    
    await this.performAutoSave(resumeId, data);
  }

  /**
   * Perform the actual auto-save operation
   */
  private async performAutoSave(resumeId: string, data: ResumeData): Promise<void> {
    try {
      // Validate and sanitize data before saving
      const validatedData = validateAndSanitizeResumeData(data);
      const dataString = JSON.stringify(validatedData);

      // Skip if no changes since last save
      if (dataString === this.lastSavedData) {
        this.updateStatus({
          status: 'saved',
          pendingChanges: false,
        });
        return;
      }

      // Update status to saving
      this.updateStatus({
        status: 'saving',
        pendingChanges: true,
      });

      this.options.onSaveStart?.();

      // Get current server version for conflict detection
      const currentResponse = await fetch(`/api/resumes/${resumeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!currentResponse.ok) {
        throw new Error(`Failed to fetch current resume: ${currentResponse.statusText}`);
      }

      const currentData = await currentResponse.json();
      const serverDataString = JSON.stringify(currentData.data.resume_data);

      // Check for conflicts
      if (this.lastServerVersion && serverDataString !== this.lastServerVersion) {
        await this.handleConflict(resumeId, validatedData, currentData.data);
        return;
      }

      // Perform the save
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume_data: validatedData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Save failed: ${response.statusText}`);
      }

      const savedData = await response.json();

      // Update tracking variables
      this.lastSavedData = dataString;
      this.lastServerVersion = JSON.stringify(savedData.data.resume_data);
      this.retryCount = 0;

      // Update status to saved
      this.updateStatus({
        status: 'saved',
        lastSaved: new Date(),
        pendingChanges: false,
        error: undefined,
      });

      this.options.onSaveSuccess?.(savedData.data);
    } catch (error) {
      console.error('Auto-save error:', error);
      await this.handleSaveError(resumeId, data, error as Error);
    }
  }

  /**
   * Handle save errors with retry logic
   */
  private async handleSaveError(resumeId: string, data: ResumeData, error: Error): Promise<void> {
    this.retryCount++;

    if (this.retryCount <= this.maxRetries) {
      // Schedule retry
      setTimeout(() => {
        this.performAutoSave(resumeId, data);
      }, this.retryDelay * this.retryCount); // Exponential backoff

      this.updateStatus({
        status: 'error',
        error: `Save failed, retrying... (${this.retryCount}/${this.maxRetries})`,
        pendingChanges: true,
      });
    } else {
      // Max retries exceeded
      this.updateStatus({
        status: 'error',
        error: error.message || 'Save failed after multiple retries',
        pendingChanges: true,
      });

      this.options.onSaveError?.(error);
    }
  }

  /**
   * Handle data conflicts between local and server versions
   */
  private async handleConflict(resumeId: string, localData: ResumeData, serverData: any): Promise<void> {
    this.updateStatus({
      status: 'conflict',
      error: 'Data conflict detected',
      pendingChanges: true,
    });

    if (this.options.onConflict) {
      try {
        const resolvedData = await this.options.onConflict(serverData.resume_data, localData);
        
        // Save the resolved data
        await this.performAutoSave(resumeId, resolvedData);
      } catch (error) {
        console.error('Conflict resolution error:', error);
        this.updateStatus({
          status: 'error',
          error: 'Failed to resolve data conflict',
          pendingChanges: true,
        });
      }
    } else {
      // Default conflict resolution: prefer local changes
      console.warn('Data conflict detected, preferring local changes');
      this.lastServerVersion = null; // Reset to force save
      await this.performAutoSave(resumeId, localData);
    }
  }

  /**
   * Update status and notify subscribers
   */
  private updateStatus(updates: Partial<AutoSaveStatus>): void {
    this.status = { ...this.status, ...updates };
    this.statusCallbacks.forEach(callback => callback(this.status));
  }

  /**
   * Reset the auto-save service
   */
  public reset(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    
    this.retryCount = 0;
    this.lastSavedData = null;
    this.lastServerVersion = null;
    
    this.updateStatus({
      status: 'idle',
      pendingChanges: false,
      error: undefined,
      lastSaved: undefined,
    });
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    this.reset();
    this.statusCallbacks = [];
  }
}

/**
 * Create a new auto-save service instance
 */
export function createAutoSaveService(options?: AutoSaveOptions): AutoSaveService {
  return new AutoSaveService(options);
}

/**
 * Hook for React components to use auto-save
 */
export function useAutoSave(resumeId: string, options?: AutoSaveOptions) {
  const [autoSave] = useState(() => createAutoSaveService(options));
  const [status, setStatus] = useState<AutoSaveStatus>(autoSave.getStatus());

  useEffect(() => {
    const unsubscribe = autoSave.onStatusChange(setStatus);
    return () => {
      unsubscribe();
      autoSave.destroy();
    };
  }, [autoSave]);

  const scheduleAutoSave = useCallback((data: ResumeData) => {
    autoSave.scheduleAutoSave(resumeId, data);
  }, [autoSave, resumeId]);

  const forceSave = useCallback(async (data: ResumeData) => {
    await autoSave.forceSave(resumeId, data);
  }, [autoSave, resumeId]);

  return {
    scheduleAutoSave,
    forceSave,
    status,
    reset: autoSave.reset.bind(autoSave),
  };
} 