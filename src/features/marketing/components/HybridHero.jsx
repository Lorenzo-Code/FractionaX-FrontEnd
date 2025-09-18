import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { 
  ArrowTrendingUpIcon,
  ArrowRightIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { TrendingUp, DollarSign, Users, Building } from 'lucide-react';
import { useHomepageDisplay } from '../../../hooks/useHomepageData';
import { LiveDataIndicator } from '../../../shared/components';

const HybridHero = () => {
  const navigate = useNavigate();
  const { 
    marketStats,
    featuredProperty,
    platformSettings,
    loading,
    formatCurrency,
    formatNumber,
    isLiveData
  } = useHomepageDisplay();
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    isMobile: false,
    isLowEnd: false,
    shouldRenderParticles: true
  });

  // Check device capabilities for particles
  useEffect(() => {
    const checkDeviceCapabilities = () => {
      const isMobile = window.innerWidth < 768;
      const isVeryOldDevice = navigator.hardwareConcurrency < 2;
      const hasLimitedMemory = navigator.deviceMemory && navigator.deviceMemory < 2;
      const isLowEnd = isVeryOldDevice || hasLimitedMemory;
      
      // Only disable particles on very weak devices
      const shouldRenderParticles = !isLowEnd;
      
      setDeviceCapabilities({
        isMobile,
        isLowEnd,
        shouldRenderParticles
      });
    };

    checkDeviceCapabilities();
    
    const handleResize = () => {
      setDeviceCapabilities(prev => ({
        ...prev,
        isMobile: window.innerWidth < 768
      }));
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // Particles initialization
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);


  // Particles configuration - optimized for performance
  const getParticleConfig = () => {
    const { isMobile, isLowEnd } = deviceCapabilities;
    
    // Reduce particle count and effects for low-end devices
    const particleCount = isLowEnd ? 15 : (isMobile ? 25 : 60);
    const enableInteractivity = !isLowEnd;
    
    return {
      fullScreen: { enable: false },
      particles: {
        number: { value: particleCount },
        size: { 
          value: { min: 1, max: 3 }
        },
        color: { 
          value: ["#3B82F6", "#1D4ED8", "#2563EB", "#1E40AF"] // Blue theme colors
        },
        links: {
          enable: true,
          color: "#3B82F6",
          distance: isLowEnd ? 100 : 150,
          opacity: isLowEnd ? 0.1 : 0.2,
          width: 1,
        },
        move: { 
          enable: true, 
          speed: isLowEnd ? 0.5 : 1.0,
          direction: "none",
          outModes: {
            default: "bounce"
          }
        },
        opacity: {
          value: isLowEnd ? 0.3 : 0.5
        }
      },
      interactivity: {
        events: {
          onHover: { 
            enable: enableInteractivity, 
            mode: "grab" 
          },
        },
        modes: {
          grab: { 
            distance: 140,
            links: {
              opacity: 0.4
            }
          },
        },
      },
      detectRetina: true,
    };
  };

  return (
    <section className="relative bg-gradient-to-br from-white via-blue-50/30 to-slate-50 pt-16 pb-8 px-4 sm:px-6 lg:px-8 border-b border-gray-100 overflow-hidden">
      {/* Particles Background */}
      {deviceCapabilities.shouldRenderParticles && (
        <Particles
          id="hybrid-hero-particles"
          init={particlesInit}
          className="absolute inset-0 w-full h-full z-0"
          options={getParticleConfig()}
        />
      )}
      
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/60 to-white/80 z-1"></div>
      
      <div className="relative max-w-7xl mx-auto z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Main Message */}
          <div className="text-left">
            {platformSettings.showLiveBadge && (
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium mb-6">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Live Market
              </div>
            )}

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Invest in Real Estate
              <br />
              <span className="text-blue-600">Like Trading Stocks</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-xl">
              Buy fractional shares of real estate. Start with $100. 
              Earn dividends. Trade anytime. All in one platform.
            </p>

            {/* Key Benefits - Robinhood Style */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">$100 minimum</div>
                  <div className="text-sm text-gray-500">Start small</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Real ownership</div>
                  <div className="text-sm text-gray-500">Legal shares</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Earn dividends</div>
                  <div className="text-sm text-gray-500">Monthly income</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Trade anytime</div>
                  <div className="text-sm text-gray-500">Liquid market</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons - Coinbase Style */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/login')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg"
              >
                Start Investing
                <ArrowRightIcon className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => navigate('/marketplace')}
                className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <EyeIcon className="w-5 h-5" />
                Browse Properties
              </button>
            </div>
          </div>

          {/* Right Side - Live Market Stats */}
          <div className="lg:pl-8">
            {/* Market Overview Card - Robinhood Style */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">Market Overview</h3>
                  <LiveDataIndicator 
                    isLive={isLiveData.marketStats} 
                    size="sm" 
                    lastUpdated={marketStats.lastUpdated}
                  />
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <ArrowTrendingUpIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">{marketStats.averageRoiFormatted || '0%'} avg ROI</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : marketStats.totalVolumeFormatted || '$0'}
                  </div>
                  <div className="text-sm text-gray-500">Total Volume</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : marketStats.totalInvestorsFormatted || '0'}
                  </div>
                  <div className="text-sm text-gray-500">Total Investors</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : marketStats.totalListings || 0}
                  </div>
                  <div className="text-sm text-gray-500">Total Listings</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {loading ? '...' : `${marketStats.averageRoi || 0}%`}
                  </div>
                  <div className="text-sm text-gray-500">Average ROI</div>
                </div>
              </div>
            </div>

            {/* Featured Property Card - Zillow Style Preview */}
            {platformSettings.featuredPropertyEnabled && featuredProperty.title && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-blue-600">Featured Property</span>
                    <LiveDataIndicator 
                      isLive={isLiveData.featuredProperty} 
                      size="sm" 
                      lastUpdated={featuredProperty.lastUpdated}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {featuredProperty.isHot && (
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                        HOT
                      </span>
                    )}
                  </div>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{featuredProperty.title}</h4>
                <p className="text-sm text-gray-600 mb-3">
                  {featuredProperty.bedrooms} bed, {featuredProperty.bathrooms} bath • 
                  {featuredProperty.sqft?.toLocaleString()} sq ft • 
                  {featuredProperty.address?.split(',').slice(-2).join(',').trim()}
                </p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(featuredProperty.price)}
                    </div>
                    <div className="text-sm text-gray-500">Property value</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {featuredProperty.expectedROI}%
                    </div>
                    <div className="text-sm text-gray-500">Expected ROI</div>
                  </div>
                </div>
                
                <div className="mt-4 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${featuredProperty.fundingProgress || 0}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{featuredProperty.fundingProgress || 0}% funded</span>
                  <span>{featuredProperty.investors || 0} investors</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HybridHero;
