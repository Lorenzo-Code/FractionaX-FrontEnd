/**
 * FractionaX User Dashboard API Service
 * Handles all user-specific data fetching for dashboard components
 * Enhanced with 10-minute caching to reduce backend load
 */

import secureApiClient from '../../../shared/utils/secureApiClient';
import cacheService from '../../../shared/services/cacheService';

class UserApiService {
  constructor() {
    this.baseUrl = '/api/user';
  }

  // ===== USER PROFILE & ACCOUNT DATA =====

  /**
   * Get user profile and account overview (Raw API call)
   */
  async getUserProfile() {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/profile`);
      if (!response.ok) {
        throw new Error(`Failed to fetch user profile: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch user profile:', error);
      throw error;
    }
  }

  /**
   * Get user profile and account overview (Cached - 10 minutes)
   */
  async getUserProfileCached(forceRefresh = false) {
    return cacheService.getOrFetch(
      'user_profile',
      () => this.getUserProfile(),
      {},
      forceRefresh ? null : undefined
    );
  }

  /**
   * Get user dashboard overview with key metrics (Raw API call)
   */
  async getDashboardOverview() {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/dashboard`);
      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard overview: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch dashboard overview:', error);
      throw error;
    }
  }

  /**
   * Get user dashboard overview with key metrics (Cached - 10 minutes)
   */
  async getDashboardOverviewCached(forceRefresh = false) {
    return cacheService.getOrFetch(
      'dashboard_overview',
      () => this.getDashboardOverview(),
      {},
      forceRefresh ? null : undefined
    );
  }

  // ===== TOKEN & WALLET DATA =====

  /**
   * Get user token balances (FXCT, FST, etc.) (Raw API call)
   */
  async getTokenBalances() {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/tokens/balances`);
      if (!response.ok) {
        throw new Error(`Failed to fetch token balances: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch token balances:', error);
      throw error;
    }
  }

  /**
   * Get user token balances (Cached - 10 minutes)
   */
  async getTokenBalancesCached(forceRefresh = false) {
    return cacheService.getOrFetch(
      'token_balances',
      () => this.getTokenBalances(),
      {},
      forceRefresh ? null : undefined
    );
  }

  /**
   * Get current token prices
   */
  async getTokenPrices() {
    try {
      const response = await secureApiClient.get('/api/token-prices');
      if (!response.ok) {
        throw new Error(`Failed to fetch token prices: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch token prices:', error);
      throw error;
    }
  }

  // ===== STAKING DATA =====

  /**
   * Get user staking summary and positions
   */
  async getStakingSummary() {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/staking/summary`);
      if (!response.ok) {
        throw new Error(`Failed to fetch staking summary: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch staking summary:', error);
      throw error;
    }
  }

  /**
   * Get detailed staking positions
   */
  async getStakingPositions() {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/staking/positions`);
      if (!response.ok) {
        throw new Error(`Failed to fetch staking positions: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch staking positions:', error);
      throw error;
    }
  }

  /**
   * Get staking rewards history
   */
  async getStakingRewards(timeRange = '30d') {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/staking/rewards?timeRange=${timeRange}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch staking rewards: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch staking rewards:', error);
      throw error;
    }
  }

  /**
   * Claim available staking rewards
   */
  async claimStakingRewards(positionIds = []) {
    try {
      const response = await secureApiClient.post(`${this.baseUrl}/staking/claim`, {
        positionIds
      });
      if (!response.ok) {
        throw new Error(`Failed to claim rewards: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to claim staking rewards:', error);
      throw error;
    }
  }

  // ===== PROPERTIES & INVESTMENTS =====

  /**
   * Get user property investments
   */
  async getPropertyInvestments() {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/properties`);
      if (!response.ok) {
        throw new Error(`Failed to fetch property investments: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch property investments:', error);
      throw error;
    }
  }

  /**
   * Get property investment details
   */
  async getPropertyDetails(propertyId) {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/properties/${propertyId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch property details: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch property details:', error);
      throw error;
    }
  }

  // ===== PASSIVE INCOME & EARNINGS =====

  /**
   * Get passive income analytics
   */
  async getPassiveIncomeData(timeRange = '30d') {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/income/analytics?timeRange=${timeRange}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch passive income data: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch passive income data:', error);
      throw error;
    }
  }

  /**
   * Get income breakdown by source
   */
  async getIncomeBreakdown() {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/income/breakdown`);
      if (!response.ok) {
        throw new Error(`Failed to fetch income breakdown: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch income breakdown:', error);
      throw error;
    }
  }

  // ===== PORTFOLIO & ANALYTICS =====

  /**
   * Get portfolio breakdown and allocation
   */
  async getPortfolioBreakdown() {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/portfolio/breakdown`);
      if (!response.ok) {
        throw new Error(`Failed to fetch portfolio breakdown: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch portfolio breakdown:', error);
      throw error;
    }
  }

  /**
   * Get portfolio performance metrics
   */
  async getPortfolioPerformance(timeRange = '30d') {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/portfolio/performance?timeRange=${timeRange}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch portfolio performance: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch portfolio performance:', error);
      throw error;
    }
  }

  // ===== NOTIFICATIONS & ACTIVITY =====

  /**
   * Get user notifications
   */
  async getNotifications(limit = 10) {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/notifications?limit=${limit}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch notifications:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markNotificationRead(notificationId) {
    try {
      const response = await secureApiClient.put(`${this.baseUrl}/notifications/${notificationId}/read`);
      if (!response.ok) {
        throw new Error(`Failed to mark notification as read: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to mark notification as read:', error);
      throw error;
    }
  }

  // ===== COMPLIANCE & DOCUMENTS =====

  /**
   * Get user compliance status
   */
  async getComplianceStatus() {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/compliance/status`);
      if (!response.ok) {
        throw new Error(`Failed to fetch compliance status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch compliance status:', error);
      throw error;
    }
  }

  /**
   * Get user documents
   */
  async getDocuments() {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/documents`);
      if (!response.ok) {
        throw new Error(`Failed to fetch documents: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch documents:', error);
      throw error;
    }
  }

  // ===== REFERRALS =====

  /**
   * Get referral program data
   */
  async getReferralData() {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/referrals`);
      if (!response.ok) {
        throw new Error(`Failed to fetch referral data: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch referral data:', error);
      throw error;
    }
  }

  // ===== BATCH DATA FETCHING =====

  /**
   * Fetch all dashboard data in one call (Raw API calls)
   */
  async getAllDashboardData() {
    try {
      const [
        profileRes,
        overviewRes,
        balancesRes,
        stakingRes,
        propertiesRes,
        incomeRes,
        portfolioRes,
        notificationsRes,
        complianceRes,
        referralsRes
      ] = await Promise.allSettled([
        this.getUserProfile(),
        this.getDashboardOverview(), 
        this.getTokenBalances(),
        this.getStakingSummary(),
        this.getPropertyInvestments(),
        this.getPassiveIncomeData(),
        this.getPortfolioBreakdown(),
        this.getNotifications(),
        this.getComplianceStatus(),
        this.getReferralData()
      ]);

      const result = {
        profile: profileRes.status === 'fulfilled' ? profileRes.value : null,
        overview: overviewRes.status === 'fulfilled' ? overviewRes.value : null,
        balances: balancesRes.status === 'fulfilled' ? balancesRes.value : null,
        staking: stakingRes.status === 'fulfilled' ? stakingRes.value : null,
        properties: propertiesRes.status === 'fulfilled' ? propertiesRes.value : null,
        income: incomeRes.status === 'fulfilled' ? incomeRes.value : null,
        portfolio: portfolioRes.status === 'fulfilled' ? portfolioRes.value : null,
        notifications: notificationsRes.status === 'fulfilled' ? notificationsRes.value : null,
        compliance: complianceRes.status === 'fulfilled' ? complianceRes.value : null,
        referrals: referralsRes.status === 'fulfilled' ? referralsRes.value : null,
        errors: []
      };

      // Collect any errors
      [profileRes, overviewRes, balancesRes, stakingRes, propertiesRes, 
       incomeRes, portfolioRes, notificationsRes, complianceRes, referralsRes]
        .forEach((res, index) => {
          const names = ['profile', 'overview', 'balances', 'staking', 'properties', 
                        'income', 'portfolio', 'notifications', 'compliance', 'referrals'];
          if (res.status === 'rejected') {
            console.warn(`❌ Failed to fetch ${names[index]}:`, res.reason);
            result.errors.push({ section: names[index], error: res.reason.message });
          }
        });

      return result;
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      throw error;
    }
  }

  /**
   * Fetch all dashboard data with caching (Cached - 10 minutes)
   * This is the main method to use for dashboard loading
   */
  async getAllDashboardDataCached(forceRefresh = false) {
    return cacheService.getOrFetch(
      'dashboard_all_data',
      () => this.getAllDashboardData(),
      {},
      forceRefresh ? null : undefined
    );
  }

  // ===== CACHED UTILITY METHODS =====

  /**
   * Get token prices (Cached - 5 minutes for price data)
   */
  async getTokenPricesCached(forceRefresh = false) {
    return cacheService.getOrFetch(
      'token_prices',
      () => this.getTokenPrices(),
      {},
      forceRefresh ? null : 5 * 60 * 1000 // 5 minute cache for prices
    );
  }

  /**
   * Get staking summary (Cached - 10 minutes)
   */
  async getStakingSummaryCached(forceRefresh = false) {
    return cacheService.getOrFetch(
      'staking_summary',
      () => this.getStakingSummary(),
      {},
      forceRefresh ? null : undefined
    );
  }

  /**
   * Get portfolio breakdown (Cached - 10 minutes)
   */
  async getPortfolioBreakdownCached(forceRefresh = false) {
    return cacheService.getOrFetch(
      'portfolio_breakdown',
      () => this.getPortfolioBreakdown(),
      {},
      forceRefresh ? null : undefined
    );
  }

  /**
   * Get passive income data with time range caching
   */
  async getPassiveIncomeDataCached(timeRange = '30d', forceRefresh = false) {
    return cacheService.getOrFetch(
      'passive_income_data',
      () => this.getPassiveIncomeData(timeRange),
      { timeRange },
      forceRefresh ? null : undefined
    );
  }

  /**
   * Clear all cached data for this user (useful for logout or data refresh)
   */
  clearAllCache() {
    cacheService.clearPattern('user_');
    cacheService.clearPattern('dashboard_');
    cacheService.clearPattern('token_');
    cacheService.clearPattern('staking_');
    cacheService.clearPattern('portfolio_');
    cacheService.clearPattern('passive_income_');
    console.log('🗑️ Cleared all user dashboard cache');
  }

  /**
   * Get cache statistics for debugging
   */
  getCacheStats() {
    return cacheService.getStats();
  }

  /**
   * Preload dashboard data in background
   */
  preloadDashboardData() {
    cacheService.preload('dashboard_all_data', () => this.getAllDashboardData());
    cacheService.preload('token_prices', () => this.getTokenPrices(), {}, 5 * 60 * 1000);
  }
}

// Create singleton instance
const userApiService = new UserApiService();

export { UserApiService };
export default userApiService;
