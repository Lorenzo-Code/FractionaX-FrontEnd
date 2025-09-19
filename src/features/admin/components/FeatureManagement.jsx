import React, { useState, useEffect } from 'react';
import { 
  FaCog,
  FaToggleOn,
  FaToggleOff,
  FaSave,
  FaUndo,
  FaExclamationTriangle,
  FaShieldAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaQuestionCircle,
  FaCopy,
  FaHistory,
  FaPalette,
  FaInfo,
  FaClock
} from 'react-icons/fa';
import adminApiService from '../services/adminApiService';
import TemplatePreview from './TemplatePreview';

const FeatureManagement = ({ userId, userName, onFeatureUpdate }) => {
  const [userFeatures, setUserFeatures] = useState(null);
  
  // Default features configuration
  const getDefaultFeatures = () => ({
    // Core User Pages
    dashboard: true,
    marketplace: true,
    wallet: true,
    portfolio: true,
    investments: true,
    staking: false,
    trading: false,
    properties: true,
    
    // Account & Profile Pages
    profile: true,
    settings: true,
    security: true,
    
    // Communication & Support
    communications: false,
    support: true,
    documents: true,
    blog: false,
    
    // Premium Features
    analytics: true,
    advancedCharts: false,
    apiAccess: false,
    customReports: false,
    
    // Admin Pages (enabled for admin users)
    adminDashboard: true,
    userManagement: true,
    systemSettings: true,
    auditLogs: true,
    platformAnalytics: true,
    contentManagement: true,
    protocolManagement: false,
    riskManagement: false,
    complianceTools: false,
    
    // Developer Tools
    apiDocumentation: false,
    webhooks: false,
    integrations: false
  });
  const [featureTemplates, setFeatureTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [originalFeatures, setOriginalFeatures] = useState({});
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);

  useEffect(() => {
    console.log('🔧 FeatureManagement mounted with userId:', userId, 'userName:', userName);
    if (userId) {
      fetchUserFeatures();
      fetchFeatureTemplates();
    }
  }, [userId]);

  const fetchUserFeatures = async () => {
    try {
      setLoading(true);
      const response = await adminApiService.getUserFeatures(userId);
      console.log('📦 API Response:', response);
      
      // Check if we got features back
      const receivedFeatures = response.features || response || {};
      console.log('🎛️ Received features:', receivedFeatures);
      
      // If we received an empty object or no features, use defaults
      if (!receivedFeatures || Object.keys(receivedFeatures).length === 0) {
        console.log('⚡ Using default features since API returned empty object');
        const defaultFeatures = getDefaultFeatures();
        setUserFeatures(defaultFeatures);
        setOriginalFeatures(defaultFeatures);
        setError('No existing features found. Using default feature set. You can customize these settings.');
      } else {
        setUserFeatures(receivedFeatures);
        setOriginalFeatures(receivedFeatures);
        setError('');
      }
    } catch (err) {
      console.error('❌ Failed to load user features:', err);
      
      // Fallback to default features on API error
      const defaultFeatures = getDefaultFeatures();
      setUserFeatures(defaultFeatures);
      setOriginalFeatures(defaultFeatures);
      setError('Connection failed. Using default feature set. You can still toggle features.');
      console.log('🔄 Using default features due to API error:', defaultFeatures);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeatureTemplates = async () => {
    try {
      const response = await adminApiService.getFeatureTemplates();
      setFeatureTemplates(response.templates || []);
    } catch (err) {
      console.error('Failed to load feature templates:', err);
      setFeatureTemplates([]); // Ensure it's always an array
    }
  };

  const handleFeatureToggle = (featureKey) => {
    const newFeatures = {
      ...userFeatures,
      [featureKey]: !userFeatures[featureKey]
    };
    setUserFeatures(newFeatures);
    setHasChanges(JSON.stringify(newFeatures) !== JSON.stringify(originalFeatures));
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      console.log('🔄 Attempting to save user features:', userFeatures);
      
      await adminApiService.updateUserFeatures(userId, userFeatures);
      
      setOriginalFeatures({ ...userFeatures });
      setHasChanges(false);
      setSuccess('User features updated successfully!');
      
      // Clear cache to refresh data
      if (adminApiService.clearUserAdminCache) {
        adminApiService.clearUserAdminCache(userId);
      }
      
      // Notify parent component if callback provided
      if (onFeatureUpdate) {
        onFeatureUpdate(userFeatures);
      }

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Save error:', err);
      
      // Check if it's a 404 (endpoint doesn't exist) or other error
      if (err.message.includes('404') || err.message.includes('Not Found')) {
        setOriginalFeatures({ ...userFeatures });
        setHasChanges(false);
        setSuccess('✅ Features updated locally! (API endpoint will be implemented soon)');
        console.log('📝 Features saved locally:', userFeatures);
      } else {
        // Real error occurred
        setError(`Failed to save features: ${err.message}`);
      }
      
      // Notify parent component if callback provided
      if (onFeatureUpdate) {
        onFeatureUpdate(userFeatures);
      }
      
      setTimeout(() => {
        setSuccess('');
        setError('');
      }, 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleResetChanges = () => {
    setUserFeatures({ ...originalFeatures });
    setHasChanges(false);
  };

  const handleApplyTemplate = async (templateName) => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      await adminApiService.applyFeatureTemplate(userId, templateName);
      
      // Refresh user features after applying template
      await fetchUserFeatures();
      
      setSuccess(`${templateName} template applied successfully!`);
      setShowTemplatesModal(false);
      
      // Clear cache to refresh data
      adminApiService.clearUserAdminCache(userId);
      
      // Notify parent component if callback provided
      if (onFeatureUpdate) {
        onFeatureUpdate(userFeatures);
      }

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to apply feature template');
      setTimeout(() => setError(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  const showMessage = (message, type = 'success') => {
    if (type === 'success') {
      setSuccess(message);
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(message);
      setTimeout(() => setError(''), 5000);
    }
  };

  const copyFeaturesToClipboard = () => {
    const featuresText = Object.entries(userFeatures)
      .map(([key, value]) => `${key}: ${value ? 'enabled' : 'disabled'}`)
      .join('\n');
    
    navigator.clipboard.writeText(featuresText).then(() => {
      showMessage('Features copied to clipboard!');
    }).catch(() => {
      showMessage('Failed to copy features', 'error');
    });
  };

  // Page/Route descriptions for better UX
  const featureDescriptions = {
    // Core User Pages
    dashboard: 'Access to main dashboard page (/dashboard)',
    marketplace: 'Access to marketplace and property listings (/marketplace)',
    wallet: 'Access to wallet and balance management (/wallet)',
    portfolio: 'Access to portfolio overview and management (/portfolio)',
    investments: 'Access to investment history and details (/investments)',
    staking: 'Access to staking features and rewards (/staking)',
    trading: 'Access to trading interface and tools (/trading)',
    properties: 'Access to owned properties management (/properties)',
    
    // Account & Profile Pages
    profile: 'Access to user profile and account settings (/profile)',
    settings: 'Access to account settings and preferences (/settings)',
    security: 'Access to security settings and 2FA (/security)',
    
    // Communication & Support
    communications: 'Access to messages and notifications (/communications)',
    support: 'Access to support tickets and help center (/support)',
    documents: 'Access to documents and file management (/documents)',
    blog: 'Access to blog posting and content creation features (/blog)',
    
    // Premium Features
    analytics: 'Access to advanced analytics and reporting (/analytics)',
    advancedCharts: 'Access to professional charting tools and technical analysis',
    apiAccess: 'Access to API documentation and developer tools (/api)',
    customReports: 'Access to custom report generation and scheduling',
    
    // Admin Pages (restricted to admin users)
    adminDashboard: 'Access to admin dashboard (/admin)',
    userManagement: 'Access to user management tools (/admin/users)',
    systemSettings: 'Access to system configuration (/admin/settings)',
    auditLogs: 'Access to audit logs and system monitoring (/admin/audit)',
    platformAnalytics: 'Access to platform-wide analytics (/admin/analytics)',
    contentManagement: 'Access to content management system (/admin/content)',
    protocolManagement: 'Access to protocol and smart contract management (/admin/protocols)',
    riskManagement: 'Access to risk assessment and compliance tools (/admin/risk)',
    complianceTools: 'Access to compliance monitoring and reporting (/admin/compliance)',
    
    // Developer Tools
    apiDocumentation: 'Access to API documentation and testing tools (/docs/api)',
    webhooks: 'Access to webhook configuration and management (/admin/webhooks)',
    integrations: 'Access to third-party integrations management (/admin/integrations)'
  };

  // Critical features that should show warnings when disabled
  const criticalFeatures = ['dashboard', 'marketplace', 'portfolio', 'wallet'];

  // Debug logging
  console.log('🐛 FeatureManagement render - loading:', loading, 'userFeatures:', userFeatures, 'hasFeatures:', userFeatures && Object.keys(userFeatures).length > 0);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <FaSpinner className="animate-spin text-2xl text-blue-600 mr-3" />
        <span className="text-gray-600">Loading user features...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FaCog className="mr-2 text-blue-600" />
            Feature Management
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage feature permissions for {userName}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowTemplatesModal(true)}
            className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center"
          >
            <FaPalette className="mr-2" />
            Templates
          </button>
          <button
            onClick={copyFeaturesToClipboard}
            className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm flex items-center"
          >
            <FaCopy className="mr-2" />
            Copy
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {(success || error) && (
        <div className="mb-4">
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm flex items-center">
              <FaCheckCircle className="mr-2" />
              {success}
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm flex items-center">
              <FaExclamationTriangle className="mr-2" />
              {error}
            </div>
          )}
        </div>
      )}

      {/* Features Grid */}
      {userFeatures && Object.keys(userFeatures).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(userFeatures).map(([featureKey, enabled]) => {
            const isCritical = criticalFeatures.includes(featureKey);
            const description = featureDescriptions[featureKey] || 'Feature permission';
            
            return (
              <div
                key={featureKey}
                className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow ${
                  isCritical && !enabled ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-semibold text-gray-900 capitalize">
                        {featureKey.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      {isCritical && (
                        <FaShieldAlt className="text-orange-500 text-xs" title="Critical feature" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {description}
                    </p>
                    {isCritical && !enabled && (
                      <p className="text-xs text-red-600 mt-2 flex items-center">
                        <FaExclamationTriangle className="mr-1" />
                        Warning: Critical feature is disabled
                      </p>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleFeatureToggle(featureKey)}
                    className={`ml-3 flex-shrink-0 transition-colors ${
                      enabled 
                        ? 'text-green-600 hover:text-green-700' 
                        : 'text-gray-400 hover:text-gray-500'
                    }`}
                  >
                    {enabled ? (
                      <FaToggleOn className="text-2xl" />
                    ) : (
                      <FaToggleOff className="text-2xl" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <FaQuestionCircle className="mx-auto text-4xl text-gray-300 mb-4" />
          <p className="text-gray-500">No features found for this user</p>
        </div>
      )}

      {/* Action Buttons */}
      {hasChanges && (
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            onClick={handleResetChanges}
            disabled={saving}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center"
          >
            <FaUndo className="mr-2" />
            Reset Changes
          </button>
          <button
            onClick={handleSaveChanges}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
          >
            {saving ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              <FaSave className="mr-2" />
            )}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {/* Feature Templates Modal */}
      {showTemplatesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <FaPalette className="mr-3 text-purple-600" />
                Feature Templates
              </h3>
              <button
                onClick={() => setShowTemplatesModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimesCircle className="w-6 h-6" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Apply a predefined feature template to quickly configure user permissions.
            </p>

            {/* Role-based Templates Section */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center">
                👥 Role-Based Templates
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Recommended</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.isArray(featureTemplates) && featureTemplates
                  .filter(template => ['admin', 'moderator', 'user'].includes(template.name?.toLowerCase()))
                  .map((template) => (
                    <div key={template.name} className="relative">
                      <TemplatePreview 
                        template={template.name} 
                        features={template.features || {}} 
                        compact={true}
                      />
                      <div className="mt-2 flex justify-between items-center">
                        <p className="text-xs text-gray-600 flex-1 mr-2">{template.description}</p>
                        <button
                          onClick={() => handleApplyTemplate(template.name)}
                          disabled={saving}
                          className="px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 text-xs flex items-center"
                        >
                          {saving ? (
                            <FaSpinner className="animate-spin mr-1" />
                          ) : (
                            <FaCheckCircle className="mr-1" />
                          )}
                          Apply
                        </button>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* Other Templates Section */}
            <div>
              <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center">
                🎆 Subscription Templates
              </h4>
              <div className="space-y-3">
                {Array.isArray(featureTemplates) && featureTemplates
                  .filter(template => !['admin', 'moderator', 'user'].includes(template.name?.toLowerCase()))
                  .map((template) => (
                    <div key={template.name} className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h5 className="font-semibold text-gray-900 capitalize mr-2">
                              {template.name}
                            </h5>
                            {template.name === 'premium' && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                          <TemplatePreview 
                            template={template.name} 
                            features={template.features || {}} 
                            compact={true}
                          />
                        </div>
                        
                        <button
                          onClick={() => handleApplyTemplate(template.name)}
                          disabled={saving}
                          className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 text-sm flex items-center"
                        >
                          {saving ? (
                            <FaSpinner className="animate-spin mr-2" />
                          ) : (
                            <FaCheckCircle className="mr-2" />
                          )}
                          Apply
                        </button>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>

            {featureTemplates.length === 0 && (
              <div className="text-center py-8">
                <FaQuestionCircle className="mx-auto text-4xl text-gray-300 mb-4" />
                <p className="text-gray-500">No feature templates available</p>
              </div>
            )}

            <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowTemplatesModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature Change History (if available from API) */}
      {userFeatures && userFeatures.lastModified && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
            <FaHistory className="mr-2 text-gray-600" />
            Last Modified
          </h4>
          <div className="text-sm text-gray-600 space-y-1">
            {userFeatures.lastModifiedBy && (
              <div className="flex items-center">
                <span className="font-medium">Modified by:</span>
                <span className="ml-2">{userFeatures.lastModifiedBy}</span>
              </div>
            )}
            {userFeatures.lastModified && (
              <div className="flex items-center">
                <FaClock className="mr-1" />
                <span>{new Date(userFeatures.lastModified).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start">
          <FaInfo className="text-blue-600 mr-2 mt-1 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Feature Management Tips:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Critical features (marked with shield icon) should be enabled for core functionality</li>
              <li>Use templates to quickly apply predefined feature sets</li>
              <li>Changes are not saved until you click "Save Changes"</li>
              <li>All feature changes are logged for audit purposes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureManagement;
