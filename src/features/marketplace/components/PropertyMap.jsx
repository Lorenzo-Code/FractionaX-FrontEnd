import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { GoogleMap, MarkerF, InfoWindow, useLoadScript } from "@react-google-maps/api";
import { FiX, FiMapPin, FiDollarSign, FiHome, FiExternalLink } from "react-icons/fi";

const libraries = ['places'];

const PropertyMap = ({ 
  properties = [], 
  selectedProperty, 
  onPropertySelect, 
  mapRef,
  center = { lat: 29.7604, lng: -95.3698 }, // Default to Houston
  zoom = 10,
  height = "400px",
  showInfoWindow = true 
}) => {
  const [hoveredProperty, setHoveredProperty] = useState(null);
  const [infoWindowProperty, setInfoWindowProperty] = useState(null);
  const internalMapRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // Memoize container style
  const containerStyle = useMemo(() => ({
    width: "100%",
    height: height,
  }), [height]);

  // Memoize map options
  const mapOptions = useMemo(() => ({
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    gestureHandling: "greedy",
    clickableIcons: false,
    zoomControl: true,
    maxZoom: 20,
    minZoom: 8,
  }), []);

  // Process properties with valid coordinates
  const validProperties = useMemo(() => {
    return properties.filter((property) => {
      // Try multiple coordinate formats
      const lat = property.coordinates?.lat || property.location?.latitude || property.lat;
      const lng = property.coordinates?.lng || property.location?.longitude || property.lng;
      
      const parsedLat = parseFloat(lat);
      const parsedLng = parseFloat(lng);
      
      return !isNaN(parsedLat) && !isNaN(parsedLng) && 
             parsedLat >= -90 && parsedLat <= 90 && 
             parsedLng >= -180 && parsedLng <= 180;
    }).map(property => ({
      ...property,
      lat: parseFloat(property.coordinates?.lat || property.location?.latitude || property.lat),
      lng: parseFloat(property.coordinates?.lng || property.location?.longitude || property.lng)
    }));
  }, [properties]);

  // Auto-fit map bounds when properties change
  useEffect(() => {
    if (internalMapRef.current && validProperties.length > 1) {
      const bounds = new window.google.maps.LatLngBounds();
      validProperties.forEach(property => {
        bounds.extend({ lat: property.lat, lng: property.lng });
      });
      internalMapRef.current.fitBounds(bounds);
    }
  }, [validProperties]);

  // Create custom price marker
  const createPriceMarker = useCallback((price, isSelected, isHovered) => {
    const formattedPrice = price ? `$${Math.round(price / 1000)}K` : '$--';
    const backgroundColor = isSelected ? '#2563eb' : isHovered ? '#3b82f6' : '#ffffff';
    const textColor = isSelected || isHovered ? '#ffffff' : '#1f2937';
    const borderColor = isSelected ? '#1d4ed8' : isHovered ? '#2563eb' : '#d1d5db';
    const scale = isSelected ? '1.1' : isHovered ? '1.05' : '1';
    
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="80" height="32" viewBox="0 0 80 32" xmlns="http://www.w3.org/2000/svg">
          <g transform="scale(${scale})" transform-origin="center">
            <rect x="2" y="2" width="76" height="28" rx="14" ry="14" 
                  fill="${backgroundColor}" 
                  stroke="${borderColor}" 
                  stroke-width="2" 
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"/>
            <text x="40" y="20" 
                  font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
                  font-size="12" 
                  font-weight="600" 
                  fill="${textColor}" 
                  text-anchor="middle" 
                  dominant-baseline="middle">${formattedPrice}</text>
          </g>
        </svg>
      `)}`
    };
  }, []);

  // Handle map load
  const onMapLoad = useCallback((map) => {
    internalMapRef.current = map;
    if (mapRef) {
      mapRef.current = map;
    }
  }, [mapRef]);

  // Handle marker click
  const handleMarkerClick = useCallback((property) => {
    setInfoWindowProperty(property);
    if (onPropertySelect) {
      onPropertySelect(property);
    }
    
    // Center map on clicked property
    if (internalMapRef.current) {
      internalMapRef.current.panTo({ lat: property.lat, lng: property.lng });
    }
  }, [onPropertySelect]);

  // Handle loading and error states
  if (loadError) {
    return (
      <div className="w-full h-full bg-red-50 border border-red-200 rounded-lg flex items-center justify-center" style={{ height }}>
        <div className="text-center p-6">
          <div className="text-red-600 text-xl mb-2">⚠️</div>
          <div className="text-red-800 font-semibold mb-2">Map Failed to Load</div>
          <div className="text-red-600 text-sm mb-4">
            Unable to load Google Maps. Please check your connection.
          </div>
          <div className="text-xs text-red-500">
            {loadError.message}
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center" style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <div className="text-gray-600">Loading map...</div>
        </div>
      </div>
    );
  }

  if (validProperties.length === 0) {
    return (
      <div className="w-full h-full bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center" style={{ height }}>
        <div className="text-center p-6">
          <FiMapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <div className="text-gray-600 font-medium mb-1">No Properties to Display</div>
          <div className="text-gray-500 text-sm">
            Properties need valid coordinates to appear on the map.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200" style={{ height }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onLoad={onMapLoad}
        options={mapOptions}
      >
        {validProperties.map((property) => {
          const isSelected = selectedProperty?.id === property.id;
          const isHovered = hoveredProperty?.id === property.id;
          const priceMarker = createPriceMarker(property.price, isSelected, isHovered);

          return (
            <MarkerF
              key={property.id}
              position={{ lat: property.lat, lng: property.lng }}
              title={`${property.title} - $${property.price?.toLocaleString() || 'N/A'}`}
              onMouseOver={() => setHoveredProperty(property)}
              onMouseOut={() => setHoveredProperty(null)}
              onClick={() => handleMarkerClick(property)}
              icon={{
                ...priceMarker,
                scaledSize: new window.google.maps.Size(80, 32),
                anchor: new window.google.maps.Point(40, 16)
              }}
              zIndex={isSelected ? 1000 : isHovered ? 500 : 1}
            />
          );
        })}

        {/* Info Window */}
        {infoWindowProperty && showInfoWindow && (
          <InfoWindow
            position={{ lat: infoWindowProperty.lat, lng: infoWindowProperty.lng }}
            onCloseClick={() => setInfoWindowProperty(null)}
            options={{
              pixelOffset: new window.google.maps.Size(0, -10)
            }}
          >
            <div className="p-3 max-w-sm">
              {/* Property Image */}
              {infoWindowProperty.images?.[0] && (
                <img 
                  src={infoWindowProperty.images[0]} 
                  alt={infoWindowProperty.title}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              
              {/* Property Details */}
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {infoWindowProperty.title}
              </h3>
              
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <FiMapPin className="w-4 h-4 mr-1" />
                <span className="line-clamp-1">
                  {infoWindowProperty.address || infoWindowProperty.location || 'Address not available'}
                </span>
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center text-green-600 font-semibold">
                  <FiDollarSign className="w-4 h-4 mr-1" />
                  <span>${infoWindowProperty.price?.toLocaleString() || 'N/A'}</span>
                </div>
                
                {infoWindowProperty.expectedROI && (
                  <div className="text-sm text-blue-600 font-medium">
                    {infoWindowProperty.expectedROI}% ROI
                  </div>
                )}
              </div>
              
              {/* Property Specs */}
              {(infoWindowProperty.beds || infoWindowProperty.baths || infoWindowProperty.sqft) && (
                <div className="flex items-center text-sm text-gray-600 mb-3 space-x-3">
                  {infoWindowProperty.beds && (
                    <div className="flex items-center">
                      <FiHome className="w-3 h-3 mr-1" />
                      <span>{infoWindowProperty.beds} bed</span>
                    </div>
                  )}
                  {infoWindowProperty.baths && (
                    <span>{infoWindowProperty.baths} bath</span>
                  )}
                  {infoWindowProperty.sqft && (
                    <span>{infoWindowProperty.sqft.toLocaleString()} sqft</span>
                  )}
                </div>
              )}
              
              {/* View Details Button */}
              <button 
                onClick={() => {
                  if (onPropertySelect) {
                    onPropertySelect(infoWindowProperty);
                  }
                  setInfoWindowProperty(null);
                }}
                className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <FiExternalLink className="w-4 h-4 mr-1" />
                View Details
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      
      {/* Property Count Badge */}
      <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full shadow-md text-sm font-medium text-gray-700 z-10">
        📍 {validProperties.length} {validProperties.length === 1 ? 'Property' : 'Properties'}
      </div>
    </div>
  );
};

export default PropertyMap;
