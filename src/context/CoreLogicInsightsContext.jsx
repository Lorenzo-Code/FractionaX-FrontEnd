import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../shared/hooks';

const CoreLogicInsightsContext = createContext(null);

const STORAGE_KEY = 'fractionax_corelogic_insights';
// TESTING MODE: Limits temporarily disabled
const FREE_USER_LIMIT = 999999; // Set to a very high number for testing

export const CoreLogicInsightsProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [insightCount, setInsightCount] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Initialize insight count from localStorage on mount
  useEffect(() => {
    // TESTING MODE: Clear any existing limits on mount
    localStorage.removeItem(STORAGE_KEY);
    setInsightCount(0);
    
    // const storedData = localStorage.getItem(STORAGE_KEY);
    // if (storedData) {
    //   try {
    //     const { count, timestamp } = JSON.parse(storedData);
    //     // Reset count if it's a new day (optional - can be removed if you want persistent limits)
    //     const today = new Date().toDateString();
    //     const storedDate = new Date(timestamp).toDateString();
    //     
    //     if (today === storedDate) {
    //       setInsightCount(count);
    //     } else {
    //       // New day, reset count
    //       setInsightCount(0);
    //       localStorage.removeItem(STORAGE_KEY);
    //     }
    //   } catch (error) {
    //     console.error('Error parsing stored CoreLogic insights data:', error);
    //     localStorage.removeItem(STORAGE_KEY);
    //   }
    // }
  }, []);

  // Reset insight count when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      setInsightCount(0);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [isAuthenticated, user]);

  // Persist insight count to localStorage
  const persistCount = useCallback((count) => {
    if (!isAuthenticated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        count,
        timestamp: new Date().toISOString()
      }));
    }
  }, [isAuthenticated]);

  // Check if user can view more insights
  const canViewInsight = useCallback(() => {
    if (isAuthenticated) {
      return true; // Authenticated users have unlimited access
    }
    return insightCount < FREE_USER_LIMIT;
  }, [isAuthenticated, insightCount]);

  // Get remaining insights for free users
  const getRemainingInsights = useCallback(() => {
    if (isAuthenticated) {
      return null; // Unlimited for authenticated users
    }
    return Math.max(0, FREE_USER_LIMIT - insightCount);
  }, [isAuthenticated, insightCount]);

  // Check if user needs to log in
  const requiresLogin = useCallback(() => {
    return !isAuthenticated && insightCount >= FREE_USER_LIMIT;
  }, [isAuthenticated, insightCount]);

  // Increment insight count and trigger login modal if needed
  const viewInsight = useCallback(() => {
    if (isAuthenticated) {
      return true; // Allow unlimited access for authenticated users
    }

    if (insightCount >= FREE_USER_LIMIT) {
      setShowLoginModal(true);
      return false;
    }

    const newCount = insightCount + 1;
    setInsightCount(newCount);
    persistCount(newCount);

    // Show login modal if this was the last free insight
    if (newCount >= FREE_USER_LIMIT) {
      setTimeout(() => setShowLoginModal(true), 500); // Small delay to show the insight first
    }

    return true;
  }, [isAuthenticated, insightCount, persistCount]);

  // Reset insight count (admin function)
  const resetInsightCount = useCallback(() => {
    setInsightCount(0);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const contextValue = {
    insightCount,
    freeUserLimit: FREE_USER_LIMIT,
    canViewInsight,
    viewInsight,
    getRemainingInsights,
    requiresLogin,
    resetInsightCount,
    showLoginModal,
    setShowLoginModal,
    isUnlimited: isAuthenticated
  };

  return (
    <CoreLogicInsightsContext.Provider value={contextValue}>
      {children}
    </CoreLogicInsightsContext.Provider>
  );
};

export const useCoreLogicInsights = () => {
  const context = useContext(CoreLogicInsightsContext);
  if (!context) {
    throw new Error('useCoreLogicInsights must be used within a CoreLogicInsightsProvider');
  }
  return context;
};

export default CoreLogicInsightsContext;
