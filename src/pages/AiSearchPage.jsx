import React, { useState, useEffect, useRef, useCallback } from "react";
import SEO from "../components/SEO";
import MapContainer from "../components/AiSearch/MapContainer";
import EnrichedResultsGrid from "../components/AiSearch/EnrichedResultsGrid";
import MapTypeToggle from "../components/AiSearch/MapTypeToggle";
import DevelopmentModal from "../components/common/DevelopmentModal";
import useAuth from "@/hooks/useAuth";
import { smartFetch } from "@/utils/apiClient";
import ComprehensiveResults from "../components/AiSearch/ComprehensiveResults";
import UnifiedSearch from "../components/AiSearch/UnifiedSearch";

const AiSearchPage = () => {
  const [fastCompData, setFastCompData] = useState(null);
  const [comprehensiveData, setComprehensiveData] = useState(null);
  const [showComprehensiveResults, setShowComprehensiveResults] = useState(false);
  const [aiResults, setAiResults] = useState([]);
  const [aiSummary, setAiSummary] = useState("");
  const [focusedProperty, setFocusedProperty] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [userCity, setUserCity] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileAnalysis, setShowMobileAnalysis] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [hoveredPropertyFromList, setHoveredPropertyFromList] = useState(null);
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const mapRef = useRef(null);
  const { user } = useAuth();

  const defaultQuery = "Show properties under $300K near you";

  const getCityFromCoordinates = useCallback(async (lat, lng) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      const data = await response.json();
      return data.city || data.locality || data.principalSubdivision || "your area";
    } catch (error) {
      console.error("Error getting city name:", error);
      return "your area";
    }
  }, []);

  const calculateCenter = useCallback((listings) => {
    const valid = listings.filter(
      (p) => p.location?.latitude && p.location?.longitude &&
        !isNaN(parseFloat(p.location.latitude)) &&
        !isNaN(parseFloat(p.location.longitude))
    );
    if (valid.length === 0) return { lat: 29.7604, lng: -95.3698 };
    const avgLat = valid.reduce((sum, p) => sum + parseFloat(p.location.latitude), 0) / valid.length;
    const avgLng = valid.reduce((sum, p) => sum + parseFloat(p.location.longitude), 0) / valid.length;
    return { lat: avgLat, lng: avgLng };
  }, []);

  const handleResults = useCallback((results, summary) => {
    setAiResults(results || []);
    setAiSummary(summary || "");
    setSearchError(null); // Clear any previous errors
    if (results.length > 0) {
      const center = calculateCenter(results);
      setTimeout(() => {
        if (mapRef.current?.panTo) {
          mapRef.current.panTo(center);
          mapRef.current.setZoom(results.length === 1 ? 15 : results.length <= 5 ? 12 : 10);
        }
      }, 500);
    }
  }, [calculateCenter]);

  const handleSearchError = useCallback((error, context = 'search') => {
    console.error(`${context} error:`, error);
    setSearchError({
      message: error.message || 'An unexpected error occurred',
      context,
      canRetry: retryCount < 3
    });
  }, [retryCount]);

  const retrySearch = useCallback(() => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      setSearchError(null);
      // Trigger a new search with the same parameters
      if (userCity) {
        setIsSearching(true);
        const payload = {
        query: `Show properties under $300K in ${userCity} area`,
        chat_history: [{ role: "user", content: `Show properties under $300K in ${userCity} area` }],
        limit: 30,
        };
        const aiEndpoint = "/api/ai/search";
        smartFetch(aiEndpoint, {
          method: "POST",
          body: JSON.stringify(payload),
        })
          .then(res => res.json())
          .then(data => {
            let listings = data.property_data || [];
            let summary = data.summary || "";
            handleResults(listings, summary);
          })
          .catch(err => handleSearchError(err, 'retry search'))
          .finally(() => setIsSearching(false));
      }
    }
  }, [retryCount, userCity, handleResults, handleSearchError]);

  const handlePinClick = useCallback((property) => {
    setFocusedProperty(property);
    setTimeout(() => {
      const { latitude, longitude } = property?.location || {};
      if (!isNaN(latitude) && !isNaN(longitude)) {
        mapRef.current?.panTo({ lat: parseFloat(latitude), lng: parseFloat(longitude) });
        mapRef.current?.setZoom(16);
      }
    }, 100);
  }, []);

  // Handle map bounds change for dynamic search
  const handleMapBoundsChange = useCallback((boundsData) => {
    // Only do boundary search if we have existing results and user is not actively searching
    if (aiResults.length > 0 && !isSearching) {
      console.log('Map boundary changed, could trigger search:', boundsData);
      // TODO: Implement boundary-based property search
      // This would call your API with the new map bounds to get properties in the visible area
    }
  }, [aiResults.length, isSearching]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!aiResults.length || isSearching) return;
      
      const currentIndex = focusedProperty 
        ? aiResults.findIndex(p => p.id === focusedProperty.id)
        : -1;
      
      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          event.preventDefault();
          if (currentIndex > 0) {
            setFocusedProperty(aiResults[currentIndex - 1]);
          } else if (aiResults.length > 0) {
            setFocusedProperty(aiResults[aiResults.length - 1]); // Loop to end
          }
          break;
          
        case 'ArrowDown':
        case 'ArrowRight':
          event.preventDefault();
          if (currentIndex < aiResults.length - 1) {
            setFocusedProperty(aiResults[currentIndex + 1]);
          } else if (aiResults.length > 0) {
            setFocusedProperty(aiResults[0]); // Loop to beginning
          }
          break;
          
        case 'Escape':
          event.preventDefault();
          setFocusedProperty(null);
          break;
          
        case 'Enter':
        case ' ':
          if (focusedProperty) {
            event.preventDefault();
            // Could trigger a "view details" action here
            console.log('Enter/Space pressed on property:', focusedProperty);
          }
          break;
      }
    };
    
    // Only add keyboard listeners when not typing in search box
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [aiResults, focusedProperty, isSearching]);

  useEffect(() => {
    if (user === null) setShowModal(true);
  }, [user]);

  useEffect(() => {
    if (userLocation && aiResults.length === 0 && userCity) {
      setIsSearching(true);
      const payload = {
      query: `Show properties under $300K in ${userCity} area`,
      chat_history: [{ role: "user", content: `Show properties under $300K in ${userCity} area` }],
      limit: 30,
    };
    const aiEndpoint = "/api/ai/search";
    smartFetch(aiEndpoint, {
      method: "POST",
      body: JSON.stringify(payload),
    })
        .then(res => res.json())
        .then(data => {
          console.log('Auto Search Response:', data);
          
          // Handle different response structures
          let listings = [];
          let summary = "Here are your results.";
          
          // For /api/ai/search endpoint
          listings = data.listings || [];
          summary = data.ai_summary || "";
          
          handleResults(listings, summary);
        })
        .catch(err => handleSearchError(err, 'auto search'))
        .finally(() => setIsSearching(false));

    }
  }, [userLocation, userCity, aiResults.length, handleResults]);


  return (
    <>
      <SEO
        title="Property Research Tool - Find Your Dream Home | FractionaX"
        description="Research properties from multiple sources including Zillow, MLS, and HAR.com. Use AI to find your dream property and connect directly with the original listing source."
        keywords={['property research', 'real estate search', 'property finder', 'Zillow properties', 'MLS listings', 'HAR.com', 'property discovery', 'real estate research tool']}
        canonical="/ai-search"
        openGraph={{
          type: 'website',
          title: 'Property Research Tool - Find Your Dream Home',
          description: 'Research properties from multiple sources including Zillow, MLS, and HAR.com. Use AI to find your dream property and connect directly with the original listing source.',
          url: '/ai-search',
          site_name: 'FractionaX'
        }}
      />
      <div className="relative w-screen h-screen overflow-hidden bg-white">
        {/* 🔒 Modal: Development Notice */}
        <DevelopmentModal visible={showModal} onClose={() => setShowModal(false)} />
        
        {/* Comprehensive Results Modal */}
        {showComprehensiveResults && (
          <ComprehensiveResults 
            data={comprehensiveData} 
            onClose={() => {
              setShowComprehensiveResults(false);
              setComprehensiveData(null);
            }}
          />
        )}

        {/* Mobile AI Analysis Modal */}
        {showMobileAnalysis && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-lg w-full max-h-96 overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-blue-800">AI Market Analysis</h3>
                  </div>
                  <button 
                    onClick={() => setShowMobileAnalysis(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="text-sm text-gray-700">
                  {aiSummary}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 🧠 AI Search Section */}
       {/* 🧠 AI Search Section */}
<div className="bg-gray-50 border-b border-gray-200 px-6 py-6">
  <div className="max-w-full">
    {/* Research Tool Header */}
    <div className="text-center mb-4">
      <div className="flex items-center justify-center mb-2">
        <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h1 className="text-xl font-bold text-gray-900">Property Research Tool</h1>
      </div>
      <p className="text-sm text-gray-600 max-w-2xl mx-auto">
        Discover properties from multiple sources including Zillow, MLS, and HAR.com. 
        This is a research tool to help you find your dream property and connect with the original listing source.
      </p>
    </div>
    
    <h2 className="text-lg font-semibold text-gray-900 mb-3 text-center">
      Tell us what you're looking for
    </h2>

    {/* Unified Property Search */}
    <UnifiedSearch 
      onResults={(data) => {
        console.log('UnifiedSearch results:', data);
        
        // Handle different response structures from different endpoints
        let results = [];
        let summary = '';
        
        if (data.listings) {
          // Natural language search response from /api/ai/search
          results = data.listings;
          summary = data.ai_summary || `Found ${data.listings.length} properties`;
        } else if (data.property_data) {
          // Pipeline response from /api/ai/pipeline
          results = data.property_data;
          summary = data.summary || 'Property analysis complete';
        } else if (data.parsed_intent) {
          // Comprehensive or fast-comp response
          results = [data]; // Single property result
          summary = `Analysis complete for ${data.parsed_intent?.address1 || 'property'}`;
        } else {
          // Fallback
          results = data.results || [];
          summary = data.summary || data.ai_summary || '';
        }
        
        setAiResults(results);
        setAiSummary(summary);
        handleResults(results, summary);
      }}
    />

    {/* AI Market Analysis - Different layout for mobile and desktop */}
    {aiSummary && (
      <>
        {/* Desktop: Full width analysis */}
        {!isMobile && (
          <div className="bg-blue-50 rounded-lg p-4 mt-4 w-full">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="text-base font-medium text-blue-800">AI Market Analysis</span>
            </div>
            <p className="text-sm text-blue-700">{aiSummary}</p>
            
            {/* Debug info - remove this later */}
            <div className="text-xs text-gray-500 mt-2">
              Debug - aiSummary length: {aiSummary ? aiSummary.length : 0} chars
            </div>
          </div>
        )}
        
        {/* Mobile: Small button */}
        {isMobile && (
          <button 
            onClick={() => setShowMobileAnalysis(true)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4 text-sm font-medium"
          >
            📊 View AI Market Analysis
          </button>
        )}
      </>
    )}


            {/* ℹ️ Footer Info */}
            <div className="flex items-center justify-center mt-2 space-x-4">
              <p className="text-sm text-gray-600">
                Describe your ideal property in natural language – our AI will find the perfect matches
              </p>
              {userCity && (
                <div className="flex items-center text-sm text-green-600">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Showing properties near {userCity}
                </div>
              )}
            </div>
            
            {/* Keyboard Navigation Hint */}
            {aiResults.length > 0 && !isMobile && (
              <div className="flex justify-center mt-2">
                <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  💡 Use arrow keys to navigate properties, ESC to deselect
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">

          {/* Mobile Layout - Single Panel Toggle */}
          {isMobile && (
            <div className="flex flex-col w-full h-full">
              {/* Mobile Header with Toggle - Fixed height */}
              <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Properties ({aiResults.length})</h3>
                  <MapTypeToggle viewMode={viewMode} setViewMode={setViewMode} />
                </div>

                {/* Quick Filters - Only show when in list mode */}
                {viewMode === 'list' && (
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs whitespace-nowrap">All</button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-xs whitespace-nowrap">Listed</button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-xs whitespace-nowrap">Multifamily</button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-xs whitespace-nowrap">ROI 8-9%</button>
                  </div>
                )}
              </div>

                {/* Mobile Content - Constrained height for proper scrolling */}
              <div className="flex-1 overflow-hidden">
                {viewMode === 'list' ? (
                  <div className="h-full overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                    {isSearching ? (
                      <div className="flex flex-col items-center justify-center h-64 text-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-gray-600">Searching properties...</p>
                      </div>
                    ) : searchError ? (
                      <div className="flex flex-col items-center justify-center h-64 text-center p-8">
                        <svg className="w-12 h-12 text-red-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <h3 className="text-lg font-medium text-red-900 mb-2">Search Error</h3>
                        <p className="text-red-600 mb-4">{searchError.message}</p>
                        {searchError.canRetry && (
                          <button 
                            onClick={retrySearch}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                          >
                            Try Again
                          </button>
                        )}
                      </div>
                    ) : aiResults.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-center p-8">
                        <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
                        <p className="text-gray-600">Try adjusting your search criteria</p>
                      </div>
                    ) : (
                      <div className="p-3">
                        <EnrichedResultsGrid 
                          results={aiResults} 
                          onFocus={setFocusedProperty} 
                          onHover={setHoveredPropertyFromList}
                          focusedProperty={focusedProperty}
                          compact 
                          loading={isSearching}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full">
                    <MapContainer
                      properties={aiResults}
                      selected={focusedProperty}
                      setSelected={handlePinClick}
                      hoveredFromList={hoveredPropertyFromList}
                      mapRef={mapRef}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Desktop Layout - Property List + Map */}
          {!isMobile && (
            <>
              {/* Left Sidebar - Property Listings */}
              <div className="w-96 bg-white border-r border-gray-200 flex flex-col h-screen">
                {/* Properties Header */}
                <div className="bg-gray-50 border-b border-gray-200 p-4 shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">🎯 Properties ({aiResults.length})</h3>
                    <select className="text-xs border border-gray-300 rounded px-2 py-1 bg-white">
                      <option>AI Recommended</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Investment Score</option>
                      <option>Rental Yield</option>
                    </select>
                  </div>


                  {/* Quick Filters */}
                  <div className="flex flex-wrap gap-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium">Listed</button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-xs">Under Contract</button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-xs">Sold</button>
                    <button className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs">Multifamily</button>
                    <button className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-xs">ROI 8-9%</button>
                  </div>

                  {/* AI Insights Bar */}
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <div className="flex items-center text-green-600">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                      High Investment Potential: {Math.floor(aiResults.length * 0.3)} properties
                    </div>
                    <div className="flex items-center text-orange-600">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-1"></span>
                      Price Drops: {Math.floor(aiResults.length * 0.15)} properties
                    </div>
                  </div>
                </div>

                {/* Scrollable Property List */}
                <div className="flex-1 overflow-y-auto min-h-0">
                  {isSearching ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-gray-600">Searching properties...</p>
                    </div>
                  ) : searchError ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                      <svg className="w-12 h-12 text-red-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <h3 className="text-lg font-medium text-red-900 mb-2">Search Error</h3>
                      <p className="text-red-600 mb-4">{searchError.message}</p>
                      {searchError.canRetry && (
                        <button 
                          onClick={retrySearch}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                          Try Again
                        </button>
                      )}
                    </div>
                  ) : aiResults.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                      <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
                      <p className="text-gray-600">Try adjusting your search criteria or explore different areas</p>
                    </div>
                  ) : (
                    <div className="p-2">
                      <EnrichedResultsGrid 
                        results={aiResults} 
                        onFocus={setFocusedProperty} 
                        onHover={setHoveredPropertyFromList}
                        focusedProperty={focusedProperty}
                        compact 
                        loading={isSearching}
                      />
                    </div>
                  )}
                </div>

              </div>

              {/* Main Content - Google Map (Full Focus) */}
              <div className="flex-1 relative bg-gray-100">
                <MapContainer
                  properties={aiResults}
                  selected={focusedProperty}
                  setSelected={handlePinClick}
                  hoveredFromList={hoveredPropertyFromList}
                  mapRef={mapRef}
                />

                {/* Map Controls */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2 z-20">
                  <button className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                  <button className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                    </svg>
                  </button>
                </div>

                {/* Map Type Toggle */}
                <div className="absolute top-4 left-4 z-20">
                  <div className="bg-white rounded-lg shadow-md border border-gray-200 p-1">
                    <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded font-medium">Map</button>
                    <button className="px-3 py-1 text-xs text-gray-600 hover:text-gray-900">Satellite</button>
                  </div>
                </div>

                {/* Property Detail Panel - Positioned on map */}
                {focusedProperty && (
                  <div className="absolute bottom-4 right-4 w-80 bg-white shadow-2xl rounded-xl overflow-hidden z-30">
                    {/* Close button */}
                    <button
                      onClick={() => {
                        setFocusedProperty(null);
                        const center = calculateCenter(aiResults);
                        if (mapRef.current && center.lat && center.lng) {
                          mapRef.current.panTo(center);
                          mapRef.current.setZoom(aiResults.length <= 3 ? 14 : 12);
                        }
                      }}
                      className="absolute top-2 right-2 z-10 bg-white/90 rounded-full p-1 text-gray-600 hover:text-red-500 hover:bg-white transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    {/* Property Image */}
                    {focusedProperty.zillowImage && (
                      <img
                        src={focusedProperty.zillowImage}
                        alt="Property"
                        className="w-full h-48 object-cover"
                      />
                    )}

                    <div className="p-4">
                      {/* Address & Price */}
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {focusedProperty.address?.oneLine || "1234 Peachtree St"}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Atlanta, GA 30309
                      </p>
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        {focusedProperty.price
                          ? `$${focusedProperty.price.toLocaleString()}`
                          : "$266,000"}
                      </div>

                      {/* Property Details */}
                      <div className="flex items-center text-sm text-gray-600 space-x-3 mb-3">
                        <span>{focusedProperty.beds || '3'} beds</span>
                        <span>{focusedProperty.baths || '2'} baths</span>
                        <span>{focusedProperty.sqft?.toLocaleString() || '1,200'} sq ft</span>
                      </div>

                      {/* AI Insights */}
                      <div className="space-y-2 mb-4">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-blue-600 mb-1">AI Market Insight</p>
                          <p className="text-sm text-blue-800">High rental yield potential area</p>
                        </div>

                        <div className="bg-green-50 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-green-600">Investment Score</p>
                            <span className="text-sm font-bold text-green-700">8.5/10</span>
                          </div>
                          <div className="w-full bg-green-200 rounded-full h-2 mt-1">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                        </div>

                        <div className="bg-orange-50 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-orange-600">Market Trend</p>
                            <span className="text-sm font-bold text-orange-700">↗️ +2.3%</span>
                          </div>
                          <p className="text-xs text-orange-600 mt-1">Property values trending upward</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium text-sm">
                          View Full Details
                        </button>
                        <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition font-medium text-sm">
                          💡 Get AI Analysis
                        </button>
                      </div>

                      {/* AI Market Analysis - After Get AI Analysis button */}
                      {aiSummary && (
                        <div className="bg-blue-50 rounded-lg p-3 mt-4">
                          <div className="flex items-center mb-2">
                            <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <span className="text-sm font-medium text-blue-800">AI Market Analysis</span>
                          </div>
                          <p className="text-xs text-blue-700">{aiSummary}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
};
export default AiSearchPage;