import React from 'react';

const KeyMetricsGrid = ({ analyticsData, protocolChartData, formatNumber, formatCurrency }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {/* Net Flow */}
      <div className="bg-white rounded-lg border p-4">
        <h4 className="text-sm font-semibold text-gray-600 mb-2">Net Capital Flow (24h)</h4>
        <p className={`text-2xl font-bold ${analyticsData.netFlow.daily >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {analyticsData.netFlow.daily >= 0 ? '+' : '-'}{formatCurrency(Math.abs(analyticsData.netFlow.daily))}
        </p>
        <p className="text-xs text-gray-500">vs. previous period</p>
      </div>
      
      {/* Tokens Unlocking */}
      <div className="bg-white rounded-lg border p-4">
        <h4 className="text-sm font-semibold text-gray-600 mb-2">Tokens Unlocking (Next 7d)</h4>
        <p className="text-2xl font-bold text-yellow-600">{formatNumber(analyticsData.unlockingSchedule.next7d)}</p>
        <p className="text-xs text-gray-500">Tokens to be released</p>
      </div>
      
      {/* Average Lock Period */}
      <div className="bg-white rounded-lg border p-4">
        <h4 className="text-sm font-semibold text-gray-600 mb-2">Average Lock Period</h4>
        <p className="text-2xl font-bold text-blue-600">{analyticsData.avgLockPeriod} days</p>
        <p className="text-xs text-gray-500">Weighted by stake amount</p>
      </div>
      
      {/* Top Performer */}
      <div className="bg-white rounded-lg border p-4">
        <h4 className="text-sm font-semibold text-gray-600 mb-2">Top Protocol (by TVL)</h4>
        <p className="text-xl font-bold text-purple-600">Lido</p>
        <p className="text-xs text-gray-500">{formatCurrency(analyticsData.protocolMetrics["Lido (Liquid Staking for ETH)"]?.tvl || 0)}</p>
      </div>

      {/* Total Wallets Connected */}
      <div className="bg-white rounded-lg border p-4">
        <div className="text-sm font-medium text-gray-600 mb-1">Total Wallets Connected</div>
        <div className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.totalConnectedWallets)}</div>
      </div>
      
      {/* Total FXCT Staked */}
      <div className="bg-white rounded-lg border p-4">
        <div className="text-sm font-medium text-gray-600 mb-1">Total FXCT Staked</div>
        <div className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.totalFXCTStaked)}</div>
      </div>
      
      {/* Total Value Locked */}
      <div className="bg-white rounded-lg border p-4">
        <div className="text-sm font-medium text-gray-600 mb-1">Total Value Locked</div>
        <div className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.totalValueLocked)}</div>
      </div>
      
      {/* Total Commission Earned */}
      <div className="bg-white rounded-lg border p-4">
        <div className="text-sm font-medium text-gray-600 mb-1">Total Commission Earned</div>
        <div className="text-2xl font-bold text-gray-900">{formatCurrency(protocolChartData.reduce((sum, p) => sum + p.commission, 0))}</div>
      </div>
    </div>
  );
};

export default KeyMetricsGrid;
