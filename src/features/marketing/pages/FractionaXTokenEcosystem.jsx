import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { SEO } from "../../../shared/components";
import { PreSaleModal } from '../components';
import { generatePageSEO, generateStructuredData } from '../../../shared/utils';
import Breadcrumb from '../../../shared/components/Breadcrumb';
import ContextualNavigation from '../../../shared/components/ContextualNavigation';
import useNavigationAnalytics from '../../../shared/hooks/useNavigationAnalytics';
import { Zap } from 'lucide-react';

// Token Allocation Data
const allocationData = [
  { name: "Pre-Sale", value: 3.5 },
  { name: "Liquidity Pool", value: 2 },
  { name: "Operations Reserve", value: 25 },
  { name: "Founders", value: 20 },
  { name: "Employee Incentives", value: 10 },
  { name: "Ecosystem Growth", value: 39.5 },
];

// Modernized Color Palette
const COLORS = [
  "#3B82F6", // Blue-500 (Primary)
  "#10B981", // Emerald-500 (Growth)
  "#F59E0B", // Amber-500 (Allocation)
  "#EF4444", // Red-500 (Burn)
  "#6366F1", // Indigo-500 (Governance)
  "#14B8A6"  // Teal-500 (Utility)
];

export default function FractionaXTokenEcosystem() {
  const seoData = generatePageSEO({
    title: "About FractionaX | Real Estate Investment Platform & Ecosystem",
    description: "Learn about FractionaX - the investment platform revolutionizing real estate access. Discover our mission, technology, FXCT tokens, and how we're making property investment accessible to everyone.",
    url: "/about",
    keywords: ["FractionaX about", "real estate investment platform", "company mission", "fractional property investment", "FXCT tokens", "investment technology", "real estate marketplace"]
  });
  const structuredData = generateStructuredData.organization();

  const [metrics, setMetrics] = useState({
    totalSupply: "Loading...",
    circulatingSupply: "Loading...",
    burned: "Loading...",
    tokenizedAssets: "Loading...",
    collateralRatio: "Loading...",
    lastBurn: "Loading..."
  });

  const [market, setMarket] = useState({
    price: null,
    volume: null,
    priceChange24h: null
  });

  const [showFeed, setShowFeed] = useState(true);
  const toggleFeed = () => setShowFeed(!showFeed);
  const [activity, setActivity] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPreSaleModal, setShowPreSaleModal] = useState(false);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [metricsError, setMetricsError] = useState(null);

  const [presale, setPresale] = useState({
    currentPrice: null,
    tokensAvailable: null,
    softCap: null,
    hardCap: null,
    totalRaised: null
  });
  const [isLoadingPresale, setIsLoadingPresale] = useState(true);
  const [presaleError, setPresaleError] = useState(null);

  // Platform Stats State
  const [platformStats, setPlatformStats] = useState({
    totalUsers: 0,
    totalValueLocked: 0,
    totalProperties: 0,
    averageROI: 0,
    loading: true
  });


  // Fetch Presale Stats
  useEffect(() => {
    let isActive = true;

    async function fetchPresale() {
      if (!isActive) return;
      
      try {
        setPresaleError(null);
        const res = await fetch("https://api.fractionax.io/presale");
        
        if (!res.ok) {
          throw new Error(`Presale API Error: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (isActive) {
          setPresale({
            currentPrice: data.currentPrice,
            tokensAvailable: data.tokensAvailable,
            softCap: data.softCap,
            hardCap: data.hardCap,
            totalRaised: data.totalRaised
          });
        }
      } catch (err) {
        if (isActive) {
          console.error("Failed to fetch presale data", err);
          setPresaleError(err.message);
        }
      } finally {
        if (isActive) {
          setIsLoadingPresale(false);
        }
      }
    }

    fetchPresale();
    const interval = setInterval(fetchPresale, 15000);
    
    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, []);

  // Fetch Platform Stats
  useEffect(() => {
    let isActive = true;

    const fetchPlatformStats = async () => {
      if (!isActive) return;
      
      try {
        const res = await fetch("/api/homepage/stats");
        
        if (!res.ok) {
          throw new Error(`Platform Stats API Error: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (isActive) {
          setPlatformStats({
            totalUsers: data.totalUsers || 0,
            totalValueLocked: data.totalValueLocked || 0,
            totalProperties: data.totalProperties || 0,
            averageROI: data.averageROI || 0,
            loading: false
          });
        }
      } catch (err) {
        if (isActive) {
          console.error("Failed to fetch platform stats:", err);
          setPlatformStats(prev => ({ ...prev, loading: false }));
        }
      }
    };

    fetchPlatformStats();
    const interval = setInterval(fetchPlatformStats, 30000); // Refresh every 30 seconds
    
    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, []);

  // Fetch Live Metrics + Contract Activity
  useEffect(() => {
    let isActive = true;

    const fetchMetrics = async () => {
      if (!isActive) return;
      
      try {
        setMetricsError(null);
        const res = await fetch("https://api.fractionax.io/metrics");
        
        if (!res.ok) {
          throw new Error(`Metrics API Error: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (isActive) {
          setMetrics({
            totalSupply: data.totalSupply ?? "Unavailable",
            circulatingSupply: data.circulatingSupply ?? "Unavailable",
            burned: data.burned ?? "Unavailable",
            tokenizedAssets: data.tokenizedAssets ?? "Unavailable",
            collateralRatio: data.collateralRatio ?? "Unavailable",
            lastBurn: data.lastBurn ?? "Unavailable"
          });
          setMarket({
            price: data.marketPrice ?? null,
            volume: data.marketVolume ?? null,
            priceChange24h: data.priceChange24h ?? null
          });
        }
      } catch (err) {
        if (isActive) {
          console.error("Failed to fetch metrics:", err);
          setMetricsError(err.message);
        }
      } finally {
        if (isActive) {
          setIsLoadingMetrics(false);
        }
      }
    };

    const fetchActivity = async () => {
      if (!isActive) return;
      
      try {
        const res = await fetch("https://api.fractionax.io/activity");
        
        if (!res.ok) {
          throw new Error(`Activity API Error: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (isActive) {
          setActivity(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isActive) {
          console.error("Failed to fetch activity:", err);
          setActivity([]);
        }
      }
    };

    fetchMetrics();
    fetchActivity();
    const interval = setInterval(() => {
      fetchMetrics();
      fetchActivity();
    }, 15000);

    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, []);

  // Helper functions
  const formatTimestamp = (timestamp) => new Date(timestamp).toLocaleString();
  const getIcon = (type) => {
    switch (type) {
      case "burn": return "🔥";
      case "transfer": return "🧾";
      case "mint": return "🪙";
      default: return "📄";
    }
  };
  const getColor = (type) => {
    switch (type) {
      case "burn": return "bg-red-100 text-red-800";
      case "transfer": return "bg-blue-100 text-blue-800";
      case "mint": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  // Format platform stats with appropriate prefixes
  const formatPlatformStat = (value, type = 'number') => {
    if (platformStats.loading) return "Loading...";
    if (!value || value === 0) {
      switch (type) {
        case 'currency': return "$0";
        case 'percentage': return "0%";
        default: return "0";
      }
    }
    
    switch (type) {
      case 'currency':
        if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
        return `$${value.toLocaleString()}`;
      case 'percentage':
        return `${parseFloat(value).toFixed(1)}%`;
      default:
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
        return value.toLocaleString();
    }
  };
  // Initialize navigation analytics
  const { trackCustomEvent } = useNavigationAnalytics({
    enableAnalytics: true,
    trackTimeOnPage: true,
    trackUserFlow: true
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Track ecosystem page view
    trackCustomEvent('ecosystem_page_view', {
      section: 'about_fractionax',
      user_type: 'visitor'
    });
  }, [trackCustomEvent]);

  return (
    <div>
      <SEO {...seoData} structuredData={structuredData} />
      <div className="p-6 md:p-12 max-w-6xl mx-auto text-gray-800">
        {/* Breadcrumb Navigation */}
        <Breadcrumb customPaths={{
          'ecosystem': 'About FractionaX'
        }} />
        
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">About FractionaX</h1>
        <p className="text-xl text-gray-600 text-center mb-16 max-w-4xl mx-auto">
          The investment platform revolutionizing how people access real estate. Start with $100, earn dividends, and trade like stocks.
        </p>

        {/* Our Mission Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">🎯 Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              To democratize real estate investing by making high-value properties accessible to everyone, regardless of income level.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🏠</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Accessible Investment</h3>
              <p className="text-gray-600">Start investing in real estate with as little as $100. No large capital requirements or complex procedures.</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">📈</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Real Ownership</h3>
              <p className="text-gray-600">Own actual fractional shares of properties with real legal rights, dividends, and appreciation potential.</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Liquid Trading</h3>
              <p className="text-gray-600">Trade your property shares anytime on our marketplace. No more waiting years to access your investment.</p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">📖 Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>The Problem:</strong> Real estate has always been the cornerstone of wealth building, but it's been locked away behind high capital requirements. Most people can't afford to invest in quality properties, missing out on one of history's most reliable asset classes.
                </p>
                <p>
                  <strong>Our Solution:</strong> We're combining the accessibility of stock trading with the stability of real estate investing. Using blockchain technology and fractional ownership, we've created a platform where anyone can invest in premium properties starting with just $100.
                </p>
                <p>
                  <strong>The Vision:</strong> A world where your income level doesn't determine your access to wealth-building opportunities. Where a teacher, nurse, or student can invest alongside institutional investors in the same high-quality real estate deals.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold mb-6 text-center text-gray-900">Why We Built This</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">💡</span>
                  </div>
                  <p className="text-gray-700"><strong>Innovation:</strong> Traditional real estate investing hasn't evolved with technology. We saw an opportunity to modernize the entire experience.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">🎯</span>
                  </div>
                  <p className="text-gray-700"><strong>Accessibility:</strong> We believe everyone deserves access to quality investment opportunities, not just the wealthy.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">🔒</span>
                  </div>
                  <p className="text-gray-700"><strong>Transparency:</strong> Real estate investing has been opaque for too long. We provide full transparency through blockchain technology.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Values Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">💎 Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              These principles guide every decision we make and every feature we build.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">🌟</div>
              <h3 className="font-semibold text-gray-900 mb-2">Transparency</h3>
              <p className="text-sm text-gray-600">Every transaction, fee, and decision is visible on the blockchain. No hidden costs or surprise charges.</p>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-sm text-gray-600">We leverage cutting-edge technology to solve real problems and create better user experiences.</p>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-sm text-gray-600">Our platform is built by investors, for investors. Community feedback drives our roadmap.</p>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">⚖️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Compliance</h3>
              <p className="text-sm text-gray-600">We operate within all regulatory frameworks to ensure investor protection and platform longevity.</p>
            </div>
          </div>
        </section>

        {/* Platform Technology Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl p-8 md:p-12 text-white">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">🔧 How Our Platform Works</h2>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                Advanced technology meets simple user experience. Here's what powers FractionaX behind the scenes.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏗️</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart Contracts</h3>
                <p className="opacity-80">Automated, transparent property management and dividend distribution through blockchain technology.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">AI-Powered Discovery</h3>
                <p className="opacity-80">Our AI identifies high-potential properties before they hit the traditional market, giving you first access.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💹</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Liquidity Engine</h3>
                <p className="opacity-80">Trade your property shares instantly on our marketplace with competitive pricing and low fees.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Transition Section - Investment Platform to Ecosystem */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">🌐 The FractionaX Ecosystem</h2>
            <p className="text-xl opacity-90 mb-6 max-w-4xl mx-auto">
              Everything you've seen above is powered by our advanced token ecosystem. 
              FXCT utility tokens and FXST security tokens work together to create the seamless investment experience you love.
            </p>
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-3xl mb-3">🪙</div>
                <h3 className="text-xl font-semibold mb-2">FXCT - Utility Token</h3>
                <p className="opacity-90">Powers platform features, AI tools, reduces fees, and enables community governance. Your gateway to premium investment tools.</p>
              </div>
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-3xl mb-3">🏠</div>
                <h3 className="text-xl font-semibold mb-2">FXST - Security Token</h3>
                <p className="opacity-90">Represents your actual ownership in real estate properties. Earns dividends, appreciates in value, fully SEC-compliant.</p>
              </div>
            </div>
            <p className="text-lg opacity-80 mt-6">
              ⬇️ <strong>Below you'll find the technical details, tokenomics, and infrastructure that makes it all possible.</strong>
            </p>
          </div>
        </section>

        {/* Complete Platform Experience Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">🎆 The Complete FractionaX Experience</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Beyond simple property investment - we've built a comprehensive ecosystem that transforms how you discover, validate, invest, and profit from real estate.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Property Discovery */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl text-white">🤖</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">AI Property Discovery</h3>
              <p className="text-gray-600 mb-4">Our AI scans real estate marketplaces, MLS data, and property records to find investment opportunities that match your criteria before they hit the market.</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-purple-700">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Natural language search ("Austin condos under $400K")
                </div>
                <div className="flex items-center text-purple-700">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Market analysis and ROI projections
                </div>
                <div className="flex items-center text-purple-700">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Instant property valuation and risk assessment
                </div>
              </div>
            </div>
            
            {/* Community Bidding */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl text-white">🏆</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Community Bidding System</h3>
              <p className="text-gray-600 mb-4">Community validates investment opportunities through FXCT token bidding. Higher community interest signals better deals and unlocks property funding.</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-green-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Minimum 50 FXCT to participate in bidding
                </div>
                <div className="flex items-center text-green-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  7-10% bonus FXCT rewards for bidders
                </div>
                <div className="flex items-center text-green-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Leaderboards and achievement system
                </div>
              </div>
            </div>
            
            {/* Wallet & Trading */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl text-white">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Integrated Wallet</h3>
              <p className="text-gray-600 mb-4">Seamlessly manage FXCT utility tokens, FXST security tokens, and USD cash. Buy, sell, transfer, and track all your investments in one place.</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-blue-700">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Real-time portfolio tracking and analytics
                </div>
                <div className="flex items-center text-blue-700">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Multiple payment methods (card, bank, crypto)
                </div>
                <div className="flex items-center text-blue-700">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Transaction history and tax reporting
                </div>
              </div>
            </div>
            
            {/* Investment Management */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl text-white">📈</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Investment Dashboard</h3>
              <p className="text-gray-600 mb-4">Track your real estate portfolio performance, monthly dividend income, property appreciation, and detailed analytics across all your investments.</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-orange-700">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  Live property valuations and yield tracking
                </div>
                <div className="flex items-center text-orange-700">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  Monthly rental income distribution
                </div>
                <div className="flex items-center text-orange-700">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  Performance analytics and tax documents
                </div>
              </div>
            </div>
            
            {/* Staking Protocols */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl text-white">🔥</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">DeFi Staking</h3>
              <p className="text-gray-600 mb-4">Stake your FXCT tokens across multiple DeFi protocols with different risk levels. Earn 5-10% APY while supporting the ecosystem.</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-pink-700">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                  Low, Medium, and High-risk protocol tiers
                </div>
                <div className="flex items-center text-pink-700">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                  Automated rewards claiming and compounding
                </div>
                <div className="flex items-center text-pink-700">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                  Governance voting power based on stake
                </div>
              </div>
            </div>
            
            {/* Security & Compliance */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl text-white">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Security & Compliance</h3>
              <p className="text-gray-600 mb-4">Bank-level security with full regulatory compliance. KYC/AML verification, insured funds, and transparent smart contracts audited by professionals.</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                  SEC-compliant security token framework
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                  Multi-signature wallet security
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                  Regular security audits and penetration testing
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Platform Statistics */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 rounded-2xl p-8 md:p-12 text-white">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <h2 className="text-3xl font-bold">📊 Live Platform Metrics</h2>
                <div className="flex items-center gap-2 ml-3">
                  {platformStats.loading ? (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-yellow-200">Loading...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-200">Live</span>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                Real numbers from our growing community of real estate investors
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{formatPlatformStat(platformStats.totalUsers)}</div>
                <div className="text-lg opacity-80">Active Investors</div>
                <div className="text-sm opacity-60 mt-1">{platformStats.loading ? "Loading..." : (platformStats.totalUsers > 0 ? "Growing daily" : "Coming Soon")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{formatPlatformStat(platformStats.totalValueLocked, 'currency')}</div>
                <div className="text-lg opacity-80">Total Investments</div>
                <div className="text-sm opacity-60 mt-1">{platformStats.loading ? "Loading..." : (platformStats.totalValueLocked > 0 ? "Real estate value" : "Coming Soon")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{formatPlatformStat(platformStats.totalProperties)}</div>
                <div className="text-lg opacity-80">Properties Available</div>
                <div className="text-sm opacity-60 mt-1">{platformStats.loading ? "Loading..." : (platformStats.totalProperties > 0 ? "Across multiple states" : "Coming Soon")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{formatPlatformStat(platformStats.averageROI, 'percentage')}</div>
                <div className="text-lg opacity-80">Average Annual Return</div>
                <div className="text-sm opacity-60 mt-1">{platformStats.loading ? "Loading..." : (platformStats.averageROI > 0 ? "Including dividends" : "Coming Soon")}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">🚀 FXCT Token Pre-Sale</h2>
          <p className="mb-4 text-gray-700">
            Be among the first to own FXCT — the utility token powering fractional real estate investing, community bidding, and AI-powered property research.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div className="bg-gray-100 p-4 rounded shadow">
              <p className="text-sm text-gray-500">Token Price</p>
              <p className="text-lg font-bold">
                {presale.currentPrice ? `$${parseFloat(presale.currentPrice).toFixed(2)} / FXCT` : "Loading..."}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded shadow">
              <p className="text-sm text-gray-500">Available</p>
              <p className="text-lg font-bold">
                {presale.tokensAvailable ? presale.tokensAvailable.toLocaleString() + " FXCT" : "Loading..."}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded shadow">
              <p className="text-sm text-gray-500">Soft Cap</p>
              <p className="text-lg font-bold">
                {presale.softCap ? `$${parseFloat(presale.softCap).toLocaleString()}` : "Loading..."}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded shadow">
              <p className="text-sm text-gray-500">Hard Cap</p>
              <p className="text-lg font-bold">
                {presale.hardCap ? `$${parseFloat(presale.hardCap).toLocaleString()}` : "Loading..."}
              </p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowPreSaleModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded font-medium hover:bg-blue-700 transition"
            >
              Join the Pre-Sale
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Raised: {presale.totalRaised ? `$${parseFloat(presale.totalRaised).toLocaleString()}` : "Loading..."}
            </p>
          </div>
        </section>


        {/* Market Stats Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">FXCT Market Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-100 p-4 rounded shadow">
              <p className="text-sm text-gray-500">Current Price (USD)</p>
              <p className="font-semibold">
                {market.price !== null ? `$${parseFloat(market.price).toFixed(4)}` : "Loading..."}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded shadow">
              <p className="text-sm text-gray-500">24h Volume</p>
              <p className="font-semibold">
                {market.volume !== null ? `$${parseFloat(market.volume).toLocaleString()}` : "Loading..."}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded shadow">
              <p className="text-sm text-gray-500">Market Cap</p>
              <p className="font-semibold">
                {market.price !== null && !isNaN(parseFloat(metrics.circulatingSupply))
                  ? `$${(market.price * parseFloat(metrics.circulatingSupply)).toLocaleString()}`
                  : "Loading..."}
              </p>
            </div>
            {market.priceChange24h !== null && (
              <div className="bg-gray-100 p-4 rounded shadow">
                <p className="text-sm text-gray-500">24h Change</p>
                <p className={`font-semibold ${market.priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {parseFloat(market.priceChange24h).toFixed(2)}%
                </p>
              </div>
            )}
          </div>
          <div className="text-right text-xs text-gray-400 mt-2">
            Last Updated: {new Date().toLocaleTimeString()}
          </div>
        </section>
        {/* Advanced Stats Toggle */}
        <section className="mb-6 text-center">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Advanced Stats</h2>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-blue-600 underline font-medium hover:text-blue-800"
            >
              {showAdvanced ? "Hide Advanced Token Stats" : "Show Advanced Token Stats"}
            </button>
          </div>
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.30 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-100 p-4 rounded shadow">
                    <p className="text-sm text-gray-500">FXCT Total Supply</p>
                    <p className="font-semibold">{metrics.totalSupply}</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded shadow">
                    <p className="text-sm text-gray-500">Circulating Supply</p>
                    <p className="font-semibold">{metrics.circulatingSupply}</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded shadow">
                    <p className="text-sm text-gray-500">FXCT Burned</p>
                    <p className="font-semibold">{metrics.burned}</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded shadow">
                    <p className="text-sm text-gray-500">FST Tokenized Assets</p>
                    <p className="font-semibold">{metrics.tokenizedAssets}</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded shadow">
                    <p className="text-sm text-gray-500">Collateral Ratio</p>
                    <p className="font-semibold">{metrics.collateralRatio}</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded shadow">
                    <p className="text-sm text-gray-500">Last Burn Event</p>
                    <p className="font-semibold">{metrics.lastBurn}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
        {/* Token Allocation Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">📊 FXCT Token Allocation</h2>
          <p className="text-sm text-gray-600 mb-6">
            The total supply of <span className="font-bold text-blue-700">1 billion FXCT</span> is distributed across strategic categories to ensure long-term growth, platform sustainability, and community participation.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Pie Chart */}
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  paddingAngle={3}
                  label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                  labelLine={true}
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: "8px", fontSize: "0.85rem" }}
                  formatter={(value, name) => [`${value}%`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Clean Table with color + spacing */}
            <div className="text-sm w-full">
              <table className="w-full border border-gray-200 rounded overflow-hidden">
                <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                  <tr>
                    <th className="text-left px-4 py-2">Category</th>
                    <th className="text-left px-4 py-2">Allocation</th>
                    <th className="text-left px-4 py-2">Details</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="even:bg-white odd:bg-gray-50">
                    <td className="px-4 py-3 font-medium flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: "#3B82F6" }}></span>
                      <span className="text-blue-700">Pre-Sale</span>
                    </td>
                    <td className="px-4 py-3 font-semibold">3.5%</td>
                    <td className="px-4 py-3">Raise $750k to 1.5m at $0.10 per FXCT</td>
                  </tr>
                  <tr className="even:bg-white odd:bg-gray-50">
                    <td className="px-4 py-3 font-medium flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: "#10B981" }}></span>
                      <span className="text-blue-700">Liquidity Pool</span>
                    </td>
                    <td className="px-4 py-3 font-semibold">5% (by Year 5)</td>
                    <td className="px-4 py-3">Starts at 2% in Year 1; grows with platform adoption</td>
                  </tr>
                  <tr className="even:bg-white odd:bg-gray-50">
                    <td className="px-4 py-3 font-medium flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: "#F59E0B" }}></span>
                      <span className="text-blue-700">Operations Reserve</span>
                    </td>
                    <td className="px-4 py-3 font-semibold">25%</td>
                    <td className="px-4 py-3">Marketing, partnerships, legal, growth</td>
                  </tr>
                  <tr className="even:bg-white odd:bg-gray-50">
                    <td className="px-4 py-3 font-medium flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: "#EF4444" }}></span>
                      <span className="text-blue-700">Founders</span>
                    </td>
                    <td className="px-4 py-3 font-semibold">20%</td>
                    <td className="px-4 py-3">4-year vesting with 1-year cliff</td>
                  </tr>
                  <tr className="even:bg-white odd:bg-gray-50">
                    <td className="px-4 py-3 font-medium flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: "#6366F1" }}></span>
                      <span className="text-blue-700">Employee Incentives</span>
                    </td>
                    <td className="px-4 py-3 font-semibold">10%</td>
                    <td className="px-4 py-3">Team rewards, hiring, bounties</td>
                  </tr>
                  <tr className="even:bg-white odd:bg-gray-50">
                    <td className="px-4 py-3 font-medium flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: "#14B8A6" }}></span>
                      <span className="text-blue-700">Ecosystem Growth</span>
                    </td>
                    <td className="px-4 py-3 font-semibold">39.5%</td>
                    <td className="px-4 py-3">Staking rewards, partner grants, community incentives</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        
        {/* Multi-Asset Marketplace & Revenue Model Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-black">🏦 Multi-Asset Marketplace & Revenue Model</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-blue-800 font-bold text-lg mb-2">🏠 Launch Focus: Real Estate First</h3>
            <p className="text-blue-700 text-sm mb-2">
              <strong>Phase 1 (Q3-Q4 2025):</strong> We're launching with a focused approach on <strong>real estate tokenization</strong> to ensure the highest quality experience and regulatory compliance.
            </p>
            <p className="text-blue-600 text-xs leading-relaxed">
              Our multi-asset marketplace will expand in Phase 2 (2026) to include Luxury Cars, Art & NFTs, Collectibles, and DeFi Yield opportunities once we've perfected the real estate investment experience.
            </p>
          </div>
          <p className="text-sm text-gray-700 mb-6 leading-relaxed">
            Our marketplace will support tokenized investments across multiple asset classes, starting with real estate and expanding to luxury cars, art & NFTs, collectibles, and DeFi yield opportunities. Each category has specific revenue streams and fee structures designed to sustain platform growth while maximizing user value.
          </p>
          
          {/* Asset Categories Overview */}
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <div className="bg-white rounded-lg shadow-md p-5 border border-blue-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-blue-600 mb-2 flex items-center">
                🏠 Real Estate Properties
              </h3>
              <p className="text-sm text-gray-700 mb-3">Residential, commercial, and land investments with fractional ownership opportunities.</p>
              <div className="text-xs text-gray-500">
                <div>• Processing Fee: 2-3% of asset value</div>
                <div>• Commission Fee: 5-7% for AI-discovered</div>
                <div>• Financing: Up to 5% equity retained</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-5 border border-purple-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-purple-600 mb-2 flex items-center">
                🏎️ Luxury Cars
              </h3>
              <p className="text-sm text-gray-700 mb-3">Classic cars, supercars, and vintage vehicles with appreciation potential.</p>
              <div className="text-xs text-gray-500">
                <div>• Processing Fee: 3-4% of asset value</div>
                <div>• Commission Fee: 6-8% for sourcing</div>
                <div>• Storage & Insurance: 1-2% annually</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-5 border border-pink-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-pink-600 mb-2 flex items-center">
                🎨 Art & NFTs
              </h3>
              <p className="text-sm text-gray-700 mb-3">Physical artwork, digital art, and NFT collections from verified creators.</p>
              <div className="text-xs text-gray-500">
                <div>• Processing Fee: 2.5-3.5% of value</div>
                <div>• Commission Fee: 7-10% for discovery</div>
                <div>• Authentication: 0.5-1% for verification</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-5 border border-green-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-green-600 mb-2 flex items-center">
                🃏 Collectibles
              </h3>
              <p className="text-sm text-gray-700 mb-3">Trading cards, memorabilia, and rare collectible items with graded authenticity.</p>
              <div className="text-xs text-gray-500">
                <div>• Processing Fee: 2-3% of asset value</div>
                <div>• Commission Fee: 5-8% for sourcing</div>
                <div>• Grading & Storage: 1% annually</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-5 border border-orange-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-orange-600 mb-2 flex items-center">
                💰 DeFi Yield Farming
              </h3>
              <p className="text-sm text-gray-700 mb-3">Curated yield farming opportunities across audited protocols and staking pools.</p>
              <div className="text-xs text-gray-500">
                <div>• Management Fee: 1-2% annually</div>
                <div>• Performance Fee: 10-15% of profits</div>
                <div>• Gas Optimization: Included</div>
              </div>
            </div>
          </div>
          
          {/* Revenue Stream Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">💼 How FractionaX Generates Revenue</h3>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-blue-600 mb-2">🤖 AI-Discovered Listings</h4>
                <p className="text-sm text-gray-700 mb-2">Our AI identifies high-potential assets before they hit the market.</p>
                <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                  <li><strong>Commission Fee:</strong> 5-10% connecting buyers and sellers</li>
                  <li><strong>Sourcing Premium:</strong> 2-3% for exclusive opportunities</li>
                  <li><strong>Due Diligence:</strong> 0.5-1% for verification and analysis</li>
                  <li><strong>Market Analysis:</strong> Subscription-based AI reports</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-green-600 mb-2">✅ Approved Listings</h4>
                <p className="text-sm text-gray-700 mb-2">User-submitted listings verified through our approval process.</p>
                <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                  <li><strong>Processing Fee:</strong> 2-4% (cheaper than commission)</li>
                  <li><strong>Verification Fee:</strong> 0.5-1% for approval process</li>
                  <li><strong>Platform Fee:</strong> 1% for listing management</li>
                  <li><strong>Transaction Fee:</strong> 0.5% on successful sales</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Financing Model */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">🏦 FractionaX Financing Model</h3>
            <p className="text-sm text-blue-800 mb-4">
              <strong>Fractional Deals Only:</strong> FractionaX provides financing exclusively for fractional ownership opportunities, enabling broader access to high-value assets.
            </p>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-600 mb-2">📊 Equity Retention</h4>
                <p className="text-xs text-blue-700">
                  FractionaX retains up to <strong>5% equity</strong> in financed assets, providing long-term value alignment and sustainable revenue.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-600 mb-2">🎯 Target Assets</h4>
                <p className="text-xs text-blue-700">
                  Focus on assets $50K+ that benefit from fractionalization: real estate, luxury cars, art, and high-value collectibles.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-600 mb-2">⚖️ Risk Management</h4>
                <p className="text-xs text-blue-700">
                  Comprehensive due diligence, insurance requirements, and diversified portfolio approach minimize financing risks.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FXCT Treasury & Utility Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-black">💰 FXCT Fundraising, Utility & Burn Strategy</h2>
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            FXCT powers the entire FractionaX ecosystem — from accessing premium marketplace features to reducing fees on multi-asset investments — while generating sustainable treasury growth through strategic utility mechanics.
          </p>
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
            {/* Fundraising Strategy */}
            <div className="bg-white rounded-lg shadow-md p-5 border border-blue-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">🎯 Fundraising Breakdown</h3>
              <ul className="text-sm text-gray-700 list-disc list-inside space-y-2">
                <li><strong>Raise Goal:</strong> $750K to $1.25M via up to 35M FXCT tokens (~3.5% of total supply)</li>
                <li><strong>Pre-Sale Pricing:</strong> $0.035–$0.07 per token (tiered by contribution size)</li>
                <li><strong>Launch Price:</strong> $0.10 per token (Phase 2)</li>
                <li><strong>Minimum Soft Cap:</strong> $250K (rollover/refund policy if not met)</li>
                <li><strong>Future Rounds:</strong> Community Sale, Strategic Round, DAO Allocation</li>
              </ul>
              <p className="text-xs text-gray-500 mt-3">
                All proceeds go toward liquidity, platform development, security audits, and user onboarding.
              </p>
            </div>

            {/* Liquidity & Treasury Model */}
            <div className="bg-white rounded-lg shadow-md p-5 border border-blue-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">💧 Liquidity & Collateralization</h3>
              <ul className="text-sm text-gray-700 list-disc list-inside space-y-2">
                <li>🚀 Initial Pool: 20M FXCT + $1.6M USDC (1:1 ratio)</li>
                <li>🔐 5% of supply locked by Year 3</li>
                <li>📈 1.5:1 collateral ratio target by Year 5</li>
                <li>🛡️ Treasury includes stablecoins, crypto, and FXST-backed real estate</li>
              </ul>
              <p className="text-xs text-gray-500 mt-3">
                We do what most projects don’t — back our utility token with real reserves from Day 1.
              </p>
            </div>
          </div>
        </section>

        {/* FXCT Utility, Burn, & Verification Model */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-black">🔥 FXCT Token Utility, Burn & Verification Model</h2>
          <p className="text-gray-700 text-sm mb-6 leading-relaxed">
            FXCT is designed to drive real usage — while being deflationary, fee-powered, and transparently governed via smart contract.
          </p>

          <ul className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            <li className="bg-white rounded-lg shadow-md p-5 border border-blue-100 hover:shadow-lg transition-shadow duration-300">
              <p className="text-sm">
                <span className="font-semibold text-blue-600 block mb-1">🔥 30% Burn on Platform Usage:</span>
                30% of FXCT used for AI search, subscriptions, and tools is permanently burned — reducing supply.
              </p>
            </li>
            <li className="bg-white rounded-lg shadow-md p-5 border border-blue-100 hover:shadow-lg transition-shadow duration-300">
              <p className="text-sm">
                <span className="font-semibold text-blue-600 block mb-1">💼 70% Treasury Allocation:</span>
                The other 70% funds operations, audits, rewards, and strategic growth via the treasury.
              </p>
            </li>
            <li className="bg-white rounded-lg shadow-md p-5 border border-blue-100 hover:shadow-lg transition-shadow duration-300">
              <p className="text-sm">
                <span className="font-semibold text-blue-600 block mb-1">🔁 Smart Fee Model:</span>
                Transfers are subject to 1% minimum and a $5.00 USD cap. Large volume = higher support to ecosystem.
              </p>
            </li>
            <li className="bg-white rounded-lg shadow-md p-5 border border-blue-100 hover:shadow-lg transition-shadow duration-300">
              <p className="text-sm">
                <span className="font-semibold text-blue-600 block mb-1">🔒 45-Day Subscription Lock:</span>
                Discounted FXCT from subscriptions is non-transferable for the first 45 days.
              </p>
            </li>
            <li className="bg-white rounded-lg shadow-md p-5 border border-blue-100 hover:shadow-lg transition-shadow duration-300">
              <p className="text-sm">
                <span className="font-semibold text-blue-600 block mb-1">📊 Treasury Diversification:</span>
                Assets include USDC, ETH, blue-chip crypto, FXST real estate holdings, and select securities.
              </p>
            </li>
            <li className="bg-white rounded-lg shadow-md p-5 border border-blue-100 hover:shadow-lg transition-shadow duration-300">
              <p className="text-sm">
                <span className="font-semibold text-blue-600 block mb-1">🔗 Auditable on Base:</span>
                All fees, burns, and treasury movements are published monthly and trackable on BaseScan.
              </p>
            </li>
          </ul>

          <div className="mt-6 text-sm">
            🔗 <a
              href="https://basescan.org/address/0xYourTokenAddress#tokentxns"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View FXCT burn & fee activity on BaseScan
            </a>
          </div>

          <div className="mt-4 text-sm">
            📄 <a
              href="/docs/SmartContractAudit.pdf"
              download
              className="text-blue-600 hover:underline"
            >
              Download Smart Contract Audit (PDF)
            </a>
          </div>

          <p className="text-sm text-gray-600 mt-4">
            <strong>Why it matters:</strong> Every dollar raised and token burned is traceable. FXCT was designed to reward utility — not hype.
          </p>
        </section>

        {/* Smart Contract Verification Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-black">🔐 Smart Contract Verification</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-6">
            FXCT and FXST contracts are live on the Base network and fully verifiable. These contracts govern token supply, fees, locks, and usage permissions.
          </p>

          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
            <div className="border border-blue-100 rounded-lg shadow-sm p-5 bg-white hover:shadow-md transition">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-blue-600">FXCT Token Contract</p>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">✅ Verified</span>
              </div>
              <p className="text-xs text-gray-500 mb-2">Contract Address: <span className="font-mono">0xYourFXCTAddress</span></p>
              <p className="text-sm text-gray-600 mb-3">
                <span className="font-semibold">Utility Token</span> — grants access to AI reports, staking, and discounted platform fees.
              </p>
              <a
                href="https://basescan.org/token/0xYourFXCTAddress"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
              >
                View on BaseScan
              </a>
            </div>

            <div className="border border-blue-100 rounded-lg shadow-sm p-5 bg-white hover:shadow-md transition">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-blue-600">FXST Token Contract</p>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">✅ Verified</span>
              </div>
              <p className="text-xs text-gray-500 mb-2">Contract Address: <span className="font-mono">0xYourFXSTAddress</span></p>
              <p className="text-sm text-gray-600 mb-3">
                <span className="font-semibold">Security Token</span> — represents fractionalized real estate ownership and income rights.
              </p>
              <a
                href="https://basescan.org/token/0xYourFXSTAddress"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
              >
                View on BaseScan
              </a>
            </div>
          </div>

          <div className="mt-6 text-sm">
            📄 <a
              href="/docs/SmartContractAudit.pdf"
              download
              className="text-blue-600 hover:underline"
            >
              Download Smart Contract Audit PDF
            </a>
          </div>

          <p className="text-xs text-gray-500 mt-3">
            These contracts are immutable and verified. Status: <span className="text-green-600 font-medium">Audited, Public, and Compliant</span>.
          </p>

          <div className="mt-8">
            <button
              onClick={toggleFeed}
              className="text-sm text-blue-600 underline hover:text-blue-800 transition"
            >
              {showFeed ? "Hide Live Activity" : "Show Live Activity Feed"}
            </button>
            <AnimatePresence>
              {showFeed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-4"
                >
                  <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                    <p className="text-sm text-gray-500 mb-3">Auto-refreshes every 15 seconds</p>
                    <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                      {activity.map((item, idx) => (
                        <li
                          key={idx}
                          className="bg-gray-50 p-3 rounded-md shadow-sm flex items-start gap-3"
                        >
                          <div className={`text-lg ${getColor(item.type)} px-2 py-1 rounded-full font-bold`}>
                            {getIcon(item.type)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{item.description}</p>
                            <p className="text-xs text-gray-500">{formatTimestamp(item.timestamp)}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Roadmap Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-black">🚀 FractionaX Roadmap</h2>
          <div className="space-y-8 relative border-l-4 border-blue-500 pl-6">

            <div className="relative">
              <h3 className="text-blue-700 font-semibold text-lg">Q3 2025 — Launch Phase</h3>
              <p className="text-gray-700 text-sm mt-1">🌐 Official launch of FXCT token and live deployment of the FractionaX ecosystem dashboard.</p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                <li>Token generation and distribution via presale</li>
                <li>Ecosystem page with live metrics, supply tracking</li>
                <li>Smart contract verification (HashScan)</li>
              </ul>
            </div>

            <div className="relative">
              <h3 className="text-emerald-600 font-semibold text-lg">Q4 2025 — Utility Activation</h3>
              <p className="text-gray-700 text-sm mt-1">🧠 Launch of AI-driven investment tools and real-time FXCT burn tracking.</p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                <li>Smart AI Property Search (FXCT-powered)</li>
                <li>Real-time token burn and usage stats</li>
                <li>Release of public whitepaper and staking teaser</li>
              </ul>
            </div>

            <div className="relative">
              <h3 className="text-indigo-600 font-semibold text-lg">Q1 2026 — Governance Framework</h3>
              <p className="text-gray-700 text-sm mt-1">📜 Begin rollout of DAO tooling, voting modules, and on-chain proposals.</p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                <li>DAO portal (submit/view/vote proposals)</li>
                <li>Delegate voting preview and token locking</li>
                <li>Legal framework for early governance</li>
              </ul>
            </div>

            <div className="relative">
              <h3 className="text-yellow-600 font-semibold text-lg">Q2 2026 — Reg CF Expansion</h3>
              <p className="text-gray-700 text-sm mt-1">💼 Begin onboarding real-world tokenized offerings via FXST using Reg CF.</p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                <li>Fractional property onboarding tools</li>
                <li>Begin first tokenized real estate campaigns</li>
                <li>Early retail investor access via KYC portal</li>
              </ul>
            </div>

            <div className="relative">
              <h3 className="text-purple-600 font-semibold text-lg">Q3 2026 — Multi-Asset Marketplace Launch</h3>
              <p className="text-gray-700 text-sm mt-1">🏪 Launch of the full multi-asset investment marketplace with all five asset categories.</p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                <li>Real Estate, Luxury Cars, Art & NFTs, Collectibles, DeFi Yield</li>
                <li>AI-discovered vs. approved listings infrastructure</li>
                <li>Commission and processing fee collection systems</li>
                <li>Fractional financing program for high-value assets</li>
                <li>Live yield tracking and portfolio management</li>
              </ul>
            </div>

            <div className="relative">
              <h3 className="text-pink-600 font-semibold text-lg">Q4 2026 — Global Scale & Compliance</h3>
              <p className="text-gray-700 text-sm mt-1">📱 Final launch of mobile experience, VASP compliance certification, and global reach.</p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                <li>Mobile app beta release (iOS + Android)</li>
                <li>Global KYC/AML & VASP integrations</li>
                <li>Smart contract upgrade audit and decentralization steps</li>
              </ul>
            </div>
          </div>
        </section>
        {/* Coming Soon Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4 text-black">🌟 What’s Coming to FractionaX</h2>
          <p className="text-gray-700 mb-6 max-w-3xl">
            The journey has just begun. We’re building an ecosystem designed to unlock real financial opportunities, empower token holders, and redefine access to fractional ownership. Here's a glimpse of what’s ahead:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-500">
              <h3 className="text-blue-600 font-semibold text-lg">🗳 DAO-Based Governance</h3>
              <p className="text-sm text-gray-600 mt-2">
                Community voting for proposals, treasury decisions, and protocol upgrades. FXCT holders will gain real influence over the ecosystem’s future.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-green-500">
              <h3 className="text-green-600 font-semibold text-lg">💰 Staking Tiers & Bonuses</h3>
              <p className="text-sm text-gray-600 mt-2">
                Earn yield and exclusive platform perks by locking your FXCT. Higher tiers unlock voting power, partner rewards, and early access.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-yellow-500">
              <h3 className="text-yellow-600 font-semibold text-lg">📈 Reg A+ Expansion</h3>
              <p className="text-sm text-gray-600 mt-2">
                Launching a $75M/year equity offering to bring real estate ownership to thousands of investors, fully SEC-compliant.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-purple-500">
              <h3 className="text-purple-600 font-semibold text-lg">🔁 FST Trading on ATS</h3>
              <p className="text-sm text-gray-600 mt-2">
                Secondary trading for real estate-backed tokens (FST) on FINRA-registered ATS platforms like INX and tZERO.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-red-500">
              <h3 className="text-red-600 font-semibold text-lg">🔥 Burn Dashboard & Reserves</h3>
              <p className="text-sm text-gray-600 mt-2">
                View real-time token burns, treasury allocations, and wallet reserves in one transparent, public interface.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-teal-500">
              <h3 className="text-teal-600 font-semibold text-lg">📱 Mobile App</h3>
              <p className="text-sm text-gray-600 mt-2">
                Access the entire FractionaX platform on iOS & Android: track investments, vote, stake, and explore deals on the go.
              </p>
            </div>
          </div>
        </section>
        {/* Downloads Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4 text-black">📄 Downloadable Documents</h2>
          <p className="text-gray-700 mb-4">
            Access our most up-to-date documents for due diligence, transparency, and project understanding.
          </p>
          <ul className="list-disc list-inside space-y-3 text-sm text-gray-700">
            <li>
              <a href="/docs/FractionaX_Whitepaper.pdf" download className="text-blue-600 hover:underline font-medium">
                FractionaX Whitepaper
              </a> — Comprehensive overview of the FractionaX protocol, goals, mechanics, and token strategy.
            </li>
            <li>
              <a href="/docs/Tokenomics_FXCT.pdf" download className="text-blue-600 hover:underline font-medium">
                Tokenomics Overview
              </a> — Visual breakdown of supply, utility, and allocation schedules for FXCT and FST.
            </li>
            <li>
              <a href="/docs/SmartContractAudit.pdf" download className="text-blue-600 hover:underline font-medium">
                Smart Contract Audit (FXCT)
              </a> — Security review of the FXCT token contracts and transfer logic.
            </li>
            <li>
              <a href="/docs/FractionaX_BusinessPlan.pdf" download className="text-blue-600 hover:underline font-medium">
                Business Plan
              </a> — Financial model, use of funds, milestones, and growth forecasts.
            </li>
            <li>
              <a href="/docs/FractionaX_PitchDeck.pdf" download className="text-blue-600 hover:underline font-medium">
                Investor Pitch Deck
              </a> — Quick overview for early-stage VCs, angels, and crowdfunding backers.
            </li>
            <li>
              <a href="/docs/Legal_Disclaimers.pdf" download className="text-blue-600 hover:underline font-medium">
                Legal Disclaimers & Terms
              </a> — Policies, user protections, jurisdiction disclosures, and risk factors.
            </li>
            <li>
              <a href="/docs/FractionaX_Litepaper.pdf" download className="text-blue-600 hover:underline font-medium">
                Litepaper (Short Version)
              </a> — A simplified summary of our project for faster understanding.
            </li>
          </ul>
        </section>
        
        {/* Contextual Navigation - Next Steps */}
        <ContextualNavigation 
          customSuggestions={[
            {
              path: '/pre-sale',
              title: 'Join FXCT Pre-Sale',
              description: 'Get early access to utility tokens with exclusive pricing',
              icon: Zap,
              priority: 11
            }
          ]}
          maxSuggestions={3}
        />
        
        <PreSaleModal isOpen={showPreSaleModal} onClose={() => setShowPreSaleModal(false)} />
      </div>
    </div>
  );
}
