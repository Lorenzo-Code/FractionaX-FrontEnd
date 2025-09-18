import React, { useState } from 'react';
import { 
  Coins, 
  TrendingUp, 
  TrendingDown, 
  Lock,
  Unlock,
  Calendar,
  Clock,
  Gift,
  Star,
  Target,
  Activity,
  Info,
  AlertCircle
} from 'lucide-react';

const CustomerTokens = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stakeAmount, setStakeAmount] = useState('');
  const [stakeDuration, setStakeDuration] = useState('30');
  const [showStakeModal, setShowStakeModal] = useState(false);

  // Mock token data
  const tokenData = {
    FXCT: {
      name: 'FractionaX Core Token',
      symbol: 'FXCT',
      balance: 12500.00,
      price: 1.47,
      value: 18375.00,
      change24h: 3.2,
      change7d: 8.7,
      staked: 5000.00,
      available: 7500.00,
      icon: '🏠',
      description: 'Core utility token for the FractionaX ecosystem',
      totalSupply: 100000000,
      marketCap: 147000000
    },
    FST: {
      name: 'FractionaX Staking Token',
      symbol: 'FST',
      balance: 8750.50,
      price: 4.10,
      value: 35892.05,
      change24h: -1.8,
      change7d: 4.3,
      staked: 3000.00,
      available: 5750.50,
      icon: '💎',
      description: 'Premium staking token with enhanced rewards',
      totalSupply: 50000000,
      marketCap: 205000000
    }
  };

  const stakingPositions = [
    {
      id: 1,
      token: 'FXCT',
      amount: 2500,
      apy: 12.5,
      duration: 90,
      startDate: '2024-01-01',
      endDate: '2024-04-01',
      rewards: 78.13,
      status: 'Active',
      autoRenew: true
    },
    {
      id: 2,
      token: 'FXCT',
      amount: 2500,
      apy: 15.0,
      duration: 180,
      startDate: '2023-12-15',
      endDate: '2024-06-15',
      rewards: 156.25,
      status: 'Active',
      autoRenew: false
    },
    {
      id: 3,
      token: 'FST',
      amount: 3000,
      apy: 18.5,
      duration: 365,
      startDate: '2023-11-01',
      endDate: '2024-11-01',
      rewards: 412.50,
      status: 'Active',
      autoRenew: true
    }
  ];

  const rewardsHistory = [
    {
      id: 1,
      date: '2024-01-15',
      token: 'FXCT',
      amount: 15.67,
      type: 'Staking Reward',
      status: 'Claimed'
    },
    {
      id: 2,
      date: '2024-01-10',
      token: 'FST',
      amount: 22.45,
      type: 'Staking Reward',
      status: 'Claimed'
    },
    {
      id: 3,
      date: '2024-01-05',
      token: 'FXCT',
      amount: 8.90,
      type: 'Bonus Reward',
      status: 'Pending'
    }
  ];

  const calculateStakingReward = (amount, duration) => {
    const baseAPY = duration <= 30 ? 8 : duration <= 90 ? 12 : duration <= 180 ? 15 : 20;
    const annualReward = (amount * baseAPY) / 100;
    const dailyReward = annualReward / 365;
    const totalReward = (dailyReward * duration);
    return { totalReward, apy: baseAPY };
  };

  const stakingReward = stakeAmount ? calculateStakingReward(parseFloat(stakeAmount), parseInt(stakeDuration)) : null;

  const handleStake = () => {
    console.log(`Staking ${stakeAmount} tokens for ${stakeDuration} days`);
    setShowStakeModal(false);
    setStakeAmount('');
    setStakeDuration('30');
  };

  const totalStaked = stakingPositions.reduce((sum, pos) => sum + pos.amount, 0);
  const totalRewards = stakingPositions.reduce((sum, pos) => sum + pos.rewards, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tokens</h1>
          <p className="text-gray-600">Manage your FractionaX tokens and staking positions</p>
        </div>
        <button
          onClick={() => setShowStakeModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
        >
          <Lock size={16} />
          <span>Stake Tokens</span>
        </button>
      </div>

      {/* Token Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(tokenData).map(([symbol, token]) => (
          <div key={symbol} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">{token.icon}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{token.name}</h3>
                  <p className="text-gray-600 text-sm">{token.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{token.balance.toLocaleString()}</p>
                <p className="text-gray-600">${token.value.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Available</p>
                <p className="text-xl font-bold text-green-600">{token.available.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Staked</p>
                <p className="text-xl font-bold text-purple-600">{token.staked.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <span className="text-lg font-semibold">${token.price}</span>
                  <div className={`flex items-center text-sm ${
                    token.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {token.change24h >= 0 ? (
                      <TrendingUp size={14} className="mr-1" />
                    ) : (
                      <TrendingDown size={14} className="mr-1" />
                    )}
                    {Math.abs(token.change24h)}%
                  </div>
                </div>
              </div>
              <button
                onClick={() => {setSelectedToken(symbol); setShowStakeModal(true);}}
                className="bg-purple-100 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors"
              >
                Stake
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Staking Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total Staked</p>
              <p className="text-2xl font-bold">{totalStaked.toLocaleString()}</p>
            </div>
            <Lock className="w-8 h-8 text-purple-200" />
          </div>
          <p className="text-purple-100 text-sm mt-2">Across all positions</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Rewards</p>
              <p className="text-2xl font-bold text-green-600">{totalRewards.toLocaleString()}</p>
            </div>
            <Gift className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-gray-600 text-sm mt-2">Earned rewards</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Avg. APY</p>
              <p className="text-2xl font-bold text-blue-600">
                {(stakingPositions.reduce((sum, pos) => sum + pos.apy, 0) / stakingPositions.length).toFixed(1)}%
              </p>
            </div>
            <Target className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-600 text-sm mt-2">Annual percentage yield</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 rounded-t-xl">
        <nav className="flex space-x-8 px-6">
          {['overview', 'staking', 'rewards', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 border-b-2 font-medium text-sm capitalize transition-colors ${
                activeTab === tab
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 border-t-0">
        {activeTab === 'overview' && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Token Distribution */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Token Distribution</h3>
                <div className="space-y-4">
                  {Object.entries(tokenData).map(([symbol, token]) => (
                    <div key={symbol} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{token.icon}</span>
                        <div>
                          <p className="font-medium">{token.symbol}</p>
                          <p className="text-sm text-gray-600">{token.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{token.balance.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">${token.value.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Chart Placeholder */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Performance</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Performance chart</p>
                    <p className="text-sm text-gray-400">Token value over time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'staking' && (
          <div className="p-6">
            <div className="space-y-4">
              {stakingPositions.map((position) => (
                <div key={position.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Lock className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {position.amount.toLocaleString()} {position.token}
                        </h3>
                        <p className="text-gray-600">
                          {position.duration} days • {position.apy}% APY
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        position.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {position.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-gray-600 text-sm">Start Date</p>
                      <p className="font-medium">{new Date(position.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">End Date</p>
                      <p className="font-medium">{new Date(position.endDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Rewards Earned</p>
                      <p className="font-medium text-green-600">{position.rewards.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Auto Renew</p>
                      <p className={`font-medium ${position.autoRenew ? 'text-blue-600' : 'text-gray-600'}`}>
                        {position.autoRenew ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-3">
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                      Claim Rewards
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="p-6">
            <div className="space-y-4">
              {rewardsHistory.map((reward) => (
                <div key={reward.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      reward.status === 'Claimed' ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                      <Gift className={`w-5 h-5 ${
                        reward.status === 'Claimed' ? 'text-green-600' : 'text-yellow-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{reward.type}</p>
                      <p className="text-sm text-gray-600">{new Date(reward.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      +{reward.amount} {reward.token}
                    </p>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      reward.status === 'Claimed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {reward.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Token Analytics</h3>
                <div className="space-y-4">
                  {Object.entries(tokenData).map(([symbol, token]) => (
                    <div key={symbol} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{symbol}</span>
                        <span className="text-sm text-gray-600">${token.price}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Market Cap</span>
                        <span>${token.marketCap.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Supply</span>
                        <span>{token.totalSupply.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">7d Change</span>
                        <span className={token.change7d >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {token.change7d >= 0 ? '+' : ''}{token.change7d}%
                        </span>
                      </div>
                      {symbol !== Object.keys(tokenData)[Object.keys(tokenData).length - 1] && (
                        <hr className="border-gray-200" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Staking Statistics</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Total Positions</p>
                    <p className="text-2xl font-bold">{stakingPositions.length}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Average Lock Period</p>
                    <p className="text-2xl font-bold">
                      {Math.round(stakingPositions.reduce((sum, pos) => sum + pos.duration, 0) / stakingPositions.length)} days
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Highest APY</p>
                    <p className="text-2xl font-bold text-green-600">
                      {Math.max(...stakingPositions.map(pos => pos.apy))}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stake Modal */}
      {showStakeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stake Tokens</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount to Stake
                </label>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Staking Duration
                </label>
                <select
                  value={stakeDuration}
                  onChange={(e) => setStakeDuration(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="30">30 days (8% APY)</option>
                  <option value="90">90 days (12% APY)</option>
                  <option value="180">180 days (15% APY)</option>
                  <option value="365">365 days (20% APY)</option>
                </select>
              </div>

              {stakingReward && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Info size={16} className="text-purple-600" />
                    <span className="font-medium text-purple-800">Staking Rewards</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>APY:</span>
                      <span className="font-medium">{stakingReward.apy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected Rewards:</span>
                      <span className="font-medium text-green-600">
                        {stakingReward.totalReward.toFixed(2)} tokens
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle size={16} className="text-yellow-600 flex-shrink-0" />
                <p className="text-yellow-800 text-sm">
                  Tokens will be locked for the selected duration and cannot be withdrawn early.
                </p>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowStakeModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStake}
                disabled={!stakeAmount || isNaN(stakeAmount) || parseFloat(stakeAmount) <= 0}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Stake Tokens
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerTokens;
