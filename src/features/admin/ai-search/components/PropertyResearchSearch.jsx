import React, { useState, useRef, useEffect } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { smartFetch } from '../../../../shared/utils';

const libraries = ['places'];

const PropertyResearchSearch = ({ onResults, onError }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [intelligenceLevel, setIntelligenceLevel] = useState('essential');
  const [includeComparables, setIncludeComparables] = useState(false);
  const [includeClimateRisk, setIncludeClimateRisk] = useState(false);
  const [includePropensityScores, setIncludePropensityScores] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isAddressVerified, setIsAddressVerified] = useState(false);
  
  const addressInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (isLoaded && addressInputRef.current && window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
        types: ['address'],
        componentRestrictions: { country: ['us', 'ca'] },
        fields: ['formatted_address', 'address_components', 'geometry', 'place_id']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        
        if (place.formatted_address) {
          setQuery(place.formatted_address);
          setSelectedPlace(place);
          setIsAddressVerified(true);
          console.log('✅ Address verified by Google:', place.formatted_address);
        } else {
          setIsAddressVerified(false);
          console.warn('⚠️ Invalid place selected');
        }
      });

      autocompleteRef.current = autocomplete;
    }
  }, [isLoaded]);

  // Handle manual input changes
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsAddressVerified(false);
    setSelectedPlace(null);
  };

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
            Property Address {isAddressVerified && <span className="text-green-600 text-xs">(✓ Verified)</span>}
          </label>
          <div className="relative">
            {loadError && (
              <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                ⚠️ Google Maps API unavailable. You can still enter addresses manually.
              </div>
            )}
            <input
              ref={addressInputRef}
              id="address"
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (!isSearching && query.trim()) {
                    handleSearch(e);
                  }
                }
              }}
              onFocus={(e) => e.stopPropagation()}
              onInput={(e) => e.stopPropagation()}
              placeholder={isLoaded ? "Start typing an address for suggestions..." : "Enter property address (e.g., 123 Main St, Houston, TX 77002)"}
              className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                isAddressVerified 
                  ? 'border-green-300 focus:ring-green-500 bg-green-50' 
                  : loadError 
                  ? 'border-yellow-300 focus:ring-yellow-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              disabled={isSearching}
              autoComplete="off"
            />
            {/* Verification indicator */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {isAddressVerified ? (
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : query && !isAddressVerified && isLoaded ? (
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : null}
            </div>
          </div>
          {!isAddressVerified && query && isLoaded && (
            <p className="text-xs text-yellow-600 mt-1">
              💡 Select from dropdown suggestions for best results
            </p>
          )}
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
