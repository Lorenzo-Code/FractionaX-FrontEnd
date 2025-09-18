import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { GoogleMap, MarkerF, InfoWindow, DrawingManager, TrafficLayer, TransitLayer, HeatmapLayer, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";
import { FiX, FiMapPin, FiDollarSign, FiHome, FiExternalLink, FiUsers, FiLayers, FiNavigation, FiMap, FiSearch, FiClock, FiArrowRight } from "react-icons/fi";

const libraries = ['places', 'geometry', 'visualization'];

const EnhancedPropertyMap = ({
  properties = [],
  selectedProperty,
  onPropertySelect,
  mapRef,
  center = { lat: 29.7604, lng: -95.3698 }, // Default to Houston
  zoom = 10,
  height = "400px",
  showInfoWindow = true,
  enableClustering = true
}) => {
  const [hoveredProperty, setHoveredProperty] = useState(null);
  const [infoWindowProperty, setInfoWindowProperty] = useState(null);
  const [clusterer, setClusterer] = useState(null);
  const [mapType, setMapType] = useState('roadmap'); // roadmap, satellite, hybrid, terrain
  const [showTraffic, setShowTraffic] = useState(false);
  const [showTransit, setShowTransit] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [drawingMode, setDrawingMode] = useState(null);
  const [showControls, setShowControls] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [showGpsSearch, setShowGpsSearch] = useState(false);
  const [gpsSearchQuery, setGpsSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [travelMode, setTravelMode] = useState('DRIVING');
  const [distanceMatrix, setDistanceMatrix] = useState({});
  const [showDistances, setShowDistances] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const internalMapRef = useRef(null);
  const gpsSearchInputRef = useRef(null);

  // Check if Google Maps is available
  useEffect(() => {
    const checkGoogleMaps = () => {
      if (typeof window !== 'undefined' && 
          window.google && 
          window.google.maps && 
          window.google.maps.Map &&
          window.google.maps.Size &&
          window.google.maps.Point &&
          window.google.maps.places &&
          window.google.maps.geometry &&
          window.google.maps.visualization) {
        console.log('✅ All Google Maps APIs loaded successfully');
        setIsLoaded(true);
        setLoadError(null);
      } else {
        // Try to load Google Maps if not available
        loadGoogleMapsAPI();
      }
    };

    const loadGoogleMapsAPI = () => {
      if (typeof window === 'undefined') return;
      
      // Check if script is already loading or loaded
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        // Wait for existing script to load
        const checkInterval = setInterval(() => {
          if (window.google && window.google.maps && window.google.maps.Map) {
            clearInterval(checkInterval);
            // Wait a bit more for all libraries to load
            setTimeout(checkGoogleMaps, 500);
          }
        }, 100);
        
        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkInterval);
          if (!isLoaded) {
            setLoadError(new Error('Timeout: Google Maps API took too long to load'));
          }
        }, 10000);
        return;
      }

      const script = document.createElement('script');
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries.join(',')}&v=weekly&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;
      
      // Create global callback
      window.initGoogleMaps = () => {
        setTimeout(checkGoogleMaps, 100); // Small delay to ensure everything is ready
      };
      
      script.onerror = () => {
        setLoadError(new Error('Failed to load Google Maps API script'));
      };
      
      document.head.appendChild(script);
    };

    checkGoogleMaps();
    
    // Cleanup
    return () => {
      if (window.initGoogleMaps) {
        delete window.initGoogleMaps;
      }
    };
  }, [isLoaded]);

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

  // Debug Google Maps loading
  useEffect(() => {
    console.log('🗺️ Google Maps loading state:', {
      isLoaded,
      loadError: loadError?.message,
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'Present' : 'Missing',
      apiKeyValue: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      libraries,
      propertiesCount: properties.length,
      validPropertiesCount: validProperties.length,
      googleAvailable: typeof window !== 'undefined' && typeof window.google !== 'undefined',
      googleMapsAvailable: typeof window !== 'undefined' && typeof window.google?.maps !== 'undefined'
    });

    // Additional debugging when loaded
    if (isLoaded) {
      console.log('✅ Google Maps API loaded successfully');
      console.log('Google object:', window.google);
      console.log('Google Maps object:', window.google?.maps);
      console.log('Available libraries:', {
        places: !!window.google?.maps?.places,
        geometry: !!window.google?.maps?.geometry,
        visualization: !!window.google?.maps?.visualization
      });
    }

    if (loadError) {
      console.error('❌ Google Maps API load error:', loadError);
      console.log('Common fixes:');
      console.log('1. Check API key validity');
      console.log('2. Enable Maps JavaScript API in Google Cloud Console');
      console.log('3. Check billing account setup');
      console.log('4. Verify domain restrictions (if any)');
    }
  }, [isLoaded, loadError, properties.length, validProperties.length]);

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

  // Create enhanced property marker
  const createPropertyMarker = useCallback((property, isSelected, isHovered) => {
    const price = property.price || 0;
    const formattedPrice = price ? `$${Math.round(price / 1000)}K` : '$--';
    
    // Determine marker style based on property type and price
    const getMarkerColor = () => {
      if (isSelected) return '#2563eb';
      if (isHovered) return '#3b82f6';
      
      // Color code by price range
      if (price > 1000000) return '#ef4444'; // Red for expensive
      if (price > 500000) return '#f59e0b'; // Orange for mid-range
      if (price > 200000) return '#10b981'; // Green for affordable
      return '#6b7280'; // Gray for unknown price
    };

    const backgroundColor = getMarkerColor();
    const textColor = '#ffffff';
    const scale = isSelected ? '1.2' : isHovered ? '1.1' : '1';
    
    // Property type icon
    const getPropertyIcon = () => {
      const type = property.propertyType || property.type || 'house';
      switch (type.toLowerCase()) {
        case 'condo':
        case 'apartment': return '🏢';
        case 'commercial': return '🏪';
        case 'land': return '🌾';
        default: return '🏠';
      }
    };

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="100" height="46" viewBox="0 0 100 46" xmlns="http://www.w3.org/2000/svg">
          <g transform="scale(${scale})" transform-origin="center">
            <!-- Main marker body -->
            <path d="M50 5 C65 5, 85 15, 85 30 C85 37, 78 42, 70 42 L30 42 C22 42, 15 37, 15 30 C15 15, 35 5, 50 5 Z" 
                  fill="${backgroundColor}" 
                  stroke="#ffffff" 
                  stroke-width="2" 
                  filter="drop-shadow(0 3px 6px rgba(0,0,0,0.2))"/>
            
            <!-- Property type icon -->
            <text x="25" y="28" 
                  font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
                  font-size="16" 
                  fill="${textColor}" 
                  text-anchor="middle">${getPropertyIcon()}</text>
            
            <!-- Price text -->
            <text x="62" y="25" 
                  font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
                  font-size="11" 
                  font-weight="600" 
                  fill="${textColor}" 
                  text-anchor="middle">${formattedPrice}</text>
            
            <!-- AI Score badge if available -->
            ${property.aiScore ? `
              <circle cx="85" cy="15" r="8" fill="#10b981" stroke="#ffffff" stroke-width="1"/>
              <text x="85" y="19" 
                    font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
                    font-size="8" 
                    font-weight="600" 
                    fill="#ffffff" 
                    text-anchor="middle">${property.aiScore}</text>
            ` : ''}
            
            <!-- Pointer -->
            <path d="M50 42 L45 50 L55 50 Z" 
                  fill="${backgroundColor}" 
                  stroke="#ffffff" 
                  stroke-width="1"/>
          </g>
        </svg>
      `)}`
    };
  }, []);

  // Clustering options
  const clustererOptions = useMemo(() => ({
    imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
    gridSize: 50,
    maxZoom: 15,
    styles: [
      {
        textColor: 'white',
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="#2563eb" stroke="#ffffff" stroke-width="2"/>
            <circle cx="20" cy="20" r="12" fill="#1d4ed8"/>
          </svg>
        `)}`,
        height: 40,
        width: 40,
        textSize: 12
      }
    ]
  }), []);

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

  // Handle clusterer load
  const onClustererLoad = useCallback((clustererInstance) => {
    setClusterer(clustererInstance);
  }, []);

  // Get user location
  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          if (internalMapRef.current) {
            internalMapRef.current.panTo(location);
            internalMapRef.current.setZoom(12);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  // Create heatmap data from properties
  const heatmapData = useMemo(() => {
    if (!window.google || !validProperties.length) return [];
    
    return validProperties.map(property => ({
      location: new window.google.maps.LatLng(property.lat, property.lng),
      weight: property.price ? Math.min(property.price / 100000, 10) : 1
    }));
  }, [validProperties]);

  // Map type options
  const mapTypes = [
    { id: 'roadmap', name: 'Map', icon: '🗺️' },
    { id: 'satellite', name: 'Satellite', icon: '🛰️' },
    { id: 'hybrid', name: 'Hybrid', icon: '🌐' },
    { id: 'terrain', name: 'Terrain', icon: '⛰️' }
  ];

  // Handle map type change
  const changeMapType = useCallback((newType) => {
    setMapType(newType);
    if (internalMapRef.current) {
      internalMapRef.current.setMapTypeId(newType);
    }
  }, []);

  // Fit bounds to all properties
  const fitBounds = useCallback(() => {
    if (internalMapRef.current && validProperties.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      validProperties.forEach(property => {
        bounds.extend({ lat: property.lat, lng: property.lng });
      });
      internalMapRef.current.fitBounds(bounds);
    }
  }, [validProperties]);

  // Initialize GPS search autocomplete
  useEffect(() => {
    if (isLoaded && gpsSearchInputRef.current && window.google && showGpsSearch) {
      // Wait for DOM to be ready
      setTimeout(() => {
        try {
          const autocomplete = new window.google.maps.places.Autocomplete(gpsSearchInputRef.current, {
            types: ['establishment', 'geocode'],
            componentRestrictions: { country: ['us', 'ca'] },
            fields: ['formatted_address', 'geometry', 'place_id', 'name']
          });

          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.geometry) {
              handleGpsSearch(place);
            }
          });
          
          // Prevent form submission on enter
          gpsSearchInputRef.current.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          });
        } catch (error) {
          console.error('Error initializing autocomplete:', error);
        }
      }, 100); // Small delay to ensure DOM is ready
    }
  }, [isLoaded, showGpsSearch]);

  // Handle GPS search
  const handleGpsSearch = useCallback(async (place) => {
    if (!place.geometry || !window.google) return;

    const destination = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      name: place.name || place.formatted_address,
      address: place.formatted_address
    };

    setSelectedDestination(destination);
    setGpsSearchQuery(destination.name);
    
    // Pan to destination
    if (internalMapRef.current) {
      internalMapRef.current.panTo(destination);
    }

    // Calculate distances to all properties
    calculateDistances(destination);
  }, [validProperties]);

  // Calculate distances from destination to all properties
  const calculateDistances = useCallback((destination) => {
    if (!window.google || !validProperties.length) return;

    const service = new window.google.maps.DistanceMatrixService();
    const origins = validProperties.map(p => ({ lat: p.lat, lng: p.lng }));
    
    service.getDistanceMatrix({
      origins: origins,
      destinations: [destination],
      travelMode: window.google.maps.TravelMode[travelMode],
      unitSystem: window.google.maps.UnitSystem.IMPERIAL,
      avoidHighways: false,
      avoidTolls: false
    }, (response, status) => {
      if (status === 'OK') {
        const distances = {};
        response.rows.forEach((row, index) => {
          const property = validProperties[index];
          if (row.elements[0].status === 'OK') {
            distances[property.id] = {
              distance: row.elements[0].distance.text,
              duration: row.elements[0].duration.text,
              durationValue: row.elements[0].duration.value // seconds
            };
          }
        });
        setDistanceMatrix(distances);
        setShowDistances(true);
      } else {
        console.error('Distance Matrix request failed:', status);
      }
    });
  }, [validProperties, travelMode]);

  // Clear GPS search
  const clearGpsSearch = useCallback(() => {
    setSelectedDestination(null);
    setGpsSearchQuery('');
    setDistanceMatrix({});
    setShowDistances(false);
    setDirectionsResponse(null);
  }, []);

  // Get directions to selected property
  const getDirections = useCallback((property) => {
    if (!selectedDestination || !window.google) return;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route({
      origin: selectedDestination,
      destination: { lat: property.lat, lng: property.lng },
      travelMode: window.google.maps.TravelMode[travelMode]
    }, (result, status) => {
      if (status === 'OK') {
        setDirectionsResponse(result);
      } else {
        console.error('Directions request failed:', status);
      }
    });
  }, [selectedDestination, travelMode]);

  // Travel mode options
  const travelModes = [
    { id: 'DRIVING', name: 'Drive', icon: '🚗' },
    { id: 'TRANSIT', name: 'Transit', icon: '🚌' },
    { id: 'WALKING', name: 'Walk', icon: '🚶' },
    { id: 'BICYCLING', name: 'Bike', icon: '🚲' }
  ];

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
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600 mb-4">Loading enhanced map...</div>
          
          {/* Detailed loading info */}
          <div className="text-xs text-gray-500 space-y-1 bg-white rounded-lg p-3 border border-gray-200">
            <p><strong>Debug Info:</strong></p>
            <p>API Key: {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? '✅ Present' : '❌ Missing'}</p>
            <p>Libraries: {libraries.join(', ')}</p>
            <p>Status: {loadError ? '❌ Error' : '⏳ Loading...'}</p>
            {loadError && <p className="text-red-600">Error: {loadError.message}</p>}
          </div>
          
          <div className="mt-4 text-xs text-gray-500">
            <p>If loading takes too long, check:</p>
            <p>1. Your Google Maps API key is valid</p>
            <p>2. Required APIs are enabled in Google Cloud Console</p>
            <p>3. Network connection is working</p>
          </div>
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
        {/* Property Markers */}
        {validProperties.map((property) => {
          const isSelected = selectedProperty?.id === property.id;
          const isHovered = hoveredProperty?.id === property.id;
          const propertyMarker = createPropertyMarker(property, isSelected, isHovered);

          return (
            <MarkerF
              key={property.id || property.lat + ',' + property.lng}
              position={{ lat: property.lat, lng: property.lng }}
              title={`${property.title || property.address || 'Property'} - $${property.price?.toLocaleString() || 'N/A'}`}
              onMouseOver={() => setHoveredProperty(property)}
              onMouseOut={() => setHoveredProperty(null)}
              onClick={() => handleMarkerClick(property)}
              icon={{
                ...propertyMarker,
                scaledSize: new window.google.maps.Size(100, 46),
                anchor: new window.google.maps.Point(50, 46)
              }}
              zIndex={isSelected ? 1000 : isHovered ? 500 : 1}
            />
          );
        })}

        {/* User Location Marker */}
        {userLocation && (
          <MarkerF
            position={userLocation}
            icon={{
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="8" fill="#2563eb" stroke="#ffffff" stroke-width="3"/>
                  <circle cx="12" cy="12" r="3" fill="#ffffff"/>
                </svg>
              `)}`,
              scaledSize: new window.google.maps.Size(24, 24),
              anchor: new window.google.maps.Point(12, 12)
            }}
            title="Your Location"
          />
        )}

        {/* Traffic Layer */}
        {showTraffic && <TrafficLayer />}
        
        {/* Transit Layer */}
        {showTransit && <TransitLayer />}
        
        {/* Heatmap Layer */}
        {showHeatmap && heatmapData.length > 0 && (
          <HeatmapLayer
            data={heatmapData}
            options={{
              radius: 50,
              opacity: 0.6,
              gradient: [
                'rgba(0, 255, 255, 0)',
                'rgba(0, 255, 255, 1)',
                'rgba(0, 191, 255, 1)',
                'rgba(0, 127, 255, 1)',
                'rgba(0, 63, 255, 1)',
                'rgba(0, 0, 255, 1)',
                'rgba(0, 0, 223, 1)',
                'rgba(0, 0, 191, 1)',
                'rgba(0, 0, 159, 1)',
                'rgba(0, 0, 127, 1)',
                'rgba(63, 0, 91, 1)',
                'rgba(127, 0, 63, 1)',
                'rgba(191, 0, 31, 1)',
                'rgba(255, 0, 0, 1)'
              ]
            }}
          />
        )}

        {/* Destination Marker */}
        {selectedDestination && (
          <MarkerF
            position={selectedDestination}
            icon={{
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="12" fill="#dc2626" stroke="#ffffff" stroke-width="3"/>
                  <text x="16" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" fill="#ffffff" text-anchor="middle">📍</text>
                </svg>
              `)}`,
              scaledSize: new window.google.maps.Size(32, 32),
              anchor: new window.google.maps.Point(16, 16)
            }}
            title={selectedDestination.name}
          />
        )}

        {/* Directions Renderer */}
        {directionsResponse && (
          <DirectionsRenderer
            directions={directionsResponse}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#2563eb',
                strokeWeight: 4,
                strokeOpacity: 0.8
              }
            }}
          />
        )}

        {/* Enhanced Info Window */}
        {infoWindowProperty && showInfoWindow && (
          <InfoWindow
            position={{ lat: infoWindowProperty.lat, lng: infoWindowProperty.lng }}
            onCloseClick={() => setInfoWindowProperty(null)}
            options={{
              pixelOffset: new window.google.maps.Size(0, -20)
            }}
          >
            <div className="p-4 max-w-sm">
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
              
              <div className="flex items-center text-gray-600 text-sm mb-3">
                <FiMapPin className="w-4 h-4 mr-1" />
                <span className="line-clamp-1">
                  {infoWindowProperty.address || infoWindowProperty.location || 'Address not available'}
                </span>
              </div>
              
              {/* Distance Info if Available */}
              {selectedDestination && distanceMatrix[infoWindowProperty.id] && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FiArrowRight className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-blue-800">
                        {distanceMatrix[infoWindowProperty.id].distance}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FiClock className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-blue-800">
                        {distanceMatrix[infoWindowProperty.id].duration}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => getDirections(infoWindowProperty)}
                    className="w-full mt-2 p-2 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition-colors"
                  >
                    🗺️ Get Directions
                  </button>
                </div>
              )}
              
              {/* Price and ROI */}
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
                
                {infoWindowProperty.aiScore && (
                  <div className="text-sm bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                    {infoWindowProperty.aiScore}% AI Match
                  </div>
                )}
              </div>
              
              {/* Property Specs */}
              {(infoWindowProperty.beds || infoWindowProperty.baths || infoWindowProperty.sqft) && (
                <div className="flex items-center text-sm text-gray-600 mb-3 space-x-4">
                  {infoWindowProperty.beds && (
                    <div className="flex items-center">
                      <span className="mr-1">🛏️</span>
                      <span>{infoWindowProperty.beds} bed{infoWindowProperty.beds !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {infoWindowProperty.baths && (
                    <div className="flex items-center">
                      <span className="mr-1">🛁</span>
                      <span>{infoWindowProperty.baths} bath{infoWindowProperty.baths !== 1 ? 's' : ''}</span>
                    </div>
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
                View Full Details
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      
      {/* Enhanced Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
        {/* Control Toggle Button */}
        <button
          onClick={() => setShowControls(!showControls)}
          className={`p-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all border ${
            showControls ? 'bg-blue-50 border-blue-300' : 'border-gray-200'
          }`}
          title="Map Controls"
        >
          <FiLayers className={`w-5 h-5 ${showControls ? 'text-blue-600' : 'text-gray-700'}`} />
        </button>

        {/* Enhanced Control Panel */}
        {showControls && (
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-72 max-h-96 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <FiMap className="w-4 h-4 mr-2" />
              Map Controls
            </h3>
            
            {/* Map Type Selection */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Map Style</h4>
              <div className="grid grid-cols-2 gap-2">
                {mapTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => changeMapType(type.id)}
                    className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                      mapType === type.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                        : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <span>{type.icon}</span>
                      <span>{type.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Map Layers */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Map Layers</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showTraffic}
                    onChange={(e) => setShowTraffic(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">🚦 Traffic Layer</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showTransit}
                    onChange={(e) => setShowTransit(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">🚇 Transit Layer</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showHeatmap}
                    onChange={(e) => setShowHeatmap(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">🔥 Price Heatmap</span>
                </label>
              </div>
            </div>
            
            {/* Navigation Tools */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Navigation</h4>
              <div className="space-y-2">
                <button
                  onClick={getUserLocation}
                  className="w-full p-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center"
                >
                  <FiNavigation className="w-4 h-4 mr-2" />
                  Find My Location
                </button>
                
                <button
                  onClick={fitBounds}
                  className="w-full p-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center"
                  disabled={validProperties.length === 0}
                >
                  <FiMapPin className="w-4 h-4 mr-2" />
                  View All Properties
                </button>
              </div>
            </div>
            
            {/* Map Statistics */}
            <div className="border-t border-gray-200 pt-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Map Statistics</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Properties:</span>
                  <span className="font-medium">{validProperties.length}</span>
                </div>
                {validProperties.length > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span>Avg Price:</span>
                      <span className="font-medium">
                        ${Math.round(validProperties.reduce((sum, p) => sum + (p.price || 0), 0) / validProperties.length).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price Range:</span>
                      <span className="font-medium">
                        ${Math.min(...validProperties.map(p => p.price || 0)).toLocaleString()} - 
                        ${Math.max(...validProperties.map(p => p.price || 0)).toLocaleString()}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Property Count Badge */}
      <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-xl shadow-lg text-sm font-semibold text-gray-700 z-10 border border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <span className="text-blue-600">📍</span>
            <span>{validProperties.length}</span>
            <span className="text-gray-500">{validProperties.length === 1 ? 'Property' : 'Properties'}</span>
          </div>
          {enableClustering && validProperties.length > 5 && (
            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              Clustered
            </span>
          )}
          {showHeatmap && (
            <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
              🔥 Heatmap
            </span>
          )}
        </div>
      </div>

      {/* GPS Search Bar */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col space-y-2">
        {/* GPS Search Toggle Button */}
        <button
          onClick={() => setShowGpsSearch(!showGpsSearch)}
          className={`p-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all border self-end ${
            showGpsSearch ? 'bg-red-50 border-red-300' : 'border-gray-200'
          }`}
          title="GPS Distance Calculator"
        >
          <FiNavigation className={`w-5 h-5 ${showGpsSearch ? 'text-red-600' : 'text-gray-700'}`} />
        </button>

        {/* GPS Search Panel */}
        {showGpsSearch && (
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-80">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 flex items-center">
                📍 GPS Distance Calculator
              </h3>
              <button
                onClick={() => setShowGpsSearch(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
            
            {/* Address Search Input */}
            <div className="mb-3">
              <div className="relative">
                <input
                  ref={gpsSearchInputRef}
                  type="text"
                  placeholder="Enter workplace, school, or any address..."
                  value={gpsSearchQuery}
                  onChange={(e) => {
                    setGpsSearchQuery(e.target.value);
                    e.stopPropagation();
                  }}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                  onFocus={(e) => {
                    e.stopPropagation();
                  }}
                  onInput={(e) => {
                    e.stopPropagation();
                  }}
                  autoComplete="off"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                {selectedDestination && (
                  <button
                    onClick={clearGpsSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Travel Mode Selection */}
            {selectedDestination && (
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Travel Mode</h4>
                <div className="grid grid-cols-4 gap-1">
                  {travelModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => {
                        setTravelMode(mode.id);
                        calculateDistances(selectedDestination);
                      }}
                      className={`p-2 rounded text-xs font-medium transition-colors ${
                        travelMode === mode.id
                          ? 'bg-blue-100 text-blue-700 border border-blue-300'
                          : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-1">
                        <span className="text-sm">{mode.icon}</span>
                        <span>{mode.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Current Destination */}
            {selectedDestination && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800">{selectedDestination.name}</p>
                    <p className="text-xs text-red-600">{selectedDestination.address}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Instructions */}
            <div className="text-xs text-gray-600">
              <p className="mb-1">💡 <strong>How it works:</strong></p>
              <p>1. Enter your workplace or any address above</p>
              <p>2. See distance & travel time to all properties</p>
              <p>3. Click property markers for directions</p>
            </div>
          </div>
        )}
      </div>

      {/* Price Legend for Map */}
      {validProperties.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg border border-gray-200 z-10">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Price Legend</h4>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs text-gray-600">$1M+</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-xs text-gray-600">$500K - $1M</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-600">$200K - $500K</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              <span className="text-xs text-gray-600">Under $200K</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedPropertyMap;
