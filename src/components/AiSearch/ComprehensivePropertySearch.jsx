import React, { useState } from 'react';
import { smartFetch } from '@/utils/apiClient';

const ComprehensivePropertySearch = ({ onResults }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleComprehensiveSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError('');
      console.log('🔍 Starting comprehensive search for:', searchQuery);

      // Create AbortController for timeout control
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 180000); // 3 minute timeout

      const response = await smartFetch('/api/ai/comprehensive', {
        method: 'POST',
        signal: controller.signal,
        body: JSON.stringify({
          prompt: searchQuery,
          includeClimateRisk: true,
          includePropensity: true
        })
      });

      clearTimeout(timeoutId);

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('❌ API Error Response:', errorData);
        
        if (response.status === 404 && errorData?.error === 'Property not found') {
          throw new Error(`Property not found: ${errorData.details || 'The address could not be found in our database.'}`);
        }
        
        throw new Error(`API Error (${response.status}): ${errorData?.details || response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Comprehensive Search Response:', data);
      console.log('📊 Response size:', JSON.stringify(data).length, 'characters');
      
      if (onResults) {
        onResults(data);
      }

    } catch (err) {
      console.error('❌ Comprehensive search error:', err);
      
      if (err.name === 'AbortError') {
        setError('Request timed out. The comprehensive analysis is taking longer than expected. Please try again.');
      } else if (err.message?.includes('Property not found')) {
        setError(err.message);
      } else {
        setError(err.message || 'Search failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleComprehensiveSearch();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center mb-3">
        <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
        <h3 className="text-sm font-medium text-gray-900">🔍 Comprehensive Property Analysis</h3>
      </div>
      
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter a specific property address for detailed analysis..."
          className="w-full pl-4 pr-32 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
          disabled={loading}
        />
        <button
          onClick={() => handleComprehensiveSearch()}
          disabled={!query.trim() || loading}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition text-sm font-medium disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
              Analyzing
            </div>
          ) : (
            'Analyze'
          )}
        </button>
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500">
        <p>💡 Example: "1600 Smith Street, Houston, TX" - Get comprehensive property intelligence including comparables, market trends, and risk analysis</p>
      </div>
    </div>
  );
};

export default ComprehensivePropertySearch;
