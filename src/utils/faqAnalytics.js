// FAQ Analytics Utility
// Tracks user interactions and behavior on the FAQ page

class FAQAnalytics {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.interactions = [];
  }

  generateSessionId() {
    return 'faq_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Track page view
  trackPageView() {
    this.trackEvent('faq_page_viewed', {
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      referrer: document.referrer
    });
  }

  // Track search interactions
  trackSearch(searchTerm, resultsCount) {
    this.trackEvent('faq_search', {
      searchTerm,
      resultsCount,
      timestamp: Date.now(),
      sessionId: this.sessionId
    });
  }

  // Track FAQ question views
  trackQuestionView(category, question, questionIndex) {
    this.trackEvent('faq_question_viewed', {
      category,
      question,
      questionIndex,
      timestamp: Date.now(),
      sessionId: this.sessionId
    });
  }

  // Track FAQ question expansion
  trackQuestionExpand(category, question, questionIndex) {
    this.trackEvent('faq_question_expanded', {
      category,
      question,
      questionIndex,
      timestamp: Date.now(),
      sessionId: this.sessionId
    });
  }

  // Track category interactions
  trackCategoryView(category, questionCount) {
    this.trackEvent('faq_category_viewed', {
      category,
      questionCount,
      timestamp: Date.now(),
      sessionId: this.sessionId
    });
  }

  // Track AI assistant button clicks
  trackAIAssistantClick() {
    this.trackEvent('faq_ai_assistant_clicked', {
      timestamp: Date.now(),
      sessionId: this.sessionId
    });
  }

  // Track support contact clicks
  trackSupportContactClick() {
    this.trackEvent('faq_support_contact_clicked', {
      timestamp: Date.now(),
      sessionId: this.sessionId
    });
  }

  // Track helpful votes
  trackHelpfulVote(category, question, questionIndex, isHelpful) {
    this.trackEvent('faq_helpful_vote', {
      category,
      question,
      questionIndex,
      isHelpful,
      timestamp: Date.now(),
      sessionId: this.sessionId
    });
  }

  // Track time spent on page
  trackTimeSpent() {
    const timeSpent = Date.now() - this.startTime;
    this.trackEvent('faq_time_spent', {
      timeSpent,
      sessionId: this.sessionId,
      timestamp: Date.now()
    });
  }

  // Track search with no results
  trackNoSearchResults(searchTerm) {
    this.trackEvent('faq_no_search_results', {
      searchTerm,
      timestamp: Date.now(),
      sessionId: this.sessionId
    });
  }

  // Generic event tracking
  trackEvent(eventName, properties = {}) {
    const event = {
      event: eventName,
      properties: {
        ...properties,
        page: 'FAQ',
        url: window.location.href,
        timestamp: Date.now()
      }
    };

    // Store interaction locally
    this.interactions.push(event);

    // Send to analytics services
    this.sendToAnalytics(event);
  }

  // Send to multiple analytics services
  sendToAnalytics(event) {
    try {
      // Google Analytics 4 (if available)
      if (typeof gtag !== 'undefined') {
        gtag('event', event.event, event.properties);
      }

      // Google Analytics Universal (if available)
      if (typeof ga !== 'undefined') {
        ga('send', 'event', 'FAQ', event.event, JSON.stringify(event.properties));
      }

      // Mixpanel (if available)
      if (typeof mixpanel !== 'undefined') {
        mixpanel.track(event.event, event.properties);
      }

      // Custom analytics endpoint
      this.sendToCustomEndpoint(event);

      // Console logging for development
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 FAQ Analytics:', event);
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  // Send to custom analytics endpoint
  async sendToCustomEndpoint(event) {
    try {
      // Rate limiting
      if (this.isRateLimited()) return;

      await fetch('/api/analytics/faq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      // Silently fail for analytics
      console.warn('Custom analytics endpoint failed:', error);
    }
  }

  // Simple rate limiting
  isRateLimited() {
    const now = Date.now();
    if (!this.lastRequest) {
      this.lastRequest = now;
      return false;
    }
    
    const timeSinceLastRequest = now - this.lastRequest;
    if (timeSinceLastRequest < 100) { // 100ms minimum between requests
      return true;
    }
    
    this.lastRequest = now;
    return false;
  }

  // Get session summary
  getSessionSummary() {
    return {
      sessionId: this.sessionId,
      totalInteractions: this.interactions.length,
      timeSpent: Date.now() - this.startTime,
      interactions: this.interactions
    };
  }

  // Export session data
  exportSessionData() {
    const summary = this.getSessionSummary();
    const blob = new Blob([JSON.stringify(summary, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `faq-session-${this.sessionId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Create singleton instance
const faqAnalytics = new FAQAnalytics();

// Track page unload
window.addEventListener('beforeunload', () => {
  faqAnalytics.trackTimeSpent();
});

export default faqAnalytics;
