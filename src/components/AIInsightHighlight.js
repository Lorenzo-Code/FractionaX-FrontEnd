import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaChartLine,
  FaSearchDollar,
  FaRobot,
  FaMapMarkedAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const investorWins = [
  {
    title: "🏡 34% ROI in Detroit",
    text: "AI Scoring Engine helped this investor identify an undervalued rental. Net ROI after 12 months: +34%.",
  },
  {
    title: "📍 40% Below Market in Austin",
    text: "Smart Deal Alerts flagged a duplex under market. Bought, rented, and refinanced with $70K equity.",
  },
  {
    title: "⏱️ Deal Closed 2x Faster",
    text: "AI-powered risk filters cut time spent analyzing by 60%, letting the investor strike before the market caught up.",
  },
  {
    title: "💰 18% Cap Rate in Cleveland",
    text: "System recommended a high-yield single-family property. Total cap rate after rehab: 18.2%.",
  },
];

const SmartAIDashboard = () => {
  const carouselRef = useRef(null);

  const scrollBy = (offset) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      scrollBy(320);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-gradient-to-r from-[#E0ECFF] to-[#F5F9FF] py-20 px-6 text-center relative">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl font-bold mb-4">AI-Powered Investing. Built for You.</h2>
        <p className="text-lg text-gray-700 mb-10 max-w-3xl mx-auto">
          FractionaX leverages artificial intelligence to bring clarity to complex investment data—
          helping you discover, analyze, and act faster.
        </p>

        {/* AI Feature Badges */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <div className="flex items-center gap-2 bg-white shadow px-4 py-2 rounded-full text-sm">
            <FaChartLine className="text-blue-500" />
            Predictive Rent Forecasting
          </div>
          <div className="flex items-center gap-2 bg-white shadow px-4 py-2 rounded-full text-sm">
            <FaSearchDollar className="text-green-500" />
            Deal Scoring Engine
          </div>
          <div className="flex items-center gap-2 bg-white shadow px-4 py-2 rounded-full text-sm">
            <FaRobot className="text-purple-500" />
            Automated Risk Analysis
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: <FaChartLine size={24} className="text-blue-600" />,
              title: "Live ROI Tracker",
              desc: "Monitor your rental yield and appreciation in real time.",
            },
            {
              icon: <FaMapMarkedAlt size={24} className="text-red-500" />,
              title: "Risk Heatmaps",
              desc: "Visualize neighborhood risk using vacancy, crime, and trends.",
            },
            {
              icon: <FaSearchDollar size={24} className="text-green-500" />,
              title: "Smart Deal Ratings",
              desc: "AI scores every opportunity based on risk-adjusted ROI.",
            },
            {
              icon: <FaRobot size={24} className="text-purple-600" />,
              title: "Portfolio Assistant",
              desc: "Get personalized AI tips based on your portfolio mix.",
            },
          ].map((card, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 text-left"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="mb-3">{card.icon}</div>
              <h4 className="font-bold text-lg mb-1">{card.title}</h4>
              <p className="text-gray-600 text-sm">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Carousel Header */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-semibold mb-2">Real Wins. AI Powered.</h3>
          <p className="text-gray-600 text-base">
            See how investors are growing their portfolios with FractionaX AI tools.
          </p>
        </div>

        {/* Arrows and Carousel */}
        <div className="relative flex items-center justify-center">
          <button
            className="hidden md:flex absolute left-0 -ml-12 bg-white shadow-lg p-3 rounded-full z-10"
            onClick={() => scrollBy(-320)}
          >
            <FaChevronLeft className="text-gray-700" />
          </button>

          <motion.div
            ref={carouselRef}
            className="flex overflow-x-scroll scroll-smooth gap-6 px-4 scrollbar-hide"
            whileTap={{ cursor: "grabbing" }}
          >

            {investorWins.map((win, index) => (
              <motion.div
                key={index}
                className="w-[90vw] sm:w-[400px] bg-white rounded-2xl p-6 shadow-xl flex-shrink-0 mx-auto"
                whileHover={{ scale: 1.05 }}
              >
                <h4 className="text-xl font-semibold mb-2">{win.title}</h4>
                <p className="text-gray-700 text-sm">{win.text}</p>
              </motion.div>
            ))}
          </motion.div>

          <button
            className="hidden md:flex absolute right-0 -mr-12 bg-white shadow-lg p-3 rounded-full z-10"
            onClick={() => scrollBy(320)}
          >
            <FaChevronRight className="text-gray-700" />
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default SmartAIDashboard;
