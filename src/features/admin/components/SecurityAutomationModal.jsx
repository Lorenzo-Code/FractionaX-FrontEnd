import React, { useState } from 'react';
import { FaRobot, FaTimes, FaPlus, FaMinus, FaSave } from 'react-icons/fa';
import securityApiService from '../services/securityApiService';

const SecurityAutomationModal = ({ isOpen, onClose, onSave, rule = null }) => {
  const [formData, setFormData] = useState({
    name: rule?.name || '',
    description: rule?.description || '',
    enabled: rule?.enabled ?? true,
    trigger: rule?.trigger || 'failed_login_attempts',
    conditions: rule?.conditions || [{
      field: 'attempt_count',
      operator: 'greater_than',
      value: '5'
    }],
    actions: rule?.actions || [{
      type: 'lock_account',
      parameters: {
        duration: '30m',
        notify_admin: true
      }
    }],
    priority: rule?.priority || 'medium',
    cooldown: rule?.cooldown || '5m'
  });

  const [saving, setSaving] = useState(false);

  const triggerOptions = [
    { value: 'failed_login_attempts', label: 'Failed Login Attempts' },
    { value: 'suspicious_ip', label: 'Suspicious IP Address' },
    { value: 'password_policy_violation', label: 'Password Policy Violation' },
    { value: 'multiple_device_login', label: 'Multiple Device Login' },
    { value: 'geolocation_anomaly', label: 'Geolocation Anomaly' },
    { value: 'api_abuse', label: 'API Abuse Detection' },
    { value: 'unusual_activity_pattern', label: 'Unusual Activity Pattern' },
    { value: 'privilege_escalation', label: 'Privilege Escalation Attempt' },
    { value: 'data_exfiltration', label: 'Data Exfiltration Pattern' },
    { value: 'brute_force_attack', label: 'Brute Force Attack' }
  ];

  const actionOptions = [
    { value: 'lock_account', label: 'Lock User Account' },
    { value: 'force_logout', label: 'Force Logout All Sessions' },
    { value: 'block_ip', label: 'Block IP Address' },
    { value: 'require_2fa', label: 'Require 2FA Setup' },
    { value: 'notify_admin', label: 'Notify Administrators' },
    { value: 'create_incident', label: 'Create Security Incident' },
    { value: 'quarantine_device', label: 'Quarantine Device' },
    { value: 'restrict_permissions', label: 'Restrict User Permissions' },
    { value: 'force_password_reset', label: 'Force Password Reset' },
    { value: 'increase_monitoring', label: 'Increase User Monitoring' }
  ];

  const operatorOptions = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'contains', label: 'Contains' },
    { value: 'not_contains', label: 'Does Not Contain' },
    { value: 'in_list', label: 'In List' },
    { value: 'not_in_list', label: 'Not In List' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConditionChange = (index, field, value) => {
    const newConditions = [...formData.conditions];
    newConditions[index] = {
      ...newConditions[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      conditions: newConditions
    }));
  };

  const handleActionChange = (index, field, value) => {
    const newActions = [...formData.actions];
    if (field === 'type') {
      newActions[index] = {
        type: value,
        parameters: {}
      };
    } else {
      newActions[index] = {
        ...newActions[index],
        parameters: {
          ...newActions[index].parameters,
          [field]: value
        }
      };
    }
    setFormData(prev => ({
      ...prev,
      actions: newActions
    }));
  };

  const addCondition = () => {
    setFormData(prev => ({
      ...prev,
      conditions: [
        ...prev.conditions,
        {
          field: 'attempt_count',
          operator: 'greater_than',
          value: ''
        }
      ]
    }));
  };

  const removeCondition = (index) => {
    if (formData.conditions.length > 1) {
      setFormData(prev => ({
        ...prev,
        conditions: prev.conditions.filter((_, i) => i !== index)
      }));
    }
  };

  const addAction = () => {
    setFormData(prev => ({
      ...prev,
      actions: [
        ...prev.actions,
        {
          type: 'notify_admin',
          parameters: {}
        }
      ]
    }));
  };

  const removeAction = (index) => {
    if (formData.actions.length > 1) {
      setFormData(prev => ({
        ...prev,
        actions: prev.actions.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const ruleData = {
        ...formData,
        id: rule?._id
      };
      
      await securityApiService.saveAutomationRule(ruleData);
      onSave();
      onClose();
      alert('Automation rule saved successfully!');
    } catch (error) {
      alert(`Failed to save rule: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const getActionParameters = (action) => {
    switch (action.type) {
      case 'lock_account':
        return (
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <label className="block text-xs font-medium text-gray-700">Duration</label>
              <select
                value={action.parameters.duration || '30m'}
                onChange={(e) => handleActionChange(formData.actions.indexOf(action), 'duration', e.target.value)}
                className="mt-1 w-full px-2 py-1 text-xs border rounded-md"
              >
                <option value="15m">15 minutes</option>
                <option value="30m">30 minutes</option>
                <option value="1h">1 hour</option>
                <option value="24h">24 hours</option>
                <option value="permanent">Permanent</option>
              </select>
            </div>
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                checked={action.parameters.notify_admin || false}
                onChange={(e) => handleActionChange(formData.actions.indexOf(action), 'notify_admin', e.target.checked)}
                className="mr-2"
              />
              <label className="text-xs text-gray-700">Notify Admin</label>
            </div>
          </div>
        );
      
      case 'block_ip':
        return (
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <label className="block text-xs font-medium text-gray-700">Duration</label>
              <select
                value={action.parameters.duration || '1h'}
                onChange={(e) => handleActionChange(formData.actions.indexOf(action), 'duration', e.target.value)}
                className="mt-1 w-full px-2 py-1 text-xs border rounded-md"
              >
                <option value="1h">1 hour</option>
                <option value="24h">24 hours</option>
                <option value="7d">7 days</option>
                <option value="permanent">Permanent</option>
              </select>
            </div>
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                checked={action.parameters.block_subnet || false}
                onChange={(e) => handleActionChange(formData.actions.indexOf(action), 'block_subnet', e.target.checked)}
                className="mr-2"
              />
              <label className="text-xs text-gray-700">Block Subnet</label>
            </div>
          </div>
        );
      
      case 'create_incident':
        return (
          <div className="space-y-2 mt-2">
            <div>
              <label className="block text-xs font-medium text-gray-700">Severity</label>
              <select
                value={action.parameters.severity || 'medium'}
                onChange={(e) => handleActionChange(formData.actions.indexOf(action), 'severity', e.target.value)}
                className="mt-1 w-full px-2 py-1 text-xs border rounded-md"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">Assign To</label>
              <input
                type="text"
                placeholder="admin@example.com"
                value={action.parameters.assignee || ''}
                onChange={(e) => handleActionChange(formData.actions.indexOf(action), 'assignee', e.target.value)}
                className="mt-1 w-full px-2 py-1 text-xs border rounded-md"
              />
            </div>
          </div>
        );
      
      case 'notify_admin':
        return (
          <div className="space-y-2 mt-2">
            <div>
              <label className="block text-xs font-medium text-gray-700">Notification Method</label>
              <select
                value={action.parameters.method || 'email'}
                onChange={(e) => handleActionChange(formData.actions.indexOf(action), 'method', e.target.value)}
                className="mt-1 w-full px-2 py-1 text-xs border rounded-md"
              >
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="slack">Slack</option>
                <option value="webhook">Webhook</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={action.parameters.urgent || false}
                onChange={(e) => handleActionChange(formData.actions.indexOf(action), 'urgent', e.target.checked)}
                className="mr-2"
              />
              <label className="text-xs text-gray-700">Mark as Urgent</label>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaRobot className="text-purple-600 text-lg" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {rule ? 'Edit Automation Rule' : 'Create Automation Rule'}
              </h2>
              <p className="text-sm text-gray-600">
                Set up automated responses to security events
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rule Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Block Brute Force Attacks"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe what this rule does and when it should be triggered..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Trigger Configuration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trigger Event *
            </label>
            <select
              value={formData.trigger}
              onChange={(e) => handleInputChange('trigger', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {triggerOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Conditions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Conditions
              </label>
              <button
                onClick={addCondition}
                className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm"
              >
                <FaPlus />
                <span>Add Condition</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.conditions.map((condition, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    value={condition.field}
                    onChange={(e) => handleConditionChange(index, 'field', e.target.value)}
                    placeholder="Field name"
                    className="flex-1 px-2 py-1 text-sm border rounded-md"
                  />
                  
                  <select
                    value={condition.operator}
                    onChange={(e) => handleConditionChange(index, 'operator', e.target.value)}
                    className="px-2 py-1 text-sm border rounded-md"
                  >
                    {operatorOptions.map(op => (
                      <option key={op.value} value={op.value}>
                        {op.label}
                      </option>
                    ))}
                  </select>
                  
                  <input
                    type="text"
                    value={condition.value}
                    onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                    placeholder="Value"
                    className="flex-1 px-2 py-1 text-sm border rounded-md"
                  />
                  
                  {formData.conditions.length > 1 && (
                    <button
                      onClick={() => removeCondition(index)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <FaMinus />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Actions to Execute
              </label>
              <button
                onClick={addAction}
                className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm"
              >
                <FaPlus />
                <span>Add Action</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.actions.map((action, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <select
                      value={action.type}
                      onChange={(e) => handleActionChange(index, 'type', e.target.value)}
                      className="px-3 py-2 border rounded-md"
                    >
                      {actionOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    
                    {formData.actions.length > 1 && (
                      <button
                        onClick={() => removeAction(index)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <FaMinus />
                      </button>
                    )}
                  </div>
                  
                  {getActionParameters(action)}
                </div>
              ))}
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cooldown Period
              </label>
              <select
                value={formData.cooldown}
                onChange={(e) => handleInputChange('cooldown', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="1m">1 minute</option>
                <option value="5m">5 minutes</option>
                <option value="15m">15 minutes</option>
                <option value="30m">30 minutes</option>
                <option value="1h">1 hour</option>
              </select>
            </div>
            
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => handleInputChange('enabled', e.target.checked)}
                className="mr-3"
              />
              <label className="text-sm font-medium text-gray-700">
                Enable this rule immediately
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !formData.name.trim()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <FaSave />
            <span>{saving ? 'Saving...' : 'Save Rule'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityAutomationModal;
