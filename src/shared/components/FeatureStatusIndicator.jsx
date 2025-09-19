import React from 'react';
import useUserFeatures from '../hooks/useUserFeatures';
import { Shield, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

/**
 * Feature Status Indicator - Shows current user's feature status in dashboard
 * Can be used as a widget to display feature access level
 */
const FeatureStatusIndicator = ({ compact = false, showDetails = true }) => {
  const { userFeatures, loading, error, hasFeature } = useUserFeatures();

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-4 ${compact ? 'p-3' : 'p-4'}`}>
        <div className="flex items-center">
          <Clock className="w-4 h-4 text-blue-500 mr-2" />
          <span className="text-sm text-gray-600">Loading features...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-red-200 p-4 ${compact ? 'p-3' : 'p-4'}`}>
        <div className="flex items-center">
          <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
          <span className="text-sm text-red-600">Feature check failed</span>
        </div>
      </div>
    );
  }

  if (!userFeatures) {
    return null;
  }

  // Count enabled features
  const enabledFeatures = Object.values(userFeatures).filter(Boolean).length;
  const totalFeatures = Object.keys(userFeatures).length;
  
  // Determine access level
  const accessLevel = enabledFeatures / totalFeatures;
  let tierInfo = {
    name: 'Basic',
    color: 'gray',
    icon: Shield
  };
  
  if (accessLevel >= 0.8) {
    tierInfo = { name: 'Premium', color: 'purple', icon: Shield };
  } else if (accessLevel >= 0.6) {
    tierInfo = { name: 'Pro', color: 'blue', icon: Shield };
  } else if (accessLevel >= 0.4) {
    tierInfo = { name: 'Plus', color: 'green', icon: Shield };
  }

  const { name: tierName, color, icon: TierIcon } = tierInfo;

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TierIcon className={`w-4 h-4 text-${color}-500 mr-2`} />
            <span className={`text-sm font-medium text-${color}-700`}>{tierName}</span>
          </div>
          <span className="text-xs text-gray-500">{enabledFeatures}/{totalFeatures}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <TierIcon className={`w-5 h-5 text-${color}-500 mr-2`} />
          <h3 className="text-sm font-semibold text-gray-900">Access Level</h3>
        </div>
        <span className={`px-2 py-1 text-xs font-medium bg-${color}-100 text-${color}-700 rounded-full`}>
          {tierName}
        </span>
      </div>

      {showDetails && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Features enabled:</span>
            <span className="font-medium text-gray-900">{enabledFeatures} of {totalFeatures}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`bg-${color}-500 h-2 rounded-full transition-all duration-300`}
              style={{ width: `${(accessLevel * 100)}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center text-xs text-green-600">
              <CheckCircle className="w-3 h-3 mr-1" />
              {enabledFeatures} enabled
            </div>
            {totalFeatures - enabledFeatures > 0 && (
              <div className="flex items-center text-xs text-gray-500">
                <XCircle className="w-3 h-3 mr-1" />
                {totalFeatures - enabledFeatures} disabled
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureStatusIndicator;