import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  MapPin,
  TrendingUp,
  Shield,
  Users,
  Building,
  DollarSign,
  BarChart3,
  CheckCircle,
  Clock,
  Loader2,
  RefreshCw,
  Info,
  AlertTriangle
} from 'lucide-react';

const EnrichmentStep = ({ listingData, onNext, onPrevious, loading }) => {
  const [enrichmentStatus, setEnrichmentStatus] = useState('idle'); // idle, loading, success, error
  const [enrichmentData, setEnrichmentData] = useState(null);
  const [error, setError] = useState(null);

  const handleEnrichment = () => {
    setEnrichmentStatus('loading');
    setError(null);
    onNext(); // This will trigger the API call in the parent component
  };

  // Simulate enrichment completion when listingData includes enrichment data
  useEffect(() => {
    if (listingData?.enrichmentData) {
      setEnrichmentData(listingData.enrichmentData);
      setEnrichmentStatus('success');
    }
  }, [listingData]);

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPercentage = (value) => {
    if (!value) return 'N/A';
    return `${value.toFixed(1)}%`;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Step 4: Property Auto-Enrichment</h2>
        <p className="text-gray-600">
          We'll automatically pull market data, comparables, and risk assessment information from CoreLogic to enhance your listing.
        </p>
      </div>

      {/* Enrichment Status */}
      <div className="mb-8">
        {enrichmentStatus === 'idle' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
              <Sparkles className="w-6 h-6 text-blue-500 mt-1 mr-4" />
              <div className="flex-1">
                <h3 className="text-lg font-medium text-blue-900 mb-2">Ready to Enrich Your Listing</h3>
                <p className="text-blue-700 mb-4">
                  Click below to automatically pull comprehensive property data including:
                </p>
                <ul className="list-disc list-inside text-sm text-blue-700 space-y-1 mb-6">
                  <li>Recent sales history and comparable properties</li>
                  <li>Market value estimates and price per square foot</li>
                  <li>Risk assessments (flood, earthquake, crime scores)</li>
                  <li>Demographic data and area statistics</li>
                  <li>Market trends and occupancy rates</li>
                </ul>
                <button
                  onClick={handleEnrichment}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Auto-Enrichment
                </button>
              </div>
            </div>
          </div>
        )}

        {enrichmentStatus === 'loading' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center">
              <Loader2 className="w-6 h-6 text-yellow-500 animate-spin mr-4" />
              <div>
                <h3 className="text-lg font-medium text-yellow-900 mb-1">Enriching Property Data</h3>
                <p className="text-yellow-700">
                  Pulling data from CoreLogic... This usually takes 30-60 seconds.
                </p>
              </div>
            </div>
          </div>
        )}

        {enrichmentStatus === 'success' && enrichmentData && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-500 mr-4" />
              <div>
                <h3 className="text-lg font-medium text-green-900">Enrichment Complete!</h3>
                <p className="text-green-700">
                  Successfully pulled comprehensive property data from CoreLogic.
                </p>
              </div>
            </div>
            
            <div className="text-xs text-green-600 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              Enriched: {formatDate(enrichmentData.enrichedAt)}
              <span className="mx-2">•</span>
              Source: {enrichmentData.enrichmentSource}
            </div>
          </div>
        )}

        {enrichmentStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-red-500 mt-1 mr-4" />
              <div className="flex-1">
                <h3 className="text-lg font-medium text-red-900 mb-2">Enrichment Failed</h3>
                <p className="text-red-700 mb-4">
                  {error || 'Unable to retrieve property data at this time. You can continue without enrichment or try again.'}
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={handleEnrichment}
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </button>
                  <button
                    onClick={() => setEnrichmentStatus('success')}
                    className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Skip Enrichment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enrichment Data Display */}
      {enrichmentData && enrichmentStatus === 'success' && (
        <div className="space-y-6 mb-8">
          {/* Sales History & Valuation */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-600" />
              Sales History & Valuation
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Last Sale Price</div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatCurrency(enrichmentData.lastSalePrice)}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(enrichmentData.lastSaleDate)}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Assessed Value</div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatCurrency(enrichmentData.assessedValue)}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Market Value</div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatCurrency(enrichmentData.marketValue)}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Price per SF</div>
                <div className="text-lg font-semibold text-gray-900">
                  {enrichmentData.pricePerSquareFoot ? 
                    formatCurrency(enrichmentData.pricePerSquareFoot) : 'N/A'
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Comparable Properties */}
          {enrichmentData.comparables && enrichmentData.comparables.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                Comparable Properties
              </h3>
              
              <div className="space-y-3">
                {enrichmentData.comparables.slice(0, 3).map((comp, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{comp.address}</div>
                      <div className="text-sm text-gray-500">
                        {comp.distance.toFixed(1)} miles away • {formatDate(comp.saleDate)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(comp.salePrice)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatCurrency(comp.pricePerSF)}/SF
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risk Assessment */}
          {enrichmentData.riskAssessment && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-red-600" />
                Risk Assessment
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Flood Risk</div>
                  <div className="font-medium text-gray-900">
                    {enrichmentData.riskAssessment.floodRisk}
                  </div>
                  <div className="text-xs text-gray-500">
                    Zone: {enrichmentData.riskAssessment.floodZone}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Earthquake Risk</div>
                  <div className="font-medium text-gray-900">
                    {enrichmentData.riskAssessment.earthquakeRisk}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Crime Score</div>
                  <div className="font-medium text-gray-900">
                    {enrichmentData.riskAssessment.crimeScore}/100
                  </div>
                  <div className="text-xs text-gray-500">
                    Lower is better
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Walk Score</div>
                  <div className="font-medium text-gray-900">
                    {enrichmentData.riskAssessment.walkScore}/100
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Transit Score</div>
                  <div className="font-medium text-gray-900">
                    {enrichmentData.riskAssessment.transitScore}/100
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Demographics & Market Data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Demographics */}
            {enrichmentData.demographics && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-purple-600" />
                  Demographics
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Population</span>
                    <span className="font-medium">
                      {enrichmentData.demographics.population?.toLocaleString() || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Median Income</span>
                    <span className="font-medium">
                      {formatCurrency(enrichmentData.demographics.medianIncome)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Employment Rate</span>
                    <span className="font-medium">
                      {formatPercentage(enrichmentData.demographics.employmentRate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Age</span>
                    <span className="font-medium">
                      {enrichmentData.demographics.averageAge || 'N/A'} years
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Market Data */}
            {enrichmentData.marketData && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                  Market Data
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Cap Rate</span>
                    <span className="font-medium">
                      {formatPercentage(enrichmentData.marketData.averageCapRate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Price/SF</span>
                    <span className="font-medium">
                      {formatCurrency(enrichmentData.marketData.averagePricePerSF)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Occupancy Rates</span>
                    <span className="font-medium">
                      {formatPercentage(enrichmentData.marketData.occupancyRates)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rent Growth</span>
                    <span className="font-medium">
                      {formatPercentage(enrichmentData.marketData.rentGrowth)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Data Quality Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
              <div className="text-sm">
                <div className="font-medium text-blue-900 mb-1">Data Quality Notice</div>
                <div className="text-blue-700">
                  This enrichment data is sourced from CoreLogic and provides market insights to enhance your listing. 
                  Data accuracy may vary and should be verified for investment decisions. The enriched data will be included 
                  in your syndication exports to provide buyers with comprehensive property information.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onPrevious}
          disabled={loading || enrichmentStatus === 'loading'}
          className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Documents
        </button>

        <button
          type="button"
          onClick={() => onNext()}
          disabled={loading || enrichmentStatus === 'loading'}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading || enrichmentStatus === 'loading' ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Continue to Review
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default EnrichmentStep;