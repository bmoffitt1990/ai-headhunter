import { ResumeData, defaultResumeData } from '../types/resume';

const STORAGE_KEY = 'ai-headhunter-resume-draft';

/**
 * Save resume data to localStorage
 */
export const saveResumeDraft = (data: ResumeData): void => {
  try {
    const serializedData = JSON.stringify({
      data,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEY, serializedData);
  } catch (error) {
    console.warn('Failed to save resume draft:', error);
  }
};

/**
 * Load resume data from localStorage
 */
export const loadResumeDraft = (): ResumeData | null => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (!savedData) return null;

    const parsed = JSON.parse(savedData);
    return parsed.data || null;
  } catch (error) {
    console.warn('Failed to load resume draft:', error);
    return null;
  }
};

/**
 * Clear resume draft from localStorage
 */
export const clearResumeDraft = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear resume draft:', error);
  }
};

/**
 * Get the timestamp of the last saved draft
 */
export const getDraftTimestamp = (): string | null => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (!savedData) return null;

    const parsed = JSON.parse(savedData);
    return parsed.timestamp || null;
  } catch (error) {
    console.warn('Failed to get draft timestamp:', error);
    return null;
  }
};

/**
 * Check if there's a saved draft available
 */
export const hasSavedDraft = (): boolean => {
  return loadResumeDraft() !== null;
};

/**
 * Merge default data with saved draft to handle schema changes
 */
export const getResumeDataWithDefaults = (): ResumeData => {
  const draft = loadResumeDraft();
  if (!draft) return defaultResumeData;

  // Merge with defaults to handle any missing fields from schema updates
  return {
    personalInfo: { ...defaultResumeData.personalInfo, ...draft.personalInfo },
    experience: draft.experience || [],
    education: draft.education || [],
    skills: draft.skills || [],
    projects: draft.projects || [],
  };
}; 