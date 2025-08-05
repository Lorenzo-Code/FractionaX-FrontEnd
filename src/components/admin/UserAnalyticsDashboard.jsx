import React, { useState, useEffect } from 'react';
import { smartFetch } from '../shared/utils';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  FaUsers, FaChartLine, FaGlobeAmericas, FaUserCheck, FaUserTimes,
  FaCalendarAlt, FaFilter, FaDownload, FaEye, FaWallet, FaCoins,
  FaShieldAlt, FaExclamationTriangle, FaClock, FaArrowUp, FaArrowDown,
  FaSearch, FaUserTag, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHistory
} from 'react-icons/fa';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

const UserAnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('registrations');
  const [userSegment, setUserSegment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userBehaviorData, setUserBehaviorData] = useState([]);

  const timeRanges = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' },
    { value: 'all', label: 'All Time' }
  ];

  const userSegments = [
    { value: 'all', label: 'All Users' },
    { value: 'active', label: 'Active Users' },
    { value: 'verified', label: 'Verified Users' },
    { value: 'high_value', label: 'High Value Users' },
    { value: 'at_risk', label: 'At Risk Users' },
    { value: 'inactive', label: 'Inactive Users' }
  ];

  const metrics = [
    { value: 'registrations', label: 'New Registrations', icon: FaUsers },
    { value: 'activity', label: 'User Activity', icon: FaChartLine },
    { value: 'engagement', label: 'Engagement Rate', icon: FaEye },
    { value: 'retention', label: 'User Retention', icon: FaUserCheck },
    { value: 'wallets', label: 'Wallet Activity', icon: FaWallet },
    { value: 'tokens', label: 'Token Holdings', icon: FaCoins }
  ];

  useEffect(() => {
    fetchAnalytics();
  }, [selectedTimeRange, selectedMetric, userSegment]);

  const fetchAnalytics = async () => {
    const token = localStorage.getItem('access_token');
    setLoading(true);
    try {
      const response = await smartFetch('/api/admin/analytics/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          timeRange: selectedTimeRange,
          metric: selectedMetric,
          segment: userSegment,
          filters: {
            search: searchTerm
          }
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Failed to fetch analytics');

      setAnalytics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBehavior = async (userId) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await smartFetch(`/api/admin/analytics/user-behavior/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setUserBehaviorData(data.behaviorData);
      }
    } catch (err) {
      console.error('Failed to fetch user behavior:', err);
    }
  };

  const exportAnalytics = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await smartFetch('/api/admin/analytics/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          timeRange: selectedTimeRange,
          metric: selectedMetric,
          segment: userSegment
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `user_analytics_${selectedTimeRange}_${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const UserCard = ({ user, onClick }) => (
    <div 
      className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(user)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <FaUsers className="text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{user.email}</h4>
            <p className="text-sm text-gray-500">
              {user.firstName} {user.lastName}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            user.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : user.status === 'suspended'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {user.status}
          </span>
          <span className="text-xs text-gray-500 mt-1">
            KYC: {user.kycStatus}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="flex items-center space-x-1 text-gray-600">
            <FaCoins className="text-xs" />
            <span>FXCT: {user.fxctBalance || '0.00'}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <FaWallet className="text-xs" />
            <span>FXST: {user.fxstBalance || '0.00'}</span>
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-1 text-gray-600">
            <FaClock className="text-xs" />
            <span>Last Login:</span>
          </div>
          <span className="text-xs text-gray-500">
            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
          </span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Risk Score: {user.riskScore || 'Low'}</span>
          <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );

  const MetricCard = ({ title, value, change, icon: Icon, color = 'blue' }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change > 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
              {Math.abs(change)}% vs previous period
            </div>
          )}
        </div>
        <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
          <Icon className={`text-${color}-600 text-xl`} />
        </div>
      </div>
    </div>
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Analytics Dashboard</h2>
          <p className="text-gray-600">Comprehensive insights into user behavior and platform usage</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportAnalytics}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <FaDownload />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <FaFilter />
            <span>Advanced Filters</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Metric</label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {metrics.map(metric => (
                <option key={metric.value} value={metric.value}>{metric.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User Segment</label>
            <select
              value={userSegment}
              onChange={(e) => setUserSegment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {userSegments.map(segment => (
                <option key={segment.value} value={segment.value}>{segment.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {showAdvancedFilters && (
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Login</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">All</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="never">Never</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">KYC Status</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="not_started">Not Started</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {analytics && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Users"
              value={analytics.totalUsers?.toLocaleString()}
              change={analytics.userGrowth}
              icon={FaUsers}
              color="blue"
            />
            <MetricCard
              title="Active Users"
              value={analytics.activeUsers?.toLocaleString()}
              change={analytics.activityChange}
              icon={FaUserCheck}
              color="green"
            />
            <MetricCard
              title="Verified Users"
              value={analytics.verifiedUsers?.toLocaleString()}
              change={analytics.verificationChange}
              icon={FaShieldAlt}
              color="purple"
            />
            <MetricCard
              title="Total Token Balance"
              value={`${analytics.totalTokenBalance?.toLocaleString()} FXCT`}
              change={analytics.tokenChange}
              icon={FaCoins}
              color="yellow"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Registration Trends */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Registration Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.registrationTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="registrations" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* User Activity */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Active Users</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.activityTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="activeUsers" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* User Status Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.statusDistribution?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Geographic Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Countries</h3>
              <div className="space-y-3">
                {analytics.countryDistribution?.map((country, index) => (
                  <div key={country.country} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FaGlobeAmericas className="text-gray-400" />
                      <span className="font-medium">{country.country}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(country.count / analytics.totalUsers) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{country.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User List */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analytics.recentUsers?.map((user) => (
                  <UserCard
                    key={user._id}
                    user={user}
                    onClick={(user) => {
                      setSelectedUser(user);
                      fetchUserBehavior(user._id);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">User Profile: {selectedUser.email}</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Information */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span>{selectedUser.firstName} {selectedUser.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span>{selectedUser.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        selectedUser.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedUser.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Joined:</span>
                      <span>{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Token Balances</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">FXCT Balance:</span>
                      <span className="font-mono">{selectedUser.fxctBalance || '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">FXST Balance:</span>
                      <span className="font-mono">{selectedUser.fxstBalance || '0.00'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Behavior Chart */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Activity Timeline</h4>
                {userBehaviorData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={userBehaviorData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="activity" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <FaHistory className="mx-auto text-2xl mb-2" />
                    <p>No activity data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAnalyticsDashboard;
