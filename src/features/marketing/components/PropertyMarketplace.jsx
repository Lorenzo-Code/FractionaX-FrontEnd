import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPinIcon,
  FunnelIcon,
  ViewColumnsIcon,
  ListBulletIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { Search, Filter, Map, TrendingUp } from 'lucide-react';
import { BsRobot, BsStars } from 'react-icons/bs';
import { HiOutlineSparkles } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import marketplaceService from '../../../features/marketplace/services/marketplaceService';

const PropertyMarketplace = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    priceRange: 'all',
    propertyType: 'all',
    location: 'all'
  });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [showSmartSuggestions, setShowSmartSuggestions] = useState(false);

  // Load real property data on component mount
  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 🤖 Try Enhanced Discovery API with AI intelligence first
        console.log('🚀 Loading AI-enhanced properties with comprehensive intelligence...');
        
        const result = await marketplaceService.fetchEnhancedDiscoveryListings({
          location: 'Austin, TX', // Default location
          limit: 12, // Get more properties to select best 3
          minPrice: 100000,
          maxPrice: 800000,
          intelligenceLevel: 'premium', // Maximum AI intelligence
          query: 'High-potential investment properties for fractionalization'
        });
        
        if (result.listings && result.listings.length > 0) {
          // 🤖 Enhanced properties already transformed by marketplace service
          const transformedProperties = result.listings.slice(0, 3);
          
          console.log('✅ Enhanced Discovery Properties:');
          transformedProperties.forEach((property, index) => {
            console.log(`  ${index + 1}. ${property.title}`);
            console.log(`     📍 ${property.address}`);
            console.log(`     💰 $${property.price?.toLocaleString()} | ROI: ${property.expectedROI}%`);
            console.log(`     🧠 Intelligence: ${property.intelligence?.overall}/100`);
            if (property.hasAIAnalysis) {
              console.log(`     🤖 AI Analysis: ${property.aiIntelligence?.confidenceScore}% confidence`);
            }
            console.log(`     📈 Coverage: ${property.dataProvenance?.coverage}`);
            console.log();
          });
          
          setProperties(transformedProperties);
          setTotalCount(result.listings.length);
          console.log(`✅ Loaded ${transformedProperties.length} real properties`);
        } else {
          throw new Error('No properties found');
        }
      } catch (error) {
        console.error('❌ Error loading properties:', error);
        setError(error.message);
        // Fallback to suggested deals if AI marketplace fails
        await loadSuggestedDeals();
      } finally {
        setLoading(false);
      }
    };
    
    const loadSuggestedDeals = async () => {
      try {
        console.log('🤖 Loading suggested deals as fallback...');
        const suggestedDeals = await marketplaceService.fetchSuggestedListings();
        
        if (suggestedDeals && suggestedDeals.length > 0) {
          const transformedProperties = marketplaceService.transformSuggestedDealsToProperties(suggestedDeals.slice(0, 3));
          setProperties(transformedProperties.map(prop => ({
            id: prop.id,
            title: prop.title,
            address: prop.address,
            price: prop.price,
            bedrooms: prop.beds,
            bathrooms: prop.baths,
            sqft: prop.sqft,
            propertyType: formatPropertyType(prop.propertyType),
            expectedROI: prop.expectedROI || 8.5,
            monthlyRent: prop.monthlyRent || prop.rentPrice,
            fundingProgress: Math.floor(Math.random() * 40) + 30,
            investors: Math.floor(Math.random() * 50) + 15,
            images: prop.images,
            status: 'funding',
            daysOnMarket: prop.stats?.daysOnMarket || 1,
            pricePerSqft: prop.sqft ? Math.round(prop.price / prop.sqft) : 0
          })));
          setTotalCount(suggestedDeals.length);
          console.log('✅ Loaded suggested deals as fallback');
        } else {
          // Last resort: use minimal mock data
          setProperties(getMockProperties());
          setTotalCount(3);
        }
      } catch (fallbackError) {
        console.error('❌ Error loading suggested deals:', fallbackError);
        setProperties(getMockProperties());
        setTotalCount(3);
      }
    };
    
    loadProperties();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Helper functions for property transformation
  const formatPropertyType = (type) => {
    const typeMap = {
      'SINGLE_FAMILY': 'Single Family',
      'TOWNHOUSE': 'Townhouse',
      'CONDO': 'Condo',
      'APARTMENT': 'Apartment',
      'MULTI_FAMILY': 'Multi-Family',
      'house': 'Single Family',
      'condo': 'Condo',
      'townhouse': 'Townhouse'
    };
    return typeMap[type] || 'Single Family';
  };
  
  const calculateROI = (property) => {
    if (property.rentZestimate && property.price) {
      return Math.round((property.rentZestimate * 12 / property.price) * 100 * 10) / 10;
    }
    return Math.round((Math.random() * 6 + 8) * 10) / 10; // 8-14% range
  };
  
  const estimateRent = (price) => {
    if (!price) return 0;
    return Math.round(price * 0.01); // 1% rule estimate
  };
  
  // Smart search suggestions
  const getSmartSuggestions = () => [
    {
      icon: <Search className="w-4 h-4" />,
      title: "Find High-ROI Properties",
      query: "Show me properties under $500K with ROI above 12% in growing neighborhoods"
    },
    {
      icon: <TrendingUp className="w-4 h-4" />,
      title: "Best Investment Markets",
      query: "What are the best real estate investment opportunities in Houston and Austin?"
    },
    {
      icon: <MapPinIcon className="w-4 h-4" />,
      title: "Tokenized Properties",
      query: "Find tokenized investment properties with fractional ownership available now"
    },
    {
      icon: <Filter className="w-4 h-4" />,
      title: "Rental Income Focus",
      query: "Properties with strong rental yields and cash flow potential under $400K"
    }
  ];
  
  // Handle smart search
  const handleSmartSearch = () => {
    if (searchValue.trim()) {
      // Navigate to marketplace with the search query
      navigate('/marketplace', { 
        state: { 
          aiQuery: searchValue,
          autoSearch: true,
          source: 'homepage_smart_search'
        } 
      });
    } else {
      // Navigate to marketplace without query
      navigate('/marketplace');
    }
  };
  
  // Handle suggestion selection
  const handleSuggestionSelect = (query) => {
    setSearchValue(query);
    setShowSmartSuggestions(false);
    // Navigate immediately with the selected query
    navigate('/marketplace', { 
      state: { 
        aiQuery: query,
        autoSearch: true,
        source: 'homepage_suggestion'
      } 
    });
  };
  
  // Fallback mock properties if API fails
  const getMockProperties = () => [
    {
      id: 'mock-1',
      title: 'Austin Tech District Apartment',
      address: '1847 Heights Blvd, Austin, TX 78008',
      price: 485000,
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2100,
      propertyType: 'Multi-Family',
      expectedROI: 14.2,
      monthlyRent: 3200,
      fundingProgress: 68,
      investors: 47,
      images: [],
      status: 'funding',
      daysOnMarket: 3,
      pricePerSqft: 231
    },
    {
      id: 'mock-2',
      title: 'Miami Beach Luxury Condo',
      address: '2156 Ocean Drive, Miami Beach, FL 33139',
      price: 720000,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1850,
      propertyType: 'Condo',
      expectedROI: 11.8,
      monthlyRent: 4800,
      fundingProgress: 45,
      investors: 32,
      images: [],
      status: 'funding',
      daysOnMarket: 7,
      pricePerSqft: 389
    },
    {
      id: 'mock-3',
      title: 'Denver Family Home',
      address: '3821 Cherry Creek Dr, Denver, CO 80202',
      price: 425000,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1680,
      propertyType: 'Single Family',
      expectedROI: 13.5,
      monthlyRent: 2800,
      fundingProgress: 85,
      investors: 28,
      images: [],
      status: 'funding',
      daysOnMarket: 1,
      pricePerSqft: 253
    }
  ];

  const PropertyCard = ({ property }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      {/* Property Image */}
      <div className="relative h-48 bg-gray-200">
        {/* Show real images if available */}
        {property.images && property.images.length > 0 ? (
          <img 
            src={property.images[0]} 
            alt={property.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Fallback placeholder when no real images */}
        <div className={`absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-50 to-gray-100 flex items-center justify-center ${property.images && property.images.length > 0 ? 'hidden' : 'flex'}`}>
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">🏠</div>
            <div className="text-sm font-medium">Property Image</div>
            <div className="text-xs">Coming Soon</div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-2 py-1 text-xs font-bold rounded ${
            property.status === 'funding' 
              ? 'bg-green-500 text-white' 
              : 'bg-blue-500 text-white'
          }`}>
            {property.status === 'funding' ? 'FUNDING' : 'AVAILABLE'}
          </span>
        </div>

        {/* Property Type */}
        <div className="absolute top-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {property.propertyType}
        </div>

        {/* Save Button */}
        <button className="absolute bottom-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
          <HeartIcon className="w-4 h-4 text-gray-600 hover:text-red-500" />
        </button>

        {/* ROI Badge */}
        <div className="absolute bottom-4 left-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {property.expectedROI}% ROI
        </div>
        
        {/* 🤖 AI Analysis Badge */}
        {property.hasAIAnalysis && (
          <div className="absolute bottom-10 left-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
            <BsRobot className="w-3 h-3" />
            AI Analyzed
          </div>
        )}
        
        {/* Intelligence Score Badge */}
        {property.intelligence?.overall && (
          <div className="absolute top-4 left-20 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
            <BsStars className="w-3 h-3" />
            {property.intelligence.overall}/100
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-6">
        {/* Price & Address */}
        <div className="mb-4">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(property.price)}
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPinIcon className="w-4 h-4 mr-1" />
            {property.address}
          </div>
        </div>

        {/* Property Stats - Zillow Style */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <span>{property.bedrooms || 0} bed</span>
          <span>{property.bathrooms || 0} bath</span>
          <span>{property.sqft ? property.sqft.toLocaleString() : 'N/A'} sqft</span>
          <span>{property.pricePerSqft ? `$${property.pricePerSqft}` : '$--'}/sqft</span>
        </div>

        {/* Investment Details */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Monthly Rent</span>
            <span className="font-semibold">{formatCurrency(property.monthlyRent)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Min. Investment</span>
            <span className="font-semibold text-green-600">$100</span>
          </div>
          
          {/* 🤖 AI Intelligence Highlights */}
          {property.hasAIAnalysis && property.aiIntelligence && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <BsRobot className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">AI Investment Analysis</span>
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                  {property.aiIntelligence.confidenceScore}% confidence
                </span>
              </div>
              
              {property.aiIntelligence.investmentInsights && (
                <p className="text-xs text-gray-700 mb-2 leading-relaxed">
                  {property.aiIntelligence.investmentInsights.substring(0, 120)}...
                </p>
              )}
              
              {property.aiIntelligence.strategicRecommendations && (
                <div className="bg-white/60 p-2 rounded border border-blue-200">
                  <p className="text-xs text-gray-600 font-medium mb-1">📋 Strategic Insight:</p>
                  <p className="text-xs text-gray-700">
                    {property.aiIntelligence.strategicRecommendations.substring(0, 100)}...
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Enhanced Intelligence Scores */}
          {property.intelligence?.overall && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">🧠 Intelligence Scores</span>
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                  {property.dataProvenance?.coverage || '98%'} coverage
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">📊 Overall:</span>
                  <span className="font-medium">{property.intelligence.overall}/100</span>
                </div>
                
                {property.intelligence.lifestyle?.familyFriendly && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">👪 Family:</span>
                    <span className="font-medium">{property.intelligence.lifestyle.familyFriendly}/100</span>
                  </div>
                )}
                
                {property.intelligence.mobility?.walkScore > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">🚶 Walk:</span>
                    <span className="font-medium">{property.intelligence.mobility.walkScore}/100</span>
                  </div>
                )}
                
                {property.intelligence.schools?.averageRating && property.intelligence.schools.averageRating !== 'N/A' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">🎓 Schools:</span>
                    <span className="font-medium">{property.intelligence.schools.averageRating}/10</span>
                  </div>
                )}
              </div>
              
              {/* Demographics Summary */}
              {property.intelligence.demographics?.population > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">📈 Area Insights:</span>
                    {property.intelligence.demographics.medianIncome > 0 && (
                      <span> ${Math.round(property.intelligence.demographics.medianIncome/1000)}k median income</span>
                    )}
                    {property.intelligence.demographics.population > 0 && (
                      <span> • {property.intelligence.demographics.population.toLocaleString()} population</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Funding Progress */}
        <div className="mb-4">
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

        {/* Bottom Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            {property.investors} investors
          </div>
          <div className="text-sm text-gray-600">
            {property.daysOnMarket} day{property.daysOnMarket !== 1 ? 's' : ''} on market
          </div>
        </div>

        {/* Action Button */}
        <Link 
          to={`/property/${property.id}`}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
        >
          View Details & Invest
        </Link>
      </div>
    </div>
  );

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Search & Filters - HAR/Zillow Style */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Property Marketplace
            </h2>
            <p className="text-xl text-gray-600">
              Discover investment properties across major US markets
            </p>
          </div>

          {/* Smart Search Gateway */}
          <div className="mb-6">
            <div className="relative">
              {/* Smart Search Input */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <div className="flex-1 relative group">
                  {/* AI Icon */}
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    <div className="relative">
                      <BsRobot className="w-4 h-4 text-blue-600" />
                      <HiOutlineSparkles className="w-2 h-2 absolute -top-0.5 -right-0.5 text-yellow-500" />
                    </div>
                  </div>
                  
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onFocus={() => setShowSmartSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSmartSuggestions(false), 200)}
                    placeholder="Ask AI about properties..."
                    className="w-full pl-12 pr-4 sm:pr-24 py-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-blue-50/30 transition-all group-hover:border-blue-400"
                    onKeyDown={(e) => e.key === 'Enter' && handleSmartSearch()}
                  />
                  
                  {/* Smart Badge - Hidden on mobile to save space */}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 hidden sm:block">
                    <div className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <BsStars className="w-3 h-3" />
                      AI Powered
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={handleSmartSearch}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base min-w-[120px] sm:min-w-[140px]"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="sm:inline">Smart Search</span>
                </button>
              </div>
              
              {/* Smart Suggestions Dropdown */}
              <AnimatePresence>
                {showSmartSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-64 sm:max-h-80 overflow-y-auto"
                  >
                    {/* Header */}
                    <div className="p-3 sm:p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                      <div className="flex items-center gap-2 text-gray-700">
                        <BsRobot className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-sm">AI-Powered Search</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 hidden sm:block">
                        Use natural language to find your perfect investment property
                      </p>
                    </div>
                    
                    {/* Smart Suggestions */}
                    <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                      <div className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                        <HiOutlineSparkles className="w-3 h-3 text-yellow-500" />
                        Try asking:
                      </div>
                      
                      {getSmartSuggestions().map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionSelect(suggestion.query)}
                          className="w-full text-left p-2 sm:p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                        >
                          <div className="flex items-start gap-2 sm:gap-3">
                            <div className="text-blue-600 mt-0.5 flex-shrink-0">{suggestion.icon}</div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-gray-900 text-xs sm:text-sm group-hover:text-blue-700">
                                {suggestion.title}
                              </div>
                              <div className="text-xs text-gray-600 mt-1 line-clamp-2 sm:line-clamp-none">
                                {suggestion.query}
                              </div>
                              <div className="text-xs text-blue-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                                Click to search →
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {/* CTA Footer */}
                    <div className="p-3 sm:p-4 border-t border-gray-100 bg-gray-50">
                      <button 
                        onClick={() => navigate('/marketplace')}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 sm:py-2.5 px-4 rounded-lg font-medium text-xs sm:text-sm hover:from-blue-700 hover:to-purple-700 transition-all"
                      >
                        <span className="sm:hidden">Explore Full AI Search →</span>
                        <span className="hidden sm:inline">Explore Full AI Search in Marketplace →</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Filters & View Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <select 
                value={filters.priceRange} 
                onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm min-w-[120px]"
              >
                <option value="all">All Prices</option>
                <option value="100k-300k">$100K - $300K</option>
                <option value="300k-500k">$300K - $500K</option>
                <option value="500k+">$500K+</option>
              </select>

              <select 
                value={filters.propertyType} 
                onChange={(e) => setFilters({...filters, propertyType: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm min-w-[120px]"
              >
                <option value="all">All Types</option>
                <option value="single-family">Single Family</option>
                <option value="multi-family">Multi-Family</option>
                <option value="condo">Condo</option>
              </select>

              <button className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-50 whitespace-nowrap">
                <FunnelIcon className="w-4 h-4" />
                <span className="hidden sm:inline">More Filters</span>
                <span className="sm:hidden">Filters</span>
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1 self-end sm:self-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Grid View"
              >
                <ViewColumnsIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="List View"
              >
                <ListBulletIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'map' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Map View"
              >
                <Map className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 text-gray-600">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span>Loading live properties...</span>
            </div>
          </div>
        )}
        
        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
              <div className="text-yellow-800 font-medium mb-1">Loading Properties</div>
              <div className="text-yellow-700 text-sm mb-3">{error}</div>
              <div className="text-yellow-600 text-xs">Showing available properties...</div>
            </div>
          </div>
        )}
        
        {/* Results Count */}
        {!loading && (
          <div className="flex items-center justify-between mb-6">
            <div className="text-gray-600">
              Showing {properties.length} properties
              {properties.some(p => p.dataProvenance?.coverage) && (
                <span className="ml-2 text-green-600 text-sm font-medium">
                  • {properties.find(p => p.dataProvenance?.coverage)?.dataProvenance?.coverage} Intelligence Coverage
                </span>
              )}
              {properties.some(p => p.hasAIAnalysis) && (
                <span className="ml-2 text-blue-600 text-sm font-medium flex items-center gap-1">
                  <BsRobot className="w-3 h-3" />
                  AI Enhanced
                </span>
              )}
              {properties.some(p => p.isEnhancedDiscovery) && (
                <span className="ml-2 text-purple-600 text-sm font-medium flex items-center gap-1">
                  <BsStars className="w-3 h-3" />
                  Multi-Source Intelligence
                </span>
              )}
            </div>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>Sort by: Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>ROI: High to Low</option>
              <option>Funding Progress</option>
            </select>
          </div>
        )}

        {/* Property Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {/* Load More / Pagination */}
        <div className="text-center">
          <button 
            onClick={() => navigate('/marketplace')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            More Properties
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default PropertyMarketplace;
