import React, { useState, useEffect } from 'react';
import { 
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  CreditCard,
  Banknote,
  DollarSign,
  Send,
  Download,
  Plus,
  Minus,
  RefreshCw,
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

const CustomerWallet = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState('FXCT');
  const [amount, setAmount] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');
  const [stakeDuration, setStakeDuration] = useState('30');
  const [refreshing, setRefreshing] = useState(false);

  // Enhanced wallet data with token management features
  const walletData = {
    totalBalance: 54267.89,
    totalValue: 54267.89,
    change24h: 3.47,
    tokens: {
      FXCT: {
        balance: 12500.00,
        price: 1.47,
        value: 18375.00,
        change24h: 3.2,
        change7d: 8.7,
        symbol: 'FXCT',
        name: 'FractionaX Core Token',
        icon: '🏠',
        staked: 5000.00,
        available: 7500.00,
        description: 'Core utility token for the FractionaX ecosystem',
        totalSupply: 100000000,
        marketCap: 147000000
      },
      FXST: {
        balance: 8750.50,
        price: 4.10,
        value: 35892.05,
        change24h: -1.8,
        change7d: 4.3,
        symbol: 'FXST',
        name: 'FractionaX Staking Token',
        icon: '💎',
        staked: 3000.00,
        available: 5750.50,
        description: 'Premium staking token with enhanced rewards',
        totalSupply: 50000000,
        marketCap: 205000000
      }
    },
    cash: {
      USD: {
        balance: 2500.84,
        symbol: 'USD',
        name: 'US Dollar',
        icon: '💵'
      }
    }
  };

  // Staking positions data
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
      token: 'FXST',
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

  // Rewards history data
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
      token: 'FXST',
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

  const transactions = [
    {
      id: 1,
      type: 'buy',
      token: 'FXCT',
      amount: 1000,
      price: 1.45,
      value: 1450.00,
      date: '2024-01-15T10:30:00Z',
      status: 'completed',
      txHash: '0x1234...5678'
    },
    {
      id: 2,
      type: 'sell',
      token: 'FST',
      amount: 250,
      price: 4.05,
      value: 1012.50,
      date: '2024-01-14T15:45:00Z',
      status: 'completed',
      txHash: '0x8765...4321'
    },
    {
      id: 3,
      type: 'receive',
      token: 'FXCT',
      amount: 150.75,
      price: 1.47,
      value: 221.60,
      date: '2024-01-13T09:15:00Z',
      status: 'completed',
      txHash: '0x9876...1234'
    }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const handleBuy = () => {
    console.log(`Buying ${amount} ${selectedToken}`);
    setShowBuyModal(false);
    setAmount('');
  };

  const handleSell = () => {
    console.log(`Selling ${amount} ${selectedToken}`);
    setShowSellModal(false);
    setAmount('');
  };

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
          <h1 className="text-2xl font-bold text-gray-900">My Wallet</h1>
          <p className="text-gray-600">Manage your FractionaX tokens, transactions, and staking</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowBuyModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Buy Tokens</span>
          </button>
          <button
            onClick={() => setShowStakeModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
          >
            <Lock size={16} />
            <span>Stake Tokens</span>
          </button>
        </div>
      </div>

      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Portfolio Value</p>
              <p className="text-3xl font-bold">
                ${walletData.totalBalance.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            {walletData.change24h >= 0 ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            <span className="font-medium">
              {walletData.change24h >= 0 ? '+' : ''}{walletData.change24h}%
            </span>
            <span className="text-blue-100 ml-2">24h change</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => setShowBuyModal(true)}
              className="w-full flex items-center justify-center space-x-2 bg-green-50 text-green-600 py-3 rounded-lg hover:bg-green-100 transition-colors"
            >
              <ArrowDownLeft size={16} />
              <span>Buy Tokens</span>
            </button>
            <button
              onClick={() => setShowSellModal(true)}
              className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-600 py-3 rounded-lg hover:bg-red-100 transition-colors"
            >
              <ArrowUpRight size={16} />
              <span>Sell Tokens</span>
            </button>
            <button className="w-full flex items-center justify-center space-x-2 bg-blue-50 text-blue-600 py-3 rounded-lg hover:bg-blue-100 transition-colors">
              <Send size={16} />
              <span>Transfer</span>
            </button>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Payment Methods</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm font-medium">•••• 1234</p>
                <p className="text-xs text-gray-500">Expires 12/27</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Primary</span>
            </div>
            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              <Banknote className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm font-medium">Bank Transfer</p>
                <p className="text-xs text-gray-500">Wells Fargo •••• 5678</p>
              </div>
            </div>
            <button className="w-full text-center text-blue-600 text-sm py-2 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50">
              + Add Payment Method
            </button>
          </div>
        </div>
      </div>

      {/* Staking Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
                {stakingPositions.length > 0 ? (stakingPositions.reduce((sum, pos) => sum + pos.apy, 0) / stakingPositions.length).toFixed(1) : '0.0'}%
              </p>
            </div>
            <Target className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-600 text-sm mt-2">Annual percentage yield</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 rounded-t-xl">
        <nav className="flex space-x-8 px-6">
          {['overview', 'tokens', 'staking', 'rewards', 'transactions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 border-b-2 font-medium text-sm capitalize transition-colors ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'transactions' ? 'History' : tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 border-t-0">
        {activeTab === 'overview' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* FXCT Token Overview */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">{walletData.tokens.FXCT.icon}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{walletData.tokens.FXCT.symbol}</p>
                      <p className="text-sm text-gray-600">{walletData.tokens.FXCT.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{walletData.tokens.FXCT.balance.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">${walletData.tokens.FXCT.value.toLocaleString()}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <p className="text-xs text-gray-600">Available</p>
                    <p className="text-sm font-bold text-green-600">{walletData.tokens.FXCT.available.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <p className="text-xs text-gray-600">Staked</p>
                    <p className="text-sm font-bold text-purple-600">{walletData.tokens.FXCT.staked.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium">${walletData.tokens.FXCT.price}</span>
                    <div className={`flex items-center text-xs ${
                      walletData.tokens.FXCT.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {walletData.tokens.FXCT.change24h >= 0 ? (
                        <TrendingUp size={12} className="mr-1" />
                      ) : (
                        <TrendingDown size={12} className="mr-1" />
                      )}
                      {Math.abs(walletData.tokens.FXCT.change24h)}%
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {setSelectedToken('FXCT'); setShowBuyModal(true);}}
                      className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded hover:bg-green-200"
                    >
                      Buy
                    </button>
                    <button
                      onClick={() => {setSelectedToken('FXCT'); setShowStakeModal(true);}}
                      className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded hover:bg-purple-200"
                    >
                      Stake
                    </button>
                  </div>
                </div>
              </div>

              {/* FXST Token Overview */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">{walletData.tokens.FXST.icon}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{walletData.tokens.FXST.symbol}</p>
                      <p className="text-sm text-gray-600">{walletData.tokens.FXST.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{walletData.tokens.FXST.balance.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">${walletData.tokens.FXST.value.toLocaleString()}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <p className="text-xs text-gray-600">Available</p>
                    <p className="text-sm font-bold text-green-600">{walletData.tokens.FXST.available.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <p className="text-xs text-gray-600">Staked</p>
                    <p className="text-sm font-bold text-purple-600">{walletData.tokens.FXST.staked.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium">${walletData.tokens.FXST.price}</span>
                    <div className={`flex items-center text-xs ${
                      walletData.tokens.FXST.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {walletData.tokens.FXST.change24h >= 0 ? (
                        <TrendingUp size={12} className="mr-1" />
                      ) : (
                        <TrendingDown size={12} className="mr-1" />
                      )}
                      {Math.abs(walletData.tokens.FXST.change24h)}%
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {setSelectedToken('FXST'); setShowBuyModal(true);}}
                      className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded hover:bg-green-200"
                    >
                      Buy
                    </button>
                    <button
                      onClick={() => {setSelectedToken('FXST'); setShowStakeModal(true);}}
                      className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded hover:bg-purple-200"
                    >
                      Stake
                    </button>
                  </div>
                </div>
              </div>

              {/* USD Balance */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">{walletData.cash.USD.icon}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{walletData.cash.USD.symbol}</p>
                      <p className="text-sm text-gray-600">{walletData.cash.USD.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${walletData.cash.USD.balance.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Available cash</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded hover:bg-blue-200">
                    Add Funds
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tokens' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Token Portfolio</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(walletData.tokens).map(([symbol, token]) => (
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
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {setSelectedToken(symbol); setShowBuyModal(true);}}
                        className="bg-green-100 text-green-600 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors text-sm"
                      >
                        Buy
                      </button>
                      <button
                        onClick={() => {setSelectedToken(symbol); setShowSellModal(true);}}
                        className="bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm"
                      >
                        Sell
                      </button>
                      <button
                        onClick={() => {setSelectedToken(symbol); setShowStakeModal(true);}}
                        className="bg-purple-100 text-purple-600 px-3 py-2 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                      >
                        Stake
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'staking' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Staking Positions</h3>
              <button
                onClick={() => setShowStakeModal(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
              >
                <Lock size={16} />
                <span>New Position</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {stakingPositions.map((position) => (
                <div key={position.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900">{position.token} Staking Position</h4>
                      <p className="text-gray-600">Started {position.startDate}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      position.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {position.status}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Amount Staked</p>
                      <p className="text-xl font-bold text-gray-900">{position.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">APY</p>
                      <p className="text-xl font-bold text-blue-600">{position.apy}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="text-xl font-bold text-gray-900">{position.duration} days</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Rewards Earned</p>
                      <p className="text-xl font-bold text-green-600">{position.rewards}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">Ends: {position.endDate}</span>
                      {position.autoRenew && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                          Auto-Renew
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View Details
                      </button>
                      <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                        Unstake Early
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Rewards History</h3>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Claim All
              </button>
            </div>
            
            <div className="space-y-4">
              {rewardsHistory.map((reward) => (
                <div key={reward.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
                      <p className="text-sm text-gray-600">{reward.token} • {reward.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-bold text-green-600">+{reward.amount}</p>
                      <p className={`text-xs font-medium ${
                        reward.status === 'Claimed' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {reward.status}
                      </p>
                    </div>
                    {reward.status === 'Pending' && (
                      <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                        Claim
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
              <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'buy' ? 'bg-green-100' : 
                    tx.type === 'sell' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    {tx.type === 'buy' ? (
                      <ArrowDownLeft className={`w-5 h-5 ${
                        tx.type === 'buy' ? 'text-green-600' : 
                        tx.type === 'sell' ? 'text-red-600' : 'text-blue-600'
                      }`} />
                    ) : tx.type === 'sell' ? (
                      <ArrowUpRight className="w-5 h-5 text-red-600" />
                    ) : (
                      <ArrowDownLeft className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 capitalize">
                          {tx.type} {tx.token}
                        </p>
                        <p className="text-sm text-gray-600">
                          {tx.amount} {tx.token} @ ${tx.price}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ${tx.value.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(tx.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      tx.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {tx.status}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <History size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All Transactions
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Buy Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Buy {selectedToken}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount ({selectedToken})
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Price per token</span>
                  <span>${walletData.tokens[selectedToken]?.price}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span>Total cost</span>
                  <span className="font-medium">
                    ${amount && !isNaN(amount) ? (parseFloat(amount) * walletData.tokens[selectedToken]?.price).toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowBuyModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBuy}
                  disabled={!amount || isNaN(amount) || parseFloat(amount) <= 0}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy {selectedToken}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sell Modal */}
      {showSellModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sell {selectedToken}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount ({selectedToken})
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  max={walletData.tokens[selectedToken]?.balance}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Available: {walletData.tokens[selectedToken]?.balance.toLocaleString()} {selectedToken}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Price per token</span>
                  <span>${walletData.tokens[selectedToken]?.price}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span>You'll receive</span>
                  <span className="font-medium">
                    ${amount && !isNaN(amount) ? (parseFloat(amount) * walletData.tokens[selectedToken]?.price).toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowSellModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSell}
                  disabled={!amount || isNaN(amount) || parseFloat(amount) <= 0 || parseFloat(amount) > walletData.tokens[selectedToken]?.balance}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sell {selectedToken}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Staking Modal */}
      {showStakeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stake {selectedToken}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount ({selectedToken})
                </label>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="Enter amount to stake"
                  max={walletData.tokens[selectedToken]?.available}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Available: {walletData.tokens[selectedToken]?.available.toLocaleString()} {selectedToken}
                </p>
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
                  <div className="flex justify-between text-sm">
                    <span>Estimated Rewards</span>
                    <span className="font-medium">{stakingReward.totalReward.toFixed(2)} {selectedToken}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span>APY</span>
                    <span className="font-medium text-purple-600">{stakingReward.apy}%</span>
                  </div>
                </div>
              )}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowStakeModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStake}
                  disabled={!stakeAmount || isNaN(stakeAmount) || parseFloat(stakeAmount) <= 0 || parseFloat(stakeAmount) > walletData.tokens[selectedToken]?.available}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Stake {selectedToken}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerWallet;
