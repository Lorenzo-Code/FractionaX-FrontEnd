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
    
    // Enhanced particle count for more noticeable effect
    const particleCount = isLowEnd ? 20 : (isMobile ? 40 : 120);
    const enableInteractivity = !isLowEnd;
    
    return {
      fullScreen: { enable: false },
      particles: {
        number: { value: particleCount },
        size: { 
          value: { min: 2, max: 6 },
          animation: {
            enable: true,
            speed: 3,
            minimumValue: 1
          }
        },
        color: { 
          value: ["#3E92CC", "#60D394", "#FFD23F", "#EE6C4D", "#B794F6"] 
        },
        shape: {
          type: ["circle", "triangle", "polygon"],
          options: {
            polygon: {
              sides: 6
            }
          }
        },
        opacity: {
          value: { min: 0.3, max: 0.8 },
          animation: {
            enable: true,
            speed: 2,
            minimumValue: 0.1,
            sync: false
          }
        },
        links: {
          enable: true,
          color: "#3E92CC",
          distance: isLowEnd ? 100 : 160,
          opacity: isLowEnd ? 0.4 : 0.6,
          width: 2,
          triangles: {
            enable: true,
            color: "#60D394",
            opacity: 0.1
          }
        },
        move: { 
          enable: true, 
          speed: isLowEnd ? 1.5 : 2.5,
          direction: "none",
          random: true,
          straight: false,
          outModes: {
            default: "bounce"
          },
          attract: {
            enable: true,
            rotateX: 600,
            rotateY: 1200
          }
        },
      },
      interactivity: {
        detectsOn: "window",
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
            distance: 200,
            links: {
              opacity: 1,
              color: "#60D394"
            }
          },
          bubble: {
            distance: 250,
            size: 12,
            duration: 2,
            opacity: 0.8
          },
          push: {
            quantity: 4
          },
          repulse: { 
            distance: 150,
            duration: 0.4
          }
        },
      },
      background: {
        color: {
          value: "transparent"
        }
      }
    };
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 overflow-hidden">
      {/* Animated Tech Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(96, 211, 148, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(96, 211, 148, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }}
      />
      
      {/* Conditionally Rendered Particles */}
      {deviceCapabilities.shouldRenderParticles && (
        <Particles
          id="tsparticles"
          init={particlesInit}
          className="absolute inset-0 w-full h-full z-10"
          options={getParticleConfig()}
        />
      )}
      
      {/* Pulsing Edge Lights */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse opacity-30" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse opacity-30" />
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-blue-400 to-transparent animate-pulse opacity-30" />
      <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent animate-pulse opacity-30" />
      
      {/* Corner Accent Lights */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-radial from-cyan-400/20 to-transparent blur-xl animate-pulse" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-blue-400/20 to-transparent blur-xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-radial from-green-400/20 to-transparent blur-xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-radial from-purple-400/20 to-transparent blur-xl animate-pulse" />
      
      {/* Add some CSS for animations */}
      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>

      <motion.div
        className="relative z-20 text-center px-4 md:px-6 text-white"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="relative mb-8">
          <img
            src="/assets/images/MainLogo1.webp"
            alt="FractionaX"
            width="350"
            height="120"
            className="mx-auto w-[280px] sm:w-[300px] md:w-[340px] lg:w-[380px] drop-shadow-2xl filter brightness-110"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(94, 146, 204, 0.4)) drop-shadow(0 0 40px rgba(96, 211, 148, 0.2))'
            }}
          />
          {/* Subtle glow background */}
          <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 via-transparent to-transparent blur-3xl scale-150 -z-10" />
        </div>

        {/* Enhanced Investment-focused headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight max-w-5xl mx-auto drop-shadow-lg">
          Invest in Real Estate with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 animate-pulse"
                style={{
                  textShadow: '0 0 30px rgba(96, 211, 148, 0.5)',
                  filter: 'drop-shadow(0 0 10px rgba(96, 211, 148, 0.8))'
                }}>
            Just $100
          </span>{' '}
          <br />Build Wealth Together
        </h1>

        {/* Simplified, clearer value proposition */}
        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
          Join 25,000+ investors in fractional real estate ownership. Start with $100, earn rewards through community bidding, and build passive income from real properties.
        </p>

        {/* Enhanced trust indicators with tech innovation styling */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8">
          <div className="flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-400/40 px-5 py-3 rounded-full text-white shadow-lg hover:shadow-green-400/25 transition-all duration-300 hover:scale-105">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 drop-shadow-lg" />
            <span className="text-sm sm:text-base font-medium">SEC Compliant</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-400/40 px-5 py-3 rounded-full text-white shadow-lg hover:shadow-blue-400/25 transition-all duration-300 hover:scale-105">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 drop-shadow-lg" />
            <span className="text-sm sm:text-base font-medium">25K+ Investors</span>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 backdrop-blur-sm border border-yellow-400/40 px-5 py-3 rounded-full text-white shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 hover:scale-105">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 drop-shadow-lg" />
            <span className="text-sm sm:text-base font-medium">Real Ownership</span>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
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
          <linearGradient id="techGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="50%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>
        <path
          fill="url(#techGradient)"
          d="M0,128L48,133.3C96,139,192,149,288,160C384,171,480,181,576,176C672,171,768,149,864,144C960,139,1056,149,1152,149.3C1248,149,1344,139,1392,133.3L1440,128L1440,320L0,320Z"
        />
      </svg>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white via-gray-100 to-transparent" />
    </div>
  );
};

export default HeroSection;
