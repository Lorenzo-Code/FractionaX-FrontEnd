import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiMapPin, 
  FiStar, 
  FiTrendingUp, 
  FiClock, 
  FiBarChart,
  FiShield,
  FiZap,
  FiAward
} from 'react-icons/fi';

// Asset category configuration
const ASSET_CONFIG = {
  'real-estate': {
    name: 'Real Estate',
    icon: '🏠',
    color: 'blue',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    accentColor: 'text-blue-600'
  },
  'luxury-cars': {
    name: 'Luxury Cars',
    icon: '🏎️',
    color: 'purple',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    accentColor: 'text-purple-600'
  },
  'art-nfts': {
    name: 'Art & NFTs',
    icon: '🎨',
    color: 'pink',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    textColor: 'text-pink-700',
    accentColor: 'text-pink-600'
  },
  'collectibles': {
    name: 'Collectibles',
    icon: '🃏',
    color: 'green',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    accentColor: 'text-green-600'
  },
  'defi-yield': {
    name: 'DeFi Yield',
    icon: '💰',
    color: 'orange',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700',
    accentColor: 'text-orange-600'
  }
};

const TrendingAssetCard = ({ asset, index = 0, onClick }) => {
  const config = ASSET_CONFIG[asset.category] || ASSET_CONFIG['real-estate'];
  
  // Get location text based on asset type
  const getLocationText = () => {
    if (asset.address) return asset.address;
    if (asset.location) return asset.location;
    if (asset.artist) return `by ${asset.artist}`;
    if (asset.protocol) return `${asset.protocol} Protocol`;
    if (asset.category_name) return asset.category_name;
    return 'Location not specified';
  };

  // Get specifications based on asset type
  const getSpecifications = () => {
    switch (asset.category) {
      case 'real-estate':
        return asset.beds && asset.baths && asset.sqft ? (
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <span className="mr-4">{asset.beds} beds</span>
            <span className="mr-4">{asset.baths} baths</span>
            <span>{asset.sqft?.toLocaleString()} sqft</span>
          </div>
        ) : null;
        
      case 'luxury-cars':
        return asset.year && asset.mileage ? (
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <span className="mr-4">{asset.year}</span>
            <span className="mr-4">{asset.mileage?.toLocaleString()} miles</span>
            <span>{asset.condition}</span>
          </div>
        ) : null;
        
      case 'art-nfts':
        return (
          <div className="flex items-center text-sm text-gray-600 mb-3">
            {asset.edition && <span className="mr-4">{asset.edition}</span>}
            {asset.blockchain && <span>{asset.blockchain}</span>}
          </div>
        );
        
      case 'collectibles':
        return (
          <div className="flex items-center text-sm text-gray-600 mb-3">
            {asset.grade && <span className="mr-4">Grade: {asset.grade}</span>}
            {asset.edition && <span>{asset.edition}</span>}
          </div>
        );
        
      case 'defi-yield':
        return asset.apy && asset.tvl ? (
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <span className="mr-4">APY: {asset.apy}%</span>
            <span className="mr-4">TVL: ${(asset.tvl / 1000000).toFixed(1)}M</span>
            {asset.riskLevel && <span>{asset.riskLevel} Risk</span>}
          </div>
        ) : null;
        
      default:
        return null;
    }
  };

  // Get yield/income info based on asset type
  const getYieldInfo = () => {
    if (!asset.expectedROI) return null;
    
    let yieldText = 'Expected ROI';
    let periodText = '';
    
    if (asset.category === 'real-estate' && asset.monthlyRent) {
      periodText = `$${asset.monthlyRent.toLocaleString()}/month`;
    } else if (asset.monthlyAppreciation) {
      yieldText = 'Monthly Growth';
      periodText = `${asset.monthlyAppreciation}%/month`;
    } else if (asset.monthlyYield && asset.category === 'defi-yield') {
      yieldText = 'Monthly Yield';
      periodText = `${asset.monthlyYield}%/month`;
    }
    
    return (
      <div className="flex items-center justify-between text-sm mb-3">
        <span className={`font-semibold ${config.accentColor}`}>
          <FiTrendingUp className="w-4 h-4 inline mr-1" />
          {asset.expectedROI}% {yieldText}
        </span>
        {periodText && (
          <span className="text-gray-500 text-xs">
            {periodText}
          </span>
        )}
      </div>
    );
  };

  // Get stats badges
  const getStatsInfo = () => {
    if (!asset.stats) return null;
    
    return (
      <div className="flex items-center space-x-3 text-xs text-gray-500 mb-3">
        <div className="flex items-center">
          <FiBarChart className="w-3 h-3 mr-1" />
          {asset.stats.views} views
        </div>
        <div className="flex items-center">
          <FiStar className="w-3 h-3 mr-1" />
          {asset.stats.saves} saves
        </div>
        <div className="flex items-center">
          <FiClock className="w-3 h-3 mr-1" />
          {asset.stats.daysOnMarket}d
        </div>
      </div>
    );
  };

  // Get certification/authentication badges
  const getCertificationBadge = () => {
    let certText = '';
    let certIcon = <FiShield className="w-3 h-3 mr-1" />;
    
    if (asset.certification) certText = asset.certification;
    else if (asset.authentication) certText = asset.authentication;
    else if (asset.provenance) certText = asset.provenance;
    else if (asset.riskLevel) certText = `${asset.riskLevel} Risk`;
    
    if (!certText) return null;
    
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${config.bgColor} ${config.textColor} mb-2`}>
        {certIcon}
        {certText}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4 }}
      onClick={() => onClick && onClick(asset)}
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border ${config.borderColor} group`}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {asset.images && asset.images.length > 0 ? (
          <img
            src={asset.images[0]}
            alt={asset.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = `
                <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                  <div class="text-center text-gray-500">
                    <div class="text-2xl mb-2">${config.icon}</div>
                    <span class="text-xs">Image Loading...</span>
                  </div>
                </div>
              `;
            }}
          />
        ) : (
          <div className={`w-full h-full ${config.bgColor} flex items-center justify-center`}>
            <div className="text-center">
              <div className="text-3xl mb-2">{config.icon}</div>
              <span className={`text-xs ${config.textColor}`}>No Image Available</span>
            </div>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 ${config.textColor} backdrop-blur-sm`}>
            <span className="mr-1">{config.icon}</span>
            {config.name}
          </div>
        </div>
        
        {/* Tokenization Badge */}
        {asset.tokenized && (
          <div className="absolute top-3 right-3">
            <div className="flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 backdrop-blur-sm">
              <FiZap className="w-3 h-3 mr-1" />
              Tokenized
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 leading-tight">
          {asset.title}
        </h3>
        
        {/* Location */}
        <p className="text-gray-600 text-sm mb-3 flex items-center">
          <FiMapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="truncate">{getLocationText()}</span>
        </p>
        
        {/* Specifications */}
        {getSpecifications()}
        
        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-gray-900">
            ${asset.price?.toLocaleString()}
          </span>
          {getCertificationBadge()}
        </div>
        
        {/* Yield Info */}
        {getYieldInfo()}
        
        {/* Tokenization Info */}
        {asset.tokenized && asset.tokenPrice > 0 && (
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Token Price:</span>
              <span className="font-semibold">${asset.tokenPrice}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Available:</span>
              <span className="font-semibold">
                {asset.availableTokens?.toLocaleString()}/{asset.totalTokens?.toLocaleString()}
              </span>
            </div>
          </div>
        )}
        
        {/* Stats */}
        {getStatsInfo()}
        
        {/* Call to Action */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            {asset.category === 'defi-yield' ? 'View Pool' : 'View Details'}
          </span>
          <FiAward className={`w-4 h-4 ${config.accentColor} group-hover:scale-110 transition-transform`} />
        </div>
      </div>
    </motion.div>
  );
};

export default TrendingAssetCard;
