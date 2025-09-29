import React, { useState, useRef, useEffect } from 'react';
import { FiMapPin, FiBarChart, FiStar, FiImage, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { BsCoin, BsRobot } from 'react-icons/bs';

const PropertyCard = ({ 
  property, 
  isFavorite, 
  onToggleFavorite, 
  onClick, 
  layout = 'grid', 
  compareList = [], 
  onCompareProperty, 
  bidData, 
  userBid, 
  isAiDiscovered = false 
}) => {
  const isInComparison = compareList.includes(property.id);

  // Get location text
  const getLocationText = () => {
    if (property.address) {
      return property.address; // Show full street address
    }
    if (property.location) return property.location;
    return 'Location not specified';
  };

  // Get full address for tooltip
  const getFullAddress = () => {
    return property.address || property.location || 'Address not available';
  };

  // Calculate key investment metrics
  const getInvestmentMetrics = () => {
    const baseMetrics = {
      roi: property.expectedROI || 0,
      capRate: property.monthlyRent && property.price 
        ? ((property.monthlyRent * 12 / property.price) * 100).toFixed(1)
        : null
    };

    // Add community interest for AI-discovered properties
    if (isAiDiscovered && bidData) {
      baseMetrics.communityInterest = {
        progress: bidData.progress || 0,
        bidders: bidData.bidderCount || 0,
        status: bidData.status || 'early'
      };
    }

    // Add customer stats for approved properties
    if (!isAiDiscovered && property.stats) {
      baseMetrics.customerStats = {
        views: property.stats.views || 0,
        saves: property.stats.saves || 0,
        daysOnMarket: property.stats.daysOnMarket || 0
      };
    }

    return baseMetrics;
  };

  const metrics = getInvestmentMetrics();

  // Get property type badge color
  const getPropertyTypeBadge = () => {
    const type = property.propertyType || 'property';
    const colorMap = {
      house: 'bg-blue-100 text-blue-700',
      condo: 'bg-purple-100 text-purple-700',
      townhouse: 'bg-green-100 text-green-700',
      apartment: 'bg-orange-100 text-orange-700'
    };
    return {
      text: type.charAt(0).toUpperCase() + type.slice(1),
      classes: colorMap[type] || 'bg-gray-100 text-gray-700'
    };
  };

  const propertyBadge = getPropertyTypeBadge();

  // Get property source badge
  const getSourceBadge = () => {
    const source = property.source || 'platform';
    const sourceMap = {
      'ai-loopnet-gpt': { text: 'AI + LoopNet', classes: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white', icon: '🤖' },
      'suggested-deals-fallback': { text: 'Suggested Deal', classes: 'bg-orange-500 text-white', icon: '💡' },
      'ai-search-direct': { text: 'AI Search', classes: 'bg-purple-500 text-white', icon: '🔍' },
      'ai-search-legacy': { text: 'AI Discovery', classes: 'bg-indigo-500 text-white', icon: '🎯' },
      'mls': { text: 'MLS', classes: 'bg-green-500 text-white', icon: '🏠️' },
      'agent': { text: 'Agent Listed', classes: 'bg-blue-500 text-white', icon: '👨‍💼' },
      'platform': { text: 'Platform', classes: 'bg-gray-500 text-white', icon: '🏢' }
    };
    
    // If property has CLIP ID, enhance the badge
    const baseBadge = sourceMap[source] || sourceMap.platform;
    if (property.clipId && property.clipStatus === 'found') {
      return {
        ...baseBadge,
        text: baseBadge.text + ' + CLIP',
        classes: 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
      };
    }
    
    return baseBadge;
  };

  const sourceBadge = getSourceBadge();

  // Smart price formatting function
  const formatPrice = (price) => {
    if (!price || isNaN(price)) return 'Price TBD';
    
    if (price >= 1000000) {
      // For millions: $10.7M, $1.2M, etc.
      const millions = price / 1000000;
      if (millions >= 10) {
        return `$${millions.toFixed(1)}M`;
      } else {
        return `$${millions.toFixed(1)}M`;
      }
    } else if (price >= 100000) {
      // For hundreds of thousands: $875K, $250K, etc.
      const thousands = price / 1000;
      return `$${Math.round(thousands)}K`;
    } else if (price >= 1000) {
      // For thousands: $25K, $99K, etc.
      const thousands = price / 1000;
      return `$${thousands.toFixed(0)}K`;
    } else {
      // For under $1000: just show the full amount
      return `$${price.toLocaleString()}`;
    }
  };

  // Render the main investment highlight
  const renderInvestmentHighlight = () => {
    if (isAiDiscovered && bidData) {
      // Community interest highlight
      const statusConfig = {
        nearly_complete: { color: 'green', icon: '🔥', text: 'Almost Ready!' },
        high_momentum: { color: 'blue', icon: '⚡', text: 'High Interest' },
        building: { color: 'orange', icon: '📈', text: 'Growing' },
        early: { color: 'gray', icon: '🌱', text: 'Early Stage' }
      };
      
      const config = statusConfig[bidData.status] || statusConfig.early;
      
      return (
        <div className={`mb-3 p-2 bg-${config.color}-50 border border-${config.color}-200 rounded-lg`}>
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs font-medium text-${config.color}-700 flex items-center`}>
              <span className="mr-1">{config.icon}</span>
              Community Interest
            </span>
            <span className={`text-xs text-${config.color}-600 font-semibold`}>
              {bidData.progress.toFixed(0)}% to target
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className={`text-${config.color}-600`}>
              {bidData.bidderCount} {bidData.bidderCount === 1 ? 'person' : 'people'} interested
            </span>
            <span className={`text-${config.color}-500`}>
              {((bidData.threshold || 0) - (bidData.currentInterest || 0)).toLocaleString()} FXCT needed
            </span>
          </div>
        </div>
      );
    } else if (property.tokenized) {
      // Tokenized property highlight
      return (
        <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-green-700 flex items-center">
              <span className="mr-1">💎</span>
              Ready to Invest
            </span>
            <span className="text-xs text-green-600 font-semibold">
              ${property.tokenPrice}/token
            </span>
          </div>
          <div className="text-xs text-green-600">
            {property.availableTokens || 0} tokens available • Min: $100
          </div>
        </div>
      );
    } else if (metrics.customerStats) {
      // Customer interest for approved properties
      const interestLevel = metrics.customerStats.saves > 15 ? 'high' : 
                          metrics.customerStats.saves > 8 ? 'medium' : 'low';
      const levelConfig = {
        high: { color: 'green', icon: '🔥', text: 'High Interest' },
        medium: { color: 'blue', icon: '📈', text: 'Popular' },
        low: { color: 'gray', icon: '👀', text: 'New Listing' }
      };
      const config = levelConfig[interestLevel];
      
      return (
        <div className={`mb-3 p-2 bg-${config.color}-50 border border-${config.color}-200 rounded-lg`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium text-${config.color}-700 flex items-center`}>
              <span className="mr-1">{config.icon}</span>
              {config.text}
            </span>
            <div className="flex items-center space-x-3 text-xs">
              <span className={`text-${config.color}-600`}>{metrics.customerStats.saves} saves</span>
              <span className={`text-${config.color}-600`}>{metrics.customerStats.views} views</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <article 
      className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 relative border border-gray-200 ${
        layout === 'list' ? 'flex max-h-48' : ''
      } ${isInComparison ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      tabIndex="0"
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(property);
        }
      }}
      onClick={() => onClick(property)}
      aria-label={`View details for ${property.title} in ${getLocationText()}, priced at $${property.price.toLocaleString()}`}
    >
      {/* IMAGE SECTION */}
      <div className={`${layout === 'list' ? 'w-48 h-48' : 'h-48'} relative bg-gray-100`}>
        {property.images && property.images.length > 0 ? (
          <>
            {/* Simple carousel */}
            <Carousel images={property.images} title={property.title} propertyType={property.propertyType} />

            {/* Property Type Badge */}
            <div className="absolute top-2 left-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${propertyBadge.classes}`}>
                {propertyBadge.text}
              </span>
            </div>
            
            {/* Property Source Badge */}
            {property.source && property.source !== 'platform' && (
              <div className="absolute top-2 left-2 mt-8">
                <span className={`px-2 py-1 rounded-full text-xs font-medium shadow-sm ${sourceBadge.classes}`}>
                  <span className="mr-1">{sourceBadge.icon}</span>
                  {sourceBadge.text}
                </span>
              </div>
            )}
            
            {/* AI Analysis Badge */}
            {property.hasAIAnalysis && (
              <div className="absolute top-2 right-2 mt-8">
                <span className="px-2 py-1 rounded-full text-xs font-medium shadow-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  <BsRobot className="w-3 h-3 mr-1 inline" />
                  AI Enhanced
                </span>
              </div>
            )}
            
            {/* CLIP ID Badge */}
            {property.clipId && property.clipStatus === 'found' && (
              <div className="absolute bottom-2 right-2">
                <span className="px-2 py-1 rounded-full text-xs font-medium shadow-sm bg-gradient-to-r from-orange-500 to-red-500 text-white" title={`CoreLogic CLIP ID: ${property.clipId}`}>
                  🎯 CLIP
                </span>
              </div>
            )}
            
            {/* Multi-image indicator */}
            {property.images.length > 1 && (
              <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs flex items-center">
                <FiImage className="w-3 h-3 mr-1" />
                {property.images.length}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <FiImage className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">Loading images...</p>
            </div>
          </div>
        )}
        
        {/* Comparison indicator */}
        {isInComparison && (
          <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            In Comparison
          </div>
        )}
      </div>

      {/* CONTENT SECTION */}
      <div className={`p-4 flex-1 ${layout === 'list' ? 'flex flex-col justify-between' : ''}`}>
        
        {/* HEADER SECTION */}
        <div className="mb-3">
          {/* Title and Actions Row */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 mr-3">
              <h3 className="font-bold text-lg text-gray-900 leading-tight line-clamp-2 mb-1">
                {property.title}
              </h3>
              {/* Location */}
              <div className="flex items-center text-gray-500 text-sm mb-1" title={getFullAddress()}>
                <FiMapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">{getLocationText()}</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-1 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCompareProperty(property.id);
                }}
                className={`p-1.5 rounded-lg transition-all ${
                  isInComparison 
                    ? 'text-blue-600 bg-blue-50 border border-blue-200' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
                aria-label={isInComparison ? `Remove from comparison` : `Add to comparison`}
              >
                <FiBarChart className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(property.id);
                }}
                className={`p-1.5 rounded-lg transition-all ${
                  isFavorite 
                    ? 'text-red-500 bg-red-50 border border-red-200' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
                aria-label={isFavorite ? `Remove from favorites` : `Add to favorites`}
              >
                <FiStar className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Price and Key Metrics */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-2xl font-bold text-gray-900" title={`$${property.price.toLocaleString()}`}>
                {formatPrice(property.price)}
              </div>
              {property.monthlyRent && (
                <div className="text-sm text-green-600 font-medium" title={`$${property.monthlyRent.toLocaleString()}/month rental income`}>
                  ${property.monthlyRent.toLocaleString()}/mo rent
                </div>
              )}
            </div>
            
            {/* Quick Stats */}
            <div className="text-right">
              {metrics.roi > 0 && (
                <div className="text-sm font-semibold text-green-600 mb-1">
                  {metrics.roi}% ROI
                </div>
              )}
              {metrics.capRate && (
                <div className="text-xs text-purple-600">
                  {metrics.capRate}% Cap Rate
                </div>
              )}
            </div>
          </div>

          {/* Property Specs */}
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            {/* Show different specs based on property type */}
            {property.propertyType === 'multifamily' || property.subcategory === 'apartment' ? (
              // Multifamily/Apartment properties
              <>
                {property.investmentMetrics?.totalUnits && (
                  <span>{property.investmentMetrics.totalUnits} unit{property.investmentMetrics.totalUnits !== 1 ? 's' : ''}</span>
                )}
                {property.investmentMetrics?.stories && (
                  <>
                    <span>•</span>
                    <span>{property.investmentMetrics.stories} stor{property.investmentMetrics.stories !== 1 ? 'ies' : 'y'}</span>
                  </>
                )}
                {property.sqft && (
                  <>
                    <span>•</span>
                    <span>{property.sqft.toLocaleString()} sqft</span>
                  </>
                )}
                {property.yearBuilt && (
                  <>
                    <span>•</span>
                    <span>Built {property.yearBuilt}</span>
                  </>
                )}
                {property.yearRenovated && (
                  <>
                    <span>•</span>
                    <span>Renovated {property.yearRenovated}</span>
                  </>
                )}
              </>
            ) : property.propertyType === 'commercial' && property.subcategory === 'business' ? (
              // Commercial Business Properties (Car Washes, etc.) - Condensed
              <>
                {/* Show primary business metric */}
                {property.businessMetrics?.expressTunnels ? (
                  <span>{property.businessMetrics.expressTunnels} express tunnel{property.businessMetrics.expressTunnels !== 1 ? 's' : ''}</span>
                ) : property.businessMetrics?.washBays && property.businessMetrics.washBays > 1 ? (
                  <span>{property.businessMetrics.washBays} wash bays</span>
                ) : (
                  <span>Car Wash</span>
                )}
                
                {/* Show operational status prominently */}
                {property.operationalStatus && (
                  <>
                    <span>•</span>
                    <span className="capitalize text-green-600 font-semibold">{property.operationalStatus.replace(/_/g, ' ')}</span>
                  </>
                )}
                
                {/* Show lot size and building size combined */}
                {property.lotSize && property.sqft ? (
                  <>
                    <span>•</span>
                    <span>{property.lotSize}ac • {(property.sqft/1000).toFixed(1)}k sqft</span>
                  </>
                ) : property.lotSize ? (
                  <>
                    <span>•</span>
                    <span>{property.lotSize} acres</span>
                  </>
                ) : property.sqft ? (
                  <>
                    <span>•</span>
                    <span>{property.sqft.toLocaleString()} sqft</span>
                  </>
                ) : null}
                
                {/* Show most recent year (renovated takes priority) */}
                {property.yearRenovated ? (
                  <>
                    <span>•</span>
                    <span>Renovated {property.yearRenovated}</span>
                  </>
                ) : property.yearBuilt ? (
                  <>
                    <span>•</span>
                    <span>Built {property.yearBuilt}</span>
                  </>
                ) : null}
              </>
            ) : property.propertyType === 'commercial' ? (
              // General Commercial Properties
              <>
                {property.sqft && (
                  <span>{property.sqft.toLocaleString()} sqft</span>
                )}
                {property.lotSize && (
                  <>
                    <span>•</span>
                    <span>{property.lotSize} acres</span>
                  </>
                )}
                {property.yearBuilt && (
                  <>
                    <span>•</span>
                    <span>Built {property.yearBuilt}</span>
                  </>
                )}
                {property.yearRenovated && (
                  <>
                    <span>•</span>
                    <span>Renovated {property.yearRenovated}</span>
                  </>
                )}
              </>
            ) : (
              // Regular residential properties
              <>
                {property.beds && (
                  <span>{property.beds} bed{property.beds !== 1 ? 's' : ''}</span>
                )}
                {property.baths && (
                  <>
                    <span>•</span>
                    <span>{property.baths} bath{property.baths !== 1 ? 's' : ''}</span>
                  </>
                )}
                {property.sqft && (
                  <>
                    <span>•</span>
                    <span>{property.sqft.toLocaleString()} sqft</span>
                  </>
                )}
                {property.yearBuilt && (
                  <>
                    <span>•</span>
                    <span>Built {property.yearBuilt}</span>
                  </>
                )}
              </>
            )}
          </div>
          
          {/* Property Identifiers (CLIP ID, APN) */}
          {(property.clipId || property.apn) && (
            <div className="flex items-center space-x-3 text-xs text-gray-500 mb-2">
              {property.clipId && (
                <div className="flex items-center bg-orange-50 border border-orange-200 rounded px-2 py-1" title="CoreLogic Unique Property Identifier">
                  <span className="font-mono text-orange-700">CLIP: {property.clipId}</span>
                  {property.clipStatus && (
                    <span className={`ml-1 w-2 h-2 rounded-full ${
                      property.clipStatus === 'found' ? 'bg-green-400' : 
                      property.clipStatus === 'fallback' ? 'bg-yellow-400' : 'bg-gray-400'
                    }`} title={`Status: ${property.clipStatus}`}></span>
                  )}
                </div>
              )}
              {property.apn && (
                <div className="flex items-center bg-blue-50 border border-blue-200 rounded px-2 py-1" title="Assessor Parcel Number">
                  <span className="font-mono text-blue-700">APN: {property.apn}</span>
                  {property.apnStatus && (
                    <span className={`ml-1 w-2 h-2 rounded-full ${
                      property.apnStatus === 'found' ? 'bg-green-400' : 
                      property.apnStatus === 'fallback' ? 'bg-yellow-400' : 'bg-gray-400'
                    }`} title={`Status: ${property.apnStatus}`}></span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* INVESTMENT STATUS SECTION */}
        {renderInvestmentHighlight()}

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-2 mt-auto">
          {/* PRIMARY ACTION */}
          {isAiDiscovered ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/show-interest/${property.id}`;
              }}
              className="flex-1 bg-orange-600 text-white text-sm py-2.5 px-3 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors font-medium flex items-center justify-center"
            >
              <BsCoin className="w-4 h-4 mr-1" />
              Show Interest
            </button>
          ) : property.tokenized ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/invest/${property.id}`;
              }}
              className="flex-1 bg-green-600 text-white text-sm py-2.5 px-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium flex items-center justify-center"
            >
              <BsCoin className="w-4 h-4 mr-1" />
              Invest Now
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/bid/${property.id}`;
              }}
              className="flex-1 bg-blue-600 text-white text-sm py-2.5 px-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium flex items-center justify-center"
            >
              <BsCoin className="w-4 h-4 mr-1" />
              Place Bid
            </button>
          )}

          {/* SECONDARY ACTION */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick(property);
            }}
            className="px-4 py-2.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Details
          </button>
        </div>
      </div>
    </article>
  );
};

// Lightweight image carousel used within PropertyCard image section
const Carousel = ({ images, title, propertyType }) => {
  const [index, setIndex] = useState(0);
  const total = images.length;

  const prev = (e) => {
    e?.stopPropagation?.();
    setIndex((i) => (i - 1 + total) % total);
  };
  const next = (e) => {
    e?.stopPropagation?.();
    setIndex((i) => (i + 1) % total);
  };

  useEffect(() => {
    // Reset index if images array changes size
    if (index >= total) setIndex(0);
  }, [total]);

  return (
    <div className="w-full h-full relative">
      <img
        src={images[index]}
        alt={`${title} - ${propertyType || 'Property'}`}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />

      {total > 1 && (
        <>
          {/* Prev/Next Controls */}
          <button
            aria-label="Previous image"
            onClick={prev}
            className="absolute inset-y-0 left-0 px-2 flex items-center bg-black/0 hover:bg-black/20 text-white"
          >
            <FiChevronLeft className="w-6 h-6 drop-shadow" />
          </button>
          <button
            aria-label="Next image"
            onClick={next}
            className="absolute inset-y-0 right-0 px-2 flex items-center bg-black/0 hover:bg-black/20 text-white"
          >
            <FiChevronRight className="w-6 h-6 drop-shadow" />
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to image ${i + 1}`}
                onClick={(e) => { e.stopPropagation(); setIndex(i); }}
                className={`w-2 h-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/60'} ring-1 ring-black/20`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PropertyCard;
