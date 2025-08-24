import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiSave, 
  FiSearch, 
  FiTrendingUp, 
  FiMapPin, 
  FiDollarSign,
  FiSettings,
  FiBookmark,
  FiTrash2,
  FiEdit3
} from 'react-icons/fi';
import { BsCoin } from 'react-icons/bs';

const SmartFilterPanel = ({ 
  onClose, 
  onApplyFilters, 
  currentFilters, 
  savedSearches,
  onSaveSearch,
  onDeleteSearch,
  onLoadSearch 
}) => {
  const [activeFilters, setActiveFilters] = useState(currentFilters);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [saveSearchName, setSaveSearchName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Smart filter presets for community-driven marketplace
  const smartPresets = [
    {
      id: 'community-favorites',
      name: 'Community Favorites',
      description: 'Properties with high FXCT bidding interest',
      filters: {
        roiRange: [10, 50],
        sortBy: 'interest',
        tokenizationStatus: 'all'
      },
      icon: '🏆',
      color: 'green'
    },
    {
      id: 'affordable-entry',
      name: 'Affordable Entry Points',
      description: 'Great properties under $500k for new investors',
      filters: {
        priceRange: [100000, 500000],
        roiRange: [8, 50],
        sortBy: 'price-low'
      },
      icon: '💰',
      color: 'blue'
    },
    {
      id: 'premium-properties',
      name: 'Premium Properties',
      description: 'High-value properties with strong ROI potential',
      filters: {
        priceRange: [800000, 2000000],
        roiRange: [10, 50],
        sortBy: 'price-high',
        features: ['parking', 'pool']
      },
      icon: '💎',
      color: 'purple'
    },
    {
      id: 'ai-discoveries',
      name: 'Latest AI Discoveries',
      description: 'Fresh AI-discovered investment opportunities',
      filters: {
        sortBy: 'newest',
        roiRange: [8, 50]
      },
      icon: '🤖',
      color: 'indigo'
    },
    {
      id: 'high-yield',
      name: 'High Yield Focus',
      description: 'Properties with 12%+ expected ROI',
      filters: {
        roiRange: [12, 50],
        sortBy: 'roi',
        tokenizationStatus: 'all'
      },
      icon: '📈',
      color: 'yellow'
    }
  ];

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset.id);
    setActiveFilters(prev => ({
      ...prev,
      ...preset.filters
    }));
  };

  const handleFilterChange = (key, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setSelectedPreset(null); // Clear preset selection when manually changing filters
  };

  const handleApplyFilters = () => {
    onApplyFilters(activeFilters);
    onClose();
  };

  const handleSaveSearch = () => {
    if (saveSearchName.trim()) {
      const searchData = {
        name: saveSearchName,
        filters: activeFilters,
        timestamp: new Date().toISOString()
      };
      onSaveSearch(searchData);
      setSaveSearchName('');
      setShowSaveDialog(false);
    }
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      priceRange: [0, 2000000],
      propertyType: 'all',
      bedrooms: 'any',
      bathrooms: 'any',
      location: '',
      sortBy: 'newest',
      tokenizationStatus: 'all',
      roiRange: [0, 50],
      listingStatus: 'all',
      features: [],
      minSqft: '',
      maxSqft: '',
      listingType: 'all'
    };
    setActiveFilters(clearedFilters);
    setSelectedPreset(null);
  };

  const getPresetColor = (color) => {
    const colors = {
      green: 'bg-green-50 border-green-200 text-green-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800'
    };
    return colors[color] || colors.blue;
  };

  const getActivePresetColor = (color) => {
    const colors = {
      green: 'bg-green-100 border-green-400 text-green-900',
      purple: 'bg-purple-100 border-purple-400 text-purple-900',
      blue: 'bg-blue-100 border-blue-400 text-blue-900',
      yellow: 'bg-yellow-100 border-yellow-400 text-yellow-900',
      indigo: 'bg-indigo-100 border-indigo-400 text-indigo-900'
    };
    return colors[color] || colors.blue;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden max-h-[90vh]"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiSettings className="w-5 h-5 mr-2" />
            Smart Filters
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSaveDialog(true)}
              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded"
            >
              <FiSave className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-600 hover:text-gray-700 font-medium px-2 py-1 rounded"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
        {/* Smart Presets */}
        <div className="p-4 border-b border-gray-100">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Smart Filter Presets</h4>
          <div className="grid grid-cols-1 gap-2">
            {smartPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset)}
                className={`p-3 rounded-lg border-2 text-left transition-all hover:shadow-sm ${
                  selectedPreset === preset.id 
                    ? getActivePresetColor(preset.color)
                    : getPresetColor(preset.color)
                }`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-lg">{preset.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{preset.name}</div>
                    <div className="text-xs opacity-75 mt-1">{preset.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Saved Searches */}
        {savedSearches.length > 0 && (
          <div className="p-4 border-b border-gray-100">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <FiBookmark className="w-4 h-4 mr-2" />
              Saved Searches
            </h4>
            <div className="space-y-2">
              {savedSearches.map((search, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <button
                    onClick={() => onLoadSearch(search)}
                    className="flex-1 text-left text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    {search.name}
                  </button>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onDeleteSearch(index)}
                      className="p-1 text-gray-400 hover:text-red-500 rounded"
                    >
                      <FiTrash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Advanced Filters */}
        <div className="p-4 space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Advanced Filters</h4>
          
          {/* ROI Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected ROI Range
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="50"
                value={activeFilters.roiRange[0]}
                onChange={(e) => handleFilterChange('roiRange', [parseInt(e.target.value), activeFilters.roiRange[1]])}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 w-16">
                {activeFilters.roiRange[0]}% - {activeFilters.roiRange[1]}%
              </span>
              <input
                type="range"
                min="0"
                max="50"
                value={activeFilters.roiRange[1]}
                onChange={(e) => handleFilterChange('roiRange', [activeFilters.roiRange[0], parseInt(e.target.value)])}
                className="flex-1"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={activeFilters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              placeholder="Enter city, neighborhood, or address"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Features & Amenities
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'parking', label: 'Parking', icon: '🚗' },
                { id: 'pool', label: 'Pool', icon: '🏊‍♂️' },
                { id: 'gym', label: 'Fitness Center', icon: '💪' },
                { id: 'garden', label: 'Garden/Yard', icon: '🌿' },
                { id: 'garage', label: 'Garage', icon: '🏠' },
                { id: 'doorman', label: 'Concierge', icon: '🛡️' },
                { id: 'city_views', label: 'City Views', icon: '🏙️' },
                { id: 'balcony', label: 'Balcony', icon: '🏗️' }
              ].map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => {
                    const currentFeatures = activeFilters.features || [];
                    const newFeatures = currentFeatures.includes(feature.id)
                      ? currentFeatures.filter(f => f !== feature.id)
                      : [...currentFeatures, feature.id];
                    handleFilterChange('features', newFeatures);
                  }}
                  className={`p-2 text-sm rounded-lg border transition-all flex items-center ${
                    activeFilters.features?.includes(feature.id)
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{feature.icon}</span>
                  {feature.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={activeFilters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Latest Discovery</option>
              <option value="interest">Most Interest (FXCT Bidding)</option>
              <option value="price-low">Most Affordable</option>
              <option value="price-high">Premium Properties</option>
              <option value="roi">Highest ROI</option>
              <option value="sqft">Largest Space</option>
            </select>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BsCoin className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-600">
              {Object.keys(activeFilters).filter(key => 
                activeFilters[key] !== 'all' && 
                activeFilters[key] !== 'any' && 
                activeFilters[key] !== '' &&
                !(Array.isArray(activeFilters[key]) && activeFilters[key].length === 0)
              ).length} filters active
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Save Search Dialog */}
      <AnimatePresence>
        {showSaveDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Save Search</h3>
              <input
                type="text"
                value={saveSearchName}
                onChange={(e) => setSaveSearchName(e.target.value)}
                placeholder="Enter search name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                onKeyPress={(e) => e.key === 'Enter' && handleSaveSearch()}
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSearch}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SmartFilterPanel;
