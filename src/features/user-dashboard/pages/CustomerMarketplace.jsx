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
  FiMap,
  FiHeart,
  FiShare2,
  FiBookmark,
  FiDollarSign,
  FiEye,
  FiUsers,
  FiMessageCircle,
  FiThumbsUp,
  FiClock,
  FiBell,
  FiUser,
  FiPieChart,
  FiTarget,
  FiTrendingDown
} from "react-icons/fi";
import { BsCoin, BsRobot, BsShare, BsChatDots, BsGraphUp } from "react-icons/bs";
import { 
  HiOutlineHome,
  HiOutlinePhotograph,
  HiOutlineCreditCard,
  HiOutlineTruck,
  HiOutlineSparkles
} from "react-icons/hi";
import { SEO } from "../../../shared/components";
import { generatePageSEO } from "../../../shared/utils";
import { SmartFilterPanel, PropertyComparison, PropertyMap } from "../../marketplace/components";
import CompactAISearch from "../../marketplace/components/CompactAISearch";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import marketplaceService from '../../marketplace/services/marketplaceService';
import PersonalizedPropertyCard from '../components/PersonalizedPropertyCard';
import FXCTCalculator from '../components/FXCTCalculator';
import PropertyDebugPanel from '../../../components/debug/PropertyDebugPanel';

const CustomerMarketplace = () => {
  // State management for personalized marketplace
  const [activeCategory, setActiveCategory] = useState('real-estate');
  const [activeTab, setActiveTab] = useState('ai-discovered');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // User-specific states
  const [userLikes, setUserLikes] = useState(new Set());
  const [userBookmarks, setUserBookmarks] = useState(new Set());
  const [userCommitments, setUserCommitments] = useState({}); // propertyId -> commitmentAmount
  const [userShares, setUserShares] = useState(new Set());
  const [userNotes, setUserNotes] = useState({}); // propertyId -> note
  const [userWatchlist, setUserWatchlist] = useState(new Set());
  const [showUserInsights, setShowUserInsights] = useState(true);
  
  // Insights and analytics states
  const [userActivity, setUserActivity] = useState({
    totalViews: 0,
    totalLikes: 0,
    totalCommitments: 0,
    totalShares: 0,
    averageROIInterest: 0,
    favoritePropertyTypes: [],
    priceRangePreference: [0, 0],
    locationPreferences: []
  });
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  
  // Data states
  const [approvedListings, setApprovedListings] = useState([]);
  const [aiDiscoveredProperties, setAiDiscoveredProperties] = useState([]);
  const [isLoadingSuggested, setIsLoadingSuggested] = useState(false);
  const [apiError, setApiError] = useState(null);
  
  // Filters state
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
    listingType: 'all',
    showOnlyLiked: false,
    showOnlyBookmarked: false,
    showOnlyCommitted: false
  });

  // Quick filters
  const [quickFilters, setQuickFilters] = useState({
    highROI: false,
    under500K: false,
    newThisWeek: false,
    myInteractions: false,
    trending: false
  });

  // Mock user data - in production, this would come from your API
  const userData = {
    id: 'user123',
    name: 'John Investor',
    investmentLevel: 'Intermediate',
    totalInvested: 25000,
    activeInvestments: 8,
    portfolio: {
      totalValue: 32500,
      totalROI: 8.2,
      monthlyReturn: 245
    },
    preferences: {
      riskTolerance: 'moderate',
      preferredPropertyTypes: ['condo', 'house'],
      maxInvestmentAmount: 5000,
      preferredLocations: ['Houston', 'Austin', 'Dallas']
    }
  };

  // Mock data for properties with enhanced user interaction data
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
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&auto=format"
        ],
        description: "Experience luxury living in this stunning modern condo located in the heart of downtown Houston.",
        detailedDescription: "This exceptional downtown condo represents the pinnacle of urban living...",
        features: ["parking", "gym", "pool", "doorman", "city_views"],
        yearBuilt: 2020,
        coordinates: { lat: 29.7604, lng: -95.3698 },
        tokenized: false,
        expectedROI: 8.5,
        monthlyRent: 2500,
        hoa: 420,
        taxes: 5400,
        insurance: 1200,
        listingDate: "2024-01-15",
        status: "active",
        // Enhanced user interaction data
        userInteractions: {
          totalLikes: 45,
          totalViews: 1250,
          totalShares: 12,
          totalCommitments: 8,
          totalCommitmentAmount: 15000,
          recentActivity: [
            { type: 'like', user: 'user456', timestamp: Date.now() - 3600000 },
            { type: 'commitment', user: 'user789', amount: 2500, timestamp: Date.now() - 7200000 }
          ],
          trending: true,
          hotness: 85 // 0-100 scale
        },
        agent: {
          name: "Sarah Johnson",
          phone: "(713) 555-0123",
          email: "sarah@realty.com",
          company: "Downtown Realty Group"
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
        images: ["/api/placeholder/800/600"],
        description: "Beautiful family home with pool and large backyard in desirable Sugar Land neighborhood.",
        features: ["pool", "garage", "garden", "fireplace"],
        yearBuilt: 2015,
        coordinates: { lat: 29.6196, lng: -95.6349 },
        tokenized: true,
        tokenPrice: 100,
        totalTokens: 6500,
        availableTokens: 2100,
        expectedROI: 12.3,
        monthlyRent: 3200,
        listingDate: "2024-01-08",
        status: "active",
        userInteractions: {
          totalLikes: 67,
          totalViews: 890,
          totalShares: 8,
          totalCommitments: 12,
          totalCommitmentAmount: 25000,
          recentActivity: [
            { type: 'share', user: 'user321', timestamp: Date.now() - 1800000 },
            { type: 'like', user: 'user654', timestamp: Date.now() - 5400000 }
          ],
          trending: false,
          hotness: 72
        }
      }
    ]
  }), []);

  // User interaction handlers
  const handleLike = (propertyId) => {
    const property = [...approvedListings, ...aiDiscoveredProperties].find(p => p.id === propertyId);
    const isLiked = userLikes.has(propertyId);
    
    if (isLiked) {
      setUserLikes(prev => {
        const newSet = new Set(prev);
        newSet.delete(propertyId);
        return newSet;
      });
      toast.info(`Removed ${property?.title} from likes`);
    } else {
      setUserLikes(prev => new Set(prev.add(propertyId)));
      toast.success(`Liked ${property?.title}!`, {
        icon: '❤️'
      });
      
      // Update user activity
      setUserActivity(prev => ({
        ...prev,
        totalLikes: prev.totalLikes + 1
      }));
    }
  };

  const handleBookmark = (propertyId) => {
    const property = [...approvedListings, ...aiDiscoveredProperties].find(p => p.id === propertyId);
    const isBookmarked = userBookmarks.has(propertyId);
    
    if (isBookmarked) {
      setUserBookmarks(prev => {
        const newSet = new Set(prev);
        newSet.delete(propertyId);
        return newSet;
      });
      toast.info(`Removed ${property?.title} from bookmarks`);
    } else {
      setUserBookmarks(prev => new Set(prev.add(propertyId)));
      toast.success(`Bookmarked ${property?.title}!`, {
        icon: '🔖'
      });
    }
  };

  const handleCommit = (propertyId, amount) => {
    const property = [...approvedListings, ...aiDiscoveredProperties].find(p => p.id === propertyId);
    
    setUserCommitments(prev => ({
      ...prev,
      [propertyId]: (prev[propertyId] || 0) + amount
    }));
    
    toast.success(`Committed $${amount.toLocaleString()} to ${property?.title}!`, {
      icon: '💰'
    });
    
    // Update user activity
    setUserActivity(prev => ({
      ...prev,
      totalCommitments: prev.totalCommitments + 1
    }));
  };

  const handleShare = (propertyId) => {
    const property = [...approvedListings, ...aiDiscoveredProperties].find(p => p.id === propertyId);
    
    // Simulate sharing
    navigator.clipboard.writeText(`Check out this property: ${property?.title} - $${property?.price?.toLocaleString()}`);
    
    setUserShares(prev => new Set(prev.add(propertyId)));
    
    toast.success(`Shared ${property?.title}!`, {
      icon: '📤'
    });
    
    // Update user activity
    setUserActivity(prev => ({
      ...prev,
      totalShares: prev.totalShares + 1
    }));
  };

  const handleAddToWatchlist = (propertyId) => {
    const property = [...approvedListings, ...aiDiscoveredProperties].find(p => p.id === propertyId);
    const isWatched = userWatchlist.has(propertyId);
    
    if (isWatched) {
      setUserWatchlist(prev => {
        const newSet = new Set(prev);
        newSet.delete(propertyId);
        return newSet;
      });
      toast.info(`Removed ${property?.title} from watchlist`);
    } else {
      setUserWatchlist(prev => new Set(prev.add(propertyId)));
      toast.success(`Added ${property?.title} to watchlist!`, {
        icon: '👀'
      });
      
      // Set up price alerts
      toast.info(`You'll receive alerts for price changes on ${property?.title}`, {
        icon: '🔔'
      });
    }
  };

  const handlePropertyClick = (property) => {
    // Update view count
    setUserActivity(prev => ({
      ...prev,
      totalViews: prev.totalViews + 1
    }));
    
    // Navigate to property details
    window.location.href = `/property/${property.id}`;
  };

  // Function to fetch AI-powered LoopNet + GPT marketplace listings
  const fetchAISuggestedListings = async () => {
    try {
      setIsLoadingSuggested(true);
      setApiError(null);
      console.log('🏢💼 Fetching personalized commercial marketplace properties...');
      
      let allProperties = [];
      
      try {
        // Fetch personalized commercial marketplace properties with user preferences
        console.log('🚀 Loading personalized commercial properties based on user profile...');
        const personalizedCriteria = {
          location: userData.preferences?.preferredLocations?.[0] || 'Houston, TX',
          maxPrice: userData.preferences?.maxInvestmentAmount ? 
                   userData.preferences.maxInvestmentAmount * 200 : // Scale up for commercial properties
                   2000000, // Higher limit for commercial
          minPrice: 100000,
          propertyTypes: ['Commercial', 'Mixed Use', 'Office', 'Retail', 'Industrial', 'Multi-Family'],
          targetROI: 8,
          includeRentals: true,
          limit: 40, // Get more properties for personalization
          riskTolerance: userData.preferences?.riskTolerance || 'moderate',
          investmentLevel: userData.investmentLevel || 'Intermediate'
        };
        
        // Use Enhanced Discovery which now prioritizes commercial marketplace
        const commercialResult = await marketplaceService.fetchEnhancedDiscoveryListings(personalizedCriteria);
        let commercialProperties = commercialResult.listings || [];
        
        console.log(`🏢 Commercial Marketplace: Generated ${commercialProperties.length} personalized commercial properties`);
        console.log('📊 Data Source:', commercialResult.metadata?.source || 'enhanced_discovery');
        console.log('💰 Portfolio Value:', commercialResult.marketIntelligence?.portfolioValue?.toLocaleString());
        
        // Add personalized user interaction data to each property
        commercialProperties = commercialProperties.map(prop => ({
          ...prop,
          // Add user interaction data for personalized experience
          userInteractions: {
            totalLikes: Math.floor(Math.random() * 75) + 25, // 25-100 likes
            totalViews: Math.floor(Math.random() * 800) + 200, // 200-1000 views
            totalShares: Math.floor(Math.random() * 30) + 5, // 5-35 shares
            totalCommitments: Math.floor(Math.random() * 20) + 8, // 8-28 commitments
            totalCommitmentAmount: Math.floor(Math.random() * 50000) + 15000, // $15K-$65K committed
            recentActivity: [
              { 
                type: Math.random() > 0.5 ? 'like' : 'commitment', 
                user: `user${Math.floor(Math.random() * 999) + 100}`, 
                amount: Math.random() > 0.5 ? Math.floor(Math.random() * 5000) + 1000 : undefined,
                timestamp: Date.now() - Math.random() * 3600000 * 24 * 2 // Within last 2 days
              },
              { 
                type: 'share', 
                user: `user${Math.floor(Math.random() * 999) + 100}`, 
                timestamp: Date.now() - Math.random() * 3600000 * 8 // Within last 8 hours
              }
            ],
            trending: Math.random() > 0.6, // 40% chance of trending
            hotness: Math.floor(Math.random() * 100) + 1, // 1-100 hotness score
            personalizedScore: Math.floor(Math.random() * 50) + 50 // Calculate personalized relevance (50-100)
          },
          // Mark as commercial marketplace property
          source: 'commercial_marketplace_personalized'
        }));
        
        allProperties = [...allProperties, ...commercialProperties];
        
      } catch (commercialError) {
        console.warn('⚠️ Could not fetch personalized commercial marketplace:', commercialError.message);
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
          availableTokens: 0,
          // Add user interaction data
          userInteractions: {
            totalLikes: Math.floor(Math.random() * 50) + 10,
            totalViews: Math.floor(Math.random() * 500) + 100,
            totalShares: Math.floor(Math.random() * 20) + 2,
            totalCommitments: Math.floor(Math.random() * 15) + 3,
            totalCommitmentAmount: Math.floor(Math.random() * 20000) + 5000,
            recentActivity: [
              { type: 'like', user: `user${Math.floor(Math.random() * 999) + 100}`, timestamp: Date.now() - Math.random() * 3600000 },
              { type: 'commitment', user: `user${Math.floor(Math.random() * 999) + 100}`, amount: Math.floor(Math.random() * 2000) + 500, timestamp: Date.now() - Math.random() * 7200000 }
            ],
            trending: Math.random() > 0.7,
            hotness: Math.floor(Math.random() * 100) + 1
          }
        }));
        
        allProperties = [...allProperties, ...fallbackProperties];
      } catch (suggestedError) {
        console.warn('⚠️ Could not fetch fallback suggested deals:', suggestedError.message);
      }
      
      console.log(`✅ Total AI-discovered properties: ${allProperties.length}`);
      
      // If no AI properties, show empty state
      if (allProperties.length === 0) {
        console.log('📋 No AI-generated properties available. Backend may be processing new listings...');
        // Don't fallback to mock data - let the backend provide real properties with real images
      }
      
      // Set the combined AI-discovered properties
      setAiDiscoveredProperties(allProperties);
      
      // Show success toast
      if (allProperties.length > 0) {
        const commercialCount = allProperties.filter(p => p.source === 'commercial_marketplace_personalized' || p.isCommercialProperty).length;
        const aiLoopNetCount = allProperties.filter(p => p.source === 'ai-loopnet-gpt').length;
        const fallbackCount = allProperties.filter(p => p.source === 'suggested-deals-fallback').length;
        const mockCount = allProperties.filter(p => p.source === 'mock-demo').length;
        
        let message;
        if (commercialCount > 0) {
          const marketplaceCount = allProperties.filter(p => p.commercial?.source === 'marketplace').length;
          const auctionCount = allProperties.filter(p => p.commercial?.source === 'auction').length;
          const governmentCount = allProperties.filter(p => p.commercial?.source === 'government').length;
          
          message = `🏢 Personalized Commercial Marketplace: Found ${commercialCount} opportunities! ` +
                   `🏢 ${marketplaceCount} properties, 🔨 ${auctionCount} auctions, 🏢 ${governmentCount} gov sales - tailored to your investment profile!`;
        } else if (aiLoopNetCount > 0) {
          message = `🎆 Generated ${aiLoopNetCount} AI-analyzed investment properties using LoopNet + GPT!`;
        } else if (fallbackCount > 0) {
          message = `Found ${fallbackCount} properties from AI analysis database.`;
        } else {
          message = `Loaded ${mockCount} demo properties for your personalized marketplace!`;
        }
        
        toast.success(message, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      
    } catch (error) {
      console.error('❌ Failed to fetch AI-suggested listings:', error);
      setApiError(error.message);
      
      // Don't fallback to mock data - show empty state for AI listings on error
      setAiDiscoveredProperties([]);
      
      toast.error('Using demo data. AI system may be busy analyzing new opportunities.', {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoadingSuggested(false);
    }
  };

  // Load data
  useEffect(() => {
    const loadMarketplaceData = async () => {
      setLoading(true);
      
      if (activeCategory === 'real-estate') {
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

  // Initialize user activity data
  useEffect(() => {
    // Simulate loading user activity data
    setUserActivity({
      totalViews: 145,
      totalLikes: 23,
      totalCommitments: 8,
      totalShares: 12,
      averageROIInterest: 9.2,
      favoritePropertyTypes: ['condo', 'house'],
      priceRangePreference: [300000, 800000],
      locationPreferences: ['Houston', 'Sugar Land', 'Austin']
    });
  }, []);

  // Get current properties
  const currentProperties = useMemo(() => {
    return activeTab === 'approved' ? approvedListings : aiDiscoveredProperties;
  }, [activeTab, approvedListings, aiDiscoveredProperties]);

  // Enhanced filtering with user preferences
  const filteredProperties = useMemo(() => {
    let filtered = currentProperties;

    // User-specific filters
    if (filters.showOnlyLiked) {
      filtered = filtered.filter(property => userLikes.has(property.id));
    }
    
    if (filters.showOnlyBookmarked) {
      filtered = filtered.filter(property => userBookmarks.has(property.id));
    }
    
    if (filters.showOnlyCommitted) {
      filtered = filtered.filter(property => userCommitments[property.id] > 0);
    }

    // Search query filter
    if (searchQuery) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Quick filters
    if (quickFilters.myInteractions) {
      filtered = filtered.filter(property => 
        userLikes.has(property.id) || 
        userBookmarks.has(property.id) || 
        userCommitments[property.id] > 0
      );
    }
    
    if (quickFilters.trending) {
      filtered = filtered.filter(property => property.userInteractions?.trending);
    }

    // Standard filters
    if (quickFilters.highROI) {
      filtered = filtered.filter(property => (property.expectedROI || 0) >= 10);
    }
    
    if (quickFilters.under500K) {
      filtered = filtered.filter(property => property.price <= 500000);
    }

    // Price range filter
    filtered = filtered.filter(property =>
      property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1]
    );

    // Sort with user preference weighting
    switch (filters.sortBy) {
      case 'personal':
        filtered.sort((a, b) => {
          const aScore = (userLikes.has(a.id) ? 10 : 0) + 
                        (userBookmarks.has(a.id) ? 8 : 0) + 
                        (userCommitments[a.id] ? 15 : 0) +
                        (a.userInteractions?.hotness || 0);
          const bScore = (userLikes.has(b.id) ? 10 : 0) + 
                        (userBookmarks.has(b.id) ? 8 : 0) + 
                        (userCommitments[b.id] ? 15 : 0) +
                        (b.userInteractions?.hotness || 0);
          return bScore - aScore;
        });
        break;
      case 'hotness':
        filtered.sort((a, b) => (b.userInteractions?.hotness || 0) - (a.userInteractions?.hotness || 0));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'roi':
        filtered.sort((a, b) => (b.expectedROI || 0) - (a.expectedROI || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [currentProperties, filters, searchQuery, quickFilters, userLikes, userBookmarks, userCommitments]);

  // Paginate filtered properties
  const paginatedProperties = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    return filteredProperties.slice(startIdx, endIdx);
  }, [filteredProperties, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  // User Insights Component
  const UserInsights = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FiUser className="w-5 h-5 mr-2 text-blue-600" />
          Your Investment Insights
        </h3>
        <button
          onClick={() => setShowUserInsights(!showUserInsights)}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
        >
          {showUserInsights ? 'Hide' : 'Show'}
          <FiEye className="w-4 h-4 ml-1" />
        </button>
      </div>
      
      {showUserInsights && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-3 text-center border border-blue-100">
            <div className="text-2xl font-bold text-blue-600">{userActivity.totalViews}</div>
            <div className="text-xs text-gray-600">Properties Viewed</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center border border-red-100">
            <div className="text-2xl font-bold text-red-600">{userActivity.totalLikes}</div>
            <div className="text-xs text-gray-600">Properties Liked</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center border border-green-100">
            <div className="text-2xl font-bold text-green-600">{userActivity.totalCommitments}</div>
            <div className="text-xs text-gray-600">Commitments Made</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center border border-purple-100">
            <div className="text-2xl font-bold text-purple-600">{userActivity.averageROIInterest}%</div>
            <div className="text-xs text-gray-600">Avg ROI Interest</div>
          </div>
        </div>
      )}
    </motion.div>
  );

  // Enhanced Property Grid with User Controls
  const renderPropertyGrid = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedProperties.map((property) => (
          <PersonalizedPropertyCard
            key={property.id}
            property={property}
            isLiked={userLikes.has(property.id)}
            isBookmarked={userBookmarks.has(property.id)}
            isWatched={userWatchlist.has(property.id)}
            userCommitment={userCommitments[property.id] || 0}
            onLike={() => handleLike(property.id)}
            onBookmark={() => handleBookmark(property.id)}
            onShare={() => handleShare(property.id)}
            onCommit={(amount) => handleCommit(property.id, amount)}
            onWatch={() => handleAddToWatchlist(property.id)}
            onClick={() => handlePropertyClick(property)}
            userPreferences={userData.preferences}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your personalized marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Personalized Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <BsCoin className="mr-2 text-blue-600" />
                  Personal Marketplace
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {userData.name}! • {filteredProperties.length} personalized properties
                </p>
              </div>
            </div>

            <div className="flex-1 max-w-2xl">
              <CompactAISearch 
                onResults={(properties, response) => {
                  console.log('AI Search Results:', properties);
                }}
                placeholder="Ask me about properties that match your investment style..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <FiFilter className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Insights Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <UserInsights />
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Property listing tabs">
            <button
              onClick={() => setActiveTab('approved')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'approved'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FiCheckCircle className="w-4 h-4" />
                <span>Approved Properties</span>
                <span className="bg-gray-100 text-gray-900 py-1 px-2 rounded-full text-xs">
                  {approvedListings.length}
                </span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('ai-discovered')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'ai-discovered'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <BsRobot className="w-4 h-4" />
                <span>AI-Discovered</span>
                <span className="bg-gray-100 text-gray-900 py-1 px-2 rounded-full text-xs">
                  {aiDiscoveredProperties.length}
                </span>
                {isLoadingSuggested && (
                  <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600"></div>
                )}
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Enhanced Filter Bar with User Options */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-gray-700">
              🎯 Quick Filters:
            </span>
            
            {/* Personal Filters */}
            <button
              onClick={() => setQuickFilters(prev => ({ ...prev, myInteractions: !prev.myInteractions }))}
              className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                quickFilters.myInteractions
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <FiUser className="w-4 h-4 mr-1.5" />
              My Interactions
            </button>

            <button
              onClick={() => setQuickFilters(prev => ({ ...prev, trending: !prev.trending }))}
              className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                quickFilters.trending
                  ? 'bg-orange-100 text-orange-800 border-orange-300'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              🔥 Trending
            </button>

            <button
              onClick={() => setQuickFilters(prev => ({ ...prev, highROI: !prev.highROI }))}
              className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                quickFilters.highROI
                  ? 'bg-green-100 text-green-800 border-green-300'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <FiTrendingUp className="w-4 h-4 mr-1.5" />
              High ROI (10%+)
            </button>

            <button
              onClick={() => setQuickFilters(prev => ({ ...prev, under500K: !prev.under500K }))}
              className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                quickFilters.under500K
                  ? 'bg-purple-100 text-purple-800 border-purple-300'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              💰 Under $500K
            </button>
          </div>

          {/* Sort Options */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              {[
                { key: 'personal', label: 'For You', icon: '🎯' },
                { key: 'hotness', label: 'Trending', icon: '🔥' },
                { key: 'roi', label: 'Highest ROI', icon: '📈' },
                { key: 'price-low', label: 'Most Affordable', icon: '💰' },
                { key: 'newest', label: 'Latest', icon: '🔍' }
              ].map((sort) => (
                <button
                  key={sort.key}
                  onClick={() => setFilters(prev => ({ ...prev, sortBy: sort.key }))}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filters.sortBy === sort.key 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {sort.icon} {sort.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {filteredProperties.length} Properties Match Your Preferences
            </h2>
            <p className="text-sm text-gray-600">
              Based on your investment style and activity
            </p>
          </div>
          
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredProperties.length)} of {filteredProperties.length}
          </div>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiSearch className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              No Properties Match Your Filters
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search criteria to see more properties.
            </p>
            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, showOnlyLiked: false, showOnlyBookmarked: false, showOnlyCommitted: false }));
                setQuickFilters({ highROI: false, under500K: false, newThisWeek: false, myInteractions: false, trending: false });
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div>
            {renderPropertyGrid()}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="flex justify-center items-center mt-8 space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 text-sm font-medium border ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            )}
          </div>
        )}
        
        {/* FXCT/FXST Token Calculator */}
        <FXCTCalculator 
          userActivity={userActivity} 
          userStatus="non-accredited" // This would come from user profile in production
        />
      </div>

      {/* Debug Panel for debugging pricing and images */}
      <PropertyDebugPanel 
        properties={aiDiscoveredProperties} 
        title="Customer Marketplace Debug" 
      />

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
      />
    </div>
  );
};

export default CustomerMarketplace;
