import { useState, useEffect, useCallback } from 'react';
import homepageDataService from '../shared/services/homepageDataService';

/**
 * React hook for accessing and managing homepage data
 * Provides real-time updates when homepage data changes
 */
export const useHomepageData = () => {
  // Initialize with default data to prevent null errors
  const [data, setData] = useState(() => homepageDataService.getDefaultData());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize data and set up subscription
  useEffect(() => {
    let mounted = true;
    
    // Load initial data from API
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        const initialData = await homepageDataService.getHomepageData();
        
        if (mounted) {
          setData(initialData || homepageDataService.getDefaultData());
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
          setLoading(false);
          // Use fallback data on error
          const fallbackData = homepageDataService.getDefaultData();
          setData(fallbackData);
        }
      }
    };
    
    loadInitialData();

    // Subscribe to updates
    const unsubscribe = homepageDataService.subscribe((updatedData) => {
      if (mounted) {
        setData(updatedData || homepageDataService.getDefaultData());
        setError(null);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  // Helper methods (all async now)
  const updateMarketStats = useCallback(async (stats) => {
    try {
      setLoading(true);
      const success = await homepageDataService.updateMarketStats(stats);
      if (success) {
        const updatedData = await homepageDataService.getHomepageData();
        setData(updatedData);
      }
      return success;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCommunityStats = useCallback(async (stats) => {
    try {
      setLoading(true);
      const success = await homepageDataService.updateCommunityStats(stats);
      if (success) {
        const updatedData = await homepageDataService.getHomepageData();
        setData(updatedData);
      }
      return success;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFeaturedProperty = useCallback(async (property) => {
    try {
      setLoading(true);
      const success = await homepageDataService.updateFeaturedProperty(property);
      if (success) {
        const updatedData = await homepageDataService.getHomepageData();
        setData(updatedData);
      }
      return success;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTestimonials = useCallback(async (testimonials) => {
    try {
      setLoading(true);
      const success = await homepageDataService.updateTestimonials(testimonials);
      if (success) {
        const updatedData = await homepageDataService.getHomepageData();
        setData(updatedData);
      }
      return success;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePlatformSettings = useCallback(async (settings) => {
    try {
      setLoading(true);
      const success = await homepageDataService.updatePlatformSettings(settings);
      if (success) {
        const updatedData = await homepageDataService.getHomepageData();
        setData(updatedData);
      }
      return success;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const addTestimonial = useCallback(async (testimonial) => {
    try {
      setLoading(true);
      const newTestimonial = await homepageDataService.addTestimonial(testimonial);
      if (newTestimonial) {
        const updatedData = await homepageDataService.getHomepageData();
        setData(updatedData);
      }
      return newTestimonial;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeTestimonial = useCallback(async (testimonialId) => {
    try {
      setLoading(true);
      const success = await homepageDataService.removeTestimonial(testimonialId);
      if (success) {
        const updatedData = await homepageDataService.getHomepageData();
        setData(updatedData);
      }
      return success;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const refreshedData = await homepageDataService.refreshData();
      if (refreshedData) {
        setData(refreshedData);
      }
      return refreshedData;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const exportData = useCallback(async () => {
    try {
      return await homepageDataService.exportData();
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, []);

  const importData = useCallback(async (externalData) => {
    try {
      setLoading(true);
      const success = await homepageDataService.importData(externalData);
      if (success) {
        const updatedData = await homepageDataService.getHomepageData();
        setData(updatedData);
      }
      return success;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(async () => {
    try {
      setLoading(true);
      const success = await homepageDataService.clearData();
      if (success) {
        const updatedData = await homepageDataService.getHomepageData();
        setData(updatedData);
      }
      return success;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Live data control methods
  const toggleAutoRefresh = useCallback((enabled) => {
    homepageDataService.setAutoRefreshEnabled(enabled);
  }, []);
  
  const setRefreshInterval = useCallback((seconds) => {
    homepageDataService.setAutoRefreshInterval(seconds);
  }, []);
  
  const toggleSectionOverride = useCallback(async (section, isOverridden) => {
    try {
      setLoading(true);
      const success = await homepageDataService.setOverride(section, isOverridden);
      if (success) {
        const updatedData = await homepageDataService.getHomepageData();
        setData(updatedData);
        if (!isOverridden) {
          // If disabling override, fetch live data immediately
          await homepageDataService.fetchLiveData();
        }
      }
      return success;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const resetAllOverrides = useCallback(async () => {
    try {
      setLoading(true);
      const success = await homepageDataService.resetAllOverrides();
      if (success) {
        const updatedData = await homepageDataService.getHomepageData();
        setData(updatedData);
      }
      return success;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const forceLiveDataUpdate = useCallback(async () => {
    return await homepageDataService.fetchLiveData();
  }, []);
  
  const fetchOverrideStatus = useCallback(async () => {
    try {
      const overrides = await homepageDataService.fetchOverrideStatus();
      return overrides;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, []);

  return {
    // Data
    data,
    marketStats: data.marketStats || {},
    communityStats: data.communityStats || {},
    protocolStats: data.protocolStats || {},
    featuredProperty: data.featuredProperty || {},
    testimonials: data.testimonials || [],
    heroSection: data.heroSection || {},
    socialProof: data.socialProof || {},
    platformSettings: data.config || {},
    loading,
    error,

    // Actions
    updateMarketStats,
    updateCommunityStats,
    updateFeaturedProperty,
    updateTestimonials,
    updatePlatformSettings,
    addTestimonial,
    removeTestimonial,
    refreshData,
    exportData,
    importData,
    clearData,
    
    // Live data controls
    toggleAutoRefresh,
    setRefreshInterval,
    toggleSectionOverride,
    resetAllOverrides,
    forceLiveDataUpdate,
    fetchOverrideStatus,
    
    // Status getters
    getOverrideStatus: homepageDataService.getOverrideStatus.bind(homepageDataService),
    getAutoRefreshStatus: homepageDataService.getAutoRefreshStatus.bind(homepageDataService),

    // Utility
    hasAdminAccess: homepageDataService.hasAdminAccess(),
    
    // Service access (for advanced usage)
    service: homepageDataService
  };
};

/**
 * Hook specifically for public homepage components
 * Returns only the data needed for display
 */
export const useHomepageDisplay = () => {
  const {
    marketStats,
    communityStats,
    protocolStats,
    featuredProperty,
    testimonials,
    heroSection,
    socialProof,
    platformSettings,
    loading,
    error,
    getOverrideStatus
  } = useHomepageData();
  
  // Get override statuses for all sections
  const overrideStatuses = getOverrideStatus();

  // Format data for display
  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return '$0';
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    }
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount?.toLocaleString() || '0'}`;
  };

  const formatNumber = (num) => {
    if (!num || num === 0) return '0';
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1)}B`;
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num?.toLocaleString() || '0';
  };

  const formattedMarketStats = {
    ...marketStats,
    totalVolumeFormatted: formatCurrency(marketStats.totalVolume),
    totalInvestorsFormatted: formatNumber(marketStats.totalInvestors),
    marketCapFormatted: formatCurrency(marketStats.marketCap),
    averageRoiFormatted: `${marketStats.averageRoi || 0}%`
  };

  const formattedCommunityStats = {
    ...communityStats,
    // Map backend fields to frontend display fields for backward compatibility
    activeInvestors: communityStats.activeUsers || communityStats.activeInvestors || 0,
    totalInvested: communityStats.totalUsers || communityStats.totalInvested || 0,
    propertiesFunded: communityStats.verifiedUsers || communityStats.propertiesFunded || 0,
    avgAnnualReturn: communityStats.communityGrowth || communityStats.avgAnnualReturn || 0,
    // Formatted versions
    activeInvestorsFormatted: formatNumber(communityStats.activeUsers || communityStats.activeInvestors || 0),
    totalInvestedFormatted: formatNumber(communityStats.totalUsers || communityStats.totalInvested || 0),
    propertiesFundedFormatted: formatNumber(communityStats.verifiedUsers || communityStats.propertiesFunded || 0),
    avgAnnualReturnFormatted: `${communityStats.communityGrowth || communityStats.avgAnnualReturn || 0}%`
  };

  const formattedProtocolStats = {
    ...protocolStats,
    totalValueLockedFormatted: formatCurrency(protocolStats.totalValueLocked),
    transactionVolume24hFormatted: formatCurrency(protocolStats.transactionVolume24h),
    activeContractsFormatted: formatNumber(protocolStats.activeContracts),
    totalTokensFormatted: formatNumber(protocolStats.totalTokens)
  };

  // Only show active testimonials
  const enabledTestimonials = testimonials.filter(t => t.active !== false);

  return {
    marketStats: formattedMarketStats,
    communityStats: formattedCommunityStats,
    protocolStats: formattedProtocolStats,
    featuredProperty,
    testimonials: enabledTestimonials,
    heroSection,
    socialProof,
    platformSettings,
    loading,
    error,
    
    // Override status information
    overrideStatuses,
    
    // Live data status helpers
    isLiveData: {
      marketStats: !overrideStatuses.marketStats,
      communityStats: !overrideStatuses.communityStats,
      protocolStats: true, // Always live
      featuredProperty: !overrideStatuses.featuredProperty,
      testimonials: !overrideStatuses.testimonials,
      config: !overrideStatuses.config
    },
    
    // Utility functions
    formatCurrency,
    formatNumber
  };
};

export default useHomepageData;
