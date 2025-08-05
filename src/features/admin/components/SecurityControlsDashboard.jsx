import React, { useState, useEffect } from 'react';
import { smartFetch } from '../../../shared/utils';
import {
  FaShieldAlt, FaLock, FaUnlock, FaKey, FaEye, FaEyeSlash,
  FaExclamationTriangle, FaBan, FaCheckCircle, FaTimesCircle,
  FaClock, FaMapMarkerAlt, FaDesktop, FaMobile, FaTablet,
  FaHistory, FaUserShield, FaSearch, FaFilter, FaDownload,
  FaSync, FaTrash, FaEdit, FaBell, FaWifi, FaGlobe
} from 'react-icons/fa';

const SecurityControlsDashboard = () => {
  const [securityData, setSecurityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showSecurityLogModal, setShowSecurityLogModal] = useState(false);
  const [securityLogs, setSecurityLogs] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [securityFilters, setSecurityFilters] = useState({
    riskLevel: 'all',
    status: 'all',
    lastLogin: 'all'
  });

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    const token = localStorage.getItem('access_token');
    setLoading(true);
    
    try {
      const response = await smartFetch('/api/admin/security/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Failed to fetch security data');

      setSecurityData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSessions = async (userId) => {
    const token = localStorage.getItem('access_token');
    
    try {
      const response = await smartFetch(`/api/admin/security/sessions/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setActiveSessions(data.sessions);
      }
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    }
  };

  const fetchSecurityLogs = async (userId) => {
    const token = localStorage.getItem('access_token');
    
    try {
      const response = await smartFetch(`/api/admin/security/logs/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setSecurityLogs(data.logs);
      }
    } catch (err) {
      console.error('Failed to fetch security logs:', err);
    }
  };

  const handleForceLogout = async (userId, sessionId = null) => {
    const token = localStorage.getItem('access_token');
    
    try {
      const response = await smartFetch('/api/admin/security/force-logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          sessionId: sessionId || 'all'
        }),
      });

      if (response.ok) {
        alert('User logged out successfully');
        fetchSecurityData();
        if (sessionId) {
          fetchUserSessions(userId);
        }
      }
    } catch (err) {
      console.error('Force logout failed:', err);
    }
  };

  const handleToggle2FA = async (userId, enable) => {
    const token = localStorage.getItem('access_token');
    
    try {
      const response = await smartFetch('/api/admin/security/2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          action: enable ? 'enable' : 'disable'
        }),
      });

      if (response.ok) {
        alert(`2FA ${enable ? 'enabled' : 'disabled'} successfully`);
        fetchSecurityData();
      }
    } catch (err) {
      console.error('2FA toggle failed:', err);
    }
  };

  const handleSecurityAction = async (userId, action, reason = '') => {
    const token = localStorage.getItem('access_token');
    
    try {
      const response = await smartFetch('/api/admin/security/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          action,
          reason
        }),
      });

      if (response.ok) {
        alert(`Security action ${action} applied successfully`);
        fetchSecurityData();
      }
    } catch (err) {
      console.error('Security action failed:', err);
    }
  };

  const getDeviceIcon = (deviceType) => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile':
        return <FaMobile className="text-blue-500" />;
      case 'tablet':
        return <FaTablet className="text-green-500" />;
      default:
        return <FaDesktop className="text-gray-500" />;
    }
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const SecurityCard = ({ title, value, icon: Icon, color = 'blue', subtitle = null }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
          <Icon className={`text-${color}-600 text-xl`} />
        </div>
      </div>
    </div>
  );

  const UserSecurityRow = ({ user }) => (
    <tr className="border-t hover:bg-gray-50">
      <td className="p-3">
        <div>
          <div className="font-medium text-gray-900">{user.email}</div>
          <div className="text-sm text-gray-500">{user.firstName} {user.lastName}</div>
        </div>
      </td>
      <td className="p-3">
        <div className="flex items-center space-x-2">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskLevelColor(user.riskLevel)}`}>
            {user.riskLevel}
          </span>
          {user.riskLevel === 'high' && (
            <FaExclamationTriangle className="text-red-500" />
          )}
        </div>
      </td>
      <td className="p-3">
        <div className="flex items-center space-x-2">
          {user.twoFactorEnabled ? (
            <FaCheckCircle className="text-green-500" />
          ) : (
            <FaTimesCircle className="text-red-500" />
          )}
          <span className="text-sm">
            {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </td>
      <td className="p-3">
        <div className="text-sm">
          <div>{user.activeSessions || 0} active</div>
          <div className="text-gray-500">
            Last: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
          </div>
        </div>
      </td>
      <td className="p-3">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => {
              setSelectedUser(user);
              fetchUserSessions(user._id);
              setShowSessionModal(true);
            }}
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
            title="Manage Sessions"
          >
            <FaDesktop />
          </button>
          <button
            onClick={() => {
              setSelectedUser(user);
              setShow2FAModal(true);
            }}
            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded"
            title="2FA Settings"
          >
            <FaShieldAlt />
          </button>
          <button
            onClick={() => {
              setSelectedUser(user);
              fetchSecurityLogs(user._id);
              setShowSecurityLogModal(true);
            }}
            className="p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded"
            title="Security Logs"
          >
            <FaHistory />
          </button>
          <button
            onClick={() => handleForceLogout(user._id)}
            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
            title="Force Logout"
          >
            <FaBan />
          </button>
        </div>
      </td>
    </tr>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <FaExclamationTriangle className="text-red-600 mr-2" />
          <span className="text-red-800">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Security Controls Dashboard</h2>
          <p className="text-gray-600">Monitor and manage user security settings</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchSecurityData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <FaSync />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Security Metrics */}
      {securityData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SecurityCard
            title="High Risk Users"
            value={securityData.highRiskUsers}
            icon={FaExclamationTriangle}
            color="red"
            subtitle="Requires attention"
          />
          <SecurityCard
            title="2FA Enabled"
            value={`${securityData.twoFactorUsers}/${securityData.totalUsers}`}
            icon={FaShieldAlt}
            color="green"
            subtitle={`${Math.round((securityData.twoFactorUsers / securityData.totalUsers) * 100)}% coverage`}
          />
          <SecurityCard
            title="Active Sessions"
            value={securityData.activeSessions}
            icon={FaDesktop}
            color="blue"
            subtitle="Currently online"
          />
          <SecurityCard
            title="Security Alerts"
            value={securityData.securityAlerts}
            icon={FaBell}
            color="yellow"
            subtitle="Last 24h"
          />
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={securityFilters.riskLevel}
            onChange={(e) => setSecurityFilters(prev => ({ ...prev, riskLevel: e.target.value }))}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Risk Levels</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk</option>
          </select>

          <select
            value={securityFilters.status}
            onChange={(e) => setSecurityFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All 2FA Status</option>
            <option value="enabled">2FA Enabled</option>
            <option value="disabled">2FA Disabled</option>
          </select>

          <select
            value={securityFilters.lastLogin}
            onChange={(e) => setSecurityFilters(prev => ({ ...prev, lastLogin: e.target.value }))}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Login Times</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="never">Never</option>
          </select>
        </div>
      </div>

      {/* User Security Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">User Security Overview</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left p-3">User</th>
                <th className="text-left p-3">Risk Level</th>
                <th className="text-left p-3">2FA Status</th>
                <th className="text-left p-3">Sessions</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {securityData?.users?.map((user) => (
                <UserSecurityRow key={user._id} user={user} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Session Management Modal */}
      {showSessionModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Active Sessions - {selectedUser.email}</h3>
              <button
                onClick={() => setShowSessionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {activeSessions.map((session) => (
                <div key={session.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getDeviceIcon(session.deviceType)}
                      <div>
                        <div className="font-medium">{session.deviceInfo}</div>
                        <div className="text-sm text-gray-500">
                          {session.location} • {session.ip}
                        </div>
                        <div className="text-xs text-gray-400">
                          Started: {new Date(session.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {session.current && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Current
                        </span>
                      )}
                      <button
                        onClick={() => handleForceLogout(selectedUser._id, session.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        End Session
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => handleForceLogout(selectedUser._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                End All Sessions
              </button>
              <button
                onClick={() => setShowSessionModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Management Modal */}
      {show2FAModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">2FA Settings - {selectedUser.email}</h3>
              <button
                onClick={() => setShow2FAModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-sm text-gray-500">
                    Status: {selectedUser.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
                <button
                  onClick={() => handleToggle2FA(selectedUser._id, !selectedUser.twoFactorEnabled)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedUser.twoFactorEnabled
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {selectedUser.twoFactorEnabled ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShow2FAModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Logs Modal */}
      {showSecurityLogModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Security Logs - {selectedUser.email}</h3>
              <button
                onClick={() => setShowSecurityLogModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-3">Timestamp</th>
                    <th className="text-left p-3">Event</th>
                    <th className="text-left p-3">IP Address</th>
                    <th className="text-left p-3">Location</th>
                    <th className="text-left p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {securityLogs.map((log, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-3 text-sm">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="p-3">{log.event}</td>
                      <td className="p-3 font-mono text-sm">{log.ip}</td>
                      <td className="p-3">{log.location}</td>
                      <td className="p-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          log.status === 'success' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowSecurityLogModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityControlsDashboard;
