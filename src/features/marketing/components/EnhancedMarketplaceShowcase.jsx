import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRightIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { TrendingUp, Users, Clock } from 'lucide-react';

const EnhancedMarketplaceShowcase = ({ 
  title = "Live Investment Opportunities",
  description = "Discover fractional real estate investments with $100 minimum. Start building wealth through community-driven property ownership."
}) => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for featured properties - replace with API call
  useEffect(() => {
    const mockProperties = [
      {
        id: 1,
        title: "Austin Tech District Apartment",
        location: "Austin, TX",
        price: 485000,
        minInvestment: 100,
        currentInvestors: 47,
        fundingProgress: 68,
        expectedROI: 14.2,
        monthlyRent: 3200,
        propertyType: "Multi-Family",
        timeLeft: "2 days",
        image: "/api/placeholder/400/300",
        featured: true
      },
      {
        id: 2,
        title: "Miami Beach Luxury Condo",
        location: "Miami Beach, FL",
        price: 720000,
        minInvestment: 150,
        currentInvestors: 32,
        fundingProgress: 45,
        expectedROI: 11.8,
        monthlyRent: 4800,
        propertyType: "Luxury Condo",
        timeLeft: "5 days",
        image: "/api/placeholder/400/300"
      },
      {
        id: 3,
        title: "Denver Family Home",
        location: "Denver, CO",
        price: 425000,
        minInvestment: 100,
        currentInvestors: 28,
        fundingProgress: 85,
        expectedROI: 13.5,
        monthlyRent: 2800,
        propertyType: "Single Family",
        timeLeft: "1 day",
        image: "/api/placeholder/400/300"
      }
    ];

    // Simulate loading
    setTimeout(() => {
      setFeaturedProperties(mockProperties);
      setLoading(false);
    }, 800);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <section id="marketplace-section" className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {description}
          </p>
          
          {/* Quick stats */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
              <Users className="w-4 h-4" />
              <span className="font-semibold">25,000+ Investors</span>
            </div>
            <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
              <CurrencyDollarIcon className="w-4 h-4" />
              <span className="font-semibold">$100 Minimum</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full">
              <TrendingUp className="w-4 h-4" />
              <span className="font-semibold">50+ Active Properties</span>
            </div>
          </div>
        </div>

        {/* Featured Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          <AnimatePresence>
            {loading ? (
              // Loading skeletons
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              featuredProperties.map((property) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
                >
                  {/* Property Image */}
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    
                    {/* Featured badge */}
                    {property.featured && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          FEATURED
                        </span>
                      </div>
                    )}
                    
                    {/* Property type */}
                    <div className="absolute top-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      {property.propertyType}
                    </div>

                    {/* Time left indicator */}
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                      <Clock className="w-3 h-3 text-orange-500" />
                      {property.timeLeft} left
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                        {property.title}
                      </h3>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {property.expectedROI}%
                        </div>
                        <div className="text-xs text-gray-500">Expected ROI</div>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      <span className="text-sm">{property.location}</span>
                    </div>

                    <div className="space-y-3 mb-4">
                      {/* Investment details */}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Property Value</span>
                        <span className="font-semibold">{formatCurrency(property.price)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Min. Investment</span>
                        <span className="font-semibold text-green-600">{formatCurrency(property.minInvestment)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Monthly Rent</span>
                        <span className="font-semibold">{formatCurrency(property.monthlyRent)}</span>
                      </div>

                      {/* Funding progress */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Funding Progress</span>
                          <span className="font-medium">{property.fundingProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${property.fundingProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Investor count */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-600">
                        <UsersIcon className="w-4 h-4 mr-1" />
                        <span>{property.currentInvestors} investors</span>
                      </div>
                      <Link 
                        to={`/property/${property.id}`}
                        className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
                      >
                        Invest Now
                        <ArrowRightIcon className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Your Investment Journey?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Browse our full marketplace of 50+ properties across major US markets. 
              Start with just $100 and build your real estate portfolio today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/marketplace">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2">
                  View All Properties
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              </Link>
              
              <Link to="/login">
                <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-all duration-200">
                  Create Free Account
                </button>
              </Link>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              No fees to browse • SEC-compliant investments • Start investing in minutes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedMarketplaceShowcase;
