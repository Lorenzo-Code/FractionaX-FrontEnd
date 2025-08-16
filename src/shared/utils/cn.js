import { clsx } from 'clsx';

/**
 * Utility function for merging CSS class names
 * @param {...any} inputs - Class names to merge
 * @returns {string} - Merged class name string
 */
export function cn(...inputs) {
  return clsx(inputs);
}
