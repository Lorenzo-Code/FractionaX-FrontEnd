import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiHeart,
  FiBookmark,
  FiShare2,
  FiEye,
  FiDollarSign,
  FiTrendingUp,
  FiUsers,
  FiMapPin,
  FiHome,
  FiSquare,
  FiCalendar,
  FiArrowRight,
  FiStar,
  FiTarget,
  FiActivity,
  FiThumbsUp,
  FiMessageCircle,
  FiBell,
  FiDroplet
} from 'react-icons/fi';
import { BsCoin } from 'react-icons/bs';

const PersonalizedPropertyCard = ({
  property,
  isLiked,
  isBookmarked,
  isWatched,
  userCommitment,
  onLike,
  onBookmark,
  onShare,
  onCommit,
  onWatch,
  onClick,
  userPreferences
}) => {
  const [showCommitModal, setShowCommitModal] = useState(false);
  const [commitAmount, setCommitAmount] = useState(1000);
  const [showDetails, setShowDetails] = useState(false);

  // Calculate match score with user preferences
  const calculateMatchScore = () => {
    let score = 0;
    const maxScore = 100;

    // Property type preference (20 points)
    if (userPreferences?.preferredPropertyTypes?.includes(property.propertyType)) {
      score += 20;
    }

    // Price range preference (25 points)
    if (userPreferences?.maxInvestmentAmount && property.price <= userPreferences.maxInvestmentAmount * 100) {
      score += 25;
    }

    // Location preference (20 points)
    const propertyLocation = property.address.split(',')[1]?.trim();
    if (userPreferences?.preferredLocations?.some(loc => 
      propertyLocation?.toLowerCase().includes(loc.toLowerCase())
    )) {
      score += 20;
    }

    // ROI alignment (15 points)
    if (property.expectedROI >= 8) {
      score += 15;
    }

    // Trending/hotness (10 points)
    if (property.userInteractions?.trending) {
      score += 10;
    }

    // Recent activity (10 points)
    if (property.userInteractions?.recentActivity?.length > 0) {
      score += 10;
    }

    return Math.min(score, maxScore);
  };

  const matchScore = calculateMatchScore();

  const handleCommit = () => {
    onCommit(commitAmount);
    setShowCommitModal(false);
    setCommitAmount(1000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getHotnessColor = (hotness) => {
    if (hotness >= 80) return 'bg-red-500';
    if (hotness >= 60) return 'bg-orange-500';
    if (hotness >= 40) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const getMatchColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.images?.[0] || property.image || property.imgSrc || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&auto=format'}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            // Only use fallback image if the backend image fails to load
            if (!e.target.src.includes('unsplash')) {
              e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&auto=format';
            }
          }}
        />
        
        {/* Overlay Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {/* Match Score */}
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${getMatchColor(matchScore)}`}>
            {matchScore}% Match
          </span>
          
          {/* Hotness Indicator */}
          {property.userInteractions?.hotness && (
            <div className="flex items-center bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs">
              <div className={`w-2 h-2 rounded-full mr-1 ${getHotnessColor(property.userInteractions.hotness)}`}></div>
              🔥 {property.userInteractions.hotness}
            </div>
          )}
          
          {/* Trending Badge */}
          {property.userInteractions?.trending && (
            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              📈 Trending
            </span>
          )}
        </div>
        
        {/* Quick Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike();
            }}
            className={`p-2 rounded-full backdrop-blur-sm transition-all ${
              isLiked 
                ? 'bg-red-500 text-white shadow-lg' 
                : 'bg-white bg-opacity-80 text-gray-700 hover:bg-red-100 hover:text-red-600'
            }`}
          >
            <FiHeart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookmark();
            }}
            className={`p-2 rounded-full backdrop-blur-sm transition-all ${
              isBookmarked 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'bg-white bg-opacity-80 text-gray-700 hover:bg-blue-100 hover:text-blue-600'
            }`}
          >
            <FiBookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onWatch();
            }}
            className={`p-2 rounded-full backdrop-blur-sm transition-all ${
              isWatched 
                ? 'bg-purple-500 text-white shadow-lg' 
                : 'bg-white bg-opacity-80 text-gray-700 hover:bg-purple-100 hover:text-purple-600'
            }`}
          >
            <FiBell className={`w-4 h-4 ${isWatched ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        {/* User Commitment Indicator */}
        {userCommitment > 0 && (
          <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            💰 ${userCommitment.toLocaleString()} Committed
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title and Address */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-1">
            {property.title}
          </h3>
          <p className="text-sm text-gray-600 flex items-center line-clamp-1">
            <FiMapPin className="w-3 h-3 mr-1" />
            {property.address}
          </p>
        </div>

        {/* Price and ROI */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-green-600">
              {formatCurrency(property.price)}
            </span>
            {property.tokenized && (
              <div className="ml-2 text-xs">
                <div className="flex items-center text-blue-600">
                  <BsCoin className="w-3 h-3 mr-1" />
                  ${property.tokenPrice}/token
                </div>
              </div>
            )}
          </div>
          {property.expectedROI && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">
              {property.expectedROI}% ROI
            </span>
          )}
        </div>

        {/* Property Details */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              🛏️ {property.beds} beds
            </span>
            <span className="flex items-center">
              🛁 {property.baths} baths
            </span>
            <span className="flex items-center">
              <FiSquare className="w-4 h-4 mr-1" />
              {property.sqft?.toLocaleString()} sqft
            </span>
          </div>
        </div>

        {/* Community Interaction Stats */}
        {property.userInteractions && (
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <span className="font-medium">Community Activity</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(!showDetails);
                }}
                className="text-blue-600 hover:text-blue-700"
              >
                {showDetails ? 'Less' : 'More'}
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <div className="text-sm font-bold text-red-600">
                  {property.userInteractions.totalLikes}
                </div>
                <div className="text-xs text-gray-500">Likes</div>
              </div>
              <div>
                <div className="text-sm font-bold text-blue-600">
                  {property.userInteractions.totalViews}
                </div>
                <div className="text-xs text-gray-500">Views</div>
              </div>
              <div>
                <div className="text-sm font-bold text-green-600">
                  {property.userInteractions.totalCommitments}
                </div>
                <div className="text-xs text-gray-500">Interest</div>
              </div>
              <div>
                <div className="text-sm font-bold text-purple-600">
                  {property.userInteractions.totalShares}
                </div>
                <div className="text-xs text-gray-500">Shares</div>
              </div>
            </div>
            
            {showDetails && property.userInteractions.recentActivity && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-600 mb-2 font-medium">Recent Activity</div>
                {property.userInteractions.recentActivity.slice(0, 2).map((activity, index) => (
                  <div key={index} className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>
                      {activity.type === 'like' && '❤️'} 
                      {activity.type === 'commitment' && '💰'} 
                      {activity.type === 'share' && '📤'} 
                      {activity.user} {activity.type}
                      {activity.amount && ` $${activity.amount.toLocaleString()}`}
                    </span>
                    <span>{Math.floor((Date.now() - activity.timestamp) / 60000)}m ago</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick(property);
            }}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center justify-center"
          >
            View Details
            <FiArrowRight className="w-4 h-4 ml-1" />
          </button>
          
          {!property.tokenized ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCommitModal(true);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex items-center"
            >
              <FiTarget className="w-4 h-4 mr-1" />
              Show Interest
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCommitModal(true);
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm flex items-center"
            >
              <BsCoin className="w-4 h-4 mr-1" />
              Show Interest
            </button>
          )}
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare();
            }}
            className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FiShare2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Commit Modal */}
      {showCommitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Commit Interest in {property.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Show your interest by committing FXCT tokens. This helps us prioritize which properties to acquire for tokenization.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commitment Amount (USD)
              </label>
              <input
                type="number"
                value={commitAmount}
                onChange={(e) => setCommitAmount(Number(e.target.value))}
                min="100"
                step="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum commitment: $100 • Your FXCT tokens will be used to signal interest
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <div className="flex items-center text-blue-800 text-sm">
                <FiThumbsUp className="w-4 h-4 mr-2" />
                Benefits of committing early:
              </div>
              <ul className="text-xs text-blue-700 mt-1 ml-6 list-disc">
                <li>Priority access when property becomes available</li>
                <li>Better negotiated purchase price</li>
                <li>Guaranteed allocation during tokenization</li>
              </ul>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowCommitModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCommit}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Commit ${commitAmount.toLocaleString()}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default PersonalizedPropertyCard;
