import React, { useEffect, useState } from "react";
import { smartFetch } from '../../../shared/utils';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

const TokenAnalytics = () => {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await smartFetch("/api/admin/token-analytics", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.msg || "Failed to load analytics");

        setMetrics(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAnalytics();
  }, []);

  if (error) return <p className="text-red-600">⛔ {error}</p>;
  if (!metrics) return <p>Loading analytics...</p>;

  const pieData = [
    { name: "Operations Reserve", value: metrics.FXCTBreakdown.operations },
    { name: "Founders", value: metrics.FXCTBreakdown.founders },
    { name: "Employees", value: metrics.FXCTBreakdown.employees },
    { name: "Ecosystem", value: metrics.FXCTBreakdown.ecosystem },
    { name: "Pre-sale", value: metrics.FXCTBreakdown.presale },
    { name: "Liquidity", value: metrics.FXCTBreakdown.liquidity },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#9333EA", "#10B981"];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Token & Transaction Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* FXCT Supply Pie Chart */}
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-semibold mb-4">FXCT Token Allocation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Transaction Volume Line Chart */}
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-semibold mb-4">Daily Transaction Volume</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics.dailyVolume}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="volume" stroke="#6366F1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TokenAnalytics;
