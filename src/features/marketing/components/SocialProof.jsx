import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { useHomepageDisplay } from '../../../hooks/useHomepageData';
import { LiveDataIndicator } from '../../../shared/components';

const SocialProof = () => {
  const { 
    communityStats, 
    testimonials, 
    platformSettings, 
    loading,
    isLiveData
  } = useHomepageDisplay();

  const stats = [
    {
      value: loading ? '...' : communityStats.activeInvestorsFormatted || '0',
      label: "Active Investors",
      description: "Growing community"
    },
    {
      value: loading ? '...' : communityStats.totalInvestedFormatted || '$0',
      label: "Total Invested",
      description: "Capital deployed"
    },
    {
      value: loading ? '...' : (communityStats.propertiesFunded || 0).toString(),
      label: "Properties Funded",
      description: "Successful investments"
    },
    {
      value: loading ? '...' : communityStats.avgAnnualReturnFormatted || '0%',
      label: "Avg. Annual Return",
      description: "Historical performance"
    }
  ];

  // Don't render if testimonials are disabled
  if (!platformSettings.testimonialsEnabled) {
    return null;
  }

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Stats section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Trusted by Thousands of Investors
            </h2>
            <LiveDataIndicator 
              isLive={isLiveData.communityStats} 
              size="md" 
              lastUpdated={communityStats.lastUpdated}
            />
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Join a growing community that's democratizing real estate investment
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials section */}
        <div>
          <div className="flex items-center justify-center gap-3 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 text-center">
              What Our Investors Say
            </h3>
            <LiveDataIndicator 
              isLive={isLiveData.testimonials} 
              size="sm" 
              lastUpdated={testimonials[0]?.lastUpdated}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
              >
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 mb-6">Trusted and secured by</p>
          <div className="flex items-center justify-center space-x-8 opacity-70">
            <div className="text-gray-400 font-semibold">SEC Compliant</div>
            <div className="text-gray-400 font-semibold">Bank-Level Security</div>
            <div className="text-gray-400 font-semibold">Blockchain Verified</div>
            <div className="text-gray-400 font-semibold">Insured Assets</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
