import React, { useEffect } from "react";
import { motion } from "framer-motion";

const Hero = () => {
  useEffect(() => {
    if (window.particlesJS) {
      window.particlesJS("particles-js", {
        particles: {
          number: { value: 75, density: { enable: true, value_area: 800 } },
          color: { value: "#3E92CC" },
          shape: {
            type: "circle",
            stroke: { width: 0, color: "#000000" },
          },
          opacity: {
            value: 0.6,
            random: false,
          },
          size: {
            value: 3,
            random: true,
          },
          line_linked: {
            enable: true,
            distance: 130,
            color: "#3E92CC",
            opacity: 0.3,
            width: 1,
          },
          move: {
            enable: true,
            speed: 1.5,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "bounce",
            bounce: true,
          },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: true, mode: "push" },
            resize: true,
          },
          modes: {
            repulse: { distance: 100, duration: 0.4 },
            push: { particles_nb: 4 },
          },
        },
        retina_detect: true,
      });
    } else {
      console.error("particlesJS is not available on window.");
    }
  }, []);

  return (
    <div
      className="relative min-h-[90vh] flex items-center justify-center"
      style={{ backgroundColor: "#0C0F1C" }}
    >
      <div id="particles-js" className="absolute inset-0" style={{ zIndex: 1 }}></div>

      <motion.div
        className="relative z-10 text-center px-6 text-white"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <img
          src="/assets/images/MainLogo1.png"
          alt="FractionaX"
          className="mx-auto w-56 md:w-80 mb-1"
        />
        <h4 className="text-lg md:text-x1 text-gray-300 mb-10 max-w-2xl mx-auto">
          Discover smarter, fractional property investments with built-in AI insights and crypto-powered returns.
        </h4>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#3E92CC] text-white px-6 py-3 rounded-2xl shadow-md hover:bg-[#2C699A] transition"
          >
            Connect Wallet
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-[#1B2A41] px-6 py-3 rounded-2xl shadow-md hover:bg-gray-100 transition border border-gray-200"
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
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
};

export default Hero;
