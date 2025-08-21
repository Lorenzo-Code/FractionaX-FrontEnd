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

  const ecosystemCategories = [
    {
      id: 'defi-integration',
      name: 'DeFi Integration',
      icon: <Layers className="w-6 h-6" />,
      color: 'from-blue-600 to-cyan-600',
      benefits: [
        {
          title: "Multi-Protocol Yield Optimization",
          description: "Access curated DeFi protocols like Lido, Curve, and Aave with AI-optimized yield strategies tailored to your risk profile.",
          icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
          highlight: "3-20%+ APY potential",
          stats: { apy: "8.5%", tvl: "$89.6M", protocols: "8" }
        },
        {
          title: "Liquid Staking Benefits",
          description: "Stake tokens without lock-ups through protocols like Lido, earning 4-5% APY while maintaining full liquidity.",
          icon: <Droplets className="w-8 h-8 text-blue-600" />,
          highlight: "No lock-up periods",
          stats: { apy: "4.2%", tvl: "$32.5M", protocols: "3" }
        }
      ]
    },
    {
      id: 'ai-powered',
      name: 'AI-Powered',
      icon: <Bot className="w-6 h-6" />,
      color: 'from-purple-600 to-pink-600',
      benefits: [
        {
          title: "AI-Enhanced Portfolio Allocation",
          description: "AI suggests optimal protocol combinations, projecting 10-15% total yields by pairing stable staking with FXST rental boosts.",
          icon: <Bot className="w-8 h-8 text-purple-600" />,
          highlight: "Personalized strategies",
          stats: { accuracy: "94%", recommendations: "2.4K", users: "15K" }
        },
        {
          title: "Risk-Adjusted Returns",
          description: "Choose from low-risk (3-5%), medium-risk (8-12%), or high-risk (15%+) strategies based on your investment appetite.",
          icon: <Shield className="w-8 h-8 text-purple-600" />,
          highlight: "Customized risk levels",
          stats: { profiles: "3", avg_return: "11.2%", satisfied: "96%" }
        }
      ]
    },
    {
      id: 'wallet-management',
      name: 'Wallet & Security',
      icon: <Wallet className="w-6 h-6" />,
      color: 'from-green-600 to-emerald-600',
      benefits: [
        {
          title: "Internal Wallet Management",
          description: "Secure internal wallets automatically manage your FCT and FXST tokens, with seamless integration to external wallets.",
          icon: <Wallet className="w-8 h-8 text-green-600" />,
          highlight: "Auto-managed digital assets",
          stats: { wallets: "24.8K", volume: "$156M", uptime: "99.9%" }
        },
        {
          title: "Cross-Chain Protocol Access",
          description: "Seamlessly access protocols across 14+ blockchain networks - all managed through your FractionaX dashboard.",
          icon: <Globe className="w-8 h-8 text-green-600" />,
          highlight: "14+ blockchain networks",
          stats: { chains: "14+", transactions: "450K", avg_fee: "$0.12" }
        }
      ]
    },
    {
      id: 'advanced-features',
      name: 'Advanced Features',
      icon: <Building className="w-6 h-6" />,
      color: 'from-orange-600 to-red-600',
      benefits: [
        {
          title: "Fractionalized Yield Farming",
          description: "Participate in yield farming across multiple protocols with fractional amounts, reducing barriers and maximizing diversification.",
          icon: <Layers className="w-8 h-8 text-orange-600" />,
          highlight: "Low minimum investments",
          stats: { min_invest: "$25", avg_yield: "12.8%", pools: "45" }
        },
        {
          title: "Synthetic Asset Integration",
          description: "Access synthetic real estate exposure through protocols like Synthetix and Ethena, enabling global property investment.",
          icon: <Building className="w-8 h-8 text-orange-600" />,
          highlight: "Global property exposure",
          stats: { properties: "2.1K", countries: "23", avg_roi: "14.3%" }
        }
      ]
    }
  ];

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
            💰 Ecosystem Benefits
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Being inside the FractionaX ecosystem unlocks powerful DeFi integrations, 
            AI-optimized yield strategies, and seamless crypto-powered returns that traditional platforms can't match.
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

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Category Info */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className={`bg-gradient-to-r ${currentCategory.color} p-8 rounded-2xl text-white mb-6`}
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
            
            {/* Key Stats for Active Category */}
            <motion.div
              key={`stats-${activeTab}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="bg-white p-6 rounded-2xl shadow-md border"
            >
              <h4 className="font-semibold text-gray-900 mb-4 text-center">Live Metrics</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">$89.6M</div>
                  <div className="text-xs text-gray-600">Total Value Locked</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">24.8K</div>
                  <div className="text-xs text-gray-600">Active Users</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">11.2%</div>
                  <div className="text-xs text-gray-600">Avg APY</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side - Benefits Cards */}
          <div className="space-y-4">
            <AnimatePresence>
              {currentCategory.benefits.map((benefit, benefitIndex) => (
                <motion.div
                  key={`${activeTab}-${benefitIndex}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ delay: benefitIndex * 0.1, duration: 0.4 }}
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
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {benefit.description}
                      </p>
                      
                      {/* Live stats */}
                      <div className="flex gap-4 text-xs">
                        {Object.entries(benefit.stats).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="font-semibold text-gray-900">{value}</div>
                            <div className="text-gray-500 capitalize">{key.replace('_', ' ')}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
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
              Ready to Maximize Your Crypto Returns?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto relative z-10">
              Join thousands of investors already earning optimized yields through our integrated DeFi ecosystem
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link to="/investment-protocols">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
                >
                  Explore Protocols
                </motion.button>
              </Link>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                View Analytics
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
