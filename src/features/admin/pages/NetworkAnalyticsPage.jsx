/**
 * Network Analytics Page
 * Admin page wrapper for the Network Analytics Dashboard
 */

import React, { useState } from 'react';
import NetworkAnalyticsDashboard from '../components/NetworkAnalyticsDashboard';
import CoreLogicAnalyticsDashboard from '../components/CoreLogicAnalyticsDashboard';
import { Network, Database } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../shared/components/ui/tabs';

const NetworkAnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState('corelogic'); // Start with CoreLogic tab since it works

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Network className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">API Analytics Center</h1>
                <p className="text-sm text-gray-500">Monitor API performance, costs, and system health across all providers</p>
              </div>
            </div>
            
            {/* Status Indicator */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Real-time Monitoring</span>
              </div>
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">CoreLogic Tracking Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content with Tabs */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="network" className="flex items-center space-x-2">
              <Network className="w-4 h-4" />
              <span>General Network Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="corelogic" className="flex items-center space-x-2">
              <Database className="w-4 h-4" />
              <span>CoreLogic API Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="network" className="mt-6">
            <NetworkAnalyticsDashboard />
          </TabsContent>

          <TabsContent value="corelogic" className="mt-6">
            <CoreLogicAnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NetworkAnalyticsPage;
