/**
 * Homepage Data Service
 * Manages all homepage content including market stats, community data, 
 * featured properties, and testimonials with backend API integration
 */

const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://api.fractionax.io' 
  : 'http://localhost:5000';

class HomepageDataService {
  constructor() {
    this.listeners = new Set();
    this.cache = null;
    this.lastFetch = null;
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.isLoading = false;
    
    // Live data management
    this.autoRefreshInterval = null;
    this.autoRefreshDelay = 30 * 1000; // 30 seconds
    this.isAutoRefreshEnabled = true;
    
    // Track which sections are overridden manually
    this.overrides = {
      marketStats: false,
      communityStats: false,
      protocolStats: false, // Protocol stats are always live
      featuredProperty: false,
      testimonials: false,
      config: false
    };
    
    this.initializeAutoRefresh();
  }

  // Helper method to get auth token from localStorage
  getAuthToken() {
    try {
      const token = localStorage.getItem('fractionax_token');
      return token || null;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  // Initialize auto-refresh mechanism
  initializeAutoRefresh() {
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
    }
    
    this.autoRefreshInterval = setInterval(async () => {
      if (this.isAutoRefreshEnabled && !this.isLoading) {
        try {
          await this.fetchLiveData();
        } catch (error) {
          console.warn('Auto-refresh failed:', error.message);
        }
      }
    }, this.autoRefreshDelay);
  }
  
  // Enable/disable auto-refresh
  setAutoRefreshEnabled(enabled) {
    this.isAutoRefreshEnabled = enabled;
    if (enabled) {
      this.initializeAutoRefresh();
    } else if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
      this.autoRefreshInterval = null;
    }
  }
  
  // Set auto-refresh interval (in seconds)
  setAutoRefreshInterval(seconds) {
    this.autoRefreshDelay = seconds * 1000;
    if (this.isAutoRefreshEnabled) {
      this.initializeAutoRefresh();
    }
  }
  
  // Helper method to make authenticated API calls
  async makeApiCall(endpoint, options = {}) {
    try {
      const token = this.getAuthToken();
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE}/api/homepage${endpoint}`, {
        ...options,
        headers,
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Fetch homepage data from backend API
  async fetchHomepageData() {
    try {
      // Check cache first
      if (this.cache && this.lastFetch && (Date.now() - this.lastFetch) < this.cacheTimeout) {
        return this.cache;
      }
      
      if (this.isLoading) {
        // If already loading, wait for it to complete
        return new Promise((resolve) => {
          const checkLoading = () => {
            if (!this.isLoading) {
              resolve(this.cache);
            } else {
              setTimeout(checkLoading, 100);
            }
          };
          checkLoading();
        });
      }
      
      this.isLoading = true;
      
      const result = await this.makeApiCall('/data');
      
      if (result.success) {
        this.cache = result.data;
        this.lastFetch = Date.now();
        this.notifyListeners();
        return this.cache;
      } else {
        throw new Error(result.error || 'Failed to fetch homepage data');
      }
    } catch (error) {
      console.error('Error fetching homepage data from API:', error);
      // Fallback to localStorage if API fails
      return this.getLocalHomepageData();
    } finally {
      this.isLoading = false;
    }
  }

  // Get all homepage data (from cache or API)
  async getHomepageData() {
    try {
      return await this.fetchHomepageData();
    } catch (error) {
      console.error('Error getting homepage data:', error);
      return this.getLocalHomepageData();
    }
  }

  // Get homepage data from localStorage (fallback)
  getLocalHomepageData() {
    try {
      const stored = localStorage.getItem('fractionax_homepage_data_backup');
      return stored ? JSON.parse(stored) : this.getDefaultData();
    } catch (error) {
      console.error('Error loading homepage data from localStorage:', error);
      return this.getDefaultData();
    }
  }

  // Get default data structure
  getDefaultData() {
    return {
      marketStats: {
        totalListings: 0,
        totalInvestors: 0,
        totalVolume: 0,
        averageRoi: 8.5,
        totalProperties: 0,
        totalTransactions: 0,
        marketCap: 0
      },
      communityStats: {
        activeUsers: 0,
        totalUsers: 0,
        verifiedUsers: 0,
        premiumUsers: 0,
        communityGrowth: 0,
        totalReports: 0
      },
      protocolStats: {
        totalValueLocked: 0,
        transactionVolume24h: 0,
        activeContracts: 0,
        totalTokens: 0
      },
      featuredProperty: {
        id: null,
        title: "Premium Downtown Office Complex",
        address: "123 Main St, Downtown District, NY 10001",
        price: 2500000,
        expectedROI: 9.2,
        bedrooms: 3,
        bathrooms: 2,
        sqft: 2500,
        monthlyRent: 3500,
        fundingProgress: 65,
        investors: 24,
        propertyType: "Multi-Family",
        isHot: true
      },
      testimonials: [],
      heroSection: {
        headline: "Transform Real Estate Investment with Blockchain Technology",
        subheadline: "Access fractional real estate ownership through our revolutionary tokenization platform",
        ctaText: "Start Investing",
        ctaLink: "/signup"
      },
      socialProof: {
        partnerLogos: [],
        trustBadges: [],
        achievements: []
      },
      config: {
        showLiveBadge: true,
        featuredPropertyEnabled: true,
        testimonialsEnabled: true,
        maintenanceMode: false
      }
    };
  }

  // Get specific data sections (async)
  async getMarketStats() {
    const data = await this.getHomepageData();
    return data.marketStats || {};
  }

  async getCommunityStats() {
    const data = await this.getHomepageData();
    return data.communityStats || {};
  }

  async getProtocolStats() {
    const data = await this.getHomepageData();
    return data.protocolStats || {};
  }

  async getFeaturedProperty() {
    const data = await this.getHomepageData();
    return data.featuredProperty || {};
  }

  async getTestimonials() {
    const data = await this.getHomepageData();
    return data.testimonials || [];
  }

  async getHeroSection() {
    const data = await this.getHomepageData();
    return data.heroSection || {};
  }

  async getSocialProof() {
    const data = await this.getHomepageData();
    return data.socialProof || {};
  }

  async getPlatformSettings() {
    const data = await this.getHomepageData();
    return data.config || {};
  }

  // Save all homepage data to backend API (Admin only)
  async saveHomepageData(data) {
    try {
      const result = await this.makeApiCall('/data', {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      
      if (result.success) {
        // Update cache
        this.cache = result.data;
        this.lastFetch = Date.now();
        
        // Also save to localStorage as backup
        localStorage.setItem('fractionax_homepage_data_backup', JSON.stringify(result.data));
        
        this.notifyListeners();
        return true;
      } else {
        throw new Error(result.error || 'Failed to save homepage data');
      }
    } catch (error) {
      console.error('Error saving homepage data to API:', error);
      return false;
    }
  }

  // Fetch live data from various sources
  async fetchLiveData() {
    try {
      const result = await this.makeApiCall('/live-data');
      
      if (result.success && result.data) {
        const currentData = await this.getHomepageData();
        const updatedData = { ...currentData };
        
        // Only update sections that are not manually overridden
        if (!this.overrides.marketStats && result.data.marketStats) {
          updatedData.marketStats = {
            ...updatedData.marketStats,
            ...result.data.marketStats
          };
        }
        
        if (!this.overrides.communityStats && result.data.communityStats) {
          updatedData.communityStats = {
            ...updatedData.communityStats,
            ...result.data.communityStats
          };
        }
        
        // Protocol stats are always live (never overridden)
        if (result.data.protocolStats) {
          updatedData.protocolStats = {
            ...updatedData.protocolStats,
            ...result.data.protocolStats
          };
        }
        
        // Update cache with new live data
        this.cache = updatedData;
        this.lastFetch = Date.now();
        
        // Notify listeners of the update
        this.notifyListeners();
        
        return updatedData;
      }
    } catch (error) {
      console.warn('Failed to fetch live data:', error.message);
    }
    return null;
  }
  
  // Fetch override status from backend (Admin only)
  async fetchOverrideStatus() {
    try {
      const result = await this.makeApiCall('/overrides');
      if (result.success) {
        this.overrides = { ...this.overrides, ...result.overrides };
        return result.overrides;
      }
      return null;
    } catch (error) {
      console.error('Error fetching override status from backend:', error);
      return null;
    }
  }
  
  // Set manual override for a specific section (now syncs with backend)
  async setOverride(section, isOverridden = true) {
    try {
      const result = await this.makeApiCall(`/overrides/${section}`, {
        method: 'POST',
        body: JSON.stringify({ isOverridden })
      });
      
      if (result.success) {
        this.overrides[section] = result.isOverridden;
        this.invalidateCache();
        console.log(`${section} override set to: ${result.isOverridden}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error setting override for ${section}:`, error);
      // Fallback to local override if API fails
      if (this.overrides.hasOwnProperty(section)) {
        this.overrides[section] = isOverridden;
        console.log(`${section} override set locally to: ${isOverridden} (API failed)`);
      }
      return false;
    }
  }
  
  // Get override status for a section
  getOverrideStatus(section = null) {
    if (section) {
      return this.overrides[section] || false;
    }
    return { ...this.overrides };
  }
  
  // Reset all overrides (return to live data) - now syncs with backend
  async resetAllOverrides() {
    try {
      const result = await this.makeApiCall('/reset-overrides', {
        method: 'POST'
      });
      
      if (result.success) {
        this.overrides = { ...result.overrides };
        this.invalidateCache();
        await this.notifyListeners();
        console.log('All overrides reset to live data');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error resetting overrides:', error);
      // Fallback to local reset
      Object.keys(this.overrides).forEach(key => {
        if (key !== 'protocolStats') { // Protocol stats are always live
          this.overrides[key] = false;
        }
      });
      this.invalidateCache();
      return false;
    }
  }

  // Update specific sections (async) - with override tracking
  async updateMarketStats(stats) {
    try {
      const result = await this.makeApiCall('/data/marketStats', {
        method: 'PUT',
        body: JSON.stringify({ ...stats, isOverridden: true })
      });
      
      if (result.success) {
        this.setOverride('marketStats', true);
        this.invalidateCache();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating market stats:', error);
      return false;
    }
  }

  async updateCommunityStats(stats) {
    try {
      const result = await this.makeApiCall('/data/communityStats', {
        method: 'PUT',
        body: JSON.stringify({ ...stats, isOverridden: true })
      });
      
      if (result.success) {
        this.setOverride('communityStats', true);
        this.invalidateCache();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating community stats:', error);
      return false;
    }
  }

  async updateFeaturedProperty(property) {
    try {
      const result = await this.makeApiCall('/data/featuredProperty', {
        method: 'PUT',
        body: JSON.stringify({ ...property, isOverridden: true })
      });
      
      if (result.success) {
        this.setOverride('featuredProperty', true);
        this.invalidateCache();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating featured property:', error);
      return false;
    }
  }

  async updateTestimonials(testimonials) {
    try {
      const result = await this.makeApiCall('/data/testimonials', {
        method: 'PUT',
        body: JSON.stringify({ testimonials, isOverridden: true })
      });
      
      if (result.success) {
        this.setOverride('testimonials', true);
        this.invalidateCache();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating testimonials:', error);
      return false;
    }
  }

  async updatePlatformSettings(settings) {
    try {
      const result = await this.makeApiCall('/data/config', {
        method: 'PUT',
        body: JSON.stringify(settings)
      });
      
      if (result.success) {
        this.invalidateCache();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating platform settings:', error);
      return false;
    }
  }

  // Add new testimonial
  async addTestimonial(testimonial) {
    try {
      const result = await this.makeApiCall('/testimonials', {
        method: 'POST',
        body: JSON.stringify(testimonial)
      });
      
      if (result.success) {
        this.invalidateCache();
        return result.testimonial;
      }
      return null;
    } catch (error) {
      console.error('Error adding testimonial:', error);
      return null;
    }
  }

  // Remove testimonial
  async removeTestimonial(testimonialId) {
    try {
      const result = await this.makeApiCall(`/testimonials/${testimonialId}`, {
        method: 'DELETE'
      });
      
      if (result.success) {
        this.invalidateCache();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing testimonial:', error);
      return false;
    }
  }

  // Update specific testimonial
  async updateTestimonial(testimonialId, updates) {
    try {
      const result = await this.makeApiCall(`/testimonials/${testimonialId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      
      if (result.success) {
        this.invalidateCache();
        return result.testimonial;
      }
      return null;
    } catch (error) {
      console.error('Error updating testimonial:', error);
      return null;
    }
  }

  // Invalidate cache to force refresh on next request
  invalidateCache() {
    this.cache = null;
    this.lastFetch = null;
  }

  // Refresh data from API (force refresh)
  async refreshData() {
    try {
      const result = await this.makeApiCall('/refresh-stats', {
        method: 'POST'
      });
      
      if (result.success) {
        this.invalidateCache();
        return await this.fetchHomepageData();
      }
      return null;
    } catch (error) {
      console.error('Error refreshing homepage data:', error);
      return null;
    }
  }

  // Get available properties for admin selection
  async getAvailableProperties() {
    try {
      const result = await this.makeApiCall('/available-properties');
      return result.success ? result.properties : [];
    } catch (error) {
      console.error('Error fetching available properties:', error);
      return [];
    }
  }

  // Subscribe to homepage data changes
  subscribe(callback) {
    this.listeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  // Notify all listeners of changes
  async notifyListeners() {
    try {
      const data = await this.getHomepageData();
      this.listeners.forEach(callback => {
        try {
          callback(data || this.getDefaultData());
        } catch (error) {
          console.error('Error in homepage data listener:', error);
        }
      });
    } catch (error) {
      console.error('Error notifying listeners:', error);
      // Notify with default data on error
      this.listeners.forEach(callback => {
        try {
          callback(this.getDefaultData());
        } catch (err) {
          console.error('Error in fallback listener notification:', err);
        }
      });
    }
  }

  // Clear all data (Admin only - resets to defaults)
  async clearData() {
    try {
      const result = await this.makeApiCall('/reset', {
        method: 'POST'
      });
      
      if (result.success) {
        this.invalidateCache();
        localStorage.removeItem('fractionax_homepage_data_backup');
        await this.notifyListeners();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error clearing homepage data:', error);
      return false;
    }
  }

  // Import data from external source (Admin only)
  async importData(externalData) {
    try {
      const result = await this.makeApiCall('/import', {
        method: 'POST',
        body: JSON.stringify({ data: externalData })
      });
      
      if (result.success) {
        this.invalidateCache();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing homepage data:', error);
      return false;
    }
  }

  // Export data for backup/transfer (Admin only)
  async exportData() {
    try {
      const result = await this.makeApiCall('/export');
      if (result.success || result.data) {
        return result;
      }
      return null;
    } catch (error) {
      console.error('Error exporting homepage data:', error);
      // Fallback to current cached data
      const data = await this.getHomepageData();
      return {
        data,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };
    }
  }

  // Validate data structure
  validateData(data) {
    const required = ['marketStats', 'communityStats', 'protocolStats', 'featuredProperty', 'testimonials', 'heroSection'];
    return required.every(key => data && data[key]);
  }

  // Get live statistics (public endpoint)
  async getLiveStats() {
    try {
      const result = await this.makeApiCall('/stats');
      return result.success ? result.data : null;
    } catch (error) {
      console.error('Error fetching live stats:', error);
      return null;
    }
  }

  // Check if user has admin privileges for write operations
  hasAdminAccess() {
    try {
      const userData = localStorage.getItem('fractionax_user');
      if (userData) {
        const user = JSON.parse(userData);
        return user.role === 'admin';
      }
      return false;
    } catch (error) {
      console.error('Error checking admin access:', error);
      return false;
    }
  }
  
  // Get auto-refresh status
  getAutoRefreshStatus() {
    return {
      enabled: this.isAutoRefreshEnabled,
      interval: this.autoRefreshDelay / 1000, // in seconds
      lastFetch: this.lastFetch,
      nextRefresh: this.lastFetch ? this.lastFetch + this.autoRefreshDelay : null
    };
  }
  
  // Cleanup method for service destruction
  destroy() {
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
      this.autoRefreshInterval = null;
    }
    this.listeners.clear();
    this.cache = null;
    this.isAutoRefreshEnabled = false;
  }
}

// Create singleton instance
const homepageDataService = new HomepageDataService();

export default homepageDataService;
