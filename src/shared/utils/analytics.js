// Analytics utility for FractionaX platform
// Supports multiple analytics providers (Google Analytics, Mixpanel, etc.)

class Analytics {
  constructor() {
    this.providers = [];
    this.isInitialized = false;
    this.userId = null;
    this.sessionId = this.generateSessionId();
  }

  // Initialize analytics providers
  init(config = {}) {
    if (this.isInitialized) return;

    // Initialize Google Analytics 4
    if (config.googleAnalytics?.measurementId) {
      this.initGoogleAnalytics(config.googleAnalytics.measurementId);
    }

    // Initialize Mixpanel
    if (config.mixpanel?.token) {
      this.initMixpanel(config.mixpanel.token);
    }

    // Initialize custom analytics
    if (config.custom?.endpoint) {
      this.initCustomAnalytics(config.custom);
    }

    this.isInitialized = true;
    this.trackPageView(window.location.pathname);
  }

  // Google Analytics 4 initialization
  initGoogleAnalytics(measurementId) {
    try {
      // Load gtag script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      function gtag() { window.dataLayer.push(arguments); }
      window.gtag = gtag;
      
      gtag('js', new Date());
      gtag('config', measurementId, {
        page_title: document.title,
        page_location: window.location.href,
        custom_map: {
          custom_parameter_1: 'user_type',
          custom_parameter_2: 'property_type'
        }
      });

      this.providers.push({ name: 'google_analytics', enabled: true });
    } catch (error) {
      console.error('Failed to initialize Google Analytics:', error);
    }
  }

  // Mixpanel initialization
  initMixpanel(token) {
    try {
      // In a real implementation, you'd load the Mixpanel library
      // For now, we'll simulate the API
      this.mixpanel = {
        track: (event, properties) => {
          console.log('Mixpanel track:', event, properties);
        },
        identify: (userId) => {
          console.log('Mixpanel identify:', userId);
        },
        people: {
          set: (properties) => {
            console.log('Mixpanel people set:', properties);
          }
        }
      };

      this.providers.push({ name: 'mixpanel', enabled: true });
    } catch (error) {
      console.error('Failed to initialize Mixpanel:', error);
    }
  }

  // Custom analytics initialization
  initCustomAnalytics(config) {
    this.customEndpoint = config.endpoint;
    this.customHeaders = config.headers || {};
    this.providers.push({ name: 'custom', enabled: true });
  }

  // Generate unique session ID
  generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
  }

  // Set user identification
  identify(userId, userProperties = {}) {
    this.userId = userId;

    // Google Analytics
    if (window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        user_id: userId,
        custom_map: userProperties
      });
    }

    // Mixpanel
    if (this.mixpanel) {
      this.mixpanel.identify(userId);
      this.mixpanel.people.set(userProperties);
    }

    // Custom analytics
    this.sendCustomEvent('user_identify', {
      user_id: userId,
      properties: userProperties
    });
  }

  // Track page views
  trackPageView(path, title = document.title, additionalData = {}) {
    const eventData = {
      page_path: path,
      page_title: title,
      page_location: window.location.href,
      user_id: this.userId,
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      ...additionalData
    };

    // Google Analytics
    if (window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: path,
        page_title: title
      });
    }

    // Mixpanel
    if (this.mixpanel) {
      this.mixpanel.track('Page View', eventData);
    }

    // Custom analytics
    this.sendCustomEvent('page_view', eventData);
  }

  // Track custom events
  trackEvent(eventName, eventData = {}) {
    const enrichedData = {
      event_name: eventName,
      user_id: this.userId,
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      page_path: window.location.pathname,
      ...eventData
    };

    // Google Analytics
    if (window.gtag) {
      window.gtag('event', eventName, enrichedData);
    }

    // Mixpanel
    if (this.mixpanel) {
      this.mixpanel.track(eventName, enrichedData);
    }

    // Custom analytics
    this.sendCustomEvent(eventName, enrichedData);
  }

  // Track property interactions
  trackPropertyInteraction(action, propertyData) {
    this.trackEvent('property_interaction', {
      action,
      property_id: propertyData.id,
      property_title: propertyData.title,
      property_price: propertyData.price,
      property_type: propertyData.propertyType,
      property_location: propertyData.address,
      tokenized: propertyData.tokenized,
      expected_roi: propertyData.expectedROI
    });
  }

  // Track search interactions
  trackSearch(query, resultsCount, filters = {}) {
    this.trackEvent('search_performed', {
      search_query: query,
      results_count: resultsCount,
      filters: filters,
      search_type: 'property_search'
    });
  }

  // Track filter usage
  trackFilterUsage(filterType, filterValue, resultsCount) {
    this.trackEvent('filter_applied', {
      filter_type: filterType,
      filter_value: filterValue,
      results_count: resultsCount
    });
  }

  // Track pagination
  trackPagination(currentPage, totalPages, itemsPerPage) {
    this.trackEvent('pagination_click', {
      current_page: currentPage,
      total_pages: totalPages,
      items_per_page: itemsPerPage
    });
  }

  // Track tab switches
  trackTabSwitch(fromTab, toTab, propertiesCount) {
    this.trackEvent('tab_switch', {
      from_tab: fromTab,
      to_tab: toTab,
      properties_count: propertiesCount
    });
  }

  // Track performance metrics
  trackPerformance(metricName, value, additionalData = {}) {
    this.trackEvent('performance_metric', {
      metric_name: metricName,
      metric_value: value,
      ...additionalData
    });
  }

  // Send custom analytics events
  async sendCustomEvent(eventName, eventData) {
    if (!this.customEndpoint) return;

    try {
      await fetch(this.customEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.customHeaders
        },
        body: JSON.stringify({
          event: eventName,
          data: eventData,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to send custom analytics event:', error);
    }
  }

  // Get analytics status
  getStatus() {
    return {
      initialized: this.isInitialized,
      providers: this.providers,
      userId: this.userId,
      sessionId: this.sessionId
    };
  }
}

// Create singleton instance
const analytics = new Analytics();

// Export specific tracking functions
export const initAnalytics = (config) => analytics.init(config);
export const identifyUser = (userId, properties) => analytics.identify(userId, properties);
export const trackPageView = (path, title, data) => analytics.trackPageView(path, title, data);
export const trackEvent = (name, data) => analytics.trackEvent(name, data);
export const trackPropertyInteraction = (action, property) => analytics.trackPropertyInteraction(action, property);
export const trackSearch = (query, count, filters) => analytics.trackSearch(query, count, filters);
export const trackFilterUsage = (type, value, count) => analytics.trackFilterUsage(type, value, count);
export const trackPagination = (current, total, perPage) => analytics.trackPagination(current, total, perPage);
export const trackTabSwitch = (from, to, count) => analytics.trackTabSwitch(from, to, count);
export const trackPerformance = (metric, value, data) => analytics.trackPerformance(metric, value, data);
export const getAnalyticsStatus = () => analytics.getStatus();

export default analytics;
