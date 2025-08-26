// src/pages/admin/AdminHome.jsx
import React, { useEffect, useState } from "react";
import { smartFetch } from '../../../shared/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  ShoppingBag,
  Activity,
  Calendar,
  RefreshCw,
  Filter,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";

const AdminHome = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [devMode, setDevMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await smartFetch("/api/admin/dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.msg || "Unauthorized");
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      console.log("Search:", searchQuery);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section - AppStack Style */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Dashboard</h1>
          <p className="text-gray-600 text-sm">Welcome back, Admin! Here's what's happening with your platform today.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Calendar className="h-4 w-4 mr-2" />
            Today
          </button>
          
          <button className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          
          <button className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>


      {error && <p className="text-red-600">⛔ {error}</p>}

      {/* KPI Alert Pills */}
      <div className="flex flex-wrap gap-3">
        <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm">🟢 System Healthy</span>
        <span className="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full text-sm">🟡 2 Webhooks Failing</span>
        <span className="bg-red-100 text-red-700 px-4 py-1 rounded-full text-sm">🔴 KYC Queue Exceeds Limit</span>
        <span className="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full text-sm">⚠️ API Costs ↑ 12%</span>
      </div>

      {/* Main Statistics Cards - AppStack Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xxl:grid-cols-4 gap-6">
        {/* Welcome Card */}
        <div className="sm:col-span-2 xxl:col-span-1">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <h4 className="text-lg font-semibold mb-1">Welcome back, Admin!</h4>
                  <p className="text-blue-100 text-sm opacity-90">FractionaX Dashboard</p>
                </div>
                <div className="text-blue-200">
                  <Activity size={48} className="opacity-80" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Earnings */}
        <AppStackMetricCard
          icon={DollarSign}
          value="$ 24,300"
          label="Total Earnings"
          change="+5.35%"
          changeType="positive"
          period="Since last week"
        />

        {/* Pending Orders */}
        <AppStackMetricCard
          icon={ShoppingBag}
          value="43"
          label="Pending Orders"
          change="-4.25%"
          changeType="negative"
          period="Since last week"
        />

        {/* Total Revenue */}
        <AppStackMetricCard
          icon={DollarSign}
          value="$ 18,700"
          label="Total Revenue"
          change="+8.65%"
          changeType="positive"
          period="Since last week"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <SimpleMetricCard 
          icon={Users}
          label="New Users Today" 
          value={22}
          iconColor="text-blue-600"
          bgColor="bg-blue-50"
        />
        <SimpleMetricCard 
          icon={Clock}
          label="Pending Withdrawals" 
          value={5}
          iconColor="text-yellow-600"
          bgColor="bg-yellow-50"
        />
        <SimpleMetricCard 
          icon={CheckCircle}
          label="Property Uploads" 
          value={8}
          iconColor="text-green-600"
          bgColor="bg-green-50"
        />
        <SimpleMetricCard 
          icon={AlertCircle}
          label="Support Tickets" 
          value={3}
          iconColor="text-red-600"
          bgColor="bg-red-50"
        />
      </div>

      {/* Visual Analytics Section (Compact) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <ChartCard title="📈 Users/Week">
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={dashboardData?.userTrends || []}>
              <XAxis dataKey="week" hide />
              <YAxis hide />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="📊 Token Volume">
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={dashboardData?.tokenVolume || []}>
              <XAxis dataKey="date" hide />
              <YAxis hide />
              <Tooltip />
              <Area type="monotone" dataKey="volume" stroke="#6366f1" fill="#e0e7ff" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="💵 Revenue">
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={dashboardData?.revenueTrends || []}>
              <XAxis dataKey="month" hide />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="📄 Report Usage">
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={dashboardData?.reportUsage || []}>
              <XAxis dataKey="day" hide />
              <YAxis hide />
              <Tooltip />
              <Line type="monotone" dataKey="reports" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Live Activity Feed */}
      <div>
        <h2 className="text-xl font-semibold mb-2">🔄 Live Activity Feed</h2>
        <ul className="bg-white border rounded-lg divide-y">
          {(dashboardData?.activityFeed || []).map((entry, idx) => (
            <li key={idx} className="p-4 text-sm text-gray-600">
              {entry.icon} [{entry.time}] {entry.message}
            </li>
          )) || <li className="p-4 text-gray-500">No recent activity</li>}
        </ul>
      </div>

      {/* Developer Debug Panel */}
      <div>
        <button
          className="text-xs text-blue-500 underline"
          onClick={() => setDevMode(!devMode)}
        >
          {devMode ? "Hide" : "Show"} Developer Info
        </button>
        {devMode && (
          <div className="bg-gray-100 mt-2 p-4 rounded border text-xs">
            <p><strong>Access Token:</strong> {localStorage.getItem("access_token")?.slice(0, 20)}...</p>
            <p><strong>Environment:</strong> Production</p>
            <p><strong>API Version:</strong> v1.2</p>
            <p><strong>Latency:</strong> ~243ms</p>
            <div className="mt-2">
              <button className="mr-2 px-2 py-1 text-xs bg-blue-500 text-white rounded">Trigger Webhook</button>
              <button className="px-2 py-1 text-xs bg-gray-600 text-white rounded">Clear Cache</button>
            </div>
          </div>
        )}
      </div>

      {/* Compliance Heatmap + Calendar Widget Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl border">
          <h3 className="font-semibold mb-2">🧑‍⚖️ Compliance Summary</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• 12 transactions over $10K</li>
            <li>• 3 flagged users</li>
            <li>• 1 suspicious property upload</li>
            <li>• Weekly compliance snapshot active</li>
          </ul>
        </div>
        <div className="bg-white p-4 rounded-xl border">
          <h3 className="font-semibold mb-2">📅 Upcoming Events</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• 1:1 Investor Call – July 18</li>
            <li>• AMA – July 22</li>
            <li>• Token Unlock – Aug 1</li>
            <li>• FST Dividend Payout – Aug 5</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
    <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
    {children}
  </div>
);

// AppStack-inspired metric card with icons, badges and trend indicators
const AppStackMetricCard = ({ icon: Icon, value, label, change, changeType, period }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
    <div className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{value}</h3>
          <p className="text-gray-600 mb-2">{label}</p>
          <div className="flex items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${
              changeType === 'positive' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {changeType === 'positive' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {change}
            </span>
            <span className="text-gray-500 text-xs">{period}</span>
          </div>
        </div>
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-50 rounded-lg">
          <Icon className="w-6 h-6 text-gray-600" />
        </div>
      </div>
    </div>
  </div>
);

// Simple metric card for secondary stats
const SimpleMetricCard = ({ icon: Icon, label, value, iconColor, bgColor }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div className="flex items-center">
      <div className={`inline-flex items-center justify-center w-10 h-10 ${bgColor} rounded-lg mr-3`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

// Keep the old MetricCard for backward compatibility
const MetricCard = ({ label, value }) => (
  <div className="bg-white border rounded-xl shadow p-5">
    <p className="text-gray-600 text-sm">{label}</p>
    <p className="text-2xl font-bold text-gray-800">{value ?? "—"}</p>
  </div>
);

export default AdminHome;
