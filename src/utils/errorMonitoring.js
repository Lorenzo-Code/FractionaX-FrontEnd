// Error monitoring utility for FractionaX platform
// Integrates with Sentry, LogRocket, and custom error tracking

class ErrorMonitoring {
  constructor() {
    this.isInitialized = false;
    this.userId = null;
    this.sessionId = null;
    this.providers = [];
    this.errorQueue = [];
    this.maxQueueSize = 100;
  }

  // Initialize error monitoring
  init(config = {}) {
    if (this.isInitialized) return;

    // Initialize Sentry
    if (config.sentry?.dsn) {
      this.initSentry(config.sentry);
    }

    // Initialize LogRocket
    if (config.logRocket?.appId) {
      this.initLogRocket(config.logRocket);
    }

    // Initialize custom error tracking
    if (config.custom?.endpoint) {
      this.initCustomErrorTracking(config.custom);
    }

    // Set up global error handlers
    this.setupGlobalErrorHandlers();

    // Set up unhandled promise rejection handler
    this.setupUnhandledRejectionHandler();

    // Set up performance monitoring
    this.setupPerformanceMonitoring();

    this.isInitialized = true;
  }

  // Initialize Sentry
  initSentry(config) {
    try {
      // In a real implementation, you'd load Sentry SDK
      // For now, we'll simulate the API
      this.sentry = {
        captureException: (error, context) => {
          console.error('Sentry captureException:', error, context);
        },
        captureMessage: (message, level, context) => {
          console.log('Sentry captureMessage:', message, level, context);
        },
        setUser: (user) => {
          console.log('Sentry setUser:', user);
        },
        setTag: (key, value) => {
          console.log('Sentry setTag:', key, value);
        },
        setContext: (name, context) => {
          console.log('Sentry setContext:', name, context);
        },
        addBreadcrumb: (breadcrumb) => {
          console.log('Sentry addBreadcrumb:', breadcrumb);
        }
      };

      this.providers.push({ name: 'sentry', enabled: true });
    } catch (error) {
      console.error('Failed to initialize Sentry:', error);
    }
  }

  // Initialize LogRocket
  initLogRocket(config) {
    try {
      // In a real implementation, you'd load LogRocket SDK
      this.logRocket = {
        init: (appId) => {
          console.log('LogRocket init:', appId);
        },
        identify: (userId, userInfo) => {
          console.log('LogRocket identify:', userId, userInfo);
        },
        captureException: (error) => {
          console.log('LogRocket captureException:', error);
        }
      };

      this.logRocket.init(config.appId);
      this.providers.push({ name: 'logRocket', enabled: true });
    } catch (error) {
      console.error('Failed to initialize LogRocket:', error);
    }
  }

  // Initialize custom error tracking
  initCustomErrorTracking(config) {
    this.customEndpoint = config.endpoint;
    this.customHeaders = config.headers || {};
    this.providers.push({ name: 'custom', enabled: true });
  }

  // Set up global error handlers
  setupGlobalErrorHandlers() {
    window.addEventListener('error', (event) => {
      this.captureError(event.error || new Error(event.message), {
        type: 'javascript_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });
  }

  // Set up unhandled promise rejection handler
  setupUnhandledRejectionHandler() {
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(event.reason, {
        type: 'unhandled_promise_rejection',
        promise: event.promise
      });
    });
  }

  // Set up performance monitoring
  setupPerformanceMonitoring() {
    // Monitor slow operations
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      try {
        const response = await originalFetch(...args);
        const duration = performance.now() - startTime;
        
        if (duration > 5000) { // Log slow requests (>5s)
          this.captureMessage(`Slow API request: ${args[0]}`, 'warning', {
            duration,
            url: args[0],
            status: response.status
          });
        }
        
        return response;
      } catch (error) {
        const duration = performance.now() - startTime;
        this.captureError(error, {
          type: 'fetch_error',
          url: args[0],
          duration
        });
        throw error;
      }
    };

    // Monitor memory usage
    if ('memory' in performance) {
      setInterval(() => {
        const memory = performance.memory;
        if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
          this.captureMessage('High memory usage detected', 'warning', {
            usedJSHeapSize: memory.usedJSHeapSize,
            jsHeapSizeLimit: memory.jsHeapSizeLimit,
            totalJSHeapSize: memory.totalJSHeapSize
          });
        }
      }, 30000); // Check every 30 seconds
    }
  }

  // Set user context
  setUser(userId, userInfo = {}) {
    this.userId = userId;

    // Sentry
    if (this.sentry) {
      this.sentry.setUser({
        id: userId,
        ...userInfo
      });
    }

    // LogRocket
    if (this.logRocket) {
      this.logRocket.identify(userId, userInfo);
    }
  }

  // Set session context
  setSession(sessionId, sessionInfo = {}) {
    this.sessionId = sessionId;

    if (this.sentry) {
      this.sentry.setContext('session', {
        id: sessionId,
        ...sessionInfo
      });
    }
  }

  // Add contextual information
  setContext(name, context) {
    if (this.sentry) {
      this.sentry.setContext(name, context);
    }
  }

  // Add breadcrumb for debugging
  addBreadcrumb(message, category = 'default', level = 'info', data = {}) {
    const breadcrumb = {
      message,
      category,
      level,
      timestamp: new Date().toISOString(),
      data
    };

    if (this.sentry) {
      this.sentry.addBreadcrumb(breadcrumb);
    }

    // Store in local queue for custom tracking
    this.errorQueue.push({
      type: 'breadcrumb',
      ...breadcrumb
    });

    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }
  }

  // Capture errors
  captureError(error, context = {}) {
    const errorInfo = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      context: {
        timestamp: new Date().toISOString(),
        userId: this.userId,
        sessionId: this.sessionId,
        userAgent: navigator.userAgent,
        url: window.location.href,
        ...context
      }
    };

    // Sentry
    if (this.sentry) {
      this.sentry.captureException(error, context);
    }

    // LogRocket
    if (this.logRocket) {
      this.logRocket.captureException(error);
    }

    // Custom error tracking
    this.sendCustomError('error', errorInfo);

    // Add to local queue
    this.errorQueue.push({
      type: 'error',
      ...errorInfo
    });

    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }
  }

  // Capture messages
  captureMessage(message, level = 'info', context = {}) {
    const messageInfo = {
      message,
      level,
      context: {
        timestamp: new Date().toISOString(),
        userId: this.userId,
        sessionId: this.sessionId,
        url: window.location.href,
        ...context
      }
    };

    // Sentry
    if (this.sentry) {
      this.sentry.captureMessage(message, level, context);
    }

    // Custom error tracking
    this.sendCustomError('message', messageInfo);
  }

  // Capture component errors (for React Error Boundaries)
  captureComponentError(error, errorInfo, componentStack) {
    this.captureError(error, {
      type: 'react_component_error',
      componentStack,
      errorInfo
    });
  }

  // Track property-specific errors
  capturePropertyError(error, propertyId, action, context = {}) {
    this.captureError(error, {
      type: 'property_error',
      propertyId,
      action,
      ...context
    });
  }

  // Track API errors
  captureAPIError(error, endpoint, method, status, context = {}) {
    this.captureError(error, {
      type: 'api_error',
      endpoint,
      method,
      status,
      ...context
    });
  }

  // Send custom error tracking
  async sendCustomError(type, errorData) {
    if (!this.customEndpoint) return;

    try {
      await fetch(this.customEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.customHeaders
        },
        body: JSON.stringify({
          type,
          data: errorData,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to send custom error:', error);
    }
  }

  // Get error queue for debugging
  getErrorQueue() {
    return [...this.errorQueue];
  }

  // Clear error queue
  clearErrorQueue() {
    this.errorQueue = [];
  }

  // Get monitoring status
  getStatus() {
    return {
      initialized: this.isInitialized,
      providers: this.providers,
      userId: this.userId,
      sessionId: this.sessionId,
      queueSize: this.errorQueue.length
    };
  }
}

// Create singleton instance
const errorMonitoring = new ErrorMonitoring();

// Export functions
export const initErrorMonitoring = (config) => errorMonitoring.init(config);
export const setUser = (userId, userInfo) => errorMonitoring.setUser(userId, userInfo);
export const setSession = (sessionId, sessionInfo) => errorMonitoring.setSession(sessionId, sessionInfo);
export const setContext = (name, context) => errorMonitoring.setContext(name, context);
export const addBreadcrumb = (message, category, level, data) => errorMonitoring.addBreadcrumb(message, category, level, data);
export const captureError = (error, context) => errorMonitoring.captureError(error, context);
export const captureMessage = (message, level, context) => errorMonitoring.captureMessage(message, level, context);
export const captureComponentError = (error, errorInfo, componentStack) => errorMonitoring.captureComponentError(error, errorInfo, componentStack);
export const capturePropertyError = (error, propertyId, action, context) => errorMonitoring.capturePropertyError(error, propertyId, action, context);
export const captureAPIError = (error, endpoint, method, status, context) => errorMonitoring.captureAPIError(error, endpoint, method, status, context);
export const getErrorQueue = () => errorMonitoring.getErrorQueue();
export const clearErrorQueue = () => errorMonitoring.clearErrorQueue();
export const getMonitoringStatus = () => errorMonitoring.getStatus();

export default errorMonitoring;
