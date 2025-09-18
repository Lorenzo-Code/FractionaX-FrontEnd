import React, { useState, useEffect } from 'react';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Clock,
  DollarSign,
  MapPin,
  Building,
  Star,
  Award,
  Zap,
  Flame,
  ThumbsUp,
  Bookmark,
  MoreHorizontal,
  Filter,
  RefreshCw
} from 'lucide-react';

const InvestorSocialFeed = ({ currentUser }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [feedData, setFeedData] = useState([]);

  // Mock social feed data
  const mockFeedData = [
    {
      id: 1,
      type: 'investment',
      timestamp: '2024-08-25T14:30:00Z',
      investor: {
        id: 'inv_123',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=investor1',
        displayName: 'Investor_TX_Pro',
        level: 'Gold',
        totalInvestments: 12,
        joinDate: '2023-06-15',
        location: 'Texas'
      },
      property: {
        id: 'prop_456',
        name: 'Luxury Downtown Condo',
        location: 'Austin, TX',
        propertyType: 'Residential',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop',
        price: 485000,
        expectedReturn: 18.5,
        riskLevel: 'Medium'
      },
      investment: {
        amount: 25000,
        percentage: 5.2,
        timeAgo: '2 hours ago'
      },
      engagement: {
        likes: 23,
        comments: 7,
        shares: 3,
        views: 156
      },
      trending: true,
      featured: false
    },
    {
      id: 2,
      type: 'milestone',
      timestamp: '2024-08-25T12:15:00Z',
      investor: {
        id: 'inv_789',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=investor2',
        displayName: 'Miami_REI_Expert',
        level: 'Platinum',
        totalInvestments: 28,
        joinDate: '2022-11-20',
        location: 'Florida'
      },
      milestone: {
        type: 'portfolio_milestone',
        description: 'Reached $100k portfolio value',
        achievement: 'Six Figure Investor',
        timeAgo: '4 hours ago'
      },
      engagement: {
        likes: 89,
        comments: 15,
        shares: 12,
        views: 445
      },
      trending: false,
      featured: true
    },
    {
      id: 3,
      type: 'success_story',
      timestamp: '2024-08-25T09:45:00Z',
      investor: {
        id: 'inv_101',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=investor3',
        displayName: 'Phoenix_Growth_Seeker',
        level: 'Silver',
        totalInvestments: 8,
        joinDate: '2023-01-10',
        location: 'Arizona'
      },
      story: {
        title: 'From $5k to $15k in 8 months',
        returnPercentage: 200,
        strategy: 'Diversified across 3 states',
        timeAgo: '7 hours ago'
      },
      engagement: {
        likes: 156,
        comments: 32,
        shares: 18,
        views: 723
      },
      trending: true,
      featured: true
    },
    {
      id: 4,
      type: 'discussion',
      timestamp: '2024-08-25T08:20:00Z',
      investor: {
        id: 'inv_202',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=investor4',
        displayName: 'Dallas_Property_Guru',
        level: 'Gold',
        totalInvestments: 15,
        joinDate: '2023-03-08',
        location: 'Texas'
      },
      discussion: {
        title: 'Market outlook for Q4 2024',
        excerpt: 'Based on recent Fed announcements and housing data, I think we might see some interesting opportunities...',
        replies: 24,
        timeAgo: '8 hours ago'
      },
      engagement: {
        likes: 67,
        comments: 24,
        shares: 9,
        views: 298
      },
      trending: false,
      featured: false
    },
    {
      id: 5,
      type: 'portfolio_update',
      timestamp: '2024-08-24T16:30:00Z',
      investor: {
        id: 'inv_303',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=investor5',
        displayName: 'Diversification_Master',
        level: 'Diamond',
        totalInvestments: 35,
        joinDate: '2022-08-15',
        location: 'California'
      },
      portfolio: {
        description: 'Achieved perfect diversification score',
        diversificationScore: 95,
        newPropertyType: 'Industrial',
        timeAgo: '1 day ago'
      },
      engagement: {
        likes: 134,
        comments: 28,
        shares: 22,
        views: 567
      },
      trending: true,
      featured: false
    }
  ];

  useEffect(() => {
    setFeedData(mockFeedData);
  }, []);

  const feedFilters = [
    { id: 'all', name: 'All Activity', icon: Activity },
    { id: 'investments', name: 'New Investments', icon: DollarSign },
    { id: 'milestones', name: 'Milestones', icon: Award },
    { id: 'discussions', name: 'Discussions', icon: MessageCircle },
    { id: 'trending', name: 'Trending', icon: Flame }
  ];

  const filteredFeed = feedData.filter(item => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'investments') return item.type === 'investment';
    if (activeFilter === 'milestones') return item.type === 'milestone';
    if (activeFilter === 'discussions') return item.type === 'discussion';
    if (activeFilter === 'trending') return item.trending;
    return true;
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handleEngagement = (itemId, action) => {
    console.log(`${action} on item ${itemId}`);
    // Update engagement counts
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

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'High': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const renderFeedItem = (item) => {
    switch (item.type) {
      case 'investment':
        return (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img 
                  src={item.investor.avatar} 
                  alt={item.investor.displayName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{item.investor.displayName}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getInvestorLevelColor(item.investor.level)}`}>
                      {item.investor.level}
                    </span>
                    {item.trending && <Flame className="w-4 h-4 text-orange-500" />}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span>{item.investor.location}</span>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(item.timestamp)}</span>
                  </div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal size={20} />
              </button>
            </div>

            {/* Investment Content */}
            <div className="mb-4">
              <p className="text-gray-700 mb-3">
                Invested <span className="font-semibold text-green-600">${item.investment.amount.toLocaleString()}</span> in
              </p>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex">
                  <img 
                    src={item.property.image} 
                    alt={item.property.name}
                    className="w-24 h-24 object-cover"
                  />
                  <div className="flex-1 p-4">
                    <h3 className="font-medium text-gray-900">{item.property.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                      <MapPin className="w-3 h-3" />
                      <span>{item.property.location}</span>
                      <span>•</span>
                      <Building className="w-3 h-3" />
                      <span>{item.property.propertyType}</span>
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-green-600 font-medium">
                        {item.property.expectedReturn}% expected return
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskLevelColor(item.property.riskLevel)}`}>
                        {item.property.riskLevel} Risk
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Engagement */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-6">
                <button 
                  onClick={() => handleEngagement(item.id, 'like')}
                  className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <Heart size={16} />
                  <span className="text-sm">{item.engagement.likes}</span>
                </button>
                <button 
                  onClick={() => handleEngagement(item.id, 'comment')}
                  className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
                >
                  <MessageCircle size={16} />
                  <span className="text-sm">{item.engagement.comments}</span>
                </button>
                <button 
                  onClick={() => handleEngagement(item.id, 'share')}
                  className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors"
                >
                  <Share2 size={16} />
                  <span className="text-sm">{item.engagement.shares}</span>
                </button>
              </div>
              <div className="flex items-center space-x-1 text-gray-400 text-sm">
                <Eye size={14} />
                <span>{item.engagement.views}</span>
              </div>
            </div>
          </div>
        );

      case 'milestone':
        return (
          <div key={item.id} className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow-sm border border-yellow-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img 
                  src={item.investor.avatar} 
                  alt={item.investor.displayName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{item.investor.displayName}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getInvestorLevelColor(item.investor.level)}`}>
                      {item.investor.level}
                    </span>
                    <Award className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span>{item.investor.location}</span>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(item.timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.milestone.achievement}</h3>
                  <p className="text-gray-600">{item.milestone.description}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-yellow-200">
              <div className="flex items-center space-x-6">
                <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
                  <Heart size={16} />
                  <span className="text-sm">{item.engagement.likes}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
                  <MessageCircle size={16} />
                  <span className="text-sm">{item.engagement.comments}</span>
                </button>
              </div>
              <div className="flex items-center space-x-1 text-gray-400 text-sm">
                <Eye size={14} />
                <span>{item.engagement.views}</span>
              </div>
            </div>
          </div>
        );

      case 'success_story':
        return (
          <div key={item.id} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img 
                  src={item.investor.avatar} 
                  alt={item.investor.displayName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{item.investor.displayName}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getInvestorLevelColor(item.investor.level)}`}>
                      {item.investor.level}
                    </span>
                    <Star className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(item.timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{item.story.title}</h3>
                <span className="text-2xl font-bold text-green-600">+{item.story.returnPercentage}%</span>
              </div>
              <p className="text-gray-600 text-sm">{item.story.strategy}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-green-200">
              <div className="flex items-center space-x-6">
                <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
                  <Heart size={16} />
                  <span className="text-sm">{item.engagement.likes}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
                  <MessageCircle size={16} />
                  <span className="text-sm">{item.engagement.comments}</span>
                </button>
              </div>
              <div className="flex items-center space-x-1 text-gray-400 text-sm">
                <Eye size={14} />
                <span>{item.engagement.views}</span>
              </div>
            </div>
          </div>
        );

      case 'discussion':
        return (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img 
                  src={item.investor.avatar} 
                  alt={item.investor.displayName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{item.investor.displayName}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getInvestorLevelColor(item.investor.level)}`}>
                      {item.investor.level}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(item.timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">{item.discussion.title}</h3>
              <p className="text-gray-600">{item.discussion.excerpt}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-6">
                <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
                  <Heart size={16} />
                  <span className="text-sm">{item.engagement.likes}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
                  <MessageCircle size={16} />
                  <span className="text-sm">{item.discussion.replies} replies</span>
                </button>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Join Discussion
              </button>
            </div>
          </div>
        );

      case 'portfolio_update':
        return (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img 
                  src={item.investor.avatar} 
                  alt={item.investor.displayName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{item.investor.displayName}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getInvestorLevelColor(item.investor.level)}`}>
                      {item.investor.level}
                    </span>
                    {item.trending && <Zap className="w-4 h-4 text-blue-500" />}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(item.timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.portfolio.description}</h3>
                  <p className="text-sm text-gray-600">Added {item.portfolio.newPropertyType} to portfolio</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{item.portfolio.diversificationScore}</div>
                  <div className="text-xs text-gray-500">Diversification Score</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-6">
                <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
                  <Heart size={16} />
                  <span className="text-sm">{item.engagement.likes}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
                  <MessageCircle size={16} />
                  <span className="text-sm">{item.engagement.comments}</span>
                </button>
              </div>
              <div className="flex items-center space-x-1 text-gray-400 text-sm">
                <Eye size={14} />
                <span>{item.engagement.views}</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-600" />
            Investor Community
          </h2>
          <p className="text-gray-600">See what other investors are doing on FractionaX</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="flex overflow-x-auto">
          {feedFilters.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveFilter(id)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                activeFilter === id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon size={16} />
              <span>{name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Social Feed */}
      <div className="space-y-4">
        {filteredFeed.length > 0 ? (
          filteredFeed.map(renderFeedItem)
        ) : (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No activity found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more investor activity.</p>
          </div>
        )}
      </div>

      {/* Load More */}
      <div className="text-center">
        <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
          Load More Activity
        </button>
      </div>
    </div>
  );
};

export default InvestorSocialFeed;
