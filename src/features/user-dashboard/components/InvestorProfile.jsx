import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User,
  Trophy,
  Star,
  TrendingUp,
  Coins,
  Shield,
  Users,
  Target,
  Award,
  Calendar,
  DollarSign,
  PieChart,
  Share2,
  Crown,
  Zap
} from 'lucide-react';

const InvestorProfile = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock investor data - replace with real API calls
  const [investorData] = useState({
    profile: {
      username: 'PropertyInvestor_TX',
      joinDate: '2024-01-15',
      totalInvested: 125750,
      totalReturns: 18420,
      monthlyIncome: 1247,
      investorLevel: 'gold',
      investorRank: 127,
      totalRankedInvestors: 25847,
      investmentStreak: 8,
      socialShares: 23,
      referrals: 12
    },
    portfolio: {
      activeProperties: 12,
      totalFXCT: 8500,
      totalFXST: 15500,
      stakedFXCT: 3200,
      stakingRewards: 245,
      diversificationScore: 8.3
    },
    achievements: [
      { 
        id: 1, 
        title: 'Early Adopter', 
        description: 'Joined within first 1000 users', 
        completed: true,
        rarity: 'legendary',
        reward: '1000 FXCT'
      },
      { 
        id: 2, 
        title: 'Community Builder', 
        description: 'Bid on 10+ different properties', 
        completed: true,
        rarity: 'rare',
        reward: '500 FXCT'
      },
      { 
        id: 3, 
        title: 'Social Influencer', 
        description: 'Share 25 investment opportunities', 
        completed: false,
        progress: 23,
        target: 25,
        rarity: 'epic',
        reward: '750 FXCT'
      },
      { 
        id: 4, 
        title: 'Portfolio Diversifier', 
        description: 'Invest in 5+ different markets', 
        completed: false,
        progress: 3,
        target: 5,
        rarity: 'rare',
        reward: '400 FXCT'
      }
    ],
    recentActivity: [
      { type: 'bid', amount: 500, property: 'Austin Tech Hub Condo', timestamp: '2 hours ago' },
      { type: 'reward', amount: 75, reason: 'Social sharing bonus', timestamp: '1 day ago' },
      { type: 'dividend', amount: 124, property: 'Dallas Family Home', timestamp: '2 days ago' },
      { type: 'stake', amount: 1000, reason: 'FXCT staking', timestamp: '3 days ago' }
    ],
    socialImpact: {
      propertiesHelped: 45,
      communityValue: 125000,
      referralEarnings: 850,
      sharingBonuses: 340
    }
  });

  const getInvestorBadge = (level) => {
    switch (level) {
      case 'platinum':
        return {
          icon: <Crown className="w-5 h-5" />,
          color: 'bg-gray-100 text-gray-700 border-gray-300',
          name: 'Platinum Investor'
        };
      case 'gold':
        return {
          icon: <Trophy className="w-5 h-5" />,
          color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          name: 'Gold Investor'
        };
      case 'silver':
        return {
          icon: <Star className="w-5 h-5" />,
          color: 'bg-gray-100 text-gray-600 border-gray-300',
          name: 'Silver Investor'
        };
      default:
        return {
          icon: <Target className="w-5 h-5" />,
          color: 'bg-blue-100 text-blue-700 border-blue-300',
          name: 'Bronze Investor'
        };
    }
  };

  const getAchievementRarity = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'text-purple-600 bg-purple-100 border-purple-300';
      case 'epic': return 'text-orange-600 bg-orange-100 border-orange-300';
      case 'rare': return 'text-blue-600 bg-blue-100 border-blue-300';
      default: return 'text-green-600 bg-green-100 border-green-300';
    }
  };

  const badge = getInvestorBadge(investorData.profile.investorLevel);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold">{investorData.profile.username}</h1>
                <div className={`px-3 py-1 rounded-full border text-sm font-semibold flex items-center space-x-2 ${badge.color}`}>
                  {badge.icon}
                  <span>{badge.name}</span>
                </div>
              </div>
              <div className="text-blue-100 space-y-1">
                <div>Member since {new Date(investorData.profile.joinDate).toLocaleDateString()}</div>
                <div>Rank #{investorData.profile.investorRank.toLocaleString()} of {investorData.profile.totalRankedInvestors.toLocaleString()}</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-6 text-center mt-6 md:mt-0">
            <div>
              <div className="text-2xl font-bold">${investorData.profile.totalInvested.toLocaleString()}</div>
              <div className="text-sm text-blue-200">Total Invested</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-300">+${investorData.profile.totalReturns.toLocaleString()}</div>
              <div className="text-sm text-blue-200">Total Returns</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{investorData.profile.investmentStreak}</div>
              <div className="text-sm text-blue-200">Bid Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: PieChart },
              { id: 'portfolio', label: 'Portfolio', icon: DollarSign },
              { id: 'achievements', label: 'Achievements', icon: Trophy },
              { id: 'activity', label: 'Activity', icon: Calendar },
              { id: 'community', label: 'Community', icon: Users }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Investment Overview */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Investment Overview</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <TrendingUp className="w-6 h-6 text-green-600 mb-2" />
                    <div className="text-xl font-bold text-green-700">
                      {((investorData.profile.totalReturns / investorData.profile.totalInvested) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-green-600">Total Return</div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <Calendar className="w-6 h-6 text-purple-600 mb-2" />
                    <div className="text-xl font-bold text-purple-700">
                      ${investorData.profile.monthlyIncome.toLocaleString()}
                    </div>
                    <div className="text-sm text-purple-600">Monthly Income</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <Shield className="w-6 h-6 text-blue-600 mb-2" />
                    <div className="text-xl font-bold text-blue-700">
                      {investorData.portfolio.activeProperties}
                    </div>
                    <div className="text-sm text-blue-600">Properties</div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <Coins className="w-6 h-6 text-orange-600 mb-2" />
                    <div className="text-xl font-bold text-orange-700">
                      {investorData.portfolio.totalFXCT.toLocaleString()}
                    </div>
                    <div className="text-sm text-orange-600">FXCT Balance</div>
                  </div>
                </div>
              </div>

              {/* Portfolio Breakdown */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Portfolio Health</h3>
                <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-green-900">Diversification Score</span>
                    <span className="text-2xl font-bold text-green-700">
                      {investorData.portfolio.diversificationScore}/10
                    </span>
                  </div>
                  <div className="w-full bg-white rounded-full h-3 mb-4">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                      style={{ width: `${investorData.portfolio.diversificationScore * 10}%` }}
                    />
                  </div>
                  <div className="text-sm text-green-700">
                    Excellent diversification across markets and property types
                  </div>
                </div>

                {/* Token Holdings */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <Coins className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <div className="text-lg font-bold text-gray-900">
                      {investorData.portfolio.totalFXCT.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">FXCT Tokens</div>
                    <div className="text-xs text-orange-600 mt-1">
                      {investorData.portfolio.stakedFXCT.toLocaleString()} staked
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="text-lg font-bold text-gray-900">
                      {investorData.portfolio.totalFXST.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">FXST Tokens</div>
                    <div className="text-xs text-green-600 mt-1">Security tokens</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Investment Achievements</h3>
                <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {investorData.achievements.filter(a => a.completed).length} / {investorData.achievements.length} Completed
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {investorData.achievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg border-2 ${
                      achievement.completed 
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`px-2 py-1 rounded-full text-xs font-semibold border ${getAchievementRarity(achievement.rarity)}`}>
                        {achievement.rarity.toUpperCase()}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">{achievement.reward}</div>
                      </div>
                    </div>
                    
                    <h4 className={`font-semibold mb-2 ${achievement.completed ? 'text-green-900' : 'text-gray-900'}`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-sm mb-3 ${achievement.completed ? 'text-green-700' : 'text-gray-600'}`}>
                      {achievement.description}
                    </p>
                    
                    {!achievement.completed && achievement.progress && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Progress: {achievement.progress}/{achievement.target}</span>
                          <span>{Math.round((achievement.progress / achievement.target) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {achievement.completed && (
                      <div className="flex items-center text-sm text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Completed
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'community' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Community Impact</h3>
              
              {/* Social Impact Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-700">
                    {investorData.socialImpact.propertiesHelped}
                  </div>
                  <div className="text-sm text-blue-600">Properties Helped Fund</div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-700">
                    ${investorData.socialImpact.communityValue.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-600">Community Value Added</div>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                  <Share2 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-700">
                    ${investorData.socialImpact.sharingBonuses}
                  </div>
                  <div className="text-sm text-purple-600">Sharing Bonuses</div>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                  <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-700">
                    ${investorData.socialImpact.referralEarnings}
                  </div>
                  <div className="text-sm text-orange-600">Referral Earnings</div>
                </div>
              </div>

              {/* Referral Program */}
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-semibold text-orange-900">Referral Program</h4>
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-orange-600" />
                    <span className="font-semibold text-orange-800">{investorData.profile.referrals} Referrals</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-700">$50</div>
                    <div className="text-sm text-orange-600">Per Referral Bonus</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-700">25%</div>
                    <div className="text-sm text-orange-600">Lifetime Fee Share</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-700">10%</div>
                    <div className="text-sm text-orange-600">Extra Staking Boost</div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-center">
                  <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2">
                    <Share2 className="w-4 h-4" />
                    <span>Share Referral Link</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
              <div className="space-y-3">
                {investorData.recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'bid' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'reward' ? 'bg-orange-100 text-orange-600' :
                        activity.type === 'dividend' ? 'bg-green-100 text-green-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {activity.type === 'bid' && <Target className="w-4 h-4" />}
                        {activity.type === 'reward' && <Award className="w-4 h-4" />}
                        {activity.type === 'dividend' && <DollarSign className="w-4 h-4" />}
                        {activity.type === 'stake' && <Zap className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 capitalize">{activity.type}</div>
                        <div className="text-sm text-gray-600">
                          {activity.property || activity.reason}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${
                        activity.type === 'dividend' ? 'text-green-600' :
                        activity.type === 'reward' ? 'text-orange-600' :
                        'text-blue-600'
                      }`}>
                        {activity.type === 'bid' ? '-' : '+'}${activity.amount}
                      </div>
                      <div className="text-xs text-gray-500">{activity.timestamp}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestorProfile;
