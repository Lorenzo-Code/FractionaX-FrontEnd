import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMenu, 
  FiX, 
  FiSearch, 
  FiFilter, 
  FiMapPin, 
  FiLayers,
  FiMaximize2,
  FiMinimize2,
  FiSettings,
  FiRefreshCw,
  FiBookmark,
  FiShare2
} from 'react-icons/fi';
import { BsRobot } from 'react-icons/bs';

// Import existing components
import PropertyMap from '../../../marketplace/components/PropertyMap';
import UnifiedMap from '../components/UnifiedMap';
import DebugMap from '../components/DebugMap';
import SmartPropertySearch from '../components/SmartPropertySearch';
import PropertyResearchSearch from '../components/PropertyResearchSearch';
import CoreLogicPropertyCard from '../components/CoreLogicPropertyCard';
import MapWithPins from '../components/MapWithPins';
import MapSearchControls from '../components/MapSearchControls';
import AmenityLayerControls from '../components/AmenityLayerControls';
import PropertyIntelligencePanel from '../components/PropertyIntelligencePanel';

const MapFocusedAISearch = () => {
  // Map and UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024); // Auto-close on mobile
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 29.7604, lng: -95.3698 }); // Houston default
  const [mapZoom, setMapZoom] = useState(10);
  const mapRef = useRef(null);

  // Search state
  const [properties, setProperties] = useState([
    // Sample properties for testing - remove in production
    {
      id: 'sample-1',
      lat: 29.7604,
      lng: -95.3698,
      address: '1000 Main St, Houston, TX 77002',
      title: '1000 Main St, Houston, TX 77002',
      price: 450000,
      beds: 3,
      baths: 2,
      sqft: 1800,
      propertyType: 'House',
      images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400']
    },
    {
      id: 'sample-2', 
      lat: 29.7694,
      lng: -95.3894,
      address: '2000 Richmond Ave, Houston, TX 77098',
      title: '2000 Richmond Ave, Houston, TX 77098',
      price: 675000,
      beds: 4,
      baths: 3,
      sqft: 2200,
      propertyType: 'House',
      images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400']
    },
    {
      id: 'sample-3',
      lat: 29.7504,
      lng: -95.3598,
      address: '3000 Fannin St, Houston, TX 77004',
      title: '3000 Fannin St, Houston, TX 77004', 
      price: 320000,
      beds: 2,
      baths: 2,
      sqft: 1200,
      propertyType: 'Condo',
      images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400']
    }
  ]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  // Filter and view state
  const [activeFilters, setActiveFilters] = useState({
    priceMin: '',
    priceMax: '',
    propertyType: 'all',
    bedrooms: 'any',
    bathrooms: 'any'
  });
  const [mapBounds, setMapBounds] = useState(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [showSearchControls, setShowSearchControls] = useState(false);
  const [showAmenityControls, setShowAmenityControls] = useState(false);
  const [amenityTypes, setAmenityTypes] = useState({
    schools: true,
    parks: true,
    healthcare: true,
    transit: true,
    shopping: true,
    dining: false, // Start with dining disabled to reduce clutter
    safety: true,
    fitness: false
  });
  const [amenityCounts, setAmenityCounts] = useState({});
  const [amenityLoading, setAmenityLoading] = useState(false);
  
  // Enhanced property intelligence state
  const [showPropertyIntelligence, setShowPropertyIntelligence] = useState(false);
  const [propertyIntelligenceData, setPropertyIntelligenceData] = useState(null);

  // Handle AI search results
  const handleAISearchResults = useCallback((listings, summary) => {
    console.log('🔍 AI Search Results:', listings);
    setProperties(listings || []);
    setSearchResults({ listings: listings || [], summary });
    setIsSearching(false);

    // Auto-center map on first result if single property
    if (listings && listings.length === 1 && listings[0].lat && listings[0].lng) {
      setMapCenter({ lat: parseFloat(listings[0].lat), lng: parseFloat(listings[0].lng) });
      setMapZoom(15);
    } else if (listings && listings.length > 1) {
      // Let PropertyMap handle bounds fitting for multiple properties
      setMapZoom(10);
    }
  }, []);

  // Geocode address using Google Maps API
  const geocodeAddress = useCallback(async (address) => {
    if (!window.google || !window.google.maps) {
      console.error('Google Maps not loaded for geocoding');
      return null;
    }

    return new Promise((resolve) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          console.log('📍 Geocoded address:', address, '→', { lat: location.lat(), lng: location.lng() });
          resolve({ lat: location.lat(), lng: location.lng() });
        } else {
          console.warn('❌ Geocoding failed for:', address, status);
          resolve(null);
        }
      });
    });
  }, []);

  // Extract images from property data like marketplace does
  const extractPropertyImages = useCallback((property) => {
    // Try multiple possible image fields from different API sources
    const possibleImageFields = [
      property.propertyInfo?.images,
      property.propertyInfo?.photos,
      property.propertyInfo?.photo_urls,
      property.propertyInfo?.mls_photos,
      property.propertyInfo?.listing_photos,
      property.imageUrl,
      property.images,
      property.photos,
      property.image_url,
      property.photo_urls,
      property.mls_photos,
      property.listing_photos,
      property.zillow_photos,
      property.property_photos
    ];

    for (const imageField of possibleImageFields) {
      if (imageField) {
        // If it's an array of images
        if (Array.isArray(imageField)) {
          const realImages = imageField.filter(img => 
            img && 
            typeof img === 'string' && 
            !img.includes('/api/placeholder') &&
            !img.includes('placeholder') &&
            (img.startsWith('http') || img.startsWith('https'))
          );
          if (realImages.length > 0) {
            console.log(`✅ Found ${realImages.length} real property images`);
            return realImages;
          }
        }
        // If it's a single image URL
        else if (typeof imageField === 'string' && 
                 !imageField.includes('/api/placeholder') &&
                 !imageField.includes('placeholder') &&
                 (imageField.startsWith('http') || imageField.startsWith('https'))) {
          console.log('✅ Found 1 real property image');
          return [imageField];
        }
      }
    }

    // Log warning if no real images found
    console.warn('⚠️ No real property images found for:', property.parsedAddress?.streetAddress || property.clipId);
    return [];
  }, []);

  // Handle property research results
  const handleResearchResults = useCallback(async (results, message) => {
    console.log('🏢 Research Results:', results);
    
    // Transform CoreLogic results to include coordinates and standard format
    const transformedResults = await Promise.all((results || []).map(async (property) => {
      // Extract coordinates from propertyInfo or estimate from address
      let lat = null, lng = null;
      
      // Try to get coordinates from propertyInfo.parcel.parcelGeometry
      if (property.propertyInfo?.parcel?.parcelGeometry?.centroid) {
        const coords = property.propertyInfo.parcel.parcelGeometry.centroid;
        lat = parseFloat(coords.latitude || coords.lat);
        lng = parseFloat(coords.longitude || coords.lng);
      }
      
      // Build address string
      const address = property.parsedAddress ? 
        `${property.parsedAddress.streetAddress}, ${property.parsedAddress.city}, ${property.parsedAddress.state} ${property.parsedAddress.zipCode}` : 
        'Address not available';
      
      // If no coordinates found, try to geocode the address
      if (!lat || !lng) {
        console.log('🌍 Geocoding address:', address);
        const geocodedLocation = await geocodeAddress(address);
        if (geocodedLocation) {
          lat = geocodedLocation.lat;
          lng = geocodedLocation.lng;
        }
      }
      
      // Extract property images
      const images = extractPropertyImages(property);
      
      // Extract enhanced property intelligence data if available
      const intelligenceData = {
        nearbyHighValueLocations: property.nearbyHighValueLocations || [],
        majorEmployers: property.majorEmployers || [],
        locationScore: property.locationScore || null,
        priceAnalytics: property.priceAnalytics || null
      };
      
      return {
        ...property,
        id: property.clipId || property.id,
        lat: lat,
        lng: lng,
        address: address,
        title: address,
        fullAddress: address,
        images: images, // Add images to the property object
        // Extract property details for display
        price: property.propertyInfo?.assessments?.[0]?.assessedValue?.total || 
               property.propertyInfo?.assessments?.[0]?.marketValue?.total || null,
        beds: property.propertyInfo?.buildings?.[0]?.summary?.bedroomCount || null,
        baths: property.propertyInfo?.buildings?.[0]?.summary?.bathroomCount || null,
        sqft: property.propertyInfo?.buildings?.[0]?.summary?.buildingAreaSqft || null,
        yearBuilt: property.propertyInfo?.buildings?.[0]?.summary?.yearBuilt || null,
        propertyType: property.propertyInfo?.buildings?.[0]?.summary?.propertyType || 'Residential',
        // Enhanced intelligence data
        ...intelligenceData
      };
    }));
    
    console.log('🔄 Transformed properties with geocoding:', transformedResults);
    setProperties(transformedResults);
    setSearchResults({ listings: transformedResults, summary: message || 'Research completed' });
    setIsSearching(false);

    // Center on research result if available and has coordinates
    if (transformedResults && transformedResults.length > 0) {
      const firstProperty = transformedResults[0];
      if (firstProperty.lat && firstProperty.lng) {
        console.log('🎯 Centering map on:', { lat: firstProperty.lat, lng: firstProperty.lng });
        setMapCenter({ lat: firstProperty.lat, lng: firstProperty.lng });
        setMapZoom(17); // Closer zoom for single property
      } else {
        console.log('⚠️ Still no coordinates after geocoding for:', firstProperty.address);
      }
      
      // Set property intelligence data and show panel if we have enhanced data
      if (firstProperty.nearbyHighValueLocations?.length > 0 || 
          firstProperty.majorEmployers?.length > 0 || 
          firstProperty.locationScore || 
          firstProperty.priceAnalytics) {
        setPropertyIntelligenceData(firstProperty);
        setShowPropertyIntelligence(true);
      }
    }
  }, [geocodeAddress]);

  // Handle property selection
  const handlePropertySelect = useCallback((property) => {
    setSelectedProperty(property);
    
    // Center map on selected property
    if (property.lat && property.lng) {
      setMapCenter({ lat: parseFloat(property.lat), lng: parseFloat(property.lng) });
    }
  }, []);

  // Handle search error
  const handleSearchError = useCallback((error) => {
    console.error('❌ Search Error:', error);
    setIsSearching(false);
  }, []);

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  // Clear all results
  const clearResults = useCallback(() => {
    setProperties([]);
    setSelectedProperty(null);
    setSearchResults(null);
  }, []);

  // Handle area-based search
  const handleAreaSearch = useCallback((areaData) => {
    console.log('🗺️ Area Search:', areaData);
    // TODO: Implement area-based property search
    setIsSearching(true);
    
    // For now, simulate search with existing properties filtered by bounds
    setTimeout(() => {
      // Filter existing properties by bounds if available
      setIsSearching(false);
      
      // You would call your API here with the area bounds
      // Example: smartFetch('/api/ai/area-search', { method: 'POST', body: JSON.stringify(areaData) })
    }, 1500);
  }, []);

  // Handle radius-based search
  const handleRadiusSearch = useCallback((radiusData) => {
    console.log('📍 Radius Search:', radiusData);
    setIsSearching(true);
    
    // Center map on search area
    setMapCenter(radiusData.center);
    
    // TODO: Implement radius-based property search
    setTimeout(() => {
      setIsSearching(false);
      
      // You would call your API here with the radius search parameters
      // Example: smartFetch('/api/ai/radius-search', { method: 'POST', body: JSON.stringify(radiusData) })
    }, 1500);
  }, []);

  // Handle location click search
  const handleLocationClick = useCallback((location) => {
    console.log('📌 Location Click Search:', location);
    
    // Center map on clicked location
    setMapCenter(location);
    setMapZoom(15);
    
    // TODO: Implement location-based search
    // This could trigger a search for properties near the clicked point
  }, []);

  // Handle amenity type toggle
  const handleToggleAmenityType = useCallback((type) => {
    setAmenityTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  }, []);

  // Handle toggle all amenity types
  const handleToggleAllAmenities = useCallback((enabled) => {
    const newTypes = Object.keys(amenityTypes).reduce((acc, type) => ({
      ...acc,
      [type]: enabled
    }), {});
    setAmenityTypes(newTypes);
  }, [amenityTypes]);

  // Handle amenities found from map
  const handleAmenitiesFound = useCallback((foundAmenities) => {
    console.log('🎯 Amenities found in main component:', foundAmenities.length);
    const counts = {};
    foundAmenities.forEach(amenity => {
      counts[amenity.category] = (counts[amenity.category] || 0) + 1;
    });
    setAmenityCounts(counts);
  }, []);

  // Handle amenity loading state
  const handleAmenityLoadingChange = useCallback((loading) => {
    setAmenityLoading(loading);
  }, []);

  // Filter properties based on active filters
  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      // Price filter
      const price = property.price || 0;
      const minPrice = activeFilters.priceMin ? parseFloat(activeFilters.priceMin.replace(/[^0-9.-]+/g, '')) || 0 : 0;
      const maxPrice = activeFilters.priceMax ? parseFloat(activeFilters.priceMax.replace(/[^0-9.-]+/g, '')) || Infinity : Infinity;
      
      if (price < minPrice || price > maxPrice) {
        return false;
      }
      
      // Property type filter
      if (activeFilters.propertyType !== 'all') {
        const propertyType = (property.propertyType || property.type || 'house').toLowerCase();
        if (!propertyType.includes(activeFilters.propertyType.toLowerCase())) {
          return false;
        }
      }
      
      // Bedroom filter
      if (activeFilters.bedrooms !== 'any') {
        const beds = property.beds || property.bedrooms || 0;
        const requiredBeds = parseInt(activeFilters.bedrooms);
        if (beds < requiredBeds) {
          return false;
        }
      }
      
      // Bathroom filter
      if (activeFilters.bathrooms !== 'any') {
        const baths = property.baths || property.bathrooms || 0;
        const requiredBaths = parseInt(activeFilters.bathrooms);
        if (baths < requiredBaths) {
          return false;
        }
      }
      
      return true;
    });
  }, [properties, activeFilters]);

  // Sidebar content based on search mode
  const renderSidebarContent = () => {
    return (
      <div className="flex flex-col h-full">
        {/* Address Search Header */}
        <div className="p-3 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-2 mb-1">
            <FiMapPin className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-semibold text-gray-900">Address Search</h2>
          </div>
          <p className="text-xs text-gray-600">Search properties by address and location</p>
        </div>

        {/* Address Search Interface - Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="p-3">
            <PropertyResearchSearch
              onResults={handleResearchResults}
              onError={handleSearchError}
            />
          </div>

          {/* Results Section */}
          {properties.length > 0 && (
            <div className="border-t border-gray-200">
              <div className="p-2">
                <div className="flex items-center justify-between mb-2 sticky top-0 bg-white z-10 pb-2 border-b border-gray-100">
                  <h3 className="text-sm font-medium text-gray-700">
                    Results ({properties.length})
                  </h3>
                  <button
                    onClick={clearResults}
                    className="text-xs text-gray-500 hover:text-red-600 transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-2 pb-4">
                  {properties.slice(0, 10).map((property, index) => (
                    <div
                      key={property.id || index}
                      onClick={() => handlePropertySelect(property)}
                      className={`cursor-pointer border rounded-lg p-2 transition-all hover:shadow-md ${
                        selectedProperty?.id === property.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {property.clipId ? (
                        <CoreLogicPropertyCard 
                          property={property} 
                          compact={true}
                          onClick={() => handlePropertySelect(property)}
                          isSelected={selectedProperty?.id === property.id}
                        />
                      ) : (
                        <div>
                          <h4 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">
                            {property.title || property.fullAddress || property.address || 'Unknown Property'}
                          </h4>
                          <p className="text-xs text-gray-600 mb-2">
                            {property.address || property.location || 'Address not available'}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-green-600">
                              {property.price ? `$${property.price.toLocaleString()}` : 'Price N/A'}
                            </span>
                            {property.aiScore && (
                              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                {property.aiScore}% Match
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`flex h-screen bg-gray-100 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full sm:w-96 lg:w-96 bg-white shadow-lg border-r border-gray-200 flex flex-col relative z-20 lg:relative lg:z-auto"
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">Property Search</h1>
              <button
                onClick={toggleSidebar}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Sidebar Content */}
            {renderSidebarContent()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Map Area */}
      <div className="flex-1 relative">
        {/* Map Controls */}
        <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
          {/* Sidebar Toggle */}
          {!isSidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="p-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
            >
              <FiMenu className="w-5 h-5 text-gray-700" />
            </button>
          )}

          {/* Map Tools */}
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => setShowSearchControls(!showSearchControls)}
              className={`p-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 ${
                showSearchControls ? 'bg-blue-50 border-blue-300' : ''
              }`}
              title={showSearchControls ? 'Hide Search Controls' : 'Show Search Controls'}
            >
              <FiSearch className={`w-4 h-4 ${
                showSearchControls ? 'text-blue-600' : 'text-gray-700'
              }`} />
            </button>
            
            {/* Amenity controls */}
            <button
              onClick={() => setShowAmenityControls(!showAmenityControls)}
              className={`p-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 ${
                showAmenityControls ? 'bg-green-50 border-green-300' : ''
              }`}
              title={showAmenityControls ? 'Hide Amenity Controls' : 'Show Amenity Controls'}
            >
              <FiMapPin className={`w-4 h-4 ${
                showAmenityControls ? 'text-green-600' : 'text-gray-700'
              }`} />
              {amenityLoading && (
                <div className="absolute -top-1 -right-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </button>
            
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <FiMinimize2 className="w-4 h-4 text-gray-700" />
              ) : (
                <FiMaximize2 className="w-4 h-4 text-gray-700" />
              )}
            </button>
            
            <button className="p-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200">
              <FiLayers className="w-4 h-4 text-gray-700" />
            </button>
            
            <button className="p-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200">
              <FiBookmark className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Search Status */}
        {isSearching && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-3 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-700">Searching properties...</span>
            </div>
          </div>
        )}

        {/* Property Results Panel - Center Right */}
        {properties.length > 0 && (
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 w-96 max-h-[70vh]">
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden backdrop-blur-sm">
              {/* Results Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">
                      🏠 Property Research Results
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
                    </p>
                  </div>
                  <button
                    onClick={clearResults}
                    className="text-gray-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Clear results"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
                {searchResults?.summary && (
                  <div className="mt-3 p-3 bg-blue-100 rounded-lg">
                    <p className="text-xs text-blue-800 font-medium">
                      💰 {searchResults.summary}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Results List */}
              <div className="max-h-96 overflow-y-auto">
                {properties.map((property, index) => (
                  <div
                    key={property.id || index}
                    onClick={() => handlePropertySelect(property)}
                    className={`p-5 border-b border-gray-100 cursor-pointer transition-all hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 ${
                      selectedProperty?.id === property.id 
                        ? 'bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-200 shadow-md' 
                        : ''
                    }`}
                  >
                    {property.clipId ? (
                      <CoreLogicPropertyCard 
                        property={property} 
                        compact={true}
                        onClick={() => handlePropertySelect(property)}
                        isSelected={selectedProperty?.id === property.id}
                      />
                    ) : (
                      <div className="space-y-4">
                        {/* Property Photos */}
                        {property.images && property.images.length > 0 && (
                          <div className="relative">
                            <div className="relative h-32 bg-gray-200 rounded-lg overflow-hidden">
                              <img 
                                src={property.images[0]} 
                                alt={`${property.address || 'Property'} - Photo 1`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.parentElement.innerHTML = `
                                    <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                                      <div class="text-center text-gray-500">
                                        <div class="text-2xl mb-1">🏠</div>
                                        <div class="text-xs">Photo Loading...</div>
                                      </div>
                                    </div>
                                  `;
                                }}
                              />
                              {/* Multi-image indicator */}
                              {property.images.length > 1 && (
                                <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs flex items-center">
                                  🖼️ {property.images.length} photos
                                </div>
                              )}
                            </div>
                            {/* Photo thumbnails for multiple images */}
                            {property.images.length > 1 && (
                              <div className="flex space-x-1 mt-2 overflow-x-auto pb-1">
                                {property.images.slice(0, 4).map((image, idx) => (
                                  <div key={idx} className="flex-shrink-0 w-12 h-12 rounded overflow-hidden border border-gray-300">
                                    <img 
                                      src={image} 
                                      alt={`${property.address} thumbnail ${idx + 1}`}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = `
                                          <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <div class="text-xs text-gray-400">🆼️</div>
                                          </div>
                                        `;
                                      }}
                                    />
                                  </div>
                                ))}
                                {property.images.length > 4 && (
                                  <div className="flex-shrink-0 w-12 h-12 rounded bg-gray-100 border border-gray-300 flex items-center justify-center">
                                    <span className="text-xs text-gray-500">+{property.images.length - 4}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Address Header */}
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm mb-1 leading-tight">
                            📍 {property.address || 'Unknown Property'}
                          </h4>
                          <div className="flex items-center space-x-2">
                            {property.images && property.images.length > 0 && (
                              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                🖼️ {property.images.length} photo{property.images.length !== 1 ? 's' : ''}
                              </span>
                            )}
                            {property.lat && property.lng ? (
                              <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                ✓ Located on Map
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                                ⚠️ Location Pending
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price - Prominent Display */}
                        {property.price && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-green-600 font-medium">ASSESSED VALUE</p>
                                <p className="text-xl font-bold text-green-700">
                                  ${property.price.toLocaleString()}
                                </p>
                              </div>
                              <div className="text-green-600">
                                💰
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Property Specs */}
                        <div className="grid grid-cols-2 gap-3">
                          {property.beds && (
                            <div className="bg-gray-50 rounded-lg p-3 text-center">
                              <div className="text-lg mb-1">🛏️</div>
                              <p className="text-sm font-semibold text-gray-900">{property.beds}</p>
                              <p className="text-xs text-gray-600">Bedroom{property.beds !== 1 ? 's' : ''}</p>
                            </div>
                          )}
                          {property.baths && (
                            <div className="bg-gray-50 rounded-lg p-3 text-center">
                              <div className="text-lg mb-1">🛁</div>
                              <p className="text-sm font-semibold text-gray-900">{property.baths}</p>
                              <p className="text-xs text-gray-600">Bathroom{property.baths !== 1 ? 's' : ''}</p>
                            </div>
                          )}
                          {property.sqft && (
                            <div className="bg-gray-50 rounded-lg p-3 text-center">
                              <div className="text-lg mb-1">📏</div>
                              <p className="text-sm font-semibold text-gray-900">{property.sqft.toLocaleString()}</p>
                              <p className="text-xs text-gray-600">Sq Ft</p>
                            </div>
                          )}
                          {property.yearBuilt && (
                            <div className="bg-gray-50 rounded-lg p-3 text-center">
                              <div className="text-lg mb-1">📅</div>
                              <p className="text-sm font-semibold text-gray-900">{property.yearBuilt}</p>
                              <p className="text-xs text-gray-600">Built</p>
                            </div>
                          )}
                        </div>

                        {/* Property Type */}
                        {property.propertyType && (
                          <div className="flex items-center justify-center bg-blue-50 border border-blue-200 rounded-lg p-2">
                            <span className="text-blue-700 font-medium text-sm">
                              🏠 {property.propertyType}
                            </span>
                          </div>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="pt-2 border-t border-gray-200 space-y-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setPropertyIntelligenceData(property);
                              setShowPropertyIntelligence(true);
                            }}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                          >
                            <span>🧠 AI Intelligence Report</span>
                          </button>
                          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                            <span>📊 View Full Report</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Amenity Layer Controls */}
        {showAmenityControls && selectedProperty && (
          <div className="absolute top-4 right-4 z-10 w-80">
            <AmenityLayerControls
              activeTypes={amenityTypes}
              onToggleType={handleToggleAmenityType}
              onToggleAll={handleToggleAllAmenities}
              amenityCounts={amenityCounts}
              selectedProperty={selectedProperty}
              loading={amenityLoading}
            />
          </div>
        )}

        {/* Map Component - Unified map with automatic clustering */}
        <div className="w-full h-full">
          <UnifiedMap
            properties={filteredProperties}
            selectedProperty={selectedProperty}
            onPropertySelect={handlePropertySelect}
            center={mapCenter}
            zoom={mapZoom}
            height="100vh"
            showAmenities={true}
            amenityTypes={amenityTypes}
            onAmenitiesFound={handleAmenitiesFound}
            clusterThreshold={10}
          />
        </div>

        {/* Map Search Controls */}
        {showSearchControls && (
          <MapSearchControls
            map={mapRef.current}
            onAreaSearch={handleAreaSearch}
            onRadiusSearch={handleRadiusSearch}
            onLocationClick={handleLocationClick}
            isDrawingMode={isDrawingMode}
            setIsDrawingMode={setIsDrawingMode}
          />
        )}

        {/* Property Intelligence Panel */}
        {showPropertyIntelligence && propertyIntelligenceData && (
          <div className="absolute bottom-4 left-4 z-20 w-96 max-h-[80vh]">
            <PropertyIntelligencePanel
              property={propertyIntelligenceData}
              nearbyHighValueLocations={propertyIntelligenceData.nearbyHighValueLocations || []}
              majorEmployers={propertyIntelligenceData.majorEmployers || []}
              locationScore={propertyIntelligenceData.locationScore}
              priceAnalytics={propertyIntelligenceData.priceAnalytics}
              onClose={() => setShowPropertyIntelligence(false)}
            />
          </div>
        )}
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default MapFocusedAISearch;
