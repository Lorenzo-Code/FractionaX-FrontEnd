import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const useNavigationAnalytics = (options = {}) => {
  const location = useLocation();
  const previousLocationRef = useRef(null);
  const sessionStartRef = useRef(Date.now());
  const pageStartTimeRef = useRef(Date.now());
  
  const {
    enableAnalytics = true,
    trackTimeOnPage = true,
    trackUserFlow = true,
    customEventName = 'navigation_event'
  } = options;

  useEffect(() => {
    if (!enableAnalytics) return;

    const currentTime = Date.now();
    const previousLocation = previousLocationRef.current;
    const timeOnPreviousPage = currentTime - pageStartTimeRef.current;

    // Track navigation event
    const navigationData = {
      timestamp: currentTime,
      sessionId: sessionStartRef.current,
      currentPath: location.pathname,
      currentSearch: location.search,
      previousPath: previousLocation?.pathname || null,
      previousSearch: previousLocation?.search || null,
      timeOnPreviousPage: previousLocation ? timeOnPreviousPage : 0,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      sessionDuration: currentTime - sessionStartRef.current
    };

    // Track user flow patterns
    if (trackUserFlow && previousLocation) {
      const flowPattern = {
        from: previousLocation.pathname,
        to: location.pathname,
        duration: timeOnPreviousPage,
        timestamp: currentTime
      };

      // Store flow patterns in sessionStorage for analysis
      const existingFlows = JSON.parse(sessionStorage.getItem('user_flows') || '[]');
      existingFlows.push(flowPattern);
      
      // Keep only last 50 flows to prevent storage overflow
      if (existingFlows.length > 50) {
        existingFlows.splice(0, existingFlows.length - 50);
      }
      
      sessionStorage.setItem('user_flows', JSON.stringify(existingFlows));
    }

    // Send to analytics service (replace with your analytics provider)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', customEventName, {
        page_location: location.pathname,
        page_title: document.title,
        custom_data: navigationData
      });
    }

    // Console logging for development (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('Navigation Analytics:', navigationData);
    }

    // Update refs for next navigation
    previousLocationRef.current = location;
    pageStartTimeRef.current = currentTime;

  }, [location, enableAnalytics, trackTimeOnPage, trackUserFlow, customEventName]);

  // Helper functions
  const getNavigationSummary = () => {
    const flows = JSON.parse(sessionStorage.getItem('user_flows') || '[]');
    const sessionDuration = Date.now() - sessionStartRef.current;
    
    return {
      sessionDuration,
      totalPageViews: flows.length + 1,
      averageTimePerPage: flows.length > 0 ? flows.reduce((sum, flow) => sum + flow.duration, 0) / flows.length : 0,
      navigationPath: flows.map(flow => ({ from: flow.from, to: flow.to })),
      currentSession: sessionStartRef.current
    };
  };

  const trackCustomEvent = (eventName, eventData = {}) => {
    if (!enableAnalytics) return;

    const customEventData = {
      timestamp: Date.now(),
      sessionId: sessionStartRef.current,
      currentPath: location.pathname,
      eventName,
      ...eventData
    };

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        custom_parameter: customEventData
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Custom Event:', customEventData);
    }
  };

  const getPopularPaths = () => {
    const flows = JSON.parse(sessionStorage.getItem('user_flows') || '[]');
    const pathCounts = {};
    
    flows.forEach(flow => {
      pathCounts[flow.to] = (pathCounts[flow.to] || 0) + 1;
    });
    
    return Object.entries(pathCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }));
  };

  return {
    getNavigationSummary,
    trackCustomEvent,
    getPopularPaths,
    currentPath: location.pathname,
    sessionId: sessionStartRef.current
  };
};

export default useNavigationAnalytics;
