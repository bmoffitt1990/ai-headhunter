/**
 * Generate a unique ID for form entries
 * Uses timestamp + random string for uniqueness
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}; 