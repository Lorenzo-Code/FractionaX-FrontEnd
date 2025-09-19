import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiMapPin,
  FiDollarSign,
  FiHome,
  FiTrendingUp,
  FiAward,
  FiClock,
  FiRefreshCw,
  FiInfo,
  FiBarChart,
  FiTarget
} from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';
import { BsCoin } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../../shared/config';

const EnhancedDiscovery = () => {
  // States for enhanced discovery
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveredProperties, setDiscoveredProperties] = useState([]);
  const [discoveryResults, setDiscoveryResults] = useState(null);
  const [apiQuota, setApiQuota] = useState(null);
  const [scoringInfo, setScoringInfo] = useState(null);

  // Search configuration
  const [searchConfig, setSearchConfig] = useState({
    markets: 'Houston, TX',
    maxProperties: 5,
    minValue: 500000,
    maxValue: 50000000,
    usePremiumAnalysis: false
  });

  // Load initial data
  useEffect(() => {
    loadQuotaInfo();
    loadScoringInfo();
  }, []);

  /**
   * Load API quota information
   */
  const loadQuotaInfo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/enhanced-discovery/quota`);
      const data = await response.json();
      if (data.success) {
        setApiQuota(data.data);
      }
    } catch (error) {
      console.warn('Failed to load quota info:', error);
    }
  };

  /**
   * Load scoring system information
   */
  const loadScoringInfo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/enhanced-discovery/scoring-info`);
      const data = await response.json();
      if (data.success) {
        setScoringInfo(data.data);
      }
    } catch (error) {
      console.warn('Failed to load scoring info:', error);
    }
  };

  /**
   * Run enhanced property discovery
   */
  const runEnhancedDiscovery = async () => {
    if (isDiscovering) return;
    
    // Check quota before starting
    if (apiQuota && apiQuota.remaining < 10) {
      toast.error('Insufficient API quota remaining. Please try again tomorrow.');
      return;
    }

    setIsDiscovering(true);
    setDiscoveredProperties([]);
    setDiscoveryResults(null);

    try {
      const params = new URLSearchParams({
        markets: searchConfig.markets,
        maxProperties: searchConfig.maxProperties.toString(),
        minValue: searchConfig.minValue.toString(),
        maxValue: searchConfig.maxValue.toString(),
        usePremiumAnalysis: searchConfig.usePremiumAnalysis.toString()
      });

      const response = await fetch(`${API_BASE_URL}/api/enhanced-discovery/properties?${params}`);
      const data = await response.json();

      if (data.success) {
        setDiscoveredProperties(data.data.properties);
        setDiscoveryResults(data.data.metadata);
        
        // Update quota info
        await loadQuotaInfo();

        // Show success message
        const { scores, totalFound } = data.data.metadata;
        if (scores.highest > scores.baseline) {
          toast.success(`🎉 Success! Found ${totalFound} properties with max score ${scores.highest}/100 (beat baseline ${scores.baseline}/100)`);
        } else {
          toast.success(`✅ Discovery complete! Found ${totalFound} properties.`);
        }
      } else {
        throw new Error(data.message || 'Discovery failed');
      }
    } catch (error) {
      console.error('Enhanced discovery error:', error);
      
      if (error.message?.includes('rate limit') || error.message?.includes('429')) {
        toast.error('API rate limit exceeded. Please try again later.');
      } else if (error.message?.includes('quota')) {
        toast.error('API quota exceeded. Please try again tomorrow.');
      } else {
        toast.error(`Discovery failed: ${error.message}`);
      }
    } finally {
      setIsDiscovering(false);
    }
  };

  /**
   * Format currency
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  /**
   * Get score color based on value
   */
  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-600 bg-green-50';
    if (score >= 50) return 'text-blue-600 bg-blue-50';
    if (score >= 30) return 'text-orange-600 bg-orange-50';
    return 'text-gray-600 bg-gray-50';
  };

  /**
   * Get grade badge based on building grade
   */
  const getGradeBadge = (grade) => {
    if (!grade) return null;
    const colors = {
      'EXC': 'bg-green-100 text-green-800',
      'VG': 'bg-blue-100 text-blue-800',
      'GOOD': 'bg-yellow-100 text-yellow-800'
    };
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        colors[grade] || 'bg-gray-100 text-gray-800'
      }`}>
        Grade: {grade}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
            <HiOutlineSparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Enhanced Property Discovery</h2>
            <p className="text-gray-600">Premium CoreLogic intelligence with 33+ investment scores</p>
          </div>
        </div>
        
        {/* API Quota Status */}
        {apiQuota && (
          <div className="text-right">
            <div className={`text-sm font-medium ${
              apiQuota.status === 'critical' ? 'text-red-600' :
              apiQuota.status === 'warning' ? 'text-orange-600' :
              'text-green-600'
            }`}>
              API Quota: {apiQuota.remaining}/{apiQuota.maxCalls}
            </div>
            <div className="text-xs text-gray-500">{apiQuota.usagePercentage}% used</div>
          </div>
        )}
      </div>

      {/* Scoring System Overview */}
      {scoringInfo && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <FiTarget className="mr-2" />
            Enhanced Scoring System
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
            {scoringInfo.scoringSystem.factors.map((factor, index) => (
              <div key={index} className="text-center">
                <div className="text-lg font-bold text-blue-600">{factor.maxPoints}</div>
                <div className="text-xs text-gray-600">{factor.category}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Baseline: {scoringInfo.scoringSystem.baseline}/100</span>
            <span>Current Range: {scoringInfo.achievableScores.current}</span>
            <span>Theoretical Max: {scoringInfo.achievableScores.theoretical}</span>
          </div>
        </div>
      )}

      {/* Search Configuration */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Discovery Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Market</label>
            <input
              type="text"
              value={searchConfig.markets}
              onChange={(e) => setSearchConfig({...searchConfig, markets: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Houston, TX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Properties</label>
            <select
              value={searchConfig.maxProperties}
              onChange={(e) => setSearchConfig({...searchConfig, maxProperties: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={3}>3 properties</option>
              <option value={5}>5 properties</option>
              <option value={7}>7 properties</option>
              <option value={10}>10 properties</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Value</label>
            <select
              value={searchConfig.minValue}
              onChange={(e) => setSearchConfig({...searchConfig, minValue: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={100000}>$100,000</option>
              <option value={500000}>$500,000</option>
              <option value={1000000}>$1,000,000</option>
              <option value={2000000}>$2,000,000</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Value</label>
            <select
              value={searchConfig.maxValue}
              onChange={(e) => setSearchConfig({...searchConfig, maxValue: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10000000}>$10,000,000</option>
              <option value={25000000}>$25,000,000</option>
              <option value={50000000}>$50,000,000</option>
              <option value={100000000}>$100,000,000</option>
            </select>
          </div>
        </div>
        
        {/* Premium Analysis Toggle */}
        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={searchConfig.usePremiumAnalysis}
              onChange={(e) => setSearchConfig({...searchConfig, usePremiumAnalysis: e.target.checked})}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Enable Premium Sale Analysis (uses more API quota)</span>
          </label>
        </div>
      </div>

      {/* Discovery Button */}
      <div className="text-center mb-6">
        <button
          onClick={runEnhancedDiscovery}
          disabled={isDiscovering || (apiQuota && apiQuota.remaining < 10)}
          className={`px-8 py-4 rounded-lg font-semibold text-white text-lg transition-all transform hover:scale-105 ${
            isDiscovering
              ? 'bg-gray-400 cursor-not-allowed'
              : apiQuota && apiQuota.remaining < 10
              ? 'bg-red-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg'
          }`}
        >
          {isDiscovering ? (
            <div className="flex items-center">
              <FiRefreshCw className="animate-spin mr-2" />
              Discovering Properties...
            </div>
          ) : (
            <div className="flex items-center">
              <FiSearch className="mr-2" />
              Start Enhanced Discovery
            </div>
          )}
        </button>
        
        {apiQuota && apiQuota.remaining < 10 && (
          <p className="text-red-600 text-sm mt-2">
            Insufficient API quota remaining ({apiQuota.remaining}/100 calls left)
          </p>
        )}
      </div>

      {/* Discovery Results Metadata */}
      {discoveryResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Discovery Results</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{discoveryResults.totalFound}</div>
              <div className="text-sm text-gray-600">Properties Found</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                discoveryResults.scores.highest > discoveryResults.scores.baseline ? 'text-green-600' : 'text-orange-600'
              }`}>
                {discoveryResults.scores.highest}/100
              </div>
              <div className="text-sm text-gray-600">Highest Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{discoveryResults.scores.average}/100</div>
              <div className="text-sm text-gray-600">Average Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{discoveryResults.apiCallsUsed}</div>
              <div className="text-sm text-gray-600">API Calls Used</div>
            </div>
          </div>
          
          {discoveryResults.scores.highest > discoveryResults.scores.baseline && (
            <div className="mt-3 p-3 bg-green-100 rounded-lg">
              <p className="text-green-800 text-sm font-medium">
                🎉 Success! Achieved {discoveryResults.scores.highest}/100 score, beating the {discoveryResults.scores.baseline}/100 baseline by {discoveryResults.scores.highest - discoveryResults.scores.baseline} points!
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Discovered Properties */}
      <AnimatePresence>
        {discoveredProperties.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Enhanced Investment Properties ({discoveredProperties.length})
            </h3>
            <div className="grid gap-6">
              {discoveredProperties.map((property) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {property.address?.streetAddress || 'Address Unavailable'}
                      </h4>
                      <p className="text-gray-600 flex items-center mt-1">
                        <FiMapPin className="mr-1 text-sm" />
                        {property.city}, {property.state}
                      </p>
                    </div>
                    
                    {/* Investment Score Badge */}
                    <div className={`px-3 py-2 rounded-lg text-center ${getScoreColor(property.investmentScore)}`}>
                      <div className="text-lg font-bold">{property.investmentScore}/100</div>
                      <div className="text-xs">Investment Score</div>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center">
                      <FiDollarSign className="mr-2 text-green-600" />
                      <div>
                        <div className="font-semibold">{formatCurrency(property.estimatedValue)}</div>
                        <div className="text-xs text-gray-500">Estimated Value</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <FiHome className="mr-2 text-blue-600" />
                      <div>
                        <div className="font-semibold">{property.propertyType}</div>
                        <div className="text-xs text-gray-500">Property Type</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <FiClock className="mr-2 text-purple-600" />
                      <div>
                        <div className="font-semibold">{new Date(property.discoveredAt).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">Discovered</div>
                      </div>
                    </div>
                  </div>

                  {/* Property Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {property.features?.buildingGrade && getGradeBadge(property.features.buildingGrade)}
                    
                    {property.features?.taxAssessedValue && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Tax Assessed: {formatCurrency(property.features.taxAssessedValue)}
                      </span>
                    )}
                    
                    {property.features?.owners?.length > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Owners: {property.features.owners.length}
                      </span>
                    )}
                    
                    {property.premiumSaleScore && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Sale Score: {property.premiumSaleScore}/100
                      </span>
                    )}
                  </div>

                  {/* Owners (if available) */}
                  {property.features?.owners?.length > 0 && (
                    <div className="mt-3">
                      <div className="text-sm font-medium text-gray-700 mb-2">Property Owners:</div>
                      <div className="flex flex-wrap gap-2">
                        {property.features.owners.slice(0, 3).map((owner, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {owner}
                          </span>
                        ))}
                        {property.features.owners.length > 3 && (
                          <span className="text-xs text-gray-500">+{property.features.owners.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!isDiscovering && discoveredProperties.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <FiSearch className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ready for Enhanced Discovery</h3>
          <p className="text-gray-600 mb-4">
            Click "Start Enhanced Discovery" to find high-scoring investment properties using premium CoreLogic intelligence.
          </p>
          <div className="text-sm text-gray-500">
            Our enhanced scoring system has achieved 33+ scores compared to the previous 11/100 baseline.
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedDiscovery;
