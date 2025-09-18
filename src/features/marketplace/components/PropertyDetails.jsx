import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiX, FiHeart, FiShare2, FiMapPin, FiCalendar, FiTrendingUp, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { BsCoin, BsRobot } from "react-icons/bs";

const PropertyDetails = ({ 
  property, 
  isOpen, 
  onClose, 
  onTokenize, 
  isFavorite, 
  onToggleFavorite,
  isAiDiscovered = false 
}) => {
  // State for collapsible AI analysis sections
  const [expandedAISection, setExpandedAISection] = useState(null);
  
  // Check if property has AI analysis
  const hasAIAnalysis = property?.aiIntelligence && Object.keys(property.aiIntelligence).length > 0;
  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price?.toLocaleString()}`;
  };

  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="relative">
          <img
            src={property.images[0] || "/api/placeholder/800/400"}
            alt={property.title}
            className="w-full h-64 object-cover rounded-t-2xl"
          />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-600 hover:text-red-500 hover:bg-white"
          >
            <FiX className="w-5 h-5" />
          </button>

          {/* Actions */}
          <div className="absolute top-4 left-4 flex gap-2">
            <button
              onClick={() => onToggleFavorite(property.id)}
              className={`p-2 backdrop-blur-sm rounded-full transition-all ${
                isFavorite
                  ? 'bg-red-500 text-white'
                  : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
              }`}
            >
              <FiHeart className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} />
            </button>
            <button className="p-2 bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white rounded-full transition-all">
              <FiShare2 className="w-5 h-5" />
            </button>
          </div>

          {/* Property badges */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {property.listingType.toUpperCase()}
            </span>
            {property.tokenized && (
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                <BsCoin className="w-3 h-3 mr-1" />
                TOKENIZED
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title and Price */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h2>
              <p className="text-gray-600 flex items-center">
                <FiMapPin className="w-4 h-4 mr-1" />
                {property.address}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">{formatPrice(property.price)}</p>
              {property.rentPrice && (
                <p className="text-gray-600">${property.rentPrice}/month</p>
              )}
            </div>
          </div>

          {/* Property Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{property.beds}</p>
              <p className="text-sm text-gray-600">Bedrooms</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{property.baths}</p>
              <p className="text-sm text-gray-600">Bathrooms</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{property.sqft?.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Sq Ft</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{property.yearBuilt}</p>
              <p className="text-sm text-gray-600">Year Built</p>
            </div>
          </div>
          
          {/* Property Identifiers */}
          {(property.clipId || property.apn) && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Property Identifiers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.clipId && (
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-orange-800 flex items-center">
                        🎯 CoreLogic CLIP ID
                        <span className={`ml-2 w-2 h-2 rounded-full ${
                          property.clipStatus === 'found' ? 'bg-green-400' : 
                          property.clipStatus === 'fallback' ? 'bg-yellow-400' : 'bg-gray-400'
                        }`}></span>
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        property.clipStatus === 'found' ? 'bg-green-100 text-green-700' :
                        property.clipStatus === 'fallback' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {property.clipStatus || 'unknown'}
                      </span>
                    </div>
                    <p className="font-mono text-lg text-orange-900 mb-1">{property.clipId}</p>
                    <p className="text-xs text-orange-600">
                      Unique CoreLogic property identifier for accessing premium property data
                    </p>
                  </div>
                )}
                {property.apn && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-blue-800 flex items-center">
                        🏷️ Assessor Parcel Number
                        <span className={`ml-2 w-2 h-2 rounded-full ${
                          property.apnStatus === 'found' ? 'bg-green-400' : 
                          property.apnStatus === 'fallback' ? 'bg-yellow-400' : 'bg-gray-400'
                        }`}></span>
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        property.apnStatus === 'found' ? 'bg-green-100 text-green-700' :
                        property.apnStatus === 'fallback' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {property.apnStatus || 'unknown'}
                      </span>
                    </div>
                    <p className="font-mono text-lg text-blue-900 mb-1">{property.apn}</p>
                    <p className="text-xs text-blue-600">
                      Official parcel identifier used by tax assessors and local government
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tokenization Info */}
          {property.tokenized && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BsCoin className="w-5 h-5 mr-2 text-purple-600" />
                Token Investment Details
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Token Price</p>
                  <p className="text-xl font-bold text-gray-900">${property.tokenPrice}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Available Tokens</p>
                  <p className="text-xl font-bold text-gray-900">{property.availableTokens?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Expected ROI</p>
                  <p className="text-xl font-bold text-green-600 flex items-center">
                    <FiTrendingUp className="w-4 h-4 mr-1" />
                    {property.expectedROI}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monthly Dividend</p>
                  <p className="text-xl font-bold text-gray-900">${((property.monthlyRent * property.expectedROI / 100) / 12).toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">{property.description}</p>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Features & Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {property.features.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-800"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* 🤖 AI Analysis Section */}
          {hasAIAnalysis && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <BsRobot className="w-5 h-5 mr-2 text-blue-600" />
                AI Property Intelligence
                <span className="ml-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  PREMIUM
                </span>
              </h3>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">AI Confidence Score</span>
                  <span className="text-lg font-bold text-blue-600">
                    {property.aiIntelligence.confidenceScore || 0}%
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <BsRobot className="w-4 h-4 mr-1" />
                  Powered by {property.aiIntelligence.model || 'GPT-4'}
                </div>
              </div>
              
              {/* AI Analysis Components */}
              <div className="space-y-3">
                {property.aiIntelligence.marketAnalysis && (
                  <AIAnalysisCard
                    title="📊 Market Analysis"
                    content={property.aiIntelligence.marketAnalysis}
                    isExpanded={expandedAISection === 'market'}
                    onToggle={() => setExpandedAISection(expandedAISection === 'market' ? null : 'market')}
                  />
                )}
                
                {property.aiIntelligence.investmentInsights && (
                  <AIAnalysisCard
                    title="💹 Investment Insights"
                    content={property.aiIntelligence.investmentInsights}
                    isExpanded={expandedAISection === 'investment'}
                    onToggle={() => setExpandedAISection(expandedAISection === 'investment' ? null : 'investment')}
                  />
                )}
                
                {property.aiIntelligence.neighborhoodAnalysis && (
                  <AIAnalysisCard
                    title="🏘️ Neighborhood Analysis"
                    content={property.aiIntelligence.neighborhoodAnalysis}
                    isExpanded={expandedAISection === 'neighborhood'}
                    onToggle={() => setExpandedAISection(expandedAISection === 'neighborhood' ? null : 'neighborhood')}
                  />
                )}
                
                {property.aiIntelligence.riskAssessment && (
                  <AIAnalysisCard
                    title="⚠️ Risk Assessment"
                    content={property.aiIntelligence.riskAssessment}
                    isExpanded={expandedAISection === 'risk'}
                    onToggle={() => setExpandedAISection(expandedAISection === 'risk' ? null : 'risk')}
                  />
                )}
                
                {property.aiIntelligence.opportunityIdentification && (
                  <AIAnalysisCard
                    title="🎯 Opportunity Identification"
                    content={property.aiIntelligence.opportunityIdentification}
                    isExpanded={expandedAISection === 'opportunity'}
                    onToggle={() => setExpandedAISection(expandedAISection === 'opportunity' ? null : 'opportunity')}
                  />
                )}
                
                {property.aiIntelligence.strategicRecommendations && (
                  <AIAnalysisCard
                    title="🎯 Strategic Recommendations"
                    content={property.aiIntelligence.strategicRecommendations}
                    isExpanded={expandedAISection === 'strategic'}
                    onToggle={() => setExpandedAISection(expandedAISection === 'strategic' ? null : 'strategic')}
                  />
                )}
              </div>
            </div>
          )}

          {/* Property Stats */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Property Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-600 flex items-center">
                  <FiCalendar className="w-4 h-4 mr-1" />
                  Days on Market
                </p>
                <p className="text-2xl font-bold text-blue-900">{property.stats.daysOnMarket}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-600">Views</p>
                <p className="text-2xl font-bold text-green-900">{property.stats.views}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-purple-600">Saves</p>
                <p className="text-2xl font-bold text-purple-900">{property.stats.saves}</p>
              </div>
            </div>
          </div>

          {/* Agent Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Listed by</h3>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
              <div>
                <p className="font-semibold text-gray-900">{property.agent.name}</p>
                <p className="text-sm text-gray-600">{property.agent.phone}</p>
                <p className="text-sm text-gray-600">{property.agent.email}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Close
            </button>
            
            {property.tokenized && !isAiDiscovered ? (
              <button 
                onClick={() => window.location.href = `/invest/${property.id}`}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
              >
                <BsCoin className="w-5 h-5 mr-2" />
                Buy FXST-{String(property.id).padStart(3, '0')}
              </button>
            ) : isAiDiscovered ? (
              <button
                onClick={() => window.location.href = `/show-interest/${property.id}`}
                className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center justify-center"
              >
                <BsCoin className="w-5 h-5 mr-2" />
                Show Interest
              </button>
            ) : !property.tokenized ? (
              <button
                onClick={() => onTokenize(property)}
                className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center"
              >
                <BsCoin className="w-5 h-5 mr-2" />
                Tokenize Property
              </button>
            ) : (
              <button
                onClick={() => window.location.href = `/bid/${property.id}`}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
              >
                <BsCoin className="w-5 h-5 mr-2" />
                Bid with FXCT
              </button>
            )}
            
            <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Contact Agent
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// AI Analysis Card Component
const AIAnalysisCard = ({ title, content, isExpanded, onToggle }) => {
  const previewLength = 150; // Characters to show in preview
  const showPreview = content && content.length > previewLength;
  const displayContent = isExpanded ? content : (showPreview ? content.substring(0, previewLength) + '...' : content);
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left flex items-center justify-between"
      >
        <span className="font-medium text-gray-800">{title}</span>
        {showPreview && (
          isExpanded ? (
            <FiChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <FiChevronDown className="w-4 h-4 text-gray-500" />
          )
        )}
      </button>
      
      {content && (
        <div className="px-4 py-3">
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {displayContent}
          </div>
          
          {showPreview && !isExpanded && (
            <button
              onClick={onToggle}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              Read More
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
