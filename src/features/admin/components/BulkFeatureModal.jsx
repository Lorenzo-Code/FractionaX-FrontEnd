import React, { useState, useEffect } from 'react';
import { 
  FaUsers,
  FaToggleOn,
  FaToggleOff,
  FaSave,
  FaTimes,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSpinner,
  FaSearch,
  FaFilter,
  FaPalette,
  FaInfo,
  FaUserCheck,
  FaCog,
  FaHistory
} from 'react-icons/fa';
import adminApiService from '../services/adminApiService';

const BulkFeatureModal = ({ isOpen, onClose, selectedUsers, onSuccess }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [operationType, setOperationType] = useState('features'); // 'features' or 'template'
  const [featureChanges, setFeatureChanges] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [featureTemplates, setFeatureTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (selectedUsers && selectedUsers.length > 0) {
        // Use pre-selected users
        setUsers(selectedUsers);
        setFilteredUsers(selectedUsers);
        setSelectedUserIds(selectedUsers.map(user => user._id));
      } else {
        // Load all users for selection
        fetchUsers();
      }
      fetchFeatureTemplates();
    }
  }, [isOpen, selectedUsers]);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setUsers([]);
      setFilteredUsers([]);
      setSelectedUserIds([]);
      setSearchTerm('');
      setRoleFilter('');
      setOperationType('features');
      setFeatureChanges({});
      setSelectedTemplate('');
      setError('');
      setSuccess('');
    }
  }, [isOpen]);

  useEffect(() => {
    // Filter users based on search and role filter
    let filtered = users;
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApiService.getAllUsers();
      setUsers(response.users || []);
      setFilteredUsers(response.users || []);
    } catch (err) {
      setError('Failed to load users');
      console.error('Failed to load users:', err);
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
    }
  };

  const handleUserSelection = (userId) => {
    setSelectedUserIds(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedUserIds.length === filteredUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredUsers.map(user => user._id));
    }
  };

  const handleFeatureChange = (featureKey, enabled) => {
    setFeatureChanges(prev => ({
      ...prev,
      [featureKey]: enabled
    }));
  };

  const handleBulkFeatureUpdate = async () => {
    if (selectedUserIds.length === 0) {
      setError('Please select at least one user');
      return;
    }

    if (Object.keys(featureChanges).length === 0) {
      setError('Please select at least one feature to update');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      await adminApiService.bulkUpdateUserFeatures(selectedUserIds, featureChanges);
      
      setSuccess(`Features updated for ${selectedUserIds.length} users successfully!`);
      
      // Clear admin cache
      adminApiService.clearAdminCache();
      
      // Notify parent component
      if (onSuccess) {
        onSuccess('bulk_features', {
          userIds: selectedUserIds,
          features: featureChanges,
          count: selectedUserIds.length
        });
      }

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to update user features');
      setTimeout(() => setError(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleBulkTemplateApply = async () => {
    if (selectedUserIds.length === 0) {
      setError('Please select at least one user');
      return;
    }

    if (!selectedTemplate) {
      setError('Please select a template to apply');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      await adminApiService.bulkApplyFeatureTemplate(selectedUserIds, selectedTemplate);
      
      setSuccess(`${selectedTemplate} template applied to ${selectedUserIds.length} users successfully!`);
      
      // Clear admin cache
      adminApiService.clearAdminCache();
      
      // Notify parent component
      if (onSuccess) {
        onSuccess('bulk_template', {
          userIds: selectedUserIds,
          template: selectedTemplate,
          count: selectedUserIds.length
        });
      }

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to apply template');
      setTimeout(() => setError(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  const getSelectedUsersDisplay = () => {
    if (selectedUserIds.length === 0) return 'No users selected';
    if (selectedUserIds.length === 1) return '1 user selected';
    return `${selectedUserIds.length} users selected`;
  };

  // Available features for bulk operations
  const availableFeatures = [
    'advancedAnalytics',
    'premiumSupport', 
    'apiAccess',
    'customReports',
    'whiteLabeling',
    'riskManagement',
    'multiAssetTrading',
    'institutionalTools',
    'realTimeData',
    'mobileApp',
    'webApp',
    'notifications',
    'twoFactorAuth',
    'portfolioTracking',
    'socialTrading',
    'advancedCharts',
    'automaticInvesting',
    'taxReporting',
    'staking',
    'lending',
    'marginTrading',
    'optionsTrading',
    'fractionalInvesting',
    'cryptoWallet',
    'bankIntegration',
    'instantDeposits',
    'internationalTrading',
    'researchTools',
    'educationalContent',
    'communityFeatures'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <FaUsers className="mr-3 text-blue-600" />
            Bulk Feature Management
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Success/Error Messages */}
        {(success || error) && (
          <div className="mb-6">
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center">
                <FaCheckCircle className="mr-2" />
                {success}
              </div>
            )}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
                <FaExclamationTriangle className="mr-2" />
                {error}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Selection Panel */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Select Users</h3>
              <div className="text-sm text-gray-600">
                {getSelectedUsersDisplay()}
              </div>
            </div>

            {!selectedUsers && (
              <>
                {/* Search and Filters */}
                <div className="space-y-3">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">All Roles</option>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="moderator">Moderator</option>
                    </select>
                    
                    <button
                      onClick={handleSelectAll}
                      className="px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                    >
                      {selectedUserIds.length === filteredUsers.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                </div>

                {/* User List */}
                <div className="border border-gray-200 rounded-lg max-h-80 overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <FaSpinner className="animate-spin text-blue-600 mr-2" />
                      Loading users...
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <div
                          key={user._id}
                          className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                            selectedUserIds.includes(user._id) ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                          }`}
                          onClick={() => handleUserSelection(user._id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={selectedUserIds.includes(user._id)}
                                onChange={() => handleUserSelection(user._id)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {user.firstName && user.lastName 
                                    ? `${user.firstName} ${user.lastName}`
                                    : user.email}
                                </p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                user.role === 'admin' 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {user.role}
                              </span>
                              {user.suspended && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Suspended
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {selectedUsers && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <p className="text-sm text-gray-600 mb-3">Pre-selected users:</p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedUsers.map((user) => (
                    <div key={user._id} className="flex items-center justify-between text-sm">
                      <span className="font-medium">
                        {user.firstName && user.lastName 
                          ? `${user.firstName} ${user.lastName}` 
                          : user.email}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Operation Selection Panel */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Choose Operation</h3>

            {/* Operation Type Selection */}
            <div className="space-y-3">
              <div className="flex space-x-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="operationType"
                    value="features"
                    checked={operationType === 'features'}
                    onChange={(e) => setOperationType(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700 flex items-center">
                    <FaCog className="mr-2" />
                    Update Specific Features
                  </span>
                </label>
                
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="operationType"
                    value="template"
                    checked={operationType === 'template'}
                    onChange={(e) => setOperationType(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700 flex items-center">
                    <FaPalette className="mr-2" />
                    Apply Template
                  </span>
                </label>
              </div>
            </div>

            {/* Feature Updates */}
            {operationType === 'features' && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">Select Features to Update</h4>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-start">
                    <FaInfo className="text-blue-600 mr-2 mt-1 flex-shrink-0" />
                    <p className="text-sm text-blue-800">
                      Only selected features will be updated. Unselected features will remain unchanged for each user.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
                  {availableFeatures.map((featureKey) => (
                    <div key={featureKey} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 capitalize">
                        {featureKey.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleFeatureChange(featureKey, false)}
                          className={`px-2 py-1 text-xs rounded ${
                            featureChanges[featureKey] === false 
                              ? 'bg-red-600 text-white' 
                              : 'bg-gray-200 text-gray-600 hover:bg-red-100'
                          }`}
                        >
                          Disable
                        </button>
                        <button
                          onClick={() => handleFeatureChange(featureKey, true)}
                          className={`px-2 py-1 text-xs rounded ${
                            featureChanges[featureKey] === true 
                              ? 'bg-green-600 text-white' 
                              : 'bg-gray-200 text-gray-600 hover:bg-green-100'
                          }`}
                        >
                          Enable
                        </button>
                        {featureChanges.hasOwnProperty(featureKey) && (
                          <button
                            onClick={() => {
                              const newChanges = { ...featureChanges };
                              delete newChanges[featureKey];
                              setFeatureChanges(newChanges);
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <FaTimes className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {Object.keys(featureChanges).length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Features to update:</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(featureChanges).map(([featureKey, enabled]) => (
                        <span
                          key={featureKey}
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            enabled 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {featureKey.replace(/([A-Z])/g, ' $1').trim()}: {enabled ? 'Enable' : 'Disable'}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Template Selection */}
            {operationType === 'template' && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">Select Template</h4>
                <div className="bg-yellow-50 rounded-lg p-3">
                  <div className="flex items-start">
                    <FaExclamationTriangle className="text-yellow-600 mr-2 mt-1 flex-shrink-0" />
                    <p className="text-sm text-yellow-800">
                      Applying a template will overwrite all existing feature permissions for the selected users.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {featureTemplates.map((template) => (
                    <label key={template.name} className="flex items-start cursor-pointer">
                      <input
                        type="radio"
                        name="template"
                        value={template.name}
                        checked={selectedTemplate === template.name}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mt-1"
                      />
                      <div className="ml-3">
                        <div className="font-medium text-gray-900 capitalize">
                          {template.name}
                          {template.name === 'default' && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              Recommended
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">{template.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {selectedUserIds.length > 0 && (
              <span className="flex items-center">
                <FaUserCheck className="mr-2 text-green-600" />
                Ready to update {selectedUserIds.length} user{selectedUserIds.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            
            {operationType === 'features' ? (
              <button
                onClick={handleBulkFeatureUpdate}
                disabled={saving || selectedUserIds.length === 0 || Object.keys(featureChanges).length === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {saving ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <FaSave className="mr-2" />
                )}
                {saving ? 'Updating...' : 'Update Features'}
              </button>
            ) : (
              <button
                onClick={handleBulkTemplateApply}
                disabled={saving || selectedUserIds.length === 0 || !selectedTemplate}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {saving ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <FaPalette className="mr-2" />
                )}
                {saving ? 'Applying...' : 'Apply Template'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkFeatureModal;
