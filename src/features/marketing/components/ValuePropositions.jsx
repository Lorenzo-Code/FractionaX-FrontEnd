import React from 'react';
import { 
  CurrencyDollarIcon, 
  UsersIcon, 
  ChartBarIcon, 
  ShieldCheckIcon,
  SparklesIcon,
  HomeIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const ValuePropositions = () => {
  const benefits = [
    {
      icon: CurrencyDollarIcon,
      title: "Start Small, Dream Big",
      description: "Begin investing in premium real estate with just $100. No need for massive capital or complex financing.",
      highlight: "$100 minimum"
    },
    {
      icon: UsersIcon,
      title: "Community-Powered",
      description: "Join thousands of investors in collaborative bidding. Your participation validates market demand and earns rewards.",
      highlight: "25K+ investors"
    },
    {
      icon: HomeIcon,
      title: "Real Ownership",
      description: "Own actual property fractions through blockchain tokens. Your FXST tokens represent real estate value, not just promises.",
      highlight: "True ownership"
    },
    {
      icon: SparklesIcon,
      title: "Earn While You Invest",
      description: "Get FXCT token rewards for bidding, referring friends, and contributing to the community marketplace.",
      highlight: "Token rewards"
    },
    {
      icon: ChartBarIcon,
      title: "Transparent Returns",
      description: "Track your portfolio performance with real-time data. See rental income, appreciation, and token rewards all in one place.",
      highlight: "Clear tracking"
    },
    {
      icon: ShieldCheckIcon,
      title: "SEC-Compliant Security",
      description: "Institutional-grade security meets regulatory compliance. Your investments are protected by both technology and law.",
      highlight: "Fully compliant"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Fractional Real Estate?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Traditional real estate investing has barriers. We've removed them all while keeping the benefits.
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div 
                key={index} 
                className="group relative p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg"
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>

                {/* Highlight badge */}
                <div className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
                  {benefit.highlight}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Ready to learn more about how fractional investing works?
          </p>
          <button
            onClick={() => {
              const element = document.getElementById('how-it-works');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
          >
            Explore the process
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ValuePropositions;
