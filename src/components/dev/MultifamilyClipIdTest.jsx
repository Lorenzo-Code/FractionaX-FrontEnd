import React, { useState } from 'react';
import { FiPlay, FiCheckCircle, FiXCircle, FiAlertTriangle } from 'react-icons/fi';

/**
 * Multifamily API CLIP ID Test Component
 * 
 * Quick test to check if the multifamily discovery API is providing CLIP IDs
 * Use this during development to verify backend integration progress
 */
const MultifamilyClipIdTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const testMultifamilyApi = async () => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      console.log('🧪 Testing multifamily discovery API for CLIP IDs...');
      
      const response = await fetch('/api/properties/multifamily-discovery/search');
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.properties) {
        throw new Error('Invalid API response format');
      }

      const properties = data.properties;
      const propertiesWithClipId = properties.filter(p => p.coreLogicClipId || p.clipId);
      const propertiesWithoutClipId = properties.filter(p => !(p.coreLogicClipId || p.clipId));
      
      const coverage = properties.length > 0 ? (propertiesWithClipId.length / properties.length) * 100 : 0;
      
      const testResults = {
        totalProperties: properties.length,
        withClipId: propertiesWithClipId.length,
        withoutClipId: propertiesWithoutClipId.length,
        coverage: coverage,
        status: coverage === 100 ? 'complete' : coverage > 0 ? 'partial' : 'missing',
        sampleProperties: properties.slice(0, 5).map(p => ({
          id: p.id,
          zpid: p.zpid,
          address: p.address,
          coreLogicClipId: p.coreLogicClipId,
          clipId: p.clipId,
          hasClipId: Boolean(p.coreLogicClipId || p.clipId)
        })),
        propertiesWithoutClipId: propertiesWithoutClipId.slice(0, 3).map(p => ({
          id: p.id,
          zpid: p.zpid,
          address: p.address
        }))
      };
      
      console.log('✅ Multifamily API Test Results:', testResults);
      setResults(testResults);
      
    } catch (err) {
      console.error('❌ Multifamily API Test Failed:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (!results) return null;
    
    switch (results.status) {
      case 'complete':
        return <FiCheckCircle className="w-6 h-6 text-green-500" />;
      case 'partial':
        return <FiAlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'missing':
        return <FiXCircle className="w-6 h-6 text-red-500" />;
      default:
        return <FiAlertTriangle className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusMessage = () => {
    if (!results) return '';
    
    switch (results.status) {
      case 'complete':
        return '🎉 Perfect! All properties have CLIP IDs from backend';
      case 'partial':
        return `⚠️ Partial Integration: ${results.coverage.toFixed(1)}% of properties have CLIP IDs`;
      case 'missing':
        return '❌ Backend Issue: No properties have CLIP IDs - Backend needs CLIP ID integration';
      default:
        return 'Unknown status';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Multifamily API CLIP ID Test</h2>
          <p className="text-gray-600 text-sm">
            Check if the multifamily discovery API is providing CoreLogic CLIP IDs
          </p>
        </div>
        
        <button
          onClick={testMultifamilyApi}
          disabled={isLoading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FiPlay className={`w-4 h-4 mr-2 ${isLoading ? 'animate-pulse' : ''}`} />
          {isLoading ? 'Testing...' : 'Run Test'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <FiXCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="font-medium text-red-800">Test Failed</span>
          </div>
          <p className="text-red-700 text-sm mt-1">{error}</p>
        </div>
      )}

      {results && (
        <div className="space-y-6">
          {/* Overall Status */}
          <div className={`p-4 rounded-lg border ${
            results.status === 'complete' ? 'bg-green-50 border-green-200' :
            results.status === 'partial' ? 'bg-yellow-50 border-yellow-200' :
            'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center mb-2">
              {getStatusIcon()}
              <span className={`font-semibold ml-2 ${
                results.status === 'complete' ? 'text-green-800' :
                results.status === 'partial' ? 'text-yellow-800' :
                'text-red-800'
              }`}>
                {getStatusMessage()}
              </span>
            </div>
            
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-700">Total Properties</div>
                <div className="text-2xl font-bold">{results.totalProperties}</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">With CLIP ID</div>
                <div className="text-2xl font-bold text-green-600">{results.withClipId}</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Without CLIP ID</div>
                <div className="text-2xl font-bold text-red-600">{results.withoutClipId}</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Coverage</div>
                <div className="text-2xl font-bold">{results.coverage.toFixed(1)}%</div>
              </div>
            </div>
          </div>

          {/* Sample Properties */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Sample Properties (First 5)</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property ID
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Zillow ID
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CLIP ID
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.sampleProperties.map((property, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm text-gray-900 font-mono">
                        {property.id || 'N/A'}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 font-mono">
                        {property.zpid || 'N/A'}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 font-mono">
                        {property.coreLogicClipId || property.clipId || (
                          <span className="text-red-500">Missing</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 truncate max-w-xs">
                        {property.address || 'N/A'}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {property.hasClipId ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✅ Has CLIP ID
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            ❌ Missing
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Properties Without CLIP IDs */}
          {results.propertiesWithoutClipId.length > 0 && (
            <div>
              <h3 className="font-semibold text-red-800 mb-3">
                Properties Missing CLIP IDs (First 3)
              </h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm mb-3">
                  These properties need CLIP IDs from the backend. The backend team should implement 
                  CLIP ID lookup for these properties before sending them to the frontend.
                </p>
                <div className="space-y-2">
                  {results.propertiesWithoutClipId.map((property, index) => (
                    <div key={index} className="text-sm text-red-800 font-mono bg-red-100 p-2 rounded">
                      ID: {property.id}, Zillow: {property.zpid}, Address: {property.address}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Recommendations</h3>
            {results.status === 'complete' ? (
              <p className="text-blue-800 text-sm">
                ✅ Perfect! The backend is providing CLIP IDs for all properties. 
                Frontend navigation will work correctly with CLIP ID-based URLs.
              </p>
            ) : (
              <ul className="text-blue-800 text-sm space-y-1 list-disc list-inside">
                <li>Backend needs to implement CoreLogic CLIP ID service</li>
                <li>Add CLIP ID lookup to multifamily discovery API</li>
                <li>Ensure 100% CLIP ID coverage before sending data to frontend</li>
                <li>Test with the complete property dataset</li>
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultifamilyClipIdTest;