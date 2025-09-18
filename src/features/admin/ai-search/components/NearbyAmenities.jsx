import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MarkerF } from '@react-google-maps/api';

// Define amenity types that impact property values
const AMENITY_TYPES = {
  schools: {
    types: ['school', 'university'],
    icon: '🏫',
    color: '#2563eb',
    name: 'Schools & Education',
    impact: 'high'
  },
  parks: {
    types: ['park'],
    icon: '🌳',
    color: '#059669',
    name: 'Parks & Recreation',
    impact: 'high'
  },
  healthcare: {
    types: ['hospital', 'doctor', 'pharmacy'],
    icon: '🏥',
    color: '#dc2626',
    name: 'Healthcare',
    impact: 'medium'
  },
  transit: {
    types: ['transit_station', 'subway_station', 'bus_station'],
    icon: '🚇',
    color: '#7c3aed',
    name: 'Public Transit',
    impact: 'high'
  },
  shopping: {
    types: ['supermarket', 'grocery_or_supermarket', 'shopping_mall'],
    icon: '🛒',
    color: '#ea580c',
    name: 'Shopping',
    impact: 'medium'
  },
  dining: {
    types: ['restaurant', 'cafe'],
    icon: '🍴',
    color: '#be123c',
    name: 'Dining',
    impact: 'low'
  },
  safety: {
    types: ['police', 'fire_station'],
    icon: '🚓',
    color: '#1f2937',
    name: 'Safety Services',
    impact: 'high'
  },
  fitness: {
    types: ['gym', 'spa'],
    icon: '💪',
    color: '#0891b2',
    name: 'Fitness & Wellness',
    impact: 'low'
  }
};

const NearbyAmenities = ({ 
  map, 
  selectedProperty, 
  enabled = true,
  radius = 1609, // 1 mile in meters
  onAmenityFound,
  activeTypes: externalActiveTypes,
  onLoadingChange
}) => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [internalActiveTypes, setInternalActiveTypes] = useState(
    Object.keys(AMENITY_TYPES).reduce((acc, key) => ({ ...acc, [key]: true }), {})
  );

  // Use external active types if provided, otherwise use internal state
  const activeTypes = externalActiveTypes || internalActiveTypes;

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }, []);

  // Search for nearby amenities using Google Places API
  const searchNearbyAmenities = useCallback(async (property) => {
    if (!map || !window.google?.maps || !property.lat || !property.lng) {
      console.warn('⚠️ Cannot search amenities: missing map, Google Maps API, or coordinates');
      return;
    }

    setLoading(true);
    console.log('🔍 Searching for amenities near:', property.address);

    const service = new window.google.maps.places.PlacesService(map);
    const location = new window.google.maps.LatLng(property.lat, property.lng);
    
    const allAmenities = [];

    try {
      // Search for each amenity type
      const searchPromises = Object.entries(AMENITY_TYPES).map(([category, config]) => {
        return new Promise((resolve) => {
          // Search for each place type in the category
          const typePromises = config.types.map(type => {
            return new Promise((resolveType) => {
              const request = {
                location,
                radius,
                type,
                keyword: type === 'grocery_or_supermarket' ? 'grocery store' : undefined
              };

              service.nearbySearch(request, (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                  const processedResults = results.slice(0, 5).map(place => ({
                    ...place,
                    category,
                    categoryConfig: config,
                    distance: calculateDistance(
                      property.lat, property.lng,
                      place.geometry.location.lat(), place.geometry.location.lng()
                    )
                  }));
                  resolveType(processedResults);
                } else {
                  console.warn(`⚠️ Places search failed for ${type}:`, status);
                  resolveType([]);
                }
              });
            });
          });

          Promise.all(typePromises).then(results => {
            const flatResults = results.flat();
            // Remove duplicates by place_id
            const uniqueResults = flatResults.filter((place, index, arr) => 
              arr.findIndex(p => p.place_id === place.place_id) === index
            );
            resolve(uniqueResults);
          });
        });
      });

      const categoryResults = await Promise.all(searchPromises);
      const flatResults = categoryResults.flat();
      
      // Sort by distance and impact score
      const sortedAmenities = flatResults.sort((a, b) => {
        const impactScore = { high: 3, medium: 2, low: 1 };
        const aScore = impactScore[a.categoryConfig.impact] || 1;
        const bScore = impactScore[b.categoryConfig.impact] || 1;
        
        // Primary sort: impact score (descending)
        // Secondary sort: distance (ascending)
        if (aScore !== bScore) return bScore - aScore;
        return a.distance - b.distance;
      });

      console.log(`✅ Found ${sortedAmenities.length} amenities near property`);
      setAmenities(sortedAmenities);

      if (onAmenityFound) {
        onAmenityFound(sortedAmenities);
      }

    } catch (error) {
      console.error('❌ Error searching for amenities:', error);
    } finally {
      setLoading(false);
    }
  }, [map, radius, onAmenityFound, calculateDistance]);

  // Format distance for display
  const formatDistance = (meters) => {
    const miles = meters * 0.000621371;
    if (miles < 0.1) return `${Math.round(meters)} m`;
    return `${miles.toFixed(1)} mi`;
  };

  // Notify parent about loading state changes
  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(loading);
    }
  }, [loading, onLoadingChange]);

  // Search for amenities when property changes
  useEffect(() => {
    if (enabled && selectedProperty && map) {
      searchNearbyAmenities(selectedProperty);
    } else {
      setAmenities([]);
    }
  }, [enabled, selectedProperty, map, searchNearbyAmenities]);

  // Filter amenities by active types
  const visibleAmenities = useMemo(() => {
    return amenities.filter(amenity => activeTypes[amenity.category]);
  }, [amenities, activeTypes]);

  // Create custom marker icon
  const createMarkerIcon = useCallback((category) => {
    if (!window.google?.maps) return null;
    const config = AMENITY_TYPES[category];
    return {
      path: window.google.maps.SymbolPath.CIRCLE,
      fillColor: config.color,
      fillOpacity: 0.8,
      strokeColor: '#ffffff',
      strokeWeight: 2,
      scale: 8,
    };
  }, []);

  // Always render something, even if empty
  if (!enabled || !selectedProperty) {
    return <></>;
  }

  return (
    <>
      {/* Render amenity markers */}
      {visibleAmenities.map((amenity) => {
        const icon = createMarkerIcon(amenity.category);
        if (!icon) return null;
        
        return (
          <MarkerF
            key={amenity.place_id}
            position={{
              lat: amenity.geometry.location.lat(),
              lng: amenity.geometry.location.lng(),
            }}
            icon={icon}
            title={`${amenity.categoryConfig.icon} ${amenity.name} (${formatDistance(amenity.distance)})`}
            onClick={() => {
              console.log('Amenity clicked:', amenity);
              // You could show amenity details in an info window here
            }}
          />
        );
      })}
    </>
  );
};

export default NearbyAmenities;
