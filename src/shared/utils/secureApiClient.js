/**
 * Enhanced Secure API Client
 * Features:
 * - HTTP-only cookie support
 * - Refresh token logic
 * - Rate limiting
 * - Request/Response interceptors
 * - CSRF protection
 * - Enhanced security headers
 */

import { createRateLimiter } from './security';

const LOCAL_API = "http://localhost:5000";
const PROD_API = "https://api.fractionax.io";

class SecureApiClient {
  constructor() {
    this.refreshing = false;
    this.failedQueue = [];
    this.rateLimiter = createRateLimiter(100, 60000); // 100 requests per minute
    this.csrfToken = null;
    this.sessionId = this.generateSessionId();
    
    // Initialize CSRF token on startup
    this.initializeCsrfToken();
  }

  generateSessionId() {
    return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36);
  }

  async initializeCsrfToken() {
    try {
      const response = await this.baseFetch('/api/auth/csrf-token', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        this.csrfToken = data.csrfToken;
        
        if (process.env.NODE_ENV === 'development') {
          console.log('🔐 CSRF token initialized');
        }
      }
    } catch (error) {
      console.warn('Failed to initialize CSRF token:', error.message);
    }
  }

  async baseFetch(path, options = {}) {
    // Get JWT token from localStorage for authorization
    const token = localStorage.getItem('access_token');
    
    const defaultHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-Session-ID': this.sessionId,
      ...(this.csrfToken && { 'X-CSRF-Token': this.csrfToken }),
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...(options.headers || {})
    };

    // Handle FormData - don't set Content-Type for file uploads
    if (options.body instanceof FormData) {
      delete defaultHeaders['Content-Type'];
    }

    const finalOptions = {
      credentials: 'include', // Always include cookies
      ...options,
      headers: defaultHeaders
    };

    // Try local API first
    try {
      const localRes = await fetch(`${LOCAL_API}${path}`, finalOptions);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`📡 [LOCAL] ${options.method || 'GET'} ${LOCAL_API}${path} → ${localRes.status}`);
      }
      
      return localRes;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`⚠️ Local API failed, trying production: ${error.message}`);
      }
      
      // Fallback to production API
      try {
        const prodRes = await fetch(`${PROD_API}${path}`, finalOptions);
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`📡 [PROD] ${options.method || 'GET'} ${PROD_API}${path} → ${prodRes.status}`);
        }
        
        return prodRes;
      } catch (prodError) {
        console.error('❌ Both APIs failed:', { local: error.message, prod: prodError.message });
        throw prodError;
      }
    }
  }

  async processQueue(token, error) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    
    this.failedQueue = [];
  }

  async refreshToken() {
    if (this.refreshing) {
      // If already refreshing, queue this request
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    this.refreshing = true;

    try {
      const response = await this.baseFetch('/api/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ sessionId: this.sessionId })
      });

      if (response.ok) {
        const data = await response.json();
        
        // With HTTP-only cookies, the new tokens are automatically set
        // We just need to update any client-side state if needed
        if (data.csrfToken) {
          this.csrfToken = data.csrfToken;
        }
        
        this.processQueue(true);
        
        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 Token refreshed successfully');
        }
        
        return true;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      this.processQueue(null, error);
      
      // Clear auth state and redirect to login
      this.clearAuth();
      throw error;
    } finally {
      this.refreshing = false;
    }
  }

  clearAuth() {
    // Clear any client-side auth state
    localStorage.removeItem('access_token'); // Legacy cleanup
    localStorage.removeItem('user_cache');
    this.csrfToken = null;
    
    // Trigger auth state update
    window.dispatchEvent(new CustomEvent('auth:logout'));
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🚪 Auth cleared, redirecting to login');
    }
    
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
  }

  async secureRequest(path, options = {}) {
    // Apply rate limiting
    const clientId = this.sessionId;
    if (!this.rateLimiter(clientId)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    try {
      let response = await this.baseFetch(path, options);

      // Handle 401 - Unauthorized (token expired)
      if (response.status === 401) {
        try {
          await this.refreshToken();
          // Retry the original request
          response = await this.baseFetch(path, options);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          throw refreshError;
        }
      }

      // Handle 403 - Forbidden (CSRF token invalid)
      if (response.status === 403) {
        const errorData = await response.clone().json().catch(() => ({}));
        if (errorData.code === 'CSRF_TOKEN_INVALID') {
          try {
            await this.initializeCsrfToken();
            // Retry with new CSRF token
            return this.baseFetch(path, {
              ...options,
              headers: {
                ...options.headers,
                'X-CSRF-Token': this.csrfToken
              }
            });
          } catch (csrfError) {
            console.error('CSRF token refresh failed:', csrfError);
          }
        }
      }

      // Handle other auth errors
      if (response.status === 401 || response.status === 403) {
        this.clearAuth();
        throw new Error('Authentication failed');
      }

      return response;
    } catch (error) {
      if (error.message.includes('Rate limit')) {
        throw error;
      }
      
      console.error('Secure request failed:', error);
      throw error;
    }
  }

  // Convenience methods
  async get(path, options = {}) {
    return this.secureRequest(path, { ...options, method: 'GET' });
  }

  async post(path, data, options = {}) {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.secureRequest(path, { 
      ...options, 
      method: 'POST', 
      body 
    });
  }

  async put(path, data, options = {}) {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.secureRequest(path, { 
      ...options, 
      method: 'PUT', 
      body 
    });
  }

  async delete(path, options = {}) {
    return this.secureRequest(path, { ...options, method: 'DELETE' });
  }

  async patch(path, data, options = {}) {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.secureRequest(path, { 
      ...options, 
      method: 'PATCH', 
      body 
    });
  }

  // File upload with progress tracking
  async uploadFile(path, file, onProgress = null, options = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add progress tracking if supported
    const xhr = new XMLHttpRequest();
    
    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = Math.round((e.loaded / e.total) * 100);
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (e) {
            resolve(xhr.responseText);
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed: Network error'));
      });

      // Set headers (excluding Content-Type for FormData)
      const token = localStorage.getItem('access_token');
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.setRequestHeader('X-Session-ID', this.sessionId);
      if (this.csrfToken) {
        xhr.setRequestHeader('X-CSRF-Token', this.csrfToken);
      }
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.withCredentials = true; // Include cookies
      
      // Try local first, then prod
      const url = `${LOCAL_API}${path}`;
      xhr.open('POST', url, true);
      xhr.send(formData);
    });
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.baseFetch('/api/health', {
        method: 'GET'
      });
      
      return {
        ok: response.ok,
        status: response.status,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Create singleton instance
const secureApiClient = new SecureApiClient();

// Legacy compatibility - gradually migrate from these
export const smartFetch = (path, options) => secureApiClient.secureRequest(path, options);

// Enhanced secure methods
export const secureGet = (path, options) => secureApiClient.get(path, options);
export const securePost = (path, data, options) => secureApiClient.post(path, data, options);
export const securePut = (path, data, options) => secureApiClient.put(path, data, options);
export const secureDelete = (path, options) => secureApiClient.delete(path, options);
export const securePatch = (path, data, options) => secureApiClient.patch(path, data, options);
export const uploadFile = (path, file, onProgress, options) => secureApiClient.uploadFile(path, file, onProgress, options);

// Blog-specific functions
export const saveBlogDraft = (data) =>
  secureApiClient.post('/api/blogs/autosave', data);

// Utility exports
export const clearAuth = () => secureApiClient.clearAuth();
export const healthCheck = () => secureApiClient.healthCheck();

export default secureApiClient;
