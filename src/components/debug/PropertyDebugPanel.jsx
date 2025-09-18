import React, { useState, useEffect } from 'react';

/**
 * PropertyDebugPanel - Debug component to diagnose pricing and image issues
 * 
 * Add this component to any page that shows properties to debug the data flow
 */
const PropertyDebugPanel = ({ properties = [], title = "Property Debug Panel" }) => {
  const [rawApiData, setRawApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedProperty, setExpandedProperty] = useState(null);

  // Test the raw API directly
  const testRawAPI = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Debug: Testing raw API...');
      const response = await fetch('/api/properties/multifamily-discovery/search');
      const data = await response.json();
      
      console.log('🔍 Debug: Raw API Response:', data);
      setRawApiData(data);
      
      if (data.properties && data.properties.length > 0) {
        console.log('🔍 Debug: First property pricing:', data.properties[0].pricing);
        console.log('🔍 Debug: First property media:', data.properties[0].media);
      }
    } catch (err) {
      console.error('🔍 Debug: API Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Compare raw API data with transformed properties
  const compareData = () => {
    if (!rawApiData?.properties || !properties.length) return null;

    const rawProperty = rawApiData.properties[0];
    const transformedProperty = properties[0];

    return {
      raw: {
        pricing: rawProperty.pricing,
        media: rawProperty.media,
        id: rawProperty.id,
        address: rawProperty.address
      },
      transformed: {
        price: transformedProperty.price,
        images: transformedProperty.images,
        id: transformedProperty.id,
        address: transformedProperty.address
      }
    };
  };

  const comparison = compareData();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Debug Button */}
      <button
        onClick={() => setExpandedProperty(expandedProperty === 'debug' ? null : 'debug')}
        className="bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors mb-2"
        title="Property Debug Panel"
      >
        🐛 Debug
      </button>

      {/* Debug Panel */}
      {expandedProperty === 'debug' && (
        <div className="bg-white border-2 border-red-500 rounded-lg shadow-xl p-4 w-96 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-red-600">{title}</h3>
            <button
              onClick={() => setExpandedProperty(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Test Raw API */}
          <div className="mb-4">
            <button
              onClick={testRawAPI}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-3 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Testing API...' : 'Test Raw API'}
            </button>
            
            {error && (
              <div className="mt-2 p-2 bg-red-100 text-red-800 text-sm rounded">
                Error: {error}
              </div>
            )}
          </div>

          {/* Properties Count */}
          <div className="mb-3 p-2 bg-gray-100 rounded text-sm">
            <div>📊 Properties from props: <strong>{properties.length}</strong></div>
            <div>🔌 Properties from API: <strong>{rawApiData?.properties?.length || 0}</strong></div>
          </div>

          {/* Data Comparison */}
          {comparison && (
            <div className="mb-3">
              <h4 className="font-semibold text-sm mb-2">🔄 Data Flow Check:</h4>
              <div className="space-y-2 text-xs">
                {/* Pricing Check */}
                <div className="p-2 bg-gray-50 rounded">
                  <div className="font-medium">💰 Pricing:</div>
                  <div>Raw: ${comparison.raw.pricing?.listPrice?.toLocaleString() || 'N/A'}</div>
                  <div>Transformed: ${comparison.transformed.price?.toLocaleString() || 'N/A'}</div>
                  <div className={`font-semibold ${
                    comparison.raw.pricing?.listPrice === comparison.transformed.price 
                      ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {comparison.raw.pricing?.listPrice === comparison.transformed.price 
                      ? '✅ Match' : '❌ Mismatch'}
                  </div>
                </div>

                {/* Images Check */}
                <div className="p-2 bg-gray-50 rounded">
                  <div className="font-medium">📸 Images:</div>
                  <div>Raw: {comparison.raw.media?.images?.length || 0} images</div>
                  <div>Transformed: {comparison.transformed.images?.length || 0} images</div>
                  <div className={`font-semibold ${
                    comparison.raw.media?.images?.length === comparison.transformed.images?.length 
                      ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {comparison.raw.media?.images?.length === comparison.transformed.images?.length 
                      ? '✅ Match' : '❌ Mismatch'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sample Property Details */}
          {properties.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2">🏠 First Property Check:</h4>
              <div className="text-xs space-y-1">
                <div>ID: {properties[0].id}</div>
                <div>Price: ${properties[0].price?.toLocaleString() || 'Missing'}</div>
                <div>Images: {properties[0].images?.length || 0}</div>
                <div>Title: {properties[0].title}</div>
                
                {properties[0].images?.length > 0 && (
                  <div className="mt-2">
                    <div className="font-medium">First Image URL:</div>
                    <div className="break-all bg-gray-100 p-1 rounded text-xs">
                      {properties[0].images[0]?.substring(0, 60)}...
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyDebugPanel;