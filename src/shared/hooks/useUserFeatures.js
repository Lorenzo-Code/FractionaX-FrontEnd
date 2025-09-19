import { useState, useEffect } from 'react';
import { smartFetch } from '../utils/secureApiClient';
import useAuth from './useAuth';

/**
 * Custom hook to fetch and manage current user's feature permissions
 * This hook will be used in customer dashboard to show/hide navigation links
 */
const useUserFeatures = () => {
  const [userFeatures, setUserFeatures] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Default features for fallback (basic user permissions)
  const getDefaultFeatures = () => ({
    // Core User Pages
    dashboard: true,
    marketplace: true,
    wallet: true,
    portfolio: false, // Default to false for basic users
    investments: true,
    staking: false,
    trading: false,
    properties: true,
    
    // Account & Profile Pages
    profile: true,
    settings: true,
    security: true,
    membership: true,
    
    // Communication & Support
    communications: false,
    support: true,
    documents: true,
    blog: false,
    
    // Premium Features (disabled by default)
    analytics: false,
    advancedCharts: false,
    apiAccess: false,
    customReports: false
  });

  const fetchUserFeatures = async () => {
    if (!user?._id) {
      console.log('🔑 No user ID available, using default features');
      setUserFeatures(getDefaultFeatures());
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('🎯 Fetching features for user:', user._id);
      
      // Try to get user features from the API
      const response = await smartFetch(`/api/admin/users/${user._id}/features`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📦 User features response:', data);
      
      // Extract features from the API response structure
      // API returns { success: true, user: { features: {...} } }
      const features = data.user?.features || data.features || data || {};
      
      console.log('📝 Extracted features from API response:', features);
      console.log('🔍 Feature extraction path used:', data.user?.features ? 'data.user.features' : data.features ? 'data.features' : 'data fallback');
      
      // If we got empty features, use defaults
      if (!features || Object.keys(features).length === 0) {
        console.log('⚡ Using default features (empty response from API)');
        setUserFeatures(getDefaultFeatures());
      } else {
        console.log('✅ Using features from API:', features);
        console.log('📋 Enabled features:', Object.entries(features).filter(([_, enabled]) => enabled).map(([feature]) => feature));
        console.log('🔍 Membership feature status:', features.membership);
        setUserFeatures(features);
      }

    } catch (err) {
      console.error('❌ Failed to fetch user features:', err);
      
      // Fallback to defaults on any error
      const defaultFeatures = getDefaultFeatures();
      console.log('🔄 Using default features due to error:', defaultFeatures);
      console.log('🔍 Default membership feature:', defaultFeatures.membership);
      setUserFeatures(defaultFeatures);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch features when user changes
  useEffect(() => {
    fetchUserFeatures();
  }, [user?._id]);

  // Helper function to check if a feature is enabled
  const hasFeature = (featureName) => {
    if (!userFeatures) return false;
    return userFeatures[featureName] === true;
  };

  // Helper function to check multiple features (OR logic)
  const hasAnyFeature = (featureNames) => {
    return featureNames.some(featureName => hasFeature(featureName));
  };

  // Helper function to check multiple features (AND logic)  
  const hasAllFeatures = (featureNames) => {
    return featureNames.every(featureName => hasFeature(featureName));
  };

  return {
    userFeatures,
    loading,
    error,
    hasFeature,
    hasAnyFeature,
    hasAllFeatures,
    refetch: fetchUserFeatures
  };
};

export default useUserFeatures;