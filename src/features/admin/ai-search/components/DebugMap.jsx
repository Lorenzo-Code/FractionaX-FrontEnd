import React, { useState, useRef } from 'react';
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';

const libraries = ['places'];

const DebugMap = ({ properties = [], center = { lat: 29.7604, lng: -95.3698 }, zoom = 10 }) => {
  const [debugInfo, setDebugInfo] = useState('Initializing...');
  const mapRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const containerStyle = {
    width: '100%',
    height: '100vh'
  };

  const mapOptions = {
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    zoomControl: true,
  };

  const onMapLoad = (map) => {
    mapRef.current = map;
    setDebugInfo(`Map loaded successfully! Center: ${center.lat}, ${center.lng}`);
    console.log('🗺️ Debug Map Loaded:', { center, zoom, properties });
  };

  // Debug info panel
  const debugPanel = (
    <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-10 max-w-xs">
      <h3 className="font-bold text-sm mb-2">🐛 Map Debug</h3>
      <div className="text-xs space-y-1">
        <p><strong>API Key:</strong> {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? '✅ Set' : '❌ Missing'}</p>
        <p><strong>Load Status:</strong> {isLoaded ? '✅ Loaded' : loadError ? '❌ Error' : '⏳ Loading'}</p>
        <p><strong>Properties:</strong> {properties.length}</p>
        <p><strong>Center:</strong> {center.lat.toFixed(4)}, {center.lng.toFixed(4)}</p>
        <p><strong>Zoom:</strong> {zoom}</p>
        {loadError && (
          <div className="text-red-600 text-xs mt-2">
            <p><strong>Error:</strong></p>
            <p>{loadError.message}</p>
          </div>
        )}
        {properties.length > 0 && (
          <div className="mt-2">
            <p><strong>Property Data:</strong></p>
            {properties.map((prop, i) => (
              <div key={i} className="text-xs bg-gray-100 p-1 rounded mt-1">
                <p>Lat: {prop.lat || 'N/A'}</p>
                <p>Lng: {prop.lng || 'N/A'}</p>
                <p>Address: {prop.address?.substring(0, 30)}...</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (loadError) {
    return (
      <div className="w-full h-full bg-red-50 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="text-red-600 text-6xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-red-800 mb-2">Google Maps Failed to Load</h2>
          <p className="text-red-600 mb-4">Error: {loadError.message}</p>
          <div className="text-sm text-gray-600">
            <p>Check:</p>
            <ul className="list-disc list-inside mt-2">
              <li>API Key is valid</li>
              <li>Maps JavaScript API is enabled</li>
              <li>Internet connection</li>
              <li>Console for detailed errors</li>
            </ul>
          </div>
        </div>
        {debugPanel}
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-blue-50 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold text-blue-800">Loading Google Maps...</h2>
          <p className="text-blue-600 text-sm mt-2">This may take a few seconds</p>
        </div>
        {debugPanel}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {debugPanel}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onLoad={onMapLoad}
        options={mapOptions}
      >
        {/* Simple red markers for properties with coordinates */}
        {properties.map((property, index) => {
          if (property.lat && property.lng) {
            return (
              <MarkerF
                key={property.id || index}
                position={{ lat: property.lat, lng: property.lng }}
                title={property.address || 'Property'}
                onClick={() => {
                  console.log('Marker clicked:', property);
                  alert(`Property: ${property.address}\nLat: ${property.lat}\nLng: ${property.lng}`);
                }}
              />
            );
          }
          return null;
        })}
      </GoogleMap>
    </div>
  );
};

export default DebugMap;
