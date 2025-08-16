import React, { useState, useEffect } from 'react';
import { Coins, TrendingUp, Users, AlertTriangle, BarChart3, Brain, Shield, Play } from 'lucide-react';
import StakingProtocolCard from './StakingProtocolCard';
import AIRecommendationsPanel from './AIRecommendationsPanel';
import RiskManagementPanel from './RiskManagementPanel';
import UserStakingAnalytics from './UserStakingAnalytics';
import RewardsDistributionPanel from './RewardsDistributionPanel';
import stakingApiService from '../../services/stakingApi';

const StakingManagementDashboard = () => {
  const [protocols, setProtocols] = useState([]);
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('protocols');

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [protocolsData, analyticsData, performanceAnalytics] = await Promise.all([
        stakingApiService.getStakingProtocols(),
        stakingApiService.getUserStakingAnalytics(),
        stakingApiService.getPerformanceAnalytics()
      ]);

      setProtocols(protocolsData.stakingProtocols?.activeProtocols || []);
      setUserAnalytics(analyticsData.stakingAnalytics);
      setPerformanceData(performanceAnalytics.performanceAnalytics);

    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProtocolUpdate = async (protocolId, updateData) => {
    try {
      await stakingApiService.updateStakingProtocol(protocolId, updateData);
      await loadDashboardData(); // Refresh data
    } catch (err) {
      console.error('Failed to update protocol:', err);
      setError(err.message);
    }
  };

  const handleEmergencyAction = async (actionData) => {
    try {
      await stakingApiService.executeEmergencyControl(actionData);
      await loadDashboardData(); // Refresh data
    } catch (err) {
      console.error('Failed to execute emergency action:', err);
      setError(err.message);
    }
  };

  const handleRewardsDistribution = async (distributionData) => {
    try {
      await stakingApiService.distributeRewards(distributionData);
      await loadDashboardData(); // Refresh data
    } catch (err) {
      console.error('Failed to distribute rewards:', err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="text-red-600" size={20} />
          <h3 className="text-lg font-semibold text-red-900">Error Loading Dashboard</h3>
        </div>
        <p className="text-red-700">{error}</p>
        <button
          onClick={loadDashboardData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'protocols', name: 'Protocols', icon: Coins },
    { id: 'analytics', name: 'User Analytics', icon: BarChart3 },
    { id: 'ai-recommendations', name: 'AI Recommendations', icon: Brain },
    { id: 'risk-management', name: 'Risk Management', icon: Shield },
    { id: 'rewards', name: 'Rewards Distribution', icon: TrendingUp }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Overview Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🎯 FXCT Staking Management</h1>
            <p className="text-gray-600 mt-1">Comprehensive staking protocol administration and analytics</p>
          </div>
          <button
            onClick={loadDashboardData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Play size={16} />
            Refresh Data
          </button>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Coins className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Total Value Locked</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${performanceData?.overallPerformance?.totalValueLocked?.toLocaleString() || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-green-900">Active Stakers</p>
                <p className="text-2xl font-bold text-green-600">
                  {userAnalytics?.overview?.totalStakers?.toLocaleString() || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-900">Avg APY Realized</p>
                <p className="text-2xl font-bold text-purple-600">
                  {performanceData?.overallPerformance?.averageAPYAchieved || 'N/A'}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <BarChart3 className="text-yellow-600" size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-900">Adoption Rate</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {userAnalytics?.overview?.stakingAdoptionRate || 'N/A'}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'protocols' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Staking Protocols</h2>
                <span className="text-sm text-gray-500">
                  {protocols.length} active protocols
                </span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {protocols.map((protocol) => (
                  <StakingProtocolCard
                    key={protocol.protocolId}
                    protocol={protocol}
                    onUpdate={handleProtocolUpdate}
                    onEmergencyAction={handleEmergencyAction}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <UserStakingAnalytics 
              analytics={userAnalytics}
              performanceData={performanceData}
            />
          )}

          {activeTab === 'ai-recommendations' && (
            <AIRecommendationsPanel />
          )}

          {activeTab === 'risk-management' && (
            <RiskManagementPanel />
          )}

          {activeTab === 'rewards' && (
            <RewardsDistributionPanel
              protocols={protocols}
              onDistribute={handleRewardsDistribution}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StakingManagementDashboard;
