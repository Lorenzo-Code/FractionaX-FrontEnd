import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiSearch, 
  FiFilter, 
  FiList,
  FiMapPin,
  FiCheckCircle,
  FiStar,
  FiHome,
  FiBarChart,
  FiX,
  FiTrendingUp,
  FiAward,
  FiImage,
  FiShoppingBag
} from "react-icons/fi";
import { BsCoin, BsRobot } from "react-icons/bs";
import { 
  HiOutlineHome,
  HiOutlinePhotograph,
  HiOutlineCreditCard,
  HiOutlineTruck,
  HiOutlineSparkles
} from "react-icons/hi";
import { SEO } from "../../../shared/components";
import { generatePageSEO } from "../../../shared/utils";
import { SmartFilterPanel, PropertyComparison } from "../components";
import SmartPropertySearch from "../../admin/ai-search/components/SmartPropertySearch";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import marketplaceService from '../services/marketplaceService';

// Analytics and monitoring imports
import {
  createRateLimiter
} from '../../../shared/utils';

const Marketplace = () => {
  // Create rate limiters for security  
  useMemo(() => createRateLimiter(30, 60000), []); // 30 searches per minute
  useMemo(() => createRateLimiter(20, 60000), []); // 20 favorites per minute
  
  // State management for multi-asset marketplace
  const [activeCategory, setActiveCategory] = useState('real-estate');
  const [activeTab, setActiveTab] = useState('approved');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Asset categories
  const assetCategories = [
    { 
      id: 'real-estate', 
      name: 'Real Estate', 
      icon: <HiOutlineHome className="w-5 h-5" />,
      color: 'blue',
      description: 'Properties, land, complexes, offices'
    },
    { 
      id: 'luxury-cars', 
      name: 'Luxury Cars', 
      icon: <HiOutlineTruck className="w-5 h-5" />,
      color: 'purple',
      description: 'Classic cars, supercars, vintage vehicles'
    },
    { 
      id: 'art-nfts', 
      name: 'Art & NFTs', 
      icon: <HiOutlinePhotograph className="w-5 h-5" />,
      color: 'pink',
      description: 'Physical art, digital art, NFT collections'
    },
    { 
      id: 'collectibles', 
      name: 'Collectibles', 
      icon: <HiOutlineCreditCard className="w-5 h-5" />,
      color: 'green',
      description: 'Trading cards, memorabilia, rare items'
    },
    { 
      id: 'defi-yield', 
      name: 'DeFi Yield', 
      icon: <HiOutlineSparkles className="w-5 h-5" />,
      color: 'orange',
      description: 'Staking, yield farming, protocols'
    }
  ];
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  
  // Data states
  const [approvedListings, setApprovedListings] = useState([]);
  const [aiDiscoveredProperties, setAiDiscoveredProperties] = useState([]);
  const [aiScanInProgress, setAiScanInProgress] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isLoadingSuggested, setIsLoadingSuggested] = useState(false);
  
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
  const [savedSearches, setSavedSearches] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  
  const [favorites, setFavorites] = useState([]);

  // Mock data for all asset categories - in production, this would come from your API
  const mockAssetData = useMemo(() => ({
    'real-estate': [
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
      images: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&auto=format", 
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop&auto=format"
      ],
      description: "Experience luxury living in this stunning modern condo located in the heart of downtown Houston. This 2-bedroom, 2-bathroom unit offers breathtaking city views from floor-to-ceiling windows and features high-end finishes throughout. The open-concept living space is perfect for entertaining, with a gourmet kitchen featuring quartz countertops and stainless steel appliances.",
      detailedDescription: "This exceptional downtown condo represents the pinnacle of urban living. The thoughtfully designed space maximizes natural light and city views while providing all the amenities of modern life. The master suite includes a walk-in closet and spa-like bathroom. Building amenities include 24/7 concierge, fitness center, rooftop pool, and valet parking.",
      features: ["parking", "gym", "pool", "doorman", "city_views", "hardwood_floors", "granite_counters", "stainless_appliances", "walk_in_closet", "balcony"],
      yearBuilt: 2020,
      lotSize: 0,
      coordinates: { lat: 29.7604, lng: -95.3698 },
      tokenized: false,
      tokenPrice: 0,
      totalTokens: 0,
      availableTokens: 0,
      expectedROI: 8.5,
      monthlyRent: 2500,
      hoa: 420,
      taxes: 5400,
      insurance: 1200,
      listingDate: "2024-01-15",
      status: "active",
      agent: {
        name: "Sarah Johnson",
        phone: "(713) 555-0123",
        email: "sarah@realty.com",
        company: "Downtown Realty Group",
        photo: "/api/placeholder/100/100",
        license: "TX-123456"
      },
      stats: {
        views: 245,
        saves: 12,
        daysOnMarket: 15,
        priceHistory: [
          { date: "2024-01-15", price: 450000, event: "Listed" }
        ]
      },
      neighborhood: {
        name: "Downtown Houston",
        walkability: 92,
        transitScore: 85,
        bikeScore: 78
      },
      schools: [
        { name: "Downtown Elementary", rating: 8, distance: 0.3 },
        { name: "Houston Middle School", rating: 7, distance: 0.8 },
        { name: "Central High School", rating: 9, distance: 1.2 }
      ]
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
      images: [
        "/api/placeholder/800/600",
        "/api/placeholder/800/600", 
        "/api/placeholder/800/600",
        "/api/placeholder/800/600",
        "/api/placeholder/800/600",
        "/api/placeholder/800/600"
      ],
      description: "Beautiful family home with pool and large backyard in desirable Sugar Land neighborhood. This spacious 4-bedroom, 3-bathroom home features an open floor plan, updated kitchen, and resort-style backyard with swimming pool.",
      detailedDescription: "This immaculate family home offers the perfect blend of comfort and luxury. The open-concept design creates seamless flow between living spaces, while large windows flood the home with natural light. The gourmet kitchen features granite countertops, custom cabinetry, and a large island perfect for family gatherings. The master suite is a true retreat with a spa-like bathroom and walk-in closet. The backyard oasis includes a sparkling pool, covered patio, and beautifully landscaped gardens.",
      features: ["pool", "garage", "garden", "fireplace", "granite_counters", "hardwood_floors", "crown_molding", "ceiling_fans", "covered_patio", "sprinkler_system"],
      yearBuilt: 2015,
      lotSize: 0.3,
      coordinates: { lat: 29.6196, lng: -95.6349 },
      tokenized: true,
      tokenPrice: 100,
      totalTokens: 6500,
      availableTokens: 2100,
      expectedROI: 12.3,
      monthlyRent: 3200,
      hoa: 150,
      taxes: 9750,
      insurance: 1800,
      listingDate: "2024-01-08",
      status: "active",
      agent: {
        name: "Mike Davis",
        phone: "(281) 555-0456",
        email: "mike@realty.com",
        company: "Sugar Land Properties",
        photo: "/api/placeholder/100/100",
        license: "TX-789012"
      },
      stats: {
        views: 412,
        saves: 28,
        daysOnMarket: 8,
        priceHistory: [
          { date: "2024-01-08", price: 650000, event: "Listed" }
        ]
      },
      neighborhood: {
        name: "Sugar Land",
        walkability: 65,
        transitScore: 42,
        bikeScore: 58
      },
      schools: [
        { name: "Oak Elementary", rating: 9, distance: 0.5 },
        { name: "Sugar Land Middle", rating: 9, distance: 1.2 },
        { name: "Clements High School", rating: 10, distance: 2.1 }
      ]
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
    }],
    
    'luxury-cars': [
      {
        id: 101,
        title: "1967 Ford Mustang Shelby GT500",
        location: "Beverly Hills, CA",
        price: 285000,
        assetType: "classic-car",
        year: 1967,
        mileage: 42000,
        condition: "Excellent",
        images: ["/api/placeholder/800/600", "/api/placeholder/800/600"],
        description: "Rare 1967 Shelby GT500 with matching numbers engine and transmission.",
        features: ["matching_numbers", "original_paint", "documented_history"],
        tokenized: true,
        tokenPrice: 500,
        totalTokens: 570,
        availableTokens: 142,
        expectedROI: 18.5,
        monthlyAppreciation: 2.1,
        stats: { views: 1234, saves: 89, daysOnMarket: 5 },
        certification: "Barrett-Jackson Authenticated"
      }
    ],
    
    'art-nfts': [
      {
        id: 201,
        title: "CryptoPunks #7804",
        artist: "Larva Labs",
        price: 175000,
        assetType: "nft",
        blockchain: "Ethereum",
        edition: "1 of 1",
        images: ["/api/placeholder/400/400", "/api/placeholder/400/400"],
        description: "Rare alien CryptoPunk with pipe and cap attributes.",
        features: ["alien_type", "pipe_attribute", "cap_attribute"],
        tokenized: true,
        tokenPrice: 250,
        totalTokens: 700,
        availableTokens: 280,
        expectedROI: 22.3,
        monthlyAppreciation: 3.2,
        stats: { views: 892, saves: 156, daysOnMarket: 2 },
        provenance: "Original owner since mint"
      }
    ],
    
    'collectibles': [
      {
        id: 301,
        title: "1998 Pokémon Base Set 1st Edition Charizard PSA 10",
        category: "Trading Cards",
        price: 42000,
        assetType: "trading-card",
        grade: "PSA 10",
        edition: "1st Edition",
        images: ["/api/placeholder/400/600", "/api/placeholder/400/600"],
        description: "Perfect condition 1st Edition Base Set Charizard, the holy grail of Pokémon cards.",
        features: ["psa_10", "first_edition", "shadowless"],
        tokenized: false,
        expectedROI: 15.8,
        monthlyAppreciation: 1.8,
        stats: { views: 567, saves: 78, daysOnMarket: 12 },
        authentication: "PSA Certified"
      }
    ],
    
    'defi-yield': [
      {
        id: 401,
        title: "Compound Finance USDC Pool",
        protocol: "Compound",
        price: 50000,
        assetType: "defi-pool",
        apy: 8.45,
        tvl: 2500000,
        blockchain: "Ethereum",
        images: ["/api/placeholder/400/300"],
        description: "Stable yield farming opportunity in Compound's USDC lending pool.",
        features: ["audited_protocol", "stable_yield", "high_liquidity"],
        tokenized: true,
        tokenPrice: 100,
        totalTokens: 500,
        availableTokens: 200,
        expectedROI: 8.45,
        monthlyYield: 0.7,
        stats: { views: 345, saves: 45, daysOnMarket: 1 },
        riskLevel: "Low"
      }
    ]
  }), []);

  // Function to fetch AI-powered LoopNet + GPT marketplace listings
  const fetchAISuggestedListings = async () => {
    try {
      setIsLoadingSuggested(true);
      setApiError(null);
      console.log('🤖🏠 Fetching AI-powered LoopNet + GPT marketplace listings...');
      
      let allProperties = [];
      
      try {
        // Fetch AI-powered LoopNet + GPT listings
        console.log('🚀 Generating AI investment-focused property listings...');
        const aiCriteria = {
          location: 'Houston, TX', // Default location - could be dynamic based on user
          maxPrice: 800000,
          minPrice: 100000,
          propertyTypes: ['house', 'condo', 'townhouse'],
          targetROI: 8,
          includeRentals: true,
          limit: 25 // Get a good selection of properties
        };
        
        const aiResult = await marketplaceService.fetchAIMarketplaceListings(aiCriteria);
        const aiProperties = aiResult.listings || [];
        
        console.log(`🎆 AI Generated ${aiProperties.length} investment-ready properties`);
        console.log('📊 AI Summary:', aiResult.summary);
        
        allProperties = [...allProperties, ...aiProperties];
        
      } catch (aiError) {
        console.warn('⚠️ Could not fetch AI LoopNet listings:', aiError.message);
      }
      
      // Fallback: Try to fetch existing suggested deals from SuggestedDeal model
      try {
        console.log('📋 Fetching fallback suggested deals...');
        const suggestedDeals = await marketplaceService.fetchSuggestedListings();
        const transformedSuggestedProperties = marketplaceService.transformSuggestedDealsToProperties(suggestedDeals);
        console.log(`✅ Found ${transformedSuggestedProperties.length} fallback suggested deals`);
        
        // Add fallback deals but mark them as such
        const fallbackProperties = transformedSuggestedProperties.map(prop => ({
          ...prop,
          source: 'suggested-deals-fallback',
          aiGenerated: true
        }));
        
        allProperties = [...allProperties, ...fallbackProperties];
      } catch (suggestedError) {
        console.warn('⚠️ Could not fetch fallback suggested deals:', suggestedError.message);
      }
      
      console.log(`✅ Total AI-discovered properties: ${allProperties.length}`);
      
      // Set the combined AI-discovered properties
      setAiDiscoveredProperties(allProperties);
      
      // Show success toast with detailed breakdown
      if (allProperties.length > 0) {
        const aiLoopNetCount = allProperties.filter(p => p.source === 'ai-loopnet-gpt').length;
        const fallbackCount = allProperties.filter(p => p.source === 'suggested-deals-fallback').length;
        
        let message;
        if (aiLoopNetCount > 0 && fallbackCount > 0) {
          message = `Found ${allProperties.length} properties! ${aiLoopNetCount} AI-analyzed from LoopNet, ${fallbackCount} from suggested deals.`;
        } else if (aiLoopNetCount > 0) {
          message = `🎆 Generated ${aiLoopNetCount} AI-analyzed investment properties using LoopNet + GPT!`;
        } else if (fallbackCount > 0) {
          message = `Found ${fallbackCount} properties from suggested deals database.`;
        } else {
          message = `Found ${allProperties.length} AI-discovered properties!`;
        }
        
        toast.success(message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.info('No AI-discovered properties available at the moment. Our AI is continuously analyzing new opportunities.', {
          position: "bottom-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      
    } catch (error) {
      console.error('❌ Failed to fetch AI-suggested listings:', error);
      setApiError(error.message);
      setAiDiscoveredProperties([]);
      
      // Show error toast
      toast.error('Failed to load AI-discovered properties. Our AI system may be busy analyzing new opportunities.', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoadingSuggested(false);
    }
  };

  useEffect(() => {
    const loadMarketplaceData = async () => {
      setLoading(true);
      
      if (activeCategory === 'real-estate') {
        // For real estate category, load both mock approved listings and real AI-suggested listings
        
        // Load mock approved listings (these would come from a separate API in production)
        const categoryData = mockAssetData[activeCategory] || [];
        setApprovedListings(categoryData.slice(0, 1)); // Mock approved data
        
        // Load real AI-suggested listings from backend
        await fetchAISuggestedListings();
      } else {
        // For other categories, use mock data for now
        const categoryData = mockAssetData[activeCategory] || [];
        setApprovedListings(categoryData.slice(0, 1));
        setAiDiscoveredProperties(categoryData.slice(1));
      }
      
      setLoading(false);
    };
    
    loadMarketplaceData();
  }, [activeCategory]);

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
    setCurrentPage(1); // Reset to first page when changing tabs
    setActiveTab(newTab);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePropertyClick = (property) => {
    // Navigate to the Property Details page
    window.location.href = `/property/${property.id}`;
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const renderPropertyGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {paginatedProperties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          isFavorite={favorites.includes(property.id)}
          onToggleFavorite={handleToggleFavorite}
          onClick={handlePropertyClick}
          compareList={compareList}
          onCompareProperty={handleCompareProperty}
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
          compareList={compareList}
          onCompareProperty={handleCompareProperty}
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
                <SmartPropertySearch 
                  showInput={true} 
                  showSuggestions={false} 
                  onSearch={handleSearch}
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

        {/* Asset Category Selector */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center space-x-2 overflow-x-auto">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap mr-4">Browse by category:</span>
              {assetCategories.map((category) => {
                const colorClasses = {
                  blue: activeCategory === category.id 
                    ? 'bg-blue-100 text-blue-800 border-blue-200' 
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-blue-50 hover:text-blue-700',
                  purple: activeCategory === category.id 
                    ? 'bg-purple-100 text-purple-800 border-purple-200' 
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-purple-50 hover:text-purple-700',
                  pink: activeCategory === category.id 
                    ? 'bg-pink-100 text-pink-800 border-pink-200' 
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-pink-50 hover:text-pink-700',
                  green: activeCategory === category.id 
                    ? 'bg-green-100 text-green-800 border-green-200' 
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-green-50 hover:text-green-700',
                  orange: activeCategory === category.id 
                    ? 'bg-orange-100 text-orange-800 border-orange-200' 
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-orange-50 hover:text-orange-700'
                };

                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(category.id);
                      setCurrentPage(1);
                      setLoading(true);
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      colorClasses[category.color]
                    }`}
                    aria-pressed={activeCategory === category.id}
                  >
                    {category.icon}
                    <span>{category.name}</span>
                    <span className="text-xs opacity-75">({(mockAssetData[category.id] || []).length})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8" aria-label="Asset listing tabs" role="tablist">
              <button
                onClick={() => handleTabChange('approved')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  activeTab === 'approved'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                role="tab"
                id="approved-tab"
                aria-controls="approved-tab-panel"
                aria-selected={activeTab === 'approved'}
                tabIndex={activeTab === 'approved' ? 0 : -1}
              >
                <div className="flex items-center space-x-2">
                  <FiCheckCircle className="w-4 h-4" aria-hidden="true" />
                  <span>Approved Listings</span>
                  <span className="bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs font-medium">
                    {approvedListings.length}
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => handleTabChange('ai-discovered')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  activeTab === 'ai-discovered'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                role="tab"
                id="ai-discovered-tab"
                aria-controls="ai-discovered-tab-panel"
                aria-selected={activeTab === 'ai-discovered'}
                tabIndex={activeTab === 'ai-discovered' ? 0 : -1}
              >
                <div className="flex items-center space-x-2">
                  <BsRobot className="w-4 h-4" aria-hidden="true" />
                  <span>AI-Discovered</span>
                  <span className="bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs font-medium">
                    {aiDiscoveredProperties.length}
                  </span>
                  {aiScanInProgress && (
                    <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600" aria-hidden="true"></div>
                  )}
                </div>
              </button>
            </nav>
          </div>
        </div>

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
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                      <p className="text-blue-800 text-sm font-medium mb-1">
                        🏗️ Development Notice
                      </p>
                      <p className="text-blue-700 text-xs leading-relaxed">
                        The listings below are example properties. In production, verified users will be able to post their own property listings for tokenization approval.
                      </p>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      These are verified properties that have been approved for listing on our platform. 
                      All properties are available for fractional ownership through tokenization.
                    </p>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                      AI-Discovered Investment Properties
                    </h2>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                      <p className="text-green-800 text-sm font-medium mb-1">
                        🎆 Powered by LoopNet + GPT AI
                      </p>
                      <p className="text-green-700 text-xs leading-relaxed">
                        Our AI system analyzes real-time market data from LoopNet using advanced GPT models to identify properties with exceptional investment potential and fractionalization suitability.
                      </p>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Each property is scored based on investment fundamentals, rental potential, location analysis, 
                      and tokenization suitability. Properties shown here meet our AI's criteria for strong ROI potential 
                      and fractional ownership viability.
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

// Asset Card Component (Universal for all asset types)
const PropertyCard = ({ property, isFavorite, onToggleFavorite, onClick, layout = 'grid', compareList, onCompareProperty }) => {
  const isInComparison = compareList.includes(property.id);

  // Determine asset type for different display logic
  const isRealEstate = property.beds && property.baths && property.sqft;
  const isLuxuryCar = property.year && property.mileage;
  const isArtNft = property.artist || property.blockchain;
  const isCollectible = property.grade || property.authentication;
  const isDefiYield = property.protocol && property.apy;

  // Get location/address based on asset type
  const getLocationText = () => {
    if (property.address) return property.address;
    if (property.location) return property.location;
    if (property.artist) return `by ${property.artist}`;
    if (property.protocol) return `${property.protocol} Protocol`;
    return property.category || 'Location not specified';
  };

  // Get specifications based on asset type
  const renderSpecifications = () => {
    if (isRealEstate) {
      return (
        <div className="flex items-center text-sm text-gray-600 mb-3" aria-label="Property specifications">
          <span className="mr-4">{property.beds} beds</span>
          <span className="mr-4">{property.baths} baths</span>
          <span>{property.sqft.toLocaleString()} sqft</span>
        </div>
      );
    }
    
    if (isLuxuryCar) {
      return (
        <div className="flex items-center text-sm text-gray-600 mb-3" aria-label="Vehicle specifications">
          <span className="mr-4">{property.year}</span>
          <span className="mr-4">{property.mileage?.toLocaleString()} miles</span>
          <span>{property.condition}</span>
        </div>
      );
    }
    
    if (isArtNft) {
      return (
        <div className="flex items-center text-sm text-gray-600 mb-3" aria-label="Art specifications">
          {property.edition && <span className="mr-4">{property.edition}</span>}
          {property.blockchain && <span className="mr-4">{property.blockchain}</span>}
        </div>
      );
    }
    
    if (isCollectible) {
      return (
        <div className="flex items-center text-sm text-gray-600 mb-3" aria-label="Collectible specifications">
          {property.grade && <span className="mr-4">Grade: {property.grade}</span>}
          {property.edition && <span className="mr-4">{property.edition}</span>}
        </div>
      );
    }
    
    if (isDefiYield) {
      return (
        <div className="flex items-center text-sm text-gray-600 mb-3" aria-label="DeFi specifications">
          <span className="mr-4">APY: {property.apy}%</span>
          <span className="mr-4">TVL: ${(property.tvl / 1000000).toFixed(1)}M</span>
          {property.riskLevel && <span>{property.riskLevel} Risk</span>}
        </div>
      );
    }
    
    return null;
  };

  // Get yield/income info based on asset type
  const renderYieldInfo = () => {
    if (property.expectedROI) {
      let yieldText = 'Expected ROI';
      let periodText = '';
      
      if (isRealEstate && property.monthlyRent) {
        periodText = `$${property.monthlyRent}/month`;
      } else if (isLuxuryCar && property.monthlyAppreciation) {
        yieldText = 'Monthly Appreciation';
        periodText = `${property.monthlyAppreciation}%/month`;
      } else if (isArtNft && property.monthlyAppreciation) {
        yieldText = 'Monthly Appreciation';
        periodText = `${property.monthlyAppreciation}%/month`;
      } else if (isCollectible && property.monthlyAppreciation) {
        yieldText = 'Monthly Appreciation';
        periodText = `${property.monthlyAppreciation}%/month`;
      } else if (isDefiYield && property.monthlyYield) {
        yieldText = 'Monthly Yield';
        periodText = `${property.monthlyYield}%/month`;
      }
      
      return (
        <div className="flex items-center justify-between text-sm">
          <span className="text-green-600 font-medium" aria-label={`${yieldText}: ${property.expectedROI} percent`}>
            {property.expectedROI}% {yieldText}
          </span>
          {periodText && (
            <span className="text-gray-500" aria-label={`Period yield: ${periodText}`}>
              {periodText}
            </span>
          )}
        </div>
      );
    }
    return null;
  };

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
      aria-label={`View details for ${property.title} at ${getLocationText()}, priced at $${property.price.toLocaleString()}`}
    >
      {property.images && property.images.length > 0 ? (
        <div className={`${layout === 'list' ? 'w-48 h-32' : 'h-48'} relative`}>
          <img 
            src={property.images[0]} 
            alt={`${property.title} - ${property.assetType || property.propertyType || 'Asset'}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.warn('❌ Failed to load image for property:', property.title);
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = `
                <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                  <div class="text-center text-gray-500">
                    <span class="text-xs">No Image Available</span>
                  </div>
                </div>
              `;
            }}
          />
          {isInComparison && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              In Comparison
            </div>
          )}
        </div>
      ) : (
        <div className={`${layout === 'list' ? 'w-48 h-32' : 'h-48'} relative bg-gray-200 flex items-center justify-center`}>
          <div className="text-center text-gray-500">
            <FiImage className="w-8 h-8 mx-auto mb-2 opacity-50" aria-hidden="true" />
            <p className="text-xs">Real images loading...</p>
            <p className="text-xs opacity-75">Zillow photos only</p>
          </div>
          {isInComparison && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              In Comparison
            </div>
          )}
        </div>
      )}
      <div className="p-4 flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-900 truncate">{property.title}</h3>
          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCompareProperty(property.id);
              }}
              className={`p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                isInComparison ? 'text-blue-600 hover:text-blue-700' : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-label={isInComparison ? `Remove ${property.title} from comparison` : `Add ${property.title} to comparison`}
              tabIndex="0"
            >
              <FiBarChart className="w-5 h-5" aria-hidden="true" />
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
          {getLocationText()}
        </p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-blue-600" aria-label={`Price: $${property.price.toLocaleString()}`}>
            ${property.price.toLocaleString()}
          </span>
          {property.tokenized && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full" aria-label="This asset is available for tokenized investment">
              Tokenized
            </span>
          )}
        </div>
        {renderSpecifications()}
        {renderYieldInfo()}
      </div>
    </article>
  );
};

export default Marketplace;
