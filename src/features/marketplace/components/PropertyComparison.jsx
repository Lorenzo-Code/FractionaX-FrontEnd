import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiMapPin, 
  FiHome, 
  FiDollarSign, 
  FiTrendingUp,
  FiCalendar,
  FiMaximize,
  FiUsers,
  FiStar,
  FiEye,
  FiShare2,
  FiDownload
} from 'react-icons/fi';
import { BsCoin } from 'react-icons/bs';

const PropertyComparison = ({ properties, onClose, onRemoveProperty, onAddToFavorites }) => {
  const [expandedProperty, setExpandedProperty] = useState(null);

  if (!properties || properties.length === 0) {
    return null;
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US').format(number);
  };

  const getROIColor = (roi) => {
    if (roi >= 15) return 'text-green-600';
    if (roi >= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getROIBadge = (roi) => {
    if (roi >= 15) return 'bg-green-100 text-green-800';
    if (roi >= 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const exportComparison = () => {
    const data = properties.map(property => ({
      title: property.title,
      address: property.address,
      price: property.price,
      beds: property.beds,
      baths: property.baths,
      sqft: property.sqft,
      expectedROI: property.expectedROI,
      monthlyRent: property.monthlyRent,
      yearBuilt: property.yearBuilt,
      tokenized: property.tokenized
    }));

    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `property-comparison-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <FiHome className="mr-3 text-blue-600" />
                Property Comparison
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Comparing {properties.length} properties side-by-side
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={exportComparison}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FiDownload className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-auto max-h-[calc(90vh-200px)]">
          <div className="p-6">
            <div className="grid gap-6" style={{ gridTemplateColumns: `300px repeat(${properties.length}, 1fr)` }}>
              
              {/* Property Images Row */}
              <div className="font-semibold text-gray-900 flex items-center">
                Property Images
              </div>
              {properties.map((property, index) => (
                <div key={`image-${property.id}`} className="relative">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => onRemoveProperty(property.id)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                  {property.tokenized && (
                    <span className="absolute bottom-2 left-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Tokenized
                    </span>
                  )}
                </div>
              ))}

              {/* Property Title Row */}
              <div className="font-semibold text-gray-900 flex items-center">
                Property Name
              </div>
              {properties.map((property) => (
                <div key={`title-${property.id}`} className="flex flex-col">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{property.title}</h3>
                  <p className="text-sm text-gray-600 flex items-center">
                    <FiMapPin className="w-4 h-4 mr-1" />
                    {property.address}
                  </p>
                </div>
              ))}

              {/* Price Row */}
              <div className="font-semibold text-gray-900 flex items-center">
                <FiDollarSign className="w-4 h-4 mr-2" />
                Price
              </div>
              {properties.map((property) => (
                <div key={`price-${property.id}`} className="text-2xl font-bold text-blue-600">
                  {formatCurrency(property.price)}
                </div>
              ))}

              {/* ROI Row */}
              <div className="font-semibold text-gray-900 flex items-center">
                <FiTrendingUp className="w-4 h-4 mr-2" />
                Expected ROI
              </div>
              {properties.map((property) => (
                <div key={`roi-${property.id}`} className="flex items-center space-x-2">
                  <span className={`text-xl font-bold ${getROIColor(property.expectedROI)}`}>
                    {property.expectedROI}%
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getROIBadge(property.expectedROI)}`}>
                    {property.expectedROI >= 15 ? 'Excellent' : property.expectedROI >= 10 ? 'Good' : 'Fair'}
                  </span>
                </div>
              ))}

              {/* Monthly Rent Row */}
              <div className="font-semibold text-gray-900 flex items-center">
                Monthly Rent
              </div>
              {properties.map((property) => (
                <div key={`rent-${property.id}`} className="text-lg font-semibold text-green-600">
                  {formatCurrency(property.monthlyRent)}/month
                </div>
              ))}

              {/* Bedrooms Row */}
              <div className="font-semibold text-gray-900 flex items-center">
                Bedrooms
              </div>
              {properties.map((property) => (
                <div key={`beds-${property.id}`} className="text-lg">
                  {property.beds} beds
                </div>
              ))}

              {/* Bathrooms Row */}
              <div className="font-semibold text-gray-900 flex items-center">
                Bathrooms
              </div>
              {properties.map((property) => (
                <div key={`baths-${property.id}`} className="text-lg">
                  {property.baths} baths
                </div>
              ))}

              {/* Square Footage Row */}
              <div className="font-semibold text-gray-900 flex items-center">
                <FiMaximize className="w-4 h-4 mr-2" />
                Square Footage
              </div>
              {properties.map((property) => (
                <div key={`sqft-${property.id}`} className="text-lg">
                  {formatNumber(property.sqft)} sqft
                </div>
              ))}

              {/* Price per sqft Row */}
              <div className="font-semibold text-gray-900 flex items-center">
                Price per sqft
              </div>
              {properties.map((property) => (
                <div key={`price-sqft-${property.id}`} className="text-lg">
                  {formatCurrency(Math.round(property.price / property.sqft))}/sqft
                </div>
              ))}

              {/* Year Built Row */}
              <div className="font-semibold text-gray-900 flex items-center">
                <FiCalendar className="w-4 h-4 mr-2" />
                Year Built
              </div>
              {properties.map((property) => (
                <div key={`year-${property.id}`} className="text-lg">
                  {property.yearBuilt}
                </div>
              ))}

              {/* Property Type Row */}
              <div className="font-semibold text-gray-900 flex items-center">
                Property Type
              </div>
              {properties.map((property) => (
                <div key={`type-${property.id}`} className="text-lg capitalize">
                  {property.propertyType}
                </div>
              ))}

              {/* Features Row */}
              <div className="font-semibold text-gray-900 flex items-start pt-2">
                Features & Amenities
              </div>
              {properties.map((property) => (
                <div key={`features-${property.id}`} className="flex flex-wrap gap-1">
                  {property.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              ))}

              {/* Stats Row */}
              <div className="font-semibold text-gray-900 flex items-center">
                <FiEye className="w-4 h-4 mr-2" />
                Property Stats
              </div>
              {properties.map((property) => (
                <div key={`stats-${property.id}`} className="space-y-1">
                  <div className="text-sm text-gray-600">
                    {property.stats.views} views
                  </div>
                  <div className="text-sm text-gray-600">
                    {property.stats.saves} saves
                  </div>
                  <div className="text-sm text-gray-600">
                    {property.stats.daysOnMarket} days on market
                  </div>
                </div>
              ))}

              {/* Tokenization Details Row */}
              {properties.some(p => p.tokenized) && (
                <>
                  <div className="font-semibold text-gray-900 flex items-center">
                    <BsCoin className="w-4 h-4 mr-2" />
                    Token Details
                  </div>
                  {properties.map((property) => (
                    <div key={`tokens-${property.id}`} className="space-y-1">
                      {property.tokenized ? (
                        <>
                          <div className="text-sm">
                            Token Price: <span className="font-semibold">{formatCurrency(property.tokenPrice)}</span>
                          </div>
                          <div className="text-sm">
                            Total Tokens: <span className="font-semibold">{formatNumber(property.totalTokens)}</span>
                          </div>
                          <div className="text-sm">
                            Available: <span className="font-semibold text-green-600">{formatNumber(property.availableTokens)}</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-500">
                          Not tokenized
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}

              {/* Agent Info Row */}
              <div className="font-semibold text-gray-900 flex items-center">
                <FiUsers className="w-4 h-4 mr-2" />
                Agent Information
              </div>
              {properties.map((property) => (
                <div key={`agent-${property.id}`} className="space-y-1">
                  <div className="font-medium text-gray-900">
                    {property.agent.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {property.agent.phone}
                  </div>
                  <div className="text-sm text-blue-600">
                    {property.agent.email}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Select properties from the marketplace to compare their features, pricing, and investment potential.
            </div>
            <div className="flex space-x-3">
              {properties.map((property) => (
                <button
                  key={`favorite-${property.id}`}
                  onClick={() => onAddToFavorites(property.id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiStar className="w-4 h-4" />
                  <span>Add to Favorites</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PropertyComparison;
