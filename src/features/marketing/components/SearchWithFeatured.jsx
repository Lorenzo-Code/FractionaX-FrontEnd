import SmartPropertySearch from "../../admin/ai-search/components/SmartPropertySearch";
import PropertyCard from "../../admin/ai-search/components/PropertyCard";
import { FiTrendingUp, FiEye, FiStar, FiMapPin, FiDollarSign } from "react-icons/fi";
import { BsCoin } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

// Get API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_BASE_API_URL || 'http://localhost:3000';

export default function SearchWithFeatured({ 
  onSearch, 
  showListings = true, 
  title = "Smart Real Estate Search. AI-Powered Returns.",
  description = "Describe your ideal deal — or start with a suggestion below. These are examples of what's possible.",
  showSearch = true 
}) {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch featured properties from API
  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setLoading(true);
        console.log('🏠 Fetching featured properties for homepage...');
        
        const response = await axios.get(`${API_BASE_URL}/api/properties/featured`, {
          timeout: 10000, // 10 second timeout
        });
        
        // Handle different possible API response formats
        let properties = [];
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          properties = response.data.data;
        } else if (response.data && Array.isArray(response.data)) {
          properties = response.data;
        } else if (response.data && response.data.properties && Array.isArray(response.data.properties)) {
          properties = response.data.properties;
        } else {
          console.warn('⚠️ Unexpected API response format:', response.data);
          throw new Error('Invalid response format - no property array found');
        }
        
        console.log('✅ Successfully fetched featured properties:', properties.length);
        setFeaturedProperties(properties.slice(0, 4)); // Ensure we only show 4 properties
      } catch (err) {
        console.error('❌ Error fetching featured properties:', err);
        setError(err.message);
        
        // Fallback to curated properties if API fails
        const fallbackProperties = [
          {
            id: 'fallback-1',
            title: 'Modern Duplex in Heights',
            address: '1847 Heights Blvd, Houston, TX 77008',
            price: 425000,
            beds: 4,
            baths: 3,
            sqft: 2100,
            propertyType: 'duplex',
            expectedROI: 9.8,
            monthlyRent: 3200,
            images: ['/api/placeholder/800/600'],
            tokenized: true,
            tokenPrice: 212,
            availableTokens: 1200,
            totalTokens: 2000,
            stats: {
              views: 2847,
              saves: 156,
              daysOnMarket: 3
            },
            features: ['pool', 'garage', 'updated_kitchen', 'investment_grade']
          },
          {
            id: 'fallback-2',
            title: 'Downtown Atlanta High-Rise Condo',
            address: '400 Peachtree St NE, Atlanta, GA 30308',
            price: 289000,
            beds: 2,
            baths: 2,
            sqft: 1150,
            propertyType: 'condo',
            expectedROI: 8.2,
            monthlyRent: 2100,
            images: ['/api/placeholder/800/600'],
            tokenized: true,
            tokenPrice: 144,
            availableTokens: 800,
            totalTokens: 2000,
            stats: {
              views: 1923,
              saves: 89,
              daysOnMarket: 5
            },
            features: ['city_views', 'gym', 'concierge', 'luxury_building']
          },
          {
            id: 'fallback-3',
            title: 'Austin Student Housing Investment',
            address: '2100 Guadalupe St, Austin, TX 78705',
            price: 365000,
            beds: 5,
            baths: 3,
            sqft: 1850,
            propertyType: 'house',
            expectedROI: 11.5,
            monthlyRent: 3500,
            images: ['/api/placeholder/800/600'],
            tokenized: false,
            tokenPrice: 0,
            availableTokens: 0,
            totalTokens: 0,
            stats: {
              views: 1654,
              saves: 112,
              daysOnMarket: 8
            },
            features: ['near_campus', 'parking', 'washer_dryer', 'student_rental']
          },
          {
            id: 'fallback-4',
            title: 'Dallas Suburban Family Home',
            address: '5423 Mockingbird Ln, Dallas, TX 75206',
            price: 485000,
            beds: 4,
            baths: 3,
            sqft: 2400,
            propertyType: 'house',
            expectedROI: 7.9,
            monthlyRent: 3200,
            images: ['/api/placeholder/800/600'],
            tokenized: true,
            tokenPrice: 242,
            availableTokens: 950,
            totalTokens: 2000,
            stats: {
              views: 2156,
              saves: 98,
              daysOnMarket: 12
            },
            features: ['pool', 'large_yard', 'updated', 'family_friendly']
          }
        ];
        
        setFeaturedProperties(fallbackProperties);
      } finally {
        setLoading(false);
      }
    };

    if (showListings) {
      fetchFeaturedProperties();
    }
  }, [showListings]);
  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50/30 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-30 sm:opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Cpath d='M30 0L60 30L30 60L0 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
              {title}
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed px-4 sm:px-0">
              {description}
            </p>
          </div>
        </div>

        {/* Search Section */}
        {showSearch && (
          <div className="max-w-4xl mx-auto mb-8 sm:mb-12 lg:mb-20">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 lg:p-8 backdrop-blur-sm">
              <SmartPropertySearch showInput={true} showSuggestions={false} onSearch={onSearch} />
            </div>
          </div>
        )}

        {/* Featured Properties Section */}
        {showListings && (
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 p-4 sm:p-6 lg:p-8 xl:p-12">
            {/* Featured Properties Header */}
            <div className="text-center mb-8 sm:mb-10 lg:mb-12">
              <div className="flex items-center justify-center mb-4 sm:mb-6">
                <div className="flex items-center bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-lg">
                  <FiTrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white mr-2" />
                  <span className="text-white font-bold text-xs sm:text-sm tracking-wide">LAST 24 HOURS</span>
                </div>
              </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
                🔥 Properties Getting Snapped Up
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
                <strong>Real deals</strong> that investors are actively bidding on right now. Average time to sell: 3.2 days.
              </p>
            </div>

          {/* Enhanced Property Cards - Mobile Optimized */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {loading ? (
              // Loading skeleton cards
              Array.from({ length: 4 }, (_, index) => (
                <div key={`loading-${index}`} className="relative">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                    <div className="relative h-40 sm:h-48 bg-gray-200 animate-pulse"></div>
                    <div className="p-4 sm:p-5">
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse mb-3 w-3/4"></div>
                      <div className="flex justify-between mb-3">
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4"></div>
                      </div>
                      <div className="flex justify-between mb-3">
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
                        <div className="h-5 bg-gray-200 rounded animate-pulse w-1/4"></div>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : featuredProperties.length > 0 ? (
              featuredProperties.map((property, index) => (
                <div key={property.id} className="relative">
                  {/* Ranking Badge - Mobile Optimized */}
                  <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 z-10">
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm ${
                      index === 0 ? 'bg-yellow-500 shadow-lg' :
                      index === 1 ? 'bg-gray-400 shadow-md' :
                      'bg-orange-500 shadow-md'
                    }`}>
                      #{index + 1}
                    </div>
                  </div>
                  
                  {/* Property Card - Touch Friendly */}
                  <div className="bg-white rounded-xl shadow-md active:shadow-lg transition-all duration-200 overflow-hidden border border-gray-200 active:border-blue-300 touch-manipulation">
                    <div className="relative h-40 sm:h-48">
                      <img 
                        src={property.images[0]} 
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                      {property.tokenized && (
                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Tokenized
                          </span>
                        </div>
                      )}
                      {/* Trending badge for #1 property */}
                      {index === 0 && (
                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                            <FiTrendingUp className="w-3 h-3 mr-1" />
                            Hot
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 sm:p-5">
                      {/* Title and Location - Mobile Optimized */}
                      <h4 className="font-bold text-base sm:text-lg text-gray-900 mb-2 line-clamp-1">{property.title}</h4>
                      <div className="flex items-center text-gray-600 mb-3">
                        <FiMapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                        <span className="text-xs sm:text-sm truncate">{property.address}</span>
                      </div>
                      
                      {/* Property Details - Mobile Stacked */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 space-y-1 sm:space-y-0">
                        <span>{property.beds} bed • {property.baths} bath</span>
                        <span>{property.sqft?.toLocaleString()} sqft</span>
                      </div>
                      
                      {/* Price and ROI - Mobile Layout */}
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div>
                          <div className="flex items-center">
                            <FiDollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 mr-1" />
                            <span className="text-lg sm:text-xl font-bold text-gray-900">
                              ${property.price.toLocaleString()}
                            </span>
                          </div>
                          {property.monthlyRent && (
                            <p className="text-xs sm:text-sm text-gray-600">
                              ${property.monthlyRent}/month rent
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-base sm:text-lg font-bold text-green-600">
                            {property.expectedROI}% ROI
                          </div>
                          <p className="text-xs sm:text-sm text-gray-500">Expected</p>
                        </div>
                      </div>
                      
                      {/* Popularity Stats - Mobile Responsive */}
                      <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-200 text-xs sm:text-sm">
                        <div className="flex items-center text-gray-600">
                          <FiEye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          <span className="hidden sm:inline">{property.stats.views.toLocaleString()} views</span>
                          <span className="sm:hidden">{property.stats.views > 1000 ? `${Math.round(property.stats.views/1000)}k` : property.stats.views}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FiStar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          <span>{property.stats.saves} saves</span>
                        </div>
                        <div className="text-gray-600">
                          <span className="hidden sm:inline">{property.stats.daysOnMarket} days listed</span>
                          <span className="sm:hidden">{property.stats.daysOnMarket}d</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // No properties available state
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 text-lg mb-2">🏠 No featured properties available</div>
                <div className="text-gray-400 text-sm">Check back soon for new listings!</div>
              </div>
            )}
          </div>

            {/* Enhanced Call to Action with Urgency */}
            <div className="text-center px-4">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 mb-4">
                <div className="text-red-600 font-semibold text-sm mb-1">⏰ Limited Time Alert</div>
                <div className="text-gray-700 text-sm">New properties added daily. The best deals go fast - don't miss out!</div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/login">
                  <button className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl min-h-[48px] min-w-[200px]">
                    Start Finding Deals
                  </button>
                </Link>
                <button 
                  onClick={() => onSearch('')}
                  className="w-full sm:w-auto bg-white border-2 border-blue-600 text-blue-600 px-6 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-200 min-h-[48px] min-w-[180px]"
                >
                  Browse All Properties
                </button>
              </div>
              
              <div className="mt-4 text-center">
                <div className="text-gray-600 text-sm mb-2">✅ Industry-leading security • ✅ Advanced AI analysis • ✅ Blockchain technology</div>
                <div className="text-xs text-gray-500">Join our beta testing program launching November 2024</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
