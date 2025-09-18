import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Heart,
  MessageCircle,
  Share2,
  Send,
  Image,
  Video,
  MapPin,
  MoreHorizontal,
  Bookmark,
  TrendingUp,
  Building,
  DollarSign,
  Calendar,
  Eye,
  Filter,
  Search,
  Globe,
  Lock,
  UserCheck,
  Star,
  Flag,
  Edit3,
  Trash2,
  X,
  ArrowUp,
  ArrowDown,
  Repeat,
  ExternalLink,
  Camera,
  Mic,
  Smile,
  Hash,
  AtSign,
  Link,
  Clock,
  ChevronDown,
  ChevronUp,
  Reply,
  Quote,
  Copy,
  Verified,
  Award,
  TrendingDown,
  Activity,
  Zap,
  Flame,
  Target
} from 'lucide-react';
import { SEO } from '../../../shared/components';
import { generatePageSEO } from '../../../shared/utils';

export default function CustomerCommunications() {
  const seoData = generatePageSEO({
    title: 'Communications - FractionaX',
    description: 'Connect with other investors, share property insights, and stay updated on investment opportunities in the FractionaX community.',
    url: '/dashboard/communications',
    keywords: ['communications', 'social feed', 'property investment', 'community', 'investor network']
  });

  // State management
  const [activeTab, setActiveTab] = useState('feed');
  const [newPostContent, setNewPostContent] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postVisibility, setPostVisibility] = useState('public');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Mock user data
  const currentUser = {
    id: 1,
    name: 'Lorenzo Martinez',
    avatar: '/api/placeholder/40/40',
    role: 'Premium Investor',
    verified: true,
    totalInvestments: 15,
    portfolioValue: 125000
  };

  // Mock posts data
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: {
        id: 2,
        name: 'Sarah Johnson',
        avatar: '/api/placeholder/40/40',
        role: 'Real Estate Expert',
        verified: true
      },
      content: 'Just closed on a fantastic downtown apartment complex! 🏢 The ROI projections are looking amazing - 12% annual return expected. The location is prime with great walkability scores and growing tech sector nearby.',
      property: {
        id: 101,
        name: 'Metropolitan Heights',
        location: 'Downtown Seattle, WA',
        image: '/api/placeholder/300/200',
        price: 850000,
        expectedReturn: 12,
        tokenized: true
      },
      timestamp: '2024-08-29T14:30:00Z',
      likes: 24,
      comments: 8,
      shares: 3,
      isLiked: false,
      isBookmarked: false,
      visibility: 'public'
    },
    {
      id: 2,
      user: {
        id: 3,
        name: 'Michael Chen',
        avatar: '/api/placeholder/40/40',
        role: 'Portfolio Manager',
        verified: true
      },
      content: 'Market update: The residential sector is showing strong growth this quarter! 📈 I\'m seeing consistent 8-10% returns across my portfolio. What are you all seeing in your markets?',
      timestamp: '2024-08-29T11:15:00Z',
      likes: 45,
      comments: 12,
      shares: 7,
      isLiked: true,
      isBookmarked: true,
      visibility: 'public'
    },
    {
      id: 3,
      user: {
        id: 4,
        name: 'Emma Rodriguez',
        avatar: '/api/placeholder/40/40',
        role: 'New Investor',
        verified: false
      },
      content: 'First time investing in fractional real estate! 🎉 Thanks to everyone in this community for the amazing advice. Started with a small position in a Miami beachfront property.',
      property: {
        id: 102,
        name: 'Ocean View Residences',
        location: 'Miami Beach, FL',
        image: '/api/placeholder/300/200',
        price: 1200000,
        expectedReturn: 9.5,
        tokenized: true
      },
      timestamp: '2024-08-29T09:45:00Z',
      likes: 18,
      comments: 15,
      shares: 2,
      isLiked: false,
      isBookmarked: false,
      visibility: 'public'
    },
    {
      id: 4,
      user: {
        id: 5,
        name: 'David Kumar',
        avatar: '/api/placeholder/40/40',
        role: 'Investment Advisor',
        verified: true
      },
      content: 'PSA: Remember to diversify your portfolio! 💡 I recommend no more than 20% in any single property type. Geographic diversification is just as important as asset class diversification.',
      timestamp: '2024-08-28T16:20:00Z',
      likes: 67,
      comments: 23,
      shares: 15,
      isLiked: true,
      isBookmarked: true,
      visibility: 'public'
    }
  ]);

  // Mock available properties for sharing
  const availableProperties = [
    { id: 101, name: 'Metropolitan Heights', location: 'Seattle, WA', price: 850000 },
    { id: 102, name: 'Ocean View Residences', location: 'Miami Beach, FL', price: 1200000 },
    { id: 103, name: 'Urban Lofts', location: 'Austin, TX', price: 650000 },
    { id: 104, name: 'Garden Apartments', location: 'Portland, OR', price: 720000 }
  ];

  // Mock trending topics
  const trendingTopics = [
    { topic: '#SeattleRealEstate', posts: 45 },
    { topic: '#MiamiInvestment', posts: 38 },
    { topic: '#ROIAnalysis', posts: 29 },
    { topic: '#PropertyDiversification', posts: 22 },
    { topic: '#CommercialProperties', posts: 18 }
  ];

  // Handle post creation
  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    const newPost = {
      id: Date.now(),
      user: currentUser,
      content: newPostContent,
      property: selectedProperty,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isBookmarked: false,
      visibility: postVisibility
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setSelectedProperty(null);
    setShowCreatePost(false);
  };

  // Handle like/unlike
  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked 
          }
        : post
    ));
  };

  // Handle bookmark
  const handleBookmark = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  // Format time ago
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <SEO {...seoData} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Users className="w-8 h-8 text-blue-600" />
            <span>Community Feed</span>
          </h1>
          <p className="text-gray-600 mt-2">Connect with fellow investors and share property insights</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search posts..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-150">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar - User Profile & Trending */}
        <div className="lg:col-span-1 space-y-6">
          {/* User Profile Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">{currentUser.name[0]}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900">{currentUser.name}</h3>
                  {currentUser.verified && <UserCheck className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-sm text-gray-600">{currentUser.role}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Investments</span>
                <span className="font-semibold">{currentUser.totalInvestments}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Portfolio Value</span>
                <span className="font-semibold">{formatCurrency(currentUser.portfolioValue)}</span>
              </div>
            </div>
          </div>

          {/* Trending Topics */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <span>Trending</span>
            </h3>
            <div className="space-y-3">
              {trendingTopics.map((trend, index) => (
                <div key={index} className="flex justify-between items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
                  <span className="text-blue-600 font-medium">{trend.topic}</span>
                  <span className="text-sm text-gray-500">{trend.posts} posts</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">{currentUser.name[0]}</span>
              </div>
              <button
                onClick={() => setShowCreatePost(true)}
                className="flex-1 text-left px-4 py-3 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100 transition-colors duration-150"
              >
                Share your investment insights...
              </button>
            </div>

            {showCreatePost && (
              <div className="mt-4 space-y-4">
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="What's happening with your investments?"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-32 resize-none"
                />
                
                {/* Property Selection */}
                {selectedProperty && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{selectedProperty.name}</h4>
                        <p className="text-sm text-gray-600">{selectedProperty.location}</p>
                      </div>
                      <button
                        onClick={() => setSelectedProperty(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Post Options */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                      <Image className="w-5 h-5" />
                      <span className="text-sm">Photo</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                      <Building className="w-5 h-5" />
                      <span className="text-sm">Property</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                      <MapPin className="w-5 h-5" />
                      <span className="text-sm">Location</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-3">
                    <select
                      value={postVisibility}
                      onChange={(e) => setPostVisibility(e.target.value)}
                      className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="public">🌍 Public</option>
                      <option value="investors">👥 Investors Only</option>
                      <option value="private">🔒 Private</option>
                    </select>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowCreatePost(false)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreatePost}
                        disabled={!newPostContent.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-150"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl border border-gray-200 p-6">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{post.user.name[0]}</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900">{post.user.name}</h4>
                        {post.user.verified && <UserCheck className="w-4 h-4 text-blue-600" />}
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{formatTimeAgo(post.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-600">{post.user.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {post.visibility === 'public' && <Globe className="w-4 h-4 text-gray-400" />}
                    {post.visibility === 'investors' && <Users className="w-4 h-4 text-blue-400" />}
                    {post.visibility === 'private' && <Lock className="w-4 h-4 text-red-400" />}
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
                </div>

                {/* Property Card (if attached) */}
                {post.property && (
                  <div className="mb-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                          <Building className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900">{post.property.name}</h5>
                          <p className="text-sm text-gray-600 flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{post.property.location}</span>
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm font-semibold text-green-600">
                              {formatCurrency(post.property.price)}
                            </span>
                            <span className="text-sm text-gray-600">
                              {post.property.expectedReturn}% ROI
                            </span>
                          </div>
                        </div>
                      </div>
                      {post.property.tokenized && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Tokenized
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-2 transition-colors duration-150 ${
                        post.isLiked 
                          ? 'text-red-600 hover:text-red-700' 
                          : 'text-gray-500 hover:text-red-600'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors duration-150">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-colors duration-150">
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm">{post.shares}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleBookmark(post.id)}
                    className={`transition-colors duration-150 ${
                      post.isBookmarked 
                        ? 'text-yellow-600 hover:text-yellow-700' 
                        : 'text-gray-400 hover:text-yellow-600'
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar - Suggestions & Activity */}
        <div className="lg:col-span-1 space-y-6">
          {/* Suggested Connections */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Suggested Connections</h3>
            <div className="space-y-4">
              {[
                { name: 'Alex Thompson', role: 'Commercial Real Estate Expert', mutual: 3 },
                { name: 'Lisa Park', role: 'Investment Analyst', mutual: 7 },
                { name: 'James Wilson', role: 'Portfolio Manager', mutual: 2 }
              ].map((user, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{user.name[0]}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{user.name}</h4>
                      <p className="text-xs text-gray-600">{user.mutual} mutual connections</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700 transition-colors duration-150">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Eye className="w-5 h-5 text-gray-600" />
              <span>Recent Activity</span>
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-900">Sarah Johnson</span> liked your post about downtown investments
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-900">Michael Chen</span> shared your portfolio analysis
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                <p className="text-gray-600">
                  New property available: <span className="font-semibold text-gray-900">Austin Tech Hub</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
