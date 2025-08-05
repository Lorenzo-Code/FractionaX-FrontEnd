import React, { useState, useEffect, useRef, useCallback } from "react";
import { SEO, DevelopmentModal } from "../../../shared/components";
import { useAuth } from "../../../shared/hooks";
import { smartFetch } from "../../../shared/utils";
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

  // ... (rest of the component logic)

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
        {/* ... (JSX for the page layout, using migrated components) */}
      </div>
    </>
  );
};
export default AiSearchPage;
