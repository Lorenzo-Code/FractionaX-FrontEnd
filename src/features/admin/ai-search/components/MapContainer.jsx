import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { GoogleMap, MarkerF, InfoWindow, useLoadScript } from "@react-google-maps/api";

// Optimize by memoizing libraries
const libraries = ['places'];

const MapContainer = ({ properties = [], selected, setSelected, hoveredFromList, onMapBoundsChange, preload, mapRef, center = { lat: 29.7604, lng: -95.3698 }, zoom = 10 }) => {
  const [hoveredProperty, setHoveredProperty] = useState(null);
  const [lastBoundsUpdate, setLastBoundsUpdate] = useState(0);
  const internalMapRef = useRef(null);
  const boundsUpdateTimeout = useRef(null);
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries, // Memoized libraries
  });

  // Debug logging for Google Maps API status
  useEffect(() => {
    console.log('🗺️ Google Maps API Status:', {
      isLoaded,
      loadError: loadError?.message,
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'Present' : 'Missing',
      windowGoogle: !!window.google,
      googleMaps: !!window.google?.maps
    });
  }, [isLoaded, loadError]);

  // Memoize container style to prevent re-renders
  const containerStyle = useMemo(() => ({
    width: "100%",
    height: "100%",
  }), []);

  // Log center changes for debugging
  useEffect(() => {
    console.log('🗺️ Map center updated:', center, 'zoom:', zoom);
  }, [center, zoom]);

  // Create custom price marker with smooth animations
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

  useEffect(() => {
    console.log("📍 Loaded Properties:", properties?.length || 0);
    if (preload && properties.length > 0) {
      setSelected(properties[0]);
    }
  }, [properties.length, preload, setSelected]);

  // Memoize map options to prevent re-renders
  const mapOptions = useMemo(() => ({
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    gestureHandling: "greedy",
    clickableIcons: false,
    disableDefaultUI: true,
    // Performance optimizations
    maxZoom: 20,
    minZoom: 3,
    // Removed geographic restriction to allow nationwide property search
  }), []);

  // Memoize filtered properties to prevent recalculation
  const validProperties = useMemo(() => {
    return properties.filter((p) => {
      const lat = parseFloat(p?.location?.latitude);
      const lng = parseFloat(p?.location?.longitude);
      return !isNaN(lat) && !isNaN(lng);
    });
  }, [properties]);

  // Handle map bounds change with debouncing
  const handleBoundsChanged = useCallback(() => {
    if (!internalMapRef.current || !onMapBoundsChange) return;
    
    // Clear existing timeout
    if (boundsUpdateTimeout.current) {
      clearTimeout(boundsUpdateTimeout.current);
    }
    
    // Debounce the bounds update to avoid too many API calls
    boundsUpdateTimeout.current = setTimeout(() => {
      const map = internalMapRef.current;
      const bounds = map.getBounds();
      const center = map.getCenter();
      const zoom = map.getZoom();
      
      // Only trigger if enough time has passed since last update
      const now = Date.now();
      if (now - lastBoundsUpdate > 2000) { // 2 second minimum between updates
        setLastBoundsUpdate(now);
        
        const boundsData = {
          northeast: {
            lat: bounds.getNorthEast().lat(),
            lng: bounds.getNorthEast().lng()
          },
          southwest: {
            lat: bounds.getSouthWest().lat(),
            lng: bounds.getSouthWest().lng()
          },
          center: {
            lat: center.lat(),
            lng: center.lng()
          },
          zoom
        };
        
        console.log('Map bounds changed:', boundsData);
        onMapBoundsChange(boundsData);
      }
    }, 1000); // 1 second debounce
  }, [onMapBoundsChange, lastBoundsUpdate]);

  // Callback for map load
  const onMapLoad = useCallback((map) => {
    internalMapRef.current = map;
    if (mapRef) {
      mapRef.current = map;
    }
    
    // Add bounds change listeners
    if (onMapBoundsChange) {
      map.addListener('bounds_changed', handleBoundsChanged);
      map.addListener('dragend', handleBoundsChanged);
      map.addListener('zoom_changed', handleBoundsChanged);
    }
  }, [mapRef, onMapBoundsChange, handleBoundsChanged]);

  // Callback for marker click with debouncing
  const handleMarkerClick = useCallback((property) => {
    const lat = parseFloat(property.location.latitude);
    const lng = parseFloat(property.location.longitude);
    
    setSelected(property);
    if (internalMapRef.current) {
      internalMapRef.current.panTo({ lat, lng });
      internalMapRef.current.setZoom(16); // Reduced zoom for better performance
    }
  }, [setSelected]);

  // Handle loading states and errors
  if (loadError) {
    console.error('Google Maps failed to load:', loadError);
    return (
      <div className="flex items-center justify-center h-full bg-red-50 border-2 border-red-200 rounded-lg">
        <div className="text-center p-6">
          <div className="text-red-600 text-xl mb-2">⚠️</div>
          <div className="text-red-800 font-semibold mb-2">Map Failed to Load</div>
          <div className="text-red-600 text-sm mb-4">
            Unable to load Google Maps. Please check your internet connection and try again.
          </div>
          <div className="text-xs text-red-500">
            Error: {loadError.message || 'Unknown error'}
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <div className="text-gray-600">Loading map...</div>
        </div>
      </div>
    );
  }

  // Additional check to ensure Google Maps API loaded properly
  if (!window.google || !window.google.maps) {
    console.error('Google Maps API not available on window object');
    return (
      <div className="flex items-center justify-center h-full bg-yellow-50 border-2 border-yellow-200 rounded-lg">
        <div className="text-center p-6">
          <div className="text-yellow-600 text-xl mb-2">⚠️</div>
          <div className="text-yellow-800 font-semibold mb-2">Map Initialization Issue</div>
          <div className="text-yellow-600 text-sm">
            Google Maps API loaded but not available. Please refresh the page.
          </div>
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      onLoad={onMapLoad}
      options={mapOptions}
    >
      {validProperties.map((property, idx) => {
        const lat = parseFloat(property.location.latitude);
        const lng = parseFloat(property.location.longitude);
        const isSelected = selected?.id === property.id;
        const isHovered = hoveredProperty?.id === property.id || hoveredFromList?.id === property.id;
        const priceMarker = createPriceMarker(property.price, isSelected, isHovered);

        return (
          <React.Fragment key={property.id || idx}>
            <MarkerF
              position={{ lat, lng }}
              title={`${property.address?.oneLine || 'Property'} - $${property.price?.toLocaleString() || 'N/A'}`}
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
          </React.Fragment>
        );
      })}
    </GoogleMap>
  );

};

export default MapContainer;
