import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPropertyById } from '../../../services/propertyService';
import SEO from "../../../shared/components/SEO";
import { FiArrowLeft, FiChevronLeft, FiChevronRight, FiMapPin } from 'react-icons/fi';
import { X, Star } from 'lucide-react';
import { BsRobot } from 'react-icons/bs';

// Investment Calculator Component
const InvestmentCalculator = ({ property }) => {
  const [investmentAmount, setInvestmentAmount] = useState(property.tokenization?.minimumInvestment || 5000);
  const [holdPeriod, setHoldPeriod] = useState(5);
  const [customTokenPrice] = useState(property.tokenization?.tokenPrice || 1000);
  
  const tokenization = property.tokenization;
  if (!tokenization) return null;
  
  // Calculate number of tokens
  const numberOfTokens = Math.floor(investmentAmount / customTokenPrice);
  
  // Calculate returns based on property type
  const calculateReturns = () => {
    const annualCashFlow = tokenization.annualCashFlowPerToken || tokenization.netCashFlowPerToken * 12 || 0;
    const totalDividends = annualCashFlow * numberOfTokens * holdPeriod;
    
    // Appreciation calculation
    const appreciationRate = property.propertyType === 'Land' ? 0.025 : 0.03; // Ground leases 2.5%, others 3%
    const currentValue = investmentAmount;
    const futureValue = currentValue * Math.pow(1 + appreciationRate, holdPeriod);
    const appreciationGain = futureValue - currentValue;
    
    const totalReturn = totalDividends + appreciationGain;
    const totalReturnPercent = ((totalReturn / investmentAmount) - 1) * 100;
    const annualizedReturn = (Math.pow(totalReturn / investmentAmount, 1/holdPeriod) - 1) * 100;
    
    return {
      numberOfTokens,
      annualDividend: annualCashFlow * numberOfTokens,
      monthlyDividend: (annualCashFlow * numberOfTokens) / 12,
      totalDividends,
      appreciationGain,
      totalReturn,
      totalReturnPercent,
      annualizedReturn
    };
  };
  
  const results = calculateReturns();
  
  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-6">
      {/* Input Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Investment Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              min={tokenization.minimumInvestment || 1000}
              max={tokenization.maximumInvestment || 100000}
              step={customTokenPrice}
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(Number(e.target.value))}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Min: ${tokenization.minimumInvestment?.toLocaleString()} • Max: ${tokenization.maximumInvestment?.toLocaleString()}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hold Period (Years)
          </label>
          <select
            value={holdPeriod}
            onChange={(e) => setHoldPeriod(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value={3}>3 years</option>
            <option value={5}>5 years</option>
            <option value={7}>7 years</option>
            <option value={10}>10 years</option>
            <option value={15}>15 years</option>
          </select>
        </div>
      </div>
      
      {/* Results Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Token Purchase */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Token Purchase</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Number of Tokens:</span>
              <span className="font-bold text-orange-600">{results.numberOfTokens}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Price per Token:</span>
              <span className="font-medium">${customTokenPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-900 font-medium">Total Investment:</span>
              <span className="font-bold text-gray-900">${(results.numberOfTokens * customTokenPrice).toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        {/* Income Stream */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Income Stream</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Dividend:</span>
              <span className="font-bold text-green-600">${results.monthlyDividend.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Annual Dividend:</span>
              <span className="font-bold text-green-600">${results.annualDividend.toFixed(0)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-900 font-medium">Total Dividends ({holdPeriod}yr):</span>
              <span className="font-bold text-green-700">${results.totalDividends.toFixed(0)}</span>
            </div>
          </div>
        </div>
        
        {/* Total Returns */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Total Returns</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Appreciation:</span>
              <span className="font-bold text-purple-600">${results.appreciationGain.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Return:</span>
              <span className="font-bold text-blue-600">${results.totalReturn.toFixed(0)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-900 font-medium">Annualized IRR:</span>
              <span className="font-bold text-orange-600">{results.annualizedReturn.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Investment Summary */}
      <div className="mt-6 bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg p-4 border border-orange-200">
        <div className="text-center">
          <div className="text-lg font-semibold text-orange-800 mb-2">
            Investment Summary: ${(results.numberOfTokens * customTokenPrice).toLocaleString()} → ${results.totalReturn.toFixed(0)}
          </div>
          <div className="text-sm text-orange-700">
            <span className="font-medium">{results.totalReturnPercent.toFixed(1)}% total return</span> over {holdPeriod} years
            ({results.annualizedReturn.toFixed(1)}% annualized)
          </div>
          <div className="text-xs text-orange-600 mt-1">
            Includes ${results.totalDividends.toFixed(0)} in dividends + ${results.appreciationGain.toFixed(0)} in appreciation
          </div>
        </div>
      </div>
      
      {/* Property-Specific Disclaimers */}
      <div className="mt-4 text-xs text-gray-600 space-y-1">
        <div>• Calculations are projections based on current property data and market assumptions</div>
        <div>• {property.propertyType === 'Land' ? 'Ground lease' : 'Property'} appreciation estimated at {property.propertyType === 'Land' ? '2.5%' : '3%'} annually</div>
        <div>• Actual results may vary based on market conditions, property performance, and economic factors</div>
        {tokenization.distributionFrequency === 'monthly' && (
          <div>• Monthly distributions subject to property cash flow and management decisions</div>
        )}
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

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

  // Image gallery functions
  const nextImage = () => {
    if (!property?.images) return;
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const previousImage = () => {
    if (!property?.images) return;
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const openFullscreen = () => {
    setIsFullscreenOpen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreenOpen(false);
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
      
      <div className="bg-gray-50 min-h-screen">
        {/* Back Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={handleBackToMarketplace}
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">← Back to Marketplace</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar - Property Summary & Investment */}
            <div className="lg:col-span-1">
              {/* Property Summary */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{property.title}</h2>
                <p className="text-gray-600 text-sm mb-4">{property.address}</p>
                
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
                <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Investment Details</h3>
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

              {/* Navigation */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <nav className="space-y-1">
                  {[
                    { key: 'overview', label: 'Overview' },
                    { key: 'details', label: 'Property Details' },
                    { key: 'financials', label: 'Financial Analysis' },
                    { key: 'location', label: 'Location & Map' },
                    { key: 'documents', label: 'Documents' },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === tab.key
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {/* Photo Gallery */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="relative">
                  <div className="aspect-w-16 aspect-h-10 bg-gray-200">
                    <img
                      src={propertyImages[currentImageIndex]}
                      alt={`${property.title} - Photo ${currentImageIndex + 1}`}
                      className="w-full h-[400px] md:h-[500px] object-cover cursor-pointer"
                      onClick={openFullscreen}
                    />
                  </div>
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm">
                    {currentImageIndex + 1} / {propertyImages.length}
                  </div>
                  
                  {/* Navigation Arrows */}
                  {propertyImages.length > 1 && (
                    <>
                      <button
                        onClick={previousImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200"
                      >
                        <FiChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200"
                      >
                        <FiChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
                
                {/* Thumbnail Strip */}
                {propertyImages.length > 1 && (
                  <div className="p-4 bg-white border-t border-gray-200">
                    <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                      {propertyImages.slice(0, 10).map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`aspect-square rounded overflow-hidden border-2 transition-all duration-200 ${
                            index === currentImageIndex
                              ? 'border-blue-500'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                      {propertyImages.length > 10 && (
                        <div className="aspect-square rounded bg-gray-200 border-2 border-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-600 font-medium">+{propertyImages.length - 10}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Tab Content */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Property Overview</h2>
                    <p className="text-gray-600 leading-relaxed">{property.description}</p>
                  </div>

                  {/* Property Type Specific Content */}
                  {property.propertyType === 'Business' && property.subcategory === 'Car Wash' && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">🚗 Business Operations</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">🏢 Multifamily Metrics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Information</h3>
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
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Details</h3>
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
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Financial Analysis</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue & Income</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monthly Revenue:</span>
                          <span className="font-medium text-green-600">
                            ${(property.businessMetrics?.monthlyGrossIncome || property.monthlyRent || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Annual NOI:</span>
                          <span className="font-medium text-blue-600">
                            ${(property.businessMetrics?.netOperatingIncome || (property.monthlyRent || 0) * 12 * 0.7).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cap Rate:</span>
                          <span className="font-medium">
                            {(((property.businessMetrics?.netOperatingIncome || (property.monthlyRent || 0) * 12 * 0.7) / property.price) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Token Investment</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Minimum Investment:</span>
                          <span className="font-medium">${(property.tokenization?.tokenPrice || 1000).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Annual Cash Yield:</span>
                          <span className="font-medium text-green-600">
                            {(property.tokenization?.equityYield || 0).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">5-Year Total Return:</span>
                          <span className="font-medium text-purple-600">
                            ${(property.tokenization?.fiveYearTotalReturnPerToken || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Management Fee Structure */}
                  {property.managementFees && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-white text-sm font-bold">F</span>
                        </div>
                        FractionaX Management Fee Structure
                      </h3>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Acquisition Fee */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-blue-900">Acquisition Fee</h4>
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                              One-Time
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-blue-600 mb-2">
                            {property.managementFees.acquisitionFee?.percentage}%
                          </div>
                          <div className="text-sm text-blue-700 mb-3">
                            ${property.managementFees.acquisitionFee?.amount?.toLocaleString()}
                          </div>
                          <div className="text-xs text-blue-600">
                            {property.managementFees.acquisitionFee?.description}
                          </div>
                        </div>
                        
                        {/* Asset Management Fee */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-green-900">Asset Management Fee</h4>
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                              Annual
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-green-600 mb-2">
                            {property.managementFees.assetManagementFee?.percentage}%
                          </div>
                          <div className="text-sm text-green-700 mb-3">
                            ${property.managementFees.assetManagementFee?.annualAmount?.toLocaleString()}/year
                          </div>
                          <div className="text-xs text-green-600">
                            {property.managementFees.assetManagementFee?.description}
                          </div>
                        </div>
                        
                        {/* Performance Fee */}
                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-purple-900">Performance Fee</h4>
                            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                              Growth-Based
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-purple-600 mb-2">
                            {property.managementFees.performanceFee?.percentage}%
                          </div>
                          <div className="text-sm text-purple-700 mb-3">
                            {property.managementFees.performanceFee?.trigger}
                          </div>
                          <div className="text-xs text-purple-600">
                            {property.managementFees.performanceFee?.description}
                          </div>
                        </div>
                        
                        {/* Disposition Fee */}
                        {property.managementFees.dispositionFee && (
                          <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-semibold text-orange-900">Disposition Fee</h4>
                              <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                                At Sale
                              </span>
                            </div>
                            <div className="text-2xl font-bold text-orange-600 mb-2">
                              {property.managementFees.dispositionFee?.percentage}%
                            </div>
                            <div className="text-sm text-orange-700 mb-3">
                              Of sale price
                            </div>
                            <div className="text-xs text-orange-600">
                              {property.managementFees.dispositionFee?.description}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Fee Summary */}
                      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Fee Structure Benefits</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-start">
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                              <span className="text-white text-xs">✓</span>
                            </div>
                            <span className="text-gray-700">Professional asset management and oversight</span>
                          </div>
                          <div className="flex items-start">
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                              <span className="text-white text-xs">✓</span>
                            </div>
                            <span className="text-gray-700">Performance-aligned fee structure</span>
                          </div>
                          <div className="flex items-start">
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                              <span className="text-white text-xs">✓</span>
                            </div>
                            <span className="text-gray-700">Transparent fee disclosure</span>
                          </div>
                          <div className="flex items-start">
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                              <span className="text-white text-xs">✓</span>
                            </div>
                            <span className="text-gray-700">Institutional-grade property management</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="text-sm text-blue-800">
                            <strong>Investor-Aligned Approach:</strong> Our fee structure is designed to align FractionaX's success with investor returns, 
                            ensuring professional management while maintaining competitive investor yields.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Investor Returns Breakdown */}
                  {property.tokenization && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-white text-sm font-bold">$</span>
                        </div>
                        Investor Returns Breakdown
                      </h3>
                      
                      {/* Investment Summary Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 text-center">
                          <div className="text-3xl font-bold text-blue-600 mb-2">
                            ${property.tokenization.tokenPrice?.toLocaleString()}
                          </div>
                          <div className="text-sm text-blue-700 font-medium mb-1">Investment per Token</div>
                          <div className="text-xs text-blue-600">
                            Minimum: ${property.tokenization.minimumInvestment?.toLocaleString()}
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 text-center">
                          <div className="text-3xl font-bold text-green-600 mb-2">
                            {property.tokenization.equityYield || property.tokenization.cashOnCashReturn || 0}%
                          </div>
                          <div className="text-sm text-green-700 font-medium mb-1">Annual Cash Yield</div>
                          <div className="text-xs text-green-600">
                            ${(property.tokenization.annualCashFlowPerToken || property.tokenization.netCashFlowPerToken || 0).toFixed(0)}/token/year
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-6 text-center">
                          <div className="text-3xl font-bold text-purple-600 mb-2">
                            {property.tokenization.projectedIRR || property.tokenization.projectedAnnualizedReturn || 0}%
                          </div>
                          <div className="text-sm text-purple-700 font-medium mb-1">Projected IRR</div>
                          <div className="text-xs text-purple-600">
                            {property.tokenization.projectedHoldPeriod || 5}-10 year hold period
                          </div>
                        </div>
                      </div>
                      
                      {/* Detailed Returns Analysis */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Dividend Income Stream */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-2">
                              <span className="text-white text-xs">💰</span>
                            </div>
                            Dividend Income Stream
                          </h4>
                          
                          <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                              <span className="text-gray-700 font-medium">Annual Dividend per Token:</span>
                              <span className="text-green-600 font-bold">
                                ${(property.tokenization.annualCashFlowPerToken || property.tokenization.netCashFlowPerToken * 12 || 0).toFixed(0)}
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                              <span className="text-gray-700 font-medium">
                                {property.tokenization.distributionFrequency === 'monthly' ? 'Monthly' : 'Quarterly'} Distribution:
                              </span>
                              <span className="text-blue-600 font-bold">
                                ${property.tokenization.distributionFrequency === 'monthly' 
                                  ? (property.tokenization.netMonthlyCashFlowPerToken || property.tokenization.monthlyCashFlowPerToken || 0).toFixed(2)
                                  : ((property.tokenization.annualCashFlowPerToken || 0) / 4).toFixed(2)}
                              </span>
                            </div>
                            
                            {/* 5-Year Cumulative Dividends */}
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-700 font-medium">5-Year Total Dividends:</span>
                                <span className="text-gray-900 font-bold">
                                  ${((property.tokenization.annualCashFlowPerToken || property.tokenization.netCashFlowPerToken * 12 || 0) * 5).toFixed(0)}
                                </span>
                              </div>
                              <div className="text-xs text-gray-600">
                                Assuming stable {property.tokenization.equityYield || property.tokenization.cashOnCashReturn || 0}% annual yield
                              </div>
                            </div>
                            
                            {/* 10-Year Dividends (if available) */}
                            {property.tokenization.totalDividends10Year && (
                              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-green-700 font-medium">10-Year Total Dividends:</span>
                                  <span className="text-green-600 font-bold">
                                    ${(property.tokenization.totalDividends10Year / (property.tokenization.totalTokens || 1)).toFixed(0)}/token
                                  </span>
                                </div>
                                <div className="text-xs text-green-600">
                                  Total project dividends: ${property.tokenization.totalDividends10Year?.toLocaleString()}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Exit Strategy & Appreciation */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-2">
                              <span className="text-white text-xs">📈</span>
                            </div>
                            Exit Strategy & Appreciation
                          </h4>
                          
                          <div className="space-y-4">
                            {/* Current Valuation */}
                            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                              <span className="text-gray-700 font-medium">Current Property Value:</span>
                              <span className="text-blue-600 font-bold">
                                ${property.price?.toLocaleString()}
                              </span>
                            </div>
                            
                            {/* Projected Exit Value */}
                            {(property.tokenization.projectedExitPrice || property.tokenization.projectedSalePrice) && (
                              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                                <span className="text-gray-700 font-medium">Projected Exit Value:</span>
                                <span className="text-purple-600 font-bold">
                                  ${(property.tokenization.projectedExitPrice || property.tokenization.projectedSalePrice)?.toLocaleString()}
                                </span>
                              </div>
                            )}
                            
                            {/* Equity at Exit per Token */}
                            {property.tokenization.equityReturnPerToken && (
                              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                <span className="text-gray-700 font-medium">Equity Return per Token:</span>
                                <span className="text-green-600 font-bold">
                                  ${property.tokenization.equityReturnPerToken?.toLocaleString()}
                                </span>
                              </div>
                            )}
                            
                            {/* Total Return Potential */}
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-purple-700 font-medium">Total Return per Token:</span>
                                <span className="text-purple-600 font-bold text-lg">
                                  ${(
                                    property.tokenization.fiveYearTotalReturnPerToken ||
                                    property.tokenization.totalReturnPerToken ||
                                    ((property.tokenization.totalReturn10Year || 0) / (property.tokenization.totalTokens || 1))
                                  )?.toFixed(0)}
                                </span>
                              </div>
                              <div className="text-xs text-purple-600 mb-2">
                                Dividends + Appreciation over {property.tokenization.projectedHoldPeriod || 5}-10 years
                              </div>
                              
                              {/* Equity Multiple */}
                              {property.tokenization.equityMultiple && (
                                <div className="flex justify-between items-center">
                                  <span className="text-purple-600 text-sm">Equity Multiple:</span>
                                  <span className="text-purple-700 font-bold">
                                    {property.tokenization.equityMultiple}x
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {/* Exit Strategy Details */}
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="text-sm text-gray-700 mb-2 font-medium">Exit Strategy Options:</div>
                              <ul className="text-xs text-gray-600 space-y-1">
                                <li>• Property sale to institutional buyer</li>
                                <li>• Refinancing with cash-out to investors</li>
                                <li>• REIT acquisition or portfolio sale</li>
                                {property.leaseDetails?.extensionOptions && (
                                  <li>• Hold through lease extensions for continued income</li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Investment Highlights */}
                      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Investment Highlights</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-start">
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                              <span className="text-white text-xs">✓</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900">Passive Income: </span>
                              <span className="text-gray-700">
                                {property.tokenization.distributionFrequency === 'monthly' ? 'Monthly' : 'Quarterly'} distributions with {property.tokenization.equityYield || property.tokenization.cashOnCashReturn || 0}% annual yield
                              </span>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                              <span className="text-white text-xs">✓</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900">Professional Management: </span>
                              <span className="text-gray-700">Full-service asset management by FractionaX team</span>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                              <span className="text-white text-xs">✓</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900">Liquidity Options: </span>
                              <span className="text-gray-700">Secondary marketplace for token trading (coming soon)</span>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                              <span className="text-white text-xs">✓</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900">Tax Efficiency: </span>
                              <span className="text-gray-700">Real estate depreciation and 1031 exchange eligible</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Interactive Investor Calculator */}
                  {property.tokenization && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                        <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-white text-sm font-bold">📊</span>
                        </div>
                        Investment Calculator
                      </h3>
                      
                      <InvestmentCalculator property={property} />
                    </div>
                  )}
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
                </div>
              </div>
            </div>
          </div>

        {/* Fullscreen Modal */}
        {isFullscreenOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
            <div className="relative max-w-screen-xl max-h-screen mx-4">
              <button
                onClick={closeFullscreen}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              >
                <X className="w-8 h-8" />
              </button>
              
              <img
                src={propertyImages[currentImageIndex]}
                alt={`${property.title} - Photo ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
              
              {propertyImages.length > 1 && (
                <>
                  <button
                    onClick={previousImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                  >
                    <FiChevronLeft className="w-10 h-10" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                  >
                    <FiChevronRight className="w-10 h-10" />
                  </button>
                </>
              )}
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-lg font-medium">
                {currentImageIndex + 1} / {propertyImages.length}
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default PropertyDetailsClean;