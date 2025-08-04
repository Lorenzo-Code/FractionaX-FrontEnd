const API_BASE_URL = 'http://localhost:5000/api/admin';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Fetch analytics data from backend
export const fetchAnalyticsData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/dashboard`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch analytics data: ${response.status}`);
    }
    const data = await response.json();
    console.log('Real analytics data received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw error; // Re-throw error instead of returning mock data
  }
};

// Fetch detailed user metrics
export const fetchUserMetrics = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/user-metrics`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch user metrics: ${response.status}`);
    }
    const data = await response.json();
    console.log('Real user metrics received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching user metrics:', error);
    throw error; // Re-throw error instead of returning mock data
  }
};

// Fetch real-time data
export const fetchRealTimeData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/realtime`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch real-time data: ${response.status}`);
    }
    const data = await response.json();
    console.log('Real-time data received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching real-time data:', error);
    throw error; // Re-throw error instead of returning mock data
  }
};

// Fetch comprehensive analytics data
export const fetchComprehensiveAnalyticsData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/users`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch comprehensive analytics data: ${response.status}`);
    }
    const data = await response.json();
    console.log('Comprehensive analytics data received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching comprehensive analytics data:', error);
    throw error;
  }
};

// Fetch AI insights
export const fetchAIInsights = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/ai-insights`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch AI insights: ${response.status}`);
    }
    const data = await response.json();
    console.log('AI insights received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching AI insights:', error);
    throw error; // Re-throw error instead of returning mock data
  }
};
