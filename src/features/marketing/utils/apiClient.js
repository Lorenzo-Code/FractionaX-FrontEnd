/**
 * Smart fetch utility for API calls
 * Handles common API operations with error handling and response parsing
 */

const API_BASE_URL = 'https://api.fractionax.io';

/**
 * Enhanced fetch utility with error handling and automatic JSON parsing
 * @param {string} url - The API endpoint (relative to base URL)
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} - The fetch response
 */
export const smartFetch = async (url, options = {}) => {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(fullUrl, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * Get all blog posts
 * @returns {Promise<Object>} - Blog posts data
 */
export const getBlogs = async () => {
  const response = await smartFetch('/api/blogs');
  return response.json();
};
