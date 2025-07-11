import React, { useCallback, useEffect, useState } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { motion } from "framer-motion";

const HeroSection = () => {
  console.log("🚀 HeroSection is mounting");

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    console.log("🎯 HeroSection useEffect fired");
    setIsMobile(window.innerWidth < 768);
  }, []);

  const particlesInit = useCallback(async (engine) => {
    console.log("💥 particlesInit called");
    await loadSlim(engine);
    console.log("✅ Slim engine loaded");
  }, []);

  const handleExploreClick = () => {
    const target = document.getElementById("marketplace-section");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const baseParticles = {
    fullScreen: { enable: false },
    particles: {
      number: { value: isMobile ? 15 : 60 },
      size: { value: 3 },
      color: { value: "#3E92CC" },
      links: {
        enable: true,
        color: "#3E92CC",
        distance: 130,
        opacity: 0.4,
        width: 1,
      },
      move: { enable: true, speed: 1.2 },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
      },
      modes: {
        repulse: { distance: 100 },
      },
    },
  };

  return (
    <div className="relative min-h-[83vh] flex items-center justify-center bg-[#0C0F1C] overflow-hidden">
      {/* Conditionally Rendered Particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        className="absolute inset-0 w-full h-full z-0"
        options={baseParticles}
      />

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
          className="mx-auto w-41 sm:w-53 md:w-73 mb-6"
        />

        <h4 className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Discover smarter, fractional property investments with built-in AI insights and crypto-powered returns.
        </h4>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#3E92CC] text-white px-5 py-3 text-sm sm:text-base rounded-xl shadow-md hover:bg-[#2C699A] transition"
          >
            Connect Wallet
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExploreClick}
            className="bg-white text-[#1B2A41] px-5 py-3 text-sm sm:text-base rounded-xl shadow-md hover:bg-gray-100 transition border border-gray-200"
          >
            Explore Marketplace
          </motion.button>
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
