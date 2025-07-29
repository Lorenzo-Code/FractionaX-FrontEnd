import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { GoogleMap, MarkerF, InfoWindow, useLoadScript } from "@react-google-maps/api";

// Optimize by memoizing libraries
const libraries = ['places'];

const MapContainer = ({ properties = [], selected, setSelected, preload, mapRef }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 29.7604, lng: -95.3698 });
  const [hoveredProperty, setHoveredProperty] = useState(null);
  const internalMapRef = useRef(null);
  
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

  // Memoize icons to prevent recreation on every render
  const getIconByScore = useCallback((score) => {
    if (score >= 90) return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
    if (score >= 75) return "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
    return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
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

  // Callback for map load
  const onMapLoad = useCallback((map) => {
    internalMapRef.current = map;
    if (mapRef) {
      mapRef.current = map;
    }
  }, [mapRef]);

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
        const score = property.aiScore || 0;
        const isSelected = selected?.id === property.id;

        return (
          <React.Fragment key={property.id || idx}>
            <MarkerF
              position={{ lat, lng }}
              title={`${property.location?.address || 'Property'} - $${property.price || 'N/A'}`}
              onMouseOver={() => setHoveredProperty(property)}
              onMouseOut={() => setHoveredProperty(null)}
              onClick={() => handleMarkerClick(property)}
              label={
                score > 0
                  ? {
                      text: score.toString(),
                      color: "white",
                      fontSize: "10px",
                      fontWeight: "bold",
                    }
                  : undefined
              }
              icon={{
                url: getIconByScore(score),
                scaledSize: new window.google.maps.Size(35, 35), // Slightly smaller for performance
              }}
            />
            {/* Remove InfoWindow to reduce complexity - use sidebar instead */}
          </React.Fragment>
        );
      })}
    </GoogleMap>
  );

};

export default MapContainer;
