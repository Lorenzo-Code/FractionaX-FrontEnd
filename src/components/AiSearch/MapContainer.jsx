import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { GoogleMap, MarkerF, InfoWindow, useLoadScript } from "@react-google-maps/api";

// Optimize by memoizing libraries
const libraries = ['places'];

const MapContainer = ({ properties = [], selected, setSelected, hoveredFromList, onMapBoundsChange, preload, mapRef }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 29.7604, lng: -95.3698 });
  const [hoveredProperty, setHoveredProperty] = useState(null);
  const [lastBoundsUpdate, setLastBoundsUpdate] = useState(0);
  const internalMapRef = useRef(null);
  const boundsUpdateTimeout = useRef(null);
  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries, // Memoized libraries
  });

  // Memoize container style to prevent re-renders
  const containerStyle = useMemo(() => ({
    width: "100%",
    height: "100%",
  }), []);

  // Memoize calculateMapCenter to prevent unnecessary recalculations
  const calculateMapCenter = useCallback(() => {
    // If we have properties, center on them instead of default location
    if (properties && properties.length > 0) {
      const validProperties = properties.filter((p) => {
        const lat = parseFloat(p?.location?.latitude);
        const lng = parseFloat(p?.location?.longitude);
        return !isNaN(lat) && !isNaN(lng);
      });
      
      if (validProperties.length > 0) {
        const avgLat = validProperties.reduce((sum, p) => sum + parseFloat(p.location.latitude), 0) / validProperties.length;
        const avgLng = validProperties.reduce((sum, p) => sum + parseFloat(p.location.longitude), 0) / validProperties.length;
        setMapCenter({ lat: avgLat, lng: avgLng });
        return;
      }
    }
    
    // Default to Houston, TX if no properties
    const width = window.innerWidth;
    const offset = width <= 768 ? 0 : width > 1200 ? 0.15 : 0.1;
    setMapCenter({
      lat: 29.7604,
      lng: -95.3698 - offset,
    });
  }, [properties]);

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
    calculateMapCenter();
    window.addEventListener("resize", calculateMapCenter);
    return () => window.removeEventListener("resize", calculateMapCenter);
  }, [calculateMapCenter]);

  useEffect(() => {
    console.log("📍 Loaded Properties:", properties?.length || 0);
    if (preload && properties.length > 0) {
      setSelected(properties[0]);
    }
    // Recalculate map center when properties change
    calculateMapCenter();
  }, [properties.length, preload, setSelected, calculateMapCenter]); // Only depend on length to reduce re-renders

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
    minZoom: 8,
    restriction: {
      latLngBounds: {
        north: 35,
        south: 25,
        east: -80,
        west: -100,
      },
    },
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

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={
        selected?.location
          ? {
              lat: parseFloat(selected.location.latitude),
              lng: parseFloat(selected.location.longitude),
            }
          : mapCenter
      }
      zoom={13}
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
