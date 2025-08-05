import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';

const AnalyticsCharts = ({
  protocolChartData,
  lockPeriodChartData,
  analyticsData,
  formatNumber,
  formatCurrency,
  COLORS
}) => {
  return (
    <div className="mt-12">
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Wallet Connections Chart */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Wallet Connections by Protocol</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={protocolChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatNumber} />
              <Tooltip formatter={formatNumber} />
              <Bar dataKey="wallets" fill="#3B82F6" name="Connected Wallets" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* FXCT Staked Chart */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">FXCT Tokens Staked by Protocol</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={protocolChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatNumber} />
              <Tooltip formatter={(value) => `${formatNumber(value)} FXCT`} />
              <Bar dataKey="staked" fill="#10B981" name="FXCT Staked" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Lock Periods and Time Series */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Lock Period Distribution */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lock Period Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={lockPeriodChartData}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={({ name, percentage }) => `${name}: ${percentage}%`}
              >
                {lockPeriodChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${formatNumber(value)} FXCT`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Time Series Growth */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">FXCT Staked Growth Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData.timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={formatNumber} />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'Total Staked') {
                    return [`${formatNumber(value)} FXCT`, name];
                  }
                  return [formatNumber(value), name];
                }}
              />
              <Area 
                type="monotone" 
                dataKey="totalStaked" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.6} 
                name="Total Staked" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Additional Time Series - Wallets Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Wallet Growth Chart */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected Wallets Growth Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={formatNumber} />
              <Tooltip formatter={(value) => [formatNumber(value), 'Connected Wallets']} />
              <Line 
                type="monotone" 
                dataKey="wallets" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6' }}
                name="Connected Wallets" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Commission Growth Chart */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission Earnings Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData.timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={(value) => [formatCurrency(value), 'Commission Earned']} />
              <Area 
                type="monotone" 
                dataKey="commission" 
                stroke="#F59E0B" 
                fill="#F59E0B" 
                fillOpacity={0.6} 
                name="Commission Earned" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
