import React, { useState } from 'react';
import { Shield, TrendingUp, Users, DollarSign, AlertTriangle, Settings, Pause, Play } from 'lucide-react';

const StakingProtocolCard = ({ protocol, onUpdate, onEmergencyAction }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    currentAPY: protocol.rewards?.currentAPY || 0,
    maxCapacity: protocol.capacity?.maxCapacity || 0,
    status: protocol.status || 'active'
  });

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSave = async () => {
    try {
      await onUpdate(protocol.protocolId, {
        rewards: { currentAPY: editedData.currentAPY },
        capacity: { maxCapacity: editedData.maxCapacity },
        status: editedData.status
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update protocol:', error);
    }
  };

  const handleEmergencyAction = async (action) => {
    try {
      await onEmergencyAction({
        action: action,
        protocolId: protocol.protocolId,
        reason: `Admin ${action} action`,
        severity: 'medium'
      });
    } catch (error) {
      console.error('Failed to execute emergency action:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{protocol.name}</h3>
          <div className="flex gap-2 mt-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskLevelColor(protocol.riskLevel)}`}>
              {protocol.riskLevel?.toUpperCase()} RISK
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(protocol.status)}`}>
              {protocol.status?.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit Protocol"
          >
            <Settings size={16} />
          </button>
          {protocol.status === 'active' ? (
            <button
              onClick={() => handleEmergencyAction('pause')}
              className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
              title="Pause Protocol"
            >
              <Pause size={16} />
            </button>
          ) : (
            <button
              onClick={() => handleEmergencyAction('resume')}
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Resume Protocol"
            >
              <Play size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Edit Mode */}
      {isEditing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="text-sm font-medium text-blue-900 mb-3">Edit Protocol Parameters</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Current APY (%)</label>
              <input
                type="number"
                step="0.1"
                value={editedData.currentAPY}
                onChange={(e) => setEditedData({...editedData, currentAPY: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Max Capacity</label>
              <input
                type="number"
                value={editedData.maxCapacity}
                onChange={(e) => setEditedData({...editedData, maxCapacity: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select
                value={editedData.status}
                onChange={(e) => setEditedData({...editedData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Rewards Information */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Current APY</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {protocol.rewards?.currentAPY}%
          </div>
          <div className="text-xs text-blue-700">
            Base: {protocol.rewards?.baseAPY}% | Max: {protocol.rewards?.maxAPY}%
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={16} className="text-green-600" />
            <span className="text-sm font-medium text-green-900">Total Staked</span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            ${protocol.capacity?.totalStaked?.toLocaleString()}
          </div>
          <div className="text-xs text-green-700">
            Utilization: {protocol.capacity?.utilizationRate}%
          </div>
        </div>
      </div>

      {/* Capacity Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Capacity Utilization</span>
          <span>{protocol.capacity?.utilizationRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${protocol.capacity?.utilizationRate}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>${protocol.capacity?.totalStaked?.toLocaleString()}</span>
          <span>${protocol.capacity?.maxCapacity?.toLocaleString()}</span>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Users size={14} className="text-gray-500" />
            <span className="text-xs font-medium text-gray-700">Stakers</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {protocol.performance?.totalStakers || 'N/A'}
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Shield size={14} className="text-gray-500" />
            <span className="text-xs font-medium text-gray-700">Score</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {protocol.performance?.performanceScore || 'N/A'}
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <DollarSign size={14} className="text-gray-500" />
            <span className="text-xs font-medium text-gray-700">Rewards</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            ${(protocol.performance?.totalRewardsDistributed || 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Security Information */}
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={16} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-900">Security Status</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-gray-600">Audit Status:</span>
            <span className={`ml-1 font-medium ${
              protocol.security?.auditStatus === 'audited' ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {protocol.security?.auditStatus || 'Unknown'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Auditor:</span>
            <span className="ml-1 font-medium text-gray-900">
              {protocol.security?.auditor || 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Last Audit:</span>
            <span className="ml-1 font-medium text-gray-900">
              {protocol.security?.lastAudit || 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Contract Risk:</span>
            <span className={`ml-1 font-medium ${
              protocol.security?.smartContractRisk === 'low' ? 'text-green-600' : 
              protocol.security?.smartContractRisk === 'medium' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {protocol.security?.smartContractRisk || 'Unknown'}
            </span>
          </div>
        </div>
      </div>

      {/* Admin Notes */}
      {protocol.adminNotes && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={14} className="text-yellow-600" />
            <span className="text-sm font-medium text-yellow-900">Admin Notes</span>
          </div>
          <p className="text-sm text-yellow-800">{protocol.adminNotes}</p>
        </div>
      )}
    </div>
  );
};

export default StakingProtocolCard;
