// File: FXCTPreSale.jsx
import React from "react";
import { motion } from "framer-motion";

export default function FXCTPreSale() {
  return (
    <section className="bg-black text-white min-h-screen px-6 sm:px-12 py-16 flex flex-col items-center justify-center">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-center max-w-3xl"
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
          The Future of Fractional Investing Starts Now
        </h1>
        <p className="text-lg sm:text-xl mb-8">
          Join the FXCT token pre-sale and gain early access to exclusive tools, real estate reports,
          and discounted fees across the entire FractionaX ecosystem.
        </p>
        <form
          action="https://api.fractionax.io/waitlist"
          method="POST"
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            className="px-4 py-3 rounded-lg text-black text-base w-full sm:w-80"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold px-6 py-3 rounded-lg hover:scale-105 transition"
          >
            Join Pre-Sale
          </button>
        </form>
        <p className="mt-4 text-sm opacity-70">Pre-sale opens: <strong>Sept 20, 2025</strong></p>
      </motion.div>

      {/* Countdown */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-12 text-center"
      >
        <h2 className="text-2xl font-bold mb-2">Countdown to Pre-Sale</h2>
        <div id="countdown" className="text-3xl sm:text-4xl font-mono mt-2">
          {/* Optional: add countdown timer script */}
        </div>
      </motion.div>

      {/* Utility / Benefits */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl"
      >
        {[
          {
            title: "Access Tokenized Deals",
            desc: "Get priority access to real estate investments and split-ownership assets.",
          },
          {
            title: "AI-Powered Property Reports",
            desc: "Use FXCT to unlock deep insights and data-backed AI reports.",
          },
          {
            title: "Reduced Platform Fees",
            desc: "Token holders enjoy lower transaction fees and staking rewards.",
          },
        ].map(({ title, desc }) => (
          <div key={title} className="bg-gray-900 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-sm text-gray-300">{desc}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
