import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import marketplaceService from '../services/marketplaceService';

/**
 * Shared marketplace hook with common logic for both public and customer marketplaces
 * @param {Object} config - Configuration options
 * @param {boolean} config.isAuthenticated - Whether user is authenticated
 * @param {Object} config.userPreferences - User preferences for personalization
 * @returns {Object} Marketplace state and methods
 */
export const useMarketplace = (config = {}) => {
  const { isAuthenticated = false, userPreferences = {} } = config;

  // Common state
  const [activeCategory, setActiveCategory] = useState('real-estate');
  const [activeTab, setActiveTab] = useState('commercial-properties'); // Changed to show LoopNet commercial properties by default
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(100); // Increased to show all properties without pagination
  
  // Data states
  const [approvedListings, setApprovedListings] = useState([]);
  const [aiDiscoveredProperties, setAiDiscoveredProperties] = useState([]);
  const [commercialProperties, setCommercialProperties] = useState([]);  // New: LoopNet commercial properties
  const [isLoadingSuggested, setIsLoadingSuggested] = useState(false);
  const [isLoadingCommercial, setIsLoadingCommercial] = useState(false);  // New: Loading state for commercial properties
  const [apiError, setApiError] = useState(null);
  
  // Base filters - Updated for commercial properties with multi-source support
  const [baseFilters, setBaseFilters] = useState({
    priceRange: [0, 100000000], // Increased to $100M for commercial properties
    propertyType: 'all', // office, retail, industrial, multifamily
    sources: ['loopnet', 'crexi', 'auction', 'realtor'], // Multi-source filtering
    bedrooms: 'any',
    bathrooms: 'any',
    location: '',
    sortBy: 'price', // Default to sorting by price for commercial
    tokenizationStatus: 'all',
    roiRange: [0, 50],
    listingStatus: 'all',
    features: [],
    minSqft: '',
    maxSqft: '',
    listingType: 'all'
  });
  
  // Quick filters
  const [quickFilters, setQuickFilters] = useState({
    highROI: false,
    under500K: false,
    newThisWeek: false
  });

  // Fetch AI-suggested listings
  const fetchAISuggestedListings = async () => {
    try {
      setIsLoadingSuggested(true);
      setApiError(null);

      console.log('🤖 Fetching AI-suggested listings from Enhanced Discovery...');

      const criteria = {
        location: userPreferences.location || 'Houston, TX',
        limit: 25,
        minPrice: 100000,
        maxPrice: 2000000,
        intelligenceLevel: 'premium'
      };

      const result = await marketplaceService.fetchEnhancedDiscoveryListings(criteria);
      
      if (result.listings && result.listings.length > 0) {
        setAiDiscoveredProperties(result.listings);
        
        const commercialCount = result.listings.filter(p => p.commercial?.source).length;
        const enhancedCount = result.listings.filter(p => p.source !== 'suggested-deals-fallback').length;
        
        let message;
        const multifamilyCount = result.listings.filter(p => p.isMultifamilyDiscovery).length;
        const targetMet = result.metadata?.targetMet;
        
        if (multifamilyCount > 0) {
          if (targetMet) {
            message = `🏢🎆 MULTIFAMILY DISCOVERY: Found ${result.listings.length} REAL properties! Target 500+ achieved!`;
          } else {
            message = `🏢 Multifamily Discovery: Loaded ${multifamilyCount} real investment properties from 6 markets!`;
          }
        } else if (commercialCount > 0) {
          message = `🏢 Commercial Properties: Loaded ${result.listings.length} opportunities with AI intelligence!`;
        } else if (enhancedCount > 0) {
          message = `🎆 Discovery: Generated ${enhancedCount} AI-enhanced properties!`;
        } else {
          message = `🎆 Discovery: Found ${result.listings.length} properties!`;
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
        });
      }
      
    } catch (error) {
      console.error('❌ Failed to fetch AI-suggested listings:', error);
      setApiError(error.message);
      setAiDiscoveredProperties([]);
      
      toast.error('Failed to load AI-discovered properties. Our AI system may be busy analyzing new opportunities.', {
        position: "bottom-right",
        autoClose: 5000,
      });
    } finally {
      setIsLoadingSuggested(false);
    }
  };

  // Fetch commercial properties from LoopNet
  const fetchCommercialProperties = async () => {
    try {
      setIsLoadingCommercial(true);
      setApiError(null);

      console.log('🏢 Fetching LoopNet commercial properties...');

      const criteria = {
        location: userPreferences.location || 'All Cities',
        limit: 100, // Increased to show all available properties
        minPrice: 0, // Show all properties regardless of price
        maxPrice: 100000000,
        propertyTypes: baseFilters.propertyType === 'all' 
          ? ['office', 'retail', 'industrial', 'multifamily'] 
          : [baseFilters.propertyType],
        sources: baseFilters.sources || ['loopnet', 'crexi', 'auction', 'realtor'],
        sortBy: baseFilters.sortBy || 'price',
        sortOrder: 'desc'
      };

      const result = await marketplaceService.fetchCommercialMarketplaceProperties(criteria);
      
      if (result.listings && result.listings.length > 0) {
        console.log('🏢 LoopNet API Success:', {
          count: result.listings.length,
          sampleProperty: result.listings[0],
          summary: result.summary
        });
        setCommercialProperties(result.listings);
        
        const sources = result.summary?.sourceStats ? Object.keys(result.summary.sourceStats) : [];
        const sourceText = sources.length > 1 ? `${sources.join(', ')} sources` : sources[0] || 'multi-source';
        const message = `🏢 Commercial Properties: Loaded ${result.listings.length} real properties from ${sourceText}!`;
        
        toast.success(message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        console.log('⚠️ LoopNet API returned no properties:', result);
        toast.info('No commercial properties available at the moment.', {
          position: "bottom-right",
          autoClose: 4000,
        });
      }
      
    } catch (error) {
      console.error('❌ Failed to fetch commercial properties:', error);
      setApiError(error.message);
      setCommercialProperties([]);
      
      toast.error('Failed to load commercial properties. Please try again later.', {
        position: "bottom-right",
        autoClose: 5000,
      });
    } finally {
      setIsLoadingCommercial(false);
    }
  };

  // Load marketplace data - now optimized to avoid unnecessary loading
  const loadMarketplaceData = async (forceReload = false) => {
    // Only set loading if we're force reloading or have no data
    const needsLoading = forceReload || (
      activeTab === 'commercial-properties' && commercialProperties.length === 0
    ) || (
      activeTab === 'ai-discovered' && aiDiscoveredProperties.length === 0
    );
    
    if (needsLoading) {
      setLoading(true);
    }
    
    if (activeCategory === 'real-estate') {
      // Load approved listings (mock data)
      if (activeTab === 'approved' && (approvedListings.length === 0 || forceReload)) {
        setApprovedListings([]);
      }
      
      // Load real commercial properties from LoopNet only if needed
      if (activeTab === 'commercial-properties' && (commercialProperties.length === 0 || forceReload)) {
        await fetchCommercialProperties();
      } else if (activeTab === 'ai-discovered' && (aiDiscoveredProperties.length === 0 || forceReload)) {
        // Load real AI-suggested listings from backend only if needed
        await fetchAISuggestedListings();
      }
    }
    
    if (needsLoading) {
      setLoading(false);
    }
  };

  // Get current properties based on active tab
  const currentProperties = useMemo(() => {
    let result;
    if (activeTab === 'approved') result = approvedListings;
    else if (activeTab === 'commercial-properties') result = commercialProperties;
    else result = aiDiscoveredProperties; // Default to ai-discovered
    
    console.log(`📊 currentProperties for tab '${activeTab}':`, {
      count: result.length,
      tab: activeTab,
      sampleProperty: result[0]
    });
    
    return result;
  }, [activeTab, approvedListings, aiDiscoveredProperties, commercialProperties]);

  // Base property filtering logic
  const getFilteredProperties = (properties, filters, searchQuery, quickFilters, userFilters = {}) => {
    let filtered = properties;

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
        const listingDate = new Date(property.listingDate);
        return listingDate.getTime() > oneWeekAgo;
      });
    }

    // Price range filter
    filtered = filtered.filter(property =>
      property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1]
    );

    // Property type filter
    if (filters.propertyType !== 'all') {
      filtered = filtered.filter(property => 
        property.propertyType.toLowerCase() === filters.propertyType.toLowerCase()
      );
    }

    // Bedrooms filter
    if (filters.bedrooms !== 'any') {
      const bedroomCount = parseInt(filters.bedrooms);
      filtered = filtered.filter(property => property.beds >= bedroomCount);
    }

    // Bathrooms filter
    if (filters.bathrooms !== 'any') {
      const bathroomCount = parseInt(filters.bathrooms);
      filtered = filtered.filter(property => property.baths >= bathroomCount);
    }

    // Apply user-specific filters if provided (for authenticated users)
    if (isAuthenticated && userFilters) {
      if (userFilters.showOnlyLiked && userFilters.userLikes) {
        filtered = filtered.filter(property => userFilters.userLikes.has(property.id));
      }
      
      if (userFilters.showOnlyBookmarked && userFilters.userBookmarks) {
        filtered = filtered.filter(property => userFilters.userBookmarks.has(property.id));
      }
      
      if (userFilters.showOnlyCommitted && userFilters.userCommitments) {
        filtered = filtered.filter(property => userFilters.userCommitments[property.id] > 0);
      }
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'roi':
        filtered.sort((a, b) => (b.expectedROI || 0) - (a.expectedROI || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.listingDate) - new Date(a.listingDate));
        break;
      default:
        break;
    }

    return filtered;
  };

  // Apply filtering with current filters
  const filteredProperties = useMemo(() => {
    return getFilteredProperties(currentProperties, baseFilters, searchQuery, quickFilters);
  }, [currentProperties, baseFilters, searchQuery, quickFilters]);

  // Paginate filtered properties
  const paginatedProperties = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    return filteredProperties.slice(startIdx, endIdx);
  }, [filteredProperties, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  // Load data when category or tab changes
  useEffect(() => {
    loadMarketplaceData();
  }, [activeCategory, activeTab]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [baseFilters, searchQuery, quickFilters]);

  // Helper function to toggle data sources
  const toggleSource = (source) => {
    setBaseFilters(prev => {
      const currentSources = prev.sources || [];
      const newSources = currentSources.includes(source)
        ? currentSources.filter(s => s !== source)
        : [...currentSources, source];
      
      return {
        ...prev,
        sources: newSources
      };
    });
  };

  // Helper function to set all sources
  const setAllSources = (enabled = true) => {
    setBaseFilters(prev => ({
      ...prev,
      sources: enabled ? ['loopnet', 'crexi', 'auction', 'realtor'] : []
    }));
  };

  return {
    // State
    activeCategory,
    activeTab,
    loading,
    viewMode,
    showMap,
    showFilters,
    searchQuery,
    currentPage,
    itemsPerPage,
    totalPages,
    approvedListings,
    aiDiscoveredProperties,
    commercialProperties, // New: LoopNet commercial properties
    isLoadingSuggested,
    isLoadingCommercial, // New: Loading state for commercial properties
    apiError,
    baseFilters,
    quickFilters,
    
    // Computed
    currentProperties,
    filteredProperties,
    paginatedProperties,
    
    // Actions
    setActiveCategory,
    setActiveTab,
    setViewMode,
    setShowMap,
    setShowFilters,
    setSearchQuery,
    setCurrentPage,
    setBaseFilters,
    setQuickFilters,
    
    // Methods
    loadMarketplaceData,
    refreshMarketplaceData: () => loadMarketplaceData(true), // Force refresh
    fetchAISuggestedListings,
    fetchCommercialProperties, // New: Fetch multi-source commercial properties
    getFilteredProperties, // Export for custom filtering in child components
    
    // Source filtering helpers
    toggleSource,
    setAllSources,
  };
};

export default useMarketplace;