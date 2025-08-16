import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  DollarSign, 
  TrendingUp, 
  Lock, 
  ArrowRight, 
  Eye,
  Star,
  Clock,
  Zap,
  Shield,
  Search,
  RefreshCw
} from 'lucide-react';
import { SEO } from '../../../shared/components';
import { smartFetch } from '../../../shared/utils';
import { useAuth } from '../../../shared/hooks';
import SmartPropertySearch from '../../admin/ai-search/components/SmartPropertySearch';
import CoreLogicLoginModal from '../../../shared/components/CoreLogicLoginModal';
import useCoreLogicInsights from '../../../shared/hooks/useCoreLogicInsights';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const coreLogicInsights = useCoreLogicInsights();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCount, setSearchCount] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [fromCache, setFromCache] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);

  const [searchLimits, setSearchLimits] = useState(null);
  const [upgradePrompt, setUpgradePrompt] = useState(null);

// TESTING MODE: Search limits temporarily disabled
const MAX_FREE_SEARCHES = 999999; // Set to a very high number for testing

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      handleSearch(query);
    }
  }, [searchParams]);

  const handleSearch = async (query) => {
    try {
      setLoading(true);
      setFromCache(false);
      
      const payload = {
        query: query,  // Changed from 'prompt' to 'query' to match backend
        limit: 10  // Request up to 10 listings to show the power of AI search
      };

      const res = await smartFetch('/api/ai/search/v2', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.status === 429) {
        // Handle rate limit exceeded
        const errorData = await res.json();
        if (errorData.tier === 'free') {
          setShowUpgradeModal(true);
          setLoading(false);
          return;
        }
      }

      if (!res.ok) {
        throw new Error(`Search failed: ${res.status}`);
      }

      const data = await res.json();
      
      // Store the backend response data
      setResults(data.listings || []);
      setAiSummary(data.ai_summary || 'Here are properties matching your search criteria.');
      setFromCache(data.fromCache || false);
      
      // Debug logging for photo troubleshooting
      if (data.listings && data.listings.length > 0) {
        console.log('🖼️ Photo debugging - First property:', {
          id: data.listings[0].id,
          imgSrc: data.listings[0].imgSrc,
          carouselPhotos: data.listings[0].carouselPhotos,
          photoCount: data.listings[0].photoCount,
          hasMultiplePhotos: data.listings[0].carouselPhotos && data.listings[0].carouselPhotos.length > 1
        });
      }
      
      // Handle freemium-specific data
      if (data.searchLimits) {
        setSearchLimits(data.searchLimits);
      }
      
      if (data.upgradePrompt) {
        setUpgradePrompt(data.upgradePrompt);
      }
      
      // Update local search count for display purposes
      if (data.searchLimits?.tier === 'free') {
        const remaining = data.searchLimits.dailyRemaining || 0;
        const used = 5 - remaining;
        setSearchCount(Math.max(0, used));
      }
      
      // Update URL with new search query
      if (query !== searchQuery) {
        setSearchParams({ q: query }, { replace: true });
        setSearchQuery(query);
      }
      
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setAiSummary('Unable to complete search. Please try again.');
    } finally {
      setLoading(false);
      setShowSearchBar(false);
    }
  };

  const handleNewSearch = (newQuery) => {
    if (newQuery && newQuery.trim()) {
      handleSearch(newQuery.trim());
    }
  };

  // Handle View Details click with CoreLogic limiting
  const handleViewDetailsClick = (property) => {
    if (isAuthenticated) {
      // Authenticated users get direct access
      navigate(`/property/${property.id}`);
      return;
    }

    // Check CoreLogic limits for unauthenticated users
    const { canViewInsight, viewInsight } = coreLogicInsights;
    
    if (!canViewInsight()) {
      // Limit reached, don't navigate
      return;
    }

    // Record insight usage and navigate
    const allowed = viewInsight();
    if (allowed) {
      navigate(`/property/${property.id}`);
    }
    // If not allowed, the viewInsight() call will trigger the login modal
  };

  const PropertyCard = ({ property, isLocked = false, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative bg-white rounded-xl shadow-lg overflow-hidden border ${isLocked ? 'border-yellow-200' : 'border-gray-200'} hover:shadow-xl transition-all duration-300 group`}
    >
      {/* Premium Property Badge for top results */}
      {index < 3 && !isLocked && (
        <div className="absolute top-3 left-3 z-20">
          <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
            index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
            index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
            'bg-gradient-to-r from-orange-400 to-red-500'
          }`}>
            #{index + 1} Match
          </span>
        </div>
      )}

      {isLocked && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 flex items-center justify-center">
          <div className="text-center text-white">
            <Lock className="w-8 h-8 mx-auto mb-2" />
            <p className="font-semibold">Unlock Full Details</p>
            <button 
              onClick={() => setShowUpgradeModal(true)}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      )}

      {/* Property Image Carousel with Enhanced Overlay */}
      <div className="relative h-48 overflow-hidden">
        {property.carouselPhotos && property.carouselPhotos.length > 0 ? (
          <div className="relative w-full h-full">
            <img 
              src={property.carouselPhotos[0]} 
              alt={property.address?.oneLine || 'Property'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Photo count indicator */}
            {property.carouselPhotos.length > 1 && (
              <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                {property.carouselPhotos.length}
              </div>
            )}
          </div>
        ) : property.imgSrc || property.zillowImage ? (
          <img 
            src={property.imgSrc || property.zillowImage} 
            alt={property.address?.oneLine || 'Property'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <span className="text-gray-500 font-medium">Property Image</span>
              <p className="text-xs text-gray-400 mt-1">Coming Soon</p>
            </div>
          </div>
        )}
        
        {/* Data Quality Badge */}
        {property.dataQuality && (
          <div className="absolute top-3 right-3 z-10">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              property.dataQuality === 'excellent' ? 'bg-green-500 text-white' :
              property.dataQuality === 'good' ? 'bg-blue-500 text-white' :
              property.dataQuality === 'partial' ? 'bg-yellow-500 text-white' :
              'bg-gray-500 text-white'
            }`}>
              {property.dataSource === 'corelogic' ? 'CoreLogic' : 
               property.dataSource === 'zillow' ? 'Zillow' : 'Verified'}
            </span>
          </div>
        )}
        
        {/* Save to Favorites (mockup) */}
        <button className="absolute top-3 left-12 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-white/90 hover:bg-white rounded-full p-2 shadow-lg">
            <Star className="w-4 h-4 text-gray-600 hover:text-yellow-500" />
          </div>
        </button>
        
        {/* Virtual Tour Badge (mockup) */}
        {index < 2 && (
          <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
            <Eye className="w-3 h-3" />
            Virtual Tour
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-5">
        {/* Price - Most prominent like Zillow */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl font-bold text-gray-900">
            {isLocked ? '$•••,•••' : (property.price ? `$${property.price.toLocaleString()}` : 'Price on Request')}
          </div>
          {/* Days on Market */}
          {!isLocked && property.stats?.daysOnMarket && (
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {property.stats.daysOnMarket}d on market
            </div>
          )}
        </div>

        {/* Property Specs - HAR.com style horizontal layout */}
        <div className="flex items-center text-gray-700 mb-3 space-x-4">
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1 text-gray-500" />
            <span className="font-medium">{isLocked ? '•' : property.beds || '–'}</span>
            <span className="text-sm text-gray-500 ml-1">bed{(property.beds !== 1 && !isLocked) ? 's' : ''}</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1 text-gray-500" />
            <span className="font-medium">{isLocked ? '•' : property.baths || '–'}</span>
            <span className="text-sm text-gray-500 ml-1">bath{(property.baths !== 1 && !isLocked) ? 's' : ''}</span>
          </div>
          <div className="flex items-center">
            <Square className="w-4 h-4 mr-1 text-gray-500" />
            <span className="font-medium">{isLocked ? '•••' : (property.sqft ? property.sqft.toLocaleString() : '–')}</span>
            <span className="text-sm text-gray-500 ml-1">sqft</span>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
          <span className="text-sm leading-5">
            {isLocked ? 'Address available to members' : (property.address?.oneLine || property.address || 'Address available upon request')}
          </span>
        </div>

        {/* Property Type & Additional Info */}
        {!isLocked && (
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-3 border-b border-gray-100">
            <span className="capitalize">{property.propertyType || property.property_type || 'Residential'}</span>
            {property.yearBuilt && <span>Built {property.yearBuilt}</span>}
            {property.dataQuality && (
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                {property.dataQuality === 'excellent' ? '✓ Complete Data' :
                 property.dataQuality === 'good' ? '~ Good Data' :
                 '⚠ Limited Data'}
              </span>
            )}
          </div>
        )}

        {/* Investment Indicators (for top properties) */}
        {index < 3 && !isLocked && (
          <div className="flex items-center gap-3 mb-4 text-sm">
            <div className="flex items-center text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="font-medium">Est. 8-12% ROI</span>
            </div>
            <div className="flex items-center text-blue-600">
              <DollarSign className="w-4 h-4 mr-1" />
              <span>Strong Rental Market</span>
            </div>
          </div>
        )}

        {/* Free preview upgrade message */}
        {property.freePreview && property.upgradeMessage && (
          <div className="mb-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">{property.upgradeMessage}</p>
          </div>
        )}


        {/* Action Buttons - Zillow/HAR style */}
        <div className="flex gap-2">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => handleViewDetailsClick(property)}
                className={`flex-1 py-3 px-4 rounded-lg transition-colors text-sm font-semibold flex items-center justify-center gap-2 shadow-sm ${
                  coreLogicInsights.canViewInsight() 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
                disabled={!coreLogicInsights.canViewInsight()}
              >
                <Eye size={16} />
                {coreLogicInsights.canViewInsight() 
                  ? `View Details (${coreLogicInsights.getRemainingInsights()} left)` 
                  : 'Login Required'
                }
              </button>
              {!isLocked && (
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="px-3 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  title="Save to favorites"
                >
                  <Star size={16} />
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => handleViewDetailsClick(property)}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
              >
                <Eye size={16} />
                Full Analysis
              </button>
              <button className="px-3 py-3 border-2 border-gray-300 text-gray-600 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors"
                      title="Save to favorites">
                <Star size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );

  const UpgradeModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-8 max-w-md w-full"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Unlock Full AI Search Power
          </h3>
          
          <p className="text-gray-600 mb-6">
            You've used all {MAX_FREE_SEARCHES} free searches. Upgrade to get unlimited AI property search with:
          </p>
          
          <div className="text-left mb-6 space-y-2">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-green-600" />
              <span className="text-sm">Unlimited AI searches</span>
            </div>
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-green-600" />
              <span className="text-sm">Full property details & agent contacts</span>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm">Investment analysis & ROI calculations</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm">Market insights & neighborhood data</span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Maybe Later
            </button>
            <Link
              to="/login"
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowRight size={16} />
              Upgrade Now
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <>
      <SEO 
        title={`Search Results: ${searchQuery} | FractionaX`}
        description={`AI-powered search results for ${searchQuery}. Find properties with comprehensive analysis and investment insights.`}
        keywords={['property search', 'AI search results', 'real estate', searchQuery]}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/" className="text-2xl font-bold text-blue-600">
                  FractionaX
                </Link>
                <div className="hidden md:flex items-center gap-2 text-gray-600">
                  <Search className="w-4 h-4" />
                  <span className="text-sm">Search Results</span>
                </div>
              </div>
              
              {!isAuthenticated && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">
                    {searchCount}/{MAX_FREE_SEARCHES} free searches used
                  </span>
                  <Link
                    to="/login"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Upgrade
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          {/* Search Query & AI Summary */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Search Results for: "{searchQuery}"
              </h1>
              <div className="flex items-center gap-3">
                {fromCache && (
                  <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Cached Results
                  </div>
                )}
                <button
                  onClick={() => setShowSearchBar(!showSearchBar)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  New Search
                </button>
              </div>
            </div>
            
            {/* Collapsible Search Bar */}
            {showSearchBar && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6"
              >
                <SmartPropertySearch
                  showInput={true}
                  showSuggestions={false}
                  onSearch={handleNewSearch}
                  chatMessages={[]}
                  setChatMessages={() => {}}
                />
              </motion.div>
            )}
            
            {aiSummary && (
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
                <p className="text-blue-800">{aiSummary}</p>
              </div>
            )}
          </div>

          {/* Hidden Results Banner */}
          {!isAuthenticated && searchLimits?.tier === 'free' && (
            <div className="mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Eye className="w-5 h-5" />
                <span className="font-semibold">Free Tier - Limited Results</span>
              </div>
              <p className="text-sm opacity-90">
                Showing {results.length} properties • {searchLimits.hourlyRemaining} searches remaining today
              </p>
              {upgradePrompt?.show && (
                <p className="text-sm mt-1 opacity-90">{upgradePrompt.message}</p>
              )}
            </div>
          )}
          
          {/* Results */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Enhanced Results Grid - Show up to 10 properties */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {results.length} Properties Found
                    {fromCache && <span className="text-sm font-normal text-green-600 ml-2">(Cached)</span>}
                  </h2>
                  {results.length > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-gray-600">
                        Powered by CoreLogic & AI Analysis
                      </div>
                      {fromCache && (
                        <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                          💰 Cost Optimized
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                {results.slice(0, 10).map((property, index) => (
                  <PropertyCard 
                    key={property.id || index} 
                    property={property}
                    index={index}
                    isLocked={!isAuthenticated && index >= 6}  // Show 6 unlocked properties for proof of concept
                  />
                ))}
              </div>
              
              {/* Results Summary */}
              {results.length > 0 && (
                <div className="text-center mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-blue-800 text-sm">
                    <strong>AI Search Results:</strong> Found {results.length} properties matching your criteria. 
                    {results.length === 10 && "This is a sample of available properties."}
                    {!isAuthenticated && " Upgrade to see unlimited results and full property details."}
                  </p>
                </div>
              )}
            </>
          )}

          {/* CTA Sections */}
          {!isAuthenticated && results.length > 0 && (
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 mb-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">
                  Want to See More Properties Like These?
                </h2>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                  Upgrade to unlock unlimited AI searches, full property details, agent contacts, and investment analysis tools.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/login"
                    className="bg-white text-blue-600 py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <ArrowRight size={20} />
                    Start Free Trial
                  </Link>
                  <Link
                    to="/marketplace"
                    className="border-2 border-white text-white py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold"
                  >
                    Browse Investment Properties
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* New Search */}
          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Search size={16} />
              Try Another Search
            </Link>
          </div>
        </div>

        {/* Upgrade Modal */}
        {showUpgradeModal && <UpgradeModal />}
        
        {/* CoreLogic Login Modal */}
        <CoreLogicLoginModal />
      </div>
    </>
  );
};

export default SearchResults;
