/**
 * Security API Service
 * Handles all security monitoring, audit logs, and security control APIs
 */

import secureApiClient from '../../../shared/utils/secureApiClient';
import cacheService from '../../../shared/services/cacheService';

class SecurityApiService {
  constructor() {
    this.cachePrefix = 'security_';
    this.defaultCacheTTL = 5 * 60 * 1000; // 5 minutes for security data
  }

  /**
   * Authentication & Authorization Monitoring
   */
  
  // Get authentication metrics and stats
  async getAuthMetrics(timeRange = '24h', forceRefresh = false) {
    const cacheKey = `${this.cachePrefix}auth_metrics_${timeRange}`;
    
    return cacheService.getOrFetch(cacheKey, async () => {
      const response = await secureApiClient.get(`/api/admin/security/auth-metrics?timeRange=${timeRange}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch auth metrics: ${response.status}`);
      }
      
      return response.json();
    }, { ttl: this.defaultCacheTTL, forceRefresh });
  }

  // Get failed login attempts
  async getFailedLogins(timeRange = '24h', limit = 100, forceRefresh = false) {
    const cacheKey = `${this.cachePrefix}failed_logins_${timeRange}_${limit}`;
    
    return cacheService.getOrFetch(cacheKey, async () => {
      const response = await secureApiClient.get(`/api/admin/security/failed-logins?timeRange=${timeRange}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch failed logins: ${response.status}`);
      }
      
      return response.json();
    }, { ttl: this.defaultCacheTTL, forceRefresh });
  }

  // Get active user sessions
  async getActiveSessions(forceRefresh = false) {
    const cacheKey = `${this.cachePrefix}active_sessions`;
    
    return cacheService.getOrFetch(cacheKey, async () => {
      const response = await secureApiClient.get('/api/admin/security/active-sessions');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch active sessions: ${response.status}`);
      }
      
      return response.json();
    }, { ttl: 60000, forceRefresh }); // 1 minute cache for sessions
  }

  // Terminate user session
  async terminateSession(sessionId, reason = '') {
    const response = await secureApiClient.post('/api/admin/security/terminate-session', {
      sessionId,
      reason
    });
    
    if (!response.ok) {
      throw new Error(`Failed to terminate session: ${response.status}`);
    }
    
    // Invalidate session cache
    cacheService.delete(`${this.cachePrefix}active_sessions`);
    
    return response.json();
  }

  /**
   * API Security Monitoring
   */
  
  // Get API security metrics
  async getApiSecurityMetrics(timeRange = '24h', forceRefresh = false) {
    const cacheKey = `${this.cachePrefix}api_metrics_${timeRange}`;
    
    return cacheService.getOrFetch(cacheKey, async () => {
      const response = await secureApiClient.get(`/api/admin/security/api-metrics?timeRange=${timeRange}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch API security metrics: ${response.status}`);
      }
      
      return response.json();
    }, { ttl: this.defaultCacheTTL, forceRefresh });
  }

  // Get rate limiting status and blocked IPs
  async getRateLimitingStatus(forceRefresh = false) {
    const cacheKey = `${this.cachePrefix}rate_limiting`;
    
    return cacheService.getOrFetch(cacheKey, async () => {
      const response = await secureApiClient.get('/api/admin/security/rate-limiting');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch rate limiting status: ${response.status}`);
      }
      
      return response.json();
    }, { ttl: 30000, forceRefresh }); // 30 seconds cache
  }

  // Block or unblock IP address
  async updateBlockedIP(ipAddress, action, reason = '', duration = null) {
    const response = await secureApiClient.post('/api/admin/security/blocked-ips', {
      ipAddress,
      action, // 'block' or 'unblock'
      reason,
      duration
    });
    
    if (!response.ok) {
      throw new Error(`Failed to ${action} IP: ${response.status}`);
    }
    
    // Invalidate rate limiting cache
    cacheService.delete(`${this.cachePrefix}rate_limiting`);
    
    return response.json();
  }

  /**
   * Threat Detection & Attack Monitoring
   */
  
  // Get security threats and attack attempts
  async getSecurityThreats(timeRange = '24h', severity = 'all', forceRefresh = false) {
    const cacheKey = `${this.cachePrefix}threats_${timeRange}_${severity}`;
    
    return cacheService.getOrFetch(cacheKey, async () => {
      const response = await secureApiClient.get(
        `/api/admin/security/threats?timeRange=${timeRange}&severity=${severity}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch security threats: ${response.status}`);
      }
      
      return response.json();
    }, { ttl: this.defaultCacheTTL, forceRefresh });
  }

  // Get CSRF attack attempts
  async getCsrfAttempts(timeRange = '24h', forceRefresh = false) {
    const cacheKey = `${this.cachePrefix}csrf_attempts_${timeRange}`;
    
    return cacheService.getOrFetch(cacheKey, async () => {
      const response = await secureApiClient.get(`/api/admin/security/csrf-attempts?timeRange=${timeRange}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch CSRF attempts: ${response.status}`);
      }
      
      return response.json();
    }, { ttl: this.defaultCacheTTL, forceRefresh });
  }

  // Get XSS attack attempts
  async getXssAttempts(timeRange = '24h', forceRefresh = false) {
    const cacheKey = `${this.cachePrefix}xss_attempts_${timeRange}`;
    
    return cacheService.getOrFetch(cacheKey, async () => {
      const response = await secureApiClient.get(`/api/admin/security/xss-attempts?timeRange=${timeRange}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch XSS attempts: ${response.status}`);
      }
      
      return response.json();
    }, { ttl: this.defaultCacheTTL, forceRefresh });
  }

  /**
   * Security Audit Logs
   */
  
  // Get comprehensive security audit logs
  async getAuditLogs(filters = {}, forceRefresh = false) {
    const {
      timeRange = '24h',
      eventType = 'all',
      userId = null,
      severity = 'all',
      page = 1,
      limit = 50
    } = filters;
    
    const cacheKey = `${this.cachePrefix}audit_logs_${timeRange}_${eventType}_${userId}_${severity}_${page}_${limit}`;
    
    return cacheService.getOrFetch(cacheKey, async () => {
      const queryParams = new URLSearchParams({
        timeRange,
        eventType,
        severity,
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (userId) queryParams.append('userId', userId);
      
      const response = await secureApiClient.get(`/api/admin/security/audit-logs?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch audit logs: ${response.status}`);
      }
      
      return response.json();
    }, { ttl: this.defaultCacheTTL, forceRefresh });
  }

  // Export audit logs
  async exportAuditLogs(filters = {}, format = 'csv') {
    const queryParams = new URLSearchParams({ ...filters, format });
    
    const response = await secureApiClient.get(`/api/admin/security/audit-logs/export?${queryParams}`, {
      headers: {
        'Accept': format === 'pdf' ? 'application/pdf' : 'text/csv'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to export audit logs: ${response.status}`);
    }
    
    return response.blob();
  }

  /**
   * Security Configuration & Policies
   */
  
  // Get security configuration
  async getSecurityConfig(forceRefresh = false) {
    const cacheKey = `${this.cachePrefix}config`;
    
    return cacheService.getOrFetch(cacheKey, async () => {
      const response = await secureApiClient.get('/api/admin/security/config');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch security config: ${response.status}`);
      }
      
      return response.json();
    }, { ttl: 10 * 60 * 1000, forceRefresh }); // 10 minutes cache for config
  }

  // Update security configuration
  async updateSecurityConfig(config) {
    const response = await secureApiClient.put('/api/admin/security/config', config);
    
    if (!response.ok) {
      throw new Error(`Failed to update security config: ${response.status}`);
    }
    
    // Invalidate config cache
    cacheService.delete(`${this.cachePrefix}config`);
    
    return response.json();
  }

  // Get security policies
  async getSecurityPolicies(forceRefresh = false) {
    const cacheKey = `${this.cachePrefix}policies`;
    
    return cacheService.getOrFetch(cacheKey, async () => {
      const response = await secureApiClient.get('/api/admin/security/policies');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch security policies: ${response.status}`);
      }
      
      return response.json();
    }, { ttl: 15 * 60 * 1000, forceRefresh }); // 15 minutes cache for policies
  }

  /**
   * Real-time Security Monitoring
   */
  
  // Get real-time security dashboard data
  async getSecurityDashboard(forceRefresh = false) {
    // Don't cache real-time data
    const response = await secureApiClient.get('/api/admin/security/dashboard/realtime');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch security dashboard: ${response.status}`);
    }
    
    return response.json();
  }

  // Get security controls dashboard data (main dashboard)
  async getSecurityControlsDashboard(forceRefresh = false) {
    const cacheKey = `${this.cachePrefix}controls_dashboard`;
    
    return cacheService.getOrFetch(cacheKey, async () => {
      const response = await secureApiClient.get('/api/admin/security/dashboard');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch security controls dashboard: ${response.status}`);
      }
      
      return response.json();
    }, { ttl: this.defaultCacheTTL, forceRefresh });
  }

  // Get user sessions
  async getUserSessions(userId) {
    const response = await secureApiClient.get(`/api/admin/security/sessions/${userId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user sessions: ${response.status}`);
    }
    
    return response.json();
  }

  // Get user security logs
  async getUserSecurityLogs(userId) {
    const response = await secureApiClient.get(`/api/admin/security/logs/${userId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user security logs: ${response.status}`);
    }
    
    return response.json();
  }

  // Force logout user
  async forceLogoutUser(userId, sessionId = 'all') {
    const response = await secureApiClient.post('/api/admin/security/force-logout', {
      userId,
      sessionId
    });
    
    if (!response.ok) {
      throw new Error(`Failed to force logout: ${response.status}`);
    }
    
    // Invalidate session cache
    cacheService.delete(`${this.cachePrefix}active_sessions`);
    cacheService.delete(`${this.cachePrefix}controls_dashboard`);
    
    return response.json();
  }

  // Toggle 2FA for user
  async toggle2FA(userId, action) {
    const response = await secureApiClient.post('/api/admin/security/2fa', {
      userId,
      action
    });
    
    if (!response.ok) {
      throw new Error(`Failed to toggle 2FA: ${response.status}`);
    }
    
    // Invalidate related caches
    cacheService.delete(`${this.cachePrefix}controls_dashboard`);
    
    return response.json();
  }

  // Execute security action
  async executeSecurityAction(userId, action, reason = '') {
    const response = await secureApiClient.post('/api/admin/security/action', {
      userId,
      action,
      reason
    });
    
    if (!response.ok) {
      throw new Error(`Failed to execute security action: ${response.status}`);
    }
    
    // Invalidate related caches
    cacheService.delete(`${this.cachePrefix}controls_dashboard`);
    cacheService.delete(`${this.cachePrefix}user_profiles`);
    
    return response.json();
  }

  /**
   * Advanced Security Controls for IT Teams
   */

  // Get suspicious activity from audit logs - using real backend data
  async getSuspiciousActivity(timeRange = '24h', severity = 'all', forceRefresh = false) {
    const cacheKey = `${this.cachePrefix}suspicious_activity_${timeRange}_${severity}`;
    
    return cacheService.getOrFetch(cacheKey, async () => {
      // Get audit logs to identify suspicious activity
      const response = await secureApiClient.get('/api/admin/audit-logs');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch audit logs: ${response.status}`);
      }
      
      const data = await response.json();
      const logs = data.logs || [];
      
      // Filter for suspicious activity patterns
      const suspiciousLogs = logs.filter(log => 
        log.event?.includes('failed') || 
        log.event?.includes('blocked') || 
        log.event?.includes('suspend')
      );
      
      const alerts = suspiciousLogs.map(log => ({
        title: `Security Event: ${log.event}`,
        description: `${log.event} detected from IP ${log.ipAddress || 'unknown'}`,
        severity: log.event?.includes('failed') ? 'medium' : 'high',
        user: { email: log.user?.email || 'unknown' },
        sourceIp: log.ipAddress || 'unknown',
        timestamp: new Date(log.timestamp || log.createdAt),
        type: log.event
      }));
      
      return {
        alerts,
        totalAlerts: alerts.length,
        criticalAlerts: alerts.filter(a => a.severity === 'critical').length,
        highAlerts: alerts.filter(a => a.severity === 'high').length,
        mediumAlerts: alerts.filter(a => a.severity === 'medium').length,
        lowAlerts: alerts.filter(a => a.severity === 'low').length
      };
    }, { ttl: 60000, forceRefresh }); // 1 minute cache for alerts
  }

  // Get IP address analytics from audit logs - using real backend data
  async getIpAnalytics(forceRefresh = false) {
    const cacheKey = `${this.cachePrefix}ip_analytics`;
    
    return cacheService.getOrFetch(cacheKey, async () => {
      // Get audit logs to analyze IP patterns
      const response = await secureApiClient.get('/api/admin/audit-logs');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch audit logs: ${response.status}`);
      }
      
      const data = await response.json();
      const logs = data.logs || [];
      
      // Extract and analyze IP addresses
      const ipCounts = {};
      const suspiciousIps = new Set();
      
      logs.forEach(log => {
        const ip = log.ipAddress;
        if (ip) {
          ipCounts[ip] = (ipCounts[ip] || 0) + 1;
          
          // Mark IPs with suspicious activity
          if (log.event?.includes('failed') || log.event?.includes('blocked')) {
            suspiciousIps.add(ip);
          }
        }
      });
      
      const topIps = Object.entries(ipCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);
      
      return {
        topIps: topIps.map(([ip, count]) => ({ ip, count })),
        totalUniqueIps: Object.keys(ipCounts).length,
        suspiciousIps: Array.from(suspiciousIps),
        newIpsToday: Object.keys(ipCounts).length // Simplified metric
      };
    }, { ttl: 5 * 60 * 1000, forceRefresh }); // 5 minutes cache
  }

  // Bulk security actions on multiple users
  async bulkSecurityActions(userIds, action, reason = '') {
    const response = await secureApiClient.post('/api/admin/security/bulk-action', {
      userIds,
      action,
      reason
    });
    
    if (!response.ok) {
      throw new Error(`Failed to execute bulk security action: ${response.status}`);
    }
    
    // Invalidate related caches
    cacheService.delete(`${this.cachePrefix}controls_dashboard`);
    cacheService.delete(`${this.cachePrefix}user_profiles`);
    
    return response.json();
  }


  // Force password reset for users
  async forcePasswordReset(userIds, reason = '') {
    const response = await secureApiClient.post('/api/admin/security/force-password-reset', {
      userIds: Array.isArray(userIds) ? userIds : [userIds],
      reason
    });
    
    if (!response.ok) {
      throw new Error(`Failed to force password reset: ${response.status}`);
    }
    
    // Invalidate related caches
    cacheService.delete(`${this.cachePrefix}password_violations`);
    cacheService.delete(`${this.cachePrefix}controls_dashboard`);
    
    return response.json();
  }

  // Account lockout management - using real data from backend
  async getLockedAccounts(forceRefresh = false) {
    const cacheKey = `${this.cachePrefix}locked_accounts`;
    
    return cacheService.getOrFetch(cacheKey, async () => {
      // Get suspended users from the existing users endpoint
      const response = await secureApiClient.get('/api/admin/users');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }
      
      const data = await response.json();
      const suspendedUsers = data.users.filter(user => user.suspended === true);
      
      return {
        accounts: suspendedUsers.map(user => ({
          user: { _id: user._id, email: user.email },
          lockedAt: user.suspendedAt || user.createdAt,
          reason: user.suspensionReason || 'Account suspended',
          duration: 'Indefinite',
          lockedBy: user.suspendedBy || 'System'
        })),
        totalLocked: suspendedUsers.length
      };
    }, { ttl: 2 * 60 * 1000, forceRefresh }); // 2 minutes cache
  }

  // Unlock user accounts
  async unlockAccount(userId, reason = '') {
    const response = await secureApiClient.post('/api/admin/security/unlock-account', {
      userId,
      reason
    });
    
    if (!response.ok) {
      throw new Error(`Failed to unlock account: ${response.status}`);
    }
    
    // Invalidate related caches
    cacheService.delete(`${this.cachePrefix}locked_accounts`);
    cacheService.delete(`${this.cachePrefix}controls_dashboard`);
    
    return response.json();
  }

  // Security compliance reports
  async getComplianceReport(reportType = 'security_overview', timeRange = '30d', forceRefresh = false) {
    const cacheKey = `${this.cachePrefix}compliance_${reportType}_${timeRange}`;
    
    return cacheService.getOrFetch(cacheKey, async () => {
      const response = await secureApiClient.get(`/api/admin/security/compliance-report?type=${reportType}&timeRange=${timeRange}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch compliance report: ${response.status}`);
      }
      
      return response.json();
    }, { ttl: 15 * 60 * 1000, forceRefresh }); // 15 minutes cache
  }

  // Export compliance reports
  async exportComplianceReport(reportType = 'security_overview', timeRange = '30d', format = 'pdf') {
    const response = await secureApiClient.get(
      `/api/admin/security/compliance-report/export?type=${reportType}&timeRange=${timeRange}&format=${format}`,
      {
        headers: {
          'Accept': format === 'pdf' ? 'application/pdf' : 'text/csv'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to export compliance report: ${response.status}`);
    }
    
    return response.blob();
  }


  /**
   * User & Role Management Security
   */
  
  // Get user security profiles
  async getUserSecurityProfiles(forceRefresh = false) {
    const cacheKey = `${this.cachePrefix}user_profiles`;
    
    return cacheService.getOrFetch(cacheKey, async () => {
      const response = await secureApiClient.get('/api/admin/security/user-profiles');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user security profiles: ${response.status}`);
      }
      
      return response.json();
    }, { ttl: 5 * 60 * 1000, forceRefresh }); // 5 minutes cache
  }

  // Update user security settings
  async updateUserSecurity(userId, settings) {
    const response = await secureApiClient.put(`/api/admin/security/users/${userId}`, settings);
    
    if (!response.ok) {
      throw new Error(`Failed to update user security: ${response.status}`);
    }
    
    // Invalidate related caches
    cacheService.delete(`${this.cachePrefix}user_profiles`);
    cacheService.delete(`${this.cachePrefix}active_sessions`);
    
    return response.json();
  }

  // Get device fingerprints from audit logs - using real backend data
  async getDeviceFingerprints(forceRefresh = false) {
    const cacheKey = `${this.cachePrefix}device_fingerprints`;
    
    return cacheService.getOrFetch(cacheKey, async () => {
      // Get audit logs to analyze device patterns
      const response = await secureApiClient.get('/api/admin/audit-logs');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch audit logs: ${response.status}`);
      }
      
      const data = await response.json();
      const logs = data.logs || [];
      
      // Extract device info from logs
      const deviceMap = new Map();
      
      logs.forEach(log => {
        const deviceInfo = log.userAgent || 'Unknown Device';
        const userEmail = log.user?.email || 'Unknown User';
        const ip = log.ipAddress || 'Unknown IP';
        const deviceKey = `${userEmail}_${deviceInfo}_${ip}`;
        
        if (!deviceMap.has(deviceKey)) {
          deviceMap.set(deviceKey, {
            user: { email: userEmail },
            deviceInfo: deviceInfo.includes('Mobile') ? 'Mobile Device' : 
                       deviceInfo.includes('Tablet') ? 'Tablet' : 'Desktop/Laptop',
            userAgent: deviceInfo,
            location: log.location || 'Unknown Location',
            lastSeen: new Date(log.timestamp || log.createdAt),
            riskScore: Math.floor(Math.random() * 100), // Placeholder risk scoring
            firstSeen: new Date(log.timestamp || log.createdAt)
          });
        } else {
          // Update last seen
          const existing = deviceMap.get(deviceKey);
          const logDate = new Date(log.timestamp || log.createdAt);
          if (logDate > existing.lastSeen) {
            existing.lastSeen = logDate;
          }
        }
      });
      
      return {
        devices: Array.from(deviceMap.values()),
        totalDevices: deviceMap.size
      };
    }, { ttl: 5 * 60 * 1000, forceRefresh }); // 5 minutes cache
  }

  // Get password violations - using real backend data
  async getPasswordViolations(forceRefresh = false) {
    const cacheKey = `${this.cachePrefix}password_violations`;
    
    return cacheService.getOrFetch(cacheKey, async () => {
      // Get users to analyze password issues
      const response = await secureApiClient.get('/api/admin/users');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }
      
      const data = await response.json();
      const users = data.users || [];
      
      // Analyze users for password violations
      const violations = users
        .filter(user => {
          // Check for accounts that haven't logged in (password never used)
          if (!user.lastLogin) return true;
          
          // Check for old accounts (password likely old)
          const accountAge = (new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24);
          if (accountAge > 180) return true; // 6 months
          
          return false;
        })
        .map(user => ({
          user: { _id: user._id, email: user.email },
          issue: !user.lastLogin ? 'Never logged in - password unused' : 'Account over 6 months old - password likely stale',
          detectedAt: new Date(),
          severity: !user.lastLogin ? 'high' : 'medium',
          type: !user.lastLogin ? 'unused_account' : 'stale_password'
        }));
      
      return {
        violations,
        totalViolations: violations.length,
        highSeverity: violations.filter(v => v.severity === 'high').length,
        mediumSeverity: violations.filter(v => v.severity === 'medium').length
      };
    }, { ttl: 10 * 60 * 1000, forceRefresh }); // 10 minutes cache
  }

  // Get security incidents - using mock data for now
  async getSecurityIncidents(forceRefresh = false) {
    const cacheKey = `${this.cachePrefix}security_incidents`;
    
    return cacheService.getOrFetch(cacheKey, async () => {
      // Mock security incidents for demonstration
      const incidents = [
        {
          _id: 'incident_1',
          title: 'Multiple Failed Login Attempts',
          description: 'Detected 15 failed login attempts from IP 192.168.1.100 in last hour',
          status: 'investigating',
          severity: 'medium',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          assignee: { name: 'Security Team' },
          type: 'brute_force_attempt'
        },
        {
          _id: 'incident_2',
          title: 'Suspicious API Usage Pattern',
          description: 'Unusual API call pattern detected from user account',
          status: 'open',
          severity: 'high',
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          assignee: { name: 'Admin Team' },
          type: 'suspicious_activity'
        }
      ];
      
      return {
        incidents,
        totalIncidents: incidents.length,
        openIncidents: incidents.filter(i => i.status === 'open').length,
        investigatingIncidents: incidents.filter(i => i.status === 'investigating').length,
        resolvedIncidents: incidents.filter(i => i.status === 'resolved').length
      };
    }, { ttl: 2 * 60 * 1000, forceRefresh }); // 2 minutes cache
  }

  // Create security incident
  async createIncident(incidentData) {
    const response = await secureApiClient.post('/api/admin/security/incidents', incidentData);
    
    if (!response.ok) {
      throw new Error(`Failed to create security incident: ${response.status}`);
    }
    
    // Invalidate incidents cache
    cacheService.delete(`${this.cachePrefix}security_incidents`);
    
    return response.json();
  }

  // Get threat intelligence - using mock data
  async getThreatIntelligence(forceRefresh = false) {
    const cacheKey = `${this.cachePrefix}threat_intelligence`;
    
    return cacheService.getOrFetch(cacheKey, async () => {
      // Mock threat intelligence data
      return {
        maliciousIps: Math.floor(Math.random() * 50) + 10,
        suspiciousPatterns: Math.floor(Math.random() * 25) + 5,
        knownThreats: Math.floor(Math.random() * 100) + 20,
        blockedAttempts: Math.floor(Math.random() * 500) + 100,
        lastUpdated: new Date()
      };
    }, { ttl: 15 * 60 * 1000, forceRefresh }); // 15 minutes cache
  }

  // Get automation rules - using mock data for now
  async getAutomationRules(forceRefresh = false) {
    const cacheKey = `${this.cachePrefix}automation_rules`;
    
    return cacheService.getOrFetch(cacheKey, async () => {
      // Mock automation rules
      const rules = [
        {
          _id: 'rule_1',
          name: 'Failed Login Lockout',
          description: 'Lock account after 5 failed login attempts',
          enabled: true,
          trigger: 'failed_login_attempts',
          action: 'lock_account',
          executionCount: 12,
          createdAt: new Date('2024-01-01')
        },
        {
          _id: 'rule_2',
          name: 'Suspicious IP Block',
          description: 'Block IPs with suspicious activity patterns',
          enabled: true,
          trigger: 'suspicious_ip_activity',
          action: 'block_ip',
          executionCount: 8,
          createdAt: new Date('2024-01-15')
        },
        {
          _id: 'rule_3',
          name: 'Admin Notification',
          description: 'Notify admins of critical security events',
          enabled: false,
          trigger: 'critical_security_event',
          action: 'notify_admin',
          executionCount: 3,
          createdAt: new Date('2024-02-01')
        }
      ];
      
      return {
        rules,
        totalRules: rules.length,
        enabledRules: rules.filter(r => r.enabled).length,
        disabledRules: rules.filter(r => !r.enabled).length
      };
    }, { ttl: 10 * 60 * 1000, forceRefresh }); // 10 minutes cache
  }

  // Save automation rule
  async saveAutomationRule(ruleData) {
    const method = ruleData.id ? 'PUT' : 'POST';
    const url = ruleData.id ? `/api/admin/security/automation-rules/${ruleData.id}` : '/api/admin/security/automation-rules';
    
    const response = await secureApiClient.request(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ruleData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to save automation rule: ${response.status}`);
    }
    
    // Invalidate automation rules cache
    cacheService.delete(`${this.cachePrefix}automation_rules`);
    
    return response.json();
  }

  // Toggle automation rule
  async toggleAutomationRule(ruleId, enabled) {
    const response = await secureApiClient.patch(`/api/admin/security/automation-rules/${ruleId}`, {
      enabled
    });
    
    if (!response.ok) {
      throw new Error(`Failed to toggle automation rule: ${response.status}`);
    }
    
    // Invalidate automation rules cache
    cacheService.delete(`${this.cachePrefix}automation_rules`);
    
    return response.json();
  }

  // Get network security status - using mock data
  async getNetworkSecurityStatus(forceRefresh = false) {
    const cacheKey = `${this.cachePrefix}network_security_status`;
    
    return cacheService.getOrFetch(cacheKey, async () => {
      // Mock network security status
      return {
        firewallStatus: 'active',
        intrusionDetection: 'active',
        ddosProtection: 'active',
        sslStatus: 'valid',
        vulnerabilityScans: {
          lastScan: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
          criticalIssues: 0,
          highIssues: 2,
          mediumIssues: 5,
          lowIssues: 12
        },
        networkTraffic: {
          normalTraffic: 85,
          suspiciousTraffic: 12,
          blockedTraffic: 3
        }
      };
    }, { ttl: 5 * 60 * 1000, forceRefresh }); // 5 minutes cache
  }

  /**
   * Live IP Monitoring APIs
   */
  
  // Get blocked IPs list
  async getBlockedIPs(forceRefresh = false) {
    const cacheKey = `${this.cachePrefix}blocked_ips`;
    
    return cacheService.getOrFetch(cacheKey, async () => {
      const response = await secureApiClient.get('/api/admin/security/ip/blocked');
      
      if (!response.ok) {
        // Return mock data if backend not available
        return ['192.168.1.100', '10.0.0.50', '203.0.113.1'];
      }
      
      const data = await response.json();
      return data.blockedIPs || [];
    }, { ttl: 2 * 60 * 1000, forceRefresh }); // 2 minutes cache
  }

  // Block an IP address
  async blockIP(ip, reason = 'Manual block') {
    const response = await secureApiClient.post('/api/admin/security/ip/block', {
      ip,
      reason,
      timestamp: new Date().toISOString()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to block IP: ${response.status}`);
    }
    
    // Invalidate blocked IPs cache
    cacheService.delete(`${this.cachePrefix}blocked_ips`);
    cacheService.delete(`${this.cachePrefix}ip_analytics`);
    
    return response.json();
  }

  // Unblock an IP address
  async unblockIP(ip) {
    const response = await secureApiClient.delete(`/api/admin/security/ip/block/${encodeURIComponent(ip)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to unblock IP: ${response.status}`);
    }
    
    // Invalidate blocked IPs cache
    cacheService.delete(`${this.cachePrefix}blocked_ips`);
    cacheService.delete(`${this.cachePrefix}ip_analytics`);
    
    return response.json();
  }

  // Get live IP feed data
  async getLiveIPData(limit = 100, forceRefresh = false) {
    // Don't cache live data - always fetch fresh
    const response = await secureApiClient.get('/api/admin/security/ip/live', {
      params: { limit }
    });
    
    if (!response.ok) {
      // Return empty array if backend not available
      return [];
    }
    
    const data = await response.json();
    return data.liveIPs || [];
  }

  // Get IP geolocation and threat intelligence
  async getIPIntelligence(ip) {
    const response = await secureApiClient.get(`/api/admin/security/ip/intelligence/${encodeURIComponent(ip)}`);
    
    if (!response.ok) {
      // Return mock data if backend not available
      return {
        country: 'Unknown',
        city: 'Unknown',
        riskScore: 0,
        isMalicious: false,
        threatSources: []
      };
    }
    
    return response.json();
  }

  // Report suspicious IP activity
  async reportSuspiciousIP(ip, reason, metadata = {}) {
    const response = await secureApiClient.post('/api/admin/security/ip/suspicious', {
      ip,
      reason,
      metadata,
      timestamp: new Date().toISOString()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to report suspicious IP: ${response.status}`);
    }
    
    // Invalidate related caches
    cacheService.delete(`${this.cachePrefix}suspicious_activity_24h_all`);
    cacheService.delete(`${this.cachePrefix}ip_analytics`);
    
    return response.json();
  }

  /**
   * Security Utilities
   */
  
  // Get security cache statistics
  getSecurityCacheStats() {
    return cacheService.getStats();
  }

  // Clear security caches
  clearSecurityCaches() {
    const keys = cacheService.getKeys();
    const securityKeys = keys.filter(key => key.startsWith(this.cachePrefix));
    
    securityKeys.forEach(key => {
      cacheService.delete(key);
    });
    
    console.log(`🔒 Cleared ${securityKeys.length} security cache entries`);
    return securityKeys.length;
  }

  // Force refresh all security data
  async refreshAllSecurityData() {
    const refreshTasks = [
      this.getAuthMetrics('24h', true),
      this.getApiSecurityMetrics('24h', true),
      this.getRateLimitingStatus(true),
      this.getSecurityThreats('24h', 'all', true),
      this.getActiveSessions(true),
      this.getSecurityConfig(true)
    ];
    
    try {
      await Promise.all(refreshTasks);
      console.log('🔒 All security data refreshed successfully');
    } catch (error) {
      console.error('❌ Failed to refresh some security data:', error);
      throw error;
    }
  }
}

// Create singleton instance
const securityApiService = new SecurityApiService();

export default securityApiService;
