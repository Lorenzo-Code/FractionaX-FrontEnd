import React, { useState, useEffect, useRef } from "react";
import MapContainer from "../components/MapContainer";
import SmartPropertySearch from "../components/SmartPropertySearch";
import EnrichedResultsGrid from "../components/EnrichedResultsGrid";
import MapTypeToggle from "../components/MapTypeToggle";

const Marketplace = () => {
  const [aiResults, setAiResults] = useState([]);
  const [aiSummary, setAiSummary] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedProperty, setFocusedProperty] = useState(null);
  const mapRef = useRef(null);
  const [selectedLimit, setSelectedLimit] = useState(10); // default to 10 results


  const defaultQuery = "Show properties under $300K near you";
  const [showResultsPanel, setShowResultsPanel] = useState(true);

  const calculateCenter = (listings) => {
    if (!listings || listings.length === 0) return { lat: 29.7604, lng: -95.3698 };
    const valid = listings.filter(
      (p) =>
        p.location?.latitude &&
        p.location?.longitude &&
        !isNaN(parseFloat(p.location.latitude)) &&
        !isNaN(parseFloat(p.location.longitude))
    );

    if (valid.length === 0) return { lat: 29.7604, lng: -95.3698 };

    const avgLat = valid.reduce((sum, p) => sum + parseFloat(p.location.latitude), 0) / valid.length;
    const avgLng = valid.reduce((sum, p) => sum + parseFloat(p.location.longitude), 0) / valid.length;

    return { lat: avgLat, lng: avgLng };
  };




  // Cache expiration (24h)
  const isCacheExpired = () => {
    const cacheTimestamp = localStorage.getItem("cacheTimestamp");
    return !cacheTimestamp || Date.now() - cacheTimestamp > 86400000;
  };

  useEffect(() => {
    const cachedResults = localStorage.getItem("aiResults");
    const cachedSummary = localStorage.getItem("aiSummary");
    if (cachedResults && cachedSummary && !isCacheExpired()) {
      setAiResults(JSON.parse(cachedResults));
      setAiSummary(cachedSummary);
    } else {
      fetchData();
    }
  }, []);

  const handleResults = (results, summary) => {
    setAiResults(results);
    setAiSummary(summary);

    const center = calculateCenter(results); // ✅ use passed-in results instead of undefined data

    if (mapRef.current && center.lat && center.lng) {
      mapRef.current.panTo(center);
      mapRef.current.setZoom(results.length <= 3 ? 14 : 12); // ✅ results not data
    }
  };



  const fetchData = async (query = defaultQuery) => {
    try {
      const response = await fetch("http://localhost:5000/api/ai-pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: query, limit: selectedLimit }),
      });

      const data = await response.json();

      // Save to localStorage
      localStorage.setItem("aiResults", JSON.stringify(data.property_data));
      localStorage.setItem("aiSummary", data.summary);
      localStorage.setItem("cacheTimestamp", Date.now().toString());

      // ✅ Use handleResults
      handleResults(data.property_data, data.summary);
    } catch (error) {
      console.error("❌ Fetch failed:", error);
    }
  };


  useEffect(() => {
    if (aiResults.length === 0 && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude: lat, longitude: lon } = pos.coords;
          const prompt = `Show properties under $300K near coordinates ${lat}, ${lon}`;
          const res = await fetch("http://localhost:5000/api/ai-pipeline", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }),
          });
          const data = await res.json();
          setAiResults(data.property_data || []);
          setAiSummary(data.summary || "");
        },
        (err) => console.warn("🛑 Location access denied:", err),
        { enableHighAccuracy: true }
      );
    }
  }, [aiResults]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchData(searchQuery);
    }
  };

  const handlePinClick = (property) => {
    setFocusedProperty(property);
    if (mapRef.current && property?.location) {
      const { latitude, longitude } = property.location;
      if (!isNaN(latitude) && !isNaN(longitude)) {
        mapRef.current.panTo({
          lat: parseFloat(latitude),
          lng: parseFloat(longitude)
        });
        mapRef.current.setZoom(16); // Zoom closer to the pin
      }
    }
  };


  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* 🌍 Google Map as full background */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          properties={aiResults}
          selected={focusedProperty}
          setSelected={handlePinClick}
          mapRef={mapRef}
        />
      </div>

      {/* 🔍 Floating Search Bar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 w-[95%] max-w-screen-lg">
        <div className="relative bg-white/30 backdrop-blur-md border border-white/10 shadow-xl rounded-xl p-3 w-full">

          {/* Search Input (SmartPropertySearch fills width) */}
          <div className="flex items-start w-full">
            {/* 🔍 Search Input fills available space */}
            <div className="flex-1">
              <SmartPropertySearch onSearch={handleSearch} />
            </div>


            {/* 📦 Right-side Controls: stacked vertically */}
            <div className="flex flex-col items-end ml-3 space-y-2">
              <button
                onClick={() => setShowResultsPanel(!showResultsPanel)}
                className="text-[10px] px-4 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition whitespace-nowrap"
              >
                {showResultsPanel ? "Hide Results" : "Show Results"}
              </button>

              {/* 🗺️ Satellite toggle under button */}
              <div className="text-[10px]">
                <MapTypeToggle />
              </div>
            </div>

          </div>

        </div>
        {focusedProperty && (
          <div className="absolute top-[90px] right-4 z-30 w-[90%] md:w-[320px] bg-white/90 backdrop-blur-md shadow-2xl rounded-xl p-4 space-y-2 transition-all duration-300">

            {/* ✖️ Close button */}
            <button
              onClick={() => {
                setFocusedProperty(null);
                const center = calculateCenter(aiResults);
                if (mapRef.current && center.lat && center.lng) {
                  mapRef.current.panTo(center);
                  mapRef.current.setZoom(aiResults.length <= 3 ? 14 : 12);
                }
              }}

              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xs"
            >
              ✕
            </button>




            {/* 🏡 Image */}
            {focusedProperty.zillowImage && (
              <img
                src={focusedProperty.zillowImage}
                alt="Property"
                className="w-full h-36 object-cover rounded-md"
              />
            )}

            {/* 📍 Address & Price */}
            <div className="text-sm font-semibold text-gray-800">
              {focusedProperty.address?.oneLine || "No Address"}
            </div>
            <div className="text-blue-700 text-base font-bold">
              {focusedProperty.price
                ? `$${focusedProperty.price.toLocaleString()}`
                : "No price listed"}
            </div>

            {/* 🔗 View More */}
            <div className="pt-2">
              <button
                className="text-xs text-blue-600 font-medium hover:underline"
                onClick={() => {
                  // TODO: Expand modal, redirect, or load more details
                  console.log("View more clicked:", focusedProperty);
                }}
              >
                View More →
              </button>
            </div>
          </div>
        )}

      </div>


      {showResultsPanel && (
        <div className="absolute top-[170px] left-4 z-30 w-[85%] md:w-[42%] lg:w-[30%] max-h-[55vh] overflow-y-auto space-y-2 transition-all duration-300">

          {/* 🔍 Content Card */}
          <div className="bg-white/50 backdrop-blur-md shadow-md rounded-xl space-y-3 overflow-hidden">
            {/* 🔝 Sticky Header Row */}
            <div className="sticky top-0 bg-white/70 backdrop-blur-md z-10 flex justify-between items-start p-3 rounded-t-xl shadow-inner">
              <div className="text-xs text-blue-900 max-w-[70%]">
                <strong>AI Insight:</strong> {aiSummary || "No insight available"}
              </div>
              <div className="text-xs text-gray-800 font-semibold text-right">
                {aiResults.length > 0 && (
                  <>💡 {aiResults.length} Result{aiResults.length !== 1 && "s"}</>
                )}
              </div>
            </div>

            {/* 🏘️ Listings or No Results */}
            <div className="p-3 space-y-3">
              {aiResults.length === 0 ? (
                <div className="text-center text-gray-600 text-sm">
                  🚫 No listings found. Please search above.
                </div>
              ) : (
                <EnrichedResultsGrid
                  results={aiResults}
                  onFocus={setFocusedProperty}
                  compact
                />
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default Marketplace;
