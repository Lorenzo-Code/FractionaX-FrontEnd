import React, { useState, useEffect } from 'react';
import { 
  Gem, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Plus, 
  Minus,
  Info,
  Award,
  Lock,
  Unlock,
  History,
  Calculator,
  Zap,
  Target,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Shield,
  Activity,
  ExternalLink
} from 'lucide-react';
import { SEO } from '../../../shared/components';
import { generatePageSEO } from '../../../shared/utils';
import customerStakingService from '../services/customerStakingService';

export default function CustomerStaking() {
  const seoData = generatePageSEO({
    title: 'Staking - FractionaX',
    description: 'Stake your FXCT and FST tokens to earn passive rewards. View staking pools, track rewards, and manage your staking positions.',
    url: '/dashboard/staking',
    keywords: ['staking', 'rewards', 'FXCT', 'FST', 'passive income', 'yield farming']
  });

  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPool, setSelectedPool] = useState(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Dynamic staking data from API
  const [stakingData, setStakingData] = useState({
    totalStaked: 0,
    totalRewards: 0,
    claimableRewards: 0,
    stakingPower: 0,
    apy: 0
  });
  
  // Dynamic protocols from admin page
  const [availableProtocols, setAvailableProtocols] = useState([]);
  const [userPositions, setUserPositions] = useState([]);
  const [stakingHistory, setStakingHistory] = useState([]);
  
  // Load staking data from API
  const loadStakingData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch available protocols and user data concurrently
      const [protocolsResponse, userDataResponse, historyResponse] = await Promise.allSettled([
        customerStakingService.getAvailableStakingProtocols(),
        customerStakingService.getUserStakingData(),
        customerStakingService.getStakingHistory()
      ]);
      
      // Handle protocols data
      if (protocolsResponse.status === 'fulfilled' && protocolsResponse.value?.success) {
        setAvailableProtocols(protocolsResponse.value.data.protocols || []);
        console.log('✅ Loaded', protocolsResponse.value.data.protocols?.length, 'staking protocols');
      } else {
        console.warn('❌ Failed to load protocols:', protocolsResponse.reason);
      }
      
      // Handle user staking data
      if (userDataResponse.status === 'fulfilled' && userDataResponse.value?.success) {
        const userData = userDataResponse.value.data;
        setStakingData({
          totalStaked: userData.totalStaked || 0,
          totalRewards: userData.totalRewards || 0,
          claimableRewards: userData.claimableRewards || 0,
          stakingPower: userData.stakingPower || 0,
          apy: userData.averageAPY || 0
        });
        setUserPositions(userData.positions || []);
        console.log('✅ Loaded user staking data');
      }
      
      // Handle staking history
      if (historyResponse.status === 'fulfilled' && historyResponse.value?.success) {
        setStakingHistory(historyResponse.value.data.transactions || []);
        console.log('✅ Loaded staking history');
      }
      
    } catch (error) {
      console.error('❌ Error loading staking data:', error);
      setError('Failed to load staking data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Refresh data
  const refreshData = async () => {
    setRefreshing(true);
    await loadStakingData();
    setRefreshing(false);
  };
  
  // Load data on component mount
  useEffect(() => {
    loadStakingData();
  }, []);
  
  // Combine protocols with user positions to get complete staking pool data
  const stakingPools = availableProtocols.map(protocol => {
    // Find user's position in this protocol
    const userPosition = userPositions.find(pos => pos.protocolId === protocol.id);
    
    return {
      ...protocol,
      myStake: userPosition?.stakedAmount || 0,
      rewards: userPosition?.rewards || 0,
      status: userPosition ? 'active' : 'available'
    };
  });
  
  // Helper functions for risk category styling
  const getRiskCategoryColor = (category) => {
    switch (category) {
      case 'Low-Risk': return 'green';
      case 'Medium-Risk': return 'blue';
      case 'High-Risk': return 'red';
      default: return 'gray';
    }
  };
  
  const getRiskCategoryBadge = (category) => {
    const colors = {
      'Low-Risk': 'bg-green-100 text-green-800',
      'Medium-Risk': 'bg-blue-100 text-blue-800',
      'High-Risk': 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-600';
  };
  
  const formatTVL = (tvl) => {
    if (tvl >= 1000000) return `$${(tvl / 1000000).toFixed(1)}M`;
    if (tvl >= 1000) return `$${(tvl / 1000).toFixed(1)}K`;
    return `$${tvl.toLocaleString()}`;
  };

  // Mock staking history data (if API doesn't return history)
  const mockStakingHistory = [
    {
      id: 1,
      type: 'stake',
      pool: 'FXCT Staking Pool',
      amount: 5000,
      token: 'FXCT',
      timestamp: '2024-08-25T10:30:00Z',
      status: 'completed',
      txHash: '0x1234...abcd'
    },
    {
      id: 2,
      type: 'claim',
      pool: 'FST Staking Pool',
      amount: 123.45,
      token: 'FST',
      timestamp: '2024-08-20T14:15:00Z',
      status: 'completed',
      txHash: '0x5678...efgh'
    },
    {
      id: 3,
      type: 'unstake',
      pool: 'FXCT Staking Pool',
      amount: 2000,
      token: 'FXCT',
      timestamp: '2024-08-18T09:20:00Z',
      status: 'pending',
      txHash: '0x9012...ijkl'
    }
  ];
  
  // Use API data if available, otherwise fall back to mock data
  const displayHistory = stakingHistory.length > 0 ? stakingHistory : mockStakingHistory;

  const handleStake = async (pool, amount) => {
    try {
      console.log(`Staking ${amount} in ${pool.name}`);
      const response = await customerStakingService.stakeTokens(pool.id, Number(amount));
      
      if (response.success) {
        console.log('✅ Stake successful:', response.data.message);
        // Refresh data to show updated stakes
        await refreshData();
      }
    } catch (error) {
      console.error('❌ Staking failed:', error);
      setError('Failed to stake tokens. Please try again.');
    } finally {
      setShowStakeModal(false);
      setStakeAmount('');
    }
  };

  const handleUnstake = async (pool, amount) => {
    try {
      console.log(`Unstaking ${amount} from ${pool.name}`);
      const response = await customerStakingService.unstakeTokens(pool.id, Number(amount));
      
      if (response.success) {
        console.log('✅ Unstake successful:', response.data.message);
        // Refresh data to show updated stakes
        await refreshData();
      }
    } catch (error) {
      console.error('❌ Unstaking failed:', error);
      setError('Failed to unstake tokens. Please try again.');
    } finally {
      setShowUnstakeModal(false);
      setUnstakeAmount('');
    }
  };

  const handleClaimRewards = async (pool) => {
    try {
      console.log(`Claiming rewards from ${pool.name}`);
      const response = await customerStakingService.claimRewards(pool.id);
      
      if (response.success) {
        console.log('✅ Claim successful:', response.data.message);
        // Refresh data to show updated rewards
        await refreshData();
      }
    } catch (error) {
      console.error('❌ Claiming failed:', error);
      setError('Failed to claim rewards. Please try again.');
    }
  };

  const formatNumber = (num, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  };

  const calculateRewards = (amount, apy, days) => {
    return (amount * (apy / 100) * (days / 365));
  };

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <SEO {...seoData} />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading staking protocols...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <SEO {...seoData} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Gem className="w-8 h-8 text-purple-600" />
            <span>Staking Dashboard</span>
          </h1>
          <p className="text-gray-600 mt-2">Access professional DeFi staking protocols and earn passive rewards</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-150 disabled:opacity-50"
          >
            <Activity className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <button
            onClick={() => setShowCalculator(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-150"
          >
            <Calculator className="w-4 h-4" />
            <span>Rewards Calculator</span>
          </button>
        </div>
      </div>
      
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
          <button 
            onClick={() => setError(null)}
            className="text-red-800 hover:text-red-900"
          >
            ✕
          </button>
        </div>
      )}
      
      {/* Protocol Count Info */}
      {availableProtocols.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          <span>✅ {availableProtocols.length} DeFi protocols available for staking</span>
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Staked</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stakingData.totalStaked)}</p>
              <p className="text-sm text-green-600 mt-1">≈ {formatCurrency(stakingData.totalStaked * 0.27)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Rewards Earned</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stakingData.totalRewards)}</p>
              <p className="text-sm text-green-600 mt-1">+{stakingData.apy}% APY</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Claimable Rewards</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stakingData.claimableRewards)}</p>
              <button className="text-sm text-purple-600 hover:text-purple-700 mt-1">
                Claim Now →
              </button>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Staking Power</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stakingData.stakingPower)}</p>
              <p className="text-sm text-gray-500 mt-1">Governance votes</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {['overview', 'pools', 'history'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-medium capitalize transition-colors duration-150 border-b-2 ${
                  activeTab === tab
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Active Pools */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Active Positions</h3>
                {stakingPools.filter(pool => pool.myStake > 0).length > 0 ? (
                  <div className="grid gap-4">
                    {stakingPools.filter(pool => pool.myStake > 0).map((pool) => (
                      <div key={pool.id} className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-white to-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-3xl">{pool.icon}</div>
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-semibold text-gray-900">{pool.name}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskCategoryBadge(pool.category)}`}>
                                  {pool.category}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">Staked: {formatNumber(pool.myStake)} {pool.token}</p>
                              <p className="text-xs text-gray-500">APY: {pool.apy}% • Network: {pool.blockchains?.split(',')[0] || 'Ethereum'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-green-600">
                              {formatCurrency(pool.rewards)}
                            </p>
                            <p className="text-sm text-gray-500">Pending rewards</p>
                            <p className="text-xs text-gray-400">Daily: ~{formatCurrency(calculateRewards(pool.myStake, pool.apy, 1))}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleClaimRewards(pool)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-150"
                              disabled={pool.rewards <= 0}
                            >
                              <Award className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedPool(pool);
                                setShowStakeModal(true);
                              }}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-150"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Lock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No Active Positions</h4>
                    <p className="text-gray-600 mb-4">Start staking in one of our {stakingPools.length} available protocols to earn rewards.</p>
                    <button
                      onClick={() => setActiveTab('pools')}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-150"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Browse Protocols</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Performance Chart */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Staking Performance</h3>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Performance chart will be displayed here</p>
                  <p className="text-sm text-gray-500 mt-2">Track your staking rewards over time</p>
                </div>
              </div>
            </div>
          )}

          {/* Pools Tab */}
          {activeTab === 'pools' && (
            <div className="space-y-6">
              {/* Header with filters */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Available Staking Protocols</h3>
                <div className="text-sm text-gray-500">
                  {stakingPools.length} protocols • {stakingPools.filter(p => p.myStake > 0).length} active positions
                </div>
              </div>
              
              {/* Group protocols by risk category */}
              {['Low-Risk', 'Medium-Risk', 'High-Risk'].map(category => {
                const categoryPools = stakingPools.filter(pool => pool.category === category);
                
                if (categoryPools.length === 0) return null;
                
                return (
                  <div key={category} className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {category === 'Low-Risk' && '🛡️'}
                        {category === 'Medium-Risk' && '⚖️'}
                        {category === 'High-Risk' && '🚀'}
                        {' ' + category} Protocols
                      </h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskCategoryBadge(category)}`}>
                        {categoryPools.length} available
                      </span>
                    </div>
                    
                    <div className="grid gap-4">
                      {categoryPools.map((pool) => (
                        <div key={pool.id} className={`border-2 rounded-xl p-6 transition-all duration-200 hover:shadow-lg ${
                          pool.highlighted ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-white'
                        }`}>
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4 flex-1">
                              <div className="text-4xl">{pool.icon}</div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h3 className="text-xl font-semibold text-gray-900">{pool.name}</h3>
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    pool.status === 'active' ? 'bg-green-100 text-green-800' :
                                    'bg-blue-100 text-blue-800'
                                  }`}>
                                    {pool.status === 'active' ? 'ACTIVE' : 'AVAILABLE'}
                                  </span>
                                  {pool.highlighted && (
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                      ⭐ FEATURED
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-600 mb-4">{pool.description}</p>
                                
                                {/* Key metrics */}
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                                  <div>
                                    <p className="text-sm text-gray-500">APY</p>
                                    <p className="text-lg font-semibold text-green-600">{pool.apy}%</p>
                                    <p className="text-xs text-gray-400">{pool.apyRange}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">TVL</p>
                                    <p className="text-lg font-semibold text-gray-900">{formatTVL(pool.tvl)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Your Stake</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                      {formatNumber(pool.myStake)} {pool.token}
                                    </p>
                                    {pool.myStake > 0 && (
                                      <p className="text-xs text-green-600">
                                        ≈ {formatCurrency(pool.rewards)} rewards
                                      </p>
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Lock Period</p>
                                    <p className="text-lg font-semibold text-gray-900">{pool.lockPeriod}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Network</p>
                                    <p className="text-sm text-gray-900">{pool.blockchains?.split(',')[0] || 'Ethereum'}</p>
                                  </div>
                                </div>
                                
                                {/* Additional info */}
                                <div className="space-y-2">
                                  {pool.uniqueFeatures && (
                                    <div className="flex items-start space-x-2">
                                      <Zap className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                      <p className="text-sm text-gray-600">{pool.uniqueFeatures}</p>
                                    </div>
                                  )}
                                  {pool.risks && (
                                    <div className="flex items-start space-x-2">
                                      <Shield className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                      <p className="text-sm text-gray-600">{pool.risks}</p>
                                    </div>
                                  )}
                                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <Info className="w-4 h-4" />
                                    <span>Min stake: {pool.minStake} {pool.token} • Unstaking: {pool.unstakingPeriod}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col space-y-2 ml-4">
                              {pool.status === 'active' && (
                                <>
                                  <button
                                    onClick={() => {
                                      setSelectedPool(pool);
                                      setShowStakeModal(true);
                                    }}
                                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-150"
                                  >
                                    <Plus className="w-4 h-4" />
                                    <span>Stake More</span>
                                  </button>
                                  {pool.myStake > 0 && (
                                    <>
                                      <button
                                        onClick={() => handleClaimRewards(pool)}
                                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-150"
                                        disabled={pool.rewards <= 0}
                                      >
                                        <Award className="w-4 h-4" />
                                        <span>Claim</span>
                                      </button>
                                      <button
                                        onClick={() => {
                                          setSelectedPool(pool);
                                          setShowUnstakeModal(true);
                                        }}
                                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                                      >
                                        <Minus className="w-4 h-4" />
                                        <span>Unstake</span>
                                      </button>
                                    </>
                                  )}
                                </>
                              )}
                              {pool.status === 'available' && (
                                <button
                                  onClick={() => {
                                    setSelectedPool(pool);
                                    setShowStakeModal(true);
                                  }}
                                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-150"
                                >
                                  <Plus className="w-4 h-4" />
                                  <span>Start Staking</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              
              {/* Empty state */}
              {stakingPools.length === 0 && (
                <div className="text-center py-12">
                  <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Staking Protocols Available</h3>
                  <p className="text-gray-600">Check back later for new staking opportunities.</p>
                </div>
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Staking History</h3>
                <div className="text-sm text-gray-500">
                  {displayHistory.length} transactions
                </div>
              </div>
              
              {displayHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Protocol
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Transaction
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {displayHistory.map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              {transaction.type === 'stake' && <Lock className="w-4 h-4 text-purple-600" />}
                              {transaction.type === 'unstake' && <Unlock className="w-4 h-4 text-orange-600" />}
                              {transaction.type === 'claim' && <Award className="w-4 h-4 text-green-600" />}
                              <span className="text-sm font-medium text-gray-900 capitalize">
                                {transaction.type}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.protocolName || transaction.pool}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatNumber(transaction.amount)} {transaction.token}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(transaction.timestamp).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                              transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {transaction.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <a 
                              href={`https://etherscan.io/tx/${transaction.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-1 text-purple-600 hover:text-purple-700"
                            >
                              <span>{transaction.txHash}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Transaction History</h3>
                  <p className="text-gray-600">Your staking transactions will appear here.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stake Modal */}
      {showStakeModal && selectedPool && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-25" onClick={() => setShowStakeModal(false)}></div>
            <div className="relative bg-white rounded-lg max-w-lg w-full p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-2xl">{selectedPool.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Stake in {selectedPool.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskCategoryBadge(selectedPool.category)}`}>
                      {selectedPool.category}
                    </span>
                    <span className="text-xs text-gray-500">{selectedPool.blockchains?.split(',')[0] || 'Ethereum'}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Risk warning for higher risk protocols */}
                {selectedPool.category !== 'Low-Risk' && (
                  <div className={`border rounded-lg p-3 ${
                    selectedPool.category === 'High-Risk' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
                  }`}>
                    <div className="flex items-start space-x-2">
                      <AlertCircle className={`w-5 h-5 mt-0.5 ${
                        selectedPool.category === 'High-Risk' ? 'text-red-600' : 'text-yellow-600'
                      }`} />
                      <div className={`text-sm ${
                        selectedPool.category === 'High-Risk' ? 'text-red-800' : 'text-yellow-800'
                      }`}>
                        <p className="font-semibold mb-1">{selectedPool.category} Protocol</p>
                        <p>{selectedPool.risks}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount to stake
                  </label>
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    placeholder={`Min: ${selectedPool.minStake} ${selectedPool.token}`}
                  />
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">APY:</span>
                      <span className="font-semibold text-green-600">{selectedPool.apy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lock Period:</span>
                      <span className="font-semibold">{selectedPool.lockPeriod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Daily rewards:</span>
                      <span className="font-semibold">
                        {formatCurrency(calculateRewards(Number(stakeAmount) || 0, selectedPool.apy, 1))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly rewards:</span>
                      <span className="font-semibold">
                        {formatCurrency(calculateRewards(Number(stakeAmount) || 0, selectedPool.apy, 30))}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowStakeModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleStake(selectedPool, stakeAmount)}
                    className={`flex-1 px-4 py-2 text-white rounded-md transition-colors duration-150 ${
                      selectedPool.category === 'High-Risk' 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                    disabled={!stakeAmount || Number(stakeAmount) < selectedPool.minStake}
                  >
                    {selectedPool.category === 'High-Risk' ? '⚠️ Stake (High Risk)' : 'Stake'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unstake Modal */}
      {showUnstakeModal && selectedPool && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-25" onClick={() => setShowUnstakeModal(false)}></div>
            <div className="relative bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Unstake from {selectedPool.name}
              </h3>
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-semibold">Unstaking Period: {selectedPool.unstakingPeriod}</p>
                      <p>Your tokens will be locked during the unstaking period.</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount to unstake (Max: {formatNumber(selectedPool.myStake)} {selectedPool.token})
                  </label>
                  <input
                    type="number"
                    value={unstakeAmount}
                    onChange={(e) => setUnstakeAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    max={selectedPool.myStake}
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowUnstakeModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUnstake(selectedPool, unstakeAmount)}
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                    disabled={!unstakeAmount || Number(unstakeAmount) > selectedPool.myStake}
                  >
                    Unstake
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
