import { useEffect, useState, useCallback, useRef } from "react";
import AuthContext from "./AuthContext";
import { generateSecureToken } from '../utils/security';
import secureApiClient from '../utils/secureApiClient';
import { SECURITY_CONFIG } from '../config/security';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId] = useState(() => generateSecureToken(32));
  const lastTokenCheck = useRef(null);
  const checkAuthInProgress = useRef(false);

  // Helper to sync user state with localStorage
  const syncUserState = useCallback((userData) => {
    if (userData) {
      localStorage.setItem('user_cache', JSON.stringify({
        ...userData,
        lastSync: Date.now(),
        sessionId
      }));
      setUser(userData);
    } else {
      localStorage.removeItem('user_cache');
      setUser(null);
    }
  }, [sessionId]);

  // Enhanced token validation with better error handling
  const validateToken = useCallback((token) => {
    try {
      if (!token || typeof token !== 'string') {
        throw new Error('Token is missing or invalid type');
      }

      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format - must have 3 parts');
      }

      // Validate base64 encoding
      let decoded;
      try {
        decoded = JSON.parse(atob(parts[1]));
      } catch (e) {
        throw new Error('Invalid base64 encoding in token payload');
      }

      // Validate required fields
      if (!decoded.email || !decoded.exp) {
        throw new Error('Token missing required fields (email, exp)');
      }

      // Check token expiration with buffer (5 minutes before actual expiry)
      const expirationBuffer = 5 * 60 * 1000; // 5 minutes in milliseconds
      const tokenExpiry = decoded.exp * 1000;
      const now = Date.now();
      
      if (tokenExpiry - expirationBuffer <= now) {
        const isExpired = tokenExpiry <= now;
        throw new Error(`Token ${isExpired ? 'expired' : 'expires soon'} at ${new Date(tokenExpiry).toISOString()}`);
      }

      return {
        valid: true,
        decoded,
        expiresAt: tokenExpiry
      };
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Token validation failed:', error.message);
      }
      return {
        valid: false,
        error: error.message
      };
    }
  }, []);

  // Enhanced checkAuth with improved caching and error handling
  const checkAuth = useCallback(async () => {
    // Prevent concurrent checks
    if (checkAuthInProgress.current) {
      return;
    }
    
    checkAuthInProgress.current = true;
    
    try {
      const token = localStorage.getItem("access_token");
      const cachedUser = localStorage.getItem('user_cache');
      
      // If no token, clear everything
      if (!token) {
        if (process.env.NODE_ENV === 'development') {
          console.log('No access token found, clearing auth state');
        }
        syncUserState(null);
        return;
      }

      // Validate the token
      const validation = validateToken(token);
      
      if (!validation.valid) {
        console.warn('Token validation failed:', validation.error);
        // Clear invalid token and user data
        localStorage.removeItem('access_token');
        syncUserState(null);
        return;
      }

      const { decoded, expiresAt } = validation;

      // Try to use cached user data if it's recent and from same session
      if (cachedUser && lastTokenCheck.current && 
          Date.now() - lastTokenCheck.current < 60000) { // 1 minute cache
        try {
          const cached = JSON.parse(cachedUser);
          if (cached.sessionId === sessionId && 
              cached.email === decoded.email &&
              Date.now() - cached.lastSync < 300000) { // 5 minute cache validity
            setUser(cached);
            lastTokenCheck.current = Date.now();
            return;
          }
        } catch (e) {
          // Invalid cached data, proceed with fresh validation
          if (process.env.NODE_ENV === 'development') {
            console.warn('Invalid cached user data, refreshing:', e.message);
          }
        }
      }

      // Create user object from valid token
      const userData = {
        email: decoded.email,
        role: decoded.role || 'user',
        id: decoded._id || decoded.id || decoded.sub,
        name: decoded.name,
        exp: decoded.exp,
        iat: decoded.iat,
        // Include other relevant decoded fields
        ...Object.fromEntries(
          Object.entries(decoded).filter(([key]) => 
            !['exp', 'iat', 'iss', 'aud'].includes(key)
          )
        )
      };

      syncUserState(userData);
      lastTokenCheck.current = Date.now();

      // Enhanced logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ User authenticated successfully:', {
          email: userData.email,
          role: userData.role,
          id: userData.id,
          expiresAt: new Date(expiresAt).toISOString(),
          timeUntilExpiry: Math.round((expiresAt - Date.now()) / 1000 / 60) + ' minutes'
        });
      }
    } catch (error) {
      console.error('❌ Authentication check failed:', error);
      // Clear potentially corrupted data
      localStorage.removeItem('access_token');
      syncUserState(null);
    } finally {
      checkAuthInProgress.current = false;
    }
  }, [validateToken, syncUserState, sessionId]);

  // Initialize authentication on mount
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setIsLoading(false);
    };

    initAuth();
  }, [checkAuth]);

  // Enhanced storage event handler
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Handle token changes from other tabs
      if (e.key === 'access_token') {
        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 Token changed in another tab, re-checking auth');
        }
        checkAuth();
      }
      // Handle user cache changes
      else if (e.key === 'user_cache' && !e.newValue) {
        // User cache was cleared in another tab
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [checkAuth]);

  // Enhanced logout with proper cleanup
  const logout = useCallback((redirectTo = '/') => {
    // Defensive check: if redirectTo is an event object, use default path
    if (typeof redirectTo === 'object' && redirectTo !== null) {
      redirectTo = '/';
    }
    
    try {
      // Clear all auth-related data
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_cache');
      
      // Clear any other app-specific data if needed
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('auth_') || key.startsWith('user_'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      setUser(null);
      lastTokenCheck.current = null;
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🚪 User logged out, cleared auth data');
      }
      
      // Redirect with a small delay to ensure state is updated
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 100);
    } catch (error) {
      console.error('Error during logout:', error);
      // Force redirect even if cleanup fails
      window.location.href = redirectTo;
    }
  }, []);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
