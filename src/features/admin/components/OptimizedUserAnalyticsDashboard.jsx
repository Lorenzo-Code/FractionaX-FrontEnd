import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Legend
} from 'recharts';
import { fetchAnalyticsData, fetchRealTimeData, fetchUserMetrics, fetchComprehensiveAnalyticsData } from '../../../api/analytics';

const OptimizedUserAnalyticsDashboard = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [comprehensiveData, setComprehensiveData] = useState(null);
    const [realTimeData, setRealTimeData] = useState(null);
    const [userMetrics, setUserMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState('dashboard');
    const [isMobile, setIsMobile] = useState(false);

    // Check if screen is mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const getData = async () => {
            try {
                console.log('Fetching comprehensive analytics data...');
                const [comprehensive, analytics, realTime, metrics] = await Promise.all([
                    fetchComprehensiveAnalyticsData(),
                    fetchAnalyticsData(),
                    fetchRealTimeData(),
                    fetchUserMetrics()
                ]);
                console.log('All data fetched successfully:', { comprehensive, analytics, realTime, metrics });
                setComprehensiveData(comprehensive);
                setAnalyticsData(analytics);
                setRealTimeData(realTime);
                setUserMetrics(metrics);
            } catch (error) {
                console.error("Error fetching analytics data:", error);
                // Set default empty data structure instead of keeping null
                setComprehensiveData({
                    coreMetrics: { totalUsers: 0, activeUsers: 0, newUsers: 0, conversionRate: 0 },
                    growthData: [],
                    kpis: {}
                });
                setAnalyticsData({
                    overview: { totalUsers: 0, activeUsers: 0, newUsers: 0, conversionRate: 0 },
                    userGrowth: []
                });
                setRealTimeData({ activeUsers: 0, currentSessions: 0, pageViews: 0 });
                setUserMetrics({ demographics: {}, behavior: {}, retention: {} });
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const StatCard = ({ title, value, change, icon }) => (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
                    {change && (
                        <p className={`text-sm ${
                            change > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                            {change > 0 ? '+' : ''}{change}%
                        </p>
                    )}
                </div>
                {icon && <div className="text-3xl">{icon}</div>}
            </div>
        </div>
    );

    const renderDashboardView = () => (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard
                    title="Total Users"
                    value={comprehensiveData?.coreMetrics?.totalUsers?.toLocaleString() || analyticsData?.overview?.totalUsers?.toLocaleString() || '0'}
                    change={comprehensiveData?.growthMetrics?.totalUsersGrowth || 5.2}
                    icon="👥"
                />
                <StatCard
                    title="Active Users"
                    value={comprehensiveData?.coreMetrics?.activeUsers?.toLocaleString() || analyticsData?.overview?.activeUsers?.toLocaleString() || '0'}
                    change={comprehensiveData?.growthMetrics?.activeUsersGrowth || 2.1}
                    icon="🟢"
                />
                <StatCard
                    title="New Users (Week)"
                    value={comprehensiveData?.coreMetrics?.newUsersThisWeek?.toLocaleString() || analyticsData?.overview?.newUsers?.toLocaleString() || '0'}
                    change={comprehensiveData?.growthMetrics?.newUsersGrowth || 12.5}
                    icon="✨"
                />
                <StatCard
                    title="User Satisfaction"
                    value={`${comprehensiveData?.performanceIndicators?.userSatisfactionScore || analyticsData?.overview?.conversionRate || 0}%`}
                    change={comprehensiveData?.growthMetrics?.satisfactionGrowth || -1.2}
                    icon="📊"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth Chart */}
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                    <h3 className="text-lg font-semibold mb-4">User Growth</h3>
                    <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                        <AreaChart data={comprehensiveData?.growthData || analyticsData?.userGrowth || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" fontSize={isMobile ? 12 : 14} />
                            <YAxis fontSize={isMobile ? 12 : 14} />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="users"
                                stroke="#8884d8"
                                fill="#8884d8"
                                fillOpacity={0.6}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Real-time Activity */}
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                    <h3 className="text-lg font-semibold mb-4">Real-time Stats</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                            <span className="text-sm font-medium">Users Online Now</span>
                            <span className="text-lg font-bold text-blue-600">
                                {comprehensiveData?.realTimeStats?.usersOnlineNow || realTimeData?.activeUsers || 0}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                            <span className="text-sm font-medium">Peak Concurrent</span>
                            <span className="text-lg font-bold text-green-600">
                                {comprehensiveData?.realTimeStats?.peakConcurrentUsers || realTimeData?.currentSessions || 0}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                            <span className="text-sm font-medium">Performance Score</span>
                            <span className="text-lg font-bold text-purple-600">
                                {comprehensiveData?.performanceIndicators?.performanceScore || realTimeData?.pageViews || 0}%
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                            <span className="text-sm font-medium">Platform Health</span>
                            <span className="text-lg font-bold text-yellow-600">
                                {comprehensiveData?.performanceIndicators?.platformHealthScore || 0}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                    User Analytics Dashboard
                </h1>
                <p className="text-gray-600 mt-2">Monitor and analyze user behavior and platform performance</p>
            </div>

            {/* Navigation Tabs */}
            <div className="mb-6">
                <nav className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm overflow-x-auto">
                    {[
                        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                        { id: 'insights', label: 'Insights', icon: '💡' },
                        { id: 'reports', label: 'Reports', icon: '📋' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveView(tab.id)}
                            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                                activeView === tab.id
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            <div className="max-w-7xl">
                {activeView === 'dashboard' && renderDashboardView()}
                {activeView === 'insights' && (
                    <div className="space-y-6">
                        {/* AI Insights */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4">🤖 AI Insights</h3>
                            <div className="space-y-4">
                                {comprehensiveData?.aiInsights?.map((insight, index) => (
                                    <div key={index} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                                        <p className="text-sm text-gray-700">{insight}</p>
                                    </div>
                                )) || (
                                    <p className="text-gray-600">AI insights will appear here based on your analytics data...</p>
                                )}
                            </div>
                        </div>

                        {/* Smart Recommendations */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4">💡 Smart Recommendations</h3>
                            <div className="space-y-4">
                                {comprehensiveData?.recommendations?.map((rec, index) => (
                                    <div key={index} className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
                                        <h4 className="font-medium text-green-800 mb-2">{rec.category}</h4>
                                        <p className="text-sm text-gray-700">{rec.suggestion}</p>
                                        <p className="text-xs text-green-600 mt-2">Impact: {rec.impact}</p>
                                    </div>
                                )) || (
                                    <p className="text-gray-600">Smart recommendations will appear here...</p>
                                )}
                            </div>
                        </div>

                        {/* Active Alerts */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4">🚨 Active Alerts</h3>
                            <div className="space-y-4">
                                {comprehensiveData?.alerts?.map((alert, index) => (
                                    <div key={index} className={`border-l-4 p-4 rounded ${
                                        alert.severity === 'high' ? 'border-red-500 bg-red-50' :
                                        alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                                        'border-blue-500 bg-blue-50'
                                    }`}>
                                        <h4 className="font-medium mb-2">{alert.type}</h4>
                                        <p className="text-sm text-gray-700">{alert.message}</p>
                                    </div>
                                )) || (
                                    <p className="text-gray-600">No active alerts.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {activeView === 'reports' && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-4">Reports</h3>
                        <p className="text-gray-600">Advanced reporting features coming soon...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OptimizedUserAnalyticsDashboard;

