import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import SEO from '../components/SEO';

const NotFoundPage = () => {
  const navigate = useNavigate();
  
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
    <>
      <SEO
        title="Page Not Found | FractionaX"
        description="The page you're looking for doesn't exist. Navigate back to FractionaX to explore our AI-powered real estate tokenization platform."
        keywords={["404", "page not found", "FractionaX", "real estate", "tokenization"]}
        canonical="/404"
        openGraph={{
          type: 'website',
          title: 'Page Not Found | FractionaX',
          description: 'The page you\'re looking for doesn\'t exist. Navigate back to FractionaX to explore our real estate platform.',
          url: '/404',
          site_name: 'FractionaX'
        }}
        robots="noindex, nofollow"
      />
      <div className="relative min-h-screen bg-[#0C0F1C] overflow-hidden flex items-center justify-center px-4">
      {/* Particle Background */}
      {deviceCapabilities.shouldRenderParticles && (
        <Particles
          id="404-particles"
          init={particlesInit}
          className="absolute inset-0 w-full h-full z-0"
          options={getParticleConfig()}
        />
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-2xl mx-auto"
      >
        {/* FractionaX Logo */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <img
            src="/assets/images/MainLogo1.webp"
            alt="FractionaX"
            className="mx-auto w-48 md:w-64 mb-8 opacity-80"
          />
        </motion.div>

        {/* 404 Number */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.4 }}
          className="mb-6"
        >
          <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 drop-shadow-lg">
            404
          </h1>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-300 text-lg mb-2">
            The page you're looking for seems to have moved to a different property address.
          </p>
          <p className="text-gray-400 text-sm">
            Don't worry, our AI can help you find what you're looking for!
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            to="/home"
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <span className="relative z-10">🏠 Back to Home</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>

          <Link
            to="/marketplace"
            className="group px-8 py-4 border-2 border-blue-400 text-blue-400 font-semibold rounded-xl hover:bg-blue-400 hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            🏘️ Explore Properties
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="group px-8 py-4 border-2 border-gray-400 text-gray-400 font-semibold rounded-xl hover:bg-gray-400 hover:text-[#0C0F1C] transition-all duration-300 transform hover:scale-105"
          >
            ← Go Back
          </button>
        </motion.div>

        {/* Fun Real Estate Joke */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
        >
          <p className="text-gray-300 text-sm italic">
            💡 "In real estate, location is everything. Unfortunately, this page's location is nowhere to be found!"
          </p>
        </motion.div>

        {/* Floating Property Icons */}
        <div className="absolute top-20 left-10 text-blue-400/20 text-6xl animate-bounce">
          🏢
        </div>
        <div className="absolute bottom-20 right-10 text-cyan-400/20 text-5xl animate-pulse">
          🏘️
        </div>
        <div className="absolute top-1/3 right-20 text-blue-300/20 text-4xl animate-ping">
          🏠
        </div>
      </motion.div>
      </div>
    </>
  );
};

export default NotFoundPage;
