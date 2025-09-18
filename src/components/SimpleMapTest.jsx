import React from 'react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';

const libraries = ['places'];

const SimpleMapTest = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  console.log('🗺️ SimpleMapTest - Loading state:', { 
    isLoaded, 
    loadError: loadError?.message,
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.substring(0, 10) + '...'
  });

  if (loadError) {
    return (
      <div className="w-full h-96 bg-red-100 border border-red-400 rounded p-4 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-red-800 font-bold mb-2">Map Load Error</h3>
          <p className="text-red-600">{loadError.message}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-96 bg-gray-100 border rounded p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Simple Map Test...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-96 border rounded overflow-hidden">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={{ lat: 29.7604, lng: -95.3698 }}
        zoom={10}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        <MarkerF
          position={{ lat: 29.7604, lng: -95.3698 }}
          title="Test Marker - Houston"
        />
      </GoogleMap>
    </div>
  );
};

export default SimpleMapTest;
