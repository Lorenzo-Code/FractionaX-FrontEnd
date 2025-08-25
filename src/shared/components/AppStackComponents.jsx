import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * AppStack-inspired Metric Card with icons, badges and trend indicators
 * Perfect for displaying key performance metrics
 */
export const AppStackMetricCard = ({ 
  icon: Icon, 
  value, 
  label, 
  change, 
  changeType, 
  period,
  className = ""
}) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
    <div className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{value}</h3>
          <p className="text-gray-600 mb-2">{label}</p>
          {change && (
            <div className="flex items-center">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${
                changeType === 'positive' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {changeType === 'positive' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {change}
              </span>
              {period && <span className="text-gray-500 text-xs">{period}</span>}
            </div>
          )}
        </div>
        {Icon && (
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-50 rounded-lg">
            <Icon className="w-6 h-6 text-gray-600" />
          </div>
        )}
      </div>
    </div>
  </div>
);

/**
 * Simple metric card for secondary stats with colored icon backgrounds
 */
export const SimpleMetricCard = ({ 
  icon: Icon, 
  label, 
  value, 
  iconColor = "text-blue-600", 
  bgColor = "bg-blue-50",
  className = ""
}) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
    <div className="flex items-center">
      {Icon && (
        <div className={`inline-flex items-center justify-center w-10 h-10 ${bgColor} rounded-lg mr-3`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

/**
 * Chart card wrapper for consistent styling
 */
export const ChartCard = ({ title, children, className = "" }) => (
  <div className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 ${className}`}>
    <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
    {children}
  </div>
);

/**
 * AppStack-inspired page header with title, description and action buttons
 */
export const PageHeader = ({ 
  title, 
  description, 
  actions = [],
  className = ""
}) => (
  <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 ${className}`}>
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">{title}</h1>
      {description && <p className="text-gray-600 text-sm">{description}</p>}
    </div>
    
    {actions.length > 0 && (
      <div className="flex items-center space-x-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`inline-flex items-center px-3 py-2 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              action.variant === 'primary'
                ? 'border border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500'
            }`}
            onClick={action.onClick}
          >
            {action.icon && <action.icon className="h-4 w-4 mr-2" />}
            {action.label}
          </button>
        ))}
      </div>
    )}
  </div>
);

/**
 * Professional notification/alert badges
 */
export const StatusBadge = ({ 
  type = "info", 
  children, 
  className = "" 
}) => {
  const typeStyles = {
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700", 
    error: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700"
  };

  return (
    <span className={`px-4 py-1 rounded-full text-sm ${typeStyles[type]} ${className}`}>
      {children}
    </span>
  );
};

/**
 * Activity feed item component
 */
export const ActivityFeedItem = ({ 
  icon, 
  title, 
  description, 
  time, 
  type = "default" 
}) => {
  const typeStyles = {
    success: "text-green-600",
    warning: "text-yellow-600",
    error: "text-red-600", 
    info: "text-blue-600",
    default: "text-gray-600"
  };

  return (
    <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
          type === 'success' ? 'bg-green-400' :
          type === 'warning' ? 'bg-yellow-400' :
          type === 'error' ? 'bg-red-400' : 'bg-blue-400'
        }`}></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          {description && <p className="text-sm text-gray-500">{description}</p>}
          {time && <p className="text-xs text-gray-400 mt-1">{time}</p>}
        </div>
      </div>
    </div>
  );
};

/**
 * Welcome card with gradient background
 */
export const WelcomeCard = ({ 
  title, 
  subtitle, 
  icon: Icon,
  gradient = "from-blue-500 to-blue-600",
  className = ""
}) => (
  <div className={`bg-gradient-to-r ${gradient} rounded-lg shadow-sm overflow-hidden ${className}`}>
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="text-white">
          <h4 className="text-lg font-semibold mb-1">{title}</h4>
          <p className="text-blue-100 text-sm opacity-90">{subtitle}</p>
        </div>
        {Icon && (
          <div className="text-blue-200">
            <Icon size={48} className="opacity-80" />
          </div>
        )}
      </div>
    </div>
  </div>
);

/**
 * Data table wrapper for consistent styling
 */
export const DataTable = ({ 
  headers, 
  children, 
  className = "" 
}) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {children}
        </tbody>
      </table>
    </div>
  </div>
);

export default {
  AppStackMetricCard,
  SimpleMetricCard,
  ChartCard,
  PageHeader,
  StatusBadge,
  ActivityFeedItem,
  WelcomeCard,
  DataTable
};
