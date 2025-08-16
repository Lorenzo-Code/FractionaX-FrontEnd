/**
 * FractionaX Admin Staking API Service
 * Comprehensive integration with all backend staking endpoints
 */

import secureApiClient from '../../../shared/utils/secureApiClient';

class StakingApiService {
  constructor() {
    this.baseUrl = '/api/admin/staking';
  }

  // ===== STAKING PROTOCOLS MANAGEMENT =====

  /**
   * Get all staking protocols with detailed metrics
   */
  async getStakingProtocols() {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/protocols`);
      if (!response.ok) {
        throw new Error(`Failed to fetch staking protocols: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch staking protocols:', error);
      throw error;
    }
  }

  /**
   * Update staking protocol parameters
   */
  async updateStakingProtocol(protocolId, updateData) {
    try {
      const response = await secureApiClient.put(
        `${this.baseUrl}/protocols/${protocolId}`, 
        updateData
      );
      if (!response.ok) {
        throw new Error(`Failed to update protocol: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to update staking protocol:', error);
      throw error;
    }
  }

  // ===== USER STAKING ANALYTICS =====

  /**
   * Get comprehensive user staking analytics
   */
  async getUserStakingAnalytics() {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/user-analytics`);
      if (!response.ok) {
        throw new Error(`Failed to fetch user analytics: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch user staking analytics:', error);
      throw error;
    }
  }

  /**
   * Get individual user staking details
   */
  async getUserStakingDetails(userId) {
    try {
      const response = await secureApiClient.get(`/api/admin/users/${userId}/staking`);
      if (!response.ok) {
        throw new Error(`Failed to fetch user staking details: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch user staking details:', error);
      throw error;
    }
  }

  // ===== AI RECOMMENDATIONS =====

  /**
   * Get AI-powered staking recommendations
   */
  async getAIRecommendations(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${this.baseUrl}/ai-recommendations${queryString ? '?' + queryString : ''}`;
      
      const response = await secureApiClient.get(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch AI recommendations: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch AI recommendations:', error);
      throw error;
    }
  }

  // ===== RISK MANAGEMENT =====

  /**
   * Get comprehensive risk analysis
   */
  async getRiskAnalysis() {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/risk-analysis`);
      if (!response.ok) {
        throw new Error(`Failed to fetch risk analysis: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch risk analysis:', error);
      throw error;
    }
  }

  // ===== REWARDS DISTRIBUTION =====

  /**
   * Distribute rewards to stakers
   */
  async distributeRewards(distributionData) {
    try {
      const response = await secureApiClient.post(
        `${this.baseUrl}/distribute-rewards`, 
        distributionData
      );
      if (!response.ok) {
        throw new Error(`Failed to distribute rewards: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to distribute rewards:', error);
      throw error;
    }
  }

  // ===== EMERGENCY CONTROLS =====

  /**
   * Execute emergency controls (pause, resume, etc.)
   */
  async executeEmergencyControl(controlData) {
    try {
      const response = await secureApiClient.post(
        `${this.baseUrl}/emergency-controls`, 
        controlData
      );
      if (!response.ok) {
        throw new Error(`Failed to execute emergency control: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to execute emergency control:', error);
      throw error;
    }
  }

  // ===== PERFORMANCE ANALYTICS =====

  /**
   * Get staking performance analytics
   */
  async getPerformanceAnalytics(timeRange = '30d') {
    try {
      const response = await secureApiClient.get(
        `${this.baseUrl}/performance-analytics?timeRange=${timeRange}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch performance analytics: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch performance analytics:', error);
      throw error;
    }
  }
}

// Create singleton instance
const stakingApiService = new StakingApiService();

// Export both the class and the instance
export { StakingApiService };
export default stakingApiService;
