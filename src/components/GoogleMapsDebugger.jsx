import React from 'react';
import { useLoadScript } from '@react-google-maps/api';

const GoogleMapsDebugger = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  console.log('🔍 Debug Info:');
  console.log('API Key:', import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'Present' : 'Missing');
  console.log('isLoaded:', isLoaded);
  console.log('loadError:', loadError);

  if (loadError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold">Google Maps Load Error</h3>
        <p className="text-red-600 mt-2">Error: {loadError.message}</p>
        <div className="mt-4 text-sm">
          <h4 className="font-semibold">Common fixes:</h4>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Check if your API key is valid</li>
            <li>Enable Maps JavaScript API in Google Cloud Console</li>
            <li>Enable Places API in Google Cloud Console</li>
            <li>Check API key restrictions (HTTP referrers)</li>
            <li>Verify billing is enabled</li>
          </ul>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-yellow-800 font-semibold">Loading Google Maps...</h3>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600 mt-2"></div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <h3 className="text-green-800 font-semibold">✅ Google Maps Loaded Successfully!</h3>
      <div className="mt-2 text-sm text-green-700">
        <p>API Key: {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? '✅ Present' : '❌ Missing'}</p>
        <p>Libraries: Places API ✅</p>
        <p>Status: Ready to use</p>
      </div>
    </div>
  );
};

export default GoogleMapsDebugger;
