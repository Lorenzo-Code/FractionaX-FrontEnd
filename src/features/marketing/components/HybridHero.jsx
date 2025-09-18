import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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

  // Custom styles for animations
  const customStyles = `
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .animate-gradient {
      background-size: 200% 200%;
      animation: gradient 3s ease infinite;
    }
    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.3); }
      50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
    }
    .animate-pulse-glow {
      animation: pulse-glow 2s ease-in-out infinite;
    }
    .bg-gradient-radial {
      background: radial-gradient(circle, var(--tw-gradient-stops));
    }
  `;
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
    // Use slim version for better performance
    await loadSlim(engine);
  }, []);


  // Enhanced particles configuration with immersive dark tech style
  const getParticleConfig = () => {
    const { isMobile, isLowEnd } = deviceCapabilities;
    
    // Optimize particle count based on device capability
    const particleCount = isLowEnd ? 30 : (isMobile ? 60 : 120);
    const enableInteractivity = !isLowEnd;
    
    return {
      fullScreen: { enable: false },
      background: {
        color: {
          value: "transparent" // We'll use a CSS gradient instead
        }
      },
      fpsLimit: 60,
      particles: {
        number: { 
          value: particleCount,
          density: {
            enable: true,
            value_area: 800
          } 
        },
        color: { 
          value: [
            "#3B82F6", // blue-500
            "#60A5FA", // blue-400
            "#2563EB", // blue-600
            "#818CF8", // indigo-400
            "#6366F1", // indigo-500
            "#A855F7", // purple-500
            "#34D399", // emerald-400
            "#10B981"  // emerald-500
          ]
        },
        shape: {
          type: ["circle", "triangle", "polygon"],
          polygon: { nb_sides: 6 },
          stroke: {
            color: "#ffffff",
            width: 1
          }
        },
        opacity: {
          value: { min: 0.1, max: 0.5 },
          random: true,
          anim: {
            enable: true,
            speed: 0.5,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: { 
          value: { min: 1, max: 6 },
          random: true,
          anim: {
            enable: true,
            speed: 2,
            size_min: 0.3,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#a0aec0",
          opacity: 0.2,
          width: 1
        },
        move: { 
          enable: true, 
          speed: isLowEnd ? 1 : 1.5,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "bounce",
          bounce: true,
          attract: {
            enable: true,
            rotateX: 600,
            rotateY: 1200
          }
        },
        life: {
          duration: {
            value: isLowEnd ? 0 : 30, // Disable for low-end devices
            sync: false
          },
          count: 1
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onHover: { 
            enable: enableInteractivity, 
            mode: ["grab", "bubble"] 
          },
          onClick: {
            enable: enableInteractivity,
            mode: "push"
          },
          resize: true
        },
        modes: {
          grab: { 
            distance: 180,
            line_linked: {
              opacity: 0.6
            }
          },
          bubble: {
            distance: 200,
            size: 12,
            duration: 2,
            opacity: 0.8,
            speed: 3
          },
          push: {
            particles_nb: 4
          },
          remove: {
            particles_nb: 2
          }
        },
      },
      detectRetina: true,
      pauseOnBlur: true
    };
  };

  return (
    <>
      {/* Inject custom styles */}
      <style>{customStyles}</style>
      
      <section className="relative bg-gradient-to-br from-gray-900 via-blue-950 to-indigo-950 pt-16 pb-8 px-4 sm:px-6 lg:px-8 border-b border-blue-900/50 overflow-hidden min-h-[85vh] flex items-center">
      {/* Tech Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,24,69,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(0,24,69,0.3)_1px,transparent_1px)] bg-[size:40px_40px] z-0 opacity-40"></div>
      
      {/* Edge light effects */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent z-0"></div>
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent z-0"></div>
      <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-blue-500/50 to-transparent z-0"></div>
      <div className="absolute top-0 bottom-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-indigo-500/30 to-transparent z-0"></div>
      
      {/* Corner light pulse effects */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-radial from-blue-500/20 to-transparent z-0 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-radial from-indigo-500/20 to-transparent z-0 animate-pulse opacity-75"></div>
      
      {/* Particles Background */}
      {deviceCapabilities.shouldRenderParticles && (
        <Particles
          id="hybrid-hero-particles"
          init={particlesInit}
          className="absolute inset-0 w-full h-full z-0"
          options={getParticleConfig()}
        />
      )}
      
      {/* Center Logo */}
      <div className="absolute inset-0 flex items-center justify-center z-0 opacity-25">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-full blur-2xl animate-pulse"></div>
          <img 
            src="/assets/images/fractionax-logo.png" 
            alt="FractionaX Logo" 
            className="w-full h-full object-contain opacity-60"
          />
        </motion.div>
      </div>
      
      {/* Dark gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-blue-950/80 to-indigo-950/90 z-1"></div>
      
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

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Invest in Real Estate
              <br />
              Like Trading Stocks
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-xl">
              Buy fractional shares of real estate. Start with $100. 
              Earn dividends. Trade anytime. All in one platform.
            </p>

            {/* Key Benefits - Robinhood Style */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white">$100 minimum</div>
                  <div className="text-sm text-gray-400">Start small</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Building className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white">Real ownership</div>
                  <div className="text-sm text-gray-400">Legal shares</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white">Earn dividends</div>
                  <div className="text-sm text-gray-400">Monthly income</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white">Trade anytime</div>
                  <div className="text-sm text-gray-400">Liquid market</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons - Coinbase Style */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-600/40 transform hover:-translate-y-0.5"
              >
                Start Investing
                <ArrowRightIcon className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => navigate('/marketplace')}
                className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 hover:border-blue-500 text-gray-300 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 hover:bg-gray-800/80 transform hover:-translate-y-0.5"
              >
                <EyeIcon className="w-5 h-5" />
                Browse Properties
              </button>
            </div>
          </div>

          {/* Right Side - Live Market Stats */}
          <div className="lg:pl-8">
            {/* Market Overview Card - Robinhood Style */}
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-lg shadow-blue-900/20 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-white">Market Overview</h3>
                  <LiveDataIndicator 
                    isLive={isLiveData.marketStats} 
                    size="sm" 
                    lastUpdated={marketStats.lastUpdated}
                  />
                </div>
                <div className="flex items-center gap-1 text-green-500">
                  <ArrowTrendingUpIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">{marketStats.averageRoiFormatted || '0%'} avg ROI</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-2xl font-bold text-blue-400">
                    {loading ? '...' : marketStats.totalVolumeFormatted || '$0'}
                  </div>
                  <div className="text-sm text-gray-400">Total Volume</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-400">
                    {loading ? '...' : marketStats.totalInvestorsFormatted || '0'}
                  </div>
                  <div className="text-sm text-gray-400">Total Investors</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">
                    {loading ? '...' : marketStats.totalListings || 0}
                  </div>
                  <div className="text-sm text-gray-400">Total Listings</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-500">
                    {loading ? '...' : `${marketStats.averageRoi || 0}%`}
                  </div>
                  <div className="text-sm text-gray-400">Average ROI</div>
                </div>
              </div>
            </div>

            {/* Featured Property Card - Zillow Style Preview */}
            {platformSettings.featuredPropertyEnabled && featuredProperty.title && (
              <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-sm rounded-2xl p-6 border border-blue-800/30 shadow-lg shadow-purple-900/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-blue-400">Featured Property</span>
                    <LiveDataIndicator 
                      isLive={isLiveData.featuredProperty} 
                      size="sm" 
                      lastUpdated={featuredProperty.lastUpdated}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {featuredProperty.isHot && (
                      <span className="bg-green-900/60 text-green-400 text-xs font-bold px-2 py-1 rounded">
                        HOT
                      </span>
                    )}
                  </div>
                </div>
                <h4 className="font-bold text-white mb-2">{featuredProperty.title}</h4>
                <p className="text-sm text-gray-300 mb-3">
                  {featuredProperty.bedrooms} bed, {featuredProperty.bathrooms} bath • 
                  {featuredProperty.sqft?.toLocaleString()} sq ft • 
                  {featuredProperty.address?.split(',').slice(-2).join(',').trim()}
                </p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-blue-400">
                      {formatCurrency(featuredProperty.price)}
                    </div>
                    <div className="text-sm text-gray-400">Property value</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-500">
                      {featuredProperty.expectedROI}%
                    </div>
                    <div className="text-sm text-gray-400">Expected ROI</div>
                  </div>
                </div>
                
                <div className="mt-4 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300 shadow-inner shadow-blue-400/30"
                    style={{ width: `${featuredProperty.fundingProgress || 0}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{featuredProperty.fundingProgress || 0}% funded</span>
                  <span>{featuredProperty.investors || 0} investors</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </section>
    </>
  );
};

export default HybridHero;
