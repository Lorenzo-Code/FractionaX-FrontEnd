import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../shared/hooks';
import { smartFetch } from '../shared/utils';

const CoreLogicInsightsContext = createContext(null);

// FXCT Token-based Pricing Tiers
const FXCT_TIERS = {
  basic: {
    fxctCost: 10,
    name: "Basic Insights",
    description: "Essential property details and validation",
    benefits: [
      "Address validation and geocoding",
      "Basic property details (beds, baths, sqft)",
      "Property type and year built",
      "Market value estimate"
    ]
  },
  enhanced: {
    fxctCost: 25,
    name: "Enhanced Analysis", 
    description: "Comprehensive property and ownership data",
    benefits: [
      "Everything in Basic +",
      "Ownership details and history",
      "Tax assessment records",
      "Last market sale data",
      "Site location analysis"
    ]
  },
  comprehensive: {
    fxctCost: 50,
    name: "Comprehensive Intelligence",
    description: "Complete property investment analysis",
    benefits: [
      "Everything in Enhanced +",
      "Market comparables analysis",
      "3+ years sales history",
      "Investment ROI projections",
      "Neighborhood insights"
    ]
  }
};

export const CoreLogicInsightsProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [fxctBalance, setFxctBalance] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showFxctModal, setShowFxctModal] = useState(false);
  const [pendingInsightRequest, setPendingInsightRequest] = useState(null);
  const [confirmedInsightResult, setConfirmedInsightResult] = useState(null);

  // Fetch user's FXCT balance on mount and when user changes
  useEffect(() => {
    const fetchFxctBalance = async () => {
      if (!isAuthenticated || !user) {
        setFxctBalance(0);
        return;
      }

      try {
        const response = await smartFetch('/api/auth/user/balance');
        if (response.ok) {
          const data = await response.json();
          setFxctBalance(data.fxctBalance || 0);
        }
      } catch (error) {
        console.error('Failed to fetch FXCT balance:', error);
        setFxctBalance(0);
      }
    };

    fetchFxctBalance();
  }, [isAuthenticated, user]);

  // Check if user has sufficient FXCT for a tier
  const canAffordTier = useCallback((tier) => {
    if (!isAuthenticated) return false;
    const tierConfig = FXCT_TIERS[tier];
    return fxctBalance >= tierConfig.fxctCost;
  }, [isAuthenticated, fxctBalance]);

  // Get FXCT pricing for a tier
  const getTierPricing = useCallback((tier) => {
    return FXCT_TIERS[tier] || null;
  }, []);

  // Get all available tiers
  const getAvailableTiers = useCallback(() => {
    return Object.entries(FXCT_TIERS).map(([key, config]) => ({
      key,
      ...config,
      affordable: canAffordTier(key)
    }));
  }, [canAffordTier]);

  // Request enhanced property insights with FXCT
  const requestPropertyInsights = useCallback(async (propertyId, tier, address = null) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return { success: false, error: 'AUTHENTICATION_REQUIRED' };
    }

    const tierConfig = FXCT_TIERS[tier];
    if (!tierConfig) {
      return { success: false, error: 'INVALID_TIER' };
    }

    if (!canAffordTier(tier)) {
      return { 
        success: false, 
        error: 'INSUFFICIENT_FXCT',
        required: tierConfig.fxctCost,
        current: fxctBalance
      };
    }

    try {
      // First, get confirmation if needed
      const response = await smartFetch(`/api/ai/property-details-fxct/${propertyId}`, {
        method: 'POST',
        body: JSON.stringify({
          tier,
          confirmed: false,
          address,
          includeZillowEnrichment: true
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      // Handle confirmation requirement
      if (data.requiresConfirmation) {
        setPendingInsightRequest({
          propertyId,
          tier,
          address,
          confirmationData: data
        });
        setShowFxctModal(true);
        return { success: true, requiresConfirmation: true, confirmationData: data };
      }

      // If no confirmation needed, return the data
      return { success: true, data };

    } catch (error) {
      console.error('Failed to request property insights:', error);
      return { 
        success: false, 
        error: 'API_ERROR',
        message: error.message
      };
    }
  }, [isAuthenticated, fxctBalance, canAffordTier]);

  // Confirm and purchase property insights
  const confirmPropertyInsights = useCallback(async () => {
    if (!pendingInsightRequest) return { success: false, error: 'NO_PENDING_REQUEST' };

    try {
      const { propertyId, tier, address } = pendingInsightRequest;
      
      const response = await smartFetch(`/api/ai/property-details-fxct/${propertyId}/purchase`, {
        method: 'POST',
        body: JSON.stringify({
          tier,
          address,
          includeZillowEnrichment: true
        })
      });

      if (!response.ok) {
        throw new Error(`Purchase failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Update FXCT balance
      const tierConfig = FXCT_TIERS[tier];
      setFxctBalance(prev => prev - tierConfig.fxctCost);
      
      // Clear pending request
      setPendingInsightRequest(null);
      setShowFxctModal(false);
      
      return { success: true, data };

    } catch (error) {
      console.error('Failed to confirm property insights:', error);
      return { 
        success: false, 
        error: 'PURCHASE_FAILED',
        message: error.message
      };
    }
  }, [pendingInsightRequest]);

  // Cancel pending insight request
  const cancelPropertyInsights = useCallback(() => {
    setPendingInsightRequest(null);
    setShowFxctModal(false);
  }, []);

  const contextValue = {
    // FXCT Token System
    fxctBalance,
    tiers: FXCT_TIERS,
    canAffordTier,
    getTierPricing,
    getAvailableTiers,
    
    // Property Insights
    requestPropertyInsights,
    confirmPropertyInsights,
    cancelPropertyInsights,
    pendingInsightRequest,
    
    // Modal Management
    showLoginModal,
    setShowLoginModal,
    showFxctModal,
    setShowFxctModal,
    
    // Legacy compatibility
    isUnlimited: isAuthenticated,
    requiresLogin: () => !isAuthenticated
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
