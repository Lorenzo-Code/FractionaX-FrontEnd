/**
 * Protocol Sync Service
 * Manages protocol data synchronization between admin panel and homepage
 * Now integrates with backend API for live staking data
 */

const PROTOCOL_STORAGE_KEY = 'fractionax_protocols';
const PROTOCOL_STATS_KEY = 'fractionax_protocol_stats';
const API_BASE_URL = 'http://localhost:5000';

// Simple fetch-based API calls for backend communication
const fetchBackendData = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`Failed to fetch ${endpoint}:`, error.message);
    throw error;
  }
};

class ProtocolSyncService {
  constructor() {
    this.listeners = new Set();
    this.initializeDefaultData();
  }

  // Initialize with default protocol data if none exists
  initializeDefaultData() {
    const existingProtocols = this.getProtocols();
    
    // Check if we need to migrate from FXCT to FXST
    const needsMigration = existingProtocols.some(p => p.token === 'FXCT');
    
    if (!existingProtocols || existingProtocols.length === 0 || needsMigration) {
      if (needsMigration) {
        console.log('🔄 Migrating protocol data from FXCT to FXST tokens...');
        this.clearData();
      }
      const defaultProtocols = [
        {
          id: 'lido-eth',
          name: 'Lido ETH Staking',
          protocol: 'Lido (Liquid Staking for ETH)',
          token: 'FXST',
          apy: 4.2,
          duration: 'Flexible',
          minStake: 1000,
          totalStaked: '$32.5M',
          risk: 'Low',
          status: 'Active',
          enabled: true,
          highlighted: false,
          description: 'Stake FXST to earn network rewards while keeping liquidity via stETH tokens',
          category: 'Low-Risk',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'curve-stablecoin',
          name: 'Curve Stablecoin Pool',
          protocol: 'Curve Finance (Stablecoin Liquidity Pools)',
          token: 'FXST',
          apy: 7.8,
          duration: 'Flexible',
          minStake: 2500,
          totalStaked: '$25.8M',
          risk: 'Low',
          status: 'Active',
          enabled: true,
          highlighted: true,
          description: 'Provide FXST liquidity for stablecoin swaps earning trading fees',
          category: 'Low-Risk',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'aave-lending',
          name: 'Aave Lending Protocol',
          protocol: 'Aave (Lending Protocol)',
          token: 'FXST',
          apy: 9.1,
          duration: 'Flexible',
          minStake: 5000,
          totalStaked: '$18.9M',
          risk: 'Medium',
          status: 'Active',
          enabled: true,
          highlighted: false,
          description: 'Lend FXST tokens to borrowers and earn interest based on supply/demand',
          category: 'Medium-Risk',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'yearn-optimizer',
          name: 'Yearn Yield Optimizer',
          protocol: 'Yearn.Finance (Yield Optimizer)',
          token: 'FXST',
          apy: 11.5,
          duration: 'Flexible',
          minStake: 10000,
          totalStaked: '$12.4M',
          risk: 'Medium',
          status: 'Active',
          enabled: true,
          highlighted: true,
          description: 'Automated FXST yield farming across multiple DeFi protocols',
          category: 'Medium-Risk',
          lastUpdated: new Date().toISOString()
        }
      ];
      
      this.saveProtocols(defaultProtocols);
      this.updateStats();
    }
  }

  // Get all protocols from localStorage
  getProtocols() {
    try {
      const stored = localStorage.getItem(PROTOCOL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading protocols from localStorage:', error);
      return [];
    }
  }

  // Get only enabled protocols for public display
  getEnabledProtocols() {
    return this.getProtocols().filter(protocol => protocol.enabled);
  }

  // Get protocols by category
  getProtocolsByCategory(category) {
    return this.getProtocols().filter(protocol => 
      protocol.category === category && protocol.enabled
    );
  }

  // Save protocols to localStorage
  saveProtocols(protocols) {
    try {
      localStorage.setItem(PROTOCOL_STORAGE_KEY, JSON.stringify(protocols));
      this.updateStats();
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Error saving protocols to localStorage:', error);
      return false;
    }
  }

  // Update a specific protocol
  updateProtocol(protocolId, updates) {
    const protocols = this.getProtocols();
    const index = protocols.findIndex(p => p.id === protocolId);
    
    if (index !== -1) {
      protocols[index] = {
        ...protocols[index],
        ...updates,
        lastUpdated: new Date().toISOString()
      };
      
      return this.saveProtocols(protocols);
    }
    
    return false;
  }

  // Update APY for a protocol (main admin function)
  updateProtocolAPY(protocolId, newAPY) {
    return this.updateProtocol(protocolId, { apy: newAPY });
  }

  // Toggle protocol enabled status
  toggleProtocolEnabled(protocolId) {
    const protocols = this.getProtocols();
    const protocol = protocols.find(p => p.id === protocolId);
    
    if (protocol) {
      return this.updateProtocol(protocolId, { enabled: !protocol.enabled });
    }
    
    return false;
  }

  // Toggle protocol highlighted status
  toggleProtocolHighlighted(protocolId) {
    const protocols = this.getProtocols();
    const protocol = protocols.find(p => p.id === protocolId);
    
    if (protocol) {
      return this.updateProtocol(protocolId, { highlighted: !protocol.highlighted });
    }
    
    return false;
  }

  // Calculate and cache aggregated stats
  updateStats() {
    const protocols = this.getEnabledProtocols();
    
    const stats = {
      totalValueLocked: protocols.reduce((sum, p) => {
        const value = parseFloat(p.totalStaked.replace(/[$M]/g, ''));
        return sum + value;
      }, 0),
      highestAPY: Math.max(...protocols.map(p => p.apy)),
      activeProtocols: protocols.length,
      totalStakers: protocols.reduce((sum, p) => {
        // Estimate stakers based on total staked value
        const value = parseFloat(p.totalStaked.replace(/[$M]/g, ''));
        return sum + Math.floor(value * 1000); // Rough estimate
      }, 0),
      lastCalculated: new Date().toISOString()
    };

    try {
      localStorage.setItem(PROTOCOL_STATS_KEY, JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving protocol stats:', error);
    }

    return stats;
  }

  // Get cached stats
  getStats() {
    try {
      const stored = localStorage.getItem(PROTOCOL_STATS_KEY);
      return stored ? JSON.parse(stored) : this.updateStats();
    } catch (error) {
      console.error('Error loading protocol stats:', error);
      return this.updateStats();
    }
  }

  // Subscribe to protocol changes
  subscribe(callback) {
    this.listeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  // Notify all listeners of changes
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.getProtocols(), this.getStats());
      } catch (error) {
        console.error('Error in protocol sync listener:', error);
      }
    });
  }

  // Fetch protocol stats from backend API
  async fetchBackendProtocolStats() {
    try {
      console.log('🔄 Fetching backend protocol stats...');
      const data = await fetchBackendData('/api/homepage/data');
      
      if (data.success && data.data.protocolStats) {
        const backendStats = data.data.protocolStats;
        console.log('✅ Backend protocol stats received:', backendStats);
        
        // Map backend protocol stats to frontend format
        const formattedStats = {
          totalValueLocked: backendStats.totalValueLocked || 0,
          highestAPY: backendStats.apr || 11.5,
          totalStakers: backendStats.totalStakers || 0,
          stakingRewards: backendStats.stakingRewards || 0,
          activeProtocols: this.getEnabledProtocols().length,
          lastCalculated: new Date().toISOString(),
          isLiveData: !data.data.overrides?.protocolStats
        };
        
        console.log('📊 Formatted frontend stats:', formattedStats);
        return formattedStats;
      }
      
      console.warn('❌ Backend did not return valid protocol stats');
      return null;
    } catch (error) {
      console.warn('❌ Failed to fetch backend protocol stats, using local data:', error.message);
      return null;
    }
  }
  
  // Get stats - tries backend first, falls back to local calculation
  async getStatsAsync() {
    const backendStats = await this.fetchBackendProtocolStats();
    if (backendStats) {
      // Cache the backend stats
      try {
        localStorage.setItem(PROTOCOL_STATS_KEY, JSON.stringify(backendStats));
      } catch (error) {
        console.error('Error caching backend stats:', error);
      }
      return backendStats;
    }
    
    // Fallback to local calculation
    return this.getStats();
  }

  // Clear all data (for testing/reset)
  clearData() {
    try {
      localStorage.removeItem(PROTOCOL_STORAGE_KEY);
      localStorage.removeItem(PROTOCOL_STATS_KEY);
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Error clearing protocol data:', error);
      return false;
    }
  }

  // Import protocols from admin configuration
  importFromAdmin(adminProtocols) {
    const syncedProtocols = adminProtocols.map((adminProtocol, index) => ({
      id: adminProtocol.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: adminProtocol.name,
      protocol: adminProtocol.name,
      token: 'FXST',
      apy: adminProtocol.apiPercentage || 5.0,
      duration: 'Flexible',
      minStake: 1000 + (index * 1000), // Incremental minimums
      totalStaked: `$${(30 - (index * 5))}M`, // Decreasing pool sizes
      risk: adminProtocol.category?.replace('-Risk', '') || 'Medium',
      status: adminProtocol.enabled ? 'Active' : 'Disabled',
      enabled: adminProtocol.enabled,
      highlighted: adminProtocol.highlighted,
      description: adminProtocol.description || 'Earn passive income with FXST through this DeFi protocol',
      category: adminProtocol.category || 'Medium-Risk',
      lastUpdated: new Date().toISOString()
    }));

    return this.saveProtocols(syncedProtocols);
  }
}

// Create singleton instance
const protocolSyncService = new ProtocolSyncService();

export default protocolSyncService;
