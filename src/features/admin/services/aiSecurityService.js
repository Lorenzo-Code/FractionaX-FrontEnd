/**
 * AI-Powered Security Analysis Service
 * Routes AI requests through the backend API
 */

import secureApiClient from '../../../shared/utils/secureApiClient';

class AISecurityService {
  constructor() {
    this.baseURL = '/api/admin/security/ai';
  }

  /**
   * Analyze user security profile using AI
   */
  async analyzeUserSecurityProfile(userData) {
    try {
      const response = await secureApiClient.post(`${this.baseURL}/analyze-user`, {
        userData: userData,
        analysisType: 'security_profile'
      });
      
      if (response.ok) {
        const data = await response.json();
        return data || this.getFallbackAnalysis(userData);
      } else {
        console.warn('AI Security Analysis returned non-OK status:', response.status);
        return this.getFallbackAnalysis(userData);
      }
    } catch (error) {
      console.error('❌ AI Security Analysis failed:', error);
      return this.getFallbackAnalysis(userData);
    }
  }

  /**
   * Analyze suspicious patterns across multiple users
   */
  async analyzeSuspiciousPatterns(usersData, activityLogs = []) {
    try {
      const response = await secureApiClient.post(`${this.baseURL}/analyze-patterns`, {
        usersData: usersData.slice(0, 50), // Limit data size
        activityLogs: activityLogs,
        analysisType: 'suspicious_patterns'
      });
      
      if (response.ok) {
        const data = await response.json();
        return data || { threats: [], riskLevel: 'unknown', recommendations: [] };
      } else {
        console.warn('AI Pattern Analysis returned non-OK status:', response.status);
        return { threats: [], riskLevel: 'unknown', recommendations: [] };
      }
    } catch (error) {
      console.error('❌ AI Pattern Analysis failed:', error);
      return { threats: [], riskLevel: 'unknown', recommendations: [] };
    }
  }

  /**
   * Generate security recommendations for the entire platform
   */
  async generateSecurityRecommendations(platformData) {
    try {
      const response = await secureApiClient.post(`${this.baseURL}/recommendations`, {
        platformData: platformData,
        analysisType: 'security_recommendations'
      });
      
      if (response.ok) {
        const data = await response.json();
        return data || { recommendations: [], priority: 'medium' };
      } else {
        console.warn('AI Recommendations returned non-OK status:', response.status);
        return { recommendations: [], priority: 'medium' };
      }
    } catch (error) {
      console.error('❌ AI Recommendations failed:', error);
      return { recommendations: [], priority: 'medium' };
    }
  }

  /**
   * Analyze threats and suspicious activities
   */
  async analyzeThreat(threatData) {
    try {
      const response = await secureApiClient.post(`${this.baseURL}/analyze-threats`, {
        threatData: threatData,
        analysisType: 'threat_analysis'
      });
      
      if (response.ok) {
        const data = await response.json();
        return data || this.getFallbackThreatAnalysis();
      } else {
        console.warn('AI Threat Analysis returned non-OK status:', response.status);
        return this.getFallbackThreatAnalysis();
      }
    } catch (error) {
      console.error('❌ AI Threat Analysis failed:', error);
      return this.getFallbackThreatAnalysis();
    }
  }

  /**
   * Real-time risk assessment for login attempts
   */
  async assessLoginRisk(loginData) {
    try {
      const response = await secureApiClient.post(`${this.baseURL}/assess-login-risk`, {
        loginData: loginData,
        analysisType: 'login_risk_assessment'
      });
      
      if (response.ok) {
        const data = await response.json();
        return data || { riskLevel: 'medium', confidence: 0.5, action: 'monitor' };
      } else {
        console.warn('AI Login Risk Assessment returned non-OK status:', response.status);
        return { riskLevel: 'medium', confidence: 0.5, action: 'monitor' };
      }
    } catch (error) {
      console.error('❌ AI Login Risk Assessment failed:', error);
      return { riskLevel: 'medium', confidence: 0.5, action: 'monitor' };
    }
  }

  /**
   * Build prompts for different analysis types
   */
  buildUserAnalysisPrompt(userData) {
    return `
Analyze the security profile of this user and provide a detailed assessment:

User Profile:
- Email: ${userData.email}
- Role: ${userData.role}
- Account Age: ${userData.accountAge} days
- Email Verified: ${userData.emailVerified}
- KYC Status: ${userData.kycStatus}
- Phone Provided: ${userData.hasPhone}
- Last Login: ${userData.lastLogin ? new Date(userData.lastLogin).toLocaleDateString() : 'Never'}
- Suspended: ${userData.originalData?.suspended}
- Country: ${userData.originalData?.address?.country}

Please provide:
1. Overall Risk Level (LOW/MEDIUM/HIGH/CRITICAL)
2. Key Security Concerns (list 3-5 specific issues)
3. Recommended Actions (prioritized list)
4. Security Score Justification
5. Monitoring Recommendations

Format as JSON with these fields: riskLevel, concerns, actions, scoreJustification, monitoring
`;
  }

  buildPatternAnalysisPrompt(usersData, activityLogs) {
    const userSummary = usersData.slice(0, 10).map(user => ({
      email: user.email,
      role: user.role,
      createdAt: user.originalData?.createdAt,
      lastLogin: user.originalData?.lastLogin,
      country: user.originalData?.address?.country,
      emailVerified: user.emailVerified,
      kycStatus: user.kycStatus
    }));

    return `
Analyze these users and activity logs for suspicious patterns:

Users Sample (${usersData.length} total):
${JSON.stringify(userSummary, null, 2)}

Activity Summary:
- Total Users: ${usersData.length}
- Never Logged In: ${usersData.filter(u => !u.originalData?.lastLogin).length}
- Unverified Emails: ${usersData.filter(u => !u.emailVerified).length}
- No KYC: ${usersData.filter(u => u.kycStatus === 'not_submitted').length}

Look for:
- Coordinated account creation patterns
- Geographic clustering of suspicious accounts
- Unusual registration vs activity patterns
- Potential bot or automated account creation

Provide JSON response with: threats (array), riskLevel, confidence, recommendations
`;
  }

  buildRecommendationPrompt(platformData) {
    return `
Analyze this platform's security posture and provide strategic recommendations:

Platform Statistics:
- Total Users: ${platformData.totalUsers}
- Active Users: ${platformData.activeUsers}
- Unverified Emails: ${platformData.unverifiedEmails}
- Incomplete KYC: ${platformData.incompleteKYC}
- Average Security Score: ${platformData.avgSecurityScore}
- Critical Issues: ${platformData.criticalIssues}

Current Security Measures:
- Email verification required: ${platformData.emailRequired}
- KYC process: ${platformData.kycProcess}
- 2FA available: ${platformData.twoFactorAvailable}

Provide strategic recommendations in JSON format:
- shortTerm: immediate actions (1-2 weeks)
- mediumTerm: improvements (1-3 months) 
- longTerm: strategic initiatives (3+ months)
- priority: overall priority level
- estimatedImpact: expected security improvement
`;
  }

  buildLoginRiskPrompt(loginData) {
    return `
Assess the risk of this login attempt:

Login Details:
- User: ${loginData.userEmail}
- IP Address: ${loginData.ipAddress}
- Location: ${loginData.location || 'Unknown'}
- Device: ${loginData.deviceInfo || 'Unknown'}
- Time: ${new Date(loginData.timestamp).toISOString()}
- Previous Login: ${loginData.lastLoginTime || 'Never'}
- Failed Attempts: ${loginData.failedAttempts || 0}

User Context:
- Account Age: ${loginData.accountAge} days
- Typical Login Times: ${loginData.typicalHours || 'Unknown'}
- Usual Locations: ${loginData.commonLocations || 'Unknown'}

Respond with JSON: riskLevel (low/medium/high/critical), confidence (0-1), action (allow/challenge/block/monitor), reasoning
`;
  }

  /**
   * Parse AI responses into structured data
   */
  parseSecurityAnalysis(aiResponse) {
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback parsing if JSON not found
      return {
        riskLevel: this.extractRiskLevel(aiResponse),
        concerns: this.extractConcerns(aiResponse),
        actions: this.extractActions(aiResponse),
        scoreJustification: aiResponse.substring(0, 200) + '...',
        monitoring: ['Regular security review recommended']
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return this.getFallbackAnalysis();
    }
  }

  parseThreatAnalysis(aiResponse) {
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        threats: [],
        riskLevel: 'medium',
        confidence: 0.5,
        recommendations: ['Implement additional monitoring']
      };
    } catch (error) {
      return { threats: [], riskLevel: 'unknown', recommendations: [] };
    }
  }

  parseRecommendations(aiResponse) {
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        shortTerm: ['Review user verification process'],
        mediumTerm: ['Implement advanced monitoring'],
        longTerm: ['Consider AI-powered fraud detection'],
        priority: 'medium'
      };
    } catch (error) {
      return { recommendations: [], priority: 'medium' };
    }
  }

  parseLoginRisk(aiResponse) {
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        riskLevel: 'medium',
        confidence: 0.5,
        action: 'monitor',
        reasoning: 'Unable to fully assess risk'
      };
    } catch (error) {
      return { riskLevel: 'medium', confidence: 0.5, action: 'monitor' };
    }
  }

  /**
   * Utility methods
   */
  extractRiskLevel(text) {
    const riskKeywords = {
      'CRITICAL': ['critical', 'severe', 'urgent', 'immediate'],
      'HIGH': ['high', 'significant', 'major', 'serious'],
      'MEDIUM': ['medium', 'moderate', 'standard'],
      'LOW': ['low', 'minimal', 'minor', 'acceptable']
    };

    for (const [level, keywords] of Object.entries(riskKeywords)) {
      if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
        return level;
      }
    }
    return 'MEDIUM';
  }

  extractConcerns(text) {
    const concerns = [];
    const concernPatterns = [
      /unverified email/i,
      /incomplete kyc/i,
      /never logged in/i,
      /inactive account/i,
      /missing phone/i,
      /suspicious activity/i
    ];

    concernPatterns.forEach(pattern => {
      if (pattern.test(text)) {
        concerns.push(text.match(pattern)[0]);
      }
    });

    return concerns.length > 0 ? concerns : ['General security review needed'];
  }

  extractActions(text) {
    const actions = [];
    const actionPatterns = [
      /require.*verification/i,
      /implement.*2fa/i,
      /review.*kyc/i,
      /monitor.*activity/i,
      /send.*reminder/i
    ];

    actionPatterns.forEach(pattern => {
      if (pattern.test(text)) {
        actions.push(text.match(pattern)[0]);
      }
    });

    return actions.length > 0 ? actions : ['Standard security measures recommended'];
  }

  getFallbackAnalysis(userData = null) {
    return {
      riskLevel: 'MEDIUM',
      concerns: ['AI analysis unavailable', 'Manual review recommended'],
      actions: ['Enable AI security analysis', 'Review security manually'],
      scoreJustification: 'Fallback analysis used due to AI service unavailability',
      monitoring: ['Regular manual security reviews']
    };
  }

  getFallbackThreatAnalysis() {
    return {
      threats: [
        {
          type: 'Manual Review Required',
          severity: 'medium',
          description: 'AI threat analysis unavailable, manual security review recommended'
        }
      ],
      riskLevel: 'medium',
      confidence: 0.5,
      recommendations: [
        'Enable AI threat analysis',
        'Conduct manual security review',
        'Monitor system activity'
      ]
    };
  }

  /**
   * Batch analyze multiple users
   */
  async batchAnalyzeUsers(usersData, batchSize = 5) {
    const results = [];
    
    for (let i = 0; i < usersData.length; i += batchSize) {
      const batch = usersData.slice(i, i + batchSize);
      const batchPromises = batch.map(user => this.analyzeUserSecurityProfile(user));
      
      try {
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
        
        // Rate limiting - wait 1 second between batches
        if (i + batchSize < usersData.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Batch analysis failed for batch starting at index ${i}:`, error);
        // Add fallback results for failed batch
        results.push(...batch.map(() => this.getFallbackAnalysis()));
      }
    }
    
    return results;
  }

  /**
   * Smart security score calculation using AI insights
   */
  calculateAIEnhancedSecurityScore(userData, aiAnalysis) {
    let baseScore = 100;
    
    // Apply AI-driven risk adjustments
    switch (aiAnalysis.riskLevel) {
      case 'CRITICAL':
        baseScore = Math.min(baseScore, 30);
        break;
      case 'HIGH':
        baseScore = Math.min(baseScore, 50);
        break;
      case 'MEDIUM':
        baseScore = Math.min(baseScore, 75);
        break;
      case 'LOW':
        // Keep original score or improve slightly
        baseScore = Math.max(baseScore, 80);
        break;
    }

    // Factor in AI confidence
    const confidenceWeight = aiAnalysis.confidence || 0.7;
    const aiScore = baseScore;
    const originalScore = userData.securityScore || 75;
    
    // Blend AI and rule-based scores
    const finalScore = Math.round(
      (aiScore * confidenceWeight) + (originalScore * (1 - confidenceWeight))
    );

    return Math.max(0, Math.min(100, finalScore));
  }
}

// Create singleton instance
const aiSecurityService = new AISecurityService();

export default aiSecurityService;
