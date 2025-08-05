import React, { useState, useEffect } from 'react';
import { smartFetch } from '../shared/utils';
import {
  FaUsers, FaChartLine, FaExclamationTriangle, FaBrain, FaChartArea
} from 'react-icons/fa';

const EnhancedUserAnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const token = localStorage.getItem('access_token');
    setLoading(true);
    try {
      const response = await smartFetch('/api/admin/analytics/users/enhanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          timeRange: '30d',
          metric: 'registrations',
          segment: 'all'
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <FaChartArea className="mr-3 text-blue-600" />
            Enhanced User Analytics
          </h2>
          <p className="text-gray-600 mt-1">AI-powered insights and predictive analytics for user behavior</p>
        </div>
      </div>

      {/* Analytics Dashboard Content */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="text-center text-gray-500 py-8">
          <FaBrain className="mx-auto text-4xl mb-4 opacity-50" />
          <p>Enhanced analytics dashboard is being developed...</p>
          <p className="text-sm mt-2">This component will include advanced user behavior analysis, predictive insights, and AI-powered recommendations.</p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedUserAnalyticsDashboard;
