import React from 'react';

const ComprehensiveResults = ({ data, onClose }) => {
  if (!data) return null;

  const { parsed_intent, property_intelligence, zillow_images, climate_risk, processing_summary } = data;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">🏠 Comprehensive Property Analysis</h2>
            <p className="text-sm text-gray-600 mt-1">
              {parsed_intent?.address1}, {parsed_intent?.city}, {parsed_intent?.state}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Property Images */}
          {zillow_images && zillow_images.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">📸 Property Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {zillow_images.slice(0, 4).map((image, idx) => (
                  <img
                    key={idx}
                    src={image.imgSrc}
                    alt={`Property view ${idx + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Property Intelligence */}
          {property_intelligence && (
            <div>
              <h3 className="text-lg font-semibold mb-3">🧠 Property Intelligence</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Basic Property Info */}
                {property_intelligence.data?.property && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Basic Information</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Year Built:</span> {property_intelligence.data.property.yearBuilt}</p>
                      <p><span className="font-medium">Lot Size:</span> {property_intelligence.data.property.lotSizeSquareFeet?.toLocaleString()} sq ft</p>
                      <p><span className="font-medium">Living Area:</span> {property_intelligence.data.property.livingAreaSquareFeet?.toLocaleString()} sq ft</p>
                      <p><span className="font-medium">Bedrooms:</span> {property_intelligence.data.property.bedrooms}</p>
                      <p><span className="font-medium">Bathrooms:</span> {property_intelligence.data.property.bathrooms}</p>
                    </div>
                  </div>
                )}

                {/* Valuation */}
                {property_intelligence.data?.valuation && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">💰 Valuation</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">AVM:</span> ${property_intelligence.data.valuation.avm?.amount?.toLocaleString()}</p>
                      <p><span className="font-medium">AVM Low:</span> ${property_intelligence.data.valuation.avmLow?.amount?.toLocaleString()}</p>
                      <p><span className="font-medium">AVM High:</span> ${property_intelligence.data.valuation.avmHigh?.amount?.toLocaleString()}</p>
                      <p><span className="font-medium">Confidence:</span> {property_intelligence.data.valuation.avm?.confidence}</p>
                    </div>
                  </div>
                )}

                {/* Market Data */}
                {property_intelligence.data?.marketData && (
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-medium text-purple-900 mb-2">📊 Market Data</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Days on Market:</span> {property_intelligence.data.marketData.daysOnMarket}</p>
                      <p><span className="font-medium">Price per Sq Ft:</span> ${property_intelligence.data.marketData.pricePerSquareFoot}</p>
                      <p><span className="font-medium">Market Status:</span> {property_intelligence.data.marketData.marketStatus}</p>
                    </div>
                  </div>
                )}

                {/* School Information */}
                {property_intelligence.data?.schools && property_intelligence.data.schools.length > 0 && (
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-900 mb-2">🏫 Schools</h4>
                    <div className="space-y-2 text-sm">
                      {property_intelligence.data.schools.slice(0, 3).map((school, idx) => (
                        <div key={idx}>
                          <p className="font-medium">{school.name}</p>
                          <p className="text-gray-600">{school.type} • Grade {school.lowGrade}-{school.highGrade}</p>
                          <p className="text-gray-600">Distance: {school.distance} miles</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Climate Risk */}
          {climate_risk && (
            <div>
              <h3 className="text-lg font-semibold mb-3">🌍 Climate Risk Analysis</h3>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {climate_risk.floodRisk || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Flood Risk</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {climate_risk.fireRisk || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Fire Risk</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {climate_risk.windRisk || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Wind Risk</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Processing Summary */}
          {processing_summary && (
            <div>
              <h3 className="text-lg font-semibold mb-3">⚡ Processing Summary</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {processing_summary.successful_calls}
                    </div>
                    <div className="text-sm text-gray-600">Successful API Calls</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">
                      {processing_summary.error_count}
                    </div>
                    <div className="text-sm text-gray-600">Errors</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">
                      Processed: {new Date(processing_summary.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
              📊 Get Comparables
            </button>
            <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition">
              🎯 View Propensity Scores
            </button>
            <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition">
              📈 Market Trends
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveResults;
