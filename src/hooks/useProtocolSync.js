import { useState, useEffect, useCallback } from 'react';
import protocolSyncService from '../shared/services/protocolSyncService';

/**
 * React hook for accessing and managing protocol data
 * Provides real-time updates when protocol data changes
 */
export const useProtocolSync = () => {
  const [protocols, setProtocols] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Initialize data and set up subscription
  useEffect(() => {
    // Load initial data
    const initialProtocols = protocolSyncService.getProtocols();
    const initialStats = protocolSyncService.getStats();
    
    setProtocols(initialProtocols);
    setStats(initialStats);
    setLoading(false);

    // Subscribe to updates
    const unsubscribe = protocolSyncService.subscribe((updatedProtocols, updatedStats) => {
      setProtocols(updatedProtocols);
      setStats(updatedStats);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // Helper methods
  const updateProtocolAPY = useCallback((protocolId, newAPY) => {
    return protocolSyncService.updateProtocolAPY(protocolId, newAPY);
  }, []);

  const toggleProtocolEnabled = useCallback((protocolId) => {
    return protocolSyncService.toggleProtocolEnabled(protocolId);
  }, []);

  const toggleProtocolHighlighted = useCallback((protocolId) => {
    return protocolSyncService.toggleProtocolHighlighted(protocolId);
  }, []);

  const updateProtocol = useCallback((protocolId, updates) => {
    return protocolSyncService.updateProtocol(protocolId, updates);
  }, []);

  const importFromAdmin = useCallback((adminProtocols) => {
    return protocolSyncService.importFromAdmin(adminProtocols);
  }, []);

  const refreshStats = useCallback(() => {
    const updatedStats = protocolSyncService.updateStats();
    setStats(updatedStats);
    return updatedStats;
  }, []);

  // Computed values
  const enabledProtocols = protocols.filter(protocol => protocol.enabled);
  const highlightedProtocols = protocols.filter(protocol => protocol.highlighted && protocol.enabled);
  const protocolsByCategory = {
    'Low-Risk': protocols.filter(p => p.category === 'Low-Risk' && p.enabled),
    'Medium-Risk': protocols.filter(p => p.category === 'Medium-Risk' && p.enabled),
    'High-Risk': protocols.filter(p => p.category === 'High-Risk' && p.enabled)
  };

  return {
    // Data
    protocols,
    enabledProtocols,
    highlightedProtocols,
    protocolsByCategory,
    stats,
    loading,

    // Actions
    updateProtocolAPY,
    toggleProtocolEnabled,
    toggleProtocolHighlighted,
    updateProtocol,
    importFromAdmin,
    refreshStats,

    // Service access (for advanced usage)
    service: protocolSyncService
  };
};

/**
 * Hook specifically for homepage display
 * Returns only enabled protocols and formatted stats with backend integration
 */
export const useHomepageProtocols = () => {
  const {
    enabledProtocols,
    highlightedProtocols,
    loading
  } = useProtocolSync();
  
  const [backendStats, setBackendStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [isLiveData, setIsLiveData] = useState(true);
  
  // Fetch backend stats on mount
  useEffect(() => {
    const fetchBackendStats = async () => {
      setStatsLoading(true);
      try {
        console.log('🔄 useHomepageProtocols: Fetching backend stats...');
        const stats = await protocolSyncService.getStatsAsync();
        console.log('📊 useHomepageProtocols: Received stats:', stats);
        
        if (stats) {
          setBackendStats(stats);
          setIsLiveData(stats.isLiveData !== false);
          console.log('✅ useHomepageProtocols: Backend stats set:', {
            totalValueLocked: stats.totalValueLocked,
            stakingRewards: stats.stakingRewards,
            isLiveData: stats.isLiveData !== false
          });
        }
      } catch (error) {
        console.error('❌ useHomepageProtocols: Failed to fetch backend stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };
    
    fetchBackendStats();
  }, []);
  
  // Use backend stats if available, otherwise use fallback values
  const stats = backendStats || {
    totalValueLocked: 89600000, // $89.6M in full number format
    highestAPY: 11.5,
    totalStakers: 89600,
    stakingRewards: 9000000, // $9.0M in full number format
    activeProtocols: enabledProtocols.length
  };

  // Format stats for homepage display
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

  console.log('🗺️ Final stats before formatting:', {
    source: backendStats ? 'BACKEND' : 'FALLBACK',
    raw: stats,
    backendStats,
    totalValueLocked: stats.totalValueLocked,
    stakingRewards: stats.stakingRewards
  });

  const formattedStats = {
    totalValueLocked: formatCurrency(stats.totalValueLocked),
    highestAPY: `${stats.highestAPY?.toFixed(1) || 11.5}%`,
    activeStakers: formatNumber(stats.totalStakers),
    rewardsDistributed: formatCurrency(stats.stakingRewards),
    isLiveData
  };
  
  console.log('🎨 Formatted stats for display:', formattedStats);

  return {
    protocols: enabledProtocols,
    highlightedProtocols,
    stats: formattedStats,
    loading: loading || statsLoading,
    isLiveData
  };
};

/**
 * Hook specifically for admin panel
 * Returns all protocols with admin-specific actions
 */
export const useAdminProtocols = () => {
  const {
    protocols,
    stats,
    loading,
    updateProtocolAPY,
    toggleProtocolEnabled,
    toggleProtocolHighlighted,
    updateProtocol,
    importFromAdmin,
    refreshStats
  } = useProtocolSync();

  // Admin-specific computed values
  const enabledCount = protocols.filter(p => p.enabled).length;
  const disabledCount = protocols.filter(p => !p.enabled).length;
  const highlightedCount = protocols.filter(p => p.highlighted).length;

  return {
    protocols,
    stats: {
      ...stats,
      enabledCount,
      disabledCount,
      highlightedCount
    },
    loading,

    // Admin actions
    updateProtocolAPY,
    toggleProtocolEnabled,
    toggleProtocolHighlighted,
    updateProtocol,
    importFromAdmin,
    refreshStats
  };
};

export default useProtocolSync;
