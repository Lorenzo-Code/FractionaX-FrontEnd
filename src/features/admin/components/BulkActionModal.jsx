import React, { useState } from 'react';
import { FaUsers, FaTimes, FaLock, FaKey, FaBan, FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';

const BulkActionModal = ({ isOpen, onClose, onExecute, selectedUsers = [] }) => {
  const [action, setAction] = useState('force_logout');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const actionOptions = [
    { value: 'force_logout', label: 'Force Logout All Sessions', icon: FaBan, color: 'red' },
    { value: 'lock_account', label: 'Lock Accounts', icon: FaLock, color: 'red' },
    { value: 'unlock_account', label: 'Unlock Accounts', icon: FaLock, color: 'green' },
    { value: 'force_password_reset', label: 'Force Password Reset', icon: FaKey, color: 'orange' },
    { value: 'disable_2fa', label: 'Disable 2FA', icon: FaShieldAlt, color: 'yellow' },
    { value: 'suspend_account', label: 'Suspend Accounts', icon: FaBan, color: 'red' },
  ];

  const handleExecute = async () => {
    if (!reason.trim()) {
      alert('Please provide a reason for this bulk action.');
      return;
    }

    setLoading(true);
    try {
      await onExecute(action, reason);
      onClose();
      setAction('force_logout');
      setReason('');
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedAction = actionOptions.find(opt => opt.value === action);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaUsers className="text-blue-600 text-lg" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Bulk Security Action</h2>
              <p className="text-sm text-gray-600">
                {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
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
          {/* Action Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Action
            </label>
            <div className="space-y-2">
              {actionOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <div
                    key={option.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      action === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setAction(option.value)}
                  >
                    <input
                      type="radio"
                      name="action"
                      value={option.value}
                      checked={action === option.value}
                      onChange={(e) => setAction(e.target.value)}
                      className="mr-3"
                    />
                    <IconComponent className={`text-${option.color}-600 mr-3`} />
                    <span className="text-sm font-medium text-gray-900">
                      {option.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reason Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Action *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide a detailed reason for this bulk security action..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-yellow-600 mr-2" />
              <div className="text-sm">
                <p className="font-medium text-yellow-900">Warning</p>
                <p className="text-yellow-700">
                  This action will be applied to {selectedUsers.length} user account{selectedUsers.length !== 1 ? 's' : ''}. 
                  This action cannot be easily undone.
                </p>
              </div>
            </div>
          </div>

          {/* Selected Users Preview */}
          {selectedUsers.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Affected Users:</h4>
              <div className="max-h-32 overflow-y-auto border border-gray-200 rounded p-2">
                {selectedUsers.slice(0, 5).map((userId, index) => (
                  <div key={userId} className="text-xs text-gray-600 py-1">
                    User ID: {userId}
                  </div>
                ))}
                {selectedUsers.length > 5 && (
                  <div className="text-xs text-gray-500 py-1">
                    ... and {selectedUsers.length - 5} more users
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExecute}
            disabled={loading || !reason.trim()}
            className={`px-6 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${
              selectedAction ? `bg-${selectedAction.color}-600 hover:bg-${selectedAction.color}-700` : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {selectedAction && <selectedAction.icon />}
            <span>{loading ? 'Executing...' : `Execute ${selectedAction?.label || 'Action'}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionModal;
