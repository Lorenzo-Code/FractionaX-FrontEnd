import React from 'react';

const DataTables = ({ analyticsData, formatNumber, formatCurrency }) => {
  return (
    <div>
      {/* Lock Period Details Table */}
      <div className="bg-white rounded-lg border p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Lock Period Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lock Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Staked</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wallets</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(analyticsData.lockPeriods).map(([period, data]) => (
                <tr key={period}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{period}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(data.amount)} FXCT</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.percentage}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(data.wallets)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Token Unlocking Schedule Table */}
      <div className="bg-white rounded-lg border p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Token Unlocking Schedule</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timeframe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tokens Unlocking</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USD Value</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(analyticsData.unlockingSchedule.detailed).map(([period, data]) => (
                <tr key={period}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{period.replace("next", "Next ")}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(data.tokens)} FXCT</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(data.usdValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Protocol Summary Stats */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Protocol Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">4</div>
            <div className="text-sm text-gray-600">Active Protocols</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">2</div>
            <div className="text-sm text-gray-600">Highlighted</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">7.5%</div>
            <div className="text-sm text-gray-600">Avg Commission</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">8</div>
            <div className="text-sm text-gray-600">Total Protocols</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTables;
