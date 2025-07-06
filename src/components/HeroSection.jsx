import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Particles from "@tsparticles/react";
import { loadBasic } from "@tsparticles/basic";

const Hero = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadBasic(engine);
  }, []);

  return (
    <div className="relative h-screen bg-[#0C0F1C] overflow-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        className="absolute inset-0 z-0"
        options={{
          fullScreen: { enable: false },
          particles: {
            number: { value: 70 },
            size: { value: 2.5 },
            move: { enable: true, speed: 1.2 },
            links: {
              enable: true,
              distance: 140,
              opacity: 0.25,
              color: "#3E92CC"
            },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
            },
            modes: {
              repulse: { distance: 100 },
            },
          },
        }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full text-white px-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <img
          src="/assets/images/MainLogo1.png"
          alt="FractionaX"
          className="w-44 md:w-64 mb-6 object-contain"
        />

        <h4 className="text-lg md:text-xl text-gray-300 max-w-xl mb-10">
          Discover smarter, fractional property investments with built-in AI insights and crypto-powered returns.
        </h4>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#3E92CC] text-white px-6 py-3 rounded-2xl shadow-md hover:bg-[#2C699A] transition w-60"
          >
            Connect Wallet
          </motion.button>

          <Link to="/marketplace">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-[#1B2A41] px-6 py-3 rounded-2xl shadow-md hover:bg-gray-100 transition border border-gray-200 w-60"
            >
              Explore Marketplace
            </motion.button>
          </Link>
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

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-10" />
    </div>
  );
};

export default Hero;
