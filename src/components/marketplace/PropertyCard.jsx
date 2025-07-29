import React from "react";
import { motion } from "framer-motion";
import { FiHeart, FiShare2, FiEye, FiMapPin, FiTrendingUp, FiDollarSign } from "react-icons/fi";
import { BsCoin, BsShieldCheck } from "react-icons/bs";

const PropertyCard = ({ 
  property, 
  isFavorite, 
  onToggleFavorite, 
  onClick, 
  onTokenize, 
  layout = "grid" 
}) => {
  const {
    id,
    title,
    address,
    price,
    rentPrice,
    beds,
    baths,
    sqft,
    propertyType,
    listingType,
    images,
    features,
    tokenized,
    tokenPrice,
    totalTokens,
    availableTokens,
    expectedROI,
    stats
  } = property;

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price?.toLocaleString()}`;
  };

  const getListingTypeColor = (type) => {
    switch (type) {
      case 'sale':
        return 'bg-green-100 text-green-800';
      case 'rent':
        return 'bg-blue-100 text-blue-800';
      case 'tokenized':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPropertyTypeIcon = (type) => {
    switch (type) {
      case 'house':
        return '🏠';
      case 'condo':
        return '🏢';
      case 'townhouse':
        return '🏘️';
      default:
        return '🏠';
    }
  };

  if (layout === "list") {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
        onClick={() => onClick(property)}
      >
        <div className="flex">
          {/* Image */}
          <div className="relative w-64 h-48 flex-shrink-0">
            <img
              src={images[0] || "/api/placeholder/400/300"}
              alt={title}
              className="w-full h-full object-cover"
            />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getListingTypeColor(listingType)}`}>
                {listingType.toUpperCase()}
              </span>
              {tokenized && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <BsCoin className="w-3 h-3 mr-1" />
                  TOKENIZED
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(id);
                }}
                className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                  isFavorite
                    ? 'bg-red-500 text-white'
                    : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                }`}
              >
                <FiHeart className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} />
              </button>
              <button className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white transition-all backdrop-blur-sm">
                <FiShare2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-600 flex items-center">
                  <FiMapPin className="w-4 h-4 mr-1" />
                  {address}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{formatPrice(price)}</p>
                {rentPrice && (
                  <p className="text-sm text-gray-600">${rentPrice}/month</p>
                )}
              </div>
            </div>

            {/* Property Details */}
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <span className="flex items-center mr-4">
                {getPropertyTypeIcon(propertyType)}
                <span className="ml-1 capitalize">{propertyType}</span>
              </span>
              <span className="mr-4">{beds} beds</span>
              <span className="mr-4">{baths} baths</span>
              <span>{sqft?.toLocaleString()} sq ft</span>
            </div>

            {/* Tokenization Info */}
            {tokenized && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <BsCoin className="w-4 h-4 mr-2 text-purple-600" />
                    Token Investment
                  </h4>
                  <span className="text-sm font-medium text-green-600 flex items-center">
                    <FiTrendingUp className="w-4 h-4 mr-1" />
                    {expectedROI}% ROI
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Token Price</p>
                    <p className="font-semibold">${tokenPrice}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Available</p>
                    <p className="font-semibold">{availableTokens?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Monthly Rent</p>
                    <p className="font-semibold">${property.monthlyRent?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="flex flex-wrap gap-2 mb-4">
              {features.slice(0, 4).map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {feature}
                </span>
              ))}
              {features.length > 4 && (
                <span className="text-xs text-gray-500">+{features.length - 4} more</span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick(property);
                }}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View Details
              </button>
              {!tokenized && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTokenize(property);
                  }}
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center"
                >
                  <BsCoin className="w-4 h-4 mr-2" />
                  Tokenize
                </button>
              )}
              {tokenized && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle buy tokens
                  }}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
                >
                  <FiDollarSign className="w-4 h-4 mr-2" />
                  Buy Tokens
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid layout (default)
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
      onClick={() => onClick(property)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={images[0] || "/api/placeholder/400/300"}
          alt={title}
          className="w-full h-full object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getListingTypeColor(listingType)}`}>
            {listingType.toUpperCase()}
          </span>
          {tokenized && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <BsCoin className="w-3 h-3 mr-1" />
              TOKEN
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(id);
            }}
            className={`p-2 rounded-full backdrop-blur-sm transition-all ${
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
          >
            <FiHeart className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <button className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white transition-all backdrop-blur-sm">
            <FiShare2 className="w-4 h-4" />
          </button>
        </div>

        {/* Stats */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white text-xs">
          <span className="flex items-center bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
            <FiEye className="w-3 h-3 mr-1" />
            {stats.views}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 text-lg truncate">{title}</h3>
          <span className="text-lg font-bold text-gray-900">{formatPrice(price)}</span>
        </div>

        <p className="text-sm text-gray-600 mb-3 flex items-center">
          <FiMapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="truncate">{address}</span>
        </p>

        {/* Property Details */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center space-x-3">
            <span>{beds} beds</span>
            <span>{baths} baths</span>
            <span>{sqft?.toLocaleString()} sq ft</span>
          </div>
          <span className="flex items-center text-xs">
            {getPropertyTypeIcon(propertyType)}
            <span className="ml-1 capitalize">{propertyType}</span>
          </span>
        </div>

        {/* Tokenization Info */}
        {tokenized && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3 mb-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-gray-700 flex items-center">
                <BsCoin className="w-3 h-3 mr-1 text-purple-600" />
                ${tokenPrice}/token
              </span>
              <span className="text-xs font-medium text-green-600 flex items-center">
                <FiTrendingUp className="w-3 h-3 mr-1" />
                {expectedROI}% ROI
              </span>
            </div>
            <div className="text-xs text-gray-600">
              {availableTokens?.toLocaleString()} of {totalTokens?.toLocaleString()} available
            </div>
          </div>
        )}

        {/* Features */}
        <div className="flex flex-wrap gap-1 mb-4">
          {features.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              {feature}
            </span>
          ))}
          {features.length > 3 && (
            <span className="text-xs text-gray-500">+{features.length - 3}</span>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick(property);
            }}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            View Details
          </button>
          
          {!tokenized ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTokenize(property);
              }}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm flex items-center justify-center"
            >
              <BsCoin className="w-4 h-4 mr-2" />
              Tokenize Property
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Handle buy tokens
              }}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex items-center justify-center"
            >
              <FiDollarSign className="w-4 h-4 mr-2" />
              Buy Tokens
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
