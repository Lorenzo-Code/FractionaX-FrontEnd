import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiSearch, 
  FiFilter, 
  FiMap, 
  FiList, 
  FiGrid,
  FiMapPin,
  FiCheckCircle,
  FiCpu,
  FiStar,
  FiHome,
  FiBookmark,
  FiHeart,
  FiTrendingUp,
  FiBarChart,
  FiEye,
  FiShare2,
  FiX
} from "react-icons/fi";
import { BsCoin, BsRobot } from "react-icons/bs";
import SEO from "../components/SEO.jsx";
import { generatePageSEO, generateStructuredData } from "../utils/seo.js";
import FilterPanel from "../components/marketplace/FilterPanel.jsx";
import SmartFilterPanel from "../components/marketplace/SmartFilterPanel.jsx";
import PropertyComparison from "../components/marketplace/PropertyComparison.jsx";
import useAuth from "../hooks/useAuth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Analytics and monitoring imports
import {
  trackPageView,
  trackPropertyInteraction,
  trackSearch,
  trackFilterUsage,
  trackPagination,
  trackTabSwitch,
  identifyUser
} from '../utils/analytics.js';
import {
  addBreadcrumb,
  captureError,
  capturePropertyError,
  setContext
} from '../utils/errorMonitoring.js';
import {
  validateSearchQuery,
  validatePropertyFilters,
  validatePagination,
  sanitizeText,
  checkSecurityThreats,
  createRateLimiter
} from '../utils/security.js';

const Marketplace = () => {
  const { user } = useAuth();
  
  // Create rate limiters for security
  const searchRateLimit = useMemo(() => createRateLimiter(30, 60000), []); // 30 searches per minute
  const favoriteRateLimit = useMemo(() => createRateLimiter(20, 60000), []); // 20 favorites per minute
  
  // State management for both sections
  const [activeTab, setActiveTab] = useState('approved');
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showTokenizeModal, setShowTokenizeModal] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  
  // Data states
  const [approvedListings, setApprovedListings] = useState([]);
  const [aiDiscoveredProperties, setAiDiscoveredProperties] = useState([]);
  const [aiScanInProgress, setAiScanInProgress] = useState(false);
  
const [filters, setFilters] = useState({
    priceRange: [0, 2000000],
    propertyType: 'all',
    bedrooms: 'any',
    bathrooms: 'any',
    location: '',
    sortBy: 'newest',
    tokenizationStatus: 'all',
    roiRange: [0, 50],
    listingStatus: 'all',
    features: [],
    minSqft: '',
    maxSqft: '',
    listingType: 'all'
  });
  
  // Advanced filtering states
  const [smartFilters, setSmartFilters] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [showMapView, setShowMapView] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showROICalculator, setShowROICalculator] = useState(false);
  const [calculatorProperty, setCalculatorProperty] = useState(null);
  
  const [favorites, setFavorites] = useState([]);
  const [watchlistNotes, setWatchlistNotes] = useState({});

  // Mock data - in production, this would come from your API
  const mockProperties = [
    {
      id: 1,
      title: "Modern Downtown Condo",
      address: "123 Main St, Houston, TX 77002",
      price: 450000,
      rentPrice: 2500,
      beds: 2,
      baths: 2,
      sqft: 1200,
      propertyType: "condo",
      listingType: "sale",
      images: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
      description: "Stunning modern condo in the heart of downtown with city views.",
      features: ["parking", "gym", "pool", "doorman"],
      yearBuilt: 2020,
      lotSize: 0,
      coordinates: { lat: 29.7604, lng: -95.3698 },
      tokenized: false,
      tokenPrice: 0,
      totalTokens: 0,
      availableTokens: 0,
      expectedROI: 8.5,
      monthlyRent: 2500,
      agent: {
        name: "Sarah Johnson",
        phone: "(713) 555-0123",
        email: "sarah@realty.com"
      },
      stats: {
        views: 245,
        saves: 12,
        daysOnMarket: 15
      }
    },
    {
      id: 2,
      title: "Family Home with Pool",
      address: "456 Oak Avenue, Sugar Land, TX 77479",
      price: 650000,
      rentPrice: 3200,
      beds: 4,
      baths: 3,
      sqft: 2800,
      propertyType: "house",
      listingType: "sale",
      images: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
      description: "Beautiful family home with pool and large backyard.",
      features: ["pool", "garage", "garden", "fireplace"],
      yearBuilt: 2015,
      lotSize: 0.3,
      coordinates: { lat: 29.6196, lng: -95.6349 },
      tokenized: true,
      tokenPrice: 100,
      totalTokens: 6500,
      availableTokens: 2100,
      expectedROI: 12.3,
      monthlyRent: 3200,
      agent: {
        name: "Mike Davis",
        phone: "(281) 555-0456",
        email: "mike@realty.com"
      },
      stats: {
        views: 412,
        saves: 28,
        daysOnMarket: 8
      }
    },
    {
      id: 3,
      title: "Luxury High-Rise Apartment",
      address: "789 River Oaks Blvd, Houston, TX 77027",
      price: 850000,
      rentPrice: 4500,
      beds: 3,
      baths: 2.5,
      sqft: 1800,
      propertyType: "condo",
      listingType: "rent",
      images: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
      description: "Luxury apartment with panoramic city views and premium amenities.",
      features: ["concierge", "valet", "gym", "pool", "rooftop"],
      yearBuilt: 2022,
      lotSize: 0,
      coordinates: { lat: 29.7370, lng: -95.4194 },
      tokenized: true,
      tokenPrice: 150,
      totalTokens: 5667,
      availableTokens: 890,
      expectedROI: 15.2,
      monthlyRent: 4500,
      agent: {
        name: "Jennifer Lee",
        phone: "(713) 555-0789",
        email: "jennifer@luxury.com"
      },
      stats: {
        views: 834,
        saves: 67,
        daysOnMarket: 3
      }
    }
  ];

  useEffect(() => {
    // Simulate API call - separate approved listings from AI-discovered
    setTimeout(() => {
      // Mock approved listings (first 2 properties)
      setApprovedListings(mockProperties.slice(0, 2));
      // Mock AI-discovered properties (remaining properties)
      setAiDiscoveredProperties(mockProperties.slice(2));
      setLoading(false);
    }, 1000);
  }, []);

  // Get current properties based on active tab
  const currentProperties = useMemo(() => {
    return activeTab === 'approved' ? approvedListings : aiDiscoveredProperties;
  }, [activeTab, approvedListings, aiDiscoveredProperties]);

  // Filter properties based on current filters
  const filteredProperties = useMemo(() => {
    let filtered = currentProperties;

    // Search query filter
    if (searchQuery) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price range filter
    filtered = filtered.filter(property =>
      property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1]
    );

    // Property type filter
    if (filters.propertyType !== 'all') {
      filtered = filtered.filter(property => property.propertyType === filters.propertyType);
    }

    // Tokenization status filter
    if (filters.tokenizationStatus !== 'all') {
      if (filters.tokenizationStatus === 'tokenized') {
        filtered = filtered.filter(property => property.tokenized);
      } else if (filters.tokenizationStatus === 'available') {
        filtered = filtered.filter(property => !property.tokenized);
      }
    }

    // Bedrooms filter
    if (filters.bedrooms !== 'any') {
      const bedCount = parseInt(filters.bedrooms);
      filtered = filtered.filter(property => property.beds >= bedCount);
    }

    // Bathrooms filter
    if (filters.bathrooms !== 'any') {
      const bathCount = parseInt(filters.bathrooms);
      filtered = filtered.filter(property => property.baths >= bathCount);
    }

    // Sort filtered results
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => a.stats.daysOnMarket - b.stats.daysOnMarket);
        break;
      case 'beds':
        filtered.sort((a, b) => b.beds - a.beds);
        break;
      case 'sqft':
        filtered.sort((a, b) => b.sqft - a.sqft);
        break;
      case 'roi':
        filtered.sort((a, b) => (b.expectedROI || 0) - (a.expectedROI || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [currentProperties, filters, searchQuery]);

  // Paginate filtered properties
  const paginatedProperties = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    return filteredProperties.slice(startIdx, endIdx);
  }, [filteredProperties, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  const handleCompareProperty = (propertyId) => {
    setCompareList(prev =>
      prev.includes(propertyId) ? prev.filter(id => id !== propertyId) : [...prev, propertyId]
    );
  };

  const handleToggleFavorite = (propertyId) => {
    const property = [...approvedListings, ...aiDiscoveredProperties].find(p => p.id === propertyId);
    const isFavorite = favorites.includes(propertyId);

    if (isFavorite) {
      setFavorites(prev => prev.filter(id => id !== propertyId));
      toast.info(`${property?.title} removed from favorites`, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      setFavorites(prev => [...prev, propertyId]);
      toast.success(`${property?.title} added to favorites!`, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleTabChange = (newTab) => {
    setTabLoading(true);
    setCurrentPage(1); // Reset to first page when changing tabs
    
    setTimeout(() => {
      setActiveTab(newTab);
      setTabLoading(false);
    }, 300);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
  };

  const handleTokenizeProperty = (property) => {
    setSelectedProperty(property);
    setShowTokenizeModal(true);
  };

    // Search Bar Component
  const SearchBar = ({ value, onChange, placeholder }) => (
    <div className="relative">
      <label htmlFor="property-search" className="sr-only">
        Search properties
      </label>
      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
      <input
        id="property-search"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-describedby="search-description"
      />
      <div id="search-description" className="sr-only">
        Search through property listings by location, property type, or keywords
      </div>
    </div>
  );

  const renderPropertyGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {paginatedProperties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          isFavorite={favorites.includes(property.id)}
          onToggleFavorite={handleToggleFavorite}
          onClick={handlePropertyClick}
        />
      ))}
    </div>
  );

  const renderPropertyList = () => (
    <div className="space-y-4">
      {paginatedProperties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          isFavorite={favorites.includes(property.id)}
          onToggleFavorite={handleToggleFavorite}
          onClick={handlePropertyClick}
          layout="list"
        />
      ))}
    </div>
  );

  // Pagination Component
  const PaginationControls = () => {
    if (totalPages <= 1) return null;

    return (
      <nav className="flex justify-center items-center mt-8 space-x-2" aria-label="Property listings pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Go to previous page"
        >
          Previous
        </button>
        
        {/* Page numbers */}
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNum = i + 1;
          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`px-3 py-2 text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                currentPage === pageNum
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
              }`}
              aria-label={`Go to page ${pageNum}`}
              aria-current={currentPage === pageNum ? 'page' : undefined}
            >
              {pageNum}
            </button>
          );
        })}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Go to next page"
        >
          Next
        </button>
        
        <div className="ml-4" aria-live="polite" aria-atomic="true">
          <span className="text-sm text-gray-700">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredProperties.length)} of {filteredProperties.length} results
          </span>
        </div>
      </nav>
    );
  };

  // Generate structured data for properties
  const propertyStructuredData = useMemo(() => {
    if (filteredProperties.length === 0) return null;
    
    // Create individual property structured data
    const propertyListings = filteredProperties.slice(0, 10).map(property => ({
      '@type': 'RealEstateListing',
      name: property.title,
      description: property.description,
      url: `https://fractionax.io/marketplace/${property.id}`,
      image: property.images,
      price: {
        '@type': 'MonetaryAmount',
        currency: 'USD',
        value: property.price
      },
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'FractionaX'
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: property.address.split(',')[0],
        addressLocality: property.address.split(',')[1]?.trim(),
        addressRegion: property.address.split(',')[2]?.trim()?.split(' ')[0],
        postalCode: property.address.split(' ').pop()
      },
      numberOfRooms: property.beds,
      numberOfBathroomsTotal: property.baths,
      floorSize: {
        '@type': 'QuantitativeValue',
        value: property.sqft,
        unitCode: 'SQF'
      },
      yearBuilt: property.yearBuilt,
      ...(property.tokenized && {
        additionalProperty: {
          '@type': 'PropertyValue',
          name: 'Tokenized',
          value: true
        }
      })
    }));

    // Main structured data object
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${activeTab === 'approved' ? 'Approved' : 'AI-Discovered'} Property Listings - FractionaX`,
      description: `Browse ${activeTab === 'approved' ? 'verified approved' : 'AI-discovered'} real estate properties for tokenized investment opportunities.`,
      numberOfItems: filteredProperties.length,
      itemListElement: propertyListings.map((property, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: property
      })),
      provider: {
        '@type': 'Organization',
        name: 'FractionaX',
        url: 'https://fractionax.io',
        logo: 'https://fractionax.io/assets/images/MainLogo1.webp'
      }
    };
  }, [filteredProperties, activeTab]);

  // Generate SEO data with enhanced information
  const seoData = useMemo(() => {
    const tabSpecificTitle = activeTab === 'approved' 
      ? 'Approved Property Listings | FractionaX Marketplace'
      : 'AI-Discovered Properties | FractionaX Marketplace';
    
    const tabSpecificDescription = activeTab === 'approved'
      ? `Browse ${approvedListings.length} verified property listings approved for tokenized real estate investment. All properties available for fractional ownership through blockchain technology.`
      : `Discover ${aiDiscoveredProperties.length} AI-identified real estate opportunities with strong potential for fractionalization. Powered by advanced market analysis and investment criteria.`;

    const keywords = [
      'real estate marketplace',
      'tokenized properties',
      'fractional real estate investing',
      'blockchain real estate',
      'property tokenization',
      'FXCT token',
      'Base blockchain',
      ...(activeTab === 'approved' ? ['approved listings', 'verified properties'] : ['AI property discovery', 'machine learning real estate']),
      ...filteredProperties.slice(0, 3).map(p => p.address.split(',')[1]?.trim()).filter(Boolean)
    ];

    return generatePageSEO({
      title: tabSpecificTitle,
      description: tabSpecificDescription,
      keywords,
      url: `/marketplace?tab=${activeTab}`,
      type: 'website',
      structuredData: propertyStructuredData
    });
  }, [activeTab, approvedListings.length, aiDiscoveredProperties.length, filteredProperties, propertyStructuredData]);

  if (loading) {
    return (
      <>
        <SEO {...seoData} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading properties...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO {...seoData} />
      <div className="min-h-screen bg-gray-50 pt-16">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Title and Stats */}
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <BsCoin className="mr-2 text-blue-600" />
                    Marketplace
                  </h1>
                  <p className="text-sm text-gray-600">
                    {filteredProperties.length} properties • Powered by FXST
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="flex-1 max-w-2xl">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search by location, property type, or keywords..."
                />
              </div>

{/* View Controls */}
              <div className="flex items-center space-x-2">
                <div className="bg-gray-100 rounded-lg p-1 flex" role="group" aria-label="Property view options">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                      viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'
                    }`}
                    aria-label="Switch to grid view"
                    aria-pressed={viewMode === 'grid'}
                  >
                    <div className="grid grid-cols-2 gap-1 w-4 h-4" aria-hidden="true">
                      <div className="bg-current rounded-sm opacity-60"></div>
                      <div className="bg-current rounded-sm opacity-60"></div>
                      <div className="bg-current rounded-sm opacity-60"></div>
                      <div className="bg-current rounded-sm opacity-60"></div>
                    </div>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                      viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'
                    }`}
                    aria-label="Switch to list view"
                    aria-pressed={viewMode === 'list'}
                  >
                    <FiList className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  aria-expanded={showFilters}
                  aria-controls="property-filters"
                  aria-label={showFilters ? 'Hide property filters' : 'Show property filters'}
                >
                  <FiFilter className="w-4 h-4" aria-hidden="true" />
                  <span>Filters</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <TabNavigation />

        {/* Section Description */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {activeTab === 'approved' ? (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                      Approved Property Listings
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      These are verified properties that have been approved for listing on our platform. 
                      All properties are available for fractional ownership through tokenization.
                    </p>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                      AI-Discovered Properties
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      These properties have been identified by our AI system as having strong potential 
                      for fractionalization based on market data, location analysis, and investment criteria. 
                      They are not yet officially listed but represent opportunities worth exploring.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
{/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            role="tabpanel"
            id={`${activeTab}-tab-panel`}
            aria-labelledby={`${activeTab}-tab`}
            tabIndex="0"
          >
            {filteredProperties.length === 0 ? (
              <div className="text-center py-12" role="status" aria-live="polite">
                <FiHome className="mx-auto h-12 w-12 text-gray-400 mb-4" aria-hidden="true" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
              </div>
            ) : (
              <main aria-label={`${activeTab === 'approved' ? 'Approved' : 'AI-discovered'} property listings`}>
                <div role="region" aria-label="Property listings" className="mb-6">
                  {viewMode === 'grid' ? renderPropertyGrid() : renderPropertyList()}
                </div>
                <PaginationControls />
              </main>
            )}
          </motion.div>

          {/* Property Comparison Modal */}
          <AnimatePresence>
            {showComparison && compareList.length > 0 && (
              <PropertyComparison
                properties={compareList.map(id =>
                  [...approvedListings, ...aiDiscoveredProperties].find(p => p.id === id)
                )}
                onClose={() => setShowComparison(false)}
                onRemoveProperty={(id) =>
                  setCompareList(prev => prev.filter(compId => compId !== id))
                }
                onAddToFavorites={handleToggleFavorite}
              />
            )}
          </AnimatePresence>
          
          {/* Comparison Toolbar */}
          <AnimatePresence>
            {compareList.length > 0 && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-40"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <FiBarChart className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">
                      {compareList.length} {compareList.length === 1 ? 'property' : 'properties'} selected
                    </span>
                  </div>
                  
                  {compareList.length > 1 && (
                    <button
                      onClick={() => setShowComparison(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <span>Compare Properties</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => setCompareList([])}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                    <span>Clear</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Disclaimer */}
        <div className="bg-blue-50 border-t border-blue-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Important Disclaimer</h3>
              <p className="text-xs text-blue-700 leading-relaxed max-w-4xl mx-auto">
                All listings are provided by licensed real estate agents, licensed brokers, 
                the internal FractionaX admin team, and approved users who have been verified by FractionaX. 
                Property information is subject to verification and market conditions. 
                Past performance does not guarantee future results. Please consult with qualified 
                professionals before making any investment decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Smart Filter Panel Overlay */}
      <AnimatePresence>
        {showFilters && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="max-w-2xl w-full max-h-[90vh] overflow-hidden">
              <SmartFilterPanel
                onClose={() => setShowFilters(false)}
                onApplyFilters={(filters) => {
                  setFilters(filters);
                  trackFilterUsage(filters);
                }}
                currentFilters={filters}
                savedSearches={savedSearches}
                onSaveSearch={(search) => setSavedSearches((prev) => [...prev, search])}
                onDeleteSearch={(index) => {
                  const updated = [...savedSearches];
                  updated.splice(index, 1);
                  setSavedSearches(updated);
                }}
                onLoadSearch={(search) => setFilters(search.filters)}
              />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
);
};

  // Property Card Component
  const PropertyCard = ({ property, isFavorite, onToggleFavorite, onClick, layout = 'grid' }) => {
    const isInComparison = compareList.includes(property.id);
    
    return (
      <article 
        className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 relative ${
          layout === 'list' ? 'flex' : ''
        } ${isInComparison ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
        tabIndex="0"
        role="button"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(property);
          }
        }}
        onClick={() => onClick(property)}
        aria-label={`View details for ${property.title} at ${property.address}, priced at $${property.price.toLocaleString()}`}
      >
        <div className={`${layout === 'list' ? 'w-48 h-32' : 'h-48'} relative`}>
          <img 
            src={property.images[0]} 
            alt={`${property.title} - ${property.propertyType} with ${property.beds} bedrooms and ${property.baths} bathrooms`}
            className="w-full h-full object-cover"
          />
          {isInComparison && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              In Comparison
            </div>
          )}
        </div>
        <div className="p-4 flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg text-gray-900 truncate">{property.title}</h3>
            <div className="flex items-center space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCompareProperty(property.id);
                }}
                className={`p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                  isInComparison ? 'text-blue-600 hover:text-blue-700' : 'text-gray-400 hover:text-gray-600'
                }`}
                aria-label={isInComparison ? `Remove ${property.title} from comparison` : `Add ${property.title} to comparison`}
                tabIndex="0"
              >
                <FiBarChart3 className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(property.id);
                }}
                className={`p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors ${
                  isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-gray-600'
                }`}
                aria-label={isFavorite ? `Remove ${property.title} from favorites` : `Add ${property.title} to favorites`}
                tabIndex="0"
              >
                <FiStar className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} aria-hidden="true" />
              </button>
            </div>
          </div>
        <p className="text-gray-600 text-sm mb-2 flex items-center">
          <FiMapPin className="w-4 h-4 mr-1" aria-hidden="true" />
          <span className="sr-only">Located at:</span>
          {property.address}
        </p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-blue-600" aria-label={`Price: $${property.price.toLocaleString()}`}>
            ${property.price.toLocaleString()}
          </span>
          {property.tokenized && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full" aria-label="This property is available for tokenized investment">
              Tokenized
            </span>
          )}
        </div>
        <div className="flex items-center text-sm text-gray-600 mb-3" aria-label="Property specifications">
          <span className="mr-4">{property.beds} beds</span>
          <span className="mr-4">{property.baths} baths</span>
          <span>{property.sqft.toLocaleString()} sqft</span>
        </div>
        {property.expectedROI && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-600 font-medium" aria-label={`Expected return on investment: ${property.expectedROI} percent`}>
              {property.expectedROI}% Expected ROI
            </span>
            <span className="text-gray-500" aria-label={`Monthly rent: $${property.monthlyRent}`}>
              ${property.monthlyRent}/month
            </span>
          </div>
        )}
      </div>
    </article>
  );

  // Search Bar Component
  const SearchBar = ({ value, onChange, placeholder }) => (
    <div className="relative">
      <label htmlFor="property-search" className="sr-only">
        Search properties
      </label>
      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
      <input
        id="property-search"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-describedby="search-description"
      />
      <div id="search-description" className="sr-only">
        Search through property listings by location, property type, or keywords
      </div>
    </div>
  );

  const renderPropertyGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {paginatedProperties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          isFavorite={favorites.includes(property.id)}
          onToggleFavorite={handleToggleFavorite}
          onClick={handlePropertyClick}
        />
      ))}
    </div>
  );

  const renderPropertyList = () => (
    <div className="space-y-4">
      {paginatedProperties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          isFavorite={favorites.includes(property.id)}
          onToggleFavorite={handleToggleFavorite}
          onClick={handlePropertyClick}
          layout="list"
        />
      ))}
    </div>
  );

  // Pagination Component
  const PaginationControls = () => {
    if (totalPages <= 1) return null;

    return (
      <nav className="flex justify-center items-center mt-8 space-x-2" aria-label="Property listings pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Go to previous page"
        >
          Previous
        </button>
        
        {/* Page numbers */}
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNum = i + 1;
          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`px-3 py-2 text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                currentPage === pageNum
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
              }`}
              aria-label={`Go to page ${pageNum}`}
              aria-current={currentPage === pageNum ? 'page' : undefined}
            >
              {pageNum}
            </button>
          );
        })}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Go to next page"
        >
          Next
        </button>
        
        <div className="ml-4" aria-live="polite" aria-atomic="true">
          <span className="text-sm text-gray-700">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredProperties.length)} of {filteredProperties.length} results
          </span>
        </div>
      </nav>
    );
  };

  // Generate structured data for properties
  const propertyStructuredData = useMemo(() => {
    if (filteredProperties.length === 0) return null;
    
    // Create individual property structured data
    const propertyListings = filteredProperties.slice(0, 10).map(property => ({
      '@type': 'RealEstateListing',
      name: property.title,
      description: property.description,
      url: `https://fractionax.io/marketplace/${property.id}`,
      image: property.images,
      price: {
        '@type': 'MonetaryAmount',
        currency: 'USD',
        value: property.price
      },
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'FractionaX'
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: property.address.split(',')[0],
        addressLocality: property.address.split(',')[1]?.trim(),
        addressRegion: property.address.split(',')[2]?.trim()?.split(' ')[0],
        postalCode: property.address.split(' ').pop()
      },
      numberOfRooms: property.beds,
      numberOfBathroomsTotal: property.baths,
      floorSize: {
        '@type': 'QuantitativeValue',
        value: property.sqft,
        unitCode: 'SQF'
      },
      yearBuilt: property.yearBuilt,
      ...(property.tokenized && {
        additionalProperty: {
          '@type': 'PropertyValue',
          name: 'Tokenized',
          value: true
        }
      })
    }));

    // Main structured data object
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${activeTab === 'approved' ? 'Approved' : 'AI-Discovered'} Property Listings - FractionaX`,
      description: `Browse ${activeTab === 'approved' ? 'verified approved' : 'AI-discovered'} real estate properties for tokenized investment opportunities.`,
      numberOfItems: filteredProperties.length,
      itemListElement: propertyListings.map((property, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: property
      })),
      provider: {
        '@type': 'Organization',
        name: 'FractionaX',
        url: 'https://fractionax.io',
        logo: 'https://fractionax.io/assets/images/MainLogo1.webp'
      }
    };
  }, [filteredProperties, activeTab]);

  // Generate SEO data with enhanced information
  const seoData = useMemo(() => {
    const tabSpecificTitle = activeTab === 'approved' 
      ? 'Approved Property Listings | FractionaX Marketplace'
      : 'AI-Discovered Properties | FractionaX Marketplace';
    
    const tabSpecificDescription = activeTab === 'approved'
      ? `Browse ${approvedListings.length} verified property listings approved for tokenized real estate investment. All properties available for fractional ownership through blockchain technology.`
      : `Discover ${aiDiscoveredProperties.length} AI-identified real estate opportunities with strong potential for fractionalization. Powered by advanced market analysis and investment criteria.`;

    const keywords = [
      'real estate marketplace',
      'tokenized properties',
      'fractional real estate investing',
      'blockchain real estate',
      'property tokenization',
      'FXCT token',
      'Base blockchain',
      ...(activeTab === 'approved' ? ['approved listings', 'verified properties'] : ['AI property discovery', 'machine learning real estate']),
      ...filteredProperties.slice(0, 3).map(p => p.address.split(',')[1]?.trim()).filter(Boolean)
    ];

    return generatePageSEO({
      title: tabSpecificTitle,
      description: tabSpecificDescription,
      keywords,
      url: `/marketplace?tab=${activeTab}`,
      type: 'website',
      structuredData: propertyStructuredData
    });
  }, [activeTab, approvedListings.length, aiDiscoveredProperties.length, filteredProperties, propertyStructuredData]);

  if (loading) {
    return (
      <>
        <SEO {...seoData} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading properties...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO {...seoData} />
      <div className="min-h-screen bg-gray-50 pt-16">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Title and Stats */}
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <BsCoin className="mr-2 text-blue-600" />
                    Marketplace
                  </h1>
                  <p className="text-sm text-gray-600">
                    {filteredProperties.length} properties • Powered by FXST
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="flex-1 max-w-2xl">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search by location, property type, or keywords..."
                />
              </div>

{/* View Controls */}
              <div className="flex items-center space-x-2">
                <div className="bg-gray-100 rounded-lg p-1 flex" role="group" aria-label="Property view options">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                      viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'
                    }`}
                    aria-label="Switch to grid view"
                    aria-pressed={viewMode === 'grid'}
                  >
                    <div className="grid grid-cols-2 gap-1 w-4 h-4" aria-hidden="true">
                      <div className="bg-current rounded-sm opacity-60"></div>
                      <div className="bg-current rounded-sm opacity-60"></div>
                      <div className="bg-current rounded-sm opacity-60"></div>
                      <div className="bg-current rounded-sm opacity-60"></div>
                    </div>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                      viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'
                    }`}
                    aria-label="Switch to list view"
                    aria-pressed={viewMode === 'list'}
                  >
                    <FiList className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  aria-expanded={showFilters}
                  aria-controls="property-filters"
                  aria-label={showFilters ? 'Hide property filters' : 'Show property filters'}
                >
                  <FiFilter className="w-4 h-4" aria-hidden="true" />
                  <span>Filters</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <TabNavigation />

        {/* Section Description */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {activeTab === 'approved' ? (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                      Approved Property Listings
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      These are verified properties that have been approved for listing on our platform. 
                      All properties are available for fractional ownership through tokenization.
                    </p>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                      AI-Discovered Properties
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      These properties have been identified by our AI system as having strong potential 
                      for fractionalization based on market data, location analysis, and investment criteria. 
                      They are not yet officially listed but represent opportunities worth exploring.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
{/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            role="tabpanel"
            id={`${activeTab}-tab-panel`}
            aria-labelledby={`${activeTab}-tab`}
            tabIndex="0"
          >
            {filteredProperties.length === 0 ? (
              <div className="text-center py-12" role="status" aria-live="polite">
                <FiHome className="mx-auto h-12 w-12 text-gray-400 mb-4" aria-hidden="true" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
              </div>
            ) : (
              <main aria-label={`${activeTab === 'approved' ? 'Approved' : 'AI-discovered'} property listings`}>
                <div role="region" aria-label="Property listings" className="mb-6">
                  {viewMode === 'grid' ? renderPropertyGrid() : renderPropertyList()}
                </div>
                <PaginationControls />
              </main>
            )}
          </motion.div>

          {/* Property Comparison Modal */}
          <AnimatePresence>
            {showComparison && compareList.length > 0 && (
              <PropertyComparison
                properties={compareList.map(id =>
                  [...approvedListings, ...aiDiscoveredProperties].find(p => p.id === id)
                )}
                onClose={() => setShowComparison(false)}
                onRemoveProperty={(id) =>
                  setCompareList(prev => prev.filter(compId => compId !== id))
                }
                onAddToFavorites={handleToggleFavorite}
              />
            )}
          </AnimatePresence>
          
          {/* Comparison Toolbar */}
          <AnimatePresence>
            {compareList.length > 0 && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-40"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <FiBarChart className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">
                      {compareList.length} {compareList.length === 1 ? 'property' : 'properties'} selected
                    </span>
                  </div>
                  
                  {compareList.length > 1 && (
                    <button
                      onClick={() => setShowComparison(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <span>Compare Properties</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => setCompareList([])}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                    <span>Clear</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Disclaimer */}
        <div className="bg-blue-50 border-t border-blue-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Important Disclaimer</h3>
              <p className="text-xs text-blue-700 leading-relaxed max-w-4xl mx-auto">
                All listings are provided by licensed real estate agents, licensed brokers, 
                the internal FractionaX admin team, and approved users who have been verified by FractionaX. 
                Property information is subject to verification and market conditions. 
                Past performance does not guarantee future results. Please consult with qualified 
                professionals before making any investment decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Smart Filter Panel Overlay */}
      <AnimatePresence>
        {showFilters && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="max-w-2xl w-full max-h-[90vh] overflow-hidden">
              <SmartFilterPanel
                onClose={() => setShowFilters(false)}
                onApplyFilters={(filters) => {
                  setFilters(filters);
                  trackFilterUsage(filters);
                }}
                currentFilters={filters}
                savedSearches={savedSearches}
                onSaveSearch={(search) => setSavedSearches((prev) => [...prev, search])}
                onDeleteSearch={(index) => {
                  const updated = [...savedSearches];
                  updated.splice(index, 1);
                  setSavedSearches(updated);
                }}
                onLoadSearch={(search) => setFilters(search.filters)}
              />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default Marketplace;
