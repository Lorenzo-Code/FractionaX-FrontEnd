/**
 * FractionaX Admin API Service
 * Comprehensive API client for admin operations across all phases
 * Enhanced with intelligent 10-minute caching to reduce backend load
 * Phase 1: Advanced Admin Features (KYC/AML, Risk Assessment, Security)
 * Phase 2: Portfolio Analytics, Property Management & Tax Reporting  
 * Phase 3: Advanced Reporting, Compliance & Integration APIs
 */

import secureApiClient from '../../../shared/utils/secureApiClient';
import cacheService from '../../../shared/services/cacheService';

class AdminApiService {
  constructor() {
    this.baseUrl = '/api/admin';
  }

  // ===== PHASE 1: ADVANCED ADMIN FEATURES =====

  // === USER MANAGEMENT ===
  
  /**
   * Reset user password with optional custom password
   */
  async resetUserPassword(userId, customPassword = null) {
    try {
      const body = customPassword ? { newPassword: customPassword } : {};
      const response = await secureApiClient.post(`${this.baseUrl}/users/${userId}/reset-password`, body);
      if (!response.ok) {
        throw new Error(`Failed to reset password: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to reset password:', error);
      throw error;
    }
  }

  /**
   * Force password change with custom password
   */
  async forcePasswordChange(userId, newPassword, sendEmail = false) {
    try {
      const response = await secureApiClient.post(`${this.baseUrl}/users/${userId}/force-password-change`, {
        newPassword,
        sendEmail
      });
      if (!response.ok) {
        throw new Error(`Failed to force password change: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to force password change:', error);
      throw error;
    }
  }

  /**
   * Get all users with advanced filtering and sorting
   */
  async getAllUsers(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await secureApiClient.get(`${this.baseUrl}/users?${params}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch users:', error);
      throw error;
    }
  }

  /**
   * Get all users (cached) - caches for 10 minutes
   */
  async getAllUsersCached(filters = {}, forceRefresh = false) {
    const cacheKey = `admin_users_${JSON.stringify(filters)}`;
    
    return cacheService.getOrFetch(
      cacheKey,
      () => this.getAllUsers(filters),
      { ttl: 600000, forceRefresh } // 10 minutes
    );
  }

  /**
   * Get detailed user profile with KYC/AML data
   */
  async getUserDetails(userId) {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/users/${userId}/details`);
      if (!response.ok) {
        throw new Error(`Failed to fetch user details: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch user details:', error);
      throw error;
    }
  }

  /**
   * Get detailed user profile (cached) - caches for 10 minutes
   */
  async getUserDetailsCached(userId, forceRefresh = false) {
    const cacheKey = `admin_user_details_${userId}`;
    
    return cacheService.getOrFetch(
      cacheKey,
      () => this.getUserDetails(userId),
      { ttl: 600000, forceRefresh } // 10 minutes
    );
  }

  /**
   * Update user account tier and investor type
   */
  async updateUserTier(userId, tierData) {
    try {
      const response = await secureApiClient.put(`${this.baseUrl}/users/${userId}/tier`, tierData);
      if (!response.ok) {
        throw new Error(`Failed to update user tier: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to update user tier:', error);
      throw error;
    }
  }

  // === KYC/AML SCREENING ===

  /**
   * Enhanced KYC/AML screening with sanctions checking
   */
  async performKycAmlScreening(userId, screeningData) {
    try {
      const response = await secureApiClient.post(`${this.baseUrl}/kyc-aml/${userId}/screen`, screeningData);
      if (!response.ok) {
        throw new Error(`Failed to perform KYC/AML screening: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to perform KYC/AML screening:', error);
      throw error;
    }
  }

  /**
   * Get sanctions check results
   */
  async getSanctionsCheck(userId) {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/kyc-aml/${userId}/sanctions`);
      if (!response.ok) {
        throw new Error(`Failed to get sanctions check: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to get sanctions check:', error);
      throw error;
    }
  }

  /**
   * Update KYC status
   */
  async updateKycStatus(userId, status, notes = '') {
    try {
      const response = await secureApiClient.put(`${this.baseUrl}/kyc-aml/${userId}/status`, {
        status,
        notes
      });
      if (!response.ok) {
        throw new Error(`Failed to update KYC status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to update KYC status:', error);
      throw error;
    }
  }

  // === RISK ASSESSMENT & BEHAVIORAL ANALYSIS ===

  /**
   * Get user risk assessment
   */
  async getUserRiskAssessment(userId) {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/risk-assessment/${userId}`);
      if (!response.ok) {
        throw new Error(`Failed to get risk assessment: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to get risk assessment:', error);
      throw error;
    }
  }

  /**
   * Trigger automated risk assessment
   */
  async triggerRiskAssessment(userId, assessmentType = 'full') {
    try {
      const response = await secureApiClient.post(`${this.baseUrl}/risk-assessment/${userId}/trigger`, {
        assessmentType
      });
      if (!response.ok) {
        throw new Error(`Failed to trigger risk assessment: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to trigger risk assessment:', error);
      throw error;
    }
  }

  /**
   * Get behavioral analysis data
   */
  async getBehavioralAnalysis(userId, timeRange = '30d') {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/behavioral-analysis/${userId}?timeRange=${timeRange}`);
      if (!response.ok) {
        throw new Error(`Failed to get behavioral analysis: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to get behavioral analysis:', error);
      throw error;
    }
  }

  // === TRANSACTION MONITORING ===

  /**
   * Get transaction monitoring alerts
   */
  async getTransactionAlerts(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await secureApiClient.get(`${this.baseUrl}/transaction-monitoring/alerts?${params}`);
      if (!response.ok) {
        throw new Error(`Failed to get transaction alerts: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to get transaction alerts:', error);
      throw error;
    }
  }

  /**
   * Get suspicious activity reports
   */
  async getSuspiciousActivityReports(userId = null) {
    try {
      const url = userId ? 
        `${this.baseUrl}/transaction-monitoring/sar/${userId}` : 
        `${this.baseUrl}/transaction-monitoring/sar`;
      
      const response = await secureApiClient.get(url);
      if (!response.ok) {
        throw new Error(`Failed to get suspicious activity reports: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to get suspicious activity reports:', error);
      throw error;
    }
  }

  /**
   * Create suspicious activity report
   */
  async createSuspiciousActivityReport(userId, reportData) {
    try {
      const response = await secureApiClient.post(`${this.baseUrl}/transaction-monitoring/sar`, {
        userId,
        ...reportData
      });
      if (!response.ok) {
        throw new Error(`Failed to create suspicious activity report: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to create suspicious activity report:', error);
      throw error;
    }
  }

  // === SECURITY & DEVICE MANAGEMENT ===

  /**
   * Get user security overview
   */
  async getUserSecurity(userId) {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/security/${userId}`);
      if (!response.ok) {
        throw new Error(`Failed to get user security: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to get user security:', error);
      throw error;
    }
  }

  /**
   * Get user devices
   */
  async getUserDevices(userId) {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/security/${userId}/devices`);
      if (!response.ok) {
        throw new Error(`Failed to get user devices: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to get user devices:', error);
      throw error;
    }
  }

  /**
   * Revoke user device
   */
  async revokeUserDevice(userId, deviceId) {
    try {
      const response = await secureApiClient.delete(`${this.baseUrl}/security/${userId}/devices/${deviceId}`);
      if (!response.ok) {
        throw new Error(`Failed to revoke device: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to revoke device:', error);
      throw error;
    }
  }

  /**
   * Get security logs
   */
  async getSecurityLogs(userId, timeRange = '7d') {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/security/${userId}/logs?timeRange=${timeRange}`);
      if (!response.ok) {
        throw new Error(`Failed to get security logs: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to get security logs:', error);
      throw error;
    }
  }

  // ===== PHASE 2: PORTFOLIO ANALYTICS, PROPERTY MANAGEMENT & TAX REPORTING =====

  // === USER PORTFOLIO ANALYTICS ===

  /**
   * Get user portfolio overview with performance analytics
   */
  async getUserPortfolioOverview(userId) {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/portfolio/${userId}/overview`);
      if (!response.ok) {
        throw new Error(`Failed to get portfolio overview: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to get portfolio overview:', error);
      throw error;
    }
  }

  /**
   * Get portfolio performance analytics
   */
  async getPortfolioPerformance(userId, timeRange = '1y') {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/portfolio/${userId}/performance?timeRange=${timeRange}`);
      if (!response.ok) {
        throw new Error(`Failed to get portfolio performance: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to get portfolio performance:', error);
      throw error;
    }
  }

  /**
   * Get portfolio allocation breakdown
   */
  async getPortfolioAllocation(userId) {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/portfolio/${userId}/allocation`);
      if (!response.ok) {
        throw new Error(`Failed to get portfolio allocation: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to get portfolio allocation:', error);
      throw error;
    }
  }

  // === PROPERTY MANAGEMENT & ANALYTICS ===

  /**
   * Get property analytics dashboard
   */
  async getPropertyAnalyticsDashboard() {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/properties/analytics/dashboard`);
      if (!response.ok) {
        throw new Error(`Failed to get property analytics dashboard: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to get property analytics dashboard:', error);
      throw error;
    }
  }

  /**
   * Get property valuation data
   */
  async getPropertyValuation(propertyId) {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/properties/${propertyId}/valuation`);
      if (!response.ok) {
        throw new Error(`Failed to get property valuation: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to get property valuation:', error);
      throw error;
    }
  }

  /**
   * Update property valuation
   */
  async updatePropertyValuation(propertyId, valuationData) {
    try {
      const response = await secureApiClient.put(`${this.baseUrl}/properties/${propertyId}/valuation`, valuationData);
      if (!response.ok) {
        throw new Error(`Failed to update property valuation: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to update property valuation:', error);
      throw error;
    }
  }

  /**
   * Get property performance metrics
   */
  async getPropertyPerformance(propertyId, timeRange = '1y') {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/properties/${propertyId}/performance?timeRange=${timeRange}`);
      if (!response.ok) {
        throw new Error(`Failed to get property performance: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to get property performance:', error);
      throw error;
    }
  }

  // === TAX REPORTING ===

  /**
   * Generate comprehensive tax report for user
   */
  async generateUserTaxReport(userId, taxYear, reportType = 'comprehensive') {
    try {
      const response = await secureApiClient.post(`${this.baseUrl}/tax-reporting/${userId}/generate`, {
        taxYear,
        reportType
      });
      if (!response.ok) {
        throw new Error(`Failed to generate tax report: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to generate tax report:', error);
      throw error;
    }
  }

  /**
   * Get platform-wide tax analytics
   */
  async getPlatformTaxAnalytics(taxYear) {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/tax-reporting/platform-analytics?taxYear=${taxYear}`);
      if (!response.ok) {
        throw new Error(`Failed to get platform tax analytics: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to get platform tax analytics:', error);
      throw error;
    }
  }

  /**
   * Get tax compliance tracking
   */
  async getTaxComplianceTracking() {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/tax-reporting/compliance-tracking`);
      if (!response.ok) {
        throw new Error(`Failed to get tax compliance tracking: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to get tax compliance tracking:', error);
      throw error;
    }
  }

  /**
   * Download tax document
   */
  async downloadTaxDocument(userId, documentId) {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/tax-reporting/${userId}/documents/${documentId}/download`);
      if (!response.ok) {
        throw new Error(`Failed to download tax document: ${response.status}`);
      }
      return response.blob();
    } catch (error) {
      console.error('❌ Failed to download tax document:', error);
      throw error;
    }
  }

  // ===== PHASE 3: ADVANCED REPORTING, COMPLIANCE & INTEGRATION APIs =====

  // === COMPREHENSIVE REPORTING SYSTEM ===

  /**
   * Execute custom query report
   */
  async executeCustomReport(reportConfig) {
    try {
      const response = await secureApiClient.post(`${this.baseUrl}/reporting/custom-query`, reportConfig);
      if (!response.ok) {
        throw new Error(`Failed to execute custom report: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to execute custom report:', error);
      throw error;
    }
  }

  /**
   * Get saved report templates
   */
  async getReportTemplates() {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/reporting/templates`);
      if (!response.ok) {
        throw new Error(`Failed to get report templates: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to get report templates:', error);
      throw error;
    }
  }

  /**
   * Create report template
   */
  async createReportTemplate(templateData) {
    try {
      const response = await secureApiClient.post(`${this.baseUrl}/reporting/templates`, templateData);
      if (!response.ok) {
        throw new Error(`Failed to create report template: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to create report template:', error);
      throw error;
    }
  }

  /**
   * Schedule automated report
   */
  async scheduleReport(reportId, scheduleConfig) {
    try {
      const response = await secureApiClient.post(`${this.baseUrl}/reporting/${reportId}/schedule`, scheduleConfig);
      if (!response.ok) {
        throw new Error(`Failed to schedule report: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to schedule report:', error);
      throw error;
    }
  }

  // === FULL COMPLIANCE MANAGEMENT ===

  /**
   * Get comprehensive compliance dashboard
   */
  async getComplianceDashboard() {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/compliance/dashboard`);
      if (!response.ok) {
        throw new Error(`Failed to get compliance dashboard: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to get compliance dashboard:', error);
      throw error;
    }
  }

  /**
   * Get regulatory tracking status
   */
  async getRegulatoryTracking() {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/compliance/regulatory-tracking`);
      if (!response.ok) {
        throw new Error(`Failed to get regulatory tracking: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to get regulatory tracking:', error);
      throw error;
    }
  }

  /**
   * Update compliance policy
   */
  async updateCompliancePolicy(policyId, policyData) {
    try {
      const response = await secureApiClient.put(`${this.baseUrl}/compliance/policies/${policyId}`, policyData);
      if (!response.ok) {
        throw new Error(`Failed to update compliance policy: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to update compliance policy:', error);
      throw error;
    }
  }

  /**
   * Get compliance audit trail
   */
  async getComplianceAuditTrail(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await secureApiClient.get(`${this.baseUrl}/compliance/audit-trail?${params}`);
      if (!response.ok) {
        throw new Error(`Failed to get compliance audit trail: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to get compliance audit trail:', error);
      throw error;
    }
  }

  // === INTEGRATION MANAGEMENT ===

  /**
   * Get third-party integration status
   */
  async getIntegrationStatus() {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/integrations/status`);
      if (!response.ok) {
        throw new Error(`Failed to get integration status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to get integration status:', error);
      throw error;
    }
  }

  /**
   * Test integration connection
   */
  async testIntegration(integrationId) {
    try {
      const response = await secureApiClient.post(`${this.baseUrl}/integrations/${integrationId}/test`);
      if (!response.ok) {
        throw new Error(`Failed to test integration: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to test integration:', error);
      throw error;
    }
  }

  /**
   * Update integration configuration
   */
  async updateIntegrationConfig(integrationId, config) {
    try {
      const response = await secureApiClient.put(`${this.baseUrl}/integrations/${integrationId}/config`, config);
      if (!response.ok) {
        throw new Error(`Failed to update integration config: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to update integration config:', error);
      throw error;
    }
  }

  /**
   * Get integration logs
   */
  async getIntegrationLogs(integrationId, timeRange = '7d') {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/integrations/${integrationId}/logs?timeRange=${timeRange}`);
      if (!response.ok) {
        throw new Error(`Failed to get integration logs: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to get integration logs:', error);
      throw error;
    }
  }

  // ===== NETWORK ANALYTICS =====

  /**
   * Get network analytics dashboard overview
   */
  async getNetworkAnalyticsDashboard(timeRange = '24h') {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/network-analytics?timeRange=${timeRange}`);
      if (!response.ok) {
        throw new Error(`Failed to get network analytics dashboard: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to get network analytics dashboard:', error);
      throw error;
    }
  }

  /**
   * Get provider-specific analytics
   */
  async getProviderAnalytics(provider, timeRange = '7d') {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/network-analytics/${provider}?timeRange=${timeRange}`);
      if (!response.ok) {
        throw new Error(`Failed to get provider analytics: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to get provider analytics:', error);
      throw error;
    }
  }

  // ===== ADMIN TODOS & SUPPORT TICKETS =====
  
  /**
   * Get admin todos (KYC requests, support tickets, etc.)
   */
  async getAdminTodos() {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/todos`);
      if (!response.ok) {
        throw new Error(`Failed to fetch admin todos: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch admin todos:', error);
      throw error;
    }
  }

  /**
   * Create support ticket with Slack integration
   */
  async createSupportTicket(ticketData) {
    try {
      const response = await secureApiClient.post(`${this.baseUrl}/support/create`, {
        customerEmail: ticketData.customerEmail,
        subject: ticketData.subject,
        description: ticketData.description
      });
      if (!response.ok) {
        throw new Error(`Failed to create support ticket: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to create support ticket:', error);
      throw error;
    }
  }

  /**
   * Reply to support ticket
   */
  async replySupportTicket(ticketId, reply) {
    try {
      const response = await secureApiClient.post(`${this.baseUrl}/support/reply/${ticketId}`, {
        reply
      });
      if (!response.ok) {
        throw new Error(`Failed to reply to support ticket: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to reply to support ticket:', error);
      throw error;
    }
  }

  /**
   * Get real-time network metrics
   */
  async getRealTimeNetworkMetrics() {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/network-analytics/realtime`);
      if (!response.ok) {
        throw new Error(`Failed to get real-time network metrics: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to get real-time network metrics:', error);
      throw error;
    }
  }

  /**
   * Get cost analysis and optimization
   */
  async getNetworkCostAnalysis(timeRange = '30d') {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/network-analytics/cost-analysis?timeRange=${timeRange}`);
      if (!response.ok) {
        throw new Error(`Failed to get network cost analysis: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to get network cost analysis:', error);
      throw error;
    }
  }

  /**
   * Get error analysis and troubleshooting
   */
  async getNetworkErrorAnalysis(timeRange = '24h', provider = null) {
    try {
      const params = new URLSearchParams({ timeRange });
      if (provider) params.append('provider', provider);
      
      const response = await secureApiClient.get(`${this.baseUrl}/network-analytics/error-analysis?${params}`);
      if (!response.ok) {
        throw new Error(`Failed to get network error analysis: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to get network error analysis:', error);
      throw error;
    }
  }

  /**
   * Get performance benchmarks
   */
  async getNetworkBenchmarks() {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/network-analytics/benchmarks`);
      if (!response.ok) {
        throw new Error(`Failed to get network benchmarks: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to get network benchmarks:', error);
      throw error;
    }
  }

  /**
   * Export network analytics data
   */
  async exportNetworkAnalytics(exportConfig) {
    try {
      const response = await secureApiClient.post(`${this.baseUrl}/network-analytics/export`, exportConfig);
      if (!response.ok) {
        throw new Error(`Failed to export network analytics: ${response.status}`);
      }
      
      // Return blob for file download
      return response.blob();
    } catch (error) {
      console.error('❌ Failed to export network analytics:', error);
      throw error;
    }
  }

  // ===== BATCH OPERATIONS & ANALYTICS =====

  /**
   * Get platform-wide analytics dashboard
   */
  async getPlatformAnalytics(timeRange = '30d') {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/analytics/platform?timeRange=${timeRange}`);
      if (!response.ok) {
        throw new Error(`Failed to get platform analytics: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to get platform analytics:', error);
      throw error;
    }
  }

  /**
   * Bulk user operations
   */
  async bulkUserOperation(operation, userIds, operationData = {}) {
    try {
      const response = await secureApiClient.post(`${this.baseUrl}/users/bulk/${operation}`, {
        userIds,
        ...operationData
      });
      if (!response.ok) {
        throw new Error(`Failed to perform bulk operation: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to perform bulk operation:', error);
      throw error;
    }
  }

  /**
   * Export user data (GDPR compliance)
   */
  async exportUserData(userId, exportType = 'comprehensive') {
    try {
      const response = await secureApiClient.post(`${this.baseUrl}/users/${userId}/export`, {
        exportType
      });
      if (!response.ok) {
        throw new Error(`Failed to export user data: ${response.status}`);
      }
      return response.blob();
    } catch (error) {
      console.error('❌ Failed to export user data:', error);
      throw error;
    }
  }

  // ===== PROVIDER PRICE OVERRIDE MANAGEMENT =====

  /**
   * Get all provider price overrides with filtering
   */
  async getProviderPriceOverrides(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await secureApiClient.get(`${this.baseUrl}/provider-price-overrides?${params}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch provider price overrides: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch provider price overrides:', error);
      throw error;
    }
  }

  /**
   * Create new provider price override
   */
  async createProviderPriceOverride(overrideData) {
    try {
      const response = await secureApiClient.post(`${this.baseUrl}/provider-price-overrides`, overrideData);
      if (!response.ok) {
        throw new Error(`Failed to create provider price override: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to create provider price override:', error);
      throw error;
    }
  }

  /**
   * Get specific provider price override details
   */
  async getProviderPriceOverride(overrideId) {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/provider-price-overrides/${overrideId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch provider price override: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch provider price override:', error);
      throw error;
    }
  }

  /**
   * Update provider price override
   */
  async updateProviderPriceOverride(overrideId, updateData) {
    try {
      const response = await secureApiClient.put(`${this.baseUrl}/provider-price-overrides/${overrideId}`, updateData);
      if (!response.ok) {
        throw new Error(`Failed to update provider price override: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to update provider price override:', error);
      throw error;
    }
  }

  /**
   * Approve provider price override
   */
  async approveProviderPriceOverride(overrideId, approvalNotes = '') {
    try {
      const response = await secureApiClient.post(`${this.baseUrl}/provider-price-overrides/${overrideId}/approve`, {
        approvalNotes
      });
      if (!response.ok) {
        throw new Error(`Failed to approve provider price override: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to approve provider price override:', error);
      throw error;
    }
  }

  /**
   * Reject provider price override
   */
  async rejectProviderPriceOverride(overrideId, rejectionReason, rejectionNotes = '') {
    try {
      const response = await secureApiClient.post(`${this.baseUrl}/provider-price-overrides/${overrideId}/reject`, {
        rejectionReason,
        rejectionNotes
      });
      if (!response.ok) {
        throw new Error(`Failed to reject provider price override: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to reject provider price override:', error);
      throw error;
    }
  }

  /**
   * Archive provider price override
   */
  async archiveProviderPriceOverride(overrideId, archiveReason = '') {
    try {
      const response = await secureApiClient.post(`${this.baseUrl}/provider-price-overrides/${overrideId}/archive`, {
        archiveReason
      });
      if (!response.ok) {
        throw new Error(`Failed to archive provider price override: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to archive provider price override:', error);
      throw error;
    }
  }

  /**
   * Get provider price override analytics dashboard
   */
  async getProviderPriceOverrideAnalytics() {
    try {
      const response = await secureApiClient.get(`${this.baseUrl}/provider-price-overrides/analytics/dashboard`);
      if (!response.ok) {
        throw new Error(`Failed to fetch override analytics: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch override analytics:', error);
      throw error;
    }
  }

  /**
   * Perform bulk actions on provider price overrides
   */
  async bulkProviderPriceOverrideAction(action, overrideIds, actionData = {}) {
    try {
      const response = await secureApiClient.post(`${this.baseUrl}/provider-price-overrides/bulk/${action}`, {
        overrideIds,
        ...actionData
      });
      if (!response.ok) {
        throw new Error(`Failed to perform bulk override action: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to perform bulk override action:', error);
      throw error;
    }
  }

  // ===== COMPREHENSIVE CACHED METHODS FOR ADMIN DATA =====

  /**
   * Get user risk assessment (cached) - caches for 10 minutes
   */
  async getUserRiskAssessmentCached(userId, forceRefresh = false) {
    const cacheKey = `admin_user_risk_${userId}`;
    
    return cacheService.getOrFetch(
      cacheKey,
      () => this.getUserRiskAssessment(userId),
      { ttl: 600000, forceRefresh } // 10 minutes
    );
  }

  /**
   * Get behavioral analysis data (cached) - caches for 15 minutes
   */
  async getBehavioralAnalysisCached(userId, timeRange = '30d', forceRefresh = false) {
    const cacheKey = `admin_behavioral_${userId}_${timeRange}`;
    
    return cacheService.getOrFetch(
      cacheKey,
      () => this.getBehavioralAnalysis(userId, timeRange),
      { ttl: 900000, forceRefresh } // 15 minutes
    );
  }

  /**
   * Get transaction monitoring alerts (cached) - caches for 5 minutes
   */
  async getTransactionAlertsCached(filters = {}, forceRefresh = false) {
    const cacheKey = `admin_transaction_alerts_${JSON.stringify(filters)}`;
    
    return cacheService.getOrFetch(
      cacheKey,
      () => this.getTransactionAlerts(filters),
      { ttl: 300000, forceRefresh } // 5 minutes
    );
  }

  /**
   * Get suspicious activity reports (cached) - caches for 10 minutes
   */
  async getSuspiciousActivityReportsCached(userId = null, forceRefresh = false) {
    const cacheKey = `admin_sar_${userId || 'all'}`;
    
    return cacheService.getOrFetch(
      cacheKey,
      () => this.getSuspiciousActivityReports(userId),
      { ttl: 600000, forceRefresh } // 10 minutes
    );
  }

  /**
   * Get user security overview (cached) - caches for 10 minutes
   */
  async getUserSecurityCached(userId, forceRefresh = false) {
    const cacheKey = `admin_user_security_${userId}`;
    
    return cacheService.getOrFetch(
      cacheKey,
      () => this.getUserSecurity(userId),
      { ttl: 600000, forceRefresh } // 10 minutes
    );
  }

  /**
   * Get user devices (cached) - caches for 15 minutes
   */
  async getUserDevicesCached(userId, forceRefresh = false) {
    const cacheKey = `admin_user_devices_${userId}`;
    
    return cacheService.getOrFetch(
      cacheKey,
      () => this.getUserDevices(userId),
      { ttl: 900000, forceRefresh } // 15 minutes
    );
  }

  /**
   * Get user portfolio overview (cached) - caches for 10 minutes
   */
  async getUserPortfolioOverviewCached(userId, forceRefresh = false) {
    const cacheKey = `admin_portfolio_overview_${userId}`;
    
    return cacheService.getOrFetch(
      cacheKey,
      () => this.getUserPortfolioOverview(userId),
      { ttl: 600000, forceRefresh } // 10 minutes
    );
  }

  /**
   * Get portfolio performance analytics (cached) - caches for 15 minutes
   */
  async getPortfolioPerformanceCached(userId, timeRange = '1y', forceRefresh = false) {
    const cacheKey = `admin_portfolio_performance_${userId}_${timeRange}`;
    
    return cacheService.getOrFetch(
      cacheKey,
      () => this.getPortfolioPerformance(userId, timeRange),
      { ttl: 900000, forceRefresh } // 15 minutes
    );
  }

  /**
   * Get portfolio allocation breakdown (cached) - caches for 10 minutes
   */
  async getPortfolioAllocationCached(userId, forceRefresh = false) {
    const cacheKey = `admin_portfolio_allocation_${userId}`;
    
    return cacheService.getOrFetch(
      cacheKey,
      () => this.getPortfolioAllocation(userId),
      { ttl: 600000, forceRefresh } // 10 minutes
    );
  }

  /**
   * Get property analytics dashboard (cached) - caches for 20 minutes
   */
  async getPropertyAnalyticsDashboardCached(forceRefresh = false) {
    const cacheKey = 'admin_property_analytics_dashboard';
    
    return cacheService.getOrFetch(
      cacheKey,
      () => this.getPropertyAnalyticsDashboard(),
      { ttl: 1200000, forceRefresh } // 20 minutes
    );
  }

  /**
   * Get property valuation data (cached) - caches for 30 minutes
   */
  async getPropertyValuationCached(propertyId, forceRefresh = false) {
    const cacheKey = `admin_property_valuation_${propertyId}`;
    
    return cacheService.getOrFetch(
      cacheKey,
      () => this.getPropertyValuation(propertyId),
      { ttl: 1800000, forceRefresh } // 30 minutes
    );
  }

  /**
   * Get property performance metrics (cached) - caches for 15 minutes
   */
  async getPropertyPerformanceCached(propertyId, timeRange = '1y', forceRefresh = false) {
    const cacheKey = `admin_property_performance_${propertyId}_${timeRange}`;
    
    return cacheService.getOrFetch(
      cacheKey,
      () => this.getPropertyPerformance(propertyId, timeRange),
      { ttl: 900000, forceRefresh } // 15 minutes
    );
  }

  /**
   * Get report templates (cached) - caches for 30 minutes
   */
  async getReportTemplatesCached(forceRefresh = false) {
    const cacheKey = 'admin_report_templates';
    
    return cacheService.getOrFetch(
      cacheKey,
      () => this.getReportTemplates(),
      { ttl: 1800000, forceRefresh } // 30 minutes
    );
  }

  /**
   * Get comprehensive compliance dashboard (cached) - caches for 15 minutes
   */
  async getComplianceDashboardCached(forceRefresh = false) {
    const cacheKey = 'admin_compliance_dashboard';
    
    return cacheService.getOrFetch(
      cacheKey,
      () => this.getComplianceDashboard(),
      { ttl: 900000, forceRefresh } // 15 minutes
    );
  }

  /**
   * Get regulatory tracking status (cached) - caches for 20 minutes
   */
  async getRegulatoryTrackingCached(forceRefresh = false) {
    const cacheKey = 'admin_regulatory_tracking';
    
    return cacheService.getOrFetch(
      cacheKey,
      () => this.getRegulatoryTracking(),
      { ttl: 1200000, forceRefresh } // 20 minutes
    );
  }

  /**
   * Get compliance audit trail (cached) - caches for 10 minutes
   */
  async getComplianceAuditTrailCached(filters = {}, forceRefresh = false) {
    const cacheKey = `admin_compliance_audit_${JSON.stringify(filters)}`;
    
    return cacheService.getOrFetch(
      cacheKey,
      () => this.getComplianceAuditTrail(filters),
      { ttl: 600000, forceRefresh } // 10 minutes
    );
  }

  /**
   * Get third-party integration status (cached) - caches for 15 minutes
   */
  async getIntegrationStatusCached(forceRefresh = false) {
    const cacheKey = 'admin_integration_status';
    
    return cacheService.getOrFetch(
      cacheKey,
      () => this.getIntegrationStatus(),
      { ttl: 900000, forceRefresh } // 15 minutes
    );
  }

  /**
   * Get network analytics dashboard (cached) - caches for 10 minutes
   */
  async getNetworkAnalyticsDashboardCached(timeRange = '24h', forceRefresh = false) {
    const cacheKey = `admin_network_analytics_${timeRange}`;
    
    return cacheService.getOrFetch(
      cacheKey,
      () => this.getNetworkAnalyticsDashboard(timeRange),
      { ttl: 600000, forceRefresh } // 10 minutes
    );
  }

  /**
   * Get provider-specific analytics (cached) - caches for 15 minutes
   */
  async getProviderAnalyticsCached(provider, timeRange = '7d', forceRefresh = false) {
    const cacheKey = `admin_provider_analytics_${provider}_${timeRange}`;
    
    return cacheService.getOrFetch(
      cacheKey,
      () => this.getProviderAnalytics(provider, timeRange),
      { ttl: 900000, forceRefresh } // 15 minutes
    );
  }

  /**
   * Get network cost analysis (cached) - caches for 30 minutes
   */
  async getNetworkCostAnalysisCached(timeRange = '30d', forceRefresh = false) {
    const cacheKey = `admin_network_cost_${timeRange}`;
    
    return cacheService.getOrFetch(
      cacheKey,
      () => this.getNetworkCostAnalysis(timeRange),
      { ttl: 1800000, forceRefresh } // 30 minutes
    );
  }

  /**
   * Get network error analysis (cached) - caches for 10 minutes
   */
  async getNetworkErrorAnalysisCached(timeRange = '24h', provider = null, forceRefresh = false) {
    const cacheKey = `admin_network_errors_${timeRange}_${provider || 'all'}`;
    
    return cacheService.getOrFetch(
      cacheKey,
      () => this.getNetworkErrorAnalysis(timeRange, provider),
      { ttl: 600000, forceRefresh } // 10 minutes
    );
  }

  /**
   * Get network performance benchmarks (cached) - caches for 60 minutes
   */
  async getNetworkBenchmarksCached(forceRefresh = false) {
    const cacheKey = 'admin_network_benchmarks';
    
    return cacheService.getOrFetch(
      cacheKey,
      () => this.getNetworkBenchmarks(),
      { ttl: 3600000, forceRefresh } // 60 minutes
    );
  }

  /**
   * Get platform-wide analytics dashboard (cached) - caches for 15 minutes
   */
  async getPlatformAnalyticsCached(timeRange = '30d', forceRefresh = false) {
    const cacheKey = `admin_platform_analytics_${timeRange}`;
    
    return cacheService.getOrFetch(
      cacheKey,
      () => this.getPlatformAnalytics(timeRange),
      { ttl: 900000, forceRefresh } // 15 minutes
    );
  }

  /**
   * Get provider price overrides (cached) - caches for 10 minutes
   */
  async getProviderPriceOverridesCached(filters = {}, forceRefresh = false) {
    const cacheKey = `admin_price_overrides_${JSON.stringify(filters)}`;
    
    return cacheService.getOrFetch(
      cacheKey,
      () => this.getProviderPriceOverrides(filters),
      { ttl: 600000, forceRefresh } // 10 minutes
    );
  }

  /**
   * Get specific provider price override (cached) - caches for 15 minutes
   */
  async getProviderPriceOverrideCached(overrideId, forceRefresh = false) {
    const cacheKey = `admin_price_override_${overrideId}`;
    
    return cacheService.getOrFetch(
      cacheKey,
      () => this.getProviderPriceOverride(overrideId),
      { ttl: 900000, forceRefresh } // 15 minutes
    );
  }

  /**
   * Get provider price override analytics (cached) - caches for 20 minutes
   */
  async getProviderPriceOverrideAnalyticsCached(forceRefresh = false) {
    const cacheKey = 'admin_price_override_analytics';
    
    return cacheService.getOrFetch(
      cacheKey,
      () => this.getProviderPriceOverrideAnalytics(),
      { ttl: 1200000, forceRefresh } // 20 minutes
    );
  }

  /**
   * Get platform tax analytics (cached) - caches for 30 minutes
   */
  async getPlatformTaxAnalyticsCached(taxYear, forceRefresh = false) {
    const cacheKey = `admin_tax_analytics_${taxYear}`;
    
    return cacheService.getOrFetch(
      cacheKey,
      () => this.getPlatformTaxAnalytics(taxYear),
      { ttl: 1800000, forceRefresh } // 30 minutes
    );
  }

  /**
   * Get tax compliance tracking (cached) - caches for 30 minutes
   */
  async getTaxComplianceTrackingCached(forceRefresh = false) {
    const cacheKey = 'admin_tax_compliance_tracking';
    
    return cacheService.getOrFetch(
      cacheKey,
      () => this.getTaxComplianceTracking(),
      { ttl: 1800000, forceRefresh } // 30 minutes
    );
  }

  // ===== COMPREHENSIVE ADMIN DASHBOARD DATA (BATCH CACHED) =====

  /**
   * Get all admin dashboard data in one cached call - caches for 10 minutes
   * Includes users, alerts, analytics, and compliance data
   */
  async getAllAdminDashboardDataCached(filters = {}, forceRefresh = false) {
    const cacheKey = `admin_dashboard_all_${JSON.stringify(filters)}`;
    
    return cacheService.getOrFetch(
      cacheKey,
      async () => {
        // Batch fetch all major admin dashboard components
        const [users, alerts, complianceDashboard, platformAnalytics, networkAnalytics, integrationStatus] = await Promise.all([
          this.getAllUsers(filters.userFilters || {}),
          this.getTransactionAlerts(filters.alertFilters || {}),
          this.getComplianceDashboard(),
          this.getPlatformAnalytics(filters.timeRange || '30d'),
          this.getNetworkAnalyticsDashboard(filters.networkTimeRange || '24h'),
          this.getIntegrationStatus()
        ]);
        
        return {
          users,
          alerts,
          complianceDashboard,
          platformAnalytics,
          networkAnalytics,
          integrationStatus,
          lastUpdated: new Date().toISOString()
        };
      },
      { ttl: 600000, forceRefresh } // 10 minutes
    );
  }

  // ===== CACHE MANAGEMENT FOR ADMIN =====

  /**
   * Clear all admin-related cache entries
   */
  clearAdminCache() {
    const adminKeys = cacheService.getKeys().filter(key => key.startsWith('admin_'));
    adminKeys.forEach(key => cacheService.delete(key));
    console.log(`✨ Cleared ${adminKeys.length} admin cache entries`);
  }

  /**
   * Clear cache for specific user's admin data
   */
  clearUserAdminCache(userId) {
    const userKeys = cacheService.getKeys().filter(key => 
      key.startsWith('admin_') && key.includes(`_${userId}`)
    );
    userKeys.forEach(key => cacheService.delete(key));
    console.log(`✨ Cleared ${userKeys.length} cache entries for user ${userId}`);
  }

  /**
   * Get admin cache statistics
   */
  getAdminCacheStats() {
    const allKeys = cacheService.getKeys();
    const adminKeys = allKeys.filter(key => key.startsWith('admin_'));
    
    return {
      totalCacheEntries: allKeys.length,
      adminCacheEntries: adminKeys.length,
      adminCacheKeys: adminKeys,
      overallCacheStats: cacheService.getStats()
    };
  }

  /**
   * Test cache functionality - for debugging
   */
  async testCacheFunction() {
    const testKey = 'test_cache';
    const testData = { message: 'Cache is working!', timestamp: Date.now() };
    
    // Set test data in cache
    cacheService.set(testKey, testData, {}, 300000); // 5 minutes
    console.log('📦 Set test data in cache');
    
    // Try to get it back
    const cached = cacheService.get(testKey);
    console.log('📦 Retrieved from cache:', cached);
    
    return cached;
  }
}

// Create singleton instance
const adminApiService = new AdminApiService();

export { AdminApiService };
export default adminApiService;
