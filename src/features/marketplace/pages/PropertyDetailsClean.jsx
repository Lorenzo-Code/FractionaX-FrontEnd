import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPropertyById } from '../../../services/propertyService';
import SEO from "../../../shared/components/SEO";
import { FiArrowLeft, FiMapPin } from 'react-icons/fi';
import { Star } from 'lucide-react';
import { BsRobot } from 'react-icons/bs';
import PhotoSlider from '../components/PhotoSlider';
import '../styles/property-details-mobile.css';

// Investment Calculator Component
const InvestmentCalculator = ({ property }) => {
  const [numberOfTokens, setNumberOfTokens] = useState(1);
  
  const tokenization = property.tokenization;
  if (!tokenization) return null;
  
  const tokenPrice = tokenization.tokenPrice || 1000;
  const maxTokens = Math.floor((tokenization.maximumInvestment || 100000) / tokenPrice);
  
  // Calculate monthly dividend per token based on property type
  const monthlyDividendPerToken = ((property.propertyType === 'Multifamily' ?
    (((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) - ((((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) * 0.08) + 850 + 1250 + 900 + (((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) * 0.03)))
  : property.propertyType === 'Business' ?
    (((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) - ((((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) * 0.08) + 1200 + 1800 + 2500 + (((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) * 0.03)))
  : ((property.monthlyRent || 8500) - (((property.monthlyRent || 8500) * 0.08) + 400 + 650 + 300 + ((property.monthlyRent || 8500) * 0.03)))) / (property.tokenization?.totalTokens || 1000));
  
  const investmentAmount = numberOfTokens * tokenPrice;
  const monthlyReturn = monthlyDividendPerToken * numberOfTokens;
  const annualReturn = monthlyReturn * 12;
  const annualYield = ((annualReturn / investmentAmount) * 100);
  
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
      {/* Input Control */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          How many tokens do you want to buy?
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="1"
            max={maxTokens}
            value={numberOfTokens}
            onChange={(e) => setNumberOfTokens(Number(e.target.value))}
            className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(numberOfTokens / maxTokens) * 100}%, #E5E7EB ${(numberOfTokens / maxTokens) * 100}%, #E5E7EB 100%)`
            }}
          />
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setNumberOfTokens(Math.max(1, numberOfTokens - 1))}
              className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              max={maxTokens}
              value={numberOfTokens}
              onChange={(e) => setNumberOfTokens(Math.max(1, Math.min(maxTokens, Number(e.target.value))))}
              className="w-20 text-center py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={() => setNumberOfTokens(Math.min(maxTokens, numberOfTokens + 1))}
              className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-2">
          <span>1 token</span>
          <span>{maxTokens} tokens (max)</span>
        </div>
      </div>
      
      {/* Results Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Investment Amount */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
          <div className="text-sm text-gray-600 mb-2">Your Investment</div>
          <div className="text-3xl font-bold text-blue-600 mb-1">
            ${investmentAmount.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            {numberOfTokens} token{numberOfTokens > 1 ? 's' : ''} × ${tokenPrice.toLocaleString()}
          </div>
        </div>
        
        {/* Monthly Returns */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
          <div className="text-sm text-gray-600 mb-2">Monthly Dividends</div>
          <div className="text-3xl font-bold text-green-600 mb-1">
            ${monthlyReturn.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">
            ${monthlyDividendPerToken.toFixed(2)}/token/month
          </div>
        </div>
      </div>
      
      {/* Annual Summary */}
      <div className="mt-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6 border-2 border-green-300">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900 mb-2">
            Annual Summary
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-green-700">
                ${annualReturn.toFixed(0)}
              </div>
              <div className="text-sm text-gray-700">Annual Dividends</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-700">
                {annualYield.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-700">Annual Yield</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Preset Buttons */}
      <div className="mt-4">
        <div className="text-xs text-gray-600 mb-2">Quick presets:</div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 5, 10, 25, 50].filter(preset => preset <= maxTokens).map(preset => (
            <button
              key={preset}
              onClick={() => setNumberOfTokens(preset)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                numberOfTokens === preset
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {preset} token{preset > 1 ? 's' : ''}
            </button>
          ))}
        </div>
      </div>
      
      {/* Simple Disclaimer */}
      <div className="mt-4 text-xs text-gray-600 text-center">
        Projections based on current property performance. Returns may vary.
      </div>
    </div>
  );
};

const PropertyDetailsClean = () => {
  const { identifier, clipId } = useParams();
  
  // Determine which identifier to use - clipId for CLIP routes, identifier for simple routes
  const propertyId = clipId || identifier;
  const navigate = useNavigate();
  
  // State management
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Load property data from backend
  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🏠 Loading property from backend:', propertyId);
        const propertyData = await fetchPropertyById(propertyId);
        
        if (propertyData) {
          console.log('✅ Property loaded successfully:', propertyData.title);
          setProperty(propertyData);
        } else {
          setError(`Property not found: ${propertyId}`);
        }
      } catch (error) {
        console.error('❌ Error loading property:', error);
        setError(`Failed to load property: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      loadProperty();
    }
  }, [propertyId]);

  // Handle back navigation
  const handleBackToMarketplace = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/marketplace');
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="text-center py-20 text-gray-600">
        <div className="text-xl font-semibold mb-4">Property Not Found</div>
        <p>{error || 'The requested property could not be loaded.'}</p>
        <button 
          onClick={handleBackToMarketplace}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          ← Back to Marketplace
        </button>
      </div>
    );
  }

  const propertyImages = property.images && property.images.length > 0 
    ? property.images 
    : [property.imgSrc || "https://images.unsplash.com/photo-1564013434775-f3cc601c6e6d?auto=format&fit=crop&w=800&q=80"];

  return (
    <>
      <SEO title={`${property.title} | Property Details - FractionaX`} />
      
      <div className="bg-gray-50 min-h-screen property-details-container">
        {/* Back Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={handleBackToMarketplace}
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors p-2 sm:p-1 -m-2 sm:m-0 rounded-lg hover:bg-blue-50"
            >
              <FiArrowLeft className="w-5 h-5 sm:w-4 sm:h-4" />
              <span className="text-base sm:text-sm font-medium">Back to Marketplace</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            
            {/* Sidebar - Property Summary & Investment */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              {/* Property Summary */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">{property.title}</h2>
                <p className="text-gray-600 text-sm mb-3 sm:mb-4">{property.address}</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold text-gray-900">${property.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Property Type:</span>
                    <span className="font-semibold text-gray-900">{property.propertyType}</span>
                  </div>
                  {property.beds > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Units:</span>
                      <span className="font-semibold text-gray-900">{property.beds}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Square Feet:</span>
                    <span className="font-semibold text-gray-900">{property.sqft.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Year Built:</span>
                    <span className="font-semibold text-gray-900">{property.yearBuilt}</span>
                  </div>
                  {property.expectedROI && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cap Rate:</span>
                      <span className="font-semibold text-green-600">{property.expectedROI.toFixed(2)}%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Investment Summary */}
              {property.tokenization && (
                <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Investment Details</h3>
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">ACTIVE</span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Token Price:</span>
                      <span className="font-semibold text-gray-900">${property.tokenization.tokenPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Tokens:</span>
                      <span className="font-semibold text-gray-900">{property.tokenization.totalTokens.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Monthly Distribution:</span>
                      <span className="font-semibold text-green-600">${property.tokenization.netMonthlyCashFlowPerToken?.toFixed(2) || '0'}/token</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Annual Yield:</span>
                      <span className="font-semibold text-blue-600">{property.tokenization.equityYield?.toFixed(2) || '0'}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Min Investment:</span>
                      <span className="font-semibold text-gray-900">${property.tokenization.minimumInvestment?.toLocaleString() || '1,000'}</span>
                    </div>
                  </div>
                  
                  <button disabled className="w-full bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold cursor-not-allowed mb-3">
                    Invest Now (Demo Only)
                  </button>
                  
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="text-xs text-yellow-800 text-center">
                      <strong>Demo Listing:</strong> Investment features are disabled.
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              {/* Tab Navigation */}
              <div className="mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Property Information</h3>
                    <select 
                      value={activeTab} 
                      onChange={(e) => setActiveTab(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-base font-medium shadow-sm hover:border-gray-300 transition-colors"
                    >
                      <option value="overview">Overview</option>
                      <option value="details">Property Details</option>
                      <option value="financials">Financial Analysis</option>
                      <option value="location">Location & Map</option>
                      <option value="documents">Documents</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Photo Slider */}
              <PhotoSlider 
                images={propertyImages} 
                propertyTitle={property.title}
              />

              {/* Tab Content */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 sm:p-6">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                <div className="space-y-6 sm:space-y-8">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Property Overview</h2>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{property.description}</p>
                  </div>

                  {/* Property Type Specific Content */}
                  {property.propertyType === 'Business' && property.subcategory === 'Car Wash' && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">🚗 Business Operations</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {property.businessMetrics?.expressTunnels || 3}
                          </div>
                          <div className="text-sm text-gray-600">Express Tunnels</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {property.businessMetrics?.vacuumStations || 16}
                          </div>
                          <div className="text-sm text-gray-600">Vacuum Stations</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            ${(property.businessMetrics?.monthlyGrossIncome || 120000).toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Monthly Revenue</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {property.propertyType === 'Multifamily' && (
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">🏢 Multifamily Metrics</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {property.businessMetrics?.units || property.beds}
                          </div>
                          <div className="text-sm text-gray-600">Units</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {((property.businessMetrics?.occupancyRate || 0.94) * 100).toFixed(0)}%
                          </div>
                          <div className="text-sm text-gray-600">Occupancy Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            ${(property.businessMetrics?.avgRentPerUnit || property.monthlyRent || 0).toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Avg Rent/Unit</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Details Tab */}
              {activeTab === 'details' && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Property Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Property Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Property Type:</span>
                          <span className="font-medium">{property.propertyType}</span>
                        </div>
                        {property.subcategory && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Category:</span>
                            <span className="font-medium">{property.subcategory}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Year Built:</span>
                          <span className="font-medium">{property.yearBuilt}</span>
                        </div>
                        {property.sqft > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Square Feet:</span>
                            <span className="font-medium">{property.sqft.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Investment Details</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Token Price:</span>
                          <span className="font-medium">${(property.tokenization?.tokenPrice || 1000).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Tokens:</span>
                          <span className="font-medium">{(property.tokenization?.totalTokens || 1000).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monthly Dividend:</span>
                          <span className="font-medium">${(property.tokenization?.netMonthlyCashFlowPerToken || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Expected ROI:</span>
                          <span className="font-medium">{(property.expectedROI || 0).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Financials Tab */}
              {activeTab === 'financials' && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Detailed Investment Analysis</h2>
                    <p className="text-gray-600">Complete financial breakdown showing exactly how your investment generates returns</p>
                  </div>

                  {/* Property Financial Overview */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-bold">🏢</span>
                      </div>
                      Property Income & Expense Analysis
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Income Side */}
                      <div className="bg-white rounded-lg p-6 border border-green-200">
                        <h4 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
                          <span className="text-green-600 mr-2">💰</span>
                          Monthly Rental Income
                        </h4>
                        
                        <div className="space-y-4">
                          {property.propertyType === 'Multifamily' ? (
                            <>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-700">{property.beds || 12} Units × Average Rent:</span>
                                <span className="font-bold text-green-600">${((property.monthlyRent || 2500) * (property.beds || 12)).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-700">Occupancy Rate ({((property.businessMetrics?.occupancyRate || 0.94) * 100).toFixed(0)}%):</span>
                                <span className="font-bold text-green-600">-${(((property.monthlyRent || 2500) * (property.beds || 12)) * (1 - (property.businessMetrics?.occupancyRate || 0.94))).toFixed(0)}</span>
                              </div>
                              <div className="border-t pt-3 flex justify-between items-center">
                                <span className="text-gray-900 font-semibold">Net Monthly Income:</span>
                                <span className="font-bold text-green-700 text-lg">
                                  ${(((property.monthlyRent || 2500) * (property.beds || 12)) * (property.businessMetrics?.occupancyRate || 0.94)).toLocaleString()}
                                </span>
                              </div>
                            </>
                          ) : property.propertyType === 'Business' ? (
                            <>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-700">Monthly Gross Revenue:</span>
                                <span className="font-bold text-green-600">${(property.businessMetrics?.monthlyGrossIncome || 120000).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-700">Operating Margin (75%):</span>
                                <span className="font-bold text-green-600">×0.75</span>
                              </div>
                              <div className="border-t pt-3 flex justify-between items-center">
                                <span className="text-gray-900 font-semibold">Net Monthly Income:</span>
                                <span className="font-bold text-green-700 text-lg">
                                  ${((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75).toLocaleString()}
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-700">Monthly Lease/Rent:</span>
                                <span className="font-bold text-green-600">${(property.monthlyRent || 8500).toLocaleString()}</span>
                              </div>
                              <div className="border-t pt-3 flex justify-between items-center">
                                <span className="text-gray-900 font-semibold">Net Monthly Income:</span>
                                <span className="font-bold text-green-700 text-lg">${(property.monthlyRent || 8500).toLocaleString()}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Expense Side */}
                      <div className="bg-white rounded-lg p-6 border border-red-200">
                        <h4 className="text-lg font-semibold text-red-700 mb-4 flex items-center">
                          <span className="text-red-600 mr-2">📊</span>
                          Monthly Operating Expenses
                        </h4>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Property Management (8%):</span>
                            <span className="text-red-600">
                              ${
                                property.propertyType === 'Multifamily' 
                                  ? (((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) * 0.08).toFixed(0)
                                  : property.propertyType === 'Business'
                                  ? (((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) * 0.08).toFixed(0)
                                  : ((property.monthlyRent || 8500) * 0.08).toFixed(0)
                              }
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Insurance:</span>
                            <span className="text-red-600">
                              ${
                                property.propertyType === 'Multifamily' 
                                  ? '850'
                                  : property.propertyType === 'Business'
                                  ? '1,200'
                                  : '400'
                              }
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Property Taxes:</span>
                            <span className="text-red-600">
                              ${
                                property.propertyType === 'Multifamily'
                                  ? '1,250'
                                  : property.propertyType === 'Business'
                                  ? '1,800'
                                  : '650'
                              }
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Maintenance & Repairs:</span>
                            <span className="text-red-600">
                              ${
                                property.propertyType === 'Multifamily'
                                  ? '900'
                                  : property.propertyType === 'Business'
                                  ? '2,500'
                                  : '300'
                              }
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">FractionaX Platform Fee (3%):</span>
                            <span className="text-red-600">
                              ${
                                property.propertyType === 'Multifamily' 
                                  ? (((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) * 0.03).toFixed(0)
                                  : property.propertyType === 'Business'
                                  ? (((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) * 0.03).toFixed(0)
                                  : ((property.monthlyRent || 8500) * 0.03).toFixed(0)
                              }
                            </span>
                          </div>
                          
                          <div className="border-t pt-3 flex justify-between items-center">
                            <span className="text-gray-900 font-semibold">Total Monthly Expenses:</span>
                            <span className="font-bold text-red-700 text-lg">
                              ${
                                property.propertyType === 'Multifamily' ?
                                  (((((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) * 0.08) + 850 + 1250 + 900 + (((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) * 0.03))).toLocaleString()
                                : property.propertyType === 'Business' ?
                                  (((((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) * 0.08) + 1200 + 1800 + 2500 + (((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) * 0.03))).toLocaleString()
                                : ((((property.monthlyRent || 8500) * 0.08) + 400 + 650 + 300 + ((property.monthlyRent || 8500) * 0.03))).toLocaleString()
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Net Operating Income */}
                    <div className="mt-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6 border-2 border-green-300">
                      <div className="text-center">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Monthly Net Operating Income (NOI)</h4>
                        <div className="text-3xl font-bold text-green-700 mb-2">
                          ${
                            property.propertyType === 'Multifamily' ?
                              (((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) - ((((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) * 0.08) + 850 + 1250 + 900 + (((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) * 0.03))).toLocaleString()
                            : property.propertyType === 'Business' ?
                              (((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) - ((((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) * 0.08) + 1200 + 1800 + 2500 + (((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) * 0.03))).toLocaleString()
                            : ((property.monthlyRent || 8500) - (((property.monthlyRent || 8500) * 0.08) + 400 + 650 + 300 + ((property.monthlyRent || 8500) * 0.03))).toLocaleString()
                          }
                        </div>
                        <div className="text-sm text-gray-700">
                          Annual NOI: ${
                            property.propertyType === 'Multifamily' ?
                              ((((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) - ((((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) * 0.08) + 850 + 1250 + 900 + (((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) * 0.03))) * 12).toLocaleString()
                            : property.propertyType === 'Business' ?
                              ((((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) - ((((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) * 0.08) + 1200 + 1800 + 2500 + (((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) * 0.03))) * 12).toLocaleString()
                            : (((property.monthlyRent || 8500) - (((property.monthlyRent || 8500) * 0.08) + 400 + 650 + 300 + ((property.monthlyRent || 8500) * 0.03))) * 12).toLocaleString()
                          } • {((property.expectedROI || 8.0)).toFixed(1)}% Cap Rate
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Investment Breakdown & Examples */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-bold">📊</span>
                      </div>
                      Investment Breakdown & Examples
                    </h3>
                    
                    {/* Key Investment Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                      <div className="text-center bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="text-sm font-medium text-blue-600 mb-1">Token Price</div>
                        <div className="text-xl font-bold text-blue-700">
                          ${(property.tokenization?.tokenPrice || 1000).toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="text-center bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="text-sm font-medium text-green-600 mb-1">Monthly Dividend/Token</div>
                        <div className="text-xl font-bold text-green-700">
                          ${
                            (((property.propertyType === 'Multifamily' ?
                              (((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) - ((((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) * 0.08) + 850 + 1250 + 900 + (((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) * 0.03)))
                            : property.propertyType === 'Business' ?
                              (((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) - ((((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) * 0.08) + 1200 + 1800 + 2500 + (((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) * 0.03)))
                            : ((property.monthlyRent || 8500) - (((property.monthlyRent || 8500) * 0.08) + 400 + 650 + 300 + ((property.monthlyRent || 8500) * 0.03))))) / (property.tokenization?.totalTokens || 1000)).toFixed(2)
                          }
                        </div>
                      </div>
                      
                      <div className="text-center bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <div className="text-sm font-medium text-purple-600 mb-1">Annual Yield</div>
                        <div className="text-xl font-bold text-purple-700">
                          {(((((property.propertyType === 'Multifamily' ?
                            (((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) - ((((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) * 0.08) + 850 + 1250 + 900 + (((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) * 0.03)))
                          : property.propertyType === 'Business' ?
                            (((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) - ((((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) * 0.08) + 1200 + 1800 + 2500 + (((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) * 0.03)))
                          : ((property.monthlyRent || 8500) - (((property.monthlyRent || 8500) * 0.08) + 400 + 650 + 300 + ((property.monthlyRent || 8500) * 0.03))))) * 12 / (property.tokenization?.totalTokens || 1000)) / (property.tokenization?.tokenPrice || 1000)) * 100).toFixed(1)}%
                        </div>
                      </div>
                      
                      <div className="text-center bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="text-sm font-medium text-gray-600 mb-1">Available Tokens</div>
                        <div className="text-xl font-bold text-gray-700">
                          {(property.tokenization?.totalTokens || 1000).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    {/* Investment Examples */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* 1 Token Example */}
                      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                        <div className="text-center mb-4">
                          <div className="text-2xl font-bold text-blue-600">1 Token</div>
                          <div className="text-sm text-blue-700 font-medium">${(property.tokenization?.tokenPrice || 1000).toLocaleString()} Investment</div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-700">Monthly dividend:</span>
                            <span className="font-bold text-green-600">
                              ${
                                (((property.propertyType === 'Multifamily' ?
                                  (((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) - ((((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) * 0.08) + 850 + 1250 + 900 + (((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) * 0.03)))
                                : property.propertyType === 'Business' ?
                                  (((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) - ((((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) * 0.08) + 1200 + 1800 + 2500 + (((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) * 0.03)))
                                : ((property.monthlyRent || 8500) - (((property.monthlyRent || 8500) * 0.08) + 400 + 650 + 300 + ((property.monthlyRent || 8500) * 0.03))))) / (property.tokenization?.totalTokens || 1000)).toFixed(2)
                              }
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Annual return:</span>
                            <span className="font-bold text-green-600">
                              ${
                                (((property.propertyType === 'Multifamily' ?
                                  (((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) - ((((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) * 0.08) + 850 + 1250 + 900 + (((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) * 0.03)))
                                : property.propertyType === 'Business' ?
                                  (((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) - ((((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) * 0.08) + 1200 + 1800 + 2500 + (((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) * 0.03)))
                                : ((property.monthlyRent || 8500) - (((property.monthlyRent || 8500) * 0.08) + 400 + 650 + 300 + ((property.monthlyRent || 8500) * 0.03))))) * 12 / (property.tokenization?.totalTokens || 1000)).toFixed(0)
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* 2 Token Example */}
                      <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                        <div className="text-center mb-4">
                          <div className="text-2xl font-bold text-green-600">2 Tokens</div>
                          <div className="text-sm text-green-700 font-medium">${((property.tokenization?.tokenPrice || 1000) * 2).toLocaleString()} Investment</div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-700">Monthly dividend:</span>
                            <span className="font-bold text-green-600">
                              ${
                                (((property.propertyType === 'Multifamily' ?
                                  (((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) - ((((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) * 0.08) + 850 + 1250 + 900 + (((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) * 0.03)))
                                : property.propertyType === 'Business' ?
                                  (((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) - ((((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) * 0.08) + 1200 + 1800 + 2500 + (((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) * 0.03)))
                                : ((property.monthlyRent || 8500) - (((property.monthlyRent || 8500) * 0.08) + 400 + 650 + 300 + ((property.monthlyRent || 8500) * 0.03))))) * 2 / (property.tokenization?.totalTokens || 1000)).toFixed(2)
                              }
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Annual return:</span>
                            <span className="font-bold text-green-600">
                              ${
                                (((property.propertyType === 'Multifamily' ?
                                  (((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) - ((((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) * 0.08) + 850 + 1250 + 900 + (((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) * 0.03)))
                                : property.propertyType === 'Business' ?
                                  (((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) - ((((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) * 0.08) + 1200 + 1800 + 2500 + (((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) * 0.03)))
                                : ((property.monthlyRent || 8500) - (((property.monthlyRent || 8500) * 0.08) + 400 + 650 + 300 + ((property.monthlyRent || 8500) * 0.03))))) * 2 * 12 / (property.tokenization?.totalTokens || 1000)).toFixed(0)
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* 5 Token Example */}
                      <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                        <div className="text-center mb-4">
                          <div className="text-2xl font-bold text-purple-600">5 Tokens</div>
                          <div className="text-sm text-purple-700 font-medium">${((property.tokenization?.tokenPrice || 1000) * 5).toLocaleString()} Investment</div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-700">Monthly dividend:</span>
                            <span className="font-bold text-green-600">
                              ${
                                (((property.propertyType === 'Multifamily' ?
                                  (((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) - ((((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) * 0.08) + 850 + 1250 + 900 + (((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) * 0.03)))
                                : property.propertyType === 'Business' ?
                                  (((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) - ((((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) * 0.08) + 1200 + 1800 + 2500 + (((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) * 0.03)))
                                : ((property.monthlyRent || 8500) - (((property.monthlyRent || 8500) * 0.08) + 400 + 650 + 300 + ((property.monthlyRent || 8500) * 0.03))))) * 5 / (property.tokenization?.totalTokens || 1000)).toFixed(0)
                              }
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Annual return:</span>
                            <span className="font-bold text-green-600">
                              ${
                                (((property.propertyType === 'Multifamily' ?
                                  (((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) - ((((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) * 0.08) + 850 + 1250 + 900 + (((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) * 0.03)))
                                : property.propertyType === 'Business' ?
                                  (((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) - ((((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) * 0.08) + 1200 + 1800 + 2500 + (((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) * 0.03)))
                                : ((property.monthlyRent || 8500) - (((property.monthlyRent || 8500) * 0.08) + 400 + 650 + 300 + ((property.monthlyRent || 8500) * 0.03))))) * 5 * 12 / (property.tokenization?.totalTokens || 1000)).toFixed(0)
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Exit Strategy & How You Make Money */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-bold">🚀</span>
                      </div>
                      How You Make Money: Exit Strategy Explained
                    </h3>
                    
                    <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">💵 Two Ways You Earn Money</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <div className="flex items-center mb-2">
                            <span className="text-green-600 mr-2">💰</span>
                            <span className="font-semibold text-green-800">Monthly Dividends</span>
                          </div>
                          <div className="text-sm text-green-700 mb-2">
                            Every month, you receive cash payments from the property's rental income.
                          </div>
                          <div className="text-lg font-bold text-green-600">
                            ${
                              (((property.propertyType === 'Multifamily' ?
                                (((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) - ((((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) * 0.08) + 850 + 1250 + 900 + (((property.monthlyRent || 2500) * (property.beds || 12) * (property.businessMetrics?.occupancyRate || 0.94)) * 0.03)))
                              : property.propertyType === 'Business' ?
                                (((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) - ((((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) * 0.08) + 1200 + 1800 + 2500 + (((property.businessMetrics?.monthlyGrossIncome || 120000) * 0.75) * 0.03)))
                              : ((property.monthlyRent || 8500) - (((property.monthlyRent || 8500) * 0.08) + 400 + 650 + 300 + ((property.monthlyRent || 8500) * 0.03))))) / (property.tokenization?.totalTokens || 1000)).toFixed(2)
                            } per token/month
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <div className="flex items-center mb-2">
                            <span className="text-blue-600 mr-2">📈</span>
                            <span className="font-semibold text-blue-800">Property Appreciation</span>
                          </div>
                          <div className="text-sm text-blue-700 mb-2">
                            When the property sells, you get your share of the profit from increased value.
                          </div>
                          <div className="text-lg font-bold text-blue-600">
                            ${Math.round(((property.price * 1.4) - property.price) / (property.tokenization?.totalTokens || 1000))} estimated gain per token
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* How to Exit Your Investment */}
                      <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">🚪 How to Exit Your Investment</h4>
                        <div className="space-y-4">
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-start">
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                <span className="text-white text-xs font-bold">1</span>
                              </div>
                              <div>
                                <div className="font-semibold text-blue-800 mb-1">Sell on Secondary Market</div>
                                <div className="text-sm text-blue-700 mb-2">Sell your tokens to other investors before the property sells</div>
                                <div className="text-xs text-blue-600">
                                  • Available after 1 year minimum hold<br/>
                                  • Price determined by supply/demand<br/>
                                  • 2.5% transaction fee<br/>
                                  • Usually trade at slight discount to intrinsic value
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-start">
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                <span className="text-white text-xs font-bold">2</span>
                              </div>
                              <div>
                                <div className="font-semibold text-green-800 mb-1">Wait for Property Sale</div>
                                <div className="text-sm text-green-700 mb-2">Hold until property sells and receive full appreciation</div>
                                <div className="text-xs text-green-600">
                                  • Target timeline: 5-10 years<br/>
                                  • Professional property management maximizes value<br/>
                                  • Institutional buyers (REITs, investment funds)<br/>
                                  • Full appreciation upside potential
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="flex items-start">
                              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                <span className="text-white text-xs font-bold">3</span>
                              </div>
                              <div>
                                <div className="font-semibold text-purple-800 mb-1">Refinancing Cash-Out</div>
                                <div className="text-sm text-purple-700 mb-2">Property refinances at higher value, return some capital to investors</div>
                                <div className="text-xs text-purple-600">
                                  • Partial cash return while keeping ownership<br/>
                                  • Continue receiving monthly dividends<br/>
                                  • Happens when property value increases significantly
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Your Total Return Breakdown */}
                      <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">🎯 Your Total Return Breakdown</h4>
                        
                        {/* Example with 2 tokens */}
                        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 border border-green-200 mb-4">
                          <div className="text-center mb-3">
                            <div className="text-sm font-medium text-gray-700">Example: Investment of 2 tokens</div>
                            <div className="text-2xl font-bold text-gray-900">${((property.tokenization?.tokenPrice || 1000) * 2).toLocaleString()}</div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-700">Monthly dividends:</span>
                              <span className="font-bold text-green-600">
                                ${
                                  (() => {
                                    // Use property-specific tokenization data for accurate calculations
                                    const tokensOwned = 2;
                                    
                                    // Get actual monthly cash flow per token from property data
                                    if (property.tokenization?.netMonthlyCashFlowPerToken) {
                                      return (property.tokenization.netMonthlyCashFlowPerToken * tokensOwned).toFixed(2);
                                    }
                                    
                                    // Fallback calculation based on property type and actual metrics
                                    const tokenPrice = property.tokenization?.tokenPrice || 1000;
                                    const totalTokens = property.tokenization?.totalTokens || 1000;
                                    
                                    if (property.propertyType === 'Multifamily') {
                                      const monthlyNetIncome = (property.businessMetrics?.netOperatingIncome || 600000) / 12;
                                      const monthlyAfterDebt = monthlyNetIncome - ((property.businessMetrics?.netOperatingIncome || 600000) * 0.6 / 12); // Assume 60% debt service
                                      return (monthlyAfterDebt * tokensOwned / totalTokens).toFixed(2);
                                    } else if (property.propertyType === 'Business') {
                                      const monthlyNetCash = (property.businessMetrics?.netCashFlow || 120000) / 12;
                                      return (monthlyNetCash * tokensOwned / totalTokens).toFixed(2);
                                    } else {
                                      // Single family or other - use rent minus expenses
                                      const monthlyRent = property.monthlyRent || 2000;
                                      const monthlyExpenses = monthlyRent * 0.3; // 30% expense ratio
                                      const monthlyNetIncome = monthlyRent - monthlyExpenses;
                                      return (monthlyNetIncome * tokensOwned / totalTokens).toFixed(2);
                                    }
                                  })()
                                }
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-700">Annual dividends:</span>
                              <span className="font-bold text-green-600">
                                ${
                                  (() => {
                                    // Use property-specific tokenization data for accurate calculations
                                    const tokensOwned = 2;
                                    
                                    // Get actual annual cash flow per token from property data
                                    if (property.tokenization?.annualCashFlowPerToken) {
                                      return (property.tokenization.annualCashFlowPerToken * tokensOwned).toFixed(0);
                                    }
                                    
                                    // Calculate from monthly cash flow per token
                                    if (property.tokenization?.netMonthlyCashFlowPerToken) {
                                      return (property.tokenization.netMonthlyCashFlowPerToken * tokensOwned * 12).toFixed(0);
                                    }
                                    
                                    // Fallback calculation based on property type and actual metrics
                                    const totalTokens = property.tokenization?.totalTokens || 1000;
                                    
                                    if (property.propertyType === 'Multifamily') {
                                      const annualNetIncome = property.businessMetrics?.netOperatingIncome || 600000;
                                      const annualAfterDebt = annualNetIncome - (annualNetIncome * 0.6); // Assume 60% debt service
                                      return (annualAfterDebt * tokensOwned / totalTokens).toFixed(0);
                                    } else if (property.propertyType === 'Business') {
                                      const annualNetCash = property.businessMetrics?.netCashFlow || 120000;
                                      return (annualNetCash * tokensOwned / totalTokens).toFixed(0);
                                    } else {
                                      // Single family or other - use rent minus expenses
                                      const monthlyRent = property.monthlyRent || 2000;
                                      const monthlyExpenses = monthlyRent * 0.3; // 30% expense ratio
                                      const annualNetIncome = (monthlyRent - monthlyExpenses) * 12;
                                      return (annualNetIncome * tokensOwned / totalTokens).toFixed(0);
                                    }
                                  })()
                                }
                              </span>
                            </div>
                            
                            <div className="border-t border-gray-200 pt-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-700">7-year dividends total:</span>
                                <span className="font-bold text-green-700">
                                  ${
                                    (() => {
                                      // Use property-specific tokenization data for 7-year calculation
                                      const tokensOwned = 2;
                                      const years = 7;
                                      
                                      // Get actual annual cash flow per token from property data
                                      if (property.tokenization?.annualCashFlowPerToken) {
                                        return (property.tokenization.annualCashFlowPerToken * tokensOwned * years).toFixed(0);
                                      }
                                      
                                      // Calculate from monthly cash flow per token
                                      if (property.tokenization?.netMonthlyCashFlowPerToken) {
                                        return (property.tokenization.netMonthlyCashFlowPerToken * tokensOwned * 12 * years).toFixed(0);
                                      }
                                      
                                      // Fallback calculation based on property type and actual metrics
                                      const totalTokens = property.tokenization?.totalTokens || 1000;
                                      
                                      if (property.propertyType === 'Multifamily') {
                                        const annualNetIncome = property.businessMetrics?.netOperatingIncome || 600000;
                                        const annualAfterDebt = annualNetIncome - (annualNetIncome * 0.6); // Assume 60% debt service
                                        return (annualAfterDebt * tokensOwned * years / totalTokens).toFixed(0);
                                      } else if (property.propertyType === 'Business') {
                                        const annualNetCash = property.businessMetrics?.netCashFlow || 120000;
                                        return (annualNetCash * tokensOwned * years / totalTokens).toFixed(0);
                                      } else {
                                        // Single family or other - use rent minus expenses
                                        const monthlyRent = property.monthlyRent || 2000;
                                        const monthlyExpenses = monthlyRent * 0.3; // 30% expense ratio
                                        const annualNetIncome = (monthlyRent - monthlyExpenses) * 12;
                                        return (annualNetIncome * tokensOwned * years / totalTokens).toFixed(0);
                                      }
                                    })()
                                  }
                                </span>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-700">Property appreciation (2 tokens):</span>
                                <span className="font-bold text-blue-600">
                                  ${
                                    (() => {
                                      // Use property-specific appreciation data if available
                                      const tokensOwned = 2;
                                      
                                      // Use actual appreciation per token from property data
                                      if (property.tokenization?.appreciationPerToken) {
                                        return (property.tokenization.appreciationPerToken * tokensOwned).toLocaleString();
                                      }
                                      
                                      // Calculate appreciation based on property type and market
                                      const tokenPrice = property.tokenization?.tokenPrice || 1000;
                                      let appreciationRate = 0.35; // Default 35% over 7 years
                                      
                                      if (property.propertyType === 'Multifamily') {
                                        appreciationRate = 0.40; // Multifamily typically appreciates 40% over 7 years
                                      } else if (property.propertyType === 'Business' && property.subcategory === 'Car Wash') {
                                        appreciationRate = 0.25; // Commercial businesses more conservative appreciation
                                      }
                                      
                                      return (tokenPrice * tokensOwned * appreciationRate).toLocaleString();
                                    })()
                                  }
                                </span>
                              </div>
                              
                              <div className="flex justify-between items-center border-t border-gray-300 pt-2 mt-2">
                                <span className="text-base font-semibold text-gray-900">Total Return (7 years):</span>
                                <span className="text-xl font-bold text-purple-600">
                                  ${
                                    (() => {
                                      const tokensOwned = 2;
                                      const years = 7;
                                      
                                      // Calculate dividends using property-specific data
                                      let dividends = 0;
                                      if (property.tokenization?.annualCashFlowPerToken) {
                                        dividends = property.tokenization.annualCashFlowPerToken * tokensOwned * years;
                                      } else if (property.tokenization?.netMonthlyCashFlowPerToken) {
                                        dividends = property.tokenization.netMonthlyCashFlowPerToken * tokensOwned * 12 * years;
                                      } else {
                                        // Fallback calculation
                                        const totalTokens = property.tokenization?.totalTokens || 1000;
                                        if (property.propertyType === 'Multifamily') {
                                          const annualNetIncome = property.businessMetrics?.netOperatingIncome || 600000;
                                          const annualAfterDebt = annualNetIncome - (annualNetIncome * 0.6);
                                          dividends = annualAfterDebt * tokensOwned * years / totalTokens;
                                        } else if (property.propertyType === 'Business') {
                                          const annualNetCash = property.businessMetrics?.netCashFlow || 120000;
                                          dividends = annualNetCash * tokensOwned * years / totalTokens;
                                        } else {
                                          const monthlyRent = property.monthlyRent || 2000;
                                          const annualNetIncome = (monthlyRent - (monthlyRent * 0.3)) * 12;
                                          dividends = annualNetIncome * tokensOwned * years / totalTokens;
                                        }
                                      }
                                      
                                      // Calculate appreciation using property-specific data
                                      let appreciation = 0;
                                      if (property.tokenization?.appreciationPerToken) {
                                        appreciation = property.tokenization.appreciationPerToken * tokensOwned;
                                      } else {
                                        const tokenPrice = property.tokenization?.tokenPrice || 1000;
                                        let appreciationRate = 0.35;
                                        if (property.propertyType === 'Multifamily') {
                                          appreciationRate = 0.40;
                                        } else if (property.propertyType === 'Business' && property.subcategory === 'Car Wash') {
                                          appreciationRate = 0.25;
                                        }
                                        appreciation = tokenPrice * tokensOwned * appreciationRate;
                                      }
                                      
                                      return (dividends + appreciation).toLocaleString();
                                    })()
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Return Percentage Explanation */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h5 className="font-semibold text-gray-900 mb-2">What This Means for Your Return:</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-700">Total ROI (7 years):</span>
                              <span className="font-bold text-purple-600">
                                {(
                                  (() => {
                                    const tokensOwned = 2;
                                    const years = 7;
                                    const tokenPrice = property.tokenization?.tokenPrice || 1000;
                                    const investment = tokenPrice * tokensOwned;
                                    
                                    // Calculate dividends using property-specific data
                                    let dividends = 0;
                                    if (property.tokenization?.annualCashFlowPerToken) {
                                      dividends = property.tokenization.annualCashFlowPerToken * tokensOwned * years;
                                    } else if (property.tokenization?.netMonthlyCashFlowPerToken) {
                                      dividends = property.tokenization.netMonthlyCashFlowPerToken * tokensOwned * 12 * years;
                                    } else {
                                      // Fallback calculation
                                      const totalTokens = property.tokenization?.totalTokens || 1000;
                                      if (property.propertyType === 'Multifamily') {
                                        const annualNetIncome = property.businessMetrics?.netOperatingIncome || 600000;
                                        const annualAfterDebt = annualNetIncome - (annualNetIncome * 0.6);
                                        dividends = annualAfterDebt * tokensOwned * years / totalTokens;
                                      } else if (property.propertyType === 'Business') {
                                        const annualNetCash = property.businessMetrics?.netCashFlow || 120000;
                                        dividends = annualNetCash * tokensOwned * years / totalTokens;
                                      }
                                    }
                                    
                                    // Calculate appreciation using property-specific data
                                    let appreciation = 0;
                                    if (property.tokenization?.appreciationPerToken) {
                                      appreciation = property.tokenization.appreciationPerToken * tokensOwned;
                                    } else {
                                      let appreciationRate = 0.35;
                                      if (property.propertyType === 'Multifamily') {
                                        appreciationRate = 0.40;
                                      } else if (property.propertyType === 'Business' && property.subcategory === 'Car Wash') {
                                        appreciationRate = 0.25;
                                      }
                                      appreciation = tokenPrice * tokensOwned * appreciationRate;
                                    }
                                    const totalReturn = dividends + appreciation;
                                    
                                    return ((totalReturn / investment) * 100).toFixed(1);
                                  })()
                                )}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-700">Annualized return:</span>
                              <span className="font-bold text-green-600">
                                {(
                                  (() => {
                                    const tokensOwned = 2;
                                    const years = 7;
                                    const tokenPrice = property.tokenization?.tokenPrice || 1000;
                                    const investment = tokenPrice * tokensOwned;
                                    
                                    // Dividends using property-specific data
                                    let dividends = 0;
                                    if (property.tokenization?.annualCashFlowPerToken) {
                                      dividends = property.tokenization.annualCashFlowPerToken * tokensOwned * years;
                                    } else if (property.tokenization?.netMonthlyCashFlowPerToken) {
                                      dividends = property.tokenization.netMonthlyCashFlowPerToken * tokensOwned * 12 * years;
                                    }
                                    
                                    // Appreciation using property-specific data
                                    let appreciation = 0;
                                    if (property.tokenization?.appreciationPerToken) {
                                      appreciation = property.tokenization.appreciationPerToken * tokensOwned;
                                    } else {
                                      let appreciationRate = 0.35;
                                      if (property.propertyType === 'Multifamily') appreciationRate = 0.40;
                                      if (property.propertyType === 'Business' && property.subcategory === 'Car Wash') appreciationRate = 0.25;
                                      appreciation = tokenPrice * tokensOwned * appreciationRate;
                                    }
                                    
                                    const totalReturn = dividends + appreciation;
                                    
                                    return ((Math.pow((totalReturn + investment) / investment, 1/7) - 1) * 100).toFixed(1);
                                  })()
                                )}%
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                            <div className="text-xs text-blue-800">
                              <strong>Translation:</strong> Your ${((property.tokenization?.tokenPrice || 1000) * 2).toLocaleString()} investment could grow to ${
                                (() => {
                                  const tokensOwned = 2;
                                  const years = 7;
                                  const tokenPrice = property.tokenization?.tokenPrice || 1000;
                                  const investment = tokenPrice * tokensOwned;
                                  
                                  // Dividends using property-specific data
                                  let dividends = 0;
                                  if (property.tokenization?.annualCashFlowPerToken) {
                                    dividends = property.tokenization.annualCashFlowPerToken * tokensOwned * years;
                                  } else if (property.tokenization?.netMonthlyCashFlowPerToken) {
                                    dividends = property.tokenization.netMonthlyCashFlowPerToken * tokensOwned * 12 * years;
                                  }
                                  
                                  // Appreciation using property-specific data  
                                  let appreciation = 0;
                                  if (property.tokenization?.appreciationPerToken) {
                                    appreciation = property.tokenization.appreciationPerToken * tokensOwned;
                                  } else {
                                    let appreciationRate = 0.35;
                                    if (property.propertyType === 'Multifamily') appreciationRate = 0.40;
                                    if (property.propertyType === 'Business' && property.subcategory === 'Car Wash') appreciationRate = 0.25;
                                    appreciation = tokenPrice * tokensOwned * appreciationRate;
                                  }
                                  const totalReturn = dividends + appreciation;
                                  
                                  return (investment + totalReturn).toLocaleString();
                                })()
                              } over 7 years while receiving monthly income.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Interactive Investment Calculator */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-bold">🧮</span>
                      </div>
                      Interactive Investment Calculator
                    </h3>
                    
                    <InvestmentCalculator property={property} />
                  </div>
                  
                  {/* Important Investment Disclaimer */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                          <span className="text-yellow-800 text-sm font-bold">!</span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-semibold text-yellow-800 mb-2">Important Investment Disclosures</h4>
                        <div className="text-sm text-yellow-700 space-y-1">
                          <p>• All return projections are estimates based on current property performance and market assumptions</p>
                          <p>• Monthly distributions may vary based on property performance, vacancy rates, and market conditions</p>
                          <p>• Real estate investments carry risk including loss of principal and illiquidity</p>
                          <p>• Past performance does not guarantee future results</p>
                          <p>• This is not a securities offering - tokens represent fractional ownership in real estate</p>
                          <p>• Please consult with a financial advisor before making investment decisions</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Location Tab */}
              {activeTab === 'location' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Location & Amenities</h2>
                  
                  <div className="mb-8">
                    <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                      <div className="text-center">
                        <FiMapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Interactive map coming soon</p>
                        <p className="text-sm text-gray-500 mt-1">{property.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Schools */}
                  {property.schools && property.schools.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Nearby Schools</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {property.schools.map((school, index) => (
                          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="font-medium text-gray-900">{school.name}</div>
                            <div className="text-sm text-gray-600 mt-1">{school.distance} miles</div>
                            <div className="flex items-center mt-2">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium ml-1">{school.rating}/10</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Documents Tab */}
              {activeTab === 'documents' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Documents & Legal</h2>
                  <div className="text-center py-12">
                    <div className="text-gray-500">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📄</span>
                      </div>
                      <p className="text-lg font-medium mb-2">Documents Available</p>
                      <p className="text-sm">Legal documents and disclosures will be available upon investment commitment.</p>
                    </div>
                  </div>
                </div>
              )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetailsClean;