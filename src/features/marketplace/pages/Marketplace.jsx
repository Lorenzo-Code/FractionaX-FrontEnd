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
  FiShoppingBag,
  FiMap
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
import { SmartFilterPanel, PropertyComparison, PropertyMap, PropertyCard } from "../components";
import SmartPropertySearch from "../../admin/ai-search/components/SmartPropertySearch";
import MultiModeSearch from "../components/MultiModeSearch";
import AddressSearch from "../components/AddressSearch";
import CompactAISearch from "../components/CompactAISearch";
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
  const [activeTab, setActiveTab] = useState('ai-discovered');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Multi-mode search states
  const [searchMode, setSearchMode] = useState('internal');
  const [aiChatMessages, setAiChatMessages] = useState([]);
  const [addressSearchResults, setAddressSearchResults] = useState(null);
  
  // Asset categories - Currently focusing on Real Estate for launch
  // Other asset categories will be enabled in future phases
  const assetCategories = [
    { 
      id: 'real-estate', 
      name: 'Real Estate', 
      icon: <HiOutlineHome className="w-5 h-5" />,
      color: 'blue',
      description: 'Properties, land, complexes, offices'
    }
  ];
  
  // Phase 2 asset categories - will be uncommented for multi-asset launch
  // const futureAssetCategories = [
  //   { 
  //     id: 'luxury-cars', 
  //     name: 'Luxury Cars', 
  //     icon: <HiOutlineTruck className="w-5 h-5" />,
  //     color: 'purple',
  //     description: 'Classic cars, supercars, vintage vehicles'
  //   },
  //   { 
  //     id: 'art-nfts', 
  //     name: 'Art & NFTs', 
  //     icon: <HiOutlinePhotograph className="w-5 h-5" />,
  //     color: 'pink',
  //     description: 'Physical art, digital art, NFT collections'
  //   },
  //   { 
  //     id: 'collectibles', 
  //     name: 'Collectibles', 
  //     icon: <HiOutlineCreditCard className="w-5 h-5" />,
  //     color: 'green',
  //     description: 'Trading cards, memorabilia, rare items'
  //   },
  //   { 
  //     id: 'defi-yield', 
  //     name: 'DeFi Yield', 
  //     icon: <HiOutlineSparkles className="w-5 h-5" />,
  //     color: 'orange',
  //     description: 'Staking, yield farming, protocols'
  //   }
  // ];
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  
  // Data states
  const [approvedListings, setApprovedListings] = useState([]);
  const [aiDiscoveredProperties, setAiDiscoveredProperties] = useState([]);
  const [aiScanInProgress, setAiScanInProgress] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isLoadingSuggested, setIsLoadingSuggested] = useState(false);
  
  // FXCT Bidding states
  const [userBids, setUserBids] = useState({}); // propertyId -> bidAmount
  const [propertyBidData, setPropertyBidData] = useState({}); // propertyId -> { totalFXCT, bidderCount, threshold, status }
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedPropertyForBid, setSelectedPropertyForBid] = useState(null);
  
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
  
  // AI search enhancement states
  const [lastAiSearchQuery, setLastAiSearchQuery] = useState('');
  const [aiSearchActive, setAiSearchActive] = useState(false);
  
  // UI state for collapsible sections
  const [showFullDiscoverySection, setShowFullDiscoverySection] = useState(false);
  
  const [favorites, setFavorites] = useState([]);
  
  // New properties notification
  const [newPropertiesCount, setNewPropertiesCount] = useState(0);
  const [quickFilters, setQuickFilters] = useState({
    highROI: false,
    under500K: false,
    newThisWeek: false
  });

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
      tokenized: false,
      tokenPrice: 0,
      totalTokens: 0,
      availableTokens: 0,
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
        
        // Add fallback deals but mark them as such and ensure they're not tokenized
        const fallbackProperties = transformedSuggestedProperties.map(prop => ({
          ...prop,
          source: 'suggested-deals-fallback',
          aiGenerated: true,
          tokenized: false,
          tokenPrice: 0,
          totalTokens: 0,
          availableTokens: 0
        }));
        
        allProperties = [...allProperties, ...fallbackProperties];
      } catch (suggestedError) {
        console.warn('⚠️ Could not fetch fallback suggested deals:', suggestedError.message);
      }
      
      console.log(`✅ Total AI-discovered properties: ${allProperties.length}`);
      
      // Check for new properties since last load
      const previousCount = aiDiscoveredProperties.length;
      const newCount = Math.max(0, allProperties.length - previousCount);
      if (newCount > 0) {
        setNewPropertiesCount(newCount);
        // Auto-hide notification after 10 seconds
        setTimeout(() => setNewPropertiesCount(0), 10000);
      }
      
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

  // Generate dynamic interest tracking data for AI-discovered properties
  const generateInterestData = (propertyId, price, daysOnMarket = 1) => {
    // Base threshold calculation: roughly 5-15% of property value in FXCT
    const baseThreshold = Math.floor((price * 0.08) / 10) * 10; // Round to nearest 10
    
    // Generate realistic current interest based on property appeal and time
    const appealFactor = Math.random() * 0.7 + 0.3; // 0.3 to 1.0
    const timeFactor = Math.min(daysOnMarket / 30, 1); // Up to 30 days max effect
    const currentInterest = Math.floor(baseThreshold * appealFactor * (0.5 + timeFactor * 0.5));
    
    // Calculate progress percentage
    const progress = Math.min((currentInterest / baseThreshold) * 100, 99.9); // Cap at 99.9% to show "almost there"
    
    // Generate bidder count (roughly 1 bidder per 1000-3000 FXCT)
    const bidderCount = Math.max(Math.floor(currentInterest / (1500 + Math.random() * 1500)), 1);
    
    // Estimate time to threshold based on current momentum
    let timeEstimate;
    if (progress > 80) timeEstimate = '1-2 days';
    else if (progress > 60) timeEstimate = '3-5 days';
    else if (progress > 40) timeEstimate = '1-2 weeks';
    else if (progress > 20) timeEstimate = '2-4 weeks';
    else timeEstimate = '1-2 months';
    
    // Generate recent activity
    const recentBids = [];
    const numRecentBids = Math.min(bidderCount, Math.floor(Math.random() * 5) + 1);
    for (let i = 0; i < numRecentBids; i++) {
      recentBids.push({
        userId: `user${Math.floor(Math.random() * 999) + 100}`,
        amount: Math.floor(Math.random() * 2000) + 250,
        timestamp: Date.now() - (Math.random() * 3600000 * 24 * 3) // Within last 3 days
      });
    }
    
    return {
      currentInterest,
      threshold: baseThreshold,
      bidderCount,
      progress,
      timeEstimate,
      recentBids: recentBids.sort((a, b) => b.timestamp - a.timestamp), // Most recent first
      status: progress > 95 ? 'nearly_complete' : progress > 70 ? 'high_momentum' : progress > 30 ? 'building' : 'early',
      trendDirection: Math.random() > 0.3 ? 'up' : Math.random() > 0.5 ? 'stable' : 'down'
    };
  };

  // Initialize comprehensive interest data for properties
  useEffect(() => {
    // Generate interest data for approved properties (for FXCT bidding)
    const approvedInterestData = {};
    approvedListings.forEach(property => {
      if (!property.tokenized) { // Only non-tokenized properties can receive FXCT bids
        approvedInterestData[property.id] = generateInterestData(
          property.id, 
          property.price, 
          property.stats?.daysOnMarket || 1
        );
      }
    });
    
    // Generate interest data for AI-discovered properties
    const aiInterestData = {};
    aiDiscoveredProperties.forEach(property => {
      aiInterestData[property.id] = generateInterestData(
        property.id,
        property.price,
        Math.floor(Math.random() * 14) + 1 // 1-14 days since discovery
      );
    });
    
    // Combine all interest data
    const allInterestData = { ...approvedInterestData, ...aiInterestData };
    
    console.log('📊 Generated interest data for properties:', Object.keys(allInterestData).length);
    setPropertyBidData(allInterestData);
  }, [approvedListings, aiDiscoveredProperties]);

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

    // Quick filters
    if (quickFilters.highROI) {
      filtered = filtered.filter(property => (property.expectedROI || 0) >= 10);
    }
    
    if (quickFilters.under500K) {
      filtered = filtered.filter(property => property.price <= 500000);
    }
    
    if (quickFilters.newThisWeek) {
      const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(property => {
        if (property.stats?.daysOnMarket) {
          return property.stats.daysOnMarket <= 7;
        }
        // Fallback for properties without daysOnMarket
        const listingDate = new Date(property.listingDate || Date.now());
        return listingDate.getTime() >= oneWeekAgo;
      });
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
        filtered.sort((a, b) => (a.stats?.daysOnMarket || 0) - (b.stats?.daysOnMarket || 0));
        break;
      case 'interest':
        filtered.sort((a, b) => {
          const aInterest = propertyBidData[a.id];
          const bInterest = propertyBidData[b.id];
          const aProgress = aInterest?.progress || 0;
          const bProgress = bInterest?.progress || 0;
          const aBidders = aInterest?.bidderCount || 0;
          const bBidders = bInterest?.bidderCount || 0;
          // Sort by progress percentage first, then by bidder count
          if (bProgress !== aProgress) {
            return bProgress - aProgress;
          }
          return bBidders - aBidders;
        });
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
  }, [currentProperties, filters, searchQuery, quickFilters, propertyBidData]);

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

  // Multi-mode search handlers
  const handleMultiModeSearch = async (propertiesOrQuery, modeOrResponse, results) => {
    console.log(`🔍 Multi-mode search called:`, { propertiesOrQuery, modeOrResponse, results });
    
    // Handle CompactAISearch format: (properties, response)
    if (Array.isArray(propertiesOrQuery)) {
      const properties = propertiesOrQuery;
      const response = modeOrResponse;
      
      console.log(`🤖 AI Search Results: ${properties.length} properties found`);
      
      if (properties.length > 0) {
        // Mark properties as AI-discovered from search and ensure they're not tokenized
        const aiSearchProperties = properties.map(prop => ({
          ...prop,
          source: 'ai-search-direct',
          aiGenerated: true,
          tokenized: false,
          tokenPrice: 0,
          totalTokens: 0,
          availableTokens: 0,
          searchQuery: response // Store the AI response as context
        }));
        
        setAiDiscoveredProperties(aiSearchProperties);
        setActiveTab('ai-discovered');
        setLastAiSearchQuery(response);
        setAiSearchActive(true);
        
        // Auto-hide the AI search indicator after 5 seconds
        setTimeout(() => setAiSearchActive(false), 5000);
      }
    }
    // Handle legacy format: (query, mode, results)
    else {
      const query = propertiesOrQuery;
      const mode = modeOrResponse;
      
      console.log(`🔍 Legacy search: ${mode}`, { query, results });
      
      if (mode === 'internal') {
        setSearchQuery(query);
        setAiSearchActive(false); // Clear AI search indicator
      } else if (mode === 'ai-search') {
        // Handle AI search results - could update the AI discovered properties
        if (results && results.length > 0) {
          const aiSearchProperties = results.map(prop => ({
            ...prop,
            source: 'ai-search-legacy',
            aiGenerated: true,
            tokenized: false,
            tokenPrice: 0,
            totalTokens: 0,
            availableTokens: 0
          }));
          setAiDiscoveredProperties(aiSearchProperties);
          setActiveTab('ai-discovered');
          setLastAiSearchQuery(query);
          setAiSearchActive(true);
        }
      } else if (mode === 'address-search') {
        // Handle address search results
        setAddressSearchResults(results);
        toast.success('Address analysis completed!');
      }
    }
  };
  
  const handleInternalSearch = async (query) => {
    setSearchQuery(query);
    // Could add more advanced internal search logic here
  };
  
  const handleAddressSearch = async (query) => {
    console.log('🏠 Address search:', query);
    // Address search is handled within the AddressSearch component
    // Results will be passed back via onResults callback
  };
  
  const handleSearchModeChange = (mode) => {
    setSearchMode(mode);
    console.log('🔄 Search mode changed to:', mode);
  };

  // Skeleton Loading Card Component
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 animate-pulse">
      {/* Image skeleton */}
      <div className="h-48 bg-gray-200 relative">
        <div className="absolute top-2 left-2 bg-gray-300 rounded-full h-6 w-16"></div>
        <div className="absolute top-2 right-2 bg-gray-300 rounded-full h-6 w-8"></div>
      </div>
      <div className="p-4">
        {/* Title skeleton */}
        <div className="h-5 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4 mb-3"></div>
        
        {/* Price skeleton */}
        <div className="flex justify-between items-center mb-3">
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
        </div>
        
        {/* Specs skeleton */}
        <div className="h-3 bg-gray-200 rounded w-full mb-3"></div>
        
        {/* Interest section skeleton */}
        <div className="bg-gray-100 rounded-lg p-2 mb-3">
          <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        
        {/* Buttons skeleton */}
        <div className="flex gap-2">
          <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-20"></div>
        </div>
      </div>
    </div>
  );

  const renderPropertyGrid = () => {
    // Show skeleton cards while loading AI properties
    if (isLoadingSuggested && activeTab === 'ai-discovered') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }, (_, i) => (
            <SkeletonCard key={`skeleton-${i}`} />
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            isFavorite={favorites.includes(property.id)}
            onToggleFavorite={handleToggleFavorite}
            onClick={handlePropertyClick}
            compareList={compareList}
            onCompareProperty={handleCompareProperty}
            bidData={propertyBidData[property.id]}
            userBid={userBids[property.id]}
            isAiDiscovered={activeTab === 'ai-discovered'}
          />
        ))}
      </div>
    );
  };

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
      <div className="min-h-screen bg-gray-50 pt-4">
        {/* Compact Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Title and Stats */}
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 flex items-center">
                    <BsCoin className="mr-2 text-blue-600" />
                    Fractional Marketplace
                  </h1>
                  <p className="text-xs text-gray-600">
                    {filteredProperties.length} properties • 💎 Start with $100 • 🤖 AI-curated
                  </p>
                </div>
              </div>

              {/* AI-Powered Conversational Search */}
              <div className="flex-1 max-w-2xl">
                <CompactAISearch 
                  onResults={handleMultiModeSearch}
                  onConversationUpdate={setAiChatMessages}
                  placeholder="Search properties or chat with our AI assistant..."
                />
              </div>

              {/* View Controls */}
              <div className="flex items-center space-x-2">
                <div className="bg-gray-100 rounded-lg p-1 flex" role="group" aria-label="Property view options">
                  <button
                    onClick={() => { setViewMode('grid'); setShowMap(false); }}
                    className={`p-1.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                      viewMode === 'grid' && !showMap ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'
                    }`}
                    aria-label="Switch to grid view"
                    aria-pressed={viewMode === 'grid' && !showMap}
                  >
                    <div className="grid grid-cols-2 gap-1 w-3.5 h-3.5" aria-hidden="true">
                      <div className="bg-current rounded-sm opacity-60"></div>
                      <div className="bg-current rounded-sm opacity-60"></div>
                      <div className="bg-current rounded-sm opacity-60"></div>
                      <div className="bg-current rounded-sm opacity-60"></div>
                    </div>
                  </button>
                  <button
                    onClick={() => { setViewMode('list'); setShowMap(false); }}
                    className={`p-1.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                      viewMode === 'list' && !showMap ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'
                    }`}
                    aria-label="Switch to list view"
                    aria-pressed={viewMode === 'list' && !showMap}
                  >
                    <FiList className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => setShowMap(!showMap)}
                    className={`p-1.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                      showMap ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'
                    }`}
                    aria-label="Switch to map view"
                    aria-pressed={showMap}
                  >
                    <FiMap className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm"
                  aria-expanded={showFilters}
                  aria-controls="property-filters"
                  aria-label={showFilters ? 'Hide property filters' : 'Show property filters'}
                >
                  <FiFilter className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Filters</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Asset Category & Tab Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              {/* Asset Category Selector - Compact */}
              <div className="flex items-center space-x-2 overflow-x-auto">
                <span className="text-xs font-medium text-gray-700 whitespace-nowrap mr-2">Category:</span>
                {assetCategories.map((category) => {
                  const colorClasses = {
                    blue: activeCategory === category.id 
                      ? 'bg-blue-100 text-blue-800 border-blue-200' 
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-blue-50 hover:text-blue-700'
                  };

                  return (
                    <button
                      key={category.id}
                      onClick={() => {
                        setActiveCategory(category.id);
                        setCurrentPage(1);
                        setLoading(true);
                      }}
                      className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
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
                
                {/* Coming Soon Categories - Compact */}
                <div className="flex items-center space-x-1.5 px-2 py-1.5 rounded-md border border-dashed border-gray-300 text-xs font-medium text-gray-400 whitespace-nowrap cursor-not-allowed">
                  <span>🚀</span>
                  <span>More Categories</span>
                  <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">2026</span>
                </div>
              </div>

              {/* Tab Navigation - Compact */}
              <nav className="flex space-x-4" aria-label="Asset listing tabs" role="tablist">
                <button
                  onClick={() => handleTabChange('approved')}
                  className={`py-2 px-1 border-b-2 font-medium text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
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
                  <div className="flex items-center space-x-1.5">
                    <FiCheckCircle className="w-3 h-3" aria-hidden="true" />
                    <span>Approved</span>
                    <span className="bg-gray-100 text-gray-900 py-0.5 px-1.5 rounded-full text-xs font-medium">
                      {approvedListings.length}
                    </span>
                  </div>
                </button>
                
                <button
                  onClick={() => handleTabChange('ai-discovered')}
                  className={`py-2 px-1 border-b-2 font-medium text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
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
                  <div className="flex items-center space-x-1.5">
                    <BsRobot className="w-3 h-3" aria-hidden="true" />
                    <span>AI-Discovered</span>
                    <span className="bg-gray-100 text-gray-900 py-0.5 px-1.5 rounded-full text-xs font-medium">
                      {aiDiscoveredProperties.length}
                    </span>
                    {aiScanInProgress && (
                      <div className="animate-spin rounded-full h-2 w-2 border-b border-blue-600" aria-hidden="true"></div>
                    )}
                  </div>
                </button>
              </nav>
            </div>

          </div>
        </div>

        {/* AI Search Results Banner */}
        {aiSearchActive && activeTab === 'ai-discovered' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BsRobot className="w-4 h-4 animate-pulse" />
                  <span className="text-sm font-medium">
                    🔍 AI Search Results: "{lastAiSearchQuery}"
                  </span>
                </div>
                <button
                  onClick={() => setAiSearchActive(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* New Properties Notification Banner */}
        <AnimatePresence>
          {newPropertiesCount > 0 && activeTab === 'ai-discovered' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">
                        🎉 {newPropertiesCount} new {newPropertiesCount === 1 ? 'property' : 'properties'} discovered!
                      </span>
                    </div>
                    <div className="text-sm text-green-100">
                      Fresh investment opportunities just found by our AI
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setCurrentPage(1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-sm bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg transition-colors"
                    >
                      View New Properties
                    </button>
                    <button
                      onClick={() => setNewPropertiesCount(0)}
                      className="text-white hover:text-gray-200 transition-colors"
                      aria-label="Dismiss notification"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                    <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                      <BsCoin className="w-5 h-5 mr-2 text-orange-500" />
                      Community-Driven Property Discovery
                    </h2>
                    
                    {/* Compact Summary (Always Visible) */}
                    <div className="bg-gradient-to-r from-orange-50 to-purple-50 border border-orange-200 rounded-lg p-3 mb-3">
                      <p className="text-orange-800 text-sm font-medium mb-2 flex items-center">
                        🎯 <span className="ml-1">Help Us Acquire Your Dream Properties</span>
                      </p>
                      <p className="text-orange-700 text-xs leading-relaxed mb-2">
                        Our AI discovers <strong>potential properties</strong> for fractional investment. Use <strong>FXCT tokens to signal interest</strong> — when enough community members bid, we negotiate with sellers to bring these properties to our platform!
                      </p>
                      
                      {/* Expand/Collapse Button */}
                      <div className="flex items-center justify-between">
                        <p className="text-gray-600 text-xs">
                          <strong>Community-powered acquisition:</strong> Your FXCT bids help prioritize properties for acquisition.
                        </p>
                        <button
                          onClick={() => setShowFullDiscoverySection(!showFullDiscoverySection)}
                          className="flex items-center space-x-1 px-2 py-1 text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                          aria-expanded={showFullDiscoverySection}
                          aria-label={showFullDiscoverySection ? 'Hide details' : 'Learn more about how this works'}
                        >
                          <span>{showFullDiscoverySection ? 'Less Details' : 'Learn More'}</span>
                          <motion.div
                            animate={{ rotate: showFullDiscoverySection ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </motion.div>
                        </button>
                      </div>
                    </div>
                    
                    {/* Detailed Information (Collapsible) */}
                    <AnimatePresence>
                      {showFullDiscoverySection && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="mb-3 overflow-hidden"
                        >
                          <div className="bg-gradient-to-r from-orange-50 to-purple-50 border border-orange-200 rounded-lg p-4 space-y-3">
                            {/* Community Acquisition Process */}
                            <div className="bg-white/70 rounded-lg p-3 border border-orange-100">
                              <p className="text-orange-800 text-xs font-medium mb-2">🔄 Community Acquisition Process:</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-orange-700">
                                <div className="flex items-start"><span className="w-1 h-1 bg-orange-600 rounded-full mr-2 mt-2 flex-shrink-0"></span>1. AI discovers promising properties</div>
                                <div className="flex items-start"><span className="w-1 h-1 bg-orange-600 rounded-full mr-2 mt-2 flex-shrink-0"></span>2. Community bids FXCT to show interest</div>
                                <div className="flex items-start"><span className="w-1 h-1 bg-orange-600 rounded-full mr-2 mt-2 flex-shrink-0"></span>3. Admin team negotiates with sellers</div>
                                <div className="flex items-start"><span className="w-1 h-1 bg-orange-600 rounded-full mr-2 mt-2 flex-shrink-0"></span>4. Property moves to approved listings</div>
                              </div>
                            </div>
                            
                            {/* FXCT Bidding Benefits */}
                            <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-lg p-3 border border-blue-200">
                              <p className="text-blue-800 text-xs font-medium mb-2">💰 FXCT Bidding Benefits:</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-blue-700">
                                <div className="flex items-center"><span className="w-1 h-1 bg-blue-600 rounded-full mr-2"></span>Early access to prime properties</div>
                                <div className="flex items-center"><span className="w-1 h-1 bg-blue-600 rounded-full mr-2"></span>Better negotiated purchase prices</div>
                                <div className="flex items-center"><span className="w-1 h-1 bg-blue-600 rounded-full mr-2"></span>Guaranteed allocation when tokenized</div>
                                <div className="flex items-center"><span className="w-1 h-1 bg-blue-600 rounded-full mr-2"></span>Community-validated opportunities</div>
                              </div>
                            </div>
                            
                            {/* Data Sources */}
                            <div className="flex flex-wrap gap-2">
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                                <span className="w-2 h-2 bg-blue-600 rounded-full mr-1"></span>
                                Zillow Database
                              </span>
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-orange-100 text-orange-800">
                                <span className="w-2 h-2 bg-orange-600 rounded-full mr-1"></span>
                                LoopNet API
                              </span>
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">
                                <span className="w-2 h-2 bg-purple-600 rounded-full mr-1"></span>
                                Off-Market Deals
                              </span>
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                                <span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>
                                MLS Integration
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Enhanced Sort & Filter Bar */}
          <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              {[
                { key: 'newest', label: 'Latest Discovery', icon: '🔍' },
                { key: 'interest', label: 'Most Interest', icon: '🔥' },
                { key: 'price-low', label: 'Most Affordable', icon: '💰' },
                { key: 'price-high', label: 'Premium Properties', icon: '💎' },
                { key: 'roi', label: 'Highest ROI', icon: '📈' },
                { key: 'sqft', label: 'Largest Space', icon: '🏠' }
              ].map((sort) => (
                <button
                  key={sort.key}
                  onClick={() => setFilters(prev => ({ ...prev, sortBy: sort.key }))}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filters.sortBy === sort.key 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  aria-pressed={filters.sortBy === sort.key}
                  tabIndex="0"
                  aria-label={`Sort by ${sort.label}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setFilters(prev => ({ ...prev, sortBy: sort.key }));
                    }
                  }}
                >
                  {sort.icon} {sort.label}
                </button>
              ))}
            </div>
            
            <div className="text-sm text-gray-600">
              {filteredProperties.length} of {currentProperties.length} properties
            </div>
          </div>

          {/* Quick Filter Buttons */}
          {filteredProperties.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-gray-700 flex items-center">
                  ⚡ Quick Filters:
                </span>
                
                {/* High ROI Filter */}
                <button
                  onClick={() => {
                    setQuickFilters(prev => ({ ...prev, highROI: !prev.highROI }));
                    setCurrentPage(1);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setQuickFilters(prev => ({ ...prev, highROI: !prev.highROI }));
                      setCurrentPage(1);
                    }
                  }}
                  className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors border focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                    quickFilters.highROI
                      ? 'bg-green-100 text-green-800 border-green-300 shadow-sm'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                  aria-pressed={quickFilters.highROI}
                  aria-label={quickFilters.highROI ? 'Remove high ROI filter' : 'Filter by high ROI properties (10% or higher)'}
                >
                  <FiTrendingUp className={`w-4 h-4 mr-1.5 ${
                    quickFilters.highROI ? 'text-green-600' : 'text-gray-500'
                  }`} />
                  <span>High ROI (10%+)</span>
                  {quickFilters.highROI && (
                    <FiX className="w-3 h-3 ml-2 text-green-600" />
                  )}
                </button>
                
                {/* Under $500K Filter */}
                <button
                  onClick={() => {
                    setQuickFilters(prev => ({ ...prev, under500K: !prev.under500K }));
                    setCurrentPage(1);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setQuickFilters(prev => ({ ...prev, under500K: !prev.under500K }));
                      setCurrentPage(1);
                    }
                  }}
                  className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    quickFilters.under500K
                      ? 'bg-blue-100 text-blue-800 border-blue-300 shadow-sm'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                  aria-pressed={quickFilters.under500K}
                  aria-label={quickFilters.under500K ? 'Remove under $500K filter' : 'Filter by properties under $500,000'}
                >
                  <span className={`mr-1.5 ${
                    quickFilters.under500K ? 'text-blue-600' : 'text-gray-500'
                  }`}>💰</span>
                  <span>Under $500K</span>
                  {quickFilters.under500K && (
                    <FiX className="w-3 h-3 ml-2 text-blue-600" />
                  )}
                </button>
                
                {/* New This Week Filter */}
                <button
                  onClick={() => {
                    setQuickFilters(prev => ({ ...prev, newThisWeek: !prev.newThisWeek }));
                    setCurrentPage(1);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setQuickFilters(prev => ({ ...prev, newThisWeek: !prev.newThisWeek }));
                      setCurrentPage(1);
                    }
                  }}
                  className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                    quickFilters.newThisWeek
                      ? 'bg-purple-100 text-purple-800 border-purple-300 shadow-sm'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                  aria-pressed={quickFilters.newThisWeek}
                  aria-label={quickFilters.newThisWeek ? 'Remove new this week filter' : 'Filter by properties listed within the last week'}
                >
                  <span className={`mr-1.5 ${
                    quickFilters.newThisWeek ? 'text-purple-600' : 'text-gray-500'
                  }`}>✨</span>
                  <span>New This Week</span>
                  {quickFilters.newThisWeek && (
                    <FiX className="w-3 h-3 ml-2 text-purple-600" />
                  )}
                </button>
                
                {/* Clear All Quick Filters */}
                {(quickFilters.highROI || quickFilters.under500K || quickFilters.newThisWeek) && (
                  <button
                    onClick={() => {
                      setQuickFilters({ highROI: false, under500K: false, newThisWeek: false });
                      setCurrentPage(1);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setQuickFilters({ highROI: false, under500K: false, newThisWeek: false });
                        setCurrentPage(1);
                      }
                    }}
                    className="inline-flex items-center px-3 py-2 text-xs text-gray-600 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    aria-label="Clear all quick filters"
                  >
                    <FiX className="w-3 h-3 mr-1" />
                    <span>Clear Filters</span>
                  </button>
                )}
                
                {/* Active Filter Count */}
                {(quickFilters.highROI || quickFilters.under500K || quickFilters.newThisWeek) && (
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {Object.values(quickFilters).filter(Boolean).length} active
                  </div>
                )}
              </div>
            </div>
          )}
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
              <div className="text-center py-16" role="status" aria-live="polite">
                {activeTab === 'ai-discovered' ? (
                  // Enhanced empty state for AI-discovered properties
                  <div className="max-w-md mx-auto">
                    <div className="mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BsRobot className="w-10 h-10 text-blue-600" aria-hidden="true" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        🤖 AI Discovery in Progress
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-6">
                        Our AI is continuously scanning multiple data sources to discover new investment opportunities. 
                        Check back soon or refresh to see the latest findings!
                      </p>
                    </div>
                    
                    {/* AI Progress Indicators */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6 border border-blue-200">
                      <p className="text-blue-800 text-xs font-medium mb-3">🔍 What our AI is analyzing:</p>
                      <div className="space-y-2">
                        {[
                          { source: 'LoopNet Commercial', status: 'active', icon: '🏢' },
                          { source: 'MLS Database', status: 'active', icon: '🏠' },
                          { source: 'Off-Market Deals', status: 'scanning', icon: '🕵️' },
                          { source: 'Market Analytics', status: 'completed', icon: '📊' }
                        ].map((source, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-xs text-blue-700 flex items-center">
                              <span className="mr-2">{source.icon}</span>
                              {source.source}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              source.status === 'active' ? 'bg-green-100 text-green-700' :
                              source.status === 'scanning' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {source.status === 'active' ? '✅ Active' :
                               source.status === 'scanning' ? '🔄 Scanning' : '✅ Complete'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => fetchAISuggestedListings()}
                        disabled={isLoadingSuggested}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        {isLoadingSuggested ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" aria-hidden="true"></div>
                            <span>Discovering Properties...</span>
                          </>
                        ) : (
                          <>
                            <BsRobot className="w-4 h-4 mr-2" aria-hidden="true" />
                            <span>Refresh AI Discoveries</span>
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleTabChange('approved')}
                        className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      >
                        <FiCheckCircle className="w-4 h-4 mr-2" aria-hidden="true" />
                        <span>Browse Approved Listings</span>
                      </button>
                    </div>
                    
                    {/* API Error Display */}
                    {apiError && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 text-xs">
                          <strong>Service Notice:</strong> {apiError}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  // Standard empty state for approved properties
                  <div>
                    <FiHome className="mx-auto h-12 w-12 text-gray-400 mb-4" aria-hidden="true" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No approved properties found</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters.</p>
                    <button
                      onClick={() => handleTabChange('ai-discovered')}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <BsRobot className="w-4 h-4 mr-2" />
                      <span>Explore AI-Discovered Properties</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <main aria-label={`${activeTab === 'approved' ? 'Approved' : 'AI-discovered'} property listings`}>
                {showMap ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Map View */}
                    <div className="lg:order-2">
                      <PropertyMap 
                        properties={paginatedProperties}
                        selectedProperty={null}
                        onPropertySelect={handlePropertyClick}
                        center={filteredProperties.length > 0 ? {
                          lat: filteredProperties[0].coordinates?.lat || 29.7604,
                          lng: filteredProperties[0].coordinates?.lng || -95.3698
                        } : { lat: 29.7604, lng: -95.3698 }}
                        zoom={filteredProperties.length <= 1 ? 12 : 10}
                        height="500px"
                      />
                    </div>
                    
                    {/* Property List beside Map */}
                    <div className="lg:order-1 max-h-[500px] overflow-y-auto">
                      <div className="space-y-4">
                        {paginatedProperties.map((property) => (
                          <div 
                            key={property.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => handlePropertyClick(property)}
                          >
                            <div className="flex">
                              {property.images?.[0] && (
                                <img 
                                  src={property.images[0]} 
                                  alt={property.title}
                                  className="w-24 h-20 object-cover flex-shrink-0"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              )}
                              <div className="flex-1 p-3">
                                <h4 className="font-semibold text-sm text-gray-900 line-clamp-1 mb-1">
                                  {property.title}
                                </h4>
                                <p className="text-xs text-gray-600 line-clamp-1 mb-1">
                                  {property.address}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-bold text-green-600">
                                    ${property.price?.toLocaleString()}
                                  </span>
                                  {property.expectedROI && (
                                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                      {property.expectedROI}% ROI
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div role="region" aria-label="Property listings" className="mb-6">
                    {viewMode === 'grid' ? renderPropertyGrid() : renderPropertyList()}
                  </div>
                )}
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

        {/* Compliance & Disclaimer Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Accredited Investor Notice */}
            <div className="bg-white rounded-lg border border-blue-200 p-6 mb-6 shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-semibold">⚖️</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">Accredited Investor Requirements</h3>
                  <p className="text-xs text-blue-800 leading-relaxed mb-3">
                    <strong>Phase 1 Launch:</strong> To comply with securities regulations, participation in our fractional ownership marketplace is currently limited to accredited investors as defined by SEC Rule 501 of Regulation D.
                  </p>
                  <div className="bg-blue-50 rounded-lg p-3 mb-3">
                    <p className="text-xs font-medium text-blue-800 mb-2">Accredited Investor Criteria (one or more must apply):</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-blue-700">
                      <div className="flex items-start"><span className="w-1 h-1 bg-blue-600 rounded-full mr-2 mt-2 flex-shrink-0"></span>Annual income exceeding $200,000 ($300,000 joint)</div>
                      <div className="flex items-start"><span className="w-1 h-1 bg-blue-600 rounded-full mr-2 mt-2 flex-shrink-0"></span>Net worth exceeding $1 million (excluding primary residence)</div>
                      <div className="flex items-start"><span className="w-1 h-1 bg-blue-600 rounded-full mr-2 mt-2 flex-shrink-0"></span>Certain professional certifications (CPA, attorney, etc.)</div>
                      <div className="flex items-start"><span className="w-1 h-1 bg-blue-600 rounded-full mr-2 mt-2 flex-shrink-0"></span>Entity with assets exceeding $5 million</div>
                    </div>
                  </div>
                  <p className="text-xs text-blue-700">
                    <strong>Future Expansion:</strong> We are working toward offering investment opportunities to non-accredited investors through Regulation CF and other compliant structures in future platform updates.
                  </p>
                </div>
              </div>
            </div>
            
            {/* General Disclaimer */}
            <div className="text-center">
              <h3 className="text-sm font-semibold text-blue-900 mb-3">Important Legal Disclaimers</h3>
              <div className="max-w-5xl mx-auto space-y-3 text-xs text-blue-700 leading-relaxed">
                <p>
                  <strong>Investment Risk:</strong> All real estate investments carry inherent risks including market volatility, liquidity constraints, and potential loss of principal. Fractional ownership adds additional complexity and risks. Past performance does not guarantee future results.
                </p>
                <p>
                  <strong>Professional Sources:</strong> All listings are provided by licensed real estate agents, licensed brokers, the internal FractionaX admin team, and approved users who have been verified by FractionaX. Property information is subject to verification, market conditions, and may change without notice.
                </p>
                <p>
                  <strong>Regulatory Compliance:</strong> FractionaX operates under applicable securities laws and regulations. FXCT utility tokens and FXST security tokens are subject to different regulatory frameworks. This platform does not constitute investment advice.
                </p>
                <p>
                  <strong>Professional Consultation:</strong> Before making any investment decisions, please consult with qualified financial advisors, tax professionals, and legal counsel familiar with real estate and securities regulations.
                </p>
              </div>
              
              <div className="mt-6 pt-4 border-t border-blue-200">
                <p className="text-xs text-blue-600">
                  <strong>Questions about accreditation?</strong> Contact our compliance team at 
                  <a href="mailto:compliance@fractionax.io" className="text-blue-700 hover:text-blue-800 underline ml-1">compliance@fractionax.io</a>
                </p>
              </div>
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


export default Marketplace;
