import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  TrendingDown,
  Users,
  Crown,
  Star,
  Target,
  Zap,
  Shield,
  DollarSign,
  BarChart3,
  Calendar,
  MapPin,
  Flame,
  Gem,
  Activity,
  Filter,
  RefreshCw,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

const InvestmentLeaderboards = ({ currentUser }) => {
  const [activeLeaderboard, setActiveLeaderboard] = useState('returns');
  const [timeframe, setTimeframe] = useState('1Y');
  const [showUserPosition, setShowUserPosition] = useState(true);

  // Mock leaderboard data
  const mockLeaderboardData = {
    returns: [
      {
        rank: 1,
        investor: {
          id: 'inv_001',
          displayName: 'Austin_Property_King',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=king',
          level: 'Diamond',
          location: 'Texas',
          joinDate: '2022-03-15'
        },
        metrics: {
          totalReturn: 89.7,
          portfolioValue: 234500,
          investments: 24,
          avgReturn: 31.2,
          consistency: 94,
          riskScore: 35
        },
        achievements: ['Top Performer', 'Diversification Master', 'Early Adopter'],
        trend: 'up',
        change: '+12.3%'
      },
      {
        rank: 2,
        investor: {
          id: 'inv_002',
          displayName: 'Miami_Growth_Wizard',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wizard',
          level: 'Platinum',
          location: 'Florida',
          joinDate: '2022-07-20'
        },
        metrics: {
          totalReturn: 76.4,
          portfolioValue: 189000,
          investments: 18,
          avgReturn: 28.9,
          consistency: 87,
          riskScore: 42
        },
        achievements: ['Growth Champion', 'Risk Manager', 'Consistent Performer'],
        trend: 'up',
        change: '+8.1%'
      },
      {
        rank: 3,
        investor: {
          id: 'inv_003',
          displayName: 'Phoenix_REI_Master',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=master',
          level: 'Gold',
          location: 'Arizona',
          joinDate: '2023-01-10'
        },
        metrics: {
          totalReturn: 72.1,
          portfolioValue: 156700,
          investments: 15,
          avgReturn: 26.4,
          consistency: 91,
          riskScore: 28
        },
        achievements: ['Rising Star', 'Smart Investor', 'Balanced Portfolio'],
        trend: 'up',
        change: '+15.7%'
      },
      {
        rank: 4,
        investor: {
          id: 'inv_004',
          displayName: 'Dallas_Diversifier',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=diversifier',
          level: 'Gold',
          location: 'Texas',
          joinDate: '2022-11-05'
        },
        metrics: {
          totalReturn: 68.8,
          portfolioValue: 143200,
          investments: 21,
          avgReturn: 25.1,
          consistency: 89,
          riskScore: 31
        },
        achievements: ['Diversification Expert', 'Steady Growth', 'Portfolio Builder'],
        trend: 'stable',
        change: '+2.4%'
      },
      {
        rank: 5,
        investor: {
          id: 'inv_005',
          displayName: 'California_Innovator',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=innovator',
          level: 'Platinum',
          location: 'California',
          joinDate: '2022-05-18'
        },
        metrics: {
          totalReturn: 65.2,
          portfolioValue: 198500,
          investments: 19,
          avgReturn: 24.7,
          consistency: 85,
          riskScore: 38
        },
        achievements: ['Innovation Leader', 'Tech Adopter', 'Market Analyst'],
        trend: 'up',
        change: '+6.9%'
      }
    ],
    volume: [
      // Similar structure for volume-based rankings
    ],
    consistency: [
      // Similar structure for consistency rankings
    ],
    diversification: [
      // Similar structure for diversification rankings
    ]
  };

  // Current user's position in leaderboards
  const userPosition = {
    rank: 12,
    percentile: 78,
    totalReturn: 45.3,
    trend: 'up',
    change: '+4.2%'
  };

  const leaderboardTypes = [
    {
      id: 'returns',
      name: 'Top Returns',
      icon: TrendingUp,
      description: 'Highest total returns',
      metric: 'Total Return %'
    },
    {
      id: 'volume',
      name: 'Investment Volume',
      icon: DollarSign,
      description: 'Largest portfolio values',
      metric: 'Portfolio Value'
    },
    {
      id: 'consistency',
      name: 'Consistency',
      icon: Target,
      description: 'Most consistent performers',
      metric: 'Consistency Score'
    },
    {
      id: 'diversification',
      name: 'Diversification',
      icon: Shield,
      description: 'Best diversified portfolios',
      metric: 'Diversification Score'
    }
  ];

  const timeframes = [
    { id: '1M', name: '1 Month' },
    { id: '3M', name: '3 Months' },
    { id: '6M', name: '6 Months' },
    { id: '1Y', name: '1 Year' },
    { id: 'ALL', name: 'All Time' }
  ];

  const currentLeaderboard = mockLeaderboardData[activeLeaderboard] || mockLeaderboardData.returns;

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-orange-500" />;
      default: return <span className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">{rank}</span>;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
      case 2: return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
      case 3: return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200';
      default: return 'bg-white border-gray-200';
    }
  };

  const getInvestorLevelColor = (level) => {
    switch (level) {
      case 'Diamond': return 'text-purple-600 bg-purple-100';
      case 'Platinum': return 'text-gray-600 bg-gray-100';
      case 'Gold': return 'text-yellow-600 bg-yellow-100';
      case 'Silver': return 'text-blue-600 bg-blue-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatMetricValue = (type, value) => {
    switch (type) {
      case 'returns':
        return `+${value.toFixed(1)}%`;
      case 'volume':
        return `$${value.toLocaleString()}`;
      case 'consistency':
      case 'diversification':
        return `${Math.round(value)}/100`;
      default:
        return value.toString();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
            Investment Leaderboards
          </h2>
          <p className="text-gray-600">Top performing investors on FractionaX</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {timeframes.map(tf => (
              <option key={tf.id} value={tf.id}>{tf.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Your Position Card */}
      {showUserPosition && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Your Position</h3>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <span className="text-2xl font-bold text-blue-600">#{userPosition.rank}</span>
                  <span className="text-sm text-blue-700">out of 1,247 investors</span>
                </div>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(userPosition.trend)}
                  <span className={`text-sm font-medium ${userPosition.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {userPosition.change}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                +{userPosition.totalReturn}%
              </div>
              <div className="text-sm text-blue-700">Total Return</div>
              <div className="text-xs text-gray-600 mt-1">
                Top {100 - userPosition.percentile}% of investors
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Categories */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {leaderboardTypes.map(({ id, name, icon: Icon, description, metric }) => (
              <button
                key={id}
                onClick={() => setActiveLeaderboard(id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                  activeLeaderboard === id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={16} />
                <div className="text-left">
                  <div>{name}</div>
                  <div className="text-xs text-gray-500">{description}</div>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Leaderboard Content */}
        <div className="p-6">
          <div className="space-y-4">
            {currentLeaderboard.map((investor) => (
              <div
                key={investor.investor.id}
                className={`rounded-xl border p-6 transition-all hover:shadow-md ${getRankColor(investor.rank)}`}
              >
                <div className="flex items-center justify-between">
                  {/* Left side - Investor info */}
                  <div className="flex items-center space-x-4">
                    {/* Rank */}
                    <div className="flex-shrink-0">
                      {getRankIcon(investor.rank)}
                    </div>

                    {/* Avatar and basic info */}
                    <div className="flex items-center space-x-3">
                      <img 
                        src={investor.investor.avatar} 
                        alt={investor.investor.displayName}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">
                            {investor.investor.displayName}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getInvestorLevelColor(investor.investor.level)}`}>
                            {investor.investor.level}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span>{investor.investor.location}</span>
                          <span>•</span>
                          <span>{investor.metrics.investments} investments</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Performance metrics */}
                  <div className="flex items-center space-x-6">
                    {/* Primary metric */}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatMetricValue(activeLeaderboard, investor.metrics.totalReturn || investor.metrics.portfolioValue || investor.metrics.consistency)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {leaderboardTypes.find(lt => lt.id === activeLeaderboard)?.metric}
                      </div>
                    </div>

                    {/* Trend indicator */}
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(investor.trend)}
                      <span className={`text-sm font-medium ${investor.trend === 'up' ? 'text-green-600' : investor.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                        {investor.change}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded metrics */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-white bg-opacity-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      +{investor.metrics.totalReturn.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-600">Total Return</div>
                  </div>
                  <div className="text-center p-3 bg-white bg-opacity-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">
                      ${investor.metrics.portfolioValue.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">Portfolio Value</div>
                  </div>
                  <div className="text-center p-3 bg-white bg-opacity-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">
                      {investor.metrics.consistency}
                    </div>
                    <div className="text-xs text-gray-600">Consistency</div>
                  </div>
                  <div className="text-center p-3 bg-white bg-opacity-50 rounded-lg">
                    <div className="text-lg font-bold text-orange-600">
                      {investor.metrics.riskScore}
                    </div>
                    <div className="text-xs text-gray-600">Risk Score</div>
                  </div>
                </div>

                {/* Achievement badges */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {investor.achievements.map((achievement, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full"
                    >
                      <Star className="w-3 h-3 mr-1" />
                      {achievement}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Community Stats */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Community Stats</h3>
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Investors</span>
              <span className="font-semibold text-gray-900">1,247</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active This Month</span>
              <span className="font-semibold text-green-600">892</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">New This Week</span>
              <span className="font-semibold text-blue-600">34</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg Portfolio</span>
              <span className="font-semibold text-purple-600">$87,450</span>
            </div>
          </div>
        </div>

        {/* Performance Benchmarks */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Benchmarks</h3>
            <BarChart3 className="w-6 h-6 text-green-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg Return</span>
              <span className="font-semibold text-green-600">+23.4%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Top 10% Threshold</span>
              <span className="font-semibold text-yellow-600">+65.0%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Best Performer</span>
              <span className="font-semibold text-purple-600">+89.7%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Platform ROI</span>
              <span className="font-semibold text-blue-600">+28.1%</span>
            </div>
          </div>
        </div>

        {/* Achievement Guide */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Achievement Levels</h3>
            <Gem className="w-6 h-6 text-purple-600" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Bronze</span>
              </div>
              <span className="text-xs text-gray-500">$1K+ invested</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Silver</span>
              </div>
              <span className="text-xs text-gray-500">$10K+ invested</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Gold</span>
              </div>
              <span className="text-xs text-gray-500">$50K+ invested</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Platinum</span>
              </div>
              <span className="text-xs text-gray-500">$100K+ invested</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Diamond</span>
              </div>
              <span className="text-xs text-gray-500">$250K+ invested</span>
            </div>
          </div>
        </div>
      </div>

      {/* Competition Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <Flame className="w-6 h-6 text-yellow-600 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Monthly Competition</h3>
            <p className="text-yellow-800 mb-3">
              Compete for the top spots and win exclusive rewards! Top 10 performers this month receive bonus FXCT tokens.
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Trophy className="w-4 h-4 text-yellow-600" />
                <span className="font-medium">1st Place: 1,000 FXCT</span>
              </div>
              <div className="flex items-center space-x-1">
                <Medal className="w-4 h-4 text-gray-500" />
                <span className="font-medium">2nd-3rd: 500 FXCT</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="w-4 h-4 text-orange-500" />
                <span className="font-medium">4th-10th: 250 FXCT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentLeaderboards;
