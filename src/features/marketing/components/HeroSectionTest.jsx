import React, { useCallback, useEffect, useState } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { motion } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link } from "react-router-dom";
import { Play, TrendingUp, Users, Shield, Star, ArrowRight } from "lucide-react";


const HeroSection = () => {
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    isMobile: false,
    isLowEnd: false,
    shouldRenderParticles: true
  });

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

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const handleExploreClick = () => {
    const target = document.getElementById("marketplace-section");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getParticleConfig = () => {
    const { isMobile, isLowEnd } = deviceCapabilities;
    
    // Reduce particle count and effects for low-end devices
    const particleCount = isLowEnd ? 8 : (isMobile ? 15 : 60);
    const enableInteractivity = !isLowEnd;
    
    return {
      fullScreen: { enable: false },
      particles: {
        number: { value: particleCount },
        size: { value: 3 },
        color: { value: "#3E92CC" },
        links: {
          enable: true,
          color: "#3E92CC",
          distance: isLowEnd ? 80 : 130,
          opacity: isLowEnd ? 0.2 : 0.4,
          width: 1,
        },
        move: { 
          enable: true, 
          speed: isLowEnd ? 0.8 : 1.2 
        },
      },
      interactivity: {
        events: {
          onHover: { 
            enable: enableInteractivity, 
            mode: "repulse" 
          },
        },
        modes: {
          repulse: { distance: 100 },
        },
      },
    };
  };

  return (
    <div className="relative min-h-[83vh] flex items-center justify-center bg-[#0C0F1C] overflow-hidden">
      {/* Conditionally Rendered Particles */}
      {deviceCapabilities.shouldRenderParticles && (
        <Particles
          id="tsparticles"
          init={particlesInit}
          className="absolute inset-0 w-full h-full z-0"
          options={getParticleConfig()}
        />
      )}

      <motion.div
        className="relative z-10 text-center px-4 md:px-6 text-white"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <img
          src="/assets/images/MainLogo1.webp"
          alt="FractionaX"
          width="350"
          height="120"
          className="mx-auto w-[250px] sm:w-[240px] md:w-[280px] lg:w-[320px] mb-6"
        />

        {/* Enhanced Investment-focused headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight max-w-5xl mx-auto">
          Invest in Real Estate with 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
            Just $100
          </span> 
          <br />Build Wealth Together
        </h1>

        {/* Simplified, clearer value proposition */}
        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
          Join 25,000+ investors in fractional real estate ownership. Start with $100, earn rewards through community bidding, and build passive income from real properties.
        </p>

        {/* Enhanced trust indicators with better messaging */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-white">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
            <span className="text-sm sm:text-base font-medium">SEC Compliant</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-white">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            <span className="text-sm sm:text-base font-medium">25K+ Investors</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-white">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
            <span className="text-sm sm:text-base font-medium">Real Ownership</span>
          </div>
        </div>

        {/* Simplified, clearer CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link to="/marketplace">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 w-full sm:min-w-[220px] flex items-center justify-center gap-2"
            >
              Start Investing Now
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-transparent border-2 border-white/40 text-white px-6 py-4 text-lg font-semibold rounded-xl hover:bg-white/10 transition-all duration-200 w-full sm:min-w-[180px] flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            How It Works
          </motion.button>
        </div>

        {/* Key benefits - cleaner design */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-green-400">
            <Star className="w-4 h-4" />
            <span className="font-medium">$100 minimum investment</span>
          </div>
          <span className="hidden sm:inline text-white/30">•</span>
          <div className="flex items-center gap-2 text-blue-400">
            <Star className="w-4 h-4" />
            <span className="font-medium">Community rewards</span>
          </div>
          <span className="hidden sm:inline text-white/30">•</span>
          <div className="flex items-center gap-2 text-yellow-400">
            <Star className="w-4 h-4" />
            <span className="font-medium">Real property ownership</span>
          </div>
        </div>

      </motion.div>

      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 320"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="softGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="10%" stopColor="#0C0F1C" />
            <stop offset="35%" stopColor="#ffffff" />
          </linearGradient>
        </defs>
        <path
          fill="url(#softGradient)"
          d="M0,128L48,133.3C96,139,192,149,288,160C384,171,480,181,576,176C672,171,768,149,864,144C960,139,1056,149,1152,149.3C1248,149,1344,139,1392,133.3L1440,128L1440,320L0,320Z"
        />
      </svg>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent" />
    </div>
  );
};

export default HeroSection;
