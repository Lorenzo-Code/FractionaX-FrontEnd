/**
 * Security Middleware Hook
 * Provides comprehensive security features for React components
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkSecurityThreats, createRateLimiter } from '../utils/security';
import secureApiClient from '../utils/secureApiClient';

// Session monitoring
const SESSION_CHECK_INTERVAL = 30000; // 30 seconds
const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const SESSION_WARNING_TIME = 5 * 60 * 1000; // 5 minutes before timeout

export const useSecurity = (options = {}) => {
  const {
    requireAuth = false,
    allowedRoles = [],
    enableSessionMonitoring = true,
    enableIdleTimeout = true,
    enableSecurityLogging = process.env.NODE_ENV === 'development'
  } = options;

  const navigate = useNavigate();
  const [securityState, setSecurityState] = useState({
    isSecure: true,
    threats: [],
    sessionValid: true,
    timeUntilExpiry: null,
    isIdle: false,
    showSessionWarning: false
  });

  const lastActivity = useRef(Date.now());
  const sessionCheckInterval = useRef(null);
  const idleCheckInterval = useRef(null);
  const warningTimeout = useRef(null);
  const rateLimiter = useRef(createRateLimiter(50, 60000)); // 50 actions per minute

  // Activity tracking
  const trackActivity = useCallback(() => {
    lastActivity.current = Date.now();
    setSecurityState(prev => ({ ...prev, isIdle: false, showSessionWarning: false }));
    
    if (warningTimeout.current) {
      clearTimeout(warningTimeout.current);
      warningTimeout.current = null;
    }
  }, []);

  // Security threat validation
  const validateInput = useCallback((input, context = 'general') => {
    const threat = checkSecurityThreats(input);
    
    if (!threat.safe) {
      setSecurityState(prev => ({
        ...prev,
        isSecure: false,
        threats: [...prev.threats, { context, threats: threat.threats, timestamp: Date.now() }]
      }));
      
      if (enableSecurityLogging) {
        console.warn(`🚨 Security threat detected in ${context}:`, threat.threats);
      }
      
      return false;
    }
    
    return true;
  }, [enableSecurityLogging]);

  // Rate limiting check
  const checkRateLimit = useCallback((identifier = 'default') => {
    const allowed = rateLimiter.current(identifier);
    
    if (!allowed) {
      setSecurityState(prev => ({
        ...prev,
        threats: [...prev.threats, { 
          context: 'rate_limit', 
          threats: ['RATE_LIMIT_EXCEEDED'], 
          timestamp: Date.now() 
        }]
      }));
      
      if (enableSecurityLogging) {
        console.warn('🚨 Rate limit exceeded for:', identifier);
      }
    }
    
    return allowed;
  }, [enableSecurityLogging]);

  // Session validation
  const validateSession = useCallback(async () => {
    try {
      const response = await secureApiClient.get('/api/auth/session-check');
      
      if (response.ok) {
        const data = await response.json();
        
        setSecurityState(prev => ({
          ...prev,
          sessionValid: true,
          timeUntilExpiry: data.expiresIn
        }));
        
        // Check if session expires soon
        if (data.expiresIn && data.expiresIn < SESSION_WARNING_TIME) {
          setSecurityState(prev => ({ ...prev, showSessionWarning: true }));
          
          if (enableSecurityLogging) {
            console.warn('⚠️ Session expires soon:', Math.round(data.expiresIn / 1000 / 60), 'minutes');
          }
        }
        
        return true;
      } else {
        throw new Error('Session validation failed');
      }
    } catch (error) {
      setSecurityState(prev => ({
        ...prev,
        sessionValid: false,
        timeUntilExpiry: null
      }));
      
      if (requireAuth) {
        if (enableSecurityLogging) {
          console.warn('🚨 Session invalid, redirecting to login');
        }
        navigate('/login');
      }
      
      return false;
    }
  }, [requireAuth, navigate, enableSecurityLogging]);

  // Idle timeout check
  const checkIdleTimeout = useCallback(() => {
    const now = Date.now();
    const timeSinceActivity = now - lastActivity.current;
    
    if (timeSinceActivity > IDLE_TIMEOUT) {
      setSecurityState(prev => ({ ...prev, isIdle: true }));
      
      // Auto-logout after idle timeout
      secureApiClient.clearAuth();
      
      if (enableSecurityLogging) {
        console.warn('🚨 User idle timeout, logging out');
      }
      
      navigate('/login');
    } else if (timeSinceActivity > IDLE_TIMEOUT - SESSION_WARNING_TIME) {
      // Show warning before timeout
      if (!warningTimeout.current) {
        setSecurityState(prev => ({ ...prev, showSessionWarning: true }));
        
        warningTimeout.current = setTimeout(() => {
          setSecurityState(prev => ({ ...prev, isIdle: true }));
          secureApiClient.clearAuth();
          navigate('/login');
        }, SESSION_WARNING_TIME);
      }
    }
  }, [navigate, enableSecurityLogging]);

  // Initialize security monitoring
  useEffect(() => {
    if (enableSessionMonitoring) {
      // Initial session check
      validateSession();
      
      // Periodic session validation
      sessionCheckInterval.current = setInterval(validateSession, SESSION_CHECK_INTERVAL);
    }
    
    if (enableIdleTimeout) {
      // Activity listeners
      const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      
      activityEvents.forEach(event => {
        document.addEventListener(event, trackActivity, { passive: true });
      });
      
      // Idle timeout check
      idleCheckInterval.current = setInterval(checkIdleTimeout, 60000); // Check every minute
    }
    
    // Listen for auth events
    const handleAuthLogout = () => {
      setSecurityState(prev => ({ ...prev, sessionValid: false }));
    };
    
    window.addEventListener('auth:logout', handleAuthLogout);
    
    return () => {
      if (sessionCheckInterval.current) {
        clearInterval(sessionCheckInterval.current);
      }
      
      if (idleCheckInterval.current) {
        clearInterval(idleCheckInterval.current);
      }
      
      if (warningTimeout.current) {
        clearTimeout(warningTimeout.current);
      }
      
      if (enableIdleTimeout) {
        const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        activityEvents.forEach(event => {
          document.removeEventListener(event, trackActivity);
        });
      }
      
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, [enableSessionMonitoring, enableIdleTimeout, validateSession, trackActivity, checkIdleTimeout]);

  // Security actions
  const securityActions = {
    // Extend session
    extendSession: useCallback(async () => {
      try {
        const response = await secureApiClient.post('/api/auth/extend-session');
        
        if (response.ok) {
          trackActivity(); // Reset idle timer
          setSecurityState(prev => ({ ...prev, showSessionWarning: false }));
          
          if (enableSecurityLogging) {
            console.log('✅ Session extended successfully');
          }
          
          return true;
        }
        
        return false;
      } catch (error) {
        console.error('Failed to extend session:', error);
        return false;
      }
    }, [trackActivity, enableSecurityLogging]),

    // Force logout
    forceLogout: useCallback(() => {
      secureApiClient.clearAuth();
      navigate('/login');
    }, [navigate]),

    // Clear security threats
    clearThreats: useCallback(() => {
      setSecurityState(prev => ({
        ...prev,
        isSecure: true,
        threats: []
      }));
    }, []),

    // Manual session refresh
    refreshSession: useCallback(() => {
      return validateSession();
    }, [validateSession])
  };

  return {
    // State
    securityState,
    
    // Validation functions
    validateInput,
    checkRateLimit,
    
    // Actions
    ...securityActions,
    
    // Utilities
    trackActivity,
    
    // Security info
    isSecure: securityState.isSecure && securityState.sessionValid,
    hasThreats: securityState.threats.length > 0,
    sessionTimeRemaining: securityState.timeUntilExpiry
  };
};

// Higher-order component for route protection
export const withSecurity = (Component, securityOptions = {}) => {
  return function SecurityWrappedComponent(props) {
    const security = useSecurity(securityOptions);
    
    // Block render if security requirements not met
    if (securityOptions.requireAuth && !security.securityState.sessionValid) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Validating security...</p>
          </div>
        </div>
      );
    }
    
    return <Component {...props} security={security} />;
  };
};

// Security context provider
export const SecurityProvider = ({ children }) => {
  const security = useSecurity({
    requireAuth: false,
    enableSessionMonitoring: true,
    enableIdleTimeout: true
  });
  
  return (
    <SecurityContext.Provider value={security}>
      {children}
      
      {/* Session warning modal */}
      {security.securityState.showSessionWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Session Expiring Soon
            </h3>
            <p className="text-gray-600 mb-4">
              Your session will expire in {Math.round((security.securityState.timeUntilExpiry || 0) / 1000 / 60)} minutes. 
              Would you like to extend it?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={security.extendSession}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Extend Session
              </button>
              <button
                onClick={security.forceLogout}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </SecurityContext.Provider>
  );
};

// Security context
import { createContext, useContext } from 'react';

const SecurityContext = createContext(null);

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within a SecurityProvider');
  }
  return context;
};

export default useSecurity;
