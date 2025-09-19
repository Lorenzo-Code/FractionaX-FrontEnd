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
import EnhancedDiscovery from "../components/EnhancedDiscovery";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import marketplaceService from '../services/marketplaceService';
import { useMarketplace } from '../hooks/useMarketplace';

// Analytics and monitoring imports
import {
  createRateLimiter
} from '../../../shared/utils';

const Marketplace = () => {
  // Create rate limiters for security  
  useMemo(() => createRateLimiter(30, 60000), []); // 30 searches per minute
  useMemo(() => createRateLimiter(20, 60000), []); // 20 favorites per minute
  
  // Use marketplace hook for state management
  const {
    activeCategory,
    activeTab,
    loading,
    viewMode,
    showMap,
    showFilters,
    searchQuery,
    currentPage,
    totalPages,
    approvedListings,
    aiDiscoveredProperties,
    commercialProperties,
    isLoadingSuggested,
    isLoadingCommercial,
    apiError,
    baseFilters,
    quickFilters,
    activeSubcategory,
    currentProperties,
    filteredProperties,
    paginatedProperties,
    setActiveCategory,
    setActiveTab,
    setViewMode,
    setShowMap,
    setShowFilters,
    setSearchQuery,
    setCurrentPage,
    setBaseFilters,
    setQuickFilters,
    setActiveSubcategory,
    loadMarketplaceData,
    fetchAISuggestedListings,
    fetchCommercialProperties
  } = useMarketplace({ isAuthenticated: false });
  
  // Multi-mode search states (not handled by hook)
  const [searchMode, setSearchMode] = useState('internal');
  const [aiChatMessages, setAiChatMessages] = useState([]);
  const [addressSearchResults, setAddressSearchResults] = useState(null);
  
  // Asset categories - Expanding beyond real estate to include all tokenizable assets
  const assetCategories = [
    { 
      id: 'investment-assets', 
      name: 'Investment Assets', 
      icon: <BsCoin className="w-5 h-5" />,
      color: 'blue',
      description: 'Real estate, businesses, commercial properties'
    }
  ];
  
  // UI-specific states (not handled by hook)
  const [aiScanInProgress, setAiScanInProgress] = useState(false);
  const [itemsPerPage] = useState(9);
  
  // FXCT Bidding states
  const [userBids, setUserBids] = useState({}); // propertyId -> bidAmount
  const [propertyBidData, setPropertyBidData] = useState({}); // propertyId -> { totalFXCT, bidderCount, threshold, status }
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedPropertyForBid, setSelectedPropertyForBid] = useState(null);
  
// Filters are now handled by baseFilters from useMarketplace hook
  
  // Advanced filtering states (UI-specific)
  const [savedSearches, setSavedSearches] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  
  // AI search enhancement states (UI-specific)
  const [lastAiSearchQuery, setLastAiSearchQuery] = useState('');
  const [aiSearchActive, setAiSearchActive] = useState(false);
  
  // UI state for collapsible sections
  const [showFullDiscoverySection, setShowFullDiscoverySection] = useState(false);
  
  const [favorites, setFavorites] = useState([]);
  
  // New properties notification
  const [newPropertiesCount, setNewPropertiesCount] = useState(0);
  // quickFilters is now handled by useMarketplace hook

  // Mock data for all asset categories - in production, this would come from your API
  const mockAssetData = useMemo(() => ({
    'investment-assets': [
    {
      id: 1,
      title: "Georgia Clock Tower Car Wash",
      address: "4460 N Henry Blvd, Stockbridge, GA 30281",
      price: 2700000,
      rentPrice: 0, // Car wash business, not residential rental
      beds: 0, // Commercial property
      baths: 4, // Employee restrooms and customer facilities
      sqft: 8640, // Building + covered wash bays
      propertyType: "commercial",
      listingType: "sale",
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?w=800&h=600&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1562813733-b31f71025d54?w=800&h=600&fit=crop&auto=format"
      ],
      description: "Exceptional car wash investment opportunity featuring a modern Clock Tower Car Wash facility in prime Stockbridge, Georgia location. This turnkey operation includes 8 automatic wash bays, vacuum stations, and detail center on 2.1 acres with excellent visibility and traffic flow from Henry Boulevard.",
      detailedDescription: "This premier car wash facility represents an outstanding commercial investment in the rapidly growing Atlanta metro area. The property features state-of-the-art automated wash equipment, covered wash bays, customer waiting area, and comprehensive vacuum stations. Located on high-traffic Henry Boulevard with excellent visibility and easy access. The business benefits from consistent cash flow, minimal labor requirements, and strong local demand. Recent improvements include updated payment systems, LED lighting, and enhanced customer experience features. Perfect for investors seeking a recession-resistant business with strong fundamentals and growth potential.",
      features: ["automated_wash_bays", "vacuum_stations", "detail_center", "covered_bays", "cash_flow_positive", "high_traffic_location", "modern_equipment", "customer_waiting_area", "led_lighting", "digital_payment_systems"],
      yearBuilt: 2018,
      lotSize: 2.1,
      coordinates: { lat: 33.5434, lng: -84.2335 },
      tokenized: true,
      tokenPrice: 500, // $500 per token
      totalTokens: 5400, // $2.7M / $500
      availableTokens: 4320, // 80% still available
      expectedROI: 14.8,
      monthlyRevenue: 45000, // Gross monthly revenue
      grossRevenue: 540000, // Annual gross revenue
      netOperatingIncome: 378000, // Annual NOI
      capRate: 14.0,
      hoa: 0,
      taxes: 28500,
      insurance: 12000,
      listingDate: "2024-01-20",
      status: "active",
      agent: {
        name: "Marcus Thompson",
        phone: "(770) 555-0245",
        email: "marcus@georgiacommercial.com",
        company: "Georgia Commercial Properties",
        photo: "/api/placeholder/100/100",
        license: "GA-987654"
      },
      stats: {
        views: 1876,
        saves: 142,
        daysOnMarket: 18,
        priceHistory: [
          { date: "2024-01-20", price: 2700000, event: "Listed" }
        ]
      },
      neighborhood: {
        name: "Stockbridge/Henry County",
        walkability: 45, // Car-dependent area
        transitScore: 32,
        bikeScore: 28
      },
      schools: [
        { name: "Stockbridge Elementary", rating: 7, distance: 0.8 },
        { name: "Stockbridge Middle School", rating: 6, distance: 1.2 },
        { name: "Stockbridge High School", rating: 7, distance: 1.5 }
      ],
      businessMetrics: {
        washBays: 8,
        vacuumStations: 12,
        averageTicket: 18.50,
        dailyCarCount: 85,
        monthlyExpenses: 162000,
        employeeCount: 6,
        operatingHours: "6 AM - 10 PM Daily",
        peakHours: "Weekend mornings, after work",
        seasonalVariation: "15% higher in spring/summer"
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
    },
    {
      id: 4,
      title: "Ohio Value-Add 11-Unit Apartment Building",
      address: "1847 E 17th Ave, Columbus, OH 43219",
      price: 1250000,
      rentPrice: 0, // Not for rent, for sale
      beds: 22, // Total across all units
      baths: 11,
      sqft: 8800, // Total building sqft
      propertyType: "multifamily",
      listingType: "sale",
      images: [
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop&auto=format"
      ],
      description: "Exceptional value-add opportunity featuring an 11-unit multifamily property in Columbus, Ohio. Currently generating strong rental income with significant upside potential through strategic renovations and rent optimization. Perfect for investors seeking cash flow and appreciation.",
      detailedDescription: "This well-positioned 11-unit apartment building represents a prime value-add investment opportunity in Columbus's growing rental market. The property consists of a mix of 1 and 2-bedroom units with individual utilities and separate entrances. Recent capital improvements include updated electrical and plumbing systems. The strategic location provides excellent access to downtown Columbus, Ohio State University, and major employment centers. With below-market rents and renovation potential, this asset offers substantial upside for the savvy investor.",
      features: ["value_add_opportunity", "separate_utilities", "parking_included", "close_to_osu", "recent_improvements", "below_market_rents", "cash_flowing", "renovation_upside", "strong_rental_demand", "downtown_proximity"],
      yearBuilt: 1995,
      lotSize: 0.8,
      coordinates: { lat: 39.9742, lng: -82.9988 },
      tokenized: true,
      tokenPrice: 250, // $250 per token
      totalTokens: 5000, // $1.25M / $250
      availableTokens: 3200, // 64% still available
      expectedROI: 16.8,
      monthlyRent: 8900, // Total monthly rental income
      grossRentMultiplier: 11.7,
      capRate: 8.5,
      cashOnCash: 12.3,
      hoa: 0,
      taxes: 18500,
      insurance: 2400,
      listingDate: "2024-01-20",
      status: "active",
      agent: {
        name: "Robert Martinez",
        phone: "(614) 555-0234",
        email: "robert@multifamilyohio.com",
        company: "Columbus Investment Properties",
        photo: "/api/placeholder/100/100",
        license: "OH-567890"
      },
      stats: {
        views: 1247,
        saves: 89,
        daysOnMarket: 12,
        priceHistory: [
          { date: "2024-01-20", price: 1250000, event: "Listed" }
        ]
      },
      neighborhood: {
        name: "Near East Side Columbus",
        walkability: 78,
        transitScore: 71,
        bikeScore: 65
      },
      schools: [
        { name: "East Columbus Elementary", rating: 6, distance: 0.4 },
        { name: "Linden Middle School", rating: 5, distance: 0.8 },
        { name: "East High School", rating: 6, distance: 1.1 }
      ],
      investmentMetrics: {
        noi: 95000, // Net Operating Income
        vacancy: 5, // 5% vacancy assumption
        operatingExpenses: 32000,
        totalUnits: 11,
        avgRentPerUnit: 809,
        pricePerUnit: 113636,
        pricePerSqft: 142
      }
    },
    {
      id: 5,
      title: "Houston Galleria Hotel - Rebrand/Repurpose Opportunity",
      address: "5410 Westheimer Rd, Houston, TX 77056",
      price: 8500000,
      rentPrice: 0,
      beds: 180, // Hotel rooms converted to potential units
      baths: 180,
      sqft: 125000, // Total building sqft
      propertyType: "hospitality",
      listingType: "sale",
      images: [
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&auto=format"
      ],
      description: "Prime Houston Galleria hotel presenting an exceptional rebrand and repurpose opportunity. This 180-room property sits on premium real estate in the heart of Houston's business district. Ideal for conversion to luxury apartments, extended stay, or continued hotel operations under new management.",
      detailedDescription: "Located in Houston's prestigious Galleria area, this hotel property represents a unique opportunity for savvy investors and developers. The 125,000 sq ft building features 180 well-appointed rooms, meeting facilities, restaurant space, and parking. The prime location offers unparalleled access to the Galleria shopping center, major corporate offices, and Houston's business core. Multiple exit strategies include: luxury apartment conversion, extended-stay hotel repositioning, senior living facility, or continued traditional hotel operations. The property benefits from strong fundamentals including high-income demographics, excellent transportation access, and proven demand for both residential and hospitality uses.",
      features: ["prime_galleria_location", "180_rooms", "meeting_facilities", "restaurant_space", "parking_garage", "conversion_ready", "multiple_exit_strategies", "high_income_area", "corporate_proximity", "retail_access"],
      yearBuilt: 1987,
      lotSize: 2.1,
      coordinates: { lat: 29.7370, lng: -95.4619 },
      tokenized: true,
      tokenPrice: 1000, // $1,000 per token for institutional property
      totalTokens: 8500, // $8.5M / $1,000
      availableTokens: 6800, // 80% still available
      expectedROI: 14.2,
      monthlyRent: 0, // Hotel revenue varies
      hotelRevPAR: 95, // Revenue Per Available Room
      occupancyRate: 68,
      averageADR: 140, // Average Daily Rate
      hoa: 0,
      taxes: 125000,
      insurance: 18500,
      listingDate: "2024-01-18",
      status: "active",
      agent: {
        name: "Diana Foster",
        phone: "(713) 555-0345",
        email: "diana@galleriacommercial.com",
        company: "Galleria Commercial Real Estate",
        photo: "/api/placeholder/100/100",
        license: "TX-234567"
      },
      stats: {
        views: 2134,
        saves: 167,
        daysOnMarket: 25,
        priceHistory: [
          { date: "2024-01-18", price: 8500000, event: "Listed" },
          { date: "2023-12-15", price: 9200000, event: "Price Reduction" }
        ]
      },
      neighborhood: {
        name: "Galleria/Uptown Houston",
        walkability: 85,
        transitScore: 78,
        bikeScore: 71
      },
      schools: [
        { name: "Briargrove Elementary", rating: 8, distance: 1.2 },
        { name: "Memorial Middle School", rating: 9, distance: 1.8 },
        { name: "Memorial High School", rating: 9, distance: 2.1 }
      ],
      investmentMetrics: {
        noi: 890000, // Current NOI as hotel
        conversionPotential: "High",
        apartmentUnits: 160, // Potential apartment conversion
        projectedRentPerUnit: 1850,
        conversionCost: 2500000,
        stabilizedValue: 14000000,
        pricePerSqft: 68
      }
    },
    {
      id: 6,
      title: "Pennsylvania Development Land - Wawa Vicinity",
      address: "Route 322 & Conchester Hwy, Glen Mills, PA 19342",
      price: 2850000,
      rentPrice: 0,
      beds: 0,
      baths: 0,
      sqft: 0, // Raw land
      propertyType: "land",
      listingType: "sale",
      images: [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1574263867128-7c5e4c8c9cfd?w=800&h=600&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=600&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop&auto=format"
      ],
      description: "Premium development opportunity featuring 23.7 acres of prime commercial land strategically located near Wawa, Pennsylvania. Excellent visibility and access from major highways with approved zoning for mixed-use development. Perfect for retail, residential, or industrial development projects.",
      detailedDescription: "This exceptional 23.7-acre development parcel represents one of the most attractive land opportunities in the greater Philadelphia metropolitan area. Located at the intersection of Route 322 and Conchester Highway, the property offers unparalleled visibility and accessibility. The site benefits from approved mixed-use zoning, allowing for retail centers, residential developments, industrial facilities, or combinations thereof. Recent improvements to area infrastructure and the proximity to Wawa's growing commercial corridor make this an ideal location for forward-thinking developers. The property features level topography, existing utility access, and completed Phase 1 environmental assessment. With Philadelphia's continued suburban expansion and the area's strong demographic profile, this land presents significant development and appreciation potential.",
      features: ["mixed_use_zoning", "highway_frontage", "23_7_acres", "level_topography", "utilities_available", "environmental_cleared", "development_ready", "high_visibility", "growing_area", "philadelphia_proximity"],
      yearBuilt: null, // Raw land
      lotSize: 23.7,
      coordinates: { lat: 39.8893, lng: -75.4557 },
      tokenized: true,
      tokenPrice: 500, // $500 per token
      totalTokens: 5700, // $2.85M / $500
      availableTokens: 4845, // 85% still available
      expectedROI: 22.5, // Higher for development land
      monthlyRent: 0, // Raw land
      zoningType: "Mixed Use Commercial",
      buildableArea: 21.2, // Acres after setbacks
      maxDensity: "35 units per acre residential, 0.45 FAR commercial",
      hoa: 0,
      taxes: 34200,
      insurance: 1200,
      listingDate: "2024-01-22",
      status: "active",
      agent: {
        name: "Thomas Chen",
        phone: "(484) 555-0456",
        email: "thomas@palanddevelopment.com",
        company: "Pennsylvania Land & Development Co.",
        photo: "/api/placeholder/100/100",
        license: "PA-345678"
      },
      stats: {
        views: 892,
        saves: 123,
        daysOnMarket: 18,
        priceHistory: [
          { date: "2024-01-22", price: 2850000, event: "Listed" }
        ]
      },
      neighborhood: {
        name: "Glen Mills/Wawa Area",
        walkability: 35, // Rural/suburban area
        transitScore: 28,
        bikeScore: 42
      },
      schools: [
        { name: "Glen Mills Elementary", rating: 8, distance: 2.1 },
        { name: "Garnet Valley Middle", rating: 9, distance: 3.4 },
        { name: "Garnet Valley High School", rating: 9, distance: 3.8 }
      ],
      developmentMetrics: {
        pricePerAcre: 120254,
        residentialPotential: 743, // Max residential units
        commercialPotential: 425000, // Max commercial sqft
        projectedDevelopmentValue: 8500000,
        developmentTimeframe: "18-36 months",
        municipalApprovals: "Pre-approved concept plan",
        marketDemand: "High - Growing suburban corridor"
      }
    },
    {
      id: 7,
      title: "Northeast Houston Gas Station - Remodel Opportunity",
      address: "14902 Aldine Westfield Rd, Houston, TX 77032",
      price: 1850000,
      rentPrice: 0, // Commercial property - gas station business
      beds: 0, // Commercial property
      baths: 2, // Employee and customer restrooms
      sqft: 3200, // Convenience store + office space
      propertyType: "retail",
      listingType: "sale",
      images: [
        "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&h=600&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&auto=format"
      ],
      description: "Prime value-add opportunity featuring a corner gas station and convenience store in Northeast Houston. This hard corner location offers exceptional visibility and traffic count, perfect for a complete remodel and repositioning. Current operations include 6 gas pumps and 3,200 sq ft convenience store with significant upside potential.",
      detailedDescription: "This strategically located gas station presents an outstanding value-add investment opportunity in Houston's rapidly developing northeast corridor. Positioned on a hard corner with excellent visibility from Aldine Westfield Road, the property benefits from high traffic counts and established customer base. The facility includes 6 fueling positions, a 3,200 sq ft convenience store, and ample parking. While currently operational, the property requires comprehensive remodeling to maximize its potential. Recent market analysis indicates strong demand for modernized fuel/convenience facilities in this growing area. Post-renovation projections show significant NOI improvement through enhanced fuel margins, expanded convenience offerings, and potential additional revenue streams. Perfect for investors with experience in retail/fuel operations seeking a high-return repositioning project.",
      features: ["hard_corner_location", "6_gas_pumps", "convenience_store", "high_traffic_count", "established_customer_base", "remodel_opportunity", "value_add_potential", "ample_parking", "northeast_houston", "growing_area"],
      yearBuilt: 1998,
      lotSize: 1.2,
      coordinates: { lat: 29.9174, lng: -95.3698 },
      tokenized: true,
      tokenPrice: 750, // $750 per token for commercial property
      totalTokens: 2467, // $1.85M / $750
      availableTokens: 1973, // 80% still available
      expectedROI: 18.5, // Higher ROI due to value-add potential
      monthlyRevenue: 85000, // Current monthly gross revenue
      grossRevenue: 1020000, // Annual gross revenue
      netOperatingIncome: 185000, // Current NOI - low due to needed improvements
      projectedNOI: 370000, // Post-renovation projected NOI
      capRate: 10.0, // Current
      projectedCapRate: 20.0, // Post-renovation
      remodelBudget: 450000, // Estimated remodel cost
      hoa: 0,
      taxes: 22200,
      insurance: 18500,
      listingDate: "2024-01-25",
      status: "active",
      agent: {
        name: "Carlos Rodriguez",
        phone: "(713) 555-0567",
        email: "carlos@houstoncommercialgroup.com",
        company: "Houston Commercial Investment Group",
        photo: "/api/placeholder/100/100",
        license: "TX-456789"
      },
      stats: {
        views: 2456,
        saves: 198,
        daysOnMarket: 28,
        priceHistory: [
          { date: "2024-01-25", price: 1850000, event: "Listed" },
          { date: "2023-12-10", price: 2100000, event: "Price Reduction" }
        ]
      },
      neighborhood: {
        name: "Northeast Houston/Aldine",
        walkability: 35, // Car-dependent area
        transitScore: 42,
        bikeScore: 28
      },
      schools: [
        { name: "Aldine Elementary", rating: 5, distance: 0.6 },
        { name: "Stehlik Intermediate", rating: 6, distance: 1.1 },
        { name: "Aldine Senior High", rating: 6, distance: 1.8 }
      ],
      businessMetrics: {
        fuelPumps: 6,
        storeSize: 3200,
        dailyFuelSales: 1800, // Gallons per day
        averageFuelMargin: 0.12, // Per gallon
        convenientStoreRevenue: 25000, // Monthly
        trafficCount: 28000, // Daily vehicles
        operatingHours: "24/7",
        employeeCount: 8,
        peakHours: "7-9 AM, 4-7 PM",
        competitorAnalysis: "Moderate competition, opportunity for premium positioning"
      },
      remodelPlan: {
        estimatedCost: 450000,
        timeframe: "4-6 months",
        improvements: [
          "Complete interior renovation of convenience store",
          "Modernize fuel dispensers and payment systems",
          "Enhanced lighting and exterior facade upgrade",
          "Expanded food service area with kitchen equipment",
          "Updated HVAC and electrical systems",
          "New point-of-sale and inventory management systems"
        ],
        projectedReturn: {
          newMonthlyRevenue: 125000,
          improvedMargins: "25% increase in fuel margins, 40% increase in store margins",
          paybackPeriod: "2.5 years",
          stabilizedValue: 2850000
        }
      }
    },
    {
      id: 8,
      title: "Brookside Grocery & Gas Station - Turn-Key Investment",
      address: "3402 E Southmore Ave, Pasadena, TX 77502",
      price: 3200000,
      rentPrice: 0, // Commercial property - operating business
      beds: 0, // Commercial property
      baths: 3, // Employee and customer restrooms
      sqft: 4850, // Grocery store + office space
      propertyType: "retail",
      listingType: "sale",
      images: [
        "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&h=600&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1604719312683-d349353a8b5c?w=800&h=600&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&h=600&fit=crop&auto=format"
      ],
      description: "Exceptional turn-key investment opportunity featuring Brookside Grocery & Gas Station in established Pasadena, Texas location. This fully operational convenience store and fuel station generates strong cash flow with minimal management requirements. Property includes 8 modern gas pumps, 4,850 sq ft retail space, and established customer base serving the local community.",
      detailedDescription: "Brookside Grocery represents a premier turn-key investment in the heart of Pasadena's established residential corridor. This well-maintained facility combines a full-service convenience store with a high-volume fuel operation, creating multiple revenue streams and consistent cash flow. The property features modern infrastructure including recently upgraded fuel dispensers, comprehensive security systems, and efficient point-of-sale technology. With over 15 years of successful operation under current ownership, the business has built strong community loyalty and brand recognition. The strategic location on busy Southmore Avenue ensures consistent traffic flow, while the diverse product mix including groceries, prepared foods, beverages, and automotive supplies maximizes per-customer transaction values. Perfect for investors seeking a passive income opportunity with proven performance metrics and growth potential.",
      features: ["turn_key_operation", "8_gas_pumps", "full_service_grocery", "established_customer_base", "modern_equipment", "security_systems", "pos_technology", "multiple_revenue_streams", "high_traffic_location", "community_loyalty"],
      yearBuilt: 2008,
      lotSize: 1.8,
      coordinates: { lat: 29.6911, lng: -95.1591 },
      tokenized: true,
      tokenPrice: 800, // $800 per token for established business
      totalTokens: 4000, // $3.2M / $800
      availableTokens: 3200, // 80% still available
      expectedROI: 16.2,
      monthlyRevenue: 145000, // Monthly gross revenue
      grossRevenue: 1740000, // Annual gross revenue
      netOperatingIncome: 468000, // Annual NOI
      capRate: 14.6,
      cashFlow: 39000, // Monthly cash flow
      hoa: 0,
      taxes: 35200,
      insurance: 24000,
      listingDate: "2024-01-28",
      status: "active",
      agent: {
        name: "Patricia Gonzalez",
        phone: "(281) 555-0789",
        email: "patricia@pasadenacommercial.com",
        company: "Pasadena Commercial Real Estate",
        photo: "/api/placeholder/100/100",
        license: "TX-567890"
      },
      stats: {
        views: 3245,
        saves: 287,
        daysOnMarket: 22,
        priceHistory: [
          { date: "2024-01-28", price: 3200000, event: "Listed" }
        ]
      },
      neighborhood: {
        name: "Pasadena/Southeast Houston",
        walkability: 58, // Moderate walkability
        transitScore: 45,
        bikeScore: 32
      },
      schools: [
        { name: "Brookside Elementary", rating: 6, distance: 0.4 },
        { name: "Queens Intermediate", rating: 7, distance: 0.9 },
        { name: "Pasadena Memorial High", rating: 7, distance: 1.3 }
      ],
      businessMetrics: {
        fuelPumps: 8,
        storeSize: 4850,
        dailyFuelSales: 2400, // Gallons per day
        averageFuelMargin: 0.15, // Per gallon - higher due to established operations
        groceryRevenue: 85000, // Monthly grocery/convenience sales
        fuelRevenue: 60000, // Monthly fuel sales
        trafficCount: 35000, // Daily vehicles
        operatingHours: "5 AM - 11 PM Daily",
        employeeCount: 12,
        averageTransaction: 28.50,
        loyaltyCustomers: 2850,
        peakHours: "6-8 AM, 12-1 PM, 5-7 PM",
        seasonalVariation: "10% higher in summer months"
      },
      financialMetrics: {
        monthlyOperatingExpenses: 106000,
        grossMargin: 26.9, // Percentage
        netMargin: 8.1, // Percentage
        inventoryTurnover: 24, // Times per year
        averageDailyCustomers: 450,
        ebitda: 520000,
        workingCapital: 85000,
        equipmentValue: 425000,
        businessValuation: "3.2x multiple on proven earnings"
      },
      operationalHighlights: {
        yearsInOperation: 15,
        ownerInvolvement: "Minimal - Professional management in place",
        recentUpgrades: [
          "New fuel dispensers installed 2023",
          "Updated POS system and inventory management",
          "LED lighting conversion completed",
          "Security camera system upgraded",
          "Fresh food section expanded"
        ],
        growthOpportunities: [
          "Extended operating hours potential",
          "Food service expansion",
          "Lottery and money services addition",
          "Electric vehicle charging stations",
          "Delivery service implementation"
        ]
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
  
  // fetchAISuggestedListings is now provided by useMarketplace hook

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

  // Data loading is now handled by useMarketplace hook

  // currentProperties, filteredProperties, paginatedProperties and totalPages are now provided by useMarketplace hook

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
    // Don't do anything if we're already on this tab
    if (activeTab === newTab) return;
    
    console.log(`🔄 Tab switching: ${activeTab} → ${newTab}`);
    
    // Reset to first page when changing tabs
    setCurrentPage(1);
    
    // Switch to new tab - the useMarketplace hook will handle data loading efficiently
    setActiveTab(newTab);
    
    // Smooth scroll to top for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    // Show skeleton cards while loading properties (tab-specific)
    const isCurrentTabLoading = (
      (isLoadingSuggested && activeTab === 'ai-discovered') ||
      (isLoadingCommercial && activeTab === 'commercial-properties')
    );
    
    if (isCurrentTabLoading) {
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
      name: `${activeTab === 'approved' ? 'Approved' : 'Commercial Properties'} Property Listings - FractionaX`,
      description: `Browse ${activeTab === 'approved' ? 'verified approved' : 'commercial'} real estate properties for tokenized investment opportunities.`,
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
      : 'Commercial Properties | FractionaX Marketplace';
    
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

  // Only show full page loading on initial load, not tab switches
  const isInitialLoading = loading && (
    (activeTab === 'commercial-properties' && commercialProperties.length === 0 && isLoadingCommercial) ||
    (activeTab === 'ai-discovered' && aiDiscoveredProperties.length === 0 && isLoadingSuggested) ||
    (activeTab === 'approved' && approvedListings.length === 0)
  );
  
  if (isInitialLoading) {
    return (
      <>
        <SEO {...seoData} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading {activeTab === 'ai-discovered' ? 'AI-discovered' : activeTab === 'commercial-properties' ? 'commercial' : 'approved'} properties...</p>
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
              </div>

              {/* Tab Navigation - Simplified to 2 Tabs */}
              <nav className="flex space-x-6" aria-label="Asset listing tabs" role="tablist">
                <button
                  onClick={() => handleTabChange('approved')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
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
                    <span className="text-lg">💎</span>
                    <span>Ready to Invest</span>
                    <span className="bg-green-100 text-green-800 py-0.5 px-2 rounded-full text-xs font-medium">
                      {approvedListings.length} Available
                    </span>
                  </div>
                </button>
                
                <button
                  onClick={() => handleTabChange('deal-pipeline')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                    activeTab === 'deal-pipeline'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  role="tab"
                  id="deal-pipeline-tab"
                  aria-controls="deal-pipeline-tab-panel"
                  aria-selected={activeTab === 'deal-pipeline'}
                  tabIndex={activeTab === 'deal-pipeline' ? 0 : -1}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🔍</span>
                    <span>Deal Pipeline</span>
                    <span className="bg-purple-100 text-purple-800 py-0.5 px-2 rounded-full text-xs font-medium">
                      Enhanced Discovery
                    </span>
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-0.5 px-1.5 rounded-full text-xs font-bold">
                      CoreLogic
                    </span>
                    {(isLoadingSuggested || isLoadingCommercial) && (
                      <div className="animate-spin rounded-full h-3 w-3 border-b border-purple-600" aria-hidden="true"></div>
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
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      Approved Property Listings
                    </h2>
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <p className="text-blue-800 text-sm font-medium mb-1 flex items-center">
                        ✅ <span className="ml-1">Verified Investment Properties</span>
                      </p>
                      <p className="text-blue-700 text-xs leading-relaxed">
                        Premium commercial real estate opportunities across multiple asset classes - all pre-approved for fractional ownership and tokenization.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                      <BsCoin className="w-5 h-5 mr-2 text-purple-600" />
                      Enhanced Discovery Pipeline
                    </h2>
                    
                    {/* Compact Summary (Always Visible) */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-3 mb-3">
                      <p className="text-purple-800 text-sm font-medium mb-2 flex items-center">
                        🔭 <span className="ml-1">CoreLogic-Powered Deal Discovery</span>
                      </p>
                      <p className="text-purple-700 text-xs leading-relaxed mb-2">
                        Our <strong>Enhanced Discovery</strong> engine combines CoreLogic's institutional data with AI analysis to find <strong>hidden investment opportunities</strong>. Signal interest with <strong>FXCT tokens</strong> to help us prioritize and acquire the best deals for tokenization!
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
                            <div className="mb-4">
                              <p className="text-gray-700 text-xs font-medium mb-2">🔬 Data Sources:</p>
                              <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-100 text-purple-800 font-medium">
                                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-1"></span>
                                  CoreLogic Data
                                </span>
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-1"></span>
                                  Zillow Market Intel
                                </span>
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                                  <span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>
                                  OpenAI Analysis
                                </span>
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-red-100 text-red-800">
                                  <span className="w-2 h-2 bg-red-600 rounded-full mr-1"></span>
                                  U.S. Census Data
                                </span>
                              </div>
                            </div>
                            
                            {/* How It Works - Point System & Data Integration */}
                            <div className="bg-white/80 rounded-lg p-4 border border-gray-200 space-y-4">
                              <div className="flex items-center space-x-2 mb-3">
                                <span className="text-lg">⚡</span>
                                <h3 className="text-sm font-semibold text-gray-800">How Our AI Scoring Works</h3>
                              </div>
                              
                              {/* Scoring Overview */}
                              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-200">
                                <p className="text-indigo-800 text-xs font-medium mb-2">🎯 Investment Score Calculation (0-100 Points)</p>
                                <p className="text-indigo-700 text-xs leading-relaxed mb-2">
                                  Every property receives a comprehensive investment score based on 4 data sources and 12+ factors. Higher scores indicate better investment potential.
                                </p>
                              </div>
                              
                              {/* Data Provider Breakdown */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* CoreLogic */}
                                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                                  <div className="flex items-center mb-2">
                                    <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                                    <span className="text-xs font-medium text-purple-800">CoreLogic (40 pts)</span>
                                  </div>
                                  <ul className="text-xs text-purple-700 space-y-1">
                                    <li>• Property valuation accuracy</li>
                                    <li>• Historical price trends</li>
                                    <li>• Market comparables (comps)</li>
                                    <li>• Ownership & lien history</li>
                                  </ul>
                                </div>
                                
                                {/* U.S. Census */}
                                <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                                  <div className="flex items-center mb-2">
                                    <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                                    <span className="text-xs font-medium text-red-800">U.S. Census (25 pts)</span>
                                  </div>
                                  <ul className="text-xs text-red-700 space-y-1">
                                    <li>• Demographics & income growth</li>
                                    <li>• Population density trends</li>
                                    <li>• Employment & education data</li>
                                    <li>• Housing demand indicators</li>
                                  </ul>
                                </div>
                                
                                {/* Zillow */}
                                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                  <div className="flex items-center mb-2">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                                    <span className="text-xs font-medium text-blue-800">Zillow Market Intel (20 pts)</span>
                                  </div>
                                  <ul className="text-xs text-blue-700 space-y-1">
                                    <li>• Rent estimates & trends</li>
                                    <li>• Days on market analysis</li>
                                    <li>• Price per square foot</li>
                                    <li>• Neighborhood demand</li>
                                  </ul>
                                </div>
                                
                                {/* OpenAI */}
                                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                                  <div className="flex items-center mb-2">
                                    <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                                    <span className="text-xs font-medium text-green-800">OpenAI Analysis (15 pts)</span>
                                  </div>
                                  <ul className="text-xs text-green-700 space-y-1">
                                    <li>• Property condition assessment</li>
                                    <li>• Investment risk analysis</li>
                                    <li>• Market timing predictions</li>
                                    <li>• Renovation opportunity scoring</li>
                                  </ul>
                                </div>
                              </div>
                              
                              {/* Score Ranges */}
                              <div className="bg-gradient-to-r from-yellow-50 to-green-50 rounded-lg p-3 border border-yellow-200">
                                <p className="text-yellow-800 text-xs font-medium mb-2">📊 Score Ranges & Meanings:</p>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                  <div className="flex items-center">
                                    <span className="w-3 h-3 bg-red-500 rounded mr-2"></span>
                                    <span className="text-red-700">0-40: Avoid</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="w-3 h-3 bg-yellow-500 rounded mr-2"></span>
                                    <span className="text-yellow-700">41-65: Caution</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="w-3 h-3 bg-blue-500 rounded mr-2"></span>
                                    <span className="text-blue-700">66-80: Good</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="w-3 h-3 bg-green-500 rounded mr-2"></span>
                                    <span className="text-green-700">81-100: Excellent</span>
                                  </div>
                                </div>
                              </div>
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
        {/* Tab Transition Indicator - subtle loading state */}
        <AnimatePresence>
          {(isLoadingSuggested && activeTab === 'ai-discovered') || (isLoadingCommercial && activeTab === 'commercial-properties') ? (
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0 }}
              className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"
              style={{ transformOrigin: 'left' }}
            />
          ) : null}
        </AnimatePresence>
        
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Enhanced Sort & Filter Bar - Only for non-approved tabs */}
          {activeTab !== 'approved' && (
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
                  onClick={() => setBaseFilters(prev => ({ ...prev, sortBy: sort.key }))}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    baseFilters.sortBy === sort.key 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  aria-pressed={baseFilters.sortBy === sort.key}
                  tabIndex="0"
                  aria-label={`Sort by ${sort.label}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setBaseFilters(prev => ({ ...prev, sortBy: sort.key }));
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
          )}

          {/* Subcategory Filters - Only for Approved Listings */}
          {activeTab === 'approved' && filteredProperties.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3 shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-gray-700 flex items-center">
                  💼 Asset Types:
                </span>
                
                {/* All Categories */}
                <button
                  onClick={() => {
                    setActiveSubcategory('all');
                    setCurrentPage(1);
                  }}
                  className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors border focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${
                    activeSubcategory === 'all'
                      ? 'bg-gray-800 text-white border-gray-800 shadow-sm'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                  aria-pressed={activeSubcategory === 'all'}
                >
                  <span className="mr-1.5">🏩</span>
                  <span>All Assets</span>
                </button>
                
                {/* Multi-family */}
                <button
                  onClick={() => {
                    setActiveSubcategory('multifamily');
                    setCurrentPage(1);
                  }}
                  className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors border focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                    activeSubcategory === 'multifamily'
                      ? 'bg-orange-100 text-orange-800 border-orange-300 shadow-sm'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                  aria-pressed={activeSubcategory === 'multifamily'}
                >
                  <span className="mr-1.5">🏢</span>
                  <span>Multi-family</span>
                </button>
                
                {/* Land */}
                <button
                  onClick={() => {
                    setActiveSubcategory('land');
                    setCurrentPage(1);
                  }}
                  className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors border focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                    activeSubcategory === 'land'
                      ? 'bg-green-100 text-green-800 border-green-300 shadow-sm'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                  aria-pressed={activeSubcategory === 'land'}
                >
                  <span className="mr-1.5">🌲</span>
                  <span>Land</span>
                </button>
                
                {/* Businesses */}
                <button
                  onClick={() => {
                    setActiveSubcategory('business');
                    setCurrentPage(1);
                  }}
                  className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    activeSubcategory === 'business'
                      ? 'bg-blue-100 text-blue-800 border-blue-300 shadow-sm'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                  aria-pressed={activeSubcategory === 'business'}
                >
                  <span className="mr-1.5">🏪</span>
                  <span>Businesses</span>
                </button>
                
                {/* Hospitality */}
                <button
                  onClick={() => {
                    setActiveSubcategory('hospitality');
                    setCurrentPage(1);
                  }}
                  className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                    activeSubcategory === 'hospitality'
                      ? 'bg-purple-100 text-purple-800 border-purple-300 shadow-sm'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                  aria-pressed={activeSubcategory === 'hospitality'}
                >
                  <span className="mr-1.5">🏨</span>
                  <span>Hospitality</span>
                </button>
              </div>

              {/* Sort moved here under categories for cleaner Approved UI */}
              <div className="mt-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
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
                        onClick={() => setBaseFilters(prev => ({ ...prev, sortBy: sort.key }))}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          baseFilters.sortBy === sort.key 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        aria-pressed={baseFilters.sortBy === sort.key}
                        tabIndex="0"
                        aria-label={`Sort by ${sort.label}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setBaseFilters(prev => ({ ...prev, sortBy: sort.key }));
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
            {activeTab === 'enhanced-discovery' ? (
              // Enhanced Discovery Content
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <EnhancedDiscovery />
              </div>
            ) : filteredProperties.length === 0 ? (
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
                      <span>Explore Commercial Properties</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <main aria-label={`${activeTab === 'approved' ? 'Approved' : 'Commercial'} property listings`}>
                {showMap ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Map View */}
                    <div className="lg:order-2">
                      <PropertyMap 
                        properties={paginatedProperties}
                        selectedProperty={null}
                        onPropertySelect={handlePropertyClick}
                        center={
                          filteredProperties.length > 0 
                            ? {
                                lat: filteredProperties[0].coordinates?.lat || 29.7604,
                                lng: filteredProperties[0].coordinates?.lng || -95.3698
                              } 
                            : { lat: 29.7604, lng: -95.3698 }
                        }
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
                  setBaseFilters(filters);
                }}
                currentFilters={baseFilters}
                savedSearches={savedSearches}
                onSaveSearch={(search) => setSavedSearches((prev) => [...prev, search])}
                onDeleteSearch={(index) => {
                  const updated = [...savedSearches];
                  updated.splice(index, 1);
                  setSavedSearches(updated);
                }}
                onLoadSearch={(search) => setBaseFilters(search.filters)}
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
