# FractionaX Frontend Security Implementation

## 🔐 Overview

This document outlines the comprehensive security measures implemented in the FractionaX frontend application, including authentication, authorization, data protection, and threat mitigation strategies.

## 🛡️ Security Features Implemented

### 1. Enhanced Authentication System

#### HTTP-Only Cookie Support
- **Location**: `src/utils/secureApiClient.js`
- **Features**:
  - Automatic cookie handling with `credentials: 'include'`
  - CSRF token protection
  - Secure session management
  - Automatic token refresh

#### Enhanced AuthProvider
- **Location**: `src/context/AuthProvider.jsx`
- **Features**:
  - Improved token validation with expiration buffer
  - Smart caching system with session IDs
  - Cross-tab synchronization
  - Comprehensive error handling

### 2. API Security

#### Secure API Client
- **Location**: `src/utils/secureApiClient.js`
- **Features**:
  - Rate limiting (100 requests/minute)
  - Request/response interceptors
  - Automatic token refresh
  - CSRF protection
  - Enhanced security headers
  - File upload with progress tracking

#### Rate Limiting Configuration
```javascript
// Different limits for different endpoints
api: { maxRequests: 100, windowMs: 60000 }      // General API
auth: { maxRequests: 5, windowMs: 900000 }      // Auth endpoints
search: { maxRequests: 30, windowMs: 60000 }    // Search endpoints
upload: { maxRequests: 10, windowMs: 60000 }    // File uploads
```

### 3. Content Security Policy (CSP)

#### Headers Implemented
- **Location**: `index.html`
- **Protection Against**:
  - Cross-Site Scripting (XSS)
  - Code injection attacks
  - Unauthorized resource loading
  - Clickjacking

#### CSP Directives
```
default-src 'self'
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
font-src 'self' https://fonts.gstatic.com
img-src 'self' data: https: blob:
connect-src 'self' https://api.fractionax.io http://localhost:5000
object-src 'none'
frame-ancestors 'none'
base-uri 'self'
form-action 'self'
```

### 4. Input Validation & Sanitization

#### Security Utils
- **Location**: `src/utils/security.js`
- **Features**:
  - XSS pattern detection
  - SQL injection prevention
  - Path traversal protection
  - Command injection detection
  - HTML sanitization with DOMPurify
  - Input validation for various data types

#### Validation Rules
```javascript
// String limits
email: 254 characters
password: 128 characters
name: 100 characters
search: 200 characters
description: 2000 characters

// File validation
maxSize: 10MB
allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
```

### 5. Session Management

#### Security Hook
- **Location**: `src/hooks/useSecurity.js`
- **Features**:
  - Session monitoring (30-second intervals)
  - Idle timeout (30 minutes)
  - Session warning (5 minutes before expiry)
  - Activity tracking
  - Threat detection
  - Rate limiting per user

#### Session Configuration
```javascript
SESSION_CHECK_INTERVAL: 30000        // 30 seconds
IDLE_TIMEOUT: 1800000               // 30 minutes
SESSION_WARNING_TIME: 300000        // 5 minutes
```

### 6. Security Headers

#### Vite Configuration
- **Location**: `vite.config.js`
- **Headers Implemented**:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: geolocation=(), microphone=(), camera=()`

### 7. Environment-Specific Security

#### Security Configuration
- **Location**: `src/config/security.js`
- **Features**:
  - Environment-specific settings
  - Production vs. development policies
  - HTTPS enforcement
  - Cookie security settings
  - Rate limiting configurations

## 🚀 Implementation Guide

### 1. Basic Setup

```javascript
// Import the security hook in your components
import { useSecurity } from '../hooks/useSecurity';

// Use in component
function MyComponent() {
  const security = useSecurity({
    requireAuth: true,
    enableSessionMonitoring: true,
    enableIdleTimeout: true
  });

  // Validate user input
  const handleInput = (input) => {
    if (!security.validateInput(input, 'search')) {
      // Handle invalid input
      return;
    }
    // Process valid input
  };
}
```

### 2. Protected Routes

```javascript
// Wrap components that require authentication
import { withSecurity } from '../hooks/useSecurity';

const ProtectedComponent = withSecurity(MyComponent, {
  requireAuth: true,
  allowedRoles: ['admin', 'user']
});
```

### 3. API Calls

```javascript
// Use the secure API client
import { secureGet, securePost } from '../utils/secureApiClient';

// Making secure requests
const fetchData = async () => {
  try {
    const response = await secureGet('/api/protected-endpoint');
    const data = await response.json();
    return data;
  } catch (error) {
    // Handle errors (including rate limiting)
    console.error('API Error:', error);
  }
};
```

### 4. File Uploads

```javascript
import { uploadFile } from '../utils/secureApiClient';

const handleFileUpload = async (file) => {
  try {
    const result = await uploadFile('/api/upload', file, (progress) => {
      console.log(`Upload progress: ${progress}%`);
    });
    console.log('Upload successful:', result);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file for environment-specific settings:

```env
NODE_ENV=development
VITE_API_URL=http://localhost:5000
VITE_FRONTEND_URL=http://localhost:5173
VITE_ENABLE_SECURITY_LOGGING=true
```

### Production Deployment

#### Security Checklist
- [ ] Enable HTTPS enforcement
- [ ] Set secure cookie flags
- [ ] Update CSP directives for production domains
- [ ] Enable HSTS headers
- [ ] Configure proper CORS origins
- [ ] Enable security monitoring
- [ ] Set up error tracking
- [ ] Configure rate limiting
- [ ] Enable request logging

#### Production Environment Variables
```env
NODE_ENV=production
VITE_API_URL=https://api.fractionax.io
VITE_FRONTEND_URL=https://fractionax.io
VITE_ENABLE_SECURITY_LOGGING=false
```

## 🧪 Testing Security Features

### 1. Authentication Testing

```javascript
// Test token validation
const testAuth = async () => {
  // Test with valid token
  const validResponse = await secureGet('/api/protected');
  
  // Test with expired token (should auto-refresh)
  // Test with invalid token (should redirect to login)
};
```

### 2. Input Validation Testing

```javascript
import { checkSecurityThreats } from '../utils/security';

// Test XSS detection
const xssTest = checkSecurityThreats('<script>alert("xss")</script>');
console.log('XSS detected:', !xssTest.safe);

// Test SQL injection detection
const sqlTest = checkSecurityThreats('SELECT * FROM users WHERE id = 1; DROP TABLE users;');
console.log('SQL injection detected:', !sqlTest.safe);
```

### 3. Rate Limiting Testing

```javascript
// Test rate limiting
const testRateLimit = async () => {
  for (let i = 0; i < 102; i++) {
    try {
      await secureGet('/api/test');
    } catch (error) {
      if (error.message.includes('Rate limit')) {
        console.log('Rate limit triggered at request:', i);
        break;
      }
    }
  }
};
```

## 📊 Security Monitoring

### 1. Threat Detection

The security system automatically detects and logs:
- XSS attempts
- SQL injection attempts
- Path traversal attempts
- Command injection attempts
- Rate limit violations
- Invalid authentication attempts

### 2. Session Monitoring

- Session validity checks every 30 seconds
- Idle timeout detection
- Cross-tab session synchronization
- Session expiry warnings

### 3. Performance Monitoring

- Slow request detection (>5 seconds)
- Memory usage monitoring
- Error rate tracking

## 🚨 Incident Response

### 1. Security Threat Detection

When a security threat is detected:
1. Log the incident with context
2. Block the suspicious input
3. Notify the user (in development)
4. Continue monitoring

### 2. Authentication Failures

When authentication fails:
1. Clear invalid tokens
2. Redirect to login page
3. Log the incident
4. Provide user feedback

### 3. Rate Limiting

When rate limits are exceeded:
1. Block additional requests
2. Return appropriate error message
3. Log the incident
4. Implement backoff strategy

## 🔄 Updates and Maintenance

### Regular Security Tasks

1. **Weekly**:
   - Review security logs
   - Check for new vulnerabilities
   - Update dependencies

2. **Monthly**:
   - Security audit
   - Performance review
   - Configuration updates

3. **Quarterly**:
   - Penetration testing
   - Security policy review
   - Training updates

### Dependency Management

```bash
# Regular security audits
npm audit

# Fix vulnerabilities
npm audit fix

# Check for outdated packages
npm outdated
```

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [HTTP Security Headers](https://owasp.org/www-project-secure-headers/)

## 🤝 Contributing

When contributing to security features:

1. Follow the established patterns
2. Add comprehensive tests
3. Update documentation
4. Review security implications
5. Test in both development and production environments

## 📞 Security Contacts

For security-related issues or questions:
- Development Team: [Insert Contact]
- Security Team: [Insert Contact]
- Emergency: [Insert Contact]

---

**Last Updated**: August 2025  
**Version**: 1.0.0  
**Maintained By**: FractionaX Development Team
