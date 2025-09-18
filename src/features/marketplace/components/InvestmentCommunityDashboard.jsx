import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users,
  Trophy,
  TrendingUp,
  Target,
  Star,
  Crown,
  Coins,
  Share2,
  MessageCircle,
  ThumbsUp,
  Eye,
  Award,
  Zap,
  Calendar,
  MapPin
} from 'lucide-react';

const InvestmentCommunityDashboard = () => {
  const [activeSection, setActiveSection] = useState('leaderboard');

  // Mock community data
  const [communityStats] = useState({
    totalMembers: 25847,
    activeToday: 2340,
    totalFXCTCommitted: 12500000,
    propertiesFunded: 156,
    avgMonthlyYield: 8.2
  });

  const [globalLeaderboard] = useState([
    {
      rank: 1,
      username: 'PropertyKing_ATX',
      avatar: '👑',
      totalInvested: 485000,
      monthlyIncome: 3920,
      properties: 28,
      badge: 'platinum',
      streak: 24,
      joinedDays: 180
    },
    {
      rank: 2,
      username: 'REITechGuru',
      avatar: '🎯',
      totalInvested: 412000,
      monthlyIncome: 3380,
      properties: 22,
      badge: 'gold',
      streak: 18,
      joinedDays: 145
    },
    {
      rank: 3,
      username: 'DiversifiedMaven',
      avatar: '📊',
      totalInvested: 395000,
      monthlyIncome: 3250,
      properties: 31,
      badge: 'gold',
      streak: 15,
      joinedDays: 200
    }
  ]);

  const [investmentGroups] = useState([
    {
      id: 1,
      name: 'Austin Tech Properties',
      members: 347,
      totalPooled: 125000,
      activeDeals: 8,
      avgYield: 9.2,
      description: 'Focus on tech hub properties with high growth potential',
      recentActivity: 'New deal: Downtown Austin Loft - 2h ago'
    },
    {
      id: 2,
      name: 'Houston Commercial Investors',
      members: 189,
      totalPooled: 89000,
      activeDeals: 5,
      avgYield: 11.5,
      description: 'Commercial real estate opportunities in Houston metro',
      recentActivity: 'Deal funded: Office Complex Phase 2 - 4h ago'
    },
    {
      id: 3,
      name: 'DeFi Real Estate Yield',
      members: 423,
      totalPooled: 210000,
      activeDeals: 12,
      avgYield: 7.8,
      description: 'Combining traditional real estate with DeFi strategies',
      recentActivity: 'Staking rewards distributed - 6h ago'
    }
  ]);

  const [featuredDiscussions] = useState([
    {
      id: 1,
      title: 'Austin Market Analysis: Is the Tech Hub Cooling?',
      author: 'MarketAnalyst_TX',
      replies: 23,
      likes: 45,
      lastActivity: '2h ago',
      category: 'Market Analysis'
    },
    {
      id: 2,
      title: 'FXST vs FXCT: Optimal Token Allocation Strategy',
      author: 'CryptoREITPro',
      replies: 31,
      likes: 67,
      lastActivity: '4h ago',
      category: 'Strategy'
    },
    {
      id: 3,
      title: 'Property Photography Tips for Better Listings',
      author: 'PropertyPhotoPro',
      replies: 18,
      likes: 29,
      lastActivity: '6h ago',
      category: 'Tips & Tricks'
    }
  ]);

  const [weeklyHighlights] = useState([
    {
      type: 'milestone',
      title: 'Community Milestone Reached!',
      description: '$2.5M in total FXCT commitments',
      icon: Trophy,
      color: 'yellow'
    },
    {
      type: 'new-member',
      title: '500+ New Investors This Week',
      description: 'Welcome to all our new community members',
      icon: Users,
      color: 'blue'
    },
    {
      type: 'funding',
      title: '3 Properties Successfully Funded',
      description: 'Moving from bidding to tokenization phase',
      icon: Target,
      color: 'green'
    }
  ]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Community Overview Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">FractionaX Investment Community</h1>
          <p className="text-purple-100 text-lg">
            Where smart investors build wealth together through fractional real estate
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{communityStats.totalMembers.toLocaleString()}</div>
            <div className="text-sm text-purple-100">Total Members</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{communityStats.activeToday.toLocaleString()}</div>
            <div className="text-sm text-purple-100">Active Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">${(communityStats.totalFXCTCommitted / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-purple-100">FXCT Committed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{communityStats.propertiesFunded}</div>
            <div className="text-sm text-purple-100">Properties Funded</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{communityStats.avgMonthlyYield}%</div>
            <div className="text-sm text-purple-100">Avg Monthly Yield</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {[
              { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
              { id: 'groups', label: 'Investment Groups', icon: Users },
              { id: 'discussions', label: 'Discussions', icon: MessageCircle },
              { id: 'highlights', label: 'Weekly Highlights', icon: Star }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeSection === tab.id 
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

        {/* Content Sections */}
        <div className="p-6">
          {activeSection === 'leaderboard' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-gray-900">Top Investors</h3>
                <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  This Month
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top 3 Podium */}
                <div className="lg:col-span-2 space-y-4">
                  {globalLeaderboard.map((investor) => (
                    <motion.div
                      key={investor.rank}
                      whileHover={{ scale: 1.02 }}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        investor.rank === 1 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300' :
                        investor.rank === 2 ? 'bg-gradient-to-r from-gray-50 to-blue-50 border-gray-300' :
                        investor.rank === 3 ? 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-300' :
                        'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold ${
                            investor.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                            investor.rank === 2 ? 'bg-gray-100 text-gray-700' :
                            investor.rank === 3 ? 'bg-orange-100 text-orange-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {investor.rank === 1 ? <Crown className="w-6 h-6" /> : investor.rank}
                          </div>
                          
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xl font-bold text-gray-900">{investor.username}</span>
                              <span className="text-lg">{investor.avatar}</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              Member for {investor.joinedDays} days • {investor.streak} day streak
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-xl font-bold text-green-600">
                            ${investor.monthlyIncome.toLocaleString()}/mo
                          </div>
                          <div className="text-sm text-gray-600">
                            ${investor.totalInvested.toLocaleString()} invested
                          </div>
                          <div className="text-xs text-blue-600">
                            {investor.properties} properties
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Leaderboard Categories */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Other Categories</h4>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-900">Most Active This Week</span>
                    </div>
                    <div className="text-lg font-bold text-green-700">CommunityBuilder_88</div>
                    <div className="text-sm text-green-600">23 bids placed</div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Share2 className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-900">Social Influencer</span>
                    </div>
                    <div className="text-lg font-bold text-blue-700">PropertySharer_Pro</div>
                    <div className="text-sm text-blue-600">89 shares this month</div>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-purple-900">Rising Star</span>
                    </div>
                    <div className="text-lg font-bold text-purple-700">NewInvestor_2024</div>
                    <div className="text-sm text-purple-600">+340% growth this month</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'groups' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-gray-900">Investment Groups</h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
                  Create Group
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {investmentGroups.map((group) => (
                  <motion.div
                    key={group.id}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
                      <h4 className="font-bold text-lg mb-1">{group.name}</h4>
                      <p className="text-blue-100 text-sm">{group.description}</p>
                    </div>
                    
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-xl font-bold text-blue-600">{group.members}</div>
                          <div className="text-xs text-gray-600">Members</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-green-600">${(group.totalPooled / 1000)}K</div>
                          <div className="text-xs text-gray-600">Pooled</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-purple-600">{group.activeDeals}</div>
                          <div className="text-xs text-gray-600">Active Deals</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-orange-600">{group.avgYield}%</div>
                          <div className="text-xs text-gray-600">Avg Yield</div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="text-xs text-gray-500 mb-1">Recent Activity:</div>
                        <div className="text-sm text-gray-700">{group.recentActivity}</div>
                      </div>
                      
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                        Join Group
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'discussions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-gray-900">Community Discussions</h3>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">
                  New Post
                </button>
              </div>

              <div className="space-y-4">
                {featuredDiscussions.map((discussion) => (
                  <motion.div
                    key={discussion.id}
                    whileHover={{ x: 5 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                            {discussion.category}
                          </span>
                          <span className="text-sm text-gray-500">{discussion.lastActivity}</span>
                        </div>
                        
                        <h4 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                          {discussion.title}
                        </h4>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>by {discussion.author}</span>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{discussion.replies} replies</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{discussion.likes} likes</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'highlights' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900">This Week's Highlights</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {weeklyHighlights.map((highlight, index) => {
                  const Icon = highlight.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-gradient-to-br rounded-lg p-6 text-center border-2 ${
                        highlight.color === 'yellow' ? 'from-yellow-50 to-orange-50 border-yellow-300' :
                        highlight.color === 'blue' ? 'from-blue-50 to-indigo-50 border-blue-300' :
                        'from-green-50 to-emerald-50 border-green-300'
                      }`}
                    >
                      <Icon className={`w-12 h-12 mx-auto mb-4 ${
                        highlight.color === 'yellow' ? 'text-yellow-600' :
                        highlight.color === 'blue' ? 'text-blue-600' :
                        'text-green-600'
                      }`} />
                      <h4 className="font-bold text-gray-900 mb-2">{highlight.title}</h4>
                      <p className="text-gray-600 text-sm">{highlight.description}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Weekly Challenge */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-orange-900">Weekly Community Challenge</h4>
                  <div className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
                    3 days left
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-orange-800 mb-2">🎯 Target: Fund 5 New Properties</h5>
                    <p className="text-sm text-orange-700 mb-3">
                      Help the community reach funding targets on 5 properties this week.
                    </p>
                    <div className="bg-white rounded-lg p-3">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress: 3/5 Properties</span>
                        <span>60%</span>
                      </div>
                      <div className="w-full bg-orange-100 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '60%' }} />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-orange-800 mb-2">🏆 Community Reward Pool</h5>
                    <div className="text-2xl font-bold text-orange-700 mb-2">25,000 FXCT</div>
                    <p className="text-sm text-orange-700">
                      Split among all participants based on contribution
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestmentCommunityDashboard;
