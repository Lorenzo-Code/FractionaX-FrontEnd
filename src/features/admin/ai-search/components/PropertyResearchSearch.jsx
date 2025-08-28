import React, { useState } from 'react';
import { smartFetch } from '../../../../shared/utils';

const PropertyResearchSearch = ({ onResults, onError }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [intelligenceLevel, setIntelligenceLevel] = useState('essential');
  const [includeComparables, setIncludeComparables] = useState(false);
  const [includeClimateRisk, setIncludeClimateRisk] = useState(false);
  const [includePropensityScores, setIncludePropensityScores] = useState(true);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      onError?.('Please enter a property address');
      return;
    }
    
    setIsSearching(true);
    
    try {
      console.log('🔍 Starting property research for:', query);
      
      const payload = {
        prompt: query.trim(),
        intelligenceLevel,
        includeComparables,
        includeClimateRisk,
        includePropensityScores,
        includeMortgageAnalysis: false,
        includeZillowEnrichment: false,
        confirmed: false
      };
      
      console.log('📤 Research payload:', payload);
      
      const response = await smartFetch('/api/ai/property-research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Research failed: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📊 Research response:', data);
      
      // Convert single property research result into an array format
      // that the results grid expects
      const researchResults = data.clipId ? [data] : [];
      
      onResults?.(researchResults, `Property research completed for ${data.parsedAddress?.streetAddress || query}. Cost: $${data.totalCost}`);
      
    } catch (error) {
      console.error('❌ Property research error:', error);
      onError?.(error.message || 'Property research failed');
    } finally {
      setIsSearching(false);
    }
  };

  const handleExample = (exampleAddress) => {
    setQuery(exampleAddress);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Property Research</h3>
        <p className="text-sm text-gray-600">
          Get detailed property intelligence from CoreLogic
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Address Input */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Property Address
          </label>
          <input
            id="address"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter property address (e.g., 123 Main St, Houston, TX 77002)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSearching}
          />
        </div>

        {/* Intelligence Level */}
        <div>
          <label htmlFor="intelligence" className="block text-sm font-medium text-gray-700 mb-2">
            Intelligence Level
          </label>
          <select
            id="intelligence"
            value={intelligenceLevel}
            onChange={(e) => setIntelligenceLevel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSearching}
          >
            <option value="basic">Basic ($1.20) - Property details + buildings</option>
            <option value="essential">Essential ($1.82) - Basic + ownership + taxes + rent model</option>
            <option value="comprehensive">Comprehensive (Variable) - All data available</option>
          </select>
        </div>

        {/* Additional Options */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Additional Data (Extra Cost)</h4>
          
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeComparables}
                onChange={(e) => setIncludeComparables(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={isSearching}
              />
              <span className="ml-2 text-sm text-gray-600">
                Include Comparables (+$1.10)
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeClimateRisk}
                onChange={(e) => setIncludeClimateRisk(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={isSearching}
              />
              <span className="ml-2 text-sm text-gray-600">
                Include Climate Risk (+$10.18)
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includePropensityScores}
                onChange={(e) => setIncludePropensityScores(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={isSearching}
              />
              <span className="ml-2 text-sm text-gray-600">
                Include Propensity Scores (+$0.50)
              </span>
            </label>
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          disabled={isSearching || !query.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSearching ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Researching Property...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Start Property Research
            </>
          )}
        </button>
      </form>

      {/* Example Addresses */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Example addresses to try:</p>
        <div className="flex flex-wrap gap-2">
          {[
            '1600 Pennsylvania Avenue NW, Washington, DC 20500',
            '11803 Buchanan Ct, Fredericksburg, VA 22407',
            '123 Main St, Houston, TX 77002'
          ].map((example, idx) => (
            <button
              key={idx}
              onClick={() => handleExample(example)}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-700 transition-colors"
              disabled={isSearching}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Cost Estimate */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center mb-2">
          <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          <span className="text-sm font-semibold text-blue-800">Estimated Cost</span>
        </div>
        <p className="text-sm text-blue-700">
          Base cost: {intelligenceLevel === 'basic' ? '$1.20' : intelligenceLevel === 'essential' ? '$1.82' : 'Variable'}
          {(includeComparables || includeClimateRisk || includePropensityScores) && ' + additional options'}
        </p>
      </div>
    </div>
  );
};

export default PropertyResearchSearch;
