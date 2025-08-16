/**
 * Network Analytics Page
 * Admin page wrapper for the Network Analytics Dashboard
 */

import React from 'react';
import NetworkAnalyticsDashboard from '../components/NetworkAnalyticsDashboard';
import { Network } from 'lucide-react';

const NetworkAnalyticsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Network className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Network Analytics</h1>
                <p className="text-sm text-gray-500">Monitor API performance, costs, and system health</p>
              </div>
            </div>
            
            {/* Status Indicator */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">System Monitoring Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto">
        <NetworkAnalyticsDashboard />
      </div>
    </div>
  );
};

export default NetworkAnalyticsPage;
