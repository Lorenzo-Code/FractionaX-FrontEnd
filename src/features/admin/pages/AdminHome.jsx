// src/pages/admin/AdminHome.jsx
import React, { useEffect, useState } from "react";
import { smartFetch } from '../../../shared/utils';
import { AdminTodoPanel } from '../components';
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

const AdminHome = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [devMode, setDevMode] = useState(false);
  const [userRole, setUserRole] = useState("Admin");
  const [tasks, setTasks] = useState([
    { id: 1, text: "Review 3 flagged transactions", resolved: false, assignedTo: "Admin", tag: "compliance", due: "Today" },
    { id: 2, text: "Approve 7 KYC applications", resolved: false, assignedTo: "Compliance", tag: "compliance", due: "Tomorrow" },
    { id: 3, text: "Respond to open support tickets", resolved: false, assignedTo: "Support", tag: "support", due: "Overdue" },
    { id: 4, text: "Generate July tax report", resolved: false, assignedTo: "Finance", tag: "finance", due: "Next 7 Days" },
  ]);
  const [newTask, setNewTask] = useState("");
  const [newTag, setNewTag] = useState("general");
  const [newDue, setNewDue] = useState("All");

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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">🛠 Admin Dashboard</h1>

        <input
          type="text"
          placeholder="🔍 Search users, wallets, properties..."
          className="px-4 py-2 w-full md:w-96 border border-gray-300 rounded-xl shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>


      {error && <p className="text-red-600">⛔ {error}</p>}

      {/* KPI Alert Pills */}
      <div className="flex flex-wrap gap-3">
        <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm">🟢 System Healthy</span>
        <span className="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full text-sm">🟡 2 Webhooks Failing</span>
        <span className="bg-red-100 text-red-700 px-4 py-1 rounded-full text-sm">🔴 KYC Queue Exceeds Limit</span>
        <span className="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full text-sm">⚠️ API Costs ↑ 12%</span>
      </div>

      {/* Quick Filter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <MetricCard label="🧑 New Users Today" value={22} />
        <MetricCard label="🏦 Pending Withdrawals" value={5} />
        <MetricCard label="🧾 Property Uploads" value={8} />
        <MetricCard label="💬 Support Tickets" value={3} />
      </div>

      {/* Admin To-Do Panel Component */}
      <AdminTodoPanel
        tasks={tasks}
        setTasks={setTasks}
        userRole={userRole}
        newTask={newTask}
        setNewTask={setNewTask}
        newTag={newTag}
        setNewTag={setNewTag}
        newDue={newDue}
        setNewDue={setNewDue}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Metric Cards */}
      {dashboardData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <MetricCard label="Total Users" value={dashboardData.totalUsers} />
          <MetricCard label="Verified Users" value={dashboardData.verifiedUsers} />
          <MetricCard label="Token Transfers" value={dashboardData.tokenTransfers} />
          <MetricCard label="Active Subscriptions" value={dashboardData.activeSubscriptions} />
        </div>
      )}

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
  <div className="bg-white p-4 rounded-xl shadow-md">
    <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
    {children}
  </div>
);

const MetricCard = ({ label, value }) => (
  <div className="bg-white border rounded-xl shadow p-5">
    <p className="text-gray-600 text-sm">{label}</p>
    <p className="text-2xl font-bold text-gray-800">{value ?? "—"}</p>
  </div>
);

export default AdminHome;
