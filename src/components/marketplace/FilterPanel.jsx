import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiX, FiDollarSign, FiHome, FiMapPin, FiSliders, FiTrendingUp } from "react-icons/fi";
import { BsCoin, BsHouseDoor, BsBuilding } from "react-icons/bs";

const FilterPanel = ({ filters, onFiltersChange, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriceRangeChange = (index, value) => {
    const newPriceRange = [...localFilters.priceRange];
    newPriceRange[index] = parseInt(value);
    handleFilterChange('priceRange', newPriceRange);
  };

  const handleFeatureToggle = (feature) => {
    const currentFeatures = localFilters.features || [];
    const newFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter(f => f !== feature)
      : [...currentFeatures, feature];
    handleFilterChange('features', newFeatures);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      priceRange: [0, 2000000],
      propertyType: 'all',
      bedrooms: 'any',
      bathrooms: 'any',
      minSqft: '',
      maxSqft: '',
      listingType: 'all',
      features: [],
      location: '',
      sortBy: 'newest'
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price?.toLocaleString()}`;
  };

  const features = [
    { id: 'parking', label: 'Parking', icon: '🚗' },
    { id: 'pool', label: 'Pool', icon: '🏊‍♂️' },
    { id: 'gym', label: 'Gym/Fitness', icon: '💪' },
    { id: 'garden', label: 'Garden/Yard', icon: '🌿' },
    { id: 'garage', label: 'Garage', icon: '🏠' },
    { id: 'fireplace', label: 'Fireplace', icon: '🔥' },
    { id: 'balcony', label: 'Balcony', icon: '🏢' },
    { id: 'doorman', label: 'Doorman', icon: '🛡️' },
    { id: 'elevator', label: 'Elevator', icon: '🛗' },
    { id: 'laundry', label: 'Laundry', icon: '👕' },
    { id: 'dishwasher', label: 'Dishwasher', icon: '🍽️' },
    { id: 'ac', label: 'Air Conditioning', icon: '❄️' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiSliders className="w-5 h-5 mr-2" />
            Filters
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
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

      <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto space-y-6">
        {/* Listing Type */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            <BsCoin className="inline w-4 h-4 mr-2" />
            Listing Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'all', label: 'All Properties' },
              { value: 'sale', label: 'For Sale' },
              { value: 'rent', label: 'For Rent' },
              { value: 'tokenized', label: 'Tokenized' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleFilterChange('listingType', option.value)}
                className={`p-3 text-sm font-medium rounded-lg border transition-all ${
                  localFilters.listingType === option.value
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            <FiDollarSign className="inline w-4 h-4 mr-2" />
            Price Range
          </label>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">Min Price</label>
                <input
                  type="range"
                  min="0"
                  max="2000000"
                  step="25000"
                  value={localFilters.priceRange[0]}
                  onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                  className="w-full"
                />
                <span className="text-sm text-gray-700">{formatPrice(localFilters.priceRange[0])}</span>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">Max Price</label>
                <input
                  type="range"
                  min="0"
                  max="2000000"
                  step="25000"
                  value={localFilters.priceRange[1]}
                  onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                  className="w-full"
                />
                <span className="text-sm text-gray-700">{formatPrice(localFilters.priceRange[1])}</span>
              </div>
            </div>
            
            {/* Quick price selections */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Under 300K', range: [0, 300000] },
                { label: '300K-500K', range: [300000, 500000] },
                { label: '500K-750K', range: [500000, 750000] },
                { label: '750K-1M', range: [750000, 1000000] },
                { label: '1M-1.5M', range: [1000000, 1500000] },
                { label: '1.5M+', range: [1500000, 2000000] }
              ].map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleFilterChange('priceRange', option.range)}
                  className="p-2 text-xs font-medium rounded border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            <FiHome className="inline w-4 h-4 mr-2" />
            Property Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'all', label: 'All Types', icon: '🏠' },
              { value: 'house', label: 'Houses', icon: '🏠' },
              { value: 'condo', label: 'Condos', icon: '🏢' },
              { value: 'townhouse', label: 'Townhouses', icon: '🏘️' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleFilterChange('propertyType', option.value)}
                className={`p-3 text-sm font-medium rounded-lg border transition-all flex items-center ${
                  localFilters.propertyType === option.value
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">Bedrooms</label>
            <select
              value={localFilters.bedrooms}
              onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="any">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">Bathrooms</label>
            <select
              value={localFilters.bathrooms}
              onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="any">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>
        </div>

        {/* Square Footage */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">Square Footage</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                placeholder="Min sq ft"
                value={localFilters.minSqft}
                onChange={(e) => handleFilterChange('minSqft', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Max sq ft"
                value={localFilters.maxSqft}
                onChange={(e) => handleFilterChange('maxSqft', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Features & Amenities */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">Features & Amenities</label>
          <div className="grid grid-cols-2 gap-2">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => handleFeatureToggle(feature.id)}
                className={`p-2 text-sm rounded-lg border transition-all flex items-center ${
                  localFilters.features?.includes(feature.id)
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

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            <FiTrendingUp className="inline w-4 h-4 mr-2" />
            Sort By
          </label>
          <select
            value={localFilters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="beds">Most Bedrooms</option>
            <option value="sqft">Largest First</option>
            <option value="roi">Highest ROI</option>
          </select>
        </div>

        {/* Token-specific filters */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <BsCoin className="w-4 h-4 mr-2 text-purple-600" />
            FXST Token Features
          </h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                checked={localFilters.listingType === 'tokenized'}
                onChange={(e) => handleFilterChange('listingType', e.target.checked ? 'tokenized' : 'all')}
              />
              <span className="ml-2 text-sm text-gray-700">Show only tokenized properties</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">High yield properties (10%+ ROI)</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">Available for instant purchase</span>
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterPanel;
