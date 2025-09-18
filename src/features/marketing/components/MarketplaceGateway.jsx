import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRightIcon, 
  MapPinIcon, 
  ClockIcon,
  FireIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const MarketplaceGateway = () => {
  const navigate = useNavigate();

  // Mock featured opportunities data
  const featuredOpportunities = [
    {
      id: 1,
      title: "Austin Tech District Apartment",
      location: "Austin, TX",
      price: "$485,000",
      minInvestment: "$100",
      currentBids: 47,
      timeLeft: "2 days",
      fundingProgress: 68,
      image: "/api/placeholder/300/200",
      roi: "14.2%",
      type: "Multi-Family"
    },
    {
      id: 2,
      title: "Miami Beach Condo",
      location: "Miami, FL", 
      price: "$720,000",
      minInvestment: "$150",
      currentBids: 32,
      timeLeft: "5 days",
      fundingProgress: 45,
      image: "/api/placeholder/300/200",
      roi: "11.8%",
      type: "Luxury Condo"
    },
    {
      id: 3,
      title: "Denver Family Home",
      location: "Denver, CO",
      price: "$425,000", 
      minInvestment: "$100",
      currentBids: 28,
      timeLeft: "1 day",
      fundingProgress: 85,
      image: "/api/placeholder/300/200",
      roi: "13.5%",
      type: "Single Family"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Live Investment Opportunities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore current properties available for fractional investment. Start bidding and join the community.
          </p>
        </div>

        {/* Featured opportunities */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredOpportunities.map((opportunity) => (
            <div 
              key={opportunity.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Property image */}
              <div className="relative h-48 bg-gray-200">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    <FireIcon className="w-3 h-3 mr-1" />
                    HOT
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-black/50 text-white text-xs font-medium px-2 py-1 rounded">
                  {opportunity.type}
                </div>
              </div>

              {/* Property details */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                    {opportunity.title}
                  </h3>
                  <div className="text-right ml-2">
                    <div className="text-sm font-medium text-green-600">
                      {opportunity.roi} ROI
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-gray-600 mb-4">
                  <MapPinIcon className="w-4 h-4 mr-1" />
                  <span className="text-sm">{opportunity.location}</span>
                </div>

                <div className="space-y-3">
                  {/* Investment details */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Value</span>
                    <span className="font-semibold text-gray-900">{opportunity.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Min. Investment</span>
                    <span className="font-semibold text-green-600">{opportunity.minInvestment}</span>
                  </div>

                  {/* Funding progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Funding Progress</span>
                      <span className="font-medium text-gray-900">{opportunity.fundingProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${opportunity.fundingProgress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Activity indicators */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-600">
                      <UsersIcon className="w-4 h-4 mr-1" />
                      <span>{opportunity.currentBids} bids</span>
                    </div>
                    <div className="flex items-center text-sm text-orange-600">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      <span>{opportunity.timeLeft} left</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gateway CTA */}
        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Explore More Properties?
            </h3>
            <p className="text-gray-600 mb-6">
              Access our full marketplace with 50+ active investment opportunities across major US markets.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => navigate('/marketplace')}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
              >
                <span>View Full Marketplace</span>
                <ArrowRightIcon className="w-5 h-5" />
              </button>

              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                Create Free Account
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              No fees to browse • No commitments • Start investing when you're ready
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const UsersIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

export default MarketplaceGateway;
