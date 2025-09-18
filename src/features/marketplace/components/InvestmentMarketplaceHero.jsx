import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Coins,
  ArrowRight,
  Target,
  Award,
  PieChart
} from 'lucide-react';
import { useHomepageDisplay } from '../../../hooks/useHomepageData';
import { LiveDataIndicator } from '../../../shared/components';

const InvestmentMarketplaceHero = ({ onStartBidding, onExploreProperties }) => {
  const [activeStats, setActiveStats] = useState(0);
  
  // Get live homepage data
  const { 
    marketStats, 
    communityStats, 
    loading, 
    isLiveData 
  } = useHomepageDisplay();

  const marketplaceStats = [
    { label: 'Active Investors', value: loading ? '...' : marketStats.totalInvestorsFormatted || '25,847', icon: Users, color: 'blue' },
    { label: 'Properties Available', value: loading ? '...' : marketStats.totalListings?.toString() || '156', icon: Target, color: 'green' },
    { label: 'Total Volume', value: loading ? '...' : marketStats.totalVolumeFormatted || '2.1M', icon: Coins, color: 'orange' },
    { label: 'Avg ROI', value: loading ? '...' : marketStats.averageRoiFormatted || '8.2%', icon: TrendingUp, color: 'purple' }
  ];

  const featuredOpportunities = [
    {
      title: 'Austin Tech Hub Condo',
      location: 'Austin, TX',
      fxctCommitted: '12,500',
      investorsCount: 45,
      targetThreshold: '15,000',
      progressPercent: 83,
      yieldEstimate: '9.2%',
      status: 'Hot'
    },
    {
      title: 'Dallas Suburban Family Home',
      location: 'Dallas, TX', 
      fxctCommitted: '8,200',
      investorsCount: 32,
      targetThreshold: '10,000',
      progressPercent: 82,
      yieldEstimate: '7.8%',
      status: 'Active'
    },
    {
      title: 'Houston Commercial Plaza',
      location: 'Houston, TX',
      fxctCommitted: '22,100',
      investorsCount: 67,
      targetThreshold: '25,000',
      progressPercent: 88,
      yieldEstimate: '11.5%',
      status: 'Almost Funded'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStats((prev) => (prev + 1) % marketplaceStats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Main Value Prop */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold">
                🔥 Live Investment Opportunities
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                Own Real Estate 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                  {" "}Starting at $100
                </span>
              </h1>
              
              <p className="text-xl text-blue-100 leading-relaxed">
                Join our community of investors building wealth through fractional property ownership. 
                Bid with FXCT tokens, earn rewards, and own real assets.
              </p>

              {/* Key Value Points */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <span className="text-lg">Start investing with just $100</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-lg">Community-driven property validation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-lg">Earn rewards for participation</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={onStartBidding}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  Start Bidding
                  <Coins className="w-5 h-5" />
                </button>
                <button
                  onClick={onExploreProperties}
                  className="flex-1 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white hover:bg-white/20 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Explore Properties
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Live Stats & Opportunities */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-6">
              {/* Rotating Stats */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xl font-semibold">Live Marketplace Activity</h3>
                  <LiveDataIndicator 
                    isLive={isLiveData.marketStats} 
                    size="sm" 
                    lastUpdated={marketStats.lastUpdated}
                    className="bg-white/20 border-white/30 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {marketplaceStats.map((stat, index) => {
                    const Icon = stat.icon;
                    const isActive = activeStats === index;
                    return (
                      <motion.div
                        key={index}
                        className={`p-3 rounded-lg transition-all ${
                          isActive ? 'bg-white/20 scale-105' : 'bg-white/5'
                        }`}
                        animate={{ scale: isActive ? 1.05 : 1 }}
                      >
                        <Icon className={`w-6 h-6 text-${stat.color}-400 mb-2`} />
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-sm text-blue-200">{stat.label}</div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Hot Investment Opportunities */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Hot Opportunities</h3>
                  <span className="text-sm text-green-300 font-medium">Live Updates</span>
                </div>
                
                <div className="space-y-4">
                  {featuredOpportunities.slice(0, 3).map((opportunity, index) => (
                    <div key={index} className="bg-white/10 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{opportunity.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          opportunity.status === 'Hot' ? 'bg-red-500 text-white' :
                          opportunity.status === 'Almost Funded' ? 'bg-orange-500 text-white' :
                          'bg-blue-500 text-white'
                        }`}>
                          {opportunity.status}
                        </span>
                      </div>
                      <div className="text-xs text-blue-200 mb-3">{opportunity.location}</div>
                      
                      {/* Progress Bar */}
                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-blue-200 mb-1">
                          <span>{opportunity.fxctCommitted} FXCT committed</span>
                          <span>{opportunity.progressPercent}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${opportunity.progressPercent}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-green-300">
                          {opportunity.investorsCount} investors • {opportunity.yieldEstimate} yield
                        </span>
                        <button className="text-xs bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-full font-semibold transition-colors">
                          Bid Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentMarketplaceHero;
