import React, { useState, useEffect, useRef, useCallback } from "react";
import { SEO, DevelopmentModal } from "../../../../shared/components";
import { useAuth } from "../../../../shared/hooks";
import { smartFetch } from "../../../../shared/utils";
import {
  MapContainer,
  EnrichedResultsGrid,
  MapTypeToggle,
  ComprehensiveResults,
  UnifiedSearch
} from "../components";

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
  const [mapCenter, setMapCenter] = useState({ lat: 29.7604, lng: -95.3698 });
  const [mapZoom, setMapZoom] = useState(10);
  const mapRef = useRef(null);
  const { user, isLoading } = useAuth();

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
    console.log('🔍 Search Results Received:', {
      resultsCount: results?.length || 0,
      results: results,
      summary
    });
    
    setAiResults(results || []);
    setAiSummary(summary || "");
    setSearchError(null);
    
    if (results && results.length > 0) {
      console.log('📍 First property full object:', results[0]);
      console.log('📍 First property location field:', results[0]?.location);
      console.log('📍 First property keys:', Object.keys(results[0] || {}));
      const center = calculateCenter(results);
      console.log('🎯 Calculated center:', center);
      setMapCenter(center);
      setMapZoom(results.length === 1 ? 15 : 12);
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
        const aiEndpoint = "/api/ai/search/v2";
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
    if (!property?.location) return;
    setFocusedProperty(property);
    const { latitude, longitude } = property.location;
    if (!isNaN(latitude) && !isNaN(longitude)) {
      setMapCenter({ lat: parseFloat(latitude), lng: parseFloat(longitude) });
      setMapZoom(16);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 200) {
        setShowSearchBar(false);
      } else {
        setShowSearchBar(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  // Initial location fetch
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const city = await getCityFromCoordinates(latitude, longitude);
          setUserLocation({ lat: latitude, lng: longitude });
          setUserCity(city);
        },
        (error) => {
          console.warn("Could not get user location:", error);
          // Default to a major city if location is denied
          setUserCity("Houston");
        }
      );
    } else {
      setUserCity("Houston");
    }
  }, [getCityFromCoordinates]);

  return (
    <>
      <SEO
        title="AI Property Search - Find Your Dream Home | FractionaX"
        description="Use our AI-powered search to find properties from multiple sources. Get detailed analysis and market data to make informed decisions."
        keywords={['ai property search', 'real estate AI', 'smart property finder', 'Zillow search', 'MLS search', 'property analysis']}
        canonical="/admin/ai-search"
      />
      <div className={`relative w-screen h-screen overflow-hidden bg-gray-50 flex flex-col md:flex-row ${isMobile && showMobileAnalysis ? 'overflow-hidden' : ''}`}>

        {/* Left Panel: Search, Filters, and Results */}
        <div className={`flex-shrink-0 w-full md:w-[450px] lg:w-[500px] bg-white shadow-lg z-10 flex flex-col h-full transition-transform duration-300 ease-in-out ${
          isMobile && showMobileAnalysis ? '-translate-x-full' : 
          'translate-x-0'
        }`}>
          {/* Header Section */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Research Tool</h1>
              <p className="text-gray-600 text-sm leading-relaxed">
                Discover properties from multiple sources including Zillow, MLS, and HAR.com. This is a research tool to help you find your dream property and connect with the original listing source.
              </p>
            </div>
            <div className="text-center mb-4">
              <p className="text-gray-700 font-medium text-sm">Tell us what you're looking for</p>
            </div>
          </div>
          
          {/* Search Section */}
          <div className="p-4 border-b border-gray-200">
            <UnifiedSearch onResults={handleResults} />
          </div>

          {isSearching ? (
            <div className="flex-grow flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-600">Searching for properties...</p>
              </div>
            </div>
          ) : searchError ? (
            <div className="flex-grow flex items-center justify-center">
              <div className="text-center p-4">
                <p className="text-red-600">{searchError.message}</p>
                {searchError.canRetry && (
                  <button onClick={retrySearch} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">
                    Retry Search
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Results Header */}
              {aiResults.length > 0 && (
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      Found <span className="font-semibold text-gray-900">{aiResults.length}</span> properties
                    </p>
                    <button
                      onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center"
                    >
                      {viewMode === 'list' ? (
                        <>
                          <span className="mr-1">🗺️</span>
                          Map View
                        </>
                      ) : (
                        <>
                          <span className="mr-1">📋</span>
                          List View
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
              
              {/* Results Content - List or Map on Mobile */}
              <div className={`flex-grow overflow-y-auto ${
                isMobile && viewMode === 'map' ? '' : 'pb-24'
              }`}>
                {isMobile && viewMode === 'map' ? (
                  /* Mobile Map View */
                  <div className="h-full relative">
                    <MapContainer
                      mapRef={mapRef}
                      properties={aiResults}
                      selected={focusedProperty}
                      setSelected={handlePinClick}
                      hoveredFromList={hoveredPropertyFromList}
                      center={mapCenter}
                      zoom={mapZoom}
                    />
                  </div>
                ) : (
                  /* List View */
                  <EnrichedResultsGrid
                    results={aiResults}
                    onFocus={handlePinClick}
                    onHover={setHoveredPropertyFromList}
                    focusedProperty={focusedProperty}
                    loading={isSearching}
                  />
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Panel: Map - Hidden on mobile */}
        <div className={`flex-grow relative h-full ${
          isMobile ? 'hidden' : ''
        }`}>
          <MapContainer
            mapRef={mapRef}
            properties={aiResults}
            selected={focusedProperty}
            setSelected={handlePinClick} // Use handlePinClick for consistency
            hoveredFromList={hoveredPropertyFromList}
            center={mapCenter}
            zoom={mapZoom}
          />
          <div className="absolute top-4 right-4 z-10">
            <MapTypeToggle />
          </div>
          
          {/* Mobile Map View Toggle Button */}
          {isMobile && viewMode === 'map' && aiResults.length > 0 && (
            <div className="absolute bottom-4 left-4 z-10">
              <button
                onClick={() => setViewMode('list')}
                className="bg-white rounded-full shadow-lg p-3 flex items-center border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg mr-2">📋</span>
                <span className="text-sm font-medium text-gray-700">List View</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Analysis View */}
        {isMobile && showMobileAnalysis && (
          <div className="absolute inset-0 bg-white z-20 flex flex-col h-full">
            <button onClick={() => setShowMobileAnalysis(false)} className="absolute top-4 right-4 text-gray-500 z-30">
              &times;
            </button>
            {focusedProperty && (
              <ComprehensiveResults data={{ property_data: [focusedProperty] }} onClose={() => setShowMobileAnalysis(false)} />
            )}
          </div>
        )}

        {showModal && (
          <DevelopmentModal onClose={() => setShowModal(false)} />
        )}
      </div>
    </>
  );
};
export default AiSearchPage;
