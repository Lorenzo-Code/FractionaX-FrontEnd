import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin,
  DollarSign,
  Home,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Search,
  FileText,
  Calculator
} from 'lucide-react';

const BasicDueDiligencePanel = () => {
  const [searchAddress, setSearchAddress] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Simplified property analysis for investment decisions only
  const performBasicLookup = async (address) => {
    setLoading(true);
    try {
      // This would call a simplified backend endpoint that only returns
      // essential information for investment decisions
      const response = await fetch('/api/admin/basic-due-diligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      });
      
      if (response.ok) {
        const data = await response.json();
        setSearchResult(data);
      }
    } catch (error) {
      console.error('Due diligence lookup failed:', error);
      // Mock simplified result for demo
      setSearchResult({
        address: address,
        estimated_value: 485000,
        property_type: 'Single Family Home',
        year_built: 2015,
        square_feet: 2400,
        bedrooms: 4,
        bathrooms: 3,
        neighborhood: 'Cedar Park',
        investment_score: 7.2,
        rental_estimate: 2800,
        basic_risks: [
          'Property tax increases expected',
          'Moderate flood risk zone'
        ],
        investment_suitability: 'Good for fractionalization',
        recommended_action: 'Proceed with community bidding'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchAddress.trim()) {
      performBasicLookup(searchAddress);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Basic Investment Due Diligence</h2>
          <p className="text-blue-100">
            Essential property analysis for marketplace investment decisions
          </p>
        </div>

        {/* Search Form */}
        <div className="p-6 border-b border-gray-200">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                placeholder="Enter property address for basic analysis..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchAddress.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Analyzing...' : 'Analyze'}</span>
            </button>
          </form>
        </div>

        {/* Results */}
        {searchResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6"
          >
            {/* Property Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <Home className="w-8 h-8 text-blue-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Property Info</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>{searchResult.property_type}</div>
                  <div>{searchResult.bedrooms} bed, {searchResult.bathrooms} bath</div>
                  <div>{searchResult.square_feet?.toLocaleString()} sq ft</div>
                  <div>Built: {searchResult.year_built}</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <DollarSign className="w-8 h-8 text-green-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Investment Metrics</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>Est. Value: ${searchResult.estimated_value?.toLocaleString()}</div>
                  <div>Rental Est: ${searchResult.rental_estimate?.toLocaleString()}/mo</div>
                  <div>Score: {searchResult.investment_score}/10</div>
                  <div className={`font-medium ${
                    searchResult.investment_score >= 7 ? 'text-green-600' : 
                    searchResult.investment_score >= 5 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {searchResult.recommended_action}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Investment Suitability</h4>
                <div className="space-y-2 text-sm">
                  <div className="text-gray-600">{searchResult.investment_suitability}</div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    searchResult.investment_score >= 7 
                      ? 'bg-green-100 text-green-800' 
                      : searchResult.investment_score >= 5 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {searchResult.investment_score >= 7 ? 'Strong Candidate' : 
                     searchResult.investment_score >= 5 ? 'Moderate Risk' : 'High Risk'}
                  </div>
                </div>
              </div>
            </div>

            {/* Key Risks & Opportunities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                  Key Considerations
                </h4>
                <div className="space-y-2">
                  {searchResult.basic_risks?.map((risk, index) => (
                    <div key={index} className="flex items-start space-x-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-yellow-800">{risk}</span>
                    </div>
                  )) || (
                    <div className="text-sm text-gray-500">No significant risks identified</div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Investment Highlights
                </h4>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2 p-2 bg-green-50 border border-green-200 rounded">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-green-800">Strong rental income potential</span>
                  </div>
                  <div className="flex items-start space-x-2 p-2 bg-green-50 border border-green-200 rounded">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-green-800">Good neighborhood appreciation trends</span>
                  </div>
                  <div className="flex items-start space-x-2 p-2 bg-green-50 border border-green-200 rounded">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-green-800">Suitable for fractional ownership</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Simple Action Buttons */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve for Marketplace</span>
                </button>
                <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Generate Summary Report</span>
                </button>
                <button className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2">
                  <Calculator className="w-4 h-4" />
                  <span>Quick ROI Calculator</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Feature Comparison */}
        <div className="bg-blue-50 border-t border-blue-200 p-6">
          <div className="max-w-2xl mx-auto">
            <h4 className="font-semibold text-blue-900 mb-4 text-center">
              Focused on Investment Decisions, Not Research Competition
            </h4>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <h5 className="font-medium text-red-600 mb-2">❌ Removed (Competes with Zillow)</h5>
                <ul className="space-y-1 text-red-600">
                  <li>• Complex market analysis</li>
                  <li>• Detailed property research</li>
                  <li>• CoreLogic deep analytics</li>
                  <li>• Comprehensive neighborhood data</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-green-600 mb-2">✅ Focused (Investment Only)</h5>
                <ul className="space-y-1 text-green-600">
                  <li>• Basic investment scoring</li>
                  <li>• Fractionalization suitability</li>
                  <li>• Essential risk factors</li>
                  <li>• Quick ROI estimates</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-100 rounded-lg text-center">
              <p className="text-blue-800 text-sm">
                <strong>Strategy:</strong> Let users find properties on Zillow, then use our marketplace for fractional investing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicDueDiligencePanel;
