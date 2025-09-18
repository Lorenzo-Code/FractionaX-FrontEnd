import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Gem, Clock, Shield, Percent } from 'lucide-react';
import { useHomepageProtocols } from '../../../hooks/useProtocolSync';
import { LiveDataIndicator } from '../../../shared/components';

const MarketOverview = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  
  // Get protocol data from sync service with backend integration
  const { protocols, stats, loading, isLiveData } = useHomepageProtocols();

  const formatMinStake = (amount) => {
    return new Intl.NumberFormat('en-US').format(amount);
  };

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'limited':
        return 'text-orange-600 bg-orange-100';
      case 'full':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-gray-900">Staking & Lending Opportunities</h2>
            <LiveDataIndicator isLive={isLiveData} section="protocolStats" size="sm" />
          </div>
          <p className="text-gray-600 mt-1">Earn passive income by staking your FXST security tokens</p>
        </div>
          
          {/* Timeframe Selector - Robinhood Style */}
          <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
            {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedTimeframe(period.toLowerCase())}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  selectedTimeframe === period.toLowerCase()
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Staking Stats Cards - Based on Real Protocol Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">+12%</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? '...' : stats.totalValueLocked}
            </div>
            <div className="text-sm text-gray-500">Total Value Locked</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Percent className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Best Rate</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? '...' : stats.highestAPY}
            </div>
            <div className="text-sm text-gray-500">Highest APY Available</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">+847</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? '...' : stats.activeStakers}
            </div>
            <div className="text-sm text-gray-500">Active Stakers</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Gem className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Monthly</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? '...' : stats.rewardsDistributed}
            </div>
            <div className="text-sm text-gray-500">Rewards Distributed</div>
          </div>
        </div>

        {/* Staking Opportunities Table - Responsive Design */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">FXST Staking Opportunities</h3>
            <p className="text-sm text-gray-500 mt-1">Earn passive income by staking your FXST security tokens</p>
          </div>
          
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                    Protocol
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                    APY
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                    Min. Stake
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                    Total Staked
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                    Risk
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {protocols.map((pool) => (
                  <tr key={pool.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3 flex-shrink-0">
                          <Gem className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900">{pool.token}</div>
                          <div className="text-sm text-gray-500 truncate">{pool.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center">
                        <Percent className="w-4 h-4 text-green-600 mr-1" />
                        <span className="text-sm font-bold text-green-600">{pool.apy}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {formatMinStake(pool.minStake)}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-900">
                      {pool.totalStaked}
                    </td>
                    <td className="px-3 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRiskColor(pool.risk)}`}>
                        {pool.risk}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button 
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          pool.status === 'Active' 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : pool.status === 'Limited'
                            ? 'bg-orange-600 hover:bg-orange-700 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={pool.status === 'Full'}
                      >
                        {pool.status === 'Full' ? 'Full' : 'Stake'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden">
            <div className="divide-y divide-gray-200">
              {protocols.map((pool) => (
                <div key={pool.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <Gem className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{pool.token}</div>
                        <div className="text-sm text-gray-500">{pool.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRiskColor(pool.risk)}`}>
                        {pool.risk}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-green-600">{pool.apy}%</div>
                      <div className="text-xs text-gray-500">APY</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{formatMinStake(pool.minStake)}</div>
                      <div className="text-xs text-gray-500">Min Stake</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{pool.totalStaked}</div>
                      <div className="text-xs text-gray-500">Total Staked</div>
                    </div>
                  </div>
                  
                  <button 
                    className={`w-full py-3 rounded-lg text-sm font-medium transition-colors ${
                      pool.status === 'Active' 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : pool.status === 'Limited'
                        ? 'bg-orange-600 hover:bg-orange-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={pool.status === 'Full'}
                  >
                    {pool.status === 'Full' ? 'Pool Full' : 'Start Staking'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketOverview;
