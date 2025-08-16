import { useEffect, useState, useCallback, useRef } from "react";
import AuthContext from "./AuthContext";
import { generateSecureToken } from '../shared/utils/security';
import secureApiClient from '../shared/utils/secureApiClient';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId] = useState(() => generateSecureToken(32));
  const lastTokenCheck = useRef(null);
  const checkAuthInProgress = useRef(false);

  // Helper to sync user state with localStorage
  const syncUserState = useCallback((userData) => {
    console.log('👤 syncUserState called:', userData ? `User: ${userData.email} (${userData.role})` : 'Clearing user');
    if (userData) {
      localStorage.setItem('user_cache', JSON.stringify({
        ...userData,
        lastSync: Date.now(),
        sessionId
      }));
      setUser(userData);
      console.log('✅ User state set:', userData.email);
    } else {
      localStorage.removeItem('user_cache');
      setUser(null);
      console.log('🚪 User state cleared');
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

      // Check token expiration - only reject if actually expired
      const tokenExpiry = decoded.exp * 1000;
      const now = Date.now();
      const timeToExpiry = tokenExpiry - now;
      
      console.log('🔐 Token validation:', {
        email: decoded.email,
        expiresAt: new Date(tokenExpiry).toISOString(),
        timeToExpiryMinutes: Math.floor(timeToExpiry / (1000 * 60)),
        isValid: tokenExpiry > now
      });
      
      if (tokenExpiry <= now) {
        throw new Error(`Token expired at ${new Date(tokenExpiry).toISOString()}`);
      }

      return {
        valid: true,
        decoded,
        expiresAt: tokenExpiry
      };
    } catch (error) {
      console.error('❌ Token validation failed:', error.message);
      return {
        valid: false,
        error: error.message
      };
    }
  }, []);

  // Enhanced checkAuth with improved caching and error handling
  const checkAuth = useCallback(async (forceRefresh = false) => {
    // Prevent concurrent checks unless forcing refresh
    if (checkAuthInProgress.current && !forceRefresh) {
      return;
    }
    
    checkAuthInProgress.current = true;
    
    try {
      const token = localStorage.getItem("access_token");
      const cachedUser = localStorage.getItem('user_cache');
      
      // If no token, clear everything
      if (!token) {
        syncUserState(null);
        return;
      }

      // Validate the token client-side first
      const validation = validateToken(token);
      
      if (!validation.valid) {
        // Only clear if token is actually expired, not if backend is down
        if (validation.error.includes('expired')) {
          localStorage.removeItem('access_token');
          syncUserState(null);
        }
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
    } catch (error) {
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

  // Let the App component handle loading UI to prevent layout flash

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isLoading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
