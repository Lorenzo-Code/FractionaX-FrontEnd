import React from 'react';

const PropertyResearchModal = ({ property, isOpen, onClose }) => {
  if (!isOpen || !property) return null;

  const { clipId, propertyIntelligence, parsedAddress, totalCost, searchResult, apiCalls } = property;

  // Extract data from CoreLogic property intelligence structure
  const buildings = propertyIntelligence?.data?.buildings?.data || propertyIntelligence?.data?.buildings;
  const ownership = propertyIntelligence?.data?.ownership?.data;
  const taxAssessments = propertyIntelligence?.data?.taxAssessments?.items?.[0];
  const propertyDetail = propertyIntelligence?.data?.propertyDetail;
  const rentModel = propertyIntelligence?.data?.rentModel;

  // Extract detailed information
  const buildingInfo = buildings?.buildings?.[0];
  const ownerInfo = ownership?.currentOwners?.ownerNames?.[0];
  const taxInfo = taxAssessments?.assessedValue;
  const locationInfo = propertyDetail?.siteLocation?.data;

  const address = parsedAddress ? 
    `${parsedAddress.streetAddress}, ${parsedAddress.city}, ${parsedAddress.state} ${parsedAddress.zipCode}` : 
    'Address unavailable';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">Property Research Details</h2>
            <p className="text-blue-100">{address}</p>
            <p className="text-blue-200 text-sm">CLIP ID: {clipId}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Cost & API Info */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Research Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Cost:</span>
                <div className="font-semibold text-green-600">${totalCost}</div>
              </div>
              <div>
                <span className="text-gray-600">API Calls:</span>
                <div className="font-semibold">{apiCalls?.length || 0}</div>
              </div>
              <div>
                <span className="text-gray-600">Data Source:</span>
                <div className="font-semibold text-blue-600">CoreLogic</div>
              </div>
              <div>
                <span className="text-gray-600">Research Date:</span>
                <div className="font-semibold">{new Date().toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Details */}
            <div className="space-y-6">
              {/* Basic Property Info */}
              {buildings && (
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Property Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bedrooms:</span>
                      <span className="font-medium">{buildings.allBuildingsSummary?.bedroomsCount || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bathrooms:</span>
                      <span className="font-medium">{buildings.allBuildingsSummary?.bathroomsCount || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Living Area:</span>
                      <span className="font-medium">
                        {buildings.allBuildingsSummary?.livingAreaSquareFeet ? 
                          `${buildings.allBuildingsSummary.livingAreaSquareFeet.toLocaleString()} sq ft` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Area:</span>
                      <span className="font-medium">
                        {buildings.allBuildingsSummary?.totalAreaSquareFeet ? 
                          `${buildings.allBuildingsSummary.totalAreaSquareFeet.toLocaleString()} sq ft` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fireplaces:</span>
                      <span className="font-medium">{buildings.allBuildingsSummary?.fireplacesCount || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Year Built:</span>
                      <span className="font-medium">{buildingInfo?.constructionDetails?.yearBuilt || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stories:</span>
                      <span className="font-medium">{buildingInfo?.structureVerticalProfile?.storiesCount || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Construction Details */}
              {buildingInfo?.constructionDetails && (
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Construction Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Building Style:</span>
                      <span className="font-medium">{buildingInfo.constructionDetails.buildingStyleTypeCode || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Foundation:</span>
                      <span className="font-medium">{buildingInfo.constructionDetails.foundationTypeCode || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Condition:</span>
                      <span className="font-medium">{buildingInfo.constructionDetails.buildingImprovementConditionCode || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Exterior Walls:</span>
                      <span className="font-medium">{buildingInfo.structureExterior?.walls?.typeCode || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Roof Type:</span>
                      <span className="font-medium">{buildingInfo.structureExterior?.roof?.typeCode || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Location Details */}
              {locationInfo && (
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Location Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subdivision:</span>
                      <span className="font-medium">{locationInfo.locationLegal?.subdivisionName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lot Number:</span>
                      <span className="font-medium">{locationInfo.locationLegal?.lotNumber || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lot Size:</span>
                      <span className="font-medium">
                        {locationInfo.lot?.areaSquareFeet ? 
                          `${locationInfo.lot.areaSquareFeet.toLocaleString()} sq ft` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lot Acres:</span>
                      <span className="font-medium">{locationInfo.lot?.areaAcres || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Zoning:</span>
                      <span className="font-medium">{locationInfo.landUseAndZoningCodes?.zoningCode || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Financial & Ownership Info */}
            <div className="space-y-6">
              {/* Tax Assessment */}
              {taxInfo && (
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Tax Assessment (2025)</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Assessed Value:</span>
                      <span className="font-medium text-green-600">
                        ${taxInfo.calculatedTotalValue?.toLocaleString() || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Land Value:</span>
                      <span className="font-medium">${taxInfo.calculatedLandValue?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Improvement Value:</span>
                      <span className="font-medium">${taxInfo.calculatedImprovementValue?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Annual Taxes:</span>
                      <span className="font-medium">${taxAssessments?.taxAmount?.totalTaxAmount?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Update:</span>
                      <span className="font-medium">{taxAssessments?.taxrollUpdate?.lastAssessorUpdateDate || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Ownership */}
              {ownerInfo && (
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Ownership Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Owner:</span>
                      <span className="font-medium">{ownerInfo.fullName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Corporate Owned:</span>
                      <span className="font-medium">{ownerInfo.isCorporate ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Occupancy:</span>
                      <span className="font-medium">{ownership?.currentOwners?.occupancyCode || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mailing Address:</span>
                      <span className="font-medium">
                        {ownership?.currentOwnerMailingInfo?.mailingAddress?.streetAddress || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Sale History */}
              {propertyDetail?.mostRecentOwnerTransfer?.items?.[0] && (
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Sale</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sale Price:</span>
                      <span className="font-medium text-green-600">
                        ${propertyDetail.mostRecentOwnerTransfer.items[0].transactionDetails?.saleAmount?.toLocaleString() || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sale Date:</span>
                      <span className="font-medium">
                        {propertyDetail.mostRecentOwnerTransfer.items[0].transactionDetails?.saleDateDerived || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Financing:</span>
                      <span className="font-medium">
                        {propertyDetail.mostRecentOwnerTransfer.items[0].transactionDetails?.isMortgagePurchase ? 'Mortgage' : 'Cash'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Rent Model */}
              {rentModel && (
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Rental Analysis</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Rent:</span>
                      <span className="font-medium text-blue-600">
                        ${rentModel.estimatedRent?.toLocaleString() || 'N/A'}/month
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cap Rate:</span>
                      <span className="font-medium">{rentModel.capRate || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* API Calls Made */}
              {apiCalls && apiCalls.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">API Calls Made</h3>
                  <div className="space-y-1">
                    {apiCalls.map((call, index) => (
                      <div key={index} className="text-sm text-blue-800">
                        • {call}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyResearchModal;
