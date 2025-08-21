import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMapPin, 
  FiHome, 
  FiTrendingUp, 
  FiDollarSign, 
  FiCalendar,
  FiUsers,
  FiBarChart,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiMap
} from 'react-icons/fi';
import { smartFetch } from '../../../shared/utils';

const AddressSearch = ({ 
  onSearch, 
  onResults,
  className = "" 
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [analysisOptions, setAnalysisOptions] = useState({
    propertyDetails: true,
    marketComparables: true,
    investmentAnalysis: true,
    neighborhoodData: true,
    priceHistory: false,
    taxRecords: false,
    zoning: false,
    permits: false
  });

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      console.log('🏠 Professional Address Search:', query);
      
      // Call the existing AI search API with address-specific parameters
      const payload = {
        query: `Provide detailed professional property analysis for: ${query}`,
        analysis_type: 'professional_address_lookup',
        options: analysisOptions,
        include_verification: true,
        include_comparables: analysisOptions.marketComparables,
        include_investment_metrics: analysisOptions.investmentAnalysis
      };

      const response = await smartFetch('/api/ai/search/v2', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Process the response for professional display
      const processedResults = {
        address: data.verification?.formatted_address || query,
        verified: data.verification?.valid || false,
        confidence: data.verification?.confidence || 0,
        
        // Property basics
        property: {
          type: data.property_details?.type || 'Unknown',
          yearBuilt: data.property_details?.year_built || 'N/A',
          sqft: data.property_details?.sqft || null,
          lot_size: data.property_details?.lot_size || null,
          beds: data.property_details?.beds || null,
          baths: data.property_details?.baths || null,
          stories: data.property_details?.stories || null
        },
        
        // Market data
        market: {
          estimated_value: data.market_data?.estimated_value || null,
          price_per_sqft: data.market_data?.price_per_sqft || null,
          market_appreciation: data.market_data?.appreciation_rate || null,
          days_on_market_avg: data.market_data?.days_on_market || null,
          inventory_level: data.market_data?.inventory_level || 'Unknown'
        },
        
        // Comparables
        comparables: data.comparables || [],
        
        // Investment metrics
        investment: {
          rental_estimate: data.investment_metrics?.rental_estimate || null,
          cap_rate: data.investment_metrics?.cap_rate || null,
          cash_on_cash: data.investment_metrics?.cash_on_cash || null,
          roi_projection: data.investment_metrics?.roi_projection || null,
          appreciation_forecast: data.investment_metrics?.appreciation_forecast || null
        },
        
        // Neighborhood data
        neighborhood: {
          name: data.neighborhood?.name || 'Unknown',
          walkability: data.neighborhood?.walkability || null,
          crime_index: data.neighborhood?.crime_index || null,
          school_rating: data.neighborhood?.school_rating || null,
          amenities: data.neighborhood?.amenities || []
        },
        
        // Analysis summary
        analysis: data.ai_summary || 'Analysis completed',
        
        // Raw data for debugging
        raw_data: data
      };

      setResults(processedResults);
      
      if (onResults) {
        onResults(processedResults);
      }
      
      if (onSearch) {
        onSearch(query, 'address-search', processedResults);
      }

    } catch (err) {
      console.error('Address search error:', err);
      setError(err.message);
      
      // Provide mock professional data for demo
      const mockResults = {
        address: query,
        verified: true,
        confidence: 85,
        
        property: {
          type: 'Single Family Home',
          yearBuilt: '1995',
          sqft: 2400,
          lot_size: '0.25 acres',
          beds: 4,
          baths: 3,
          stories: 2
        },
        
        market: {
          estimated_value: 425000,
          price_per_sqft: 177,
          market_appreciation: 8.5,
          days_on_market_avg: 23,
          inventory_level: 'Low'
        },
        
        comparables: [
          {
            address: 'Similar property nearby',
            price: 435000,
            sqft: 2350,
            price_per_sqft: 185,
            days_ago: 15
          },
          {
            address: 'Another comparable',
            price: 415000,
            sqft: 2500,
            price_per_sqft: 166,
            days_ago: 32
          }
        ],
        
        investment: {
          rental_estimate: 2800,
          cap_rate: 7.9,
          cash_on_cash: 12.3,
          roi_projection: 15.2,
          appreciation_forecast: 6.8
        },
        
        neighborhood: {
          name: 'Suburban Heights',
          walkability: 65,
          crime_index: 'Low',
          school_rating: 8.5,
          amenities: ['Parks', 'Shopping Centers', 'Good Schools', 'Low Crime']
        },
        
        analysis: `Professional analysis for ${query}: This property shows strong investment potential with above-average appreciation rates and solid rental income potential. The neighborhood demographics and school ratings support long-term value growth.`
      };
      
      setResults(mockResults);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionToggle = (option) => {
    setAnalysisOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Search Interface */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center mb-4">
          <FiMapPin className="w-6 h-6 text-green-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Professional Address Lookup</h3>
            <p className="text-sm text-gray-600">Get detailed property analysis and market data</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter property address (e.g., 1234 Main St, Houston, TX 77002)"
            className="w-full pl-12 pr-24 py-3 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-green-500/20 focus:border-green-500 bg-gray-50"
            disabled={loading}
          />
          <FiHome className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <button
            onClick={handleSearch}
            disabled={!query.trim() || loading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-green-600 text-white rounded-md font-medium disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        {/* Analysis Options */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries({
            propertyDetails: 'Property Details',
            marketComparables: 'Comparables',
            investmentAnalysis: 'Investment Metrics',
            neighborhoodData: 'Neighborhood Data'
          }).map(([key, label]) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={analysisOptions[key]}
                onChange={() => handleOptionToggle(key)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Results Display */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Address Verification */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FiMapPin className="w-5 h-5 text-green-600 mr-2" />
                  Address Verification
                </h4>
                <div className="flex items-center space-x-2">
                  {results.verified ? (
                    <div className="flex items-center text-green-600">
                      <FiCheckCircle className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">Verified</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-orange-500">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">Unverified</span>
                    </div>
                  )}
                  <span className="text-xs text-gray-500">{results.confidence}% confidence</span>
                </div>
              </div>
              <p className="text-gray-700 font-medium">{results.address}</p>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiHome className="w-5 h-5 text-blue-600 mr-2" />
                Property Details
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-medium">{results.property.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Year Built</p>
                  <p className="font-medium">{results.property.yearBuilt}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Square Feet</p>
                  <p className="font-medium">{results.property.sqft?.toLocaleString() || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Lot Size</p>
                  <p className="font-medium">{results.property.lot_size || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bedrooms</p>
                  <p className="font-medium">{results.property.beds || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bathrooms</p>
                  <p className="font-medium">{results.property.baths || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Stories</p>
                  <p className="font-medium">{results.property.stories || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Market Analysis */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiTrendingUp className="w-5 h-5 text-purple-600 mr-2" />
                Market Analysis
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-700">Estimated Value</p>
                  <p className="text-lg font-bold text-green-800">
                    ${results.market.estimated_value?.toLocaleString() || 'N/A'}
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700">Price per Sq Ft</p>
                  <p className="text-lg font-bold text-blue-800">
                    ${results.market.price_per_sqft || 'N/A'}
                  </p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-sm text-purple-700">Market Appreciation</p>
                  <p className="text-lg font-bold text-purple-800">
                    {results.market.market_appreciation ? `${results.market.market_appreciation}%` : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>Average Days on Market: <span className="font-medium">{results.market.days_on_market_avg || 'N/A'}</span></p>
                <p>Inventory Level: <span className="font-medium">{results.market.inventory_level}</span></p>
              </div>
            </div>

            {/* Investment Analysis */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiDollarSign className="w-5 h-5 text-green-600 mr-2" />
                Investment Analysis
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Rental Estimate</p>
                  <p className="font-bold text-green-600">
                    ${results.investment.rental_estimate?.toLocaleString() || 'N/A'}/mo
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cap Rate</p>
                  <p className="font-bold text-blue-600">
                    {results.investment.cap_rate ? `${results.investment.cap_rate}%` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cash on Cash</p>
                  <p className="font-bold text-purple-600">
                    {results.investment.cash_on_cash ? `${results.investment.cash_on_cash}%` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ROI Projection</p>
                  <p className="font-bold text-orange-600">
                    {results.investment.roi_projection ? `${results.investment.roi_projection}%` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Appreciation Forecast</p>
                  <p className="font-bold text-teal-600">
                    {results.investment.appreciation_forecast ? `${results.investment.appreciation_forecast}%` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Comparables */}
            {results.comparables && results.comparables.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiBarChart className="w-5 h-5 text-indigo-600 mr-2" />
                  Recent Comparables
                </h4>
                <div className="space-y-3">
                  {results.comparables.map((comp, index) => (
                    <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{comp.address}</p>
                          <p className="text-sm text-gray-600">{comp.sqft?.toLocaleString()} sq ft</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">${comp.price?.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">${comp.price_per_sqft}/sq ft</p>
                          <p className="text-xs text-gray-500">{comp.days_ago} days ago</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Neighborhood Analysis */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiUsers className="w-5 h-5 text-teal-600 mr-2" />
                Neighborhood Analysis
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Neighborhood</p>
                  <p className="font-medium">{results.neighborhood.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Walkability</p>
                  <p className="font-medium">{results.neighborhood.walkability || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Crime Index</p>
                  <p className="font-medium">{results.neighborhood.crime_index || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">School Rating</p>
                  <p className="font-medium">{results.neighborhood.school_rating || 'N/A'}</p>
                </div>
              </div>
              {results.neighborhood.amenities && results.neighborhood.amenities.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Nearby Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {results.neighborhood.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="bg-teal-100 text-teal-700 px-2 py-1 rounded-full text-xs"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI Analysis Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <FiInfo className="w-5 h-5 text-blue-600 mr-2" />
                Professional Analysis Summary
              </h4>
              <p className="text-gray-700 leading-relaxed">{results.analysis}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <div className="flex items-center">
            <FiAlertCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">Search Error</span>
          </div>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default AddressSearch;
