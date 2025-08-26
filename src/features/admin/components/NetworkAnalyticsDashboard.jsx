/**
 * FractionaX Network Analytics Dashboard
 * Comprehensive real-time monitoring and analytics for external API integrations
 * Features: Provider performance, cost analysis, error tracking, benchmarking
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { 
  Activity, AlertTriangle, DollarSign, Clock, Server, Zap, 
  TrendingUp, TrendingDown, Download, RefreshCw, Filter,
  CheckCircle, XCircle, AlertCircle, Info
} from 'lucide-react';
import adminApiService from '../services/adminApiService';
import useAuth from '../../../shared/hooks/useAuth';
import ProviderPricingConfigurator from './ProviderPricingConfigurator';
import NetworkAnalyticsPlaceholder from './NetworkAnalyticsErrorBoundary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../shared/components/ui/tabs';
import { Badge } from '../../../shared/components/ui/badge';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/components/ui/select';
import { Textarea } from '../../../shared/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '../../../shared/components/ui/dialog';
import { Label } from '../../../shared/components/ui/label';
import { Checkbox } from '../../../shared/components/ui/checkbox';
import LoadingSpinner from '../../../shared/components/ui/loading-spinner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Edit, Eye, Archive, Building2, Target, BarChart3
} from 'lucide-react';

// Color scheme for charts
const COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981', 
  warning: '#F59E0B',
  error: '#EF4444',
  success: '#22C55E',
  neutral: '#6B7280'
};

const NetworkAnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [realTimeMetrics, setRealTimeMetrics] = useState(null);
  const [costAnalysis, setCostAnalysis] = useState(null);
  const [errorAnalysis, setErrorAnalysis] = useState(null);
  const [benchmarks, setBenchmarks] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [activeTab, setActiveTab] = useState('analytics');
  const [hasApiError, setHasApiError] = useState(false);
  
  // Provider pricing override state
  const [overrides, setOverrides] = useState([]);
  const [showCreateOverrideModal, setShowCreateOverrideModal] = useState(false);
  const [overrideFormData, setOverrideFormData] = useState({
    provider: '',
    originalPricing: { type: 'token_based', models: {}, endpoints: {} },
    overridePricing: { type: 'token_based', models: {}, endpoints: {} },
    negotiationDetails: {
      contactPerson: '',
      negotiationDate: '',
      terms: '',
      effectiveDate: ''
    },
    validityPeriod: { startDate: '', endDate: '' },
    notes: '',
    requiresApproval: true
  });
  
  const realTimeInterval = useRef(null);
  const fetchInProgress = useRef(false);

  // Mock data for development/testing
  const getMockData = () => {
    return {
      analytics: {
        overview: {
          totalRequests: 15420,
          successfulRequests: 14890,
          averageResponseTime: 245,
          totalCost: 127.50
        },
        providerStats: [
          { provider: 'OpenAI', totalRequests: 8500, successRate: 98.2, avgResponseTime: 180, healthScore: 95 },
          { provider: 'Google Maps', totalRequests: 3200, successRate: 99.5, avgResponseTime: 120, healthScore: 98 },
          { provider: 'Stripe', totalRequests: 2100, successRate: 99.8, avgResponseTime: 95, healthScore: 99 },
          { provider: 'SendGrid', totalRequests: 1620, successRate: 97.1, avgResponseTime: 340, healthScore: 92 }
        ],
        hourlyTrends: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          requests: Math.floor(Math.random() * 500) + 200,
          errors: Math.floor(Math.random() * 20)
        })),
        recommendations: [
          {
            provider: 'SendGrid',
            recommendation: 'Consider implementing request caching to reduce API costs',
            potential_impact: '15% cost reduction potential'
          },
          {
            provider: 'OpenAI',
            recommendation: 'Monitor token usage patterns for optimization opportunities',
            potential_impact: '8% performance improvement'
          }
        ],
        lastUpdated: new Date().toISOString()
      },
      costAnalysis: {
        overview: {
          projectedMonthlyCost: 3825
        },
        providerCosts: [
          { provider: 'OpenAI', totalCost: 85.20 },
          { provider: 'Google Maps', totalCost: 24.50 },
          { provider: 'Stripe', totalCost: 12.80 },
          { provider: 'SendGrid', totalCost: 5.00 }
        ]
      },
      errorAnalysis: {
        errorBreakdown: {
          byProvider: [
            { provider: 'OpenAI', count: 85 },
            { provider: 'SendGrid', count: 45 },
            { provider: 'Google Maps', count: 12 },
            { provider: 'Stripe', count: 5 }
          ]
        }
      },
      realTimeMetrics: {
        requestsPerMinute: 23,
        currentStatus: {
          averageResponseTime: 198
        },
        liveActivity: Array.from({ length: 10 }, (_, i) => ({
          provider: ['OpenAI', 'Google Maps', 'Stripe', 'SendGrid'][i % 4],
          endpoint: '/api/chat/completions',
          status: Math.random() > 0.1 ? 'success' : 'error',
          responseTime: Math.floor(Math.random() * 300) + 50,
          timestamp: new Date(Date.now() - i * 30000).toISOString()
        }))
      }
    };
  };

  // Fetch dashboard data with deduplication
  const fetchDashboardData = useCallback(async (showRefreshing = false) => {
    console.log('🔄 fetchDashboardData called:', { showRefreshing, selectedTimeRange, selectedProvider, fetchInProgress: fetchInProgress.current });
    
    // Debug cache state before making calls
    console.log('🔍 Cache debug before fetch:', {
      cacheStats: adminApiService.getAdminCacheStats(),
      networkCacheKey: `admin_network_analytics_${selectedTimeRange}`,
      costCacheKey: `admin_network_cost_${selectedTimeRange}`,
      errorCacheKey: `admin_network_errors_${selectedTimeRange}_${selectedProvider === 'all' ? 'all' : selectedProvider}`,
      benchmarkCacheKey: 'admin_network_benchmarks'
    });
    
    // Prevent duplicate simultaneous calls
    if (fetchInProgress.current && !showRefreshing) {
      console.log('⏭️ fetchDashboardData skipped - already in progress');
      return;
    }

    fetchInProgress.current = true;
    
    try {
      // Only show loading if we don't have any data yet (first load)
      // For cache hits, this will be instant
      const hasExistingData = analytics !== null;
      
      if (showRefreshing) {
        setRefreshing(true);
      } else if (!hasExistingData) {
        setLoading(true);
      }

      const startTime = performance.now();
      
      const [
        analyticsData, 
        costData, 
        errorData, 
        benchmarkData,
        realTimeData
      ] = await Promise.all([
        adminApiService.getNetworkAnalyticsDashboardCached(selectedTimeRange, showRefreshing),
        adminApiService.getNetworkCostAnalysisCached(selectedTimeRange, showRefreshing),
        adminApiService.getNetworkErrorAnalysisCached(selectedTimeRange, selectedProvider === 'all' ? null : selectedProvider, showRefreshing),
        adminApiService.getNetworkBenchmarksCached(showRefreshing),
        adminApiService.getRealTimeNetworkMetrics() // Keep real-time data uncached
      ]);
      
      const endTime = performance.now();
      const fetchTime = Math.round(endTime - startTime);
      console.log(`⚡ Data fetch completed in ${fetchTime}ms`);

      // Debug cache results after fetch
      console.log('🔍 Cache debug after fetch:', {
        cacheStats: adminApiService.getAdminCacheStats(),
        forceRefreshUsed: showRefreshing,
        cachePerformance: fetchTime < 50 ? '🟢 FAST' : fetchTime < 200 ? '🟡 MEDIUM' : '🔴 SLOW'
      });
      
      // Update all states (React 18+ automatically batches these)
      setAnalytics(analyticsData.networkAnalytics);
      setCostAnalysis(costData.costAnalysis);
      setErrorAnalysis(errorData.errorAnalysis);
      setBenchmarks(benchmarkData.benchmarks);
      setRealTimeMetrics(realTimeData.realtimeMetrics);
      
      // Set alerts from analytics data
      if (analyticsData.networkAnalytics?.alerts) {
        setAlerts(analyticsData.networkAnalytics.alerts);
      }
      
      console.log('✅ fetchDashboardData completed successfully');

    } catch (error) {
      console.error('❌ fetchDashboardData failed:', error);
      
      // Check if it's a 404 error (endpoints not implemented)
      if (error.response?.status === 404 || error.message?.includes('404') || error.message?.includes('Not Found')) {
        console.log('🔧 Detected 404 error - showing placeholder dashboard');
        setHasApiError(true);
      } else {
        setAlerts([{
          type: 'error',
          message: 'Failed to load network analytics data',
          severity: 'high'
        }]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      fetchInProgress.current = false;
    }
  }, [selectedTimeRange, selectedProvider]);

  // Real-time updates
  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time updates every 30 seconds
    realTimeInterval.current = setInterval(() => {
      fetchRealTimeData();
    }, 30000);

    return () => {
      if (realTimeInterval.current) {
        clearInterval(realTimeInterval.current);
      }
    };
  }, [fetchDashboardData]);

  const fetchRealTimeData = async () => {
    try {
      const data = await adminApiService.getRealTimeNetworkMetrics();
      setRealTimeMetrics(data.realtimeMetrics);
    } catch (error) {
      console.error('Failed to fetch real-time metrics:', error);
    }
  };

  // Export functionality
  const handleExport = async (format = 'csv') => {
    try {
      const blob = await adminApiService.exportNetworkAnalytics({
        timeRange: selectedTimeRange,
        providers: selectedProvider === 'all' ? [] : [selectedProvider],
        format,
        includeErrors: true
      });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `network_analytics_${selectedTimeRange}_${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
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
          <span className="text-lg text-gray-600">Loading network analytics...</span>
        </div>
      </div>
    );
  }

  // API Error state - show placeholder when endpoints are not implemented
  if (hasApiError) {
    return <NetworkAnalyticsPlaceholder />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Network Analytics</h1>
          <p className="text-gray-600 mt-1">Monitor external API performance, costs, and reliability</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Time Range Selector */}
          <select 
            value={selectedTimeRange} 
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>

          {/* Provider Filter */}
          <select 
            value={selectedProvider} 
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Providers</option>
            {analytics?.providerStats?.map(provider => (
              <option key={provider.provider} value={provider.provider}>
                {provider.provider}
              </option>
            ))}
          </select>

          {/* Export Button */}
          <button
            onClick={() => handleExport('csv')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg flex items-start space-x-3 ${
                alert.severity === 'high' ? 'bg-red-50 border border-red-200' :
                alert.severity === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
                'bg-blue-50 border border-blue-200'
              }`}
            >
              {alert.severity === 'high' ? 
                <XCircle className="w-5 h-5 text-red-500 mt-0.5" /> :
                alert.severity === 'medium' ? 
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" /> :
                <Info className="w-5 h-5 text-blue-500 mt-0.5" />
              }
              <div>
                <p className="font-medium text-gray-900">{alert.message}</p>
                {alert.provider && (
                  <p className="text-sm text-gray-600">Provider: {alert.provider}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analytics">📊 Network Analytics</TabsTrigger>
          <TabsTrigger value="pricing">💰 Provider Pricing</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="mt-6 space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Requests"
          value={analytics?.overview?.totalRequests?.toLocaleString() || '0'}
          icon={<Activity className="w-6 h-6" />}
          trend={realTimeMetrics?.requestsPerMinute ? `${realTimeMetrics.requestsPerMinute}/min` : null}
          color="blue"
        />
        
        <MetricCard
          title="Success Rate"
          value={`${((analytics?.overview?.successfulRequests / analytics?.overview?.totalRequests * 100) || 0).toFixed(1)}%`}
          icon={<CheckCircle className="w-6 h-6" />}
          trend={analytics?.overview?.successfulRequests ? `${analytics.overview.successfulRequests} successful` : null}
          color="green"
        />
        
        <MetricCard
          title="Avg Response Time"
          value={`${Math.round(analytics?.overview?.averageResponseTime || 0)}ms`}
          icon={<Clock className="w-6 h-6" />}
          trend={realTimeMetrics?.currentStatus?.averageResponseTime ? 
            `Current: ${Math.round(realTimeMetrics.currentStatus.averageResponseTime)}ms` : null}
          color="purple"
        />
        
        <MetricCard
          title="Total Cost"
          value={`$${analytics?.overview?.totalCost?.toFixed(2) || '0.00'}`}
          icon={<DollarSign className="w-6 h-6" />}
          trend={costAnalysis?.overview?.projectedMonthlyCost ? 
            `Projected: $${costAnalysis.overview.projectedMonthlyCost}` : null}
          color="yellow"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Provider Performance Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Provider Performance</h3>
          {analytics?.providerStats && analytics.providerStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.providerStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="provider" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="healthScore" fill={COLORS.primary} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              No provider data available
            </div>
          )}
        </div>

        {/* Cost Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
          {costAnalysis?.providerCosts && costAnalysis.providerCosts.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costAnalysis.providerCosts}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="totalCost"
                  nameKey="provider"
                >
                  {costAnalysis.providerCosts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % Object.values(COLORS).length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, 'Cost']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              No cost data available
            </div>
          )}
        </div>

        {/* Hourly Trends */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Trends</h3>
          {analytics?.hourlyTrends && analytics.hourlyTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.hourlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="requests" stroke={COLORS.primary} strokeWidth={2} />
                <Line type="monotone" dataKey="errors" stroke={COLORS.error} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              No trend data available
            </div>
          )}
        </div>

        {/* Error Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Error Analysis</h3>
          {errorAnalysis?.errorBreakdown?.byProvider && errorAnalysis.errorBreakdown.byProvider.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={errorAnalysis.errorBreakdown.byProvider}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="provider" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill={COLORS.error} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              No error data available
            </div>
          )}
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Provider Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Provider Details</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requests</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Success Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analytics?.providerStats?.map((provider, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {provider.provider}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {provider.totalRequests?.toLocaleString() || '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        provider.successRate >= 95 ? 'bg-green-100 text-green-800' : 
                        provider.successRate >= 85 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {provider.successRate?.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Math.round(provider.avgResponseTime || 0)}ms
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          provider.healthScore >= 80 ? 'bg-green-400' : 
                          provider.healthScore >= 60 ? 'bg-yellow-400' : 
                          'bg-red-400'
                        }`}></div>
                        <span className="text-sm text-gray-500">{provider.healthScore || 0}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {realTimeMetrics?.liveActivity?.slice(0, 10).map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-400' : 'bg-red-400'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.provider}</p>
                    <p className="text-xs text-gray-500">{activity.endpoint}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">{activity.responseTime}ms</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {analytics?.recommendations && analytics.recommendations.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimization Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics.recommendations.map((rec, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">{rec.provider}</h4>
                    <p className="text-sm text-gray-600 mt-1">{rec.recommendation}</p>
                    <p className="text-sm text-green-600 font-medium mt-2">{rec.potential_impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

          {/* Footer Info */}
          <div className="text-center text-sm text-gray-500">
            Last updated: {analytics?.lastUpdated ? new Date(analytics.lastUpdated).toLocaleString() : 'Never'}
            {' • '}
            Next update: {realTimeMetrics ? 'Real-time' : 'Manual refresh'}
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="mt-6">
          {/* Provider Pricing Override Management */}
          <div className="space-y-6">
            {/* Header with action */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Provider Price Override Management</h2>
                <p className="text-gray-600 mt-1">Configure negotiated pricing with external providers to optimize costs</p>
              </div>
              <Button
                onClick={() => setShowCreateOverrideModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Override
              </Button>
            </div>

            {/* Quick Setup Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['openai', 'corelogic', 'googlemaps', 'sumsub'].map(provider => (
                <div key={provider} className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer" onClick={() => {
                  setOverrideFormData({ ...overrideFormData, provider });
                  setShowCreateOverrideModal(true);
                }}>
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-8 h-8 text-blue-500" />
                    <div>
                      <h3 className="font-semibold capitalize">{provider}</h3>
                      <p className="text-sm text-gray-600">Quick setup</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Provider Pricing Demo */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configure Provider Pricing</h3>
              <p className="text-gray-600 mb-4">Select a provider to see the pricing configuration interface with input boxes for costs:</p>
              
              <div className="space-y-4">
                <div>
                  <Label>Select Provider for Demo</Label>
                  <Select
                    value={overrideFormData.provider}
                    onValueChange={(value) => setOverrideFormData({ ...overrideFormData, provider: value })}
                  >
                    <SelectTrigger className="w-[300px]">
                      <SelectValue placeholder="Choose a provider to see pricing inputs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI (Token-based pricing)</SelectItem>
                      <SelectItem value="corelogic">CoreLogic (Per-call pricing)</SelectItem>
                      <SelectItem value="googlemaps">Google Maps (Per-call pricing)</SelectItem>
                      <SelectItem value="sumsub">Sumsub (Per-verification pricing)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {overrideFormData.provider && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <ProviderPricingConfigurator
                      provider={overrideFormData.provider}
                      originalPricing={overrideFormData.originalPricing}
                      overridePricing={overrideFormData.overridePricing}
                      onChange={(pricingData) => {
                        setOverrideFormData({
                          ...overrideFormData,
                          originalPricing: pricingData.originalPricing,
                          overridePricing: pricingData.overridePricing
                        });
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 How to Use Provider Pricing</h3>
              <div className="space-y-2 text-blue-800">
                <p>• <strong>Click "New Override"</strong> or any provider card above to open the full configuration modal</p>
                <p>• <strong>Select a provider</strong> and navigate to the "Pricing" tab to see all input boxes</p>
                <p>• <strong>Enter original costs</strong> (current provider rates) and <strong>override costs</strong> (negotiated rates)</p>
                <p>• <strong>Real-time calculations</strong> show monthly savings as you type</p>
                <p>• <strong>Different providers</strong> show different pricing structures:</p>
                <div className="ml-4 space-y-1">
                  <p>→ OpenAI: Input/output token costs for each model (GPT-4, GPT-3.5, etc.)</p>
                  <p>→ CoreLogic: Per-call costs for property data endpoints</p>
                  <p>→ Google Maps: Per-call costs for geocoding, places, directions</p>
                  <p>→ Sumsub: Per-verification costs for identity, document verification</p>
                </div>
              </div>
            </div>

            {/* Cost Impact Analysis */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Potential Cost Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-green-100 rounded-lg p-4">
                    <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">15-30%</div>
                    <div className="text-sm text-gray-600">Typical Savings</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 rounded-lg p-4">
                    <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">$2,000+</div>
                    <div className="text-sm text-gray-600">Monthly Savings Potential</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 rounded-lg p-4">
                    <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">Real-time</div>
                    <div className="text-sm text-gray-600">Cost Tracking</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
    </div>
  );
};

export default NetworkAnalyticsDashboard;
