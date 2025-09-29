import React from 'react';
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';

const libraries = ['places'];

const MapTest = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  console.log('🗺️ Map Test - API Key:', import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'Present' : 'Missing');
  console.log('🗺️ Map Test - Is Loaded:', isLoaded);
  console.log('🗺️ Map Test - Load Error:', loadError);

  if (loadError) {
    return (
      <div className="w-full h-64 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center">
        <div className="text-center p-6">
          <div className="text-red-600 text-xl mb-2">⚠️</div>
          <div className="text-red-800 font-semibold mb-2">Map Test Failed</div>
          <div className="text-red-600 text-sm mb-4">
            {loadError.message}
          </div>
          <div className="text-xs text-red-500">
            API Key Status: {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? '✅ Present' : '❌ Missing'}
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <div className="text-gray-600">Loading Map Test...</div>
          <div className="text-xs text-gray-500 mt-2">
            API Key: {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? '✅ Present' : '❌ Missing'}
          </div>
        </div>
      </div>
    );
  }

  const houstonCenter = { lat: 29.7604, lng: -95.3698 };

  return (
    <div className="w-full">
      <div className="mb-2 text-sm text-gray-600">
        🗺️ Map Test - Houston Center: {houstonCenter.lat}, {houstonCenter.lng}
      </div>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '400px' }}
        center={houstonCenter}
        zoom={12}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        }}
      >
        <MarkerF
          position={houstonCenter}
          title="Houston Test Marker"
        />
      </GoogleMap>
    </div>
  );
};

export default MapTest;