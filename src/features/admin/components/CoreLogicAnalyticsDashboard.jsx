/**
 * CoreLogic Analytics Dashboard
 * Real-time monitoring and cost management for CoreLogic API usage
 * Integrates with the backend CoreLogic tracking system
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { 
  DollarSign, Clock, Server, Zap, TrendingUp, TrendingDown, 
  Download, RefreshCw, AlertTriangle, CheckCircle, XCircle, 
  AlertCircle, Info, Shield, Activity, Database, Eye
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../shared/components/ui/tabs';
import { Badge } from '../../../shared/components/ui/badge';
import { Button } from '../../../shared/components/ui/button';
import { Alert, AlertDescription } from '../../../shared/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/ui/card';
import { Progress } from '../../../shared/components/ui/progress';
import LoadingSpinner from '../../../shared/components/ui/loading-spinner';
import { motion, AnimatePresence } from 'framer-motion';
import secureApiClient from '../../../shared/utils/secureApiClient';

// Color scheme for charts
const COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981', 
  warning: '#F59E0B',
  error: '#EF4444',
  success: '#22C55E',
  neutral: '#6B7280',
  purple: '#8B5CF6'
};

const CoreLogicAnalyticsDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [budgetStatus, setBudgetStatus] = useState(null);
  const [usageAnalytics, setUsageAnalytics] = useState(null);
  const [topConsumers, setTopConsumers] = useState(null);
  const [duplicateRequests, setDuplicateRequests] = useState(null);
  const [errorAnalysis, setErrorAnalysis] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7');
  const [selectedTimeType, setSelectedTimeType] = useState('days');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const realTimeInterval = useRef(null);
  const fetchInProgress = useRef(false);

  // API service methods
  const coreLogicApi = {
    async getDashboard() {
      const response = await secureApiClient.get('/api/admin/corelogic-analytics/dashboard');
      return response.json();
    },

    async getBudgetStatus() {
      const response = await secureApiClient.get('/api/admin/corelogic-analytics/budget-status');
      return response.json();
    },

    async getUsageSummary(period = '7', type = 'days') {
      const response = await secureApiClient.get(`/api/admin/corelogic-analytics/usage-summary?period=${period}&type=${type}`);
      return response.json();
    },

    async getTopConsumers(days = 30, limit = 10) {
      const response = await secureApiClient.get(`/api/admin/corelogic-analytics/top-consumers?days=${days}&limit=${limit}`);
      return response.json();
    },

    async getDuplicateRequests(hours = 24) {
      const response = await secureApiClient.get(`/api/admin/corelogic-analytics/duplicate-requests?hours=${hours}`);
      return response.json();
    },

    async getErrors(days = 7) {
      const response = await secureApiClient.get(`/api/admin/corelogic-analytics/errors?days=${days}`);
      return response.json();
    },

    async getAlerts() {
      const response = await secureApiClient.get('/api/admin/corelogic-analytics/alerts');
      return response.json();
    },

    async getOptimizationRecommendations(days = 30) {
      const response = await secureApiClient.get(`/api/admin/corelogic-analytics/optimization-recommendations?days=${days}`);
      return response.json();
    },

    async exportData(format = 'csv', days = 30) {
      const response = await secureApiClient.get(`/api/admin/corelogic-analytics/export-data?format=${format}&days=${days}`);
      if (format === 'csv') {
        return await response.blob();
      }
      return response.json();
    }
  };

  // Fetch all dashboard data
  const fetchDashboardData = useCallback(async (showRefreshing = false) => {
    if (fetchInProgress.current && !showRefreshing) {
      return;
    }

    fetchInProgress.current = true;
    
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      console.log('🔍 Fetching CoreLogic analytics data...');

      const [
        dashboard,
        budget,
        usage,
        consumers,
        duplicates,
        errors,
        alertsData
      ] = await Promise.all([
        coreLogicApi.getDashboard(),
        coreLogicApi.getBudgetStatus(),
        coreLogicApi.getUsageSummary(selectedTimeRange, selectedTimeType),
        coreLogicApi.getTopConsumers(30, 10),
        coreLogicApi.getDuplicateRequests(24),
        coreLogicApi.getErrors(7),
        coreLogicApi.getAlerts()
      ]);

      console.log('✅ CoreLogic data fetched:', { dashboard, budget, usage, alertsData });
      console.log('🔍 Alerts data structure:', alertsData);

      // Set data with robust null checking
      setDashboardData(dashboard?.data || dashboard);
      setBudgetStatus(budget?.data || budget);
      setUsageAnalytics(usage?.data || usage);
      setTopConsumers(consumers?.data || consumers);
      setDuplicateRequests(duplicates?.data || duplicates);
      setErrorAnalysis(errors?.data || errors);
      
      // Handle alerts with multiple possible response structures
      const processedAlerts = alertsData?.data?.alerts || alertsData?.alerts || alertsData || [];
      console.log('🔍 Processed alerts:', processedAlerts);
      setAlerts(Array.isArray(processedAlerts) ? processedAlerts : []);

    } catch (error) {
      console.error('❌ Failed to fetch CoreLogic analytics:', error);
      setAlerts([{
        type: 'critical',
        category: 'system',
        message: 'Failed to load CoreLogic analytics data',
        details: error.message,
        action: 'Check backend connectivity'
      }]);
    } finally {
      setLoading(false);
      setRefreshing(false);
      fetchInProgress.current = false;
    }
  }, [selectedTimeRange, selectedTimeType]);

  // Real-time updates
  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time updates every 60 seconds
    realTimeInterval.current = setInterval(() => {
      fetchDashboardData(true);
    }, 60000);

    return () => {
      if (realTimeInterval.current) {
        clearInterval(realTimeInterval.current);
      }
    };
  }, [fetchDashboardData]);

  // Export functionality
  const handleExport = async (format = 'csv') => {
    try {
      const blob = await coreLogicApi.exportData(format, 30);
      
      if (format === 'csv') {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `corelogic_analytics_${Date.now()}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-lg text-gray-600">Loading CoreLogic analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CoreLogic API Analytics</h1>
          <p className="text-gray-600 mt-1">Real-time monitoring of CoreLogic API usage, costs, and performance</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Time Range Selector */}
          <select 
            value={selectedTimeRange} 
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="1">Last 1 Day</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
          </select>

          {/* Export Button */}
          <Button
            onClick={() => handleExport('csv')}
            variant="outline"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          {/* Refresh Button */}
          <Button
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            {alerts.map((alert, index) => (
              <Alert key={index} className={
                alert.type === 'critical' ? 'border-red-200 bg-red-50' :
                alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                'border-blue-200 bg-blue-50'
              }>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex justify-between items-start">
                    <div>
                      <strong>{alert.message}</strong>
                      {alert.details && <p className="text-sm mt-1">{alert.details}</p>}
                    </div>
                    {alert.action && (
                      <Badge variant="outline" className="text-xs">
                        {alert.action}
                      </Badge>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Budget Status Card */}
      {budgetStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-600" />
              Budget Status - {budgetStatus?.monthYear || 'Current Month'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Monthly Budget</span>
                  <span className="text-sm text-gray-500">
                    ${budgetStatus?.budget?.used?.toFixed(2) || '0.00'} / ${budgetStatus?.budget?.total?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <Progress 
                  value={budgetStatus?.budget?.percentUsed || 0} 
                  className={`h-2 ${
                    (budgetStatus?.budget?.percentUsed || 0) >= 95 ? 'bg-red-200' :
                    (budgetStatus?.budget?.percentUsed || 0) >= 80 ? 'bg-yellow-200' : 
                    'bg-green-200'
                  }`}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{(budgetStatus?.budget?.percentUsed || 0).toFixed(1)}% used</span>
                  <span>${(budgetStatus?.budget?.remaining || 0).toFixed(2)} remaining</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Today's Usage:</span>
                  <span className="text-sm font-medium">${(budgetStatus?.todaysUsage?.totalCost || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Cache Hit Rate:</span>
                  <span className="text-sm font-medium text-green-600">
                    {(((budgetStatus?.usage?.cacheHits || 0) / (budgetStatus?.usage?.totalRequests || 1)) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">API Calls Today:</span>
                  <span className="text-sm font-medium">{budgetStatus?.todaysUsage?.apiCalls || 0}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-gray-600">Projected Monthly:</span>
                  <span className="ml-2 font-medium">${(budgetStatus?.projections?.monthlyProjection || 0).toFixed(2)}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Days Until Exhausted:</span>
                  <span className="ml-2 font-medium">
                    {Math.ceil(budgetStatus?.projections?.daysUntilBudgetExhausted || 0)}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Recommended Daily Limit:</span>
                  <span className="ml-2 font-medium">${(budgetStatus?.projections?.recommendedDailyLimit || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">📊 Overview</TabsTrigger>
          <TabsTrigger value="endpoints">🔗 Endpoints</TabsTrigger>
          <TabsTrigger value="users">👥 Users</TabsTrigger>
          <TabsTrigger value="errors">⚠️ Errors</TabsTrigger>
          <TabsTrigger value="optimization">💡 Optimize</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Requests"
              value={dashboardData?.dailyUsage?.totalCalls?.toLocaleString() || '0'}
              icon={<Activity className="w-6 h-6" />}
              trend={`${dashboardData?.dailyUsage?.apiCalls || 0} API calls`}
              color="blue"
            />
            
            <MetricCard
              title="Cache Hit Rate"
              value={`${dashboardData?.dailyUsage?.cacheHitRate || '0%'}`}
              icon={<Database className="w-6 h-6" />}
              trend={`${dashboardData?.dailyUsage?.cacheHits || 0} cache hits`}
              color="green"
            />
            
            <MetricCard
              title="Average Cost"
              value={`$${((dashboardData?.dailyUsage?.totalCost / dashboardData?.dailyUsage?.totalCalls) || 0).toFixed(2)}`}
              icon={<DollarSign className="w-6 h-6" />}
              trend="Per request"
              color="yellow"
            />
            
            <MetricCard
              title="Error Rate"
              value={`${((errorAnalysis?.summary?.totalErrors / dashboardData?.dailyUsage?.totalCalls) * 100 || 0).toFixed(1)}%`}
              icon={<AlertTriangle className="w-6 h-6" />}
              trend={`${errorAnalysis?.summary?.totalErrors || 0} errors`}
              color="red"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Endpoint Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Endpoint Performance</CardTitle>
              </CardHeader>
              <CardContent>
                {usageAnalytics?.performanceMetrics && usageAnalytics.performanceMetrics.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={usageAnalytics.performanceMetrics.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="_id" 
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        fontSize={12}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="avgResponseTime" fill={COLORS.primary} name="Avg Response Time (ms)" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    No performance data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cost Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Cost by Endpoint</CardTitle>
              </CardHeader>
              <CardContent>
                {usageAnalytics?.mostExpensiveEndpoints && usageAnalytics.mostExpensiveEndpoints.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={usageAnalytics.mostExpensiveEndpoints}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="totalCost"
                        nameKey="_id"
                      >
                        {usageAnalytics.mostExpensiveEndpoints.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % Object.values(COLORS).length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value}`, 'Cost']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    No cost data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="endpoints" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Endpoint Usage Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Endpoint</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Calls</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Cost</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Response Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Error Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {usageAnalytics?.performanceMetrics?.map((endpoint, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {endpoint?._id || 'Unknown endpoint'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {endpoint?.totalCalls?.toLocaleString() || '0'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${(endpoint?.avgCost || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {Math.round(endpoint?.avgResponseTime || 0)}ms
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={(endpoint?.errorRate || 0) > 0.05 ? 'destructive' : 'secondary'}>
                            {((endpoint?.errorRate || 0) * 100).toFixed(1)}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Top API Consumers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topConsumers?.consumers?.map((consumer, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{consumer?.userEmail || 'Unknown User'}</p>
                        <p className="text-sm text-gray-500">
                          {consumer?.totalCalls || 0} requests • {consumer?.uniquePropertyCount || 0} unique properties
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">${(consumer?.totalCost || 0).toFixed(2)}</p>
                      <p className="text-sm text-gray-500">Total cost</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Error Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Error Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                {errorAnalysis?.errors && errorAnalysis.errors.length > 0 ? (
                  <div className="space-y-4">
                    {errorAnalysis.errors.map((error, index) => (
                      <div key={index} className="border border-red-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{error?._id?.endpoint || 'Unknown endpoint'}</h4>
                          <Badge variant="destructive">{error?.errorCount || 0} errors</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Status Code: {error?._id?.statusCode || 'Unknown'}</p>
                        <div className="text-xs text-gray-500">
                          Last error: {error?.lastError ? new Date(error.lastError).toLocaleString() : 'N/A'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                    <p>No errors in the selected time period</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Duplicate Requests */}
            <Card>
              <CardHeader>
                <CardTitle>Duplicate Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {duplicateRequests?.duplicateGroups && duplicateRequests.duplicateGroups.length > 0 ? (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <p className="text-yellow-800">
                        <strong>{duplicateRequests?.totalDuplicateRequests || 0}</strong> duplicate request patterns found
                      </p>
                      <p className="text-yellow-700 text-sm">
                        Potential waste: <strong>${(duplicateRequests?.totalWastedCost || 0).toFixed(2)}</strong>
                      </p>
                    </div>
                    
                    {duplicateRequests.duplicateGroups.slice(0, 5).map((group, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{group?._id?.endpoint || 'Unknown endpoint'}</p>
                            <p className="text-sm text-gray-600">{group?._id?.address || 'Unknown'}, {group?._id?.city || 'Unknown'}</p>
                          </div>
                          <div className="text-right">
                            <Badge>{group?.count || 0} duplicates</Badge>
                            <p className="text-sm text-red-600 mt-1">${(group?.totalCost || 0).toFixed(2)} wasted</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                    <p>No duplicate requests detected</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="mt-6">
          <OptimizationRecommendations 
            usageData={usageAnalytics}
            duplicates={duplicateRequests}
          />
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500">
        Last updated: {dashboardData?.lastUpdated ? new Date(dashboardData.lastUpdated).toLocaleString() : 'Never'}
        {' • '}
        Auto-refresh: Every 60 seconds
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ title, value, icon, trend, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500'
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
            {trend && (
              <p className="text-sm text-gray-500 mt-1">{trend}</p>
            )}
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color] || colorClasses.blue} text-white`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Optimization Recommendations Component
const OptimizationRecommendations = ({ usageData, duplicates }) => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Generate recommendations based on usage data
    const recs = [];

    // Cache hit rate recommendation
    const cacheHitRate = parseFloat(usageData?.usageReport?.cacheHitRate?.replace('%', '') || '0');
    if (cacheHitRate < 70) {
      recs.push({
        type: 'cache',
        priority: 'high',
        title: 'Improve Cache Hit Rate',
        description: `Current cache hit rate is ${cacheHitRate}%. Increasing TTL for stable endpoints could save 20-30% on costs.`,
        potentialSavings: '$200-500/month',
        icon: <Database className="w-5 h-5" />
      });
    }

    // Duplicate requests recommendation
    if ((duplicates?.totalDuplicateRequests || 0) > 0) {
      recs.push({
        type: 'duplicates',
        priority: 'high',
        title: 'Eliminate Duplicate Requests',
        description: `${duplicates?.totalDuplicateRequests || 0} duplicate requests detected. Implement request deduplication.`,
        potentialSavings: `$${(duplicates?.totalWastedCost || 0).toFixed(2)}/day`,
        icon: <AlertTriangle className="w-5 h-5" />
      });
    }

    // High-cost endpoint recommendation
    if (usageData?.mostExpensiveEndpoints?.length > 0) {
      const topEndpoint = usageData.mostExpensiveEndpoints[0];
      if ((topEndpoint?.totalCost || 0) > 100) {
        recs.push({
          type: 'endpoint',
          priority: 'medium',
          title: 'Optimize High-Cost Endpoint',
          description: `${topEndpoint?._id || 'High-cost endpoint'} accounts for $${(topEndpoint?.totalCost || 0).toFixed(2)} in costs. Consider batching requests or increasing cache time.`,
          potentialSavings: '10-15% cost reduction',
          icon: <TrendingDown className="w-5 h-5" />
        });
      }
    }

    setRecommendations(recs);
  }, [usageData, duplicates]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-600">20-40%</h3>
            <p className="text-gray-600">Potential Cost Reduction</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <DollarSign className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-blue-600">$500-1500</h3>
            <p className="text-gray-600">Monthly Savings Potential</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Zap className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-purple-600">Real-time</h3>
            <p className="text-gray-600">Optimization Tracking</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Optimization Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          {recommendations.length > 0 ? (
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${
                      rec.priority === 'high' ? 'bg-red-100 text-red-600' :
                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {rec.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                        <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                          {rec.priority} priority
                        </Badge>
                      </div>
                      <p className="text-gray-600 mt-2">{rec.description}</p>
                      <p className="text-green-600 font-medium mt-2">💰 {rec.potentialSavings}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <p>No optimization recommendations at this time</p>
              <p className="text-sm">Your CoreLogic usage is already well optimized!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CoreLogicAnalyticsDashboard;
