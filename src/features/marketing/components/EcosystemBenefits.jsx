import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Wallet, 
  TrendingUp, 
  Droplets, 
  Bot, 
  Layers, 
  Globe, 
  Building, 
  Shield,
  ChevronRight,
  Play,
  Pause
} from 'lucide-react';

export default function EcosystemBenefits() {
  const [activeTab, setActiveTab] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [platformStats, setPlatformStats] = useState({
    totalValueLocked: '0',
    totalUsers: '0',
    totalProperties: '0',
    loading: true
  });

  const ecosystemCategories = [
    {
      id: 'community-bidding',
      name: 'Community Bidding',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-blue-600 to-cyan-600',
      benefits: [
        {
          title: "Signal Market Demand with FXCT",
          description: "Use FXCT tokens to bid on properties and signal community interest. When bids reach 50% of property value, our team negotiates with sellers.",
          icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
          highlight: "Community-driven acquisitions"
        },
        {
          title: "Bidding Rewards & Refunds",
          description: "Earn 5-10% bonus FXCT refunds on successful bids, plus priority access to FXST security tokens for actual ownership.",
          icon: <Droplets className="w-8 h-8 text-blue-600" />,
          highlight: "5-10% bonus rewards"
        }
      ]
    },
    {
      id: 'ai-powered',
      name: 'AI Property Research',
      icon: <Bot className="w-6 h-6" />,
      color: 'from-purple-600 to-pink-600',
      benefits: [
        {
          title: "AI-Research Tool for Property Analysis",
          description: "Get instant, comprehensive analysis for specific property addresses including market data, comparable sales, and investment scoring.",
          icon: <Bot className="w-8 h-8 text-purple-600" />,
          highlight: "Address-specific insights"
        },
        {
          title: "Smart Property Discovery",
          description: "AI discovers high-potential properties before they hit the market, giving community members first access to exclusive opportunities.",
          icon: <Shield className="w-8 h-8 text-purple-600" />,
          highlight: "Off-market opportunities"
        }
      ]
    },
    {
      id: 'fractional-ownership',
      name: 'Fractional Ownership',
      icon: <Building className="w-6 h-6" />,
      color: 'from-green-600 to-emerald-600',
      benefits: [
        {
          title: "FXST Security Token Ownership",
          description: "Own legal fractional shares in real estate through FXST security tokens, earning monthly dividends from rental income and appreciation.",
          icon: <Building className="w-8 h-8 text-green-600" />,
          highlight: "Legal fractional ownership"
        },
        {
          title: "Low Barrier to Entry",
          description: "Start investing in real estate with as little as $50, compared to traditional $50,000+ down payments for whole properties.",
          icon: <Wallet className="w-8 h-8 text-green-600" />,
          highlight: "$50 minimum investment"
        }
      ]
    },
    {
      id: 'token-ecosystem',
      name: 'Token Ecosystem',
      icon: <Layers className="w-6 h-6" />,
      color: 'from-orange-600 to-red-600',
      benefits: [
        {
          title: "FXCT Staking & DeFi Integration",
          description: "Stake unused FXCT tokens for 5-10% APY through our platform or integrated DeFi protocols like Aave and Compound.",
          icon: <Layers className="w-8 h-8 text-orange-600" />,
          highlight: "5-10% staking APY"
        },
        {
          title: "Master FXST Platform Rewards",
          description: "FXST holders automatically receive Master FXST tokens for platform-wide rewards, governance voting, and exclusive perks.",
          icon: <Globe className="w-8 h-8 text-orange-600" />,
          highlight: "Automatic reward tokens"
        }
      ]
    }
  ];

  // Fetch real platform statistics
  useEffect(() => {
    const fetchPlatformStats = async () => {
      try {
        const response = await fetch('/api/homepage/stats');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            const { marketStats, communityStats, protocolStats } = data.data;
            
            // Format numbers for display
            const formatValue = (value, prefix = '') => {
              if (value >= 1000000) {
                return `${prefix}${(value / 1000000).toFixed(1)}M`;
              } else if (value >= 1000) {
                return `${prefix}${(value / 1000).toFixed(1)}K`;
              }
              return `${prefix}${value}`;
            };
            
            setPlatformStats({
              totalValueLocked: formatValue(protocolStats?.totalValueLocked || 0, '$'),
              totalUsers: formatValue(communityStats?.totalUsers || 0),
              totalProperties: formatValue(marketStats?.totalProperties || 0),
              loading: false
            });
          }
        } else {
          // Fallback to "Coming Soon" if API fails
          setPlatformStats({
            totalValueLocked: 'Coming Soon',
            totalUsers: 'Coming Soon',
            totalProperties: 'Coming Soon',
            loading: false
          });
        }
      } catch (error) {
        console.log('Platform stats unavailable, showing Coming Soon');
        setPlatformStats({
          totalValueLocked: 'Coming Soon',
          totalUsers: 'Coming Soon', 
          totalProperties: 'Coming Soon',
          loading: false
        });
      }
    };
    
    fetchPlatformStats();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % ecosystemCategories.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, ecosystemCategories.length]);

  const currentCategory = ecosystemCategories[activeTab];

  return (
    <section className="bg-gray-200 py-20 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            🏠 Fractional Real Estate Ecosystem Benefits
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Being inside the FractionaX ecosystem unlocks community-driven property acquisition, 
            AI-powered research tools, fractional ownership opportunities, and token-based rewards that traditional real estate platforms can't match.
          </p>
        </div>

        {/* Interactive Tabs */}
        <div className="flex justify-center space-x-2 mb-10 flex-wrap">
          {ecosystemCategories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveTab(index);
                setIsAutoPlaying(false);
              }}
              className={`flex items-center gap-2 px-4 py-3 rounded-full border text-sm font-medium transition-all duration-300 mb-2
                ${
                  activeTab === index
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-105"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                }
              `}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
          
          {/* Auto-play control */}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="flex items-center gap-2 px-4 py-3 rounded-full border bg-gray-800 text-white hover:bg-gray-700 transition-all text-sm font-medium mb-2"
          >
            {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isAutoPlaying ? 'Pause' : 'Auto'}
          </button>
        </div>

        {/* Main Content Grid - Fixed Heights */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Category Header & Stats */}
          <div>
            {/* Fixed Height Container for Header */}
            <div className="relative mb-6" style={{ height: '240px' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`absolute inset-0 bg-gradient-to-r ${currentCategory.color} p-8 rounded-2xl text-white`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/20 rounded-lg">
                      {currentCategory.icon}
                    </div>
                    <h3 className="text-2xl font-bold">{currentCategory.name}</h3>
                  </div>
                  
                  {/* Progress indicator */}
                  <div className="flex gap-1 mb-6">
                    {ecosystemCategories.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          index === activeTab ? 'bg-white' : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <p className="text-white/90 leading-relaxed">
                    Explore our {currentCategory.name.toLowerCase()} capabilities and see how they can transform your investment strategy.
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Key Stats for Active Category */}
            <motion.div
              key={`stats-${activeTab}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="bg-white p-6 rounded-2xl shadow-md border"
            >
              <h4 className="font-semibold text-gray-900 mb-4 text-center">Platform Metrics</h4>
              {platformStats.loading ? (
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-400 animate-pulse">Loading...</div>
                    <div className="text-xs text-gray-600">Total Value Locked</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-400 animate-pulse">Loading...</div>
                    <div className="text-xs text-gray-600">Community Members</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-400 animate-pulse">Loading...</div>
                    <div className="text-xs text-gray-600">Listed Properties</div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className={`text-2xl font-bold ${
                      platformStats.totalValueLocked === 'Coming Soon' ? 'text-gray-500 text-sm' : 'text-blue-600'
                    }`}>
                      {platformStats.totalValueLocked}
                    </div>
                    <div className="text-xs text-gray-600">Total Value Locked</div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${
                      platformStats.totalUsers === 'Coming Soon' ? 'text-gray-500 text-sm' : 'text-green-600'
                    }`}>
                      {platformStats.totalUsers}
                    </div>
                    <div className="text-xs text-gray-600">Community Members</div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${
                      platformStats.totalProperties === 'Coming Soon' ? 'text-gray-500 text-sm' : 'text-purple-600'
                    }`}>
                      {platformStats.totalProperties}
                    </div>
                    <div className="text-xs text-gray-600">Listed Properties</div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Side - Benefits Cards with Fixed Container Height */}
          <div className="relative" style={{ minHeight: '600px' }}>
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {currentCategory.benefits.map((benefit, benefitIndex) => (
                  <motion.div
                    key={`${activeTab}-${benefitIndex}`}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ delay: benefitIndex * 0.1, duration: 0.3 }}
                    className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group cursor-pointer"
                    onMouseEnter={() => setHoveredCard(`${activeTab}-${benefitIndex}`)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gray-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        {benefit.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {benefit.title}
                        </h4>
                        <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-lg font-medium border border-blue-200 mb-3">
                          {benefit.highlight}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
            {/* Background animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 hover:opacity-100 transition-opacity duration-500" />
            
            <h3 className="text-2xl font-bold mb-4 relative z-10">
              Ready to Start Fractional Real Estate Investing?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto relative z-10">
              Join our community of investors building wealth through fractional property ownership, AI research, and community bidding
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link to="/pricing">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
                >
                  View Membership Plans
                </motion.button>
              </Link>
              <Link to="/token-ecosystem">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Explore Ecosystem
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
