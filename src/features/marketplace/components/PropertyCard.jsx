import React from 'react';
import { FiMapPin, FiBarChart, FiStar, FiImage } from 'react-icons/fi';
import { BsCoin } from 'react-icons/bs';

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

  // Debug log to see what we're working with
  console.log(`🔍 NEW PropertyCard v2.0 Debug for "${property.title}":`, {
    id: property.id,
    tokenized: property.tokenized,
    isAiDiscovered,
    source: property.source,
    aiGenerated: property.aiGenerated,
    timestamp: new Date().toISOString()
  });

  // Get location text
  const getLocationText = () => {
    if (property.address) return property.address;
    if (property.location) return property.location;
    return 'Location not specified';
  };

  // Render property specifications
  const renderSpecifications = () => {
    if (property.beds && property.baths && property.sqft) {
      return (
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 mb-3">
          <div className="flex items-center space-x-4 text-sm text-gray-700">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
              <span className="font-medium">{property.beds}</span>
              <span className="ml-1 text-gray-500">beds</span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              <span className="font-medium">{property.baths}</span>
              <span className="ml-1 text-gray-500">baths</span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-1"></span>
              <span className="font-medium">{property.sqft.toLocaleString()}</span>
              <span className="ml-1 text-gray-500">sqft</span>
            </div>
          </div>
          {property.yearBuilt && (
            <div className="text-xs text-gray-500 font-medium">
              Built {property.yearBuilt}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Render tokenization status badge (only for actually tokenized properties)
  const renderTokenizationBadge = () => {
    // Only show tokenization badge if property is ACTUALLY tokenized AND not AI-discovered
    if (property.tokenized && !isAiDiscovered) {
      return (
        <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="font-medium">Tokenized as FXST-{String(property.id).padStart(3, '0')}</span>
            </div>
            <div className="text-xs text-green-600">
              {property.availableTokens || 0} tokens available
            </div>
          </div>
          {property.tokenPrice && (
            <div className="text-xs text-green-700 mt-1">
              ${property.tokenPrice}/token • Min: $100 investment
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Render community interest section (only for AI-discovered properties)
  const renderCommunityInterest = () => {
    if (isAiDiscovered && bidData) {
      // Get status-based styling
      const getStatusStyling = () => {
        switch (bidData.status) {
          case 'nearly_complete':
            return {
              borderColor: 'border-green-200',
              bgGradient: 'from-green-50 to-emerald-50',
              progressBar: 'from-green-500 to-emerald-600',
              statusIcon: '🔥',
              statusText: 'Almost Ready!',
              statusColor: 'text-green-700'
            };
          case 'high_momentum':
            return {
              borderColor: 'border-blue-200',
              bgGradient: 'from-blue-50 to-indigo-50',
              progressBar: 'from-blue-500 to-indigo-600',
              statusIcon: '⚡',
              statusText: 'High Momentum',
              statusColor: 'text-blue-700'
            };
          case 'building':
            return {
              borderColor: 'border-orange-200',
              bgGradient: 'from-orange-50 to-purple-50',
              progressBar: 'from-orange-500 to-purple-600',
              statusIcon: '📈',
              statusText: 'Building Interest',
              statusColor: 'text-orange-700'
            };
          default: // 'early'
            return {
              borderColor: 'border-gray-200',
              bgGradient: 'from-gray-50 to-slate-50',
              progressBar: 'from-gray-400 to-slate-500',
              statusIcon: '🌱',
              statusText: 'Early Stage',
              statusColor: 'text-gray-700'
            };
        }
      };

      const styling = getStatusStyling();

      return (
        <div className={`mb-4 p-3 bg-gradient-to-r ${styling.bgGradient} border ${styling.borderColor} rounded-lg`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <BsCoin className="w-4 h-4 text-orange-600 mr-1" />
              <span className="text-sm font-medium text-orange-800">Community Interest</span>
              <span className={`ml-2 text-xs ${styling.statusColor} flex items-center`}>
                <span className="mr-1">{styling.statusIcon}</span>
                {styling.statusText}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                {bidData.bidderCount} {bidData.bidderCount === 1 ? 'person' : 'people'}
              </span>
              <span className="text-xs text-orange-600 font-medium">
                ETA: {bidData.timeEstimate}
              </span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Interest: <strong className="text-orange-600">{bidData.currentInterest?.toLocaleString() || 0} FXCT</strong></span>
              <span>Target: <strong className="text-purple-600">{bidData.threshold?.toLocaleString() || 0} FXCT</strong></span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden relative">
              <div 
                className={`bg-gradient-to-r ${styling.progressBar} h-2 rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${Math.min(bidData.progress || 0, 100)}%` }}
              ></div>
              {/* Pulsing effect for active properties */}
              {bidData.progress > 70 && (
                <div 
                  className={`absolute top-0 left-0 bg-gradient-to-r ${styling.progressBar} h-2 rounded-full opacity-50 animate-pulse`}
                  style={{ width: `${Math.min(bidData.progress || 0, 100)}%` }}
                ></div>
              )}
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-orange-600 font-medium">
                {(bidData.progress || 0).toFixed(1)}% of target
              </span>
              <span className="text-purple-600 font-medium">
                {((bidData.threshold || 0) - (bidData.currentInterest || 0)).toLocaleString()} FXCT needed
              </span>
            </div>
          </div>

          {/* User's Current Interest */}
          {userBid && (
            <div className="bg-white/70 rounded-lg p-2 mb-2 border border-orange-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-orange-700 font-medium">Your interest:</span>
                <span className="text-orange-800 font-bold">{userBid.toLocaleString()} FXCT</span>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          {bidData.recentBids && bidData.recentBids.length > 0 && (
            <div className="bg-white/50 rounded-lg p-2 mb-2">
              <div className="text-xs text-gray-600 font-medium mb-1">Recent interest:</div>
              <div className="space-y-1">
                {bidData.recentBids.slice(0, 2).map((bid, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">
                      {bid.userId.replace(bid.userId.slice(4, -3), '***')} expressed interest
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-orange-600">
                        {bid.amount.toLocaleString()} FXCT
                      </span>
                      <span className="text-gray-500">
                        {Math.floor((Date.now() - bid.timestamp) / 60000)}m ago
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status indicator and call to action */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-purple-700 font-medium flex items-center">
              🎯 <span className="ml-1">
                {bidData.progress > 80 ? 'Almost ready to acquire!' : 
                 bidData.progress > 50 ? 'Strong community interest' : 
                 'Help acquire this property'}
              </span>
            </span>
            <div className="flex items-center space-x-1">
              {bidData.trendDirection === 'up' && (
                <>
                  <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-green-600">Trending up</span>
                </>
              )}
              {bidData.trendDirection === 'stable' && (
                <>
                  <span className="w-1 h-1 bg-yellow-500 rounded-full"></span>
                  <span className="text-yellow-600">Steady</span>
                </>
              )}
              {bidData.trendDirection === 'down' && (
                <>
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  <span className="text-red-600">Slowing</span>
                </>
              )}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // CRYSTAL CLEAR ACTION BUTTON LOGIC
  const renderActionButtons = () => {
    console.log(`🎯 Button Logic for "${property.title}":`, {
      isAiDiscovered,
      tokenized: property.tokenized,
      decision: isAiDiscovered ? 'SHOW_INTEREST' : (property.tokenized ? 'BUY_TOKENS' : 'BID_FXCT')
    });

    return (
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
        {/* PRIMARY ACTION BUTTON */}
        {isAiDiscovered ? (
          // AI-DISCOVERED: Always show "Show Interest" button (orange)
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `/show-interest/${property.id}`;
            }}
            className="flex-1 bg-orange-600 text-white text-sm py-2 px-3 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors font-medium flex items-center justify-center"
            aria-label={`Show interest in ${property.title}`}
          >
            <BsCoin className="w-4 h-4 mr-1" />
            Show Interest
          </button>
        ) : property.tokenized ? (
          // TOKENIZED: Show "Buy FXST" button (green)
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `/invest/${property.id}`;
            }}
            className="flex-1 bg-green-600 text-white text-sm py-2 px-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium flex items-center justify-center"
            aria-label={`Buy FXST tokens for ${property.title}`}
          >
            <BsCoin className="w-4 h-4 mr-1" />
            Buy FXST-{String(property.id).padStart(3, '0')}
          </button>
        ) : (
          // APPROVED NON-TOKENIZED: Show "Bid with FXCT" button (blue)
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `/bid/${property.id}`;
            }}
            className="flex-1 bg-blue-600 text-white text-sm py-2 px-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium flex items-center justify-center"
            aria-label={`Bid FXCT tokens for ${property.title}`}
          >
            <BsCoin className="w-4 h-4 mr-1" />
            Bid with FXCT
          </button>
        )}

        {/* SECONDARY ACTION BUTTON */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick(property);
          }}
          className="flex-1 border border-gray-300 text-gray-700 text-sm py-2 px-3 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium flex items-center justify-center"
          aria-label={`View details for ${property.title}`}
        >
          <FiBarChart className="w-4 h-4 mr-1" />
          Details
        </button>
      </div>
    );
  };

  // Render explanation text
  const renderExplanation = () => {
    if (isAiDiscovered) {
      return (
        <div className="mt-2 text-xs bg-orange-50 p-2 rounded border border-orange-200">
          <span className="text-orange-700">
            💡 <strong>Show Interest:</strong> Express your interest in this AI-discovered property. High interest levels help our team prioritize acquisition negotiations with sellers.
          </span>
        </div>
      );
    } else if (!property.tokenized) {
      return (
        <div className="mt-2 text-xs bg-blue-50 p-2 rounded border border-blue-200">
          <span className="text-blue-700">
            💡 <strong>How it works:</strong> Bid FXCT to signal interest. When enough users commit, our team negotiates with sellers for better terms and tokenizes the property.
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <article 
      className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:scale-[1.01] transition-all duration-300 cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 relative border border-gray-200 ${
        layout === 'list' ? 'flex' : ''
      } ${isInComparison ? 'ring-2 ring-blue-500 ring-offset-2' : ''} ${isAiDiscovered && bidData ? 'border-orange-200 shadow-orange-100' : ''}`}
      tabIndex="0"
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(property);
        }
      }}
      onClick={() => onClick(property)}
      aria-label={`View details for ${property.title} at ${getLocationText()}, priced at $${property.price.toLocaleString()}`}
    >
      {/* IMAGE SECTION */}
      {property.images && property.images.length > 0 ? (
        <div className={`${layout === 'list' ? 'w-48 h-32' : 'h-48'} relative`}>
          <img 
            src={property.images[0]} 
            alt={`${property.title} - ${property.propertyType || 'Property'}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.warn('❌ Failed to load image for property:', property.title);
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = `
                <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                  <div class="text-center text-gray-500">
                    <span class="text-xs">No Image Available</span>
                  </div>
                </div>
              `;
            }}
          />
          {isInComparison && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              In Comparison
            </div>
          )}
        </div>
      ) : (
        <div className={`${layout === 'list' ? 'w-48 h-32' : 'h-48'} relative bg-gray-200 flex items-center justify-center`}>
          <div className="text-center text-gray-500">
            <FiImage className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Real images loading...</p>
            <p className="text-xs opacity-75">Zillow photos only</p>
          </div>
          {isInComparison && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              In Comparison
            </div>
          )}
        </div>
      )}

      {/* CONTENT SECTION */}
      <div className="p-4 flex-1">
        {/* HEADER */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 mr-2">
            <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1">{property.title}</h3>
            <p className="text-gray-500 text-sm flex items-center">
              <FiMapPin className="w-4 h-4 mr-1 text-gray-400" />
              <span className="sr-only">Located at:</span>
              {getLocationText()}
            </p>
          </div>
          <div className="flex items-center space-x-1 flex-shrink-0">
            {/* Compare Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCompareProperty(property.id);
              }}
              className={`p-2 rounded-full bg-white shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:shadow-md ${
                isInComparison ? 'text-blue-600 border-blue-200 bg-blue-50' : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-label={isInComparison ? `Remove ${property.title} from comparison` : `Add ${property.title} to comparison`}
              tabIndex="0"
            >
              <FiBarChart className="w-4 h-4" />
            </button>
            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(property.id);
              }}
              className={`p-2 rounded-full bg-white shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all hover:shadow-md ${
                isFavorite ? 'text-red-500 border-red-200 bg-red-50' : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-label={isFavorite ? `Remove ${property.title} from favorites` : `Add ${property.title} to favorites`}
              tabIndex="0"
            >
              <FiStar className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
        
        {/* PRICE AND STATS */}
        <div className="mb-3">
          {/* Main Price */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl font-bold text-blue-600">
              ${(property.price / 1000).toFixed(0)}K
            </span>
            {property.monthlyRent && (
              <div className="text-right">
                <div className="text-sm font-semibold text-green-600">
                  ${property.monthlyRent}/mo
                </div>
                <div className="text-xs text-gray-500">Rental Income</div>
              </div>
            )}
          </div>
          
          {/* Financial Metrics Row */}
          {property.expectedROI && (
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-1">Expected ROI:</span>
                <span className="font-semibold text-green-600">{property.expectedROI}%</span>
              </div>
              {property.monthlyRent && property.price && (
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-1">Cap Rate:</span>
                  <span className="font-semibold text-purple-600">
                    {((property.monthlyRent * 12 / property.price) * 100).toFixed(1)}%
                  </span>
                </div>
              )}
              {property.monthlyRent && (
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-1">Monthly:</span>
                  <span className="font-semibold text-blue-600">
                    ${Math.floor(property.monthlyRent * (property.expectedROI / 100 / 12)).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* SPECIFICATIONS */}
        {renderSpecifications()}
        
        {/* TOKENIZATION STATUS (only for actually tokenized properties) */}
        {renderTokenizationBadge()}
        
        {/* COMMUNITY INTEREST (only for AI-discovered properties) */}
        {renderCommunityInterest()}

        {/* ACTION BUTTONS */}
        {renderActionButtons()}
        
        {/* EXPLANATION TEXT */}
        {renderExplanation()}
      </div>
    </article>
  );
};

export default PropertyCard;
