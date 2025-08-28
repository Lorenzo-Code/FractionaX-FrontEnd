import React from 'react';

const CoreLogicPropertyCard = ({ property, compact = false, onClick, isSelected = false }) => {
  console.log('🏠 CoreLogic Property Data:', property);
  
  // Handle both CoreLogic property research data and regular search results
  const isPropertyResearch = property.clipId || property.propertyIntelligence;
  
  if (isPropertyResearch) {
    return <CoreLogicResearchCard 
      property={property} 
      compact={compact} 
      onClick={onClick} 
      isSelected={isSelected} 
    />;
  } else {
    return <RegularPropertyCard 
      property={property} 
      compact={compact} 
      onClick={onClick} 
      isSelected={isSelected} 
    />;
  }
};

// Component for CoreLogic property research results
const CoreLogicResearchCard = ({ property, compact, onClick, isSelected }) => {
  const { clipId, propertyIntelligence, parsedAddress, totalCost, searchResult } = property;
  
  // Extract data from CoreLogic property intelligence structure
  const buildings = propertyIntelligence?.data?.buildings?.data || propertyIntelligence?.data?.buildings;
  const ownership = propertyIntelligence?.data?.ownership?.data;
  const taxAssessments = propertyIntelligence?.data?.taxAssessments?.items?.[0] || propertyIntelligence?.data?.taxAssessments?.data;
  const propertyDetail = propertyIntelligence?.data?.propertyDetail;
  
  // Extract property details from the nested structure
  const bedrooms = buildings?.allBuildingsSummary?.bedroomsCount || 
                  buildings?.buildings?.[0]?.interiorRooms?.bedroomsCount || 'N/A';
  
  const bathrooms = buildings?.allBuildingsSummary?.bathroomsCount || 
                   buildings?.buildings?.[0]?.interiorRooms?.bathroomsCount || 'N/A';
  
  const sqft = buildings?.allBuildingsSummary?.livingAreaSquareFeet || 
              buildings?.buildings?.[0]?.interiorArea?.livingAreaSquareFeet || 'N/A';
  
  const yearBuilt = buildings?.buildings?.[0]?.constructionDetails?.yearBuilt || 
                   propertyDetail?.buildings?.data?.buildings?.[0]?.constructionDetails?.yearBuilt || 'N/A';
  
  // Get assessed value as the price
  const assessedValue = taxAssessments?.assessedValue?.calculatedTotalValue || 'N/A';
  const lastSalePrice = propertyDetail?.mostRecentOwnerTransfer?.items?.[0]?.transactionDetails?.saleAmount || 
                       searchResult?.items?.[0]?.transactionDetails?.saleAmount;
  
  // Get address
  const address = parsedAddress ? 
    `${parsedAddress.streetAddress}, ${parsedAddress.city}, ${parsedAddress.state} ${parsedAddress.zipCode}` : 
    searchResult?.items?.[0]?.propertyAddress ? 
      `${searchResult.items[0].propertyAddress.streetAddress}, ${searchResult.items[0].propertyAddress.city}, ${searchResult.items[0].propertyAddress.state}` :
      'Address unavailable';
  
  // Get owner name
  const ownerName = ownership?.currentOwners?.ownerNames?.[0]?.fullName || 'Owner information unavailable';
  
  // Get annual taxes
  const annualTaxes = taxAssessments?.taxAmount?.totalTaxAmount || 'N/A';
  
  // Get lot size from location data
  const lotSize = propertyDetail?.siteLocation?.data?.lot?.areaSquareFeet || 'N/A';
  
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer bg-white rounded-lg border-2 shadow-sm hover:shadow-lg transition duration-300 overflow-hidden ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 h-32 flex items-center justify-center">
        {/* CoreLogic Badge */}
        <div className="absolute top-2 left-2">
          <span className="bg-white text-blue-600 text-xs font-semibold px-3 py-1 rounded-full flex items-center shadow-sm">
            <span className="mr-1">🏢</span>
            CoreLogic
          </span>
        </div>
        
        {/* Cost Badge */}
        <div className="absolute top-2 right-2">
          <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            ${totalCost} API Cost
          </span>
        </div>
        
        {/* Main Property Info */}
        <div className="text-center text-white">
          <div className="text-2xl font-bold mb-1">
            {bedrooms || 'N/A'} bd • {bathrooms || 'N/A'} ba
          </div>
          <div className="text-sm opacity-90">
            {sqft !== 'N/A' ? `${sqft.toLocaleString()} sq ft` : 'Size N/A'}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {/* Address */}
        <div className="mb-3">
          <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
            {address}
          </h3>
          <div className="text-xs text-gray-600">
            CLIP ID: {clipId}
          </div>
        </div>
        
        {/* Property Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
          <div className="bg-gray-50 rounded p-2">
            <div className="text-gray-600">Assessed Value</div>
            <div className="font-semibold text-gray-900">
              {assessedValue !== 'N/A' ? `$${assessedValue.toLocaleString()}` : 'N/A'}
            </div>
          </div>
          <div className="bg-gray-50 rounded p-2">
            <div className="text-gray-600">Year Built</div>
            <div className="font-semibold text-gray-900">{yearBuilt}</div>
          </div>
          <div className="bg-gray-50 rounded p-2">
            <div className="text-gray-600">Annual Taxes</div>
            <div className="font-semibold text-gray-900">
              {annualTaxes !== 'N/A' ? `$${annualTaxes.toLocaleString()}` : 'N/A'}
            </div>
          </div>
          <div className="bg-gray-50 rounded p-2">
            <div className="text-gray-600">Lot Size</div>
            <div className="font-semibold text-gray-900">
              {lotSize !== 'N/A' ? `${lotSize.toLocaleString()} sq ft` : 'N/A'}
            </div>
          </div>
        </div>
        
        {/* Owner Information */}
        <div className="mb-3 bg-blue-50 rounded p-2">
          <div className="text-xs text-blue-600 font-semibold mb-1">Owner Information</div>
          <div className="text-xs text-blue-800">{ownerName}</div>
        </div>
        
        {/* Last Sale Info */}
        {lastSalePrice && (
          <div className="mb-3 bg-green-50 rounded p-2">
            <div className="text-xs text-green-600 font-semibold mb-1">Last Sale</div>
            <div className="text-xs text-green-800">${lastSalePrice.toLocaleString()}</div>
          </div>
        )}
        
        {/* Data Quality */}
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-600">
            <span className="bg-gray-100 px-2 py-1 rounded">
              Research Data
            </span>
          </div>
          <div className="text-xs text-blue-600 font-semibold">
            Click for Details
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for regular property search results (existing format)
const RegularPropertyCard = ({ property, compact, onClick, isSelected }) => {
  const {
    image,
    carouselPhotos,
    address,
    beds,
    baths,
    sqft,
    price,
    aiScore,
    dataQuality,
    location
  } = property;

  // Enhanced image handling
  const imgSrc = carouselPhotos?.[0] || 
                image || 
                "https://via.placeholder.com/400x300?text=No+Image";

  // Improved address handling
  const fullAddress = address?.oneLine || property.fulladdress1 || property.address || "Address unavailable";
  
  // Data quality indicator
  const getQualityColor = () => {
    switch(dataQuality) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'partial': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer bg-white rounded-lg border-2 shadow-sm hover:shadow-lg transition duration-300 overflow-hidden ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="relative">
        <img
          src={imgSrc}
          alt={`Image of ${fullAddress}`}
          className="w-full h-40 object-cover"
        />
        {/* AI Match Score */}
        <div className="absolute top-2 right-2">
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {typeof aiScore === "number" ? `${aiScore}% Match` : "AI Match"}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
            {fullAddress}
          </h3>
          <div className="flex items-center text-xs text-gray-600 space-x-3">
            <span>{beds || 'N/A'} bd</span>
            <span>{baths || 'N/A'} ba</span>
            <span>{sqft ? sqft.toLocaleString() : 'N/A'} sq ft</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-lg font-bold text-gray-900">
            {price != null && !isNaN(price) ? `$${price.toLocaleString()}` : "Price TBD"}
          </div>
          <div className="text-xs text-blue-600 font-semibold">
            View Details
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoreLogicPropertyCard;
