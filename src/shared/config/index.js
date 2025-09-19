/**
 * Main configuration file for API endpoints and app settings
 */

// API Base URL - defaults to localhost for development
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Other configuration settings
export const PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL || '';

// App settings
export const APP_NAME = 'FractionaX';
export const APP_VERSION = '1.0.0';

// API Configuration
export const API_CONFIG = {
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000 // 1 second
};

// Enhanced Discovery Configuration
export const ENHANCED_DISCOVERY_CONFIG = {
  apiEndpoint: '/api/enhanced-discovery',
  quotaEndpoint: '/quota',
  scoringInfoEndpoint: '/scoring-info',
  propertiesEndpoint: '/properties'
};

export default {
  API_BASE_URL,
  PUBLIC_URL,
  APP_NAME,
  APP_VERSION,
  API_CONFIG,
  ENHANCED_DISCOVERY_CONFIG
};
