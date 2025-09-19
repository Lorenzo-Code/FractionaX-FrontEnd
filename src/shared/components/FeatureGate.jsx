import React from 'react';
import useUserFeatures from '../hooks/useUserFeatures';

/**
 * FeatureGate component - conditionally render children based on user features
 * 
 * Usage examples:
 * <FeatureGate feature="analytics">
 *   <AnalyticsComponent />
 * </FeatureGate>
 * 
 * <FeatureGate features={["staking", "trading"]} requireAll={false}>
 *   <TradingComponent />
 * </FeatureGate>
 */
const FeatureGate = ({ 
  children, 
  feature, 
  features, 
  requireAll = true,
  fallback = null,
  showLoading = true
}) => {
  const { hasFeature, hasAnyFeature, hasAllFeatures, loading } = useUserFeatures();

  // Show loading state if requested
  if (loading && showLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin w-4 h-4 border border-gray-300 border-t-blue-600 rounded-full mr-2"></div>
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  // Handle single feature check
  if (feature) {
    return hasFeature(feature) ? children : fallback;
  }

  // Handle multiple features check
  if (features && Array.isArray(features)) {
    const hasAccess = requireAll 
      ? hasAllFeatures(features)
      : hasAnyFeature(features);
    
    return hasAccess ? children : fallback;
  }

  // No feature specified - show children by default
  console.warn('FeatureGate: No feature(s) specified, showing content by default');
  return children;
};

/**
 * Higher-order component version of FeatureGate
 */
export const withFeatureGate = (WrappedComponent, featureConfig) => {
  const FeatureGatedComponent = (props) => (
    <FeatureGate {...featureConfig}>
      <WrappedComponent {...props} />
    </FeatureGate>
  );
  
  FeatureGatedComponent.displayName = `withFeatureGate(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return FeatureGatedComponent;
};

export default FeatureGate;