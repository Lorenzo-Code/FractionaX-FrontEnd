import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FiX, FiHeart, FiShare2, FiMapPin, FiCalendar, FiTrendingUp, FiChevronDown, FiChevronUp, 
  FiDollarSign, FiHome, FiBarChart, FiMap, FiShield, FiClock, FiUsers, FiActivity,
  FiBriefcase, FiFileText, FiTool, FiMapPin as FiLocation, FiAlertTriangle, FiInfo
} from "react-icons/fi";
import { BsCoin, BsRobot, BsBuilding, BsGraphUp } from "react-icons/bs";

const PropertyDetails = ({ 
  property, 
  isOpen, 
  onClose, 
  onTokenize, 
  isFavorite, 
  onToggleFavorite,
  isAiDiscovered = false 
}) => {
  // State for navigation tabs and collapsible sections
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedAISection, setExpandedAISection] = useState(null);
  const [expandedSection, setExpandedSection] = useState({});
  
  // Check if property has CoreLogic data
  const hasAIAnalysis = property?.aiIntelligence && Object.keys(property.aiIntelligence).length > 0;
  const hasCoreLogicData = property?.propertyIntelligence || property?.coreLogicClipId || property?.clipId;
  const hasPropertyDetail = property?.propertyIntelligence?.data?.propertyDetail;
  const hasBuildings = property?.propertyIntelligence?.data?.buildings;
  const hasOwnership = property?.propertyIntelligence?.data?.ownership;
  const hasTaxAssessment = property?.propertyIntelligence?.data?.taxAssessment;
  const hasSiteLocation = property?.propertyIntelligence?.data?.siteLocation;

  // Helper functions
  const formatPrice = (price) => {
    if (!price) return 'N/A';
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price?.toLocaleString()}`;
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'N/A';
    return `$${amount.toLocaleString()}`;
  };

  const toggleSection = (sectionId) => {
    setExpandedSection(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Extract CoreLogic data
  const coreLogicData = property?.propertyIntelligence?.data || {};
  const buildings = coreLogicData?.buildings?.data || hasBuildings?.data;
  const ownership = coreLogicData?.ownership?.data || hasOwnership?.data;
  const taxAssessment = coreLogicData?.taxAssessment || hasTaxAssessment;
  const siteLocation = coreLogicData?.siteLocation?.data || hasSiteLocation?.data;
  const propertyDetail = coreLogicData?.propertyDetail || hasPropertyDetail;
  const ownerTransfer = propertyDetail?.mostRecentOwnerTransfer?.items?.[0];
  const marketSale = propertyDetail?.lastMarketSale?.items?.[0];

  // Navigation tabs
  const navigationTabs = [
    { id: 'overview', label: 'Overview', icon: FiHome },
    { id: 'property', label: 'Property Intelligence', icon: BsBuilding },
    { id: 'financial', label: 'Financial Analysis', icon: FiDollarSign },
    { id: 'ownership', label: 'Ownership History', icon: FiUsers },
    { id: 'building', label: 'Building Details', icon: FiTool },
    { id: 'location', label: 'Location & Risk', icon: FiMap },
    { id: 'investment', label: 'Investment Analysis', icon: FiBarChart },
    { id: 'ai', label: 'AI Insights', icon: BsRobot, show: hasAIAnalysis },
  ].filter(tab => tab.show !== false);

  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col"
      >
        {/* Header - Crexi Style */}
        <div className="relative bg-gradient-to-r from-blue-900 to-indigo-800 text-white">
          <div className="p-6">
            {/* Top row with price and close button */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-4xl font-bold mb-2">
                  {formatPrice(taxAssessment?.items?.[0]?.assessedValue?.calculatedTotalValue || property.price)}
                </div>
                <div className="text-sm text-blue-200">
                  {taxAssessment?.items?.[0]?.assessedValue ? 'Assessed Value' : 'Estimated Price'}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => onToggleFavorite(property.id)}
                  className={`p-2 rounded-full transition-all ${
                    isFavorite
                      ? 'bg-red-500 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <FiHeart className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} />
                </button>
                <button className="p-2 bg-white/20 text-white hover:bg-white/30 rounded-full transition-all">
                  <FiShare2 className="w-5 h-5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 bg-white/20 text-white hover:bg-red-500 rounded-full transition-all"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Property title and address */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {buildings?.allBuildingsSummary ? 
                  `${buildings.allBuildingsSummary.bedroomsCount || 0} Unit Property` : 
                  property.title
                }
              </h1>
              <div className="flex items-center text-blue-100">
                <FiMapPin className="w-4 h-4 mr-2" />
                {siteLocation ? 
                  `${siteLocation.locationLegal?.subdivisionName || ''} ${siteLocation.locationLegal?.lotNumber || ''}`.trim() || property.address
                  : property.address}
              </div>
              <div className="text-blue-200 text-sm mt-1">
                {property.city}, {property.state} {property.zipCode}
              </div>
            </div>

            {/* Property badges */}
            <div className="flex gap-2 mt-4">
              {hasCoreLogicData && (
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  🎯 CoreLogic Verified
                </span>
              )}
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {property.listingType?.toUpperCase() || 'PROPERTY'}
              </span>
              {property.tokenized && (
                <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  <BsCoin className="w-3 h-3 mr-1 inline" />
                  TOKENIZED
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area - Crexi Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-80 bg-gray-50 border-r overflow-y-auto hidden md:block">
            {/* At A Glance Box */}
            <div className="p-4 border-b bg-white">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <FiInfo className="w-4 h-4 mr-2" />
                At A Glance
              </h3>
              <div className="space-y-3">
                {buildings?.allBuildingsSummary && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Bedrooms</span>
                      <span className="font-medium">{buildings.allBuildingsSummary.bedroomsCount || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Bathrooms</span>
                      <span className="font-medium">{buildings.allBuildingsSummary.bathroomsCount || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Living Area</span>
                      <span className="font-medium">{buildings.allBuildingsSummary.livingAreaSquareFeet?.toLocaleString() || 'N/A'} sq ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Total Area</span>
                      <span className="font-medium">{buildings.allBuildingsSummary.totalAreaSquareFeet?.toLocaleString() || 'N/A'} sq ft</span>
                    </div>
                  </>
                )}
                {buildings?.buildings?.[0]?.constructionDetails?.yearBuilt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Year Built</span>
                    <span className="font-medium">{buildings.buildings[0].constructionDetails.yearBuilt}</span>
                  </div>
                )}
                {siteLocation?.lot?.areaSquareFeet && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Lot Size</span>
                    <span className="font-medium">{siteLocation.lot.areaSquareFeet.toLocaleString()} sq ft</span>
                  </div>
                )}
                {taxAssessment?.items?.[0]?.assessedValue?.calculatedTotalValue && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Assessed Value</span>
                    <span className="font-medium">{formatPrice(taxAssessment.items[0].assessedValue.calculatedTotalValue)}</span>
                  </div>
                )}
                {taxAssessment?.items?.[0]?.taxAmount?.totalTaxAmount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Annual Taxes</span>
                    <span className="font-medium">{formatCurrency(taxAssessment.items[0].taxAmount.totalTaxAmount)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="p-4">
              <nav className="space-y-1">
                {navigationTabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Listing Contacts */}
            <div className="p-4 border-t bg-white">
              <h3 className="font-semibold text-gray-900 mb-3">Listing Contact</h3>
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-900">{property.agent?.name || 'FractionaX Team'}</div>
                <div className="text-sm text-gray-600">{property.agent?.company || 'FractionaX Properties'}</div>
                <div className="text-sm text-blue-600">{property.agent?.phone || '(713) 555-FXCT'}</div>
                <div className="text-sm text-blue-600">{property.agent?.email || 'properties@fractionax.io'}</div>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors mt-3">
                  Contact Agent
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Mobile Navigation */}
            <div className="md:hidden bg-white border-b px-4 py-3">
              <select 
                value={activeTab} 
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                {navigationTabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>{tab.label}</option>
                ))}
              </select>
            </div>
            {activeTab === 'overview' && <OverviewTab property={property} buildings={buildings} siteLocation={siteLocation} />}
            {activeTab === 'property' && <PropertyIntelligenceTab property={property} buildings={buildings} ownership={ownership} siteLocation={siteLocation} />}
            {activeTab === 'financial' && <FinancialTab property={property} taxAssessment={taxAssessment} ownerTransfer={ownerTransfer} />}
            {activeTab === 'ownership' && <OwnershipTab property={property} ownership={ownership} ownerTransfer={ownerTransfer} marketSale={marketSale} />}
            {activeTab === 'building' && <BuildingDetailsTab property={property} buildings={buildings} />}
            {activeTab === 'location' && <LocationRiskTab property={property} siteLocation={siteLocation} />}
            {activeTab === 'investment' && <InvestmentTab property={property} taxAssessment={taxAssessment} />}
            {activeTab === 'ai' && hasAIAnalysis && <AIInsightsTab property={property} expandedAISection={expandedAISection} setExpandedAISection={setExpandedAISection} />}
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="border-t bg-white p-4">
          <div className="flex gap-4">
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
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Overview Tab - Property Images and Basic Description
const OverviewTab = ({ property, buildings, siteLocation }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = property.images || [];

  return (
    <div className="p-6">
      {/* Property Images Gallery */}
      <div className="mb-6">
        {images.length > 0 ? (
          <div>
            {/* Main Image */}
            <div className="relative mb-4">
              <img
                src={images[currentImage] || '/api/placeholder/800/400'}
                alt={`Property view ${currentImage + 1}`}
                className="w-full h-96 object-cover rounded-lg"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                  >
                    <FiChevronDown className="w-4 h-4 rotate-90" />
                  </button>
                  <button
                    onClick={() => setCurrentImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                  >
                    <FiChevronDown className="w-4 h-4 -rotate-90" />
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.slice(0, 8).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImage === index ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
                {images.length > 8 && (
                  <div className="flex-shrink-0 w-20 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-600">
                    +{images.length - 8}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <FiHome className="w-12 h-12 mx-auto mb-2" />
              <p>No images available</p>
            </div>
          </div>
        )}
      </div>

      {/* Property Description */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Property Description</h3>
        <p className="text-gray-700 leading-relaxed">
          {property.description || property.detailedDescription || 
          `This ${buildings?.buildings?.[0]?.constructionDetails?.yearBuilt || 'well-built'} property offers excellent investment potential in a prime location. ${buildings?.allBuildingsSummary ? `Featuring ${buildings.allBuildingsSummary.bedroomsCount || 0} bedrooms and ${buildings.allBuildingsSummary.bathroomsCount || 0} bathrooms with ${buildings.allBuildingsSummary.livingAreaSquareFeet ? buildings.allBuildingsSummary.livingAreaSquareFeet.toLocaleString() + ' square feet' : 'spacious living areas'}.` : ''} Perfect for fractional ownership and tokenization opportunities.`}
        </p>
      </div>

      {/* Key Features */}
      {property.features && property.features.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Features</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {property.features.map((feature, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-800"
              >
                {feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Property Intelligence Tab - CoreLogic Building and Property Details
const PropertyIntelligenceTab = ({ property, buildings, ownership, siteLocation }) => {
  const formatCurrency = (amount) => amount ? `$${amount.toLocaleString()}` : 'N/A';

  return (
    <div className="p-6 space-y-6">
      {/* Property Identifiers */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
          🎯 CoreLogic Property Identifiers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(property.clipId || property.coreLogicClipId) && (
            <div>
              <div className="text-sm text-orange-600 font-medium mb-1">CoreLogic CLIP ID</div>
              <div className="font-mono text-lg text-orange-900">{property.clipId || property.coreLogicClipId}</div>
            </div>
          )}
          {property.apn && (
            <div>
              <div className="text-sm text-orange-600 font-medium mb-1">Assessor Parcel Number</div>
              <div className="font-mono text-lg text-orange-900">{property.apn}</div>
            </div>
          )}
        </div>
      </div>

      {/* Building Summary */}
      {buildings?.allBuildingsSummary && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BsBuilding className="w-5 h-5 mr-2" />
            Building Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-900">{buildings.allBuildingsSummary.buildingsCount || 0}</div>
              <div className="text-sm text-blue-600">Buildings</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-900">{buildings.allBuildingsSummary.bedroomsCount || 'N/A'}</div>
              <div className="text-sm text-green-600">Bedrooms</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-900">{buildings.allBuildingsSummary.bathroomsCount || 'N/A'}</div>
              <div className="text-sm text-purple-600">Bathrooms</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-900">{buildings.allBuildingsSummary.fireplacesCount || 0}</div>
              <div className="text-sm text-orange-600">Fireplaces</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{buildings.allBuildingsSummary.livingAreaSquareFeet?.toLocaleString() || 'N/A'}</div>
              <div className="text-sm text-gray-600">Living Sq Ft</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{buildings.allBuildingsSummary.totalAreaSquareFeet?.toLocaleString() || 'N/A'}</div>
              <div className="text-sm text-gray-600">Total Sq Ft</div>
            </div>
          </div>
        </div>
      )}

      {/* Current Owner Information */}
      {ownership?.currentOwners && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiUsers className="w-5 h-5 mr-2" />
            Current Owner Information
          </h3>
          <div className="space-y-4">
            {ownership.currentOwners.ownerNames?.filter(owner => owner.fullName).map((owner, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{owner.fullName}</div>
                  {owner.isCorporate && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                      Corporate Entity
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  Sequence #{owner.sequenceNumber}
                </div>
              </div>
            ))}
            
            {ownership.currentOwners.relationshipTypeCode && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Relationship Type</div>
                <div className="font-medium text-gray-900">{ownership.currentOwners.relationshipTypeCode}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Site Location Details */}
      {siteLocation && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiLocation className="w-5 h-5 mr-2" />
            Site Location & Legal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {siteLocation.locationLegal && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Legal Description</h4>
                <div className="space-y-2 text-sm">
                  {siteLocation.locationLegal.subdivisionName && (
                    <div><span className="text-gray-600">Subdivision:</span> {siteLocation.locationLegal.subdivisionName}</div>
                  )}
                  {siteLocation.locationLegal.lotNumber && (
                    <div><span className="text-gray-600">Lot:</span> {siteLocation.locationLegal.lotNumber}</div>
                  )}
                  {siteLocation.locationLegal.description && (
                    <div><span className="text-gray-600">Description:</span> {siteLocation.locationLegal.description}</div>
                  )}
                </div>
              </div>
            )}
            
            {siteLocation.lot && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Lot Information</h4>
                <div className="space-y-2 text-sm">
                  {siteLocation.lot.areaSquareFeet && (
                    <div><span className="text-gray-600">Area:</span> {siteLocation.lot.areaSquareFeet.toLocaleString()} sq ft</div>
                  )}
                  {siteLocation.lot.areaAcres && (
                    <div><span className="text-gray-600">Acres:</span> {siteLocation.lot.areaAcres.toFixed(4)} acres</div>
                  )}
                  {siteLocation.lot.frontFeet && (
                    <div><span className="text-gray-600">Front Feet:</span> {siteLocation.lot.frontFeet} ft</div>
                  )}
                  {siteLocation.lot.depthFeet && (
                    <div><span className="text-gray-600">Depth:</span> {siteLocation.lot.depthFeet} ft</div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {siteLocation.coordinatesParcel && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Coordinates (Parcel)</div>
              <div className="font-mono text-gray-900">
                {siteLocation.coordinatesParcel.lat}, {siteLocation.coordinatesParcel.lng}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Financial Tab - Smart conditional rendering based on property type
const FinancialTab = ({ property, taxAssessment, ownerTransfer }) => {
  const formatCurrency = (amount) => amount ? `$${amount.toLocaleString()}` : 'N/A';
  const currentAssessment = taxAssessment?.items?.[0];
  
  // Determine if this is a commercial business property (car wash, etc.)
  const isCommercialBusiness = property.propertyType === 'commercial' && 
                               property.subcategory === 'business' && 
                               property.businessMetrics &&
                               (property.businessMetrics.washBays || 
                                property.businessMetrics.dailyCarCount ||
                                property.businessMetrics.averageTicket ||
                                property.businessMetrics.customerLoyalty);
                               
  const isMultifamilyProperty = property.propertyType === 'multifamily' && 
                                (property.subcategory === 'apartment' || 
                                 property.businessMetrics?.propertyUnits ||
                                 property.investmentMetrics?.totalUnits);


  // Render car wash business financial analysis
  if (isCommercialBusiness) {
    return <CarWashFinancialTab property={property} formatCurrency={formatCurrency} />;
  }
  
  // Render multifamily property financial analysis 
  if (isMultifamilyProperty) {
    return <MultifamilyFinancialTab property={property} formatCurrency={formatCurrency} taxAssessment={taxAssessment} ownerTransfer={ownerTransfer} />;
  }

  // Default traditional real estate financial analysis
  return (
    <div className="p-6 space-y-6">
      {/* Current Tax Assessment */}
      {currentAssessment && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiDollarSign className="w-5 h-5 mr-2" />
            Current Tax Assessment ({currentAssessment.assessedValue?.taxAssessedYear || 'Current'})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Assessed Values */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-3">Assessed Values</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-600">Total Value:</span>
                  <span className="font-medium text-green-900">{formatCurrency(currentAssessment.assessedValue?.calculatedTotalValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Land Value:</span>
                  <span className="font-medium text-green-900">{formatCurrency(currentAssessment.assessedValue?.calculatedLandValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Improvement Value:</span>
                  <span className="font-medium text-green-900">{formatCurrency(currentAssessment.assessedValue?.calculatedImprovementValue)}</span>
                </div>
                {currentAssessment.assessedValue?.calculatedImprovementValuePercentage && (
                  <div className="flex justify-between">
                    <span className="text-green-600">Improvement %:</span>
                    <span className="font-medium text-green-900">{currentAssessment.assessedValue.calculatedImprovementValuePercentage}%</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Tax Information */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-3">Tax Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-600">Annual Tax:</span>
                  <span className="font-medium text-blue-900">{formatCurrency(currentAssessment.taxAmount?.totalTaxAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Tax Year:</span>
                  <span className="font-medium text-blue-900">{currentAssessment.taxAmount?.billedYear || 'N/A'}</span>
                </div>
                {currentAssessment.taxAmount?.propertyTaxRate && (
                  <div className="flex justify-between">
                    <span className="text-blue-600">Tax Rate:</span>
                    <span className="font-medium text-blue-900">{currentAssessment.taxAmount.propertyTaxRate}%</span>
                  </div>
                )}
                {currentAssessment.taxrollUpdate?.lastAssessorUpdateDate && (
                  <div className="flex justify-between">
                    <span className="text-blue-600">Last Update:</span>
                    <span className="font-medium text-blue-900">{new Date(currentAssessment.taxrollUpdate.lastAssessorUpdateDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Market Analysis */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-medium text-purple-800 mb-3">Market Analysis</h4>
              <div className="space-y-2 text-sm">
                {currentAssessment.assessedValue?.calculatedTotalValue && currentAssessment.taxAmount?.totalTaxAmount && (
                  <div className="flex justify-between">
                    <span className="text-purple-600">Tax Rate:</span>
                    <span className="font-medium text-purple-900">
                      {((currentAssessment.taxAmount.totalTaxAmount / currentAssessment.assessedValue.calculatedTotalValue) * 100).toFixed(2)}%
                    </span>
                  </div>
                )}
                {ownerTransfer?.transactionDetails?.saleAmount && currentAssessment.assessedValue?.calculatedTotalValue && (
                  <div className="flex justify-between">
                    <span className="text-purple-600">Assessment Ratio:</span>
                    <span className="font-medium text-purple-900">
                      {((currentAssessment.assessedValue.calculatedTotalValue / ownerTransfer.transactionDetails.saleAmount) * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* School Districts */}
      {currentAssessment?.schoolDistricts?.school && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiFileText className="w-5 h-5 mr-2" />
            School District Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">District</div>
              <div className="font-medium text-gray-900">{currentAssessment.schoolDistricts.school.name}</div>
            </div>
            {currentAssessment.schoolDistricts.school.elementary?.name && (
              <div>
                <div className="text-sm text-gray-600">Elementary</div>
                <div className="font-medium text-gray-900">{currentAssessment.schoolDistricts.school.elementary.name}</div>
              </div>
            )}
            {currentAssessment.schoolDistricts.school.high?.name && (
              <div>
                <div className="text-sm text-gray-600">High School</div>
                <div className="font-medium text-gray-900">{currentAssessment.schoolDistricts.school.high.name}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Car Wash Business Financial Analysis Component
const CarWashFinancialTab = ({ property, formatCurrency }) => {
  const bm = property.businessMetrics || {};
  const fp = property.financialProjections || {};
  
  return (
    <div className="p-6 space-y-6">
      {/* Operating Performance Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FiActivity className="w-6 h-6 mr-3 text-blue-600" />
          Orca Splash Operating Performance
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{property.grossRevenue?.toLocaleString() || 'N/A'}</div>
            <div className="text-sm text-gray-600 mt-1">Annual Revenue</div>
            <div className="text-xs text-green-600 font-medium">+12% YoY Growth</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-green-600">{property.netOperatingIncome?.toLocaleString() || 'N/A'}</div>
            <div className="text-sm text-gray-600 mt-1">Net Operating Income</div>
            <div className="text-xs text-blue-600 font-medium">{((property.netOperatingIncome / property.grossRevenue) * 100).toFixed(1)}% Margin</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{property.capRate}%</div>
            <div className="text-sm text-gray-600 mt-1">Cap Rate</div>
            <div className="text-xs text-gray-500">Market Leading</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-orange-600">{bm.dailyCarCount || 110}</div>
            <div className="text-sm text-gray-600 mt-1">Daily Car Count</div>
            <div className="text-xs text-green-600 font-medium">Average Weekday</div>
          </div>
        </div>
      </div>
      
      {/* Service Mix Analysis */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FiBarChart className="w-5 h-5 mr-2 text-green-600" />
          Service Mix & Revenue Optimization
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Service Performance */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Current Performance</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div>
                  <span className="text-gray-700 font-medium">Express Wash</span>
                  <div className="text-sm text-gray-500">{formatCurrency(bm.averageTicket)} avg ticket</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-600">65%</div>
                  <div className="text-xs text-gray-500">of revenue</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div>
                  <span className="text-gray-700 font-medium">Premium Detail</span>
                  <div className="text-sm text-gray-500">{formatCurrency(bm.premiumServiceTicket)} avg ticket</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">25%</div>
                  <div className="text-xs text-gray-500">of revenue</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <div>
                  <span className="text-gray-700 font-medium">Membership Program</span>
                  <div className="text-sm text-gray-500">{bm.customerLoyalty?.activeMemberships?.toLocaleString()} active</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-purple-600">10%</div>
                  <div className="text-xs text-gray-500">of revenue</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Optimization Opportunities */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Growth Opportunities</h4>
            <div className="space-y-3">
              <div className="p-3 border border-orange-200 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-orange-800">Membership Expansion</span>
                  <span className="text-sm font-bold text-orange-700">+18% Revenue</span>
                </div>
                <p className="text-sm text-orange-700">Target 12,000 members (+40% growth)</p>
              </div>
              
              <div className="p-3 border border-green-200 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-green-800">Detail Service Upselling</span>
                  <span className="text-sm font-bold text-green-700">+12% Revenue</span>
                </div>
                <p className="text-sm text-green-700">Increase detail conversion to 35%</p>
              </div>
              
              <div className="p-3 border border-blue-200 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-blue-800">Peak Hour Pricing</span>
                  <span className="text-sm font-bold text-blue-700">+8% Revenue</span>
                </div>
                <p className="text-sm text-blue-700">Dynamic pricing during high-demand</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Customer & Loyalty Metrics */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FiUsers className="w-5 h-5 mr-2 text-purple-600" />
          Customer Analytics & Loyalty Program
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-700">{bm.customerLoyalty?.activeMemberships?.toLocaleString() || '8,540'}</div>
            <div className="text-sm text-purple-600 font-medium">Active Members</div>
            <div className="text-xs text-gray-500 mt-1">+15% vs last year</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-700">{bm.customerLoyalty?.memberRetentionRate || '84.2'}%</div>
            <div className="text-sm text-green-600 font-medium">Retention Rate</div>
            <div className="text-xs text-gray-500 mt-1">Industry leading</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">{formatCurrency(bm.customerLoyalty?.monthlyMemberRevenue || 127500)}</div>
            <div className="text-sm text-blue-600 font-medium">Monthly Member Revenue</div>
            <div className="text-xs text-gray-500 mt-1">Recurring income</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-700">{bm.weekendCarCount || 185}</div>
            <div className="text-sm text-orange-600 font-medium">Weekend Volume</div>
            <div className="text-xs text-gray-500 mt-1">Peak performance</div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Membership Program Impact</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-900">Revenue Stability</div>
              <div className="text-green-600 font-medium">23% of total revenue from memberships</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">Customer Lifetime Value</div>
              <div className="text-blue-600 font-medium">2.3 years average membership</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">Referral Rate</div>
              <div className="text-purple-600 font-medium">31% member referral rate</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Financial Projections */}
      {fp && Object.keys(fp).length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiTrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Financial Projections & ROI Analysis
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[fp.year1, fp.year2, fp.year3].map((year, index) => year && (
              <div key={index} className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                <div className="font-semibold text-gray-900 mb-2">Year {index + 1} Projection</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue:</span>
                    <span className="font-medium">{formatCurrency(year.revenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">NOI:</span>
                    <span className="font-medium text-green-600">{formatCurrency(year.noi)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ROI:</span>
                    <span className="font-bold text-blue-600">{year.roi}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {fp.assumptions && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="font-medium text-blue-900 mb-2">Projection Assumptions</div>
              <div className="text-sm text-blue-800">{fp.assumptions}</div>
            </div>
          )}
        </div>
      )}
      
      {/* Operating Expenses Breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FiDollarSign className="w-5 h-5 mr-2 text-red-600" />
          Operating Expenses Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Monthly Operating Costs</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Labor & Payroll:</span>
                <span className="font-medium">{formatCurrency((bm.monthlyExpenses || 154800) * 0.45)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Utilities:</span>
                <span className="font-medium">{formatCurrency(property.utilities || 28800 / 12)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Maintenance:</span>
                <span className="font-medium">{formatCurrency(property.maintenance / 12 || 3500)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Insurance:</span>
                <span className="font-medium">{formatCurrency(property.insurance / 12 || 1300)}</span>
              </div>
              <div className="flex justify-between py-2 font-semibold">
                <span className="text-gray-900">Total Monthly:</span>
                <span className="text-red-600">{formatCurrency(bm.monthlyExpenses || 154800)}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Efficiency Metrics</h4>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Operating Margin:</span>
                  <span className="font-bold text-green-600">{((property.netOperatingIncome / property.grossRevenue) * 100).toFixed(1)}%</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">Industry benchmark: 65-75%</div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Revenue per Car:</span>
                  <span className="font-bold text-blue-600">{formatCurrency(bm.averageTicket || 22.75)}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">Target: {formatCurrency((bm.averageTicket || 22.75) * 1.15)}</div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Staff Efficiency:</span>
                  <span className="font-bold text-purple-600">{Math.round((bm.dailyCarCount || 110) / (bm.fullTimeStaff || 8))} cars/staff</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">Full-time equivalent basis</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Multifamily Property Financial Analysis Component
const MultifamilyFinancialTab = ({ property, formatCurrency, taxAssessment, ownerTransfer }) => {
  const bm = property.businessMetrics || {};
  const im = property.investmentMetrics || {};
  const fp = property.financialProjections || {};
  
  return (
    <div className="p-6 space-y-6">
      {/* Investment Overview */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <BsBuilding className="w-6 h-6 mr-3 text-green-600" />
          Multifamily Investment Overview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(im.noi || bm.netOperatingIncome)}</div>
            <div className="text-sm text-gray-600 mt-1">Net Operating Income</div>
            <div className="text-xs text-blue-600 font-medium">{property.capRate}% Cap Rate</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{bm.propertyUnits || im.totalUnits}</div>
            <div className="text-sm text-gray-600 mt-1">Total Units</div>
            <div className="text-xs text-green-600 font-medium">{bm.occupancyRate}% Occupied</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(bm.averageRent || im.avgRentPerUnit)}</div>
            <div className="text-sm text-gray-600 mt-1">Average Rent</div>
            <div className="text-xs text-gray-500">Per Unit</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(im.pricePerUnit)}</div>
            <div className="text-sm text-gray-600 mt-1">Price Per Unit</div>
            <div className="text-xs text-gray-500">{formatCurrency(im.pricePerSqft)}/sqft</div>
          </div>
        </div>
      </div>
      
      {/* Revenue & Operating Performance */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FiBarChart className="w-5 h-5 mr-2 text-green-600" />
          Revenue & Operating Performance
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Analysis */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Revenue Breakdown</h4>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Gross Annual Income:</span>
                <span className="font-semibold text-green-600">{formatCurrency(bm.annualGrossIncome || im.grossAnnualIncome)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Monthly Gross Income:</span>
                <span className="font-semibold">{formatCurrency(bm.monthlyGrossIncome)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Operating Expenses:</span>
                <span className="font-semibold text-red-600">{formatCurrency(bm.operatingExpenses)}</span>
              </div>
              <div className="flex justify-between py-2 font-semibold">
                <span className="text-gray-900">Net Operating Income:</span>
                <span className="text-green-600">{formatCurrency(bm.netOperatingIncome)}</span>
              </div>
            </div>
          </div>
          
          {/* Operating Metrics */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Key Metrics</h4>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Occupancy Rate:</span>
                  <span className="font-bold text-blue-600">{bm.occupancyRate}%</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">Vacancy: {bm.vacancyRate}%</div>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Operating Expense Ratio:</span>
                  <span className="font-bold text-green-600">{bm.operatingExpenseRatio}%</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">Industry avg: 35-50%</div>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Gross Rent Multiplier:</span>
                  <span className="font-bold text-purple-600">{bm.grossRentMultiplier || property.grossRentMultiplier}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">Market comparison tool</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Financial Projections */}
      {fp && Object.keys(fp).length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiTrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Financial Projections
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {[fp.year1, fp.year2, fp.year3].map((year, index) => year && (
              <div key={index} className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                <div className="font-semibold text-gray-900 mb-2">Year {index + 1} Projection</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue:</span>
                    <span className="font-medium">{formatCurrency(year.revenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">NOI:</span>
                    <span className="font-medium text-green-600">{formatCurrency(year.noi)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ROI:</span>
                    <span className="font-bold text-blue-600">{year.roi}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {fp.assumptions && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="font-medium text-blue-900 mb-2">Projection Assumptions</div>
              <div className="text-sm text-blue-800">{fp.assumptions}</div>
            </div>
          )}
        </div>
      )}
      
      {/* Include CoreLogic data if available */}
      <CoreLogicDataSection taxAssessment={taxAssessment} ownerTransfer={ownerTransfer} formatCurrency={formatCurrency} />
    </div>
  );
};

// CoreLogic Data Section Component (reusable)
const CoreLogicDataSection = ({ taxAssessment, ownerTransfer, formatCurrency }) => {
  const currentAssessment = taxAssessment?.items?.[0];
  
  if (!currentAssessment) return null;
  
  return (
    <>
      {/* Current Tax Assessment */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FiDollarSign className="w-5 h-5 mr-2" />
          Tax Assessment ({currentAssessment.assessedValue?.taxAssessedYear || 'Current'})
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Assessed Values */}
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-3">Assessed Values</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-600">Total Value:</span>
                <span className="font-medium text-green-900">{formatCurrency(currentAssessment.assessedValue?.calculatedTotalValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600">Land Value:</span>
                <span className="font-medium text-green-900">{formatCurrency(currentAssessment.assessedValue?.calculatedLandValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600">Improvement Value:</span>
                <span className="font-medium text-green-900">{formatCurrency(currentAssessment.assessedValue?.calculatedImprovementValue)}</span>
              </div>
            </div>
          </div>
          
          {/* Tax Information */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-3">Tax Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-600">Annual Tax:</span>
                <span className="font-medium text-blue-900">{formatCurrency(currentAssessment.taxAmount?.totalTaxAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600">Tax Year:</span>
                <span className="font-medium text-blue-900">{currentAssessment.taxAmount?.billedYear || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          {/* Market Analysis */}
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-medium text-purple-800 mb-3">Market Analysis</h4>
            <div className="space-y-2 text-sm">
              {currentAssessment.assessedValue?.calculatedTotalValue && currentAssessment.taxAmount?.totalTaxAmount && (
                <div className="flex justify-between">
                  <span className="text-purple-600">Tax Rate:</span>
                  <span className="font-medium text-purple-900">
                    {((currentAssessment.taxAmount.totalTaxAmount / currentAssessment.assessedValue.calculatedTotalValue) * 100).toFixed(2)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* School Districts */}
      {currentAssessment?.schoolDistricts?.school && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiFileText className="w-5 h-5 mr-2" />
            School District Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">District</div>
              <div className="font-medium text-gray-900">{currentAssessment.schoolDistricts.school.name}</div>
            </div>
            {currentAssessment.schoolDistricts.school.elementary?.name && (
              <div>
                <div className="text-sm text-gray-600">Elementary</div>
                <div className="font-medium text-gray-900">{currentAssessment.schoolDistricts.school.elementary.name}</div>
              </div>
            )}
            {currentAssessment.schoolDistricts.school.high?.name && (
              <div>
                <div className="text-sm text-gray-600">High School</div>
                <div className="font-medium text-gray-900">{currentAssessment.schoolDistricts.school.high.name}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

// Ownership Tab - Ownership History and Transfers
const OwnershipTab = ({ property, ownership, ownerTransfer, marketSale }) => {
  const formatCurrency = (amount) => amount ? `$${amount.toLocaleString()}` : 'N/A';
  const formatDate = (date) => date ? new Date(date).toLocaleDateString() : 'N/A';

  return (
    <div className="p-6 space-y-6">
      {/* Most Recent Transfer */}
      {ownerTransfer && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiClock className="w-5 h-5 mr-2" />
            Most Recent Owner Transfer
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Transaction Details */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-3">Transaction Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-600">Sale Price:</span>
                  <span className="font-bold text-green-900">{formatCurrency(ownerTransfer.transactionDetails?.saleAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Sale Date:</span>
                  <span className="font-medium text-green-900">{formatDate(ownerTransfer.transactionDetails?.saleDateDerived)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Recording Date:</span>
                  <span className="font-medium text-green-900">{formatDate(ownerTransfer.transactionDetails?.saleRecordingDateDerived)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Document Type:</span>
                  <span className="font-medium text-green-900">{ownerTransfer.transactionDetails?.saleDocumentTypeCode || 'N/A'}</span>
                </div>
                {ownerTransfer.transactionDetails?.saleDocumentNumber && (
                  <div className="flex justify-between">
                    <span className="text-green-600">Document #:</span>
                    <span className="font-medium text-green-900">{ownerTransfer.transactionDetails.saleDocumentNumber}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Transaction Flags */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-3">Transaction Type</h4>
              <div className="flex flex-wrap gap-2">
                {ownerTransfer.transactionDetails?.isCashPurchase && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Cash Purchase
                  </span>
                )}
                {ownerTransfer.transactionDetails?.isMortgagePurchase && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Mortgage Purchase
                  </span>
                )}
                {ownerTransfer.transactionDetails?.isInvestorPurchase && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Investor Purchase
                  </span>
                )}
                {ownerTransfer.transactionDetails?.isResale && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    Resale
                  </span>
                )}
                {ownerTransfer.transactionDetails?.isForeclosureReo && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Foreclosure REO
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Buyer Information */}
          {ownerTransfer.buyerDetails && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Buyer Information</h4>
              {ownerTransfer.buyerDetails.buyerNames?.map((buyer, index) => (
                <div key={index} className="text-sm text-gray-700">
                  {buyer.fullName}
                  {buyer.isCorporate && <span className="ml-2 text-xs text-blue-600">(Corporate)</span>}
                </div>
              ))}
            </div>
          )}
          
          {/* Seller Information */}
          {ownerTransfer.sellerDetails && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Seller Information</h4>
              {ownerTransfer.sellerDetails.sellerNames?.map((seller, index) => (
                <div key={index} className="text-sm text-gray-700">
                  {seller.fullName}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Current Ownership */}
      {ownership?.currentOwners && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiUsers className="w-5 h-5 mr-2" />
            Current Ownership
          </h3>
          
          <div className="space-y-4">
            {ownership.currentOwners.ownerNames?.filter(owner => owner.fullName).map((owner, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-900">{owner.fullName}</div>
                  {owner.isCorporate && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Corporate Entity
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  <div>First Name: {owner.firstName || 'N/A'}</div>
                  <div>Last Name: {owner.lastName || 'N/A'}</div>
                  <div>Sequence: #{owner.sequenceNumber}</div>
                </div>
              </div>
            ))}
            
            {/* Ownership Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {ownership.currentOwners.relationshipTypeCode && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Relationship Type</div>
                  <div className="font-medium text-gray-900">{ownership.currentOwners.relationshipTypeCode}</div>
                </div>
              )}
              {ownership.currentOwners.occupancyCode && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Occupancy</div>
                  <div className="font-medium text-gray-900">{ownership.currentOwners.occupancyCode}</div>
                </div>
              )}
            </div>
          </div>
          
          {/* Mailing Address */}
          {ownership.currentOwnerMailingInfo?.mailingAddress && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Mailing Address</h4>
              <div className="text-sm text-gray-700">
                <div>{ownership.currentOwnerMailingInfo.mailingAddress.streetAddress}</div>
                <div>
                  {ownership.currentOwnerMailingInfo.mailingAddress.city}, {ownership.currentOwnerMailingInfo.mailingAddress.state} {ownership.currentOwnerMailingInfo.mailingAddress.zipCode}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Building Details Tab - Detailed Building Information
const BuildingDetailsTab = ({ property, buildings }) => {
  const formatCurrency = (amount) => amount ? `$${amount.toLocaleString()}` : 'N/A';
  const mainBuilding = buildings?.buildings?.[0];

  return (
    <div className="p-6 space-y-6">
      {/* Building Classification */}
      {mainBuilding?.structureClassification && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BsBuilding className="w-5 h-5 mr-2" />
            Building Classification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-600">Building Type</div>
              <div className="font-medium text-blue-900">{mainBuilding.structureClassification.buildingTypeCode || 'N/A'}</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-sm text-green-600">Building Class</div>
              <div className="font-medium text-green-900">{mainBuilding.structureClassification.buildingClassCode || 'N/A'}</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-sm text-purple-600">Grade</div>
              <div className="font-medium text-purple-900">{mainBuilding.structureClassification.gradeTypeCode || 'N/A'}</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Construction Details */}
      {mainBuilding?.constructionDetails && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiTool className="w-5 h-5 mr-2" />
            Construction Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Year Built:</span>
                <span className="font-medium text-gray-900">{mainBuilding.constructionDetails.yearBuilt || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Building Style:</span>
                <span className="font-medium text-gray-900">{mainBuilding.constructionDetails.buildingStyleTypeCode || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Foundation:</span>
                <span className="font-medium text-gray-900">{mainBuilding.constructionDetails.foundationTypeCode || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Frame Type:</span>
                <span className="font-medium text-gray-900">{mainBuilding.constructionDetails.frameTypeCode || 'N/A'}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Quality:</span>
                <span className="font-medium text-gray-900">{mainBuilding.constructionDetails.buildingQualityTypeCode || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Condition:</span>
                <span className="font-medium text-gray-900">{mainBuilding.constructionDetails.buildingImprovementConditionCode || 'N/A'}</span>
              </div>
              {mainBuilding.constructionDetails.effectiveYearBuilt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Effective Year:</span>
                  <span className="font-medium text-gray-900">{mainBuilding.constructionDetails.effectiveYearBuilt}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Structure Details */}
      {mainBuilding && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Interior Area */}
          {mainBuilding.interiorArea && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Interior Areas</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Living Area:</span>
                  <span className="font-medium text-gray-900">{mainBuilding.interiorArea.livingAreaSquareFeet?.toLocaleString() || 'N/A'} sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Building Area:</span>
                  <span className="font-medium text-gray-900">{mainBuilding.interiorArea.buildingAreaSquareFeet?.toLocaleString() || 'N/A'} sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Above Grade:</span>
                  <span className="font-medium text-gray-900">{mainBuilding.interiorArea.aboveGradeAreaSquareFeet?.toLocaleString() || 'N/A'} sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Basement:</span>
                  <span className="font-medium text-gray-900">{mainBuilding.interiorArea.basementAreaSquareFeet?.toLocaleString() || 'N/A'} sq ft</span>
                </div>
                {mainBuilding.interiorArea.finishedBasementAreaSquareFeet && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Finished Basement:</span>
                    <span className="font-medium text-gray-900">{mainBuilding.interiorArea.finishedBasementAreaSquareFeet.toLocaleString()} sq ft</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Exterior Features */}
          {mainBuilding.structureExterior && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Exterior Features</h3>
              <div className="space-y-3">
                {mainBuilding.structureExterior.walls && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Exterior Walls:</span>
                    <span className="font-medium text-gray-900">{mainBuilding.structureExterior.walls.typeCode || 'N/A'}</span>
                  </div>
                )}
                {mainBuilding.structureExterior.roof && (
                  <div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Roof Type:</span>
                      <span className="font-medium text-gray-900">{mainBuilding.structureExterior.roof.typeCode || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Roof Cover:</span>
                      <span className="font-medium text-gray-900">{mainBuilding.structureExterior.roof.coverTypeCode || 'N/A'}</span>
                    </div>
                  </div>
                )}
                {mainBuilding.structureExterior.patios?.count && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Patios:</span>
                    <span className="font-medium text-gray-900">{mainBuilding.structureExterior.patios.count} ({mainBuilding.structureExterior.patios.areaSquareFeet} sq ft)</span>
                  </div>
                )}
                {mainBuilding.structureExterior.porches?.count && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Porches:</span>
                    <span className="font-medium text-gray-900">{mainBuilding.structureExterior.porches.count} ({mainBuilding.structureExterior.porches.areaSquareFeet} sq ft)</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Interior Features */}
      {mainBuilding?.structureFeatures && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Interior Features & Systems</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              {mainBuilding.structureFeatures.airConditioning && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Air Conditioning:</span>
                  <span className="font-medium text-gray-900">{mainBuilding.structureFeatures.airConditioning.typeCode || 'N/A'}</span>
                </div>
              )}
              {mainBuilding.structureFeatures.heating && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Heating:</span>
                  <span className="font-medium text-gray-900">{mainBuilding.structureFeatures.heating.typeCode || 'N/A'}</span>
                </div>
              )}
              {mainBuilding.structureFeatures.firePlaces && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Fireplaces:</span>
                  <span className="font-medium text-gray-900">{mainBuilding.structureFeatures.firePlaces.count || 0} ({mainBuilding.structureFeatures.firePlaces.typeCode || 'N/A'})</span>
                </div>
              )}
            </div>
            <div className="space-y-3">
              {mainBuilding.interiorRooms && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bedrooms:</span>
                    <span className="font-medium text-gray-900">{mainBuilding.interiorRooms.bedroomsCount || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Full Bathrooms:</span>
                    <span className="font-medium text-gray-900">{mainBuilding.interiorRooms.fullBathroomsCount || 'N/A'}</span>
                  </div>
                  {mainBuilding.interiorRooms.halfBathroomsCount && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Half Bathrooms:</span>
                      <span className="font-medium text-gray-900">{mainBuilding.interiorRooms.halfBathroomsCount}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Location & Risk Tab - Site Location and Environmental Information
const LocationRiskTab = ({ property, siteLocation }) => {
  return (
    <div className="p-6 space-y-6">
      {/* Map Placeholder */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FiMap className="w-5 h-5 mr-2" />
          Property Location
        </h3>
        
        {/* Coordinates Display */}
        {siteLocation?.coordinatesParcel && (
          <div className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Parcel Coordinates</div>
                <div className="font-mono text-gray-900">
                  {siteLocation.coordinatesParcel.lat.toFixed(6)}, {siteLocation.coordinatesParcel.lng.toFixed(6)}
                </div>
              </div>
              {siteLocation.coordinatesBlock && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Block Coordinates</div>
                  <div className="font-mono text-gray-900">
                    {siteLocation.coordinatesBlock.lat.toFixed(6)}, {siteLocation.coordinatesBlock.lng.toFixed(6)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Map Placeholder */}
        <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <FiMap className="w-12 h-12 mx-auto mb-2" />
            <p>Interactive map integration available</p>
            <p className="text-sm">Google Maps, Mapbox, or similar service</p>
          </div>
        </div>
      </div>
      
      {/* Zoning and Land Use */}
      {siteLocation?.landUseAndZoningCodes && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiFileText className="w-5 h-5 mr-2" />
            Zoning & Land Use
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">Property Type Code</div>
                <div className="font-medium text-gray-900">{siteLocation.landUseAndZoningCodes.propertyTypeCode || 'N/A'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Land Use Code</div>
                <div className="font-medium text-gray-900">{siteLocation.landUseAndZoningCodes.landUseCode || 'N/A'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">County Land Use</div>
                <div className="font-medium text-gray-900">{siteLocation.landUseAndZoningCodes.countyLandUseDescription || 'N/A'}</div>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">Zoning Code</div>
                <div className="font-medium text-gray-900">{siteLocation.landUseAndZoningCodes.zoningCode || 'N/A'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Zoning Description</div>
                <div className="font-medium text-gray-900">{siteLocation.landUseAndZoningCodes.zoningCodeDescription || 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Neighborhood Information */}
      {siteLocation && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiLocation className="w-5 h-5 mr-2" />
            Neighborhood & Municipality
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {siteLocation.neighborhood && (
              <div>
                <div className="text-sm text-gray-600">Neighborhood</div>
                <div className="font-medium text-gray-900">{siteLocation.neighborhood.name || 'N/A'}</div>
                {siteLocation.neighborhood.code && (
                  <div className="text-xs text-gray-500">Code: {siteLocation.neighborhood.code}</div>
                )}
              </div>
            )}
            {siteLocation.municipality && (
              <div>
                <div className="text-sm text-gray-600">Municipality</div>
                <div className="font-medium text-gray-900">{siteLocation.municipality.name || 'N/A'}</div>
              </div>
            )}
            {siteLocation.cbsa && (
              <div>
                <div className="text-sm text-gray-600">CBSA</div>
                <div className="font-medium text-gray-900">{siteLocation.cbsa.type || 'N/A'} - {siteLocation.cbsa.code || 'N/A'}</div>
              </div>
            )}
            {siteLocation.censusTract && (
              <div>
                <div className="text-sm text-gray-600">Census Tract</div>
                <div className="font-medium text-gray-900">{siteLocation.censusTract.id || 'N/A'}</div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Utilities */}
      {siteLocation?.utilities && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiTool className="w-5 h-5 mr-2" />
            Utilities & Services
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-600">Water</div>
              <div className="font-medium text-blue-900">{siteLocation.utilities.waterTypeCode || 'N/A'}</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-sm text-green-600">Sewer</div>
              <div className="font-medium text-green-900">{siteLocation.utilities.sewerTypeCode || 'N/A'}</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-sm text-yellow-600">Fuel</div>
              <div className="font-medium text-yellow-900">{siteLocation.utilities.fuelTypeCode || 'N/A'}</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-sm text-purple-600">Electric</div>
              <div className="font-medium text-purple-900">{siteLocation.utilities.electricityWiringTypeCode || 'N/A'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Investment Tab - ROI Calculator and Investment Analysis
const InvestmentTab = ({ property, taxAssessment }) => {
  const [purchasePrice, setPurchasePrice] = useState(taxAssessment?.items?.[0]?.assessedValue?.calculatedTotalValue || property.price || 0);
  const [downPayment, setDownPayment] = useState(0.25);
  const [interestRate, setInterestRate] = useState(0.065);
  const [loanTerm, setLoanTerm] = useState(30);
  const [estimatedRent, setEstimatedRent] = useState(property.monthlyRent || property.rentPrice || 0);
  
  const formatCurrency = (amount) => amount ? `$${amount.toLocaleString()}` : '$0';
  const formatPercent = (decimal) => `${(decimal * 100).toFixed(2)}%`;
  
  // Calculate mortgage payment
  const loanAmount = purchasePrice * (1 - downPayment);
  const monthlyRate = interestRate / 12;
  const numberOfPayments = loanTerm * 12;
  const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  // Other monthly expenses
  const monthlyTaxes = (taxAssessment?.items?.[0]?.taxAmount?.totalTaxAmount || 0) / 12;
  const monthlyInsurance = purchasePrice * 0.003 / 12; // Estimate 0.3% annually
  const monthlyMaintenance = purchasePrice * 0.01 / 12; // Estimate 1% annually
  
  const totalMonthlyExpenses = monthlyPayment + monthlyTaxes + monthlyInsurance + monthlyMaintenance;
  const monthlyCashFlow = estimatedRent - totalMonthlyExpenses;
  const annualCashFlow = monthlyCashFlow * 12;
  const cashOnCash = downPayment > 0 ? (annualCashFlow / (purchasePrice * downPayment)) : 0;
  
  return (
    <div className="p-6 space-y-6">
      {/* Investment Calculator */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FiActivity className="w-5 h-5 mr-2" />
          Investment Calculator
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Parameters */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800 mb-3">Purchase Parameters</h4>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Purchase Price</label>
              <input
                type="number"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Down Payment (%)</label>
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.05"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600">
                {formatPercent(downPayment)} ({formatCurrency(purchasePrice * downPayment)})
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Interest Rate (%)</label>
              <input
                type="range"
                min="0.03"
                max="0.12"
                step="0.005"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600">{formatPercent(interestRate)}</div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Loan Term (years)</label>
              <select
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value={15}>15 years</option>
                <option value={20}>20 years</option>
                <option value={25}>25 years</option>
                <option value={30}>30 years</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Estimated Monthly Rent</label>
              <input
                type="number"
                value={estimatedRent}
                onChange={(e) => setEstimatedRent(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Results */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800 mb-3">Investment Analysis</h4>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-600">Monthly Payment (P&I)</div>
              <div className="text-xl font-bold text-blue-900">{formatCurrency(monthlyPayment)}</div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-green-600">Monthly Cash Flow</div>
              <div className={`text-xl font-bold ${monthlyCashFlow >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                {formatCurrency(monthlyCashFlow)}
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-purple-600">Cash-on-Cash Return</div>
              <div className={`text-xl font-bold ${cashOnCash >= 0 ? 'text-purple-900' : 'text-red-900'}`}>
                {formatPercent(cashOnCash)}
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Loan Amount:</span>
                <span className="font-medium">{formatCurrency(loanAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Taxes:</span>
                <span className="font-medium">{formatCurrency(monthlyTaxes)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Est. Insurance:</span>
                <span className="font-medium">{formatCurrency(monthlyInsurance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Est. Maintenance:</span>
                <span className="font-medium">{formatCurrency(monthlyMaintenance)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">Total Expenses:</span>
                <span className="font-medium">{formatCurrency(totalMonthlyExpenses)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tokenization Information */}
      {property.tokenized && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BsCoin className="w-5 h-5 mr-2 text-purple-600" />
            FractionaX Token Investment
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-100 rounded-lg">
              <div className="text-sm text-purple-600">Token Price</div>
              <div className="text-xl font-bold text-purple-900">{formatCurrency(property.tokenPrice)}</div>
            </div>
            <div className="text-center p-4 bg-blue-100 rounded-lg">
              <div className="text-sm text-blue-600">Available Tokens</div>
              <div className="text-xl font-bold text-blue-900">{property.availableTokens?.toLocaleString() || 'N/A'}</div>
            </div>
            <div className="text-center p-4 bg-green-100 rounded-lg">
              <div className="text-sm text-green-600">Expected ROI</div>
              <div className="text-xl font-bold text-green-900 flex items-center justify-center">
                <FiTrendingUp className="w-4 h-4 mr-1" />
                {property.expectedROI}%
              </div>
            </div>
            <div className="text-center p-4 bg-orange-100 rounded-lg">
              <div className="text-sm text-orange-600">Monthly Dividend</div>
              <div className="text-xl font-bold text-orange-900">
                {formatCurrency(((property.monthlyRent || 0) * (property.expectedROI || 0) / 100) / 12)}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Investment Highlights */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BsGraphUp className="w-5 h-5 mr-2" />
          Investment Highlights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Strengths</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {monthlyCashFlow > 0 && <li className="text-green-700">✓ Positive monthly cash flow</li>}
              {cashOnCash > 0.08 && <li className="text-green-700">✓ Strong cash-on-cash return</li>}
              {taxAssessment?.items?.[0]?.assessedValue?.calculatedTotalValue && <li className="text-green-700">✓ CoreLogic assessed value available</li>}
              {property.tokenized && <li className="text-green-700">✓ Fractional ownership available</li>}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Considerations</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li className="text-orange-700">⚠ Market conditions may vary</li>
              <li className="text-orange-700">⚠ Estimates based on current data</li>
              <li className="text-orange-700">⚠ Professional inspection recommended</li>
              <li className="text-orange-700">⚠ Rental income assumptions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// AI Insights Tab - AI Analysis if Available
const AIInsightsTab = ({ property, expandedAISection, setExpandedAISection }) => {
  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">AI Confidence Score</span>
          <span className="text-lg font-bold text-blue-600">
            {property.aiIntelligence?.confidenceScore || 0}%
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <BsRobot className="w-4 h-4 mr-1" />
          Powered by {property.aiIntelligence?.model || 'GPT-4'}
        </div>
      </div>
      
      {/* AI Analysis Components */}
      <div className="space-y-3">
        {property.aiIntelligence?.marketAnalysis && (
          <AIAnalysisCard
            title="📊 Market Analysis"
            content={property.aiIntelligence.marketAnalysis}
            isExpanded={expandedAISection === 'market'}
            onToggle={() => setExpandedAISection(expandedAISection === 'market' ? null : 'market')}
          />
        )}
        
        {property.aiIntelligence?.investmentInsights && (
          <AIAnalysisCard
            title="💹 Investment Insights"
            content={property.aiIntelligence.investmentInsights}
            isExpanded={expandedAISection === 'investment'}
            onToggle={() => setExpandedAISection(expandedAISection === 'investment' ? null : 'investment')}
          />
        )}
        
        {property.aiIntelligence?.neighborhoodAnalysis && (
          <AIAnalysisCard
            title="🏘️ Neighborhood Analysis"
            content={property.aiIntelligence.neighborhoodAnalysis}
            isExpanded={expandedAISection === 'neighborhood'}
            onToggle={() => setExpandedAISection(expandedAISection === 'neighborhood' ? null : 'neighborhood')}
          />
        )}
        
        {property.aiIntelligence?.riskAssessment && (
          <AIAnalysisCard
            title="⚠️ Risk Assessment"
            content={property.aiIntelligence.riskAssessment}
            isExpanded={expandedAISection === 'risk'}
            onToggle={() => setExpandedAISection(expandedAISection === 'risk' ? null : 'risk')}
          />
        )}
        
        {property.aiIntelligence?.opportunityIdentification && (
          <AIAnalysisCard
            title="🎯 Opportunity Identification"
            content={property.aiIntelligence.opportunityIdentification}
            isExpanded={expandedAISection === 'opportunity'}
            onToggle={() => setExpandedAISection(expandedAISection === 'opportunity' ? null : 'opportunity')}
          />
        )}
        
        {property.aiIntelligence?.strategicRecommendations && (
          <AIAnalysisCard
            title="🎯 Strategic Recommendations"
            content={property.aiIntelligence.strategicRecommendations}
            isExpanded={expandedAISection === 'strategic'}
            onToggle={() => setExpandedAISection(expandedAISection === 'strategic' ? null : 'strategic')}
          />
        )}
      </div>
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
