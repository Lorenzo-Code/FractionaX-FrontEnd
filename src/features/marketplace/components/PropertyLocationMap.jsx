import React from 'react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import { FiMapPin } from 'react-icons/fi';

const libraries = ['places'];

const PropertyLocationMap = ({ 
  coordinates, 
  address, 
  title,
  height = '400px' 
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // Debug logging
  console.log('🗺️ PropertyLocationMap - Loading state:', { 
    isLoaded, 
    loadError: loadError?.message,
    coordinates,
    address,
    title,
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'Present' : 'Missing'
  });

  // Default to Houston coordinates if none provided
  const mapCenter = coordinates && coordinates.lat && coordinates.lng 
    ? { lat: parseFloat(coordinates.lat), lng: parseFloat(coordinates.lng) }
    : { lat: 29.7604, lng: -95.3698 }; // Houston default

  if (loadError) {
    console.error('❌ Google Maps load error:', loadError);
    return (
      <div className="w-full bg-red-50 border border-red-200 rounded-lg flex items-center justify-center" style={{ height }}>
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
      <div className="w-full bg-gray-100 rounded-lg flex items-center justify-center" style={{ height }}>
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600 mb-4">Loading property map...</div>
          
          {/* Debug info in loading state */}
          <div className="text-xs text-gray-500 space-y-1 bg-white rounded-lg p-3 border border-gray-200">
            <p><strong>Debug Info:</strong></p>
            <p>API Key: {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? '✅ Present' : '❌ Missing'}</p>
            <p>Coordinates: {coordinates ? `${coordinates.lat}, ${coordinates.lng}` : '❌ Missing'}</p>
            <p>Status: {loadError ? '❌ Error' : '⏳ Loading...'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden border border-gray-200 relative" style={{ height }}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={mapCenter}
        zoom={15}
        options={{
          zoomControl: true,
          streetViewControl: true,
          mapTypeControl: true,
          fullscreenControl: true,
          gestureHandling: "greedy",
        }}
      >
        {/* Property marker */}
        <MarkerF
          position={mapCenter}
          title={`${title || 'Property'} - ${address || 'Location'}`}
          icon={{
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 0 C30 0, 40 8, 40 20 C40 32, 20 50, 20 50 C20 50, 0 32, 0 20 C0 8, 10 0, 20 0 Z" 
                      fill="#2563eb" 
                      stroke="#ffffff" 
                      stroke-width="2" 
                      filter="drop-shadow(0 3px 6px rgba(0,0,0,0.3))"/>
                <circle cx="20" cy="20" r="8" fill="#ffffff"/>
                <text x="20" y="25" 
                      font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
                      font-size="12" 
                      fill="#2563eb" 
                      text-anchor="middle"
                      font-weight="600">🏠</text>
              </svg>
            `)}`,
            scaledSize: new window.google.maps.Size(40, 50),
            anchor: new window.google.maps.Point(20, 50)
          }}
        />
      </GoogleMap>
      
      {/* Map info overlay */}
      <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200 max-w-xs z-10">
        <div className="flex items-start space-x-2">
          <FiMapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <div className="font-medium text-gray-900 line-clamp-1">{title}</div>
            <div className="text-gray-600 text-xs line-clamp-2">{address}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyLocationMap;