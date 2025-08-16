import React, { useState } from 'react';
import { FaBell, FaTimes, FaExclamationTriangle, FaShieldAlt, FaSkullCrossbones } from 'react-icons/fa';

const CreateIncidentModal = ({ isOpen, onClose, onCreateIncident }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium',
    type: 'security_breach',
    assignee: '',
    priority: 'medium',
    affectedSystems: '',
    sourceIp: '',
    userId: ''
  });
  const [loading, setLoading] = useState(false);

  const severityOptions = [
    { value: 'low', label: 'Low', color: 'blue', icon: FaShieldAlt },
    { value: 'medium', label: 'Medium', color: 'yellow', icon: FaExclamationTriangle },
    { value: 'high', label: 'High', color: 'orange', icon: FaExclamationTriangle },
    { value: 'critical', label: 'Critical', color: 'red', icon: FaSkullCrossbones }
  ];

  const incidentTypes = [
    { value: 'security_breach', label: 'Security Breach' },
    { value: 'data_leak', label: 'Data Leak' },
    { value: 'unauthorized_access', label: 'Unauthorized Access' },
    { value: 'malware_detection', label: 'Malware Detection' },
    { value: 'phishing_attempt', label: 'Phishing Attempt' },
    { value: 'ddos_attack', label: 'DDoS Attack' },
    { value: 'brute_force_attack', label: 'Brute Force Attack' },
    { value: 'suspicious_activity', label: 'Suspicious Activity' },
    { value: 'policy_violation', label: 'Policy Violation' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const incidentData = {
        ...formData,
        status: 'open',
        createdAt: new Date(),
        reportedBy: 'Current Admin' // You might want to get this from auth context
      };

      await onCreateIncident(incidentData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        severity: 'medium',
        type: 'security_breach',
        assignee: '',
        priority: 'medium',
        affectedSystems: '',
        sourceIp: '',
        userId: ''
      });
      
      onClose();
      alert('Security incident created successfully!');
    } catch (error) {
      console.error('Failed to create incident:', error);
      alert('Failed to create incident: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectedSeverity = severityOptions.find(s => s.value === formData.severity);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <FaBell className="text-red-600 text-lg" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Create Security Incident</h2>
              <p className="text-sm text-gray-600">
                Report a new security incident for investigation
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title and Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Incident Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Brief description of the incident"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Incident Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {incidentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Detailed description of the security incident..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>

          {/* Severity and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity
              </label>
              <div className="space-y-2">
                {severityOptions.map(severity => {
                  const IconComponent = severity.icon;
                  return (
                    <div
                      key={severity.value}
                      className={`flex items-center p-2 border rounded-lg cursor-pointer transition-colors ${
                        formData.severity === severity.value
                          ? `border-${severity.color}-500 bg-${severity.color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleInputChange('severity', severity.value)}
                    >
                      <input
                        type="radio"
                        name="severity"
                        value={severity.value}
                        checked={formData.severity === severity.value}
                        onChange={(e) => handleInputChange('severity', e.target.value)}
                        className="mr-2"
                      />
                      <IconComponent className={`text-${severity.color}-600 mr-2`} />
                      <span className="text-sm font-medium">{severity.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source IP Address
              </label>
              <input
                type="text"
                value={formData.sourceIp}
                onChange={(e) => handleInputChange('sourceIp', e.target.value)}
                placeholder="e.g., 192.168.1.100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Affected User ID
              </label>
              <input
                type="text"
                value={formData.userId}
                onChange={(e) => handleInputChange('userId', e.target.value)}
                placeholder="User ID if applicable"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignee
              </label>
              <input
                type="text"
                value={formData.assignee}
                onChange={(e) => handleInputChange('assignee', e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Affected Systems
              </label>
              <input
                type="text"
                value={formData.affectedSystems}
                onChange={(e) => handleInputChange('affectedSystems', e.target.value)}
                placeholder="e.g., Web server, Database"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-600 mr-2" />
              <div className="text-sm">
                <p className="font-medium text-red-900">Security Incident</p>
                <p className="text-red-700">
                  This will create a new security incident in the system and may trigger automated 
                  notifications to the security team.
                </p>
              </div>
            </div>
          </div>
        </form>

        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.title.trim() || !formData.description.trim()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {selectedSeverity && <selectedSeverity.icon />}
            <span>{loading ? 'Creating...' : 'Create Incident'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateIncidentModal;
