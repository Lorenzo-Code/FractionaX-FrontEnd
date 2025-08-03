/**
 * Comprehensive Security Configuration
 * Environment-specific security settings and policies
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

export const SECURITY_CONFIG = {
  // Environment flags
  isDevelopment,
  isProduction,
  
  // API Configuration
  api: {
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
    
    // Allowed origins for CORS
    allowedOrigins: isProduction 
      ? ['https://fractionax.io', 'https://www.fractionax.io', 'https://api.fractionax.io']
      : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5000'],
    
    // Security headers
    securityHeaders: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=()',
      'Strict-Transport-Security': isProduction ? 'max-age=31536000; includeSubDomains; preload' : undefined
    }
  },

  // Authentication & Session
  auth: {
    // Token configuration
    accessTokenKey: 'access_token', // Legacy support
    refreshTokenKey: 'refresh_token', // HTTP-only cookie
    userCacheKey: 'user_cache',
    
    // Session timing (in milliseconds)
    accessTokenLifetime: 15 * 60 * 1000, // 15 minutes
    refreshTokenLifetime: 7 * 24 * 60 * 60 * 1000, // 7 days
    sessionCheckInterval: 30 * 1000, // 30 seconds
    sessionWarningTime: 5 * 60 * 1000, // 5 minutes before expiry
    idleTimeout: 30 * 60 * 1000, // 30 minutes
    
    // Token validation
    requireHttps: isProduction,
    sameSitePolicy: isProduction ? 'Strict' : 'Lax',
    
    // Password requirements
    password: {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      maxAttempts: 5,
      lockoutDuration: 15 * 60 * 1000, // 15 minutes
    }
  },

  // Rate Limiting
  rateLimiting: {
    // General API calls
    api: {
      maxRequests: 100,
      windowMs: 60 * 1000, // 1 minute
    },
    
    // Authentication endpoints
    auth: {
      maxRequests: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
    },
    
    // Search endpoints
    search: {
      maxRequests: 30,
      windowMs: 60 * 1000, // 1 minute
    },
    
    // File uploads
    upload: {
      maxRequests: 10,
      windowMs: 60 * 1000, // 1 minute
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    }
  },

  // Content Security Policy
  csp: {
    directives: {
      'default-src': ["'self'"],
      'script-src': [
        "'self'",
        "'unsafe-inline'", // Required for inline scripts in development
        'https://www.googletagmanager.com',
        ...(isDevelopment ? ["'unsafe-eval'"] : [])
      ],
      'style-src': [
        "'self'",
        "'unsafe-inline'", // Required for CSS-in-JS
        'https://fonts.googleapis.com'
      ],
      'img-src': [
        "'self'",
        'data:',
        'https://fractionax.io',
        'https://www.googletagmanager.com'
      ],
      'font-src': [
        "'self'",
        'https://fonts.gstatic.com'
      ],
      'connect-src': [
        "'self'",
        'https://api.fractionax.io',
        'https://www.googletagmanager.com',
        ...(isDevelopment ? ['http://localhost:5000', 'ws://localhost:*'] : [])
      ],
      'frame-src': ["'none'"],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'frame-ancestors': ["'none'"],
      'upgrade-insecure-requests': isProduction ? [] : undefined
    }
  },

  // Input Validation
  validation: {
    // String limits
    maxStringLength: {
      email: 254,
      password: 128,
      name: 100,
      search: 200,
      description: 2000,
      url: 2048
    },
    
    // Numeric limits
    maxNumericValue: {
      price: 10000000, // $10M
      percentage: 100,
      page: 1000,
      itemsPerPage: 100
    },
    
    // File validation
    file: {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: [
        'image/jpeg',
        'image/png', 
        'image/webp',
        'image/gif',
        'application/pdf',
        'text/plain'
      ],
      maxFiles: 10
    }
  },

  // Security Monitoring
  monitoring: {
    // Threat detection
    threatDetection: {
      enabled: true,
      logLevel: isDevelopment ? 'debug' : 'warn',
      maxThreats: 10,
      blockThreshold: 5
    },
    
    // Performance monitoring
    performance: {
      enabled: true,
      slowRequestThreshold: 5000, // 5 seconds
      memoryThreshold: 100 * 1024 * 1024, // 100MB
    },
    
    // Error tracking
    errorTracking: {
      enabled: true,
      maxErrors: 50,
      errorTypes: ['security', 'auth', 'api', 'validation']
    }
  },

  // HTTPS & SSL
  ssl: {
    enforceHttps: isProduction,
    hstsMaxAge: 31536000, // 1 year
    includeSubdomains: true,
    preload: true
  },

  // Privacy & Data Protection
  privacy: {
    // Cookie settings
    cookies: {
      secure: isProduction,
      httpOnly: true,
      sameSite: isProduction ? 'Strict' : 'Lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    },
    
    // Data retention
    dataRetention: {
      sessionLogs: 30 * 24 * 60 * 60 * 1000, // 30 days
      errorLogs: 7 * 24 * 60 * 60 * 1000, // 7 days
      userCache: 24 * 60 * 60 * 1000, // 24 hours
    }
  },

  // Feature Flags
  features: {
    enableBiometric: false, // Future enhancement
    enableTwoFactor: false, // Future enhancement
    enableDeviceFingerprinting: isProduction,
    enableAdvancedThreatDetection: isProduction,
    enableSecurityNotifications: true
  }
};

// Helper functions
export const getSecurityHeader = (headerName) => {
  return SECURITY_CONFIG.api.securityHeaders[headerName];
};

export const isValidOrigin = (origin) => {
  return SECURITY_CONFIG.api.allowedOrigins.includes(origin);
};

export const getRateLimitConfig = (endpoint) => {
  if (endpoint.includes('/auth/')) {
    return SECURITY_CONFIG.rateLimiting.auth;
  }
  if (endpoint.includes('/search')) {
    return SECURITY_CONFIG.rateLimiting.search;
  }
  if (endpoint.includes('/upload')) {
    return SECURITY_CONFIG.rateLimiting.upload;
  }
  return SECURITY_CONFIG.rateLimiting.api;
};

export const buildCSPHeader = () => {
  const directives = SECURITY_CONFIG.csp.directives;
  return Object.entries(directives)
    .filter(([key, value]) => value !== undefined)
    .map(([key, values]) => {
      if (Array.isArray(values) && values.length > 0) {
        return `${key} ${values.join(' ')}`;
      } else if (typeof values === 'string') {
        return `${key} ${values}`;
      }
      return `${key}`;
    })
    .join('; ');
};

// Security utilities
export const isSecureContext = () => {
  return window.isSecureContext || (!isProduction && window.location.hostname === 'localhost');
};

export const shouldEnforceHttps = () => {
  return SECURITY_CONFIG.ssl.enforceHttps && window.location.protocol !== 'https:';
};

// Environment-specific exports
export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5000' 
  : 'https://api.fractionax.io';

export const FRONTEND_URL = isDevelopment 
  ? 'http://localhost:5173' 
  : 'https://fractionax.io';

export default SECURITY_CONFIG;
