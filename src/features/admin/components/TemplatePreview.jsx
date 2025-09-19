import React from 'react';
import { 
  FaUserShield, 
  FaUserTie, 
  FaUser, 
  FaCrown, 
  FaClock,
  FaCheckCircle, 
  FaTimesCircle,
  FaChartBar 
} from 'react-icons/fa';

/**
 * Template Preview Component - Shows a visual representation of feature templates
 */
const TemplatePreview = ({ template, features, compact = false }) => {
  if (!template || !features) {
    return null;
  }

  // Template icons and colors
  const templateConfig = {
    admin: {
      icon: FaUserShield,
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-600'
    },
    moderator: {
      icon: FaUserTie,
      color: 'purple',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-800',
      iconColor: 'text-purple-600'
    },
    user: {
      icon: FaUser,
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-600'
    },
    premium: {
      icon: FaCrown,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-600'
    },
    trial: {
      icon: FaClock,
      color: 'gray',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-800',
      iconColor: 'text-gray-600'
    }
  };

  const config = templateConfig[template.toLowerCase()] || templateConfig.user;
  const Icon = config.icon;

  // Feature categories for organization
  const featureCategories = {
    'Core Features': ['dashboard', 'marketplace', 'wallet', 'portfolio', 'investments'],
    'Trading & Finance': ['staking', 'trading', 'properties', 'analytics'],
    'Account & Support': ['profile', 'settings', 'security', 'support', 'documents'],
    'Communication': ['communications', 'blog'],
    'Premium': ['advancedCharts', 'apiAccess', 'customReports'],
    'Admin': ['adminDashboard', 'userManagement', 'systemSettings', 'auditLogs'],
    'Platform': ['platformAnalytics', 'contentManagement', 'protocolManagement'],
    'Advanced Admin': ['riskManagement', 'complianceTools'],
    'Developer': ['apiDocumentation', 'webhooks', 'integrations']
  };

  const enabledFeatures = Object.entries(features).filter(([_, enabled]) => enabled);
  const totalFeatures = Object.keys(features).length;
  const enabledCount = enabledFeatures.length;
  const percentage = Math.round((enabledCount / totalFeatures) * 100);

  if (compact) {
    return (
      <div className={`p-3 rounded-lg border ${config.bgColor} ${config.borderColor}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Icon className={`w-4 h-4 ${config.iconColor} mr-2`} />
            <span className={`font-semibold ${config.textColor} capitalize`}>
              {template}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {enabledCount}/{totalFeatures} ({percentage}%)
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`bg-${config.color}-500 h-2 rounded-full transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Icon className={`w-5 h-5 ${config.iconColor} mr-3`} />
          <div>
            <h3 className={`font-semibold ${config.textColor} capitalize`}>
              {template} Template
            </h3>
            <p className="text-xs text-gray-600">
              {enabledCount} of {totalFeatures} features enabled ({percentage}%)
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <FaChartBar className={`w-4 h-4 ${config.iconColor} mb-1`} />
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div 
              className={`bg-${config.color}-500 h-2 rounded-full`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Feature Categories */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {Object.entries(featureCategories).map(([categoryName, categoryFeatures]) => {
          const categoryEnabled = categoryFeatures.filter(feature => features[feature]).length;
          const categoryTotal = categoryFeatures.filter(feature => feature in features).length;
          
          if (categoryTotal === 0) return null;
          
          return (
            <div key={categoryName} className="border-b border-gray-200 pb-2 last:border-b-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs font-medium text-gray-700">{categoryName}</h4>
                <span className="text-xs text-gray-500">
                  {categoryEnabled}/{categoryTotal}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {categoryFeatures
                  .filter(feature => feature in features)
                  .map(feature => (
                    <span
                      key={feature}
                      className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${
                        features[feature]
                          ? `bg-green-100 text-green-700`
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {features[feature] ? (
                        <FaCheckCircle className="w-2 h-2 mr-1" />
                      ) : (
                        <FaTimesCircle className="w-2 h-2 mr-1" />
                      )}
                      {feature.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  ))
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TemplatePreview;