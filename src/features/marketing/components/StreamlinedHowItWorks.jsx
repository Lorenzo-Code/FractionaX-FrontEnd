import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlusIcon, 
  MagnifyingGlassIcon, 
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

const StreamlinedHowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      id: 1,
      title: "Create Your Account",
      description: "Sign up for free in under 2 minutes. No credit checks, no complex paperwork.",
      icon: UserPlusIcon,
      color: "from-blue-500 to-blue-600",
      time: "2 min"
    },
    {
      id: 2,
      title: "Browse Properties",
      description: "Explore fractional investment opportunities. Filter by location, budget, and expected returns.",
      icon: MagnifyingGlassIcon,
      color: "from-purple-500 to-purple-600",
      time: "5 min"
    },
    {
      id: 3,
      title: "Start Investing",
      description: "Use FXCT tokens to bid on properties. Successful bids convert to FXST ownership tokens.",
      icon: CurrencyDollarIcon,
      color: "from-green-500 to-green-600",
      time: "1 min"
    },
    {
      id: 4,
      title: "Earn & Track Returns",
      description: "Monitor rental income, property appreciation, and token rewards in your dashboard.",
      icon: ArrowTrendingUpIcon,
      color: "from-orange-500 to-orange-600",
      time: "Ongoing"
    }
  ];

  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            How Fractional Investing Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Four simple steps to start building your real estate portfolio today
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gray-200"></div>
          <div className="hidden lg:block absolute top-16 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-orange-500 transition-all duration-1000" style={{width: '75%'}}></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={step.id} className="text-center">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${step.color} text-white shadow-lg mb-6 relative z-10`}>
                    <IconComponent className="w-8 h-8" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {step.description}
                  </p>
                  
                  {/* Time badge */}
                  <div className="inline-block bg-gray-100 text-gray-600 text-sm font-medium px-3 py-1 rounded-full">
                    {step.time}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Example flow */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Example: Your First $100 Investment
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">$100</div>
              <div className="font-semibold text-gray-900 mb-1">You Invest</div>
              <div className="text-sm text-gray-600">In Austin apartment property</div>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">0.02%</div>
              <div className="font-semibold text-gray-900 mb-1">You Own</div>
              <div className="text-sm text-gray-600">Of a $500K property</div>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">$1.20</div>
              <div className="font-semibold text-gray-900 mb-1">Monthly Income</div>
              <div className="text-sm text-gray-600">Plus appreciation + rewards</div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/marketplace')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 mx-auto"
          >
            <span>Start Your Investment Journey</span>
            <ArrowRightIcon className="w-5 h-5" />
          </button>
          
          <p className="text-sm text-gray-500 mt-4">
            Join 25,000+ investors • $100 minimum • No hidden fees
          </p>
        </div>
      </div>
    </section>
  );
};

export default StreamlinedHowItWorks;
