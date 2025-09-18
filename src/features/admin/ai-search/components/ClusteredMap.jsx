import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import NearbyAmenities from './NearbyAmenities';
import MapStyleControls from './MapStyleControls';

const libraries = ['places'];

const ClusteredMap = ({ 
  properties = [], 
  center = { lat: 29.7604, lng: -95.3698 }, 
  zoom = 10,
  height = "400px",
  onPropertySelect,
  showAmenities = true,
  amenityTypes,
  onAmenitiesFound,
  clusterOptions = {}
}) => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [amenityLoading, setAmenityLoading] = useState(false);
  const [mapStyle, setMapStyle] = useState('roadmap');
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const clustererRef = useRef(null);
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // Create SVG cluster icons
  const createClusterIcon = useCallback((color, size) => {
    const svg = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${size/2}" cy="${size/2}" r="${size/2-2}" fill="${color}" stroke="white" stroke-width="3"/>
      </svg>
    `;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }, []);

  // Default cluster options with custom styling
  const defaultClusterOptions = useMemo(() => ({
    minimumClusterSize: 3,
    maxZoom: 15,
    gridSize: 60,
    styles: [
      {
        textColor: 'white',
        url: createClusterIcon('#3b82f6', 35),
        height: 35,
        width: 35,
        textSize: 12,
        backgroundPosition: 'center',
        iconAnchor: [17, 17]
      },
      {
        textColor: 'white', 
        url: createClusterIcon('#f59e0b', 45),
        height: 45,
        width: 45,
        textSize: 14,
        backgroundPosition: 'center', 
        iconAnchor: [22, 22]
      },
      {
        textColor: 'white',
        url: createClusterIcon('#ef4444', 55),
        height: 55,
        width: 55,
        textSize: 16,
        backgroundPosition: 'center',
        iconAnchor: [27, 27]
      }
    ]
  }), [createClusterIcon]);

  // Merge default and custom cluster options
  const finalClusterOptions = useMemo(() => ({
    ...defaultClusterOptions,
    ...clusterOptions
  }), [defaultClusterOptions, clusterOptions]);

  // Handle map load
  const handleMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // Handle marker click
  const handleMarkerClick = useCallback((property) => {
    console.log('🖱️ Clustered marker clicked:', property);
    setSelectedProperty(property);
    if (onPropertySelect) {
      onPropertySelect(property);
    }
  }, [onPropertySelect]);

  // Handle amenities found
  const handleAmenitiesFound = useCallback((foundAmenities) => {
    console.log('🎯 Found amenities:', foundAmenities.length);
    setAmenities(foundAmenities);
    if (onAmenitiesFound) {
      onAmenitiesFound(foundAmenities);
    }
  }, [onAmenitiesFound]);

  // Handle amenity loading state
  const handleAmenityLoading = useCallback((loading) => {
    setAmenityLoading(loading);
  }, []);

  // Handle info window close
  const handleInfoWindowClose = useCallback(() => {
    setSelectedProperty(null);
  }, []);

  // Format price for display
  const formatPrice = (price) => {
    if (!price) return 'Price N/A';
    return `$${price.toLocaleString()}`;
  };

  // Create property markers
  const createPropertyMarkers = useCallback(() => {
    if (!mapRef.current || !window.google?.maps) return [];

    const markers = properties.map((property, index) => {
      if (!property.lat || !property.lng) return null;

      const marker = new window.google.maps.Marker({
        position: { lat: property.lat, lng: property.lng },
        title: property.title || property.address || 'Property',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: property.propertyType === 'Condo' ? '#3b82f6' : '#10b981',
          fillOpacity: 0.8,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 10,
        }
      });

      marker.addListener('click', () => handleMarkerClick(property));
      
      return marker;
    }).filter(Boolean);

    return markers;
  }, [properties, handleMarkerClick]);

  // Setup clustering when map and properties change
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;

    // Clean up existing clusterer
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
    }

    // Clean up existing markers
    markersRef.current.forEach(marker => {
      if (marker.setMap) marker.setMap(null);
    });

    // Create new markers
    const newMarkers = createPropertyMarkers();
    markersRef.current = newMarkers;

    // Create clusterer with the new markers
    if (newMarkers.length > 0) {
      clustererRef.current = new MarkerClusterer({
        map: mapRef.current,
        markers: newMarkers,
        ...finalClusterOptions
      });

      console.log(`🗂️ Created clusterer with ${newMarkers.length} property markers`);
    }

    // Cleanup on unmount
    return () => {
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
      }
      markersRef.current.forEach(marker => {
        if (marker.setMap) marker.setMap(null);
      });
    };
  }, [isLoaded, properties, createPropertyMarkers, finalClusterOptions]);

  // Count amenities by type for display
  const amenityCounts = useMemo(() => {
    const counts = {};
    amenities.forEach(amenity => {
      counts[amenity.category] = (counts[amenity.category] || 0) + 1;
    });
    return counts;
  }, [amenities]);

  console.log('🗺️ ClusteredMap - Loading state:', { 
    isLoaded, 
    loadError: loadError?.message,
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'Present' : 'Missing',
    propertiesCount: properties.length
  });

  if (loadError) {
    return (
      <div className="w-full bg-red-100 border border-red-400 rounded p-4 flex items-center justify-center" style={{ height }}>
        <div className="text-center">
          <h3 className="text-red-800 font-bold mb-2">Map Load Error</h3>
          <p className="text-red-600">{loadError.message}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full bg-gray-100 border rounded p-4 flex items-center justify-center" style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Clustered Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border rounded overflow-hidden relative" style={{ height }}>
      {/* Map Style Controls */}
      <MapStyleControls
        selectedStyle={mapStyle}
        onStyleChange={setMapStyle}
      />
      
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={zoom}
        onLoad={handleMapLoad}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          mapTypeId: mapStyle,
        }}
      >
        {/* Info window for selected property */}
        {selectedProperty && (
          <InfoWindowF
            position={{ lat: selectedProperty.lat, lng: selectedProperty.lng }}
            onCloseClick={handleInfoWindowClose}
            options={{
              pixelOffset: new window.google.maps.Size(0, -40),
              maxWidth: 350
            }}
          >
            <div className="p-3 min-w-[300px]">
              {/* Property Image */}
              {selectedProperty.images && selectedProperty.images.length > 0 ? (
                <div className="mb-3">
                  <img 
                    src={selectedProperty.images[0]} 
                    alt={selectedProperty.address || 'Property'}
                    className="w-full h-32 object-cover rounded-lg"
                    onLoad={() => console.log('✅ Image loaded successfully')}
                    onError={(e) => {
                      console.log('❌ Image failed to load:', selectedProperty.images[0]);
                      e.target.style.display = 'none';
                    }}
                  />
                  {selectedProperty.images.length > 1 && (
                    <p className="text-xs text-gray-500 mt-1">
                      📸 {selectedProperty.images.length} photos available
                    </p>
                  )}
                </div>
              ) : (
                <div className="mb-3 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-3xl mb-1">🏠</div>
                    <div className="text-xs">No Image Available</div>
                  </div>
                </div>
              )}
              
              {/* Property Details */}
              <div>
                <h3 className="font-bold text-gray-900 text-base mb-3 leading-tight">
                  {selectedProperty.address || selectedProperty.title || 'Property Details'}
                </h3>
                
                {/* Price - Always show, even if null */}
                <div className="mb-3">
                  {selectedProperty.price ? (
                    <p className="text-green-600 font-bold text-xl">
                      {formatPrice(selectedProperty.price)}
                    </p>
                  ) : (
                    <p className="text-gray-500 font-medium text-lg">
                      Price not available
                    </p>
                  )}
                </div>
                
                {/* Property Specs - Always show section */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Property Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <span className="text-gray-600">
                        🛏️ {selectedProperty.beds || 'N/A'} bed{selectedProperty.beds !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600">
                        🛁 {selectedProperty.baths || 'N/A'} bath{selectedProperty.baths !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center col-span-2">
                      <span className="text-gray-600">
                        📏 {selectedProperty.sqft ? selectedProperty.sqft.toLocaleString() + ' sq ft' : 'Size N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Property Type and Year */}
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-blue-600 font-medium">
                    🏠 {selectedProperty.propertyType || 'Property Type N/A'}
                  </span>
                  {selectedProperty.yearBuilt && (
                    <span className="text-gray-500">
                      📅 Built {selectedProperty.yearBuilt}
                    </span>
                  )}
                </div>
                
                {/* Action button */}
                <button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                  onClick={() => {
                    console.log('View details for:', selectedProperty.id);
                    alert(`Viewing details for: ${selectedProperty.address}`);
                  }}
                >
                  📊 View Full Details
                </button>
              </div>
            </div>
          </InfoWindowF>
        )}
        
        {/* Nearby Amenities Layer */}
        {showAmenities && (
          <NearbyAmenities
            map={mapRef.current}
            selectedProperty={selectedProperty}
            onAmenityFound={handleAmenitiesFound}
            onLoadingChange={handleAmenityLoading}
            activeTypes={amenityTypes}
            enabled={!!selectedProperty}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default ClusteredMap;
