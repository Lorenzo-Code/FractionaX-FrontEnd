import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlayCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const StreamlinedHero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(147,51,234,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-28 lg:pb-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Trust badge */}
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-300">25,000+ Active Investors</span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Own Real Estate
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Starting at $100
            </span>
          </h1>

          {/* Value proposition */}
          <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join the fractional real estate revolution. Invest in property fractions, earn rewards through community bidding, and build wealth with tokenized ownership.
          </p>

          {/* Key benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2 bg-white/5 rounded-lg py-3 px-4">
              <span className="text-green-400 font-bold">$100</span>
              <span className="text-gray-300">Minimum</span>
            </div>
            <div className="flex items-center justify-center space-x-2 bg-white/5 rounded-lg py-3 px-4">
              <span className="text-blue-400 font-bold">FXCT</span>
              <span className="text-gray-300">Tokens</span>
            </div>
            <div className="flex items-center justify-center space-x-2 bg-white/5 rounded-lg py-3 px-4">
              <span className="text-purple-400 font-bold">Community</span>
              <span className="text-gray-300">Rewards</span>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={() => navigate('/marketplace')}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <span>Start Investing</span>
              <ArrowRightIcon className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                const element = document.getElementById('how-it-works');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto bg-transparent border-2 border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2 hover:bg-white/5"
            >
              <PlayCircleIcon className="w-5 h-5" />
              <span>How It Works</span>
            </button>
          </div>

          {/* Security note */}
          <p className="text-sm text-gray-400 mt-6 max-w-md mx-auto">
            SEC-compliant platform • Institutional-grade security • Real ownership through blockchain
          </p>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </section>
  );
};

export default StreamlinedHero;
