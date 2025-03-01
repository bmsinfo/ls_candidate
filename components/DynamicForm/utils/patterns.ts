// Define common validation patterns
export const VALIDATION_PATTERNS = {
  // Only integers (no decimals)
  INTEGER: '^[0-9]+$',

  // Decimals with up to 2 decimal places
  DECIMAL: '^\\d+(\\.\\d{1,2})?$',

  // Only numbers, no decimals
  NUMERIC: '^[0-9]+$',

  // Social media patterns
  LINKEDIN: '^https:\\/\\/(?:www\\.)?linkedin\\.com\\/.*$',
  GITHUB: '^https:\\/\\/(?:www\\.)?github\\.com\\/.*$',
  STACKOVERFLOW_ID: '^[0-9]+$',
} as const;

// Helper to validate patterns
export const testPattern = (pattern: string, value: string): boolean => {
  try {
    const regex = new RegExp(pattern);
    return regex.test(value);
  } catch (error) {
    console.error('Invalid regex pattern:', error);
    return false;
  }
};
