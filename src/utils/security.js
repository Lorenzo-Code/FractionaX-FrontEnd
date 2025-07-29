// Security utilities for input validation and sanitization
// Protects against XSS, injection attacks, and malicious inputs

import DOMPurify from 'dompurify';

class SecurityUtils {
  constructor() {
    this.emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    this.urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    this.alphanumericRegex = /^[a-zA-Z0-9\s]+$/;
    this.numericRegex = /^[0-9]+$/;
    this.decimalRegex = /^[0-9]+(\.[0-9]+)?$/;
    
    // Common XSS patterns
    this.xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<img[^>]+src[^>]*>/gi
    ];
    
    // SQL injection patterns
    this.sqlPatterns = [
      /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/gi,
      /(--|\/\*|\*\/|;|\||&)/g,
      /(\bor\b|\band\b)\s+\d+\s*=\s*\d+/gi
    ];
  }

  // Sanitize HTML content
  sanitizeHTML(input) {
    if (typeof input !== 'string') return '';
    
    // Use DOMPurify for comprehensive HTML sanitization
    const clean = DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
      ALLOWED_ATTR: ['href'],
      ALLOW_DATA_ATTR: false,
      ALLOW_UNKNOWN_PROTOCOLS: false
    });
    
    return clean;
  }

  // Basic text sanitization
  sanitizeText(input, maxLength = 1000) {
    if (typeof input !== 'string') return '';
    
    // Remove potential XSS patterns
    let sanitized = input;
    this.xssPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
    
    // Remove potential SQL injection patterns
    this.sqlPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
    
    // Trim and limit length
    sanitized = sanitized.trim().substring(0, maxLength);
    
    // Encode special characters
    sanitized = this.encodeSpecialChars(sanitized);
    
    return sanitized;
  }

  // Encode special characters to prevent XSS
  encodeSpecialChars(input) {
    if (typeof input !== 'string') return '';
    
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // Decode special characters (for display)
  decodeSpecialChars(input) {
    if (typeof input !== 'string') return '';
    
    return input
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, '/');
  }

  // Validate email address
  validateEmail(email) {
    if (typeof email !== 'string') return false;
    
    const sanitized = this.sanitizeText(email, 254); // RFC 5321 limit
    return this.emailRegex.test(sanitized);
  }

  // Validate phone number
  validatePhone(phone) {
    if (typeof phone !== 'string') return false;
    
    const sanitized = this.sanitizeText(phone, 20);
    return this.phoneRegex.test(sanitized);
  }

  // Validate URL
  validateURL(url) {
    if (typeof url !== 'string') return false;
    
    const sanitized = this.sanitizeText(url, 2048); // Common URL length limit
    return this.urlRegex.test(sanitized);
  }

  // Validate numeric input
  validateNumeric(input, min = null, max = null) {
    if (typeof input === 'number') {
      if (min !== null && input < min) return false;
      if (max !== null && input > max) return false;
      return true;
    }
    
    if (typeof input !== 'string') return false;
    
    const sanitized = this.sanitizeText(input, 20);
    if (!this.numericRegex.test(sanitized)) return false;
    
    const num = parseInt(sanitized, 10);
    if (min !== null && num < min) return false;
    if (max !== null && num > max) return false;
    
    return true;
  }

  // Validate decimal input
  validateDecimal(input, min = null, max = null, decimals = 2) {
    if (typeof input === 'number') {
      if (min !== null && input < min) return false;
      if (max !== null && input > max) return false;
      return true;
    }
    
    if (typeof input !== 'string') return false;
    
    const sanitized = this.sanitizeText(input, 20);
    if (!this.decimalRegex.test(sanitized)) return false;
    
    const num = parseFloat(sanitized);
    if (isNaN(num)) return false;
    if (min !== null && num < min) return false;
    if (max !== null && num > max) return false;
    
    // Check decimal places
    const decimalPart = sanitized.split('.')[1];
    if (decimalPart && decimalPart.length > decimals) return false;
    
    return true;
  }

  // Validate alphanumeric input
  validateAlphanumeric(input, minLength = 1, maxLength = 100) {
    if (typeof input !== 'string') return false;
    
    const sanitized = this.sanitizeText(input, maxLength);
    if (sanitized.length < minLength) return false;
    
    return this.alphanumericRegex.test(sanitized);
  }

  // Validate search query
  validateSearchQuery(query, maxLength = 200) {
    if (typeof query !== 'string') return false;
    
    const sanitized = this.sanitizeText(query, maxLength);
    
    // Basic validation - no empty queries, no excessive special characters
    if (sanitized.length === 0) return false;
    if (sanitized.length < 2) return false;
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /script/gi,
      /javascript/gi,
      /vbscript/gi,
      /onload/gi,
      /onerror/gi
    ];
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(sanitized)) return false;
    }
    
    return true;
  }

  // Validate property filters
  validatePropertyFilters(filters) {
    const validatedFilters = {};
    
    // Price range validation
    if (filters.priceRange && Array.isArray(filters.priceRange)) {
      const [min, max] = filters.priceRange;
      if (this.validateNumeric(min, 0, 10000000) && 
          this.validateNumeric(max, 0, 10000000) && 
          min <= max) {
        validatedFilters.priceRange = [parseInt(min), parseInt(max)];
      }
    }
    
    // Property type validation
    const validPropertyTypes = ['all', 'house', 'condo', 'apartment', 'townhouse'];
    if (filters.propertyType && validPropertyTypes.includes(filters.propertyType)) {
      validatedFilters.propertyType = filters.propertyType;
    }
    
    // Bedrooms validation
    const validBedrooms = ['any', '1', '2', '3', '4', '5+'];
    if (filters.bedrooms && validBedrooms.includes(filters.bedrooms)) {
      validatedFilters.bedrooms = filters.bedrooms;
    }
    
    // Bathrooms validation
    const validBathrooms = ['any', '1', '2', '3', '4+'];
    if (filters.bathrooms && validBathrooms.includes(filters.bathrooms)) {
      validatedFilters.bathrooms = filters.bathrooms;
    }
    
    // Location validation
    if (filters.location && typeof filters.location === 'string') {
      const sanitizedLocation = this.sanitizeText(filters.location, 100);
      if (sanitizedLocation.length > 0) {
        validatedFilters.location = sanitizedLocation;
      }
    }
    
    // Sort by validation
    const validSortOptions = ['newest', 'price-low', 'price-high', 'beds', 'sqft', 'roi'];
    if (filters.sortBy && validSortOptions.includes(filters.sortBy)) {
      validatedFilters.sortBy = filters.sortBy;
    }
    
    // Tokenization status validation
    const validTokenizationStatus = ['all', 'tokenized', 'available'];
    if (filters.tokenizationStatus && validTokenizationStatus.includes(filters.tokenizationStatus)) {
      validatedFilters.tokenizationStatus = filters.tokenizationStatus;
    }
    
    return validatedFilters;
  }

  // Validate pagination parameters
  validatePagination(page, itemsPerPage) {
    const validatedPage = this.validateNumeric(page, 1, 1000) ? parseInt(page) : 1;
    const validatedItemsPerPage = this.validateNumeric(itemsPerPage, 1, 100) ? parseInt(itemsPerPage) : 12;
    
    return {
      page: validatedPage,
      itemsPerPage: validatedItemsPerPage
    };
  }

  // Check for common security threats
  checkSecurityThreats(input) {
    if (typeof input !== 'string') return { safe: true, threats: [] };
    
    const threats = [];
    
    // Check for XSS
    this.xssPatterns.forEach((pattern, index) => {
      if (pattern.test(input)) {
        threats.push(`XSS_PATTERN_${index}`);
      }
    });
    
    // Check for SQL injection
    this.sqlPatterns.forEach((pattern, index) => {
      if (pattern.test(input)) {
        threats.push(`SQL_INJECTION_${index}`);
      }
    });
    
    // Check for path traversal
    if (input.includes('../') || input.includes('..\\')) {
      threats.push('PATH_TRAVERSAL');
    }
    
    // Check for command injection
    const commandPatterns = [
      /(\||&|;|\$\(|\`)/g,
      /(rm\s|del\s|format\s)/gi
    ];
    
    commandPatterns.forEach((pattern, index) => {
      if (pattern.test(input)) {
        threats.push(`COMMAND_INJECTION_${index}`);
      }
    });
    
    return {
      safe: threats.length === 0,
      threats
    };
  }

  // Rate limiting helper
  createRateLimiter(maxRequests = 100, windowMs = 60000) {
    const requests = new Map();
    
    return (identifier) => {
      const now = Date.now();
      const userRequests = requests.get(identifier) || [];
      
      // Remove old requests outside the time window
      const validRequests = userRequests.filter(time => now - time < windowMs);
      
      if (validRequests.length >= maxRequests) {
        return false; // Rate limit exceeded
      }
      
      validRequests.push(now);
      requests.set(identifier, validRequests);
      
      return true; // Request allowed
    };
  }

  // Generate secure random token
  generateSecureToken(length = 32) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Hash sensitive data (for client-side hashing before transmission)
  async hashData(data, salt = '') {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

// Create singleton instance
const securityUtils = new SecurityUtils();

// Export utility functions
export const sanitizeHTML = (input) => securityUtils.sanitizeHTML(input);
export const sanitizeText = (input, maxLength) => securityUtils.sanitizeText(input, maxLength);
export const encodeSpecialChars = (input) => securityUtils.encodeSpecialChars(input);
export const decodeSpecialChars = (input) => securityUtils.decodeSpecialChars(input);
export const validateEmail = (email) => securityUtils.validateEmail(email);
export const validatePhone = (phone) => securityUtils.validatePhone(phone);
export const validateURL = (url) => securityUtils.validateURL(url);
export const validateNumeric = (input, min, max) => securityUtils.validateNumeric(input, min, max);
export const validateDecimal = (input, min, max, decimals) => securityUtils.validateDecimal(input, min, max, decimals);
export const validateAlphanumeric = (input, minLength, maxLength) => securityUtils.validateAlphanumeric(input, minLength, maxLength);
export const validateSearchQuery = (query, maxLength) => securityUtils.validateSearchQuery(query, maxLength);
export const validatePropertyFilters = (filters) => securityUtils.validatePropertyFilters(filters);
export const validatePagination = (page, itemsPerPage) => securityUtils.validatePagination(page, itemsPerPage);
export const checkSecurityThreats = (input) => securityUtils.checkSecurityThreats(input);
export const createRateLimiter = (maxRequests, windowMs) => securityUtils.createRateLimiter(maxRequests, windowMs);
export const generateSecureToken = (length) => securityUtils.generateSecureToken(length);
export const hashData = (data, salt) => securityUtils.hashData(data, salt);

export default securityUtils;
