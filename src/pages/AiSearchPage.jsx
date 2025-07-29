import React, { useState, useEffect, useRef, useCallback } from "react";
import SEO from "../components/SEO";
import MapContainer from "../components/AiSearch/MapContainer";
import SmartPropertySearch from "../components/AiSearch/SmartPropertySearch";
import EnrichedResultsGrid from "../components/AiSearch/EnrichedResultsGrid";
import MapTypeToggle from "../components/AiSearch/MapTypeToggle";
import DevelopmentModal from "../components/common/DevelopmentModal";
import useAuth from "@/hooks/useAuth";
import { smartFetch } from "@/utils/apiClient";



const AiSearchPage = () => {
  const [aiResults, setAiResults] = useState([]);
  const [aiSummary, setAiSummary] = useState("");
  const [focusedProperty, setFocusedProperty] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [userCity, setUserCity] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
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

  useEffect(() => {
    if (user === null) setShowModal(true);
  }, [user]);

  useEffect(() => {
    if (userLocation && aiResults.length === 0 && userCity) {
      setIsSearching(true);
      const payload = {
        prompt: `Show properties under $300K in ${userCity} area`,
        chat_history: [{ role: "user", content: `Show properties under $300K in ${userCity} area` }],
        limit: 30,
      };
      smartFetch("/api/ai/pipeline", {
        method: "POST",
        body: JSON.stringify(payload),
      })
        .then(res => res.json())
        .then(data => handleResults(data.property_data || [], data.summary))
        .catch(err => console.error("Auto search error:", err))
        .finally(() => setIsSearching(false));

    }
  }, [userLocation, userCity, aiResults.length, handleResults]);


  return (
    <>
      <SEO
        title="AI Property Search - Smart Real Estate Discovery | FractionaX"
        description="Use our AI-powered property search to find the perfect real estate investment. Describe your ideal property in natural language and let our AI find the best matches."
        keywords={['AI property search', 'smart real estate search', 'property discovery', 'real estate AI', 'investment properties', 'property finder', 'real estate technology']}
        canonical="/ai-search"
        openGraph={{
          type: 'website',
          title: 'AI Property Search - Smart Real Estate Discovery',
          description: 'Revolutionary AI-powered property search that understands natural language queries to find your perfect real estate investment.',
          url: '/ai-search',
          site_name: 'FractionaX'
        }}
      />
      <div className="relative w-screen h-screen overflow-hidden bg-white">
        {/* 🔒 Modal: Development Notice */}
        <DevelopmentModal visible={showModal} onClose={() => setShowModal(false)} />

        {/* 🧠 AI Search Section */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-6">
          <div className="max-w-full">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 text-center">
              Tell us what you're looking for
            </h2>
            <SmartPropertySearch
              showInput
              showSuggestions
              chatMessages={chatMessages}
              setChatMessages={setChatMessages}
              onSearch={(results, summary) => {
                setAiResults(results);
                setAiSummary(summary);
                handleResults(results, summary);
              }}
            />

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
          </div>
        </div>
        {/* AI Suggestions - Hidden on Mobile */}
        <div className="hidden md:block bg-white px-6 py-4 border-b border-gray-200">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-md font-medium text-gray-900 mb-3">💡 Try these popular searches:</h3>

            {/* Quick Examples */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">More examples:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => fetchData("I want a fixer-upper with renovation potential under $150K")}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 text-xs transition"
                >
                  "Fixer-upper with potential under $150K"
                </button>
                <button
                  onClick={() => fetchData("Find me a waterfront property with boat access and great views")}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 text-xs transition"
                >
                  "Waterfront property with boat access"
                </button>
                <button
                  onClick={() => fetchData("I need a downtown condo within walking distance of restaurants and nightlife")}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 text-xs transition"
                >
                  "Downtown condo near restaurants"
                </button>
                <button
                  onClick={() => fetchData("Show me eco-friendly homes with solar panels and sustainable features")}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 text-xs transition"
                >
                  "Eco-friendly with solar panels"
                </button>
              </div>
            </div>
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
                        <EnrichedResultsGrid results={aiResults} onFocus={setFocusedProperty} compact />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full">
                    <MapContainer
                      properties={aiResults}
                      selected={focusedProperty}
                      setSelected={handlePinClick}
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

                  {/* AI Analysis Summary */}
                  {aiSummary && (
                    <div className="bg-blue-50 rounded-lg p-3 mb-3">
                      <div className="flex items-center mb-2">
                        <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span className="text-sm font-medium text-blue-800">AI Market Analysis</span>
                      </div>
                      <p className="text-xs text-blue-700">{aiSummary}</p>
                      <span className="font-semibold text-blue-700">
                        {highlightedKeywords.includes(word) ? <mark>{word}</mark> : word}
                      </span>

                    </div>
                  )}

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
                      <EnrichedResultsGrid results={aiResults} onFocus={setFocusedProperty} compact />
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
